<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Order;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();

        if ($user && $user->role === 'admin') {
            $recentOrders = Order::latest()->take(10)->get(); // Fetch 10 latest orders
            return Inertia::render('Dashboard', [
                'recentOrders' => $recentOrders, // Pass orders to the component
            ]);
        }

        return redirect()->route('welcome');
    }
}