/* ============================================================
   KEMBANGIN — Halaman Konsultasi (vanilla JS, tanpa dependency)
   Menggunakan data asli dari consultants-data.js (window.CONSULTANTS_DATA)
   ============================================================ */
(function () {
  "use strict";

  const DATA = window.CONSULTANTS_DATA || [];
  const PAGE_SIZE = 12;

  /* ---------------- KLASIFIKASI BIDANG ----------------
     Data asli tidak punya field "kategori" tunggal, jadi bidang
     diturunkan dari spesialisasi + konsultasi memakai kata kunci.
     Satu konsultan bisa masuk lebih dari satu bidang. */
  const CATEGORIES = [
    { id: "strategi", label: "Strategi & Pengembangan Bisnis", keywords: ["strategi bisnis", "business strategy", "pengembangan bisnis", "business development", "business model", "business planning", "business plan", "ekspansi", "expansion", "franchise", "business analysis", "analisis bisnis", "analisis model bisnis", "market analysis", "analisis pasar", "manajemen bisnis", "strategy"] },
    { id: "keuangan", label: "Keuangan & Investasi", keywords: ["keuangan", "finance", "financial", "cash flow", "investasi", "investment", "accounting", "akuntansi"] },
    { id: "marketing", label: "Marketing & Digital Marketing", keywords: ["marketing", "digital marketing", "content", "social media", "consumer behavior", "consumer research"] },
    { id: "branding", label: "Branding", keywords: ["branding", "brand strategy", "brand "] },
    { id: "digital", label: "Digital & E-Commerce", keywords: ["digital business", "e-commerce", "marketplace", "digitalisasi"] },
    { id: "umkm", label: "UMKM", keywords: ["umkm"] },
    { id: "startup", label: "Startup & Produk", keywords: ["startup", "product development", "product strategy", "product"] },
    { id: "sales", label: "Sales & Partnership", keywords: ["sales", "negotiation", "negosiasi", "partnership", "customer acquisition", "retail", "customer experience"] },
    { id: "operasional", label: "Operasional & Supply Chain", keywords: ["operasional", "operations", "sop", "supply chain", "logistik", "logistics"] },
    { id: "leadership", label: "Leadership & SDM", keywords: ["leadership", "hr", "human resources", "management", "manajemen", "kepemimpinan"] }
  ];

  const EDU_COLORS = { S1: "#4c7dff", S2: "#7c9bff", MBA: "#34d399" };
  const EDU_LABELS = { S1: "Sarjana (S1)", S2: "Magister (S2)", MBA: "MBA" };

  const TIME_SLOTS = ["09:00", "10:00", "13:00", "14:00", "16:00", "19:00"];
  const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const MONTH_NAMES_FULL = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  /* ---------------- STATE ---------------- */
  const state = {
    search: "",
    bidang: "Semua",
    pengalaman: "Semua",
    pendidikan: "Semua",
    rating: "Semua",
    durasi: "Semua",
    sort: "default",
    visibleCount: PAGE_SIZE
  };

  const booking = { consultant: null, dateIndex: null, timeSlot: null };

  /* ---------------- HELPERS ---------------- */
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function expYears(c) { return parseInt(c.pengalaman, 10) || 0; }

  function expBucket(years) {
    if (years <= 7) return "5-7";
    if (years <= 10) return "8-10";
    return "11+";
  }

  function eduBucket(pendidikan) {
    if (pendidikan.indexOf("Master of Business Administration") !== -1) return "MBA";
    if (pendidikan.indexOf("Magister") === 0) return "S2";
    return "S1";
  }

  function priceValue(harga) {
    return parseInt(String(harga).replace(/[^0-9]/g, ""), 10) || 0;
  }

  function formatRupiah(value) {
    return "Rp" + Math.round(value).toLocaleString("id-ID");
  }

  function classify(c) {
    const text = (c.spesialisasi.join(" ") + " " + c.konsultasi.join(" ")).toLowerCase();
    const matched = CATEGORIES.filter(cat => cat.keywords.some(k => text.indexOf(k) !== -1)).map(cat => cat.id);
    return matched.length ? matched : ["lainnya"];
  }

  /* ---------------- FILTER + SORT ---------------- */
  function matchesConsultant(c) {
    const term = state.search.trim().toLowerCase();
    if (term) {
      const haystack = (c.nama + " " + c.spesialisasi.join(" ") + " " + c.konsultasi.join(" ") + " " + c.pendidikan).toLowerCase();
      if (haystack.indexOf(term) === -1) return false;
    }
    if (state.bidang !== "Semua" && classify(c).indexOf(state.bidang) === -1) return false;
    if (state.pengalaman !== "Semua" && expBucket(expYears(c)) !== state.pengalaman) return false;
    if (state.pendidikan !== "Semua" && eduBucket(c.pendidikan) !== state.pendidikan) return false;
    if (state.rating !== "Semua" && c.rating < parseFloat(state.rating)) return false;
    if (state.durasi !== "Semua" && c.durasi !== state.durasi) return false;
    return true;
  }

  function sortConsultants(list) {
    const sorted = list.slice();
    switch (state.sort) {
      case "rating": sorted.sort((a, b) => b.rating - a.rating); break;
      case "pengalaman": sorted.sort((a, b) => expYears(b) - expYears(a)); break;
      case "konsultasi": sorted.sort((a, b) => b.jumlah_konsultasi - a.jumlah_konsultasi); break;
      case "harga-rendah": sorted.sort((a, b) => priceValue(a.harga) - priceValue(b.harga)); break;
      case "harga-tinggi": sorted.sort((a, b) => priceValue(b.harga) - priceValue(a.harga)); break;
      case "nama": sorted.sort((a, b) => a.nama.localeCompare(b.nama)); break;
      default: sorted.sort((a, b) => a.id - b.id);
    }
    return sorted;
  }

  /* ---------------- RENDER: CONSULTANT CARD ---------------- */
  function consultantCardHtml(c) {
    const specText = c.spesialisasi.slice(0, 2).join(", ");
    const hargaParts = String(c.harga).split(" / ");
    const hargaValue = hargaParts[0] || c.harga;
    const hargaUnit = hargaParts[1] || "sesi";

    return (
      '<article class="consultant-card" style="background-image:url(\'' + c.foto + '\')" data-id="' + c.id + '" role="button" tabindex="0" aria-label="Lihat profil ' + escapeHtml(c.nama) + '">' +
        '<div class="consultant-card__scrim"></div>' +
        '<div class="consultant-card__top-row">' +
          '<span class="consultant-card__available"><i class="fa-solid fa-circle"></i>' + escapeHtml(c.status) + "</span>" +
          '<span class="consultant-card__rating"><i class="fa-solid fa-star"></i>' + c.rating.toFixed(1) + "</span>" +
        "</div>" +
        '<div class="consultant-card__content">' +
          '<div class="consultant-card__name">' + escapeHtml(c.nama) + "</div>" +
          '<div class="consultant-card__specialisasi">' + escapeHtml(specText) + "</div>" +
          '<div class="consultant-card__meta">' +
            '<span><i class="fa-solid fa-briefcase"></i>' + expYears(c) + " Tahun</span>" +
            '<span><i class="fa-solid fa-comments"></i>' + c.jumlah_konsultasi + "</span>" +
          "</div>" +
          '<div class="consultant-card__footer">' +
            '<div class="consultant-card__price">' + escapeHtml(hargaValue) + "<small>/ " + escapeHtml(hargaUnit) + "</small></div>" +
            '<div class="consultant-card__actions">' +
              '<button type="button" class="consultation-btn consultation-btn--ghost" data-action="profile" data-id="' + c.id + '">Profil</button>' +
              '<button type="button" class="consultation-btn consultation-btn--primary" data-action="book" data-id="' + c.id + '">Konsultasi</button>' +
            "</div>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  /* ---------------- RENDER: ANALYTICS ---------------- */
  function renderStatCards(list) {
    const total = list.length;
    const avgRating = total ? (list.reduce((s, c) => s + c.rating, 0) / total) : 0;
    const avgHarga = total ? (list.reduce((s, c) => s + priceValue(c.harga), 0) / total) : 0;
    const avgExp = total ? (list.reduce((s, c) => s + expYears(c), 0) / total) : 0;

    const cards = [
      { label: "Total Konsultan", icon: "fa-users", value: total, suffix: "" },
      { label: "Rating Rata-rata", icon: "fa-star", value: avgRating.toFixed(1), suffix: "/ 5.0" },
      { label: "Harga Rata-rata", icon: "fa-tag", value: formatRupiah(avgHarga), suffix: "/ sesi" },
      { label: "Pengalaman Rata-rata", icon: "fa-briefcase", value: avgExp.toFixed(1), suffix: "tahun" }
    ];

    document.getElementById("statGrid").innerHTML = cards.map(card =>
      '<div class="consultation-stat-card">' +
        '<div class="consultation-stat-card__label"><i class="fa-solid ' + card.icon + '"></i>' + card.label + "</div>" +
        '<div class="consultation-stat-card__value">' + card.value + (card.suffix ? " <small>" + card.suffix + "</small>" : "") + "</div>" +
      "</div>"
    ).join("");
  }

  function renderBidangChart(list) {
    const counts = {};
    CATEGORIES.forEach(cat => { counts[cat.id] = 0; });
    list.forEach(c => classify(c).forEach(id => { if (counts[id] !== undefined) counts[id]++; }));

    const rows = CATEGORIES
      .map(cat => ({ label: cat.label, count: counts[cat.id] }))
      .sort((a, b) => b.count - a.count);

    const max = Math.max(1, ...rows.map(r => r.count));
    const container = document.getElementById("bidangChart");

    if (!list.length) {
      container.innerHTML = '<p style="font-size:0.85rem;">Tidak ada data untuk ditampilkan.</p>';
      return;
    }

    container.innerHTML = rows.map(r =>
      '<div class="consultation-bar-row">' +
        '<span class="consultation-bar-row__label">' + escapeHtml(r.label) + "</span>" +
        '<div class="consultation-bar-row__track"><div class="consultation-bar-row__fill" style="width:' + Math.round((r.count / max) * 100) + '%"></div></div>' +
        '<span class="consultation-bar-row__count">' + r.count + "</span>" +
      "</div>"
    ).join("");
  }

  function renderEduDonut(list) {
    const counts = { S1: 0, S2: 0, MBA: 0 };
    list.forEach(c => { counts[eduBucket(c.pendidikan)]++; });

    const total = list.length;
    const donut = document.getElementById("eduDonut");
    const legend = document.getElementById("eduLegend");

    if (!total) {
      donut.style.background = "var(--c-border)";
      legend.innerHTML = '<li>Tidak ada data.</li>';
      return;
    }

    let cursor = 0;
    const segments = [];
    ["S1", "S2", "MBA"].forEach(key => {
      const pct = (counts[key] / total) * 100;
      if (pct > 0) {
        segments.push(EDU_COLORS[key] + " " + cursor.toFixed(2) + "% " + (cursor + pct).toFixed(2) + "%");
        cursor += pct;
      }
    });

    donut.style.background = "conic-gradient(" + segments.join(", ") + ")";

    legend.innerHTML = ["S1", "S2", "MBA"].map(key => {
      const pct = total ? Math.round((counts[key] / total) * 100) : 0;
      return '<li><span class="consultation-donut-legend__swatch" style="background:' + EDU_COLORS[key] + '"></span>' +
        EDU_LABELS[key] + '<strong>' + counts[key] + " (" + pct + "%)</strong></li>";
    }).join("");
  }

  function renderAnalytics(list) {
    renderStatCards(list);
    renderBidangChart(list);
    renderEduDonut(list);
  }

  /* ---------------- RENDER: LIST ---------------- */
  function renderConsultants() {
    const grid = document.getElementById("consultantGrid");
    const emptyState = document.getElementById("emptyState");
    const resultCount = document.getElementById("resultCount");
    const loadMoreWrap = document.getElementById("loadMoreWrap");

    const filtered = sortConsultants(DATA.filter(matchesConsultant));
    renderAnalytics(filtered);

    if (filtered.length === 0) {
      grid.innerHTML = "";
      emptyState.hidden = false;
      loadMoreWrap.hidden = true;
      resultCount.textContent = "0 konsultan ditemukan";
      return;
    }

    emptyState.hidden = true;
    const visible = filtered.slice(0, state.visibleCount);
    grid.innerHTML = visible.map(consultantCardHtml).join("");
    resultCount.textContent = "Menampilkan " + visible.length + " dari " + filtered.length + " konsultan";
    loadMoreWrap.hidden = visible.length >= filtered.length;
  }

  /* ---------------- FILTER BAR / SEARCH ---------------- */
  function populateBidangFilter() {
    const select = document.getElementById("filterBidang");
    CATEGORIES.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat.id;
      opt.textContent = cat.label;
      select.appendChild(opt);
    });
  }

  function resetFilters() {
    state.search = "";
    state.bidang = "Semua";
    state.pengalaman = "Semua";
    state.pendidikan = "Semua";
    state.rating = "Semua";
    state.durasi = "Semua";
    state.sort = "default";
    state.visibleCount = PAGE_SIZE;

    document.getElementById("searchInput").value = "";
    document.getElementById("searchClearBtn").hidden = true;
    document.getElementById("filterBidang").value = "Semua";
    document.getElementById("filterPengalaman").value = "Semua";
    document.getElementById("filterPendidikan").value = "Semua";
    document.getElementById("filterRating").value = "Semua";
    document.getElementById("filterDurasi").value = "Semua";
    document.getElementById("filterSort").value = "default";

    renderConsultants();
  }

  function bindToolbar() {
    const searchInput = document.getElementById("searchInput");
    const clearBtn = document.getElementById("searchClearBtn");

    searchInput.addEventListener("input", () => {
      state.search = searchInput.value;
      state.visibleCount = PAGE_SIZE;
      clearBtn.hidden = searchInput.value.length === 0;
      renderConsultants();
    });

    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      state.search = "";
      state.visibleCount = PAGE_SIZE;
      clearBtn.hidden = true;
      renderConsultants();
      searchInput.focus();
    });

    document.getElementById("searchForm").addEventListener("submit", e => e.preventDefault());

    ["filterBidang", "filterPengalaman", "filterPendidikan", "filterRating", "filterDurasi", "filterSort"].forEach(id => {
      document.getElementById(id).addEventListener("change", e => {
        const key = id.replace("filter", "");
        state[key.charAt(0).toLowerCase() + key.slice(1)] = e.target.value;
        state.visibleCount = PAGE_SIZE;
        renderConsultants();
      });
    });

    document.getElementById("filterResetBtn").addEventListener("click", resetFilters);
    document.getElementById("emptyResetBtn").addEventListener("click", resetFilters);

    document.getElementById("loadMoreBtn").addEventListener("click", () => {
      state.visibleCount += PAGE_SIZE;
      renderConsultants();
    });
  }

  /* ---------------- GRID ACTIONS ---------------- */
  function bindGridActions() {
    document.getElementById("consultantGrid").addEventListener("click", e => {
      const actionBtn = e.target.closest("[data-action]");
      if (actionBtn) {
        const consultant = DATA.find(c => c.id === parseInt(actionBtn.dataset.id, 10));
        if (!consultant) return;
        if (actionBtn.dataset.action === "profile") openProfileModal(consultant);
        if (actionBtn.dataset.action === "book") openBookingModal(consultant);
        return;
      }
      const card = e.target.closest(".consultant-card");
      if (card) {
        const consultant = DATA.find(c => c.id === parseInt(card.dataset.id, 10));
        if (consultant) openProfileModal(consultant);
      }
    });

    document.getElementById("consultantGrid").addEventListener("keydown", e => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest(".consultant-card");
      if (!card) return;
      e.preventDefault();
      const consultant = DATA.find(c => c.id === parseInt(card.dataset.id, 10));
      if (consultant) openProfileModal(consultant);
    });
  }

  /* ---------------- PROFILE MODAL ---------------- */
  function openProfileModal(consultant) {
    const overlay = document.getElementById("profileModalOverlay");
    const body = document.getElementById("profileModalBody");

    const spesialisasiHtml = consultant.spesialisasi.map(s =>
      '<span class="consultant-profile__skill">' + escapeHtml(s) + "</span>"
    ).join("");
    const konsultasiHtml = consultant.konsultasi.map(s =>
      '<span class="consultant-profile__skill">' + escapeHtml(s) + "</span>"
    ).join("");

    body.innerHTML =
      '<div class="consultant-profile__head">' +
        '<div class="consultant-profile__avatar" style="background-image:url(\'' + consultant.foto + '\')"></div>' +
        "<div>" +
          '<div class="consultant-profile__name" id="profileModalName">' + escapeHtml(consultant.nama) + "</div>" +
          '<div class="consultant-profile__role">Ahli Bisnis &middot; ' + escapeHtml(consultant.pendidikan) + "</div>" +
          '<div class="consultant-profile__status"><i class="fa-solid fa-circle" style="font-size:6px;color:#34d399"></i>' + escapeHtml(consultant.status) + "</div>" +
        "</div>" +
      "</div>" +
      '<div class="consultant-profile__meta-grid">' +
        '<div class="consultant-profile__meta-item"><span>Pengalaman</span><strong>' + escapeHtml(consultant.pengalaman) + "</strong></div>" +
        '<div class="consultant-profile__meta-item"><span>Rating</span><strong><i class="fa-solid fa-star" style="color:#f5b942"></i> ' + consultant.rating.toFixed(1) + "</strong></div>" +
        '<div class="consultant-profile__meta-item"><span>Jumlah Konsultasi</span><strong>' + consultant.jumlah_konsultasi + "</strong></div>" +
        '<div class="consultant-profile__meta-item"><span>Durasi Sesi</span><strong>' + escapeHtml(consultant.durasi) + "</strong></div>" +
        '<div class="consultant-profile__meta-item"><span>Harga Konsultasi</span><strong>' + escapeHtml(consultant.harga) + "</strong></div>" +
        '<div class="consultant-profile__meta-item"><span>Status</span><strong>' + escapeHtml(consultant.status) + "</strong></div>" +
      "</div>" +
      '<div class="consultant-profile__section"><h4>Tentang Konsultan</h4><p>' + escapeHtml(consultant.deskripsi) + "</p></div>" +
      '<div class="consultant-profile__section"><h4>Spesialisasi</h4><div class="consultant-profile__skills">' + spesialisasiHtml + "</div></div>" +
      '<div class="consultant-profile__section"><h4>Layanan Konsultasi</h4><div class="consultant-profile__skills">' + konsultasiHtml + "</div></div>" +
      '<div class="consultant-profile__actions">' +
        '<button type="button" class="consultation-btn consultation-btn--primary" id="profileScheduleBtn">Jadwalkan Konsultasi</button>' +
      "</div>";

    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    document.body.style.overflow = "hidden";

    document.getElementById("profileScheduleBtn").addEventListener("click", () => {
      closeModal(overlay);
      openBookingModal(consultant);
    });
  }

  function closeModal(overlay) {
    overlay.classList.remove("is-open");
    setTimeout(() => {
      overlay.hidden = true;
      const anyOpen = document.querySelector(".consultation-modal-overlay.is-open");
      if (!anyOpen) document.body.style.overflow = "";
    }, 250);
  }

  /* ---------------- BOOKING MODAL ---------------- */
  function slotIsFull(consultantId, dateIndex, timeIndex) {
    return (consultantId * 7 + dateIndex * 3 + timeIndex) % 5 === 0;
  }

  function buildDateList() {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  }

  function openBookingModal(consultant) {
    booking.consultant = consultant;
    booking.dateIndex = null;
    booking.timeSlot = null;

    document.getElementById("bookingConsultantName").textContent = consultant.nama;
    document.getElementById("bookingSummary").hidden = true;
    document.getElementById("bookingConfirmBtn").disabled = true;

    const dates = buildDateList();
    const dateList = document.getElementById("bookingDateList");
    dateList.innerHTML = dates.map((d, i) =>
      '<button type="button" class="consultation-booking__date" data-date-index="' + i + '">' +
        '<span class="consultation-day-name">' + DAY_NAMES[d.getDay()] + "</span>" +
        '<span class="consultation-day-num">' + d.getDate() + "</span>" +
        '<span class="consultation-month-name">' + MONTH_NAMES[d.getMonth()] + "</span>" +
      "</button>"
    ).join("");

    document.getElementById("bookingTimeList").innerHTML =
      '<p style="color:var(--c-text-200);font-size:0.85rem;grid-column:1/-1;">Pilih tanggal terlebih dahulu.</p>';

    dateList.querySelectorAll("[data-date-index]").forEach(btn => {
      btn.addEventListener("click", () => selectDate(parseInt(btn.dataset.dateIndex, 10), dates));
    });

    const overlay = document.getElementById("bookingModalOverlay");
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    document.body.style.overflow = "hidden";
  }

  function selectDate(index, dates) {
    booking.dateIndex = index;
    booking.timeSlot = null;
    document.getElementById("bookingSummary").hidden = true;
    document.getElementById("bookingConfirmBtn").disabled = true;

    document.querySelectorAll(".consultation-booking__date").forEach(el => {
      el.classList.toggle("is-selected", parseInt(el.dataset.dateIndex, 10) === index);
    });

    const timeList = document.getElementById("bookingTimeList");
    timeList.innerHTML = TIME_SLOTS.map((time, ti) => {
      const full = slotIsFull(booking.consultant.id, index, ti);
      return '<button type="button" class="consultation-booking__time' + (full ? " is-full" : "") + '" ' +
        (full ? "disabled" : "") + ' data-time="' + time + '">' + time + "</button>";
    }).join("");

    timeList.querySelectorAll(".consultation-booking__time:not(.is-full)").forEach(btn => {
      btn.addEventListener("click", () => selectTime(btn.dataset.time, dates[index]));
    });
  }

  function selectTime(time, dateObj) {
    booking.timeSlot = time;
    document.querySelectorAll(".consultation-booking__time").forEach(el => {
      el.classList.toggle("is-selected", el.dataset.time === time);
    });

    const dateLabel = dateObj.getDate() + " " + MONTH_NAMES_FULL[dateObj.getMonth()] + " " + dateObj.getFullYear();
    document.getElementById("summaryConsultant").textContent = booking.consultant.nama;
    document.getElementById("summaryDate").textContent = dateLabel;
    document.getElementById("summaryTime").textContent = time;
    document.getElementById("summaryDuration").textContent = booking.consultant.durasi;
    document.getElementById("bookingSummary").hidden = false;
    document.getElementById("bookingConfirmBtn").disabled = false;
  }

  function bindBookingConfirm() {
    document.getElementById("bookingConfirmBtn").addEventListener("click", () => {
      if (!booking.timeSlot) return;
      closeModal(document.getElementById("bookingModalOverlay"));
      showToast("Jadwal konsultasi berhasil dipilih.");
    });
  }

  /* ---------------- TOAST ---------------- */
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  /* ---------------- MODAL CLOSE HANDLERS ---------------- */
  function bindModalClosers() {
    const overlays = [
      { overlay: document.getElementById("profileModalOverlay"), closeBtn: document.getElementById("profileModalClose") },
      { overlay: document.getElementById("bookingModalOverlay"), closeBtn: document.getElementById("bookingModalClose") }
    ];

    overlays.forEach(({ overlay, closeBtn }) => {
      closeBtn.addEventListener("click", () => closeModal(overlay));
      overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(overlay); });
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        overlays.forEach(({ overlay }) => { if (overlay.classList.contains("is-open")) closeModal(overlay); });
      }
    });
  }

  /* ---------------- INIT ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("pageHeadSubtitle").textContent =
      DATA.length + " konsultan siap membantu bisnis Anda menemukan arah yang tepat.";

    populateBidangFilter();
    renderConsultants();
    bindToolbar();
    bindGridActions();
    bindModalClosers();
    bindBookingConfirm();
  });
})();