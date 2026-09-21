/* =====================================================================
   home.js — animasi on scroll untuk halaman home (vanilla JS)
   Tidak perlu mengubah HTML: script ini memberi kelas .reveal pada
   elemen-elemen di bawah, lalu menambah .is-visible saat elemen masuk
   layar. Animasinya ada di home-enhance.css (bagian 3).
   ===================================================================== */
(() => {
  // Hormati pengguna yang mematikan animasi; browser lama tanpa
  // IntersectionObserver juga langsung menampilkan semua konten.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  // [selector, efek (up | left | right | zoom), jeda antar elemen dalam ms]
  const targets = [
    [".hero .left-side > *", "up", 90],      // teks hero muncul berurutan saat halaman dibuka
    [".hero .right-side", "right", 0],
    [".information li", "up", 100],
    [".title-content", "up", 0],
    [".artikel-recomand li", "zoom", 90],
    [".about", "left", 0],
    [".why", "right", 0],
    [".product li", "up", 100],
    [".box-event", "up", 110],
    [".intro-ai", "left", 0],
    [".intro-our-chatbot", "right", 0],
    [".tool-ai-container li", "up", 100],
    [".our-product li", "up", 110],
    [".intro-consultan > img", "left", 0],
    [".consul-des", "right", 0],
    [".cc-head", "up", 0],
    [".card-consultan", "up", 90],
  ];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // animasi hanya sekali
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  targets.forEach(([selector, effect, step]) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (el.classList.contains("reveal")) return; // sudah didaftarkan selector lain
      el.classList.add("reveal");
      el.dataset.reveal = effect;
      el.style.setProperty("--reveal-delay", `${Math.min(i * step, 450)}ms`);
      observer.observe(el);
    });
  });
})();