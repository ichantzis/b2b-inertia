<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use Illuminate\Support\Facades\Log;

class AccountController extends Controller
{
    public function orders(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('items')
            ->latest()
            ->paginate(10)
            ->through(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number, // Adjust if you use a separate column
                    'status' => $order->status,
                    'total_formatted' => number_format($order->total_amount, 2) . ' €',
                    'date' => $order->created_at->format('d M Y'),
                    'item_count' => $order->items->count(),
                    'coupon_code' => $order->coupon_code ?? null,
                    'discount_amount' => $order->discount_amount ?? 0,
                    'preview_items' => $order->items->take(3)->map(function ($item) {
                        return [
                            'title' => $item->artwork_title ?? 'Artwork',
                            // Handle thumbnail path or fallback
                            'thumb' => $item->artwork_data['img_thumb'] ?? '/images/placeholder.jpg'
                        ];
                    })
                ];
            });

        return Inertia::render('account/Orders', [
            'orders' => $orders
        ]);
    }

    public function show(Request $request, Order $order)
    {
        // 1. Authorization: Ensure user owns this order
        if ($request->user()->id !== $order->user_id) {
            abort(403, 'Unauthorized action.');
        }

        // 2. Load relationships
        $order->load('items');

        // 3. Prepare data for view
        return Inertia::render('account/OrderDetails', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number ?? $order->id,
                'status' => $order->status,
                'created_at' => $order->created_at->format('d M Y, H:i'),
                'payment_method' => $order->payment_method ?? 'Credit Card', // Example field
                'payment_status' => $order->payment_status ?? 'Pending', // Example field'
                'notes' => $order->notes ?? '',

                // Financials
                'subtotal' => $order->subtotal ?? $order->items->sum('total'), // Fallback if column missing
                'shipping_cost' => $order->shipping_cost ?? 0,
                'vat' => $order->vat ?? 0,
                'total' => $order->total_amount,

                // Addresses (Assuming JSON columns 'billing_address'/'shipping_address' or relationships)
                'billing_first_name' => $order->billing_first_name,
                'billing_last_name' => $order->billing_last_name,
                'billing_address' => $order->billing_address,
                'billing_city' => $order->billing_city,
                'billing_state_or_county' => $order->billing_state_or_county,
                'billing_postal_code' => $order->billing_postal_code,
                'billing_country' => $order->billing_country,
                'billing_email' => $order->billing_email,
                'billing_phone' => $order->billing_phone,
                'shipping_first_name' => $order->shipping_first_name,
                'shipping_last_name' => $order->shipping_last_name,
                'shipping_address' => $order->shipping_address,
                'shipping_city' => $order->shipping_city,
                'shipping_state_or_county' => $order->shipping_state_or_county,
                'shipping_postal_code' => $order->shipping_postal_code,
                'shipping_country' => $order->shipping_country,
                'shipping_phone' => $order->shipping_phone,
                'shipping_email' => $order->shipping_email,
                'coupon_code' => $order->coupon_code ?? null,
                'discount_amount' => $order->discount_amount ?? 0,
                'wants_invoice' => $order->wants_invoice,
                'invoice_company_name' => $order->invoice_company_name,
                'invoice_vat_number' => $order->invoice_vat_number,
                'invoice_tax_office' => $order->invoice_tax_office,
                'invoice_profession' => $order->invoice_profession,

                // Items
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'title' => $item->artwork_title ?? 'Artwork',
                        'subtitle' => $item->description ?? "{$item->size} • {$item->frame}", // e.g. "50x70 • Black Frame"
                        'quantity' => $item->quantity,
                        'type' => $item->type,
                        'size' => $item->size,
                        'frame' => $item->frame,
                        'price' => $item->price,
                        'total' => $item->total,
                        'img_thumb' => $item->artwork_data['img_thumb'] ?? '/images/placeholder.jpg',
                    ];
                }),
            ]
        ]);
    }

    public function addresses(Request $request)
    {
        // For B2B, the main profile info usually acts as the billing address
        return Inertia::render('account/Addresses', [
            'user' => $request->user(),
        ]);
    }
}
