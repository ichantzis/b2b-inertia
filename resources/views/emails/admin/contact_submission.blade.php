<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            padding: 0;
            border-radius: 8px;
            margin-top: 30px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .header {
            background-color: #be123c;
            /* Matching the Rose/Red from access_request */
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
        }

        .content {
            padding: 30px;
        }

        .alert-box {
            background-color: #fff1f2;
            border: 1px solid #fecdd3;
            color: #9f1239;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 25px;
            text-align: center;
            font-size: 16px;
            font-weight: 500;
        }

        .info-grid {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 25px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #f3f4f6;
            padding-bottom: 10px;
        }

        .label {
            font-size: 13px;
            text-transform: uppercase;
            color: #9ca3af;
            letter-spacing: 0.5px;
            font-weight: 600;
        }

        .value {
            font-size: 15px;
            color: #1f2937;
            font-weight: 500;
            text-align: right;
        }

        .message-box {
            background-color: #f9fafb;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            margin-top: 10px;
            color: #4b5563;
            font-style: italic;
            white-space: pre-line; /* Preserves line breaks from textarea */
        }

        .btn-container {
            text-align: center;
            margin-top: 30px;
        }

        .btn {
            display: inline-block;
            background-color: #be123c;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            font-size: 14px;
        }

        .btn:hover {
            background-color: #9f1239;
        }

        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>New Contact Inquiry</h1>
        </div>

        <div class="content">
            <div class="alert-box">
                You have received a new message via the website contact form.
            </div>

            <div class="info-grid">
                <div class="info-row">
                    <span class="label">Name</span>
                    <span class="value">{{ $data['name'] ?? 'N/A' }}</span>
                </div>

                <div class="info-row">
                    <span class="label">Email</span>
                    <span class="value">
                        <a href="mailto:{{ $data['email'] ?? '' }}" style="color: #be123c; text-decoration: none;">
                            {{ $data['email'] ?? 'N/A' }}
                        </a>
                    </span>
                </div>

                @if(!empty($data['phone']))
                <div class="info-row">
                    <span class="label">Phone</span>
                    <span class="value">{{ $data['phone'] }}</span>
                </div>
                @endif

                @if(!empty($data['subject']))
                <div class="info-row">
                    <span class="label">Subject</span>
                    <span class="value">{{ $data['subject'] }}</span>
                </div>
                @endif
            </div>

            @if(!empty($data['message']))
            <div>
                <span class="label">Message Content:</span>
                <div class="message-box">
                    {!! nl2br(e($data['message'])) !!}
                </div>
            </div>
            @endif

            <div class="btn-container">
                <a href="mailto:{{ $data['email'] ?? '' }}?subject=RE: {{ $data['subject'] ?? 'Inquiry' }}" class="btn">
                    Reply via Email
                </a>
            </div>
        </div>

        <div class="footer">
            Time: {{ now()->format('Y-m-d H:i:s') }}
        </div>
    </div>
</body>

</html>