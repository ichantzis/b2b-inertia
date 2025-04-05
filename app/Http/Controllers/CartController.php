<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Services\PictufyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class CartController extends Controller
{
    protected $pictufyService;

    public function __construct(PictufyService $pictufyService)
    {
        $this->pictufyService = $pictufyService;
    }

    /**
     * Get the current user's or session's cart.
     * Creates a cart if one doesn't exist.
     */
    protected function getCurrentCart(bool $create = true): ?Cart
    {
        $user = Auth::user();
        $sessionId = Session::getId();
        $cart = null; // Initialize cart

        if ($user) {
            // Try to find user's cart first
            $userCart = Cart::with('items')->where('user_id', $user->id)->first();

            // Check for a session cart regardless of whether a user cart exists
            $sessionCart = Cart::with('items')->where('session_id', $sessionId)->whereNull('user_id')->first();

            if ($userCart) {
                $cart = $userCart;
                // If both user and session carts exist, merge session into user cart
                if ($sessionCart) {
                    $this->mergeSessionCart($sessionCart, $userCart); // Pass both carts
                    // Refresh user cart items after potential merge
                    $cart->load('items');
                }
            } elseif ($sessionCart) {
                // No user cart, but session cart exists - associate it with the user
                $cart = $sessionCart;
                $cart->user_id = $user->id;
                $cart->session_id = null; // Clear session ID once associated with user
                $cart->save();
            }
            // If neither exists and create is true, a new user cart will be created below
        } else {
            // Guest user, find by session ID
            $cart = Cart::with('items')->where('session_id', $sessionId)->first();
        }

        // Create a new cart if not found and $create is true
        if (!$cart && $create) {
            $cart = Cart::create([
                'user_id' => $user ? $user->id : null,
                'session_id' => $user ? null : $sessionId,
            ]);
            // Ensure items relationship is loaded even for newly created carts
            $cart->load('items');
        } elseif ($cart && !$cart->relationLoaded('items')) {
            // Ensure items are loaded if cart was found but items weren't eager loaded
             $cart->load('items');
        }


        return $cart;
    }

    /**
     * Merge items from a session cart into a user's cart.
     */
    public function mergeSessionCart(Cart $sessionCart, Cart $userCart): void
    {
        if ($sessionCart->id === $userCart->id) {
             Log::warning("Attempted to merge a cart with itself. Cart ID: {$sessionCart->id}");
             return; // Avoid merging a cart with itself
        }

        Log::info("Merging session cart ID {$sessionCart->id} into user cart ID {$userCart->id}");

        DB::transaction(function () use ($sessionCart, $userCart) {
            foreach ($sessionCart->items as $sessionItem) {
                 // Find item in user's cart matching artwork_id AND variations
                 $existingItem = $userCart->items()
                    ->where('artwork_id', $sessionItem->artwork_id)
                    ->where('type', $sessionItem->type)
                    ->where('frame', $sessionItem->frame)
                    ->where('size', $sessionItem->size)
                    ->first();

                if ($existingItem) {
                     // Exact match found, update quantity
                     Log::info("Exact match found for session item ID {$sessionItem->id}. Updating quantity on user item ID {$existingItem->id}.");
                     $existingItem->quantity += $sessionItem->quantity;
                     $existingItem->save();
                     // Delete the handled session item explicitly AFTER potentially updating the user item
                     $sessionItem->delete();
                 } else {
                     // No exact match, move the item to the user's cart
                     Log::info("No exact match for session item ID {$sessionItem->id}. Moving to user cart ID {$userCart->id}.");
                     $sessionItem->cart_id = $userCart->id;
                     $sessionItem->save(); // The item is now part of the user cart
                 }
            }

             // Check if session cart still exists before attempting deletion
            $sessionCartExists = Cart::find($sessionCart->id);
             if ($sessionCartExists) {
                // After processing all items, delete the (now likely empty) session cart record itself
                Log::info("Deleting session cart ID {$sessionCart->id}.");
                $sessionCartExists->delete();
             } else {
                 Log::warning("Session cart ID {$sessionCart->id} was already deleted before final delete call.");
             }
        });

        // No need to reload items here, it's done in getCurrentCart after merge call
    }


    /**
     * Display the cart page.
     */
    public function index()
    {
        // Get current cart, DON'T create if it doesn't exist for viewing
        $cart = $this->getCurrentCart(false);

        // Recalculate total based on potentially merged/updated items
        $cartTotal = $cart ? $this->calculateCartTotal($cart) : 0;

        // Prepare items data for Inertia, ensuring artwork_data is included
        $cartItemsData = $cart ? $cart->items->map(function ($item) {
            // Ensure artwork_data is properly cast and included
            return [
                'id' => $item->id,
                'artwork_id' => $item->artwork_id,
                'type' => $item->type,
                'frame' => $item->frame,
                'size' => $item->size,
                'quantity' => $item->quantity,
                'artwork_data' => $item->artwork_data, // artwork_data should be cast to array in the model
            ];
        })->all() : [];


        return Inertia::render('Cart', [
            'cartItems' => $cartItemsData, // Pass the prepared data
            'cartTotal' => $cartTotal, // Pass the calculated total
        ]);
    }

    // ... store, update, destroy, calculateCartTotal, shareCartData, getSharedCartData methods remain the same ...
     /**
     * Add an item to the cart.
     */
    public function store(Request $request)
    {
        Log::info("Adding to cart request data: " . json_encode($request->all()));

        $validatedData = $request->validate([
            'artwork_id' => 'required|string|max:50', // Added max length based on migration
            'title' => 'nullable|string',
            'quantity' => 'required|integer|min:1',
            'img_thumb' => 'nullable|string|url', // Added url validation
            'type' => 'required|string|max:20', // Added max length
            'frame' => 'required|string|max:20', // Added max length
            'size' => 'required|string|max:10', // Added max length
            'price' => 'required|numeric|min:0',
        ]);

        $cart = $this->getCurrentCart(); // Ensures cart exists

        $artworkId = $validatedData['artwork_id'];
        $quantity = $validatedData['quantity'];
        $type = $validatedData['type'];
        $frame = $validatedData['frame'];
        $size = $validatedData['size'];
        $img_thumb = $validatedData['img_thumb'] ?? null;
        $price = $validatedData['price'];
        $title = $validatedData['title'] ?? null; // Get title from validated data

        // Prepare the JSON data, ensure price is numeric
        $artworkDataForJson = [
            'price' => (float)$price,
            'img_thumb' => $img_thumb,
            'title' => $title,
        ];

        // Use firstOrNew to handle finding or creating the item atomically
        $cartItem = $cart->items()
            ->where('artwork_id', $artworkId)
            ->where('type', $type)
            ->where('frame', $frame)
            ->where('size', $size)
            ->first();

        if ($cartItem) {
            // Item exists, update quantity
            $cartItem->quantity += $quantity;
            $cartItem->artwork_data = $artworkDataForJson; // Update artwork_data in case price/thumb changed
            $cartItem->save();
            Log::info("Updated quantity for existing cart item ID: " . $cartItem->id);
        } else {
            // Item does not exist, create new one
            $newItem = $cart->items()->create([
                'artwork_id' => $artworkId,
                'type' => $type,
                'frame' => $frame,
                'size' => $size,
                'quantity' => $quantity,
                'artwork_data' => $artworkDataForJson, // Save the JSON data
            ]);
            Log::info("Created new cart item ID: " . $newItem->id);
        }


        // Ensure cart's updated_at timestamp is touched
        $cart->touch();

        // Share updated cart data (count and preview) with Inertia
        $this->shareCartData();

        // Redirect back with success message
        return back()->with('success', 'Item added to cart.');
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, CartItem $cartItem) // Route model binding
    {
        // Basic authorization: Ensure the item belongs to the current user/session cart
        $currentCart = $this->getCurrentCart(false);
        if (!$currentCart || $cartItem->cart_id !== $currentCart->id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem->quantity = $validated['quantity'];
        $cartItem->save();
        $cartItem->cart->touch(); // Update cart's timestamp

        $this->shareCartData();

        // Use Inertia props or flash message for feedback
        // Option 1: Redirect back with flash message (current approach)
        return back()->with('success', 'Cart updated.');

        // Option 2: Return Inertia response (if you want more SPA-like behavior)
        // $updatedCartData = self::getSharedCartData();
        // return Inertia::render('Cart', [ // Or the page you want to render
        //     'cartItems' => $currentCart->items()->get()->map(...), // Re-fetch and map items
        //     'cartTotal' => $this->calculateCartTotal($currentCart),
        //     // Share updated counts globally too
        //     'cartCount' => $updatedCartData['cartCount'],
        //     'cartItemsPreview' => $updatedCartData['cartItemsPreview'],
        //     'flash' => ['success' => 'Cart updated.'] // Send flash message via props
        // ]);
    }

    /**
     * Remove item from cart.
     */
    public function destroy(CartItem $cartItem) // Route model binding
    {
        // Basic authorization
        $currentCart = $this->getCurrentCart(false);
        if (!$currentCart || $cartItem->cart_id !== $currentCart->id) {
            abort(403, 'Unauthorized action.');
        }

        $cart = $cartItem->cart;
        $cartItem->delete();
        $cart->touch();

        $this->shareCartData();

        return back()->with('success', 'Item removed from cart.');
    }

     /**
     * Calculate total - Implement your pricing logic here
     */
    protected function calculateCartTotal(Cart $cart): float
    {
        // Refresh items to ensure we have the latest data after potential merges/updates
        $cart->loadMissing('items');

        $total = 0;
        foreach ($cart->items as $item) {
            // Ensure artwork_data and price exist and are numeric
            $price = $item->artwork_data['price'] ?? 0;
            if (!is_numeric($price)) {
                Log::warning("Invalid price found for cart item ID {$item->id}. Artwork data: ", $item->artwork_data ?? []);
                $price = 0;
            }
            $total += (float)$price * $item->quantity;
        }
        return $total;
    }


    /**
     * Share cart item count and limited items globally via Inertia share.
     */
    protected function shareCartData(): void
    {
        // This method updates the globally shared Inertia props.
        // It's called after store, update, destroy, and merge operations.
        $cartData = self::getSharedCartData(); // Call the static method
        Inertia::share('cartCount', $cartData['cartCount']);
        Inertia::share('cartItemsPreview', $cartData['cartItemsPreview']);
    }

    /**
     * Get cart data (used for sharing). Moved logic inside getCurrentCart
     * but keep this static method structure for HandleInertiaRequests.
     */
    public static function getSharedCartData(): array
    {
        // We need to resolve the controller to call getCurrentCart without a specific request context
        // Note: This might be slightly less performant than directly accessing session/auth in middleware,
        // but keeps the cart logic centralized in the CartController.
        try {
             $controller = app(CartController::class);
             $cart = $controller->getCurrentCart(false); // Get cart, don't create if none exists
             $itemsPreview = [];
             $totalQuantity = 0;

             if ($cart) {
                 // Use the relationship to sum quantity directly in the DB if possible, or collection sum
                 $totalQuantity = $cart->items->sum('quantity');

                // Prepare preview items
                 $itemsPreview = $cart->items()
                    ->latest() // Optional: show most recently added
                    ->take(5)  // Limit to 5 items for preview
                    ->get()
                    ->map(fn($item) => [ // Select only needed data
                        'id' => $item->id,
                        'artwork_id' => $item->artwork_id,
                        'quantity' => $item->quantity,
                        'type' => $item->type,
                        'frame' => $item->frame,
                        'size' => $item->size,
                        'artwork_data' => $item->artwork_data ?? [], // Ensure it's an array
                    ])->all();
            }

            return [
                'cartCount' => $totalQuantity,
                'cartItemsPreview' => $itemsPreview,
            ];
        } catch (\Exception $e) {
            Log::error('Error getting shared cart data: ' . $e->getMessage());
            return [
                'cartCount' => 0,
                'cartItemsPreview' => [],
            ];
        }
    }

}