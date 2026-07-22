(() => {
  'use strict';

  const CONFIG = {
    whatsappNumber: '525522026291',
    instagram: 'https://www.instagram.com/antojo.bebidas/'
  };

  const ROUTE_LABELS = {
    inicio: 'Inicio',
    menu: 'Menú',
    evento: 'Evento',
    dinamicas: 'Dinámicas',
    recompensas: 'Recompensas'
  };

  const ASSETS = {
    margarita: '/renders/01_margarita.png',
    mojito: '/renders/02_mojito_clasico.png',
    mariposa: '/renders/03_mojito_clasico_te_de_mariposa.png',
    horchata: '/renders/04_horchata.png',
    espresso: '/renders/05_horchata_espresso.png',
    americano: '/renders/06_americano.png',
    pepino: '/renders/07_pepino_limon.png',
    clericot: '/renders/08_clericot.png',
    maracuya: '/renders/09_maracuya.png',
    latte: '/renders/10_latte.png',
    coldBrew: '/renders/11_cold_brew_vainilla.png',
    carajillo: '/renders/12_carajillo.png',
    jamaica: '/renders/13_mezcalita_de_jamaica.png'
  };

  const PRODUCTS = [
    { id: 'mojito-clasico', name: 'Mojito clásico', category: 'alcohol', categoryName: 'Con alcohol', description: 'Limón, hierbabuena y mezcal. Fresco, verde y fácil de querer.', image: ASSETS.mojito, facts: ['330 ml', 'Mezcal', 'Cítrico'] },
    { id: 'mojito-mariposa', name: 'Mojito mariposa', category: 'alcohol', categoryName: 'Con alcohol', description: 'Té de mariposa, limón, hierbabuena y mezcal. Morado, cítrico y muy de foto.', image: ASSETS.mariposa, facts: ['330 ml', 'Mezcal', 'Favorito'] },
    { id: 'mezcalita-jamaica', name: 'Mezcalita de jamaica', category: 'alcohol', categoryName: 'Con alcohol', description: 'Jamaica ácida, limón y mezcal para brindar rico.', image: ASSETS.jamaica, facts: ['330 ml', 'Mezcal', 'Ácida'] },
    { id: 'margarita-mezcal', name: 'Margarita de mezcal', category: 'alcohol', categoryName: 'Con alcohol', description: 'Cítrica, brillante y con ese toque ahumado que despierta el antojo.', image: ASSETS.margarita, facts: ['330 ml', 'Mezcal', 'Cítrica'] },
    { id: 'pepino-mezcal', name: 'Pepino-limón con mezcal', category: 'alcohol', categoryName: 'Con alcohol', description: 'Pepino, limón y hierbabuena. Fresca como primer trago.', image: ASSETS.pepino, facts: ['330 ml', 'Mezcal', 'Muy fresca'] },
    { id: 'maracuya-mezcal', name: 'Maracuyá con mezcal', category: 'alcohol', categoryName: 'Con alcohol', description: 'Tropical, ácida y jugosa. Sabe a plan que se puso bueno.', image: ASSETS.maracuya, facts: ['330 ml', 'Mezcal', 'Tropical'] },
    { id: 'clericot', name: 'Clericot', category: 'alcohol', categoryName: 'Con alcohol', description: 'Frutal, suave y perfecto para mesa de bebidas o brindis.', image: ASSETS.clericot, facts: ['330 ml', 'Frutal', 'Suave'] },
    { id: 'carajillo', name: 'Carajillo', category: 'alcohol', categoryName: 'Con alcohol', description: 'Café frío con toque adulto para cerrar rico.', image: ASSETS.carajillo, facts: ['330 ml', 'Café', 'Con alcohol'] },
    { id: 'mojito-mocktail', name: 'Mojito clásico mocktail', category: 'sin-alcohol', categoryName: 'Sin alcohol', description: 'El clásico fresco de limón y hierbabuena, sin alcohol.', image: ASSETS.mojito, facts: ['330 ml', 'Sin alcohol', 'Cítrico'] },
    { id: 'mariposa-mocktail', name: 'Mojito mariposa mocktail', category: 'sin-alcohol', categoryName: 'Sin alcohol', description: 'Color inesperado, sabor fresco y cero alcohol.', image: ASSETS.mariposa, facts: ['330 ml', 'Sin alcohol', 'Morado'] },
    { id: 'jamaica-limon', name: 'Jamaica-limón', category: 'sin-alcohol', categoryName: 'Sin alcohol', description: 'Ácida, fría y mexicana. Una lata que se acaba rápido.', image: ASSETS.jamaica, facts: ['330 ml', 'Sin alcohol', 'Ácida'] },
    { id: 'pepino-limon', name: 'Pepino-limón', category: 'sin-alcohol', categoryName: 'Sin alcohol', description: 'Ligera, verde y muy fresca para repetir sin pensarlo.', image: ASSETS.pepino, facts: ['330 ml', 'Sin alcohol', 'Ligera'] },
    { id: 'maracuya-limon', name: 'Maracuyá-limón', category: 'sin-alcohol', categoryName: 'Sin alcohol', description: 'Tropical y brillante, con acidez bonita y final fresco.', image: ASSETS.maracuya, facts: ['330 ml', 'Sin alcohol', 'Tropical'] },
    { id: 'horchata', name: 'Horchata clásica', category: 'cafe', categoryName: 'Café y cremosas', description: 'Cremosa, con vainilla y canela. Sabe a postre frío.', image: ASSETS.horchata, facts: ['330 ml', 'Cremosa', 'Con lácteos'] },
    { id: 'espresso-horchata', name: 'Espresso horchata', category: 'cafe', categoryName: 'Café y cremosas', description: 'Café y horchata en una lata. Favorita para sobremesa.', image: ASSETS.espresso, facts: ['330 ml', 'Café', 'Con lácteos'] },
    { id: 'americano', name: 'Americano frío', category: 'cafe', categoryName: 'Café y cremosas', description: 'Café frío, directo y ligero para levantar el plan.', image: ASSETS.americano, facts: ['330 ml', 'Café', 'Sin lácteos'] },
    { id: 'cold-brew', name: 'Cold brew vainilla', category: 'cafe', categoryName: 'Café y cremosas', description: 'Café frío con vainilla: suave, aromático y listo para llevar.', image: ASSETS.coldBrew, facts: ['330 ml', 'Café', 'Vainilla'] },
    { id: 'latte', name: 'Latte frío', category: 'cafe', categoryName: 'Café y cremosas', description: 'Cremoso, frío y amable. El café que se antoja lento.', image: ASSETS.latte, facts: ['330 ml', 'Café', 'Con lácteos'] }
  ];

  const FILTERS = [
    ['all', 'Todo'],
    ['alcohol', 'Con alcohol'],
    ['sin-alcohol', 'Sin alcohol'],
    ['cafe', 'Café y cremosas']
  ];

  const state = {
    route: 'inicio',
    filter: 'all',
    search: '',
    quantities: loadQuantities(),
    event: {
      step: 1,
      type: '',
      guests: 50,
      servings: 1.5,
      personalized: false,
      name: '',
      date: '',
      place: '',
      notes: ''
    }
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value = '') => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[character]);

  function loadQuantities() {
    try {
      const parsed = JSON.parse(localStorage.getItem('antojo-selection-v13') || localStorage.getItem('antojo-selection-v12') || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveQuantities() {
    try {
      localStorage.setItem('antojo-selection-v13', JSON.stringify(state.quantities));
    } catch {
      // The menu still works when storage is unavailable.
    }
  }

  function whatsappUrl(message) {
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  function openWhatsApp(message) {
    const url = whatsappUrl(message);
    const popup = window.open(url, '_blank', 'noopener,noreferrer');
    if (!popup) window.location.href = url;
  }

  function toast(message) {
    const node = $('#toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('is-visible');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove('is-visible'), 2600);
  }

  function finishLoader() {
    const loader = $('#loader');
    if (!loader) return;
    loader.classList.add('is-hidden');
    document.documentElement.classList.remove('is-loading');
    document.documentElement.classList.add('is-ready');
  }

  function bootLoader() {
    const started = performance.now();
    const complete = () => setTimeout(finishLoader, Math.max(0, 800 - (performance.now() - started)));
    if (document.readyState === 'complete') complete();
    else window.addEventListener('load', complete, { once: true });
    setTimeout(finishLoader, 2000);
  }

  function normalizeRoute(value) {
    const route = String(value || '').replace(/^#\/?/, '').trim();
    return Object.prototype.hasOwnProperty.call(ROUTE_LABELS, route) ? route : 'inicio';
  }

  function setActiveNavigation(route) {
    $$('.mobile-nav [data-route], .drawer [data-route]').forEach(item => {
      const active = item.dataset.route === route;
      item.classList.toggle('is-active', active);
      if (active) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
    const indicator = $('#routeIndicator');
    if (indicator) indicator.textContent = ROUTE_LABELS[route];
  }

  function navigate(route, updateHash = true) {
    const next = normalizeRoute(route);
    state.route = next;
    $$('.view').forEach(view => view.classList.toggle('is-active', view.dataset.view === next));
    setActiveNavigation(next);
    closeDrawer();
    closeSelectionPanel();
    if (next === 'menu') renderMenu();
    if (next === 'evento') renderEvent();
    if (updateHash && location.hash !== `#${next}`) history.pushState(null, '', `#${next}`);
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  function openDrawer() {
    $('#drawer')?.classList.add('is-open');
    $('#drawerBackdrop')?.classList.add('is-open');
    $('#menuButton')?.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    $('#drawer')?.classList.remove('is-open');
    $('#drawerBackdrop')?.classList.remove('is-open');
    $('#menuButton')?.setAttribute('aria-expanded', 'false');
  }

  function openSelectionPanel() {
    if (!selectionTotal()) return;
    $('#orderPanel')?.classList.add('is-open');
    $('#selectionBackdrop')?.classList.add('is-open');
  }

  function closeSelectionPanel() {
    $('#orderPanel')?.classList.remove('is-open');
    $('#selectionBackdrop')?.classList.remove('is-open');
  }

  function unitPrice(total) {
    if (total <= 5) return 65;
    if (total <= 10) return 60;
    if (total <= 20) return 58;
    if (total <= 49) return 55;
    if (total <= 99) return 53;
    if (total <= 149) return 52;
    return 50;
  }

  function selectionItems() {
    return PRODUCTS.map(product => ({ ...product, quantity: Number(state.quantities[product.id] || 0) })).filter(item => item.quantity > 0);
  }

  function selectionTotal() {
    return selectionItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  function updateQuantity(id, delta) {
    const next = Math.max(0, Math.min(999, Number(state.quantities[id] || 0) + delta));
    if (next === 0) delete state.quantities[id];
    else state.quantities[id] = next;
    saveQuantities();
    renderMenu();
  }

  function clearSelection() {
    state.quantities = {};
    saveQuantities();
    closeSelectionPanel();
    renderMenu();
    toast('Tu selección quedó vacía.');
  }

  function renderFilters() {
    $('#filters').innerHTML = FILTERS.map(([id, label]) => `<button type="button" class="${state.filter === id ? 'is-active' : ''}" data-filter="${id}">${label}</button>`).join('');
  }

  function filteredProducts() {
    const query = state.search.toLowerCase().trim();
    return PRODUCTS.filter(product => {
      const categoryMatches = state.filter === 'all' || product.category === state.filter;
      const haystack = `${product.name} ${product.categoryName} ${product.description} ${product.facts.join(' ')}`.toLowerCase();
      return categoryMatches && (!query || haystack.includes(query));
    });
  }

  function renderMenu() {
    renderFilters();
    const input = $('#menuSearch');
    if (input && input.value !== state.search) input.value = state.search;
    const products = filteredProducts();

    $('#productList').innerHTML = products.length ? products.map((product, index) => {
      const quantity = Number(state.quantities[product.id] || 0);
      return `<article class="product-row">
        <span class="product-row__number">${String(index + 1).padStart(2, '0')}</span>
        <div class="product-row__main">
          <div class="product-row__image"><img src="${product.image}" alt="Lata de ${esc(product.name)}" loading="lazy"></div>
          <div><h3>${esc(product.name)}</h3><p>${esc(product.description)}</p></div>
        </div>
        <div class="product-row__facts">${product.facts.map(fact => `<span>${esc(fact)}</span>`).join('')}</div>
        <div class="product-row__action">
          <span class="product-row__price">Desde $65 c/u</span>
          <div class="qty" aria-label="Cantidad de ${esc(product.name)}">
            <button type="button" data-qty-id="${product.id}" data-delta="-1" aria-label="Quitar una">−</button>
            <span>${quantity}</span>
            <button type="button" data-qty-id="${product.id}" data-delta="1" aria-label="Agregar una">+</button>
          </div>
        </div>
      </article>`;
    }).join('') : '<div class="empty-menu"><h3>No encontramos ese antojo.</h3><p>Prueba con otra palabra o categoría.</p></div>';

    renderSelection();
  }

  function renderSelection() {
    const summary = $('#selectionSummary');
    const bar = $('#selectionBar');
    const items = selectionItems();
    const total = selectionTotal();

    if (!total) {
      summary.innerHTML = '<div class="selection-empty"><div><span>+</span><h4>Todavía no eliges bebidas.</h4><p>Usa los botones de cantidad y tu selección aparecerá aquí.</p></div></div>';
      bar.classList.remove('is-visible');
      bar.innerHTML = '';
      return;
    }

    const price = unitPrice(total);
    const subtotal = total * price;
    summary.innerHTML = `<div class="selection-items">${items.map(item => `<article class="selection-item"><img src="${item.image}" alt=""><div><b>${esc(item.name)}</b><small>${esc(item.categoryName)}</small></div><div class="qty"><button type="button" data-qty-id="${item.id}" data-delta="-1" aria-label="Quitar una">−</button><span>${item.quantity}</span><button type="button" data-qty-id="${item.id}" data-delta="1" aria-label="Agregar una">+</button></div></article>`).join('')}</div><div class="selection-totals"><div class="selection-total-row"><span>Bebidas</span><b>${total}</b></div><div class="selection-total-row"><span>Precio estimado</span><b>$${price} c/u</b></div><div class="selection-total-row selection-total-row--strong"><span>Subtotal</span><b>$${subtotal.toLocaleString('es-MX')} MXN</b></div><div class="selection-actions"><button class="selection-actions__primary" type="button" data-send-selection>Enviar pedido por WhatsApp</button><button class="selection-actions__secondary" type="button" data-clear-selection>Vaciar selección</button></div></div>`;
    bar.innerHTML = `<p><b>${total} ${total === 1 ? 'bebida' : 'bebidas'} · $${price} c/u</b>Estimado: $${subtotal.toLocaleString('es-MX')} MXN</p><button type="button" data-selection-toggle>Ver selección</button>`;
    bar.classList.add('is-visible');
  }

  function selectionMessage() {
    const items = selectionItems();
    const total = selectionTotal();
    const price = unitPrice(total);
    return `Hola, quiero pedir ANTOJO.\n\nMi selección:\n${items.map(item => `${item.quantity} × ${item.name}`).join('\n')}\n\nTotal: ${total} bebidas\nPrecio estimado: $${price} c/u\nSubtotal estimado: $${(total * price).toLocaleString('es-MX')} MXN\n\n¿Me ayudan a confirmar disponibilidad, fecha de entrega y envío?`;
  }

  function suggestedQuantity() {
    return Math.ceil(Number(state.event.guests || 0) * Number(state.event.servings || 1));
  }

  function syncEventInputs() {
    [['#guestCount', 'guests'], ['#servings', 'servings']].forEach(([selector, key]) => {
      const node = $(selector);
      if (node) state.event[key] = Number(node.value) || 1;
    });
    const personalized = $('#personalized');
    if (personalized) state.event.personalized = personalized.checked;
    [['#contactName', 'name', 100], ['#eventDate', 'date', 20], ['#eventPlace', 'place', 180], ['#eventNotes', 'notes', 800]].forEach(([selector, key, max]) => {
      const node = $(selector);
      if (node) state.event[key] = node.value.trim().slice(0, max);
    });
  }

  function renderEvent() {
    const step = state.event.step;
    $$('.form-step').forEach(section => section.classList.toggle('is-active', Number(section.dataset.step) === step));
    $('#eventStepLabel').textContent = `Paso ${step} de 3`;
    $('#eventProgress').style.width = `${step * 33.333}%`;
    $('#eventBack').textContent = step === 1 ? 'Cancelar' : 'Atrás';
    $('#eventNext').textContent = step === 3 ? 'Continuar en WhatsApp' : 'Continuar';
    $('#eventError').textContent = '';
    $$('[data-choice-group="eventType"] button').forEach(button => button.classList.toggle('is-active', button.dataset.value === state.event.type));
    [['#guestCount', 'guests'], ['#servings', 'servings'], ['#contactName', 'name'], ['#eventDate', 'date'], ['#eventPlace', 'place'], ['#eventNotes', 'notes']].forEach(([selector, key]) => {
      const node = $(selector);
      if (node) node.value = state.event[key];
    });
    const personalized = $('#personalized');
    if (personalized) personalized.checked = state.event.personalized;
    updateEventMath();
  }

  function updateEventMath() {
    syncEventInputs();
    const node = $('#suggestedQuantity');
    if (node) node.textContent = `${suggestedQuantity()} latas`;
    renderEventSummary();
  }

  function renderEventSummary() {
    const node = $('#eventSummary');
    if (!node) return;
    node.innerHTML = `<small>RESUMEN DE TU SOLICITUD</small><b>${esc(state.event.type || 'Evento por definir')} · ${suggestedQuantity()} latas</b><span>${state.event.guests} personas · ${state.event.servings} bebida${state.event.servings === 1 ? '' : 's'} por persona · ${state.event.personalized ? 'Latas personalizadas' : 'Presentación ANTOJO.'}<br>${state.event.date ? esc(state.event.date) : 'Fecha por definir'} · ${state.event.place ? esc(state.event.place) : 'Lugar por definir'}</span>`;
  }

  function eventMessage() {
    const event = state.event;
    return `Hola, quiero cotizar un evento con ANTOJO.\n\nNombre: ${event.name || 'Por definir'}\nTipo de evento: ${event.type}\nPersonas: ${event.guests}\nCantidad sugerida: ${suggestedQuantity()} latas\nServicio: ${event.servings} bebida${event.servings === 1 ? '' : 's'} por persona\nPresentación: ${event.personalized ? 'Personalizada' : 'Lata ANTOJO.'}\nFecha: ${event.date || 'Por definir'}\nLugar: ${event.place || 'Por definir'}\nNotas: ${event.notes || 'Sin notas adicionales'}\n\n¿Me ayudan a confirmar opciones, precio y disponibilidad?`;
  }

  function eventNext() {
    syncEventInputs();
    const event = state.event;
    const error = $('#eventError');
    if (event.step === 1 && !event.type) {
      error.textContent = 'Elige el tipo de evento para continuar.';
      return;
    }
    if (event.step === 2 && event.personalized && suggestedQuantity() < 50) {
      error.textContent = 'La personalización está disponible desde 50 piezas. Ajusta la cantidad o desactiva esa opción.';
      return;
    }
    if (event.step === 3) {
      if (event.name.length < 2) {
        error.textContent = 'Escribe tu nombre para que podamos dar seguimiento.';
        return;
      }
      openWhatsApp(eventMessage());
      return;
    }
    event.step += 1;
    renderEvent();
    $('.onboarding-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function eventBack() {
    if (state.event.step === 1) {
      navigate('inicio');
      return;
    }
    state.event.step -= 1;
    renderEvent();
  }

  function bind() {
    document.addEventListener('click', event => {
      const route = event.target.closest('[data-route]');
      if (route) {
        event.preventDefault();
        navigate(route.dataset.route);
        return;
      }
      const whatsapp = event.target.closest('[data-whatsapp]');
      if (whatsapp) {
        event.preventDefault();
        openWhatsApp(whatsapp.dataset.whatsapp);
        return;
      }
      const filter = event.target.closest('[data-filter]');
      if (filter) {
        state.filter = filter.dataset.filter;
        renderMenu();
        return;
      }
      const quantity = event.target.closest('[data-qty-id]');
      if (quantity) {
        updateQuantity(quantity.dataset.qtyId, Number(quantity.dataset.delta));
        return;
      }
      const eventType = event.target.closest('[data-choice-group="eventType"] [data-value]');
      if (eventType) {
        state.event.type = eventType.dataset.value;
        renderEvent();
        return;
      }
      if (event.target.closest('[data-selection-toggle]')) {
        openSelectionPanel();
        return;
      }
      if (event.target.closest('[data-send-selection]')) {
        openWhatsApp(selectionMessage());
        return;
      }
      if (event.target.closest('[data-clear-selection]')) {
        clearSelection();
        return;
      }
      if (event.target.closest('#eventNext')) {
        eventNext();
        return;
      }
      if (event.target.closest('#eventBack')) eventBack();
    });

    $('#menuButton')?.addEventListener('click', () => {
      if ($('#drawer')?.classList.contains('is-open')) closeDrawer();
      else openDrawer();
    });
    $('#drawerBackdrop')?.addEventListener('click', closeDrawer);
    $('#selectionClose')?.addEventListener('click', closeSelectionPanel);
    $('#selectionBackdrop')?.addEventListener('click', closeSelectionPanel);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeDrawer();
        closeSelectionPanel();
      }
    });

    $('#menuSearch')?.addEventListener('input', event => {
      state.search = event.target.value;
      renderMenu();
    });

    ['input', 'change'].forEach(type => {
      $('#guestCount')?.addEventListener(type, updateEventMath);
      $('#servings')?.addEventListener(type, updateEventMath);
      $('#personalized')?.addEventListener(type, updateEventMath);
      $('#contactName')?.addEventListener(type, syncEventInputs);
      $('#eventDate')?.addEventListener(type, () => { syncEventInputs(); renderEventSummary(); });
      $('#eventPlace')?.addEventListener(type, () => { syncEventInputs(); renderEventSummary(); });
      $('#eventNotes')?.addEventListener(type, syncEventInputs);
    });

    window.addEventListener('hashchange', () => navigate(normalizeRoute(location.hash), false));
    window.addEventListener('popstate', () => navigate(normalizeRoute(location.hash), false));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeSelectionPanel();
    });
  }

  function start() {
    bootLoader();
    bind();
    renderMenu();
    renderEvent();
    navigate(normalizeRoute(location.hash), false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
