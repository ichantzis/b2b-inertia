<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            App\Http\Middleware\HandleInertiaRequests::class,
            Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Registering middleware aliases
        $middleware->alias([
            // Add other aliases here if you have them, for example:
            // 'auth' => \App\Http\Middleware\Authenticate::class, // Usually already defined or handled by Laravel
            // 'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class, // Usually already defined
            // 'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class, // Usually already defined

            'admin' => \App\Http\Middleware\AdminMiddleware::class, // <-- THIS IS THE LINE YOU ADD
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
