/* =====================================================================
   artikel.js  —  halaman daftar artikel Kembangin
   Simpan sebagai: public/js/artikel.js
   Fitur: search, filter kategori, sorting, featured, artikel populer,
   load more, like & bookmark (localStorage), salin link, reading time,
   empty state, reset filter, ringkasan Kemba AI (modal, data `summary` JSON).
   ===================================================================== */
(() => {
  'use strict';

  // Hanya jalan di halaman artikel
  if (document.body.dataset.page !== 'article') return;

  /* ---------- KONFIGURASI (sesuaikan dengan struktur folder Anda) ---------- */
  const CONFIG = {
    dataUrl: '../database/artikel.json',      // lokasi file JSON (relatif terhadap halaman HTML)
    detailUrl: 'article-detail.html',          // halaman detail, diberi ?slug=...
    placeholder: '../assets/artike-img.jpg',   // gambar cadangan
    kembaLogo: '../assets/logo-ai-article-summarizer.png', // logo di modal Kemba AI
    perPage: 6,                                // kartu awal & tambahan tiap "Muat lebih banyak"
    popularCount: 4,                           // kartu di "Artikel Populer"
    recommendCount: 3,                         // item di "Rekomendasi Artikel"
    searchDelay: 250,                          // jeda (ms) sebelum pencarian dijalankan
    storagePrefix: 'kembangin:'                // awalan kunci localStorage
  };

  /* ---------- HELPER ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);

  const esc = (v) =>
    String(v ?? '').replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));

  const num = (n) => Number(n || 0).toLocaleString('id-ID');
  const fmtDate = (d) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  const detailLink = (a) => `${CONFIG.detailUrl}?slug=${encodeURIComponent(a.slug)}`;
  const imgOnError = `this.onerror=null;this.src='${CONFIG.placeholder}'`;

  // gambar artikel di lapisan atas, placeholder di bawahnya (cadangan otomatis)
  const bgImage = (a) => `url('${encodeURI(a.image || '')}'), url('${CONFIG.placeholder}')`;

  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const debounce = (fn, ms) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  };

  // localStorage aman: tidak error bila diblokir / penuh
  const read = (key) => {
    try { return new Set(JSON.parse(localStorage.getItem(CONFIG.storagePrefix + key)) || []); }
    catch { return new Set(); }
  };
  const save = (key, set) => {
    try { localStorage.setItem(CONFIG.storagePrefix + key, JSON.stringify([...set])); }
    catch { /* penyimpanan diblokir atau penuh: abaikan */ }
  };

  /* ---------- ELEMEN DOM ---------- */
  const el = {
    leftSide: $('.left-side'),
    search: $('.search-artikel input'),
    selects: {
      'filter-urutan': $('#filter-urutan'),
      'filter-nama': $('#filter-nama'),
      'filter-populer': $('#filter-populer')
    },
    chips: $('.kategori-artikel'),
    info: $('.hasil-info'),
    reset: $('.hasil-artikel .btn-reset'),
    featured: $('.featured-slot'),
    cards: $('.card-container'),
    more: $('.btn-loadmore'),
    popular: $('.popular-scroll'),
    recommend: $('.sidebar-list')
  };

  /* ---------- STATE ---------- */
  const state = {
    all: [],
    byId: new Map(),
    filtered: [],       // daftar untuk grid (tanpa artikel featured)
    featured: null,     // artikel unggulan (hanya saat tanpa filter)
    visible: CONFIG.perPage,
    sort: 'newest',     // nilai dari dropdown yang terakhir diubah
    query: '',
    category: 'all',
    likes: read('likes'),
    marks: read('bookmarks')
  };

  /* ---------- SORTING ---------- */
  const SORTERS = {
    newest: (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
    oldest: (a, b) => new Date(a.publishedAt) - new Date(b.publishedAt),
    az: (a, b) => a.title.localeCompare(b.title, 'id'),
    za: (a, b) => b.title.localeCompare(a.title, 'id'),
    popular: (a, b) => b.likes - a.likes,
    'most-viewed': (a, b) => b.views - a.views
  };

  /* ---------- FILTER + SORT ---------- */
  function applyFilters() {
    const tokens = state.query.toLowerCase().split(/\s+/).filter(Boolean);
    const sorter = SORTERS[state.sort] || SORTERS.newest;

    const list = state.all
      .filter((a) => state.category === 'all' || a.category === state.category)
      .filter((a) => tokens.every((t) => a._search.includes(t)))
      .sort((a, b) => sorter(a, b) || SORTERS.newest(a, b));

    // featured tampil hanya di tampilan awal (tanpa pencarian / kategori)
    const plain = !tokens.length && state.category === 'all';
    state.featured = plain
      ? state.all.filter((a) => a.featured).sort(SORTERS.newest)[0] || null
      : null;
    state.filtered = state.featured ? list.filter((a) => a.id !== state.featured.id) : list;
  }

  /* ---------- KOMPONEN KECIL ---------- */
  const tagsHTML = (a, n) => a.tags.slice(0, n).map((t) => `<li>${esc(t)}</li>`).join('');

  const metaHTML = (a) => `
    <div class="meta-artikel">
      <span><i class="fa-solid fa-feather-pointed"></i>${esc(a.author.name)}</span>
      <span><i class="fa-regular fa-clock"></i>${a.readingTime || 1} menit baca</span>
      <span><i class="fa-regular fa-calendar"></i>${fmtDate(a.publishedAt)}</span>
    </div>`;

  const likeBtn = (a) => {
    const on = state.likes.has(a.id);
    return `<button type="button" class="act act-like${on ? ' is-on' : ''}" data-act="like" aria-pressed="${on}" aria-label="Sukai artikel"><i class="fa-${on ? 'solid' : 'regular'} fa-heart"></i><b>${num(a.likes + (on ? 1 : 0))}</b></button>`;
  };

  const markBtn = (a) => {
    const on = state.marks.has(a.id);
    return `<button type="button" class="btn-mark${on ? ' is-on' : ''}" data-act="bookmark" aria-pressed="${on}" aria-label="Simpan artikel"><i class="fa-${on ? 'solid' : 'regular'} fa-bookmark"></i></button>`;
  };

  // like, jumlah dilihat, salin link, Kemba AI
  const statsHTML = (a) => `
    <li>${likeBtn(a)}</li>
    <li><i class="fa-regular fa-eye"></i>${num(a.views)}</li>
    <li><button type="button" class="act" data-act="share" aria-label="Salin link artikel" title="Salin link"><i class="fa-solid fa-link"></i></button></li>
    <li><button type="button" class="act act-kemba" data-act="kemba" aria-label="Ringkas dengan Kemba AI" title="Ringkas dengan Kemba AI"><i class="fa-solid fa-wand-magic-sparkles"></i><span>Ringkas dengan Kemba AI</span></button></li>`;

  /* ---------- RENDER: FEATURED ---------- */
  function featuredHTML(a) {
    const link = esc(detailLink(a));
    return `
      <article class="featured-artikel" data-id="${a.id}">
        <div class="featured-img">
          <a class="img-link" href="${link}" tabindex="-1" aria-hidden="true"><img src="${esc(a.image)}" alt="" onerror="${imgOnError}"></a>
          <span class="featured-label"><i class="fa-solid fa-star"></i> Artikel Unggulan</span>
          ${markBtn(a)}
        </div>
        <div class="featured-body">
          <span class="kategori-badge">${esc(a.category)}</span>
          <h2><a href="${link}">${esc(a.title)}</a></h2>
          <p>${esc(a.excerpt)}</p>
          ${metaHTML(a)}
          <ul class="tags">${tagsHTML(a, 4)}</ul>
          <div class="featured-actions">
            <ul class="icon">${statsHTML(a)}</ul>
            <a class="btn-baca" href="${link}">Baca selengkapnya <i class="fa-solid fa-angles-right"></i></a>
          </div>
        </div>
      </article>`;
  }

  /* ---------- RENDER: KARTU ARTIKEL ---------- */
  function cardHTML(a, i = 0) {
    const link = esc(detailLink(a));
    return `
      <article class="card-artikel" data-id="${a.id}" style="--i:${i}">
        <div class="img-artikel">
          <a class="img-link" href="${link}" tabindex="-1" aria-hidden="true"><img src="${esc(a.image)}" alt="" loading="lazy" onerror="${imgOnError}"></a>
          <span>${esc(a.category)}</span>
          ${markBtn(a)}
        </div>
        <div class="deskripsi-artikel">
          <h2><a href="${link}">${esc(a.title)}</a></h2>
          <p>${esc(a.excerpt)}</p>
          ${metaHTML(a)}
          <ul>${tagsHTML(a, 3)}</ul>
        </div>
        <div class="tag-artikel">
          <ul class="icon">${statsHTML(a)}</ul>
          <a href="${link}">Selengkapnya <i class="fa-solid fa-angles-right"></i></a>
        </div>
      </article>`;
  }

  const EMPTY_HTML = `
    <div class="empty-artikel">
      <i class="fa-solid fa-magnifying-glass"></i>
      <h3>Artikel tidak ditemukan</h3>
      <p>Coba kata kunci atau kategori lain, atau tampilkan semua artikel.</p>
      <button type="button" class="btn-reset" data-act="reset"><i class="fa-solid fa-rotate-left"></i> Reset filter</button>
    </div>`;

  function renderFeatured() {
    el.featured.innerHTML = state.featured ? featuredHTML(state.featured) : '';
  }

  // append = true: hanya menambah kartu baru (tanpa mengulang animasi kartu lama)
  function renderCards(append) {
    const list = state.filtered;
    if (!list.length) {
      el.cards.innerHTML = state.featured ? '' : EMPTY_HTML;
      return;
    }
    const from = append ? el.cards.querySelectorAll('.card-artikel').length : 0;
    const html = list.slice(from, state.visible).map((a, i) => cardHTML(a, i)).join('');
    if (append) el.cards.insertAdjacentHTML('beforeend', html);
    else el.cards.innerHTML = html;
  }

  // info jumlah hasil, tombol reset, tombol muat lebih banyak
  function renderFooter() {
    const total = state.filtered.length + (state.featured ? 1 : 0);
    el.info.textContent =
      `${total} artikel` +
      (state.category !== 'all' ? ` di ${state.category}` : '') +
      (state.query ? ` untuk "${state.query}"` : '');

    el.reset.hidden = !(state.query || state.category !== 'all' || state.sort !== 'newest');

    const left = state.filtered.length - state.visible;
    el.more.hidden = left <= 0;
    if (left > 0) $('small', el.more).textContent = `${left} tersisa`;
  }

  /* ---------- RENDER: KATEGORI ---------- */
  function buildChips() {
    const cats = ['all', ...new Set(state.all.map((a) => a.category))];
    el.chips.innerHTML = cats
      .map((c) => {
        const n = c === 'all' ? state.all.length : state.all.filter((a) => a.category === c).length;
        return `<button type="button" class="chip" data-cat="${esc(c)}">${c === 'all' ? 'Semua' : esc(c)} <small>${n}</small></button>`;
      })
      .join('');
  }

  function syncChips() {
    el.chips.querySelectorAll('.chip').forEach((chip) => {
      const on = chip.dataset.cat === state.category;
      chip.classList.toggle('active', on);
      chip.setAttribute('aria-pressed', on);
    });
  }

  /* ---------- RENDER: SIDEBAR ---------- */
  function popularHTML(a) {
    return `
      <a class="popular-card" href="${esc(detailLink(a))}" style="background-image: ${bgImage(a)}">
        <div class="popular-overlay">
          <span class="popular-badge">${esc(a.category)}</span>
          <div class="popular-content">
            <h4>${esc(a.title)}</h4>
            <p>${esc(a.excerpt)}</p>
            <div class="popular-author"><i class="fa-solid fa-feather-pointed"></i> ${esc(a.author.name)}</div>
            <ul class="popular-tags">${tagsHTML(a, 2)}</ul>
            <div class="popular-footer">
              <ul class="popular-stats">
                <li><i class="fa-regular fa-heart"></i>${num(a.likes)}</li>
                <li><i class="fa-regular fa-eye"></i>${num(a.views)}</li>
              </ul>
              <span class="popular-more">Selengkapnya <i class="fa-solid fa-angles-right"></i></span>
            </div>
          </div>
        </div>
      </a>`;
  }

  function recommendHTML(a) {
    return `
      <li>
        <a class="sidebar-item" href="${esc(detailLink(a))}">
          <img src="${esc(a.image)}" alt="" loading="lazy" onerror="${imgOnError}">
          <div class="sidebar-item-info">
            <h5>${esc(a.title)}</h5>
            <p class="sidebar-item-desc">${esc(a.excerpt)}</p>
            <ul class="sidebar-item-tags">${tagsHTML(a, 2)}</ul>
            <div class="sidebar-item-meta">
              <span class="sidebar-author"><i class="fa-solid fa-feather-pointed"></i> ${esc(a.author.name)}</span>
              <span class="sidebar-stats"><i class="fa-regular fa-heart"></i> ${num(a.likes)}</span>
              <span class="sidebar-stats"><i class="fa-regular fa-eye"></i> ${num(a.views)}</span>
            </div>
          </div>
        </a>
      </li>`;
  }

  function renderSidebar() {
    // Populer = like terbanyak
    const popular = [...state.all].sort(SORTERS.popular).slice(0, CONFIG.popularCount);
    el.popular.innerHTML = popular.map(popularHTML).join('');

    // Rekomendasi = artikel unggulan (featured) acak, di luar yang sudah tampil di populer
    const popularIds = new Set(popular.map((a) => a.id));
    const rest = state.all.filter((a) => !popularIds.has(a.id));
    const picks = [
      ...shuffle(rest.filter((a) => a.featured)),
      ...shuffle(rest.filter((a) => !a.featured))
    ].slice(0, CONFIG.recommendCount);
    el.recommend.innerHTML = picks.map(recommendHTML).join('');
  }

  /* ---------- RENDER GABUNGAN ---------- */
  function update({ append = false, scroll = false } = {}) {
    applyFilters();
    if (!append) {
      syncChips();
      renderFeatured();
    }
    renderCards(append);
    renderFooter();
    if (scroll) el.leftSide.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resetAll() {
    Object.assign(state, { query: '', category: 'all', sort: 'newest', visible: CONFIG.perPage });
    el.search.value = '';
    Object.values(el.selects).forEach((s) => {
      s.selectedIndex = 0;
      s.classList.remove('is-active');
    });
    el.selects['filter-urutan'].classList.add('is-active');
    update();
  }

  /* ---------- TOAST ---------- */
  const toastEl = document.body.appendChild(document.createElement('div'));
  toastEl.className = 'toast';
  toastEl.setAttribute('role', 'status');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  /* ---------- MODAL KEMBA AI ---------- */
  const kemba = document.body.appendChild(document.createElement('dialog'));
  kemba.className = 'kemba-modal';
  kemba.setAttribute('aria-labelledby', 'kemba-title');
  kemba.innerHTML = `
    <div class="kemba-box">
      <button type="button" class="kemba-close" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
      <div class="kemba-head">
        <img src="${CONFIG.kembaLogo}" alt="">
        <div>
          <h3 id="kemba-title">Ringkasan Kemba AI</h3>
          <p class="kemba-sub"></p>
        </div>
      </div>
      <ul class="kemba-points"></ul>
      <p class="kemba-note">Ringkasan disusun dari data artikel. Baca artikel lengkap untuk pembahasan detailnya.</p>
      <a class="btn-baca kemba-link" href="#">Baca artikel lengkap <i class="fa-solid fa-angles-right"></i></a>
    </div>`;

  kemba.addEventListener('click', (e) => {
    // klik area gelap (di luar .kemba-box) atau tombol X menutup modal
    if (e.target === kemba || e.target.closest('.kemba-close')) kemba.close();
  });

  function openKemba(a) {
    const points = a.summary && a.summary.length ? a.summary : [a.excerpt];
    $('.kemba-sub', kemba).textContent = a.title;
    $('.kemba-points', kemba).innerHTML = points
      .map((p, i) => `<li style="--i:${i}"><i class="fa-solid fa-circle-check"></i><span>${esc(p)}</span></li>`)
      .join('');
    $('.kemba-link', kemba).href = detailLink(a);
    kemba.showModal();
  }

  /* ---------- AKSI KARTU (like, bookmark, salin link, Kemba) ---------- */
  function toggleSaved(set, key, id) {
    if (set.has(id)) set.delete(id);
    else set.add(id);
    save(key, set);
    return set.has(id);
  }

  function syncBtn(btn, on, icon) {
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', on);
    $('i', btn).className = `fa-${on ? 'solid' : 'regular'} fa-${icon}`;
  }

  const actions = {
    like(a, btn) {
      const on = toggleSaved(state.likes, 'likes', a.id);
      syncBtn(btn, on, 'heart');
      $('b', btn).textContent = num(a.likes + (on ? 1 : 0));
    },
    bookmark(a, btn) {
      const on = toggleSaved(state.marks, 'bookmarks', a.id);
      syncBtn(btn, on, 'bookmark');
      toast(on ? 'Artikel disimpan' : 'Dihapus dari simpanan');
    },
    async share(a) {
      const url = new URL(detailLink(a), location.href).href;
      try {
        await navigator.clipboard.writeText(url);
        toast('Link artikel disalin');
      } catch {
        toast('Gagal menyalin link');
      }
    },
    kemba(a) {
      openKemba(a);
    }
  };

  /* ---------- EVENT ---------- */
  function bindEvents() {
    // Pencarian
    el.search.addEventListener(
      'input',
      debounce(() => {
        state.query = el.search.value.trim();
        state.visible = CONFIG.perPage;
        update();
      }, CONFIG.searchDelay)
    );

    // Dropdown urutan: dropdown yang terakhir diubah menjadi kriteria utama
    Object.values(el.selects).forEach((select) => {
      select.addEventListener('change', () => {
        state.sort = select.value;
        state.visible = CONFIG.perPage;
        Object.values(el.selects).forEach((s) => s.classList.toggle('is-active', s === select));
        update();
      });
    });

    // Satu listener untuk semua klik: kategori, reset, muat lebih banyak, aksi kartu
    el.leftSide.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-cat]');
      if (chip) {
        state.category = chip.dataset.cat;
        state.visible = CONFIG.perPage;
        update();
        return;
      }

      const btn = e.target.closest('[data-act]');
      if (!btn) return;

      if (btn.dataset.act === 'reset') return resetAll();
      if (btn.dataset.act === 'more') {
        state.visible += CONFIG.perPage;
        return update({ append: true });
      }

      const card = btn.closest('[data-id]');
      const article = card && state.byId.get(Number(card.dataset.id));
      if (article && actions[btn.dataset.act]) actions[btn.dataset.act](article, btn);
    });
  }

  /* ---------- LOAD DATA ---------- */
  async function loadArticles() {
    const res = await fetch(CONFIG.dataUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return data
      .filter((a) => a.status === 'public')
      .map((a) => ({
        ...a,
        // teks gabungan untuk pencarian
        _search: [a.title, a.excerpt, a.category, a.author?.name, ...(a.tags || [])]
          .join(' ')
          .toLowerCase()
      }));
  }

  async function init() {
    el.cards.innerHTML = '<p class="loading-artikel">Memuat artikel...</p>';

    try {
      state.all = await loadArticles();
    } catch (err) {
      console.error('Gagal memuat artikel:', err);
      el.cards.innerHTML = `
        <p class="loading-artikel">
          Gagal memuat artikel. Pastikan file JSON tersedia dan halaman dibuka lewat server lokal (mis. Live Server), bukan file://.
        </p>`;
      return;
    }

    state.all.forEach((a) => state.byId.set(a.id, a));
    el.selects['filter-urutan'].classList.add('is-active');
    buildChips();
    bindEvents();
    renderSidebar();
    update();
  }

  init();
})();