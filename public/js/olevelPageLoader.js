// olevelPageLoader.js
// Adds a fast, interactive loader with percentage progress for O-Level pages

(function() {
    if (window.olevelPageLoaderInitialized) return;
    window.olevelPageLoaderInitialized = true;

        // School logo URL (update this to your actual logo path if needed)
        var logoUrl = '/img/hg-logo.png'; // Place your logo in public/img/

        // Create loader overlay if not present
        let loader = document.getElementById('page-loader');
        if (!loader) {
                loader = document.createElement('div');
                loader.id = 'page-loader';
                loader.style.position = 'fixed';
                loader.style.zIndex = '2000';
                loader.style.top = '0';
                loader.style.left = '0';
                loader.style.width = '100vw';
                loader.style.height = '100vh';
                loader.style.background = 'rgba(255,255,255,0.95)';
                loader.style.display = 'flex';
                loader.style.alignItems = 'center';
                loader.style.justifyContent = 'center';
                loader.style.transition = 'opacity 0.3s';
                loader.innerHTML = `
                        <div class="text-center">
                                <div style="display:flex;justify-content:center;align-items:center;">
                                    <div style="width:90px;height:90px;border-radius:50%;background:#fff;box-shadow:0 0 16px #e3e3e3;display:flex;align-items:center;justify-content:center;animation:bounceLogo 1.2s infinite alternate;">
                                        <img src="${logoUrl}" alt="School Logo" style="width:60px;height:60px;object-fit:contain;">
                                    </div>
                                </div>
                                <div class="progress mt-4" style="height: 2.5rem; width: 300px;">
                                    <div id="page-loader-bar" class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: 0%"></div>
                                </div>
                                <div class="mt-3 fw-bold text-primary fs-5" id="page-loader-label">Loading...</div>
                        </div>
                        <style>
                        @keyframes bounceLogo {
                                0% { transform: translateY(0); }
                                60% { transform: translateY(-18px); }
                                100% { transform: translateY(0); }
                        }
                        </style>
                `;
                document.body.appendChild(loader);
        }

    // Show loader instantly on navigation
    function showLoader() {
        loader.style.display = 'flex';
        loader.style.opacity = 1;
        setProgress(5);
        setLabel('Loading...');
    }
    function setProgress(percent) {
        const bar = document.getElementById('page-loader-bar');
        if (bar) bar.style.width = percent + '%';
    }
    function setLabel(text) {
        const label = document.getElementById('page-loader-label');
        if (label) label.textContent = text;
    }
    function hideLoader() {
        setProgress(100);
        setLabel('Done!');
        setTimeout(() => {
            loader.style.opacity = 0;
            setTimeout(() => loader.style.display = 'none', 300);
        }, 300);
    }

    // Listen for all sidebar link clicks
    document.addEventListener('DOMContentLoaded', function() {
        // Sidebar links
        document.querySelectorAll('.o-level-sidebar a').forEach(function(link) {
            link.addEventListener('click', function(e) {
                // Only for internal links
                if (link.hostname === window.location.hostname && link.href !== window.location.href) {
                    e.preventDefault();
                    showLoader();
                    let percent = 5;
                    setProgress(percent);
                    setLabel('Loading...');
                    const interval = setInterval(() => {
                        percent += Math.floor(Math.random() * 15) + 5;
                        if (percent >= 90) percent = 90;
                        setProgress(percent);
                        if (percent >= 90) clearInterval(interval);
                    }, 60);
                    // Wait a short moment for loader to show, then navigate
                    setTimeout(() => {
                        window.location = link.href;
                    }, 120);
                }
            });
        });
    });

    // On page load, animate to 100%
    window.addEventListener('DOMContentLoaded', function() {
        let percent = 5;
        setProgress(percent);
        setLabel('Loading...');
        const interval = setInterval(() => {
            percent += Math.floor(Math.random() * 20) + 10;
            setProgress(percent);
            if (percent >= 100) {
                setProgress(100);
                setLabel('Done!');
                clearInterval(interval);
                setTimeout(hideLoader, 300);
            }
        }, 40);
    });

    // Hide loader if page is already loaded
    window.addEventListener('load', hideLoader);
})();
