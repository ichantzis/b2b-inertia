<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\AccessRequestNotification;
use App\Services\SettingsService;

class AccessRequestController extends Controller
{
    public function store(Request $request, SettingsService $settings)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'vat_number' => 'required|string|max:50',
            'country' => 'required|string|max:2',
            'email' => 'required|email',
            'phone' => 'required|string|max:50',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'message' => 'nullable|string'
        ]);

        $adminEmail = $settings->get('admin_notification_email', config('mail.from.address'));

        Mail::to($adminEmail)->send(new AccessRequestNotification($validated));

        return back()->with('status', 'Your request has been sent. We will contact you shortly.');
    }
}