<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 0; border-radius: 8px; margin-top: 30px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        
        .header { background-color: #be123c; color: #ffffff; padding: 25px; text-align: center; } /* Rose color for alerts/actions */
        .header h1 { margin: 0; font-size: 22px; font-weight: 600; }
        
        .content { padding: 35px 30px; text-align: center; }
        .text { font-size: 16px; color: #374151; margin-bottom: 25px; line-height: 1.5; }
        
        .btn { display: inline-block; background-color: #be123c; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px; margin-top: 10px; }
        .btn:hover { background-color: #9f1239; }
        
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
        .sub-text { font-size: 12px; color: #6b7280; margin-top: 25px; border-top: 1px solid #eee; padding-top: 20px; word-break: break-all; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reset Password Request</h1>
        </div>

        <div class="content">
            <div class="text">
                Hello,<br><br>
                You are receiving this email because we received a password reset request for your account.
            </div>

            <a href="{{ $url }}" class="btn">Reset Password</a>

            <div class="text" style="margin-top: 25px;">
                This password reset link will expire in {{ $count }} hours.
                <br><br>
                If you did not request a password reset, no further action is required.
            </div>

            <div class="sub-text">
                If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:<br>
                <a href="{{ $url }}" style="color: #be123c;">{{ $url }}</a>
            </div>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </div>
    </div>
</body>
</html>