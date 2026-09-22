class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="footer-top">

          <!-- BRAND -->
          <div class="footer-brand">
            <a href="../pages/home.html" class="footer-logo">
              <img src="../assets/Kembangin-logo.png" alt="KembangIN">
              <h4>Kembang<span>IN</span></h4>
            </a>

            <p class="footer-desc">
              Platform untuk belajar, berkonsultasi, dan memperluas wawasan
              seputar bisnis, ekonomi, dan industri.
            </p>

            <ul class="footer-social">
              <li>
                <a href="#" aria-label="Instagram">
                  <i class="fa-brands fa-instagram"></i>
                </a>
              </li>
              <li>
                <a href="#" aria-label="LinkedIn">
                  <i class="fa-brands fa-linkedin-in"></i>
                </a>
              </li>
              <li>
                <a href="#" aria-label="X (Twitter)">
                  <i class="fa-brands fa-x-twitter"></i>
                </a>
              </li>
              <li>
                <a href="#" aria-label="YouTube">
                  <i class="fa-brands fa-youtube"></i>
                </a>
              </li>
            </ul>
          </div>

          <!-- LINKS -->
          <div class="footer-links">

            <div class="footer-col">
              <h5>Produk</h5>
              <ul>
                <li><a href="../pages/course.html">Belajar</a></li>
                <li><a href="../pages/consultation.html">Konsultasi</a></li>
                <li><a href="../pages/library.html">Perpustakaan</a></li>
                <li><a href="../pages/forum.html">Forum</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h5>Perusahaan</h5>
              <ul>
                <li><a href="#">Tentang Kami</a></li>
                <li><a href="../pages/article.html">Artikel</a></li>
                <li><a href="#">Karier</a></li>
                <li><a href="#">Kontak</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h5>Bantuan</h5>
              <ul>
                <li><a href="#">Pusat Bantuan</a></li>
                <li><a href="#">Syarat &amp; Ketentuan</a></li>
                <li><a href="#">Kebijakan Privasi</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>

          </div>

          <!-- NEWSLETTER -->
          <div class="footer-newsletter">
            <h5>Tetap Terhubung</h5>
            <p>
              Dapatkan artikel dan insight bisnis terbaru langsung ke email kamu.
            </p>

            <form class="newsletter-form">
              <input
                type="email"
                name="email"
                placeholder="Alamat email kamu"
                autocomplete="email"
                required
              >
              <button type="submit">Berlangganan</button>
            </form>

            <p class="newsletter-msg"></p>
          </div>

        </div>

        <div class="footer-bottom">
          <p>&copy; <span class="footer-year"></span> Kembangin. Seluruh hak cipta dilindungi.</p>

          <ul class="footer-bottom-links">
            <li><a href="#">Syarat Layanan</a></li>
            <li><a href="#">Privasi</a></li>
            <li><a href="#">Cookies</a></li>
          </ul>
        </div>
      </footer>
    `;

    this.setYear();
    this.setupNewsletterForm();
  }

  setYear() {
    const yearEl = this.querySelector(".footer-year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  setupNewsletterForm() {
    const form = this.querySelector(".newsletter-form");
    const msg = this.querySelector(".newsletter-msg");

    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const input = form.querySelector("input[name='email']");
      const email = input.value.trim();

      if (!email) return;

      // TODO: ganti dengan pemanggilan API/endpoint langganan yang sebenarnya
      msg.textContent = `Terima kasih, ${email} berhasil didaftarkan.`;
      form.reset();
    });
  }
}

customElements.define("site-footer", SiteFooter);