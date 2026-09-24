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

              <a href="#" class="chatbot-btn" aria-label="Chatbot">
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

                  <a href="#" class="notif-link">
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


        <!-- SEARCH RESULT -->
        <div class="dropdown-search">

          <ul class="hiddenSearch">

            <span>Pages</span>

            <li>
              <a href="../pages/home.html">
                <i class="fa-regular fa-file" aria-hidden="true"></i>
                Beranda
              </a>
            </li>

            <li>
              <a href="../pages/article.html">
                <i class="fa-regular fa-file" aria-hidden="true"></i>
                Artikel
              </a>
            </li>

            <li>
              <a href="../pages/course.html">
                <i class="fa-regular fa-file" aria-hidden="true"></i>
                Belajar
              </a>
            </li>

            <li>
              <a href="../pages/consultation.html">
                <i class="fa-regular fa-file" aria-hidden="true"></i>
                Konsultasi
              </a>
            </li>

            <li>
              <a href="../pages/library.html">
                <i class="fa-regular fa-file" aria-hidden="true"></i>
                Perpustakaan
              </a>
            </li>

            <li>
              <a href="../pages/forum.html">
                <i class="fa-regular fa-file" aria-hidden="true"></i>
                Forum
              </a>
            </li>

            <li>
              <a href="../pages/community.html">
                <i class="fa-regular fa-file" aria-hidden="true"></i>
                Komunitas
              </a>
            </li>

            <li>
              <a href="../pages/dashboard.html">
                <i class="fa-regular fa-file" aria-hidden="true"></i>
                Dasbor
              </a>
            </li>

            <li>
              <a href="../pages/profile.html">
                <i class="fa-regular fa-file" aria-hidden="true"></i>
                Profil
              </a>
            </li>

          </ul>

        </div>

      </div>
    `;

    this.highlightActivePage();
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
}

customElements.define("site-navbar", SiteNavbar);