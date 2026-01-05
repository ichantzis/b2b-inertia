<?php

namespace App\Http\Controllers\Admin; // Note the Admin namespace

use App\Http\Controllers\Controller; // Base Controller
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Carbon\Carbon; // For date filtering

// For exports (you'll need to install these packages)
use Maatwebsite\Excel\Facades\Excel; // For Excel
use App\Exports\OrdersExport; // We'll create this custom export class
use Barryvdh\DomPDF\Facade\Pdf; // For PDF (using barryvdh/laravel-dompdf)
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders.
     */
    public function index(Request $request)
    {
        // 1. Capture Sort Parameters (Default to 'created_at' descending)
        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');

        // 2. Security: Whitelist allowed columns to prevent SQL errors
        $allowedSorts = ['id', 'order_number', 'total_amount', 'status', 'payment_status', 'created_at'];

        if (!in_array($sortField, $allowedSorts)) {
            $sortField = 'created_at';
        }

        // 3. Start Query (Removed 'latest()')
        $query = Order::with('customer');

        // 4. Apply Dynamic Sorting
        $query->orderBy($sortField, $sortDirection);

        // 5. Date Range Filtering (Existing Logic)
        if ($request->filled('start_date') && $request->filled('end_date')) {
            try {
                $startDate = Carbon::parse($request->input('start_date'))->startOfDay();
                $endDate = Carbon::parse($request->input('end_date'))->endOfDay();
                $query->whereBetween('created_at', [$startDate, $endDate]);
            } catch (\Exception $e) {
                // Handle invalid date format
            }
        }

        $orders = $query->paginate(15)
            ->withQueryString()
            ->through(fn($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer ? $order->customer->name : ($order->billing_first_name . ' ' . $order->billing_last_name),
                'customer_email' => $order->customer ? $order->customer->email : $order->billing_email,
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                'print_on_material_value' => $order->total_amount * 0.15,
            ]);

        return Inertia::render('dashboard/orders/Index', [
            'orders' => $orders,
            // 6. Pass 'sort' and 'direction' back to Vue so the arrows highlight correctly
            'filters' => $request->only(['start_date', 'end_date', 'sort', 'direction']),
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order) // Renamed from showOrder to show
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
                'coupon_code' => $order->coupon_code,
                'discount_amount' => $order->discount_amount,
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
    public function update(Request $request, Order $order) // Renamed from updateOrder to update
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

    /**
     * Export orders to a specified format.
     */
    public function exportOrders(Request $request)
    {
        $validatedData = $request->validate([
            'format' => ['required', Rule::in(['xlsx', 'pdf'])],
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d|after_or_equal:start_date',
        ]);

        $format = $validatedData['format'];
        $fileName = 'orders_export_' . now()->format('Ymd_His') . '.' . $format;

        $startDate = $request->filled('start_date') ? Carbon::parse($validatedData['start_date'])->startOfDay() : null;
        $endDate = $request->filled('end_date') ? Carbon::parse($validatedData['end_date'])->endOfDay() : null;

        // for Excel export app/Exports/OrdersExport.php is used
        if ($format === 'xlsx') {
            return Excel::download(new OrdersExport($startDate, $endDate), $fileName);
        }

        // for PDF export we use this logic and the /resources/views/exports/orders_pdf.blade.php view
        if ($format === 'pdf') {
            $query = Order::with('items')->latest();
            if ($startDate) {
                $query->where('created_at', '>=', $startDate);
            }
            if ($endDate) {
                $query->where('created_at', '<=', $endDate);
            }
            $ordersData = $query->get();

            $totalAmountSum = 0;
            $totalPrintOnMaterialSum = 0;

            $mappedOrders = $ordersData->map(function ($order) use (&$totalAmountSum, &$totalPrintOnMaterialSum) {
                $printOnMaterial = $order->total_amount * 0.15;
                $totalAmountSum += $order->total_amount;
                $totalPrintOnMaterialSum += $printOnMaterial;

                $itemsString = $order->items->map(function ($item) {
                    // Format currency for each item's price for PDF consistency
                    $formattedPrice = number_format($item->price, 2, ',', '.');
                    return "{$item->quantity}x {$item->artwork_title} (Type: {$item->type}, Frame: {$item->frame}, Size: {$item->size}) @ {$formattedPrice} €";
                })->implode("<br>"); // Use <br> for HTML line breaks in PDF

                return [
                    'order_number' => $order->order_number,
                    'order_items_html' => $itemsString, // Items as HTML string
                    'created_at' => $order->created_at->format('Y-m-d H:i'),
                    'status' => ucfirst($order->status),
                    'payment_status' => ucfirst($order->payment_status),
                    'total_amount' => (float) $order->total_amount,
                    'print_on_material_value' => (float) $printOnMaterial,
                ];
            });

            $totals = [
                'total_orders' => $mappedOrders->count(),
                'total_amount_sum' => $totalAmountSum,
                'total_print_on_material_sum' => $totalPrintOnMaterialSum,
            ];

            // Pass data to a Blade view for PDF rendering
            $pdf = Pdf::loadView('exports.orders_pdf', [
                'orders' => $mappedOrders,
                'totals' => $totals,
                'filter_start_date' => $startDate ? $startDate->format('Y-m-d') : null,
                'filter_end_date' => $endDate ? $endDate->format('Y-m-d') : null,
            ]);

            // Optional: Set paper size and orientation
            // $pdf->setPaper('a4', 'landscape');

            return $pdf->download($fileName);
        }

        // Should not reach here if validation is correct
        return redirect()->back()->withErrors(['format' => 'Invalid export format requested.']);
    }
}
