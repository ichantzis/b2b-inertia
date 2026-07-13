<?php

use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\AccessRequestController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ContactController;
// --- NEW CONTROLLERS ---
use App\Http\Controllers\ArtworkController;
use App\Http\Controllers\ArtistController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\ListController;
// -----------------------
use App\Services\SettingsService;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- Homepage ---
// You can keep this closure or move it to HomeController
Route::get('/', function (SettingsService $settingsService) {
    // Fetch generic lists for homepage (e.g., 'best-sellers') or just pass empty
    // If you need specific lists for the homepage slider, fetch them here using Models.
    $curatedLists = \App\Models\ArtworkList::orderByDesc('last_change')->get();
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'curatedLists' => $curatedLists,
        'heroSettings' => [
            'image' => $settingsService->get('hero_image', '/images/hero-bg.jpg.png'),
            'title' => $settingsService->get('hero_title', 'Premium Art on Canvas Custom Made by hand with Love'),
            'subtitle' => $settingsService->get('hero_subtitle', 'Art Prints for Every Personality'),
            'button1_text' => $settingsService->get('hero_button1_text', 'Shop Prints'),
            'button1_link' => $settingsService->get('hero_button1_link', '/artworks?category=prints'),
            'button2_text' => $settingsService->get('hero_button2_text', 'Shop Frames'),
            'button2_link' => $settingsService->get('hero_button2_link', '/artworks?category=frames'),
        ],
        'featuredColumns' => [
            'col1' => [
                'title' => $settingsService->get('col1_title', 'Featured Title 1'),
                'link'  => $settingsService->get('col1_link', '#'),
                'image' => $settingsService->get('col1_image', '/images/placeholder.png'),
            ],
            'col2' => [
                'title' => $settingsService->get('col2_title', 'Featured Title 2'),
                'link'  => $settingsService->get('col2_link', '#'),
                'image' => $settingsService->get('col2_image', '/images/placeholder.png'),
            ],
            'col3' => [
                'title' => $settingsService->get('col3_title', 'Featured Title 3'),
                'link'  => $settingsService->get('col3_link', '#'),
                'image' => $settingsService->get('col3_image', '/images/placeholder.png'),
            ]
        ],
        'editorSettings' => [
            'title'       => $settingsService->get('editor_title', 'THE EDITOR\'S PICK - MAY'),
            'description' => $settingsService->get('editor_description', 'Discover the world\'s top posters, handpicked by our editors. Curated from recent bestsellers and fresh favorites.'),
            'button_text' => $settingsService->get('editor_button_text', 'Shop Collection'),
            'button_link' => $settingsService->get('editor_button_link', '/artworks'),
            'image'       => $settingsService->get('editor_image', null), // Προαιρετικά, μπορείς να βάλεις ένα placeholder image link εδώ
        ],
    ]);
})->name('welcome');

// --- Static Pages ---
Route::get('/contact-us', [ContactController::class, 'index'])->name('contact.index');
Route::post('/contact-us', [ContactController::class, 'store'])->name('contact.store');
Route::post('/request-access', [AccessRequestController::class, 'store'])->name('access.request');


// --- LISTS ---
Route::get('/lists', [ListController::class, 'index'])->name('lists.index');
Route::get('/lists/{slug}/{filters?}', [ListController::class, 'show'])
    ->where('filters', '.*')
    ->name('lists.show');


// --- ARTWORKS ---
// Main Shop Page
Route::get('/artworks/{filters?}', [ArtworkController::class, 'index'])
    ->where('filters', '.*')
    ->name('artworks'); // Kept name 'artworks' to match your old web.php

// Ajax Fetch (Infinite Scroll)
Route::get('/fetch-artworks', [ArtworkController::class, 'fetchData'])->name('artworks.fetch');

// Single Artwork Details
Route::get('/artwork/{id}/related', [ArtworkController::class, 'getRelatedContent'])->name('artwork.related');
Route::get('/artwork/{id}/{slug?}', [ArtworkController::class, 'show'])->name('artwork.details');


// --- COLLECTIONS ---
Route::get('/collections', [CollectionController::class, 'index'])->name('collections.index');
Route::get('/collection/{collection_slug}/{filters?}', [CollectionController::class, 'show'])
    ->where('filters', '.*')
    ->name('collection.show');

// Note: "Collections by Category" is tricky if we don't have a CollectionCategory model.
// Only enable this if you have a way to query collections by a category SLUG.
// For now, we point it to the controller to handle or 404.
Route::get('/collections/category/{category_collection_slug}', [CollectionController::class, 'showByCategory'])
    ->name('collections.category.show');


// --- ARTISTS ---
Route::prefix('artists')->group(function () {
    Route::get('/', [ArtistController::class, 'overview'])->name('artists.overview');
    Route::get('/illustrators', [ArtistController::class, 'illustrators'])->name('artists.illustrators');
    Route::get('/photographers', [ArtistController::class, 'photographers'])->name('artists.photographers');
    Route::get('/by-country', [ArtistController::class, 'byCountry'])->name('artists.by_country');
    Route::get('/all', [ArtistController::class, 'index'])->name('artists.all');
});

Route::get('/artist/{artist_slug}/{filters?}', [ArtistController::class, 'show'])
    ->where('filters', '.*')
    ->name('artist.show');


// --- API (Categories for Menu) ---
Route::get('/api/categories', [ArtworkController::class, 'getCategories']);


// --- ADMIN & AUTH ---
Route::middleware(['auth', 'verified', 'admin'])->prefix('dashboard')->name('dashboard.')->group(function () {
    Route::get('/', DashboardController::class)->name('index');
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/export', [AdminOrderController::class, 'exportOrders'])->name('orders.export');
    Route::get('/orders/{order:id}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::put('/orders/{order:id}', [AdminOrderController::class, 'update'])->name('orders.update');
    Route::get('/orders/{order}/items/{item}/download', [App\Http\Controllers\Admin\OrderController::class, 'downloadArtwork'])
        ->name('orders.download-artwork');
    Route::resource('users', AdminUserController::class)->except(['show']);
    Route::patch('/coupons/{coupon}/toggle', [App\Http\Controllers\Admin\CouponController::class, 'toggleStatus'])->name('coupons.toggle');
    Route::resource('coupons', \App\Http\Controllers\Admin\CouponController::class)->names('coupons');
    Route::get('/settings', [App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('settings.update');
    Route::post('/settings/run-command', [App\Http\Controllers\Admin\SettingsController::class, 'runCommand'])->name('settings.command');
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

Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::put('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::post('/checkout/validate-coupon', [App\Http\Controllers\CheckoutController::class, 'validateCoupon'])->name('checkout.validate.coupon');
    Route::get('/checkout/complete/{order}', [CheckoutController::class, 'complete'])->name('checkout.complete');
});

require __DIR__ . '/auth.php';
