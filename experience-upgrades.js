(() => {
  'use strict';

  const TICKERS = {
    inicio: [
      '¡Ya somos 15K en Instagram!',
      'Pedidos del 22 al 31 de julio participan por un pack doble',
      '18 sabores · con y sin alcohol',
      'Entregas de viernes a domingo en CDMX'
    ],
    menu: [
      'Elige favoritos o descubre los sabores más pedidos',
      'Arma paquetes de 50, 100 o 150 bebidas',
      'Personalización disponible desde 50 piezas',
      'Recoge en WTC o solicita entrega con tu código postal'
    ],
    evento: [
      'Latas personalizadas desde 50 piezas',
      'Bodas · cumpleaños · oficinas · activaciones',
      'Cotiza tu idea en tres pasos',
      'Fechas sujetas a disponibilidad'
    ],
    dinamicas: [
      'Sube una foto y una reseña para recibir una bebida en tu siguiente pedido',
      'Giveaway: 20 latas · 10 packs dobles',
      'Comparte tu combinación más rara',
      'Contenido real de la comunidad ANTOJO.'
    ],
    recompensas: [
      '5 compras · 1 recompensa',
      'Registra cada pedido con tu número de WhatsApp',
      'Acumula sellos con ANTOJO. Club',
      'Tu quinto antojo viene con premio'
    ]
  };

  const ROUTE_EVENTS = {
    inicio: 'return_home',
    menu: 'open_menu',
    evento: 'open_event_quote',
    dinamicas: 'open_dynamics',
    recompensas: 'open_rewards'
  };

  const normalizeRoute = value => {
    const route = String(value || '').replace(/^#\/?/, '').trim();
    return Object.prototype.hasOwnProperty.call(TICKERS, route) ? route : 'inicio';
  };

  const currentRoute = () => normalizeRoute(location.hash);

  function track(name, data = {}) {
    const safeData = Object.fromEntries(
      Object.entries(data)
        .filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value))
        .slice(0, 3)
    );

    try {
      if (typeof window.va === 'function') window.va('event', { name, data: safeData });
    } catch {
      // Analytics must never interrupt the ordering experience.
    }

    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: name, ...safeData });
    } catch {
      // Optional compatibility layer for a future GA4 installation.
    }
  }

  function tickerItem(text) {
    return `<span class="announcement-item"><i aria-hidden="true"></i><strong>${text}</strong></span>`;
  }

  function measureTicker(trackNode) {
    const firstGroup = trackNode?.querySelector('.announcement-group');
    if (!firstGroup) return;
    const distance = Math.ceil(firstGroup.getBoundingClientRect().width);
    if (!distance) return;
    trackNode.style.setProperty('--ticker-shift', `${distance}px`);
    trackNode.style.setProperty('--ticker-duration', `${Math.max(17, distance / 82).toFixed(2)}s`);
    trackNode.getAnimations().forEach(animation => {
      animation.cancel();
      animation.play();
    });
  }

  function renderTicker(route = currentRoute()) {
    const trackNode = document.querySelector('#announcementTrack');
    const liveNode = document.querySelector('#announcementLive');
    if (!trackNode) return;

    const messages = TICKERS[route] || TICKERS.inicio;
    const group = messages.map(tickerItem).join('');
    trackNode.innerHTML = `<div class="announcement-group">${group}</div><div class="announcement-group" aria-hidden="true">${group}</div><div class="announcement-group" aria-hidden="true">${group}</div>`;
    if (liveNode) liveNode.textContent = messages.join('. ');

    requestAnimationFrame(() => requestAnimationFrame(() => measureTicker(trackNode)));
    if (document.fonts?.ready) document.fonts.ready.then(() => measureTicker(trackNode));
  }

  function syncRoute(route = currentRoute()) {
    renderTicker(route);
    track('view_section', { section: route });
  }

  function bindAnalytics() {
    document.addEventListener('click', event => {
      const origin = currentRoute();
      const routeTarget = event.target.closest('[data-route]');
      if (routeTarget) {
        const destination = normalizeRoute(routeTarget.dataset.route);
        track(ROUTE_EVENTS[destination] || 'navigate', { from: origin, to: destination });
        setTimeout(() => syncRoute(destination), 0);
        return;
      }

      if (event.target.closest('[data-faq-open]')) {
        track('open_faq', { section: origin });
        return;
      }

      const whatsapp = event.target.closest('[data-whatsapp]');
      if (whatsapp) {
        track('click_whatsapp', { section: origin });
        return;
      }

      const filter = event.target.closest('[data-filter]');
      if (filter) {
        track('filter_menu', { filter: filter.dataset.filter || 'all' });
        return;
      }

      const packageButton = event.target.closest('[data-package]');
      if (packageButton) {
        track('select_package', { quantity: Number(packageButton.dataset.package) || 0 });
        return;
      }

      const fulfillment = event.target.closest('[data-fulfillment]');
      if (fulfillment) {
        track('select_fulfillment', { method: fulfillment.dataset.fulfillment || 'pickup' });
        return;
      }

      const quantity = event.target.closest('[data-qty-id]');
      if (quantity) {
        const adding = Number(quantity.dataset.delta) > 0;
        track(adding ? 'add_product' : 'remove_product', {
          product: quantity.dataset.qtyId || 'unknown',
          section: origin
        });
        return;
      }

      if (event.target.closest('[data-selection-toggle]')) {
        track('open_order_summary', { section: origin });
        return;
      }

      if (event.target.closest('[data-send-selection]')) {
        track('send_order_whatsapp', { section: origin });
        return;
      }

      if (event.target.closest('[data-clear-selection]')) {
        track('clear_order', { section: origin });
        return;
      }

      const eventNext = event.target.closest('#eventNext');
      if (eventNext) {
        const completes = eventNext.textContent.toLowerCase().includes('whatsapp');
        track(completes ? 'complete_event_quote' : 'continue_event_quote', { section: origin });
      }
    }, { passive: true });

    document.addEventListener('change', event => {
      if (event.target.matches('#orderPersonalized')) {
        track('toggle_personalization', { enabled: event.target.checked });
      }
    }, { passive: true });
  }

  function start() {
    renderTicker();
    bindAnalytics();
    track('view_section', { section: currentRoute() });
    window.addEventListener('hashchange', () => syncRoute());
    window.addEventListener('popstate', () => syncRoute());
    window.addEventListener('resize', () => {
      clearTimeout(start.resizeTimer);
      start.resizeTimer = setTimeout(() => measureTicker(document.querySelector('#announcementTrack')), 140);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
