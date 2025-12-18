<?php

use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PictufyController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Middleware\EnsureUserIsAuthenticated;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [App\Http\Controllers\PictufyController::class, 'homepage'])->name('welcome');

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
Route::get('/collections/category/{category_collection_slug}', [PictufyController::class, 'showCollectionsByCategorySlug'])
    ->name('collections.category.show');

// Add categories endpoint
Route::get('/api/categories', [PictufyController::class, 'getCategories']);

// Admin Dashboard Routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('dashboard')->name('dashboard.')->group(function () {
    Route::get('/', DashboardController::class)->name('index'); //  e.g., /dashboard -> dashboard.index
    // Order Management Routes for Admin using new controller
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/export', [AdminOrderController::class, 'exportOrders'])->name('orders.export'); // New export route
    Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::put('/orders/{order}', [AdminOrderController::class, 'update'])->name('orders.update');

    // User Management Routes
    Route::resource('users', AdminUserController::class)->except(['show']); // We'll use edit for show
    // If you want a dedicated show route, remove except(['show']) and implement show method.
    // For simplicity, edit often serves as the show/detail page.
});

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
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/complete/{orderId}', [CheckoutController::class, 'complete'])->name('checkout.complete');

// You might need a POST route for processing the checkout form
// Route::post('/checkout', [CheckoutController::class, 'store'])->middleware(['auth', 'verified'])->name('checkout.store');

require __DIR__ . '/auth.php';
