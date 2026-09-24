/* ================= SIDEBAR NAVIGATION ================= */
const sidebarBtns = document.querySelectorAll('.sidebar-btn');
const panels = document.querySelectorAll('.panel');

sidebarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sidebarBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById('panel-' + btn.dataset.target).classList.add('active');
    });
});

/* ================= CHART RINGKASAN (dummy 7 hari) ================= */
const chartData = [420000, 650000, 300000, 780000, 500000, 910000, 660000];
const chartDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const chartBars = document.getElementById('chartBars');
const chartTotal = document.getElementById('chartTotal');

function formatRupiah(angka) {
    return 'Rp' + Math.round(angka).toLocaleString('id-ID');
}

(function renderChart() {
    const max = Math.max(...chartData);
    let total = 0;
    chartBars.innerHTML = '';
    chartData.forEach((val, i) => {
        total += val;
        const col = document.createElement('div');
        col.className = 'chart-col';
        col.innerHTML = `<div class="bar" style="height:${(val / max) * 100}%"></div><span>${chartDays[i]}</span>`;
        chartBars.appendChild(col);
    });
    chartTotal.textContent = formatRupiah(total);
})();

/* ================= TOOL 1: KALKULATOR KEUNTUNGAN + PRODUK TERLARIS ================= */
const seedProduk = [
    { nama: 'Kopi Susu Gula Aren', harga: 15000, modal: 8000, jumlah: 42 },
    { nama: 'Roti Bakar Coklat', harga: 12000, modal: 6000, jumlah: 27 },
    { nama: 'Es Teh Jumbo', harga: 6000, modal: 2500, jumlah: 18 }
];

function getProdukData() {
    const saved = localStorage.getItem('kembangin_produk');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('kembangin_produk', JSON.stringify(seedProduk));
    return seedProduk;
}

