function animateCount(element, target, duration = 700, suffix = '') {
    if (!element) return;
    const end = Number(target) || 0;
    const start = Number(element.textContent.replace(/[^\d.-]/g, '')) || 0;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        element.textContent = end.toLocaleString('id-ID') + suffix;
        return;
    }

    const startedAt = performance.now();
    function frame(now) {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(start + (end - start) * eased).toLocaleString('id-ID') + suffix;
        if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

function initScrollReveal(selector) {
    const elements = document.querySelectorAll(selector);
    if (!('IntersectionObserver' in window)) {
        elements.forEach(element => element.classList.add('in-view'));
        return;
    }
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    elements.forEach(element => observer.observe(element));
}

function showToast(message, icon = 'fa-solid fa-circle-check') {
    let toast = document.getElementById('dashboardToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'dashboardToast';
        toast.className = 'dashboard-toast';
        toast.setAttribute('role', 'status');
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="${icon}"></i><span>${escapeHtml(message)}</span>`;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* ================= SIDEBAR NAVIGATION ================= */
const sidebarBtns = document.querySelectorAll('.sidebar-btn');
const panels = document.querySelectorAll('.panel');

sidebarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sidebarBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById('panel-' + btn.dataset.target);
        target.classList.add('active');
        target.querySelectorAll('.reveal').forEach(el => el.classList.remove('in-view'));
        setTimeout(() => initScrollReveal('#' + target.id + ' .reveal'), 20);
    });
});

/* ================= BERANDA: statistik penggunaan (dummy) ================= */
// DATA DUMMY PROTOTYPE — nantinya dapat diganti dengan data akun/backend.
const usageStats = {
    artikel: 18,
    ebook: 4,
    forum: 9,
    event: 2,
    course: 2,
    streak: 6,
    like: 27
};

function renderStats() {
    animateCount(document.getElementById('statArtikel'), usageStats.artikel);
    animateCount(document.getElementById('statEbook'), usageStats.ebook);
    animateCount(document.getElementById('statForum'), usageStats.forum);
    animateCount(document.getElementById('statEvent'), usageStats.event);
    animateCount(document.getElementById('statPakar'), getPakarData().length);
    animateCount(document.getElementById('statCourse'), usageStats.course);
    document.getElementById('statStreak').textContent = '0 hari';
    animateCount(document.getElementById('statStreak'), usageStats.streak, 900, ' hari');
    animateCount(document.getElementById('statLike'), usageStats.like);
}

/* chart aktivitas 7 hari (dummy) */
const chartData = [3, 5, 2, 6, 4, 8, 5];
const chartDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

(function renderChart() {
    const chartBars = document.getElementById('chartBars');
    const max = Math.max(...chartData);
    let total = 0;
    chartBars.innerHTML = '';
    chartData.forEach((val, i) => {
        total += val;
        const col = document.createElement('div');
        col.className = 'chart-col';
        col.innerHTML = `<div class="bar" style="height:0%"></div><span>${chartDays[i]}</span>`;
        chartBars.appendChild(col);
        const barEl = col.querySelector('.bar');
        setTimeout(() => { barEl.style.height = (val / max) * 100 + '%'; }, 120 + i * 90);
    });
    document.getElementById('chartTotal').textContent = total + ' aktivitas';
})();

/* aktivitas terbaru (dummy) */
const recentActivity = [
    { icon: 'fa-solid fa-book', text: 'Membaca artikel <b>Strategi Membangun Bisnis di Era Digital</b>', waktu: '3 jam lalu' },
    { icon: 'fa-solid fa-comments', text: 'Mengikuti diskusi forum <b>Strategi Pemasaran UMKM</b>', waktu: '1 hari lalu' },
    { icon: 'fa-solid fa-user-tie', text: 'Mulai mengikuti pakar <b>Andi Pratama, S.E.</b>', waktu: '2 hari lalu' },
    { icon: 'fa-regular fa-heart', text: 'Menyukai sebuah unggahan di Komunitas', waktu: '3 hari lalu' },
    { icon: 'fa-solid fa-calendar-check', text: 'Membeli tiket event <b>Workshop Digital Marketing UMKM</b>', waktu: '5 hari lalu' }
];

(function renderActivity() {
    const list = document.getElementById('activityList');
    list.innerHTML = '';
    recentActivity.forEach(a => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="${a.icon}"></i><div><span>${a.text}</span><small>${a.waktu}</small></div>`;
        list.appendChild(li);
    });
})();

