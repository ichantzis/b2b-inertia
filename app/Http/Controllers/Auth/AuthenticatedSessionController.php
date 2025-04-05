<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\CartController; // Import CartController
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Cart; // Import Cart model
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session; // Import Session facade
use Illuminate\Support\Facades\Log; // Import Log facade
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    protected $cartController;

    // Inject CartController
    public function __construct(CartController $cartController)
    {
        $this->cartController = $cartController;
    }
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

        /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // Get the session ID *before* authentication potentially changes it
        $oldSessionId = Session::getId();
        Log::info("Old session ID before auth: {$oldSessionId}");

        $request->authenticate(); // User is now logged in

        // --- Cart Merging Logic ---
        $user = $request->user();
        $newSessionId = Session::getId(); // Get current ID (might be same or different after auth)
        Log::info("New session ID after auth: {$newSessionId}");


        // Find the guest cart using the OLD session ID
        $guestCart = Cart::with('items')->where('session_id', $oldSessionId)->whereNull('user_id')->first();

        if ($guestCart) {
            Log::info("Found guest cart ID: {$guestCart->id} associated with old session ID {$oldSessionId}");

            // Get or create the user's cart
            $userCart = Cart::with('items')->firstOrCreate(
                ['user_id' => $user->id],
                ['session_id' => null] // Ensure session_id is null for user carts
            );
            Log::info("Found or created user cart ID: {$userCart->id} for user ID {$user->id}");


            // Use the merge logic from CartController (making it public or extracting to a service might be cleaner long-term)
            // For now, let's access it via the injected controller instance.
             // Ensure mergeSessionCart is public or create a dedicated public method for this
             try {
                // We need to make mergeSessionCart public or create a helper
                // Let's simulate calling the protected merge method via reflection for now,
                // but ideally, refactor mergeSessionCart to be public or in a service.
                 $reflection = new \ReflectionMethod(CartController::class, 'mergeSessionCart');
                 $reflection->setAccessible(true);
                 $reflection->invoke($this->cartController, $guestCart, $userCart);
                 Log::info("Merge process completed for session cart {$guestCart->id} into user cart {$userCart->id}.");

             } catch (\Exception $e) {
                 Log::error("Error merging carts during login: " . $e->getMessage());
                 // Decide how to handle merge errors - maybe proceed without merge?
             }

        } else {
             Log::info("No guest cart found for old session ID {$oldSessionId}.");
             // Ensure user cart exists if they didn't have a guest cart
             $userCart = Cart::with('items')->firstOrCreate(
                 ['user_id' => $user->id],
                 ['session_id' => null]
             );
             // Load items in case it was just created or didn't have them loaded
             if (!$userCart->relationLoaded('items')) {
                $userCart->load('items');
             }
             Log::info(" Ensured user cart ID {$userCart->id} exists.");
        }
        // --- End Cart Merging Logic ---

        // Regenerate session *after* dealing with the old session ID cart
        $request->session()->regenerate();
        Log::info("Session regenerated. New session ID: " . Session::getId());

        // Associate the now possibly empty guest cart session ID with the user cart temporarily
        // This helps if getCurrentCart is called again *before* HandleInertiaRequests runs
        if ($guestCart && $userCart && $guestCart->id !== $userCart->id) {
            // If guest cart still exists (maybe merge failed or it was empty), ensure no conflict
            $conflictingSessionCart = Cart::where('session_id', Session::getId())->where('user_id', '!=', $user->id)->first();
            if ($conflictingSessionCart) {
                 Log::warning("Conflicting session cart found after regenerate. Deleting it. ID: {$conflictingSessionCart->id}");
                 $conflictingSessionCart->delete();
             }
             // It's generally safer to just work with the userCart now
        }


        // Flash the welcome message
        $userName = $user->name;
        session()->flash('login_success_message', "Welcome back, {$userName}!");

        // Redirect to the intended page or welcome
        return redirect()->intended(route('welcome', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
