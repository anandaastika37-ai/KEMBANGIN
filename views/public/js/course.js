(() => {
  "use strict";

  /* =====================================================================
     1. DATA COURSE — sumber tunggal untuk seluruh halaman
     ===================================================================== */
  const COURSE = {
    id: 1,
    title: "Konsep Dasar Ekonomi untuk Pelaku Usaha",
    category: "Ekonomi",
    level: "Pemula",
    duration: "6 Jam",
    totalLessons: 18,
    totalModules: 6,
    students: 1200,
    rating: 4.8,
    price: "Gratis",
    image: "assets/images/course-ekonomi.jpg",
    mentor: "Tim Mentor Kembangin",
    description:
      "Pelajari konsep dasar ekonomi dan bagaimana penerapannya dalam kehidupan bisnis sehari-hari. Course ini membantu pelaku usaha memahami kondisi ekonomi dan mengambil keputusan bisnis dengan lebih baik.",
    whatYouWillLearn: [
      "Memahami dasar ekonomi",
      "Memahami indikator ekonomi",
      "Memahami inflasi dan suku bunga",
      "Memahami kondisi ekonomi Indonesia",
      "Memahami pengaruh ekonomi global",
      "Memahami dasar literasi keuangan",
      "Memahami sistem pembayaran digital",
    ],
    modules: [
      {
        id: 1,
        title: "Konsep Dasar Ekonomi",
        lessons: [
          {
            id: 1,
            title: "Apa Itu Ekonomi?",
            description:
              "Apa itu ekonomi dan mengapa penting dipahami pelaku usaha.",
            duration: "15 menit",
            thumbnail: "assets/images/course/ekonomi/01.jpg",
            hasQuiz: false,
          },
          {
            id: 2,
            title: "Kebutuhan vs Keinginan",
            description:
              "Memahami perbedaan kebutuhan dan keinginan serta bagaimana sumber daya yang terbatas memengaruhi keputusan.",
            duration: "20 menit",
            thumbnail: "assets/images/course/ekonomi/02.jpg",
            hasQuiz: true,
            quiz: {
              question:
                "Apa salah satu alasan utama manusia perlu membuat pilihan ekonomi?",
              options: [
                { id: "a", text: "Sumber daya tidak terbatas" },
                { id: "b", text: "Sumber daya terbatas" },
                { id: "c", text: "Semua kebutuhan sudah terpenuhi" },
                { id: "d", text: "Tidak ada kebutuhan" },
              ],
              correct: "b",
              explanation:
                "Karena sumber daya (waktu, uang, bahan baku) selalu terbatas, setiap orang dan pelaku usaha harus membuat pilihan tentang cara terbaik menggunakannya.",
            },
          },
          {
            id: 3,
            title: "Sistem Ekonomi",
            description:
              "Mengenal sistem ekonomi seperti pasar bebas dan sistem ekonomi campuran serta penerapannya di Indonesia.",
            duration: "25 menit",
            thumbnail: "assets/images/course/ekonomi/03.jpg",
            hasQuiz: false,
          },
        ],
      },
      {
        id: 2,
        title: "Istilah & Indikator Ekonomi yang Sering Muncul di Berita",
        lessons: [
          {
            id: 4,
            title: "Inflasi",
            description:
              "Apa itu inflasi dan bagaimana dampaknya terhadap harga bahan baku dan harga jual.",
            duration: "20 menit",
            thumbnail: "assets/images/course/ekonomi/04.jpg",
            hasQuiz: true,
            quiz: {
              question:
                "Ketika inflasi naik, apa yang biasanya terjadi pada harga barang secara umum?",
              options: [
                { id: "a", text: "Harga barang cenderung turun" },
                { id: "b", text: "Harga barang cenderung naik" },
                { id: "c", text: "Harga barang selalu tetap" },
                { id: "d", text: "Tidak berpengaruh sama sekali" },
              ],
              correct: "b",
              explanation:
                "Inflasi adalah kenaikan harga barang dan jasa secara umum dalam periode tertentu, yang bisa memengaruhi biaya bahan baku dan harga jual produk.",
            },
          },
          {
            id: 5,
            title: "Suku Bunga",
            description:
              "Mengenal BI Rate dan pengaruh suku bunga terhadap kredit usaha.",
            duration: "20 menit",
            thumbnail: "assets/images/course/ekonomi/05.jpg",
            hasQuiz: false,
          },
          {
            id: 6,
            title: "Nilai Tukar Rupiah",
            description:
              "Memahami nilai tukar rupiah dan dampaknya terhadap harga barang impor.",
            duration: "20 menit",
            thumbnail: "assets/images/course/ekonomi/06.jpg",
            hasQuiz: false,
          },
          {
            id: 7,
            title: "PDB — Produk Domestik Bruto",
            description:
              "Memahami PDB secara sederhana dan mengapa indikator ini relevan bagi pengusaha.",
            duration: "20 menit",
            thumbnail: "assets/images/course/ekonomi/07.jpg",
            hasQuiz: true,
            quiz: {
              question: "Apa yang diukur oleh PDB (Produk Domestik Bruto)?",
              options: [
                { id: "a", text: "Jumlah penduduk suatu negara" },
                {
                  id: "b",
                  text: "Total nilai barang dan jasa yang dihasilkan suatu negara dalam periode tertentu",
                },
                { id: "c", text: "Jumlah utang pemerintah" },
                { id: "d", text: "Nilai tukar mata uang" },
              ],
              correct: "b",
              explanation:
                "PDB mengukur total nilai barang dan jasa yang dihasilkan dalam suatu negara pada periode tertentu, dan menjadi salah satu indikator kesehatan ekonomi.",
            },
          },
          {
            id: 8,
            title: "Resesi vs Pertumbuhan Ekonomi",
            description: "Memahami perbedaan resesi dan pertumbuhan ekonomi.",
            duration: "20 menit",
            thumbnail: "assets/images/course/ekonomi/08.jpg",
            hasQuiz: false,
          },
        ],
      },
      {
        id: 3,
        title: "Kondisi Ekonomi Indonesia",
        lessons: [
          {
            id: 9,
            title: "Perkembangan Ekonomi Indonesia",
            description:
              "Memahami perkembangan ekonomi Indonesia dan hubungannya dengan dunia bisnis.",
            duration: "20 menit",
            thumbnail: "assets/images/course/ekonomi/09.jpg",
            hasQuiz: false,
          },
          {
            id: 10,
            title: "Peran UMKM dalam Perekonomian Nasional",
            description:
              "Memahami kontribusi UMKM terhadap PDB dan penyerapan tenaga kerja.",
            duration: "25 menit",
            thumbnail: "assets/images/course/ekonomi/10.jpg",
            hasQuiz: true,
            quiz: {
              question:
                "Apa kontribusi utama UMKM terhadap perekonomian nasional?",
              options: [
                {
                  id: "a",
                  text: "Menyerap tenaga kerja dan berkontribusi pada PDB",
                },
                { id: "b", text: "Hanya menambah jumlah pajak negara" },
                { id: "c", text: "Tidak berdampak pada perekonomian" },
                { id: "d", text: "Hanya beroperasi di sektor pertanian" },
              ],
              correct: "a",
              explanation:
                "UMKM menyerap sebagian besar tenaga kerja di Indonesia dan menyumbang porsi signifikan terhadap PDB nasional.",
            },
          },
          {
            id: 11,
            title: "Sektor Ekonomi yang Sedang Bertumbuh",
            description:
              "Mengenal sektor ekonomi yang berkembang dan peluang yang dapat diperhatikan pelaku usaha.",
            duration: "20 menit",
            thumbnail: "assets/images/course/ekonomi/11.jpg",
            hasQuiz: false,
          },
        ],
      },
      {
        id: 4,
        title: "Ekonomi Global & Dampaknya",
        lessons: [
          {
            id: 12,
            title: "Bagaimana Ekonomi Global Memengaruhi Indonesia",
            description:
              "Memahami bagaimana kondisi ekonomi global dapat memengaruhi harga dan aktivitas ekonomi dalam negeri.",
            duration: "20 menit",
            thumbnail: "assets/images/course/ekonomi/12.jpg",
            hasQuiz: false,
          },
          {
            id: 13,
            title: "Perdagangan Internasional untuk UMKM",
            description:
              "Mengenal konsep ekspor dan impor secara sederhana serta relevansinya bagi UMKM.",
            duration: "25 menit",
            thumbnail: "assets/images/course/ekonomi/13.jpg",
            hasQuiz: false,
          },
        ],
      },
      {
        id: 5,
        title: "Literasi Keuangan Dasar",
        lessons: [
          {
            id: 14,
            title: "Aset dan Liabilitas",
            description: "Memahami perbedaan aset dan liabilitas dalam bisnis.",
            duration: "20 menit",
            thumbnail: "assets/images/course/ekonomi/14.jpg",
            hasQuiz: true,
            quiz: {
              question: "Manakah yang termasuk contoh liabilitas dalam bisnis?",
              options: [
                { id: "a", text: "Uang tunai di kas" },
                { id: "b", text: "Utang kepada pemasok" },
                { id: "c", text: "Peralatan usaha" },
                { id: "d", text: "Persediaan barang" },
              ],
              correct: "b",
              explanation:
                "Liabilitas adalah kewajiban atau utang yang harus dibayar, seperti utang kepada pemasok, sedangkan aset adalah sumber daya yang dimiliki bisnis.",
            },
          },
          {
            id: 15,
            title: "Menabung, Investasi, dan Berutang",
            description:
              "Memahami konsep menabung, investasi, dan penggunaan utang secara sehat.",
            duration: "25 menit",
            thumbnail: "assets/images/course/ekonomi/15.jpg",
            hasQuiz: false,
          },
          {
            id: 16,
            title: "Mengenal Lembaga Keuangan",
            description:
              "Mengenal bank, koperasi, dan fintech serta fungsi dasarnya.",
            duration: "20 menit",
            thumbnail: "assets/images/course/ekonomi/16.jpg",
            hasQuiz: false,
          },
        ],
      },
      {
        id: 6,
        title: "Uang & Sistem Pembayaran",
        lessons: [
          {
            id: 17,
            title: "Sejarah Singkat Uang",
            description:
              "Mengenal perkembangan uang dan fungsi uang dalam aktivitas ekonomi.",
            duration: "15 menit",
            thumbnail: "assets/images/course/ekonomi/17.jpg",
            hasQuiz: false,
          },
          {
            id: 18,
            title: "Sistem Pembayaran Digital di Indonesia",
            description:
              "Memahami perkembangan sistem pembayaran digital seperti QRIS dan e-wallet serta penggunaannya dalam bisnis.",
            duration: "25 menit",
            thumbnail: "assets/images/course/ekonomi/18.jpg",
            hasQuiz: true,
            quiz: {
              question: "QRIS di Indonesia berfungsi untuk apa?",
              options: [
                { id: "a", text: "Menyimpan data karyawan" },
                {
                  id: "b",
                  text: "Menyatukan berbagai metode pembayaran digital dalam satu kode QR",
                },
                { id: "c", text: "Mengganti mata uang rupiah" },
                { id: "d", text: "Menghitung pajak usaha" },
              ],
              correct: "b",
              explanation:
                "QRIS (Quick Response Code Indonesian Standard) menyatukan berbagai layanan pembayaran digital dalam satu kode QR, memudahkan transaksi bisnis.",
            },
          },
        ],
      },
    ],
  };

  // Course lain — dummy, untuk katalog "Jelajahi Course" (belum punya materi/detail sungguhan)
  const RECOMMENDED = [
    {
      id: "r1",
      title: "Dasar-Dasar Membangun Bisnis",
      category: "Bisnis",
      level: "Pemula",
      duration: "4 Jam",
      rating: 4.6,
      image: "assets/images/course/recommended/01.jpg",
      icon: "fa-briefcase",
    },
    {
      id: "r2",
      title: "Fundamental Digital Marketing",
      category: "Marketing",
      level: "Menengah",
      duration: "5 Jam",
      rating: 4.7,
      image: "assets/images/course/recommended/02.jpg",
      icon: "fa-bullhorn",
    },
    {
      id: "r3",
      title: "Manajemen Keuangan untuk UMKM",
      category: "Keuangan",
      level: "Pemula",
      duration: "5 Jam",
      rating: 4.9,
      image: "assets/images/course/recommended/03.jpg",
      icon: "fa-sack-dollar",
    },
    {
      id: "r4",
      title: "Strategi Membangun Bisnis di Era Digital",
      category: "Digital",
      level: "Lanjutan",
      duration: "7 Jam",
      rating: 4.5,
      image: "assets/images/course/recommended/04.jpg",
      icon: "fa-laptop-code",
    },
  ];

  const CATEGORIES = [
    "Semua",
    "Bisnis",
    "Ekonomi",
    "Marketing",
    "Keuangan",
    "UMKM",
    "Digital",
  ];
  const LEVELS = ["Semua", "Pemula", "Menengah", "Lanjutan"];
  const MODULE_ICON = {
    1: "fa-lightbulb",
    2: "fa-chart-simple",
    3: "fa-flag",
    4: "fa-earth-asia",
    5: "fa-piggy-bank",
    6: "fa-money-bill-wave",
  };

  // Semua 18 materi diratakan jadi satu daftar berurutan — memudahkan cari next/prev & lookup by id
  const ALL_LESSONS = [];
  COURSE.modules.forEach((m) =>
    m.lessons.forEach((l) =>
      ALL_LESSONS.push({ ...l, moduleId: m.id, moduleTitle: m.title }),
    ),
  );
  const findLesson = (id) => ALL_LESSONS.find((l) => l.id === id);
  const lessonPos = (id) => ALL_LESSONS.findIndex((l) => l.id === id) + 1;

  /* =====================================================================
     2. STORAGE — progress, bookmark, catatan, skor quiz (localStorage)
     ===================================================================== */
  const LS = {
    completed: "kembangin_course_completed",
    bookmarks: "kembangin_course_bookmarks",
    notes: "kembangin_course_notes",
    quiz: "kembangin_course_quiz",
    last: "kembangin_course_last",
  };
  const store = {
    get: (k, d) => {
      try {
        const v = JSON.parse(localStorage.getItem(k));
        return v === null ? d : v;
      } catch (_) {
        return d;
      }
    },
    set: (k, v) => {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch (_) {}
    },
  };
  let completed = new Set(store.get(LS.completed, []));
  let bookmarks = new Set(store.get(LS.bookmarks, []));
  let notes = store.get(LS.notes, {});
  let quizAnswers = store.get(LS.quiz, {});
  let lastLessonId = store.get(LS.last, null);
  let currentLessonId = null;

  const isDone = (id) => completed.has(id);
  const isMarked = (id) => bookmarks.has(id);
  const progressPct = () =>
    Math.round((completed.size / COURSE.totalLessons) * 100);

  /* =====================================================================
     3. HELPERS UMUM
     ===================================================================== */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );

  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    clearTimeout(toastTimer);
    el.textContent = msg;
    el.hidden = false;
    toastTimer = setTimeout(() => {
      el.hidden = true;
    }, 2200);
  }
  const comingSoon = () => toast("Fitur ini akan segera hadir");

  /* =====================================================================
     4. VIEW SWITCHING (Landing / Detail / Player / Completion — 1 halaman)
     ===================================================================== */
  const VIEWS = ["landing", "detail", "player", "completion"];
  function switchView(name, opts = {}) {
    VIEWS.forEach((v) => {
      $(`#view-${v}`).hidden = v !== name;
    });
    if (!opts.keepScroll) window.scrollTo({ top: 0, behavior: "smooth" });
    if (name === "landing") {
      renderContinueCard();
      renderCatalog();
    }
    if (name === "detail") renderDetail();
    if (name === "completion") renderCompletion();
    setupReveal();
  }

  /* =====================================================================
     5. ACCORDION KURIKULUM (dipakai di Landing preview & Detail penuh)
     ===================================================================== */
  function curriculumHTML() {
    return COURSE.modules
      .map((m) => {
        const doneInMod = m.lessons.filter((l) => isDone(l.id)).length;
        return `<div class="module" data-mod="${m.id}">
        <button class="module-head" data-toggle-mod="${m.id}">
          <span class="module-num"><i class="fa-solid ${MODULE_ICON[m.id]}"></i></span>
          <span class="module-b"><b>Modul ${String(m.id).padStart(2, "0")} — ${esc(m.title)}</b><span>${m.lessons.length} Materi${doneInMod ? ` · ${doneInMod} selesai` : ""}</span></span>
          <i class="fa-solid fa-chevron-down chev"></i>
        </button>
        <div class="module-body">
          ${m.lessons
            .map(
              (l) => `
            <button class="lesson-row${isDone(l.id) ? " done" : ""}" data-open-lesson="${l.id}">
              <i class="fa-solid ${isDone(l.id) ? "fa-circle-check" : "fa-circle"} lesson-check"></i>
              <span class="lesson-row-b"><b>${lessonPos(l.id)}. ${esc(l.title)}</b><span>${esc(l.duration)}</span></span>
              <i class="fa-${isMarked(l.id) ? "solid" : "regular"} fa-bookmark lesson-bm${isMarked(l.id) ? " on" : ""}"></i>
            </button>`,
            )
            .join("")}
        </div>
      </div>`;
      })
      .join("");
  }
  function bindCurriculum(container) {
    container.addEventListener("click", (e) => {
      const tg = e.target.closest("[data-toggle-mod]");
      if (tg) {
        $(
          `.module[data-mod="${tg.dataset.toggleMod}"]`,
          container,
        ).classList.toggle("open");
        return;
      }
      const op = e.target.closest("[data-open-lesson]");
      if (op) openPlayer(Number(op.dataset.openLesson));
    });
  }

  /* =====================================================================
     6. LANDING — hero, continue card, featured, stats, katalog
     ===================================================================== */
  function renderContinueCard() {
    const box = $("#continue-card");
    if (completed.size > 0 && lastLessonId) {
      const l = findLesson(lastLessonId) || ALL_LESSONS[0];
      box.innerHTML = `
        <div class="cc-b">
          <span class="cc-tag">Lanjutkan Belajar</span>
          <h3>${esc(COURSE.title)}</h3>
          <p>Materi terakhir: "${esc(l.title)}"</p>
          <div class="cc-progress"><div class="progress-bar"><div class="progress-fill" style="width:${progressPct()}%"></div></div><b>${progressPct()}%</b></div>
        </div>
        <button class="btn" id="cc-btn">Lanjutkan</button>`;
      $("#cc-btn").addEventListener("click", () => openPlayer(lastLessonId));
    } else {
      box.innerHTML = `
        <div class="cc-b">
          <span class="cc-tag">Mulai Belajar</span>
          <h3>Mulai perjalanan belajarmu</h3>
          <p>Pahami dasar ekonomi untuk mengambil keputusan bisnis yang lebih baik.</p>
        </div>
        <button class="btn" id="cc-btn">Mulai Course</button>`;
      $("#cc-btn").addEventListener("click", () => switchView("detail"));
    }
  }

  function statRow(c) {
    return `<li><i class="fa-regular fa-clock"></i> ${esc(c.level)} · ${esc(c.duration)}</li>
      <li><i class="fa-solid fa-layer-group"></i> ${c.totalModules} Modul</li>
      <li><i class="fa-solid fa-book-open"></i> ${c.totalLessons} Materi</li>
      <li><i class="fa-solid fa-users"></i> ${(c.students / 1000).toFixed(1)}K+ Peserta</li>
      <li><i class="fa-solid fa-star"></i> ${c.rating}</li>`;
  }
  function renderFeatured() {
    $("#featured-title").textContent = COURSE.title;
    $("#featured-desc").textContent = COURSE.description;
    $("#featured-stats").innerHTML = statRow(COURSE);
    $("#featured-cta").addEventListener("click", () => switchView("detail"));
    $("#featured-thumb").addEventListener("click", () => switchView("detail"));
  }

  function renderStatsGrid() {
    const items = [
      { n: COURSE.totalModules, label: "Modul" },
      { n: COURSE.totalLessons, label: "Materi" },
      { n: 6, suffix: " Jam", label: "Durasi" },
      { n: 1.2, suffix: "K+", label: "Peserta", decimal: true },
      { n: COURSE.rating, label: "Rating", decimal: true },
    ];
    $("#stats-grid").innerHTML = items
      .map(
        (it) => `
      <div class="stat-item"><b data-count="${it.n}" data-suffix="${it.suffix || ""}" data-decimal="${it.decimal ? "1" : ""}">0</b><span>${it.label}</span></div>`,
      )
      .join("");
  }

  // Katalog gabungan: course asli + 4 dummy, dengan search + filter kategori/level
  const catState = { q: "", cat: "Semua", level: "Semua" };
  function catalogItems() {
    return [
      {
        id: "course",
        real: true,
        title: COURSE.title,
        category: COURSE.category,
        level: COURSE.level,
        duration: COURSE.duration,
        rating: COURSE.rating,
        image: COURSE.image,
        icon: "fa-chart-line",
      },
      ...RECOMMENDED.map((r) => ({ ...r, real: false })),
    ];
  }
  function renderCatalogFilters() {
    $("#cat-filter").innerHTML = CATEGORIES.map(
      (c) =>
        `<button class="chip${c === catState.cat ? " on" : ""}" data-cat="${c}">${c}</button>`,
    ).join("");
    $("#level-filter").innerHTML = LEVELS.map(
      (l) =>
        `<button class="chip${l === catState.level ? " on" : ""}" data-lvl="${l}">${l}</button>`,
    ).join("");
  }
  function courseCard(c) {
    return `<article class="course-card" data-card="${c.id}">
      <div class="thumb"><i class="fa-solid ${c.icon} thumb-ic"></i><img src="${c.image}" alt="${esc(c.title)}" loading="lazy" onerror="this.classList.add('broken')"></div>
      <div class="course-card-b">
        <div class="cc-top"><span class="cc-cat">${esc(c.category)}</span><span class="cc-level">${esc(c.level)}</span></div>
        <h3>${esc(c.title)}</h3>
        <div class="cc-meta"><span><i class="fa-regular fa-clock"></i> ${esc(c.duration)}</span><span class="rating"><i class="fa-solid fa-star"></i> ${c.rating}</span></div>
      </div>
    </article>`;
  }
  function renderCatalog() {
    renderCatalogFilters();
    const q = catState.q.trim().toLowerCase();
    const items = catalogItems().filter(
      (c) =>
        (catState.cat === "Semua" || c.category === catState.cat) &&
        (catState.level === "Semua" || c.level === catState.level) &&
        (!q || (c.title + " " + c.category).toLowerCase().includes(q)),
    );
    $("#course-grid").innerHTML = items.map(courseCard).join("");
    $("#catalog-empty").hidden = items.length > 0;
  }
  $("#course-search").addEventListener("input", (e) => {
    catState.q = e.target.value;
    renderCatalog();
  });
  $("#cat-filter").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (b) {
      catState.cat = b.dataset.cat;
      renderCatalog();
    }
  });
  $("#level-filter").addEventListener("click", (e) => {
    const b = e.target.closest("[data-lvl]");
    if (b) {
      catState.level = b.dataset.lvl;
      renderCatalog();
    }
  });
  $("#course-grid").addEventListener("click", (e) => {
    const card = e.target.closest("[data-card]");
    if (!card) return;
    if (card.dataset.card === "course") switchView("detail");
    else comingSoon();
  });

  /* =====================================================================
     7. DETAIL VIEW
     ===================================================================== */
  function ctaLabel() {
    return completed.size > 0 ? "Lanjutkan Belajar" : "Mulai Belajar";
  }
  function renderDetail() {
    $("#detail-title").textContent = COURSE.title;
    $("#detail-mentor").textContent = "Mentor: " + COURSE.mentor;
    $("#detail-desc").textContent = COURSE.description;
    $("#detail-stats").innerHTML = statRow(COURSE);
    $("#detail-price").textContent = COURSE.price;
    $("#detail-cta").innerHTML =
      `<i class="fa-solid fa-play"></i> ${ctaLabel()}`;
    $("#detail-checklist").innerHTML = COURSE.whatYouWillLearn
      .map((t) => `<li><i class="fa-solid fa-circle-check"></i> ${esc(t)}</li>`)
      .join("");
    const cur = $("#curriculum-detail");
    cur.innerHTML = curriculumHTML();

    const saved = ALL_LESSONS.filter((l) => isMarked(l.id));
    $("#saved-list").innerHTML = saved
      .map(
        (l) =>
          `<li><button data-open-lesson="${l.id}"><i class="fa-solid fa-bookmark"></i> ${esc(l.title)}</button></li>`,
      )
      .join("");
    $("#saved-empty").hidden = saved.length > 0;
  }
  $("#detail-cta").addEventListener("click", () =>
    openPlayer(lastLessonId || ALL_LESSONS[0].id),
  );
  bindCurriculum($("#curriculum-detail"));
  bindCurriculum($("#curriculum-landing"));
  $("#saved-list").addEventListener("click", (e) => {
    const b = e.target.closest("[data-open-lesson]");
    if (b) openPlayer(Number(b.dataset.openLesson));
  });
  $$("[data-back]").forEach((b) =>
    b.addEventListener("click", () => switchView(b.dataset.back)),
  );

  /* =====================================================================
     8. PLAYER — sidebar modul, konten materi, quiz, catatan, bookmark
     ===================================================================== */
  function sideModulesHTML() {
    return COURSE.modules
      .map(
        (
          m,
        ) => `<div class="side-module${m.lessons.some((l) => l.id === currentLessonId) ? " open" : ""}" data-smod="${m.id}">
      <button class="side-module-head" data-toggle-smod="${m.id}"><span>Modul ${m.id} — ${esc(m.title)}</span><i class="fa-solid fa-chevron-down"></i></button>
      <div class="side-module-body">
        ${m.lessons.map((l) => `<button class="side-lesson${l.id === currentLessonId ? " current" : ""}${isDone(l.id) ? " done" : ""}" data-slesson="${l.id}"><i class="fa-solid ${isDone(l.id) ? "fa-circle-check" : "fa-circle"}"></i> ${lessonPos(l.id)}. ${esc(l.title)}</button>`).join("")}
      </div>
    </div>`,
      )
      .join("");
  }
  function bindSideModules(container) {
    container.addEventListener("click", (e) => {
      const tg = e.target.closest("[data-toggle-smod]");
      if (tg) {
        $(
          `.side-module[data-smod="${tg.dataset.toggleSmod}"]`,
          container,
        ).classList.toggle("open");
        return;
      }
      const sl = e.target.closest("[data-slesson]");
      if (sl) openPlayer(Number(sl.dataset.slesson));
    });
  }
  bindSideModules($("#side-modules"));
  bindSideModules($("#side-modules-m"));

  function renderProgressUI() {
    const pct = progressPct();
    [
      ["#progress-text", "#progress-fill", "#progress-pct"],
      ["#progress-text-m", "#progress-fill-m", null],
    ].forEach(([t, f, p]) => {
      $(t).textContent =
        `${completed.size} dari ${COURSE.totalLessons} materi selesai`;
      $(f).style.width = pct + "%";
      if (p) $(p).textContent = pct + "%";
    });
    $("#side-modules").innerHTML = sideModulesHTML();
    $("#side-modules-m").innerHTML = sideModulesHTML();
  }

  function renderQuiz(lesson) {
    const box = $("#quiz-box");
    if (!lesson.hasQuiz) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    box.hidden = false;
    const saved = quizAnswers[lesson.id];
    box.innerHTML = `<h3><i class="fa-solid fa-circle-question"></i> Uji Pemahaman</h3>
      <p>${esc(lesson.quiz.question)}</p>
      <div class="quiz-opts">${lesson.quiz.options.map((o) => `<button class="quiz-opt" data-opt="${o.id}" ${saved ? "disabled" : ""}>${esc(o.text)}</button>`).join("")}</div>
      <div class="quiz-result" id="quiz-result" ${saved ? "" : "hidden"}></div>`;
    if (saved) markQuizResult(lesson, saved.selected);
    $$(".quiz-opt", box).forEach((btn) =>
      btn.addEventListener("click", () => {
        if (quizAnswers[lesson.id]) return;
        quizAnswers[lesson.id] = {
          selected: btn.dataset.opt,
          correct: btn.dataset.opt === lesson.quiz.correct,
        };
        store.set(LS.quiz, quizAnswers);
        $$(".quiz-opt", box).forEach((b) => (b.disabled = true));
        markQuizResult(lesson, btn.dataset.opt);
      }),
    );
  }
  function markQuizResult(lesson, selectedId) {
    const box = $("#quiz-box");
    $$(".quiz-opt", box).forEach((b) => {
      if (b.dataset.opt === lesson.quiz.correct) b.classList.add("correct");
      else if (b.dataset.opt === selectedId) b.classList.add("wrong");
    });
    const ok = selectedId === lesson.quiz.correct;
    const res = $("#quiz-result");
    res.hidden = false;
    res.innerHTML = `<b>${ok ? "Jawaban benar! 🎉" : "Belum tepat."}</b><br>${esc(lesson.quiz.explanation)}`;
  }

  function openPlayer(id) {
    currentLessonId = id;
    lastLessonId = id;
    store.set(LS.last, id);
    const l = findLesson(id);
    const pos = lessonPos(id);

    $("#lesson-count").textContent =
      `Materi ${pos} dari ${COURSE.totalLessons}`;
    $("#lesson-title").textContent = `${pos}. ${l.title}`;
    $("#lesson-desc").textContent = l.description;
    const thumb = $("#lesson-thumb");
    const thumbImg = thumb.querySelector("img");
    thumbImg.classList.remove("broken");
    thumbImg.setAttribute("src", l.thumbnail);
    thumbImg.setAttribute("alt", l.title);

    updateActionButtons(l);
    renderQuiz(l);
    const notesPanel = $("#notes-panel");
    notesPanel.hidden = true;
    $("#notes-text").value = notes[id] || "";
    $("#notes-saved").hidden = true;

    $("#lesson-prev").disabled = pos <= 1;
    $("#lesson-next").innerHTML =
      pos >= COURSE.totalLessons
        ? "Selesai"
        : 'Berikutnya <i class="fa-solid fa-arrow-right"></i>';

    renderProgressUI();
    $("#drawer").hidden = true;
    switchView("player", { keepScroll: false });
  }

  function updateActionButtons(l) {
    const cBtn = $("#btn-complete"),
      bBtn = $("#btn-bookmark");
    cBtn.classList.toggle("active", isDone(l.id));
    cBtn.innerHTML = isDone(l.id)
      ? '<i class="fa-solid fa-check"></i> Selesai'
      : '<i class="fa-regular fa-circle-check"></i> Tandai Selesai';
    bBtn.classList.toggle("active", isMarked(l.id));
    bBtn.innerHTML = isMarked(l.id)
      ? '<i class="fa-solid fa-bookmark"></i> Tersimpan'
      : '<i class="fa-regular fa-bookmark"></i> Bookmark';
  }

  $("#btn-complete").addEventListener("click", () => {
    const id = currentLessonId;
    if (isDone(id)) completed.delete(id);
    else completed.add(id);
    store.set(LS.completed, [...completed]);
    updateActionButtons(findLesson(id));
    renderProgressUI();
    if (completed.size === COURSE.totalLessons) {
      setTimeout(() => switchView("completion"), 500);
      return;
    }
  });
  $("#btn-bookmark").addEventListener("click", () => {
    const id = currentLessonId;
    isMarked(id) ? bookmarks.delete(id) : bookmarks.add(id);
    store.set(LS.bookmarks, [...bookmarks]);
    updateActionButtons(findLesson(id));
  });
  $("#btn-notes").addEventListener("click", () => {
    const p = $("#notes-panel");
    p.hidden = !p.hidden;
    if (!p.hidden) $("#notes-text").focus();
  });
  $("#notes-save").addEventListener("click", () => {
    const text = $("#notes-text").value.trim();
    if (text) notes[currentLessonId] = text;
    else delete notes[currentLessonId];
    store.set(LS.notes, notes);
    $("#notes-saved").hidden = false;
    setTimeout(() => {
      $("#notes-saved").hidden = true;
    }, 2000);
  });
  $("#res-notes").addEventListener("click", () => {
    $("#notes-panel").hidden = false;
    $("#notes-text").focus({ preventScroll: false });
    $("#notes-panel").scrollIntoView({ behavior: "smooth", block: "center" });
  });
  $$(".res-item[data-res]").forEach((b) =>
    b.addEventListener("click", comingSoon),
  );

  $("#lesson-prev").addEventListener("click", () => {
    const pos = lessonPos(currentLessonId);
    if (pos > 1) openPlayer(ALL_LESSONS[pos - 2].id);
  });
  $("#lesson-next").addEventListener("click", () => {
    const pos = lessonPos(currentLessonId);
    if (pos < COURSE.totalLessons) openPlayer(ALL_LESSONS[pos].id);
    else if (completed.size === COURSE.totalLessons) switchView("completion");
    else toast("Tandai materi ini selesai untuk menyelesaikan course");
  });

  /* ---- Drawer modul (mobile) ---- */
  $("#drawer-open").addEventListener("click", () => {
    $("#drawer").hidden = false;
  });
  $("#drawer-close").addEventListener("click", () => {
    $("#drawer").hidden = true;
  });
  $("#drawer-close-bg").addEventListener("click", () => {
    $("#drawer").hidden = true;
  });

  /* =====================================================================
     9. COMPLETION VIEW
     ===================================================================== */
  function renderCompletion() {
    /* konten statis, tidak perlu render dinamis */
  }
  $("#completion-again").addEventListener("click", () =>
    openPlayer(ALL_LESSONS[0].id),
  );

  /* =====================================================================
     10. KEMBA AI — asisten berbasis skrip, khusus fitur halaman Course
     ===================================================================== */
  const AI_FAQ = [
    {
      k: ["mulai", "memulai"],
      a: 'Klik tombol "Mulai Belajar" pada course, atau di card Course pada Beranda, untuk mulai belajar dari materi pertama.',
    },
    {
      k: ["materi", "modul", "isi course"],
      a: "Course ini memiliki 6 modul dan 18 materi tentang ekonomi dasar, indikator ekonomi, kondisi Indonesia, ekonomi global, literasi keuangan, dan sistem pembayaran.",
    },
    {
      k: ["progress", "kemajuan"],
      a: 'Progress belajarmu otomatis tersimpan di perangkat ini. Kamu bisa melihatnya di kartu "Progress Belajar" pada halaman Player.',
    },
    {
      k: ["bookmark", "simpan"],
      a: 'Klik ikon bookmark pada materi untuk menyimpannya. Materi tersimpan bisa dilihat di bagian "Materi Tersimpan" pada halaman Course Detail.',
    },
    {
      k: ["catatan", "note"],
      a: 'Klik tombol "Catatan" di halaman materi untuk menulis catatanmu sendiri. Catatan otomatis tersimpan di perangkat ini.',
    },
    {
      k: ["quiz", "kuis"],
      a: "Beberapa materi memiliki quiz singkat untuk menguji pemahamanmu. Jawaban dan penjelasannya langsung muncul setelah kamu memilih.",
    },
    {
      k: ["selesai", "sertifikat"],
      a: 'Setelah menyelesaikan semua 18 materi, kamu akan melihat halaman "Course Selesai!" sebagai tanda kamu telah menuntaskan course ini.',
    },
  ];
  function aiAnswer(q) {
    const t = q.toLowerCase();
    const hit = AI_FAQ.find((f) => f.k.some((kw) => t.includes(kw)));
    return hit
      ? hit.a
      : "Maaf, Kemba AI di halaman ini hanya membantu seputar fitur Course Kembangin — coba tanyakan cara memulai course, materi, progress, bookmark, catatan, atau quiz.";
  }
  function aiBubble(text, who) {
    return `<div class="ai-msg ${who}">${esc(text)}</div>`;
  }
  $("#ai-fab").addEventListener("click", () => {
    const p = $("#ai-panel");
    p.hidden = !p.hidden;
    if (!p.hidden && !$("#ai-body").children.length) {
      $("#ai-body").innerHTML = aiBubble(
        "Halo! Aku Kemba AI. Tanyakan cara menggunakan fitur Course Kembangin, ya.",
        "bot",
      );
    }
  });
  $("#ai-close").addEventListener("click", () => {
    $("#ai-panel").hidden = true;
  });
  $("#ai-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#ai-input");
    const q = input.value.trim();
    if (!q) return;
    const body = $("#ai-body");
    body.insertAdjacentHTML("beforeend", aiBubble(q, "user"));
    body.insertAdjacentHTML("beforeend", aiBubble(aiAnswer(q), "bot"));
    input.value = "";
    body.scrollTop = body.scrollHeight;
  });

  /* =====================================================================
     11. NAVBAR — hamburger, search shortcut, profile
     ===================================================================== */
  $("#nav-burger").addEventListener("click", () => {
    $("#mobile-menu").hidden = !$("#mobile-menu").hidden;
  });
  $("#nav-search-btn").addEventListener("click", () => {
    switchView("landing");
    setTimeout(() => {
      $("#course-search").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      $("#course-search").focus();
    }, 250);
  });
  $("#nav-profile").addEventListener("click", comingSoon);
  $$("[data-soon]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      comingSoon();
    }),
  );
  $("#hero-start").addEventListener("click", () => switchView("detail"));
  $("#hero-explore").addEventListener("click", () => {
    $("#course-search").scrollIntoView({ behavior: "smooth", block: "center" });
  });

  /* =====================================================================
     12. ANIMASI — reveal on scroll & count-up statistik
     ===================================================================== */
  let revealObserver;
  function setupReveal() {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              revealObserver.unobserve(en.target);
            }
          });
        },
        { threshold: 0.15 },
      );
    }
    $$(".reveal").forEach((el) => {
      if (!el.classList.contains("in")) revealObserver.observe(el);
    });
  }
  function setupCountUp() {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          obs.unobserve(en.target);
          const el = en.target;
          const end = parseFloat(el.dataset.count);
          const decimal = el.dataset.decimal === "1";
          const suffix = el.dataset.suffix || "";
          let cur = 0;
          const step = end / 30;
          const t = setInterval(() => {
            cur += step;
            if (cur >= end) {
              cur = end;
              clearInterval(t);
            }
            el.textContent =
              (decimal ? cur.toFixed(1) : Math.round(cur)) + suffix;
          }, 25);
        });
      },
      { threshold: 0.4 },
    );
    $$("#stats-grid b").forEach((el) => obs.observe(el));
  }

  /* =====================================================================
     13. INIT
     ===================================================================== */
  function init() {
    renderFeatured();
    renderStatsGrid();
    renderContinueCard();
    $("#curriculum-landing").innerHTML = curriculumHTML();
    $("#curriculum-total-landing").textContent =
      `Total: ${COURSE.totalModules} Modul · ${COURSE.totalLessons} Materi`;
    renderCatalog();
    setupReveal();
    setupCountUp();
  }
  init();
})();
