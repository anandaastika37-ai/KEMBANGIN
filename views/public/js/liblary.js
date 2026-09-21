/* ==========================================================================
   Liblary
   - data buku dimuat dari books.json (semua memakai gambar sampul yang sama)
   - kartu buku dengan tombol Hype dan Simpan
   - pengurutan (terpopuler, rating, terbaru, judul A-Z/Z-A, penulis A-Z)
   - pagination
   - top 5 hype di bawah daftar buku
   - sidebar: analisa koleksi, rekomendasi
   Data simpanan tetap disimpan di localStorage (key STORE_KEY, field "saved")
   supaya bisa dibaca dashboard. Search, chip kategori, dan level masih tampilan saja.
   ========================================================================== */
(() => {
  'use strict';

  /* ---------- Konfigurasi ---------- */
  const COVER = '../assets/book-asset.jpg';
  const PAGE_SIZE = 12;
  const STORE_KEY = 'kembangin:liblary';
  const DATA_URL = '../database/liblary.json'; // relatif terhadap halaman (pages/)

  /* ---------- Data ----------
     Dimuat dari books.json: [{ id, title, author, category, pages, rating, hype, level, year }, ...] */
  let books = [];
  let byId = new Map();
  let totalPages = 1;
  let categories = []; // jumlah buku per kategori, dari yang terbanyak

  async function loadBooks() {
    const res = await fetch(DATA_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const rows = Array.isArray(json) ? json : json.books;
    if (!Array.isArray(rows) || !rows.length) throw new Error('books.json kosong atau formatnya tidak dikenali');
    return rows
      .filter((b) => b && b.id != null && b.title)
      .map((b) => ({
        id: Number(b.id),
        title: String(b.title),
        author: String(b.author || 'Penulis tidak diketahui'),
        category: String(b.category || 'Lainnya'),
        pages: Number(b.pages) || 0,
        rating: Number(b.rating) || 0,
        hype: Number(b.hype) || 0,
        level: String(b.level || 'Pemula'),
        year: Number(b.year) || 0,
      }));
  }

  function prepareData() {
    byId = new Map(books.map((b) => [b.id, b]));
    totalPages = Math.max(1, Math.ceil(books.length / PAGE_SIZE));
    const map = new Map();
    books.forEach((b) => map.set(b.category, (map.get(b.category) || 0) + 1));
    categories = [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || collator.compare(a.name, b.name));
  }

  /* ---------- Elemen ---------- */
  const $ = (id) => document.getElementById(id);
  const el = {
    list: $('book-list'),
    pagination: $('pagination'),
    chips: $('filter-chips'),
    searchForm: $('search-form'),
    sort: $('sort-select'),
    statGrid: $('stat-grid'),
    catList: $('cat-list'),
    topHype: $('top-hype-list'),
    rekomList: $('rekom-list'),
    toast: $('toast'),
  };
  if (!el.list) return;

  /* ---------- State ---------- */
  const state = {
    page: 1,
    sort: 'popular',
    hyped: new Set(), // id buku yang di-hype user
    saved: new Set(), // id buku yang disimpan user (dibaca dashboard)
  };

  // Daftar yang tampil di halaman, diurutkan sesuai state.sort
  let list = [];

  function loadState() {
    try {
      const data = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      const valid = (arr) => new Set((Array.isArray(arr) ? arr : []).filter((id) => byId.has(id)));
      state.hyped = valid(data.hyped);
      state.saved = valid(data.saved);
    } catch (_) {
      /* penyimpanan tidak tersedia: lanjut tanpa menyimpan */
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        hyped: [...state.hyped],
        saved: [...state.saved],
      }));
    } catch (_) {
      /* abaikan */
    }
  }

  /* ---------- Helper ---------- */
  const nf = new Intl.NumberFormat('id-ID');
  const rf = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  // Jumlah hype yang tampil = hype dasar + 1 jika user sudah menekan hype
  const hypeOf = (b) => b.hype + (state.hyped.has(b.id) ? 1 : 0);

  function toggle(set, id) {
    if (set.has(id)) {
      set.delete(id);
      return false;
    }
    set.add(id);
    return true;
  }

  /* ---------- Pengurutan ----------
     Key sama dengan value <option> di #sort-select.
     "Terbaru" memakai tahun terbit (year), lalu nomor id jika tahunnya sama. */
  const collator = new Intl.Collator('id', { sensitivity: 'base' });
  const SORTERS = {
    popular: (a, b) => hypeOf(b) - hypeOf(a),
    rating: (a, b) => b.rating - a.rating || hypeOf(b) - hypeOf(a),
    newest: (a, b) => b.year - a.year || b.id - a.id,
    az: (a, b) => collator.compare(a.title, b.title),
    za: (a, b) => collator.compare(b.title, a.title),
    author: (a, b) => collator.compare(a.author, b.author) || collator.compare(a.title, b.title),
  };

  function applySort() {
    list = [...books].sort(SORTERS[state.sort] || SORTERS.popular);
  }

  /* ---------- Template ---------- */
  function cardHTML(b) {
    return `
      <article class="book-card" data-id="${b.id}">
        <div class="cover">
          <img src="${COVER}" alt="Sampul buku ${esc(b.title)}" width="300" height="400" loading="lazy">
          <span class="badge-cat">${esc(b.category)}</span>
        </div>
        <div class="book-info">
          <h3 class="book-title">${esc(b.title)}</h3>
          <p class="book-author">${esc(b.author)}</p>
          <div class="book-meta">
            <span class="meta-rating"><i class="fa-solid fa-star" aria-hidden="true"></i>${rf.format(b.rating)}</span>
            <span><i class="fa-regular fa-file-lines" aria-hidden="true"></i>${b.pages} hlm</span>
            <span><i class="fa-solid fa-signal" aria-hidden="true"></i>${esc(b.level)}</span>
          </div>
          <div class="book-actions">
            <button type="button" class="btn-hype" data-action="hype" data-id="${b.id}" aria-pressed="false">
              <i class="fa-solid fa-fire" aria-hidden="true"></i>
              <span class="hype-count">${nf.format(b.hype)}</span>
            </button>
            <button type="button" class="btn-simpan" data-action="save" data-id="${b.id}">
              <i class="fa-regular fa-bookmark" aria-hidden="true"></i>
              <span class="save-label">Simpan</span><span class="sr-only">: ${esc(b.title)}</span>
            </button>
          </div>
        </div>
      </article>`;
  }

  function miniHTML(b) {
    return `
      <li class="mini-book">
        <img src="${COVER}" alt="" width="48" height="64" loading="lazy">
        <div class="mini-info">
          <p class="mini-title">${esc(b.title)}</p>
          <p class="mini-author">${esc(b.author)}</p>
          <span class="mini-rating"><i class="fa-solid fa-star" aria-hidden="true"></i>${rf.format(b.rating)}</span>
        </div>
        <button type="button" class="btn-save-mini" data-action="save" data-id="${b.id}"
                aria-label="Simpan ${esc(b.title)}" aria-pressed="false">
          <i class="fa-regular fa-bookmark" aria-hidden="true"></i>
        </button>
      </li>`;
  }

  function rankHTML(b, i) {
    return `
      <li class="mini-book rank-item">
        <span class="rank-num" aria-label="Peringkat ${i + 1}">${i + 1}</span>
        <img src="${COVER}" alt="" width="48" height="64" loading="lazy">
        <div class="mini-info">
          <p class="mini-title">${esc(b.title)}</p>
          <p class="mini-author">${esc(b.author)}</p>
          <span class="rank-hype"><i class="fa-solid fa-fire" aria-hidden="true"></i>${nf.format(hypeOf(b))} hype</span>
        </div>
      </li>`;
  }

  /* ---------- Sinkron tampilan tombol dengan state ---------- */
  function syncButtons(root = document) {
    root.querySelectorAll('[data-action="hype"]').forEach((btn) => {
      const b = byId.get(Number(btn.dataset.id));
      if (!b) return;
      const on = state.hyped.has(b.id);
      const count = nf.format(hypeOf(b));
      btn.setAttribute('aria-pressed', on);
      btn.setAttribute('aria-label', `Hype ${b.title}, ${count} hype`);
      btn.querySelector('.hype-count').textContent = count;
    });

    root.querySelectorAll('[data-action="save"]').forEach((btn) => {
      const on = state.saved.has(Number(btn.dataset.id));
      const icon = btn.querySelector('i');
      if (icon) icon.className = on ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';

      if (btn.classList.contains('btn-save-mini')) {
        btn.setAttribute('aria-pressed', on);
      } else {
        btn.classList.toggle('is-saved', on);
        btn.querySelector('.save-label').textContent = on ? 'Tersimpan' : 'Simpan';
      }
    });
  }

  /* ---------- Render ---------- */
  function renderChips() {
    const items = [{ name: 'Semua' }, ...categories];
    el.chips.innerHTML = items.map((c, i) => `
      <button type="button" class="chip${i === 0 ? ' is-active' : ''}" aria-pressed="${i === 0}">${esc(c.name)}</button>
    `).join('');
  }

  function renderList() {
    const start = (state.page - 1) * PAGE_SIZE;
    el.list.innerHTML = list.slice(start, start + PAGE_SIZE).map(cardHTML).join('');
    syncButtons(el.list);
  }

  // Contoh hasil untuk 10 halaman, halaman 5: 1 … 4 5 6 … 10
  function pageItems(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [...new Set([1, total, current - 1, current, current + 1])]
      .filter((p) => p >= 1 && p <= total)
      .sort((a, b) => a - b);
    const out = [];
    pages.forEach((p, i) => {
      if (i && p - pages[i - 1] > 1) out.push('gap');
      out.push(p);
    });
    return out;
  }

  function renderPagination() {
    const cur = state.page;
    const first = (cur - 1) * PAGE_SIZE + 1;
    const last = Math.min(cur * PAGE_SIZE, list.length);

    const numbers = pageItems(cur, totalPages).map((p) => (
      p === 'gap'
        ? '<li class="page-gap" aria-hidden="true">…</li>'
        : `<li><button type="button" class="page-btn${p === cur ? ' is-active' : ''}" data-action="page" data-page="${p}"
              aria-label="Halaman ${p}"${p === cur ? ' aria-current="page"' : ''}>${p}</button></li>`
    )).join('');

    el.pagination.innerHTML = `
      <p class="page-info">Menampilkan ${first}–${last} dari ${nf.format(list.length)} buku</p>
      <nav aria-label="Halaman daftar buku">
        <ul class="page-list">
          <li><button type="button" class="page-btn" data-action="page" data-page="${cur - 1}"
                aria-label="Halaman sebelumnya"${cur === 1 ? ' disabled' : ''}>
                <i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button></li>
          ${numbers}
          <li><button type="button" class="page-btn" data-action="page" data-page="${cur + 1}"
                aria-label="Halaman berikutnya"${cur === totalPages ? ' disabled' : ''}>
                <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button></li>
        </ul>
      </nav>`;
  }

  function goTo(page) {
    const next = Math.min(Math.max(page, 1), totalPages);
    if (next === state.page) return;

    state.page = next;
    renderList();
    renderPagination();

    // Fokus tetap di tombol halaman yang baru dipilih
    el.pagination.querySelector(`[data-page="${next}"]`)?.focus({ preventScroll: true });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.list.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function renderStats() {
    const avg = books.reduce((sum, b) => sum + b.rating, 0) / books.length;
    const totalHype = books.reduce((sum, b) => sum + hypeOf(b), 0);
    const stats = [
      ['Total buku', nf.format(books.length)],
      ['Kategori', categories.length],
      ['Rata-rata rating', rf.format(avg)],
      ['Total hype', nf.format(totalHype)],
    ];
    el.statGrid.innerHTML = stats.map(([label, value]) => `
      <li class="stat">
        <span class="stat-label">${label}</span>
        <strong class="stat-value">${value}</strong>
      </li>
    `).join('');
  }

  function renderCategories() {
    const max = categories[0].count;
    el.catList.innerHTML = categories.map((c) => `
      <li>
        <div class="cat-head"><span>${esc(c.name)}</span><span class="cat-count">${c.count}</span></div>
        <div class="bar" aria-hidden="true"><span style="--w: ${Math.round((c.count / max) * 100)}%"></span></div>
      </li>
    `).join('');
  }

  // Top 5 buku dengan hype terbanyak, ikut berubah saat user menekan hype
  function renderTopHype() {
    if (!el.topHype) return;
    el.topHype.innerHTML = [...books]
      .sort((a, b) => hypeOf(b) - hypeOf(a))
      .slice(0, 5)
      .map(rankHTML)
      .join('');
  }

  function renderRecs() {
    // Rekomendasi: rating tertinggi, lalu hype terbanyak
    const recs = [...books]
      .sort((a, b) => b.rating - a.rating || b.hype - a.hype)
      .slice(0, 4);
    el.rekomList.innerHTML = recs.map(miniHTML).join('');
    syncButtons(el.rekomList);
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function showToast(message) {
    el.toast.textContent = message;
    el.toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('is-show'), 2200);
  }

  /* ---------- Interaksi ---------- */
  function popIcon(id) {
    document.querySelectorAll(`[data-action="hype"][data-id="${id}"] i`).forEach((icon) => {
      icon.classList.remove('is-pop');
      void icon.offsetWidth; // paksa reflow agar animasi bisa diulang
      icon.classList.add('is-pop');
      icon.addEventListener('animationend', () => icon.classList.remove('is-pop'), { once: true });
    });
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn || btn.disabled) return;

    const action = btn.dataset.action;
    if (action === 'page') {
      goTo(Number(btn.dataset.page));
      return;
    }

    const id = Number(btn.dataset.id);
    const book = byId.get(id);
    if (!book) return;

    if (action === 'hype') {
      if (toggle(state.hyped, id)) popIcon(id);
    } else if (action === 'save') {
      const saved = toggle(state.saved, id);
      showToast(saved ? `Disimpan: ${book.title}` : `Dihapus dari simpanan: ${book.title}`);
    }

    persist();
    renderTopHype();
    renderStats();
    syncButtons();
  });

  // Ganti urutan: kembali ke halaman 1 lalu render ulang daftar
  el.sort?.addEventListener('change', () => {
    state.sort = el.sort.value;
    state.page = 1;
    applySort();
    renderList();
    renderPagination();
  });

  /* Search, chip kategori, dan level: tampilan saja.
     Chip hanya berganti gaya aktif, belum memfilter data.
     Hubungkan ke `books` di sini saat fitur sebenarnya dibuat. */
  el.searchForm.addEventListener('submit', (e) => e.preventDefault());

  el.chips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    el.chips.querySelectorAll('.chip').forEach((c) => {
      const on = c === chip;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', on);
    });
  });

  /* ---------- Mulai ---------- */
  async function init() {
    const note = (msg) => `<p class="empty" role="status" style="grid-column: 1 / -1">${msg}</p>`;
    el.list.innerHTML = note('Memuat buku…');
    try {
      books = await loadBooks();
    } catch (err) {
      console.error('Gagal memuat data buku:', err);
      el.list.innerHTML = note('Data buku gagal dimuat. Jalankan halaman lewat server (mis. Live Server) dan pastikan books.json ada di public/data/.');
      el.pagination.innerHTML = '';
      return;
    }
    prepareData();
    loadState();
    applySort();
    renderChips();
    renderList();
    renderPagination();
    renderStats();
    renderCategories();
    renderTopHype();
    renderRecs();
  }

  init();
})();