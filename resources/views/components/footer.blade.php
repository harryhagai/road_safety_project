<footer class="footer-wrapper">
    <div class="footer-container">
        <div class="footer-line">
            <div class="footer-copyright">
                &copy; {{ date('Y') }} <span class="footer-school-name">Road Safety Reporting System</span>. All Rights Reserved.
            </div>
            
            <div class="footer-nav-slim">
                <a href="/">Home</a>
                <span class="footer-dot">&middot;</span>
                <a href="/about">About</a>
                <span class="footer-dot">&middot;</span>
                <a href="{{ route('contact') }}">Contact</a>
                <span class="footer-dot">&middot;</span>
                <a href="{{ route('developer') }}" class="footer-dev-link">Developer</a>
            </div>
        </div>
    </div>
</footer>
