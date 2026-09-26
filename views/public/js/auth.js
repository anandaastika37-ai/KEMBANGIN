/* ============================================================
   KEMBANGIN — Modul otentikasi sederhana (client-side, tanpa backend)
   Proyek ini statis (HTML/CSS/vanilla JS, tanpa server/database),
   jadi status login cuma disimulasikan lewat localStorage browser.

   Ganti DEMO_USER di bawah untuk mengubah kombinasi username/password
   yang dianggap valid. Kalau nanti proyek ini sudah punya backend
   sungguhan, cukup ganti isi fungsi login() untuk memanggil API-nya —
   bagian lain (Navbar.js, auth-guard.js) tidak perlu diubah karena
   semuanya hanya bergantung pada window.KembanginAuth.

   Muat file ini SEBELUM Navbar.js, auth-guard.js, atau login.js di
   setiap halaman yang membutuhkannya.
   ============================================================ */
(function () {
  "use strict";

  const STORAGE_KEY = "kembangin_auth";

  // Satu-satunya akun demo yang dianggap valid selama belum ada backend.
  const DEMO_USER = {
    username: "demo",
    password: "demo123",
    displayName: "Demo User",
    email: "demo@kembangin.id"
  };

  function login(username, password) {
    const u = String(username || "").trim().toLowerCase();
    const p = String(password || "");

    if (u !== DEMO_USER.username || p !== DEMO_USER.password) {
      return false;
    }

    const session = {
      username: DEMO_USER.username,
      displayName: DEMO_USER.displayName,
      email: DEMO_USER.email,
      loginAt: Date.now()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (err) {
      console.error("KembanginAuth: gagal menyimpan sesi ke localStorage.", err);
      return false;
    }
    return true;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (err) {
      return null;
    }
  }

  function isLoggedIn() {
    return !!getUser();
  }

  window.KembanginAuth = { login, logout, getUser, isLoggedIn };
})();
