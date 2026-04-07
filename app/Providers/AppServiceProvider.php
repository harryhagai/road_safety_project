<?php

namespace App\Providers;

use App\Models\EvidenceFile;
use App\Models\Hotspot;
use App\Models\Officer;
use App\Models\Report;
use App\Models\RoadRule;
use App\Models\RoadSegment;
use App\Models\RuleViolation;
use App\Models\User;
use App\Models\ViolationType;
use App\Observers\SensitiveActivityObserver;
use App\Services\AuditTrailService;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        User::observe(SensitiveActivityObserver::class);
        Officer::observe(SensitiveActivityObserver::class);
        Report::observe(SensitiveActivityObserver::class);
        RoadRule::observe(SensitiveActivityObserver::class);
        RoadSegment::observe(SensitiveActivityObserver::class);
        ViolationType::observe(SensitiveActivityObserver::class);
        RuleViolation::observe(SensitiveActivityObserver::class);
        Hotspot::observe(SensitiveActivityObserver::class);
        EvidenceFile::observe(SensitiveActivityObserver::class);

        Event::listen(Login::class, function (Login $event): void {
            app(AuditTrailService::class)->logAuthEvent('login', $event->user, [
                'guard' => $event->guard,
            ]);
        });

        Event::listen(Logout::class, function (Logout $event): void {
            app(AuditTrailService::class)->logAuthEvent('logout', $event->user, [
                'guard' => $event->guard,
            ]);
        });

        Event::listen(Registered::class, function (Registered $event): void {
            $user = $event->user;

            app(AuditTrailService::class)->logAuthEvent('registered', $user, [
                'registered_user_email' => $user->email ?? null,
            ]);
        });

        Event::listen(Failed::class, function (Failed $event): void {
            app(AuditTrailService::class)->logAuthEvent('failed', null, [
                'guard' => $event->guard,
                'email' => $event->credentials['email'] ?? null,
            ]);
        });

        Event::listen(PasswordReset::class, function (PasswordReset $event): void {
            app(AuditTrailService::class)->logAuthEvent('password_reset', $event->user, [
                'email' => $event->user->email ?? null,
            ]);
        });
    }
}
