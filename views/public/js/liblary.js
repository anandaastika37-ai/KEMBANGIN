/* ==========================================================================
   Liblary
   - data buku dimuat dari books.json (semua memakai gambar sampul yang sama)
   - kartu buku lengkap: cover, judul, penulis, kategori, level, rating,
     jumlah pembaca, tahun terbit, deskripsi singkat, tombol Hype, Simpan,
     dan Lihat Detail
   - modal detail buku dengan tombol "Baca Sekarang" & "Simpan Buku"
   - search, filter kategori (chip), level, dan "cocok untuk" saling terhubung
   - toggle "Tersimpan" untuk menampilkan hanya buku yang di-bookmark
   - pengurutan (terpopuler, rating, terbaru, judul A-Z/Z-A, penulis A-Z)
   - pagination, empty state saat pencarian/filter tidak ketemu
   - section: top 5 hype (populer), baru rilis (terbaru), rekomendasi
   - sidebar: analisa koleksi (termasuk buku tersimpan & total pembaca),
     sebaran kategori & level (bisa diklik untuk memfilter)
   Data simpanan tetap disimpan di localStorage (key STORE_KEY, field "saved")
   dengan bentuk yang SAMA seperti sebelumnya, supaya tetap bisa dibaca dashboard.

   Field baru pada data buku bersifat OPSIONAL & backward-compatible:
     description (string), readers (number), purposes (array of string).
   Jika belum ada di books.json, halaman tetap jalan dengan nilai default
   (deskripsi kosong disembunyikan, pembaca 0, filter "cocok untuk" disembunyikan).
   ========================================================================== */
