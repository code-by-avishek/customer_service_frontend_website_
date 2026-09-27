/* ==========================================================
   NESTAGO — APP.JS
   Handles: mobile nav, "More" dropdown, scroll reveals,
   back-to-top, newsletter submit, wishlist + quick add-to-cart
   feedback. Vanilla JS, no dependencies.
========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const updateCartCounters = () => {
    if (!window.StorageAPI) return;

    const count = StorageAPI.getCartCount();
    document.querySelectorAll('.cart-count').forEach(counter => {
      counter.textContent = count;
    });
  };

  updateCartCounters();

  /* ------------------------------------------------------
     1. MOBILE NAV TOGGLE
  ------------------------------------------------------ */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.getElementById('mobile-menu');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  /* ------------------------------------------------------
     2. "MORE" DROPDOWN (click-to-toggle, keyboard friendly)
  ------------------------------------------------------ */
  const dropdown       = document.querySelector('.dropdown');
  const dropdownToggle = document.querySelector('.dropdown-toggle');

  if (dropdown && dropdownToggle) {
    const closeDropdown = () => {
      dropdown.classList.remove('open');
      dropdownToggle.setAttribute('aria-expanded', 'false');
    };

    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      dropdownToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) closeDropdown();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDropdown();
    });
  }

  /* ------------------------------------------------------
     3. SCROLL REVEAL (.reveal → .reveal.is-visible)
  ------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything immediately
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------
     4. BLUEPRINT SVG DRAW-IN (re-trigger when scrolled into view)
  ------------------------------------------------------ */
  const drawGroups = document.querySelectorAll('.product-image, .hero-card');

  if ('IntersectionObserver' in window && drawGroups.length) {
    const drawObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.draw-path').forEach(path => {
            path.style.animation = 'none';
            // Force reflow so the animation restarts cleanly
            void path.offsetWidth;
            path.style.animation = '';
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    drawGroups.forEach(el => drawObserver.observe(el));
  }

  /* ------------------------------------------------------
     5. BACK TO TOP
  ------------------------------------------------------ */
  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 480);
    };
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------
     6. HEADER SHADOW ON SCROLL
  ------------------------------------------------------ */
  const header = document.querySelector('.site-header');
  if (header) {
    const toggleHeaderState = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    toggleHeaderState();
    window.addEventListener('scroll', toggleHeaderState, { passive: true });
  }

  /* ------------------------------------------------------
     7. WISHLIST TOGGLE
  ------------------------------------------------------ */
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const active = btn.classList.toggle('active');
      btn.setAttribute('aria-pressed', String(active));
    });
  });

  /* ------------------------------------------------------
     8. ADD TO CART
  ------------------------------------------------------ */
  document.querySelectorAll('.product-buttons .btn-primary').forEach(btn => {
    const originalLabel = btn.textContent.trim();

    btn.addEventListener('click', () => {
      if (btn.dataset.locked === 'true') return;

      const card = btn.closest('.product-card');
      const name = card?.querySelector('h3')?.textContent.trim();
      const priceText = card?.querySelector('.price')?.textContent || card?.dataset.price;
      const price = Number(priceText?.replace(/[^\d.]/g, ''));

      if (!card || !name || !Number.isFinite(price) || price <= 0) {
        console.error('Unable to add product with missing name or price.');
        return;
      }

      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const description = card.querySelector('.product-content p')?.textContent.trim() || '';
      if (!window.StorageAPI) {
        console.error('Cart storage is not available on this page.');
        return;
      }
      const cart = StorageAPI.addToCart(id, 1, { name, price, description });
      if (!cart) {
        console.error('Product was not added because cart storage failed.');
        return;
      }

      updateCartCounters();

      btn.dataset.locked = 'true';
      btn.textContent = 'Added ✓';

      setTimeout(() => {
        btn.textContent = originalLabel;
        btn.dataset.locked = 'false';
      }, 1600);
    });
  });

  /* ------------------------------------------------------
     9. NEWSLETTER FORM
  ------------------------------------------------------ */
  const newsletterForm = document.querySelector('.newsletter-form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const submitBtn  = newsletterForm.querySelector('button[type="submit"]');
      if (!emailInput || !emailInput.checkValidity()) {
        emailInput?.reportValidity();
        return;
      }

      newsletterForm.classList.add('is-success');
      const originalLabel = submitBtn.textContent.trim();
      submitBtn.textContent = 'Subscribed ✓';

      let note = newsletterForm.parentElement.querySelector('.newsletter-note');
      if (!note) {
        note = document.createElement('p');
        note.className = 'newsletter-note';
        newsletterForm.insertAdjacentElement('afterend', note);
      }
      note.textContent = `Thanks — we'll be in touch at ${emailInput.value}.`;

      emailInput.value = '';

      setTimeout(() => {
        newsletterForm.classList.remove('is-success');
        submitBtn.textContent = originalLabel;
      }, 3200);
    });
  }

  /* ------------------------------------------------------
     10. SMOOTH-SCROLL for in-page anchors (respects reduced motion)
  ------------------------------------------------------ */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

});

