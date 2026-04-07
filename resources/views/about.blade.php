@extends('layouts.app')

@section('title', 'About Henry Gogarty Secondary School')

@section('content')
    @php
        $coreValues = [
            ['icon' => 'bi-lightbulb-fill', 'title' => 'Leadership & Creativity', 'text' => 'We help students think boldly, lead wisely and solve real challenges with confidence.'],
            ['icon' => 'bi-people-fill', 'title' => 'Spirituality & Teamwork', 'text' => 'Our learning environment builds faith, respect, cooperation and shared responsibility.'],
            ['icon' => 'bi-shield-check', 'title' => 'Accountability', 'text' => 'Students grow in discipline, honesty and ownership in both academics and daily life.'],
        ];

        $oLevelSubjects = [
            'Civics', 'Basic Mathematics', 'History', 'Geography', 'Biology', 'English Language',
            'Kiswahili', 'Chemistry', 'Physics', 'Book-keeping', 'Commerce', 'Food and Nutrition',
            'Bible Knowledge', 'Computer Science', 'Literature in English', 'Religion',
        ];

        $aLevelCombinations = [
            ['code' => 'HGL', 'subjects' => 'History, Geography, English Language', 'text' => 'Ideal for arts, law, journalism and social science pathways.'],
            ['code' => 'HGE', 'subjects' => 'History, Geography, Economics', 'text' => 'A strong choice for economics, research and public policy interests.'],
            ['code' => 'EGM', 'subjects' => 'Economics, Geography, Mathematics', 'text' => 'Supports future study in finance, planning and analytical fields.'],
            ['code' => 'ECA', 'subjects' => 'Economics, Commerce, Accountancy', 'text' => 'Built for business, entrepreneurship and accounting careers.'],
            ['code' => 'PCM', 'subjects' => 'Physics, Chemistry, Mathematics', 'text' => 'Prepares students for engineering, technology and applied science.'],
            ['code' => 'PCB', 'subjects' => 'Physics, Chemistry, Biology', 'text' => 'A key route for medical and health science careers.'],
            ['code' => 'HKL', 'subjects' => 'History, Kiswahili, English Literature', 'text' => 'Fits careers in law, education, media and communication.'],
            ['code' => 'PMC', 'subjects' => 'Physics, Mathematics, Computer Science', 'text' => 'Designed for IT, software, engineering and data-driven fields.'],
            ['code' => 'PGM', 'subjects' => 'Physics, Geography, Mathematics', 'text' => 'Useful for surveying, architecture, environmental and engineering studies.'],
        ];

        $leadership = [
            ['image' => 'asset/img/hs.jpg', 'name' => 'Sr. Dr. Lucretia Njau (CNDK)', 'role' => 'Head Mistress', 'text' => 'Provides vision, discipline and long-term academic direction for the school community.'],
            ['image' => 'asset/img/academic.jpg', 'name' => 'Mr. Martin Saidi', 'role' => 'Academic Coordinator', 'text' => 'Guides academic quality, classroom progress and student support programs.'],
        ];

    @endphp

    <style>
        .about-page,
        .about-page p,
        .about-page li,
        .about-page span {
            color: #1d2a36;
            font-family: var(--font-body);
        }

        .about-page .home-section {
            font-family: var(--font-body);
            color: #1d2a36;
        }

        .about-page .hero-section {
            min-height: 88vh;
            padding: 54px 0 74px;
        }

        .about-page .hero-copy {
            max-width: 560px;
        }

        .about-page .hero-title {
            max-width: 11ch;
            font-family: "Merriweather", "Montserrat", serif;
            font-weight: 900;
            font-size: clamp(2.3rem, 4vw, 4rem);
            line-height: 1.12;
            letter-spacing: -0.03em;
        }

        .about-page .hero-highlight {
            color: var(--color-primary);
            white-space: nowrap;
        }

        .about-page .hero-title-line {
            display: inline-block;
            white-space: normal;
        }

        .about-page .hero-title-line-secondary {
            display: inline-block;
        }

        .about-page .hero-system-tag {
            margin-top: -0.35rem;
            margin-bottom: 1rem;
            font-family: var(--font-body);
            font-size: 1.18rem;
            font-weight: 800;
            letter-spacing: 0.04em;
        }

        .about-page .hero-kicker {
            display: inline-flex;
            font-family: "Merriweather", "Roboto", serif;
        }

        .about-page .hero-copy .lead,
        .about-page .section-intro,
        .about-story-copy p,
        .about-motto-box p,
        .about-stat-card span,
        .about-combo-card p,
        .about-leader-card p,
        .about-gallery-label,
        .about-testimonial-card p,
        .about-contact-note,
        .about-page .contact-card p {
            color: var(--color-text-muted);
            font-family: var(--font-body);
            font-weight: 400;
            line-height: 1.7;
            letter-spacing: 0.005em;
        }

        .about-page .hero-copy .lead {
            font-size: 1.08rem;
            max-width: 520px;
        }

        .about-page .hero-actions-inline {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            gap: 0.75rem;
        }

        .about-page .hero-actions-inline .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.45rem;
        }

        .about-page .hero-actions-inline .hero-action-btn {
            flex: 1 1 0;
            min-width: 0;
            white-space: nowrap;
            font-family: var(--bs-body-font-family);
            font-weight: 500;
            letter-spacing: 0.01em;
            font-size: 0.8rem;
            padding: 0.7rem 0.75rem;
        }

        .about-page .hero-actions-inline .btn-outline-hero {
            border: 2px solid rgba(16, 152, 212, 0.45);
            background-color: rgba(255, 255, 255, 0.9);
        }

        .about-page .hero-chips-inline {
            display: flex;
            gap: 0.7rem;
            flex-wrap: wrap;
        }

        .about-page .hero-chips-inline > div {
            flex: 1 1 160px;
        }

        .about-page .hero-visual {
            min-height: 610px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }

        .about-page .hero-image-frame {
            width: min(500px, 100%);
        }

        .about-page .hero-logo-frame {
            padding: 8px;
            background: linear-gradient(135deg, rgba(16, 152, 212, 0.92), rgba(94, 196, 238, 0.68));
        }

        .about-page .hero-logo-frame img {
            width: 100%;
            height: 100%;
            padding: 3.25rem;
            border-radius: inherit;
            object-fit: contain;
            display: block;
            background: radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.98), rgba(236, 248, 255, 0.96));
        }

        .about-page .hero-stat-card {
            max-width: 300px;
        }

        .about-story-media {
            position: relative;
        }

        .about-story-image {
            width: 100%;
            border-radius: 18px;
            object-fit: cover;
            border: 1px solid rgba(16, 152, 212, 0.14);
            box-shadow: 0 14px 34px rgba(13, 111, 155, 0.12);
        }

        .about-story-badge {
            position: absolute;
            left: 1rem;
            bottom: 1rem;
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            padding: 0.78rem 1rem;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.94);
            color: var(--color-primary-strong);
            border: 1px solid rgba(16, 152, 212, 0.14);
            box-shadow: 0 16px 30px rgba(13, 111, 155, 0.1);
            font-weight: 600;
        }

        .about-stat-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1rem;
        }

        .about-stat-card {
            padding: 1.2rem 1rem;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.84);
            border: 1px solid rgba(16, 152, 212, 0.14);
            box-shadow: 0 14px 34px rgba(13, 111, 155, 0.12);
        }

        .about-stat-card strong {
            display: block;
            margin-bottom: 0.35rem;
            color: #1d2a36;
            font-family: var(--bs-body-font-family);
            font-size: 1rem;
            font-weight: 500;
            letter-spacing: 0.01em;
        }

        .about-panel {
            height: 100%;
            padding: 1.55rem 1.4rem;
            border-radius: 26px;
            background: rgba(255, 255, 255, 0.96);
            border: 1px solid rgba(16, 152, 212, 0.12);
            box-shadow: 0 20px 34px rgba(13, 111, 155, 0.08);
        }

        .about-page .section-title,
        .about-panel h3,
        .about-page .feature-box h4,
        .about-page .why-card h5,
        .about-page .contact-card h5,
        .about-combo-card h4,
        .about-leader-card h4,
        .about-testimonial-card h4 {
            font-family: var(--bs-body-font-family);
            font-weight: 500;
            letter-spacing: 0.01em;
            color: #1d2a36;
        }

        .about-page .section-title {
            font-size: clamp(1.55rem, 3vw, 1.95rem);
            margin-bottom: 0.9rem;
        }

        .about-page .section-title::after {
            width: 56px;
            height: 2px;
            margin-top: 0.8rem;
            opacity: 0.45;
        }

        .about-icon {
            width: 54px;
            height: 54px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 18px;
            background: rgba(16, 152, 212, 0.1);
            color: var(--color-primary);
            font-size: 1.35rem;
            margin-bottom: 1rem;
        }

        .about-subject-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 0.9rem;
        }

        .about-subject-pill {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 62px;
            padding: 0.95rem 1rem;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.84);
            border: 1px solid rgba(16, 152, 212, 0.14);
            box-shadow: 0 14px 34px rgba(13, 111, 155, 0.12);
            color: var(--color-primary-strong);
            font-family: var(--bs-body-font-family);
            font-weight: 500;
            text-align: center;
        }

        .about-combo-card {
            height: 100%;
            padding: 1.45rem 1.35rem;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.84);
            border: 1px solid rgba(16, 152, 212, 0.14);
            box-shadow: 0 14px 34px rgba(13, 111, 155, 0.12);
        }

        .about-combo-code {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 64px;
            padding: 0.45rem 0.85rem;
            margin-bottom: 0.95rem;
            border-radius: 999px;
            background: rgba(16, 152, 212, 0.1);
            color: var(--color-primary-strong);
            font-weight: 700;
        }

        .about-combo-card h4 {
            margin-bottom: 0.65rem;
            font-size: 1rem;
        }

        .about-leader-card,
        .about-testimonial-card,
        .about-gallery-card {
            height: 100%;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.84);
            border: 1px solid rgba(16, 152, 212, 0.14);
            box-shadow: 0 14px 34px rgba(13, 111, 155, 0.12);
            overflow: hidden;
        }

        .about-leader-card {
            padding: 1.6rem 1.35rem;
            text-align: center;
        }

        .about-leader-image,
        .about-testimonial-image {
            width: 112px;
            height: 112px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid rgba(16, 152, 212, 0.16);
            box-shadow: 0 16px 28px rgba(13, 111, 155, 0.12);
        }

        .about-leader-card h4,
        .about-testimonial-card h4 {
            margin: 1rem 0 0.35rem;
            font-size: 1rem;
        }

        .about-role-label {
            display: inline-block;
            margin-bottom: 0.8rem;
            color: var(--color-primary);
            font-weight: 600;
        }

        .about-testimonial-card {
            padding: 1.25rem;
        }

        .about-testimonial-card {
            display: flex;
            gap: 1rem;
            align-items: flex-start;
        }

        .about-testimonial-quote {
            margin: 0.55rem 0 0;
            font-style: italic;
        }

        .about-cta-panel {
            padding: 2rem 1.5rem;
            border-radius: 30px;
            background:
                radial-gradient(circle at top left, rgba(94, 196, 238, 0.18), transparent 26%),
                linear-gradient(135deg, #0d6f9b 0%, #1098d4 100%);
            color: #ffffff;
            text-align: center;
            box-shadow: 0 24px 42px rgba(13, 111, 155, 0.16);
        }

        .about-cta-panel h2,
        .about-cta-panel p {
            color: #ffffff;
        }

        .about-cta-panel h2 {
            font-family: var(--bs-body-font-family);
            font-size: clamp(1.6rem, 3vw, 2rem);
            font-weight: 500;
            letter-spacing: 0.01em;
            line-height: 1.2;
        }

        .about-cta-actions {
            display: flex;
            justify-content: center;
            gap: 0.85rem;
            flex-wrap: wrap;
            margin-top: 1.25rem;
        }

        .about-page .contact-link {
            color: var(--color-primary-strong);
            text-decoration: none;
        }

        .about-page .contact-link:hover,
        .about-page .contact-link:focus {
            color: var(--color-primary);
        }

        @media (max-width: 991.98px) {
            .about-subject-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }
        }

        @media (max-width: 767.98px) {
            .about-subject-grid,
            .about-stat-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .about-testimonial-card {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
        }

        @media (max-width: 575.98px) {
            .about-page .hero-section {
                padding: 50px 0 66px;
                min-height: auto;
            }

            .about-page .hero-visual {
                min-height: auto;
                margin-top: -1.35rem;
                justify-content: center;
            }

            .about-page .hero-image-frame {
                width: min(calc(100vw - 56px), 320px);
                margin: 0 auto;
            }

            .about-page .hero-title {
                font-size: clamp(1.75rem, 7vw, 2.15rem);
                max-width: none;
            }

            .about-page .hero-system-tag,
            .about-page .hero-copy .lead,
            .section-intro,
            .about-story-copy p,
            .about-motto-box p,
            .about-combo-card p,
            .about-leader-card p,
            .about-gallery-label,
            .about-testimonial-card p,
            .about-contact-note {
                font-size: 0.93rem;
            }

            .about-page .section-title {
                font-size: 1.38rem;
                font-weight: 500;
                letter-spacing: 0.008em;
                margin-bottom: 0.75rem;
            }

            .about-page .section-title::after {
                width: 44px;
                margin-top: 0.65rem;
            }

            .about-subject-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 0.6rem;
            }

            .about-stat-grid {
                grid-template-columns: 1fr;
            }

            .about-gallery-image {
                height: 220px;
            }

            .about-page .hero-logo-frame img {
                padding: 2rem;
            }

            .about-subject-pill {
                min-height: 54px;
                padding: 0.75rem 0.55rem;
                font-size: 0.82rem;
                font-weight: 400;
            }
        }

        @media (min-width: 576px) {
            .about-page .hero-actions-inline .hero-action-btn {
                flex: 0 1 auto;
                font-size: 0.92rem;
                padding: 0.82rem 1.2rem;
            }
        }

        @media (min-width: 992px) {
            .about-page .hero-copy {
                max-width: 620px;
            }

            .about-page .hero-title {
                max-width: none;
                font-size: clamp(2.4rem, 3.6vw, 3.8rem);
            }

            .about-page .hero-title-line,
            .about-page .hero-title-line-secondary {
                white-space: nowrap;
            }

            .about-page .hero-image-frame {
                width: min(440px, 100%);
            }

            .about-page .hero-visual {
                min-height: 560px;
                justify-content: center;
            }

            .about-page .hero-actions-inline .hero-action-btn {
                font-size: 1rem;
                padding: 0.95rem 1.65rem;
            }

        }
    </style>

    <div class="about-page">
        <section class="hero-section" id="about-top">
            <div class="hero-pattern" aria-hidden="true"></div>
            <div class="hero-bubbles" aria-hidden="true">
                <span class="hero-bubble hero-bubble-one"></span>
                <span class="hero-bubble hero-bubble-two"></span>
                <span class="hero-bubble hero-bubble-three"></span>
            </div>

            <div class="container hero-content">
                <div class="row align-items-center g-4 g-lg-5 hero-grid">
                    <div class="col-lg-6">
                        <div class="hero-copy">
                            <h1 class="hero-title mb-3">
                                <span class="hero-highlight">About</span><br>
                                <span class="hero-title-line">Henry Gogarty Secondary School</span>
                            </h1>

                            <div class="hero-system-tag">Education, discipline and innovation for future leaders</div>

                            <p class="lead mb-4">
                                Henry Gogarty Secondary School is a private, faith-based school in Makumira, Arusha,
                                committed to academic excellence, strong values and holistic student growth.
                            </p>

                            <div class="hero-actions hero-actions-inline">
                                <a href="#contact" class="btn btn-primary btn-lg hero-action-btn">
                                    <i class="bi bi-envelope-at-fill"></i> Contact Us
                                </a>
                                <a href="{{ url('/apply') }}" class="btn btn-outline-hero btn-lg hero-action-btn">
                                    <i class="bi bi-journal-plus"></i> Start Application
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="hero-visual">
                            <div class="hero-orbit hero-orbit-one" aria-hidden="true"></div>
                            <div class="hero-image-frame hero-logo-frame">
                                <img src="{{ asset('img/hg-logo.png') }}" alt="Henry Gogarty Secondary School logo">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <a href="#mission-vision" class="hero-scroll-indicator" aria-label="Scroll to mission and vision section">
                <span>Scroll to Explore</span>
                <i class="bi bi-chevron-double-down"></i>
            </a>
        </section>

        <section class="home-section" id="mission-vision">
            <div class="container">
                <div class="section-shell">
                    <div class="text-center mb-4">
                        <h2 class="section-title mb-2">Mission & Vision</h2>
                        <p class="section-intro mb-0">
                            Our direction is built on academic achievement, discipline and values that prepare students
                            for meaningful participation in a changing world.
                        </p>
                    </div>

                    <div class="row g-4">
                        <div class="col-lg-6">
                            <div class="feature-box h-100">
                                <div class="about-icon">
                                    <i class="bi bi-bullseye"></i>
                                </div>
                                <h4>Our Mission</h4>
                                <p class="mb-0">
                                    To promote students' academic achievement, discipline and talents in a supportive and
                                    well-guided environment.
                                </p>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div class="feature-box h-100">
                                <div class="about-icon">
                                    <i class="bi bi-eye-fill"></i>
                                </div>
                                <h4>Our Vision</h4>
                                <p class="mb-0">
                                    To help students gain excellent knowledge, skills, values and attitudes for global
                                    competition and responsible service.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="home-section" id="values">
            <div class="container">
                <div class="section-shell">
                    <div class="text-center mb-4">
                        <h2 class="section-title mb-2">Our Core Values</h2>
                        <p class="section-intro mb-0">
                            The school culture at HGSS helps students grow in character, purpose and everyday responsibility.
                        </p>
                    </div>

                    <div class="row g-4">
                        @foreach ($coreValues as $value)
                            <div class="col-md-6 col-lg-4">
                                <div class="why-card h-100">
                                    <i class="bi {{ $value['icon'] }}"></i>
                                    <h5>{{ $value['title'] }}</h5>
                                    <p>{{ $value['text'] }}</p>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </section>

        <section class="home-section" id="subjects">
            <div class="container">
                <div class="section-shell">
                    <div class="text-center mb-4">
                        <h2 class="section-title mb-2">O-Level Subjects</h2>
                        <p class="section-intro mb-0">
                            We offer a broad subject range that supports both academic strength and practical understanding.
                        </p>
                    </div>

                    <div class="about-subject-grid">
                        @foreach ($oLevelSubjects as $subject)
                            <div class="about-subject-pill">{{ $subject }}</div>
                        @endforeach
                    </div>
                </div>
            </div>
        </section>

        <section class="home-section" id="combinations">
            <div class="container">
                <div class="section-shell">
                    <div class="text-center mb-4">
                        <h2 class="section-title mb-2">A-Level Combinations</h2>
                        <p class="section-intro mb-0">
                            Our combinations are designed to support different academic interests and future career paths.
                        </p>
                    </div>

                    <div class="row g-4">
                        @foreach ($aLevelCombinations as $combination)
                            <div class="col-md-6 col-xl-4">
                                <article class="about-combo-card">
                                    <div class="about-combo-code">{{ $combination['code'] }}</div>
                                    <h4>{{ $combination['subjects'] }}</h4>
                                    <p class="mb-0">{{ $combination['text'] }}</p>
                                </article>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </section>

        <section class="home-section" id="leadership">
            <div class="container">
                <div class="section-shell">
                    <div class="text-center mb-4">
                        <h2 class="section-title mb-2">Meet Our Leadership</h2>
                        <p class="section-intro mb-0">
                            Our leadership team works to keep learning focused, structured and supportive for every student.
                        </p>
                    </div>

                    <div class="row justify-content-center g-4">
                        @foreach ($leadership as $leader)
                            <div class="col-md-6 col-lg-5">
                                <article class="about-leader-card">
                                    <img src="{{ asset($leader['image']) }}" alt="{{ $leader['name'] }}" class="about-leader-image">
                                    <h4>{{ $leader['name'] }}</h4>
                                    <span class="about-role-label">{{ $leader['role'] }}</span>
                                    <p class="mb-0">{{ $leader['text'] }}</p>
                                </article>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </section>

        <section class="home-section" id="contact">
            <div class="container">
                <div class="section-shell">
                    <div class="text-center mb-4">
                        <h2 class="section-title mb-2">Contact Information</h2>
                        <p class="section-intro mb-0">
                            Reach us directly for admissions, school details or any question about the learning experience at HGSS.
                        </p>
                    </div>

                    <div class="row g-4">
                        <div class="col-md-6 col-lg-3">
                            <div class="card contact-card h-100">
                                <div class="card-body p-4">
                                    <i class="bi bi-geo-alt-fill feature-icon"></i>
                                    <h5>Address</h5>
                                    <p class="mb-0">P.O. Box 1169, Arusha, Tanzania</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 col-lg-3">
                            <div class="card contact-card h-100">
                                <div class="card-body p-4">
                                    <i class="bi bi-telephone-fill feature-icon"></i>
                                    <h5>Phone Numbers</h5>
                                    <p class="mb-0">
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
                                    <p class="mb-0">
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
                                    <p class="mb-0">Monday - Friday: 8:00 - 17:00<br>Saturday: 9:00 - 14:00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="about-cta-panel mt-4">
                        <h2 class="mb-3">Ready to Join Henry Gogarty?</h2>
                        <p class="mb-0">
                            Explore admissions, connect with the school team and take the next step toward a strong academic journey.
                        </p>
                        <div class="about-cta-actions">
                            <a href="{{ url('/apply') }}" class="btn btn-light btn-lg">
                                <i class="bi bi-journal-plus"></i> Apply Now
                            </a>
                            <a href="/" class="btn btn-outline-light btn-lg">
                                <i class="bi bi-house-door"></i> Back Home
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
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
