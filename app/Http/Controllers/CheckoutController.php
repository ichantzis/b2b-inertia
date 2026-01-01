<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewOrderAdminNotification;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Http\Controllers\CartController;

class CheckoutController extends Controller
{

    public function index()
    {
        $cartController = app(CartController::class);
        $cart = $cartController->getCurrentCart(false);

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->withErrors(['cart' => 'Your cart is empty.']);
        }

        $cartTotal = $cartController->calculateCartTotal($cart);
        $cartItemsData = $cart->items->map(function ($item) {
            return [
                'id' => $item->id,
                'artwork_id' => $item->artwork_id,
                'type' => $item->type,
                'frame' => $item->frame,
                'size' => $item->size,
                'quantity' => $item->quantity,
                'artwork_data' => $item->artwork_data,
            ];
        })->all();

        return Inertia::render('Checkout', [
            'cartItems' => $cartItemsData,
            'cartTotal' => $cartTotal,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        // --- Validation Rules ---
        $validationRules = [
            // Billing Info
            'billingInfo.firstName' => 'required|string|max:255',
            'billingInfo.lastName' => 'required|string|max:255',
            'billingInfo.email' => 'required|email|max:255',
            'billingInfo.country' => 'required|string|size:2',
            'billingInfo.streetAddress' => 'required|string|max:255',
            'billingInfo.city' => 'required|string|max:255',
            'billingInfo.stateOrCounty' => 'nullable|string|max:255',
            'billingInfo.postalCode' => 'required|string|max:20',
            'billingInfo.phone' => 'nullable|string|max:30',

            // Invoice Details (conditionally required if wantsInvoice is true)
            'wantsInvoice' => 'required|boolean',
            'invoiceDetails.companyName' => 'required_if:wantsInvoice,true|nullable|string|max:255',
            'invoiceDetails.vatNumber' => 'required_if:wantsInvoice,true|nullable|string|max:50', // Adjust max as needed
            'invoiceDetails.profession' => 'required_if:wantsInvoice,true|nullable|string|max:255',
            'invoiceDetails.taxOffice' => 'nullable|string|max:255', // Optional

            'shippingIsDifferent' => 'required|boolean',

            // Shipping Info (conditionally required)
            'shippingInfo.firstName' => 'required_if:shippingIsDifferent,true|nullable|string|max:255',
            'shippingInfo.lastName' => 'required_if:shippingIsDifferent,true|nullable|string|max:255',
            'shippingInfo.email' => 'required_if:shippingIsDifferent,true|nullable|email|max:255', // Optional for shipping
            'shippingInfo.country' => 'required_if:shippingIsDifferent,true|nullable|string|size:2',
            'shippingInfo.streetAddress' => 'required_if:shippingIsDifferent,true|nullable|string|max:255',
            'shippingInfo.city' => 'required_if:shippingIsDifferent,true|nullable|string|max:255',
            'shippingInfo.stateOrCounty' => 'nullable|string|max:255',
            'shippingInfo.postalCode' => 'required_if:shippingIsDifferent,true|nullable|string|max:20',
            'shippingInfo.phone' => 'nullable|string|max:30',

            // Order Details
            'items' => 'required|array|min:1',
            'items.*.artwork_id' => 'required|string|max:50',
            'items.*.type' => 'required|string|max:20',
            'items.*.frame' => 'required|string|max:20',
            'items.*.size' => 'required|string|max:10',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.artwork_data.price' => 'required|numeric|min:0',
            'items.*.artwork_data.img_thumb' => 'nullable|string|url',
            'items.*.artwork_data.title' => 'nullable|string',
            'totalAmount' => 'required|numeric|min:0',
            // 'paymentMethod' => 'required|string|in:stripe,cod,bank_transfer', // Removed stripe for now
            'paymentMethod' => 'required|string|in:cod,bank_transfer',
            'notes' => 'nullable|string|max:1000', // Max length for notes
        ];

        $validatedData = $request->validate($validationRules);

        try {
            DB::beginTransaction();

            $billing = $validatedData['billingInfo'];
            // Determine shipping details
            $shipping = $validatedData['shippingIsDifferent'] ? $validatedData['shippingInfo'] : $billing;
            $invoice = $validatedData['wantsInvoice'] ? $validatedData['invoiceDetails'] : null;

            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'ORD-' . strtoupper(uniqid()), // Make it uppercase
                'total_amount' => $validatedData['totalAmount'],
                'status' => 'pending', // Or 'processing' depending on payment method

                'billing_first_name' => $billing['firstName'],
                'billing_last_name' => $billing['lastName'],
                'billing_email' => $billing['email'],
                'billing_address' => $billing['streetAddress'],
                'billing_city' => $billing['city'],
                'billing_state_or_county' => $billing['stateOrCounty'] ?? null,
                'billing_country' => $billing['country'],
                'billing_postal_code' => $billing['postalCode'],
                'billing_phone' => $billing['phone'] ?? null,

                'wants_invoice' => $validatedData['wantsInvoice'],
                'invoice_company_name' => $invoice['companyName'] ?? null,
                'invoice_vat_number' => $invoice['vatNumber'] ?? null,
                'invoice_tax_office' => $invoice['taxOffice'] ?? null,
                'invoice_profession' => $invoice['profession'] ?? null,

                'shipping_is_different' => $validatedData['shippingIsDifferent'],

                'shipping_first_name' => $shipping['firstName'],
                'shipping_last_name' => $shipping['lastName'],
                'shipping_email' => $shipping['email'] ?? $billing['email'], // Default to billing email if shipping email not provided
                'shipping_address' => $shipping['streetAddress'],
                'shipping_city' => $shipping['city'],
                'shipping_state_or_county' => $shipping['stateOrCounty'] ?? null,
                'shipping_country' => $shipping['country'],
                'shipping_postal_code' => $shipping['postalCode'],
                'shipping_phone' => $shipping['phone'] ?? $billing['phone'] ?? null, // Default to billing phone

                'payment_method' => $validatedData['paymentMethod'],
                'payment_status' => 'pending', // Update this after payment processing
                'notes' => $validatedData['notes'] ?? null,
            ]);

            foreach ($validatedData['items'] as $itemData) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'artwork_id' => $itemData['artwork_id'],
                    'artwork_title' => $itemData['artwork_data']['title'] ?? 'Artwork',
                    'type' => $itemData['type'],
                    'frame' => $itemData['frame'],
                    'size' => $itemData['size'],
                    'price' => $itemData['artwork_data']['price'],
                    'quantity' => $itemData['quantity'],
                    'artwork_data' => $itemData['artwork_data'],
                    
                ]);
            }

            app(CartController::class)->clearCart();
            DB::commit();

            // SEND ADMIN NOTIFICATION
            try {
                // Replace with your actual admin email or use config('mail.from.address')
                Mail::to('chantzis84@gmail.com')->send(new NewOrderAdminNotification($order));
            } catch (\Exception $e) {
                Log::error("Failed to send admin order notification: " . $e->getMessage());
                // Don't fail the order just because email failed
            }

            return Inertia::location(route('checkout.complete', ['orderId' => $order->id]));
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            // Validation errors are automatically handled by Inertia by returning them.
            // No need to catch specifically unless you want to do something extra.
            throw $e; // Re-throw to let Laravel/Inertia handle it
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed: ' . $e->getMessage(), ['exception' => $e]);
            // It's better to redirect back with a general error if not a validation exception
            return redirect()->route('checkout.index')->with('error', 'There was an issue placing your order. Please try again.');
            // Or if you want to re-render the checkout page with a top-level error prop:
            // return Inertia::render('Checkout', array_merge($request->all(), ['checkoutError' => 'Order creation failed. Please try again.']));
        }
    }


    public function complete($orderId)
    {
        $order = Order::with('items')->find($orderId);

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
