<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PictufyController;
use App\Http\Controllers\CartController;
use App\Http\Middleware\EnsureUserIsAuthenticated;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

// Replace collections route with lists
Route::get('/lists', [PictufyController::class, 'lists'])->name('lists');
Route::get('/lists/{list_id}/{filters?}', [PictufyController::class, 'filteredList'])
    ->where('filters', '.*')
    ->name('list.filtered');

// Route::get('/artworks', [PictufyController::class, 'artworks'])->name('artworks');
Route::get('/artworks/{filters?}', [PictufyController::class, 'filteredArtworks'])
    ->where('filters', '.*')
    ->name('artworks');
Route::get('/fetch-artworks', [PictufyController::class, 'fetchData'])->name('artworks.fetch');
Route::get('/artwork/{id}', [PictufyController::class, 'artworkDetails'])->name('artwork.details');

// Update collection route to use list_id
Route::get('/collections', [PictufyController::class, 'indexCollections'])->name('collections.index'); // Page to display all collections
Route::get('/collection/{collection_slug}/{filters?}', [PictufyController::class, 'showCollectionBySlug'])
    ->where('filters', '.*')
    ->name('collection.show'); // Page to display artworks of a specific collection by slug

// Add categories endpoint
Route::get('/api/categories', [PictufyController::class, 'getCategories']);

Route::get('/dashboard', DashboardController::class)->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Cart Routes
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::put('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update'); // Use PUT for updates
Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy'); // Use DELETE for removals

// Checkout Route (Example) - Protect with authentication middleware
Route::get('/checkout', function () {
    // Checkout logic/page here
    // Ensure cart items are present before proceeding
    $cart = app(CartController::class)->getCurrentCart(false);
    if (!$cart || $cart->items->isEmpty()) {
        return redirect()->route('cart.index')->withErrors(['cart' => 'Your cart is empty.']);
    }
    return Inertia::render('Checkout/Index', [ /* checkout data */]);
})->middleware(['auth', 'verified'])->name('checkout.index'); // Laravel's default auth middleware

// You might need a POST route for processing the checkout form
// Route::post('/checkout', [CheckoutController::class, 'store'])->middleware(['auth', 'verified'])->name('checkout.store');

require __DIR__ . '/auth.php';
