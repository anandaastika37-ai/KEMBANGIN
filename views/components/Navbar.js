class SiteNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="container">
        <nav class="navbar-container">

          <!-- LOGO -->
          <div class="logo-navigation">
            <a href="../pages/home.html" class="img-logo">
              <img src="../assets/Kembangin-logo.png" alt="KembangIN">
            </a>

            <div class="logo-text">
              <h4>Kembang<span>IN</span></h4>
            </div>
          </div>

          <div class="right-side">

            <!-- SEARCH -->
            <div class="navbar-search">
              <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              <input 
                type="text" 
                id="search" 
                autocomplete="off"
                placeholder="Cari..."
                aria-label="Cari"
              >
            </div>

            <!-- NAVIGATION -->
            <div class="navbar-navigation">

              <!-- DESKTOP -->
              <ul class="desktop-navigation">

                <li>
                  <a href="../pages/home.html" data-page="home">
                    Beranda
                  </a>
                </li>

                <li>
                  <a href="../pages/article.html" data-page="article">
                    Artikel
                  </a>
                </li>

                <li id="nav-drop" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false" aria-label="Menu produk">
                  <a class="navbar-dropdown">
                    Produk
                    <i class="fa-solid fa-angle-down" aria-hidden="true"></i>
                  </a>
                </li>

                <li>
                  <a href="../pages/forum.html" data-page="forum">
                    Forum
                  </a>
                </li>

              </ul>

              <!-- MOBILE -->
              <ul class="mobile-navigation">

                <li>
                  <a href="../pages/home.html" data-page="home" aria-label="Beranda">
                    <i class="fa-solid fa-house" aria-hidden="true"></i>
                  </a>
                </li>

                <li>
                  <a href="../pages/article.html" data-page="article" aria-label="Artikel">
                    <i class="fa-solid fa-newspaper" aria-hidden="true"></i>
                  </a>
                </li>

                <li class="nav-drop-mobile" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false" aria-label="Menu produk">

                  <a>
                    <i class="fa-solid fa-industry" aria-hidden="true"></i>
                  </a>

                  <ul class="dropdown-produk-mobile">

                    <li>
                      <a href="../pages/course.html" data-page="course" aria-label="Belajar">
                        <i class="fa-solid fa-chalkboard-user" aria-hidden="true"></i>
                      </a>
                    </li>

                    <li>
                      <a href="../pages/consultation.html" data-page="consultation" aria-label="Konsultasi">
                        <i class="fa-solid fa-microphone-lines" aria-hidden="true"></i>
                      </a>
                    </li>

                    <li>
                      <a href="../pages/library.html" data-page="library" aria-label="Perpustakaan">
                        <i class="fa-solid fa-book" aria-hidden="true"></i>
                      </a>
                    </li>

                  </ul>

                </li>

                <li>
                  <a href="../pages/forum.html" data-page="forum" aria-label="Forum">
                    <i class="fa-solid fa-comments" aria-hidden="true"></i>
                  </a>
                </li>

              </ul>

            </div>

            <!-- BUTTON -->
            <div class="navbar-btn">

              <div class="mobile-search-btn" tabindex="0" role="button" aria-expanded="false" aria-label="Buka pencarian">
                <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              </div>

              <a href="#" class="chatbot-btn" aria-label="Chatbot" aria-haspopup="dialog" aria-expanded="false" aria-controls="chatbot-panel">
                <i class="fa-solid fa-robot" aria-hidden="true"></i>
              </a>

              <a 
                href="../auth/login.html" 
                class="login-btn"
              >
                Masuk
              </a>

            </div>

            <!-- PROFILE -->
            <div class="profile-login" id="profile-login" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false" aria-label="Menu profil dan notifikasi">
              <span class="avatar">
                <h2>S</h2>
                <span class="notif-dot" aria-hidden="true"></span>
              </span>
              <span class="profile-login-name">username</span>
            </div>

            <!-- MENU MOBILE -->
            <div class="menu" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false" aria-label="Buka menu navigasi">
              <i class="fa-solid fa-bars" aria-hidden="true"></i>
            </div>

          </div>
        </nav>


        <!-- MOBILE SEARCH -->
        <div class="mobile-search-bar">

          <div class="mobile-search-input">

            <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>

            <input 
              type="text" 
              id="mobile-search"
              placeholder="Cari..."
              autocomplete="off"
              aria-label="Cari"
            >

          </div>

          <!-- Diisi otomatis oleh public/js/search.js, sama seperti #searchResults -->
          <ul class="mobile-search-results" id="mobileSearchResults"></ul>

        </div>


        <!-- DROPDOWN -->
        <div class="dropdown-container">

          <!-- DROPDOWN PRODUK -->
          <div>

            <ul class="dropdown-produk">

              <li>
                <a 
                  href="../pages/course.html"
                  class="drop"
                  data-page="course"
                >
                  <span>
                    <i class="fa-solid fa-chalkboard-user" aria-hidden="true"></i>
                    Belajar
                  </span>

                  <i class="fa-solid fa-angle-right" aria-hidden="true"></i>
                </a>
              </li>


              <li>
                <a 
                  href="../pages/consultation.html"
                  class="drop"
                  data-page="consultation"
                >
                  <span>
                    <i class="fa-solid fa-microphone-lines" aria-hidden="true"></i>
                    Konsultasi
                  </span>

                  <i class="fa-solid fa-angle-right" aria-hidden="true"></i>
                </a>
              </li>


              <li>
                <a 
                  href="../pages/library.html"
                  class="drop"
                  data-page="library"
                >
                  <span>
                    <i class="fa-solid fa-book" aria-hidden="true"></i>
                    Perpustakaan
                  </span>

                  <i class="fa-solid fa-angle-right" aria-hidden="true"></i>
                </a>
              </li>

            </ul>

          </div>


          <!-- DROPDOWN PROFILE -->
          <div class="dropdown-profile">

            <div class="username-display">

              <span class="profile">S</span>

              <span class="username">
                <h3>Seseorang203</h3>
                <h5>seseorang@gmail.com</h5>
              </span>

            </div>


            <div class="premium">
              <span>Berlangganan</span>
              <i class="fa-solid fa-crown" aria-hidden="true"></i>
            </div>


            <div class="profile-navigation">

              <ul>

                <li>

                  <a href="notification.html" class="notif-link">
                    <span>
                      <i class="fa-solid fa-bell" aria-hidden="true"></i>
                      Notifikasi
                    </span>
                    <span class="notif-count"></span>
                  </a>
                </li>

                <li>
                  <a href="../pages/profile.html" data-page="profile">
                    <i class="fa-solid fa-image-portrait" aria-hidden="true"></i>
                    Profil
                  </a>
                </li>

                <li>

                  <a href="../pages/dashboard.html" data-page="dashboard">
                    <i class="fa-solid fa-table" aria-hidden="true"></i>

                    Dasbor
                  </a>
                </li>

                <li>

                  <a href="../pages/community.html" data-page="community">
                    <i class="fa-solid fa-users" aria-hidden="true"></i>
                    Komunitas
                  </a>
                </li>

              </ul>

            </div>


            <div class="logout">

              <a href="../auth/login.html">
                <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
                Keluar
              </a>

            </div>

          </div>

        </div>


        <!-- CHATBOT PANEL -->
        <div class="chatbot-panel" id="chatbot-panel" role="dialog" aria-label="Kemba Assistant" aria-hidden="true">

          <div class="chatbot-header">
            <div class="chatbot-header-info">
              <span class="chatbot-avatar"><i class="fa-solid fa-robot" aria-hidden="true"></i></span>
              <div>
                <h4>Kemba Assistant</h4>
                <p><span class="chatbot-status-dot" aria-hidden="true"></span> Online</p>
              </div>
            </div>
            <button type="button" class="chatbot-close" id="chatbot-close" aria-label="Tutup chatbot">
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>

          <div class="chatbot-messages" id="chatbot-messages">
            <div class="chatbot-message bot">
              Halo! Selamat datang. Ada yang bisa saya bantu hari ini?
              <span class="chatbot-time">10:00</span>
            </div>
          </div>

          <form class="chatbot-form" id="chatbot-form">
            <div class="chatbot-input-box">
              <input type="text" id="chatbot-input" placeholder="Ketik pesan Anda di sini..." autocomplete="off" aria-label="Ketik pesan">
            </div>
            <button type="submit" class="chatbot-send" aria-label="Kirim pesan">
              <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
            </button>
          </form>

        </div>


        <!-- SEARCH RESULT -->
        <div class="dropdown-search">

          <!-- Diisi otomatis oleh public/js/search.js (indeks halaman +
               artikel/forum/konsultan/buku/kursus dari views/database) -->
          <ul class="hiddenSearch" id="searchResults"></ul>

        </div>

      </div>
    `;

    this.highlightActivePage();
    this.initChatbot();
    this.applyAuthState();
  }


  highlightActivePage() {

    const currentPage = document.body.dataset.page;

    const links = this.querySelectorAll(
      "a[data-page]"
    );

    links.forEach(link => {

      if (link.dataset.page === currentPage) {
        link.classList.add("active");
      }

    });

  }


  initChatbot() {

    const chatbotBtn = this.querySelector(".chatbot-btn");
    const chatbotPanel = this.querySelector("#chatbot-panel");
    const chatbotClose = this.querySelector("#chatbot-close");
    const chatbotForm = this.querySelector("#chatbot-form");
    const chatbotInput = this.querySelector("#chatbot-input");
    const chatbotMessages = this.querySelector("#chatbot-messages");

    const openChatbot = () => {
      // posisikan panel di bawah tombol chatbot, tengahnya sejajar dengan
      // tengah tombol, dengan jarak yang lebih lega -- apa pun lebar layarnya
      const btnRect = chatbotBtn.getBoundingClientRect();
      const gap = 20;
      const edgeMargin = 12;
      const panelWidth = chatbotPanel.offsetWidth;

      let left = btnRect.left + (btnRect.width / 2) - (panelWidth / 2);
      const maxLeft = window.innerWidth - panelWidth - edgeMargin;
      left = Math.max(edgeMargin, Math.min(left, maxLeft));

      chatbotPanel.style.top = `${btnRect.bottom + gap}px`;
      chatbotPanel.style.left = `${left}px`;
      chatbotPanel.style.right = "auto";

      chatbotPanel.classList.add("show");
      chatbotBtn.setAttribute("aria-expanded", "true");
      chatbotPanel.setAttribute("aria-hidden", "false");
      chatbotInput.focus();
    };

    const closeChatbot = () => {
      chatbotPanel.classList.remove("show");
      chatbotBtn.setAttribute("aria-expanded", "false");
      chatbotPanel.setAttribute("aria-hidden", "true");
    };

    chatbotBtn.addEventListener("click", (e) => {
      e.preventDefault();
      chatbotPanel.classList.contains("show") ? closeChatbot() : openChatbot();
    });

    chatbotClose.addEventListener("click", closeChatbot);

    document.addEventListener("click", (e) => {
      if (!chatbotPanel.contains(e.target) && !chatbotBtn.contains(e.target)) {
        closeChatbot();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeChatbot();
    });

    const appendMessage = (text, sender) => {
      const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

      const bubble = document.createElement("div");
      bubble.className = `chatbot-message ${sender}`;
      bubble.append(text, Object.assign(document.createElement("span"), {
        className: "chatbot-time",
        textContent: time
      }));

      chatbotMessages.appendChild(bubble);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    chatbotForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = chatbotInput.value.trim();
      if (!text) return;

      appendMessage(text, "user");
      chatbotInput.value = "";

      // balasan dummy — ganti dengan panggilan API chatbot Anda yang sebenarnya
      setTimeout(() => {
        appendMessage("Terima kasih, pesan Anda sudah kami terima. Tim kami akan segera membantu.", "bot");
      }, 600);
    });

  }


  applyAuthState() {

    const loginBtn = this.querySelector(".login-btn");
    const profileWidget = this.querySelector("#profile-login");
    const logoutLink = this.querySelector(".logout a");

    const auth = window.KembanginAuth;
    const loggedIn = !!(auth && auth.isLoggedIn());
    const user = loggedIn ? auth.getUser() : null;

    if (loginBtn) loginBtn.classList.toggle("is-visible", !loggedIn);
    if (profileWidget) profileWidget.classList.toggle("is-hidden", !loggedIn);

    if (loggedIn && user) {
      const name = user.displayName || user.username || "Pengguna";
      const initial = name.charAt(0).toUpperCase();

      const avatarInitial = this.querySelector(".profile-login > .avatar > h2");
      const nameLabel = this.querySelector(".profile-login-name");
      const dropdownInitial = this.querySelector(".username-display .profile");
      const dropdownName = this.querySelector(".username-display .username h3");
      const dropdownEmail = this.querySelector(".username-display .username h5");

      if (avatarInitial) avatarInitial.textContent = initial;
      if (nameLabel) nameLabel.textContent = name;
      if (dropdownInitial) dropdownInitial.textContent = initial;
      if (dropdownName) dropdownName.textContent = name;
      if (dropdownEmail) dropdownEmail.textContent = user.email || "";
    }

    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (auth) auth.logout();
        window.location.href = logoutLink.getAttribute("href");
      });
    }

  }

}

customElements.define("site-navbar", SiteNavbar);