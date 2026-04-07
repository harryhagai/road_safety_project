@extends('layouts.app')

@section('title', 'Contact Us - Henry Gogarty Secondary School')

@section('content')
    <style>
        .contact-page,
        .contact-page p,
        .contact-page li,
        .contact-page span,
        .contact-page label,
        .contact-page input,
        .contact-page textarea {
            color: #1d2a36;
            font-family: var(--font-body);
        }

        .contact-page .home-section {
            font-family: var(--font-body);
            color: #1d2a36;
        }

        .contact-page .contact-page-section {
            padding-top: 122px;
            background: linear-gradient(180deg, #f9fdff 0%, #eef8ff 100%);
        }

        .contact-page .section-title,
        .contact-page .contact-form-card h4,
        .contact-page .contact-card h5 {
            font-family: var(--bs-body-font-family);
            font-weight: 500;
            letter-spacing: 0.01em;
            color: #1d2a36;
        }

        .contact-page .section-title {
            font-size: clamp(1.55rem, 3vw, 1.95rem);
            margin-bottom: 0.9rem;
        }

        .contact-page .section-title::after {
            width: 56px;
            height: 2px;
            margin-top: 0.8rem;
            opacity: 0.45;
        }

        .contact-page .section-intro,
        .contact-page .contact-form-card p,
        .contact-page .contact-card p {
            font-weight: 400;
            line-height: 1.7;
            color: var(--color-text-muted);
        }

        .contact-form-card {
            height: 100%;
            padding: 1.5rem;
            border-radius: 22px;
            background: rgba(255, 255, 255, 0.88);
            border: 1px solid rgba(16, 152, 212, 0.14);
            box-shadow: 0 14px 34px rgba(13, 111, 155, 0.12);
        }

        .contact-form-card h4 {
            font-size: 1.1rem;
            margin-bottom: 0.4rem;
        }

        .contact-form-card .form-label {
            font-size: 0.9rem;
            font-weight: 500;
            color: #1d2a36;
            margin-bottom: 0.45rem;
        }

        .contact-form-card .form-control {
            border-radius: 14px;
            border: 1px solid rgba(16, 152, 212, 0.16);
            padding: 0.85rem 0.95rem;
            box-shadow: none;
        }

        .contact-form-card .form-control:focus {
            border-color: rgba(16, 152, 212, 0.35);
            box-shadow: 0 0 0 0.2rem rgba(16, 152, 212, 0.08);
        }

        .contact-form-card textarea.form-control {
            min-height: 160px;
            resize: vertical;
        }

        .contact-page .contact-submit-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.45rem;
            border: 0;
            border-radius: 10px;
            background: #1098d4;
            color: #ffffff;
            box-shadow: none;
            text-decoration: none;
            font-family: "Manrope", var(--font-heading, "Roboto", sans-serif);
            font-size: 0.92rem;
            font-weight: 400;
            letter-spacing: 0.01em;
            padding: 0.95rem 1rem;
            min-width: 190px;
        }

        .contact-page .contact-submit-btn:hover,
        .contact-page .contact-submit-btn:focus,
        .contact-page .contact-submit-btn:active {
            background: #0d6f9b !important;
            color: #ffffff !important;
            box-shadow: none !important;
            transform: none !important;
        }

        .contact-page .contact-submit-btn,
        .contact-page .contact-submit-btn span,
        .contact-page .contact-submit-btn i {
            color: #ffffff !important;
        }

        .contact-page .contact-link {
            color: var(--color-primary-strong);
            text-decoration: none;
        }

        .contact-page .contact-link:hover,
        .contact-page .contact-link:focus {
            color: var(--color-primary);
        }

        .contact-page .contact-feedback {
            border-radius: 16px;
            border: 1px solid rgba(16, 152, 212, 0.14);
        }

        @media (max-width: 767px) {
            .contact-page .contact-page-section {
                padding-top: 108px;
            }
        }
    </style>

    <div class="contact-page">
        <section class="home-section contact-section contact-page-section" id="contact">
            <div class="container">
                <div class="section-shell">
                    <div class="text-center mb-4">
                        <h2 class="section-title mb-2">Contact Us</h2>
                        <p class="section-intro mb-0">Reach out to Henry Gogarty Secondary School for admissions, support, or general enquiries.</p>
                    </div>

                    <div class="row g-4 mb-4">
                        <div class="col-md-6 col-lg-3">
                            <div class="card contact-card h-100">
                                <div class="card-body p-4">
                                    <i class="bi bi-geo-alt-fill feature-icon"></i>
                                    <h5>Our Location</h5>
                                    <p>Henry Gogarty Secondary School<br>P.O. Box 1169, Arusha, Tanzania</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                            <div class="card contact-card h-100">
                                <div class="card-body p-4">
                                    <i class="bi bi-telephone-fill feature-icon"></i>
                                    <h5>Call Us</h5>
                                    <p>
                                        <a href="tel:+255754096032" class="contact-link">0754-096032</a><br>
                                        <a href="tel:+255783827117" class="contact-link">0783-827117</a><br>
                                        <a href="tel:+255762281979" class="contact-link">0762-281979</a><br>
                                        <a href="tel:+255787096032" class="contact-link">0787-096032</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                            <div class="card contact-card h-100">
                                <div class="card-body p-4">
                                    <i class="bi bi-envelope-fill feature-icon"></i>
                                    <h5>Email Us</h5>
                                    <p>
                                        <a href="mailto:lucretianjau506@gmail.com" class="contact-link">lucretianjau506@gmail.com</a><br>
                                        <a href="mailto:hgogarty75@gmail.com" class="contact-link">hgogarty75@gmail.com</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                            <div class="card contact-card h-100">
                                <div class="card-body p-4">
                                    <i class="bi bi-clock-fill feature-icon"></i>
                                    <h5>Working Hours</h5>
                                    <p>Monday - Friday: 8:00 - 17:00<br>Saturday: 9:00 - 14:00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row g-4 justify-content-center">
                        <div class="col-lg-8">
                            <div class="contact-form-card">
                                <h4>Send a Message</h4>
                                <p class="mb-4">Fill in the form below and our team will review your message as soon as possible.</p>

                                @if (session('status'))
                                    <div class="alert alert-success contact-feedback mb-4">{{ session('status') }}</div>
                                @endif

                                @if ($errors->any())
                                    <div class="alert alert-danger contact-feedback mb-4">
                                        Please check the form and correct the highlighted fields.
                                    </div>
                                @endif

                                <form method="POST" action="{{ route('contact.store') }}">
                                    @csrf

                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label for="contact_name" class="form-label">Full Name</label>
                                            <input
                                                id="contact_name"
                                                type="text"
                                                name="name"
                                                class="form-control @error('name') is-invalid @enderror"
                                                value="{{ old('name') }}"
                                                placeholder="Enter your full name"
                                                required>
                                            @error('name')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>

                                        <div class="col-md-6">
                                            <label for="contact_email" class="form-label">Email Address</label>
                                            <input
                                                id="contact_email"
                                                type="email"
                                                name="email"
                                                class="form-control @error('email') is-invalid @enderror"
                                                value="{{ old('email') }}"
                                                placeholder="name@example.com"
                                                required>
                                            @error('email')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>

                                        <div class="col-md-6">
                                            <label for="contact_phone" class="form-label">Phone Number</label>
                                            <input
                                                id="contact_phone"
                                                type="text"
                                                name="phone"
                                                class="form-control @error('phone') is-invalid @enderror"
                                                value="{{ old('phone') }}"
                                                placeholder="Optional phone number">
                                            @error('phone')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>

                                        <div class="col-md-6">
                                            <label for="contact_subject" class="form-label">Subject</label>
                                            <input
                                                id="contact_subject"
                                                type="text"
                                                name="subject"
                                                class="form-control @error('subject') is-invalid @enderror"
                                                value="{{ old('subject') }}"
                                                placeholder="What is this about?"
                                                required>
                                            @error('subject')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>

                                        <div class="col-12">
                                            <label for="contact_message" class="form-label">Message</label>
                                            <textarea
                                                id="contact_message"
                                                name="message"
                                                class="form-control @error('message') is-invalid @enderror"
                                                placeholder="Write your message here..."
                                                required>{{ old('message') }}</textarea>
                                            @error('message')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="mt-4 text-center">
                                        <button type="submit" class="btn btn-primary btn-lg contact-submit-btn" data-auth-submit data-loading-text="Sending message...">
                                            <i class="bi bi-send"></i>
                                            <span data-auth-submit-label>Send Message</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
@endsection
