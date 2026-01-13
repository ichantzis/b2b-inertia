<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormSubmitted;
use Inertia\Inertia;
use App\Services\SettingsService;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Contact');
    }

    public function store(Request $request, SettingsService $settings)
    {
        // 1. Validate
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone'   => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:2000',
        ]);

        // 2. Send Email
        $adminEmail = $settings->get('admin_notification_email', config('mail.from.address'));
        
        try {
            Mail::to($adminEmail)->send(new ContactFormSubmitted($validated));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'There was an issue sending your message. Please try again later.');
        }

        // 3. Redirect back with success
        return redirect()->back();
    }
}