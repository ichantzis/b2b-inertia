<?php

use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\AccessRequestController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PictufyController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ContactController;
use App\Http\Middleware\EnsureUserIsAuthenticated;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [App\Http\Controllers\PictufyController::class, 'homepage'])->name('welcome');
// Route::get('/about', [App\Http\Controllers\PageController::class, 'about'])->name('about');
Route::get('/contact-us', [ContactController::class, 'index'])->name('contact.index');
Route::post('/contact-us', [ContactController::class, 'store'])->name('contact.store');


Route::post('/request-access', [App\Http\Controllers\Auth\AccessRequestController::class, 'store'])->name('access.request');

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
// Add {slug?} to the end. The ? means it's optional,
// so old links won't break.
Route::get('/artwork/{id}/related', [PictufyController::class, 'getRelatedContent'])->name('artwork.related');
Route::get('/artwork/{id}/{slug?}', [PictufyController::class, 'artworkDetails'])->name('artwork.details');

// Update collection route to use list_id
Route::get('/collections', [PictufyController::class, 'indexCollections'])->name('collections.index'); // Page to display all collections
Route::get('/collection/{collection_slug}/{filters?}', [PictufyController::class, 'showCollectionBySlug'])
    ->where('filters', '.*')
    ->name('collection.show'); // Page to display artworks of a specific collection by slug
Route::get('/collections/category/{category_collection_slug}', [PictufyController::class, 'showCollectionsByCategorySlug'])
    ->name('collections.category.show');

// Add artists endpoint
Route::prefix('artists')->group(function () {
    Route::get('/', [PictufyController::class, 'artistsOverview'])->name('artists.overview');
    Route::get('/illustrators', [PictufyController::class, 'artistsIllustrators'])->name('artists.illustrators');
    Route::get('/photographers', [PictufyController::class, 'artistsPhotographers'])->name('artists.photographers');
    Route::get('/by-country', [PictufyController::class, 'artistsByCountry'])->name('artists.by_country');
    Route::get('/all', [PictufyController::class, 'artistsAll'])->name('artists.all');
});
// Route to handle individual artist pages
Route::get('/artist/{artist_slug}/{filters?}', [PictufyController::class, 'showArtist'])
    ->where('filters', '.*')
    ->name('artist.show');

// Add categories endpoint
Route::get('/api/categories', [PictufyController::class, 'getCategories']);

// Admin Dashboard Routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('dashboard')->name('dashboard.')->group(function () {
    Route::get('/', DashboardController::class)->name('index'); //  e.g., /dashboard -> dashboard.index
    // Order Management Routes for Admin using new controller
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/export', [AdminOrderController::class, 'exportOrders'])->name('orders.export'); // New export route
    Route::get('/orders/{order:id}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::put('/orders/{order:id}', [AdminOrderController::class, 'update'])->name('orders.update');

    // User Management Routes
    Route::resource('users', AdminUserController::class)->except(['show']); // We'll use edit for show
    // If you want a dedicated show route, remove except(['show']) and implement show method.
    // For simplicity, edit often serves as the show/detail page.

    // Coupon Management Routes
    Route::patch('/coupons/{coupon}/toggle', [App\Http\Controllers\Admin\CouponController::class, 'toggleStatus'])
    ->name('coupons.toggle');
    Route::resource('coupons', \App\Http\Controllers\Admin\CouponController::class)->names('coupons');

    // Settings Routes
    Route::get('/settings', [App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('settings.update');
});

Route::middleware('auth')->group(function () {
    Route::prefix('account')->name('account.')->group(function () {
        Route::get('/orders', [App\Http\Controllers\AccountController::class, 'orders'])->name('orders.index');
        Route::get('/orders/{order}', [App\Http\Controllers\AccountController::class, 'show'])->name('orders.show');
        Route::get('/addresses', [App\Http\Controllers\AccountController::class, 'addresses'])->name('addresses.index');
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::patch('/profile/address', [App\Http\Controllers\ProfileController::class, 'updateAddress'])->name('profile.update.address');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
});

// Cart Routes
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::put('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update'); // Use PUT for updates
Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy'); // Use DELETE for removals

// Checkout Route - Protect with authentication middleware
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::post('/checkout/validate-coupon', [App\Http\Controllers\CheckoutController::class, 'validateCoupon'])->name('checkout.validate.coupon');
    Route::get('/checkout/complete/{order}', [CheckoutController::class, 'complete'])->name('checkout.complete');
});

// You might need a POST route for processing the checkout form
// Route::post('/checkout', [CheckoutController::class, 'store'])->middleware(['auth', 'verified'])->name('checkout.store');

require __DIR__ . '/auth.php';