/* ================= AMBIL DATA ASLI DARI FILE JSON ================= */
/* Pakar, artikel, dan e-book sekarang diambil dari database yang sama
   dengan halaman Konsultasi, Artikel, dan Perpustakaan (bukan data karangan lagi). */

async function fetchJSON(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Gagal memuat ' + url);
        return await res.json();
    } catch (err) {
        console.error(err);
        return [];
    }
}

/* ID yang dianggap "diikuti/disimpan" oleh pengguna contoh ini */
const DEFAULT_PAKAR_IDS = [1, 2, 3];
const DEFAULT_BUKU_IDS = [18, 43, 5];
const ARTICLE_BOOKMARK_KEY = 'kembangin:bookmarks';

function getSavedIds(key, defaultIds) {
    try {
        const saved = localStorage.getItem(key);
        const parsed = saved ? JSON.parse(saved) : defaultIds;
        return Array.isArray(parsed) ? parsed : defaultIds;
    } catch (err) {
        console.warn('Data simpanan tidak dapat dibaca:', key, err);
        return defaultIds;
    }
}

function getSavedArticleIds() {
    const saved = localStorage.getItem(ARTICLE_BOOKMARK_KEY);
    if (saved !== null) return getSavedIds(ARTICLE_BOOKMARK_KEY, []);

    const legacy = localStorage.getItem('kembangin_artikel_ids');
    const ids = legacy !== null
        ? getSavedIds('kembangin_artikel_ids', [])
        : allArtikelData.filter(a => a.status === 'public').slice(0, 3).map(a => a.id);
    localStorage.setItem(ARTICLE_BOOKMARK_KEY, JSON.stringify(ids));
    return ids;
}

let allPakarData = [];
let allArtikelData = [];
let allBukuData = [];

function getPakarData() {
    const ids = getSavedIds('kembangin_pakar_ids', DEFAULT_PAKAR_IDS);
    return allPakarData.filter(p => ids.includes(p.id));
}

function renderPakar() {
    const data = getPakarData();
    const pakarList = document.getElementById('pakarList');
    pakarList.innerHTML = '';

    if (data.length === 0) {
        pakarList.innerHTML = '<p style="color:var(--text-400);font-size:.85rem;">Belum ada pakar yang diikuti</p>';
        return;
    }

    data.forEach((p) => {
        const card = document.createElement('div');
        card.className = 'pakar-card reveal';
        card.innerHTML = `
            <div class="pakar-avatar">${p.nama.charAt(0)}</div>
            <div class="pakar-info"><h4>${p.nama}</h4><span>${p.spesialisasi[0]}</span></div>
            <button data-id="${p.id}">Berhenti Mengikuti</button>
        `;
        pakarList.appendChild(card);
    });

    pakarList.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id);
            const nama = allPakarData.find(p => p.id === id).nama;
            const ids = getSavedIds('kembangin_pakar_ids', DEFAULT_PAKAR_IDS).filter(x => x !== id);
            localStorage.setItem('kembangin_pakar_ids', JSON.stringify(ids));
            renderPakar();
            renderStats();
            showToast(`Berhenti mengikuti ${nama}`, 'fa-solid fa-user-xmark');
        });
    });
    initScrollReveal('#panel-pakar .reveal');
}

