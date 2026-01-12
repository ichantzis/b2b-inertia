<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public $token;

    /**
     * Create a new notification instance.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // Generate the reset URL
        // We use the 'password.reset' route name which Laravel provides by default
        $url = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        // Take minutes from config
        $minutes = config('auth.passwords.' . config('auth.defaults.passwords') . '.expire');
        // Convert to hours (we use ceil to avoid decimals if it is not an integer)
        $hours = ceil($minutes / 60);

        return (new MailMessage)
            ->subject('Reset Password Notification')
            ->view('emails.auth.reset_password', [
                'url' => $url,
                'count' => $hours // Pass hours to the view
            ]);
    }
}
