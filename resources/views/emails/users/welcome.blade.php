<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        /* ... Reuse your existing CSS styles from previous answers ... */
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 0; border-radius: 8px; margin-top: 30px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #3b82f6; color: #ffffff; padding: 25px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 600; }
        .content { padding: 35px 30px; text-align: center; }
        .welcome-text { font-size: 16px; color: #374151; margin-bottom: 25px; line-height: 1.5; }
        .btn { display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px; margin-top: 10px; }
        .btn:hover { background-color: #2563eb; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to {{ config('app.name') }}!</h1>
        </div>

        <div class="content">
            <div class="welcome-text">
                Hello <strong>{{ $user->name }}</strong>,<br>
                
                @if($resetUrl)
                    Your account has been created by our team. 
                    Please click the button below to set your password and access your account.
                @else
                    Thank you for registering! We are excited to have you on board.
                    Your account is now active.
                @endif
            </div>

            @if($resetUrl)
                <a href="{{ $resetUrl }}" class="btn">Set Your Password</a>
                <p style="font-size: 13px; color: #6b7280; margin-top: 20px;">
                    This link will expire in 24 hours.
                </p>
            @else
                <a href="{{ route('welcome') }}" class="btn">Start Shopping</a>
            @endif
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </div>
    </div>
</body>
</html>