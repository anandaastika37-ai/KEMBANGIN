/* ================= DATA ANGGOTA (dummy) ================= */
const members = [
    { nama: 'Rina Store', admin: true },
    { nama: 'Bang Doni Kopi', admin: true },
    { nama: 'Salsa Craft', admin: false },
    { nama: 'Warung Bu Yuni', admin: false },
    { nama: 'Toko Anugrah', admin: false },
    { nama: 'Kedai Nusantara', admin: false },
    { nama: 'Batik Ceria', admin: false },
    { nama: 'Snack Lokal', admin: false }
];

const avatarColors = ['#0088FF', '#33356e', '#7c3aed', '#0d9488', '#dc2626', '#ca8a04'];

function avatarColor(i) {
    return avatarColors[i % avatarColors.length];
}

const memberRow = document.getElementById('memberRow');
members.slice(0, 6).forEach((m, i) => {
    const el = document.createElement('div');
    el.className = 'mini-avatar';
    el.style.backgroundColor = avatarColor(i);
    el.textContent = m.nama.charAt(0);
    el.title = m.nama;
    memberRow.appendChild(el);
});

const memberOverlay = document.getElementById('memberOverlay');
const memberFullList = document.getElementById('memberFullList');

document.getElementById('seeAllBtn').addEventListener('click', () => {
    memberFullList.innerHTML = '';
    members.forEach((m, i) => {
        const row = document.createElement('div');
        row.className = 'member-item';
        row.innerHTML = `
            <div class="mini-avatar" style="background-color:${avatarColor(i)}">${m.nama.charAt(0)}</div>
            <span>${m.nama}</span>
            ${m.admin ? '<span class="admin-tag">Admin</span>' : ''}
        `;
        memberFullList.appendChild(row);
    });
    memberOverlay.classList.add('show');
});

document.getElementById('closeMemberBtn').addEventListener('click', () => {
    memberOverlay.classList.remove('show');
});
memberOverlay.addEventListener('click', (e) => {
    if (e.target === memberOverlay) memberOverlay.classList.remove('show');
});

/* ================= FOLLOW BUTTON ================= */
const followBtn = document.getElementById('followBtn');
const memberCountEl = document.getElementById('memberCount');
let baseMember = 1284;

function syncFollowState() {
    const following = localStorage.getItem('kembangin_following_group') === 'true';
    followBtn.textContent = following ? 'Following' : 'Follow';
    followBtn.classList.toggle('following', following);
    memberCountEl.textContent = (following ? baseMember + 1 : baseMember).toLocaleString('id-ID');
}

followBtn.addEventListener('click', () => {
    const following = localStorage.getItem('kembangin_following_group') === 'true';
    localStorage.setItem('kembangin_following_group', (!following).toString());
    syncFollowState();
});
syncFollowState();

/* ================= POST FEED ================= */
const postForm = document.getElementById('postForm');
const postText = document.getElementById('postText');
const postFeed = document.getElementById('postFeed');
const postAvatar = document.getElementById('postAvatar');

const seedPosts = [
    {
        id: 1,
        nama: 'Rina Store',
        admin: true,
        text: 'Ada yang punya tips buat naikin penjualan pas bulan sepi kaya sekarang? usaha snack kecil-kecilan lagi agak sepi soalnya',
        img: '../assets/pemasaran.jpg',
        waktu: '2 hari lalu',
        likes: 8,
        liked: false
    },
    {
        id: 2,
        nama: 'Bang Doni Kopi',
        admin: true,
        text: 'Baru selesai course "Belajar Dari Dasar" di sini, ternyata konsep cashflow yang selama ini aku pakai salah total wkwk. recommended banget buat yang baru mulai',
        img: '../assets/keuangan-bisnis.jpg',
        waktu: '5 hari lalu',
        likes: 15,
        liked: false
    },
    {
        id: 3,
        nama: 'Salsa Craft',
        admin: false,
        text: 'Sharing progress usaha kerajinan tangan aku bulan ini, alhamdulillah mulai kejual sampai luar kota',
        img: '../assets/inovasi.jpg',
        waktu: '1 minggu lalu',
        likes: 21,
        liked: false
    }
];

function getPosts() {
    const saved = localStorage.getItem('kembangin_posts');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('kembangin_posts', JSON.stringify(seedPosts));
    return seedPosts;
}

function getCurrentUser() {
    const saved = localStorage.getItem('kembangin_profile_data');
    return saved ? JSON.parse(saved) : { fullname: 'Seseorang203' };
}

function savePosts(posts) {
    localStorage.setItem('kembangin_posts', JSON.stringify(posts));
}

/* animasi scroll: post muncul (fade+slide) begitu masuk viewport */
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

function renderFeed() {
    const posts = getPosts();
    postFeed.innerHTML = '';

    posts.forEach((post, i) => {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
            <div class="post-avatar" style="background-color:${avatarColor(i)}">${post.nama.charAt(0).toUpperCase()}</div>
            <div class="post-card-body">
                <div class="post-card-head">
                    <b>${post.nama}</b>
                    ${post.admin ? '<span class="admin-tag">Admin</span>' : ''}
                    <small>${post.waktu}</small>
                </div>
                <p>${post.text}</p>
                ${post.img ? `<img class="post-img" src="${post.img}" alt="">` : ''}
                <button class="like-btn ${post.liked ? 'liked' : ''}" data-id="${post.id}">
                    <i class="fa-solid fa-thumbs-up"></i> ${post.likes}
                </button>
            </div>
        `;
        postFeed.appendChild(card);
        scrollObserver.observe(card);
    });
}

postFeed.addEventListener('click', function (e) {
    const btn = e.target.closest('.like-btn');
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const posts = getPosts();
    const post = posts.find(p => p.id === id);
    if (!post) return;

    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;

    savePosts(posts);
    renderFeed();
});

postForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const text = postText.value.trim();
    if (!text) return;

    const user = getCurrentUser();
    const posts = getPosts();

    posts.unshift({
        id: Date.now(),
        nama: user.fullname || user.name || 'Seseorang203',
        admin: false,
        text: text,
        img: '',
        waktu: 'Baru saja',
        likes: 0,
        liked: false
    });

    savePosts(posts);
    postText.value = '';
    renderFeed();
});

postAvatar.textContent = (getCurrentUser().fullname || 'S').charAt(0).toUpperCase();
renderFeed();
