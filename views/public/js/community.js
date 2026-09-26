/* ================= DATA ANGGOTA (dummy) ================= */
const members = [
    { nama: 'Rina Store', admin: true },
    { nama: 'Bang Doni Kopi', admin: true },
    { nama: 'Salsa Craft', admin: false },
    { nama: 'Warung Bu Yuni', admin: false },
    { nama: 'Toko Anugrah', admin: false },
    { nama: 'Kedai Nusantara', admin: false },
    { nama: 'Batik Ceria', admin: false },
    { nama: 'Snack Lokal', admin: false },
    { nama: 'Jaya Elektronik', admin: false },
    { nama: 'Laundry Bersih', admin: false }
];

const avatarGradients = [
    ['#2b37e2', '#0d1660'],
    ['#7c8bff', '#2b37e2'],
    ['#38bdf8', '#2054e2'],
    ['#f2b544', '#fb923c'],
    ['#2dd4bf', '#0d1660'],
    ['#f472b6', '#a78bfa']
];
function avatarColor(i) {
    const [start, end] = avatarGradients[i % avatarGradients.length];
    return `linear-gradient(135deg, ${start}, ${end})`;
}

const memberGrid = document.getElementById('memberGrid');
members.slice(0, 10).forEach((m, i) => {
    const el = document.createElement('div');
    el.className = 'mini-avatar' + (i < 3 ? ' online' : '');
    el.style.background = avatarColor(i);
    el.textContent = m.nama.charAt(0);
    el.title = m.nama + (i < 3 ? ' (sedang aktif)' : '');
    memberGrid.appendChild(el);
});

const memberOverlay = document.getElementById('memberOverlay');
const memberFullList = document.getElementById('memberFullList');

document.getElementById('seeAllBtn').addEventListener('click', () => {
    memberFullList.innerHTML = '';
    members.forEach((m, i) => {
        const row = document.createElement('div');
        row.className = 'member-item';
        row.innerHTML = `
            <div class="mini-avatar" style="background:${avatarColor(i)}">${m.nama.charAt(0)}</div>
            <span>${m.nama}</span>
            ${m.admin ? '<span class="admin-tag">Admin</span>' : ''}
        `;
        memberFullList.appendChild(row);
    });
    memberOverlay.classList.add('show');
});
document.getElementById('closeMemberBtn').addEventListener('click', () => memberOverlay.classList.remove('show'));
memberOverlay.addEventListener('click', (e) => { if (e.target === memberOverlay) memberOverlay.classList.remove('show'); });

/* ================= FOLLOW BUTTON ================= */
const followBtn = document.getElementById('followBtn');
const memberCountEl = document.getElementById('memberCount');
// DATA DUMMY PROTOTYPE — ganti dengan data backend saat sistem sudah terhubung.
const baseMember = 1284;

function syncFollowState() {
    const following = localStorage.getItem('kembangin_following_group') === 'true';
    followBtn.innerHTML = following ? '<i class="fa-solid fa-check"></i> Mengikuti' : '<i class="fa-solid fa-user-plus"></i> Ikuti';
    followBtn.classList.toggle('following', following);
    memberCountEl.textContent = (following ? baseMember + 1 : baseMember).toLocaleString('id-ID');
}
followBtn.addEventListener('click', () => {
    const following = localStorage.getItem('kembangin_following_group') === 'true';
    localStorage.setItem('kembangin_following_group', (!following).toString());
    syncFollowState();

    followBtn.classList.remove('burst');
    void followBtn.offsetWidth; /* restart animasi kalau diklik berkali-kali */
    followBtn.classList.add('burst');

    showToast(!following ? 'Berhasil bergabung ke komunitas!' : 'Berhenti mengikuti komunitas', 'fa-solid fa-users');
});
syncFollowState();

/* ================= POST FEED ================= */
const postForm = document.getElementById('postForm');
const postText = document.getElementById('postText');
const postFeed = document.getElementById('postFeed');
const postAvatar = document.getElementById('postAvatar');
const categoryChips = document.getElementById('categoryChips');
const feedTabs = document.getElementById('feedTabs');
const unreadCountEl = document.getElementById('unreadCount');

