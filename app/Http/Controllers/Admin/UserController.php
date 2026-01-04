<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        $query = User::latest();

        // Search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('email', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        $users = $query->paginate(15)
            ->withQueryString()
            ->through(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at->format('Y-m-d H:i:s'),
            ]);

        return Inertia::render('dashboard/users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
            'userRoles' => config('app.user_roles', ['user', 'admin'])
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        return Inertia::render('dashboard/users/Create', [
            'userRoles' => config('app.user_roles', ['user', 'admin'])
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', Rule::in(config('app.user_roles', ['user', 'admin']))],
            
            // Contact & Address
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100', // Ensure this stores the code (e.g. GR)
            'postal_code' => 'nullable|string|max:20',

            // New Billing Fields
            'company_name' => 'nullable|string|max:255',
            'profession'   => 'nullable|string|max:255',
            'vat_number'   => 'nullable|string|max:50',
            'tax_office'   => 'nullable|string|max:50',
        ]);

        User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role' => $validatedData['role'],
            'phone' => $validatedData['phone'],
            'address' => $validatedData['address'],
            'city' => $validatedData['city'],
            'country' => $validatedData['country'],
            'postal_code' => $validatedData['postal_code'],
            
            // New Billing Fields
            'company_name' => $validatedData['company_name'],
            'profession'   => $validatedData['profession'],
            'vat_number'   => $validatedData['vat_number'],
            'tax_office'   => $validatedData['tax_office'],
        ]);

        return redirect()->route('dashboard.users.index')->with('success', 'User created successfully.');
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        return Inertia::render('dashboard/users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'phone' => $user->phone,
                'address' => $user->address,
                'city' => $user->city,
                'country' => $user->country,
                'postal_code' => $user->postal_code,
                
                // Pass New Billing Fields to Frontend
                'company_name' => $user->company_name,
                'profession'   => $user->profession,
                'vat_number'   => $user->vat_number,
                'tax_office'   => $user->tax_office, // Ensure this matches DB column (was doy/tax_office)

                'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $user->updated_at->format('Y-m-d H:i:s'),
            ],
            'userRoles' => config('app.user_roles', ['user', 'admin'])
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'role' => ['required', Rule::in(config('app.user_roles', ['user', 'admin']))],
            
            // Contact & Address
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',

            // New Billing Fields
            'company_name' => 'nullable|string|max:255',
            'profession'   => 'nullable|string|max:255',
            'vat_number'   => 'nullable|string|max:50',
            'tax_office'   => 'nullable|string|max:50',
        ]);

        // Prevent self-demotion if user is the only admin
        if ($user->id === auth()->id() && $user->role === 'admin' && $validatedData['role'] !== 'admin') {
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount <= 1) {
                return redirect()->back()->withErrors(['role' => 'Cannot change role of the only admin.']);
            }
        }

        $user->name = $validatedData['name'];
        $user->email = $validatedData['email'];
        $user->role = $validatedData['role'];
        $user->phone = $validatedData['phone'];
        $user->address = $validatedData['address'];
        $user->city = $validatedData['city'];
        $user->country = $validatedData['country'];
        $user->postal_code = $validatedData['postal_code'];
        
        // Update New Fields
        $user->company_name = $validatedData['company_name'];
        $user->profession = $validatedData['profession'];
        $user->vat_number = $validatedData['vat_number'];
        $user->tax_office = $validatedData['tax_office'];

        if (!empty($validatedData['password'])) {
            $user->password = Hash::make($validatedData['password']);
        }

        $user->save();

        return redirect()->route('dashboard.users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->route('dashboard.users.index')->with('error', 'You cannot delete your own account.');
        }

        if ($user->role === 'admin') {
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount <= 1) {
                return redirect()->route('dashboard.users.index')->with('error', 'Cannot delete the only admin account.');
            }
        }

        $user->delete();
        return redirect()->route('dashboard.users.index')->with('success', 'User deleted successfully.');
    }
}