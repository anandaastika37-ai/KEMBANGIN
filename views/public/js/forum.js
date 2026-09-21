(() => {
  'use strict';

  const PAGE = 6;                       // jumlah diskusi per tampilan
  const KEY = 'kembangin_forum_user';   // diskusi buatan pengguna (localStorage)
  const CATS = ['Bisnis', 'UMKM', 'Pemasaran', 'Keuangan', 'Ekonomi', 'Teknologi', 'Umum'];
  const $ = (s) => document.querySelector(s);

  const el = {
    cats: $('#cats'), list: $('#list'), more: $('#more'), search: $('#search'),
    sorts: $('#sorts'), count: $('#count'), popular: $('#popular'), empty: $('#empty'),
    modal: $('#modal'), form: $('#form'), err: $('#err'), fcat: $('#f-cat')
  };

  let all = [];
  const st = { cat: 'Semua', sort: 'terbaru', q: '', shown: PAGE };

  // Cegah XSS dari teks yang diketik pengguna
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'rb' : n);

  function ago(t) {
    const m = Math.floor((Date.now() - t) / 6e4);
    if (m < 1) return 'Baru saja';
    if (m < 60) return m + ' menit lalu';
    const h = Math.floor(m / 60);
    if (h < 24) return h + ' jam lalu';
    const d = Math.floor(h / 24);
    return d < 30 ? d + ' hari lalu' : Math.floor(d / 30) + ' bulan lalu';
  }

  // Filter kategori + pencarian + sorting
  function view() {
    const q = st.q.trim().toLowerCase();
    let r = all.filter((t) =>
      (st.cat === 'Semua' || t.cat === st.cat) &&
      (!q || (t.title + ' ' + t.user + ' ' + t.cat).toLowerCase().includes(q)));
    if (st.sort === 'belum') r = r.filter((t) => !t.answered);
    const score = (t) => t.views + t.comments * 5;
    r.sort(st.sort === 'populer' ? (a, b) => score(b) - score(a) : (a, b) => b.at - a.at);
    return r;
  }

  const card = (t) => `
    <article class="thread">
      <div class="av">${esc(t.user[0]).toUpperCase()}</div>
      <div class="tb">
        <div class="meta">
          <span class="tag">${esc(t.cat)}</span>
          ${t.answered ? '<span class="ok"><i class="fa-solid fa-circle-check"></i> Terjawab</span>' : ''}
        </div>
        <h3>${esc(t.title)}</h3>
        ${t.desc ? `<p>${esc(t.desc)}</p>` : ''}
        <div class="foot">
          <span><i class="fa-regular fa-user"></i>@${esc(t.user)}</span>
          <span><i class="fa-regular fa-clock"></i>${ago(t.at)}</span>
          <span><i class="fa-regular fa-comment"></i>${t.comments} komentar</span>
          <span><i class="fa-regular fa-eye"></i>${fmt(t.views)} views</span>
        </div>
      </div>
    </article>`;

  function render() {
    el.cats.innerHTML = ['Semua', ...CATS].map((c) => {
      const n = c === 'Semua' ? all.length : all.filter((t) => t.cat === c).length;
      return `<button class="chip${c === st.cat ? ' on' : ''}" data-cat="${c}" role="tab" aria-selected="${c === st.cat}">${c}<span>${n}</span></button>`;
    }).join('');

    const r = view();
    el.count.textContent = r.length + ' diskusi';
    el.list.innerHTML = r.slice(0, st.shown).map(card).join('');
    el.empty.hidden = r.length > 0;
    el.more.hidden = r.length <= st.shown;
    el.sorts.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.sort === st.sort));

    el.popular.innerHTML = [...all].sort((a, b) => b.views - a.views).slice(0, 5).map((t, i) =>
      `<li><button data-q="${esc(t.title)}"><b>${i + 1}</b><span>${esc(t.title)}<small>${fmt(t.views)} views di ${esc(t.cat)}</small></span></button></li>`).join('');
  }

  const update = (patch) => { Object.assign(st, patch, { shown: PAGE }); render(); };

  // Modal Buat Diskusi
  function openModal() {
    el.modal.hidden = false;
    el.err.hidden = true;
    $('#f-user').focus();
  }
  const closeModal = () => { el.modal.hidden = true; };

  el.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = $('#f-user').value.trim().replace(/^@/, '');
    const title = $('#f-title').value.trim();
    const desc = $('#f-desc').value.trim();
    const msg = !user ? 'Username wajib diisi.'
      : title.length < 10 ? 'Judul minimal 10 karakter agar diskusi mudah dipahami.'
      : desc.length < 10 ? 'Isi diskusi minimal 10 karakter.' : '';
    if (msg) { el.err.textContent = msg; el.err.hidden = false; return; }

    const t = { id: 'u' + Date.now(), title, user, cat: el.fcat.value, desc, comments: 0, views: 0, answered: false, at: Date.now() };
    try {
      const mine = JSON.parse(localStorage.getItem(KEY) || '[]');
      localStorage.setItem(KEY, JSON.stringify([t, ...mine]));
    } catch (_) { /* localStorage tidak tersedia: diskusi tetap tampil sementara */ }
    all.unshift(t);
    el.form.reset();
    el.search.value = '';
    update({ cat: 'Semua', sort: 'terbaru', q: '' });
    closeModal();
    el.list.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Event
  el.search.addEventListener('input', (e) => update({ q: e.target.value }));
  el.cats.addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (b) update({ cat: b.dataset.cat }); });
  el.sorts.addEventListener('click', (e) => { const b = e.target.closest('[data-sort]'); if (b) update({ sort: b.dataset.sort }); });
  el.more.addEventListener('click', () => { st.shown += PAGE; render(); });
  el.popular.addEventListener('click', (e) => {
    const b = e.target.closest('[data-q]');
    if (!b) return;
    el.search.value = b.dataset.q;
    update({ cat: 'Semua', q: b.dataset.q });
    el.list.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('#reset').addEventListener('click', () => { el.search.value = ''; update({ cat: 'Semua', sort: 'terbaru', q: '' }); });
  document.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', openModal));
  document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !el.modal.hidden) closeModal(); });

  async function init() {
    let failed = false;
    el.fcat.innerHTML = CATS.map((c) => `<option>${c}</option>`).join('');
    try {
      const res = await fetch('../database/forum.json');
      if (!res.ok) throw new Error(res.status);
      all = (await res.json()).map((t) => ({ ...t, at: Date.now() - t.mins * 6e4 }));
    } catch (_) { failed = true; }
    try { all.unshift(...JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (_) {}
    render();
    if (failed && !all.length) {
      el.empty.hidden = true;
      el.list.innerHTML = '<div class="state"><h3>Diskusi belum bisa dimuat</h3><p>Buka halaman lewat server lokal (mis. Live Server) agar database/forum.json terbaca.</p></div>';
    }
  }
  init();
})();