const categories = ['Semua', 'Pemasaran', 'Keuangan', 'Inovasi', 'Curhat', 'Artikel'];
const categoryColorMap = { Pemasaran: 'orange', Keuangan: 'teal', Inovasi: 'purple', Curhat: 'pink', Artikel: 'teal' };
function categoryColorClass(cat) { return categoryColorMap[cat] ? 'cat-' + categoryColorMap[cat] : ''; }
let activeCategory = 'Semua';
let activeTab = 'semua';

const seedPosts = [
    { id: 1, nama: 'Rina Store', admin: true, pinned: true, kategori: 'Pemasaran',
      text: 'Selamat datang di Komunitas UMKM Kembangin! Yuk kenalan dan saling berbagi progres usaha kalian di sini. Baca dulu Aturan Komunitas di sidebar ya sebelum posting 🙌',
      img: '', waktu: '1 minggu lalu', likes: 45, comments: 12, liked: false, read: true },
    { id: 2, nama: 'Rina Store', admin: true, pinned: false, kategori: 'Curhat',
      text: 'Ada yang punya tips buat naikin penjualan pas bulan sepi kaya sekarang? usaha snack kecil-kecilan lagi agak sepi soalnya',
      img: '../assets/pemasaran.jpg', waktu: '2 hari lalu', likes: 8, comments: 5, liked: false, read: true },
    { id: 3, nama: 'Bang Doni Kopi', admin: true, pinned: false, kategori: 'Keuangan',
      text: 'Baru selesai course "Belajar Dari Dasar" di sini, ternyata konsep cashflow yang selama ini aku pakai salah total wkwk. recommended banget buat yang baru mulai',
      img: '../assets/keuangan-bisnis.jpg', waktu: '5 hari lalu', likes: 15, comments: 3, liked: false, read: true },
    { id: 4, nama: 'Salsa Craft', admin: false, pinned: false, kategori: 'Inovasi',
      text: 'Sharing progress usaha kerajinan tangan aku bulan ini, alhamdulillah mulai kejual sampai luar kota',
      img: '../assets/inovasi.jpg', waktu: '3 jam lalu', likes: 21, comments: 7, liked: false, read: false },
    { id: 5, nama: 'Warung Bu Yuni', admin: false, pinned: false, kategori: 'Curhat',
      text: 'Ada yang pernah coba jualan lewat aplikasi ojek online? worth it ga sih buat warung kecil kayak punyaku?',
      img: '', waktu: '1 jam lalu', likes: 4, comments: 9, liked: false, read: false }
];

function getPosts() {
    const saved = localStorage.getItem('kembangin_posts_v2');
    let posts = seedPosts;
    try {
        const parsed = saved ? JSON.parse(saved) : seedPosts;
        if (Array.isArray(parsed)) posts = parsed;
    } catch (err) {
        console.warn('Data komunitas tidak dapat dibaca; memakai data demo.', err);
    }
    if (!saved) localStorage.setItem('kembangin_posts_v2', JSON.stringify(seedPosts));

    const postCount = document.getElementById('postCount');
    if (postCount) postCount.textContent = Math.max(42, posts.length + 37);

    return posts;
}
function getCurrentUser() {
    try {
        const saved = JSON.parse(localStorage.getItem('kembangin_profile') || '{}');
        return { fullname: saved.fullname || 'Seseorang Wijaya' };
    } catch (err) {
        return { fullname: 'Seseorang Wijaya' };
    }
}
function savePosts(posts) { localStorage.setItem('kembangin_posts_v2', JSON.stringify(posts)); }

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
}

/* chip kategori */
categories.forEach(cat => {
    const chip = document.createElement('button');
    chip.className = 'chip' + (cat === 'Semua' ? ' active' : '') + (categoryColorClass(cat) ? ' ' + categoryColorClass(cat) : '');
    chip.textContent = cat;
    chip.addEventListener('click', () => {
        activeCategory = cat;
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        renderFeed();
    });
    categoryChips.appendChild(chip);
});

/* tab terbaru / belum dibaca */
feedTabs.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        activeTab = btn.dataset.filter;
        feedTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderFeed();
    });
});

/* animasi scroll */
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

