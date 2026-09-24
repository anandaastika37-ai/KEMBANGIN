/* =====================================================================
   article-detail.js  —  halaman detail artikel Kembangin
   Simpan sebagai: public/js/article-detail.js
   Dipakai oleh: pages/article-detail.html?slug=...
   Data: ../database/artikel.json (sama dengan yang dipakai artikel.js)
   ===================================================================== */
(() => {
  'use strict';

  const root = document.getElementById('detail-article');
  if (!root) return;

  /* ---------- KONFIGURASI ---------- */
  const CONFIG = {
    dataUrl: '../database/artikel.json',
    listUrl: 'article.html',
    detailUrl: 'article-detail.html',
    placeholder: '../assets/artike-img.jpg',
    kembaLogo: '../assets/logo-ai-article-summarizer.png',
    relatedCount: 3,
    popularCount: 4,
    recommendCount: 3,
    storagePrefix: 'kembangin:'
  };

  /* ---------- HELPER (sama seperti artikel.js) ---------- */
  const $ = (sel, r = document) => r.querySelector(sel);

  const esc = (v) =>
    String(v ?? '').replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));

  const num = (n) => Number(n || 0).toLocaleString('id-ID');
  const fmtDate = (d) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const detailLink = (a) => `${CONFIG.detailUrl}?slug=${encodeURIComponent(a.slug)}`;
  const imgOnError = `this.onerror=null;this.src='${CONFIG.placeholder}'`;
  const bgImage = (a) => `url('${encodeURI(a.image || '')}'), url('${CONFIG.placeholder}')`;

  const initials = (name) =>
    (name || '?').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  const read = (key) => {
    try { return new Set(JSON.parse(localStorage.getItem(CONFIG.storagePrefix + key)) || []); }
    catch { return new Set(); }
  };
  const save = (key, set) => {
    try { localStorage.setItem(CONFIG.storagePrefix + key, JSON.stringify([...set])); }
    catch { /* penyimpanan diblokir atau penuh: abaikan */ }
  };

  const state = {
    all: [],
    likes: read('likes'),
    marks: read('bookmarks')
  };

  /* ---------- TOAST (sama seperti di halaman daftar artikel) ---------- */
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

  /* ---------- MODAL KEMBA AI (sama seperti di halaman daftar artikel) ---------- */
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

  /* ---------- AKSI: like, bookmark, salin link, share ---------- */
  function toggleSaved(set, key, id) {
    if (set.has(id)) set.delete(id);
    else set.add(id);
    save(key, set);
    return set.has(id);
  }

  function syncBtn(btn, on, icon) {
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', on);
    const i = $('i', btn);
    if (i) i.className = `fa-${on ? 'solid' : 'regular'} fa-${icon}`;
  }

  async function copyLink(a) {
    const url = new URL(detailLink(a), location.href).href;
    try {
      await navigator.clipboard.writeText(url);
      toast('Link artikel disalin');
    } catch {
      toast('Gagal menyalin link');
    }
  }

  function shareTo(platform, a) {
    const url = new URL(detailLink(a), location.href).href;
    const text = encodeURIComponent(a.title);
    const links = {
      whatsapp: `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`
    };
    if (links[platform]) window.open(links[platform], '_blank', 'noopener,noreferrer');
  }

  /* ---------- KOMENTAR (statis: hanya disimpan di localStorage browser ini, per artikel) ---------- */
  const readComments = (id) => {
    try { return JSON.parse(localStorage.getItem(`${CONFIG.storagePrefix}comments:${id}`)) || []; }
    catch { return []; }
  };
  const saveComments = (id, list) => {
    try { localStorage.setItem(`${CONFIG.storagePrefix}comments:${id}`, JSON.stringify(list)); }
    catch { /* penyimpanan diblokir atau penuh: abaikan */ }
  };

  function relativeTime(iso) {
    const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diffSec < 60) return 'Baru saja';
    const min = Math.floor(diffSec / 60);
    if (min < 60) return `${min} menit lalu`;
    const hour = Math.floor(min / 60);
    if (hour < 24) return `${hour} jam lalu`;
    const day = Math.floor(hour / 24);
    if (day < 7) return `${day} hari lalu`;
    return fmtDate(iso);
  }

  function commentItemHTML(c) {
    return `
      <li class="comment-item" data-id="${c.id}">
        <span class="comment-avatar">${esc(initials(c.name))}</span>
        <div class="comment-body">
          <div class="comment-head">
            <strong>${esc(c.name)}</strong>
            <span class="comment-time">${relativeTime(c.time)}</span>
          </div>
          <p>${esc(c.text)}</p>
        </div>
        <button type="button" class="comment-delete" data-id="${c.id}" aria-label="Hapus komentar" title="Hapus komentar">
          <i class="fa-solid fa-trash"></i>
        </button>
      </li>`;
  }

  function renderCommentList(a) {
    const list = $('#comment-list');
    if (!list) return;

    const comments = readComments(a.id);
    list.innerHTML = comments.length
      ? comments.slice().reverse().map(commentItemHTML).join('')
      : '<li class="comment-empty">Belum ada komentar. Jadilah yang pertama berkomentar!</li>';

    const countEl = $('.comments-count');
    if (countEl) countEl.textContent = `(${comments.length})`;
  }

  function renderComments(a) {
    const wrap = $('#comments-wrap');
    if (!wrap) return;

    wrap.innerHTML = `
      <h3 class="comments-title">Komentar <span class="comments-count">(0)</span></h3>

      <form class="comment-form" id="comment-form">
        <input type="text" id="comment-name" placeholder="Nama kamu (opsional)" maxlength="40" autocomplete="off">
        <textarea id="comment-text" placeholder="Tulis komentar..." rows="3" maxlength="500" required></textarea>
        <div class="comment-form-actions">
          <span class="comment-hint">Komentar disimpan di browser ini saja (belum terhubung ke server).</span>
          <button type="submit" class="btn-baca">Kirim <i class="fa-solid fa-paper-plane"></i></button>
        </div>
      </form>

      <ul class="comment-list" id="comment-list"></ul>`;

    renderCommentList(a);

    $('#comment-form', wrap).addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = $('#comment-name', wrap);
      const textInput = $('#comment-text', wrap);
      const text = textInput.value.trim();
      if (!text) return;

      const comments = readComments(a.id);
      comments.push({
        id: `c${Date.now()}${Math.random().toString(36).slice(2, 7)}`,
        name: nameInput.value.trim() || 'Anonim',
        text,
        time: new Date().toISOString()
      });
      saveComments(a.id, comments);

      textInput.value = '';
      renderCommentList(a);
      toast('Komentar terkirim');
    });

    wrap.addEventListener('click', (e) => {
      const del = e.target.closest('.comment-delete');
      if (!del) return;
      const remaining = readComments(a.id).filter((c) => c.id !== del.dataset.id);
      saveComments(a.id, remaining);
      renderCommentList(a);
    });
  }

  /* ---------- KOMPONEN KARTU (dipakai untuk artikel terkait & sidebar) ---------- */
  const tagsHTML = (a, n) => a.tags.slice(0, n).map((t) => `<li>${esc(t)}</li>`).join('');

  const metaHTML = (a) => `
    <div class="meta-artikel">
      <span><i class="fa-solid fa-feather-pointed"></i>${esc(a.author.name)}</span>
      <span><i class="fa-regular fa-clock"></i>${a.readingTime || 1} menit baca</span>
      <span><i class="fa-regular fa-calendar"></i>${fmtDate(a.publishedAt)}</span>
    </div>`;

  function cardHTML(a, i = 0) {
    const link = esc(detailLink(a));
    return `
      <article class="card-artikel" style="--i:${i}">
        <div class="img-artikel">
          <a class="img-link" href="${link}" tabindex="-1" aria-hidden="true"><img src="${esc(a.image)}" alt="" loading="lazy" onerror="${imgOnError}"></a>
          <span>${esc(a.category)}</span>
        </div>
        <div class="deskripsi-artikel">
          <h2><a href="${link}">${esc(a.title)}</a></h2>
          <p>${esc(a.excerpt)}</p>
          ${metaHTML(a)}
          <ul>${tagsHTML(a, 3)}</ul>
        </div>
      </article>`;
  }

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

  /* ---------- RENDER: aksi like + ringkas Kemba AI ---------- */
  function actionsHTML(a) {
    const likeOn = state.likes.has(a.id);
    return `
      <li><button type="button" class="act act-like${likeOn ? ' is-on' : ''}" data-act="like" aria-pressed="${likeOn}" aria-label="Sukai artikel"><i class="fa-${likeOn ? 'solid' : 'regular'} fa-heart"></i><b>${num(a.likes + (likeOn ? 1 : 0))}</b></button></li>
      <li><button type="button" class="act act-kemba" data-act="kemba" aria-label="Ringkas dengan Kemba AI" title="Ringkas dengan Kemba AI"><i class="fa-solid fa-wand-magic-sparkles"></i><span>Ringkas dengan Kemba AI</span></button></li>`;
  }

  /* ---------- RENDER: artikel utama ---------- */
  function renderDetail(a) {
    document.title = `${a.title} — Kembangin`;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = a.excerpt;

    const bcCurrent = $('.breadcrumb-current');
    if (bcCurrent) bcCurrent.textContent = a.title;

    const markOn = state.marks.has(a.id);

    root.innerHTML = `
      <div class="detail-hero">
        <img src="${esc(a.image)}" alt="${esc(a.title)}" onerror="${imgOnError}">
        <span class="detail-category">${esc(a.category)}</span>
        <button type="button" class="btn-mark${markOn ? ' is-on' : ''}" data-act="bookmark" aria-pressed="${markOn}" aria-label="Simpan artikel">
          <i class="fa-${markOn ? 'solid' : 'regular'} fa-bookmark"></i>
        </button>
      </div>
      <div class="detail-body">
        <h1>${esc(a.title)}</h1>

        <div class="detail-meta">
          <div class="detail-author">
            <span class="detail-avatar">${esc(initials(a.author.name))}</span>
            <span>
              <strong>${esc(a.author.name)}</strong>
              <small>${esc(a.author.role || '')}</small>
            </span>
          </div>
          <div class="detail-meta-stats">
            <span><i class="fa-regular fa-calendar"></i>${fmtDate(a.publishedAt)}</span>
            <span><i class="fa-regular fa-clock"></i>${a.readingTime || 1} menit baca</span>
            <span><i class="fa-regular fa-eye"></i>${num(a.views)} dilihat</span>
          </div>
        </div>

        <ul class="detail-actions">${actionsHTML(a)}</ul>

        <div class="detail-content">${a.content || `<p>${esc(a.excerpt)}</p>`}</div>

        <ul class="detail-tags">${tagsHTML(a, a.tags.length)}</ul>

        <div class="detail-share">
          <span>Bagikan:</span>
          <button type="button" class="share-btn" data-share="copy" aria-label="Salin link"><i class="fa-solid fa-link"></i></button>
          <button type="button" class="share-btn" data-share="whatsapp" aria-label="Bagikan ke WhatsApp"><i class="fa-brands fa-whatsapp"></i></button>
          <button type="button" class="share-btn" data-share="twitter" aria-label="Bagikan ke X"><i class="fa-brands fa-x-twitter"></i></button>
        </div>

        <div class="detail-author-card">
          <span class="detail-avatar">${esc(initials(a.author.name))}</span>
          <div>
            <h4>${esc(a.author.name)}</h4>
            <p>${esc(a.author.role || 'Penulis')}</p>
          </div>
        </div>
      </div>`;

    bindDetailEvents(a);
  }

  function bindDetailEvents(a) {
    root.addEventListener('click', (e) => {
      const shareBtn = e.target.closest('[data-share]');
      if (shareBtn) {
        const platform = shareBtn.dataset.share;
        if (platform === 'copy') copyLink(a);
        else shareTo(platform, a);
        return;
      }

      const btn = e.target.closest('[data-act]');
      if (!btn) return;

      if (btn.dataset.act === 'like') {
        const on = toggleSaved(state.likes, 'likes', a.id);
        root.querySelectorAll('[data-act="like"]').forEach((b) => {
          syncBtn(b, on, 'heart');
          const bEl = $('b', b);
          if (bEl) bEl.textContent = num(a.likes + (on ? 1 : 0));
        });
        return;
      }

      if (btn.dataset.act === 'bookmark') {
        const on = toggleSaved(state.marks, 'bookmarks', a.id);
        root.querySelectorAll('[data-act="bookmark"]').forEach((b) => syncBtn(b, on, 'bookmark'));
        toast(on ? 'Artikel disimpan' : 'Dihapus dari simpanan');
        return;
      }

      if (btn.dataset.act === 'kemba') openKemba(a);
    });
  }

  /* ---------- RENDER: artikel terkait ---------- */
  function renderRelated(a) {
    const wrap = $('.related-wrap');
    const grid = $('#related-grid');
    if (!wrap || !grid) return;

    const sameCategory = state.all.filter((x) => x.id !== a.id && x.category === a.category);
    const list = (sameCategory.length ? sameCategory : state.all.filter((x) => x.id !== a.id))
      .slice(0, CONFIG.relatedCount);

    grid.innerHTML = list.map((x, i) => cardHTML(x, i)).join('');
    wrap.hidden = !list.length;
  }

  /* ---------- RENDER: sidebar (sama seperti halaman daftar artikel) ---------- */
  function renderSidebar(a) {
    const popularEl = $('#detail-popular');
    const recommendEl = $('#detail-recommend');

    if (popularEl) {
      const popular = [...state.all]
        .filter((x) => x.id !== a.id)
        .sort((x, y) => y.likes - x.likes)
        .slice(0, CONFIG.popularCount);
      popularEl.innerHTML = popular.map(popularHTML).join('');
    }

    if (recommendEl) {
      const rest = state.all.filter((x) => x.id !== a.id);
      const picks = [...rest.filter((x) => x.featured), ...rest.filter((x) => !x.featured)]
        .slice(0, CONFIG.recommendCount);
      recommendEl.innerHTML = picks.map(recommendHTML).join('');
    }
  }

  /* ---------- STATE: tidak ditemukan ---------- */
  function renderNotFound() {
    document.title = 'Artikel tidak ditemukan — Kembangin';
    const bcCurrent = $('.breadcrumb-current');
    if (bcCurrent) bcCurrent.textContent = 'Tidak ditemukan';

    root.innerHTML = `
      <div class="detail-error">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <h3>Artikel tidak ditemukan</h3>
        <p>Artikel yang kamu cari mungkin sudah dipindahkan atau tidak tersedia.</p>
        <a class="btn-baca" href="${CONFIG.listUrl}">Kembali ke daftar artikel <i class="fa-solid fa-angles-right"></i></a>
      </div>`;
  }

  /* ---------- INIT ---------- */
  async function init() {
    const slug = new URLSearchParams(location.search).get('slug');

    try {
      const res = await fetch(CONFIG.dataUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      state.all = await res.json();
    } catch (err) {
      console.error('Gagal memuat artikel:', err);
      root.innerHTML = `
        <div class="detail-error">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <h3>Gagal memuat artikel</h3>
          <p>Pastikan file JSON tersedia dan halaman dibuka lewat server lokal (mis. Live Server), bukan file://.</p>
        </div>`;
      return;
    }

    const article = slug
      ? state.all.find((x) => x.slug === slug && x.status === 'public')
      : null;

    if (!article) {
      renderNotFound();
      return;
    }

    renderDetail(article);
    renderComments(article);
    renderRelated(article);
    renderSidebar(article);
  }

  init();
})();