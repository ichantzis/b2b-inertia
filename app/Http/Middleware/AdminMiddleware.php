<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is authenticated and is an admin
        // Uses the isAdmin() method from your User.php model
        if (Auth::check() && Auth::user()->isAdmin()) {
            return $next($request);
        }

        // If not an admin, redirect to the welcome route with an error message.
        // You can change 'welcome' to 'login' or any other route.
        return redirect()->route('welcome')->with('error', 'You do not have permission to access this page.');
    }
}