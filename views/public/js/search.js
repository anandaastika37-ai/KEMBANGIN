/* ============================================================
   KEMBANGIN — Live search (navbar)

   Sebelumnya kotak pencarian cuma menampilkan daftar 9 halaman
   yang SELALU sama persis, tidak peduli apa yang diketik user —
   jadi bukan "search" sungguhan, cuma daftar menu yang disamarkan.

   Sekarang: mengindeks halaman statis + konten dinamis (artikel,
   forum, konsultan, buku perpustakaan, kursus) dari file JSON di
   views/database, lalu memfilternya sambil user mengetik — mirip
   search dokumentasi (live filter, highlight kata yang cocok,
   navigasi lewat panah atas/bawah + Enter, klik langsung menuju
   halamannya).

   Data JSON baru diambil sekali (lazy, saat search box pertama
   kali dipakai), lalu di-cache di module ini untuk sisa sesi
   supaya tidak fetch berulang setiap kali user mengetik.
   ============================================================ */
(function () {
  "use strict";

  const STATIC_PAGES = [
    { title: "Beranda", url: "../pages/home.html" },
    { title: "Artikel", url: "../pages/article.html" },
    { title: "Belajar", url: "../pages/course.html" },
    { title: "Konsultasi", url: "../pages/consultation.html" },
    { title: "Perpustakaan", url: "../pages/library.html" },
    { title: "Forum", url: "../pages/forum.html" },
    { title: "Komunitas", url: "../pages/community.html" },
    { title: "Dasbor", url: "../pages/dashboard.html" },
    { title: "Profil", url: "../pages/profile.html" }
  ];

  // Sumber konten dinamis yang ikut diindeks. Kalau strukturnya
  // gagal dimuat/berubah, entrinya cuma dilewati (lihat loadIndex).
  const SOURCES = [
    { url: "../database/artikel.json", category: "Artikel" },
    { url: "../database/forum.json", category: "Forum" },
    { url: "../database/consultation.json", category: "Konsultan" },
    { url: "../database/liblary.json", category: "Perpustakaan" },
    { url: "../database/course.json", category: "Belajar" }
  ];

  const CATEGORY_ICON = {
    "Halaman": "fa-regular fa-file",
    "Artikel": "fa-solid fa-newspaper",
    "Forum": "fa-solid fa-comments",
    "Konsultan": "fa-solid fa-user-tie",
    "Perpustakaan": "fa-solid fa-book",
    "Belajar": "fa-solid fa-chalkboard-user"
  };

  const MAX_PER_CATEGORY = 4;

  let indexPromise = null;

  function entry(title, url, category, sub) {
    return { title: String(title || "").trim(), url, category, sub: sub || "" };
  }

  function loadIndex() {
    if (indexPromise) return indexPromise;

    const staticEntries = STATIC_PAGES.map((p) => entry(p.title, p.url, "Halaman"));

    indexPromise = Promise.all(
      SOURCES.map((src) =>
        fetch(src.url)
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null)
      )
    )
      .then(([artikel, forum, consultation, liblary, course]) => {
        const entries = staticEntries.slice();

        if (Array.isArray(artikel)) {
          artikel.forEach((a) => {
            if (!a || a.status && a.status !== "public") return;
            entries.push(
              entry(a.title, `../pages/article-detail.html?slug=${encodeURIComponent(a.slug)}`, "Artikel", a.excerpt)
            );
          });
        }

        if (Array.isArray(forum)) {
          forum.forEach((t) => {
            if (!t) return;
            const firstLine = String(t.text || "").split("\n")[0];
            entries.push(entry(firstLine, "../pages/forum.html", "Forum", t.user ? "oleh " + t.user : ""));
          });
        }

        if (Array.isArray(consultation)) {
          consultation.forEach((c) => {
            if (!c) return;
            const spes = Array.isArray(c.spesialisasi) ? c.spesialisasi.slice(0, 2).join(", ") : "";
            entries.push(entry(c.nama, "../pages/consultation.html", "Konsultan", spes));
          });
        }

        if (Array.isArray(liblary)) {
          liblary.forEach((b) => {
            if (!b) return;
            entries.push(entry(b.title, "../pages/library.html", "Perpustakaan", b.author ? "oleh " + b.author : ""));
          });
        }

        if (course && course.title) {
          entries.push(entry(course.title, "../pages/course.html", "Belajar", course.level || ""));
        }

        return entries;
      })
      .catch(() => staticEntries);

    return indexPromise;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function highlight(text, words) {
    const safe = escapeHtml(text);
    if (!words || !words.length) return safe;
    const pattern = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
    if (!pattern) return safe;
    const re = new RegExp("(" + pattern + ")", "ig");
    return safe.replace(re, "<mark>$1</mark>");
  }

  // Semua kata kunci harus ketemu di suatu tempat (judul atau sub-teks),
  // urutan/posisinya bebas — supaya "strategi bisnis" tetap ketemu meski
  // urutan katanya kebalik di judul aslinya.
  function filterEntries(entries, query) {
    const q = query.trim().toLowerCase();
    if (!q) return null; // null = sinyal "tampilkan daftar halaman default"

    const words = q.split(/\s+/).filter(Boolean);

    const scored = entries
      .map((e) => {
        if (!e.title) return null;
        const haystack = (e.title + " " + e.sub).toLowerCase();
        const allMatch = words.every((w) => haystack.indexOf(w) !== -1);
        if (!allMatch) return null;

        const titleLower = e.title.toLowerCase();
        const score = titleLower.startsWith(q) ? 0 : titleLower.indexOf(q) !== -1 ? 1 : 2;
        return { entry: e, score };
      })
      .filter(Boolean)
      .sort((a, b) => a.score - b.score);

    const grouped = {};
    const order = [];
    scored.forEach(({ entry: e }) => {
      if (!grouped[e.category]) {
        grouped[e.category] = [];
        order.push(e.category);
      }
      if (grouped[e.category].length < MAX_PER_CATEGORY) {
        grouped[e.category].push(e);
      }
    });

    return { words, groups: order.map((cat) => ({ category: cat, items: grouped[cat] })) };
  }

  function render(container, result, query) {
    if (result === null) {
      container.innerHTML =
        "<span>Halaman</span>" +
        STATIC_PAGES.map(
          (p) => `<li><a href="${p.url}"><i class="fa-regular fa-file" aria-hidden="true"></i>${escapeHtml(p.title)}</a></li>`
        ).join("");
      return;
    }

    const { words, groups } = result;

    if (groups.length === 0) {
      container.innerHTML = `<li class="search-empty">Tidak ada hasil untuk &quot;${escapeHtml(query)}&quot;</li>`;
      return;
    }

    container.innerHTML = groups
      .map((g) => {
        const icon = CATEGORY_ICON[g.category] || "fa-regular fa-file";
        return (
          `<span>${escapeHtml(g.category)}</span>` +
          g.items
            .map((item) => {
              const sub = item.sub ? `<small>${highlight(item.sub, words)}</small>` : "";
              return (
                `<li><a href="${item.url}"><i class="${icon}" aria-hidden="true"></i>` +
                `<span class="search-result-text"><strong>${highlight(item.title, words)}</strong>${sub}</span></a></li>`
              );
            })
            .join("")
        );
      })
      .join("");
  }

  function setupSearchBox(inputEl, resultsEl, showClass, extraToggleEl) {
    if (!inputEl || !resultsEl) return;

    let cachedEntries = null;
    let debounceTimer = null;

    function ensureIndex() {
      if (cachedEntries) return Promise.resolve(cachedEntries);
      return loadIndex().then((list) => {
        cachedEntries = list;
        return list;
      });
    }

    function runSearch() {
      const query = inputEl.value;
      ensureIndex().then((list) => {
        render(resultsEl, filterEntries(list, query), query);
      });
    }

    inputEl.addEventListener("focus", () => {
      resultsEl.classList.add(showClass);
      if (extraToggleEl) extraToggleEl.classList.add("navbar-search-tall");
      runSearch();
    });

    inputEl.addEventListener("blur", () => {
      // delay dikit supaya klik pada hasil sempat ke-trigger sebelum ditutup
      setTimeout(() => {
        resultsEl.classList.remove(showClass);
        if (extraToggleEl) extraToggleEl.classList.remove("navbar-search-tall");
      }, 150);
    });

    inputEl.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(runSearch, 120);
    });

    inputEl.addEventListener("keydown", (e) => {
      const links = Array.from(resultsEl.querySelectorAll("a"));
      if (!links.length) return;

      const activeIdx = links.findIndex((a) => a.classList.contains("is-active"));

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = links[(activeIdx + 1) % links.length];
        links.forEach((a) => a.classList.remove("is-active"));
        next.classList.add("is-active");
        next.scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = links[(activeIdx - 1 + links.length) % links.length];
        links.forEach((a) => a.classList.remove("is-active"));
        prev.classList.add("is-active");
        prev.scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        e.preventDefault();
        const target = activeIdx >= 0 ? links[activeIdx] : links[0];
        if (target) window.location.href = target.getAttribute("href");
      } else if (e.key === "Escape") {
        inputEl.blur();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupSearchBox(
      document.getElementById("search"),
      document.getElementById("searchResults"),
      "find",
      document.querySelector(".navbar-search")
    );

    setupSearchBox(
      document.getElementById("mobile-search"),
      document.getElementById("mobileSearchResults"),
      "show",
      null
    );
  });
})();
