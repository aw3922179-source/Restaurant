/* ==========================================================================
   Savor — front-end interactions
   Vanilla JavaScript only. No dependencies, no build step.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- helpers */
  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ toast */
  const toastEl = $('#toast');
  let toastTimer = null;

  function toast(message, type) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.className = 'toast is-shown' + (type ? ' toast--' + type : '');
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('is-shown');
      setTimeout(() => { toastEl.hidden = true; }, 400);
    }, 3600);
  }

  /* -------------------------------------------------------------- preloader */
  function initPreloader() {
    const pre = $('#preloader');
    if (!pre) return;
    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      pre.classList.add('is-done');
      setTimeout(() => pre.remove(), 700);
    };
    if (document.readyState === 'complete') {
      setTimeout(done, 350);
    } else {
      window.addEventListener('load', () => setTimeout(done, 350));
      setTimeout(done, 3200); // hard fallback; the loader can never trap the page
    }
  }

  /* ------------------------------------------------ active nav link tracking */
  const sectionIds = ['home', 'about', 'menu', 'chef', 'gallery', 'reservation'];

  function setActiveLink(scrollY) {
    const links = $$('.nav__link');
    if (!links.length) return;

    const probe = scrollY + Math.round(window.innerHeight * 0.32);
    let current = sectionIds[0];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= probe) current = id;
    });

    links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('is-active', href === '#' + current);
    });
  }

  /* ----------------------------------------------------------- header state */
  function initHeader() {
    const header = $('#header');
    const toTop  = $('#toTop');
    if (!header) return;

    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      header.classList.toggle('is-stuck', y > 40);
      if (toTop) toTop.classList.toggle('is-shown', y > 620);
      setActiveLink(y);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------ mobile menu */
  function initMobileNav() {
    const burger  = $('#burger');
    const nav     = $('#nav');
    const overlay = $('#navOverlay');
    if (!burger || !nav) return;

    const open = () => {
      nav.classList.add('is-open');
      burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('is-locked');
      if (overlay) {
        overlay.hidden = false;
        requestAnimationFrame(() => overlay.classList.add('is-shown'));
      }
    };

    const close = () => {
      nav.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('is-locked');
      if (overlay) {
        overlay.classList.remove('is-shown');
        setTimeout(() => { overlay.hidden = true; }, 350);
      }
    };

    burger.addEventListener('click', () => {
      if (nav.classList.contains('is-open')) close(); else open();
    });
    if (overlay) overlay.addEventListener('click', close);
    $$('a', nav).forEach((a) => a.addEventListener('click', close));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) close();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980 && nav.classList.contains('is-open')) close();
    });
  }

  /* --------------------------------------------------------- scroll reveal */
  function initReveal() {
    const items = $$('[data-reveal]');
    if (!items.length) return;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
        const index = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = Math.min(index * 70, 350) + 'ms';
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    items.forEach((el) => io.observe(el));
  }

  /* --------------------------------------------------------- count-up stats */
  function initCounters() {
    const counters = $$('[data-count]');
    if (!counters.length) return;

    const run = (el) => {
      const target = parseFloat(el.dataset.count) || 0;
      if (prefersReduced) { el.textContent = String(target); return; }
      const duration = 1500;
      const start = performance.now();

      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(run);
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------- menu */
  function initMenu() {
    const tabsEl = $('#menuTabs');
    const gridEl = $('#menuGrid');
    if (!tabsEl || !gridEl || typeof MENU_ITEMS === 'undefined') return;

    const badgesFor = (keys) => {
      if (!keys || !keys.length) return '';
      return keys.map((key) => {
        const meta = (typeof MENU_BADGES !== 'undefined' && MENU_BADGES[key]) || { label: key };
        const cls = meta.cls ? ' ' + meta.cls : '';
        return '<span class="badge' + cls + '">' + meta.label + '</span>';
      }).join('');
    };

    const cardHTML = (item) => `
      <article class="menu-card" data-reveal>
        <div class="menu-card__thumb">
          <img src="${item.img}" alt="${item.name}" loading="lazy" />
        </div>
        <div class="menu-card__body">
          <div class="menu-card__top">
            <h3 class="menu-card__name">${item.name}</h3>
            <span class="menu-card__dots"></span>
            <span class="menu-card__price">${item.price}</span>
          </div>
          <p class="menu-card__desc">${item.desc}</p>
          <div class="menu-card__badges">${badgesFor(item.badges)}</div>
        </div>
      </article>`;

    const renderTabs = () => {
      const all = [{ id: 'all', label: 'All' }].concat(MENU_CATEGORIES);
      tabsEl.innerHTML = all.map((cat, i) => `
        <button class="tab${i === 0 ? ' is-active' : ''}"
                role="tab"
                data-cat="${cat.id}"
                aria-selected="${i === 0}">${cat.label}</button>`).join('');
    };

    const renderItems = (cat) => {
      const list = cat === 'all' ? MENU_ITEMS : MENU_ITEMS.filter((it) => it.cat === cat);
      gridEl.style.opacity = '0';
      window.setTimeout(() => {
        gridEl.innerHTML = list.map(cardHTML).join('');
        gridEl.style.opacity = '1';
        gridEl.style.transition = 'opacity .35s ease';
        // make freshly injected cards visible even without a scroll event
        $$('[data-reveal]', gridEl).forEach((el, i) => {
          el.style.transitionDelay = Math.min(i * 45, 320) + 'ms';
          el.classList.add('is-visible');
        });
      }, prefersReduced ? 0 : 160);
    };

    tabsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab');
      if (!btn) return;
      $$('.tab', tabsEl).forEach((t) => {
        const active = t === btn;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      renderItems(btn.dataset.cat);
    });

    renderTabs();
    renderItems('all');
  }

  /* ---------------------------------------------------------------- gallery */
  function initGallery() {
    const gridEl = $('#galleryGrid');
    if (!gridEl || typeof GALLERY === 'undefined') return;

    gridEl.innerHTML = GALLERY.map((shot, i) => `
      <button class="gallery__item${shot.size ? ' gallery__item--' + shot.size : ''}"
              type="button"
              data-index="${i}"
              aria-label="Open image: ${shot.cap}">
        <img src="${shot.img}" alt="${shot.cap}" loading="lazy" />
        <span class="gallery__cap">${shot.cap}</span>
      </button>`).join('');
  }

  /* --------------------------------------------------------------- lightbox */
  function initLightbox() {
    const box   = $('#lightbox');
    const img   = $('#lightboxImg');
    const cap   = $('#lightboxCaption');
    const close = $('#lightboxClose');
    const prev  = $('#lightboxPrev');
    const next  = $('#lightboxNext');
    if (!box || !img || typeof GALLERY === 'undefined' || !GALLERY.length) return;

    let index = 0;
    let lastFocused = null;

    const show = (i) => {
      index = (i + GALLERY.length) % GALLERY.length;
      const shot = GALLERY[index];
      img.src = shot.img;
      img.alt = shot.cap;
      if (cap) cap.textContent = shot.cap;
    };

    const open = (i) => {
      lastFocused = document.activeElement;
      show(i);
      box.hidden = false;
      document.body.classList.add('is-locked');
      if (close) close.focus();
    };

    const hide = () => {
      box.hidden = true;
      document.body.classList.remove('is-locked');
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    };

    document.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery__item');
      if (!item) return;
      open(parseInt(item.dataset.index, 10) || 0);
    });

    if (close) close.addEventListener('click', hide);
    if (prev)  prev.addEventListener('click', () => show(index - 1));
    if (next)  next.addEventListener('click', () => show(index + 1));
    box.addEventListener('click', (e) => { if (e.target === box) hide(); });

    document.addEventListener('keydown', (e) => {
      if (box.hidden) return;
      if (e.key === 'Escape')     hide();
      if (e.key === 'ArrowLeft')  show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  }

  /* ---------------------------------------------------------------- slider */
  function initSlider() {
    const track = $('#sliderTrack');
    const dotsEl = $('#sliderDots');
    const prevBtn = $('#prevSlide');
    const nextBtn = $('#nextSlide');
    const root = $('#slider');
    if (!track || typeof TESTIMONIALS === 'undefined' || !TESTIMONIALS.length) return;

    const stars = (n) => '&#9733;'.repeat(n);

    track.innerHTML = TESTIMONIALS.map((t) => `
      <figure class="slide">
        <div class="slide__stars" aria-label="${t.stars} out of 5 stars">${stars(t.stars)}</div>
        <blockquote class="slide__quote">${t.quote}</blockquote>
        <figcaption class="slide__author">
          <span class="slide__avatar"><img src="${t.avatar}" alt="" loading="lazy" /></span>
          <span class="slide__meta"><b>${t.name}</b><span>${t.role}</span></span>
        </figcaption>
      </figure>`).join('');

    if (dotsEl) {
      dotsEl.innerHTML = TESTIMONIALS.map((t, i) => `
        <button class="slider__dot${i === 0 ? ' is-active' : ''}"
                type="button"
                data-index="${i}"
                aria-label="Go to testimonial ${i + 1}"></button>`).join('');
    }

    let index = 0;
    let timer = null;

    const go = (i) => {
      index = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      if (dotsEl) {
        $$('.slider__dot', dotsEl).forEach((dot, di) => {
          dot.classList.toggle('is-active', di === index);
        });
      }
    };

    const next = () => go(index + 1);
    const prev = () => go(index - 1);

    const startAuto = () => {
      if (prefersReduced) return;
      stopAuto();
      timer = setInterval(next, 6500);
    };
    const stopAuto = () => { if (timer) { clearInterval(timer); timer = null; } };

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });

    if (dotsEl) {
      dotsEl.addEventListener('click', (e) => {
        const dot = e.target.closest('.slider__dot');
        if (!dot) return;
        go(parseInt(dot.dataset.index, 10) || 0);
        startAuto();
      });
    }

    if (root) {
      root.addEventListener('mouseenter', stopAuto);
      root.addEventListener('mouseleave', startAuto);
      root.addEventListener('focusin', stopAuto);
      root.addEventListener('focusout', startAuto);
    }

    // touch / swipe support
    let startX = 0;
    let tracking = false;
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      tracking = true;
      stopAuto();
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (!tracking) return;
      tracking = false;
      const delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 45) { delta < 0 ? next() : prev(); }
      startAuto();
    });

    document.addEventListener('visibilitychange', () => {
      document.hidden ? stopAuto() : startAuto();
    });

    // keyboard support
    if (root) {
      root.setAttribute('tabindex', '0');
      root.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { next(); startAuto(); }
        if (e.key === 'ArrowLeft')  { prev(); startAuto(); }
      });
    }

    go(0);
    startAuto();
  }

  /* ------------------------------------------------------------------ forms */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function fieldOf(input) { return input ? input.closest('.field') : null; }

  function setError(input, message) {
    const field = fieldOf(input);
    if (!field) return;
    const slot = field.querySelector('.field__error');
    field.classList.toggle('has-error', Boolean(message));
    if (slot) slot.textContent = message || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function clearError(input) { setError(input, ''); }

  function wireLiveClearing(input) {
    if (!input) return;
    const evt = input.tagName === 'SELECT' ? 'change' : 'input';
    input.addEventListener(evt, () => clearError(input));
    input.addEventListener('blur', () => {
      if (input.value.trim()) clearError(input);
    });
  }

  function initReservation() {
    const form = $('#reservationForm');
    if (!form) return;

    const name = $('#resName');
    const phone = $('#resPhone');
    const email = $('#resEmail');
    const date = $('#resDate');
    const time = $('#resTime');
    const guests = $('#resGuests');
    const submit = $('#resSubmit');

    // Sensible defaults: today's date as the minimum, next evening slot as default time.
    const today = new Date();
    const isoToday = today.toISOString().slice(0, 10);
    if (date) { date.min = isoToday; }
    if (time) { time.min = '17:00'; time.max = '23:30'; }
    if (time && !time.value) time.value = '19:00';

    [name, phone, email, date, time, guests].forEach(wireLiveClearing);

    const validators = {
      name() {
        const v = (name.value || '').trim();
        if (!v) return 'Please enter your name.';
        if (v.length < 2) return 'Name looks a little short.';
        return '';
      },
      phone() {
        const v = (phone.value || '').trim();
        if (!v) return 'Please enter a contact number.';
        if ((v.replace(/[^\d]/g, '').length) < 7) return 'That number looks incomplete.';
        return '';
      },
      email() {
        const v = (email.value || '').trim();
        if (!v) return 'Please enter your email.';
        if (!EMAIL_RE.test(v)) return 'Please enter a valid email address.';
        return '';
      },
      date() {
        if (!date.value) return 'Please pick a date.';
        if (date.value < isoToday) return 'Please choose today or a future date.';
        return '';
      },
      time() {
        if (!time.value) return 'Please pick a time.';
        if (time.value < '17:00' || time.value > '23:30') return 'We seat guests between 5:00 PM and 11:30 PM.';
        return '';
      },
      guests() {
        if (!guests.value) return 'Please select a party size.';
        return '';
      }
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstInvalid = null;

      Object.keys(validators).forEach((key) => {
        const input = { name, phone, email, date, time, guests }[key];
        const message = validators[key]();
        setError(input, message);
        if (message && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        firstInvalid.focus({ preventScroll: false });
        toast('Please check the highlighted fields.', 'err');
        return;
      }

      const original = submit ? submit.textContent : '';
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Sending...';
      }

      // Front-end demo: simulate a request, then show confirmation.
      window.setTimeout(() => {
        if (submit) {
          submit.disabled = false;
          submit.textContent = original;
        }
        toast('Thank you, ' + name.value.trim() + ' — your table is requested for ' +
              guests.value + ' on ' + date.value + ' at ' + time.value + '.', 'ok');
        form.reset();
        if (time) time.value = '19:00';
        Object.keys(validators).forEach((key) => {
          clearError({ name, phone, email, date, time, guests }[key]);
        });
      }, 900);
    });
  }

  function initNewsletter() {
    const form = $('#newsletterForm');
    const input = $('#newsletterEmail');
    if (!form || !input) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = (input.value || '').trim();
      if (!EMAIL_RE.test(value)) {
        toast('Please enter a valid email address.', 'err');
        input.focus();
        return;
      }
      toast('You are on the list — welcome to Savor.', 'ok');
      form.reset();
    });
  }

  /* --------------------------------------------------------------- to-top */
  function initToTop() {
    const btn = $('#toTop');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------------------ misc */
  function initMisc() {
    const year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());

    // Keep the menu CTA inside the mobile drawer out of the tab order on desktop.
    const navCta = $('.nav__cta');
    if (navCta) navCta.removeAttribute('tabindex');
  }

  /* ------------------------------------------------------------------ boot */
  function init() {
    initPreloader();
    initHeader();
    initMobileNav();
    initMenu();
    initGallery();
    initLightbox();
    initSlider();
    initReservation();
    initNewsletter();
    initToTop();
    initMisc();
    initCounters();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();




