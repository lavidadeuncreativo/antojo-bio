(()=>{
  'use strict';
  const A = window.ANTOJO;
  const {$, $$, state} = A;
  let shippingTimer = 0;

  const fulfillmentOptions = [
    ['wtc','Recoger en WTC','Zona WTC · Polyforum. Confirmamos horario contigo.'],
    ['delivery','Entrega a domicilio','Disponible desde 10 bebidas. Estimamos el traslado con tu zona.'],
    ['event','Logística para evento','Revisamos acceso, horario, entrega y operación contigo.']
  ];
  const personalizationOptions = [
    ['normal','Lata ANTOJO.','Presentación normal del menú.'],
    ['phrase','Nombre o frase','La frase se trabaja verticalmente sobre la lata.'],
    ['logo','Logo o identidad','Adaptación visual especial; recibes prueba antes de producción.']
  ];

  A.startCheckout = () => {
    if (!A.totalQty()) return A.toast('Agrega al menos una bebida.');
    state.checkoutStep = 0;
    if (state.journey === 'event') state.fulfillment = 'event';
    A.persist();
    A.showScreen('checkout');
  };

  A.saveCheckoutFields = () => {
    const fields = {
      address:'#addressField', occasion:'#occasionField', date:'#dateField', time:'#timeField', notes:'#notesField',
      personalizationText:'#personalTextField', name:'#nameField', phone:'#phoneField'
    };
    Object.entries(fields).forEach(([key, selector]) => {
      const node = $(selector);
      if (node) state[key] = node.value.trim();
    });
    const adult = $('#adultField');
    if (adult) state.adultConfirmed = adult.checked;
    const consent = $('#consentField');
    if (consent) state.consent = consent.checked;
    A.persist();
  };

  A.checkoutHeader = totalSteps => `<div class="checkout-head"><button type="button" class="back-button" id="checkoutBack">←</button><h1>${A.isQuote() ? 'Completa tu cotización' : 'Completa tu pedido'}</h1></div><div class="checkout-progress">${Array.from({length:totalSteps}, (_, index) => `<i class="${index <= state.checkoutStep ? 'active' : ''}"></i>`).join('')}</div>`;

  A.renderCheckout = () => {
    const root = $('#checkoutContent');
    if (!root) return;
    const quote = A.isQuote();
    const totalSteps = quote ? 3 : 4;
    state.checkoutStep = A.clamp(state.checkoutStep, 0, totalSteps - 1);
    let body = '';
    if (!quote) body = A.renderOrderCheckoutStep();
    else body = A.renderQuoteCheckoutStep();
    root.innerHTML = A.checkoutHeader(totalSteps) + body + A.checkoutFooter(totalSteps);
    A.bindCheckout(totalSteps);
  };

  A.renderOrderCheckoutStep = () => {
    const step = state.checkoutStep;
    if (step === 0) {
      return `<section class="checkout-step"><p class="eyebrow">Paso 1 de 4</p><h2>¿Cómo quieres recibirlo?</h2><p>Elige recolección o entrega. No usamos Google Maps para que puedas continuar sin costo adicional.</p><div class="choice-list">${fulfillmentOptions.slice(0,2).map(([id,title,copy]) => `<button type="button" class="choice-card ${state.fulfillment === id ? 'selected' : ''}" data-fulfillment="${id}"><span><b>${title}</b><small>${copy}</small></span><i class="radio"></i></button>`).join('')}</div>${state.fulfillment === 'delivery' ? `<label class="field"><span>Dirección, colonia o código postal</span><input id="addressField" value="${A.escape(state.address)}" placeholder="Ej. Del Valle, 03100" autocomplete="street-address"></label>${state.address ? `<div class="shipping-result"><b>${A.escape(state.shippingZone || 'Ruta por revisar')}</b><span>${state.shippingFee ? `${A.money(state.shippingFee)} · ${A.escape(state.shippingEta)}` : 'El costo se confirmará al revisar la ruta.'}</span></div>` : ''}` : ''}</section>`;
    }
    if (step === 1) {
      return `<section class="checkout-step"><p class="eyebrow">Paso 2 de 4</p><h2>¿Para cuándo y para qué plan?</h2><p>Esto nos ayuda a organizar producción. Los pedidos personales requieren idealmente 48 horas.</p><label class="field"><span>¿Para qué es?</span><select id="occasionField"><option value="">Selecciona una opción</option>${['Fin de semana','Oficina','Cumpleaños pequeño','Reunión','Regalo','Otro'].map(option => `<option ${state.occasion === option ? 'selected' : ''}>${option}</option>`).join('')}</select></label><div class="field-row"><label class="field"><span>Fecha</span><input id="dateField" type="date" value="${state.date}"></label><label class="field"><span>Hora aproximada</span><input id="timeField" type="time" value="${state.time}"></label></div><label class="field"><span>Notas (opcional)</span><textarea id="notesField" placeholder="Algo que debamos considerar">${A.escape(state.notes)}</textarea></label></section>`;
    }
    if (step === 2) return A.personalizationStep('Paso 3 de 4');
    return A.contactStep('Paso 4 de 4');
  };

  A.renderQuoteCheckoutStep = () => {
    const step = state.checkoutStep;
    if (step === 0) {
      const event = state.journey === 'event';
      return `<section class="checkout-step"><p class="eyebrow">Paso 1 de 3</p><h2>${event ? 'Confirmemos la logística' : 'Confirmemos tu idea'}</h2><p>No repetiremos el onboarding. Solo completamos lo que falta para registrar bien la solicitud.</p><div class="summary-grid"><article><span>Tipo</span><b>${A.escape(event ? state.eventType || 'Evento' : state.customUse || 'Personalizadas')}</b></article><article><span>Bebidas</span><b>${Number(state.eventTarget || A.totalQty())}</b></article>${event ? `<article><span>Invitados</span><b>${Number(state.eventGuests || 0)}</b></article><article><span>Servicio</span><b>${A.escape(state.eventService)}</b></article>` : `<article><span>Personalización</span><b>${A.escape(state.customType)}</b></article><article><span>Uso</span><b>${A.escape(state.customUse)}</b></article>`}</div>${event ? `<label class="field"><span>Lugar o dirección</span><input id="eventVenueCheckout" value="${A.escape(state.eventVenue)}" placeholder="Puede quedar por definir" ${state.eventVenueUnknown ? 'disabled' : ''}></label>` : ''}<div class="field-row"><label class="field"><span>Fecha aproximada</span><input id="dateField" type="date" value="${state.date}" ${state.dateUnknown ? 'disabled' : ''}></label><label class="field"><span>Hora aproximada</span><input id="timeField" type="time" value="${state.time}" ${state.timeUnknown ? 'disabled' : ''}></label></div><label class="field"><span>Notas adicionales</span><textarea id="notesField" placeholder="Acceso, horario, colores, montaje o cualquier detalle">${A.escape(state.notes)}</textarea></label></section>`;
    }
    if (step === 1) return A.personalizationStep('Paso 2 de 3');
    return A.contactStep('Paso 3 de 3');
  };

  A.personalizationStep = label => {
    const quote = A.isQuote();
    const forced = state.journey === 'custom';
    return `<section class="checkout-step"><p class="eyebrow">${label}</p><h2>¿Cómo quieres las latas?</h2><p>${forced ? 'Ya guardamos la intención del recorrido. Aquí puedes completarla.' : 'Puedes dejar la presentación normal o solicitar una personalización.'}</p><div class="choice-list">${personalizationOptions.map(([id,title,copy]) => `<button type="button" class="choice-card ${state.personalization === id ? 'selected' : ''}" data-personalization="${id}"><span><b>${title}</b><small>${copy}</small></span><i class="radio"></i></button>`).join('')}</div>${state.personalization !== 'normal' ? `<label class="field"><span>${state.personalization === 'phrase' ? 'Frase o nombre' : 'Idea, colores o indicaciones'}</span><textarea id="personalTextField" placeholder="Describe lo que quieres">${A.escape(state.personalizationText || state.customIdea)}</textarea></label>${state.personalization === 'logo' ? `<label class="field"><span>Sube tu logo (opcional en esta etapa)</span><input id="logoField" type="file" accept="image/png,image/jpeg,image/webp"><small id="logoStatus">${state.logoName ? `Logo cargado: ${A.escape(state.logoName)}` : 'Puedes continuar sin logo y compartirlo después.'}</small></label>` : ''}` : ''}${A.hasAlcohol() ? `<label class="check-row"><input id="adultField" type="checkbox" ${state.adultConfirmed ? 'checked' : ''}><span>Confirmo que las bebidas con alcohol son para personas adultas.</span></label>` : ''}${quote ? '<div class="shipping-result"><b>La personalización se cotiza.</b><span>No agregamos cargos ocultos ni prometemos un precio incompleto.</span></div>' : ''}</section>`;
  };

  A.contactStep = label => {
    const qty = A.totalQty();
    const quote = A.isQuote();
    const plan = A.pricePlan(qty);
    const delivery = {wtc:'Recoger en WTC',delivery:'Entrega a domicilio',event:'Logística para evento'}[state.fulfillment] || (quote ? 'Por confirmar' : 'Sin elegir');
    return `<section class="checkout-step"><p class="eyebrow">${label}</p><h2>¿A nombre de quién?</h2><p>Registraremos la solicitud en ANTOJO. y te contactaremos por WhatsApp. El mensaje no se enviará automáticamente.</p><div class="field-row"><label class="field"><span>Nombre</span><input id="nameField" value="${A.escape(state.name)}" placeholder="Tu nombre" autocomplete="name"></label><label class="field"><span>WhatsApp</span><input id="phoneField" value="${A.escape(state.phone)}" placeholder="55 0000 0000" inputmode="tel" autocomplete="tel"></label></div><label class="field"><span>Notas finales</span><textarea id="notesField" placeholder="Algo más que debamos considerar">${A.escape(state.notes)}</textarea></label><div class="summary-grid"><article><span>Selección</span><b>${qty} bebidas</b></article><article><span>Sabores</span><b>${A.cartItems().length}</b></article><article><span>Entrega</span><b>${A.escape(delivery)}</b></article><article><span>${quote ? 'Estado' : 'Precio'}</span><b>${quote ? 'Por cotizar' : `${A.money(plan.unit)} c/u`}</b></article></div><label class="check-row"><input id="consentField" type="checkbox" ${state.consent ? 'checked' : ''}><span>Autorizo que ANTOJO. use estos datos para registrar y dar seguimiento a mi ${quote ? 'cotización' : 'pedido'}.</span></label><div id="registrationError"></div></section>`;
  };

  A.checkoutFooter = totalSteps => {
    const last = state.checkoutStep === totalSteps - 1;
    return `<footer class="checkout-footer"><div><span>Paso ${state.checkoutStep + 1} de ${totalSteps}</span><b>${A.isQuote() ? 'Cotización' : A.money(A.totalEstimate())}</b></div><button type="button" class="btn btn-dark" id="checkoutNext">${last ? (A.isQuote() ? 'Registrar cotización' : 'Registrar pedido') : 'Continuar'}</button></footer>`;
  };

  A.bindCheckout = totalSteps => {
    $('#checkoutBack').onclick = () => {
      A.saveCheckoutFields();
      if (state.checkoutStep === 0) A.showScreen('cart');
      else { state.checkoutStep -= 1; A.renderCheckout(); }
    };
    $$('[data-fulfillment]').forEach(button => button.onclick = () => { state.fulfillment = button.dataset.fulfillment; if (state.fulfillment !== 'delivery') Object.assign(state, {shippingFee:0,shippingZone:'',shippingEta:'',address:''}); A.persist(); A.renderCheckout(); });
    $$('[data-personalization]').forEach(button => button.onclick = () => { state.personalization = button.dataset.personalization; A.persist(); A.renderCheckout(); });
    $('#eventVenueCheckout')?.addEventListener('input', event => state.eventVenue = event.target.value);
    $('#logoField')?.addEventListener('change', A.handleLogo);
    const address = $('#addressField');
    if (address) address.oninput = event => {
      state.address = event.target.value;
      clearTimeout(shippingTimer);
      shippingTimer = setTimeout(() => { A.estimateShipping(state.address); A.renderCheckout(); }, 450);
    };
    $('#checkoutNext').onclick = async event => {
      A.saveCheckoutFields();
      if (!A.validateCheckout()) return;
      if (state.checkoutStep < totalSteps - 1) { state.checkoutStep += 1; A.renderCheckout(); return; }
      await A.registerOrder(event.currentTarget);
    };
  };

  A.validateCheckout = () => {
    const quote = A.isQuote();
    const step = state.checkoutStep;
    if (!quote && step === 0) {
      if (!state.fulfillment) return A.toast('Elige cómo quieres recibirlo.'), false;
      if (state.fulfillment === 'delivery' && A.totalQty() < 10) return A.toast('La entrega inicia desde 10 bebidas.'), false;
      if (state.fulfillment === 'delivery' && state.address.trim().length < 4) return A.toast('Escribe una dirección o código postal.'), false;
    }
    if (!quote && step === 1) {
      if (!state.occasion) return A.toast('Elige para qué plan es.'), false;
      if (!state.date) return A.toast('Elige una fecha aproximada.'), false;
    }
    const personalStep = quote ? 1 : 2;
    if (step === personalStep) {
      if (state.personalization !== 'normal' && !(state.personalizationText || state.customIdea).trim()) return A.toast('Cuéntanos qué quieres personalizar.'), false;
      if (A.hasAlcohol() && !state.adultConfirmed) return A.toast('Confirma que las bebidas con alcohol son para personas adultas.'), false;
    }
    const contactStep = quote ? 2 : 3;
    if (step === contactStep) {
      if (state.name.trim().length < 2) return A.toast('Escribe tu nombre.'), false;
      if (state.phone.replace(/\D/g, '').length < 10) return A.toast('Escribe un WhatsApp válido.'), false;
      if (!state.consent) return A.toast('Autoriza el uso de datos para registrar la solicitud.'), false;
    }
    return true;
  };

  A.handleLogo = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/i.test(file.type)) return A.toast('Usa PNG, JPG o WEBP.');
    if (file.size > 8 * 1024 * 1024) return A.toast('El archivo es demasiado pesado.');
    try {
      state.logoData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          const image = new Image();
          image.onerror = reject;
          image.onload = () => {
            const scale = Math.min(1, 760 / Math.max(image.width, image.height));
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(image.width * scale);
            canvas.height = Math.round(image.height * scale);
            canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/webp', .82));
          };
          image.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
      state.logoName = file.name.replace(/\.[^.]+$/, '') + '.webp';
      state.logoMime = 'image/webp';
      A.persist();
      A.renderCheckout();
      A.toast('Logo cargado.');
    } catch { A.toast('No pudimos procesar esa imagen.'); }
  };

  A.buildPayload = () => {
    const qty = A.totalQty();
    const quote = A.isQuote();
    const plan = A.pricePlan(qty);
    return {
      folio:state.folio, type:quote ? 'quote' : 'order', createdAt:A.nowIso(), name:state.name, phone:state.phone, consent:Boolean(state.consent),
      items:A.cartItems().map(item => ({id:item.id,name:item.name,qty:item.qty,alcohol:item.alcohol})), units:qty,
      targetQuantity:quote ? Number(state.eventTarget || qty) : qty, occasion:state.occasion || state.customUse || state.eventType,
      fulfillment:state.fulfillment || (quote ? 'event' : ''), requiredDate:state.dateUnknown ? '' : state.date, requiredTime:state.timeUnknown ? '' : state.time,
      dateUnknown:Boolean(state.dateUnknown), address:state.journey === 'event' ? (state.eventVenueUnknown ? '' : state.eventVenue) : state.address,
      shippingFee:Number(state.shippingFee || 0), shippingZone:state.shippingZone, personalization:state.personalization,
      personalizationText:state.personalizationText || state.customIdea, unitPrice:quote ? null : plan.unit, totalEstimate:quote ? null : A.totalEstimate(), notes:state.notes,
      eventType:state.journey === 'event' ? state.eventType : state.journey === 'custom' ? 'Bebidas personalizadas' : '',
      eventGuests:state.journey === 'event' ? Number(state.eventGuests || 0) : null, eventVenue:state.journey === 'event' ? state.eventVenue : '',
      eventVenueName:'', eventVenueUnknown:Boolean(state.eventVenueUnknown), eventPlaceId:'', eventLat:'', eventLng:'',
      eventPackage:state.journey === 'event' ? state.eventService : state.journey === 'custom' ? `Personalizado · ${state.customUse}` : 'Solo bebidas',
      logoData:state.personalization === 'logo' ? state.logoData : '', logoName:state.personalization === 'logo' ? state.logoName : '', logoMime:state.personalization === 'logo' ? state.logoMime : '',
      utm:{source:new URLSearchParams(location.search).get('utm_source') || '',medium:new URLSearchParams(location.search).get('utm_medium') || '',campaign:new URLSearchParams(location.search).get('utm_campaign') || ''},
      sessionId:localStorage.getItem(A.SESSION_KEY) || '', eventTrail:[], pageUrl:location.href, userAgent:navigator.userAgent, website:'', whatsappOpened:false
    };
  };

  A.buildMessage = payload => {
    const items = payload.items.map(item => `• ${item.qty} × ${item.name}`).join('\n');
    return `Hola ANTOJO. Mi ${payload.type === 'quote' ? 'cotización' : 'pedido'} quedó registrado con el folio ${payload.folio}.\n\n${items}\n\n${payload.eventType ? `Tipo: ${payload.eventType}\nPersonas: ${payload.eventGuests || 'Por definir'}\n` : ''}¿Me ayudan con el seguimiento, por favor?`;
  };

  A.clearWorkingOrder = () => {
    const contact = {name:state.name, phone:state.phone};
    Object.assign(state, A.defaultState(), contact);
    A.persist();
    A.updateCounts();
  };

  A.registerOrder = async button => {
    const original = button.textContent;
    button.disabled = true;
    button.textContent = 'Registrando…';
    const fingerprint = JSON.stringify({cart:state.cart,name:state.name,phone:state.phone,eventTarget:state.eventTarget,eventType:state.eventType,date:state.date,personalization:state.personalization,logoName:state.logoName});
    if (!state.folio || state.requestFingerprint !== fingerprint) {
      state.folio = A.generateFolio();
      state.requestFingerprint = fingerprint;
    }
    const payload = A.buildPayload();
    try {
      localStorage.setItem(A.PENDING_KEY, JSON.stringify(payload));
      A.persist();
      const response = await fetch('/api/submit', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error(data.detail || data.error || 'No pudimos registrar la información.');
      const registered = {folio:payload.folio,type:payload.type,at:Date.now(),notionUrl:data.notionUrl || '',message:A.buildMessage(payload)};
      localStorage.setItem(A.LAST_KEY, JSON.stringify(registered));
      localStorage.removeItem(A.PENDING_KEY);
      A.clearWorkingOrder();
      A.renderSuccess(registered);
      A.showScreen('success');
    } catch (error) {
      button.disabled = false;
      button.textContent = original;
      $('#registrationError').innerHTML = `<div class="registration-error"><b>La solicitud todavía no quedó registrada.</b><span>${A.escape(error.message || 'Revisa tu conexión e inténtalo nuevamente.')}</span></div>`;
      A.toast('No quedó registrado. Intenta nuevamente.');
    }
  };

  A.renderSuccess = registered => {
    const quote = registered.type === 'quote';
    $('#successContent').innerHTML = `<div><div class="success-mark">✓</div><h1>Tu ${quote ? 'cotización' : 'pedido'} quedó registrado.</h1><p>Guardamos la información en ANTOJO. y te contactaremos para confirmar ${quote ? 'precio, disponibilidad y logística' : 'disponibilidad, entrega y total'}.</p><div class="folio">${A.escape(registered.folio)}</div><div class="success-time">Registrado ${A.escape(A.cdmxTime(registered.at))} · CDMX</div><div class="success-actions"><button type="button" class="btn btn-dark" id="successWhatsapp">Enviar resumen por WhatsApp</button><a class="btn btn-light" href="${A.INSTAGRAM}" target="_blank" rel="noopener">Seguir nuestra historia en Instagram</a><button type="button" class="btn btn-light" id="successCopy">Copiar resumen</button><button type="button" class="btn btn-lime" id="successHome">Volver al inicio</button></div><p class="success-note">WhatsApp es opcional. Tu solicitud ya está registrada aunque no envíes el mensaje.</p></div>`;
    $('#successWhatsapp').onclick = () => {
      try { navigator.sendBeacon?.('/api/whatsapp-opened', new Blob([JSON.stringify({folio:registered.folio})], {type:'application/json'})); } catch {}
      location.href = `https://wa.me/${A.WHATSAPP}?text=${encodeURIComponent(registered.message)}`;
    };
    $('#successCopy').onclick = async () => { try { await navigator.clipboard.writeText(registered.message); A.toast('Resumen copiado.'); } catch { A.toast('No pudimos copiarlo automáticamente.'); } };
    $('#successHome').onclick = () => { localStorage.removeItem(A.LAST_KEY); A.showScreen('home'); };
  };

  A.retryPending = async () => {
    const payload = A.parse(localStorage.getItem(A.PENDING_KEY), null);
    if (!payload?.folio) return;
    try {
      const response = await fetch('/api/submit', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if (response.ok) localStorage.removeItem(A.PENDING_KEY);
    } catch {}
  };
})();