function renderSavedArticles() {
    const ids = getSavedArticleIds();
    const data = allArtikelData.filter(a => ids.includes(a.id));
    const list = document.getElementById('savedArticleList');
    list.innerHTML = '';

    if (data.length === 0) {
        list.innerHTML = '<p style="color:var(--text-400);font-size:.85rem;">Belum ada artikel yang disimpan</p>';
        return;
    }

    data.forEach(a => {
        const card = document.createElement('div');
        card.className = 'saved-card reveal';
        const detailUrl = `article-detail.html?slug=${encodeURIComponent(a.slug)}`;
        const author = a.author && a.author.name ? a.author.name : 'Penulis Kembangin';
        card.innerHTML = `
            <a href="${detailUrl}" aria-label="Baca ${escapeHtml(a.title)}"><img src="${escapeHtml(a.image || '../assets/artike-img.jpg')}" alt="" onerror="this.onerror=null;this.src='../assets/artike-img.jpg'"></a>
            <div class="saved-card-body">
                <div class="save-icon"><i class="fa-solid fa-bookmark"></i></div>
                <span class="mini-tag">${escapeHtml(a.category || 'Artikel')}</span>
                <h4><a href="${detailUrl}">${escapeHtml(a.title)}</a></h4>
                <div class="meta">
                    <span><i class="fa-solid fa-feather-pointed"></i> ${escapeHtml(author)}</span>
                    <span><i class="fa-regular fa-eye"></i> ${Number(a.views || 0).toLocaleString('id-ID')}</span>
                    <span><i class="fa-regular fa-heart"></i> ${Number(a.likes || 0).toLocaleString('id-ID')}</span>
                </div>
                <button type="button" class="saved-remove-btn" data-id="${a.id}"><i class="fa-solid fa-bookmark"></i> Hapus dari simpanan</button>
            </div>
        `;
        list.appendChild(card);
    });
    list.querySelectorAll('.saved-remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id);
            const remaining = getSavedArticleIds().filter(savedId => savedId !== id);
            localStorage.setItem(ARTICLE_BOOKMARK_KEY, JSON.stringify(remaining));
            renderSavedArticles();
            showToast('Artikel dihapus dari simpanan', 'fa-solid fa-bookmark');
        });
    });
    initScrollReveal('#panel-savedArticle .reveal');
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
}

