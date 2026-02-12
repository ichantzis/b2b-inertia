<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Coupon;
use App\Services\SettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewOrderAdminNotification;
use App\Mail\OrderConfirmation;
use Inertia\Inertia;
use App\Http\Controllers\CartController;

class CheckoutController extends Controller
{
    // ... index method remains the same ...
    public function index()
    {
        $user = Auth::user();
        $cartController = app(CartController::class);
        $cart = $cartController->getCurrentCart(false);

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->withErrors(['cart' => 'Your cart is empty.']);
        }

        $cartTotal = $cartController->calculateCartTotal($cart);
        // We pass data to view, but we won't rely on it coming back in the request
        $cartItemsData = $cart->items->map(function ($item) {
            return [
                'id' => $item->id,
                'artwork_id' => $item->artwork_id,
                'type' => $item->type,
                'print_type' => $item->print_type ?? 'mono',
                'frame' => $item->frame,
                'size' => $item->size,
                'quantity' => $item->quantity,
                'artwork_data' => $item->artwork_data,
            ];
        })->all();

        return Inertia::render('Checkout', [
            'user' => $user,
            'cartItems' => $cartItemsData,
            'cartTotal' => $cartTotal,
        ]);
    }

    public function store(Request $request, SettingsService $settings)
    {
        $user = Auth::user();

        // 1. GET CART FROM DB (Source of Truth)
        // We do not rely on $request->items because it might be missing data or manipulated.
        $cartController = app(CartController::class);
        $cart = $cartController->getCurrentCart(false);

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        // Recalculate Subtotal from DB to ensure accuracy
        $dbSubtotal = $cartController->calculateCartTotal($cart);

        // --- Validation Rules (Removed 'items' validation since we use DB) ---
        $validationRules = [
            'billingInfo.firstName' => 'required|string|max:255',
            'billingInfo.lastName' => 'required|string|max:255',
            'billingInfo.email' => 'required|email|max:255',
            'billingInfo.country' => 'required|string|size:2',
            'billingInfo.streetAddress' => 'required|string|max:255',
            'billingInfo.city' => 'required|string|max:255',
            'billingInfo.stateOrCounty' => 'nullable|string|max:255',
            'billingInfo.postalCode' => 'required|string|max:20',
            'billingInfo.phone' => 'nullable|string|max:30',

            'wantsInvoice' => 'required|boolean',
            'invoiceDetails.companyName' => 'required_if:wantsInvoice,true|nullable|string|max:255',
            'invoiceDetails.vatNumber' => 'required_if:wantsInvoice,true|nullable|string|max:50',
            'invoiceDetails.profession' => 'required_if:wantsInvoice,true|nullable|string|max:255',
            'invoiceDetails.taxOffice' => 'nullable|string|max:255',

            'shippingIsDifferent' => 'required|boolean',

            'shippingInfo.firstName' => 'required_if:shippingIsDifferent,true|nullable|string|max:255',
            'shippingInfo.lastName' => 'required_if:shippingIsDifferent,true|nullable|string|max:255',
            'shippingInfo.email' => 'required_if:shippingIsDifferent,true|nullable|email|max:255',
            'shippingInfo.country' => 'required_if:shippingIsDifferent,true|nullable|string|size:2',
            'shippingInfo.streetAddress' => 'required_if:shippingIsDifferent,true|nullable|string|max:255',
            'shippingInfo.city' => 'required_if:shippingIsDifferent,true|nullable|string|max:255',
            'shippingInfo.stateOrCounty' => 'nullable|string|max:255',
            'shippingInfo.postalCode' => 'required_if:shippingIsDifferent,true|nullable|string|max:20',
            'shippingInfo.phone' => 'nullable|string|max:30',

            'paymentMethod' => 'required|string|in:cod,bank_transfer',
            'notes' => 'nullable|string|max:1000',
            'coupon_code' => 'nullable|exists:coupons,code',
        ];

        $validatedData = $request->validate($validationRules);

        try {
            DB::beginTransaction();

            $billing = $validatedData['billingInfo'];
            $shipping = $validatedData['shippingIsDifferent'] ? $validatedData['shippingInfo'] : $billing;
            $invoice = $validatedData['wantsInvoice'] ? ($validatedData['invoiceDetails'] ?? []) : [];

            // --- COUPON LOGIC (Applied to DB Subtotal) ---
            $discountAmount = 0;
            $couponCode = null;

            if (!empty($validatedData['coupon_code'])) {
                $coupon = Coupon::where('code', $validatedData['coupon_code'])->first();

                if ($coupon && $coupon->isValid()) {
                    $couponCode = $coupon->code;
                    
                    if ($coupon->type === 'fixed') {
                        $discountAmount = $coupon->value;
                    } else {
                        $discountAmount = ($dbSubtotal * $coupon->value) / 100;
                    }
                    $coupon->increment('used_count');
                }
            }

            $finalTotal = max(0, $dbSubtotal - $discountAmount);

            // --- UPDATE USER PROFILE ---
            if ($user) {
                $userUpdates = [
                    'address'     => $billing['streetAddress'],
                    'city'        => $billing['city'],
                    'postal_code' => $billing['postalCode'],
                    'country'     => $billing['country'],
                    'phone'       => $billing['phone'],
                ];
                if ($validatedData['wantsInvoice'] && !empty($invoice)) {
                    $userUpdates['company_name'] = $invoice['companyName'] ?? null;
                    $userUpdates['vat_number']   = $invoice['vatNumber'] ?? null;
                    $userUpdates['tax_office']   = $invoice['taxOffice'] ?? null;
                    $userUpdates['profession']   = $invoice['profession'] ?? null;
                }
                $user->update($userUpdates);
            }

            // --- CREATE ORDER ---
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'ORD-TEMP-' . uniqid(),
                'total_amount' => $finalTotal,
                'status' => 'pending',
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
                'shipping_email' => $shipping['email'] ?? $billing['email'],
                'shipping_address' => $shipping['streetAddress'],
                'shipping_city' => $shipping['city'],
                'shipping_state_or_county' => $shipping['stateOrCounty'] ?? null,
                'shipping_country' => $shipping['country'],
                'shipping_postal_code' => $shipping['postalCode'],
                'shipping_phone' => $shipping['phone'] ?? $billing['phone'] ?? null,
                'payment_method' => $validatedData['paymentMethod'],
                'payment_status' => 'pending',
                'notes' => $validatedData['notes'] ?? null,
                'coupon_code' => $couponCode,
                'discount_amount' => $discountAmount,
            ]);

            $order->update([
                'order_number' => 'ORD-' . str_pad($order->id, 5, '0', STR_PAD_LEFT)
            ]);

            // --- CREATE ITEMS FROM DB CART (Not Request) ---
            foreach ($cart->items as $cartItem) {
                // $cartItem->artwork_data is already a JSON array from your DB
                // so accessing ['title'] and ['price'] is safe and accurate.
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'artwork_id' => $cartItem->artwork_id,
                    // Use the title stored in the Cart DB
                    'artwork_title' => $cartItem->artwork_data['title'] ?? 'Artwork', 
                    'type' => $cartItem->type,
                    'print_type' => $cartItem->print_type ?? 'mono',
                    'frame' => $cartItem->frame,
                    'size' => $cartItem->size,
                    'price' => $cartItem->artwork_data['price'] ?? 0,
                    'quantity' => $cartItem->quantity,
                    // Pass the full JSON structure (including img_thumb) from Cart DB
                    'artwork_data' => $cartItem->artwork_data, 
                ]);
            }

            $cartController->clearCart();
            DB::commit();

            // ... Notifications (keep as is) ...
             try {
                $adminEmail = $settings->get('admin_notification_email', config('mail.from.address'));
                if ($adminEmail) {
                    Mail::to($adminEmail)->send(new NewOrderAdminNotification($order));
                }
            } catch (\Exception $e) {
                Log::error("Failed to send admin notification: " . $e->getMessage());
            }

            try {
                Mail::to($order->billing_email)->send(new OrderConfirmation($order));
            } catch (\Exception $e) {
                Log::error("Failed to send customer confirmation: " . $e->getMessage());
            }

            return Inertia::location(route('checkout.complete', $order));

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed: ' . $e->getMessage(), ['exception' => $e]);
            return redirect()->route('checkout.index')->with('error', 'There was an issue placing your order.');
        }
    }

    // ... complete, validateCoupon ...
    public function complete(Request $request, Order $order)
    {
        if ($request->user() && $request->user()->id !== $order->user_id) {
            abort(403);
        }
        return Inertia::render('CheckoutComplete', [
            'order' => $order->load('items'), 
        ]);
    }

    public function validateCoupon(Request $request)
    {
        $request->validate(['code' => 'required|string']);
        $coupon = Coupon::where('code', $request->code)->first();
        if (!$coupon || !$coupon->isValid()) {
            return response()->json(['message' => 'Invalid or expired coupon.'], 422);
        }
        return response()->json([
            'code' => $coupon->code,
            'type' => $coupon->type,
            'value' => $coupon->value,
            'message' => 'Coupon applied successfully!'
        ]);
    }
}