/* ==========================================================
   SHOP PAGE — filters, sort, and real pagination
========================================================== */
document.addEventListener('DOMContentLoaded', () => {

  const shopGrid = document.getElementById('shopGrid');
  if (!shopGrid) return; // Not on the shop page

  const ITEMS_PER_PAGE = 9;
  let currentPage = 1;

  // Record each card's original position so "Featured" sort is stable.
  const cards = Array.from(shopGrid.querySelectorAll('.product-card'));
  cards.forEach((card, i) => { card.dataset.originalIndex = i; });

  const categoryBoxes = document.querySelectorAll('input[name="category"]');
  const materialBoxes = document.querySelectorAll('input[name="material"]');
  const priceRange     = document.getElementById('priceRange');
  const priceRangeVal  = document.getElementById('priceRangeValue');
  const sortSelect     = document.getElementById('sortSelect');
  const resultCount    = document.getElementById('resultCount');
  const shopEmpty      = document.getElementById('shopEmpty');
  const resetBtn       = document.getElementById('filterReset');
  const paginationNav  = document.getElementById('pagination');

  const checkedValues = (nodeList) =>
    Array.from(nodeList).filter(el => el.checked).map(el => el.value);

  function getFilteredSortedCards() {
    const categories = checkedValues(categoryBoxes);
    const materials   = checkedValues(materialBoxes);
    const maxPrice     = Number(priceRange.value);

    const filtered = cards.filter(card =>
      categories.includes(card.dataset.category) &&
      materials.includes(card.dataset.material) &&
      Number(card.dataset.price) <= maxPrice
    );

    filtered.sort((a, b) => {
      switch (sortSelect.value) {
        case 'price-asc':  return Number(a.dataset.price) - Number(b.dataset.price);
        case 'price-desc': return Number(b.dataset.price) - Number(a.dataset.price);
        case 'rating':     return Number(b.dataset.rating) - Number(a.dataset.rating);
        default:           return Number(a.dataset.originalIndex) - Number(b.dataset.originalIndex);
      }
    });

    return filtered;
  }

  function renderPagination(totalPages) {
    paginationNav.innerHTML = '';
    if (totalPages <= 1) return;

    const makeBtn = (label, page, opts = {}) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'page-btn' + (opts.extraClass ? ` ${opts.extraClass}` : '');
      btn.textContent = label;
      if (opts.disabled) btn.disabled = true;
      if (page === currentPage) {
        btn.classList.add('is-active');
        btn.setAttribute('aria-current', 'page');
      }
      btn.addEventListener('click', () => {
        currentPage = page;
        render();
        shopGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return btn;
    };

    paginationNav.appendChild(
      makeBtn('← Prev', Math.max(currentPage - 1, 1), { extraClass: 'page-prev', disabled: currentPage === 1 })
    );

    for (let page = 1; page <= totalPages; page++) {
      paginationNav.appendChild(makeBtn(String(page), page));
    }

    paginationNav.appendChild(
      makeBtn('Next →', Math.min(currentPage + 1, totalPages), { extraClass: 'page-next', disabled: currentPage === totalPages })
    );
  }

  function render() {
    const filteredSorted = getFilteredSortedCards();
    const totalItems = filteredSorted.length;
    const totalPages = Math.max(Math.ceil(totalItems / ITEMS_PER_PAGE), 1);

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = filteredSorted.slice(start, start + ITEMS_PER_PAGE);
    const pageItemsSet = new Set(pageItems);

    // Hide everything first, then show + order only this page's items.
    cards.forEach(card => { card.hidden = true; });
    pageItems.forEach(card => {
      card.hidden = false;
      shopGrid.appendChild(card); // moves it into correct order among visible siblings
    });

    resultCount.textContent = totalItems;
    shopEmpty.hidden = totalItems !== 0;
    shopGrid.hidden = totalItems === 0;

    renderPagination(totalPages);
  }

  priceRange.addEventListener('input', () => {
    priceRangeVal.textContent = `$${Number(priceRange.value).toLocaleString()}`;
    currentPage = 1;
    render();
  });

  [...categoryBoxes, ...materialBoxes].forEach(box => {
    box.addEventListener('change', () => { currentPage = 1; render(); });
  });

  sortSelect.addEventListener('change', () => { currentPage = 1; render(); });

  resetBtn.addEventListener('click', () => {
    [...categoryBoxes, ...materialBoxes].forEach(box => { box.checked = true; });
    priceRange.value = priceRange.max;
    priceRangeVal.textContent = `$${Number(priceRange.max).toLocaleString()}`;
    sortSelect.value = 'featured';
    currentPage = 1;
    render();
  });

  // Init
  priceRangeVal.textContent = `$${Number(priceRange.value).toLocaleString()}`;
  render();

});

/* ==========================================================
   CUSTOMIZE PAGE — live preview + price calculator
========================================================== */
document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('customizeForm');
  if (!form) return; // Not on the customize page

  const basePrices = { chair: 420, table: 1180, bench: 560, shelf: 680 };
  const finishAdd   = { natural: 0, matte: 45, dark: 60 };
  const hardwareAdd = { blackened: 0, brass: 85 };
  const woodLabels  = { oak: 'White Oak', walnut: 'Walnut', ash: 'Ash' };
  const finishLabels = { natural: 'Natural Oil', matte: 'Matte Wax', dark: 'Dark Stain' };
  const hardwareLabels = { blackened: 'Blackened Steel', brass: 'Solid Brass' };
  const formLabels = { chair: 'Chair', table: 'Table', bench: 'Bench', shelf: 'Shelf' };

  const widthRange  = document.getElementById('widthRange');
  const heightRange = document.getElementById('heightRange');
  const widthValue  = document.getElementById('widthValue');
  const heightValue = document.getElementById('heightValue');

  const engraveInput = document.getElementById('engraveInput');
  const engraveCount = document.getElementById('engraveCount');

  const previewSvg          = document.getElementById('previewSvg');
  const previewWidthLabel   = document.getElementById('previewWidthLabel');
  const previewHeightLabel  = document.getElementById('previewHeightLabel');
  const previewFigLabel     = document.getElementById('previewFigLabel');

  const summaryForm     = document.getElementById('summaryForm');
  const summaryWood     = document.getElementById('summaryWood');
  const summaryFinish   = document.getElementById('summaryFinish');
  const summaryHardware = document.getElementById('summaryHardware');
  const summarySize     = document.getElementById('summarySize');
  const summaryPrice    = document.getElementById('summaryPrice');
  const summaryEngraveRow = document.getElementById('summaryEngraveRow');
  const summaryEngrave    = document.getElementById('summaryEngrave');

  const addCustomBtn = document.getElementById('addCustomBtn');

  function selectedValue(name) {
    const checked = form.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : null;
  }

  function updateTileStates() {
    form.querySelectorAll('.option-tile, .swatch-tile').forEach(tile => {
      const input = tile.querySelector('input');
      tile.classList.toggle('is-selected', input.checked);
    });
  }

  function updatePreview() {
    const width  = Number(widthRange.value);
    const height = Number(heightRange.value);
    const formVal = selectedValue('form');

    widthValue.textContent  = `${width} mm`;
    heightValue.textContent = `${height} mm`;

    previewWidthLabel.textContent  = `W ${width}mm`;
    previewHeightLabel.textContent = `H ${height}mm`;
    previewFigLabel.textContent    = `FIG. ${formVal.toUpperCase()}-01`;

    // Scale the blueprint frame within the fixed 420x480 viewBox
    const frameLeft  = 120;
    const frameRight = Math.min(120 + (width / 1800) * 220 + 60, 380);
    const frameTop   = Math.max(390 - (height / 1200) * 320, 60);

    previewSvg.querySelectorAll('.draw-path').forEach(path => {
      path.style.animation = 'none';
      void path.offsetWidth;
      path.style.animation = '';
    });
  }

  function updateSummary() {
    const formVal     = selectedValue('form');
    const woodVal      = selectedValue('wood');
    const finishVal    = selectedValue('finish');
    const hardwareVal  = selectedValue('hardware');
    const width  = Number(widthRange.value);
    const height = Number(heightRange.value);

    summaryForm.textContent     = formLabels[formVal];
    summaryWood.textContent      = woodLabels[woodVal];
    summaryFinish.textContent    = finishLabels[finishVal];
    summaryHardware.textContent  = hardwareLabels[hardwareVal];
    summarySize.textContent      = `${width} × ${height} mm`;

    const engraveText = engraveInput.value.trim();
    if (engraveText) {
      summaryEngraveRow.hidden = false;
      summaryEngrave.textContent = engraveText;
    } else {
      summaryEngraveRow.hidden = true;
    }

    const total =
      basePrices[formVal] +
      finishAdd[finishVal] +
      hardwareAdd[hardwareVal] +
      (engraveText ? 25 : 0);

    summaryPrice.textContent = `$${total.toLocaleString()}`;
  }

  function refreshAll() {
    updateTileStates();
    updatePreview();
    updateSummary();
  }

  form.addEventListener('change', refreshAll);
  widthRange.addEventListener('input', refreshAll);
  heightRange.addEventListener('input', refreshAll);

  engraveInput.addEventListener('input', () => {
    engraveCount.textContent = engraveInput.value.length;
    updateSummary();
  });

  if (addCustomBtn) {
    addCustomBtn.addEventListener('click', () => {
      const originalLabel = addCustomBtn.textContent;
      addCustomBtn.textContent = 'Added ✓';
      addCustomBtn.disabled = true;
      setTimeout(() => {
        addCustomBtn.textContent = originalLabel;
        addCustomBtn.disabled = false;
      }, 1800);
    });
  }

  refreshAll();

});

