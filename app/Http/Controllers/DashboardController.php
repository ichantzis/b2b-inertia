<?php

namespace App\Http\Controllers;

use App\Models\Order; // Make sure Order model is imported
use App\Models\User;  // If you need user info for orders
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Keep for main dashboard __invoke if still used
use Inertia\Inertia;
use Illuminate\Validation\Rule; // For status updates

class DashboardController extends Controller
{
    // Existing __invoke method for the main dashboard page
    public function __invoke(Request $request)
    {
        $user = Auth::user(); // This is fine if it's for the main dashboard content

        // For the main dashboard, you already fetch recentOrders.
        // We can enhance this or keep it separate from the full order list.
        $orderCount = Order::count();
        $totalRevenue = Order::whereIn('status', ['completed', 'shipped', 'delivered'])->sum('total_amount');
        $customerCount = User::count(); // Or filter by role if you have customer roles
        $recentOrdersForDashboard = Order::with('customer') // Eager load customer if displaying name
            ->latest()
            ->take(5) // Or a different number for the main dashboard
            ->get();

        return Inertia::render('dashboard/Dashboard', [
            'orderCount' => $orderCount,
            'revenue' => $totalRevenue,
            'customerCount' => $customerCount,
            'recentOrders' => $recentOrdersForDashboard->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer ? ($order->customer->name ?: ($order->billing_first_name . ' ' . $order->billing_last_name)) : ($order->billing_first_name . ' ' . $order->billing_last_name),
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'created_at' => $order->created_at->format('Y-m-d H:i'), // Format date
                ];
            }),
            // Add other stats like newOrders, revenueChange etc. by fetching relevant data
            'newOrders' => Order::where('created_at', '>=', now()->subWeek())->count(), // Example
            'revenueChange' => 0, // Placeholder, calculate actual change
            'newCustomers' => User::where('created_at', '>=', now()->subWeek())->count(), // Example
            'unreadComments' => 0, // Placeholder
            'respondedComments' => 0, // Placeholder
        ]);
    }

    /**
     * Display a listing of all orders.
     */
    public function listOrders(Request $request)
    {
        $orders = Order::with('customer') // Eager load customer info (user model)
            ->latest() // Show newest first
            ->paginate(15) // Paginate results
            ->through(fn($order) => [ // Transform data for the view
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer ? $order->customer->name : ($order->billing_first_name . ' ' . $order->billing_last_name),
                'customer_email' => $order->customer ? $order->customer->email : $order->billing_email,
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                // Add any other fields you want to display in the list
            ]);

        return Inertia::render('dashboard/orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display the specified order for viewing and editing.
     */
    public function showOrder(Order $order) // Route model binding
    {
        $order->load('items', 'customer'); // Eager load items and customer

        return Inertia::render('dashboard/orders/Show', [ // Or Show.vue if editing is a separate step
            'order' => [ // Transform the main order object
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'billing_first_name' => $order->billing_first_name,
                'billing_last_name' => $order->billing_last_name,
                'billing_email' => $order->billing_email,
                'billing_address' => $order->billing_address,
                'billing_city' => $order->billing_city,
                'billing_state_or_county' => $order->billing_state_or_county,
                'billing_country' => $order->billing_country,
                'billing_postal_code' => $order->billing_postal_code,
                'billing_phone' => $order->billing_phone,
                'wants_invoice' => $order->wants_invoice,
                'invoice_company_name' => $order->invoice_company_name,
                'invoice_vat_number' => $order->invoice_vat_number,
                'invoice_tax_office' => $order->invoice_tax_office,
                'invoice_profession' => $order->invoice_profession,
                'shipping_is_different' => $order->shipping_is_different,
                'shipping_first_name' => $order->shipping_first_name,
                'shipping_last_name' => $order->shipping_last_name,
                'shipping_email' => $order->shipping_email,
                'shipping_address' => $order->shipping_address,
                'shipping_city' => $order->shipping_city,
                'shipping_state_or_county' => $order->shipping_state_or_county,
                'shipping_country' => $order->shipping_country,
                'shipping_postal_code' => $order->shipping_postal_code,
                'shipping_phone' => $order->shipping_phone,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'transaction_id' => $order->transaction_id,
                'notes' => $order->notes,
                'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $order->updated_at->format('Y-m-d H:i:s'),
                'customer' => $order->customer ? [ // Basic customer info
                    'id' => $order->customer->id,
                    'name' => $order->customer->name,
                    'email' => $order->customer->email,
                ] : null,
                'items' => $order->items->map(fn($item) => [ // Transform order items
                    'id' => $item->id,
                    'artwork_id' => $item->artwork_id,
                    'artwork_title' => $item->artwork_title,
                    'type' => $item->type,
                    'frame' => $item->frame,
                    'size' => $item->size,
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                    'artwork_data' => $item->artwork_data, // Contains img_thumb etc.
                ]),
            ]
        ]);
    }

    /**
     * Update the specified order in storage.
     */
    public function updateOrder(Request $request, Order $order)
    {
        // Define which fields are editable and their validation rules
        // 'sometimes' means the field is only validated if present in the request.
        // 'nullable' means it can be present but empty.
        // 'required' means it must be present and not empty.
        // Use 'required_if' for conditional requirements.

        $validatedData = $request->validate([
            'status' => ['required', Rule::in(['pending', 'processing', 'shipped', 'completed', 'delivered', 'cancelled', 'refunded'])],
            'payment_status' => ['required', Rule::in(['pending', 'paid', 'failed', 'refunded'])],
            'notes' => 'nullable|string|max:1000',
            'transaction_id' => 'nullable|string|max:255',

            // Billing Information - use 'sometimes' if you only want to update if sent
            'billing_first_name' => 'sometimes|required|string|max:255',
            'billing_last_name' => 'sometimes|required|string|max:255',
            'billing_email' => 'sometimes|required|email|max:255',
            'billing_address' => 'sometimes|required|string|max:255',
            'billing_city' => 'sometimes|required|string|max:255',
            'billing_state_or_county' => 'nullable|string|max:255', // Already nullable in DB
            'billing_country' => 'sometimes|required|string|max:50', // Or size:2 if using codes
            'billing_postal_code' => 'sometimes|required|string|max:20',
            'billing_phone' => 'nullable|string|max:30',

            // Invoice Details
            'wants_invoice' => 'sometimes|required|boolean',
            'invoice_company_name' => 'required_if:wants_invoice,true|nullable|string|max:255',
            'invoice_vat_number' => 'required_if:wants_invoice,true|nullable|string|max:50',
            'invoice_tax_office' => 'nullable|string|max:255',
            'invoice_profession' => 'required_if:wants_invoice,true|nullable|string|max:255',

            // Shipping Information
            'shipping_is_different' => 'sometimes|required|boolean',
            // If shipping_is_different is true, these become conditionally required.
            // If shipping_is_different is false, these fields might not be sent by the form if they are copied from billing.
            // However, your form sends all fields, so 'sometimes' is still appropriate if admin doesn't touch a section.
            'shipping_first_name' => 'sometimes|required_if:shipping_is_different,true|nullable|string|max:255',
            'shipping_last_name' => 'sometimes|required_if:shipping_is_different,true|nullable|string|max:255',
            'shipping_email' => 'nullable|email|max:255', // Shipping email can be optional
            'shipping_address' => 'sometimes|required_if:shipping_is_different,true|nullable|string|max:255',
            'shipping_city' => 'sometimes|required_if:shipping_is_different,true|nullable|string|max:255',
            'shipping_state_or_county' => 'nullable|string|max:255',
            'shipping_country' => 'sometimes|required_if:shipping_is_different,true|nullable|string|max:50',
            'shipping_postal_code' => 'sometimes|required_if:shipping_is_different,true|nullable|string|max:20',
            'shipping_phone' => 'nullable|string|max:30',
        ]);

        // If shipping_is_different is false, copy billing to shipping before update
        // unless shipping fields were explicitly submitted (which 'sometimes' allows for partial updates).
        // The Vue form should ideally send all relevant shipping fields even if copied.
        // A simpler approach here is to rely on the Vue form to send the complete, correct data.

        // If `shipping_is_different` is submitted as false, we should ensure
        // that the shipping fields in $validatedData are populated from billing fields
        // if they were not explicitly sent for shipping.
        // However, your Vue form (`orderForm`) submits all these fields.
        if (array_key_exists('shipping_is_different', $validatedData) && !$validatedData['shipping_is_different']) {
            $validatedData['shipping_first_name'] = $validatedData['billing_first_name'] ?? $order->billing_first_name;
            $validatedData['shipping_last_name'] = $validatedData['billing_last_name'] ?? $order->billing_last_name;
            $validatedData['shipping_email'] = $validatedData['billing_email'] ?? $order->billing_email; // Or keep specific shipping email
            $validatedData['shipping_address'] = $validatedData['billing_address'] ?? $order->billing_address;
            $validatedData['shipping_city'] = $validatedData['billing_city'] ?? $order->billing_city;
            $validatedData['shipping_state_or_county'] = $validatedData['billing_state_or_county'] ?? $order->billing_state_or_county;
            $validatedData['shipping_country'] = $validatedData['billing_country'] ?? $order->billing_country;
            $validatedData['shipping_postal_code'] = $validatedData['billing_postal_code'] ?? $order->billing_postal_code;
            $validatedData['shipping_phone'] = $validatedData['billing_phone'] ?? $order->billing_phone;
        }

        // If wants_invoice is false, ensure invoice fields are nulled out
        if (array_key_exists('wants_invoice', $validatedData) && !$validatedData['wants_invoice']) {
            $validatedData['invoice_company_name'] = null;
            $validatedData['invoice_vat_number'] = null;
            $validatedData['invoice_tax_office'] = null;
            $validatedData['invoice_profession'] = null;
        }

        $order->update($validatedData);

        return redirect()->route('dashboard.orders.show', $order->id)->with('success', 'Order updated successfully.');
    }
}
