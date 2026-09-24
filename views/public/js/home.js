(() => {
  const modal = document.getElementById('event-modal');
  if (!modal) return;

  const modalBox = modal.querySelector('.modal-box');
  const closeBtn = document.getElementById('event-modal-close');
  const imgEl = document.getElementById('event-modal-img');
  const tagEl = document.getElementById('event-modal-tag');
  const titleEl = document.getElementById('event-modal-title');
  const speakerEl = document.getElementById('event-modal-speaker');
  const metaEl = document.getElementById('event-modal-meta');
  const descEl = document.getElementById('event-modal-desc');
  const statsEl = document.getElementById('event-modal-stats');
  const joinEl = document.getElementById('event-modal-join');
  const bookmarkEl = document.getElementById('event-modal-bookmark');
  const consultantsEl = document.getElementById('event-modal-consultants');

  const eventCards = Array.from(document.querySelectorAll('.box-event'));
  const consultantCards = Array.from(document.querySelectorAll('.card-consultan'));

  let lastFocused = null;
  let activeCard = null;

  /* Build the "Top 5 Konsultan" list straight from the consultant cards
     already on the page, so the modal never gets out of sync with them. */
  function buildConsultantList() {
    consultantsEl.innerHTML = '';

    consultantCards.forEach((card) => {
      const photo = card.querySelector('.cc-photo img');
      const rating = card.querySelector('.cc-rating');
      const name = card.querySelector('.cc-name');
      const spes = card.querySelector('.cc-spes');
      const btn = card.querySelector('.cc-btn');
      if (!photo || !name || !btn) return;

      const row = document.createElement('a');
      row.className = 'modal-consultant-card';
      row.href = btn.getAttribute('href') || '#';

      row.innerHTML = `
        <img src="${photo.getAttribute('src')}" alt="${photo.getAttribute('alt') || ''}">
        <span class="modal-consultant-info">
          <span class="modal-consultant-name">${name.innerHTML}</span>
          <span class="modal-consultant-spes">${spes ? spes.textContent : ''}</span>
        </span>
        <span class="modal-consultant-rating">${rating ? rating.innerHTML : ''}</span>
      `;

      consultantsEl.appendChild(row);
    });
  }

  function openModalFor(card) {
    activeCard = card;

    const img = card.querySelector('.thumb-event');
    const tag = card.querySelector('.ket > h5');
    const title = card.querySelector('.ket > h3');
    const speaker = card.querySelector('.ket > h4');
    const meta = card.querySelector('.meta-row');
    const info = card.querySelector('.info');
    const join = card.querySelector('.btn-gabung');
    const bookmark = card.querySelector('.bookmark-btn');
    const desc = card.dataset.desc || '';

    if (img) {
      imgEl.src = img.getAttribute('src');
      imgEl.alt = img.getAttribute('alt') || '';
    }

    if (tag) {
      tagEl.textContent = tag.textContent.trim();
      tagEl.hidden = false;
    } else {
      tagEl.hidden = true;
    }

    titleEl.textContent = title ? title.textContent.trim() : '';
    speakerEl.innerHTML = speaker ? speaker.innerHTML : '';
    metaEl.innerHTML = meta ? meta.innerHTML : '';
    descEl.textContent = desc;
    statsEl.innerHTML = info ? info.innerHTML : '';
    joinEl.href = join ? join.getAttribute('href') || '#' : '#';

    const isSaved = bookmark ? bookmark.classList.contains('is-saved') : false;
    bookmarkEl.classList.toggle('is-saved', isSaved);
    bookmarkEl.setAttribute('aria-pressed', String(isSaved));

    buildConsultantList();

    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    activeCard = null;
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  eventCards.forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('.bookmark-btn, .btn-gabung')) return;
      openModalFor(card);
    });

    card.addEventListener('keydown', (event) => {
      if (event.target.closest('.bookmark-btn, .btn-gabung')) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModalFor(card);
      }
    });

    const bookmark = card.querySelector('.bookmark-btn');
    if (bookmark) {
      bookmark.addEventListener('click', (event) => {
        event.stopPropagation();
        const saved = bookmark.classList.toggle('is-saved');
        bookmark.setAttribute('aria-pressed', String(saved));
      });
    }

    const join = card.querySelector('.btn-gabung');
    if (join) {
      join.addEventListener('click', (event) => {
        event.stopPropagation();
      });
    }
  });

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  bookmarkEl.addEventListener('click', () => {
    const saved = bookmarkEl.classList.toggle('is-saved');
    bookmarkEl.setAttribute('aria-pressed', String(saved));

    if (activeCard) {
      const cardBookmark = activeCard.querySelector('.bookmark-btn');
      if (cardBookmark) {
        cardBookmark.classList.toggle('is-saved', saved);
        cardBookmark.setAttribute('aria-pressed', String(saved));
      }
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      closeModal();
      return;
    }

    if (event.key === 'Tab') {
      const focusable = modalBox.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();