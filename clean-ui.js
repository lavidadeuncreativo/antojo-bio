(()=>{
  'use strict';
  const A = window.ANTOJO;
  const {$, $$, state} = A;
  A.carousels = [];
  A.selectedProductId = '';
  A.selectedProductQty = 1;
  let toastTimer = 0;

  A.toast = message => {
    const node = $('#toast');
    if (!node) return;
    clearTimeout(toastTimer);
    node.textContent = message;
    node.classList.add('show');
    toastTimer = setTimeout(() => node.classList.remove('show'), 2600);
  };

  A.closeMobileMenu = () => {
    $('#mobileMenu')?.classList.remove('open');
    $('#mobileMenu')?.setAttribute('aria-hidden', 'true');
  };
  A.openMobileMenu = () => {
    $('#mobileMenu')?.classList.add('open');
    $('#mobileMenu')?.setAttribute('aria-hidden', 'false');
  };

  A.showScreen = (name, scrollTop = true) => {
    A.closeProduct();
    A.closeMobileMenu();
    state.screen = name;
    $$('.screen').forEach(screen => screen.classList.toggle('active', screen.dataset.screen === name));
    $$('.bottom-nav button').forEach(button => button.classList.toggle('active', button.dataset.screenLink === name));
    if (scrollTop) $(`[data-screen="${name}"]`)?.scrollTo({top:0, behavior:'instant'});
    if (name === 'home') A.renderHome();
    if (name === 'menu') A.renderMenu();
    if (name === 'cart') A.renderCart();
    if (name === 'checkout') A.renderCheckout?.();
  };

  A.updateCounts = () => {
    const qty = A.totalQty();
    ['#headerCartCount','#navCartCount'].forEach(selector => {
      const node = $(selector);
      if (!node) return;
      node.textContent = qty;
      node.classList.toggle('show', qty > 0);
    });
    const navText = $('.bottom-nav [data-screen-link="cart"] span');
    if (navText) navText.textContent = A.isQuote() ? 'Cotización' : 'Pedido';
  };

  A.productCard = (product, mini = false) => {
    const count = Number(state.cart[product.id] || 0);
    if (mini) return `<button type="button" class="carousel-card" data-product-id="${product.id}"><div class="image" style="background:${product.bg}"><img src="${product.image}" alt="${A.escape(product.name)}" loading="lazy"></div><b>${A.escape(product.name)}</b><small>${A.escape(product.friendly)}</small><i>+</i></button>`;
    return `<button type="button" class="product-card reveal visible" data-product-id="${product.id}" style="background:${product.bg}">${count ? `<span class="count">${count} en pedido</span>` : ''}<span class="plus">+</span><div class="product-image"><img src="${product.image}" alt="${A.escape(product.name)}" loading="lazy"></div><h3>${A.escape(product.name)}</h3><p>${A.escape(product.friendly)}</p></button>`;
  };

  class AutoCarousel {
    constructor(root) {
      this.root = root;
      this.track = $('.carousel-track', root);
      this.x = 0;
      this.width = 0;
      this.pauseUntil = 0;
      this.speed = 0.17;
      this.last = performance.now();
      this.raf = 0;
      this.setup();
    }
    setup() {
      const originals = [...this.track.children];
      originals.forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        this.track.appendChild(clone);
      });
      const measure = () => {
        const half = Math.floor(this.track.children.length / 2);
        this.width = [...this.track.children].slice(0, half).reduce((sum, item) => sum + item.getBoundingClientRect().width + 11, 0);
      };
      requestAnimationFrame(measure);
      window.addEventListener('resize', measure, {passive:true});
      const pause = duration => { this.pauseUntil = performance.now() + duration; };
      this.root.addEventListener('pointerdown', () => pause(3200), {passive:true});
      this.root.addEventListener('touchstart', () => pause(3200), {passive:true});
      this.root.addEventListener('wheel', () => pause(2600), {passive:true});
      this.root.addEventListener('mouseenter', () => pause(100000));
      this.root.addEventListener('mouseleave', () => pause(700));
      this.root.addEventListener('focusin', () => pause(100000));
      this.root.addEventListener('focusout', () => pause(700));
      const tick = now => {
        const delta = Math.min(35, now - this.last);
        this.last = now;
        if (now > this.pauseUntil && this.width > 0 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
          this.x += this.speed * delta / 16.67;
          if (this.x >= this.width) this.x -= this.width;
          this.track.style.transform = `translate3d(${-this.x}px,0,0)`;
        }
        if (this.root.isConnected) this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    }
    destroy() { cancelAnimationFrame(this.raf); }
  }

  A.renderHome = () => {
    $('#faqList').innerHTML = A.FAQS.map(([question, answer]) => `<details><summary>${A.escape(question)}</summary><p>${A.escape(answer)}</p></details>`).join('');
    const collections = {
      favorites:['espresso-horchata','mojito-mariposa','maracuya-limon','clericot'],
      event:['clericot','mezcalita-jamaica','mojito-clasico','maracuya-limon'],
      zero:['maracuya-limon','jamaica-limon','horchata','pepino-limon']
    };
    Object.entries(collections).forEach(([name, ids]) => {
      const track = $(`#${name}Track`);
      if (track) track.innerHTML = ids.map(id => A.productCard(A.product(id), true)).join('');
    });
    A.carousels.splice(0).forEach(instance => instance.destroy());
    $$('.auto-carousel').forEach(root => A.carousels.push(new AutoCarousel(root)));
    A.observeReveals();
  };

  A.renderJourneySummary = () => {
    const root = $('#journeySummary');
    if (!root) return;
    const qty = A.totalQty();
    if (!state.journey || state.journey === 'order') {
      root.innerHTML = '';
      return;
    }
    const target = Math.max(1, Number(state.eventTarget || qty || 1));
    const progress = Math.min(100, qty / target * 100);
    if (state.journey === 'event') {
      root.innerHTML = `<section class="journey-summary"><p class="eyebrow">EVENTO · ${A.escape(state.eventType || 'POR DEFINIR')}</p><h2>${target} bebidas para ${Number(state.eventGuests || 0)} personas</h2><p>${A.escape(state.eventService || 'Solo bebidas')} · ${state.dateUnknown ? 'Fecha por definir' : A.escape(state.date || 'Fecha por definir')}</p><button type="button" data-edit-journey="event">Editar</button><div class="journey-meter"><i style="width:${progress}%"></i></div><small>${qty} bebidas seleccionadas</small></section>`;
    } else {
      root.innerHTML = `<section class="journey-summary"><p class="eyebrow">PERSONALIZADAS · ${A.escape(state.customUse || 'TU IDEA')}</p><h2>${target} bebidas de referencia</h2><p>${A.escape(state.customIdea || 'Frase, logo o identidad por definir.')}</p><button type="button" data-edit-journey="custom">Editar</button><div class="journey-meter"><i style="width:${progress}%"></i></div><small>${qty} bebidas seleccionadas</small></section>`;
    }
  };

  A.renderMenu = () => {
    A.renderJourneySummary();
    const context = $('#menuContextCopy');
    if (context) context.textContent = state.journey === 'event' ? 'Distribuye tu cantidad de referencia entre los sabores que prefieras.' : state.journey === 'custom' ? 'Elige los sabores de tu propuesta personalizada.' : 'Toca una bebida para conocerla y agregarla.';
    $('#categoryChips').innerHTML = A.CATEGORIES.map(category => `<button type="button" class="${state.category === category.id ? 'active' : ''}" data-category="${category.id}">${category.label}</button>`).join('');
    const term = A.normalize(state.search);
    const products = A.PRODUCTS.filter(product => (state.category === 'all' || product.category === state.category) && (!term || A.normalize(`${product.name} ${product.description} ${product.friendly}`).includes(term)));
    $('#productGrid').innerHTML = products.length ? products.map(product => A.productCard(product)).join('') : '<div class="empty-state" style="grid-column:1/-1"><h2>No encontramos esa bebida.</h2><p>Prueba con otro sabor o categoría.</p></div>';
    const search = $('#productSearch');
    search.value = state.search;
    search.oninput = event => { state.search = event.target.value; A.renderMenu(); requestAnimationFrame(() => $('#productSearch')?.focus()); };
    A.persist();
  };

  A.closeProduct = () => {
    const modal = $('#productModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  A.openProduct = id => {
    const product = A.product(id);
    if (!product) return;
    A.selectedProductId = id;
    A.selectedProductQty = ['event','custom'].includes(state.journey) ? 10 : 1;
    A.renderProductSheet();
    $('#productModal').classList.add('open');
    $('#productModal').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  A.renderProductSheet = () => {
    const product = A.product(A.selectedProductId);
    if (!product) return;
    const quote = A.isQuote() || A.totalQty() + A.selectedProductQty >= 50;
    const plan = A.pricePlan(A.totalQty() + A.selectedProductQty);
    const facts = ['330 ml','Refrigerada',product.alcohol ? 'Con alcohol' : 'Sin alcohol',product.caffeine ? 'Con cafeína' : 'Sin cafeína',product.dairy ? 'Contiene lácteos' : 'Sin lácteos'];
    $('#productSheetContent').innerHTML = `<div class="sheet-media" style="background:${product.bg}"><img src="${product.image}" alt="${A.escape(product.name)}"></div><div class="sheet-content"><p class="eyebrow">${A.escape(product.categoryLabel)}</p><h2>${A.escape(product.name)}</h2><p>${A.escape(product.description)} ${A.escape(product.friendly)}.</p><div class="product-facts">${facts.map(fact => `<span>${fact}</span>`).join('')}</div><div class="sheet-price"><small>${quote ? 'Precio revisado para tu cotización' : `Precio según el total · ${plan.band}`}</small><strong>${quote ? 'Por cotizar' : `${A.money(plan.unit)} c/u`}</strong></div>${quote ? '<div class="quick-qty"><button data-sheet-qty="10">10</button><button data-sheet-qty="25">25</button><button data-sheet-qty="50">50</button><button data-sheet-qty="100">100</button></div>' : ''}<div class="qty-row"><span>¿Cuántas agregamos?</span><div class="stepper"><button type="button" data-sheet-minus>−</button><b>${A.selectedProductQty}</b><button type="button" data-sheet-plus>+</button></div></div><button type="button" class="sheet-add" id="addProduct"><span>Agregar al pedido</span><span>${quote ? 'Cotizar' : A.money(A.selectedProductQty * plan.unit)}</span></button></div>`;
  };

  A.changeCart = (id, delta) => {
    state.cart[id] = Math.max(0, Number(state.cart[id] || 0) + Number(delta || 0));
    if (!state.cart[id]) delete state.cart[id];
    A.persist();
    A.updateCounts();
    A.renderCart();
    A.renderJourneySummary();
  };

  A.renderCart = () => {
    const root = $('#cartContent');
    const items = A.cartItems();
    const qty = A.totalQty();
    A.updateCounts();
    if (!qty) {
      root.innerHTML = '<div class="page-title"><p class="eyebrow">Tu pedido</p><h1>Arma tu antojo.</h1></div><div class="empty-state"><div class="empty-icon"><svg viewBox="0 0 24 24"><path d="M3 4h2l2 12h10l2-8H6"/></svg></div><h2>Tu pedido todavía está vacío.</h2><p>Explora el menú, combina sabores y agrega las cantidades que necesites.</p><button type="button" class="btn btn-dark" data-screen-link="menu">Ver menú</button></div>';
      return;
    }
    const quote = A.isQuote();
    const plan = A.pricePlan(qty);
    const target = Number(state.eventTarget || qty);
    const remaining = Math.max(0, target - qty);
    root.innerHTML = `<div class="page-title"><p class="eyebrow">${quote ? 'Tu cotización' : 'Tu pedido'}</p><h1>${qty} bebidas.</h1><p>${quote ? 'Puedes ajustar cada sabor antes de registrar la cotización.' : 'Este es el precio correspondiente a tu cantidad.'}</p></div><div class="cart-list">${items.map(item => `<article class="cart-item"><div class="cart-thumb" style="background:${item.bg}"><img src="${item.image}" alt="${A.escape(item.name)}"></div><div class="cart-copy"><b>${A.escape(item.name)}</b><span>${A.escape(item.categoryLabel)}</span><button type="button" data-remove-item="${item.id}">Quitar</button></div><div class="stepper"><button type="button" data-cart-minus="${item.id}">−</button><b>${item.qty}</b><button type="button" data-cart-plus="${item.id}">+</button></div></article>`).join('')}</div>${quote ? `<section class="quote-card"><small>Cotización personalizada</small><h3>${target ? `${qty} de ${target} bebidas seleccionadas` : `${qty} bebidas seleccionadas`}</h3><p>${remaining ? `Aún puedes distribuir ${remaining} bebidas entre los sabores. La referencia no limita tu selección.` : 'La selección de referencia está completa. Revisaremos precio, fecha, personalización y logística.'}</p></section>` : `<section class="price-card"><small>Tu precio por cantidad</small><h3>${A.money(plan.unit)} por bebida</h3><p>${plan.band}. El precio cambia automáticamente según el total.</p></section>`}<section class="cart-total"><div class="total-row"><span>${qty} bebidas</span><b>${quote ? 'Por cotizar' : A.money(qty * plan.unit)}</b></div><div class="total-row"><span>Entrega</span><b>Se define al continuar</b></div><div class="total-row final"><span>${quote ? 'Estado' : 'Estimado'}</span><b>${quote ? 'Cotización personalizada' : A.money(A.totalEstimate())}</b></div></section><div class="cart-actions"><button type="button" class="btn btn-dark" id="startCheckout">${quote ? 'Registrar mi cotización' : 'Continuar con mi pedido'}</button><button type="button" class="btn btn-light" data-screen-link="menu">Seguir agregando</button></div>`;
  };

  A.observeReveals = () => {
    const root = $('#homeScreen');
    if (!root || !('IntersectionObserver' in window)) {
      $$('.reveal').forEach(node => node.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), {root, threshold:.05, rootMargin:'0px 0px 80px'});
    $$('.reveal', root).forEach(node => node.classList.contains('visible') || observer.observe(node));
  };
})();
