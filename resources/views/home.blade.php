@extends('layouts.app')

@section('title', 'Henry Gogarty Secondary School sims')

@section('content')

    <style>
        .hero-section,
        .welcome-section,
        .why-section,
        .apply-section,
        .contact-section {
            font-family: var(--font-body);
            color: #1d2a36;
        }

        .hero-kicker {
            display: none;
        }

        .hero-title {
            font-family: var(--font-heading);
            font-weight: 600;
            letter-spacing: -0.02em;
            line-height: 1.12;
        }

        .hero-system-tag {
            font-family: var(--bs-body-font-family);
            font-size: 0.98rem;
            font-weight: 500;
            letter-spacing: 0.02em;
        }

        .hero-section .lead,
        .welcome-section .lead,
        .welcome-section p,
        .why-card p,
        .feature-box ul,
        .feature-box li,
        .feature-box p,
        .contact-card p,
        .hero-stat-card span,
        .welcome-points span {
            font-family: var(--font-body);
            font-weight: 400;
            line-height: 1.7;
            letter-spacing: 0.005em;
        }

        .section-title,
        .welcome-side-card h5,
        .why-card h5,
        .feature-box h4,
        .feature-box h6,
        .contact-card h5,
        .hero-stat-card strong {
            font-family: var(--bs-body-font-family);
            font-weight: 500;
            letter-spacing: 0.01em;
            color: #1d2a36;
        }

        .section-title {
            font-size: clamp(1.55rem, 3vw, 1.95rem);
            margin-bottom: 0.9rem;
        }

        .section-title::after {
            width: 56px;
            height: 2px;
            margin-top: 0.8rem;
            opacity: 0.45;
        }

        .why-card h5,
        .contact-card h5,
        .welcome-side-card h5 {
            font-size: 1rem;
        }

        .feature-box h4 {
            font-size: 1.08rem;
            margin-bottom: 0.55rem;
        }

        .feature-box h6 {
            font-size: 0.86rem;
            font-weight: 500;
            letter-spacing: 0.015em;
        }

        .feature-box ul {
            font-size: 0.94rem;
        }

        .hero-stat-card strong {
            font-weight: 600;
        }

        .hero-actions-inline .hero-action-btn,
        .apply-action-btn {
            font-family: var(--bs-body-font-family);
            font-weight: 500;
            letter-spacing: 0.01em;
        }

        .hero-actions-inline {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            gap: 0.75rem;
        }

        .hero-actions-inline .hero-action-btn,
        .apply-action-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.45rem;
            white-space: nowrap;
        }

        .hero-actions-inline .hero-action-btn {
            flex: 1 1 0;
            min-width: 0;
            font-size: 0.8rem;
            padding: 0.7rem 0.75rem;
        }

        .hero-actions-inline .btn-outline-hero {
            border: 2px solid rgba(16, 152, 212, 0.45);
            background-color: rgba(255, 255, 255, 0.9);
        }

        .hero-chips-inline {
            display: flex;
            flex-wrap: nowrap;
            gap: 0.55rem;
        }

        .hero-chips-inline > div {
            flex: 1 1 0;
        }

        .hero-chips-inline .hero-chip {
            font-family: var(--bs-body-font-family);
            font-size: 0.82rem;
            font-weight: 400;
            padding: 0.75rem 0.55rem;
            gap: 0.35rem;
        }

        .hero-chips-inline .hero-chip i {
            font-size: 0.82rem;
        }

        .apply-action-btn {
            font-size: 0.82rem;
            padding: 0.7rem 1rem;
        }

        .hero-visual-responsive {
            min-height: clamp(320px, 58vw, 610px);
            justify-content: center;
            padding-bottom: 0.75rem;
        }

        .hero-image-fit {
            width: min(500px, calc(100vw - 32px));
            max-width: 100%;
            margin-inline: auto;
        }

        .hero-video-frame {
            overflow: hidden;
        }

        .hero-video-frame video {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
            border-radius: inherit;
            background: #cfeaf6;
        }

        .hero-stat-card-floating {
            top: auto;
            right: clamp(8px, 2vw, 18px);
            bottom: clamp(10px, 3vw, 24px);
            max-width: clamp(180px, 42vw, 250px);
            padding: 0.58rem 0.72rem;
            gap: 0.55rem;
            align-items: center;
        }

        .hero-stat-card-floating strong {
            margin-bottom: 0.12rem;
            font-size: 0.76rem;
            line-height: 1.2;
        }

        .hero-stat-card-floating span {
            font-size: 0.68rem;
            line-height: 1.35;
        }

        .hero-stat-icon-small {
            width: 30px;
            height: 30px;
            border-radius: 10px;
            font-size: 0.8rem;
        }

        .apply-section-title-clean {
            font-family: var(--bs-body-font-family);
            font-weight: 400;
            letter-spacing: 0.01em;
            color: #1d2a36;
        }

        .apply-section-title-clean::after {
            width: 54px;
            height: 2px;
            margin-top: 0.85rem;
            opacity: 0.45;
        }

        @media (min-width: 576px) {
            .hero-actions-inline .hero-action-btn {
                flex: 0 1 auto;
                font-size: 0.92rem;
                padding: 0.82rem 1.2rem;
            }

            .hero-chips-inline {
                gap: 0.75rem;
            }

            .hero-chips-inline .hero-chip {
                font-size: 0.86rem;
                padding: 0.8rem 0.9rem;
            }

            .apply-action-btn {
                font-size: 0.92rem;
                padding: 0.82rem 1.2rem;
            }

            .hero-stat-card-floating {
                max-width: clamp(200px, 34vw, 270px);
                padding: 0.68rem 0.85rem;
            }

            .hero-stat-card-floating strong {
                font-size: 0.82rem;
            }

            .hero-stat-card-floating span {
                font-size: 0.72rem;
            }
        }

        @media (min-width: 992px) {
            .hero-actions-inline .hero-action-btn {
                font-size: 1rem;
                padding: 0.95rem 1.65rem;
            }

            .hero-chips-inline .hero-chip {
                font-size: 0.9rem;
                padding: 0.85rem 1rem;
            }

            .apply-action-btn {
                font-size: 1rem;
                padding: 0.95rem 1.5rem;
            }

            .hero-stat-card-floating {
                max-width: 290px;
                padding: 0.8rem 0.95rem;
            }

            .hero-stat-card-floating strong {
                font-size: 0.88rem;
            }

            .hero-stat-card-floating span {
                font-size: 0.76rem;
            }
        }

        @media (max-width: 575.98px) {
            .hero-title {
                font-size: 1.85rem;
                font-weight: 500;
                letter-spacing: -0.015em;
                line-height: 1.14;
            }

            .hero-system-tag {
                font-size: 0.88rem;
                font-weight: 400;
            }

            .hero-section .lead,
            .welcome-section .lead,
            .welcome-section p,
            .why-card p,
            .feature-box ul,
            .feature-box li,
            .feature-box p,
            .contact-card p,
            .welcome-points span {
                font-size: 0.92rem;
                line-height: 1.65;
            }

            .section-title {
                font-size: 1.38rem;
                font-weight: 500;
                letter-spacing: 0.008em;
                margin-bottom: 0.75rem;
            }

            .section-title::after {
                width: 44px;
                margin-top: 0.65rem;
            }

            .why-card h5,
            .contact-card h5,
            .welcome-side-card h5,
            .feature-box h4 {
                font-size: 0.98rem;
                font-weight: 500;
            }

            .feature-box h6 {
                font-size: 0.8rem;
                font-weight: 500;
            }

            .hero-actions-inline .hero-action-btn,
            .apply-action-btn,
            .hero-chips-inline .hero-chip {
                font-weight: 400;
            }

            .hero-visual-responsive {
                width: 100%;
                min-height: auto;
                padding-top: 0.25rem;
                padding-bottom: 0.5rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
            }

            .hero-image-fit {
                width: min(calc(100vw - 20px), 420px) !important;
                max-width: min(calc(100vw - 20px), 420px) !important;
                margin-left: auto;
                margin-right: auto;
            }

            .hero-orbit-one {
                width: min(calc(100vw - 44px), 340px) !important;
                height: min(calc(100vw - 44px), 340px) !important;
                max-width: 340px;
                max-height: 340px;
                left: 50%;
                right: auto;
                transform: translateX(-50%);
                top: 60px;
            }

            .hero-stat-card-floating {
                position: relative;
                right: auto;
                bottom: auto;
                margin: -1.5rem auto 0;
                max-width: min(230px, calc(100vw - 44px));
            }
        }
    </style>

    <!-- Hero Section -->
    <section class="hero-section" id="home">
        <div class="hero-pattern" aria-hidden="true"></div>
        <div class="hero-bubbles" aria-hidden="true">
            <span class="hero-bubble hero-bubble-one"></span>
            <span class="hero-bubble hero-bubble-two"></span>
            <span class="hero-bubble hero-bubble-three"></span>
        </div>
        <div class="container hero-content">
            <div class="row align-items-center g-4 g-lg-5 hero-grid">
                <div class="col-12 col-lg-6">
                    <div class="hero-copy">
                        <h1 class="hero-title mb-3">
                            <span class="hero-highlight">Student Information</span><br>
                            <span class="hero-title-line">Management System</span>
                        </h1>
                        <div class="hero-system-tag">(HGSS-SIMS)</div>
                        <p class="lead mb-4">
                            HGSS-SIMS brings admissions, student records, parent visibility, and school communication
                            together in one clean and trusted digital space.
                        </p>

                        <div class="hero-actions hero-actions-inline">
                            <a href="login" class="btn btn-primary btn-lg hero-action-btn">
                                <i class="bi bi-box-arrow-in-right"></i> Login Now
                            </a>
                            <a href="register" class="btn btn-outline-hero btn-lg hero-action-btn">
                                <i class="bi bi-person-plus"></i> Start Application
                            </a>
                        </div>

                        <div class="hero-chips hero-chips-inline">
                            <div>
                                <a href="/login" class="hero-chip hero-chip-link">
                                <i class="bi bi-person-gear"></i>
                                <span>Teachers</span>
                                </a>
                            </div>
                            <div>
                                <a href="/login" class="hero-chip hero-chip-link">
                                <i class="bi bi-people-fill"></i>
                                <span>Parents</span>
                                </a>
                            </div>
                            <div>
                                <a href="{{ route('e-learning') }}" class="hero-chip hero-chip-link">
                                <i class="bi bi-journal-bookmark-fill"></i>
                                <span>E-learning</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-lg-6">
                    <div class="hero-visual hero-visual-responsive">
                        <div class="hero-orbit hero-orbit-one" aria-hidden="true"></div>
                        <div class="hero-image-frame hero-image-fit hero-video-frame">
                            <video autoplay muted loop playsinline preload="metadata"
                                aria-label="Henry Gogarty Secondary School hero video">
                                <source src="{{ asset('asset/img/hero-video.mp4') }}" type="video/mp4">
                            </video>
                        </div>
                        <div class="hero-stat-card hero-stat-card-floating">
                            <div class="hero-stat-icon hero-stat-icon-small">
                                <i class="bi bi-mortarboard-fill"></i>
                            </div>
                            <div>
                                <strong>One smart school system</strong>
                                <span>Admissions, academics and communication in one place.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <a href="#welcome" class="hero-scroll-indicator" aria-label="Scroll to next section">
            <span>Scroll to Explore</span>
            <i class="bi bi-chevron-double-down"></i>
        </a>
    </section>
    <!-- Welcome Section -->
    <section class="home-section welcome-section" id="welcome">
        <div class="container">
            <div class="section-shell">
                <div class="row g-4 align-items-center">
                    <div class="col-lg-7">
                        <h2 class="section-title text-start">Welcome to Henry Gogarty Secondary School</h2>
                        <p class="lead text-dark mb-3">
                            Nestled in the serene hills of Makumira, Arusha, Henry Gogarty Secondary School (HGSS) is a
                            private English Medium institution committed to nurturing excellence, discipline, and holistic
                            development.
                        </p>
                        <p class="text-muted mb-0">
                            We offer both O-Level and A-Level education, with combinations tailored to students'
                            aspirations. Our motto, <strong>"Education for Excellent Services"</strong>, reflects our mission
                            to produce graduates who are academically strong and morally grounded.
                        </p>
                    </div>
                    <div class="col-lg-5">
                        <div class="welcome-side-card">
                            <img src="{{ asset('img/hg-logo.png') }}" alt="HGSS Logo" class="img-fluid welcome-logo">
                            <h5>Education for Excellent Services</h5>
                            <div class="welcome-points">
                                <span><i class="bi bi-check-circle-fill"></i> O-Level & A-Level</span>
                                <span><i class="bi bi-check-circle-fill"></i> Safe Learning Environment</span>
                                <span><i class="bi bi-check-circle-fill"></i> Character & Discipline</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="home-section why-section" id="why-gogarty">
        <div class="container">
            <div class="section-shell">
                <div class="text-center mb-4">
                    <h2 class="section-title mb-2">Why Choose Us?</h2>
                    <p class="text-muted mb-0">Reasons students and parents trust us for quality education.</p>
                </div>
                <div class="row g-4">
                    <div class="col-sm-6 col-lg-3">
                        <div class="why-card">
                            <i class="bi bi-mortarboard-fill"></i>
                            <h5>Academic Excellence</h5>
                            <p>Strong academic guidance and consistent performance culture.</p>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                        <div class="why-card">
                            <i class="bi bi-building"></i>
                            <h5>Modern Hostel</h5>
                            <p>Comfortable accommodation with structured student support.</p>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                        <div class="why-card">
                            <i class="bi bi-dribbble"></i>
                            <h5>School Games</h5>
                            <p>Sports and co-curricular activities for balanced growth.</p>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                        <div class="why-card">
                            <i class="bi bi-people-fill"></i>
                            <h5>Engaged Community</h5>
                            <p>Close collaboration between teachers, parents, and students.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Application Section -->
    <section class="home-section apply-section" id="about">
        <div class="container">
            <div class="section-shell">
                <div class="text-center mb-4">
                    <h2 class="section-title apply-section-title-clean mb-2">How to Apply?</h2>
                    <p class="text-muted mb-0">Choose your level and follow the required steps below.</p>
                </div>
                <div class="row g-4">
                    <div class="col-lg-6">
                        <div class="feature-box">
                            <i class="bi bi-journal-bookmark-fill feature-icon"></i>
                            <h4>O-level Application</h4>
                            <h6 class="mt-3 text-primary">Important Requirements</h6>
                            <ul class="text-start mt-3">
                                <li>Application Fee: <strong style="color: rgb(40, 94, 175)">TSH 25,000/=</strong></li>
                                <li>Birth Certificate</li>
                                <li>Passport Size Image</li>
                                <li><em>and more requirements... click apply button for application.</em></li>
                            </ul>
                            <div class="mt-4 text-center">
                                <a href="{{ url('/apply/olevel') }}" class="btn btn-warning btn-lg apply-action-btn">
                                    <i class="bi bi-pencil-square"></i> Apply Now (O-level)
                                </a>
                                <p class="text-muted mt-2 small">Application for Form 1</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="feature-box">
                            <i class="bi bi-journal-check feature-icon"></i>
                            <h4>A-level Application</h4>
                            <h6 class="mt-3 text-primary">Important Requirements</h6>
                            <ul class="text-start mt-3">
                                <li>Application Fee: <strong style="color: rgb(40, 94, 175)">TSH 30,000/=</strong></li>
                                <li>O-level Leaving Certificate & Result Slip</li>
                                <li>Birth Certificate & Passport Size Image</li>
                                <li><em>and more requirements... click apply button for application.</em></li>
                            </ul>
                            <div class="mt-4 text-center">
                                <a href="{{ url('/apply/alevel') }}" class="btn btn-success btn-lg apply-action-btn">
                                    <i class="bi bi-journal-plus"></i> Apply Now (A-level)
                                </a>
                                <p class="text-muted mt-2 small">Application for Form 5</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="home-section contact-section" id="contact">
        <div class="container">
            <div class="section-shell">
                <div class="text-center mb-4">
                    <h2 class="section-title mb-2">Contact Us</h2>
                </div>
                <div class="row g-4">
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
            </div>
        </div>
    </section>


@endsection

@section('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const indicator = document.querySelector('.hero-scroll-indicator');
            if (!indicator) return;

            const hideIndicator = () => {
                if (window.scrollY > 20) {
                    indicator.classList.add('is-hidden');
                    window.removeEventListener('scroll', hideIndicator);
                }
            };

            hideIndicator();
            window.addEventListener('scroll', hideIndicator, {
                passive: true
            });
        });
    </script>
@endsection
