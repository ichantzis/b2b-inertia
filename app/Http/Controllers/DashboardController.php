<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $now = Carbon::now();

        // --- 1. Current Quarter Revenue Calculation ---
        $currentQuarterStart = $now->copy()->startOfQuarter();
        $currentQuarterEnd = $now->copy()->endOfQuarter();

        $revenue = Order::whereBetween('created_at', [$currentQuarterStart, $currentQuarterEnd])
            ->sum('total_amount');

        // --- 2. Previous Quarter Revenue Calculation (for comparison) ---
        $previousQuarterStart = $now->copy()->subQuarter()->startOfQuarter();
        $previousQuarterEnd = $now->copy()->subQuarter()->endOfQuarter();

        $previousRevenue = Order::whereBetween('created_at', [$previousQuarterStart, $previousQuarterEnd])
            ->sum('total_amount');

        // --- 3. Calculate Percentage Change (QoQ) ---
        $revenueChange = 0;
        if ($previousRevenue > 0) {
            $revenueChange = (($revenue - $previousRevenue) / $previousRevenue) * 100;
        } elseif ($revenue > 0) {
            // If there was no revenue in the previous quarter but there is now, growth is 100%
            $revenueChange = 100;
        }

        // Create a label to identify the current quarter (e.g., "Q1 2026")
        $quarterLabel = 'Q' . $now->quarter . ' ' . $now->year;

        // --- 4. Basic Stats ---
        $orderCount = Order::count();
        // Exclude admins from customer count if necessary
        $customerCount = User::where('role', '!=', 'admin')->count();
        
        // Calculate Average Order Value (AOV) based on the current quarter revenue or total revenue
        // Here we use the total historical revenue for a general AOV, or you can use $revenue for quarterly AOV
        $totalHistoricalRevenue = Order::sum('total_amount');
        $averageOrderValue = $orderCount > 0 ? $totalHistoricalRevenue / $orderCount : 0;

        // --- 5. Top Selling Frames (Color/Type) ---
        $topFrames = OrderItem::select('frame', DB::raw('SUM(quantity) as total_sold'))
            ->whereNotNull('frame')
            ->where('frame', '!=', 'No Frame') // Optional: exclude "No Frame" if desired
            ->groupBy('frame')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get();

        // --- 6. Top Selling Sizes ---
        $topSizes = OrderItem::select('size', DB::raw('SUM(quantity) as total_sold'))
            ->whereNotNull('size')
            ->groupBy('size')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get();

        // --- 7. Sales Chart Data (Last 30 Days) ---
        $salesData = Order::select(
            DB::raw('DATE(created_at) as date'), 
            DB::raw('SUM(total_amount) as total')
        )
        ->where('created_at', '>=', now()->subDays(30))
        ->whereIn('status', ['completed', 'shipped', 'delivered'])
        ->groupBy('date')
        ->orderBy('date')
        ->get();

        // --- 8. Recent Orders ---
        $recentOrdersForDashboard = Order::with('customer')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('dashboard/Dashboard', [
            'orderCount' => $orderCount,
            
            // Revenue Props
            'revenue' => $revenue, // This is now Current Quarter Revenue
            'revenueChange' => round($revenueChange, 1),
            'quarterLabel' => $quarterLabel,
            
            'customerCount' => $customerCount,
            'newOrders' => Order::where('created_at', '>=', now()->subWeek())->count(),
            'newCustomers' => User::where('created_at', '>=', now()->subWeek())->count(),
            'averageOrderValue' => $averageOrderValue,
            
            // Top Selling Props
            'topFrames' => $topFrames,
            'topSizes' => $topSizes,
            
            // Chart Data
            'salesChartData' => $salesData,
            
            // Recent Orders Formatted
            'recentOrders' => $recentOrdersForDashboard->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer ? ($order->customer->name ?: ($order->billing_first_name . ' ' . $order->billing_last_name)) : ($order->billing_first_name . ' ' . $order->billing_last_name),
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'created_at' => $order->created_at->format('Y-m-d H:i'),
                ];
            }),
        ]);
    }
}