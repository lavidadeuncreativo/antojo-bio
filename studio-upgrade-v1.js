(() => {
  'use strict';

  const INSTAGRAM_URL = 'https://www.instagram.com/antojo.bebidas/';
  const MOODS = [
    { id: 'cream', label: 'Crema' },
    { id: 'pulse', label: 'Pulso' },
    { id: 'mariposa', label: 'Mariposa' }
  ];
  const NOVIA_CAMPAIGN = {
    id: 'dia-novia-2026',
    title: 'Un presente para quedarnos aquí.',
    description: 'Una bebida especial de ANTOJO. con flor y una dedicatoria breve para regalar este 1 de agosto.',
    price: 'Desde $99 MXN',
    availability: 'Primera tanda limitada a 100 piezas',
    whatsapp: 'Hola, quiero reservar la edición especial del Día de la Novia de ANTOJO. ¿Me comparten disponibilidad, sabores y opciones de entrega?',
    endsAt: '2026-08-02T05:59:59-06:00',
    dismissForMs: 36 * 60 * 60 * 1000,
    showAfterMs: 1800
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

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

  function applyMood(id) {
    const mood = MOODS.find(item => item.id === id) || MOODS[0];
    document.documentElement.dataset.mood = mood.id;
    try { localStorage.setItem('antojo-mood-v1', mood.id); } catch {}
    const button = $('#antojoMoodButton');
    if (button) {
      button.dataset.mood = mood.id;
      button.setAttribute('aria-label', `Cambiar mood. Actual: ${mood.label}`);
      button.innerHTML = `<span aria-hidden="true"></span>Mood: ${mood.label}`;
    }
  }

  function cycleMood() {
    const current = document.documentElement.dataset.mood || MOODS[0].id;
    const index = Math.max(0, MOODS.findIndex(item => item.id === current));
    applyMood(MOODS[(index + 1) % MOODS.length].id);
    window.antojoTrack?.('change_visual_mood', { mood: document.documentElement.dataset.mood });
  }

  function injectHeaderControls() {
    const actions = $('.header-actions');
    if (!actions) return;

    if (!$('#antojoBlogLink')) {
      const blog = document.createElement('a');
      blog.id = 'antojoBlogLink';
      blog.className = 'header-blog';
      blog.href = '/blog/';
      blog.textContent = 'Diario ↗';
      actions.insertBefore(blog, $('#menuButton'));
    }

    if (!$('#antojoMoodButton')) {
      const button = document.createElement('button');
      button.id = 'antojoMoodButton';
      button.className = 'mood-button';
      button.type = 'button';
      button.addEventListener('click', cycleMood);
      actions.insertBefore(button, $('#antojoBlogLink'));
    }
  }

  function injectDrawerLink() {
    const drawer = $('#drawer');
    if (!drawer || $('#drawerBlogButton')) return;
    const faq = $('[data-faq-open]', drawer);
    const button = document.createElement('button');
    button.id = 'drawerBlogButton';
    button.type = 'button';
    button.innerHTML = '<span>06</span><b>Diario ANTOJO.</b><i>↗</i>';
    button.addEventListener('click', () => { window.location.href = '/blog/'; });
    drawer.insertBefore(button, faq || null);
    if (faq) {
      const number = $('span', faq);
      if (number) number.textContent = '07';
    }
  }

  function injectHomeLink() {
    const links = $('.bio-links');
    if (!links || $('#homeBlogLink')) return;
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

  function injectFooterLink() {
    const footerNav = $('.footer-top nav');
    if (!footerNav || $('#footerBlogLink')) return;
    const link = document.createElement('a');
    link.id = 'footerBlogLink';
    link.href = '/blog/';
    link.textContent = 'Diario ↗';
    footerNav.insertBefore(link, footerNav.firstChild);
  }

  function campaignIsActive() {
    return Date.now() <= new Date(NOVIA_CAMPAIGN.endsAt).getTime();
  }

  function storageGet(storage, key) {
    try { return storage.getItem(key); } catch { return null; }
  }

  function storageSet(storage, key, value) {
    try { storage.setItem(key, value); } catch {}
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
        <source media="(max-width: 559px)" srcset="/renders/antojo-dia-novia-close.jpg">
        <source media="(max-width: 959px)" srcset="/renders/antojo-dia-novia-angle.jpg">
        <img src="/renders/antojo-dia-novia-front.jpg"
          alt="Caja de regalo ANTOJO. con una bebida verde, una flor de lirio y una dedicatoria."
          width="240" height="320" decoding="async">
      </picture>`;
  }

  function injectCampaignPresence() {
    if (!campaignIsActive()) return;

    const announcement = $('.announcement-bar');
    if (announcement && !$('#noviaAnnouncement')) {
      const button = document.createElement('button');
      button.id = 'noviaAnnouncement';
      button.className = 'novia-announcement';
      button.type = 'button';
      button.dataset.noviaOpen = '';
      button.innerHTML = '<span>Edición Día de la Novia</span><b>1 AGO · RESERVA LIMITADA</b>';
      announcement.prepend(button);
    }

    const homeLead = $('.home-lead');
    if (homeLead && !$('#noviaHomeCard')) {
      const card = document.createElement('button');
      card.id = 'noviaHomeCard';
      card.className = 'novia-home-card';
      card.type = 'button';
      card.dataset.noviaOpen = '';
      card.innerHTML = `
        <span class="novia-home-card__date">01 AGO</span>
        <span><small>EDICIÓN LIMITADA</small><strong>Bebida + flor + dedicatoria</strong></span>
        <i>Conocer edición →</i>`;
      homeLead.insertAdjacentElement('afterend', card);
    }
  }

  function injectCampaignModal() {
    if ($('#noviaModal') || !campaignIsActive()) return;
    const backdrop = document.createElement('div');
    backdrop.className = 'novia-modal';
    backdrop.id = 'noviaModal';
    backdrop.hidden = true;
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.innerHTML = `
      <div class="novia-modal__backdrop" data-novia-close></div>
      <section class="novia-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="noviaTitle" aria-describedby="noviaDescription">
        <button class="novia-modal__close" type="button" data-novia-close aria-label="Cerrar edición Día de la Novia">×</button>
        <div class="novia-modal__visual">
          ${campaignPicture()}
          <span class="novia-modal__edition">EDICIÓN 01 · 2026</span>
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
    document.body.appendChild(backdrop);
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
        openCampaignModal('manual');
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

  function inject() {
    injectHeaderControls();
    injectDrawerLink();
    injectHomeLink();
    injectFooterLink();
    patchCommunityAndInstagram();
    injectCampaignPresence();
    injectCampaignModal();
  }

  function start() {
    inject();
    let stored = 'cream';
    try { stored = localStorage.getItem('antojo-mood-v1') || 'cream'; } catch {}
    applyMood(stored);
    bindCampaign();

    const ticker = $('#announcementTrack');
    const social = $('#socialTrack');
    const observer = new MutationObserver(() => patchCommunityAndInstagram());
    if (ticker) observer.observe(ticker, { childList: true, subtree: true, characterData: true });
    if (social) observer.observe(social, { childList: true, subtree: true, characterData: true });

    if (shouldAutoOpenCampaign()) {
      setTimeout(() => openCampaignModal('automatic'), NOVIA_CAMPAIGN.showAfterMs);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();