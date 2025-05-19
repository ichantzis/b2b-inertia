<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Orders Export</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            /* Or Helvetica, Arial - Ensure font supports your characters */
            font-size: 10px;
            margin: 0;
            padding: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header h1 {
            margin: 0;
            font-size: 18px;
        }

        .header p {
            margin: 5px 0;
            font-size: 12px;
        }

        .totals-table {
            margin-top: 30px;
            width: 50%;
            /* Or adjust as needed */
            float: right;
        }

        .totals-table td {
            font-weight: bold;
        }

        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 8px;
            color: #777;
        }

        .currency:before {
            content: "€";
            /* Or your currency symbol */
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Orders Report</h1>
        @if($filter_start_date && $filter_end_date)
        <p>Date Range: {{ $filter_start_date }} to {{ $filter_end_date }}</p>
        @elseif($filter_start_date)
        <p>From Date: {{ $filter_start_date }}</p>
        @elseif($filter_end_date)
        <p>To Date: {{ $filter_end_date }}</p>
        @else
        <p>All Orders</p>
        @endif
        <p>Generated on: {{ now()->format('Y-m-d H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Order #</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Payment Status</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Print on Material (15%)</th>
                {{-- <th>Notes</th> --}}
            </tr>
        </thead>
        <tbody>
            @forelse($orders as $order)
            <tr>
                <td>{{ $order['order_number'] }}</td>
                <td>{{ $order['created_at'] }}</td>
                <td>{{ $order['status'] }}</td>
                <td>{{ $order['payment_status'] }}</td>
                <td class="items-cell">{!! $order['order_items_html'] !!}</td>
                <td>€{{ number_format($order['total_amount'], 2, ',', '.') }}</td>
                <td>€{{ number_format($order['print_on_material_value'], 2, ',', '.') }}</td>
                {{-- <td>{{ $order['notes'] }}</td> --}}
            </tr>
            @empty
            <tr>
                <td colspan="7" style="text-align: center;">No orders found.</td>
            </tr>
            @endforelse
        </tbody>
        @if(count($orders) > 0)
        <tfoot>
            <tr>
                <th colspan="5" style="text-align: right;">Totals:</th> 
                <th>€{{ number_format($totals['total_amount_sum'], 2, ',', '.') }}</th>
                <th>€{{ number_format($totals['total_print_on_material_sum'], 2, ',', '.') }}</th>
            </tr>
            <tr>
                <th colspan="5" style="text-align: right;">Total Orders:</th> 
                <th colspan="2" style="text-align: left;">{{ $totals['total_orders'] }}</th>
            </tr>
        </tfoot>
        @endif
    </table>

    {{-- <div class="footer">
        Page <span class="pagenum"></span>
    </div> --}}
</body>

</html>