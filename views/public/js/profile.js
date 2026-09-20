const openEditBtn = document.getElementById('openEditBtn');
const closeEditBtn = document.getElementById('closeEditBtn');
const editOverlay = document.getElementById('editOverlay');
const profileForm = document.getElementById('profileForm');

const defaultData = {
    fullname: 'Seseorang Wijaya',
    username: 'seseorang203',
    email: 'seseorang@gmail.com',
    umur: 27,
    namaUsaha: 'Kopi Senja',
    kategori: 'Kuliner & Minuman',
    alamat: 'Jl. Merdeka No. 12, Denpasar',
    npwp: '09.123.456.7-901.000',
    tahun: 2022
};

function getData() {
    const saved = localStorage.getItem('kembangin_profile_data');
    return saved ? JSON.parse(saved) : defaultData;
}

function renderView(data) {
    document.getElementById('profileFullname').textContent = data.fullname;
    document.getElementById('profileUsername').textContent = data.username;
    document.getElementById('profileAvatar').textContent = data.fullname.charAt(0).toUpperCase();
    document.getElementById('viewEmail').textContent = data.email;
    document.getElementById('viewUmur').textContent = data.umur + ' tahun';
    document.getElementById('viewNamaUsaha').textContent = data.namaUsaha;
    document.getElementById('viewKategori').textContent = data.kategori;
    document.getElementById('viewAlamat').textContent = data.alamat;
    document.getElementById('viewNpwp').textContent = data.npwp;
    document.getElementById('viewTahun').textContent = data.tahun;
}

function fillForm(data) {
    document.getElementById('inputFullname').value = data.fullname;
    document.getElementById('inputUsername').value = data.username;
    document.getElementById('inputEmail').value = data.email;
    document.getElementById('inputUmur').value = data.umur;
    document.getElementById('inputNamaUsaha').value = data.namaUsaha;
    document.getElementById('inputKategori').value = data.kategori;
    document.getElementById('inputAlamat').value = data.alamat;
    document.getElementById('inputNpwp').value = data.npwp;
    document.getElementById('inputTahun').value = data.tahun;
}

openEditBtn.addEventListener('click', () => {
    fillForm(getData());
    editOverlay.classList.add('show');
});

closeEditBtn.addEventListener('click', () => {
    editOverlay.classList.remove('show');
});

editOverlay.addEventListener('click', (e) => {
    if (e.target === editOverlay) editOverlay.classList.remove('show');
});

profileForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const data = {
        fullname: document.getElementById('inputFullname').value.trim() || defaultData.fullname,
        username: document.getElementById('inputUsername').value.trim() || defaultData.username,
        email: document.getElementById('inputEmail').value.trim() || defaultData.email,
        umur: document.getElementById('inputUmur').value || defaultData.umur,
        namaUsaha: document.getElementById('inputNamaUsaha').value.trim() || defaultData.namaUsaha,
        kategori: document.getElementById('inputKategori').value.trim() || defaultData.kategori,
        alamat: document.getElementById('inputAlamat').value.trim() || defaultData.alamat,
        npwp: document.getElementById('inputNpwp').value.trim() || defaultData.npwp,
        tahun: document.getElementById('inputTahun').value || defaultData.tahun
    };

    localStorage.setItem('kembangin_profile_data', JSON.stringify(data));
    renderView(data);
    editOverlay.classList.remove('show');
});

renderView(getData());
