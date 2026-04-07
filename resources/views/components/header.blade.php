<header class="header-wrapper">
    <div class="header-container">
        <div class="header-branding">
            <div class="header-logo">
                <img src="{{ asset('img/hg-logo.png') }}" alt="Henry Gogarty Logo"
                    style="height: 50px; border-radius: 50%;" />
            </div>
            <span class="header-name">
                <span class="header-title">Henry Gogarty</span>
                <span class="header-subtitle">Secondary school</span>
            </span>

        </div>

        <button class="header-toggle" id="navToggle" aria-label="Toggle Menu" aria-expanded="false" aria-controls="mainNav">
            <span class="header-toggle-line"></span>
            <span class="header-toggle-line"></span>
            <span class="header-toggle-line"></span>
        </button>

        <nav class="header-nav" id="mainNav">
            @php
                $currentPath = trim(request()->path(), '/');
            @endphp
            <ul>
                <li><a href="/" class="{{ $currentPath === '' ? 'active' : '' }}"><i class="bi bi-house-door"></i> Home</a></li>
                <li><a href="/about" class="{{ $currentPath === 'about' ? 'active' : '' }}"><i class="bi bi-info-circle"></i> About us</a></li>
                <li><a href="{{ route('contact') }}" class="{{ $currentPath === 'contact' ? 'active' : '' }}"><i class="bi bi-envelope-paper"></i> Contact</a></li>
                <li><a href="/news-events" class="{{ $currentPath === 'news-events' ? 'active' : '' }}"><i class="bi bi-megaphone"></i> News</a></li>
                <li><a href="{{ route('developer') }}" class="{{ $currentPath === 'developers' ? 'active' : '' }}"><i class="bi bi-code-slash"></i> Developers</a></li>
                <li><a href="/login" class="{{ $currentPath === 'login' ? 'active' : '' }}"><i class="bi bi-person-circle"></i> Login</a></li>
            </ul>
        </nav>
    </div>
</header>
