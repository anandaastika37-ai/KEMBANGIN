const search = document.getElementById('search');
const dropdownSearch = document.querySelector('.hiddenSearch');
const navSearch = document.querySelector('.navbar-search');

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

/* SEARCH */

search.addEventListener('focus', function () {
    dropdownSearch.classList.add('find');
    navSearch.classList.add('navbar-search-tall');
});

search.addEventListener('blur', function () {
    dropdownSearch.classList.remove('find');
    navSearch.classList.remove('navbar-search-tall');
});
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
const productDropdown = new Dropdown(produkBtn, dropdownProduct, { icon: iconArrow });
const mobileMenuDropdown = new Dropdown(menuBtn, mobileNav, { activeClass: 'show' });
const mobileSearchDropdown = new Dropdown(mobileSearchBtn, mobileSearchBar, { activeClass: 'show' });

/* dropdown produk versi mobile: cukup pakai 1 class (slide-down),
   activeClass & slideClass memang sama - jadi cukup set salah satunya saja */
const productDropdownMobile = new Dropdown(produkBtnMobile, dropdownProductMobile, { activeClass: 'slide-down' });

mobileSearchBtn.addEventListener('click', () => {
    setTimeout(() => mobileSearchInput.focus(), 100);
});

document.addEventListener('click', () => {
    dropdowns.forEach((dropdown) => {
        dropdown.close();
    });
});