/* ==========================================================
   ORDERS PAGE — accordion + status filter + lookup
========================================================== */
document.addEventListener('DOMContentLoaded', () => {

  const orderList = document.getElementById('orderList');
  if (!orderList) return; // Not on the orders page

  const orderCards = Array.from(orderList.querySelectorAll('.order-card'));
  const tabs        = document.querySelectorAll('.order-tab');
  const ordersEmpty = document.getElementById('ordersEmpty');
  const lookupForm  = document.getElementById('orderLookupForm');
  const lookupInput = document.getElementById('orderLookupInput');

  // Accordion toggle
  orderCards.forEach(card => {
    const summary = card.querySelector('.order-summary');
    summary.addEventListener('click', () => {
      const isOpen = card.classList.toggle('is-open');
      summary.setAttribute('aria-expanded', String(isOpen));
    });
  });

  // Status filter tabs
  function applyTab(filter) {
    let visible = 0;
    orderCards.forEach(card => {
      const match = filter === 'all' || card.dataset.status === filter;
      card.hidden = !match;
      if (match) visible++;
    });
    ordersEmpty.hidden = visible !== 0;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      applyTab(tab.dataset.filter);
    });
  });

  // Order number lookup — opens the first matching order
  if (lookupForm) {
    lookupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = lookupInput.value.trim().toLowerCase();
      if (!query) return;

      tabs.forEach(t => t.classList.remove('is-active'));
      document.querySelector('.order-tab[data-filter="all"]')?.classList.add('is-active');
      applyTab('all');

      const match = orderCards.find(card =>
        card.querySelector('.order-id').textContent.toLowerCase().includes(query)
      );

      orderCards.forEach(card => card.classList.remove('is-open'));

      if (match) {
        match.classList.add('is-open');
        match.querySelector('.order-summary').setAttribute('aria-expanded', 'true');
        match.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        lookupInput.setCustomValidity('No order found with that number.');
        lookupInput.reportValidity();
        setTimeout(() => lookupInput.setCustomValidity(''), 2000);
      }
    });
  }

});