(() => {
  'use strict';

  /* ---------- Konfigurasi ---------- */
  const COVER = '../assets/book-asset.jpg';
  const PAGE_SIZE = 12;
  const STORE_KEY = 'kembangin:liblary';
  const DATA_URL = '../database/liblary.json'; // relatif terhadap halaman (pages/)

  /* ---------- Data ----------
     Dimuat dari books.json: [{ id, title, author, category, pages, rating, hype,
     level, year, description?, readers?, purposes? }, ...] */
  let books = [];
  let byId = new Map();
  let totalPages = 1;
  let categories = []; // jumlah buku per kategori, dari yang terbanyak
  let levels = [];     // jumlah buku per level, dari yang terbanyak
  let purposes = [];   // jumlah buku per tujuan baca ("cocok untuk"), dari yang terbanyak

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
        // ----- field baru, opsional -----
        description: String(b.description || '').trim(),
        readers: Number(b.readers) || 0,
        purposes: Array.isArray(b.purposes)
          ? [...new Set(b.purposes.map((p) => String(p).trim()).filter(Boolean))]
          : (b.purpose ? [String(b.purpose).trim()].filter(Boolean) : []),
      }));
  }

  function prepareData() {
    byId = new Map(books.map((b) => [b.id, b]));

    const catMap = new Map();
    const lvlMap = new Map();
    const purMap = new Map();
    books.forEach((b) => {
      catMap.set(b.category, (catMap.get(b.category) || 0) + 1);
      lvlMap.set(b.level, (lvlMap.get(b.level) || 0) + 1);
      b.purposes.forEach((p) => purMap.set(p, (purMap.get(p) || 0) + 1));
    });

    const byCountThenName = (a, b) => b.count - a.count || collator.compare(a.name, b.name);
    categories = [...catMap.entries()].map(([name, count]) => ({ name, count })).sort(byCountThenName);
    levels = [...lvlMap.entries()].map(([name, count]) => ({ name, count })).sort(byCountThenName);
    purposes = [...purMap.entries()].map(([name, count]) => ({ name, count })).sort(byCountThenName);
  }

  /* ---------- Elemen ---------- */
  const $ = (id) => document.getElementById(id);
  const el = {
    list: $('book-list'),
    pagination: $('pagination'),
    chips: $('filter-chips'),
    searchForm: $('search-form'),
    searchInput: $('search-input'),
    sort: $('sort-select'),
    levelSelect: $('level-select'),
    purposeSelect: $('purpose-select'),
    purposeSelectWrap: $('purpose-select-wrap'),
    toggleSaved: $('toggle-saved'),
    savedBadge: $('saved-badge'),
    statGrid: $('stat-grid'),
    // catList: $('cat-list'),
    levelList: $('level-list'),
    topHype: $('top-hype-list'),
    newReleases: $('new-releases-list'),
    rekomList: $('rekom-list'),
    toast: $('toast'),
    modal: $('book-modal'),
    modalPanel: $('modal-panel'),
    modalBody: $('modal-body'),
    aiToggle: $('ai-toggle'),
    aiPanel: $('ai-panel'),
    aiClose: $('ai-close'),
    aiMessages: $('ai-messages'),
    aiSuggestions: $('ai-suggestions'),
    aiForm: $('ai-form'),
    aiInput: $('ai-input'),
  };
  if (!el.list) return;

  /* ---------- State ---------- */
  const state = {
    page: 1,
    sort: 'popular',
    query: '',
    category: 'Semua',
    level: 'all',
    purpose: 'all',
    onlySaved: false,
    hyped: new Set(), // id buku yang di-hype user
    saved: new Set(), // id buku yang disimpan user (dibaca dashboard)
  };

  // Daftar hasil filter + urut, yang tampil di halaman
  let list = [];
  let lastFocusedEl = null;
  let aiWelcomed = false; // pesan sambutan AI Library Assistant baru dikirim sekali

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
  const norm = (s) => String(s || '').toLowerCase().trim();

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

  function reduceMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

  /* ---------- Filter + urut ----------
     Search, chip kategori, filter level, filter "cocok untuk", dan toggle
     "Tersimpan" semuanya digabung di sini sebelum di-sort dan dipaginasi. */
  function matchesQuery(b, q) {
    if (!q) return true;
    return norm(b.title).includes(q) || norm(b.author).includes(q) || norm(b.category).includes(q);
  }

  function applyFilters() {
    const q = norm(state.query);
    list = books
      .filter((b) => {
        if (state.onlySaved && !state.saved.has(b.id)) return false;
        if (state.category !== 'Semua' && b.category !== state.category) return false;
        if (state.level !== 'all' && norm(b.level) !== norm(state.level)) return false;
        if (state.purpose !== 'all' && !b.purposes.includes(state.purpose)) return false;
        if (!matchesQuery(b, q)) return false;
        return true;
      })
      .sort(SORTERS[state.sort] || SORTERS.popular);

    totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;
    if (state.page < 1) state.page = 1;
  }

  function refresh() {
    applyFilters();
    renderList();
    renderPagination();
  }

  function hasActiveFilter() {
    return Boolean(state.query) || state.category !== 'Semua' || state.level !== 'all'
      || state.purpose !== 'all' || state.onlySaved;
  }

  function resetFilters() {
    state.query = '';
    state.category = 'Semua';
    state.level = 'all';
    state.purpose = 'all';
    state.onlySaved = false;
    state.page = 1;

    if (el.searchInput) el.searchInput.value = '';
    if (el.levelSelect) el.levelSelect.value = 'all';
    if (el.purposeSelect) el.purposeSelect.value = 'all';
    if (el.toggleSaved) {
      el.toggleSaved.classList.remove('is-active');
      el.toggleSaved.setAttribute('aria-pressed', 'false');
    }
    highlightChips();
    refresh();
  }

  function setCategory(name) {
    state.category = name || 'Semua';
    state.page = 1;
    highlightChips();
    refresh();
  }

  function setLevel(levelValue) {
    state.level = levelValue || 'all';
    if (el.levelSelect) {
      const known = ['all', 'pemula', 'menengah', 'lanjutan'];
      el.levelSelect.value = known.includes(norm(state.level)) ? norm(state.level) : 'all';
    }
    state.page = 1;
    refresh();
    renderLevels();
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
            <span><i class="fa-regular fa-calendar" aria-hidden="true"></i>${b.year || '—'}</span>
            <span><i class="fa-regular fa-eye" aria-hidden="true"></i>${nf.format(b.readers)}</span>
          </div>
          ${b.description ? `<p class="book-desc">${esc(b.description)}</p>` : ''}
          <div class="book-actions">
            <div class="action-row">
              <button type="button" class="btn-hype" data-action="hype" data-id="${b.id}" aria-pressed="false">
                <i class="fa-solid fa-fire" aria-hidden="true"></i>
                <span class="hype-count">${nf.format(b.hype)}</span>
              </button>
              <button type="button" class="btn-simpan" data-action="save" data-id="${b.id}">
                <i class="fa-regular fa-bookmark" aria-hidden="true"></i>
                <span class="save-label">Simpan</span><span class="sr-only">: ${esc(b.title)}</span>
              </button>
            </div>
            <button type="button" class="btn-detail" data-action="detail" data-id="${b.id}">
              <i class="fa-regular fa-eye" aria-hidden="true"></i> Lihat Detail
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

  function releaseHTML(b) {
    return `
      <li class="mini-book">
        <img src="${COVER}" alt="" width="48" height="64" loading="lazy">
        <div class="mini-info">
          <p class="mini-title">${esc(b.title)}</p>
          <p class="mini-author">${esc(b.author)}</p>
          <span class="mini-rating"><i class="fa-regular fa-calendar" aria-hidden="true"></i>Terbit ${b.year || '—'}</span>
        </div>
        <button type="button" class="btn-save-mini" data-action="save" data-id="${b.id}"
                aria-label="Simpan ${esc(b.title)}" aria-pressed="false">
          <i class="fa-regular fa-bookmark" aria-hidden="true"></i>
        </button>
      </li>`;
  }

  function modalBodyHTML(b) {
    const purposesHTML = b.purposes.length
      ? `<h3 class="modal-sub">Cocok untuk</h3>
         <ul class="modal-purposes">${b.purposes.map((p) => `<li class="tag-purpose">${esc(p)}</li>`).join('')}</ul>`
      : '';
    return `
      <div class="modal-cover">
        <img src="${COVER}" alt="Sampul buku ${esc(b.title)}" width="240" height="320" loading="lazy">
      </div>
      <div class="modal-info">
        <span class="badge-cat">${esc(b.category)}</span>
        <h2 class="modal-title" id="modal-title">${esc(b.title)}</h2>
        <p class="modal-author">${esc(b.author)}</p>
        <div class="modal-meta">
          <span class="meta-rating"><i class="fa-solid fa-star" aria-hidden="true"></i>${rf.format(b.rating)}</span>
          <span><i class="fa-regular fa-file-lines" aria-hidden="true"></i>${b.pages} hlm</span>
          <span><i class="fa-solid fa-signal" aria-hidden="true"></i>${esc(b.level)}</span>
          <span><i class="fa-regular fa-calendar" aria-hidden="true"></i>${b.year || '—'}</span>
          <span><i class="fa-regular fa-eye" aria-hidden="true"></i>${nf.format(b.readers)} pembaca</span>
          <span><i class="fa-solid fa-fire" aria-hidden="true"></i>${nf.format(hypeOf(b))} hype</span>
        </div>
        <p class="modal-desc">${b.description ? esc(b.description) : 'Belum ada deskripsi untuk buku ini.'}</p>
        ${purposesHTML}
        <div class="modal-actions">
          <button type="button" class="btn-baca" data-action="read-now" data-id="${b.id}">
            <i class="fa-solid fa-book-open" aria-hidden="true"></i> Baca Sekarang
          </button>
          <button type="button" class="btn-simpan btn-modal-save" data-action="save" data-id="${b.id}">
            <i class="fa-regular fa-bookmark" aria-hidden="true"></i>
            <span class="save-label">Simpan Buku</span>
          </button>
        </div>
      </div>`;
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
      const countEl = btn.querySelector('.hype-count');
      if (countEl) countEl.textContent = count;
    });

    root.querySelectorAll('[data-action="save"]').forEach((btn) => {
      const on = state.saved.has(Number(btn.dataset.id));
      const icon = btn.querySelector('i');
      if (icon) icon.className = on ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';

      if (btn.classList.contains('btn-save-mini')) {
        btn.setAttribute('aria-pressed', on);
      } else {
        const isModal = btn.classList.contains('btn-modal-save');
        btn.classList.toggle('is-saved', on);
        const label = btn.querySelector('.save-label');
        if (label) label.textContent = on ? 'Tersimpan' : (isModal ? 'Simpan Buku' : 'Simpan');
      }
    });

    if (el.savedBadge) el.savedBadge.textContent = nf.format(state.saved.size);
  }

  /* ---------- Render ---------- */
  function renderChips() {
    const items = [{ name: 'Semua', count: books.length }, ...categories];
    el.chips.innerHTML = items.map((c) => `
      <button type="button" class="chip" data-category="${esc(c.name)}">
        ${esc(c.name)}<span class="chip-count">${nf.format(c.count)}</span>
      </button>
    `).join('');
    highlightChips();
  }

  function highlightChips() {
    el.chips.querySelectorAll('.chip').forEach((c) => {
      const on = (c.dataset.category || 'Semua') === state.category;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', String(on));
    });
  }

  function renderPurposeOptions() {
    if (!el.purposeSelect || !el.purposeSelectWrap) return;
    if (!purposes.length) {
      el.purposeSelectWrap.hidden = true;
      return;
    }
    el.purposeSelectWrap.hidden = false;
    el.purposeSelect.innerHTML = ['<option value="all">Semua tujuan baca</option>']
      .concat(purposes.map((p) => `<option value="${esc(p.name)}">${esc(p.name)} (${p.count})</option>`))
      .join('');
  }

  function renderList() {
    if (!list.length) {
      renderEmptyState();
      return;
    }
    const start = (state.page - 1) * PAGE_SIZE;
    el.list.innerHTML = list.slice(start, start + PAGE_SIZE).map(cardHTML).join('');
    syncButtons(el.list);
  }

  function renderEmptyState() {
    const title = state.onlySaved ? 'Belum ada buku yang kamu simpan' : 'Buku tidak ditemukan';
    const desc = state.onlySaved
      ? 'Tekan tombol Simpan pada buku yang kamu suka supaya muncul di sini.'
      : 'Coba ubah kata kunci pencarian, kategori, level, atau tujuan bacamu.';
    el.list.innerHTML = `
      <div class="empty-state" role="status">
        <i class="fa-regular fa-folder-open" aria-hidden="true"></i>
        <p class="empty-title">${title}</p>
        <p class="empty-desc">${desc}</p>
        ${hasActiveFilter() ? '<button type="button" class="btn-reset-filter" data-action="reset-filter">Reset filter</button>' : ''}
      </div>`;
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
    if (!list.length) {
      el.pagination.innerHTML = '';
      return;
    }

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
    el.list.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  function renderStats() {
    const avg = books.reduce((sum, b) => sum + b.rating, 0) / books.length;
    const totalHype = books.reduce((sum, b) => sum + hypeOf(b), 0);
    const totalReaders = books.reduce((sum, b) => sum + b.readers, 0);
    const stats = [
      ['Total buku', nf.format(books.length)],
      ['Kategori', categories.length],
      ['Rata-rata rating', rf.format(avg)],
      ['Total hype', nf.format(totalHype)],
      ['Buku tersimpan', nf.format(state.saved.size)],
      ['Total pembaca', nf.format(totalReaders)],
    ];
    el.statGrid.innerHTML = stats.map(([label, value]) => `
      <li class="stat">
        <span class="stat-label">${label}</span>
        <strong class="stat-value">${value}</strong>
      </li>
    `).join('');
  }

  // Sebaran kategori: klik baris untuk langsung memfilter daftar buku
  // function renderCategories() {
  //   const max = categories[0]?.count || 1;
  //   el.catList.innerHTML = categories.map((c) => `
  //     <li>
  //       <button type="button" class="cat-row${c.name === state.category ? ' is-active' : ''}"
  //               data-action="filter-category" data-category="${esc(c.name)}">
  //         <span class="cat-head"><span>${esc(c.name)}</span><span class="cat-count">${c.count}</span></span>
  //         <span class="bar" aria-hidden="true"><span style="--w: ${Math.round((c.count / max) * 100)}%"></span></span>
  //       </button>
  //     </li>
  //   `).join('');
  // }

  // Sebaran level: sama seperti kategori, ikut menyinkron #level-select
  function renderLevels() {
    if (!el.levelList) return;
    const max = levels[0]?.count || 1;
    el.levelList.innerHTML = levels.map((lv) => `
      <li>
        <button type="button" class="cat-row${norm(lv.name) === norm(state.level) ? ' is-active' : ''}"
                data-action="filter-level" data-level="${esc(lv.name)}">
          <span class="cat-head"><span>${esc(lv.name)}</span><span class="cat-count">${lv.count}</span></span>
          <span class="bar" aria-hidden="true"><span style="--w: ${Math.round((lv.count / max) * 100)}%"></span></span>
        </button>
      </li>
    `).join('');
  }

  // Top 5 buku dengan hype terbanyak (section "populer"), ikut berubah saat user menekan hype
  function renderTopHype() {
    if (!el.topHype) return;
    el.topHype.innerHTML = [...books]
      .sort((a, b) => hypeOf(b) - hypeOf(a))
      .slice(0, 5)
      .map(rankHTML)
      .join('');
  }

  // 5 buku dengan tahun terbit terbaru (section "terbaru")
  function renderNewReleases() {
    if (!el.newReleases) return;
    el.newReleases.innerHTML = [...books]
      .sort((a, b) => b.year - a.year || b.id - a.id)
      .slice(0, 5)
      .map(releaseHTML)
      .join('');
    syncButtons(el.newReleases);
  }

  function renderRecs() {
    // Rekomendasi: rating tertinggi, lalu hype terbanyak
    const recs = [...books]
      .sort((a, b) => b.rating - a.rating || b.hype - a.hype)
      .slice(0, 5);
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

  /* ---------- Modal detail buku ---------- */
  function openModal(id) {
    const b = byId.get(id);
    if (!b || !el.modal) return;
    lastFocusedEl = document.activeElement;
    el.modalBody.innerHTML = modalBodyHTML(b);
    syncButtons(el.modalBody);
    el.modal.hidden = false;
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => el.modal.classList.add('is-open'));
    el.modalPanel.focus();
  }

  function closeModal() {
    if (!el.modal || el.modal.hidden) return;
    el.modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.modal.hidden = true;
    };

    if (reduceMotion()) {
      finish();
    } else {
      el.modalPanel.addEventListener('transitionend', finish, { once: true });
      setTimeout(finish, 300); // jaga-jaga kalau transitionend tidak terpicu
    }
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') lastFocusedEl.focus();
  }

  /* ---------- AI Library Assistant (PROTOTIPE TAMPILAN) ----------
     Bukan AI sungguhan: cuma pencocokan kata kunci sederhana ke data buku
     yang sudah dimuat (kategori, level, tujuan baca, judul/penulis).
     Tujuannya menunjukkan bentuk & alur interaksi, bukan kecerdasan nyata. */
  function renderAiSuggestions() {
    if (!el.aiSuggestions) return;
    const picks = ['Lagi hype 🔥'];
    if (categories[0]) picks.push(`Buku ${categories[0].name}`);
    if (categories[1]) picks.push(`Buku ${categories[1].name}`);
    if (purposes[0]) picks.push(purposes[0].name);
    else if (levels[0]) picks.push(`Level ${levels[0].name}`);
    el.aiSuggestions.innerHTML = picks.slice(0, 4)
      .map((t) => `<button type="button" class="ai-suggestion-chip">${esc(t)}</button>`)
      .join('');
  }

  function aiFormatBookList(items) {
    return items.map((b) => `• ${b.title} — ${b.author}`).join('\n');
  }

  function aiReply(rawText) {
    const q = norm(rawText);
    if (!q) return 'Ketik kata kunci kategori, level, atau tujuan bacamu, ya.';

    if (/^(hai|halo|hi|hey|pagi|siang|malam)\b/.test(q)) {
      return 'Halo! Ceritain lagi cari buku soal apa, nanti aku carikan dari koleksi Liblary. 📚';
    }

    if (/hype|populer|rame|viral|trending/.test(q)) {
      const found = [...books].sort((a, b) => hypeOf(b) - hypeOf(a)).slice(0, 3);
      return `Ini yang lagi paling hype:\n${aiFormatBookList(found)}`;
    }

    const cat = categories.find((c) => q.includes(norm(c.name)) || norm(c.name).includes(q));
    if (cat) {
      const found = books.filter((b) => b.category === cat.name).sort((a, b) => b.rating - a.rating).slice(0, 3);
      return `Rekomendasi kategori ${cat.name}:\n${aiFormatBookList(found)}`;
    }

    const purp = purposes.find((p) => q.includes(norm(p.name)) || norm(p.name).includes(q));
    if (purp) {
      const found = books.filter((b) => b.purposes.includes(purp.name)).sort((a, b) => b.rating - a.rating).slice(0, 3);
      return `Cocok untuk "${purp.name}":\n${aiFormatBookList(found)}`;
    }

    const lvl = levels.find((l) => q.includes(norm(l.name)) || norm(l.name).includes(q));
    if (lvl) {
      const found = books.filter((b) => norm(b.level) === norm(lvl.name)).sort((a, b) => b.rating - a.rating).slice(0, 3);
      return `Buku level ${lvl.name}:\n${aiFormatBookList(found)}`;
    }

    const titleMatches = books.filter((b) => matchesQuery(b, q)).slice(0, 3);
    if (titleMatches.length) return `Yang mirip "${rawText.trim()}":\n${aiFormatBookList(titleMatches)}`;

    return 'Belum nemu yang pas. Prototipe ini baru bisa cocokkan kategori, level, tujuan baca, atau judul/penulis — coba kata kunci lain, atau pakai filter di atas ya.';
  }

  function addAiMessage(role, text) {
    if (!el.aiMessages) return;
    const bubble = document.createElement('div');
    bubble.className = `ai-msg ai-msg-${role}`;
    bubble.innerHTML = esc(text).replace(/\n/g, '<br>');
    el.aiMessages.appendChild(bubble);
    el.aiMessages.scrollTop = el.aiMessages.scrollHeight;
  }

  function showAiTyping() {
    if (!el.aiMessages) return;
    const bubble = document.createElement('div');
    bubble.className = 'ai-msg ai-msg-assistant ai-typing';
    bubble.id = 'ai-typing-indicator';
    bubble.innerHTML = '<span></span><span></span><span></span>';
    el.aiMessages.appendChild(bubble);
    el.aiMessages.scrollTop = el.aiMessages.scrollHeight;
  }

  function hideAiTyping() {
    $('ai-typing-indicator')?.remove();
  }

  function sendAiMessage(rawText) {
    const trimmed = String(rawText || '').trim();
    if (!trimmed) return;
    addAiMessage('user', trimmed);
    if (el.aiInput) el.aiInput.value = '';
    showAiTyping();
    setTimeout(() => {
      hideAiTyping();
      addAiMessage('assistant', aiReply(trimmed));
    }, 500 + Math.random() * 300);
  }

  function openAiPanel() {
    if (!el.aiPanel) return;
    el.aiPanel.hidden = false;
    requestAnimationFrame(() => el.aiPanel.classList.add('is-open'));
    el.aiToggle?.setAttribute('aria-expanded', 'true');
    if (!aiWelcomed) {
      addAiMessage('assistant', 'Halo! Aku AI Library Assistant — masih prototipe tampilan, balasannya otomatis dari data buku yang ada (bukan model AI sungguhan). Coba tanya kategori, level, atau tujuan bacamu 👇');
      aiWelcomed = true;
    }
    el.aiInput?.focus();
  }

  function closeAiPanel() {
    if (!el.aiPanel || el.aiPanel.hidden) return;
    el.aiPanel.classList.remove('is-open');
    el.aiToggle?.setAttribute('aria-expanded', 'false');

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.aiPanel.hidden = true;
    };

    if (reduceMotion()) {
      finish();
    } else {
      el.aiPanel.addEventListener('transitionend', finish, { once: true });
      setTimeout(finish, 300);
    }
  }

  el.aiToggle?.addEventListener('click', () => {
    const isOpen = el.aiPanel && !el.aiPanel.hidden;
    if (isOpen) closeAiPanel(); else openAiPanel();
  });

  el.aiClose?.addEventListener('click', closeAiPanel);

  el.aiForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    sendAiMessage(el.aiInput?.value);
  });

  el.aiSuggestions?.addEventListener('click', (e) => {
    const chip = e.target.closest('.ai-suggestion-chip');
    if (!chip) return;
    sendAiMessage(chip.textContent.trim());
  });

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

    if (action === 'page') { goTo(Number(btn.dataset.page)); return; }
    if (action === 'close-modal') { closeModal(); return; }
    if (action === 'reset-filter') { resetFilters(); return; }

    if (action === 'toggle-saved') {
      state.onlySaved = !state.onlySaved;
      btn.setAttribute('aria-pressed', String(state.onlySaved));
      btn.classList.toggle('is-active', state.onlySaved);
      state.page = 1;
      refresh();
      return;
    }

    if (action === 'filter-category') { setCategory(btn.dataset.category); return; }
    if (action === 'filter-level') { setLevel(btn.dataset.level); return; }

    const id = Number(btn.dataset.id);
    const book = byId.get(id);
    if (!book) return;

    if (action === 'detail') { openModal(id); return; }
    if (action === 'read-now') { showToast(`Membuka "${book.title}"…`); return; }

    if (action === 'hype') {
      if (toggle(state.hyped, id)) popIcon(id);
    } else if (action === 'save') {
      const savedNow = toggle(state.saved, id);
      showToast(savedNow ? `Disimpan: ${book.title}` : `Dihapus dari simpanan: ${book.title}`);
    } else {
      return;
    }

    persist();
    applyFilters();   // urutan "terpopuler" & filter "Tersimpan" bisa berubah
    renderList();
    renderPagination();
    renderTopHype();  // peringkat hype bisa berubah
    renderStats();    // total hype & jumlah buku tersimpan bisa berubah
    syncButtons();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (el.modal && !el.modal.hidden) { closeModal(); return; }
    if (el.aiPanel && !el.aiPanel.hidden) closeAiPanel();
  });

  // Ganti urutan: kembali ke halaman 1 lalu render ulang daftar
  el.sort?.addEventListener('change', () => {
    state.sort = el.sort.value;
    state.page = 1;
    refresh();
  });

  el.levelSelect?.addEventListener('change', () => {
    state.level = el.levelSelect.value;
    state.page = 1;
    refresh();
    renderLevels();
  });

  el.purposeSelect?.addEventListener('change', () => {
    state.purpose = el.purposeSelect.value;
    state.page = 1;
    refresh();
  });

  el.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    state.query = el.searchInput.value;
    state.page = 1;
    refresh();
  });

  // Pencarian langsung saat mengetik, tombol "Cari" tetap berfungsi lewat submit
  el.searchInput?.addEventListener('input', () => {
    state.query = el.searchInput.value;
    state.page = 1;
    refresh();
  });

  el.chips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    setCategory(chip.dataset.category);
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
    renderPurposeOptions();
    applyFilters();
    renderChips();
    renderList();
    renderPagination();
    renderStats();
    // renderCategories();
    renderLevels();
    renderTopHype();
    renderNewReleases();
    renderRecs();
    renderAiSuggestions();
  }

  init();
})();