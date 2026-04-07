@extends('layouts.auth')

@section('title', 'Forgot Password')

@section('content')
    <section class="auth-page auth-login-page">
        <div class="auth-login-frame">
            <div class="auth-login-shell">
                <aside class="auth-login-brand-panel">
                    <a href="{{ route('home') }}" class="auth-login-brand">
                        <img src="{{ asset('img/hg-logo.png') }}" alt="HGSS Logo">
                        <span>
                            <strong>Henry Gogarty Secondary School</strong>
                            <small>HGSS Student Information Management System</small>
                        </span>
                    </a>

                    <div class="auth-login-pill">Password Recovery</div>

                    <div class="auth-login-copy">
                        <h1>Forgot Password</h1>
                        <p>Enter your registered email address and we will send a secure password reset link to that inbox.</p>
                    </div>

                    <div class="auth-login-guide">
                        <h3>How this works</h3>
                        <ul>
                            <li>Enter the email address linked to your HGSS account.</li>
                            <li>The system checks whether that email exists in the users table.</li>
                            <li>If it exists, a password reset link is sent to that same email address.</li>
                        </ul>
                    </div>

                    <div class="auth-login-watermark" aria-hidden="true">
                        <i class="bi bi-key"></i>
                    </div>
                </aside>

                <div class="auth-login-form-panel">
                    <div class="auth-login-form-card">
                        <div class="auth-login-title-row">
                            <h2 class="auth-login-title">
                                <i class="bi bi-envelope-paper"></i>
                                <span>Request Reset Link</span>
                            </h2>
                        </div>

                        <p class="auth-login-subtitle">Use your email only. If the account exists, we will email a password reset link for secure access recovery.</p>

                        @include('auth.partials.feedback')

                        <form method="POST" action="{{ route('password.email') }}" class="auth-form auth-login-form" data-auth-form>
                            @csrf

                            <div class="auth-input-group">
                                <label for="email">Email Address</label>
                                <div class="auth-input-wrap auth-login-input @error('email') is-invalid @enderror">
                                    <i class="bi bi-envelope auth-input-icon"></i>
                                    <input id="email" type="email" name="email" value="{{ old('email') }}" placeholder="name@school.com" required autocomplete="email">
                                </div>
                                @error('email')
                                    <div class="auth-field-error">{{ $message }}</div>
                                @enderror
                            </div>

                            <button type="submit" class="btn-brand auth-login-button auth-forgot-button" data-auth-submit data-loading-text="Sending link...">
                                <i class="bi bi-send"></i>
                                <span data-auth-submit-label>Send Reset Link</span>
                            </button>

                            <div class="auth-login-back-wrap">
                                <a href="{{ route('login') }}" class="auth-login-back-link">
                                    <i class="bi bi-arrow-left"></i>
                                    <span>Back to Login</span>
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection

@section('scripts')
    <script src="{{ asset('js/login.js') }}"></script>
@endsection
