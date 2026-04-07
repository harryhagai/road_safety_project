@extends('layouts.app')

@section('title', 'Developers')

@section('content')
    <style>
        .developer-section {
            position: relative;
            padding: 72px 0 82px;
            background:
                radial-gradient(circle at 8% 18%, rgba(94, 196, 238, 0.18), transparent 18%),
                linear-gradient(180deg, #ffffff 0%, #f8fdff 100%);
        }

        .developer-section::before {
            content: "";
            position: absolute;
            inset: 0;
            background-image:
                radial-gradient(circle at 12px 12px, rgba(16, 152, 212, 0.06) 1.1px, transparent 0),
                radial-gradient(circle at 34px 30px, rgba(94, 196, 238, 0.07) 1px, transparent 0);
            background-size: 46px 46px, 62px 62px;
            opacity: 0.45;
            pointer-events: none;
        }

        .developer-section > .container {
            position: relative;
            z-index: 1;
        }

        .developer-intro {
            max-width: 760px;
            margin: 0 auto 2.5rem;
            text-align: center;
            color: var(--color-text-muted);
            line-height: 1.8;
        }

        .developer-card {
            position: relative;
            height: 100%;
            padding: 2rem 1.7rem;
            border-radius: 30px;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(16, 152, 212, 0.14);
            box-shadow: 0 24px 42px rgba(13, 111, 155, 0.1);
            overflow: hidden;
        }

        .developer-card-media {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.95rem;
            margin-bottom: 1.35rem;
            text-align: center;
        }

        .developer-card-avatar {
            width: 110px;
            height: 110px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid rgba(16, 152, 212, 0.22);
            box-shadow: 0 14px 28px rgba(13, 111, 155, 0.12);
            background: #ffffff;
        }

        .developer-card-name {
            margin: 0 0 0.3rem;
            color: var(--color-primary-strong);
            font-family: var(--font-heading);
            font-weight: 600;
            font-size: 1.55rem;
        }

        .developer-card-role {
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            padding: 0.46rem 0.78rem;
            border-radius: 999px;
            background: rgba(16, 152, 212, 0.08);
            color: var(--color-primary-strong);
            font-size: 0.92rem;
            font-weight: 500;
        }

        .developer-card-copy {
            color: var(--color-text-muted);
            line-height: 1.7;
            font-size: 0.97rem;
            margin-bottom: 1.1rem;
            text-align: center;
        }

        .developer-focus-list {
            display: grid;
            gap: 0.6rem;
            margin-bottom: 1.3rem;
            padding: 0;
            list-style: none;
        }

        .developer-focus-item {
            display: flex;
            align-items: flex-start;
            gap: 0.7rem;
            color: var(--color-text-muted);
            line-height: 1.65;
        }

        .developer-focus-item i {
            color: var(--color-primary);
            margin-top: 0.15rem;
        }

        .developer-contact-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
        }

        .developer-contact-chip {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.78rem 1rem;
            border-radius: 999px;
            background: rgba(243, 251, 255, 0.94);
            border: 1px solid rgba(16, 152, 212, 0.16);
            color: var(--color-primary-strong);
            text-decoration: none;
            font-size: 0.92rem;
            transition: transform 0.22s ease, background-color 0.22s ease, border-color 0.22s ease;
        }

        .developer-contact-chip:hover,
        .developer-contact-chip:focus {
            transform: translateY(-2px);
            background: rgba(255, 255, 255, 1);
            border-color: rgba(16, 152, 212, 0.3);
            color: var(--color-primary);
        }

        .developer-summary-grid {
            margin-top: 2.6rem;
        }

        .developer-summary-card {
            height: 100%;
            padding: 1.7rem 1.5rem;
            border-radius: 26px;
            background: rgba(255, 255, 255, 0.96);
            border: 1px solid rgba(16, 152, 212, 0.12);
            box-shadow: 0 18px 34px rgba(13, 111, 155, 0.08);
        }

        .developer-summary-card h3 {
            display: flex;
            align-items: center;
            gap: 0.65rem;
            margin: 0 0 0.9rem;
            color: var(--color-primary-strong);
            font-family: var(--font-heading);
            font-size: 1.2rem;
            font-weight: 600;
        }

        .developer-summary-card p,
        .developer-summary-card li {
            color: var(--color-text-muted);
            line-height: 1.75;
        }

        .developer-summary-card ul {
            padding-left: 1rem;
            margin: 0;
        }

        @media (max-width: 575.98px) {
            .developer-section {
                padding: 56px 0 72px;
            }

            .developer-card {
                padding: 1.5rem 1.1rem;
                border-radius: 24px;
            }

            .developer-card-media {
                gap: 0.85rem;
            }

            .developer-card-avatar {
                width: 88px;
                height: 88px;
            }

            .developer-card-name {
                font-size: 1.28rem;
            }

            .developer-contact-row {
                gap: 0.6rem;
            }

            .developer-contact-chip {
                width: 100%;
                justify-content: center;
            }
        }
    </style>

    <section class="developer-section" id="developer-team">
        <div class="container">
            <h2 class="section-title">Developers</h2>
            <p class="developer-intro">
                Our team builds a school system that is clear, reliable and easy to use every day.
            </p>

            <div class="row g-4">
                <div class="col-lg-6">
                    <article class="developer-card">
                        <header class="developer-card-media">
                            <img src="{{ asset('asset/img/hagai.jpg') }}" alt="Hagai Harold Ngobey" class="developer-card-avatar">
                            <div>
                                <h3 class="developer-card-name">Hagai Harold Ngobey</h3>
                                <div class="developer-card-role">
                                    <i class="bi bi-person-gear"></i>
                                    <span>Full Stack Developer</span>
                                </div>
                            </div>
                        </header>

                        <p class="developer-card-copy">
                            Builds core system features, clean interfaces and stable backend logic for daily school operations.
                        </p>

                        <ul class="developer-focus-list">
                            <li class="developer-focus-item">
                                <i class="bi bi-check2-circle"></i>
                                <span>Full system development</span>
                            </li>
                            <li class="developer-focus-item">
                                <i class="bi bi-check2-circle"></i>
                                <span>Database and feature integration</span>
                            </li>
                            <li class="developer-focus-item">
                                <i class="bi bi-check2-circle"></i>
                                <span>Responsive UI improvement</span>
                            </li>
                        </ul>

                        <div class="developer-contact-row">
                            <a href="tel:+255622070303" class="developer-contact-chip">
                                <i class="bi bi-telephone-fill"></i>
                                <span>+255 622 070 303</span>
                            </a>
                            <a href="https://wa.me/255765384905" class="developer-contact-chip" target="_blank" rel="noopener">
                                <i class="bi bi-whatsapp"></i>
                                <span>+255 765 384 905</span>
                            </a>
                            <a href="mailto:hngobey@gmail.com" class="developer-contact-chip">
                                <i class="bi bi-envelope-fill"></i>
                                <span>hngobey@gmail.com</span>
                            </a>
                        </div>
                    </article>
                </div>

                <div class="col-lg-6">
                    <article class="developer-card">
                        <header class="developer-card-media">
                            <img src="{{ asset('asset/img/daniel.JPG') }}" alt="Daniel Noah Laizer" class="developer-card-avatar">
                            <div>
                                <h3 class="developer-card-name">Daniel Noah Laizer</h3>
                                <div class="developer-card-role">
                                    <i class="bi bi-hdd-network"></i>
                                    <span>Server Specialist</span>
                                </div>
                            </div>
                        </header>

                        <p class="developer-card-copy">
                            Manages servers, deployment and technical support to keep the platform fast, secure and available.
                        </p>

                        <ul class="developer-focus-list">
                            <li class="developer-focus-item">
                                <i class="bi bi-check2-circle"></i>
                                <span>Server setup and deployment</span>
                            </li>
                            <li class="developer-focus-item">
                                <i class="bi bi-check2-circle"></i>
                                <span>Backend technical support</span>
                            </li>
                            <li class="developer-focus-item">
                                <i class="bi bi-check2-circle"></i>
                                <span>Performance and reliability</span>
                            </li>
                        </ul>

                        <div class="developer-contact-row">
                            <a href="tel:+255689404471" class="developer-contact-chip">
                                <i class="bi bi-telephone-fill"></i>
                                <span>+255 689 404 471</span>
                            </a>
                            <a href="https://wa.me/255689404471" class="developer-contact-chip" target="_blank" rel="noopener">
                                <i class="bi bi-whatsapp"></i>
                                <span>WhatsApp</span>
                            </a>
                            <a href="mailto:sirlaizerdnl@gmail.com" class="developer-contact-chip">
                                <i class="bi bi-envelope-fill"></i>
                                <span>sirlaizerdnl@gmail.com</span>
                            </a>
                        </div>
                    </article>
                </div>
            </div>

            <div class="row g-4 developer-summary-grid">
                <div class="col-lg-7">
                    <div class="developer-summary-card">
                        <h3>
                            <i class="bi bi-cpu"></i>
                            <span>System logic</span>
                        </h3>
                        <p>
                            We build smart workflows for records, reports and secure user actions.
                        </p>
                    </div>
                </div>

                <div class="col-lg-5">
                    <div class="developer-summary-card">
                        <h3>
                            <i class="bi bi-life-preserver"></i>
                            <span>Support</span>
                        </h3>
                        <ul>
                            <li>Share the page or issue you found.</li>
                            <li>Send a screenshot or short message.</li>
                            <li>Reach the team directly when needed.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection
