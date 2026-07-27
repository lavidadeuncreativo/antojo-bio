(() => {
  'use strict';

  const CAMPAIGN = {
    id: 'dia-novia-2026-v3',
    title: 'Un presente para quedarnos aquí.',
    description: 'Una bebida especial de ANTOJO. con una flor y una dedicatoria breve para regalar este 1 de agosto.',
    price: '$219 MXN',
    availability: 'Primera tanda limitada a 100 piezas por reservación',
    endsAt: '2026-08-02T05:59:59-06:00',
    showAfterMs: 1600,
    dismissForMs: 36 * 60 * 60 * 1000,
    whatsapp: 'Hola, quiero reservar la edición especial del Día de la Novia de ANTOJO. ¿Me comparten disponibilidad, sabores y opciones de entrega?',
    assets: {
      mobile: '/renders/antojo-dia-novia-close.jpg?v=20260727-4',
      tablet: '/renders/antojo-dia-novia-angle.jpg?v=20260727-4',
      desktop: '/renders/antojo-dia-novia-front.jpg?v=20260727-4'
    }
  };

  const $ = (selector, root = document) => root?.querySelector(selector) || null;
  const $$ = (selector, root = document) => root ? [...root.querySelectorAll(selector)] : [];

  function get(storage, key) {
    try { return storage.getItem(key); } catch { return null; }
  }

  function set(storage, key, value) {
    try { storage.setItem(key, value); } catch {}
  }

  function active() {
    return Date.now() <= new Date(CAMPAIGN.endsAt).getTime();
  }

  function picture() {
    return `
      <picture class="novia-modal__picture">
        <source media="(max-width:559px)" srcset="${CAMPAIGN.assets.mobile}" type="image/jpeg">
        <source media="(max-width:959px)" srcset="${CAMPAIGN.assets.tablet}" type="image/jpeg">
        <img src="${CAMPAIGN.assets.desktop}" alt="Caja de regalo ANTOJO. con bebida, flores y dedicatoria." width="900" height="1200" loading="eager" fetchpriority="high" decoding="async">
      </picture>`;
  }

  function injectCard() {
    $('#noviaHomeCard')?.remove();
    if (!active()) return;
    const lead = $('.home-lead');
    if (!lead) return;
    const card = document.createElement('button');
    card.id = 'noviaHomeCard';
    card.className = 'novia-home-card';
    card.type = 'button';
    card.dataset.noviaOpen = '';
    card.innerHTML = `
      <span class="novia-home-card__date"><b>01</b><small>AGO</small></span>
      <span class="novia-home-card__copy"><small>EDICIÓN LIMITADA</small><strong>Bebida + flor + dedicatoria</strong></span>
      <span class="novia-home-card__price"><strong>${CAMPAIGN.price}</strong><small>Ver edición →</small></span>`;
    lead.insertAdjacentElement('afterend', card);
  }

  function injectModal() {
    $('#noviaModal')?.remove();
    if (!active()) return;
    const modal = document.createElement('div');
    modal.className = 'novia-modal';
    modal.id = 'noviaModal';
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="novia-modal__backdrop" data-novia-close></div>
      <section class="novia-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="noviaTitle" aria-describedby="noviaDescription">
        <button class="novia-modal__close" type="button" data-novia-close aria-label="Cerrar">×</button>
        <div class="novia-modal__visual">${picture()}<span>EDICIÓN 01 · 2026</span></div>
        <div class="novia-modal__content">
          <p class="novia-modal__eyebrow">DÍA DE LA NOVIA · 1 DE AGOSTO</p>
          <h2 id="noviaTitle">${CAMPAIGN.title}</h2>
          <p id="noviaDescription">${CAMPAIGN.description}</p>
          <dl class="novia-modal__meta">
            <div><dt>Precio</dt><dd>${CAMPAIGN.price}</dd></div>
            <div><dt>Disponibilidad</dt><dd>100 piezas</dd></div>
          </dl>
          <p class="novia-modal__availability">${CAMPAIGN.availability}. Envío por separado y sujeto a cobertura.</p>
          <div class="novia-modal__actions">
            <a class="novia-modal__primary" href="#" data-whatsapp="${CAMPAIGN.whatsapp}">Reservar por WhatsApp</a>
            <button class="novia-modal__secondary" type="button" data-novia-close>Seguir explorando</button>
          </div>
        </div>
      </section>`;
    document.body.appendChild(modal);
  }

  let previousFocus = null;

  function open(source = 'manual') {
    const modal = $('#noviaModal');
    if (!modal) return;
    previousFocus = document.activeElement;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('novia-modal-open');
    set(sessionStorage, `${CAMPAIGN.id}:seen`, '1');
    requestAnimationFrame(() => modal.classList.add('is-open'));
    setTimeout(() => $('.novia-modal__close', modal)?.focus(), 30);
    window.antojoTrack?.('open_novia_campaign', { source });
  }

  function close(reason = 'dismiss') {
    const modal = $('#noviaModal');
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('novia-modal-open');
    if (reason === 'dismiss') set(localStorage, `${CAMPAIGN.id}:dismissed-at`, String(Date.now()));
    setTimeout(() => {
      modal.hidden = true;
      previousFocus?.focus?.();
    }, matchMedia('(prefers-reduced-motion:reduce)').matches ? 0 : 200);
  }

  function shouldAutoOpen() {
    if (!active()) return false;
    if (get(sessionStorage, `${CAMPAIGN.id}:seen`)) return false;
    const dismissedAt = Number(get(localStorage, `${CAMPAIGN.id}:dismissed-at`) || 0);
    return !dismissedAt || Date.now() - dismissedAt > CAMPAIGN.dismissForMs;
  }

  function bind() {
    document.addEventListener('click', event => {
      const opener = event.target.closest?.('[data-novia-open]');
      if (opener) {
        event.preventDefault();
        open(opener.closest('.announcement-bar') ? 'announcement' : 'home');
        return;
      }
      const closer = event.target.closest?.('[data-novia-close]');
      if (closer) {
        event.preventDefault();
        close('dismiss');
      }
    });

    document.addEventListener('keydown', event => {
      const modal = $('#noviaModal');
      if (!modal || modal.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        close('dismiss');
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = $$('a[href],button:not([disabled])', modal);
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

  function start() {
    injectCard();
    injectModal();
    bind();
    if (shouldAutoOpen()) setTimeout(() => open('automatic'), CAMPAIGN.showAfterMs);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
