(() => {
  'use strict';

  const TICKERS = {
    inicio: [
      '¡Ya somos 15K en Instagram!',
      'Pedidos del 22 al 31 de julio participan por un pack doble',
      '18 sabores · con y sin alcohol',
      'Entregas sábados y domingos en CDMX'
    ],
    menu: [
      'Elige entre 18 sabores',
      'Agrega cantidades y revisa tu pedido sin salir del menú',
      'Precios por volumen desde $65',
      '¿No sabes qué elegir? Escríbenos por WhatsApp'
    ],
    evento: [
      'Latas personalizadas desde 50 piezas',
      'Bodas · cumpleaños · oficinas · activaciones',
      'Cotiza tu idea en tres pasos',
      'Fechas sujetas a disponibilidad'
    ],
    dinamicas: [
      'Una bebida también puede ser contenido',
      'Dinámicas para invitados, equipos y marcas',
      'Latas con frases y diseños personalizados',
      'Cuéntanos tu idea y la aterrizamos contigo'
    ],
    recompensas: [
      '5 compras · 1 recompensa',
      'Registra cada pedido con tu número de WhatsApp',
      'Acumula sellos con ANTOJO. Club',
      'Vuelve, desbloquea y disfruta'
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
        .slice(0, 2)
    );

    try {
      if (typeof window.va === 'function') {
        window.va('event', { name, data: safeData });
      }
    } catch {
      // Analytics must never interrupt the purchase experience.
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

  function renderTicker(route = currentRoute()) {
    const trackNode = document.querySelector('#announcementTrack');
    const liveNode = document.querySelector('#announcementLive');
    if (!trackNode) return;

    const messages = TICKERS[route] || TICKERS.inicio;
    const group = messages.map(tickerItem).join('');
    trackNode.innerHTML = `<div class="announcement-group">${group}</div><div class="announcement-group" aria-hidden="true">${group}</div>`;
    trackNode.style.setProperty('--ticker-duration', `${Math.max(22, messages.join(' ').length / 5.5)}s`);
    if (liveNode) liveNode.textContent = messages.join('. ');
  }

  function trackSectionView(route) {
    track('view_section', { section: route });
  }

  function bindAnalytics() {
    document.addEventListener('click', event => {
      const origin = currentRoute();
      const routeTarget = event.target.closest('[data-route]');
      if (routeTarget) {
        const destination = normalizeRoute(routeTarget.dataset.route);
        track(ROUTE_EVENTS[destination] || 'navigate', { from: origin, to: destination });
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
        track(completes ? 'complete_event_quote' : 'continue_event_quote', {
          section: origin
        });
      }
    }, { passive: true });
  }

  function syncRoute() {
    const route = currentRoute();
    renderTicker(route);
    trackSectionView(route);
  }

  function start() {
    renderTicker();
    bindAnalytics();
    trackSectionView(currentRoute());
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
