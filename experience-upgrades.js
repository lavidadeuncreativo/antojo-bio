(() => {
  'use strict';

  const TICKERS = {
    inicio: [
      'Bebidas frías en lata · hechas en CDMX',
      'Pedidos personales, eventos y marcas',
      '18 sabores · con y sin alcohol',
      'Entregas de viernes a domingo en CDMX'
    ],
    menu: [
      'El precio se calcula por la cantidad total',
      'Personalización desde 50 piezas · costo por cotizar',
      'Indica si es para ti, una boda, cumpleaños o empresa',
      'Recoge en WTC o calcula entrega con tu código postal'
    ],
    evento: [
      'Bodas · cumpleaños · reuniones · corporativos',
      'Define personas, fecha y lugar antes de elegir sabores',
      'Personalización desde 50 piezas · costo por cotizar',
      'Barra, catering y logística se cotizan aparte'
    ],
    dinamicas: [
      'Etiqueta a @antojo.bebidas en tu foto',
      'Contenido real de la comunidad ANTOJO.',
      'Consulta vigencia y bases de cada dinámica'
    ],
    recompensas: [
      '5 compras · 1 recompensa',
      'Registra cada pedido con tu número de WhatsApp',
      'ANTOJO. Club está en etapa piloto'
    ]
  };

  const SOCIAL_POSTS = [
    ['/renders/03_mojito_clasico_te_de_mariposa.png', 'El morado que siempre termina en foto.'],
    ['/renders/05_horchata_espresso.png', 'Horchata + espresso. Sí se antoja.'],
    ['/renders/09_maracuya.png', 'Un antojo tropical listo para tomar.'],
    ['/renders/13_mezcalita_de_jamaica.png', 'Jamaica, limón y mezcal.'],
    ['/renders/04_horchata.png', 'La cremosa que se acaba primero.'],
    ['/renders/02_mojito_clasico.png', 'El clásico para compartir.']
  ];

  const route = () => {
    const value = String(location.hash || '').replace(/^#\/?/, '').trim();
    return Object.prototype.hasOwnProperty.call(TICKERS, value) ? value : 'inicio';
  };

  function track(name, data = {}) {
    const safe = Object.fromEntries(Object.entries(data).filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value)).slice(0, 5));
    try { if (typeof window.va === 'function') window.va('event', { name, data: safe }); } catch {}
    try { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: name, ...safe }); } catch {}
  }
  window.antojoTrack = track;

  function item(text) {
    return `<span class="announcement-item"><i aria-hidden="true"></i><strong>${text}</strong></span>`;
  }

  function startLoop(trackNode, groupNode, speed = 76) {
    if (!trackNode || !groupNode) return;
    trackNode._loopAnimation?.cancel();
    const shift = Math.ceil(groupNode.scrollWidth);
    if (!shift) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = Math.max(reduced ? 60000 : 18000, (shift / speed) * 1000);
    trackNode._loopAnimation = trackNode.animate(
      [{ transform: 'translate3d(0,0,0)' }, { transform: `translate3d(-${shift}px,0,0)` }],
      { duration, iterations: Infinity, easing: 'linear' }
    );
  }

  function buildLoop(trackNode, html, className, speed) {
    if (!trackNode) return;
    trackNode._loopAnimation?.cancel();
    trackNode.replaceChildren();
    const group = document.createElement('div');
    group.className = className;
    group.innerHTML = html;
    trackNode.appendChild(group);
    const target = Math.max(window.innerWidth * 1.35, 1400);
    const width = Math.max(1, group.scrollWidth);
    const repeats = Math.max(1, Math.ceil(target / width));
    if (repeats > 1) group.innerHTML = html.repeat(repeats);
    const clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    trackNode.appendChild(clone);
    requestAnimationFrame(() => startLoop(trackNode, group, speed));
  }

  function renderTicker(current = route()) {
    const messages = TICKERS[current] || TICKERS.inicio;
    buildLoop(document.querySelector('#announcementTrack'), messages.map(item).join(''), 'announcement-group', 78);
    const live = document.querySelector('#announcementLive');
    if (live) live.textContent = messages.join('. ');
  }

  function socialCard([image, caption]) {
    return `<a class="social-post" href="https://www.instagram.com/antojo.bebidas/" target="_blank" rel="noopener" data-instagram-post>
      <span class="social-post__visual"><img src="${image}" alt="${caption}" loading="lazy" decoding="async"><i>Ver en Instagram ↗</i></span>
      <strong>${caption}</strong><small>@antojo.bebidas</small>
    </a>`;
  }

  function renderSocial() {
    buildLoop(document.querySelector('#socialTrack'), SOCIAL_POSTS.map(socialCard).join(''), 'social-group', 38);
  }

  function sync(current = route()) {
    renderTicker(current);
    if (current === 'dinamicas') renderSocial();
    else document.querySelector('#socialTrack')?._loopAnimation?.pause();
    track('view_section', { section: current });
  }

  function bindAnalytics() {
    document.addEventListener('click', event => {
      const routeTarget = event.target.closest('[data-route]');
      if (routeTarget) return track('navigate', { from: route(), to: routeTarget.dataset.route || '' });
      const packageButton = event.target.closest('[data-package]');
      if (packageButton) return track('select_package', { quantity: Number(packageButton.dataset.package) || 0 });
      const purpose = event.target.closest('[data-order-purpose]');
      if (purpose) return track('select_order_purpose', { purpose: purpose.dataset.orderPurpose || '' });
      const fulfillment = event.target.closest('[data-fulfillment]');
      if (fulfillment) return track('select_fulfillment', { method: fulfillment.dataset.fulfillment || '' });
      const quantity = event.target.closest('[data-qty-id]');
      if (quantity) return track(Number(quantity.dataset.delta) > 0 ? 'add_product' : 'remove_product', { product: quantity.dataset.qtyId || '' });
      if (event.target.closest('[data-selection-toggle]')) return track('open_order_summary', { section: route() });
      if (event.target.closest('[data-send-selection]')) return track('send_order_whatsapp', { section: route() });
      if (event.target.closest('#eventQuoteDirect')) return track('send_event_quote_whatsapp', {});
      if (event.target.closest('#eventNext')) return track('advance_event_flow', {});
      if (event.target.closest('[data-faq-open]')) return track('open_faq', { section: route() });
      if (event.target.closest('[data-whatsapp]')) return track('click_whatsapp', { section: route() });
    }, true);
  }

  function start() {
    renderTicker();
    bindAnalytics();
    window.addEventListener('antojo:route', event => sync(event.detail?.route || route()));
    window.addEventListener('hashchange', () => sync());
    window.addEventListener('resize', () => renderTicker());
    document.addEventListener('visibilitychange', () => {
      document.querySelectorAll('.announcement-track,.social-track').forEach(node => {
        if (!node._loopAnimation) return;
        if (document.hidden) node._loopAnimation.pause();
        else node._loopAnimation.play();
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
