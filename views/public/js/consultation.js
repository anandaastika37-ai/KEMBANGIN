/* ============================================================
   KEMBANGIN — Halaman Konsultasi (vanilla JS, tanpa dependency)
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- DATA DUMMY KONSULTAN ---------------- */
  const consultants = [
    {
      id: 1, name: "Andi Pratama", category: "Bisnis", role: "Business Strategy Consultant",
      experience: 8, rating: 4.9, consultations: 124, status: "online", price: 150000,
      bio: "Berpengalaman membantu bisnis dan UMKM dalam menyusun strategi pertumbuhan, pengembangan model bisnis, dan perencanaan usaha.",
      skills: ["Business Strategy", "Business Model", "Market Research", "Business Development"],
      languages: ["Indonesia", "Inggris"]
    },
    {
      id: 2, name: "Nadia Putri", category: "Marketing", role: "Marketing Consultant",
      experience: 6, rating: 4.8, consultations: 98, status: "online", price: 125000,
      bio: "Fokus membantu brand menyusun strategi pemasaran yang terukur, mulai dari riset target pasar hingga eksekusi kampanye.",
      skills: ["Marketing Strategy", "Campaign Planning", "Social Media", "Customer Insight"],
      languages: ["Indonesia", "Inggris"]
    },
    {
      id: 3, name: "Raka Wijaya", category: "Keuangan", role: "Financial Consultant",
      experience: 7, rating: 4.9, consultations: 115, status: "offline", price: 175000,
      bio: "Membantu pemilik bisnis memahami kesehatan keuangan perusahaan dan menyusun perencanaan finansial jangka panjang.",
      skills: ["Financial Planning", "Cash Flow", "Investment", "Budgeting"],
      languages: ["Indonesia"]
    },
    {
      id: 4, name: "Siti Rahayu", category: "UMKM", role: "UMKM Development Consultant",
      experience: 5, rating: 4.7, consultations: 86, status: "online", price: 100000,
      bio: "Mendampingi pelaku UMKM dalam mengelola operasional, keuangan sederhana, dan strategi naik kelas.",
      skills: ["UMKM Management", "Operasional", "Business Model", "Legalitas Usaha"],
      languages: ["Indonesia"]
    },
    {
      id: 5, name: "Bagus Santoso", category: "Digitalisasi", role: "Digital Transformation Consultant",
      experience: 9, rating: 4.9, consultations: 140, status: "online", price: 200000,
      bio: "Membantu bisnis konvensional bertransformasi ke sistem digital, mulai dari proses operasional hingga penjualan online.",
      skills: ["Digital Transformation", "E-Commerce", "Automation", "Sistem Operasional"],
      languages: ["Indonesia", "Inggris"]
    },
    {
      id: 6, name: "Dewi Lestari", category: "Branding", role: "Brand Strategy Consultant",
      experience: 4, rating: 4.6, consultations: 62, status: "offline", price: 110000,
      bio: "Membangun identitas brand yang konsisten dan mudah diingat, dari positioning hingga panduan visual.",
      skills: ["Brand Positioning", "Visual Identity", "Brand Voice", "Naming"],
      languages: ["Indonesia"]
    },
    {
      id: 7, name: "Fajar Nugroho", category: "Bisnis", role: "Business Development Consultant",
      experience: 3, rating: 4.5, consultations: 40, status: "online", price: 90000,
      bio: "Membantu bisnis rintisan menemukan peluang ekspansi dan kemitraan yang tepat sasaran.",
      skills: ["Business Development", "Partnership", "Market Entry"],
      languages: ["Indonesia", "Inggris"]
    },
    {
      id: 8, name: "Maya Kusuma", category: "Keuangan", role: "Investment & Cash Flow Consultant",
      experience: 10, rating: 5.0, consultations: 180, status: "online", price: 220000,
      bio: "Spesialis dalam manajemen arus kas dan strategi investasi untuk bisnis yang sedang bertumbuh.",
      skills: ["Cash Flow", "Investment Strategy", "Financial Modeling"],
      languages: ["Indonesia", "Inggris"]
    },
    {
      id: 9, name: "Rian Hidayat", category: "Marketing", role: "Digital Marketing Consultant",
      experience: 2, rating: 4.4, consultations: 28, status: "offline", price: 80000,
      bio: "Membantu bisnis kecil memulai strategi pemasaran digital dengan anggaran terbatas namun efektif.",
      skills: ["Digital Ads", "SEO Dasar", "Content Planning"],
      languages: ["Indonesia"]
    },
    {
      id: 10, name: "Putri Ramadhani", category: "Branding", role: "Visual Identity Consultant",
      experience: 6, rating: 4.8, consultations: 95, status: "online", price: 130000,
      bio: "Merancang identitas visual yang mencerminkan karakter brand, mulai dari logo hingga pedoman desain.",
      skills: ["Visual Identity", "Logo Design", "Brand Guideline"],
      languages: ["Indonesia", "Inggris"]
    },
    {
      id: 11, name: "Yoga Pratama", category: "Digitalisasi", role: "Tech & Automation Consultant",
      experience: 5, rating: 4.7, consultations: 70, status: "online", price: 140000,
      bio: "Membantu bisnis mengotomatisasi proses operasional menggunakan tools digital yang sesuai skala usaha.",
      skills: ["Automation", "Sistem Digital", "Tools Bisnis"],
      languages: ["Indonesia"]
    },
    {
      id: 12, name: "Lina Marlina", category: "UMKM", role: "Micro Business Consultant",
      experience: 3, rating: 4.6, consultations: 45, status: "offline", price: 85000,
      bio: "Fokus mendampingi usaha mikro dalam pencatatan keuangan sederhana dan strategi bertahan serta berkembang.",
      skills: ["UMKM", "Pencatatan Keuangan", "Strategi Bertahan"],
      languages: ["Indonesia"]
    }
  ];

  const CHANNELS = ["Bisnis", "Keuangan", "Marketing", "Branding", "Digitalisasi", "UMKM"];
  const TIME_SLOTS = ["09:00", "10:00", "13:00", "14:00", "16:00", "19:00"];
  const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  /* ---------------- STATE ---------------- */
  const state = {
    search: "",
    bidang: "Semua",
    pengalaman: "Semua",
    rating: "Semua",
    status: "Semua",
    sort: "terbaru"
  };

  const booking = { consultant: null, dateIndex: null, timeSlot: null };

  /* ---------------- HELPERS ---------------- */
  function formatPrice(value) {
    return "Rp" + value.toLocaleString("id-ID");
  }

  function avatarUrl(name) {
    const encoded = encodeURIComponent(name);
    return "https://ui-avatars.com/api/?name=" + encoded +
      "&background=1B2A4A&color=8FB4FF&size=160&bold=true&font-size=0.36";
  }

  function experienceBucket(years) {
    if (years <= 3) return "1-3";
    if (years <= 5) return "3-5";
    return "5+";
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------------- FILTER + SORT ---------------- */
  function matchesConsultant(c) {
    const term = state.search.trim().toLowerCase();
    if (term) {
      const haystack = (c.name + " " + c.category + " " + c.role + " " + c.skills.join(" ")).toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    if (state.bidang !== "Semua" && c.category !== state.bidang) return false;
    if (state.pengalaman !== "Semua" && experienceBucket(c.experience) !== state.pengalaman) return false;
    if (state.rating !== "Semua" && c.rating < parseFloat(state.rating)) return false;
    if (state.status !== "Semua" && c.status !== state.status) return false;
    return true;
  }

  function sortConsultants(list) {
    const sorted = list.slice();
    switch (state.sort) {
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "pengalaman":
        sorted.sort((a, b) => b.experience - a.experience);
        break;
      case "konsultasi":
        sorted.sort((a, b) => b.consultations - a.consultations);
        break;
      default: // terbaru -> urutan id terbalik (dianggap paling baru ditambahkan)
        sorted.sort((a, b) => b.id - a.id);
    }
    return sorted;
  }

  /* ---------------- RENDER: CONSULTANT GRID ---------------- */
  function consultantCardHtml(c) {
    const statusLabel = c.status === "online" ? "Online" : "Offline";
    const skillsHtml = c.skills.slice(0, 3).map(s =>
      '<span class="consultant-card__skill">' + escapeHtml(s) + "</span>"
    ).join("");

    return (
      '<article class="consultant-card consultation-fade-up" data-id="' + c.id + '">' +
        '<div class="consultant-card__top">' +
          '<div class="consultant-card__avatar-wrap">' +
            '<img class="consultant-card__avatar" src="' + avatarUrl(c.name) + '" alt="Foto profil ' + escapeHtml(c.name) + '">' +
            '<span class="consultant-card__status consultant-card__status--' + c.status + '"></span>' +
          "</div>" +
          "<div>" +
            '<div class="consultant-card__name">' + escapeHtml(c.name) + "</div>" +
            '<div class="consultant-card__role">' + escapeHtml(c.role) + "</div>" +
            '<div class="consultant-card__status-label"><i class="fa-solid fa-circle" style="font-size:6px;color:' + (c.status === "online" ? "#34d399" : "#6b7280") + '"></i>' + statusLabel + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="consultant-card__meta">' +
          '<span><i class="fa-solid fa-briefcase"></i>' + c.experience + " Tahun</span>" +
          '<span><i class="fa-solid fa-star"></i>' + c.rating.toFixed(1) + "</span>" +
          '<span><i class="fa-solid fa-comments"></i>' + c.consultations + "</span>" +
        "</div>" +
        '<div class="consultant-card__skills">' + skillsHtml + "</div>" +
        '<div class="consultant-card__footer">' +
          '<div class="consultant-card__price"><small>Mulai dari</small>' + formatPrice(c.price) + "</div>" +
        "</div>" +
        '<div class="consultant-card__actions">' +
          '<button type="button" class="consultation-btn consultation-btn--ghost" data-action="profile" data-id="' + c.id + '">Lihat Profil</button>' +
          '<button type="button" class="consultation-btn consultation-btn--primary" data-action="book" data-id="' + c.id + '">Konsultasi</button>' +
        "</div>" +
      "</article>"
    );
  }

  function renderConsultants() {
    const grid = document.getElementById("consultantGrid");
    const emptyState = document.getElementById("emptyState");
    const resultCount = document.getElementById("resultCount");

    const filtered = sortConsultants(consultants.filter(matchesConsultant));

    if (filtered.length === 0) {
      grid.innerHTML = "";
      emptyState.hidden = false;
      resultCount.textContent = "0 konsultan ditemukan";
      return;
    }

    emptyState.hidden = true;
    resultCount.textContent = filtered.length + " konsultan ditemukan";
    grid.innerHTML = filtered.map(consultantCardHtml).join("");

    requestAnimationFrame(() => {
      grid.querySelectorAll(".consultation-fade-up").forEach(el => el.classList.add("is-visible"));
    });
  }

  function renderChannelCounts() {
    CHANNELS.forEach(channel => {
      const count = consultants.filter(c => c.category === channel).length;
      const el = document.querySelector('[data-channel-count="' + channel + '"]');
      if (el) el.textContent = count + " konsultan tersedia";
    });
  }

  /* ---------------- FILTER BAR EVENTS ---------------- */
  function bindFilterBar() {
    document.getElementById("filterBidang").addEventListener("change", e => { state.bidang = e.target.value; renderConsultants(); });
    document.getElementById("filterPengalaman").addEventListener("change", e => { state.pengalaman = e.target.value; renderConsultants(); });
    document.getElementById("filterRating").addEventListener("change", e => { state.rating = e.target.value; renderConsultants(); });
    document.getElementById("filterStatus").addEventListener("change", e => { state.status = e.target.value; renderConsultants(); });
    document.getElementById("filterSort").addEventListener("change", e => { state.sort = e.target.value; renderConsultants(); });

    function resetFilters() {
      state.search = "";
      state.bidang = "Semua";
      state.pengalaman = "Semua";
      state.rating = "Semua";
      state.status = "Semua";
      state.sort = "terbaru";
      document.getElementById("quickSearchInput").value = "";
      document.getElementById("filterBidang").value = "Semua";
      document.getElementById("filterPengalaman").value = "Semua";
      document.getElementById("filterRating").value = "Semua";
      document.getElementById("filterStatus").value = "Semua";
      document.getElementById("filterSort").value = "terbaru";
      renderConsultants();
    }

    document.getElementById("filterResetBtn").addEventListener("click", resetFilters);
    document.getElementById("emptyResetBtn").addEventListener("click", resetFilters);
  }

  /* ---------------- QUICK SEARCH ---------------- */
  function bindQuickSearch() {
    const form = document.getElementById("quickSearchForm");
    const input = document.getElementById("quickSearchInput");

    input.addEventListener("input", () => {
      state.search = input.value;
      renderConsultants();
    });

    form.addEventListener("submit", e => {
      e.preventDefault();
      state.search = input.value;
      renderConsultants();
      scrollToId("consultants");
    });

    document.querySelectorAll(".consultation-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        input.value = chip.dataset.term;
        state.search = chip.dataset.term;
        renderConsultants();
        scrollToId("consultants");
      });
    });
  }

  /* ---------------- CHANNEL CARDS ---------------- */
  function bindChannelCards() {
    document.querySelectorAll("[data-channel-btn]").forEach(btn => {
      btn.addEventListener("click", () => {
        const channel = btn.dataset.channelBtn;
        state.bidang = channel;
        document.getElementById("filterBidang").value = channel;
        renderConsultants();
        scrollToId("consultants");
      });
    });
  }

  /* ---------------- SMOOTH SCROLL ---------------- */
  function scrollToId(id) {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function bindScrollLinks() {
    document.querySelectorAll("[data-scroll]").forEach(link => {
      link.addEventListener("click", e => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          scrollToId(href.slice(1));
        }
      });
    });
  }

  /* ---------------- PROFILE MODAL ---------------- */
  function openProfileModal(consultant) {
    const overlay = document.getElementById("profileModalOverlay");
    const body = document.getElementById("profileModalBody");

    const skillsHtml = consultant.skills.map(s =>
      '<span class="consultant-card__skill">' + escapeHtml(s) + "</span>"
    ).join("");

    body.innerHTML =
      '<div class="consultant-profile__head">' +
        '<img class="consultant-profile__avatar" src="' + avatarUrl(consultant.name) + '" alt="Foto profil ' + escapeHtml(consultant.name) + '">' +
        "<div>" +
          '<div class="consultant-profile__name" id="profileModalName">' + escapeHtml(consultant.name) + "</div>" +
          '<div class="consultant-profile__role">' + escapeHtml(consultant.role) + "</div>" +
          '<div class="consultant-profile__status"><i class="fa-solid fa-circle" style="font-size:6px;color:' + (consultant.status === "online" ? "#34d399" : "#6b7280") + '"></i>' + (consultant.status === "online" ? "Online" : "Offline") + "</div>" +
        "</div>" +
      "</div>" +
      '<div class="consultant-profile__meta-grid">' +
        '<div class="consultant-profile__meta-item"><span>Pengalaman</span><strong>' + consultant.experience + " Tahun</strong></div>" +
        '<div class="consultant-profile__meta-item"><span>Rating</span><strong><i class="fa-solid fa-star" style="color:#f5b942"></i> ' + consultant.rating.toFixed(1) + "</strong></div>" +
        '<div class="consultant-profile__meta-item"><span>Jumlah Konsultasi</span><strong>' + consultant.consultations + "</strong></div>" +
        '<div class="consultant-profile__meta-item"><span>Harga Konsultasi</span><strong>' + formatPrice(consultant.price) + " / sesi</strong></div>" +
      "</div>" +
      '<div class="consultant-profile__section"><h4>Tentang Konsultan</h4><p>' + escapeHtml(consultant.bio) + "</p></div>" +
      '<div class="consultant-profile__section"><h4>Keahlian</h4><div class="consultant-profile__skills">' + skillsHtml + "</div></div>" +
      '<div class="consultant-profile__section"><h4>Channel Tersedia</h4><div class="consultant-profile__skills"><span class="consultant-card__skill">' + escapeHtml(consultant.category) + "</span></div></div>" +
      '<div class="consultant-profile__section"><h4>Bahasa</h4><p>' + consultant.languages.join(", ") + "</p></div>" +
      '<div class="consultant-profile__actions">' +
        '<button type="button" class="consultation-btn consultation-btn--primary" id="profileScheduleBtn" data-id="' + consultant.id + '">Jadwalkan Konsultasi</button>' +
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
    // Distribusi ketersediaan semu namun konsisten (deterministik) per konsultan/tanggal/jam.
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

    document.getElementById("bookingConsultantName").textContent = consultant.name;
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
    document.getElementById("summaryConsultant").textContent = booking.consultant.name;
    document.getElementById("summaryDate").textContent = dateLabel;
    document.getElementById("summaryTime").textContent = time;
    document.getElementById("bookingSummary").hidden = false;
    document.getElementById("bookingConfirmBtn").disabled = false;
  }

  const MONTH_NAMES_FULL = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

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

  /* ---------------- GRID ACTION DELEGATION ---------------- */
  function bindGridActions() {
    document.getElementById("consultantGrid").addEventListener("click", e => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const id = parseInt(btn.dataset.id, 10);
      const consultant = consultants.find(c => c.id === id);
      if (!consultant) return;
      if (btn.dataset.action === "profile") openProfileModal(consultant);
      if (btn.dataset.action === "book") openBookingModal(consultant);
    });
  }

  /* ---------------- MODAL CLOSE HANDLERS ---------------- */
  function bindModalClosers() {
    const overlays = [
      { overlay: document.getElementById("profileModalOverlay"), closeBtn: document.getElementById("profileModalClose") },
      { overlay: document.getElementById("bookingModalOverlay"), closeBtn: document.getElementById("bookingModalClose") }
    ];

    overlays.forEach(({ overlay, closeBtn }) => {
      closeBtn.addEventListener("click", () => closeModal(overlay));
      overlay.addEventListener("click", e => {
        if (e.target === overlay) closeModal(overlay);
      });
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        overlays.forEach(({ overlay }) => {
          if (overlay.classList.contains("is-open")) closeModal(overlay);
        });
      }
    });
  }

  /* ---------------- FADE-UP ON SCROLL ---------------- */
  function bindFadeUpSections() {
    const targets = document.querySelectorAll(".consultation-section, .consultation-cta-banner, .consultation-quick");
    targets.forEach(el => el.classList.add("consultation-fade-up"));

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach(el => observer.observe(el));
  }

  /* ---------------- INIT ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderChannelCounts();
    renderConsultants();
    bindFilterBar();
    bindQuickSearch();
    bindChannelCards();
    bindScrollLinks();
    bindGridActions();
    bindModalClosers();
    bindBookingConfirm();
    bindFadeUpSections();
  });
})();