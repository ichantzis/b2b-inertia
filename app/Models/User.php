<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'pricing_tier_id',
        'phone',
        'address',
        'city',
        'country',
        'postal_code',
        // Company/B2B fields
        'company_name',
        'vat_number',
        'tax_office',
        'profession',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // Ο χρήστης ανήκει σε μία βαθμίδα τιμολόγησης
    public function pricingTier()
    {
        return $this->belongsTo(PricingTier::class);
    }

    // Ένα χρήσιμο Accessor για να παίρνεις την έκπτωση απευθείας (π.χ. $user->active_discount)
    public function getActiveDiscountAttribute()
    {
        return $this->pricingTier ? $this->pricingTier->discount_percentage : 0;
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new \App\Notifications\ResetPasswordNotification($token));
    }
}
