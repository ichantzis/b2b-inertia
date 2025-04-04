<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Services\PictufyService; //
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; //
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class CartController extends Controller
{
    protected $pictufyService;

    // Inject PictufyService if needed to fetch artwork details when adding to cart
    public function __construct(PictufyService $pictufyService) //
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

        if ($user) {
            // Try to find user's cart first
            $cart = Cart::with('items')->where('user_id', $user->id)->first();
            if ($cart) {
                // Check if there's also a session cart and merge if necessary
                $sessionCart = Cart::with('items')->where('session_id', $sessionId)->first();
                if ($sessionCart) {
                    $this->mergeSessionCart($sessionCart, $cart);
                }
                return $cart;
            }
            // If no user cart, check for session cart and associate it
            $cart = Cart::with('items')->where('session_id', $sessionId)->first();
            if ($cart) {
                $cart->user_id = $user->id;
                $cart->session_id = null; // Clear session ID once associated with user
                $cart->save();
                return $cart;
            }
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
        }

        return $cart;
    }

    /**
     * Merge items from a session cart into a user's cart.
     */
    protected function mergeSessionCart(Cart $sessionCart, Cart $userCart): void
    {
        DB::transaction(function () use ($sessionCart, $userCart) {
            foreach ($sessionCart->items as $sessionItem) {
                $existingItem = $userCart->items()->where('artwork_id', $sessionItem->artwork_id)->first();
                if ($existingItem) {
                    // Item exists, update quantity (or other logic like sum quantities)
                    $existingItem->quantity += $sessionItem->quantity;
                    $existingItem->save();
                } else {
                    // Item doesn't exist, move it to the user's cart
                    $sessionItem->cart_id = $userCart->id;
                    $sessionItem->save();
                }
            }
            // Delete the now empty session cart
            $sessionCart->delete();
        });

        // Reload items relation for the user cart
        $userCart->load('items');
    }


    /**
     * Display the cart page.
     */
    public function index()
    {
        $cart = $this->getCurrentCart(false); // Don't create a cart just for viewing

        return Inertia::render('Cart', [ // Assuming Cart page is in resources/js/Pages/Cart/Index.vue
            'cartItems' => $cart ? $cart->items : [],
            'cartTotal' => $cart ? $this->calculateCartTotal($cart) : 0,
        ]);
    }

    /**
     * Add an item to the cart.
     */
    public function store(Request $request)
    {
        Log::info("Adding to cart request data: " . json_encode($request->all()));

        $validatedData = $request->validate([
            'artwork_id' => 'required|string',
            'title' => 'nullable|string',
            'quantity' => 'required|integer|min:1',
            'img_thumb' => 'nullable|string',
            'type' => 'required|string',
            'frame' => 'required|string',
            'size' => 'required|string',
            'price' => 'required|numeric|min:0',
        ]);

        $cart = $this->getCurrentCart();
        $artworkId = $validatedData['artwork_id'];
        $quantity = $validatedData['quantity'];
        $type = $validatedData['type'];
        $frame = $validatedData['frame'];
        $size = $validatedData['size'];
        $img_thumb = $validatedData['img_thumb'] ?? null; // Optional
        $price = $validatedData['price'];

        $artworkDataForJson = [
            'price' => $price,
            'img_thumb' => $img_thumb,
            'title' => $validatedData['title'] ?? null,
            // Add title/image here if needed
        ];

        $cartItem = $cart->items()
            ->where('artwork_id', $artworkId)
            ->where('type', $type)
            ->where('frame', $frame)
            ->where('size', $size)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();
            Log::info("Updated quantity for existing cart item ID: " . $cartItem->id);
        } else {
            $newItem = $cart->items()->create([
                'artwork_id' => $artworkId,
                'type' => $type,
                'frame' => $frame,
                'size' => $size,
                'quantity' => $quantity,
                'artwork_data' => $artworkDataForJson,
            ]);
            Log::info("Created new cart item ID: " . $newItem->id);
        }

        $cart->touch();
        $this->shareCartData();

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

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem->quantity = $request->input('quantity');
        $cartItem->save();
        $cartItem->cart->touch(); // Update cart's timestamp
        $this->shareCartData();

        return back()->with('success', 'Cart updated.');
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
        // Example: Fetch prices from stored artwork_data or make API calls if needed
        // This is a placeholder - implement based on how you get prices
        $total = 0;
        // foreach ($cart->items as $item) {
        //     $price = $item->artwork_data['price'] ?? 0; // Example: get price from stored data
        //     $total += $price * $item->quantity;
        // }
        return $total; // Format as needed
    }

    /**
     * Share cart item count and limited items globally via Inertia share.
     */
    protected function shareCartData(): void
    {
        $cartData = self::getSharedCartData(); // Call the static method
        Inertia::share('cartCount', $cartData['cartCount']);
        Inertia::share('cartItemsPreview', $cartData['cartItemsPreview']); // Share items
    }

    /**
     * Get cart data (used for sharing).
     */
    public static function getSharedCartData(): array
    {
        // Use static method or a service to avoid instantiation issues in middleware
        $controller = app(CartController::class); // Resolve controller via container
        $cart = $controller->getCurrentCart(false);
        $itemsPreview = [];

        if ($cart) {
            // Eager load items and limit the result for the preview
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
                    'artwork_data' => $item->artwork_data,
                ])->all();
        }

        return [
            'cartCount' => $cart ? $cart->items->sum('quantity') : 0,
            'cartItemsPreview' => $itemsPreview,
        ];
    }
}
