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
    { quantity: 50, label: 'Pack 50', detail: 'Ideal para reuniones y cumpleaños', price: 53 },
    { quantity: 100, label: 'Pack 100', detail: 'Para eventos medianos y equipos', price: 52 },
    { quantity: 150, label: 'Pack 150', detail: 'Mejor precio por volumen', price: 50 }
  ];

  const PACKAGE_PRODUCTS = [
    'mojito-mariposa', 'espresso-horchata', 'horchata', 'mojito-clasico', 'maracuya-limon',
    'mezcalita-jamaica', 'mojito-mocktail', 'cold-brew', 'margarita-mezcal', 'mariposa-mocktail'
  ];

  const state = {
    route: 'inicio',
    filter: 'all',
    search: '',
    quantities: loadJson('antojo-selection-v14', loadJson('antojo-selection-v13', {})),
    order: loadJson('antojo-order-v1', {
      packageTarget: 0,
      personalized: false,
      fulfillment: 'pickup',
      postalCode: ''
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
      localStorage.setItem('antojo-selection-v14', JSON.stringify(state.quantities));
      localStorage.setItem('antojo-order-v1', JSON.stringify(state.order));
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
    toast.timer = setTimeout(() => node.classList.remove('is-visible'), 2800);
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
    const complete = () => setTimeout(finishLoader, Math.max(0, 700 - (performance.now() - started)));
    if (document.readyState === 'complete') complete();
    else window.addEventListener('load', complete, { once: true });
    setTimeout(finishLoader, 1800);
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
    if (total <= 10) return 60;
    if (total <= 20) return 58;
    if (total <= 49) return 55;
    if (total <= 99) return 53;
    if (total <= 149) return 52;
    return 50;
  }

  function personalizedUnitPrice(total) {
    if (total < 50) return null;
    if (total <= 99) return 65;
    if (total <= 149) return 62;
    return 60;
  }

  function activeUnitPrice(total) {
    if (state.order.personalized) return personalizedUnitPrice(total);
    return standardUnitPrice(total);
  }

  function selectionItems() {
    return PRODUCTS
      .map(product => ({ ...product, quantity: Number(state.quantities[product.id] || 0) }))
      .filter(item => item.quantity > 0);
  }

  function selectionTotal() {
    return selectionItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  function updateQuantity(id, delta) {
    const next = Math.max(0, Math.min(999, Number(state.quantities[id] || 0) + delta));
    if (next === 0) delete state.quantities[id];
    else state.quantities[id] = next;
    if (selectionTotal() < 50 && state.order.personalized) state.order.personalized = false;
    saveState();
    renderMenu();
  }

  function clearSelection() {
    state.quantities = {};
    state.order.packageTarget = 0;
    state.order.personalized = false;
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
    if (target < 50) state.order.personalized = false;
    saveState();
    renderMenu();
    toast(`Armamos una mezcla sugerida de ${target} bebidas. Puedes cambiar los sabores.`);
  }

  function renderPackages() {
    const node = $('#packageOptions');
    if (!node) return;
    node.innerHTML = PACKAGES.map(item => `
      <button type="button" class="package-card ${state.order.packageTarget === item.quantity ? 'is-active' : ''}" data-package="${item.quantity}">
        <span>${item.label}</span>
        <strong>${item.quantity} bebidas</strong>
        <small>${item.detail}</small>
        <b>Desde $${item.price} c/u</b>
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
          <span class="product-row__price">$65 individual · baja por volumen</span>
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

  function fulfillmentCopy() {
    if (state.order.fulfillment === 'pickup') return 'Recoger en WTC · sin costo';
    return state.order.postalCode ? `Entrega a domicilio · CP ${state.order.postalCode}` : 'Entrega a domicilio · falta código postal';
  }

  function renderSelection() {
    const summary = $('#selectionSummary');
    const bar = $('#selectionBar');
    if (!summary || !bar) return;

    const items = selectionItems();
    const total = selectionTotal();
    const price = activeUnitPrice(total);
    const subtotal = price ? total * price : 0;
    const target = Number(state.order.packageTarget || 0);
    const packageProgress = target ? Math.min(100, Math.round((total / target) * 100)) : 0;
    const shippingCopy = state.order.fulfillment === 'pickup' ? '$0' : 'Se cotiza con tu CP';
    const totalLabel = state.order.fulfillment === 'pickup' ? 'Total' : 'Subtotal sin envío';

    const itemsHtml = total
      ? `<div class="selection-items">${items.map(item => `<article class="selection-item"><img src="${item.image}" alt=""><div><b>${esc(item.name)}</b><small>${esc(item.categoryName)}</small></div><div class="qty"><button type="button" data-qty-id="${item.id}" data-delta="-1" aria-label="Quitar una">−</button><span>${item.quantity}</span><button type="button" data-qty-id="${item.id}" data-delta="1" aria-label="Agregar una">+</button></div></article>`).join('')}</div>`
      : '<div class="selection-empty selection-empty--compact"><div><span>+</span><h4>Todavía no eliges bebidas.</h4><p>Elige un paquete o agrega sabores uno por uno.</p></div></div>';

    const packageHtml = target ? `<div class="package-progress"><div><span>Pack de ${target}</span><b>${total}/${target}</b></div><i><em style="width:${packageProgress}%"></em></i><small>${total < target ? `Te faltan ${target - total} bebidas por elegir.` : total === target ? 'Tu paquete está completo.' : `Llevas ${total - target} bebidas extra.`}</small></div>` : '';
    const personalizationDisabled = total < 50;

    summary.innerHTML = `${itemsHtml}
      <div class="order-config">
        ${packageHtml}
        <label class="order-toggle ${personalizationDisabled ? 'is-disabled' : ''}">
          <input type="checkbox" id="orderPersonalized" ${state.order.personalized ? 'checked' : ''} ${personalizationDisabled ? 'disabled' : ''}>
          <span><b>Personalizar las latas</b><small>${personalizationDisabled ? 'Disponible desde 50 bebidas.' : 'Incluye diseño de etiqueta. El precio cambia por volumen.'}</small></span>
        </label>
        <fieldset class="fulfillment-options"><legend>¿Cómo las recibes?</legend>
          <button type="button" class="${state.order.fulfillment === 'pickup' ? 'is-active' : ''}" data-fulfillment="pickup"><b>Recoger en WTC</b><small>Sin costo de envío</small></button>
          <button type="button" class="${state.order.fulfillment === 'delivery' ? 'is-active' : ''}" data-fulfillment="delivery"><b>Entrega a domicilio</b><small>Tarifa según código postal</small></button>
        </fieldset>
        ${state.order.fulfillment === 'delivery' ? `<label class="postal-field"><span>Código postal de entrega</span><input id="orderPostalCode" type="text" inputmode="numeric" maxlength="5" pattern="[0-9]{5}" value="${esc(state.order.postalCode)}" placeholder="Ej. 03100"><small>La tarifa real se confirma con la mensajería disponible antes de cobrar. No usamos una tarifa inventada.</small></label>` : ''}
      </div>
      <div class="selection-totals">
        <div class="selection-total-row"><span>Bebidas</span><b>${total}</b></div>
        <div class="selection-total-row"><span>Presentación</span><b>${state.order.personalized ? 'Personalizada' : 'ANTOJO.'}</b></div>
        <div class="selection-total-row"><span>Precio por bebida</span><b>${price ? `$${price}` : total ? 'Mínimo 50' : '—'}</b></div>
        <div class="selection-total-row"><span>Entrega</span><b>${shippingCopy}</b></div>
        <div class="selection-total-row selection-total-row--strong"><span>${totalLabel}</span><b>${price ? `$${subtotal.toLocaleString('es-MX')} MXN` : '$0 MXN'}</b></div>
        <p class="selection-note">${state.order.fulfillment === 'delivery' ? 'El total final se confirma cuando tengamos la tarifa real para tu CP.' : 'Recoger en WTC no agrega costo de envío.'}</p>
        <div class="selection-actions"><button class="selection-actions__primary" type="button" data-send-selection ${!total ? 'disabled' : ''}>Continuar por WhatsApp</button><button class="selection-actions__secondary" type="button" data-clear-selection ${!total ? 'disabled' : ''}>Vaciar selección</button></div>
      </div>`;

    if (!total) {
      bar.classList.remove('is-visible');
      bar.innerHTML = '';
      return;
    }

    bar.innerHTML = `<p><b>${total} ${total === 1 ? 'bebida' : 'bebidas'} · ${price ? `$${price} c/u` : 'personalización desde 50'}</b>${fulfillmentCopy()}</p><button type="button" data-selection-toggle>Ver selección</button>`;
    bar.classList.add('is-visible');
  }

  function selectionMessage() {
    const items = selectionItems();
    const total = selectionTotal();
    const price = activeUnitPrice(total);
    const subtotal = price ? total * price : 0;
    const delivery = state.order.fulfillment === 'delivery';
    return `Hola, quiero pedir ANTOJO.\n\nMi selección:\n${items.map(item => `${item.quantity} × ${item.name}`).join('\n')}\n\nTotal: ${total} bebidas\nPresentación: ${state.order.personalized ? 'Personalizada' : 'Lata ANTOJO.'}\nPrecio estimado: ${price ? `$${price} c/u` : 'Por confirmar'}\nSubtotal de bebidas: $${subtotal.toLocaleString('es-MX')} MXN\nEntrega: ${delivery ? `A domicilio · CP ${state.order.postalCode || 'pendiente'}` : 'Recoger en WTC'}\nEnvío: ${delivery ? 'Cotizar tarifa real antes de cobrar' : '$0'}\n\n¿Me ayudan a confirmar disponibilidad${delivery ? ', tarifa real de envío' : ''} y total final?`;
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
    if (state.order.fulfillment === 'delivery' && !/^\d{5}$/.test(state.order.postalCode)) {
      toast('Escribe un código postal válido de 5 dígitos.');
      $('#orderPostalCode')?.focus();
      return false;
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
        saveState();
        renderSelection();
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
      }
    });

    document.addEventListener('input', event => {
      if (event.target.matches('#orderPostalCode')) {
        state.order.postalCode = event.target.value.replace(/\D/g, '').slice(0, 5);
        event.target.value = state.order.postalCode;
        saveState();
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
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeDrawer();
        closeSelectionPanel();
        closeFaq();
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
