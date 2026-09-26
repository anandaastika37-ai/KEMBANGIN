/* ============================================================
   KEMBANGIN — Page guard
   Taruh script ini di <head>, TEPAT SETELAH auth.js, hanya di
   halaman yang wajib login (dashboard, profile, community,
   notifikasi, dst). Sengaja diletakkan di <head> tanpa "defer"
   supaya dijalankan sinkron SEBELUM <body> mulai di-render —
   jadi kalau belum login, halaman yang diproteksi tidak sempat
   "kelihatan" sekilas sebelum redirect ke login.html.
   ============================================================ */
(function () {
  "use strict";

  if (window.KembanginAuth && window.KembanginAuth.isLoggedIn()) {
    return;
  }

  // Simpan halaman yang dituju supaya login.js bisa mengarahkan
  // balik ke sini setelah login berhasil.
  try {
    sessionStorage.setItem(
      "kembangin_redirect_after_login",
      location.pathname + location.search
    );
  } catch (err) {
    /* localStorage/sessionStorage bisa saja diblokir — abaikan saja,
       redirect tetap jalan, cuma tanpa "kembali ke halaman asal". */
  }

  window.location.replace("../auth/login.html");
})();
