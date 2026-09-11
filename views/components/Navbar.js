class SiteNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<div class="container">
    <nav class="navbar-container">
        <div class="logo-navigation">
            <div class="img-logo">
                <img src="../assets/Kembangin-logo.png" alt="">
            </div>
            <div class="logo-text">
               <h4>Kembang<span>IN</span></h4>
            </div>
        </div>
        <div class="right-side">
            <div class="navbar-search">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" id="search" autocomplete="none">
            </div>
            <div class="navbar-navigation">
                <ul class="desktop-navigation">
                    <li><a href="">Beranda</a></li>
                    <li><a href="">Artikel</a></li>
                    <li id="nav-drop"><a class="navbar-dropdown">Produk<i class="fa-solid fa-angle-down"></i></a></li>
                    <li><a href="">Forum</a></li>
                </ul>
                <ul class="mobile-navigation">
                    <li><a href=""><i class="fa-solid fa-house"></i></a></li>
                    <li><a href=""><i class="fa-solid fa-newspaper"></i></a></li>
                    <li class="nav-drop-mobile">
                        <a><i class="fa-solid fa-industry"></i></a>
                        <ul class="dropdown-produk-mobile">
                            <li><a href=""><i class="fa-solid fa-chalkboard-user"></i></a></li>
                            <li><a href=""><i class="fa-solid fa-microphone-lines"></i></a></li>
                            <li><a href=""><i class="fa-solid fa-book"></i></a></li>
                        </ul>
                    </li>
                    <li><a href=""><i class="fa-solid fa-microphone"></i></a></li>
                </ul>
            </div>
            <div class="navbar-btn">
                <div class="mobile-search-btn"><i class="fa-solid fa-magnifying-glass"></i></div>
                <a href="" class="notif-btn"><i class="fa-solid fa-bell"></i></a>
                <a href="../auth/login.html" class="login-btn">Masuk</a>
            </div>
            <div class="profile-login" id="profile-login">
                <h2>S</h2>
                <span>username</span>
            </div>
            <div class="menu"><i class="fa-solid fa-bars"></i></div>
        </div>
    </nav>
    <div class="mobile-search-bar">
        <div class="mobile-search-input">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="mobile-search" placeholder="Cari..." autocomplete="off">
        </div>
    </div>
    <div class="dropdown-container">
        <div>
            <ul class="dropdown-produk">
                <li>
                    <a href="" class="drop">
                        <span>
                            <i class="fa-solid fa-chalkboard-user"></i> Belajar 
                        </span>
                        <i class="fa-solid fa-angle-right"></i></a>
                </li>
                <li>
                    <a href="" class="drop">
                        <span>
                            <i class="fa-solid fa-microphone-lines"></i> Konsultasi 
                        </span>
                        <i class="fa-solid fa-angle-right"></i>
                    </a>
                </li>
                <li>
                    <a href="" class="drop">
                        <span>
                            <i class="fa-solid fa-book"></i> Perpustakaan 
                        </span>
                        <i class="fa-solid fa-angle-right"></i></a>
                </li>
            </ul>
        </div>
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
                    <li><a href=""><i class="fa-solid fa-image-portrait"></i> Profil</a></li>
                    <li><a href=""><i class="fa-solid fa-table"></i> Dasbor</a></li>
                    <li><a href=""><i class="fa-solid fa-users"></i> Kominitas</a></li>
                </ul>
            </div>
            <div class="logout"><a href=""><i class="fa-solid fa-right-from-bracket"></i> Keluar</a></div>
        </div>
    </div>
    <div class="dropdown-search">
        <ul class="hiddenSearch">
            <span>Find...</span>
            <li><a href=""><i class="fa-regular fa-file"></i> mencari halaman</a></li>
            <li><a href=""><i class="fa-regular fa-file"></i> mencari halaman</a></li>
            <li><a href=""><i class="fa-regular fa-file"></i> mencari halaman</a></li>
            <li><a href=""><i class="fa-regular fa-file"></i> mencari halaman</a></li>
        </ul>
    </div>
</div>
    `;
    this.highlightActivePage();
  }

  highlightActivePage() {
    const currentPage = document.body.dataset.page;
    const link = this.querySelector(`a[data-page="${currentPage}"]`);
    if (link) link.classList.add("active");
  }
}

customElements.define("site-navbar", SiteNavbar);
