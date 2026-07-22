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
      'Paquetes desde 50 hasta 500 bebidas',
      'Personalización por +$10 por lata desde 50 piezas',
      'Recoge en WTC o calcula entrega con tu código postal'
    ],
    evento: [
      'Cotiza todo desde una sola vista',
      'Bodas · cumpleaños · oficinas · activaciones',
      'Personalización disponible desde 50 piezas',
      'Fechas sujetas a disponibilidad'
    ],
    dinamicas: [
      'Deja tu reseña en Google y desbloquea una bebida',
      'Giveaway: 20 latas · 10 packs dobles',
      'Etiqueta a @antojo.bebidas en tu foto',
      'Contenido real de la comunidad ANTOJO.'
    ],
    recompensas: [
      '5 compras · 1 recompensa',
      'Registra cada pedido con tu número de WhatsApp',
      'Acumula sellos con ANTOJO. Club',
      'Tu quinto antojo viene con premio'
    ]
  };

  const SOCIAL_POSTS = [
    ['/renders/03_mojito_clasico_te_de_mariposa.png', 'El morado que siempre termina en foto.'],
    ['/renders/05_horchata_espresso.png', 'Horchata + espresso. Sí se antoja.'],
    ['/renders/09_maracuya.png', 'Un antojo tropical listo para tomar.'],
    ['/renders/13_mezcalita_de_jamaica.png', 'Jamaica, limón y mezcal.'],
    ['/renders/04_horchata.png', 'La cremosa que se acaba primero.'],
    ['/renders/02_mojito_clasico.png', 'El clásico para compartir.'],
    ['/renders/11_cold_brew_vainilla.png', 'Café frío para planes largos.'],
    ['/renders/08_clericot.png', 'Una mesa con color sabe mejor.'],
    ['/renders/07_pepino_limon.png', 'Fresco, verde y muy de repetir.'],
    ['/renders/01_margarita.png', 'Para cuando el antojo pide algo cítrico.']
  ];

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
        .slice(0, 4)
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

  window.antojoTrack = track;

  function tickerItem(text) {
    return `<span class="announcement-item"><i aria-hidden="true"></i><strong>${text}</strong></span>`;
  }

  function startLoop(trackNode, groupNode, pixelsPerSecond = 72) {
    if (!trackNode || !groupNode) return;
    if (trackNode._loopAnimation) trackNode._loopAnimation.cancel();

    const shift = Math.ceil(groupNode.scrollWidth);
    if (!shift) return;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = Math.max(reducedMotion ? 55000 : 17000, (shift / pixelsPerSecond) * 1000);
    trackNode._loopAnimation = trackNode.animate(
      [{ transform: 'translate3d(0,0,0)' }, { transform: `translate3d(-${shift}px,0,0)` }],
      { duration, iterations: Infinity, easing: 'linear' }
    );
  }

  function buildLoop(trackNode, baseHtml, groupClass, pixelsPerSecond) {
    if (!trackNode) return;
    trackNode.innerHTML = `<div class="${groupClass}">${baseHtml}</div>`;
    let group = trackNode.firstElementChild;
    if (!group) return;

    const targetWidth = Math.max(window.innerWidth * 1.25, 1200);
    const firstWidth = Math.max(1, group.scrollWidth);
    const repeats = Math.max(1, Math.ceil(targetWidth / firstWidth));
    group.innerHTML = baseHtml.repeat(repeats);

    const clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    trackNode.appendChild(clone);
    requestAnimationFrame(() => startLoop(trackNode, group, pixelsPerSecond));
  }

  function renderTicker(route = currentRoute()) {
    const trackNode = document.querySelector('#announcementTrack');
    const liveNode = document.querySelector('#announcementLive');
    if (!trackNode) return;
    const messages = TICKERS[route] || TICKERS.inicio;
    buildLoop(trackNode, messages.map(tickerItem).join(''), 'announcement-group', 78);
    if (liveNode) liveNode.textContent = messages.join('. ');
  }

  function socialCard([image, caption]) {
    return `<a class="social-post" href="https://www.instagram.com/antojo.bebidas/" target="_blank" rel="noopener" data-instagram-post>
      <span class="social-post__visual"><img src="${image}" alt="${caption}" loading="lazy"><i>Ver en Instagram ↗</i></span>
      <strong>${caption}</strong>
      <small>@antojo.bebidas</small>
    </a>`;
  }

  function renderSocialLoop() {
    const trackNode = document.querySelector('#socialTrack');
    if (!trackNode) return;
    buildLoop(trackNode, SOCIAL_POSTS.map(socialCard).join(''), 'social-group', 42);
  }

  function syncRoute(route = currentRoute()) {
    renderTicker(route);
    track('view_section', { section: route });
  }

  function bindLoopHover() {
    document.addEventListener('mouseenter', event => {
      const trackNode = event.target.closest?.('.announcement-track,.social-track');
      if (trackNode?._loopAnimation) trackNode._loopAnimation.pause();
    }, true);
    document.addEventListener('mouseleave', event => {
      const trackNode = event.target.closest?.('.announcement-track,.social-track');
      if (trackNode?._loopAnimation) trackNode._loopAnimation.play();
    }, true);
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
      if (event.target.closest('[data-faq-open]')) return track('open_faq', { section: origin });
      if (event.target.closest('[data-google-review]')) return track('open_google_review', { section: origin });
      if (event.target.closest('[data-instagram-post]')) return track('open_instagram_post', { section: origin });
      const whatsapp = event.target.closest('[data-whatsapp]');
      if (whatsapp) return track('click_whatsapp', { section: origin });
      const filter = event.target.closest('[data-filter]');
      if (filter) return track('filter_menu', { filter: filter.dataset.filter || 'all' });
      const packageButton = event.target.closest('[data-package]');
      if (packageButton) return track('select_package', { quantity: Number(packageButton.dataset.package) || 0 });
      const fulfillment = event.target.closest('[data-fulfillment]');
      if (fulfillment) return track('select_fulfillment', { method: fulfillment.dataset.fulfillment || 'pickup' });
      const quantity = event.target.closest('[data-qty-id]');
      if (quantity) {
        const adding = Number(quantity.dataset.delta) > 0;
        return track(adding ? 'add_product' : 'remove_product', { product: quantity.dataset.qtyId || 'unknown', section: origin });
      }
      if (event.target.closest('[data-selection-toggle]')) return track('open_order_summary', { section: origin });
      if (event.target.closest('[data-send-selection]')) return track('send_order_whatsapp', { section: origin });
      if (event.target.closest('[data-clear-selection]')) return track('clear_order', { section: origin });
      const eventNext = event.target.closest('#eventNext');
      if (eventNext) {
        const completes = eventNext.textContent.toLowerCase().includes('whatsapp');
        track(completes ? 'complete_event_quote' : 'continue_event_quote', { section: origin });
      }
    }, { passive: true });

    document.addEventListener('change', event => {
      if (event.target.matches('#orderPersonalized')) track('toggle_personalization', { enabled: event.target.checked });
      if (event.target.matches('[data-qty-input]')) track('type_product_quantity', { product: event.target.dataset.qtyInput || 'unknown', quantity: Number(event.target.value) || 0 });
    }, { passive: true });

    window.addEventListener('antojo:shipping', event => {
      track('calculate_shipping', { fee: Number(event.detail?.fee) || 0 });
    });
  }

  function refreshLoops() {
    renderTicker();
    renderSocialLoop();
  }

  function start() {
    refreshLoops();
    bindLoopHover();
    bindAnalytics();
    track('view_section', { section: currentRoute() });
    window.addEventListener('hashchange', () => syncRoute());
    window.addEventListener('popstate', () => syncRoute());
    window.addEventListener('resize', () => {
      clearTimeout(start.resizeTimer);
      start.resizeTimer = setTimeout(refreshLoops, 180);
    });
    if (document.fonts?.ready) document.fonts.ready.then(refreshLoops);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
