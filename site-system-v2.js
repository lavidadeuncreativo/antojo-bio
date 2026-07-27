(() => {
  'use strict';

  const INSTAGRAM_URL = 'https://www.instagram.com/antojo.bebidas/';
  const MOOD_STORAGE_KEY = 'antojo-mood-v2';
  const LEGACY_MOOD_STORAGE_KEY = 'antojo-mood-v1';
  const DEFAULT_MOOD = 'editorial';

  const MOODS = [
    { id: 'editorial', label: 'Blanco editorial', shortLabel: 'Editorial', themeColor: '#ffffff' },
    { id: 'rojo', label: 'Rojo ANTOJO.', shortLabel: 'Rojo', themeColor: '#d93622' },
    { id: 'mariposa', label: 'Lila mariposa', shortLabel: 'Mariposa', themeColor: '#eee8fa' },
    { id: 'crema', label: 'Crema', shortLabel: 'Crema', themeColor: '#fbf2df' },
    { id: 'tinta', label: 'Negro tinta', shortLabel: 'Tinta', themeColor: '#111111' },
    { id: 'mantequilla', label: 'Amarillo mantequilla', shortLabel: 'Mantequilla', themeColor: '#fff2b7' },
    { id: 'matcha', label: 'Matcha suave', shortLabel: 'Matcha', themeColor: '#e8eedb' },
    { id: 'pulse', label: 'Pulse animado', shortLabel: 'Pulse', themeColor: '#fff5e9' }
  ];

  const NOVIA_CAMPAIGN = {
    id: 'dia-novia-2026-v2',
    title: 'Un presente para quedarnos aquí.',
    description: 'Una bebida especial de ANTOJO. con una flor y una dedicatoria breve para regalar este 1 de agosto.',
    price: '$219 MXN',
    availability: 'Primera tanda limitada a 100 piezas por reservación',
    whatsapp: 'Hola, quiero reservar la edición especial del Día de la Novia de ANTOJO. ¿Me comparten disponibilidad, sabores y opciones de entrega?',
    endsAt: '2026-08-02T05:59:59-06:00',
    dismissForMs: 36 * 60 * 60 * 1000,
    showAfterMs: 1400,
    assets: {
      mobile: '/renders/antojo-dia-novia-close.jpg?v=20260727-3',
      tablet: '/renders/antojo-dia-novia-angle.jpg?v=20260727-3',
      desktop: '/renders/antojo-dia-novia-front.jpg?v=20260727-3'
    }
  };

  const $ = (selector, root = document) => root?.querySelector(selector) || null;
  const $$ = (selector, root = document) => root ? [...root.querySelectorAll(selector)] : [];

  function storageGet(storage, key) {
    try { return storage.getItem(key); } catch { return null; }
  }

  function storageSet(storage, key, value) {
    try { storage.setItem(key, value); } catch {}
  }

  function replaceText(root, replacements) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      let next = node.nodeValue;
      replacements.forEach(([pattern, value]) => { next = next.replace(pattern, value); });
      if (next !== node.nodeValue) node.nodeValue = next;
    });
  }

  function patchCommunityAndInstagram() {
    replaceText(document.body, [
      [/¡Ya somos 15K en Instagram!/g, '¡Ya somos +16K en Instagram!'],
      [/\b15K\+\b/g, '+16K'],
      [/@antojo\.beb(?!idas)/g, '@antojo.bebidas']
    ]);

    $$('a[href*="instagram.com/antojo.beb"]').forEach(link => {
      link.href = INSTAGRAM_URL;
      link.rel = 'noopener';
    });
  }

  function injectEditorialLinks() {
    const actions = $('.header-actions');
    if (actions && !$('#antojoBlogLink')) {
      const blog = document.createElement('a');
      blog.id = 'antojoBlogLink';
      blog.className = 'header-blog';
      blog.href = '/blog/';
      blog.textContent = 'Diario ↗';
      actions.insertBefore(blog, $('#menuButton'));
    }

    const drawer = $('#drawer');
    if (drawer && !$('#drawerBlogButton')) {
      const faq = $('[data-faq-open]', drawer);
      const button = document.createElement('button');
      button.id = 'drawerBlogButton';
      button.type = 'button';
      button.innerHTML = '<span>06</span><b>Diario ANTOJO.</b><i>↗</i>';
      button.addEventListener('click', () => { window.location.href = '/blog/'; });
      drawer.insertBefore(button, faq || null);
      if (faq) $('span', faq).textContent = '07';
    }

    const links = $('.bio-links');
    if (links && !$('#homeBlogLink')) {
      const link = document.createElement('a');
      link.id = 'homeBlogLink';
      link.className = 'bio-link bio-link--journal';
      link.href = '/blog/';
      link.innerHTML = `
        <span class="bio-link__icon bio-link__icon--system" aria-hidden="true">
          <svg viewBox="0 0 32 32"><path d="M8 5.5h13.5A2.5 2.5 0 0 1 24 8v18.5H10.5A2.5 2.5 0 0 1 8 24V5.5Z"></path><path d="M8 22.5h13.5A2.5 2.5 0 0 1 24 25M12 11h8M12 15h8M12 19h5"></path></svg>
        </span>
        <span><small>Capítulos, decisiones y aprendizajes</small><strong>Leer el diario</strong></span><b>06</b>`;
      links.appendChild(link);
    }

    const footerNav = $('.footer-top nav');
    if (footerNav && !$('#footerBlogLink')) {
      const link = document.createElement('a');
      link.id = 'footerBlogLink';
      link.href = '/blog/';
      link.textContent = 'Diario ↗';
      footerNav.insertBefore(link, footerNav.firstChild);
    }
  }

  function resolveInitialMood() {
    const stored = storageGet(localStorage, MOOD_STORAGE_KEY);
    if (MOODS.some(mood => mood.id === stored)) return stored;

    const legacy = storageGet(localStorage, LEGACY_MOOD_STORAGE_KEY);
    const migrations = { cream: 'editorial', mariposa: 'mariposa', pulse: 'pulse' };
    return migrations[legacy] || DEFAULT_MOOD;
  }

  function updateMoodControl(mood) {
    const button = $('#antojoMoodButton');
    if (button) {
      button.dataset.mood = mood.id;
      button.setAttribute('aria-label', `Cambiar atmósfera visual. Actual: ${mood.label}`);
      button.setAttribute('aria-expanded', String($('#antojoMoodMenu')?.classList.contains('is-open') || false));
      button.innerHTML = `<span class="mood-button__swatch" aria-hidden="true"></span><span class="mood-button__label">Mood: ${mood.shortLabel}</span>`;
    }

    $$('#antojoMoodMenu [data-mood-option]').forEach(option => {
      const active = option.dataset.moodOption === mood.id;
      option.classList.toggle('is-active', active);
      option.setAttribute('aria-checked', String(active));
    });

    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = mood.themeColor;
  }

  function applyMood(id, { persist = true } = {}) {
    const mood = MOODS.find(item => item.id === id) || MOODS[0];
    document.documentElement.dataset.mood = mood.id;
    if (persist) storageSet(localStorage, MOOD_STORAGE_KEY, mood.id);
    updateMoodControl(mood);
    window.antojoTrack?.('change_visual_mood', { mood: mood.id });
  }

  function closeMoodMenu({ restoreFocus = false } = {}) {
    const menu = $('#antojoMoodMenu');
    const button = $('#antojoMoodButton');
    if (!menu || !button) return;
    menu.classList.remove('is-open');
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (restoreFocus) button.focus();
  }

  function toggleMoodMenu() {
    const menu = $('#antojoMoodMenu');
    const button = $('#antojoMoodButton');
    if (!menu || !button) return;
    const opening = menu.hidden;
    if (opening) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
      button.setAttribute('aria-expanded', 'true');
      setTimeout(() => $('[aria-checked="true"]', menu)?.focus(), 20);
    } else {
      closeMoodMenu();
    }
  }

  function injectMoodControl() {
    const actions = $('.header-actions');
    if (!actions) return;

    $('#antojoMoodButton')?.remove();
    $('#antojoMoodMenu')?.remove();

    const button = document.createElement('button');
    button.id = 'antojoMoodButton';
    button.className = 'mood-button';
    button.type = 'button';
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-controls', 'antojoMoodMenu');
    button.setAttribute('aria-expanded', 'false');

    const menu = document.createElement('div');
    menu.id = 'antojoMoodMenu';
    menu.className = 'mood-menu';
    menu.hidden = true;
    menu.setAttribute('role', 'radiogroup');
    menu.setAttribute('aria-label', 'Atmósfera visual');
    menu.innerHTML = `
      <div class="mood-menu__head"><small>ATMÓSFERA</small><strong>Elige cómo se siente ANTOJO.</strong></div>
      <div class="mood-menu__grid">
        ${MOODS.map((mood, index) => `<button type="button" role="radio" aria-checked="false" data-mood-option="${mood.id}"><i style="--mood-index:${index}" aria-hidden="true"></i><span>${mood.label}</span></button>`).join('')}
      </div>`;

    actions.insertBefore(button, $('#antojoBlogLink') || $('#menuButton'));
    document.body.appendChild(menu);

    button.addEventListener('click', event => {
      event.stopPropagation();
      toggleMoodMenu();
    });

    menu.addEventListener('click', event => {
      const option = event.target.closest('[data-mood-option]');
      if (!option) return;
      applyMood(option.dataset.moodOption);
      closeMoodMenu({ restoreFocus: true });
    });

    document.addEventListener('click', event => {
      if (!event.target.closest('#antojoMoodMenu,#antojoMoodButton')) closeMoodMenu();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menu.hidden) closeMoodMenu({ restoreFocus: true });
    });

    applyMood(resolveInitialMood(), { persist: false });
  }

  function campaignIsActive() {
    return Date.now() <= new Date(NOVIA_CAMPAIGN.endsAt).getTime();
  }

  function shouldAutoOpenCampaign() {
    if (!campaignIsActive()) return false;
    if (storageGet(sessionStorage, `${NOVIA_CAMPAIGN.id}:seen`)) return false;
    const dismissedAt = Number(storageGet(localStorage, `${NOVIA_CAMPAIGN.id}:dismissed-at`) || 0);
    return !dismissedAt || Date.now() - dismissedAt >= NOVIA_CAMPAIGN.dismissForMs;
  }

  function campaignPicture() {
    return `
      <picture class="novia-modal__picture">
        <source media="(max-width: 559px)" srcset="${NOVIA_CAMPAIGN.assets.mobile}" type="image/jpeg">
        <source media="(max-width: 959px)" srcset="${NOVIA_CAMPAIGN.assets.tablet}" type="image/jpeg">
        <img src="${NOVIA_CAMPAIGN.assets.desktop}"
          alt="Caja de regalo ANTOJO. con una bebida especial, flores y una dedicatoria."
          width="900" height="1200" loading="eager" fetchpriority="high" decoding="async">
      </picture>`;
  }

  function injectCampaignPresence() {
    $('#noviaAnnouncement')?.remove();
    if (!campaignIsActive()) return;

    const homeLead = $('.home-lead');
    if (homeLead && !$('#noviaHomeCard')) {
      const card = document.createElement('button');
      card.id = 'noviaHomeCard';
      card.className = 'novia-home-card';
      card.type = 'button';
      card.dataset.noviaOpen = '';
      card.innerHTML = `
        <span class="novia-home-card__date">01 AGO</span>
        <span><small>EDICIÓN LIMITADA · ${NOVIA_CAMPAIGN.price}</small><strong>Bebida + flor + dedicatoria</strong></span>
        <i>Ver edición →</i>`;
      homeLead.insertAdjacentElement('afterend', card);
    }
  }

  function enhanceAnnouncementTicker() {
    if (!campaignIsActive()) return;
    $$('.announcement-group').forEach(group => {
      if ($('.announcement-item--campaign', group)) return;
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'announcement-item announcement-item--campaign';
      item.dataset.noviaOpen = '';
      item.innerHTML = '<i aria-hidden="true"></i><strong>Edición Día de la Novia · 1 AGO · $219 · reserva limitada</strong>';
      group.prepend(item);
    });
  }

  function injectCampaignModal() {
    if ($('#noviaModal') || !campaignIsActive()) return;
    const modal = document.createElement('div');
    modal.className = 'novia-modal';
    modal.id = 'noviaModal';
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="novia-modal__backdrop" data-novia-close></div>
      <section class="novia-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="noviaTitle" aria-describedby="noviaDescription">
        <button class="novia-modal__close" type="button" data-novia-close aria-label="Cerrar edición Día de la Novia">×</button>
        <div class="novia-modal__visual">
          ${campaignPicture()}
          <span class="novia-modal__edition">EDICIÓN 01 · 2026</span>
          <span class="novia-modal__image-status" aria-live="polite">Cargando fotografía…</span>
        </div>
        <div class="novia-modal__content">
          <p class="novia-modal__eyebrow">DÍA DE LA NOVIA · 1 DE AGOSTO</p>
          <h2 id="noviaTitle">${NOVIA_CAMPAIGN.title}</h2>
          <p id="noviaDescription">${NOVIA_CAMPAIGN.description}</p>
          <div class="novia-modal__meta">
            <span><small>PRECIO</small><strong>${NOVIA_CAMPAIGN.price}</strong></span>
            <span><small>DISPONIBILIDAD</small><strong>100 piezas</strong></span>
          </div>
          <p class="novia-modal__availability">${NOVIA_CAMPAIGN.availability}. Envío por separado y sujeto a cobertura.</p>
          <div class="novia-modal__actions">
            <a class="novia-modal__primary" href="#" data-whatsapp="${NOVIA_CAMPAIGN.whatsapp}">Reservar por WhatsApp</a>
            <button class="novia-modal__secondary" type="button" data-novia-close>Seguir explorando</button>
          </div>
          <small class="novia-modal__fineprint">La reserva queda confirmada al validar sabor, entrega y pago.</small>
        </div>
      </section>`;
    document.body.appendChild(modal);

    const image = $('.novia-modal__picture img', modal);
    const visual = $('.novia-modal__visual', modal);
    const status = $('.novia-modal__image-status', modal);
    const markReady = () => {
      visual?.classList.add('is-image-ready');
      if (status) status.textContent = '';
    };
    if (image?.complete && image.naturalWidth > 0) markReady();
    image?.addEventListener('load', markReady, { once: true });
    image?.addEventListener('error', () => {
      $$('.novia-modal__picture source', modal).forEach(source => source.remove());
      image.src = NOVIA_CAMPAIGN.assets.desktop;
      if (status) status.textContent = 'La fotografía no pudo cargarse. Recarga la página.';
    }, { once: true });
  }

  let previousFocus = null;

  function modalFocusables() {
    return $$('a[href],button:not([disabled])', $('#noviaModal')).filter(node => !node.hidden);
  }

  function openCampaignModal(source = 'automatic') {
    const modal = $('#noviaModal');
    if (!modal || !campaignIsActive()) return;
    previousFocus = document.activeElement;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('novia-modal-open');
    storageSet(sessionStorage, `${NOVIA_CAMPAIGN.id}:seen`, '1');
    requestAnimationFrame(() => modal.classList.add('is-open'));
    setTimeout(() => $('[data-novia-close]', modal)?.focus(), 30);
    window.antojoTrack?.('open_novia_campaign', { source });
  }

  function closeCampaignModal(reason = 'dismiss') {
    const modal = $('#noviaModal');
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('novia-modal-open');
    if (reason === 'dismiss') storageSet(localStorage, `${NOVIA_CAMPAIGN.id}:dismissed-at`, String(Date.now()));
    setTimeout(() => {
      modal.hidden = true;
      previousFocus?.focus?.();
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220);
    window.antojoTrack?.('close_novia_campaign', { reason });
  }

  function bindCampaign() {
    document.addEventListener('click', event => {
      const opener = event.target.closest?.('[data-novia-open]');
      if (opener) {
        event.preventDefault();
        openCampaignModal(opener.closest('.announcement-track') ? 'announcement' : 'manual');
        return;
      }

      const closer = event.target.closest?.('[data-novia-close]');
      if (closer) {
        event.preventDefault();
        closeCampaignModal('dismiss');
        return;
      }

      const reserve = event.target.closest?.('#noviaModal [data-whatsapp]');
      if (reserve) {
        storageSet(localStorage, `${NOVIA_CAMPAIGN.id}:dismissed-at`, String(Date.now()));
        setTimeout(() => closeCampaignModal('reserve'), 20);
      }
    });

    document.addEventListener('keydown', event => {
      const modal = $('#noviaModal');
      if (!modal || modal.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeCampaignModal('dismiss');
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = modalFocusables();
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
    });
  }

  function startObservers() {
    const ticker = $('#announcementTrack');
    const social = $('#socialTrack');
    const bodyObserver = new MutationObserver(() => patchCommunityAndInstagram());
    const tickerObserver = new MutationObserver(() => {
      patchCommunityAndInstagram();
      enhanceAnnouncementTicker();
    });
    if (ticker) tickerObserver.observe(ticker, { childList: true, subtree: true, characterData: true });
    if (social) bodyObserver.observe(social, { childList: true, subtree: true, characterData: true });
  }

  function start() {
    patchCommunityAndInstagram();
    injectEditorialLinks();
    injectMoodControl();
    injectCampaignPresence();
    injectCampaignModal();
    bindCampaign();
    enhanceAnnouncementTicker();
    startObservers();

    if (shouldAutoOpenCampaign()) {
      setTimeout(() => openCampaignModal('automatic'), NOVIA_CAMPAIGN.showAfterMs);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
