<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// Auth facade is no longer needed here for role checking
use Inertia\Inertia;
use App\Models\Order; // Make sure you have an Order model if you use it

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        // The 'admin' middleware has already verified the user's role.
        // If the code reaches this point, the user is an admin.

        $recentOrders = Order::latest()->take(10)->get(); // Example: Fetch recent orders
        return Inertia::render('Dashboard', [
            'recentOrders' => $recentOrders,
        ]);

        // The redirect logic previously here is no longer needed as
        // the middleware handles unauthorized access.
    }
}