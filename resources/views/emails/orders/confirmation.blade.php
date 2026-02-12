<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f6f6f6;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }

        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }

        .logo {
            max-height: 60px;
            width: auto;
            margin-bottom: 15px;
        }

        .order-info {
            margin-top: 20px;
            margin-bottom: 20px;
        }

        .order-info h2 {
            color: #333;
            margin: 0;
        }

        .order-info p {
            color: #666;
            font-size: 14px;
            margin: 5px 0 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th {
            text-align: left;
            padding: 10px;
            background: #f8f9fa;
            color: #555;
            font-size: 12px;
            text-transform: uppercase;
        }

        td {
            padding: 10px;
            border-bottom: 1px solid #eee;
            font-size: 14px;
            color: #333;
            vertical-align: top;
        }

        .totals {
            margin-top: 20px;
            text-align: right;
        }

        .totals-row {
            margin-bottom: 5px;
            color: #666;
            font-size: 14px;
        }

        .totals-row.final {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-top: 10px;
        }

        .discount {
            color: #16a34a;
        }

        /* Green */

        .addresses {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
        }

        .address-block {
            width: 48%;
            font-size: 14px;
            color: #555;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 6px;
            box-sizing: border-box;
        }

        .address-block h3 {
            margin-top: 0;
            font-size: 16px;
            color: #333;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="{{ asset('images/Pinakothiki-Logo-Header.png') }}" alt="Pinakothiki" class="logo">
            <h1>Thank you for your order!</h1>
            <p>We'll contact you soon for further payment details.</p>
        </div>

        <div class="order-info">
            <h2>Order #{{ $order->order_number }}</h2>
            <p>Placed on {{ $order->created_at->format('M d, Y') }}</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th width="60%">Item</th>
                    <th width="10%">Qty</th>
                    <th width="30%" style="text-align: right;">Price</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>
                        <strong>{{ $item->artwork_title }}</strong><br>
                        <span style="font-size: 12px; color: #777;">
                            {{ ucfirst($item->type) }} | {{ $item->size }} | @if($item->frame && $item->frame !== 'noframe') | {{ ucfirst($item->frame) }} @endif
                            @if($item->type === 'canvas')
                            <br>Print: {{ $item->print_type === 'oil' ? 'Oil Print' : 'Mono Print' }}
                            @endif
                        </span>
                    </td>
                    <td>{{ $item->quantity }}</td>
                    <td style="text-align: right;">{{ number_format($item->price, 2) }} €</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals">
            <div class="totals-row">
                Subtotal: {{ number_format($order->total_amount + $order->discount_amount, 2) }} €
            </div>

            @if($order->discount_amount > 0)
            <div class="totals-row discount">
                Discount ({{ $order->coupon_code }}): -{{ number_format($order->discount_amount, 2) }} €
            </div>
            @endif

            <div class="totals-row final">
                Total: {{ number_format($order->total_amount, 2) }} €
            </div>
        </div>

        <table style="margin-top: 30px; border: none;">
            <tr>
                <td style="border: none; padding: 0; width: 50%; padding-right: 10px;">
                    <div class="address-block">
                        <h3>Billing Address</h3>
                        {{ $order->billing_first_name }} {{ $order->billing_last_name }}<br>
                        {{ $order->billing_address }}<br>
                        {{ $order->billing_city }}, {{ $order->billing_postal_code }}<br>
                        {{ $order->billing_country }}<br>
                        {{ $order->billing_email }}
                    </div>
                </td>
                <td style="border: none; padding: 0; width: 50%; padding-left: 10px;">
                    <div class="address-block">
                        <h3>Shipping Address</h3>
                        {{ $order->shipping_first_name }} {{ $order->shipping_last_name }}<br>
                        {{ $order->shipping_address }}<br>
                        {{ $order->shipping_city }}, {{ $order->shipping_postal_code }}<br>
                        {{ $order->shipping_country }}
                    </div>
                </td>
            </tr>
        </table>

        <div class="footer">
            <p>Do not reply to this email</p>
            <p>
                If you have any questions, contact us at
                <a href="mailto:{{ $supportEmail }}" style="color: #3b82f6; text-decoration: none;">
                    {{ $supportEmail }}
                </a>
            </p>
        </div>
    </div>
</body>

</html>