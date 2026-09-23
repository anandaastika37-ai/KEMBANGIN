(() => {
  'use strict';

  const PAGE = 6;                          // jumlah diskusi per tampilan
  const KEY = 'kembangin_forum_user';      // diskusi baru buatan pengguna
  const LIKE_KEY = 'kembangin_forum_likes';
  const FOLLOW_KEY = 'kembangin_forum_follow';
  const REPLY_KEY = 'kembangin_forum_replies'; // { threadId: [reply, ...] } balasan buatan pengguna
  const CATS = ['Bisnis', 'UMKM', 'Pemasaran', 'Keuangan', 'Ekonomi', 'Teknologi', 'Umum'];
  const $ = (s, r = document) => r.querySelector(s);

  // Saran akun "Who to Follow" — data tampilan, disimpan lokal di sini (bukan dari server)
  const SUGGESTIONS = [
    { user: 'dewi_kuliner', bio: 'UMKM Kuliner' },
    { user: 'andi_fin', bio: 'Konsultan Keuangan UMKM' },
    { user: 'toni_seo', bio: 'Digital Marketing' },
    { user: 'putu_craft', bio: 'Kerajinan & Ekspor' }
  ];

  // Notifikasi & Pesan — data dummy untuk tampilan (bukan dari server)
  const NOTIFS = [
    { id: 'n1', type: 'reply', user: 'andi_fin', text: 'membalas diskusimu tentang harga jual produk UMKM', mins: 20, unread: true },
    { id: 'n2', type: 'like', user: 'sinta_biz', text: 'menyukai diskusimu tentang modal usaha', mins: 55, unread: true },
    { id: 'n3', type: 'follow', user: 'toni_seo', text: 'mulai mengikuti kamu', mins: 130, unread: true },
    { id: 'n4', type: 'reply', user: 'maya_akun', text: 'membalas diskusimu tentang laporan arus kas', mins: 480, unread: false },
    { id: 'n5', type: 'like', user: 'hendra_b', text: 'menyukai diskusimu tentang karyawan pertama', mins: 900, unread: false },
    { id: 'n6', type: 'follow', user: 'putu_craft', text: 'mulai mengikuti kamu', mins: 2200, unread: false }
  ];
  const NOTIF_ICON = { reply: 'fa-regular fa-comment', like: 'fa-solid fa-heart', follow: 'fa-solid fa-user-plus' };

  const DMS = [
    { id: 'd1', user: 'dewi_kuliner', unread: true, messages: [
      { from: 'them', text: 'Halo, boleh tanya soal harga jual produkmu?', mins: 90 },
      { from: 'me', text: 'Boleh banget, coba ceritakan dulu produknya apa', mins: 85 },
      { from: 'them', text: 'Terima kasih infonya kemarin, sangat membantu!', mins: 14 }
    ]},
    { id: 'd2', user: 'andi_fin', unread: true, messages: [
      { from: 'them', text: 'Rekomendasi format laporan arus kasnya sudah dicoba?', mins: 200 },
      { from: 'me', text: 'Sudah, cukup jelas. Makasih ya', mins: 190 }
    ]},
    { id: 'd3', user: 'toni_seo', unread: false, messages: [
      { from: 'them', text: 'Mau diskusi soal SEO buat tokomu?', mins: 1500 },
      { from: 'me', text: 'Boleh, kapan waktu yang pas?', mins: 1490 },
      { from: 'them', text: 'Besok siang gimana?', mins: 1480 }
    ]},
    { id: 'd4', user: 'putu_craft', unread: false, messages: [
      { from: 'them', text: 'Kerajinanmu sudah pernah dikirim ke luar negeri?', mins: 4000 }
    ]}
  ];

  const el = {
    cats: $('#cats'), list: $('#list'), more: $('#more'),
    sorts: $('#sorts'), trending: $('#trending'), wtf: $('#wtf'), empty: $('#empty'),
    tagbar: $('#tagbar'), tagbarVal: $('#tagbar-val'), tagbarClear: $('#tagbar-clear'),
    modal: $('#modal'), form: $('#form'), err: $('#err'), fcat: $('#f-cat'),
    fimg: $('#f-img'), fimgprev: $('#f-imgprev'), fimgprevImg: $('#f-imgprev-img'), fimgprevClear: $('#f-imgprev-clear'),
    toast: $('#toast'), aiInput: $('#ai-input'), aiSend: $('#ai-send'),
    exploreInput: $('#explore-input'), exploreTrend: $('#explore-trend'), exploreResults: $('#explore-results'), exploreHeading: $('#explore-heading'),
    notifList: $('#notif-list'), notifReadAll: $('#notif-read-all'),
    msgList: $('#msg-list'), msgChat: $('#msg-chat')
  };

  let all = [];
  let liked = new Set();
  let followed = new Set();
  let newImage = null;              // gambar terlampir di modal Buat Diskusi
  const replyDraftImg = {};         // gambar terlampir per form balasan: { threadId: dataURL }
  const st = { cat: 'Semua', sort: 'terbaru', tag: null, shown: PAGE };

  const store = {
    get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (_) { return d; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} }
  };

  // Cegah XSS dari teks yang diketik pengguna
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'rb' : n);

  let toastTimer;
  function toast(msg) {
    clearTimeout(toastTimer);
    el.toast.textContent = msg;
    el.toast.hidden = false;
    toastTimer = setTimeout(() => { el.toast.hidden = true; }, 2200);
  }

  function ago(t) {
    const m = Math.floor((Date.now() - t) / 6e4);
    if (m < 1) return 'Baru saja';
    if (m < 60) return m + ' menit lalu';
    const h = Math.floor(m / 60);
    if (h < 24) return h + ' jam lalu';
    const d = Math.floor(h / 24);
    return d < 30 ? d + ' hari lalu' : Math.floor(d / 30) + ' bulan lalu';
  }

  // Perkecil gambar sebelum disimpan (aman untuk localStorage)
  function compressImage(file, maxW = 640, quality = .82) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('read fail')); };
      img.src = url;
    });
  }

  // Filter kategori + hashtag + sort
  function view() {
    let r = all.filter((t) =>
      (st.cat === 'Semua' || t.cat === st.cat) &&
      (!st.tag || t.tags.some((g) => g.toLowerCase() === st.tag.toLowerCase())));
    const score = (t) => t.views + t.replies.length * 5;
    r.sort(st.sort === 'populer' ? (a, b) => score(b) - score(a) : (a, b) => b.at - a.at);
    return r;
  }

  function replyRow(r) {
    return `<div class="reply">
      <div class="av">${esc(r.user[0]).toUpperCase()}</div>
      <div class="rb">
        <span><b>@${esc(r.user)}</b><time>${ago(Date.now() - r.mins * 6e4)}</time></span>
        <p>${esc(r.text)}</p>
        ${r.image ? `<img src="${r.image}" alt="Lampiran balasan">` : ''}
      </div>
    </div>`;
  }

  function composerRow(cid) {
    const img = replyDraftImg[cid];
    return `<div class="composer2">
      <div class="av"><i class="fa-solid fa-user"></i></div>
      <div class="c2b">
        <div class="c2row">
          <input class="uname" data-r-user="${cid}" maxlength="24" placeholder="Username">
          <textarea data-r-text="${cid}" rows="1" maxlength="240" placeholder="Tulis balasan..."></textarea>
        </div>
        <div class="c2act">
          <label class="imgbtn"><i class="fa-regular fa-image"></i> Gambar<input type="file" accept="image/*" data-r-img="${cid}"></label>
          ${img ? `<div class="c2thumb"><img src="${img}"><button type="button" data-r-imgclear="${cid}">✕</button></div>` : ''}
          <button type="button" class="btn" data-send="${cid}">Kirim</button>
        </div>
      </div>
    </div>`;
  }

  // ctx membedakan render Beranda ("home") vs Telusuri ("explore") agar id elemen tidak bentrok
  // saat diskusi yang sama tampil di kedua tempat sekaligus.
  function card(t, ctx = 'home') {
    const cid = ctx + '__' + t.id;
    const on = liked.has(t.id);
    const rs = t.replies;
    const names = rs.slice(0, 2).map((r) => '@' + esc(r.user)).join(', ');
    const extra = rs.length - 2;
    return `
    <article class="post" data-id="${t.id}">
      <div class="prow">
        <div class="av">${esc(t.user[0]).toUpperCase()}</div>
        <div class="pb">
          <div class="ph">
            <b>@${esc(t.user)}</b>
            <span class="tag">${esc(t.cat)}</span>
            <time>${ago(t.at)}</time>
          </div>
          <p class="tweet-text">${esc(t.text)}</p>
          ${t.image ? `<img class="post-img" src="${t.image}" alt="Lampiran diskusi">` : ''}
          ${t.tags.length ? `<div class="tags">${t.tags.map((g) => `<button data-tag="${esc(g)}">#${esc(g)}</button>`).join('')}</div>` : ''}
          <div class="act">
            <button class="cbtn" data-toggle="${cid}" aria-expanded="false" aria-controls="rp-${cid}">
              <i class="fa-regular fa-comment"></i><span data-count="${cid}">${rs.length}</span>
            </button>
            <span title="Dilihat"><i class="fa-regular fa-eye"></i>${fmt(t.views)}</span>
            <button class="share" data-share="${t.id}" title="Bagikan"><i class="fa-solid fa-arrow-up-from-bracket"></i></button>
            <button class="like${on ? ' on' : ''}" data-like="${t.id}" aria-pressed="${on}" aria-label="Suka"><i class="fa-${on ? 'solid' : 'regular'} fa-heart"></i> <em>${t.likes + (on ? 1 : 0)}</em></button>
            <div class="morewrap flex-sp">
              <button class="more-menu-btn" data-more="${cid}" aria-haspopup="true" aria-expanded="false" title="Lainnya"><i class="fa-solid fa-ellipsis"></i></button>
              <div class="menu" id="menu-${cid}" hidden>
                <button data-share="${t.id}"><i class="fa-regular fa-link"></i> Salin tautan</button>
                <button data-report="${t.id}"><i class="fa-regular fa-flag"></i> Laporkan</button>
              </div>
            </div>
          </div>
          ${rs.length ? `<p class="repliers">Dibalas oleh ${names}${extra > 0 ? ` dan ${extra} lainnya` : ''}</p>` : ''}
          <div class="replybox" id="rp-${cid}" hidden>
            <div class="replylist" id="rl-${cid}">${rs.map(replyRow).join('')}</div>
            ${composerRow(cid)}
          </div>
        </div>
      </div>
    </article>`;
  }

  function render() {
    el.cats.innerHTML = ['Semua', ...CATS].map((c) => {
      const n = c === 'Semua' ? all.length : all.filter((t) => t.cat === c).length;
      return `<button class="chip${c === st.cat ? ' on' : ''}" data-cat="${c}" role="tab" aria-selected="${c === st.cat}">${c}<span>${n}</span></button>`;
    }).join('');

    el.tagbar.hidden = !st.tag;
    if (st.tag) el.tagbarVal.textContent = '#' + st.tag;

    const r = view();
    el.list.innerHTML = r.slice(0, st.shown).map((t) => card(t, 'home')).join('');
    el.empty.hidden = r.length > 0;
    el.more.hidden = r.length <= st.shown;
    el.sorts.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.sort === st.sort));

    el.trending.innerHTML = trending().map((o, i) =>
      `<li><button data-tag="${esc(o.g)}"><small>Peringkat ${i + 1}</small><b>#${esc(o.g)}</b><small>${o.n} diskusi, ${fmt(o.v)} views</small></button></li>`).join('');
  }

  function renderWtf() {
    el.wtf.innerHTML = SUGGESTIONS.map((s) => {
      const on = followed.has(s.user);
      return `<li>
        <div class="av">${esc(s.user[0]).toUpperCase()}</div>
        <div class="wb"><b>@${esc(s.user)}</b><small>${esc(s.bio)}</small></div>
        <button class="follow${on ? ' on' : ''}" data-follow="${esc(s.user)}">${on ? 'Mengikuti' : 'Ikuti'}</button>
      </li>`;
    }).join('');
  }

  function trending() {
    const m = {};
    all.forEach((t) => t.tags.forEach((g) => {
      const k = g.toLowerCase();
      const o = m[k] || (m[k] = { g, n: 0, v: 0 });
      o.n++; o.v += t.views;
    }));
    return Object.values(m).sort((a, b) => b.n - a.n || b.v - a.v).slice(0, 6);
  }

  const update = (patch) => { Object.assign(st, patch, { shown: PAGE }); render(); };
  const setTag = (g) => { update({ cat: 'Semua', tag: g.replace(/^#/, '') }); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  function copyLink(id) {
    const url = location.href.split('#')[0] + '#' + id;
    navigator.clipboard?.writeText(url).then(() => toast('Tautan disalin'), () => toast('Tidak bisa menyalin tautan'));
  }

  /* ---------- Modal Buat Diskusi ---------- */
  function openModal() { el.modal.hidden = false; el.err.hidden = true; $('#f-user').focus(); }
  function closeModal() {
    el.modal.hidden = true;
    el.form.reset();
    newImage = null;
    el.fimgprev.hidden = true;
  }

  el.fimg.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    newImage = await compressImage(file).catch(() => null);
    if (newImage) { el.fimgprevImg.src = newImage; el.fimgprev.hidden = false; }
  });
  el.fimgprevClear.addEventListener('click', () => { newImage = null; el.fimgprev.hidden = true; el.fimg.value = ''; });

  el.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = $('#f-user').value.trim().replace(/^@/, '');
    const text = $('#f-text').value.trim();
    const tags = [...new Set($('#f-tags').value.split(/[\s,]+/)
      .map((g) => g.replace(/^#/, '').replace(/[^\p{L}\p{N}_]/gu, '')).filter(Boolean))].slice(0, 3);
    const msg = !user ? 'Username wajib diisi.' : text.length < 10 ? 'Tulis minimal 10 karakter agar mudah dipahami.' : '';
    if (msg) { el.err.textContent = msg; el.err.hidden = false; return; }

    const t = { id: 'u' + Date.now(), user, cat: el.fcat.value, text, tags, image: newImage, views: 0, likes: 0, answered: false, at: Date.now(), replies: [] };
    store.set(KEY, [t, ...store.get(KEY, [])]);
    all.unshift(t);
    update({ cat: 'Semua', sort: 'terbaru', tag: null });
    closeModal();
    el.list.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- Balasan & like (update langsung tanpa render ulang semua) ---------- */
  function sendReply(cid) {
    const uEl = $(`[data-r-user="${cid}"]`), tEl = $(`[data-r-text="${cid}"]`);
    const user = uEl.value.trim().replace(/^@/, '');
    const text = tEl.value.trim();
    if (!user || text.length < 3) { tEl.focus(); return; }
    const id = cid.split('__').pop(); // id diskusi asli tanpa awalan konteks (home/explore)
    const r = { user, text, mins: 0, image: replyDraftImg[cid] || null };

    const t = all.find((x) => x.id === id);
    t.replies.push(r);
    const persisted = store.get(REPLY_KEY, {});
    persisted[id] = [...(persisted[id] || []), r];
    store.set(REPLY_KEY, persisted);

    // Diskusi yang sama bisa tampil di Beranda maupun Telusuri sekaligus — sinkronkan keduanya
    ['home', 'explore'].forEach((ctx) => {
      $(`#rl-${ctx}__${id}`)?.insertAdjacentHTML('beforeend', replyRow(r));
      const countEl = $(`[data-count="${ctx}__${id}"]`);
      if (countEl) countEl.textContent = t.replies.length;
    });
    delete replyDraftImg[cid];
    const comp = $(`#rp-${cid} .composer2`);
    if (comp) comp.outerHTML = composerRow(cid);
  }

  function closeAllMenus(except) {
    document.querySelectorAll('.menu').forEach((m) => {
      if (m !== except) { m.hidden = true; m.previousElementSibling?.setAttribute('aria-expanded', 'false'); }
    });
  }

  el.list.addEventListener('click', onPostClick);
  el.exploreResults.addEventListener('click', onPostClick);
  function onPostClick(e) {
    const tg = e.target.closest('[data-tag]');
    if (tg) {
      if (e.currentTarget === el.exploreResults) { el.exploreInput.value = '#' + tg.dataset.tag; exploreResults('#' + tg.dataset.tag); }
      else setTag(tg.dataset.tag);
      return;
    }

    const toggle = e.target.closest('[data-toggle]');
    if (toggle) {
      const panel = $(`#rp-${toggle.dataset.toggle}`);
      const open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) panel.querySelector('textarea')?.focus({ preventScroll: true });
      return;
    }

    const likeBtn = e.target.closest('[data-like]');
    if (likeBtn) {
      const id = likeBtn.dataset.like;
      const t = all.find((x) => x.id === id);
      liked.has(id) ? liked.delete(id) : liked.add(id);
      store.set(LIKE_KEY, [...liked]);
      const on = liked.has(id);
      document.querySelectorAll(`[data-like="${id}"]`).forEach((b) => {
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', String(on));
        b.querySelector('i').className = `fa-${on ? 'solid' : 'regular'} fa-heart`;
        b.querySelector('em').textContent = t.likes + (on ? 1 : 0);
      });
      return;
    }

    const shareBtn = e.target.closest('[data-share]');
    if (shareBtn) { closeAllMenus(); return copyLink(shareBtn.dataset.share); }

    const reportBtn = e.target.closest('[data-report]');
    if (reportBtn) { closeAllMenus(); return toast('Laporan terkirim, tim kami akan meninjau'); }

    const moreBtn = e.target.closest('[data-more]');
    if (moreBtn) {
      const menu = $(`#menu-${moreBtn.dataset.more}`);
      const willOpen = menu.hidden;
      closeAllMenus();
      if (willOpen) {
        const r = moreBtn.getBoundingClientRect();
        menu.style.top = Math.round(r.bottom + 6) + 'px';
        menu.style.right = Math.round(window.innerWidth - r.right) + 'px';
      }
      menu.hidden = !willOpen;
      moreBtn.setAttribute('aria-expanded', String(willOpen));
      return;
    }
    closeAllMenus();

    const clearImg = e.target.closest('[data-r-imgclear]');
    if (clearImg) {
      const id = clearImg.dataset.rImgclear;
      delete replyDraftImg[id];
      $(`#rp-${id} .composer2`).outerHTML = composerRow(id);
      return;
    }

    const send = e.target.closest('[data-send]');
    if (send) return sendReply(send.dataset.send);
  }

  el.list.addEventListener('change', onPostChange);
  el.exploreResults.addEventListener('change', onPostChange);
  async function onPostChange(e) {
    const pick = e.target.closest('[data-r-img]');
    if (!pick || !pick.files[0]) return;
    const id = pick.dataset.rImg;
    const dataUrl = await compressImage(pick.files[0]).catch(() => null);
    if (dataUrl) { replyDraftImg[id] = dataUrl; $(`#rp-${id} .composer2`).outerHTML = composerRow(id); }
  }

  document.addEventListener('click', (e) => { if (!e.target.closest('.morewrap')) closeAllMenus(); });
  window.addEventListener('scroll', () => closeAllMenus(), { passive: true });

  /* ---------- Who to Follow ---------- */
  el.wtf.addEventListener('click', (e) => {
    const b = e.target.closest('[data-follow]');
    if (!b) return;
    const u = b.dataset.follow;
    followed.has(u) ? followed.delete(u) : followed.add(u);
    store.set(FOLLOW_KEY, [...followed]);
    renderWtf();
  });

  /* ---------- Telusuri ---------- */
  function exploreResults(q) {
    const term = q.trim().toLowerCase();
    el.exploreHeading.textContent = term ? `Hasil untuk "${q.trim()}"` : 'Diskusi untuk kamu';
    const r = !term ? [...all].sort((a, b) => b.views - a.views).slice(0, 8)
      : all.filter((t) => (t.user + ' ' + t.cat + ' ' + t.text + ' ' + t.tags.map((g) => '#' + g).join(' ')).toLowerCase().includes(term));
    el.exploreResults.innerHTML = r.length ? r.map((t) => card(t, 'explore')).join('')
      : `<div class="state"><i class="fa-regular fa-face-frown"></i><h3>Tidak ditemukan</h3><p>Coba kata kunci lain, atau cari #hashtag yang sedang tren.</p></div>`;
  }
  function renderExploreTrend() {
    el.exploreTrend.innerHTML = trending().map((o) =>
      `<button class="chip" data-tag="${esc(o.g)}">#${esc(o.g)}<span>${o.n}</span></button>`).join('');
  }
  el.exploreInput.addEventListener('input', (e) => exploreResults(e.target.value));
  el.exploreTrend.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tag]');
    if (!b) return;
    el.exploreInput.value = '#' + b.dataset.tag;
    exploreResults('#' + b.dataset.tag);
  });

  /* ---------- Notifikasi ---------- */
  function renderNotifs() {
    el.notifList.innerHTML = NOTIFS.map((n) => `
      <li class="notif-item${n.unread ? ' unread' : ''}" data-id="${n.id}">
        <div class="notif-ic ${n.type}"><i class="${NOTIF_ICON[n.type]}"></i></div>
        <div class="notif-b"><p><b>@${esc(n.user)}</b> ${esc(n.text)}</p><time>${ago(Date.now() - n.mins * 6e4)}</time></div>
      </li>`).join('');
    updateBadges();
  }
  function updateBadges() {
    const unreadN = NOTIFS.some((n) => n.unread), unreadM = DMS.some((d) => d.unread);
    ['ln-notif-dot', 'bn-notif-dot'].forEach((id) => { $(`#${id}`).hidden = !unreadN; });
    ['ln-msg-dot', 'bn-msg-dot'].forEach((id) => { $(`#${id}`).hidden = !unreadM; });
  }
  el.notifList.addEventListener('click', (e) => {
    const li = e.target.closest('.notif-item');
    if (!li) return;
    const n = NOTIFS.find((x) => x.id === li.dataset.id);
    if (n) { n.unread = false; li.classList.remove('unread'); updateBadges(); }
  });
  el.notifReadAll.addEventListener('click', () => { NOTIFS.forEach((n) => (n.unread = false)); renderNotifs(); });

  /* ---------- Pesan ---------- */
  function renderMsgList() {
    el.msgList.innerHTML = DMS.map((d) => {
      const last = d.messages[d.messages.length - 1];
      return `<li>
        <button class="msg-item${d.unread ? ' unread' : ''}" data-id="${d.id}">
          <div class="av">${esc(d.user[0]).toUpperCase()}</div>
          <div class="msg-b">
            <div class="row1"><b>@${esc(d.user)}</b><time>${ago(Date.now() - last.mins * 6e4)}</time></div>
            <p>${last.from === 'me' ? 'Kamu: ' : ''}${esc(last.text)}</p>
          </div>
          ${d.unread ? '<span class="dot"></span>' : ''}
        </button>
      </li>`;
    }).join('');
  }
  function openChat(id) {
    const d = DMS.find((x) => x.id === id);
    if (!d) return;
    d.unread = false;
    el.msgChat.innerHTML = `
      <div class="msg-chat-head">
        <button class="msg-back" id="msg-back" aria-label="Kembali"><i class="fa-solid fa-arrow-left"></i></button>
        <div class="av">${esc(d.user[0]).toUpperCase()}</div>
        <b>@${esc(d.user)}</b>
      </div>
      <div class="msg-thread">${d.messages.map((m) => `<div class="bubble ${m.from}"><p>${esc(m.text)}</p><time>${ago(Date.now() - m.mins * 6e4)}</time></div>`).join('')}</div>
      <div class="msg-compose"><input placeholder="Kirim pesan belum tersedia" disabled><button id="msg-send-soon" aria-label="Kirim"><i class="fa-solid fa-paper-plane"></i></button></div>`;
    renderMsgList();
    el.msgList.querySelector(`[data-id="${id}"]`)?.classList.add('active');
    $('#msg-back').addEventListener('click', () => $('.msgview').classList.remove('chat-open'));
    $('#msg-send-soon').addEventListener('click', () => toast('Kirim pesan di Forum segera hadir'));
    $('.msgview').classList.add('chat-open');
    updateBadges();
  }
  el.msgList.addEventListener('click', (e) => {
    const b = e.target.closest('[data-id]');
    if (b) openChat(b.dataset.id);
  });

  /* ---------- Kemba AI: tampilan saja ---------- */
  function aiComingSoon() { if (el.aiInput.value.trim()) toast('Kemba AI di Forum segera hadir'); }
  el.aiSend.addEventListener('click', aiComingSoon);
  el.aiInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); aiComingSoon(); } });

  /* ---------- Navigasi 1 halaman: Beranda / Telusuri / Notifikasi / Pesan ---------- */
  const VIEWS = ['home', 'explore', 'notifications', 'messages'];
  function switchView(view) {
    if (!VIEWS.includes(view)) return;
    VIEWS.forEach((v) => { $(`#view-${v}`).hidden = v !== view; });
    document.querySelectorAll('[data-view]').forEach((a) => a.classList.toggle('active', a.dataset.view === view));
    if (view === 'explore') { renderExploreTrend(); exploreResults(el.exploreInput.value); }
    if (view === 'notifications') renderNotifs();
    if (view === 'messages') renderMsgList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.querySelectorAll('[data-view]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    switchView(a.dataset.view);
  }));

  /* ---------- Kontrol umum ---------- */
  el.cats.addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (b) update({ cat: b.dataset.cat }); });
  el.sorts.addEventListener('click', (e) => { const b = e.target.closest('[data-sort]'); if (b) update({ sort: b.dataset.sort }); });
  el.more.addEventListener('click', () => { st.shown += PAGE; render(); });
  el.trending.addEventListener('click', (e) => { const b = e.target.closest('[data-tag]'); if (b) setTag(b.dataset.tag); });
  el.tagbarClear.addEventListener('click', () => update({ tag: null }));
  $('#reset').addEventListener('click', () => update({ cat: 'Semua', sort: 'terbaru', tag: null }));
  document.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', openModal));
  document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !el.modal.hidden) closeModal(); });

  async function init() {
    let failed = false;
    el.fcat.innerHTML = CATS.map((c) => `<option>${c}</option>`).join('');
    liked = new Set(store.get(LIKE_KEY, []));
    followed = new Set(store.get(FOLLOW_KEY, []));
    renderWtf();
    updateBadges();
    try {
      const res = await fetch('../database/forum.json');
      if (!res.ok) throw new Error(res.status);
      const rows = await res.json();
      const persisted = store.get(REPLY_KEY, {});
      all = rows.map((t) => ({ ...t, at: Date.now() - t.mins * 6e4, replies: [...(t.replies || []), ...(persisted[t.id] || [])] }));
    } catch (_) { failed = true; }
    all.unshift(...store.get(KEY, []).map((t) => ({ ...t, replies: t.replies || [] })));
    render();
    if (failed && !all.length) {
      el.empty.hidden = true;
      el.list.innerHTML = '<div class="state"><h3>Diskusi belum bisa dimuat</h3><p>Buka halaman lewat server lokal (mis. Live Server) agar database/forum.json terbaca.</p></div>';
    }
  }
  init();
})();