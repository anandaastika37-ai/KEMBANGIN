/* ============================================================
   KEMBANGIN — Logika halaman auth/login.html
   Membutuhkan auth.js sudah dimuat lebih dulu.
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  if (window.KembanginAuth && window.KembanginAuth.isLoggedIn()) {
    // Sudah login — tidak perlu melihat form login lagi.
    window.location.replace("../pages/home.html");
    return;
  }

  const form = document.getElementById("loginForm");
  const usernameInput = document.getElementById("login_username");
  const passwordInput = document.getElementById("login_password");
  const errorEl = document.getElementById("loginError");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const ok = window.KembanginAuth.login(usernameInput.value, passwordInput.value);

    if (!ok) {
      errorEl.textContent = "Username atau password salah. (Coba: demo / demo123)";
      errorEl.hidden = false;
      passwordInput.value = "";
      passwordInput.focus();
      return;
    }

    errorEl.hidden = true;

    let redirectTo = "../pages/home.html";
    try {
      const saved = sessionStorage.getItem("kembangin_redirect_after_login");
      if (saved) {
        redirectTo = saved;
        sessionStorage.removeItem("kembangin_redirect_after_login");
      }
    } catch (err) {
      /* abaikan — pakai default redirectTo di atas */
    }

    window.location.href = redirectTo;
  });
});
