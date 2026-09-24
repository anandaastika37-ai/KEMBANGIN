/* =====================================================================
   PROFILE PAGE — Kembangin
   Vanilla JS, tanpa backend. Semua data disimpan di localStorage.
   ===================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "kembangin_profile";

  var defaultProfile = {
    fullname: "Seseorang Wijaya",
    username: "seseorang203",
    email: "seseorang@gmail.com",
    umur: 27,
    bio: "Pemilik usaha yang tertarik mengembangkan bisnis melalui strategi digital dan inovasi produk.",
    namaUsaha: "Kopi Senja",
    kategori: "Kuliner & Minuman",
    alamat: "Jl. Merdeka No. 12, Denpasar",
    npwp: "09.123.456.7-901.000",
    tahun: 2022,
    instagram: "@kopisenja",
    website: "kopisenja.id",
    whatsapp: "",
    interests: ["Digital Marketing", "Branding", "UMKM", "Bisnis"],
    joinedAt: "2026-09-01",
    avatar: "",
    cover: "",
  };

  // Data course dummy untuk kebutuhan tampilan statistik / progress.
  // Struktur key localStorage sudah disiapkan agar kompatibel dengan
  // sistem Course Kembangin: kembangin_course_{id}_completed,
  // kembangin_course_{id}_lastOpened, kembangin_course_{id}_lastMateri.
  var demoCourses = [
    { id: 1, title: "Konsep Dasar Ekonomi", totalMateri: 10, dummyCompleted: 8, dummyLastMateri: "Permintaan dan Penawaran" },
    { id: 2, title: "Strategi Pemasaran Digital", totalMateri: 8, dummyCompleted: 3, dummyLastMateri: "Riset Target Pasar" },
    { id: 3, title: "Branding untuk UMKM", totalMateri: 6, dummyCompleted: 0, dummyLastMateri: "" },
  ];

  var profile = loadProfile();

  // ---------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------
  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function getInitials(name) {
    if (!name) return "?";
    var parts = name.trim().split(/\s+/);
    var initials = parts[0].charAt(0);
    if (parts.length > 1) initials += parts[parts.length - 1].charAt(0);
    return initials.toUpperCase();
  }

  var BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  function formatJoinedDate(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return BULAN[d.getMonth()] + " " + d.getFullYear();
  }

  // ---------------------------------------------------------------
  // localStorage: profile
  // ---------------------------------------------------------------
  function loadProfile() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return Object.assign({}, defaultProfile);
      var parsed = JSON.parse(raw);
      return Object.assign({}, defaultProfile, parsed);
    } catch (e) {
      console.warn("[profile] Gagal membaca data dari localStorage, memakai default.", e);
      return Object.assign({}, defaultProfile);
    }
  }

  function saveProfile() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn("[profile] Gagal menyimpan data ke localStorage.", e);
      showToast("Gagal menyimpan data. Penyimpanan browser mungkin penuh.");
    }
  }

  // ---------------------------------------------------------------
  // Toast
  // ---------------------------------------------------------------
  var toastTimer = null;
  function showToast(message) {
    var toast = $("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 3000);
  }

  // ---------------------------------------------------------------
  // Render: identitas & data dasar
  // ---------------------------------------------------------------
  function renderProfile() {
    setText("profileFullname", profile.fullname || "-");
    setText("profileUsername", profile.username || "-");
    setText("viewEmail", profile.email || "-");
    setText("viewUmur", profile.umur ? profile.umur + " tahun" : "-");
    setText("viewNamaUsaha", profile.namaUsaha || "-");
    setText("viewKategori", profile.kategori || "-");
    setText("viewAlamat", profile.alamat || "-");
    setText("viewNpwp", profile.npwp || "-");
    setText("viewTahun", profile.tahun || "-");
    setText("profileBio", profile.bio || "Belum ada bio.");

    var joinedEl = $("profileJoined");
    if (joinedEl) {
      var label = formatJoinedDate(profile.joinedAt);
      joinedEl.innerHTML = '<i class="fa-regular fa-calendar"></i> ' + (label ? "Bergabung sejak " + escapeHtml(label) : "Tanggal bergabung tidak tersedia");
    }

    renderAvatar();
    renderCover();
    renderSocial();
    renderInterests();
  }

  function setText(id, value) {
    var el = $(id);
    if (el) el.textContent = value;
  }

  function renderAvatar() {
    var img = $("avatarImg");
    var initials = $("avatarInitials");
    if (profile.avatar) {
      if (img) {
        img.src = profile.avatar;
        img.style.display = "block";
      }
      if (initials) initials.style.display = "none";
    } else {
      if (img) img.style.display = "none";
      if (initials) {
        initials.style.display = "block";
        initials.textContent = getInitials(profile.fullname);
      }
    }
  }

  function renderCover() {
    var cover = document.querySelector(".profile-cover");
    if (!cover) return;
    if (profile.cover) {
      cover.style.backgroundImage = "url(" + profile.cover + ")";
    } else {
      cover.style.backgroundImage = "";
    }
  }

  function renderSocial() {
    setSocialLink("socialInstagram", profile.instagram, function (v) {
      return "https://instagram.com/" + v.replace(/^@/, "");
    });
    setSocialLink("socialWebsite", profile.website, function (v) {
      return /^https?:\/\//i.test(v) ? v : "https://" + v;
    });
    setSocialLink("socialWhatsapp", profile.whatsapp, function (v) {
      return "https://wa.me/" + v.replace(/\D/g, "");
    });
  }

  function setSocialLink(id, value, hrefBuilder) {
    var el = $(id);
    if (!el) return;
    var span = el.querySelector("span");
    var trimmed = value ? String(value).trim() : "";
    if (trimmed) {
      el.classList.remove("is-hidden");
      el.setAttribute("href", hrefBuilder(trimmed));
      if (span) span.textContent = trimmed;
    } else {
      el.classList.add("is-hidden");
      el.removeAttribute("href");
    }
  }

  function renderInterests() {
    var list = $("interestsList");
    if (!list) return;
    var interests = Array.isArray(profile.interests) ? profile.interests : [];
    if (interests.length === 0) {
      list.innerHTML = '<p class="activity-empty">Belum ada minat & keahlian yang ditambahkan.</p>';
      return;
    }
    list.innerHTML = interests
      .map(function (item) {
        return '<span class="interest-tag">' + escapeHtml(item) + "</span>";
      })
      .join("");
  }

  // ---------------------------------------------------------------
  // Integrasi data course (siap dipakai sistem Course Kembangin)
  // ---------------------------------------------------------------
  function getCourseProgress(course) {
    var completedRaw = localStorage.getItem("kembangin_course_" + course.id + "_completed");
    var completed = completedRaw !== null ? parseInt(completedRaw, 10) : course.dummyCompleted || 0;
    if (isNaN(completed) || completed < 0) completed = 0;
    completed = Math.min(completed, course.totalMateri);

    var percent = course.totalMateri > 0 ? Math.round((completed / course.totalMateri) * 100) : 0;

    var lastOpenedRaw = localStorage.getItem("kembangin_course_" + course.id + "_lastOpened");
    var lastOpened = lastOpenedRaw ? new Date(lastOpenedRaw) : null;
    if (lastOpened && isNaN(lastOpened.getTime())) lastOpened = null;

    var lastMateri = localStorage.getItem("kembangin_course_" + course.id + "_lastMateri") || course.dummyLastMateri || "";

    return { completed: completed, percent: percent, lastOpened: lastOpened, lastMateri: lastMateri };
  }

  function readCountFromStorage(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.length;
      var n = parseInt(raw, 10);
      return isNaN(n) ? fallback : n;
    } catch (e) {
      return fallback;
    }
  }

  function renderStats() {
    var courseSelesai = 0;
    demoCourses.forEach(function (c) {
      var p = getCourseProgress(c);
      if (p.completed >= c.totalMateri) courseSelesai++;
    });

    setText("statCourse", courseSelesai);
    setText("statArtikel", readCountFromStorage("kembangin_articles_read", 28));
    setText("statBookmark", readCountFromStorage("kembangin_bookmarks", 8));
    setText("statDiskusi", readCountFromStorage("kembangin_discussions", 5));
  }

  function renderContinueLearning() {
    var container = $("continueLearning");
    if (!container) return;

    var inProgress = demoCourses
      .map(function (c) {
        return { course: c, progress: getCourseProgress(c) };
      })
      .filter(function (x) {
        return x.progress.completed > 0 && x.progress.completed < x.course.totalMateri;
      })
      .sort(function (a, b) {
        var ta = a.progress.lastOpened ? a.progress.lastOpened.getTime() : 0;
        var tb = b.progress.lastOpened ? b.progress.lastOpened.getTime() : 0;
        return tb - ta;
      });

    if (inProgress.length === 0) {
      container.innerHTML =
        '<div class="continue-empty">' +
        '<p class="lead">Belum ada course yang sedang dipelajari.</p>' +
        "<p>Mulai belajar dan kembangkan kemampuanmu.</p>" +
        '<a href="../pages/course.html" class="btn-primary-pill"><i class="fa-solid fa-graduation-cap"></i> Mulai Belajar</a>' +
        "</div>";
      return;
    }

    var top = inProgress[0];
    container.innerHTML =
      '<div class="continue-card">' +
      '<div class="continue-thumb"><i class="fa-solid fa-book-open"></i></div>' +
      '<div class="continue-info">' +
      "<h4>" + escapeHtml(top.course.title) + "</h4>" +
      "<p>" + (top.progress.lastMateri ? "Terakhir dibuka: " + escapeHtml(top.progress.lastMateri) : "Belum ada materi terakhir tercatat") + "</p>" +
      '<div class="continue-progress-bar"><span style="width:' + top.progress.percent + '%"></span></div>' +
      '<span class="continue-progress-label">' + top.progress.completed + " dari " + top.course.totalMateri + " materi selesai (" + top.progress.percent + "%)</span>" +
      "</div>" +
      '<a href="../pages/course.html?courseId=' + top.course.id + '" class="btn-primary-pill continue-cta"><i class="fa-solid fa-play"></i> Lanjutkan Belajar</a>' +
      "</div>";
  }

  function renderProgressList() {
    var container = $("progressList");
    if (!container) return;

    var started = demoCourses
      .map(function (c) {
        return { course: c, progress: getCourseProgress(c) };
      })
      .filter(function (x) {
        return x.progress.completed > 0;
      });

    if (started.length === 0) {
      container.innerHTML = '<p class="activity-empty">Belum ada progress belajar. Yuk mulai course pertamamu!</p>';
      return;
    }

    container.innerHTML = started
      .map(function (x) {
        return (
          '<div class="progress-item">' +
          '<div class="progress-item-info">' +
          "<h4>" + escapeHtml(x.course.title) + "</h4>" +
          '<div class="progress-bar"><span style="width:' + x.progress.percent + '%"></span></div>' +
          '<div class="progress-item-meta"><span>' + x.progress.completed + " dari " + x.course.totalMateri + " materi</span><span>" + x.progress.percent + "%</span></div>" +
          "</div>" +
          '<button type="button" class="btn-secondary-pill" data-course-id="' + x.course.id + '">Lanjutkan</button>' +
          "</div>"
        );
      })
      .join("");
  }

  function renderActivity() {
    var list = $("activityList");
    if (!list) return;

    var activities = [];
    try {
      var raw = localStorage.getItem("kembangin_activities");
      if (raw) activities = JSON.parse(raw);
    } catch (e) {
      activities = [];
    }

    if (!Array.isArray(activities) || activities.length === 0) {
      list.innerHTML = '<li class="activity-empty">Belum ada aktivitas.</li>';
      return;
    }

    var iconMap = {
      course: "fa-graduation-cap",
      artikel: "fa-newspaper",
      bookmark: "fa-bookmark",
      diskusi: "fa-comments",
    };

    list.innerHTML = activities
      .slice(0, 6)
      .map(function (act) {
        var icon = iconMap[act.type] || "fa-circle-check";
        return (
          '<li class="activity-item">' +
          '<span class="activity-icon"><i class="fa-solid ' + icon + '"></i></span>' +
          '<span class="activity-text">' + escapeHtml(act.text || "") + "</span>" +
          '<span class="activity-time">' + escapeHtml(act.date || "") + "</span>" +
          "</li>"
        );
      })
      .join("");
  }

  // Klik tombol "Lanjutkan" pada daftar progress -> arahkan ke halaman course
  function setupProgressListClicks() {
    var container = $("progressList");
    if (!container) return;
    container.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest("[data-course-id]") : null;
      if (btn) {
        window.location.href = "../pages/course.html?courseId=" + btn.getAttribute("data-course-id");
      }
    });
  }

  // ---------------------------------------------------------------
  // Upload foto profil & sampul
  // ---------------------------------------------------------------
  function handleImageFile(file, onSuccess) {
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      showToast("File harus berupa gambar.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      showToast("Ukuran gambar maksimal 3MB.");
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      onSuccess(e.target.result);
    };
    reader.onerror = function () {
      showToast("Gagal memuat gambar.");
    };
    reader.readAsDataURL(file);
  }

  function setupImageUploads() {
    var avatarWrap = $("profileAvatarWrap");
    var avatarInput = $("avatarUploadInput");
    if (avatarWrap && avatarInput) {
      avatarWrap.setAttribute("tabindex", "0");
      avatarWrap.setAttribute("role", "button");
      avatarWrap.setAttribute("aria-label", "Ubah foto profil");
      avatarWrap.addEventListener("click", function () {
        avatarInput.click();
      });
      avatarWrap.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          avatarInput.click();
        }
      });
      avatarInput.addEventListener("change", function (e) {
        handleImageFile(e.target.files && e.target.files[0], function (dataUrl) {
          profile.avatar = dataUrl;
          saveProfile();
          renderAvatar();
          showToast("Foto profil berhasil diperbarui!");
        });
        avatarInput.value = "";
      });
    }

    var coverBtn = $("coverEditBtn");
    var coverInput = $("coverUploadInput");
    if (coverBtn && coverInput) {
      coverBtn.addEventListener("click", function () {
        coverInput.click();
      });
      coverInput.addEventListener("change", function (e) {
        handleImageFile(e.target.files && e.target.files[0], function (dataUrl) {
          profile.cover = dataUrl;
          saveProfile();
          renderCover();
          showToast("Foto sampul berhasil diperbarui!");
        });
        coverInput.value = "";
      });
    }
  }

  // ---------------------------------------------------------------
  // Modal Edit Profil
  // ---------------------------------------------------------------
  function openEditModal() {
    var overlay = $("editOverlay");
    if (!overlay) return;
    fillForm();
    clearFormErrors();
    overlay.classList.add("show");
    document.body.classList.add("no-scroll");
  }

  function closeEditModal() {
    var overlay = $("editOverlay");
    if (!overlay) return;
    overlay.classList.remove("show");
    document.body.classList.remove("no-scroll");
  }

  function setValue(id, value) {
    var el = $(id);
    if (el) el.value = value === undefined || value === null ? "" : value;
  }

  function fillForm() {
    setValue("inputFullname", profile.fullname);
    setValue("inputUsername", profile.username);
    setValue("inputEmail", profile.email);
    setValue("inputUmur", profile.umur);
    setValue("inputBio", profile.bio);
    setValue("inputNamaUsaha", profile.namaUsaha);
    setValue("inputKategori", profile.kategori);
    setValue("inputAlamat", profile.alamat);
    setValue("inputNpwp", profile.npwp);
    setValue("inputTahun", profile.tahun);
    setValue("inputInstagram", profile.instagram);
    setValue("inputWebsite", profile.website);
    setValue("inputWhatsapp", profile.whatsapp);
    setValue("inputInterests", (profile.interests || []).join(", "));
  }

  function clearFormErrors() {
    document.querySelectorAll(".field-error").forEach(function (el) {
      el.textContent = "";
    });
    document.querySelectorAll(".edit-modal .is-invalid").forEach(function (el) {
      el.classList.remove("is-invalid");
    });
  }

  function setFieldError(inputId, errorId, message) {
    var input = $(inputId);
    var error = $(errorId);
    if (input) input.classList.add("is-invalid");
    if (error) error.textContent = message;
  }

  function validateFormData(data) {
    var valid = true;

    if (!data.fullname) {
      setFieldError("inputFullname", "errFullname", "Nama tidak boleh kosong.");
      valid = false;
    }
    if (!data.username) {
      setFieldError("inputUsername", "errUsername", "Username tidak boleh kosong.");
      valid = false;
    }
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailPattern.test(data.email)) {
      setFieldError("inputEmail", "errEmail", "Format email tidak valid.");
      valid = false;
    }
    if (data.umur === "" || isNaN(data.umur) || Number(data.umur) <= 0) {
      setFieldError("inputUmur", "errUmur", "Umur harus berupa angka positif.");
      valid = false;
    }
    var currentYear = new Date().getFullYear();
    if (data.tahun === "" || isNaN(data.tahun) || Number(data.tahun) < 1900 || Number(data.tahun) > currentYear) {
      setFieldError("inputTahun", "errTahun", "Tahun berdiri tidak valid.");
      valid = false;
    }

    return valid;
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    var data = {
      fullname: valOf("inputFullname"),
      username: valOf("inputUsername"),
      email: valOf("inputEmail"),
      umur: valOf("inputUmur"),
      bio: valOf("inputBio"),
      namaUsaha: valOf("inputNamaUsaha"),
      kategori: valOf("inputKategori"),
      alamat: valOf("inputAlamat"),
      npwp: valOf("inputNpwp"),
      tahun: valOf("inputTahun"),
      instagram: valOf("inputInstagram"),
      website: valOf("inputWebsite"),
      whatsapp: valOf("inputWhatsapp"),
      interests: valOf("inputInterests")
        .split(",")
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean),
    };

    clearFormErrors();
    if (!validateFormData(data)) return;

    profile = Object.assign({}, profile, data, {
      umur: Number(data.umur),
      tahun: Number(data.tahun),
    });

    saveProfile();
    renderProfile();
    renderStats();
    closeEditModal();
    showToast("Profil berhasil diperbarui!");
  }

  function valOf(id) {
    var el = $(id);
    return el ? el.value.trim() : "";
  }

  function setupEditModal() {
    var openBtn = $("openEditBtn");
    var closeBtn = $("closeEditBtn");
    var overlay = $("editOverlay");
    var form = $("profileForm");

    if (openBtn) openBtn.addEventListener("click", openEditModal);
    if (closeBtn) closeBtn.addEventListener("click", closeEditModal);
    if (overlay) {
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeEditModal();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay && overlay.classList.contains("show")) closeEditModal();
    });
    if (form) form.addEventListener("submit", handleFormSubmit);
  }

  // ---------------------------------------------------------------
  // Bagikan Profil
  // ---------------------------------------------------------------
  function setupShare() {
    var btn = $("shareProfileBtn");
    var dropdown = $("shareDropdown");
    if (!btn || !dropdown) return;

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });

    document.addEventListener("click", function (e) {
      if (dropdown.classList.contains("show") && !dropdown.contains(e.target) && e.target !== btn) {
        dropdown.classList.remove("show");
      }
    });

    var copyBtn = $("copyProfileLink");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(url)
            .then(function () {
              showToast("Link profil berhasil disalin!");
              dropdown.classList.remove("show");
            })
            .catch(function () {
              showToast("Gagal menyalin link.");
            });
        } else {
          showToast("Browser tidak mendukung penyalinan otomatis.");
        }
      });
    }

    var waLink = $("shareWhatsapp");
    if (waLink) {
      waLink.setAttribute("href", "https://wa.me/?text=" + encodeURIComponent("Lihat profil saya di Kembangin: " + window.location.href));
    }

    var webApiBtn = $("shareWebApi");
    if (webApiBtn) {
      if (navigator.share) {
        webApiBtn.addEventListener("click", function () {
          navigator
            .share({ title: "Profil Kembangin", url: window.location.href })
            .catch(function () {});
          dropdown.classList.remove("show");
        });
      } else {
        webApiBtn.style.display = "none";
      }
    }
  }

  // ---------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------
  function init() {
    renderProfile();
    renderStats();
    renderContinueLearning();
    renderProgressList();
    renderActivity();

    setupImageUploads();
    setupEditModal();
    setupShare();
    setupProgressListClicks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();