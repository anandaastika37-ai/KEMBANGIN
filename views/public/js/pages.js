async function loadComponent(selector, path) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${path} - ${res.status}`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error('Gagal load component:', err);
  }
}

function initNavbarToggle() {
  const toggleBtn = document.querySelector('.navbar-toggle');
  const menu = document.querySelector('.navbar-menu');
  if (!toggleBtn || !menu) return;

  toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
}

async function initLayout() {
    await loadComponent('#navbar', '/kembangin/views/components/navbar.html');
    await loadComponent('#footer', '/kembangin/views/components/footer.html');
  initNavbarToggle(); // dipanggil SETELAH navbar selesai di-load
}

document.addEventListener('DOMContentLoaded', initLayout);