function renderFeed() {
    let posts = getPosts();

    unreadCountEl.textContent = posts.filter(p => !p.read).length || '';

    if (activeCategory !== 'Semua') posts = posts.filter(p => p.kategori === activeCategory);
    if (activeTab === 'unread') posts = posts.filter(p => !p.read);

    // pinned post selalu di atas
    posts = [...posts].sort((a, b) => (b.pinned === true) - (a.pinned === true));

    postFeed.innerHTML = '';

    if (posts.length === 0) {
        postFeed.innerHTML = '<p style="color:var(--text-400);font-size:.85rem;">Belum ada postingan di kategori/filter ini.</p>';
        return;
    }

    posts.forEach((post, i) => {
        const card = document.createElement('div');
        card.className = 'post-card' + (!post.read ? ' unread' : '') + (post.pinned ? ' pinned' : '');
        card.innerHTML = `
            <div class="post-avatar" style="background:${avatarColor(i)}">${escapeHtml(post.nama.charAt(0).toUpperCase())}</div>
            <div class="post-card-body">
                ${post.pinned ? '<div class="pin-label"><i class="fa-solid fa-thumbtack"></i> Disematkan Admin</div>' : ''}
                <div class="post-card-head">
                    <b>${escapeHtml(post.nama)}</b>
                    ${post.admin ? '<span class="admin-tag">Admin</span>' : ''}
                    ${!post.read ? '<span class="unread-dot"></span>' : ''}
                    <small>${escapeHtml(post.waktu)}</small>
                </div>
                <span class="cat-tag ${categoryColorClass(post.kategori)}">${escapeHtml(post.kategori)}</span>
                <p>${escapeHtml(post.text)}</p>
                ${post.article ? `<a class="post-article-preview" href="${escapeHtml(post.article.href)}" target="_blank" rel="noopener"><strong>${escapeHtml(post.article.title)}</strong><span>${escapeHtml(post.article.excerpt)}</span><em>Baca artikel <i class="fa-solid fa-arrow-up-right-from-square"></i></em></a>` : ''}
                ${post.img ? `<img class="post-img" src="${escapeHtml(post.img)}" alt="">` : ''}
                <div class="post-actions">
                    <button class="like-btn ${post.liked ? 'liked' : ''}" data-id="${post.id}" data-action="like">
                        <i class="fa-solid fa-thumbs-up"></i> ${post.likes}
                    </button>
                    <button data-action="comment"><i class="fa-regular fa-comment"></i> ${post.comments}</button>
                </div>
            </div>
        `;
        if (!post.read) {
            card.addEventListener('click', () => markRead(post.id), { once: true });
        }
        postFeed.appendChild(card);
        scrollObserver.observe(card);
    });
}

function markRead(id) {
    const posts = getPosts();
    const post = posts.find(p => p.id === id);
    if (post && !post.read) {
        post.read = true;
        savePosts(posts);
        renderFeed();
    }
}

postFeed.addEventListener('click', function (e) {
    const btn = e.target.closest('.like-btn');
    if (!btn) return;
    e.stopPropagation();

    const id = Number(btn.dataset.id);
    const posts = getPosts();
    const post = posts.find(p => p.id === id);
    if (!post) return;

    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    savePosts(posts);
    renderFeed();

    if (post.liked) {
        const freshBtn = postFeed.querySelector(`.like-btn[data-id="${id}"]`);
        if (freshBtn) {
            freshBtn.classList.add('pop');
            setTimeout(() => freshBtn.classList.remove('pop'), 250);
        }
    }
});

postForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = postText.value.trim();
    if (!text) return;

    const user = getCurrentUser();
    const posts = getPosts();
    const newId = Date.now();

    posts.unshift({
        id: newId, nama: user.fullname || user.name || 'Seseorang Wijaya', admin: false, pinned: false,
        kategori: 'Curhat', text: text, img: '', waktu: 'Baru saja', likes: 0, comments: 0, liked: false, read: true
    });

    savePosts(posts);
    postText.value = '';
    renderFeed();

    const freshLikeBtn = postFeed.querySelector(`.like-btn[data-id="${newId}"]`);
    const freshCard = freshLikeBtn ? freshLikeBtn.closest('.post-card') : null;
    if (freshCard) freshCard.classList.add('new-post', 'in-view');
    showToast('Postingan berhasil dibagikan!', 'fa-solid fa-paper-plane');
});

postAvatar.textContent = (getCurrentUser().fullname || 'S').charAt(0).toUpperCase();
renderFeed();