function renderSavedBooks() {
    const ids = getSavedIds('kembangin_buku_ids', DEFAULT_BUKU_IDS);
    const data = allBukuData.filter(b => ids.includes(b.id));
    const list = document.getElementById('savedBookList');
    list.innerHTML = '';

    if (data.length === 0) {
        list.innerHTML = '<p style="color:var(--text-400);font-size:.85rem;">Belum ada e-book yang disimpan</p>';
        return;
    }

    data.forEach(b => {
        const card = document.createElement('div');
        card.className = 'saved-card reveal';
        card.innerHTML = `
            <img src="../assets/book-asset.jpg" alt="">
            <div class="saved-card-body">
                <div class="save-icon"><i class="fa-solid fa-bookmark"></i></div>
                <span class="mini-tag">${b.category}</span>
                <h4>${b.title}</h4>
                <div class="meta">
                    <span><i class="fa-solid fa-feather-pointed"></i> ${b.author}</span>
                    <span><i class="fa-solid fa-star"></i> ${b.rating}</span>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
    initScrollReveal('#panel-savedBook .reveal');
}


/* ================= EVENT YANG SUDAH DIBELI (dummy) ================= */
// DATA DUMMY PROTOTYPE — contoh event yang pernah diikuti pengguna.
const boughtEvents = [
    { nama: 'Workshop Digital Marketing UMKM', tanggal: '28 September 2026', lokasi: 'Online via Zoom', img: '../assets/thum-event-1.jpg' },
    { nama: 'Seminar Literasi Keuangan Usaha', tanggal: '3 Oktober 2026', lokasi: 'Denpasar', img: '../assets/thum-event-2.jpg' }
];

(function renderEvents() {
    const list = document.getElementById('eventList');
    list.innerHTML = '';
    boughtEvents.forEach(ev => {
        const card = document.createElement('div');
        card.className = 'saved-card reveal';
        card.innerHTML = `
            <img src="${ev.img}" alt="">
            <div class="saved-card-body">
                <h4>${ev.nama}</h4>
                <div class="meta">
                    <span><i class="fa-regular fa-calendar"></i> ${ev.tanggal}</span>
                    <span><i class="fa-solid fa-location-dot"></i> ${ev.lokasi}</span>
                </div>
                <span class="event-status">Sudah Dibeli</span>
            </div>
        `;
        list.appendChild(card);
    });
})();

/* ================= ARTIKEL SAYA (dummy CRUD di localStorage) ================= */
const seedMyArticles = [
    { id: 1, title: 'Kenapa UMKM Wajib Melek Digital', kategori: 'Bisnis Digital', status: 'publish', views: 340, img: '../assets/artike-img.jpg', isi: '' },
    { id: 2, title: 'Draf: Ide Konten Promosi Bulan Ini', kategori: 'Pemasaran', status: 'draft', views: 0, img: '../assets/artike-img.jpg', isi: '' }
];

function getMyArticles() {
    const saved = localStorage.getItem('kembangin_my_articles');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('kembangin_my_articles', JSON.stringify(seedMyArticles));
    return seedMyArticles;
}
function saveMyArticles(arr) { localStorage.setItem('kembangin_my_articles', JSON.stringify(arr)); }

function renderMyArticles() {
    const data = getMyArticles();
    const list = document.getElementById('myArticleList');
    list.innerHTML = '';

    if (data.length === 0) {
        list.innerHTML = '<p style="color:var(--text-400);font-size:.85rem;">Belum ada artikel, yuk buat yang pertama!</p>';
        return;
    }

    data.forEach(a => {
        const row = document.createElement('div');
        row.className = 'my-article-row reveal';
        row.innerHTML = `
            <img src="${a.img}" alt="">
            <div class="info">
                <h4>${a.title}</h4>
                <div class="meta">
                    <span>${a.kategori}</span>
                    <span><i class="fa-regular fa-eye"></i> ${a.views} views</span>
                </div>
            </div>
            <span class="status-tag ${a.status}">Status: ${a.status === 'draft' ? 'Draf' : 'Diterbitkan'}</span>
            <button class="kelola-btn" data-id="${a.id}">Kelola Artikel</button>
        `;
        list.appendChild(row);
    });

    list.querySelectorAll('.kelola-btn').forEach(btn => {
        btn.addEventListener('click', () => openEditor(Number(btn.dataset.id)));
    });
    initScrollReveal('#panel-myArticle .reveal');
}

/* ================= EDITOR ARTIKEL ALA WORDPRESS (dummy, statis) ================= */
const editorOverlay = document.getElementById('editorOverlay');
const editorTitle = document.getElementById('editorTitle');
const editorJudul = document.getElementById('editorJudul');
const editorKategori = document.getElementById('editorKategori');
const editorIsi = document.getElementById('editorIsi');
let editingId = null;

function openEditor(id) {
    const data = getMyArticles();
    editingId = id;
    if (id) {
        const article = data.find(a => a.id === id);
        editorTitle.textContent = 'Kelola Artikel';
        editorJudul.value = article.title;
        editorKategori.value = article.kategori;
        editorIsi.value = article.isi;
    } else {
        editorTitle.textContent = 'Buat Artikel Baru';
        editorJudul.value = '';
        editorKategori.value = '';
        editorIsi.value = '';
    }
    editorOverlay.classList.add('show');
}
function closeEditor() { editorOverlay.classList.remove('show'); editingId = null; }

function submitArticle(status) {
    const data = getMyArticles();
    const judul = editorJudul.value.trim() || 'Artikel Tanpa Judul';
    const kategori = editorKategori.value.trim() || 'Umum';
    const isi = editorIsi.value.trim();

    if (editingId) {
        const article = data.find(a => a.id === editingId);
        article.title = judul; article.kategori = kategori; article.isi = isi; article.status = status;
    } else {
        data.unshift({ id: Date.now(), title: judul, kategori, status, views: 0, img: '../assets/artike-img.jpg', isi });
    }
    saveMyArticles(data);
    renderMyArticles();
    closeEditor();
    showToast(
        status === 'publish' ? 'Artikel berhasil diterbitkan!' : 'Artikel disimpan sebagai draf',
        status === 'publish' ? 'fa-solid fa-circle-check' : 'fa-solid fa-file-pen'
    );
}

document.getElementById('newArticleBtn').addEventListener('click', () => openEditor(null));
document.getElementById('closeEditorBtn').addEventListener('click', closeEditor);
editorOverlay.addEventListener('click', (e) => { if (e.target === editorOverlay) closeEditor(); });
document.getElementById('saveDraftBtn').addEventListener('click', () => submitArticle('draft'));
document.getElementById('publishBtn').addEventListener('click', () => submitArticle('publish'));

/* ================= INIT ================= */
async function initDashboardData() {
    const [pakar, artikel, buku] = await Promise.all([
        fetchJSON('../database/consultation.json'),
        fetchJSON('../database/artikel.json'),
        fetchJSON('../database/liblary.json')
    ]);
    allPakarData = pakar;
    allArtikelData = artikel;
    allBukuData = buku;

    renderPakar();
    renderSavedArticles();
    renderSavedBooks();
    renderStats();
}

renderStats();
initDashboardData();
renderMyArticles();
initScrollReveal('.reveal');
