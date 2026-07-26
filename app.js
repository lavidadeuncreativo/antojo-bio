(() => {
  'use strict';

  const PRICING = window.ANTOJO_PRICING;
  if (!PRICING?.getUnitPrice) throw new Error('No se cargó pricing.js');
  const { getUnitPrice } = PRICING;

  const CONFIG = Object.freeze({
    whatsappNumber: '525522026291',
    instagram: 'https://www.instagram.com/antojo.bebidas/',
    googleReview: 'https://www.google.com/maps/search/?api=1&query=ANTOJO%20bebidas%20CDMX',
    pickupLabel: 'Recoger en WTC',
    shippingOriginPostalCode: '03103',
    shippingOriginFallback: Object.freeze({ lat: 19.3898, lon: -99.1717 }),
    minimumDeliveryQuantity: 10
  });

  const COLD_CHAIN_CONFIG = Object.freeze({
    coolerCapacityWithIce: null,
    coolerPurchasePrice: null,
    expectedUses: null,
    handlingFeePerCooler: null,
    rentalFeeIfLeftWithClient: null
  });

  const ROUTE_LABELS = Object.freeze({
    inicio: 'Inicio',
    menu: 'Menú',
    evento: 'Evento',
    dinamicas: 'Dinámicas',
    recompensas: 'Recompensas'
  });

  const PURPOSES = Object.freeze([
    { id: 'personal', label: 'Antojo personal', help: 'Para ti, tu casa o un pedido pequeño.' },
    { id: 'reunion', label: 'Reunión', help: 'Comida, sobremesa o convivencia.' },
    { id: 'cumpleanos', label: 'Cumpleaños', help: 'Celebración o mesa de bebidas.' },
    { id: 'boda', label: 'Boda', help: 'Bienvenida, brindis o recepción.' },
    { id: 'corporativo', label: 'Corporativo', help: 'Oficina, activación o marca.' },
    { id: 'otro', label: 'Otro', help: 'Lo aterrizamos contigo.' }
  ]);

  const ASSETS = Object.freeze({
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
  });

  const PRODUCTS = Object.freeze([
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
  ]);

  const FILTERS = Object.freeze([
    ['all', 'Todo'],
    ['favorites', 'Favoritos'],
    ['popular', 'Más pedidos'],
    ['alcohol', 'Con alcohol'],
    ['sin-alcohol', 'Sin alcohol'],
    ['cafe', 'Café y cremosas']
  ]);

  const PACKAGE_PRESETS = Object.freeze([
    { quantity: 50, label: 'Pack 50', detail: 'Reuniones y cumpleaños' },
    { quantity: 100, label: 'Pack 100', detail: 'Eventos medianos' },
    { quantity: 150, label: 'Pack 150', detail: 'Precio preferente' },
    { quantity: 250, label: 'Pack 250', detail: 'Activaciones y equipos' },
    { quantity: 300, label: 'Pack 300', detail: 'Producción por volumen' },
    { quantity: 500, label: 'Pack 500', detail: 'Alto volumen' }
  ]);

  const PACKAGE_PRODUCTS = Object.freeze([
    'mojito-mariposa', 'espresso-horchata', 'horchata', 'mojito-clasico', 'maracuya-limon',
    'mezcalita-jamaica', 'mojito-mocktail', 'cold-brew', 'margarita-mezcal', 'mariposa-mocktail'
  ]);

  const STORAGE_KEY = 'antojo-state-v17';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value = '') => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[character]);

  function safeJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value && typeof value === 'object' ? value : fallback;
    } catch {
      return fallback;
    }
  }

  function defaultContext() {
    return { purpose: '', name: '', date: '', guests: '', place: '', notes: '' };
  }

  function migrateState() {
    const current = safeJson(STORAGE_KEY, null);
    if (current) return current;
    const v16 = safeJson('antojo-state-v16', null);
    const oldQuantities = v16?.quantities || safeJson('antojo-selection-v15', safeJson('antojo-selection-v14', {}));
    const oldOrder = v16?.order || safeJson('antojo-order-v2', {});
    return {
      route: v16?.route || 'inicio',
      filter: v16?.filter || 'all',
      search: v16?.search || '',
      quantities: oldQuantities,
      order: {
        packageTarget: Number(oldOrder.packageTarget || 0),
        personalizedRequested: Boolean(oldOrder.personalizedRequested || oldOrder.personalized),
        fulfillment: oldOrder.fulfillment === 'delivery' ? 'delivery' : 'pickup',
        postalCode: String(oldOrder.postalCode || '').replace(/\D/g, '').slice(0, 5),
        shipping: { status: 'idle', fee: 0, distance: 0, label: '' },
        context: { ...defaultContext(), ...(oldOrder.context || {}) }
      },
      event: {
        step: Number(v16?.event?.step || 1),
        type: String(v16?.event?.type || ''),
        guests: Number(v16?.event?.guests || 50),
        servings: Number(v16?.event?.servings || 1.5),
        personalizedRequested: Boolean(v16?.event?.personalizedRequested),
        name: String(v16?.event?.name || ''),
        date: String(v16?.event?.date || ''),
        place: String(v16?.event?.place || ''),
        notes: String(v16?.event?.notes || '')
      }
    };
  }

  const state = migrateState();
  state.route = ROUTE_LABELS[state.route] ? state.route : 'inicio';
  state.filter = FILTERS.some(([id]) => id === state.filter) ? state.filter : 'all';
  state.search = String(state.search || '');
  state.quantities = state.quantities && typeof state.quantities === 'object' ? state.quantities : {};
  state.order = {
    packageTarget: Number(state.order?.packageTarget || 0),
    personalizedRequested: Boolean(state.order?.personalizedRequested),
    fulfillment: state.order?.fulfillment === 'delivery' ? 'delivery' : 'pickup',
    postalCode: String(state.order?.postalCode || '').replace(/\D/g, '').slice(0, 5),
    shipping: state.order?.shipping && typeof state.order.shipping === 'object'
      ? state.order.shipping
      : { status: 'idle', fee: 0, distance: 0, label: '' },
    context: { ...defaultContext(), ...(state.order?.context || {}) }
  };
  state.event = {
    step: Math.min(3, Math.max(1, Number(state.event?.step || 1))),
    type: String(state.event?.type || ''),
    guests: Math.max(1, Number(state.event?.guests || 50)),
    servings: Number(state.event?.servings || 1.5),
    personalizedRequested: Boolean(state.event?.personalizedRequested),
    name: String(state.event?.name || ''),
    date: String(state.event?.date || ''),
    place: String(state.event?.place || ''),
    notes: String(state.event?.notes || '')
  };

  let shippingTimer = null;
  let shippingSerial = 0;
  let originPromise = null;

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // The experience remains usable without localStorage.
    }
  }

  function normalizeRoute(value) {
    const route = String(value || '').replace(/^#\/?/, '').trim();
    return Object.prototype.hasOwnProperty.call(ROUTE_LABELS, route) ? route : 'inicio';
  }

  function purposeLabel(id) {
    return PURPOSES.find(item => item.id === id)?.label || 'Por definir';
  }

  function isEventPurpose(id) {
    return Boolean(id && id !== 'personal');
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
    toast.timer = setTimeout(() => node.classList.remove('is-visible'), 3400);
  }

  function bootLoader() {
    const loader = $('#loader');
    const finish = () => {
      loader?.classList.add('is-hidden');
      document.documentElement.classList.remove('is-loading');
      document.documentElement.classList.add('is-ready');
    };
    if (document.readyState === 'complete') setTimeout(finish, 280);
    else window.addEventListener('load', () => setTimeout(finish, 280), { once: true });
    setTimeout(finish, 1600);
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

  function closeDrawer() {
    $('#drawer')?.classList.remove('is-open');
    $('#drawerBackdrop')?.classList.remove('is-open');
    $('#menuButton')?.setAttribute('aria-expanded', 'false');
  }

  function openDrawer() {
    $('#drawer')?.classList.add('is-open');
    $('#drawerBackdrop')?.classList.add('is-open');
    $('#menuButton')?.setAttribute('aria-expanded', 'true');
  }

  function openFaq() {
    $('#faqDialog')?.classList.add('is-open');
    $('#faqBackdrop')?.classList.add('is-open');
    document.body.classList.add('has-overlay');
    setTimeout(() => $('#faqClose')?.focus(), 30);
  }

  function closeFaq() {
    $('#faqDialog')?.classList.remove('is-open');
    $('#faqBackdrop')?.classList.remove('is-open');
    document.body.classList.remove('has-overlay');
  }

  function openSelectionPanel() {
    renderSelection();
    $('#orderPanel')?.classList.add('is-open');
    $('#selectionBackdrop')?.classList.add('is-open');
    document.body.classList.add('has-order-panel');
    setTimeout(() => $('#selectionClose')?.focus(), 30);
  }

  function closeSelectionPanel() {
    $('#orderPanel')?.classList.remove('is-open');
    $('#selectionBackdrop')?.classList.remove('is-open');
    document.body.classList.remove('has-order-panel');
  }

  function navigate(route, updateHash = true) {
    const next = normalizeRoute(route);
    state.route = next;
    $$('.view').forEach(view => view.classList.toggle('is-active', view.dataset.view === next));
    setActiveNavigation(next);
    closeDrawer();
    closeFaq();
    if (next !== 'menu') closeSelectionPanel();
    if (next === 'menu') renderMenu();
    if (next === 'evento') renderEvent();
    saveState();
    if (updateHash && location.hash !== `#${next}`) history.pushState(null, '', `#${next}`);
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    window.dispatchEvent(new CustomEvent('antojo:route', { detail: { route: next } }));
  }

  function selectionItems() {
    return PRODUCTS
      .map(product => ({ ...product, quantity: Math.max(0, Number(state.quantities[product.id] || 0)) }))
      .filter(item => item.quantity > 0);
  }

  function selectionTotal() {
    return selectionItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  function selectedFlavorCount() {
    return selectionItems().length;
  }

  function setQuantity(id, value) {
    if (!PRODUCTS.some(product => product.id === id)) return;
    const next = Math.max(0, Math.min(9999, Math.round(Number(value) || 0)));
    if (next === 0) delete state.quantities[id];
    else state.quantities[id] = next;
    if (selectionTotal() < 50) state.order.personalizedRequested = false;
    saveState();
    renderPackages();
    renderProducts();
    renderSelection({ preserveScroll: true });
    scheduleShipping();
  }

  function updateQuantity(id, delta) {
    setQuantity(id, Number(state.quantities[id] || 0) + Number(delta || 0));
  }

  function clearSelection() {
    state.quantities = {};
    state.order.packageTarget = 0;
    state.order.personalizedRequested = false;
    state.order.shipping = { status: 'idle', fee: 0, distance: 0, label: '' };
    saveState();
    renderMenu();
    toast('Tu selección quedó vacía.');
  }

  function distributeQuantity(target) {
    const quantities = {};
    const base = Math.floor(target / PACKAGE_PRODUCTS.length);
    let remainder = target % PACKAGE_PRODUCTS.length;
    PACKAGE_PRODUCTS.forEach(id => {
      quantities[id] = base + (remainder > 0 ? 1 : 0);
      remainder = Math.max(0, remainder - 1);
    });
    return quantities;
  }

  function applyPackage(value) {
    const target = Number(value);
    if (!PACKAGE_PRESETS.some(item => item.quantity === target)) return;
    state.quantities = distributeQuantity(target);
    state.order.packageTarget = target;
    saveState();
    renderMenu();
    scheduleShipping();
    requestAnimationFrame(() => {
      document.querySelector(`[data-package="${target}"]`)?.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    });
    toast(`Armamos una mezcla sugerida de ${target} bebidas. Puedes cambiar sabores y cantidades.`);
  }

  function quantityControl(product, quantity, context) {
    return `<div class="qty qty--editable" data-quantity-control="${context}" aria-label="Cantidad de ${esc(product.name)}">
      <button type="button" data-qty-id="${product.id}" data-delta="-1" aria-label="Quitar una ${esc(product.name)}">−</button>
      <input type="number" min="0" max="9999" inputmode="numeric" value="${quantity}" data-qty-input="${product.id}" data-qty-context="${context}" aria-label="Cantidad de ${esc(product.name)}">
      <button type="button" data-qty-id="${product.id}" data-delta="1" aria-label="Agregar una ${esc(product.name)}">+</button>
    </div>`;
  }

  function renderPackages() {
    const node = $('#packageOptions');
    if (!node) return;
    node.innerHTML = PACKAGE_PRESETS.map(item => {
      const price = getUnitPrice(item.quantity);
      const active = state.order.packageTarget === item.quantity;
      return `<button type="button" class="package-card ${active ? 'is-active' : ''}" data-package="${item.quantity}" aria-pressed="${active}">
        <span>${item.label}</span>
        <strong>${item.quantity} bebidas</strong>
        <small>${item.detail}</small>
        <b>$${price} c/u</b>
      </button>`;
    }).join('');
  }

  function renderFilters() {
    const node = $('#filters');
    if (!node) return;
    node.innerHTML = FILTERS.map(([id, label]) => `<button type="button" class="${state.filter === id ? 'is-active' : ''}" data-filter="${id}" aria-pressed="${state.filter === id}">${label}</button>`).join('');
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

  function renderProducts() {
    const list = $('#productList');
    if (!list) return;
    const products = filteredProducts();
    list.innerHTML = products.length ? products.map((product, index) => {
      const quantity = Math.max(0, Number(state.quantities[product.id] || 0));
      const labels = [product.favorite ? 'Favorito' : '', product.popular ? 'Más pedido' : ''].filter(Boolean);
      return `<article class="product-row ${quantity > 0 ? 'is-selected' : ''}" data-product-row="${product.id}">
        <span class="product-row__number">${String(index + 1).padStart(2, '0')}</span>
        <div class="product-row__main">
          <div class="product-row__image"><img src="${product.image}" alt="Lata de ${esc(product.name)}" loading="lazy" decoding="async"></div>
          <div class="product-row__copy">
            <div class="product-row__labels">${quantity > 0 ? `<i class="selected-label">Seleccionada · ${quantity}</i>` : ''}${labels.map(label => `<i>${label}</i>`).join('')}</div>
            <h3>${esc(product.name)}</h3>
            <p>${esc(product.description)}</p>
          </div>
        </div>
        <div class="product-row__facts">${product.facts.map(fact => `<span>${esc(fact)}</span>`).join('')}</div>
        <div class="product-row__action">
          <span class="product-row__price">$65 individual · precio menor por volumen total</span>
          ${quantityControl(product, quantity, 'catalog')}
        </div>
      </article>`;
    }).join('') : '<div class="empty-menu"><h3>No encontramos ese antojo.</h3><p>Prueba con otra palabra o categoría.</p></div>';
  }

  function ensureSelectionScaffold() {
    const summary = $('#selectionSummary');
    if (!summary) return null;
    if (!summary.querySelector('#selectionItemsContainer')) {
      summary.innerHTML = `
        <section class="selection-overview" id="selectionOverview"></section>
        <section class="selection-items-container" id="selectionItemsContainer"></section>
        <section class="order-context" id="orderContextContainer"></section>
        <section class="order-config" id="orderConfigContainer"></section>
        <section class="selection-totals" id="orderTotalsContainer"></section>`;
    }
    return summary;
  }

  function renderSelectionOverview() {
    const node = $('#selectionOverview');
    if (!node) return;
    const total = selectionTotal();
    const flavors = selectedFlavorCount();
    node.innerHTML = `<div><small>TU PEDIDO</small><strong>${flavors} ${flavors === 1 ? 'sabor' : 'sabores'} · ${total} ${total === 1 ? 'lata' : 'latas'}</strong></div>
      <button type="button" class="selection-jump" data-scroll-selection ${!total ? 'disabled' : ''}>Ver bebidas</button>`;
  }

  function renderSelectionItems() {
    const node = $('#selectionItemsContainer');
    if (!node) return;
    const items = selectionItems();
    node.innerHTML = items.length
      ? `<div class="selection-items">${items.map(item => `<article class="selection-item" data-selection-item="${item.id}">
          <img src="${item.image}" alt="" loading="lazy" decoding="async">
          <div class="selection-item__copy"><b>${esc(item.name)}</b><small>${esc(item.categoryName)}</small></div>
          <div class="selection-item__qty">${quantityControl(item, item.quantity, 'summary')}</div>
        </article>`).join('')}</div>`
      : '<div class="selection-empty selection-empty--compact"><div><span>+</span><h4>Todavía no eliges bebidas.</h4><p>Elige un paquete o escribe cantidades directamente.</p></div></div>';
  }

  function contextInput(id, label, value, options = {}) {
    const type = options.type || 'text';
    const attrs = [
      `id="${id}"`,
      `type="${type}"`,
      options.inputmode ? `inputmode="${options.inputmode}"` : '',
      options.min ? `min="${options.min}"` : '',
      options.max ? `max="${options.max}"` : '',
      options.maxlength ? `maxlength="${options.maxlength}"` : '',
      options.placeholder ? `placeholder="${esc(options.placeholder)}"` : '',
      `value="${esc(value)}"`
    ].filter(Boolean).join(' ');
    return `<label class="order-field"><span>${label}</span><input ${attrs}></label>`;
  }

  function renderOrderContext() {
    const node = $('#orderContextContainer');
    if (!node) return;
    const context = state.order.context;
    const eventPurpose = isEventPurpose(context.purpose);
    const purposeButtons = PURPOSES.map(item => `<button type="button" class="${context.purpose === item.id ? 'is-active' : ''}" data-order-purpose="${item.id}" aria-pressed="${context.purpose === item.id}">
      <b>${item.label}</b><small>${item.help}</small>
    </button>`).join('');
    node.innerHTML = `<div class="order-section-title"><span>PASO 1</span><h4>¿Para qué es tu pedido?</h4><p>Esto cambia los datos que necesitamos para cotizar bien.</p></div>
      <div class="purpose-options">${purposeButtons}</div>
      ${context.purpose ? `<div class="order-context-fields">
        ${contextInput('orderContactName', 'Nombre de contacto', context.name, { maxlength: 100, placeholder: 'Tu nombre' })}
        ${contextInput('orderNeededDate', eventPurpose ? 'Fecha del evento' : 'Fecha en que lo necesitas', context.date, { type: 'date' })}
        ${eventPurpose ? contextInput('orderGuests', 'Personas o invitados', context.guests, { type: 'number', min: 1, max: 5000, inputmode: 'numeric', placeholder: 'Ej. 80' }) : ''}
        ${eventPurpose ? contextInput('orderPlace', 'Lugar o zona', context.place, { maxlength: 180, placeholder: 'Ej. Roma Norte, CDMX' }) : ''}
        <label class="order-field order-field--full"><span>Notas del pedido</span><textarea id="orderNotes" maxlength="800" placeholder="Horario, montaje, sabores especiales o algo importante…">${esc(context.notes)}</textarea></label>
      </div>` : '<p class="order-context-hint">Selecciona una opción para continuar con los datos correctos.</p>'}`;
  }

  function packageProgressHtml() {
    const target = Number(state.order.packageTarget || 0);
    if (!target) return '';
    const total = selectionTotal();
    const progress = Math.min(100, Math.round((total / target) * 100));
    const message = total < target
      ? `Te faltan ${target - total} bebidas.`
      : total === target
        ? 'Tu paquete está completo.'
        : `Llevas ${total - target} bebidas extra.`;
    return `<div class="package-progress"><div><span>Objetivo de ${target}</span><b>${total}/${target}</b></div><i><em style="width:${progress}%"></em></i><small>${message}</small></div>`;
  }

  function shippingHelpText() {
    const shipping = state.order.shipping;
    if (selectionTotal() < CONFIG.minimumDeliveryQuantity) return `Entrega disponible desde ${CONFIG.minimumDeliveryQuantity} bebidas.`;
    if (!/^\d{5}$/.test(state.order.postalCode)) return 'Escribe 5 dígitos para estimar la entrega.';
    if (shipping.status === 'loading') return 'Calculando tarifa por zona y volumen…';
    if (shipping.status === 'ready') return `${shipping.label} · ${shipping.distance} km operativos aprox. · se confirma antes del cobro.`;
    if (shipping.status === 'error') return 'No pudimos calcular este CP. La entrega se confirma por WhatsApp.';
    return 'Escribe tu código postal para calcular una tarifa estimada.';
  }

  function renderOrderConfig() {
    const node = $('#orderConfigContainer');
    if (!node) return;
    const total = selectionTotal();
    const personalizationDisabled = total < 50;
    if (personalizationDisabled) state.order.personalizedRequested = false;
    node.innerHTML = `<div class="order-section-title"><span>PASO 2</span><h4>Presentación y entrega</h4></div>
      ${packageProgressHtml()}
      <label class="order-toggle ${personalizationDisabled ? 'is-disabled' : ''}">
        <input type="checkbox" id="orderPersonalized" ${state.order.personalizedRequested ? 'checked' : ''} ${personalizationDisabled ? 'disabled' : ''}>
        <span><b>Quiero latas personalizadas</b><small>${personalizationDisabled ? 'Disponible desde 50 bebidas.' : 'Se solicita ahora y se cotiza según diseño, impresión, colocación y merma.'}</small></span>
      </label>
      <fieldset class="fulfillment-options"><legend>¿Cómo las recibes?</legend>
        <button type="button" class="${state.order.fulfillment === 'pickup' ? 'is-active' : ''}" data-fulfillment="pickup" aria-pressed="${state.order.fulfillment === 'pickup'}"><b>${CONFIG.pickupLabel}</b><small>Sin costo</small></button>
        <button type="button" class="${state.order.fulfillment === 'delivery' ? 'is-active' : ''}" data-fulfillment="delivery" aria-pressed="${state.order.fulfillment === 'delivery'}"><b>Entrega a domicilio</b><small>Desde 10 bebidas · calculada por CP</small></button>
      </fieldset>
      ${state.order.fulfillment === 'delivery' ? `<label class="postal-field"><span>Código postal de entrega</span><input id="orderPostalCode" type="text" inputmode="numeric" maxlength="5" pattern="[0-9]{5}" value="${esc(state.order.postalCode)}" placeholder="Ej. 03100"><small>${esc(shippingHelpText())}</small></label>` : ''}`;
  }

  function shippingDisplay() {
    if (state.order.fulfillment === 'pickup') return { label: 'Recolección WTC', value: '$0', fee: 0, pending: false };
    const shipping = state.order.shipping;
    if (selectionTotal() < CONFIG.minimumDeliveryQuantity) return { label: 'Envío', value: `Desde ${CONFIG.minimumDeliveryQuantity} bebidas`, fee: 0, pending: true };
    if (!/^\d{5}$/.test(state.order.postalCode)) return { label: 'Envío', value: 'Escribe tu CP', fee: 0, pending: true };
    if (shipping.status === 'loading') return { label: 'Envío', value: 'Calculando…', fee: 0, pending: true };
    if (shipping.status === 'ready') return { label: 'Envío estimado', value: `$${shipping.fee}`, fee: Number(shipping.fee || 0), pending: false };
    if (shipping.status === 'error') return { label: 'Envío', value: 'Por confirmar', fee: 0, pending: false };
    return { label: 'Envío', value: 'Por calcular', fee: 0, pending: true };
  }

  function coldChainNote(total) {
    if (total < 150) return '';
    return '<p class="selection-note selection-note--logistics"><b>Logística de refrigeración por confirmar.</b> Hielo, hieleras de servicio, montaje, barra y catering se cotizan aparte cuando correspondan.</p>';
  }

  function orderContextComplete() {
    const context = state.order.context;
    if (!context.purpose || context.name.trim().length < 2) return false;
    if (isEventPurpose(context.purpose)) {
      return Boolean(context.date && Number(context.guests) > 0 && context.place.trim().length >= 2);
    }
    return true;
  }

  function renderOrderTotals() {
    const node = $('#orderTotalsContainer');
    if (!node) return;
    const total = selectionTotal();
    const price = getUnitPrice(total);
    const subtotal = total * price;
    const delivery = shippingDisplay();
    const grandTotal = subtotal + delivery.fee;
    const personalization = state.order.personalizedRequested ? 'Solicitada · por cotizar' : 'No solicitada';
    const deliveryBlocked = state.order.fulfillment === 'delivery'
      && (total < CONFIG.minimumDeliveryQuantity || !/^\d{5}$/.test(state.order.postalCode) || state.order.shipping.status === 'loading');
    const disabled = total === 0 || !orderContextComplete() || deliveryBlocked;
    node.innerHTML = `<div class="order-section-title"><span>PASO 3</span><h4>Resumen</h4></div>
      <div class="selection-total-row"><span>Uso del pedido</span><b>${esc(purposeLabel(state.order.context.purpose))}</b></div>
      <div class="selection-total-row"><span>Bebidas</span><b>${total}</b></div>
      <div class="selection-total-row"><span>Precio por bebida</span><b>${price ? `$${price}` : '—'}</b></div>
      <div class="selection-total-row"><span>Subtotal de bebidas</span><b>$${subtotal.toLocaleString('es-MX')} MXN</b></div>
      <div class="selection-total-row"><span>Personalización</span><b>${personalization}</b></div>
      <div class="selection-total-row"><span>${delivery.label}</span><b>${delivery.value}</b></div>
      <div class="selection-total-row selection-total-row--strong"><span>Total estimado</span><b>$${grandTotal.toLocaleString('es-MX')} MXN</b></div>
      <p class="selection-note">El total no incluye personalización, ingredientes especiales, barra ni catering. Disponibilidad, entrega y costo final se confirman antes del cobro.</p>
      ${!orderContextComplete() ? '<p class="selection-note selection-note--warning">Completa el tipo de pedido y los datos de contacto para continuar.</p>' : ''}
      ${coldChainNote(total)}
      <div class="selection-actions"><button class="selection-actions__primary" type="button" data-send-selection ${disabled ? 'disabled' : ''}>Continuar por WhatsApp</button><button class="selection-actions__secondary" type="button" data-clear-selection ${!total ? 'disabled' : ''}>Vaciar bebidas</button></div>`;
  }

  function fulfillmentCopy() {
    if (state.order.fulfillment === 'pickup') return 'Recoger en WTC · sin costo';
    const delivery = shippingDisplay();
    return delivery.pending ? delivery.value : `${delivery.label} · ${delivery.value}`;
  }

  function renderSelectionBar() {
    const bar = $('#selectionBar');
    if (!bar) return;
    const total = selectionTotal();
    document.body.classList.toggle('has-mobile-selection', total > 0);
    if (!total) {
      bar.classList.remove('is-visible');
      bar.innerHTML = '';
      return;
    }
    const price = getUnitPrice(total);
    const subtotal = total * price;
    const delivery = shippingDisplay();
    const grandTotal = subtotal + delivery.fee;
    bar.innerHTML = `<p><b>${total} ${total === 1 ? 'bebida' : 'bebidas'} · $${price} c/u</b><span>${esc(fulfillmentCopy())} · Total $${grandTotal.toLocaleString('es-MX')}</span></p><button type="button" data-selection-toggle>Revisar pedido</button>`;
    bar.classList.add('is-visible');
  }

  function renderSelection(options = {}) {
    const summary = ensureSelectionScaffold();
    if (!summary) return;
    const scrollTop = summary.scrollTop;
    if (options.overview !== false) renderSelectionOverview();
    if (options.items !== false) renderSelectionItems();
    if (options.context !== false) renderOrderContext();
    if (options.config !== false) renderOrderConfig();
    if (options.totals !== false) renderOrderTotals();
    if (options.bar !== false) renderSelectionBar();
    if (options.preserveScroll) requestAnimationFrame(() => { summary.scrollTop = scrollTop; });
  }

  function renderMenu() {
    renderPackages();
    renderFilters();
    const input = $('#menuSearch');
    if (input && input.value !== state.search) input.value = state.search;
    renderProducts();
    renderSelection();
  }

  function roundToTen(value) {
    return Math.round(value / 10) * 10;
  }

  function distanceBaseFee(distance) {
    if (distance <= 2.5) return 49;
    if (distance <= 5) return 59;
    if (distance <= 8) return 79;
    if (distance <= 12) return 99;
    if (distance <= 18) return 129;
    if (distance <= 25) return 169;
    return Math.min(320, roundToTen(169 + (distance - 25) * 6));
  }

  function volumeSurcharge(total) {
    if (total < 30) return 0;
    if (total < 75) return 15;
    if (total < 150) return 35;
    if (total < 250) return 70;
    if (total < 500) return 120;
    return 180;
  }

  function haversineKm(lat1, lon1, lat2, lon2) {
    const toRad = value => value * Math.PI / 180;
    const earth = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return earth * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  async function postalCoordinates(postalCode, fallback = null) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);
      const response = await fetch(`https://api.zippopotam.us/mx/${postalCode}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) throw new Error('CP no localizado');
      const place = (await response.json())?.places?.[0];
      const lat = Number(place?.latitude);
      const lon = Number(place?.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error('Coordenadas inválidas');
      return { lat, lon };
    } catch (error) {
      if (fallback) return fallback;
      throw error;
    }
  }

  function originCoordinates() {
    if (!originPromise) originPromise = postalCoordinates(CONFIG.shippingOriginPostalCode, CONFIG.shippingOriginFallback);
    return originPromise;
  }

  async function calculateShipping() {
    const serial = ++shippingSerial;
    const total = selectionTotal();
    const postalCode = state.order.postalCode;
    if (state.order.fulfillment !== 'delivery') {
      state.order.shipping = { status: 'idle', fee: 0, distance: 0, label: '' };
      saveState();
      renderSelection({ items: false, context: false, preserveScroll: true });
      return;
    }
    if (total < CONFIG.minimumDeliveryQuantity || !/^\d{5}$/.test(postalCode)) {
      state.order.shipping = { status: 'idle', fee: 0, distance: 0, label: '' };
      saveState();
      renderSelection({ items: false, context: false, preserveScroll: true });
      return;
    }
    state.order.shipping = { status: 'loading', fee: 0, distance: 0, label: 'Calculando…' };
    saveState();
    renderSelection({ items: false, context: false, preserveScroll: true });
    try {
      const [origin, destination] = await Promise.all([originCoordinates(), postalCoordinates(postalCode)]);
      if (serial !== shippingSerial) return;
      const distance = Math.max(0, haversineKm(origin.lat, origin.lon, destination.lat, destination.lon) * 1.18);
      const fee = roundToTen(distanceBaseFee(distance) + volumeSurcharge(total));
      state.order.shipping = {
        status: 'ready',
        fee,
        distance: Math.round(distance * 10) / 10,
        label: 'Estimado por zona y volumen'
      };
    } catch {
      if (serial !== shippingSerial) return;
      state.order.shipping = { status: 'error', fee: 0, distance: 0, label: 'Por confirmar por WhatsApp' };
    }
    saveState();
    renderSelection({ items: false, context: false, preserveScroll: true });
  }

  function scheduleShipping(delay = 300) {
    clearTimeout(shippingTimer);
    shippingTimer = setTimeout(calculateShipping, delay);
  }

  function selectionMessage() {
    const items = selectionItems();
    const total = selectionTotal();
    const price = getUnitPrice(total);
    const subtotal = total * price;
    const delivery = shippingDisplay();
    const grandTotal = subtotal + delivery.fee;
    const context = state.order.context;
    const shippingLine = state.order.fulfillment === 'pickup'
      ? 'Recolección en WTC: $0'
      : state.order.shipping.status === 'ready'
        ? `Entrega a domicilio · CP ${state.order.postalCode}: $${delivery.fee} MXN estimados`
        : `Entrega a domicilio · CP ${state.order.postalCode}: por confirmar`;
    return `Hola, quiero pedir ANTOJO.

Tipo de pedido: ${purposeLabel(context.purpose)}
Nombre: ${context.name || 'Por definir'}
Fecha: ${context.date || 'Por definir'}${isEventPurpose(context.purpose) ? `
Personas/invitados: ${context.guests || 'Por definir'}
Lugar o zona: ${context.place || 'Por definir'}` : ''}
Notas: ${context.notes || 'Sin notas adicionales'}

Mi selección:
${items.map(item => `${item.quantity} × ${item.name}`).join('\n')}

Total: ${total} bebidas
Precio base: $${price} c/u
Subtotal de bebidas: $${subtotal.toLocaleString('es-MX')} MXN
Personalización: ${state.order.personalizedRequested ? 'Solicitada · por cotizar' : 'No solicitada'}
${shippingLine}
Total estimado sin personalización: $${grandTotal.toLocaleString('es-MX')} MXN
${total >= 150 ? 'Logística de refrigeración: por confirmar\n' : ''}
¿Me ayudan a confirmar disponibilidad, ingredientes especiales, entrega, personalización y total final antes del cobro?`;
  }

  function validateOrderBeforeSend() {
    const total = selectionTotal();
    const context = state.order.context;
    if (!total) return toast('Agrega al menos una bebida para continuar.'), false;
    if (!context.purpose) return toast('Indica para qué es tu pedido.'), false;
    if (context.name.trim().length < 2) return toast('Escribe un nombre de contacto.'), false;
    if (isEventPurpose(context.purpose)) {
      if (!context.date) return toast('Selecciona la fecha del evento.'), false;
      if (!(Number(context.guests) > 0)) return toast('Indica cuántas personas asistirán.'), false;
      if (context.place.trim().length < 2) return toast('Escribe el lugar o zona del evento.'), false;
    }
    if (state.order.personalizedRequested && total < 50) return toast('La personalización está disponible desde 50 piezas.'), false;
    if (state.order.fulfillment === 'delivery') {
      if (total < CONFIG.minimumDeliveryQuantity) return toast(`La entrega está disponible desde ${CONFIG.minimumDeliveryQuantity} bebidas.`), false;
      if (!/^\d{5}$/.test(state.order.postalCode)) {
        toast('Escribe un código postal válido de 5 dígitos.');
        $('#orderPostalCode')?.focus();
        return false;
      }
      if (state.order.shipping.status === 'loading') return toast('Estamos actualizando el costo de envío.'), false;
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
    if (personalized) state.event.personalizedRequested = personalized.checked;
    [['#contactName', 'name', 100], ['#eventDate', 'date', 20], ['#eventPlace', 'place', 180], ['#eventNotes', 'notes', 800]].forEach(([selector, key, max]) => {
      const node = $(selector);
      if (node) state.event[key] = node.value.trim().slice(0, max);
    });
    if (suggestedQuantity() < 50) state.event.personalizedRequested = false;
    saveState();
  }

  function isDesktopEvent() {
    return matchMedia('(min-width:981px)').matches;
  }

  function renderEventSummary() {
    const node = $('#eventSummary');
    if (!node) return;
    const quantity = suggestedQuantity();
    const price = getUnitPrice(quantity);
    node.innerHTML = `<small>RESUMEN</small><b>${esc(state.event.type || 'Evento por definir')} · ${quantity} latas</b><span>${state.event.guests} personas · ${state.event.servings} bebida${state.event.servings === 1 ? '' : 's'} por persona<br>Precio base estimado: $${price} c/u<br>Personalización: ${state.event.personalizedRequested ? 'Solicitada · por cotizar' : 'No solicitada'} · ${state.event.date ? esc(state.event.date) : 'Fecha por definir'}</span>`;
  }

  function updateEventMath() {
    syncEventInputs();
    const quantity = suggestedQuantity();
    const node = $('#suggestedQuantity');
    if (node) node.textContent = `${quantity} latas`;
    const toggle = $('#personalized');
    const row = toggle?.closest('.toggle-row');
    if (toggle) {
      toggle.disabled = quantity < 50;
      toggle.checked = quantity >= 50 && state.event.personalizedRequested;
    }
    row?.classList.toggle('is-disabled', quantity < 50);
    const copy = row?.querySelector('small');
    if (copy) copy.textContent = quantity < 50
      ? 'Disponible desde 50 piezas.'
      : 'Se solicita ahora y se cotiza según diseño, impresión y colocación.';
    renderEventSummary();
  }

  function ensureDirectQuoteButton() {
    const actions = $('.event-page .form-actions');
    if (!actions || $('#eventQuoteDirect')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'eventQuoteDirect';
    button.className = 'button button--secondary event-direct-quote';
    button.textContent = 'Cotizar sin elegir sabores';
    actions.appendChild(button);
  }

  function renderEvent() {
    const desktop = isDesktopEvent();
    const step = state.event.step;
    const page = $('.event-page');
    page?.classList.toggle('event-page--all', desktop);
    $$('.form-step').forEach(section => section.classList.toggle('is-active', desktop || Number(section.dataset.step) === step));
    const label = $('#eventStepLabel');
    const progress = $('#eventProgress');
    const back = $('#eventBack');
    const next = $('#eventNext');
    if (label) label.textContent = desktop ? 'Cotización completa' : `Paso ${step} de 3`;
    if (progress) progress.style.width = desktop ? '100%' : `${step * 33.333}%`;
    if (back) back.textContent = desktop || step === 1 ? 'Volver' : 'Atrás';
    if (next) next.textContent = desktop || step === 3 ? 'Elegir sabores' : 'Continuar';
    const error = $('#eventError');
    if (error) error.textContent = '';
    $$('[data-choice-group="eventType"] button').forEach(button => button.classList.toggle('is-active', button.dataset.value === state.event.type));
    [['#guestCount', 'guests'], ['#servings', 'servings'], ['#contactName', 'name'], ['#eventDate', 'date'], ['#eventPlace', 'place'], ['#eventNotes', 'notes']].forEach(([selector, key]) => {
      const node = $(selector);
      if (node && String(node.value) !== String(state.event[key])) node.value = state.event[key];
    });
    const personalized = $('#personalized');
    if (personalized) personalized.checked = state.event.personalizedRequested;
    ensureDirectQuoteButton();
    const direct = $('#eventQuoteDirect');
    if (direct) direct.hidden = !(desktop || step === 3);
    updateEventMath();
  }

  function eventPurposeId(type) {
    const map = {
      Boda: 'boda',
      Cumpleaños: 'cumpleanos',
      'Evento corporativo': 'corporativo',
      'Reunión privada': 'reunion',
      Otro: 'otro'
    };
    return map[type] || 'otro';
  }

  function eventMessage() {
    const quantity = suggestedQuantity();
    const price = getUnitPrice(quantity);
    const subtotal = quantity * price;
    return `Hola, quiero cotizar un evento con ANTOJO.

Nombre: ${state.event.name || 'Por definir'}
Tipo de evento: ${state.event.type}
Personas: ${state.event.guests}
Cantidad sugerida: ${quantity} latas
Precio base estimado: $${price} c/u
Subtotal estimado de bebidas: $${subtotal.toLocaleString('es-MX')} MXN
Servicio: ${state.event.servings} bebida${state.event.servings === 1 ? '' : 's'} por persona
Personalización: ${state.event.personalizedRequested ? 'Solicitada · por cotizar' : 'No solicitada'}
Fecha: ${state.event.date || 'Por definir'}
Lugar: ${state.event.place || 'Por definir'}
Notas: ${state.event.notes || 'Sin notas adicionales'}

El estimado no incluye envío, ingredientes especiales, barra, catering ni logística adicional. ¿Me ayudan a confirmar opciones, disponibilidad y total final?`;
  }

  function validateEventAll() {
    syncEventInputs();
    const error = $('#eventError');
    if (!state.event.type) {
      if (error) error.textContent = 'Elige el tipo de evento.';
      return false;
    }
    if (state.event.name.length < 2) {
      if (error) error.textContent = 'Escribe tu nombre para dar seguimiento.';
      $('#contactName')?.focus();
      return false;
    }
    if (!state.event.date) {
      if (error) error.textContent = 'Selecciona la fecha del evento.';
      $('#eventDate')?.focus();
      return false;
    }
    if (state.event.place.length < 2) {
      if (error) error.textContent = 'Escribe el lugar o zona.';
      $('#eventPlace')?.focus();
      return false;
    }
    return true;
  }

  function transferEventToOrder() {
    if (!validateEventAll()) return;
    const quantity = suggestedQuantity();
    state.order.context = {
      purpose: eventPurposeId(state.event.type),
      name: state.event.name,
      date: state.event.date,
      guests: String(state.event.guests),
      place: state.event.place,
      notes: state.event.notes
    };
    state.order.personalizedRequested = state.event.personalizedRequested && quantity >= 50;
    if (!state.order.packageTarget) state.order.packageTarget = quantity;
    saveState();
    navigate('menu');
    setTimeout(() => {
      if (selectionTotal()) openSelectionPanel();
      else {
        document.querySelector('.package-picker')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        toast(`Tu evento quedó guardado. Ahora elige sabores hasta completar ${quantity} bebidas.`);
      }
    }, 180);
  }

  function scrollEventCardToTop() {
    requestAnimationFrame(() => $('.onboarding-card')?.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    }));
  }

  function eventNext() {
    syncEventInputs();
    const error = $('#eventError');
    if (isDesktopEvent()) return transferEventToOrder();
    if (state.event.step === 1 && !state.event.type) {
      if (error) error.textContent = 'Elige el tipo de evento para continuar.';
      return;
    }
    if (state.event.step === 3) return transferEventToOrder();
    state.event.step += 1;
    saveState();
    renderEvent();
    scrollEventCardToTop();
  }

  function eventBack() {
    if (isDesktopEvent() || state.event.step === 1) {
      navigate('inicio');
      return;
    }
    state.event.step -= 1;
    saveState();
    renderEvent();
    scrollEventCardToTop();
  }

  function syncOrderContextInput(target) {
    const map = {
      orderContactName: ['name', 100],
      orderNeededDate: ['date', 20],
      orderGuests: ['guests', 6],
      orderPlace: ['place', 180],
      orderNotes: ['notes', 800]
    };
    const config = map[target.id];
    if (!config) return false;
    const [key, max] = config;
    state.order.context[key] = String(target.value || '').slice(0, max);
    saveState();
    renderOrderTotals();
    return true;
  }

  function bind() {
    document.addEventListener('click', event => {
      const route = event.target.closest('[data-route]');
      if (route) {
        event.preventDefault();
        navigate(route.dataset.route);
        return;
      }

      if (event.target.closest('[data-faq-open]')) {
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
        saveState();
        renderFilters();
        renderProducts();
        return;
      }

      const packageButton = event.target.closest('[data-package]');
      if (packageButton) {
        applyPackage(packageButton.dataset.package);
        return;
      }

      const purpose = event.target.closest('[data-order-purpose]');
      if (purpose) {
        state.order.context.purpose = purpose.dataset.orderPurpose;
        saveState();
        renderOrderContext();
        renderOrderTotals();
        return;
      }

      const fulfillment = event.target.closest('[data-fulfillment]');
      if (fulfillment) {
        const summary = $('#selectionSummary');
        const scrollTop = summary?.scrollTop || 0;
        state.order.fulfillment = fulfillment.dataset.fulfillment === 'delivery' ? 'delivery' : 'pickup';
        if (state.order.fulfillment === 'pickup') state.order.shipping = { status: 'idle', fee: 0, distance: 0, label: '' };
        saveState();
        renderSelection({ overview: false, items: false, context: false, preserveScroll: true });
        requestAnimationFrame(() => { if (summary) summary.scrollTop = scrollTop; });
        scheduleShipping(40);
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
        saveState();
        renderEvent();
        return;
      }

      if (event.target.closest('[data-selection-toggle]')) {
        openSelectionPanel();
        return;
      }
      if (event.target.closest('[data-scroll-selection]')) {
        $('#selectionItemsContainer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      if (event.target.closest('#eventQuoteDirect')) {
        if (validateEventAll()) openWhatsApp(eventMessage());
        return;
      }
      if (event.target.closest('#eventNext')) {
        eventNext();
        return;
      }
      if (event.target.closest('#eventBack')) {
        eventBack();
      }
    });

    document.addEventListener('change', event => {
      if (event.target.matches('#orderPersonalized')) {
        state.order.personalizedRequested = event.target.checked;
        saveState();
        renderOrderTotals();
        return;
      }
      if (event.target.matches('[data-qty-input]')) {
        setQuantity(event.target.dataset.qtyInput, event.target.value);
        return;
      }
      if (syncOrderContextInput(event.target)) return;
    });

    document.addEventListener('input', event => {
      if (event.target.matches('#orderPostalCode')) {
        state.order.postalCode = event.target.value.replace(/\D/g, '').slice(0, 5);
        event.target.value = state.order.postalCode;
        state.order.shipping = { status: 'idle', fee: 0, distance: 0, label: '' };
        saveState();
        renderOrderTotals();
        renderSelectionBar();
        scheduleShipping();
        return;
      }
      syncOrderContextInput(event.target);
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
      saveState();
      renderProducts();
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
    window.addEventListener('resize', () => renderEvent());
  }

  function start() {
    void COLD_CHAIN_CONFIG;
    bootLoader();
    bind();
    renderMenu();
    renderEvent();
    navigate(normalizeRoute(location.hash), false);
    scheduleShipping(120);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
