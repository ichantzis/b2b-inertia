<!DOCTYPE html>
<html>
<head>
    <title>New Order Received</title>
</head>
<body style="font-family: Arial, sans-serif;">
    <h2>New B2B Order Received</h2>
    <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
    <p><strong>Order Items:</strong> {{ count($order->items) }}</p>
    <p><strong>Customer:</strong> {{ $order->billing_first_name }} {{ $order->billing_last_name }}</p>
    <p><strong>Company:</strong> {{ $order->invoice_company_name }}</p>
    <p><strong>Total Amount:</strong> €{{ number_format($order->total_amount, 2) }}</p>
    <p><strong>Payment Method:</strong> {{ ucfirst(str_replace('_', ' ', $order->payment_method)) }}</p>
    
    <h3>Items:</h3>
    <ul>
        @foreach($order->items as $item)
            <li>
                {{ $item->quantity }}x - {{ $item->artwork_title }} (SKU: {{ $item->artwork_id }}) - Type: {{ $item->type }} | Frame: {{ $item->frame }} | Size: {{ $item->size }} = €{{ number_format($item->price, 2)* $item->quantity }}
            </li>
        @endforeach
    </ul>

    <p><a href="{{ route('dashboard.orders.show', $order->id) }}">View Order in Admin Panel</a></p>
</body>
</html>