(() => {
  'use strict';

  const TICKERS = {
    inicio: [
      { text: 'Edición Día de la Novia · 1 AGO · $219 · reserva limitada', campaign: true },
      { text: '¡Ya somos +16K en Instagram!' },
      { text: '18 sabores · con y sin alcohol' },
      { text: 'Entregas de viernes a domingo en CDMX' }
    ],
    menu: [
      { text: 'Edición Día de la Novia · 1 AGO · $219 · reserva limitada', campaign: true },
      { text: 'Favoritos: mojito mariposa · espresso horchata · maracuyá' },
      { text: 'Paquetes desde 50 hasta +500 bebidas' },
      { text: 'Recoge en WTC o calcula entrega con tu código postal' }
    ],
    evento: [
      { text: 'Edición Día de la Novia · 1 AGO · $219 · reserva limitada', campaign: true },
      { text: 'Bodas · cumpleaños · oficinas · activaciones' },
      { text: 'Personalización disponible desde 50 piezas' },
      { text: 'Fechas sujetas a disponibilidad' }
    ],
    dinamicas: [
      { text: 'Edición Día de la Novia · 1 AGO · $219 · reserva limitada', campaign: true },
      { text: 'Deja tu reseña en Google y desbloquea una bebida' },
      { text: 'Etiqueta a @antojo.bebidas en tu foto' },
      { text: 'Contenido real de la comunidad ANTOJO.' }
    ],
    recompensas: [
      { text: 'Edición Día de la Novia · 1 AGO · $219 · reserva limitada', campaign: true },
      { text: '5 compras · 1 recompensa' },
      { text: 'Acumula sellos con ANTOJO. Club' },
      { text: 'Tu quinto antojo viene con premio' }
    ]
  };

  const normalizeRoute = value => {
    const route = String(value || '').replace(/^#\/?/, '').trim();
    return Object.prototype.hasOwnProperty.call(TICKERS, route) ? route : 'inicio';
  };

  const currentRoute = () => normalizeRoute(location.hash);

  function normalizeStats() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const next = node.nodeValue
        .replace(/¡Ya somos 15K en Instagram!/g, '¡Ya somos +16K en Instagram!')
        .replace(/15K\+/g, '+16K');
      if (next !== node.nodeValue) node.nodeValue = next;
    });
  }

  function itemMarkup(item) {
    const tag = item.campaign ? 'button' : 'span';
    const attributes = item.campaign ? ' type="button" data-novia-open' : '';
    const campaignClass = item.campaign ? ' announcement-item--campaign' : '';
    return `<${tag}${attributes} class="announcement-item${campaignClass}"><i aria-hidden="true"></i><strong>${item.text}</strong></${tag}>`;
  }

  function startAnimation(track, group) {
    track._loopAnimation?.cancel();
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;
    const shift = Math.ceil(group.scrollWidth);
    if (!shift) return;
    const duration = Math.max(18000, (shift / 78) * 1000);
    track._loopAnimation = track.animate(
      [{ transform: 'translate3d(0,0,0)' }, { transform: `translate3d(-${shift}px,0,0)` }],
      { duration, iterations: Infinity, easing: 'linear' }
    );
  }

  function render(route = currentRoute()) {
    const track = document.querySelector('#announcementTrack');
    const live = document.querySelector('#announcementLive');
    if (!track) return;

    const messages = TICKERS[route] || TICKERS.inicio;
    const baseHtml = messages.map(itemMarkup).join('');
    track._loopAnimation?.cancel();
    track.replaceChildren();
    track.dataset.system = 'v2';

    const group = document.createElement('div');
    group.className = 'announcement-group';
    group.dataset.system = 'v2';
    group.innerHTML = baseHtml;
    track.appendChild(group);

    const targetWidth = Math.max(window.innerWidth * 1.4, 1500);
    const initialWidth = Math.max(1, group.scrollWidth);
    const repeats = Math.max(1, Math.ceil(targetWidth / initialWidth));
    if (repeats > 1) group.innerHTML = baseHtml.repeat(repeats);

    const clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
    if (live) live.textContent = messages.map(item => item.text).join('. ');
    requestAnimationFrame(() => startAnimation(track, group));
  }

  function scheduleRender() {
    clearTimeout(scheduleRender.timer);
    scheduleRender.timer = setTimeout(() => render(), 0);
  }

  function start() {
    normalizeStats();
    render();

    const track = document.querySelector('#announcementTrack');
    if (track) {
      const observer = new MutationObserver(() => {
        const valid = track.dataset.system === 'v2' && track.querySelector('.announcement-item--campaign');
        if (!valid) scheduleRender();
      });
      observer.observe(track, { childList: true, subtree: true, characterData: true });
    }

    window.addEventListener('hashchange', scheduleRender);
    window.addEventListener('popstate', scheduleRender);
    window.addEventListener('resize', () => {
      clearTimeout(start.resizeTimer);
      start.resizeTimer = setTimeout(render, 220);
    }, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
