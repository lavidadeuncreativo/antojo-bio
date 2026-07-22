(() => {
  'use strict';

  const SHIPPING = {
    originPostalCode: '03103',
    originFallback: { lat: 19.3898, lon: -99.1717 },
    minimumDeliveryQuantity: 10,
    whatsappNumber: '525522026291'
  };

  const quote = {
    status: 'idle',
    postalCode: '',
    quantity: 0,
    fee: 0,
    distance: 0,
    label: ''
  };

  let patchQueued = false;
  let calculateTimer = null;
  let requestSerial = 0;
  let originPromise = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function injectMobileStyles() {
    if ($('#antojo-mobile-audit-styles')) return;
    const style = document.createElement('style');
    style.id = 'antojo-mobile-audit-styles';
    style.textContent = `
      @media (max-width:720px){
        :root{--header-h:58px}
        body{padding-bottom:calc(70px + var(--safe-bottom))}
        .site-header{height:var(--header-h);padding-inline:12px}
        .header-actions{gap:7px}
        .header-instagram,.header-faq,.route-indicator{display:none!important}
        .wordmark{font-size:21px}
        .header-menu{width:40px;height:40px;background:var(--paper)}
        .drawer{top:calc(var(--chrome-h) + 6px);right:7px;width:calc(100vw - 14px);max-height:calc(100dvh - var(--chrome-h) - 16px);overflow:auto;border-radius:22px}

        .home-layout{padding:15px 12px 84px;gap:18px}
        .home-intro h1{font-size:clamp(48px,14.4vw,66px);line-height:.82}
        .eyebrow{margin-bottom:10px;font-size:8px;letter-spacing:.13em}
        .home-lead{margin:13px 0 15px;font-size:13px;line-height:1.35}
        .bio-links{gap:6px}
        .bio-link{min-height:59px;grid-template-columns:39px minmax(0,1fr) 18px;gap:10px;padding:7px 10px;border-radius:17px}
        .bio-link__icon{width:38px;height:38px}
        .bio-link span small{margin-bottom:2px;font-size:7.5px;line-height:1.15}
        .bio-link span strong{font-size:16px;line-height:1.02}
        .bio-link>b{padding-top:2px}
        .home-proof{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:10px}
        .home-proof span{min-width:0;justify-content:center;padding:7px 4px;text-align:center;font-size:7.5px}
        .home-proof b{font-size:11px}
        .home-proof__delivery{grid-column:1/-1;display:flex!important;min-height:40px;gap:7px!important;padding-inline:12px!important}
        .home-proof__delivery b{font-size:10px!important}
        .home-proof__delivery span{display:inline!important;padding:0!important;border:0!important;background:none!important;color:inherit!important;font-size:9px!important}
        .home-art{height:300px;border-radius:24px}
        .home-art:after{inset:11px;border-radius:17px}
        .home-art__copy{top:8%;left:7%;font-size:clamp(31px,9.7vw,42px)}
        .hero-can{width:34%}
        .hero-can--top{right:6%;top:31%}
        .hero-can--bottom{left:24%;bottom:-1%}
        .home-art__stamp{right:5%;bottom:5%;padding:7px 9px;font-size:6px}

        .page-shell{padding:13px 12px 80px}
        .page-nav{position:relative;margin-bottom:17px;padding-bottom:9px}
        .page-nav button{font-size:10px}
        .page-nav button span{width:28px;height:28px}
        .page-header{margin-bottom:20px}
        .page-header .eyebrow{margin-bottom:11px}
        .page-header h2{font-size:clamp(42px,12.8vw,58px);line-height:.86}
        .page-header>p:last-child{margin-top:11px;font-size:12.5px;line-height:1.4}

        .package-picker{padding:14px;border-radius:19px;gap:12px;margin-bottom:14px}
        .package-picker h3{font-size:31px}
        .package-picker p{font-size:10.5px}
        .package-options{scroll-snap-type:x mandatory;overscroll-behavior-inline:contain}
        .package-card{flex-basis:172px;min-height:124px;scroll-snap-align:start;padding:13px}
        .package-card strong{font-size:19px}
        .package-card small{font-size:8.5px}

        .menu-tools{top:var(--chrome-h);margin-inline:-12px;padding:8px 12px 10px;background:rgba(255,247,223,.97);border-bottom:1px solid rgba(17,16,15,.08)}
        .filters{gap:6px}
        .filters button{padding:8px 10px;font-size:8.5px}
        .product-row{grid-template-columns:1fr;gap:8px;padding:13px 0;min-height:0}
        .product-row__number{display:none}
        .product-row__main{grid-template-columns:68px minmax(0,1fr);gap:9px}
        .product-row__image{height:92px}
        .product-row__image img{width:61px;height:88px;filter:drop-shadow(0 8px 5px rgba(54,33,21,.1))}
        .product-row h3{font-size:21px}
        .product-row__main p{font-size:9.5px;line-height:1.35}
        .product-row__facts{grid-column:1/-1;margin:0;gap:4px}
        .product-row__facts span{padding:5px 7px;font-size:7px}
        .product-row__action{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;margin:0}
        .product-row__price{max-width:128px;font-size:8px}
        .qty--editable{grid-template-columns:29px 44px 29px!important}
        .qty--editable input{height:29px}

        .order-panel{left:6px;right:6px;bottom:calc(76px + var(--safe-bottom));max-height:calc(100dvh - var(--chrome-h) - 86px);border-radius:22px}
        .order-panel__head{padding:15px}
        .order-panel__head h3{font-size:28px}
        .order-panel__content{padding:12px}
        .selection-bar{left:7px;right:7px;bottom:calc(76px + var(--safe-bottom));width:auto;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:10px 10px 10px 13px;border-radius:16px;transform:translateY(150%)}
        .selection-bar.is-visible{transform:translateY(0)}
        .selection-bar p{min-width:0;font-size:8.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .selection-bar p b{font-size:12px}
        .selection-bar button{padding:9px 11px;font-size:9px}
        body.has-mobile-selection .faq-floating{bottom:calc(148px + var(--safe-bottom))}

        .mobile-nav{left:6px;right:6px;bottom:calc(6px + var(--safe-bottom));height:62px;padding:6px;border-radius:19px;backdrop-filter:none;-webkit-backdrop-filter:none}
        .mobile-nav button,.mobile-nav a{border-radius:13px;font-size:7px}
        .mobile-nav span{font-size:14px}

        .event-page .onboarding-card{border-radius:20px}
        .event-page .progress-head{padding:13px 14px}
        .event-page #eventForm{padding:14px}
        .event-page .form-step{min-height:0}
        .event-page .form-step h3{font-size:28px}
        .event-page .form-step>p{margin:8px 0 11px;font-size:10px}
        .event-page .choice-grid{grid-template-columns:1fr 1fr;gap:6px}
        .event-page .choice-grid button{min-height:67px;padding:9px;border-radius:13px}
        .event-page .choice-grid button:last-child{grid-column:1/-1}
        .event-page .choice-grid button b{font-size:11px}
        .event-page .choice-grid button span{margin-top:4px;font-size:7.5px;line-height:1.2}
        .event-page .field-grid--two{grid-template-columns:1fr 1fr;gap:7px}
        .event-page .field{gap:5px;margin-bottom:8px}
        .event-page .field input,.event-page .field select{height:40px;border-radius:11px;padding-inline:9px}
        .event-page .field textarea{min-height:62px;padding:9px;border-radius:11px}
        .event-page .quantity-result{margin:8px 0;padding:10px;border-radius:13px}
        .event-page .quantity-result strong{font-size:25px}
        .event-page .toggle-row{margin-top:8px;padding:9px;border-radius:13px}
        .event-page .event-summary{margin-top:7px;padding:9px;border-radius:12px}
        .event-page .form-actions{bottom:calc(68px + var(--safe-bottom));margin:9px -14px -14px;padding:10px 14px;background:var(--paper);backdrop-filter:none;-webkit-backdrop-filter:none}
        .event-page .form-actions .button{min-height:40px;padding-inline:13px;font-size:10px}

        .dynamic-card{padding:19px;border-radius:21px}
        .dynamic-card h3{margin-top:20px;font-size:38px}
        .instagram-showcase__head{padding-inline:12px}
        .social-post{width:184px;flex-basis:184px}
        .social-post__visual{height:222px}
        .rewards-card--balanced{padding:21px 15px}
        .rewards-card--balanced .rewards-card__intro h3{font-size:45px}
        .rewards-card__visual .stamp-grid{gap:5px}
        .faq-dialog{top:calc(var(--chrome-h) + 4px);right:4px;bottom:calc(70px + var(--safe-bottom));width:calc(100vw - 8px);border-radius:20px}
        .faq-dialog__head{padding:17px}
        .faq-dialog__head h2{font-size:42px}
        .faq-list{padding-inline:17px}
        .faq-list summary{padding-block:15px;font-size:12px}
        .faq-list p{font-size:10.5px}
      }

      @media (max-width:390px){
        .home-intro h1{font-size:47px}
        .home-art{height:270px}
        .bio-link span strong{font-size:15px}
        .event-page .field-grid--two{grid-template-columns:1fr}
        .selection-bar p{max-width:190px}
      }
    `;
    document.head.appendChild(style);
  }

  function toast(message) {
    const node = $('#toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('is-visible');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove('is-visible'), 3400);
  }

  function uniqueQuantities() {
    const values = new Map();
    $$('[data-qty-input]').forEach(input => {
      const id = input.dataset.qtyInput;
      const value = Math.max(0, Math.round(Number(input.value) || 0));
      if (!id) return;
      values.set(id, Math.max(values.get(id) || 0, value));
    });
    return values;
  }

  function orderQuantity() {
    return [...uniqueQuantities().values()].reduce((sum, value) => sum + value, 0);
  }

  function standardUnitPrice(total) {
    if (!total) return 0;
    if (total <= 5) return 65;
    if (total <= 19) return 63;
    if (total <= 99) return 60;
    if (total <= 149) return 55;
    if (total <= 199) return 53;
    if (total <= 499) return 52;
    return 50;
  }

  function isPersonalized() {
    return Boolean($('#orderPersonalized')?.checked);
  }

  function isDelivery() {
    return Boolean($('[data-fulfillment="delivery"].is-active'));
  }

  function postalCode() {
    return String($('#orderPostalCode')?.value || '').replace(/\D/g, '').slice(0, 5);
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

  async function postalCoordinates(cp, fallback = null) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3200);
      const response = await fetch(`https://api.zippopotam.us/mx/${cp}`, { signal: controller.signal });
      clearTimeout(timer);
      if (!response.ok) throw new Error('CP no localizado');
      const data = await response.json();
      const place = data?.places?.[0];
      const lat = Number(place?.latitude);
      const lon = Number(place?.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error('Coordenadas inválidas');
      return { lat, lon };
    } catch {
      if (fallback) return fallback;
      throw new Error('No se pudo localizar el código postal');
    }
  }

  function originCoordinates() {
    if (!originPromise) {
      originPromise = postalCoordinates(SHIPPING.originPostalCode, SHIPPING.originFallback);
    }
    return originPromise;
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

  async function calculateQuote() {
    const cp = postalCode();
    const quantity = orderQuantity();
    const serial = ++requestSerial;

    if (!isDelivery()) {
      Object.assign(quote, { status: 'idle', postalCode: '', quantity, fee: 0, distance: 0, label: '' });
      queuePatch();
      return;
    }

    if (quantity < SHIPPING.minimumDeliveryQuantity) {
      Object.assign(quote, {
        status: 'minimum',
        postalCode: cp,
        quantity,
        fee: 0,
        distance: 0,
        label: `Entrega disponible desde ${SHIPPING.minimumDeliveryQuantity} bebidas`
      });
      queuePatch();
      return;
    }

    if (!/^\d{5}$/.test(cp)) {
      Object.assign(quote, { status: 'postal', postalCode: cp, quantity, fee: 0, distance: 0, label: 'Escribe un CP de 5 dígitos' });
      queuePatch();
      return;
    }

    Object.assign(quote, { status: 'loading', postalCode: cp, quantity, fee: 0, distance: 0, label: 'Calculando desde el punto de salida…' });
    queuePatch();

    try {
      const [origin, destination] = await Promise.all([
        originCoordinates(),
        postalCoordinates(cp)
      ]);
      if (serial !== requestSerial) return;
      const straightDistance = haversineKm(origin.lat, origin.lon, destination.lat, destination.lon);
      const operationalDistance = Math.max(0, straightDistance * 1.18);
      const fee = roundToTen(distanceBaseFee(operationalDistance) + volumeSurcharge(quantity));
      Object.assign(quote, {
        status: 'ready',
        postalCode: cp,
        quantity,
        fee,
        distance: Math.round(operationalDistance * 10) / 10,
        label: 'Estimado por zona y volumen'
      });
      window.antojoTrack?.('calculate_shipping_v2', { fee, quantity });
    } catch {
      if (serial !== requestSerial) return;
      Object.assign(quote, { status: 'error', postalCode: cp, quantity, fee: 0, distance: 0, label: 'No pudimos calcular el envío' });
    }
    queuePatch();
  }

  function scheduleQuote(delay = 260) {
    clearTimeout(calculateTimer);
    calculateTimer = setTimeout(calculateQuote, delay);
  }

  function rowByLabel(pattern) {
    return $$('.selection-total-row').find(row => pattern.test(row.querySelector('span')?.textContent || ''));
  }

  function patchSummary() {
    const selectionBar = $('#selectionBar');
    document.body.classList.toggle('has-mobile-selection', Boolean(selectionBar?.classList.contains('is-visible')));

    if (!isDelivery()) return;

    const quantity = orderQuantity();
    const unitPrice = standardUnitPrice(quantity) + (isPersonalized() ? 10 : 0);
    const subtotal = quantity * unitPrice;
    const shippingRow = rowByLabel(/^Envío|^Entrega|^Recolección/);
    const totalRow = $('.selection-total-row--strong');
    const note = $('.selection-note');
    const postalHelp = $('.postal-field small');
    const sendButton = $('[data-send-selection]');

    let shippingText = 'Por calcular';
    let total = subtotal;
    let blocked = false;

    if (quote.status === 'minimum') {
      shippingText = `Mínimo ${SHIPPING.minimumDeliveryQuantity} bebidas`;
      blocked = true;
      if (postalHelp) postalHelp.textContent = `Para cuidar el costo de entrega, el envío a domicilio está disponible desde ${SHIPPING.minimumDeliveryQuantity} bebidas. Puedes recoger pedidos menores sin costo.`;
      if (note) note.textContent = `Agrega ${Math.max(0, SHIPPING.minimumDeliveryQuantity - quantity)} bebida${SHIPPING.minimumDeliveryQuantity - quantity === 1 ? '' : 's'} más para habilitar entrega, o selecciona recolección.`;
    } else if (quote.status === 'postal') {
      shippingText = 'Escribe tu CP';
      blocked = true;
      if (postalHelp) postalHelp.textContent = 'Escribe un código postal de 5 dígitos para calcular la entrega desde nuestro punto de salida.';
    } else if (quote.status === 'loading') {
      shippingText = 'Calculando…';
      blocked = true;
      if (postalHelp) postalHelp.textContent = 'Estamos calculando una tarifa estimada según zona y volumen.';
    } else if (quote.status === 'ready') {
      shippingText = `$${quote.fee} MXN`;
      total += quote.fee;
      if (postalHelp) postalHelp.textContent = `${quote.label} · ${quote.distance} km operativos aprox. · se confirma antes del cobro.`;
      if (note) note.textContent = 'La entrega se estima desde nuestro punto de salida y se confirma antes del cobro. Pedidos menores a 10 bebidas pueden recogerse sin costo.';
    } else if (quote.status === 'error') {
      shippingText = 'Por confirmar';
      blocked = true;
      if (postalHelp) postalHelp.textContent = 'No pudimos calcular este CP. Te ayudamos a confirmarlo por WhatsApp.';
    }

    if (shippingRow) {
      const label = shippingRow.querySelector('span');
      const value = shippingRow.querySelector('b');
      if (label) label.textContent = 'Envío estimado';
      if (value) value.textContent = shippingText;
    }
    if (totalRow?.querySelector('b')) totalRow.querySelector('b').textContent = `$${total.toLocaleString('es-MX')} MXN`;
    if (sendButton) {
      sendButton.disabled = blocked || quantity === 0;
      sendButton.textContent = quote.status === 'minimum' ? `Entrega desde ${SHIPPING.minimumDeliveryQuantity} bebidas` : 'Continuar por WhatsApp';
    }

    if (selectionBar?.classList.contains('is-visible')) {
      const text = selectionBar.querySelector('p');
      if (text) {
        if (quote.status === 'ready') text.innerHTML = `<b>${quantity} bebidas · $${unitPrice} c/u</b>Envío $${quote.fee} · Total $${total.toLocaleString('es-MX')}`;
        else if (quote.status === 'minimum') text.innerHTML = `<b>${quantity} bebidas · $${unitPrice} c/u</b>Entrega desde ${SHIPPING.minimumDeliveryQuantity} bebidas · recolección sin costo`;
      }
    }
  }

  function queuePatch() {
    if (patchQueued) return;
    patchQueued = true;
    requestAnimationFrame(() => {
      patchQueued = false;
      patchSummary();
    });
  }

  function selectedItems() {
    return $$('.selection-item').map(item => {
      const name = item.querySelector('b')?.textContent.trim() || 'Bebida';
      const id = item.querySelector('[data-qty-input]')?.dataset.qtyInput;
      const quantity = Number(item.querySelector('[data-qty-input]')?.value || 0);
      return { id, name, quantity };
    }).filter(item => item.quantity > 0);
  }

  function ownWhatsAppMessage() {
    const quantity = orderQuantity();
    const unitPrice = standardUnitPrice(quantity) + (isPersonalized() ? 10 : 0);
    const subtotal = quantity * unitPrice;
    const total = subtotal + quote.fee;
    const items = selectedItems();
    return `Hola, quiero pedir ANTOJO.\n\nMi selección:\n${items.map(item => `${item.quantity} × ${item.name}`).join('\n')}\n\nTotal: ${quantity} bebidas\nPresentación: ${isPersonalized() ? 'Personalizada (+$10 c/u)' : 'Lata ANTOJO.'}\nPrecio por bebida: $${unitPrice}\nSubtotal: $${subtotal.toLocaleString('es-MX')} MXN\nEntrega a domicilio: CP ${quote.postalCode}\nEnvío estimado: $${quote.fee} MXN\nTotal estimado: $${total.toLocaleString('es-MX')} MXN\n\n¿Me ayudan a confirmar disponibilidad, tarifa y total final antes del cobro?`;
  }

  function openWhatsApp(message) {
    const url = `https://wa.me/${SHIPPING.whatsappNumber}?text=${encodeURIComponent(message)}`;
    const popup = window.open(url, '_blank', 'noopener,noreferrer');
    if (!popup) window.location.href = url;
  }

  function bindShippingOverride() {
    document.addEventListener('click', event => {
      const send = event.target.closest?.('[data-send-selection]');
      if (send && isDelivery()) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const quantity = orderQuantity();
        if (quantity < SHIPPING.minimumDeliveryQuantity) {
          toast(`La entrega a domicilio está disponible desde ${SHIPPING.minimumDeliveryQuantity} bebidas. Para pedidos menores, selecciona recolección sin costo.`);
          return;
        }
        if (!/^\d{5}$/.test(postalCode())) {
          toast('Escribe un código postal válido de 5 dígitos.');
          $('#orderPostalCode')?.focus();
          return;
        }
        if (quote.status !== 'ready' || quote.postalCode !== postalCode() || quote.quantity !== quantity) {
          toast('Estamos actualizando el costo de envío. Intenta de nuevo en un momento.');
          scheduleQuote(0);
          return;
        }
        window.antojoTrack?.('send_order_whatsapp_shipping_v2', { fee: quote.fee, quantity });
        openWhatsApp(ownWhatsAppMessage());
        return;
      }

      if (event.target.closest?.('[data-fulfillment], [data-qty-id], [data-package], [data-clear-selection]')) {
        setTimeout(() => scheduleQuote(), 40);
      }
    }, true);

    document.addEventListener('input', event => {
      if (event.target.matches('#orderPostalCode')) scheduleQuote();
    }, true);

    document.addEventListener('change', event => {
      if (event.target.matches('[data-qty-input], #orderPersonalized')) scheduleQuote();
    }, true);

    const summary = $('#selectionSummary');
    const bar = $('#selectionBar');
    const observer = new MutationObserver(queuePatch);
    if (summary) observer.observe(summary, { childList: true, subtree: true });
    if (bar) observer.observe(bar, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

    window.addEventListener('hashchange', () => setTimeout(() => {
      queuePatch();
      scheduleQuote();
    }, 80));
  }

  function start() {
    injectMobileStyles();
    bindShippingOverride();
    queuePatch();
    scheduleQuote(120);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
