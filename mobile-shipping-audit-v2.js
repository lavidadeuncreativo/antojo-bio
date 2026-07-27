(() => {
  'use strict';

  const Pricing = window.AntojoPricing;
  if (!Pricing) return;

  const WHATSAPP_NUMBER = '525522026291';
  const deliveryQuote = {
    status: 'idle',
    postalCode: '',
    quantity: 0,
    personalized: false,
    fee: 0,
    distance: 0,
    label: ''
  };

  let requestSerial = 0;
  let quoteTimer = null;
  let patchQueued = false;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function setText(node, value) {
    if (node && node.textContent !== value) node.textContent = value;
  }

  function toast(message) {
    const node = $('#toast');
    if (!node) return;
    setText(node, message);
    node.classList.add('is-visible');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove('is-visible'), 3400);
  }

  function quantityMap() {
    const values = new Map();
    $$('[data-qty-input]').forEach(input => {
      const id = input.dataset.qtyInput;
      const quantity = Pricing.normalizeQuantity(input.value);
      if (id) values.set(id, Math.max(values.get(id) || 0, quantity));
    });
    return values;
  }

  function quantityTotal() {
    return [...quantityMap().values()].reduce((sum, value) => sum + value, 0);
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

  function selectedItems() {
    const values = quantityMap();
    const items = [];
    $$('.product-row').forEach(row => {
      const input = $('[data-qty-input]', row);
      const id = input?.dataset.qtyInput;
      const quantity = id ? values.get(id) || 0 : 0;
      if (!quantity) return;
      items.push({ name: $('h3', row)?.textContent.trim() || 'Bebida', quantity });
    });
    return items;
  }

  function currentOrder(shipping = 0) {
    return Pricing.quote({
      quantity: quantityTotal(),
      personalized: isPersonalized(),
      shipping
    });
  }

  function rowByLabel(pattern) {
    return $$('.selection-total-row').find(row => pattern.test($('span', row)?.textContent || ''));
  }

  function patchPackageCards() {
    $$('.package-card[data-package]').forEach(card => {
      const quantity = Pricing.normalizeQuantity(card.dataset.package);
      const price = Pricing.unitPrice(quantity);
      const priceNode = $('b', card);
      if (priceNode) setText(priceNode, `$${price} c/u · personalizadas +$${Pricing.PERSONALIZATION_UNIT_PRICE}`);
    });
  }

  function patchStaticPricing() {
    $$('.product-row__price').forEach(node => setText(node, '$65 individual · desde $50 por volumen'));

    const pricingAnswer = $$('.faq-list details').find(detail => /precio por volumen/i.test($('summary', detail)?.textContent || ''))?.querySelector('p');
    if (pricingAnswer) {
      setText(pricingAnswer, 'El precio se calcula sobre la cantidad total: 1 a 29 bebidas en $65 c/u; 30 a 59 en $60; 60 a 149 en $55; 150 a 199 en $54; 200 a 299 en $53; 300 a 499 en $52; y 500 o más en $50. La personalización sencilla suma $10 por lata desde 50 piezas.');
    }
  }

  function patchSelection() {
    patchPackageCards();
    patchStaticPricing();

    const total = quantityTotal();
    const shipping = isDelivery() && deliveryQuote.status === 'ready' ? deliveryQuote.fee : 0;
    const order = currentOrder(shipping);
    const baseRow = rowByLabel(/^Precio base por bebida/);
    const personalizationRow = rowByLabel(/^Personalización/);
    const finalRow = rowByLabel(/^Precio final por bebida/);
    const shippingRow = rowByLabel(/^Envío|^Entrega|^Recolección/);
    const totalRow = $('.selection-total-row--strong');
    const note = $('.selection-note');
    const postalHelp = $('.postal-field small');
    const sendButton = $('[data-send-selection]');

    if (baseRow) setText($('b', baseRow), order.baseUnitPrice ? `$${order.baseUnitPrice}` : '—');
    if (personalizationRow) setText($('b', personalizationRow), order.personalized ? `+$${Pricing.PERSONALIZATION_UNIT_PRICE} c/u` : 'No incluida');
    if (finalRow) setText($('b', finalRow), order.finalUnitPrice ? `$${order.finalUnitPrice}` : '—');

    let shippingLabel = isDelivery() ? 'Envío estimado' : 'Recolección WTC';
    let shippingValue = isDelivery() ? 'Por calcular' : '$0';
    let blocked = total === 0;

    if (isDelivery()) {
      if (deliveryQuote.status === 'minimum') {
        shippingValue = `Mínimo ${Pricing.DELIVERY_MINIMUM} bebidas`;
        blocked = true;
        setText(postalHelp, `La entrega está disponible desde ${Pricing.DELIVERY_MINIMUM} bebidas. Pedidos menores pueden recogerse sin costo.`);
        setText(note, `Agrega ${Math.max(0, Pricing.DELIVERY_MINIMUM - total)} bebidas más o selecciona recolección en WTC.`);
      } else if (deliveryQuote.status === 'postal') {
        shippingValue = 'Escribe tu CP';
        blocked = true;
        setText(postalHelp, 'Escribe un código postal de 5 dígitos para calcular la entrega.');
      } else if (deliveryQuote.status === 'loading') {
        shippingValue = 'Calculando…';
        blocked = true;
        setText(postalHelp, 'Calculando tarifa por zona y volumen…');
      } else if (deliveryQuote.status === 'ready') {
        shippingValue = `$${deliveryQuote.fee} MXN`;
        setText(postalHelp, `${deliveryQuote.label} · ${deliveryQuote.distance} km operativos aprox. · se confirma antes del cobro.`);
        setText(note, 'La tarifa es estimada y se confirma antes del cobro. No absorbemos automáticamente traslados largos, estacionamiento o casetas.');
      } else if (deliveryQuote.status === 'error') {
        shippingValue = 'Por confirmar';
        setText(postalHelp, deliveryQuote.label || 'No pudimos calcular el envío. Lo confirmamos por WhatsApp.');
        setText(note, 'Puedes enviar el pedido; el costo de entrega quedará pendiente de confirmación.');
      }
    } else {
      setText(note, 'Recoger en WTC no agrega costo. La ubicación y horario se confirman antes de producir.');
    }

    if (shippingRow) {
      setText($('span', shippingRow), shippingLabel);
      setText($('b', shippingRow), shippingValue);
    }
    if (totalRow) setText($('b', totalRow), `$${order.total.toLocaleString('es-MX')} MXN`);
    if (sendButton) {
      sendButton.disabled = blocked;
      setText(sendButton, 'Confirmar pedido en WhatsApp');
    }

    const bar = $('#selectionBar');
    if (bar?.classList.contains('is-visible')) {
      const copy = $('p', bar);
      const method = isDelivery()
        ? deliveryQuote.status === 'ready' ? `Envío $${deliveryQuote.fee}` : 'Envío por confirmar'
        : 'Recolección WTC';
      if (copy) copy.innerHTML = `<b>${total} ${total === 1 ? 'bebida' : 'bebidas'} · $${order.finalUnitPrice} c/u</b>${method} · Total $${order.total.toLocaleString('es-MX')}`;
    }
  }

  function queuePatch() {
    if (patchQueued) return;
    patchQueued = true;
    requestAnimationFrame(() => {
      patchQueued = false;
      patchSelection();
      patchEventEstimate();
    });
  }

  async function calculateDeliveryQuote() {
    const quantity = quantityTotal();
    const personalized = isPersonalized();
    const cp = postalCode();
    const serial = ++requestSerial;

    if (!isDelivery()) {
      Object.assign(deliveryQuote, { status: 'idle', postalCode: '', quantity, personalized, fee: 0, distance: 0, label: '' });
      queuePatch();
      return;
    }
    if (quantity < Pricing.DELIVERY_MINIMUM) {
      Object.assign(deliveryQuote, { status: 'minimum', postalCode: cp, quantity, personalized, fee: 0, distance: 0, label: '' });
      queuePatch();
      return;
    }
    if (!/^\d{5}$/.test(cp)) {
      Object.assign(deliveryQuote, { status: 'postal', postalCode: cp, quantity, personalized, fee: 0, distance: 0, label: '' });
      queuePatch();
      return;
    }

    Object.assign(deliveryQuote, { status: 'loading', postalCode: cp, quantity, personalized, fee: 0, distance: 0, label: '' });
    queuePatch();

    try {
      const parameters = new URLSearchParams({ postalCode: cp, quantity: String(quantity), personalized: personalized ? '1' : '0' });
      const response = await fetch(`/api/quote?${parameters.toString()}`, { headers: { Accept: 'application/json' } });
      const payload = await response.json();
      if (serial !== requestSerial) return;
      if (!response.ok || !payload.ok) throw new Error(payload.error || 'No disponible');
      Object.assign(deliveryQuote, {
        status: 'ready',
        postalCode: cp,
        quantity,
        personalized,
        fee: Number(payload.order?.shippingFee) || 0,
        distance: Number(payload.distanceKm) || 0,
        label: payload.source === 'postal-api' ? 'Calculado por zona y volumen' : 'Estimado por zona y volumen'
      });
      window.antojoTrack?.('calculate_shipping_server', { fee: deliveryQuote.fee, quantity });
    } catch (error) {
      if (serial !== requestSerial) return;
      Object.assign(deliveryQuote, {
        status: 'error',
        postalCode: cp,
        quantity,
        personalized,
        fee: 0,
        distance: 0,
        label: error?.message || 'No pudimos calcular el envío.'
      });
    }
    queuePatch();
  }

  function scheduleDeliveryQuote(delay = 260) {
    clearTimeout(quoteTimer);
    quoteTimer = setTimeout(calculateDeliveryQuote, delay);
  }

  function orderMessage() {
    const shipping = isDelivery() && deliveryQuote.status === 'ready' ? deliveryQuote.fee : 0;
    const order = currentOrder(shipping);
    const deliveryCopy = isDelivery()
      ? `A domicilio · CP ${postalCode()}\nEnvío: ${deliveryQuote.status === 'ready' ? `$${shipping} MXN (estimado)` : 'por confirmar'}`
      : 'Recolección en WTC · $0';

    return `Hola, quiero confirmar un pedido de ANTOJO.\n\nMi selección:\n${selectedItems().map(item => `${item.quantity} × ${item.name}`).join('\n')}\n\nTotal: ${order.quantity} bebidas\nPrecio base: $${order.baseUnitPrice} c/u\nPersonalización: ${order.personalized ? `+$${Pricing.PERSONALIZATION_UNIT_PRICE} c/u` : 'No incluida'}\nPrecio final: $${order.finalUnitPrice} c/u\nSubtotal bebidas: $${order.drinkSubtotal.toLocaleString('es-MX')} MXN\nEntrega: ${deliveryCopy}\nTotal estimado: $${order.total.toLocaleString('es-MX')} MXN\n\n¿Me ayudan a confirmar sabores, disponibilidad, entrega y total final antes del cobro?`;
  }

  function openWhatsApp(message) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    const popup = window.open(url, '_blank', 'noopener,noreferrer');
    if (!popup) window.location.href = url;
  }

  function patchEventEstimate() {
    const guests = Number($('#guestCount')?.value || 0);
    const servings = Number($('#servings')?.value || 1);
    const quantity = Math.ceil(guests * servings);
    const personalized = Boolean($('#personalized')?.checked);
    const order = Pricing.quote({ quantity, personalized });
    const summary = $('#eventSummary span');
    if (summary) summary.innerHTML = `${guests} personas · ${servings} bebida${servings === 1 ? '' : 's'} por persona<br>${order.personalized ? `Personalizadas · $${order.finalUnitPrice} c/u` : `ANTOJO. · $${order.finalUnitPrice} c/u`} · ${$('#eventDate')?.value || 'Fecha por definir'}`;
  }

  function eventMessage() {
    const guests = Number($('#guestCount')?.value || 0);
    const servings = Number($('#servings')?.value || 1);
    const quantity = Math.ceil(guests * servings);
    const personalized = Boolean($('#personalized')?.checked);
    const order = Pricing.quote({ quantity, personalized });
    const type = $('[data-choice-group="eventType"] button.is-active')?.dataset.value || '';
    const name = String($('#contactName')?.value || '').trim();

    if (!type) return { error: 'Elige el tipo de evento.' };
    if (personalized && !Pricing.personalizationAllowed(quantity)) return { error: `La personalización está disponible desde ${Pricing.PERSONALIZATION_MINIMUM} piezas.` };
    if (name.length < 2) return { error: 'Escribe tu nombre para dar seguimiento.' };

    return {
      message: `Hola, quiero cotizar un evento con ANTOJO.\n\nNombre: ${name}\nTipo de evento: ${type}\nPersonas: ${guests}\nCantidad sugerida: ${quantity} latas\nPrecio base estimado: $${order.baseUnitPrice} c/u\nPresentación: ${order.personalized ? `Personalizada (+$${Pricing.PERSONALIZATION_UNIT_PRICE} c/u)` : 'Lata ANTOJO.'}\nPrecio final estimado: $${order.finalUnitPrice} c/u\nFecha: ${$('#eventDate')?.value || 'Por definir'}\nLugar: ${String($('#eventPlace')?.value || '').trim() || 'Por definir'}\nNotas: ${String($('#eventNotes')?.value || '').trim() || 'Sin notas adicionales'}\n\n¿Me ayudan a confirmar sabores, logística, envío, precio y disponibilidad?`
    };
  }

  function bind() {
    document.addEventListener('click', event => {
      const send = event.target.closest?.('[data-send-selection]');
      if (send) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const quantity = quantityTotal();
        if (!quantity) return toast('Agrega al menos una bebida para continuar.');
        if (isPersonalized() && !Pricing.personalizationAllowed(quantity)) return toast(`La personalización está disponible desde ${Pricing.PERSONALIZATION_MINIMUM} bebidas.`);
        if (isDelivery() && quantity < Pricing.DELIVERY_MINIMUM) return toast(`La entrega está disponible desde ${Pricing.DELIVERY_MINIMUM} bebidas. También puedes recoger en WTC.`);
        if (isDelivery() && !/^\d{5}$/.test(postalCode())) {
          toast('Escribe un código postal válido de 5 dígitos.');
          $('#orderPostalCode')?.focus();
          return;
        }
        if (isDelivery() && deliveryQuote.status === 'loading') return toast('Estamos terminando de calcular el envío.');
        window.antojoTrack?.('confirm_order_whatsapp', { quantity, delivery: isDelivery() });
        openWhatsApp(orderMessage());
        return;
      }

      const eventNext = event.target.closest?.('#eventNext');
      if (eventNext && /whatsapp/i.test(eventNext.textContent)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const result = eventMessage();
        if (result.error) return toast(result.error);
        openWhatsApp(result.message);
        return;
      }

      if (event.target.closest?.('[data-fulfillment], [data-package], [data-qty-id], [data-clear-selection]')) {
        setTimeout(() => scheduleDeliveryQuote(40), 50);
      }
    }, true);

    document.addEventListener('input', event => {
      if (event.target.matches('#orderPostalCode, [data-qty-input]')) scheduleDeliveryQuote();
      if (event.target.matches('#guestCount, #servings, #eventDate')) queuePatch();
    }, true);

    document.addEventListener('change', event => {
      if (event.target.matches('#orderPersonalized, [data-qty-input]')) scheduleDeliveryQuote(80);
      if (event.target.matches('#personalized, #servings, #eventDate')) queuePatch();
    }, true);

    const observer = new MutationObserver(queuePatch);
    ['#selectionSummary', '#selectionBar', '#packageOptions', '#productList', '#eventSummary'].forEach(selector => {
      const node = $(selector);
      if (node) observer.observe(node, { childList: true, subtree: true });
    });
  }

  function start() {
    bind();
    queuePatch();
    scheduleDeliveryQuote(0);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
