<?php

namespace App\Mail;

use App\Models\PriceAlarm;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MedicationPriceDrop extends Mailable
{
    use Queueable, SerializesModels;

    public $alarm;
    public $oldPrice;
    public $newPrice;
    public $pharmacyName;
    public $pharmacyAddress;

    /**
     * Create a new message instance.
     */
    public function __construct(PriceAlarm $alarm, $oldPrice, $newPrice, $pharmacyName, $pharmacyAddress)
    {
        $this->alarm = $alarm;
        $this->oldPrice = $oldPrice;
        $this->newPrice = $newPrice;
        $this->pharmacyName = $pharmacyName;
        $this->pharmacyAddress = $pharmacyAddress;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Price Drop Alert: ' . $this->alarm->medication_name,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.medication_price_drop',
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
