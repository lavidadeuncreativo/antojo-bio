(() => {
  'use strict';

  const CONFIG = {
    whatsappNumber: '525522026291',
    instagram: 'https://www.instagram.com/antojo.bebidas/',
    googleReview: 'https://www.google.com/maps/search/?api=1&query=ANTOJO%20bebidas%20CDMX',
    wtc: { lat: 19.3934, lon: -99.1748 }
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
    { id: 'mojito-clasico', name: 'Mojito clásico', category: 'alcohol', categoryName: 'Con alcohol', description: 'Limón, hierbabuena y mezcal. Fresco, verde y fácil de querer.', image: ASSETS.mojito, facts: ['330 ml', 'Mezcal', 'Cítrico'], favorite: true, popular: true },
    { id: 'mojito-mariposa', name: 'Mojito mariposa', category: 'alcohol', categoryName: 'Con alcohol', description: 'Té de mariposa, limón, hierbabuena y mezcal. Morado, cítrico y muy de foto.', image: ASSETS.mariposa, facts: ['330 ml', 'Mezcal', 'Favorito'], favorite: true, popular: true },
    { id: 'mezcalita-jamaica', name: 'Mezcalita de jamaica', category: 'alcohol', categoryName: 'Con alcohol', description: 'Jamaica ácida, limón y mezcal para brindar rico.', image: ASSETS.jamaica, facts: ['330 ml', 'Mezcal', 'Ácida'], popular: true },
    { id: 'margarita-mezcal', name: 'Margarita de mezcal', category: 'alcohol', categoryName: 'Con alcohol', description: 'Cítrica, brillante y con ese toque ahumado que despierta el antojo.', image: ASSETS.margarita, facts: ['330 ml', 'Mezcal', 'Cítrica'], favorite: true },
    { id: 'pepino-mezcal', name: 'Pepino-limón con mezcal', category: 'alcohol', categoryName: 'Con alcohol', description: 'Pepino, limón y hierbabuena. Fresca como primer trago.', image: ASSETS.pepino, facts: ['330 ml', 'Mezcal', 'Muy fresca'] },
    { id: 'maracuya-mezcal', name: 'Maracuyá con mezcal', category: 'alcohol', categoryName: 'Con alcohol', description: 'Tropical, ácida y jugosa. Sabe a plan que se puso bueno.', image: ASSETS.maracuya, facts: ['330 ml', 'Mezcal', 'Tropical'], popular: true },
    { id: 'clericot', name: 'Clericot', category: 'alcohol', categoryName: 'Con alcohol', description: 'Frutal, suave y perfecto para mesa de bebidas o brindis.', image: ASSETS.clericot, facts: ['330 ml', 'Frutal', 'Suave'] },
    { id: 'carajillo', name: 'Carajillo', category: 'alcohol', categoryName: 'Con alcohol', description: 'Café frío con toque adulto para cerrar rico.', image: ASSETS.carajillo, facts: ['330 ml', 'Café', 'Con alcohol'], favorite: true },
    { id: 'mojito-mocktail', name: 'Mojito clásico mocktail', category: 'sin-alcohol', categoryName: 'Sin alcohol', description: 'El clásico fresco de limón y hierbabuena, sin alcohol.', image: ASSETS.mojito, facts: ['330 ml', 'Sin alcohol', 'Cítrico'], popular: true },
    { id: 'mariposa-mocktail', name: 'Mojito mariposa mocktail', category: 'sin-alcohol', categoryName: 'Sin alcohol', description: 'Color inesperado, sabor fresco y cero alcohol.', image: ASSETS.mariposa, facts: ['330 ml', 'Sin alcohol', 'Morado'], favorite: true },
    { id: 'jamaica-limon', name: 'Jamaica-limón', category: 'sin-alcohol', categoryName: 'Sin alcohol', description: 'Ácida, fría y mexicana. Una lata que se acaba rápido.', image: ASSETS.jamaica, facts: ['330 ml', 'Sin alcohol', 'Ácida'] },
    { id: 'pepino-limon', name: 'Pepino-limón', category: 'sin-alcohol', categoryName: 'Sin alcohol', description: 'Ligera, verde y muy fresca para repetir sin pensarlo.', image: ASSETS.pepino, facts: ['330 ml', 'Sin alcohol', 'Ligera'] },
    { id: 'maracuya-limon', name: 'Maracuyá-limón', category: 'sin-alcohol', categoryName: 'Sin alcohol', description: 'Tropical y brillante, con acidez bonita y final fresco.', image: ASSETS.maracuya, facts: ['330 ml', 'Sin alcohol', 'Tropical'], popular: true },
    { id: 'horchata', name: 'Horchata clásica', category: 'cafe', categoryName: 'Café y cremosas', description: 'Cremosa, con vainilla y canela. Sabe a postre frío.', image: ASSETS.horchata, facts: ['330 ml', 'Cremosa', 'Con lácteos'], favorite: true, popular: true },
    { id: 'espresso-horchata', name: 'Espresso horchata', category: 'cafe', categoryName: 'Café y cremosas', description: 'Café y horchata en una lata. Favorita para sobremesa.', image: ASSETS.espresso, facts: ['330 ml', 'Café', 'Con lácteos'], favorite: true, popular: true },
    { id: 'americano', name: 'Americano frío', category: 'cafe', categoryName: 'Café y cremosas', description: 'Café frío, directo y ligero para levantar el plan.', image: ASSETS.americano, facts: ['330 ml', 'Café', 'Sin lácteos'] },
    { id: 'cold-brew', name: 'Cold brew vainilla', category: 'cafe', categoryName: 'Café y cremosas', description: 'Café frío con vainilla: suave, aromático y listo para llevar.', image: ASSETS.coldBrew, facts: ['330 ml', 'Café', 'Vainilla'], popular: true },
    { id: 'latte', name: 'Latte frío', category: 'cafe', categoryName: 'Café y cremosas', description: 'Cremoso, frío y amable. El café que se antoja lento.', image: ASSETS.latte, facts: ['330 ml', 'Café', 'Con lácteos'] }
  ];

  const FILTERS = [
    ['all', 'Todo'],
    ['favorites', 'Favoritos'],
    ['popular', 'Más pedidos'],
    ['alcohol', 'Con alcohol'],
    ['sin-alcohol', 'Sin alcohol'],
    ['cafe', 'Café y cremosas']
  ];

  const PACKAGES = [
    { quantity: 50, label: 'Pack 50', detail: 'Reuniones y cumpleaños', price: 60 },
    { quantity: 100, label: 'Pack 100', detail: 'Eventos medianos', price: 55 },
    { quantity: 150, label: 'Pack 150', detail: 'Precio preferente', price: 53 },
    { quantity: 250, label: 'Pack 250', detail: 'Activaciones y equipos', price: 52 },
    { quantity: 500, label: 'Pack 500', detail: 'Producción de alto volumen', price: 50 }
  ];

  const PACKAGE_PRODUCTS = [
    'mojito-mariposa', 'espresso-horchata', 'horchata', 'mojito-clasico', 'maracuya-limon',
    'mezcalita-jamaica', 'mojito-mocktail', 'cold-brew', 'margarita-mezcal', 'mariposa-mocktail'
  ];

  const state = {
    route: 'inicio',
    filter: 'all',
    search: '',
    quantities: loadJson('antojo-selection-v15', loadJson('antojo-selection-v14', {})),
    order: loadJson('antojo-order-v2', {
      packageTarget: 0,
      personalized: false,
      fulfillment: 'pickup',
      postalCode: '',
      shipping: { status: 'idle', fee: 0, distance: 0, label: '' }
    }),
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

  if (!state.order.shipping || typeof state.order.shipping !== 'object') {
    state.order.shipping = { status: 'idle', fee: 0, distance: 0, label: '' };
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value = '') => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[character]);

  function loadJson(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || 'null');
      return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function saveState() {
    try {
      localStorage.setItem('antojo-selection-v15', JSON.stringify(state.quantities));
      localStorage.setItem('antojo-order-v2', JSON.stringify(state.order));
    } catch {
      // The experience remains usable without local storage.
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
    toast.timer = setTimeout(() => node.classList.remove('is-visible'), 3000);
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
    const complete = () => setTimeout(finishLoader, Math.max(0, 650 - (performance.now() - started)));
    if (document.readyState === 'complete') complete();
    else window.addEventListener('load', complete, { once: true });
    setTimeout(finishLoader, 1700);
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
    closeFaq();
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

  function openFaq() {
    $('#faqDialog')?.classList.add('is-open');
    $('#faqBackdrop')?.classList.add('is-open');
    document.body.classList.add('has-overlay');
    setTimeout(() => $('#faqClose')?.focus(), 50);
  }

  function closeFaq() {
    $('#faqDialog')?.classList.remove('is-open');
    $('#faqBackdrop')?.classList.remove('is-open');
    document.body.classList.remove('has-overlay');
  }

  function openSelectionPanel() {
    $('#orderPanel')?.classList.add('is-open');
    $('#selectionBackdrop')?.classList.add('is-open');
  }

  function closeSelectionPanel() {
    $('#orderPanel')?.classList.remove('is-open');
    $('#selectionBackdrop')?.classList.remove('is-open');
  }

  function standardUnitPrice(total) {
    if (total <= 5) return 65;
    if (total <= 19) return 63;
    if (total <= 99) return 60;
    if (total <= 149) return 55;
    if (total <= 199) return 53;
    if (total <= 499) return 52;
    return 50;
  }

  function activeUnitPrice(total) {
    if (!total) return 0;
    return standardUnitPrice(total) + (state.order.personalized ? 10 : 0);
  }

  function selectionItems() {
    return PRODUCTS
      .map(product => ({ ...product, quantity: Number(state.quantities[product.id] || 0) }))
      .filter(item => item.quantity > 0);
  }

  function selectionTotal() {
    return selectionItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  function setQuantity(id, value) {
    const next = Math.max(0, Math.min(9999, Math.round(Number(value) || 0)));
    if (next === 0) delete state.quantities[id];
    else state.quantities[id] = next;
    if (selectionTotal() < 50 && state.order.personalized) state.order.personalized = false;
    saveState();
    scheduleShipping();
    renderMenu();
  }

  function updateQuantity(id, delta) {
    setQuantity(id, Number(state.quantities[id] || 0) + delta);
  }

  function clearSelection() {
    state.quantities = {};
    state.order.packageTarget = 0;
    state.order.personalized = false;
    state.order.shipping = { status: 'idle', fee: 0, distance: 0, label: '' };
    saveState();
    closeSelectionPanel();
    renderMenu();
    toast('Tu selección quedó vacía.');
  }

  function applyPackage(quantity) {
    const target = Number(quantity);
    if (!PACKAGES.some(item => item.quantity === target)) return;
    state.quantities = {};
    const base = Math.floor(target / PACKAGE_PRODUCTS.length);
    let remainder = target % PACKAGE_PRODUCTS.length;
    PACKAGE_PRODUCTS.forEach(id => {
      state.quantities[id] = base + (remainder > 0 ? 1 : 0);
      remainder = Math.max(0, remainder - 1);
    });
    state.order.packageTarget = target;
    saveState();
    scheduleShipping();
    renderMenu();
    toast(`Armamos una mezcla sugerida de ${target} bebidas. Puedes cambiar cantidades y sabores.`);
  }

  function renderPackages() {
    const node = $('#packageOptions');
    if (!node) return;
    node.innerHTML = PACKAGES.map(item => `
      <button type="button" class="package-card ${state.order.packageTarget === item.quantity ? 'is-active' : ''}" data-package="${item.quantity}">
        <span>${item.label}</span>
        <strong>${item.quantity} bebidas</strong>
        <small>${item.detail}</small>
        <b>$${item.price} c/u · personalizadas +$10</b>
      </button>
    `).join('');
  }

  function renderFilters() {
    const node = $('#filters');
    if (!node) return;
    node.innerHTML = FILTERS.map(([id, label]) => `<button type="button" class="${state.filter === id ? 'is-active' : ''}" data-filter="${id}">${label}</button>`).join('');
  }

  function filteredProducts() {
    const query = state.search.toLowerCase().trim();
    return PRODUCTS.filter(product => {
      const categoryMatches = state.filter === 'all'
        || (state.filter === 'favorites' && product.favorite)
        || (state.filter === 'popular' && product.popular)
        || product.category === state.filter;
      const haystack = `${product.name} ${product.categoryName} ${product.description} ${product.facts.join(' ')}`.toLowerCase();
      return categoryMatches && (!query || haystack.includes(query));
    });
  }

  function quantityControl(product, quantity) {
    return `<div class="qty qty--editable" aria-label="Cantidad de ${esc(product.name)}">
      <button type="button" data-qty-id="${product.id}" data-delta="-1" aria-label="Quitar una">−</button>
      <input type="number" min="0" max="9999" inputmode="numeric" value="${quantity}" data-qty-input="${product.id}" aria-label="Escribir cantidad de ${esc(product.name)}">
      <button type="button" data-qty-id="${product.id}" data-delta="1" aria-label="Agregar una">+</button>
    </div>`;
  }

  function renderMenu() {
    renderPackages();
    renderFilters();
    const input = $('#menuSearch');
    if (input && input.value !== state.search) input.value = state.search;
    const products = filteredProducts();
    const list = $('#productList');
    if (!list) return;

    list.innerHTML = products.length ? products.map((product, index) => {
      const quantity = Number(state.quantities[product.id] || 0);
      const labels = [product.favorite ? 'Favorito' : '', product.popular ? 'Más pedido' : ''].filter(Boolean);
      return `<article class="product-row">
        <span class="product-row__number">${String(index + 1).padStart(2, '0')}</span>
        <div class="product-row__main">
          <div class="product-row__image"><img src="${product.image}" alt="Lata de ${esc(product.name)}" loading="lazy"></div>
          <div><div class="product-row__labels">${labels.map(label => `<i>${label}</i>`).join('')}</div><h3>${esc(product.name)}</h3><p>${esc(product.description)}</p></div>
        </div>
        <div class="product-row__facts">${product.facts.map(fact => `<span>${esc(fact)}</span>`).join('')}</div>
        <div class="product-row__action">
          <span class="product-row__price">$65 individual · hasta $50 por volumen</span>
          ${quantityControl(product, quantity)}
        </div>
      </article>`;
    }).join('') : '<div class="empty-menu"><h3>No encontramos ese antojo.</h3><p>Prueba con otra palabra o categoría.</p></div>';

    renderSelection();
  }

  function fulfillmentCopy() {
    if (state.order.fulfillment === 'pickup') return 'Recoger en WTC · sin costo';
    if (!/^\d{5}$/.test(state.order.postalCode)) return 'Entrega a domicilio · falta código postal';
    if (state.order.shipping.status === 'loading') return 'Calculando envío…';
    if (state.order.shipping.status === 'ready') return `Entrega estimada · $${state.order.shipping.fee}`;
    return 'Entrega a domicilio · revisa el CP';
  }

  function volumeShippingFee(total) {
    if (total <= 30) return 0;
    if (total <= 75) return 35;
    if (total <= 150) return 80;
    if (total <= 250) return 140;
    if (total <= 500) return 240;
    return 360;
  }

  function roundToTen(value) {
    return Math.ceil(value / 10) * 10;
  }

  function haversineKm(lat1, lon1, lat2, lon2) {
    const toRad = value => value * Math.PI / 180;
    const earth = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2
      + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return earth * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function fallbackDistance(postalCode) {
    const prefix = Number(String(postalCode).slice(0, 2));
    const map = {
      1: 8, 2: 10, 3: 3, 4: 12, 5: 15, 6: 8, 7: 13, 8: 12, 9: 16,
      10: 11, 11: 8, 12: 11, 13: 20, 14: 15, 15: 17, 16: 18, 17: 23
    };
    if (map[prefix]) return map[prefix];
    if (prefix >= 50 && prefix <= 57) return 28;
    return 38;
  }

  function shippingFromDistance(distance, total, source) {
    const roadDistance = Math.max(2, distance * 1.25);
    const fee = Math.min(680, roundToTen(65 + roadDistance * 8 + volumeShippingFee(total)));
    return {
      status: 'ready',
      fee,
      distance: Math.round(roadDistance * 10) / 10,
      label: source === 'api' ? 'Calculado por distancia y volumen' : 'Estimado por zona y volumen'
    };
  }

  async function calculateShipping(postalCode) {
    const cp = String(postalCode || '').replace(/\D/g, '').slice(0, 5);
    if (!/^\d{5}$/.test(cp) || state.order.fulfillment !== 'delivery') return;
    const requestId = `${cp}-${Date.now()}`;
    calculateShipping.requestId = requestId;
    state.order.shipping = { status: 'loading', fee: 0, distance: 0, label: 'Calculando…' };
    saveState();
    renderSelection();

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4500);
      const response = await fetch(`https://api.zippopotam.us/mx/${cp}`, { signal: controller.signal });
      clearTimeout(timer);
      if (!response.ok) throw new Error('Postal code not found');
      const data = await response.json();
      const place = data?.places?.[0];
      const lat = Number(place?.latitude);
      const lon = Number(place?.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error('No coordinates');
      const distance = haversineKm(CONFIG.wtc.lat, CONFIG.wtc.lon, lat, lon);
      if (calculateShipping.requestId !== requestId) return;
      state.order.shipping = shippingFromDistance(distance, selectionTotal(), 'api');
    } catch {
      if (calculateShipping.requestId !== requestId) return;
      state.order.shipping = shippingFromDistance(fallbackDistance(cp), selectionTotal(), 'fallback');
    }

    saveState();
    renderSelection();
    window.dispatchEvent(new CustomEvent('antojo:shipping', {
      detail: { fee: state.order.shipping.fee, postalCode: cp }
    }));
  }

  function scheduleShipping() {
    clearTimeout(scheduleShipping.timer);
    if (state.order.fulfillment !== 'delivery' || !/^\d{5}$/.test(state.order.postalCode)) return;
    scheduleShipping.timer = setTimeout(() => calculateShipping(state.order.postalCode), 280);
  }

  function shippingDisplay() {
    if (state.order.fulfillment === 'pickup') return { label: 'Recolección WTC', value: '$0', fee: 0 };
    if (!/^\d{5}$/.test(state.order.postalCode)) return { label: 'Envío', value: 'Escribe tu CP', fee: 0 };
    if (state.order.shipping.status === 'loading') return { label: 'Envío', value: 'Calculando…', fee: 0 };
    if (state.order.shipping.status === 'ready') return { label: 'Envío estimado', value: `$${state.order.shipping.fee}`, fee: state.order.shipping.fee };
    return { label: 'Envío', value: 'Por calcular', fee: 0 };
  }

  function renderSelection() {
    const summary = $('#selectionSummary');
    const bar = $('#selectionBar');
    if (!summary || !bar) return;

    const items = selectionItems();
    const total = selectionTotal();
    const price = activeUnitPrice(total);
    const subtotal = total * price;
    const delivery = shippingDisplay();
    const grandTotal = subtotal + delivery.fee;
    const target = Number(state.order.packageTarget || 0);
    const packageProgress = target ? Math.min(100, Math.round((total / target) * 100)) : 0;

    const itemsHtml = total
      ? `<div class="selection-items">${items.map(item => `<article class="selection-item"><img src="${item.image}" alt=""><div><b>${esc(item.name)}</b><small>${esc(item.categoryName)}</small></div>${quantityControl(item, item.quantity)}</article>`).join('')}</div>`
      : '<div class="selection-empty selection-empty--compact"><div><span>+</span><h4>Todavía no eliges bebidas.</h4><p>Elige un paquete o escribe cantidades directamente.</p></div></div>';

    const packageHtml = target ? `<div class="package-progress"><div><span>Pack de ${target}</span><b>${total}/${target}</b></div><i><em style="width:${packageProgress}%"></em></i><small>${total < target ? `Te faltan ${target - total} bebidas.` : total === target ? 'Tu paquete está completo.' : `Llevas ${total - target} bebidas extra.`}</small></div>` : '';
    const personalizationDisabled = total < 50;

    summary.innerHTML = `${itemsHtml}
      <div class="order-config">
        ${packageHtml}
        <label class="order-toggle ${personalizationDisabled ? 'is-disabled' : ''}">
          <input type="checkbox" id="orderPersonalized" ${state.order.personalized ? 'checked' : ''} ${personalizationDisabled ? 'disabled' : ''}>
          <span><b>Personalizar las latas · +$10 c/u</b><small>${personalizationDisabled ? 'Disponible desde 50 bebidas.' : 'Se suma al precio correspondiente por volumen.'}</small></span>
        </label>
        <fieldset class="fulfillment-options"><legend>¿Cómo las recibes?</legend>
          <button type="button" class="${state.order.fulfillment === 'pickup' ? 'is-active' : ''}" data-fulfillment="pickup"><b>Recoger en WTC</b><small>Sin costo</small></button>
          <button type="button" class="${state.order.fulfillment === 'delivery' ? 'is-active' : ''}" data-fulfillment="delivery"><b>Entrega a domicilio</b><small>Calculada por CP + volumen</small></button>
        </fieldset>
        ${state.order.fulfillment === 'delivery' ? `<label class="postal-field"><span>Código postal de entrega</span><input id="orderPostalCode" type="text" inputmode="numeric" maxlength="5" pattern="[0-9]{5}" value="${esc(state.order.postalCode)}" placeholder="Ej. 03100"><small>${state.order.shipping.status === 'ready' ? `${esc(state.order.shipping.label)} · ${state.order.shipping.distance} km operativos aprox.` : 'Escribe 5 dígitos para calcular una tarifa estimada.'}</small></label>` : ''}
      </div>
      <div class="selection-totals">
        <div class="selection-total-row"><span>Bebidas</span><b>${total}</b></div>
        <div class="selection-total-row"><span>Precio base por bebida</span><b>${price ? `$${standardUnitPrice(total)}` : '—'}</b></div>
        <div class="selection-total-row"><span>Personalización</span><b>${state.order.personalized ? '+$10 c/u' : 'No incluida'}</b></div>
        <div class="selection-total-row"><span>Precio final por bebida</span><b>${price ? `$${price}` : '—'}</b></div>
        <div class="selection-total-row"><span>${delivery.label}</span><b>${delivery.value}</b></div>
        <div class="selection-total-row selection-total-row--strong"><span>Total estimado</span><b>$${grandTotal.toLocaleString('es-MX')} MXN</b></div>
        <p class="selection-note">${state.order.fulfillment === 'delivery' ? 'La tarifa se calcula por ubicación aproximada del CP y volumen. Se confirma antes del cobro.' : 'Recoger en WTC no agrega costo.'}</p>
        <div class="selection-actions"><button class="selection-actions__primary" type="button" data-send-selection ${!total ? 'disabled' : ''}>Continuar por WhatsApp</button><button class="selection-actions__secondary" type="button" data-clear-selection ${!total ? 'disabled' : ''}>Vaciar selección</button></div>
      </div>`;

    if (!total) {
      bar.classList.remove('is-visible');
      bar.innerHTML = '';
      return;
    }

    bar.innerHTML = `<p><b>${total} ${total === 1 ? 'bebida' : 'bebidas'} · $${price} c/u</b>${fulfillmentCopy()} · Total $${grandTotal.toLocaleString('es-MX')}</p><button type="button" data-selection-toggle>Ver selección</button>`;
    bar.classList.add('is-visible');
  }

  function selectionMessage() {
    const items = selectionItems();
    const total = selectionTotal();
    const price = activeUnitPrice(total);
    const subtotal = total * price;
    const delivery = shippingDisplay();
    const grandTotal = subtotal + delivery.fee;
    return `Hola, quiero pedir ANTOJO.\n\nMi selección:\n${items.map(item => `${item.quantity} × ${item.name}`).join('\n')}\n\nTotal: ${total} bebidas\nPrecio base: $${standardUnitPrice(total)} c/u\nPersonalización: ${state.order.personalized ? '+$10 c/u' : 'No'}\nPrecio final: $${price} c/u\nSubtotal de bebidas: $${subtotal.toLocaleString('es-MX')} MXN\nEntrega: ${state.order.fulfillment === 'delivery' ? `A domicilio · CP ${state.order.postalCode}` : 'Recoger en WTC'}\nEnvío estimado: ${state.order.fulfillment === 'delivery' ? `$${delivery.fee} MXN` : '$0'}\nTotal estimado: $${grandTotal.toLocaleString('es-MX')} MXN\n\n¿Me ayudan a confirmar disponibilidad, tarifa y total final antes del cobro?`;
  }

  function validateOrderBeforeSend() {
    const total = selectionTotal();
    if (!total) {
      toast('Agrega al menos una bebida para continuar.');
      return false;
    }
    if (state.order.personalized && total < 50) {
      toast('La personalización está disponible desde 50 bebidas.');
      return false;
    }
    if (state.order.fulfillment === 'delivery') {
      if (!/^\d{5}$/.test(state.order.postalCode)) {
        toast('Escribe un código postal válido de 5 dígitos.');
        $('#orderPostalCode')?.focus();
        return false;
      }
      if (state.order.shipping.status !== 'ready') {
        toast('Espera un momento a que termine el cálculo del envío.');
        scheduleShipping();
        return false;
      }
    }
    return true;
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

  function isDesktopEvent() {
    return window.matchMedia('(min-width:981px)').matches;
  }

  function renderEvent() {
    const desktop = isDesktopEvent();
    const step = state.event.step;
    const page = $('.event-page');
    page?.classList.toggle('event-page--all', desktop);
    $$('.form-step').forEach(section => {
      const active = desktop || Number(section.dataset.step) === step;
      section.classList.toggle('is-active', active);
    });
    $('#eventStepLabel').textContent = desktop ? 'Cotización completa' : `Paso ${step} de 3`;
    $('#eventProgress').style.width = desktop ? '100%' : `${step * 33.333}%`;
    $('#eventBack').textContent = desktop || step === 1 ? 'Volver' : 'Atrás';
    $('#eventNext').textContent = desktop || step === 3 ? 'Continuar en WhatsApp' : 'Continuar';
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
    const qty = suggestedQuantity();
    const price = standardUnitPrice(qty) + (state.event.personalized ? 10 : 0);
    node.innerHTML = `<small>RESUMEN</small><b>${esc(state.event.type || 'Evento por definir')} · ${qty} latas</b><span>${state.event.guests} personas · ${state.event.servings} bebida${state.event.servings === 1 ? '' : 's'} por persona<br>${state.event.personalized ? `Personalizadas · $${price} c/u` : `ANTOJO. · $${price} c/u`} · ${state.event.date ? esc(state.event.date) : 'Fecha por definir'}</span>`;
  }

  function eventMessage() {
    const event = state.event;
    const qty = suggestedQuantity();
    const price = standardUnitPrice(qty) + (event.personalized ? 10 : 0);
    return `Hola, quiero cotizar un evento con ANTOJO.\n\nNombre: ${event.name || 'Por definir'}\nTipo de evento: ${event.type}\nPersonas: ${event.guests}\nCantidad sugerida: ${qty} latas\nPrecio estimado: $${price} c/u\nServicio: ${event.servings} bebida${event.servings === 1 ? '' : 's'} por persona\nPresentación: ${event.personalized ? 'Personalizada (+$10 c/u)' : 'Lata ANTOJO.'}\nFecha: ${event.date || 'Por definir'}\nLugar: ${event.place || 'Por definir'}\nNotas: ${event.notes || 'Sin notas adicionales'}\n\n¿Me ayudan a confirmar opciones, envío, precio y disponibilidad?`;
  }

  function validateEventAll() {
    syncEventInputs();
    const error = $('#eventError');
    if (!state.event.type) {
      error.textContent = 'Elige el tipo de evento.';
      return false;
    }
    if (state.event.personalized && suggestedQuantity() < 50) {
      error.textContent = 'La personalización está disponible desde 50 piezas.';
      return false;
    }
    if (state.event.name.length < 2) {
      error.textContent = 'Escribe tu nombre para dar seguimiento.';
      $('#contactName')?.focus();
      return false;
    }
    return true;
  }

  function eventNext() {
    syncEventInputs();
    const event = state.event;
    const error = $('#eventError');

    if (isDesktopEvent()) {
      if (validateEventAll()) openWhatsApp(eventMessage());
      return;
    }

    if (event.step === 1 && !event.type) {
      error.textContent = 'Elige el tipo de evento para continuar.';
      return;
    }
    if (event.step === 2 && event.personalized && suggestedQuantity() < 50) {
      error.textContent = 'La personalización está disponible desde 50 piezas.';
      return;
    }
    if (event.step === 3) {
      if (validateEventAll()) openWhatsApp(eventMessage());
      return;
    }
    event.step += 1;
    renderEvent();
  }

  function eventBack() {
    if (isDesktopEvent() || state.event.step === 1) {
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
      const faqOpen = event.target.closest('[data-faq-open]');
      if (faqOpen) {
        event.preventDefault();
        closeDrawer();
        openFaq();
        return;
      }
      if (event.target.closest('[data-faq-close]')) {
        event.preventDefault();
        closeFaq();
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
      const packageButton = event.target.closest('[data-package]');
      if (packageButton) {
        applyPackage(packageButton.dataset.package);
        return;
      }
      const fulfillment = event.target.closest('[data-fulfillment]');
      if (fulfillment) {
        state.order.fulfillment = fulfillment.dataset.fulfillment === 'delivery' ? 'delivery' : 'pickup';
        if (state.order.fulfillment === 'pickup') {
          state.order.shipping = { status: 'idle', fee: 0, distance: 0, label: '' };
        }
        saveState();
        renderSelection();
        scheduleShipping();
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
        if (validateOrderBeforeSend()) openWhatsApp(selectionMessage());
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

    document.addEventListener('change', event => {
      if (event.target.matches('#orderPersonalized')) {
        state.order.personalized = event.target.checked;
        saveState();
        renderSelection();
        return;
      }
      if (event.target.matches('[data-qty-input]')) {
        setQuantity(event.target.dataset.qtyInput, event.target.value);
      }
    });

    document.addEventListener('keydown', event => {
      if (event.target.matches('[data-qty-input]') && event.key === 'Enter') {
        event.preventDefault();
        event.target.blur();
      }
      if (event.key === 'Escape') {
        closeDrawer();
        closeSelectionPanel();
        closeFaq();
      }
    });

    document.addEventListener('input', event => {
      if (event.target.matches('#orderPostalCode')) {
        state.order.postalCode = event.target.value.replace(/\D/g, '').slice(0, 5);
        event.target.value = state.order.postalCode;
        state.order.shipping = { status: 'idle', fee: 0, distance: 0, label: '' };
        saveState();
        scheduleShipping();
      }
    });

    $('#menuButton')?.addEventListener('click', () => {
      if ($('#drawer')?.classList.contains('is-open')) closeDrawer();
      else openDrawer();
    });
    $('#drawerBackdrop')?.addEventListener('click', closeDrawer);
    $('#selectionClose')?.addEventListener('click', closeSelectionPanel);
    $('#selectionBackdrop')?.addEventListener('click', closeSelectionPanel);
    $('#faqBackdrop')?.addEventListener('click', closeFaq);

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
      renderEvent();
    });
  }

  function start() {
    bootLoader();
    bind();
    renderMenu();
    renderEvent();
    navigate(normalizeRoute(location.hash), false);
    scheduleShipping();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
