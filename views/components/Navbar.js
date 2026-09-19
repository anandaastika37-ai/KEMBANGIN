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
              <i class="fa-solid fa-magnifying-glass"></i>
              <input 
                type="text" 
                id="search" 
                autocomplete="off"
                placeholder="Cari..."
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

                <li id="nav-drop">
                  <a class="navbar-dropdown">
                    Produk
                    <i class="fa-solid fa-angle-down"></i>
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
                  <a href="../pages/home.html" data-page="home">
                    <i class="fa-solid fa-house"></i>
                  </a>
                </li>

                <li>
                  <a href="../pages/article.html" data-page="article">
                    <i class="fa-solid fa-newspaper"></i>
                  </a>
                </li>

                <li class="nav-drop-mobile">

                  <a>
                    <i class="fa-solid fa-industry"></i>
                  </a>

                  <ul class="dropdown-produk-mobile">

                    <li>
                      <a href="../pages/course.html" data-page="course">
                        <i class="fa-solid fa-chalkboard-user"></i>
                      </a>
                    </li>

                    <li>
                      <a href="../pages/consultation.html" data-page="consultation">
                        <i class="fa-solid fa-microphone-lines"></i>
                      </a>
                    </li>

                    <li>
                      <a href="../pages/library.html" data-page="library">
                        <i class="fa-solid fa-book"></i>
                      </a>
                    </li>

                  </ul>

                </li>

                <li>
                  <a href="../pages/forum.html" data-page="forum">
                    <i class="fa-solid fa-comments"></i>
                  </a>
                </li>

              </ul>

            </div>

            <!-- BUTTON -->
            <div class="navbar-btn">

              <div class="mobile-search-btn">
                <i class="fa-solid fa-magnifying-glass"></i>
              </div>

              <a href="#" class="notif-btn">
                <i class="fa-solid fa-bell"></i>
              </a>

              <a href="#" class="chatbot-btn">
                <i class="fa-solid fa-robot"></i>
              </a>

              <a 
                href="../auth/login.html" 
                class="login-btn"
              >
                Masuk
              </a>

            </div>

            <!-- PROFILE -->
            <div class="profile-login" id="profile-login">
              <h2>S</h2>
              <span>username</span>
            </div>

            <!-- MENU MOBILE -->
            <div class="menu">
              <i class="fa-solid fa-bars"></i>
            </div>

          </div>
        </nav>


        <!-- MOBILE SEARCH -->
        <div class="mobile-search-bar">

          <div class="mobile-search-input">

            <i class="fa-solid fa-magnifying-glass"></i>

            <input 
              type="text" 
              id="mobile-search"
              placeholder="Cari..."
              autocomplete="off"
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
                    <i class="fa-solid fa-chalkboard-user"></i>
                    Belajar
                  </span>

                  <i class="fa-solid fa-angle-right"></i>
                </a>
              </li>


              <li>
                <a 
                  href="../pages/consultation.html"
                  class="drop"
                  data-page="consultation"
                >
                  <span>
                    <i class="fa-solid fa-microphone-lines"></i>
                    Konsultasi
                  </span>

                  <i class="fa-solid fa-angle-right"></i>
                </a>
              </li>


              <li>
                <a 
                  href="../pages/library.html"
                  class="drop"
                  data-page="library"
                >
                  <span>
                    <i class="fa-solid fa-book"></i>
                    Perpustakaan
                  </span>

                  <i class="fa-solid fa-angle-right"></i>
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
              <i class="fa-solid fa-crown"></i>
            </div>


            <div class="profile-navigation">

              <ul>

                <li>
                  <a href="#">
                    <i class="fa-solid fa-image-portrait"></i>
                    Profil
                  </a>
                </li>

                <li>
                  <a href="#">
                    <i class="fa-solid fa-table"></i>
                    Dasbor
                  </a>
                </li>

                <li>
                  <a href="#">
                    <i class="fa-solid fa-users"></i>
                    Komunitas
                  </a>
                </li>

              </ul>

            </div>


            <div class="logout">

              <a href="../auth/login.html">
                <i class="fa-solid fa-right-from-bracket"></i>
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
                <i class="fa-regular fa-file"></i>
                Beranda
              </a>
            </li>

            <li>
              <a href="../pages/article.html">
                <i class="fa-regular fa-file"></i>
                Artikel
              </a>
            </li>

            <li>
              <a href="../pages/course.html">
                <i class="fa-regular fa-file"></i>
                Belajar
              </a>
            </li>

            <li>
              <a href="../pages/consultation.html">
                <i class="fa-regular fa-file"></i>
                Konsultasi
              </a>
            </li>

            <li>
              <a href="../pages/library.html">
                <i class="fa-regular fa-file"></i>
                Perpustakaan
              </a>
            </li>

            <li>
              <a href="../pages/forum.html">
                <i class="fa-regular fa-file"></i>
                Forum
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