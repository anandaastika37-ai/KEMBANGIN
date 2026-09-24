(() => {
  "use strict";

  /* =====================================================================
     Halaman course: roadmap 10 tahap -> daftar materi per tahap -> player.
     Data diambil dari data/course-ekonomi.json lewat fetch(). Progres,
     bookmark, catatan, dan jawaban quiz disimpan di localStorage, dipakai
     juga untuk analisis progres dan mengunci tahap berikutnya (roadmap).
     Kemba AI di bagian bawah file ini adalah PROTOTIPE tampilan saja —
     jawabannya dicocokkan dari daftar FAQ sederhana, bukan model AI.
     ===================================================================== */
  const COURSE_JSON_URL = "../database/course.json";

  let COURSE = null;
  let ALL_LESSONS = [];
  const findLesson = (id) => ALL_LESSONS.find((l) => l.id === id);
  const lessonPos = (id) => ALL_LESSONS.findIndex((l) => l.id === id) + 1;

  /* ---------------- STORAGE ---------------- */
  let LS = {};
  let completed = new Set();
  let bookmarks = new Set();
  let notes = {};
  let quizAnswers = {};
  let lastLessonId = null;
  let currentLessonId = null;

  const store = {
    get: (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };

  function initStorageKeys() {
    LS = {
      completed: "kembangin_course_" + COURSE.id + "_completed",
      bookmarks: "kembangin_course_" + COURSE.id + "_bookmarks",
      notes: "kembangin_course_" + COURSE.id + "_notes",
      quiz: "kembangin_course_" + COURSE.id + "_quiz",
      last: "kembangin_course_" + COURSE.id + "_last"
    };
    completed = new Set(store.get(LS.completed, []));
    bookmarks = new Set(store.get(LS.bookmarks, []));
    notes = store.get(LS.notes, {});
    quizAnswers = store.get(LS.quiz, {});
    lastLessonId = store.get(LS.last, null);
  }

  const isDone = (id) => completed.has(id);
  const isMarked = (id) => bookmarks.has(id);
  const progressPct = () => Math.round((completed.size / COURSE.totalLessons) * 100);

  /* ---------------- HELPERS ---------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    clearTimeout(toastTimer);
    el.textContent = msg;
    el.hidden = false;
    toastTimer = setTimeout(() => { el.hidden = true; }, 2800);
  }

  /* =====================================================================
     ROADMAP: status & progres per tahap
     ===================================================================== */
  function stageDoneCount(si) {
    return COURSE.roadmap[si].lessons.filter((l) => isDone(l.id)).length;
  }
  function stageTotal(si) { return COURSE.roadmap[si].lessons.length; }

  // 'done'    -> semua materi tahap ini sudah selesai
  // 'current' -> tahap pertama yang belum selesai (dan semua tahap sebelumnya sudah)
  // 'locked'  -> masih ada tahap sebelumnya yang belum selesai
  function stageStatus(si) {
    if (stageDoneCount(si) >= stageTotal(si)) return "done";
    for (let i = 0; i < si; i++) {
      if (stageDoneCount(i) < stageTotal(i)) return "locked";
    }
    return "current";
  }

  function quizStats() {
    let total = 0, answered = 0, correct = 0;
    ALL_LESSONS.forEach((l) => {
      if (!l.quiz) return;
      total++;
      const ans = quizAnswers[l.id];
      if (ans !== undefined) {
        answered++;
        if (ans === l.quiz.correctIndex) correct++;
      }
    });
    return { total, answered, correct };
  }

  function formatMenit(totalMenit) {
    if (totalMenit < 60) return totalMenit + " menit";
    const h = Math.floor(totalMenit / 60), m = totalMenit % 60;
    return h + " jam" + (m ? " " + m + " menit" : "");
  }

  /* ---------------- VIEW SWITCHING ---------------- */
  function switchView(name) {
    ["list", "player"].forEach((v) => { $(`#view-${v}`).hidden = v !== name; });
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (name === "list") renderList();
    setupReveal();
  }

  /* =====================================================================
     HEADER
     ===================================================================== */
  function renderHeader() {
    $("#course-title").textContent = COURSE.title;
    $("#course-meta").innerHTML =
      `<span><i class="fa-solid fa-road"></i>${COURSE.totalStages} Tahap Roadmap</span>` +
      `<span><i class="fa-solid fa-book-open"></i>${COURSE.totalLessons} Materi</span>` +
      `<span><i class="fa-regular fa-clock"></i>${esc(COURSE.duration)}</span>` +
      `<span><i class="fa-solid fa-seedling"></i>${esc(COURSE.level)}</span>`;

    const pct = progressPct();
    $("#header-progress-fill").style.width = pct + "%";
    $("#header-progress-label").innerHTML =
      `${completed.size} dari ${COURSE.totalLessons} materi selesai <b>${pct}%</b>`;

    const resumeBtn = $("#resume-btn");
    const doneBanner = $("#done-banner");

    if (completed.size >= COURSE.totalLessons) {
      resumeBtn.hidden = true;
      doneBanner.hidden = false;
    } else {
      doneBanner.hidden = true;
      resumeBtn.hidden = false;
      resumeBtn.innerHTML = completed.size > 0
        ? '<i class="fa-solid fa-play"></i> Lanjutkan Belajar'
        : '<i class="fa-solid fa-play"></i> Mulai Belajar';
    }
  }

  /* =====================================================================
     ROADMAP TRACK (visual jalur 10 tahap)
     ===================================================================== */
  function roadmapNodeHtml(stage, si) {
    const status = stageStatus(si);
    const done = stageDoneCount(si), total = stageTotal(si);
    const icon = status === "done" ? '<i class="fa-solid fa-check"></i>'
      : status === "locked" ? '<i class="fa-solid fa-lock"></i>'
      : (si + 1);
    return `<button type="button" class="road-node road-node--${status}" data-stage="${si}" aria-label="Tahap ${si + 1}: ${esc(stage.title)}">
      <span class="road-node__circle">${icon}</span>
      <span class="road-node__label">
        <b>Tahap ${si + 1}</b>
        <span>${esc(stage.title)}</span>
        <em>${done}/${total} materi</em>
      </span>
    </button>`;
  }

  function renderRoadmapTrack() {
    $("#roadmap-track").innerHTML = COURSE.roadmap.map((s, si) => roadmapNodeHtml(s, si)).join('<span class="road-line"></span>');
    $$(".road-node", $("#roadmap-track")).forEach((btn) => {
      btn.addEventListener("click", () => {
        const si = parseInt(btn.dataset.stage, 10);
        if (stageStatus(si) === "locked") {
          toast("Selesaikan tahap sebelumnya dulu untuk membuka tahap ini.");
          return;
        }
        const target = $(`[data-stage-section="${si}"]`);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* =====================================================================
     ANALISIS PROGRES BELAJAR
     ===================================================================== */
  function renderAnalytics() {
    const stagesDone = COURSE.roadmap.filter((s, si) => stageStatus(si) === "done").length;
    const menitSelesai = ALL_LESSONS.filter((l) => isDone(l.id)).reduce((sum, l) => sum + l.duration, 0);
    const qz = quizStats();
    const qzPct = qz.answered ? Math.round((qz.correct / qz.answered) * 100) : null;

    const cards = [
      { label: "Progres Keseluruhan", icon: "fa-chart-simple", value: progressPct() + "%" },
      { label: "Materi Selesai", icon: "fa-book-open", value: completed.size + " / " + COURSE.totalLessons },
      { label: "Tahap Selesai", icon: "fa-road", value: stagesDone + " / " + COURSE.totalStages },
      { label: "Skor Quiz Rata-rata", icon: "fa-circle-question", value: qzPct === null ? "\u2014" : qzPct + "%", sub: qz.answered ? qz.answered + " dari " + qz.total + " quiz dijawab" : "Belum ada quiz dijawab" },
      { label: "Estimasi Waktu Belajar", icon: "fa-hourglass-half", value: formatMenit(menitSelesai) }
    ];

    $("#analytics-cards").innerHTML = cards.map((c) =>
      `<div class="an-card">
        <div class="an-card__label"><i class="fa-solid ${c.icon}"></i>${c.label}</div>
        <div class="an-card__value">${c.value}</div>
        ${c.sub ? `<div class="an-card__sub">${c.sub}</div>` : ""}
      </div>`
    ).join("");

    $("#analytics-bars").innerHTML = COURSE.roadmap.map((s, si) => {
      const done = stageDoneCount(si), total = stageTotal(si);
      const pct = total ? Math.round((done / total) * 100) : 0;
      return `<div class="an-bar-row">
        <span class="an-bar-row__label">Tahap ${si + 1} \u2014 ${esc(s.title)}</span>
        <div class="an-bar-row__track"><div class="an-bar-row__fill" style="width:${pct}%"></div></div>
        <span class="an-bar-row__count">${done}/${total}</span>
      </div>`;
    }).join("");
  }

  /* =====================================================================
     DAFTAR MATERI PER TAHAP
     ===================================================================== */
  function materiCardHtml(lesson) {
    const done = isDone(lesson.id);
    const marked = isMarked(lesson.id);
    return `<article class="materi-card" data-open-lesson="${lesson.id}">
      <div class="thumb">
        <div class="materi-card__badges">
          <span class="materi-card__num">${lessonPos(lesson.id)}</span>
          ${done ? '<span class="materi-card__done"><i class="fa-solid fa-check"></i></span>' : ""}
        </div>
        <i class="fa-solid fa-play thumb-ic"></i>
        <img src="${lesson.thumbnail}" alt="${esc(lesson.title)}" loading="lazy" onerror="this.classList.add('broken')">
      </div>
      <div class="materi-card__body">
        <div class="materi-card__title">${esc(lesson.title)}</div>
        <div class="materi-card__meta">
          <span><i class="fa-regular fa-clock"></i>${lesson.duration} menit</span>
          <span>
            ${lesson.quiz ? '<i class="fa-solid fa-circle-question quiz-flag"></i>' : ""}
            ${marked ? '<i class="fa-solid fa-bookmark bm-flag"></i>' : ""}
          </span>
        </div>
      </div>
    </article>`;
  }

  function renderMateriList() {
    const container = $("#materi-list");
    container.innerHTML = COURSE.roadmap.map((stage, si) => {
      const status = stageStatus(si);
      const done = stageDoneCount(si), total = stageTotal(si);
      const body = status === "locked"
        ? `<div class="materi-locked">
             <i class="fa-solid fa-lock"></i>
             <p>Selesaikan tahap sebelumnya untuk membuka materi di tahap ini.</p>
           </div>`
        : `<div class="materi-grid">${stage.lessons.map(materiCardHtml).join("")}</div>`;

      return `<div class="materi-group reveal" data-stage-section="${si}">
        <div class="materi-group__head">
          <span class="materi-group__title">
            <span class="materi-group__badge materi-group__badge--${status}">
              ${status === "done" ? '<i class="fa-solid fa-check"></i>' : status === "locked" ? '<i class="fa-solid fa-lock"></i>' : "Tahap " + (si + 1)}
            </span>
            ${esc(stage.title)}
          </span>
          <span class="materi-group__count">${done}/${total} materi selesai</span>
        </div>
        <p class="materi-group__desc">${esc(stage.description)}</p>
        ${body}
      </div>`;
    }).join("");

    container.querySelectorAll("[data-open-lesson]").forEach((card) => {
      card.addEventListener("click", () => openPlayer(card.dataset.openLesson));
    });
  }

  function renderList() {
    renderHeader();
    renderRoadmapTrack();
    renderAnalytics();
    renderMateriList();
  }

  function getResumeLessonId() {
    if (lastLessonId && findLesson(lastLessonId)) return lastLessonId;
    const firstIncomplete = ALL_LESSONS.find((l) => !isDone(l.id));
    return firstIncomplete ? firstIncomplete.id : ALL_LESSONS[0].id;
  }

  /* =====================================================================
     PLAYER (view-player)
     ===================================================================== */
  function renderQuiz(lesson) {
    const box = $("#quiz-box");
    if (!lesson.quiz) { box.hidden = true; box.innerHTML = ""; return; }

    box.hidden = false;
    const saved = quizAnswers[lesson.id];
    box.innerHTML =
      `<h3><i class="fa-solid fa-circle-question"></i> Cek Pemahaman</h3>` +
      `<p>${esc(lesson.quiz.question)}</p>` +
      `<div class="quiz-opts">${lesson.quiz.options.map((opt, oi) =>
        `<button class="quiz-opt" data-oi="${oi}" ${saved !== undefined ? "disabled" : ""}>${esc(opt)}</button>`
      ).join("")}</div>` +
      `<div class="quiz-result" id="quiz-result" ${saved !== undefined ? "" : "hidden"}></div>`;

    if (saved !== undefined) markQuizResult(lesson, saved);

    $$(".quiz-opt", box).forEach((btn) => {
      btn.addEventListener("click", () => {
        if (quizAnswers[lesson.id] !== undefined) return;
        const oi = parseInt(btn.dataset.oi, 10);
        quizAnswers[lesson.id] = oi;
        store.set(LS.quiz, quizAnswers);
        $$(".quiz-opt", box).forEach((b) => { b.disabled = true; });
        markQuizResult(lesson, oi);
      });
    });
  }

  function markQuizResult(lesson, selectedIndex) {
    const box = $("#quiz-box");
    $$(".quiz-opt", box).forEach((b) => {
      const oi = parseInt(b.dataset.oi, 10);
      if (oi === lesson.quiz.correctIndex) b.classList.add("correct");
      else if (oi === selectedIndex) b.classList.add("wrong");
    });
    const ok = selectedIndex === lesson.quiz.correctIndex;
    const res = $("#quiz-result");
    res.hidden = false;
    res.innerHTML = `<b>${ok ? "Jawaban benar! \uD83C\uDF89" : "Belum tepat."}</b><br>${esc(lesson.quiz.explanation)}`;
  }

  function updateActionButtons(lesson) {
    const cBtn = $("#btn-complete"), bBtn = $("#btn-bookmark");
    cBtn.classList.toggle("active", isDone(lesson.id));
    cBtn.innerHTML = isDone(lesson.id)
      ? '<i class="fa-solid fa-check"></i> Selesai'
      : '<i class="fa-regular fa-circle-check"></i> Tandai Selesai';
    bBtn.classList.toggle("active", isMarked(lesson.id));
    bBtn.innerHTML = isMarked(lesson.id)
      ? '<i class="fa-solid fa-bookmark"></i> Tersimpan'
      : '<i class="fa-regular fa-bookmark"></i> Bookmark';
  }

  function openPlayer(id) {
    const lesson = findLesson(id);
    if (!lesson) return;
    if (stageStatus(lesson.stageIndex) === "locked") {
      toast("Selesaikan tahap sebelumnya dulu untuk membuka materi ini.");
      return;
    }

    currentLessonId = id;
    lastLessonId = id;
    store.set(LS.last, id);

    const pos = lessonPos(id);
    $("#lesson-count").textContent = `Materi ${pos} dari ${COURSE.totalLessons} \u2014 Tahap ${lesson.stageIndex + 1}: ${lesson.stageTitle}`;
    $("#lesson-title").textContent = lesson.title;
    $("#lesson-desc").textContent = lesson.desc;

    const thumbImg = $("#lesson-thumb img");
    thumbImg.classList.remove("broken");
    thumbImg.src = lesson.thumbnail;
    thumbImg.alt = lesson.title;

    updateActionButtons(lesson);
    renderQuiz(lesson);

    $("#notes-panel").hidden = true;
    $("#notes-text").value = notes[id] || "";
    $("#notes-saved").hidden = true;

    $("#lesson-prev").disabled = pos <= 1;
    $("#lesson-next").innerHTML = pos >= COURSE.totalLessons
      ? '<i class="fa-solid fa-flag-checkered"></i> Selesai'
      : 'Berikutnya <i class="fa-solid fa-arrow-right"></i>';

    switchView("player");
  }

  // Setelah suatu materi ditandai selesai: cek apakah course selesai total,
  // atau tahap saat ini baru saja tuntas sehingga tahap berikutnya terbuka.
  function checkRoadmapUnlock(finishedLesson) {
    if (completed.size >= COURSE.totalLessons) {
      toast("Selamat! Kamu telah menyelesaikan semua materi \uD83C\uDF89");
      setTimeout(() => switchView("list"), 700);
      return;
    }
    const si = finishedLesson.stageIndex;
    const justFinishedStage = stageDoneCount(si) >= stageTotal(si);
    const nextStage = COURSE.roadmap[si + 1];
    if (justFinishedStage && nextStage && stageDoneCount(si + 1) === 0) {
      toast('Tahap "' + nextStage.title + '" sudah terbuka! \uD83D\uDD13');
    }
  }

  function toggleComplete() {
    const lesson = findLesson(currentLessonId);
    if (isDone(lesson.id)) completed.delete(lesson.id); else completed.add(lesson.id);
    store.set(LS.completed, [...completed]);
    updateActionButtons(lesson);
    if (isDone(lesson.id)) checkRoadmapUnlock(lesson);
  }

  function toggleBookmark() {
    const id = currentLessonId;
    if (isMarked(id)) bookmarks.delete(id); else bookmarks.add(id);
    store.set(LS.bookmarks, [...bookmarks]);
    updateActionButtons(findLesson(id));
  }

  function toggleNotesPanel() {
    const panel = $("#notes-panel");
    panel.hidden = !panel.hidden;
    if (!panel.hidden) { $("#notes-text").focus(); }
  }

  function saveCurrentNote() {
    const text = $("#notes-text").value.trim();
    if (text) notes[currentLessonId] = text; else delete notes[currentLessonId];
    store.set(LS.notes, notes);
    $("#notes-saved").hidden = false;
    setTimeout(() => { $("#notes-saved").hidden = true; }, 2000);
  }

  function goPrev() {
    const pos = lessonPos(currentLessonId);
    if (pos > 1) openPlayer(ALL_LESSONS[pos - 2].id);
  }
  function goNext() {
    const lesson = findLesson(currentLessonId);
    const pos = lessonPos(currentLessonId);
    if (pos < COURSE.totalLessons) {
      const nextLesson = ALL_LESSONS[pos];
      if (stageStatus(nextLesson.stageIndex) === "locked") {
        toast("Tandai materi ini selesai dulu untuk membuka tahap berikutnya.");
        return;
      }
      openPlayer(nextLesson.id);
      return;
    }
    if (!isDone(currentLessonId)) {
      completed.add(currentLessonId);
      store.set(LS.completed, [...completed]);
    }
    toast("Selamat! Kamu telah menyelesaikan semua materi \uD83C\uDF89");
    setTimeout(() => switchView("list"), 700);
  }

  /* ---------------- REVEAL ON SCROLL ---------------- */
  let revealObserver;
  function setupReveal() {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("in"); revealObserver.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
    }
    $$(".reveal").forEach((el) => { if (!el.classList.contains("in")) revealObserver.observe(el); });
  }

  /* =====================================================================
     KEMBA AI — PROTOTIPE asisten belajar (tampilan + skrip FAQ sederhana,
     bukan model AI sungguhan; belum terhubung ke API apa pun).
     ===================================================================== */
  const AI_FAQ = [
    { k: ["roadmap", "tahap", "terkunci", "kunci"], a: 'Roadmap course ini punya 10 tahap. Tahap berikutnya otomatis terbuka setelah kamu menyelesaikan semua materi di tahap saat ini — urutannya bisa kamu lihat di jalur roadmap paling atas.' },
    { k: ["analisis", "progres", "statistik", "skor"], a: 'Bagian "Analisis Progres Belajar" menampilkan persentase progres, jumlah materi & tahap yang selesai, skor rata-rata quiz, dan estimasi waktu belajar — semuanya dihitung dari aktivitas belajarmu di perangkat ini.' },
    { k: ["mulai", "memulai", "lanjut"], a: 'Klik tombol "Mulai Belajar" atau "Lanjutkan Belajar" di bagian atas halaman untuk membuka materi berikutnya yang belum kamu selesaikan.' },
    { k: ["bookmark", "simpan"], a: 'Klik tombol Bookmark saat membuka sebuah materi untuk menandainya. Materi yang di-bookmark akan muncul dengan ikon penanda di kartu materinya.' },
    { k: ["catatan", "note"], a: 'Klik tombol "Catatan" di halaman materi untuk menulis catatanmu sendiri. Catatan otomatis tersimpan di perangkat ini per materi.' },
    { k: ["quiz", "kuis"], a: 'Beberapa materi (biasanya materi terakhir di tiap tahap) punya quiz singkat. Jawabanmu langsung diberi penjelasan, dan skor rata-ratanya masuk ke Analisis Progres Belajar.' },
    { k: ["selesai", "sertifikat"], a: 'Setelah semua 28 materi di 10 tahap selesai, header halaman akan menampilkan banner "sudah selesai" sebagai tanda kamu menuntaskan roadmap ini.' },
    { k: ["kamu siapa", "siapa kamu", "kembangin ai"], a: 'Aku Kemba AI, prototipe asisten belajar di halaman course ini. Jawabanku masih berupa skrip sederhana (belum model AI sungguhan), fokus membantu seputar fitur di halaman ini.' }
  ];
  function aiAnswer(q) {
    const t = q.toLowerCase();
    const hit = AI_FAQ.find((f) => f.k.some((kw) => t.includes(kw)));
    return hit ? hit.a : "Maaf, aku belum punya jawaban untuk itu. Coba tanyakan seputar roadmap, tahap terkunci, analisis progres, bookmark, catatan, atau quiz di halaman ini, ya.";
  }
  function aiBubble(text, who) {
    return `<div class="ai-msg ${who}">${esc(text)}</div>`;
  }
  function bindAI() {
    const fab = $("#ai-fab"), panel = $("#ai-panel"), body = $("#ai-body"), form = $("#ai-form"), input = $("#ai-input");
    if (!fab) return;

    fab.addEventListener("click", () => {
      panel.hidden = !panel.hidden;
      if (!panel.hidden && !body.children.length) {
        body.innerHTML = aiBubble(
          "Halo! Aku Kemba AI (prototipe). Tanyakan cara memakai fitur roadmap, analisis progres, bookmark, catatan, atau quiz di halaman ini, ya.",
          "bot"
        );
      }
    });
    $("#ai-close").addEventListener("click", () => { panel.hidden = true; });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (!q) return;
      body.insertAdjacentHTML("beforeend", aiBubble(q, "user"));
      body.insertAdjacentHTML("beforeend", aiBubble(aiAnswer(q), "bot"));
      input.value = "";
      body.scrollTop = body.scrollHeight;
    });
  }

  /* ---------------- BINDINGS ---------------- */
  function bind() {
    $("#back-to-list").addEventListener("click", () => switchView("list"));
    $("#resume-btn").addEventListener("click", () => openPlayer(getResumeLessonId()));
    $("#btn-complete").addEventListener("click", toggleComplete);
    $("#btn-bookmark").addEventListener("click", toggleBookmark);
    $("#btn-notes").addEventListener("click", toggleNotesPanel);
    $("#notes-save").addEventListener("click", saveCurrentNote);
    $("#lesson-prev").addEventListener("click", goPrev);
    $("#lesson-next").addEventListener("click", goNext);
    bindAI();
  }

  /* ---------------- LOADING / ERROR STATES ---------------- */
  function showLoading() {
    $("#materi-list").innerHTML = '<p class="state-msg"><i class="fa-solid fa-spinner fa-spin"></i> Memuat materi course...</p>';
  }
  function showLoadError() {
    $("#materi-list").innerHTML =
      '<p class="state-msg state-msg--error"><i class="fa-solid fa-triangle-exclamation"></i> ' +
      "Gagal memuat data course. Periksa koneksi atau path " + COURSE_JSON_URL + ", lalu muat ulang halaman.</p>";
  }

  /* ---------------- INIT ---------------- */
  async function init() {
    bind();
    showLoading();

    let data;
    try {
      const res = await fetch(COURSE_JSON_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);
      data = await res.json();
    } catch (err) {
      // Hanya kegagalan fetch/parse JSON yang dianggap "gagal memuat" —
      // masalah render setelahnya tidak boleh disamarkan jadi pesan ini.
      showLoadError();
      return;
    }

    COURSE = data;
    ALL_LESSONS = [];
    COURSE.roadmap.forEach((stage, si) =>
      stage.lessons.forEach((l) => ALL_LESSONS.push({ ...l, stageIndex: si, stageTitle: stage.title }))
    );

    initStorageKeys();
    switchView("list");
  }

  init();
})();