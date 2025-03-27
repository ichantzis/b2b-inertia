<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();

        if ($user && $user->role === 'admin') {
            return Inertia::render('Dashboard');
        }

        return redirect()->route('welcome');
    }
}