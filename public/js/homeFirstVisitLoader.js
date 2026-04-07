(function () {
    if (window.homeFirstVisitLoaderInitialized) return;
    window.homeFirstVisitLoaderInitialized = true;

    const storageKey = 'hgss-home-loader-seen';

    try {
        if (window.localStorage.getItem(storageKey) === '1') {
            return;
        }
    } catch (error) {
        // Ignore storage access issues and continue showing the loader once.
    }

    const start = Date.now();
    const minVisibleMs = 1200;

    const loader = document.createElement('div');
    loader.id = 'home-first-visit-loader';
    loader.innerHTML = `
        <div class="home-first-visit-loader__pattern" aria-hidden="true"></div>
        <div class="home-first-visit-loader__bubbles" aria-hidden="true">
            <span class="bubble bubble-one"></span>
            <span class="bubble bubble-two"></span>
            <span class="bubble bubble-three"></span>
        </div>
        <div class="home-first-visit-loader__card">
            <div class="home-first-visit-loader__logo-wrap">
                <div class="home-first-visit-loader__logo-ring"></div>
                <img src="/img/hg-logo.png" alt="HGSS Logo" class="home-first-visit-loader__logo">
            </div>
            <div class="home-first-visit-loader__eyebrow">HGSS-SIMS</div>
            <h2>Preparing your school portal</h2>
            <p>Loading the homepage experience for your first visit.</p>
            <div class="home-first-visit-loader__progress" aria-hidden="true">
                <div class="home-first-visit-loader__progress-track"></div>
                <div class="home-first-visit-loader__progress-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
        <style>
            #home-first-visit-loader {
                position: fixed;
                inset: 0;
                z-index: 3000;
                display: flex;
                align-items: center;
                justify-content: center;
                background:
                    radial-gradient(circle at 12% 18%, rgba(94, 196, 238, 0.24), transparent 22%),
                    radial-gradient(circle at 88% 24%, rgba(16, 152, 212, 0.16), transparent 18%),
                    linear-gradient(135deg, #f9feff 0%, #eefaff 45%, #ffffff 100%);
                opacity: 1;
                transition: opacity 0.45s ease, visibility 0.45s ease;
                overflow: hidden;
            }

            #home-first-visit-loader.is-hidden {
                opacity: 0;
                visibility: hidden;
            }

            .home-first-visit-loader__pattern {
                position: absolute;
                inset: 0;
                background-image:
                    radial-gradient(circle at 10px 10px, rgba(16, 152, 212, 0.08) 1.2px, transparent 0),
                    radial-gradient(circle at 30px 28px, rgba(94, 196, 238, 0.08) 1px, transparent 0);
                background-size: 42px 42px, 58px 58px;
                opacity: 0.45;
            }

            .home-first-visit-loader__bubbles {
                position: absolute;
                inset: 0;
            }

            .home-first-visit-loader__bubbles .bubble {
                position: absolute;
                border-radius: 50%;
                background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.55), rgba(94, 196, 238, 0.2) 55%, rgba(94, 196, 238, 0.08) 100%);
                filter: blur(1px);
                opacity: 0.55;
                animation: homeLoaderFloat 14s ease-in-out infinite;
            }

            .home-first-visit-loader__bubbles .bubble-one {
                width: 300px;
                height: 300px;
                left: -80px;
                top: 12%;
            }

            .home-first-visit-loader__bubbles .bubble-two {
                width: 260px;
                height: 260px;
                right: 14%;
                top: 8%;
                animation-delay: 2.5s;
            }

            .home-first-visit-loader__bubbles .bubble-three {
                width: 360px;
                height: 360px;
                right: -120px;
                bottom: -80px;
                animation-delay: 1.5s;
            }

            .home-first-visit-loader__card {
                position: relative;
                z-index: 1;
                width: min(420px, calc(100vw - 32px));
                padding: 2rem 1.6rem;
                border-radius: 28px;
                background: rgba(255, 255, 255, 0.78);
                border: 1px solid rgba(16, 152, 212, 0.14);
                box-shadow: 0 24px 54px rgba(13, 111, 155, 0.14);
                backdrop-filter: blur(16px);
                text-align: center;
            }

            .home-first-visit-loader__logo-wrap {
                position: relative;
                width: 92px;
                height: 92px;
                margin: 0 auto 1.1rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .home-first-visit-loader__logo-ring {
                position: absolute;
                inset: 0;
                border-radius: 50%;
                border: 2px solid rgba(16, 152, 212, 0.18);
                border-top-color: rgba(16, 152, 212, 0.65);
                animation: homeLoaderSpin 1.1s linear infinite;
            }

            .home-first-visit-loader__logo {
                width: 58px;
                height: 58px;
                object-fit: contain;
                border-radius: 18px;
                background: #ffffff;
                padding: 0.35rem;
                box-shadow: 0 10px 24px rgba(13, 111, 155, 0.12);
            }

            .home-first-visit-loader__eyebrow {
                display: inline-flex;
                padding: 0.45rem 0.8rem;
                border-radius: 999px;
                margin-bottom: 0.95rem;
                color: #0d6f9b;
                background: rgba(16, 152, 212, 0.1);
                border: 1px solid rgba(16, 152, 212, 0.16);
                font: 700 0.78rem/1 "Roboto", sans-serif;
                letter-spacing: 0.08em;
                text-transform: uppercase;
            }

            .home-first-visit-loader__card h2 {
                margin: 0 0 0.65rem;
                color: #102f45;
                font: 700 clamp(1.6rem, 3vw, 2rem)/1.15 "Roboto", sans-serif;
            }

            .home-first-visit-loader__card p {
                margin: 0;
                color: #516d80;
                font: 400 0.98rem/1.7 "Open Sans", sans-serif;
            }

            .home-first-visit-loader__progress {
                position: relative;
                width: min(180px, 70%);
                height: 12px;
                margin-top: 1.25rem;
            }

            .home-first-visit-loader__progress-track {
                position: absolute;
                left: 0;
                right: 0;
                top: 50%;
                height: 2px;
                transform: translateY(-50%);
                background-image: radial-gradient(circle, rgba(16, 152, 212, 0.3) 1px, transparent 1.6px);
                background-size: 10px 2px;
                background-repeat: repeat-x;
                opacity: 0.95;
            }

            .home-first-visit-loader__progress-dots {
                position: absolute;
                left: 0;
                top: 50%;
                display: flex;
                gap: 0.38rem;
                transform: translateY(-50%);
                animation: homeLoaderDotTravel 1.5s ease-in-out infinite;
            }

            .home-first-visit-loader__progress-dots span {
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: rgba(16, 152, 212, 0.78);
                box-shadow: 0 0 0 2px rgba(16, 152, 212, 0.08);
            }

            @keyframes homeLoaderSpin {
                to { transform: rotate(360deg); }
            }

            @keyframes homeLoaderDotTravel {
                0% {
                    left: 0;
                    opacity: 0.4;
                }

                20%,
                80% {
                    opacity: 1;
                }

                100% {
                    left: calc(100% - 40px);
                    opacity: 0.45;
                }
            }

            @keyframes homeLoaderFloat {
                0%, 100% { transform: translateY(0) scale(1); }
                50% { transform: translateY(-16px) scale(1.03); }
            }
        </style>
    `;

    document.body.appendChild(loader);

    function finishLoader() {
        const elapsed = Date.now() - start;
        const waitTime = Math.max(0, minVisibleMs - elapsed);

        window.setTimeout(function () {
            loader.classList.add('is-hidden');

            window.setTimeout(function () {
                loader.remove();
            }, 500);

            try {
                window.localStorage.setItem(storageKey, '1');
            } catch (error) {
                // Ignore storage issues.
            }
        }, waitTime);
    }

    if (document.readyState === 'complete') {
        finishLoader();
    } else {
        window.addEventListener('load', finishLoader, { once: true });
    }
})();
