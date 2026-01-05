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
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Http\Controllers\CartController;

class CheckoutController extends Controller
{

    public function index()
    {
        $user = Auth::user();
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
            'user' => $user,
            'cartItems' => $cartItemsData,
            'cartTotal' => $cartTotal,
        ]);
    }

    public function store(Request $request, SettingsService $settings)
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
            'invoiceDetails.vatNumber' => 'required_if:wantsInvoice,true|nullable|string|max:50',
            'invoiceDetails.profession' => 'required_if:wantsInvoice,true|nullable|string|max:255',
            'invoiceDetails.taxOffice' => 'nullable|string|max:255',

            'shippingIsDifferent' => 'required|boolean',

            // Shipping Info (conditionally required)
            'shippingInfo.firstName' => 'required_if:shippingIsDifferent,true|nullable|string|max:255',
            'shippingInfo.lastName' => 'required_if:shippingIsDifferent,true|nullable|string|max:255',
            'shippingInfo.email' => 'required_if:shippingIsDifferent,true|nullable|email|max:255',
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
            'paymentMethod' => 'required|string|in:cod,bank_transfer',
            'notes' => 'nullable|string|max:1000',
        ];

        // Add coupon_code to validation
        $validationRules['coupon_code'] = 'nullable|exists:coupons,code';

        $validatedData = $request->validate($validationRules);

        try {
            DB::beginTransaction();

            $billing = $validatedData['billingInfo'];
            $shipping = $validatedData['shippingIsDifferent'] ? $validatedData['shippingInfo'] : $billing;
            // FIX: If they don't want an invoice, force this to an empty array [].
            // This ensures we don't save data, and prevents PHP errors when accessing keys later.
            $invoice = $validatedData['wantsInvoice'] ? ($validatedData['invoiceDetails'] ?? []) : [];

            // --- COUPON LOGIC START ---
            $discountAmount = 0;
            $couponCode = null;

            if (!empty($validatedData['coupon_code'])) {
                $coupon = \App\Models\Coupon::where('code', $validatedData['coupon_code'])->first();

                if ($coupon && $coupon->isValid()) {
                    $couponCode = $coupon->code;
                    $subtotal = $validatedData['totalAmount']; // Be careful: ensure this is the raw subtotal from frontend or recalculate from items

                    if ($coupon->type === 'fixed') {
                        $discountAmount = $coupon->value;
                    } else {
                        $discountAmount = ($subtotal * $coupon->value) / 100;
                    }

                    // Increment usage
                    $coupon->increment('used_count');
                }
            }
            Log::info("Discount amount calculated: $discountAmount");

            // Recalculate Final Total
            // Ensure total doesn't go below 0
            $finalTotal = max(0, $validatedData['totalAmount'] - $discountAmount);
            Log::info("Final total after coupon applied: $finalTotal");
            // --- COUPON LOGIC END ---

            // ---------------------------------------------------------
            // 1. UPDATE USER PROFILE LOGIC (New Addition)
            // ---------------------------------------------------------
            if ($user) {
                $userUpdates = [
                    // Always update generic contact info from Billing
                    'address'     => $billing['streetAddress'],
                    'city'        => $billing['city'],
                    'postal_code' => $billing['postalCode'],
                    'country'     => $billing['country'],
                    'phone'       => $billing['phone'],
                ];

                // This check still works because an empty array [] is "falsey" in PHP
                if ($validatedData['wantsInvoice'] && !empty($invoice)) {
                    $userUpdates['company_name'] = $invoice['companyName'] ?? null;
                    $userUpdates['vat_number']   = $invoice['vatNumber'] ?? null;
                    $userUpdates['tax_office']   = $invoice['taxOffice'] ?? null;
                    $userUpdates['profession']   = $invoice['profession'] ?? null;
                }

                $user->update($userUpdates);
            }
            // ---------------------------------------------------------

            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'ORD-' . strtoupper(uniqid()),
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
                $adminEmail = $settings->get('admin_notification_email', config('mail.from.address'));

                if ($adminEmail) {
                    Mail::to($adminEmail)->send(new NewOrderAdminNotification($order));
                } else {
                    Log::warning('No admin email configured in settings.');
                }
            } catch (\Exception $e) {
                Log::error("Failed to send admin order notification: " . $e->getMessage());
            }

            return Inertia::location(route('checkout.complete', $order));
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed: ' . $e->getMessage(), ['exception' => $e]);
            return redirect()->route('checkout.index')->with('error', 'There was an issue placing your order. Please try again.');
        }
    }


    public function complete(Request $request, Order $order)
    {
        // Security check: Ensure the order actually belongs to the user
        // (Or checking session ID if it's a guest checkout)
        if ($request->user() && $request->user()->id !== $order->user_id) {
            abort(403);
        }

        // Now you have the full $order object loaded
        return Inertia::render('CheckoutComplete', [
            'order' => $order->load('items'), // Load items if needed for display
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

    // Implement your cart clearing logic here
    // protected function clearCart() { ... }
}
