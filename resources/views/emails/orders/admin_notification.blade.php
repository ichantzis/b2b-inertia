<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 0; border-radius: 8px; margin-top: 30px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        
        .header { background-color: #2c3e50; color: #ffffff; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
        
        .content { padding: 30px; }
        
        .alert-box { background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 15px; border-radius: 6px; margin-bottom: 25px; text-align: center; font-size: 16px; font-weight: 500; }
        
        .info-grid { display: flex; margin-bottom: 25px; }
        .info-col { flex: 1; }
        .label { font-size: 11px; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.5px; margin-bottom: 4px; }
        .value { font-size: 15px; color: #1f2937; font-weight: 500; }

        /* Styles for Address & Invoice Sections */
        .details-section { margin-bottom: 25px; padding-top: 15px; border-top: 1px solid #f3f4f6; }
        .address-table { width: 100%; border-collapse: collapse; border: none; margin: 0; }
        .address-td { width: 50%; vertical-align: top; border: none; padding: 0; }
        .address-text { font-size: 13px; line-height: 1.5; color: #374151; }
        
        .invoice-box { margin-bottom: 25px; background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; }
        .invoice-table td { padding: 3px 0; border: none; font-size: 13px; vertical-align: top; }
        .invoice-label { color: #6b7280; width: 110px; }
        .invoice-val { font-weight: 600; color: #1f2937; }

        /* Items Table */
        .items-table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; }
        .items-table th { text-align: left; padding: 12px 10px; background: #f9fafb; color: #6b7280; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; }
        .items-table td { padding: 12px 10px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; vertical-align: top; }
        
        .totals { margin-top: 20px; text-align: right; }
        .totals-row { margin-bottom: 5px; color: #6b7280; font-size: 14px; }
        .totals-row.final { font-size: 18px; font-weight: bold; color: #111827; margin-top: 10px; }
        .discount { color: #16a34a; }

        .btn-container { text-align: center; margin-top: 30px; }
        .btn { display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; }
        .btn:hover { background-color: #2563eb; }

        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Order Received</h1>
        </div>

        <div class="content">
            <div class="alert-box">
                Order #{{ $order->order_number }} for {{ number_format($order->total_amount, 2) }} €
            </div>

            <div class="info-grid">
                <div class="info-col">
                    <div class="label">Customer</div>
                    <div class="value">{{ $order->billing_first_name }} {{ $order->billing_last_name }}</div>
                </div>
                <div class="info-col">
                    <div class="label">Payment Method</div>
                    <div class="value">
                        {{ $order->payment_method === 'cod' ? 'Cash on Delivery' : 'Bank Transfer' }}
                    </div>
                </div>
                <div class="info-col">
                    <div class="label">Date</div>
                    <div class="value">{{ $order->created_at->format('d M Y, H:i') }}</div>
                </div>
            </div>

            <div class="details-section">
                <table class="address-table">
                    <tr>
                        <td class="address-td" style="padding-right: 15px;">
                            <div class="label">Billing Address</div>
                            <div class="address-text">
                                <strong>{{ $order->billing_first_name }} {{ $order->billing_last_name }}</strong><br>
                                {{ $order->billing_address }}<br>
                                {{ $order->billing_city }}
                                @if(!empty($order->billing_state_or_county))
                                    , {{ $order->billing_state_or_county }}
                                @endif
                                , {{ $order->billing_postal_code }}<br>
                                {{ $order->billing_country }}<br>
                                <div style="margin-top: 5px; color: #6b7280;">
                                    {{ $order->billing_email }}<br>
                                    {{ $order->billing_phone }}
                                </div>
                            </div>
                        </td>
                        <td class="address-td" style="padding-left: 15px;">
                            <div class="label">
                                {{ $order->shipping_is_different ? 'Shipping Address' : 'Shipping (Same as Billing)' }}
                            </div>
                            @if($order->shipping_is_different)
                            <div class="address-text">
                                <strong>{{ $order->shipping_first_name }} {{ $order->shipping_last_name }}</strong><br>
                                {{ $order->shipping_address }}<br>
                                {{ $order->shipping_city }}
                                @if(!empty($order->shipping_state_or_county))
                                    , {{ $order->shipping_state_or_county }}
                                @endif
                                , {{ $order->shipping_postal_code }}<br>
                                {{ $order->shipping_country }}<br>
                                @if($order->shipping_phone)
                                <div style="margin-top: 5px; color: #6b7280;">
                                    {{ $order->shipping_phone }}
                                </div>
                                @endif
                            </div>
                            @endif
                        </td>
                    </tr>
                </table>
            </div>

            @if($order->wants_invoice)
            <div class="invoice-box">
                <div class="label" style="margin-bottom: 8px;">Invoice Details</div>
                <table class="invoice-table" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                    <tr>
                        <td class="invoice-label">Company:</td>
                        <td class="invoice-val">{{ $order->invoice_company_name }}</td>
                    </tr>
                    <tr>
                        <td class="invoice-label">VAT Number:</td>
                        <td class="invoice-val">{{ $order->invoice_vat_number }}</td>
                    </tr>
                    <tr>
                        <td class="invoice-label">Tax Office:</td>
                        <td class="invoice-val">{{ $order->invoice_tax_office }}</td>
                    </tr>
                    <tr>
                        <td class="invoice-label">Profession:</td>
                        <td class="invoice-val">{{ $order->invoice_profession }}</td>
                    </tr>
                </table>
            </div>
            @endif

            @if($order->notes)
            <div style="margin-bottom: 25px; padding: 15px; border: 1px dashed #e5e7eb; border-radius: 6px; background-color: #ffffff;">
                <div class="label">Order Notes</div>
                <div style="font-size: 13px; font-style: italic; color: #4b5563;">
                    "{{ $order->notes }}"
                </div>
            </div>
            @endif

            <table class="items-table">
                <thead>
                    <tr>
                        <th width="55%">Item</th>
                        <th width="15%">Qty</th>
                        <th width="30%" style="text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($order->items as $item)
                    <tr>
                        <td>
                            <strong>{{ $item->artwork_title }}</strong><br>
                            <span style="font-size: 12px; color: #6b7280;">
                                {{ ucfirst($item->type) }} | {{ $item->size }}
                                @if($item->frame && $item->frame !== 'noframe') | {{ ucfirst($item->frame) }} @endif
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

            <div class="btn-container">
                <a href="{{ route('dashboard.orders.show', $order->id) }}" class="btn">View Order in Dashboard</a>
            </div>
        </div>

        <div class="footer">
            This is an automated notification from your store.<br>
            Time: {{ now()->format('Y-m-d H:i:s') }}
        </div>
    </div>
</body>
</html>