<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Http\Controllers\CartController;

class CheckoutController extends Controller
{

    public function index()
    {
        // You might want to pass some data to the checkout page, like cart items
        // But since the cart is already checked in the route, we can proceed directly
        $cart = app(CartController::class)->getCurrentCart(false);
        // Get current cart, DON'T create if it doesn't exist for viewing
        // Recalculate total based on potentially merged/updated items
        $cartTotal = $cart ? app(CartController::class)->calculateCartTotal($cart) : 0;

        // Prepare items data for Inertia, ensuring artwork_data is included
        $cartItemsData = $cart ? $cart->items->map(function ($item) {
            // Ensure artwork_data is properly cast and included
            return [
                'id' => $item->id,
                'artwork_id' => $item->artwork_id,
                'type' => $item->type,
                'frame' => $item->frame,
                'size' => $item->size,
                'quantity' => $item->quantity,
                'artwork_data' => $item->artwork_data, // artwork_data should be cast to array in the model
            ];
        })->all() : [];
        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->withErrors(['cart' => 'Your cart is empty.']);
        }
        return Inertia::render('Checkout', [
            'cartItems' => $cartItemsData, // Pass the prepared data
            'cartTotal' => $cartTotal, // Pass the calculated total
        ]);
    }


    public function store(Request $request)
    {
        $user = Auth::user();
        // 1. Validate the incoming data
        $validatedData = $request->validate([
            'shippingInfo.firstName' => 'required|string|max:255',
            'shippingInfo.lastName' => 'required|string|max:255',
            'shippingInfo.email' => 'required|email|max:255',
            'shippingInfo.country' => 'required|string|size:2', // Adjust size as needed
            'shippingInfo.streetAddress' => 'required|string|max:255',
            'shippingInfo.city' => 'required|string|max:255',
            'shippingInfo.stateOrCounty' => 'nullable|string|max:255',
            'shippingInfo.postalCode' => 'required|string|max:20',
            'shippingInfo.phone' => 'nullable|string|max:20',
            'shippingInfo.notes' => 'nullable|string',
            'items' => 'required|array',
            'items.*.artwork_id' => 'required|string|max:50',
            'items.*.type' => 'required|string|max:20',
            'items.*.frame' => 'required|string|max:20',
            'items.*.size' => 'required|string|max:10',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.artwork_data.price' => 'required|numeric|min:0',
            'items.*.artwork_data.img_thumb' => 'nullable|string|url',
            'items.*.artwork_data.title' => 'nullable|string',
            'totalAmount' => 'required|numeric|min:0',
            'paymentMethod' => 'required|string|in:stripe,cod,bank_transfer',
            'notes' => 'nullable|string',
        ]);

        try {
            // 2. Begin a database transaction for atomicity
            DB::beginTransaction();

            // 3. Create the Order
            $order = Order::create([
                'user_id' => $user?->id, // If user is logged in
                'order_number' => 'ORD-' . uniqid(), // Generate a unique order number
                'total_amount' => $validatedData['totalAmount'],
                'status' => 'pending', // Initial status
                'shipping_address' => $validatedData['shippingInfo']['streetAddress'],
                'shipping_city' => $validatedData['shippingInfo']['city'],
                'shipping_country' => $validatedData['shippingInfo']['country'],
                'shipping_postal_code' => $validatedData['shippingInfo']['postalCode'],
                'payment_method' => $validatedData['paymentMethod'],
                'payment_status' => 'pending', // Initially pending
                'notes' => $validatedData['notes'] ?? null,
            ]);

            // 4. Create the OrderItems
            foreach ($validatedData['items'] as $itemData) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'artwork_id' => $itemData['artwork_id'],
                    'artwork_title' => $itemData['artwork_data']['title'],
                    'price' => $itemData['artwork_data']['price'],
                    'quantity' => $itemData['quantity'],
                    'artwork_data' => $itemData['artwork_data'], // Store all artwork data
                ]);
            }

            // 5. Clear the cart
            app(CartController::class)->clearCart();

            // 6. Commit the transaction
            DB::commit();

            // 7. Return a success response
            return Inertia::location(route('checkout.complete', ['orderId' => $order->id]));
        } catch (\Exception $e) {
            // 8. If any error occurs, rollback the transaction
            DB::rollBack();

            // 9. Log the error
            Log::error('Error creating order: ' . $e->getMessage());

            // 10. Return an error response
            return Inertia::render('Checkout', ['error' => 'Order creation failed']);
        }
    }

    public function complete($orderId)
    {
        $order = Order::find($orderId);

        if (!$order) {
            // Handle the case where the order doesn't exist (e.g., show an error)
            abort(404, 'Order not found');
        }

        return Inertia::render('CheckoutComplete', [
            'order' => $order,
        ]);
    }

    // Implement your cart clearing logic here
    // protected function clearCart() { ... }
}
