<footer class="footer-wrapper">
  @php
    date_default_timezone_set('Africa/Dar_es_Salaam');
    $hour = (int) date('G');
    $isOpen = ($hour >= 8 && $hour < 18);
    $status = $isOpen ? 'Now Open' : 'Closed';
    $city = 'Arusha, Tanzania';
  @endphp

  <div class="footer-bubbles" aria-hidden="true">
    <span class="footer-bubble footer-bubble-one"></span>
    <span class="footer-bubble footer-bubble-two"></span>
    <span class="footer-bubble footer-bubble-three"></span>
  </div>

  <div class="footer-container">
    <div class="footer-about">
      <h5>Henry Gogarty Secondary School</h5>
      <p>Empowering students through academic excellence, discipline, and character for a brighter future.</p>
      <div class="footer-info-box">
        {{ $status }} &middot; Mon-Fri 8:00-17:00 &middot; Sat 9:00-14:00 &middot; {{ $city }}
      </div>
    </div>

    <div class="footer-links">
      <h6>Quick Links</h6>
      <ul>
        <li><a href="/"><i class="bi bi-house-door"></i> Home</a></li>
        <li><a href="/about"><i class="bi bi-info-circle"></i> About Us</a></li>
        <li><a href="{{ route('contact') }}"><i class="bi bi-envelope-paper"></i> Contact Us</a></li>
        <li><a href="/news-events"><i class="bi bi-megaphone"></i> News</a></li>
      </ul>
    </div>

    <div class="footer-contact">
      <h6>Contact Us</h6>
      <a href="tel:+255754096032"><i class="bi bi-telephone-fill"></i> 0754-096032</a>
      <a href="tel:+255783827117"><i class="bi bi-telephone-fill"></i> 0783-827117</a>
      <a href="mailto:lucretianjau506@gmail.com"><i class="bi bi-envelope-fill"></i> lucretianjau506@gmail.com</a>
      <a href="mailto:hgogarty75@gmail.com"><i class="bi bi-envelope-fill"></i> hgogarty75@gmail.com</a>
      <a href="#" data-bs-toggle="modal" data-bs-target="#locationModal"><i class="bi bi-geo-alt-fill"></i> View Location</a>
    </div>

    <div class="footer-social">
      <h6>Connect</h6>
      <a href="https://wa.me/255712345678" target="_blank"><i class="bi bi-whatsapp"></i> WhatsApp</a>
      <a href="https://facebook.com/HenryGogerty" target="_blank"><i class="bi bi-facebook"></i> Facebook</a>
      <a href="https://instagram.com/HenryGogerty" target="_blank"><i class="bi bi-instagram"></i> Instagram</a>
      <a href="/login"><i class="bi bi-box-arrow-in-right"></i> Portal Login</a>
      <a href="{{ route('developer') }}"><i class="bi bi-code-slash"></i> About Developer</a>
    </div>
  </div>

  <div class="footer-bottom">
    <small>&copy; {{ date('Y') }} Henry Gogarty Secondary School | All Rights Reserved.</small>
  </div>

  <div class="modal fade" id="locationModal" tabindex="-1" aria-labelledby="locationModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content bg-dark text-white">
        <div class="modal-header">
          <h5 class="modal-title" id="locationModalLabel">Our School Location</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-0">
          <iframe
            src="https://www.google.com/maps?q=Henry+Gogarty+Secondary+School&output=embed"
            width="100%" height="350" style="border:0;" allowfullscreen="" loading="lazy">
          </iframe>
        </div>
      </div>
    </div>
  </div>
</footer>
