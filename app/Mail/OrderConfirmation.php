<?php

namespace App\Mail;

use App\Models\Order;
use App\Services\SettingsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    /**
     * Create a new message instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Order Confirmation #' . $this->order->order_number,
        );
    }

    // public function build()
    // {
    //     return $this->subject('Order Confirmation #' . $this->order->order_number)
    //                 ->view('emails.orders.confirmation');
    // }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        // 1. Fetch the setting (using the app helper to resolve the service)
        $settings = app(\App\Services\SettingsService::class);
        $supportEmail = $settings->get('admin_notification_email', config('mail.from.address'));

        return new Content(
            view: 'emails.orders.confirmation',

            // 2. Pass the data to the view here
            with: [
                'supportEmail' => $supportEmail,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
