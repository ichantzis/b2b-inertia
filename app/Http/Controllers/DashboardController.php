<?php

namespace App\Http\Controllers;

use App\Models\Order; // Make sure Order model is imported
use App\Models\User;  // If you need user info for orders
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Keep for main dashboard __invoke if still used
use Inertia\Inertia;
use Illuminate\Validation\Rule; // For status updates

class DashboardController extends Controller
{
    // Existing __invoke method for the main dashboard page
    public function __invoke(Request $request)
    {
        $user = Auth::user(); // This is fine if it's for the main dashboard content

        // For the main dashboard, you already fetch recentOrders.
        // We can enhance this or keep it separate from the full order list.
        $orderCount = Order::count();
        $totalRevenue = Order::whereIn('status', ['completed', 'shipped', 'delivered'])->sum('total_amount');
        $customerCount = User::count(); // Or filter by role if you have customer roles
        $recentOrdersForDashboard = Order::with('customer') // Eager load customer if displaying name
            ->latest()
            ->take(5) // Or a different number for the main dashboard
            ->get();

        return Inertia::render('dashboard/Dashboard', [
            'orderCount' => $orderCount,
            'revenue' => $totalRevenue,
            'customerCount' => $customerCount,
            'recentOrders' => $recentOrdersForDashboard->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer ? ($order->customer->name ?: ($order->billing_first_name . ' ' . $order->billing_last_name)) : ($order->billing_first_name . ' ' . $order->billing_last_name),
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'created_at' => $order->created_at->format('Y-m-d H:i'), // Format date
                ];
            }),
            // Add other stats like newOrders, revenueChange etc. by fetching relevant data
            'newOrders' => Order::where('created_at', '>=', now()->subWeek())->count(), // Example
            'revenueChange' => 0, // Placeholder, calculate actual change
            'newCustomers' => User::where('created_at', '>=', now()->subWeek())->count(), // Example
            'unreadComments' => 0, // Placeholder
            'respondedComments' => 0, // Placeholder
        ]);
    }
    
}
