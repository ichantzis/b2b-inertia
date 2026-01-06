<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeUser extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $resetUrl; // Optional: Only used if Admin created the account

    public function __construct(User $user, ?string $resetUrl = null)
    {
        $this->user = $user;
        $this->resetUrl = $resetUrl;
    }

    public function envelope(): Envelope
    {
        // Change subject dynamically based on the flow
        $subject = $this->resetUrl 
            ? 'Set your password for ' . config('app.name') 
            : 'Welcome to ' . config('app.name');

        return new Envelope(
            subject: $subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.users.welcome',
        );
    }
}