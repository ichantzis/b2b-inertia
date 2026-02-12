<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Artwork; // <--- Import Artwork Model
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

    public function getCurrentCart(bool $create = true): ?Cart
    {
        // ... (Keep existing implementation) ...
        $user = Auth::user();
        $sessionId = Session::getId();
        $cart = null;

        if ($user) {
            $userCart = Cart::with('items')->where('user_id', $user->id)->first();
            $sessionCart = Cart::with('items')->where('session_id', $sessionId)->whereNull('user_id')->first();

            if ($userCart) {
                $cart = $userCart;
                if ($sessionCart) {
                    $this->mergeSessionCart($sessionCart, $userCart);
                    $cart->load('items');
                }
            } elseif ($sessionCart) {
                $cart = $sessionCart;
                $cart->user_id = $user->id;
                $cart->session_id = null;
                $cart->save();
            }
        } else {
            $cart = Cart::with('items')->where('session_id', $sessionId)->first();
        }

        if (!$cart && $create) {
            $cart = Cart::create([
                'user_id' => $user ? $user->id : null,
                'session_id' => $user ? null : $sessionId,
            ]);
            $cart->load('items');
        } elseif ($cart && !$cart->relationLoaded('items')) {
            $cart->load('items');
        }
        return $cart;
    }

    public function mergeSessionCart(Cart $sessionCart, Cart $userCart): void
    {
        // ... (Keep existing implementation) ...
        if ($sessionCart->id === $userCart->id) return;

        DB::transaction(function () use ($sessionCart, $userCart) {
            foreach ($sessionCart->items as $sessionItem) {
                $existingItem = $userCart->items()
                    ->where('artwork_id', $sessionItem->artwork_id)
                    ->where('type', $sessionItem->type)
                    ->where('frame', $sessionItem->frame)
                    ->where('size', $sessionItem->size)
                    ->first();

                if ($existingItem) {
                    $existingItem->quantity += $sessionItem->quantity;
                    $existingItem->save();
                    $sessionItem->delete();
                } else {
                    $sessionItem->cart_id = $userCart->id;
                    $sessionItem->save();
                }
            }
            $sessionCartExists = Cart::find($sessionCart->id);
            if ($sessionCartExists) $sessionCartExists->delete();
        });
    }

    public function index()
    {
        $cart = $this->getCurrentCart(false);
        $cartTotal = $cart ? $this->calculateCartTotal($cart) : 0;

        $cartItemsData = $cart ? $cart->items->map(function ($item) {
            return [
                'id' => $item->id,
                'artwork_id' => $item->artwork_id, // This is the pictufy_id
                'type' => $item->type,
                'print_type' => $item->print_type ?? 'mono',
                'frame' => $item->frame,
                'size' => $item->size,
                'quantity' => $item->quantity,
                'artwork_data' => $item->artwork_data,
            ];
        })->all() : [];

        return Inertia::render('Cart', [
            'cartItems' => $cartItemsData,
            'cartTotal' => $cartTotal,
        ]);
    }

    /**
     * Add an item to the cart using local DB validation.
     */
    public function store(Request $request)
    {
        Log::info("Adding to cart: " . json_encode($request->all()));

        $validatedData = $request->validate([
            // Ensure the pictufy_id exists in our local artworks table
            'artwork_id' => 'required|string|max:50|exists:artworks,pictufy_id',
            'quantity' => 'required|integer|min:1',
            'type' => 'required|string|max:20',
            'print_type' => 'nullable|string|in:mono,oil',
            'frame' => 'required|string|max:20',
            'size' => 'required|string|max:10',
            'price' => 'required|numeric|min:0',
        ]);

        $cart = $this->getCurrentCart();

        // 1. Fetch artwork details from DB to ensure consistency
        $artwork = Artwork::where('pictufy_id', $validatedData['artwork_id'])->first();

        // -----------------------------------------------------------
        // LOGIC FIX:  (Size Orientation)
        // -----------------------------------------------------------
        $rawSize = $validatedData['size'];

        if (str_contains($rawSize, 'x')) {
            // Break down the size into dimensions
            [$d1, $d2] = explode('x', $rawSize);
            $dim1 = (int)$d1;
            $dim2 = (int)$d2;

            // Find min and max
            $min = min($dim1, $dim2);
            $max = max($dim1, $dim2);

            // Calculate geometry
            $geometry = 'vertical'; // Default

            // Check if artwork has geometry info
            if (!empty($artwork->geometry)) {
                $geo = strtolower(trim(explode(',', $artwork->geometry)[0]));
                if (in_array($geo, ['vertical', 'horizontal', 'square'])) {
                    $geometry = $geo;
                }
            }
            // Fallback to dimensions if no geometry info
            elseif ($artwork->width && $artwork->height) {
                if ($artwork->width > $artwork->height) {
                    $geometry = 'horizontal';
                } elseif ($artwork->width < $artwork->height) {
                    $geometry = 'vertical';
                } else {
                    $geometry = 'square';
                }
            }

            // Adjust size based on geometry
            if ($geometry === 'horizontal') {
                // If is horizontal, then width (first number) should be the max
                $validatedData['size'] = "{$max}x{$min}";
            } elseif ($geometry === 'square') {
                $validatedData['size'] = "{$min}x{$min}";
            } else {
                // If it's vertical or unknown, keep min first
                $validatedData['size'] = "{$min}x{$max}";
            }
        }
        // -----------------------------------------------------------
        // END FIX
        // -----------------------------------------------------------

        // Use DB data for title/thumb if available, otherwise frontend input (if passed)
        $title = $artwork ? $artwork->title : ($request->input('title') ?? 'Artwork');
        $img_thumb = $artwork ? $artwork->img_thumb : ($request->input('img_thumb') ?? null);

        $artworkDataForJson = [
            'price' => (float)$validatedData['price'],
            'img_thumb' => $img_thumb,
            'title' => $title,
        ];

        // 2. Add/Update Item
        $cartItem = $cart->items()
            ->where('artwork_id', $validatedData['artwork_id']) // pictufy_id
            ->where('type', $validatedData['type'])
            ->where('print_type', $validatedData['print_type'] ?? 'mono')
            ->where('frame', $validatedData['frame'])
            ->where('size', $validatedData['size'])
            ->first();

        if ($cartItem) {
            $cartItem->quantity += $validatedData['quantity'];
            $cartItem->artwork_data = $artworkDataForJson;
            $cartItem->save();
        } else {
            $cart->items()->create([
                'artwork_id' => $validatedData['artwork_id'], // pictufy_id
                'type' => $validatedData['type'],
                'print_type' => $validatedData['print_type'] ?? 'mono',
                'frame' => $validatedData['frame'],
                'size' => $validatedData['size'],
                'quantity' => $validatedData['quantity'],
                'artwork_data' => $artworkDataForJson,
            ]);
        }

        $cart->touch();
        $this->shareCartData();

        return back();
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $currentCart = $this->getCurrentCart(false);
        if (!$currentCart || $cartItem->cart_id !== $currentCart->id) abort(403);

        $validated = $request->validate(['quantity' => 'required|integer|min:1']);
        $cartItem->quantity = $validated['quantity'];
        $cartItem->save();
        $cartItem->cart->touch();
        $this->shareCartData();
        return back()->with('success', 'Cart updated.');
    }

    public function destroy(CartItem $cartItem)
    {
        $currentCart = $this->getCurrentCart(false);
        if (!$currentCart || $cartItem->cart_id !== $currentCart->id) abort(403);
        $cart = $cartItem->cart;
        $cartItem->delete();
        $cart->touch();
        $this->shareCartData();
        return back();
    }

    public function clearCart(): void
    {
        $user = Auth::user();
        $sessionId = Session::getId();
        if ($user) Cart::where('user_id', $user->id)->delete();
        else Cart::where('session_id', $sessionId)->delete();
        Session::forget('cart_id');
    }

    public function calculateCartTotal(Cart $cart): float
    {
        $cart->loadMissing('items');
        $total = 0;
        foreach ($cart->items as $item) {
            $price = $item->artwork_data['price'] ?? 0;
            $total += (float)$price * $item->quantity;
        }
        return $total;
    }

    protected function shareCartData(): void
    {
        $cartData = self::getSharedCartData();
        Inertia::share('cartCount', $cartData['cartCount']);
        Inertia::share('cartItemsPreview', $cartData['cartItemsPreview']);
    }

    public static function getSharedCartData(): array
    {
        try {
            $controller = app(CartController::class);
            $cart = $controller->getCurrentCart(false);
            $itemsPreview = [];
            $totalQuantity = 0;

            if ($cart) {
                $totalQuantity = $cart->items->sum('quantity');
                $itemsPreview = $cart->items()->latest()->take(5)->get()->map(fn($item) => [
                    'id' => $item->id,
                    'artwork_id' => $item->artwork_id,
                    'quantity' => $item->quantity,
                    'type' => $item->type,
                    'print_type' => $item->print_type ?? 'mono',
                    'frame' => $item->frame,
                    'size' => $item->size,
                    'artwork_data' => $item->artwork_data ?? [],
                ])->all();
            }
            return ['cartCount' => $totalQuantity, 'cartItemsPreview' => $itemsPreview];
        } catch (\Exception $e) {
            return ['cartCount' => 0, 'cartItemsPreview' => []];
        }
    }
}