function renderProduk() {
    const data = getProdukData();
    const sorted = [...data].sort((a, b) => b.jumlah - a.jumlah);
    const max = sorted.length ? sorted[0].jumlah : 0;
    const produkList = document.getElementById('produkList');

    produkList.innerHTML = '';
    sorted.forEach(p => {
        const persen = max > 0 ? (p.jumlah / max) * 100 : 0;
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="produk-top">
                <span>${p.nama}</span>
                <span>${p.jumlah} terjual</span>
            </div>
            <div class="bar-bg"><div class="bar-fill" style="width:${persen}%"></div></div>
        `;
        produkList.appendChild(li);
    });
}

document.getElementById('calcForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const nama = document.getElementById('namaProduk').value.trim();
    const harga = Number(document.getElementById('hargaJual').value);
    const modal = Number(document.getElementById('modalProduk').value);
    const jumlah = Number(document.getElementById('jumlahJual').value);
    if (!nama || jumlah <= 0) return;

    const data = getProdukData();
    const existing = data.find(p => p.nama.toLowerCase() === nama.toLowerCase());
    if (existing) {
        existing.jumlah += jumlah;
        existing.harga = harga;
        existing.modal = modal;
    } else {
        data.push({ nama, harga, modal, jumlah });
    }
    localStorage.setItem('kembangin_produk', JSON.stringify(data));

    const keuntungan = (harga - modal) * jumlah;
    document.getElementById('calcResult').textContent = `${nama}: keuntungan ${formatRupiah(keuntungan)}`;
    this.reset();
    renderProduk();
});

renderProduk();

/* ================= TOOL 3: KALKULATOR HARGA JUAL ================= */
document.getElementById('hargaForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const modal = Number(document.getElementById('modalHarga').value);
    const margin = Number(document.getElementById('marginTarget').value);
    if (modal <= 0 || margin <= 0 || margin >= 100) {
        document.getElementById('hargaResult').textContent = 'Margin harus antara 1-99%';
        return;
    }
    const hargaJual = modal / (1 - margin / 100);
    document.getElementById('hargaResult').textContent =
        `Harga jual yang disarankan: ${formatRupiah(hargaJual)} (untung ${formatRupiah(hargaJual - modal)}/pcs)`;
});

/* ================= TOOL 4: CEK KESEHATAN KEUANGAN ================= */
document.getElementById('cekBtn').addEventListener('click', function () {
    const checks = document.querySelectorAll('#tool-cek .cekInput');
    let score = 0;
    checks.forEach(c => { if (c.checked) score++; });

    let pesan = '';
    if (score <= 1) pesan = 'Perlu diperbaiki: coba mulai catat keuangan usaha secara rutin.';
    else if (score <= 3) pesan = 'Lumayan sehat, tapi masih ada yang bisa ditingkatkan.';
    else pesan = 'Keuangan usahamu sudah dikelola dengan baik!';

    document.getElementById('cekResult').textContent = `Skor: ${score}/4 - ${pesan}`;
});

/* buka/tutup tiap tool */
document.querySelectorAll('.tool-open-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('tool-' + btn.dataset.tool).classList.toggle('show');
    });
});

/* ================= PAKAR YANG DISUBSCRIBE (dummy) ================= */
const seedPakar = [
    { nama: 'Dr. Anita Pratiwi', bidang: 'Konsultan Keuangan UMKM' },
    { nama: 'Budi Santoso, M.M.', bidang: 'Strategi Pemasaran Digital' },
    { nama: 'Sarah Amelia', bidang: 'Manajemen Operasional Bisnis' }
];

function renderPakar() {
    const saved = localStorage.getItem('kembangin_pakar');
    const data = saved ? JSON.parse(saved) : seedPakar;
    const pakarList = document.getElementById('pakarList');

    pakarList.innerHTML = '';
    if (data.length === 0) {
        pakarList.innerHTML = '<p class="tool-result">Belum ada pakar yang disubscribe</p>';
        return;
    }

    data.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'pakar-card';
        card.innerHTML = `
            <div class="pakar-avatar">${p.nama.charAt(0)}</div>
            <div class="pakar-info">
                <h4>${p.nama}</h4>
                <span>${p.bidang}</span>
            </div>
            <button data-i="${i}">Unsubscribe</button>
        `;
        pakarList.appendChild(card);
    });

    pakarList.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const arr = data.filter((_, idx) => idx != btn.dataset.i);
            localStorage.setItem('kembangin_pakar', JSON.stringify(arr));
            renderPakar();
        });
    });
}
renderPakar();

/* ================= ARTIKEL & E-BOOK YANG DISAVE ================= */
/* dipakai persis dari data yang sudah ada beneran di article.html & liblary.json,
   bukan karangan sendiri -- sengaja cuma 1 item soalnya baru itu yang beneran dibuat */
const savedArticles = [
    { title: 'Strategi Membangun Bisnis di Era Digital', author: 'Alexander Morgan', views: 2140, likes: 27650, img: '../assets/artike-img.jpg', kategori: 'Bisnis' }
];

const savedBooks = [
    { title: 'The Lean Startup', author: 'Eric Ries', kategori: 'Startup', rating: 4.8, img: '../assets/book-asset.jpg' }
];

function renderSavedArticles() {
    const list = document.getElementById('savedArticleList');
    list.innerHTML = '';
    savedArticles.forEach(a => {
        const card = document.createElement('div');
        card.className = 'saved-card';
        card.innerHTML = `
            <img src="${a.img}" alt="">
            <div class="saved-card-body">
                <div class="save-icon"><i class="fa-solid fa-bookmark"></i></div>
                <span class="mini-tag">${a.kategori}</span>
                <h4>${a.title}</h4>
                <div class="meta">
                    <span><i class="fa-solid fa-feather-pointed"></i> ${a.author}</span>
                    <span><i class="fa-regular fa-eye"></i> ${a.views}</span>
                    <span><i class="fa-regular fa-heart"></i> ${a.likes}</span>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

function renderSavedBooks() {
    const list = document.getElementById('savedBookList');
    list.innerHTML = '';
    savedBooks.forEach(b => {
        const card = document.createElement('div');
        card.className = 'saved-card';
        card.innerHTML = `
            <img src="${b.img}" alt="">
            <div class="saved-card-body">
                <div class="save-icon"><i class="fa-solid fa-bookmark"></i></div>
                <span class="mini-tag">${b.kategori}</span>
                <h4>${b.title}</h4>
                <div class="meta">
                    <span><i class="fa-solid fa-feather-pointed"></i> ${b.author}</span>
                    <span><i class="fa-solid fa-star"></i> ${b.rating}</span>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

renderSavedArticles();
renderSavedBooks();

/* ================= EVENT YANG SUDAH DIBELI (dummy) ================= */
const boughtEvents = [
    { nama: 'Workshop Digital Marketing UMKM', tanggal: '28 September 2026', lokasi: 'Online via Zoom', img: '../assets/thum-event-1.jpg' },
    { nama: 'Seminar Literasi Keuangan Usaha', tanggal: '3 Oktober 2026', lokasi: 'Denpasar', img: '../assets/thum-event-2.jpg' },
    { nama: 'Bootcamp Strategi Bisnis 2026', tanggal: '12 Oktober 2026', lokasi: 'Online via Zoom', img: '../assets/thum-event-3.jpg' }
];

(function renderEvents() {
    const list = document.getElementById('eventList');
    list.innerHTML = '';
    boughtEvents.forEach(ev => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <img src="${ev.img}" alt="">
            <div class="event-card-body">
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

/* ================= ARTIKEL SAYA (dummy CRUD, disimpan di localStorage) ================= */
const seedMyArticles = [
    { id: 1, title: 'Kenapa UMKM Wajib Melek Digital', kategori: 'Bisnis Digital', status: 'publish', views: 340, img: '../assets/artike-img.jpg', isi: '' },
    { id: 2, title: 'Draft: Ide Konten Promosi Bulan Ini', kategori: 'Pemasaran', status: 'draft', views: 0, img: '../assets/artike-img.jpg', isi: '' }
];

function getMyArticles() {
    const saved = localStorage.getItem('kembangin_my_articles');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('kembangin_my_articles', JSON.stringify(seedMyArticles));
    return seedMyArticles;
}

function saveMyArticles(arr) {
    localStorage.setItem('kembangin_my_articles', JSON.stringify(arr));
}

function renderMyArticles() {
    const data = getMyArticles();
    const list = document.getElementById('myArticleList');
    list.innerHTML = '';

    if (data.length === 0) {
        list.innerHTML = '<p class="tool-result">Belum ada artikel, yuk buat yang pertama!</p>';
        return;
    }

    data.forEach(a => {
        const row = document.createElement('div');
        row.className = 'my-article-row';
        row.innerHTML = `
            <img src="${a.img}" alt="">
            <div class="info">
                <h4>${a.title}</h4>
                <div class="meta">
                    <span>${a.kategori}</span>
                    <span><i class="fa-regular fa-eye"></i> ${a.views} views</span>
                </div>
            </div>
            <span class="status-tag ${a.status}">Status: ${a.status === 'draft' ? 'Draft' : 'Publish'}</span>
            <button class="kelola-btn" data-id="${a.id}">Kelola Artikel</button>
        `;
        list.appendChild(row);
    });

    list.querySelectorAll('.kelola-btn').forEach(btn => {
        btn.addEventListener('click', () => openEditor(Number(btn.dataset.id)));
    });
}
renderMyArticles();

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

function closeEditor() {
    editorOverlay.classList.remove('show');
    editingId = null;
}

function submitArticle(status) {
    const data = getMyArticles();
    const judul = editorJudul.value.trim() || 'Artikel Tanpa Judul';
    const kategori = editorKategori.value.trim() || 'Umum';
    const isi = editorIsi.value.trim();

    if (editingId) {
        const article = data.find(a => a.id === editingId);
        article.title = judul;
        article.kategori = kategori;
        article.isi = isi;
        article.status = status;
    } else {
        data.unshift({
            id: Date.now(),
            title: judul,
            kategori: kategori,
            status: status,
            views: 0,
            img: '../assets/artike-img.jpg',
            isi: isi
        });
    }

    saveMyArticles(data);
    renderMyArticles();
    closeEditor();
}

document.getElementById('newArticleBtn').addEventListener('click', () => openEditor(null));
document.getElementById('closeEditorBtn').addEventListener('click', closeEditor);
editorOverlay.addEventListener('click', (e) => { if (e.target === editorOverlay) closeEditor(); });
document.getElementById('saveDraftBtn').addEventListener('click', () => submitArticle('draft'));
document.getElementById('publishBtn').addEventListener('click', () => submitArticle('publish'));
