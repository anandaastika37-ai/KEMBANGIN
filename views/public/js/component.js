const produkBtn = document.getElementById('nav-drop');
const dropdownProduct = document.querySelector('.dropdown-produk');
const iconArrow = document.querySelector('.fa-angle-down')

const profileBtn = document.getElementById('profile-login');
const dropdownProfile = document.querySelector('.dropdown-profile');

const menuBtn = document.querySelector('.menu');
const mobileNav = document.querySelector('.mobile-navigation');

const mobileSearchBtn = document.querySelector('.mobile-search-btn');
const mobileSearchBar = document.querySelector('.mobile-search-bar');
const mobileSearchInput = document.getElementById('mobile-search');

const produkBtnMobile = document.querySelector('.nav-drop-mobile');
const dropdownProductMobile = document.querySelector('.dropdown-produk-mobile');

/* SEARCH — dipindah ke public/js/search.js (live filter, bukan cuma
   toggle tampil/sembunyi lagi) */
const dropdowns = [];
class Dropdown {
    constructor(button, dropdown, options = {}) {
        this.button = button;
        this.dropdown = dropdown;
        this.activeClass = options.activeClass || 'active';
        this.slideClass = options.slideClass || 'slide-down';
        this.buttonActiveClass = options.buttonActiveClass;
        this.buttonSlideClass = options.buttonSlideClass;
        this.icon = options.icon || null;
        dropdowns.push(this);
        this.init();
    }
    init() {
        this.button.addEventListener('click', (event) => {
            event.stopPropagation();
            this.toggle();
        });
        // Keyboard support: Enter/Space triggers the same toggle as a click,
        // since the trigger elements (li/div) aren't natively focusable buttons.
        this.button.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                this.toggle();
            }
        });
        this.dropdown.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    toggle() {
        const isActive = this.dropdown.classList.contains(this.activeClass);
        dropdowns.forEach((dropdown) => {
            const isAncestorContainer = dropdown.dropdown.contains(this.button);
            if (dropdown !== this && !isAncestorContainer) {
                dropdown.close();
            }
        });
        if (isActive) {
            this.close();
        } else {
            this.open();
        }
    }
    open() {
        this.dropdown.classList.add(this.activeClass);
        this.dropdown.classList.add(this.slideClass);
        this.button.setAttribute('aria-expanded', 'true');
        if (this.buttonActiveClass) {
            this.button.classList.add(this.buttonActiveClass);
        }
        if (this.buttonSlideClass) {
            this.button.classList.add(this.buttonSlideClass);
        }
        if (this.icon) {
            this.icon.classList.remove('fa-angle-down');
            this.icon.classList.add('fa-angle-up');
        }
    }

    close() {
        this.dropdown.classList.remove(this.activeClass);
        this.dropdown.classList.remove(this.slideClass);
        this.button.setAttribute('aria-expanded', 'false');
        if (this.buttonActiveClass) {
            this.button.classList.remove(this.buttonActiveClass);
        }
        if (this.buttonSlideClass) {
            this.button.classList.remove(this.buttonSlideClass);
        }
        if (this.icon) {
            this.icon.classList.remove('fa-angle-up');
            this.icon.classList.add('fa-angle-down');
        }
    }
}

const profileDropdown = new Dropdown(profileBtn, dropdownProfile, { buttonActiveClass: 'profile-active' });
const mobileMenuDropdown = new Dropdown(menuBtn, mobileNav, { activeClass: 'show' });
const mobileSearchDropdown = new Dropdown(mobileSearchBtn, mobileSearchBar, { activeClass: 'show' });
const productDropdown = new Dropdown(produkBtn, dropdownProduct, { icon: iconArrow });

const productDropdownMobile = new Dropdown(produkBtnMobile, dropdownProductMobile, { activeClass: 'slide-down' });

mobileSearchBtn.addEventListener('click', () => {
    setTimeout(() => mobileSearchInput.focus(), 100);
});

document.addEventListener('click', () => {
    dropdowns.forEach((dropdown) => {
        dropdown.close();
    });
});

/* NOTIFICATIONS
   The bell now lives inside the profile dropdown instead of sitting on its
   own in the navbar. This just wires up the unread badge — swap
   `unreadNotifCount` for real data from your backend/API. */

const notifDot = document.querySelector('.notif-dot');
const notifCount = document.querySelector('.notif-count');
const unreadNotifCount = 3;

function renderNotifBadge(count) {
    const hasUnread = count > 0;

    if (notifDot) {
        notifDot.classList.toggle('show', hasUnread);
    }

    if (notifCount) {
        notifCount.textContent = hasUnread ? (count > 9 ? '9+' : String(count)) : '';
        notifCount.classList.toggle('show', hasUnread);
    }
}

renderNotifBadge(unreadNotifCount);