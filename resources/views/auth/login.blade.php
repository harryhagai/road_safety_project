@extends('layouts.auth')

@section('title', 'Login')

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

                    <div class="auth-login-pill">Secure Access</div>

                    <div class="auth-login-copy">
                        <h1>Welcome Back</h1>
                        <p>Sign in to continue with secure access to HGSS services.</p>
                    </div>

                    <div class="auth-login-guide">
                        <h3>How to fill this form</h3>
                        <ul>
                            <li>Use your registered email address and password.</li>
                            <li>Keep your account active with role-based protected sessions.</li>
                            <li>Reset your password quickly if you lose access.</li>
                        </ul>
                    </div>

                    <div class="auth-login-watermark" aria-hidden="true">
                        <i class="bi bi-shield-lock"></i>
                    </div>
                </aside>

                <div class="auth-login-form-panel">
                    <div class="auth-login-form-card">
                        <div class="auth-login-title-row">
                            <h2 class="auth-login-title">
                                <i class="bi bi-box-arrow-in-right"></i>
                                <span>Login</span>
                            </h2>
                        </div>

                        <p class="auth-login-subtitle">Enter your credentials to access your account.</p>

                        @include('auth.partials.feedback')

                        <form method="POST" action="{{ route('login.submit') }}" class="auth-form auth-login-form" data-auth-form>
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

                            <div class="auth-input-group">
                                <label for="password">Password</label>
                                <div class="auth-input-wrap auth-login-input @error('password') is-invalid @enderror">
                                    <i class="bi bi-lock auth-input-icon"></i>
                                    <input id="password" type="password" name="password" placeholder="Enter your password" required autocomplete="current-password">
                                    <button type="button" class="auth-password-toggle" data-password-toggle="password" aria-label="Toggle password visibility">
                                        <i class="bi bi-eye"></i>
                                    </button>
                                </div>
                                @error('password')
                                    <div class="auth-field-error">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="auth-form-meta auth-login-meta">
                                <label class="auth-checkbox" for="remember">
                                    <input id="remember" type="checkbox" name="remember" value="1" {{ old('remember') ? 'checked' : '' }}>
                                    <span>Remember me</span>
                                </label>
                                <a href="{{ route('password.request') }}" class="auth-link" data-inline-spinner-link data-loading-text="Opening...">Forgot Password?</a>
                            </div>

                            <button type="submit" class="btn-brand auth-login-button auth-forgot-button" data-auth-submit data-loading-text="Logging in...">
                                <i class="bi bi-box-arrow-in-right"></i>
                                <span data-auth-submit-label>Login</span>
                            </button>

                            <div class="auth-login-back-wrap">
                                <a href="{{ route('home') }}" class="auth-login-back-link">
                                    <i class="bi bi-arrow-left"></i>
                                    <span>Back to Home</span>
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
