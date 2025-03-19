<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PictufyController;
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
Route::get('/lists', [PictufyController::class, 'lists']);
Route::get('/artworks', [PictufyController::class, 'artworks'])->middleware('auth')->name('artworks');
Route::get('/artworks/data', [PictufyController::class, 'fetchData']);
Route::get('/artwork/{id}', [PictufyController::class, 'artworkDetails'])->name('artwork.details');

// Update collection route to use list_id
Route::get('/collections', [PictufyController::class, 'collections'])->name('collections');
Route::get('/collection/{list_id}/{filters?}', [PictufyController::class, 'filteredArtworks'])
    ->where('filters', '.*')
    ->name('collection.filtered');

// Add categories endpoint
Route::get('/api/categories', [PictufyController::class, 'getCategories']);

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
