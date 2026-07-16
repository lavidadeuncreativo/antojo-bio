(()=>{
  'use strict';
  const A = window.ANTOJO;
  const {$, $$, state} = A;
  A.activeJourney = {kind:'', step:0};

  const EVENT_TYPES = [
    ['Boda','Bienvenida, brindis, sobremesa o barra.'],
    ['Cumpleaños','Bebidas fáciles de servir y compartir.'],
    ['Reunión privada','Comida, cena o plan entre amigos.'],
    ['Evento corporativo','Workshop, convivencia u oficina.'],
    ['Activación de marca','Sampling, lanzamiento o experiencia.'],
    ['Otro','Cuéntanos de qué se trata.']
  ];
  const EVENT_SERVICES = [
    ['Solo bebidas','Eliges sabores y cantidades.'],
    ['Bebidas personalizadas','Con frase, nombres, logo o identidad.'],
    ['Barra o montaje','Incluye revisión especial de operación y logística.']
  ];
  const CUSTOM_TYPES = [
    ['phrase','Frase o nombre','Ideal para bodas, fechas, regalos o detalles.'],
    ['logo','Logo','Para una marca, empresa o evento.'],
    ['identity','Identidad visual','Cuando necesitas una propuesta más completa.']
  ];
  const CUSTOM_USES = [
    ['Evento','Boda, cumpleaños o reunión.'],
    ['Marca','Regalo corporativo, lanzamiento o activación.'],
    ['Regalo','Un detalle personalizado.'],
    ['Otro','Lo aterrizamos contigo.']
  ];

  A.openJourney = (kind, preserveStep = false) => {
    if (kind === 'order') {
      state.journey = 'order';
      state.personalization = 'normal';
      state.eventTarget = 0;
      A.persist();
      A.showScreen('menu');
      A.toast('Ahora elige tus bebidas.');
      return;
    }
    A.activeJourney = {kind, step:preserveStep ? A.activeJourney.step : 0};
    $('#journeyModal').classList.add('open');
    $('#journeyModal').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    A.renderJourney();
  };

  A.closeJourney = () => {
    $('#journeyModal')?.classList.remove('open');
    $('#journeyModal')?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  A.coverageMessage = () => {
    const guests = Math.max(1, Number(state.eventGuests || 1));
    const target = Math.max(1, Number(state.eventTarget || 1));
    const ratio = target / guests;
    if (ratio < .8) return {className:'warning', title:'La cantidad está por debajo de una bebida por persona.', copy:`${target} bebidas para ${guests} personas equivalen a ${ratio.toFixed(1)} por persona.`};
    if (ratio < 1.25) return {className:'', title:'Cubre aproximadamente una bebida por persona.', copy:`${target} bebidas para ${guests} personas equivalen a ${ratio.toFixed(1)} por persona.`};
    if (ratio < 1.75) return {className:'good', title:'Cobertura equilibrada para un evento breve.', copy:`${target} bebidas para ${guests} personas equivalen a ${ratio.toFixed(1)} por persona.`};
    return {className:'good', title:'Cobertura amplia para brindar o repetir.', copy:`${target} bebidas para ${guests} personas equivalen a ${ratio.toFixed(1)} por persona.`};
  };

  A.setEventCoverage = value => {
    state.eventCoverage = Number(value);
    state.eventTarget = A.round5(Math.max(1, Number(state.eventGuests || 1)) * state.eventCoverage);
  };

  A.renderJourney = () => {
    const {kind, step} = A.activeJourney;
    const body = $('#journeyBody');
    const totalSteps = kind === 'event' ? 4 : 3;
    $('#journeyKicker').textContent = kind === 'event' ? 'PEDIDO PARA EVENTO' : 'BEBIDAS PERSONALIZADAS';
    $('#journeyTitle').textContent = kind === 'event' ? 'Cuéntanos tu plan.' : 'Cuéntanos tu idea.';
    $('#journeyProgress').innerHTML = Array.from({length:totalSteps}, (_, index) => `<i class="${index <= step ? 'active' : ''}"></i>`).join('');
    $('#journeyBack').style.visibility = step === 0 ? 'hidden' : 'visible';
    $('#journeyNext').textContent = step === totalSteps - 1 ? 'Elegir bebidas' : 'Continuar';

    if (kind === 'event') A.renderEventStep(body, step);
    else A.renderCustomStep(body, step);

    $('#journeyBack').onclick = () => {
      A.activeJourney.step = Math.max(0, A.activeJourney.step - 1);
      A.renderJourney();
    };
    $('#journeyNext').onclick = A.nextJourneyStep;
  };

  A.renderEventStep = (body, step) => {
    if (step === 0) {
      body.innerHTML = `<p class="eyebrow">Paso 1 de 4</p><h3>¿Qué estás planeando?</h3><p>Esto adapta el recorrido y el seguimiento. No cambia tus bebidas automáticamente.</p><div class="journey-grid">${EVENT_TYPES.map(([title, copy]) => `<button type="button" class="journey-choice ${state.eventType === title ? 'selected' : ''}" data-event-type="${title}"><b>${title}</b><small>${copy}</small></button>`).join('')}</div>`;
      $$('[data-event-type]', body).forEach(button => button.onclick = () => { state.eventType = button.dataset.eventType; A.renderJourney(); });
      return;
    }
    if (step === 1) {
      const message = A.coverageMessage();
      body.innerHTML = `<p class="eyebrow">Paso 2 de 4</p><h3>¿Para cuántas personas?</h3><p>Elige una cobertura fácil de entender. La cantidad siempre puede editarse.</p><label class="field"><span>Personas estimadas</span><input id="eventGuests" type="number" min="1" max="3000" inputmode="numeric" value="${Number(state.eventGuests || 50)}"></label><div class="coverage-options"><button type="button" data-event-coverage="1" class="${Number(state.eventCoverage) === 1 ? 'selected' : ''}">1 por persona</button><button type="button" data-event-coverage="1.5" class="${Number(state.eventCoverage) === 1.5 ? 'selected' : ''}">1.5 por persona</button><button type="button" data-event-coverage="2" class="${Number(state.eventCoverage) === 2 ? 'selected' : ''}">2 por persona</button></div><label class="field"><span>Bebidas de referencia</span><input id="eventTarget" type="number" min="10" max="5000" inputmode="numeric" value="${Number(state.eventTarget || 75)}"></label><div class="coverage-message ${message.className}"><b>${message.title}</b><br>${message.copy}</div>`;
      $('#eventGuests').onchange = event => { state.eventGuests = Math.max(1, Number(event.target.value || 1)); A.setEventCoverage(state.eventCoverage || 1.5); A.renderJourney(); };
      $('#eventTarget').onchange = event => { state.eventTarget = Math.max(10, Number(event.target.value || 10)); state.eventCoverage = Number((state.eventTarget / Math.max(1, state.eventGuests)).toFixed(2)); A.renderJourney(); };
      $$('[data-event-coverage]', body).forEach(button => button.onclick = () => { A.setEventCoverage(button.dataset.eventCoverage); A.renderJourney(); });
      return;
    }
    if (step === 2) {
      body.innerHTML = `<p class="eyebrow">Paso 3 de 4</p><h3>¿Qué necesitas además de bebidas?</h3><p>Esta selección orienta la cotización. No reemplaza ni modifica el carrito.</p><div class="journey-grid">${EVENT_SERVICES.map(([title, copy]) => `<button type="button" class="journey-choice ${state.eventService === title ? 'selected' : ''}" data-event-service="${title}"><b>${title}</b><small>${copy}</small></button>`).join('')}</div>`;
      $$('[data-event-service]', body).forEach(button => button.onclick = () => { state.eventService = button.dataset.eventService; A.renderJourney(); });
      return;
    }
    body.innerHTML = `<p class="eyebrow">Paso 4 de 4</p><h3>¿Dónde y cuándo será?</h3><p>Puedes marcar cualquier dato como pendiente. Esto no bloquea tu cotización.</p><label class="check-row"><input id="venueUnknown" type="checkbox" ${state.eventVenueUnknown ? 'checked' : ''}><span>Lugar todavía por definir</span></label><label class="field"><span>Lugar o dirección</span><input id="eventVenue" value="${A.escape(state.eventVenue)}" placeholder="Salón, oficina, colonia o dirección" ${state.eventVenueUnknown ? 'disabled' : ''}></label><div class="field-row"><label class="field"><span>Fecha</span><input id="eventDate" type="date" value="${state.date}" ${state.dateUnknown ? 'disabled' : ''}></label><label class="field"><span>Hora</span><input id="eventTime" type="time" value="${state.time}" ${state.timeUnknown ? 'disabled' : ''}></label></div><div class="field-row"><label class="check-row"><input id="dateUnknown" type="checkbox" ${state.dateUnknown ? 'checked' : ''}><span>Fecha por definir</span></label><label class="check-row"><input id="timeUnknown" type="checkbox" ${state.timeUnknown ? 'checked' : ''}><span>Hora por definir</span></label></div>`;
    $('#venueUnknown').onchange = event => { state.eventVenueUnknown = event.target.checked; if (state.eventVenueUnknown) state.eventVenue = ''; A.renderJourney(); };
    $('#eventVenue')?.addEventListener('input', event => state.eventVenue = event.target.value);
    $('#eventDate')?.addEventListener('change', event => state.date = event.target.value);
    $('#eventTime')?.addEventListener('change', event => state.time = event.target.value);
    $('#dateUnknown').onchange = event => { state.dateUnknown = event.target.checked; if (state.dateUnknown) state.date = ''; A.renderJourney(); };
    $('#timeUnknown').onchange = event => { state.timeUnknown = event.target.checked; if (state.timeUnknown) state.time = ''; A.renderJourney(); };
  };

  A.renderCustomStep = (body, step) => {
    if (step === 0) {
      body.innerHTML = `<p class="eyebrow">Paso 1 de 3</p><h3>¿Qué quieres personalizar?</h3><p>Puede ser una frase vertical, un nombre, un logo o una identidad más completa.</p><div class="journey-grid">${CUSTOM_TYPES.map(([id, title, copy]) => `<button type="button" class="journey-choice ${state.customType === id ? 'selected' : ''}" data-custom-type="${id}"><b>${title}</b><small>${copy}</small></button>`).join('')}</div>`;
      $$('[data-custom-type]', body).forEach(button => button.onclick = () => { state.customType = button.dataset.customType; A.renderJourney(); });
      return;
    }
    if (step === 1) {
      body.innerHTML = `<p class="eyebrow">Paso 2 de 3</p><h3>¿Para qué y cuántas?</h3><p>Solo necesitamos una referencia inicial para ayudarte bien.</p><div class="journey-grid">${CUSTOM_USES.map(([title, copy]) => `<button type="button" class="journey-choice ${state.customUse === title ? 'selected' : ''}" data-custom-use="${title}"><b>${title}</b><small>${copy}</small></button>`).join('')}</div><div class="coverage-options"><button type="button" data-custom-qty="10">10</button><button type="button" data-custom-qty="25">25</button><button type="button" data-custom-qty="50">50</button></div><label class="field"><span>Cantidad de referencia</span><input id="customTarget" type="number" min="1" max="5000" inputmode="numeric" value="${Number(state.eventTarget || 50)}"></label>`;
      $$('[data-custom-use]', body).forEach(button => button.onclick = () => { state.customUse = button.dataset.customUse; A.renderJourney(); });
      $$('[data-custom-qty]', body).forEach(button => button.onclick = () => { state.eventTarget = Number(button.dataset.customQty); A.renderJourney(); });
      $('#customTarget').onchange = event => { state.eventTarget = Math.max(1, Number(event.target.value || 1)); A.renderJourney(); };
      return;
    }
    body.innerHTML = `<p class="eyebrow">Paso 3 de 3</p><h3>Bájalo a tierra tantito.</h3><p>No necesitas tenerlo resuelto. Describe la frase, el logo, los colores o la intención.</p><label class="field"><span>Idea o indicaciones</span><textarea id="customIdea" placeholder="Ej. nombres, fecha, logo, colores o frase">${A.escape(state.customIdea)}</textarea></label><label class="field"><span>Fecha aproximada (opcional)</span><input id="customDate" type="date" value="${state.date}"></label>`;
    $('#customIdea').oninput = event => state.customIdea = event.target.value;
    $('#customDate').onchange = event => state.date = event.target.value;
  };

  A.nextJourneyStep = () => {
    const {kind, step} = A.activeJourney;
    const totalSteps = kind === 'event' ? 4 : 3;
    if (kind === 'event' && step === 0 && !state.eventType) return A.toast('Elige el tipo de evento.');
    if (kind === 'event' && step === 1 && Number(state.eventTarget || 0) < 10) return A.toast('Elige al menos 10 bebidas de referencia.');
    if (kind === 'custom' && step === 0 && !state.customType) return A.toast('Elige el tipo de personalización.');
    if (step < totalSteps - 1) {
      A.activeJourney.step += 1;
      A.persist();
      A.renderJourney();
      return;
    }
    if (kind === 'event') {
      state.journey = 'event';
      if (state.eventService === 'Bebidas personalizadas') state.personalization = 'logo';
      if (state.eventService === 'Barra o montaje') state.notes = [state.notes, 'Interés en barra o montaje'].filter(Boolean).join(' · ');
    } else {
      state.journey = 'custom';
      state.eventType = 'Bebidas personalizadas';
      state.personalization = state.customType === 'phrase' ? 'phrase' : 'logo';
      state.personalizationText = state.customIdea;
    }
    A.persist();
    A.closeJourney();
    A.updateCounts();
    A.showScreen('menu');
    A.toast('Listo. Ahora elige tus bebidas.');
  };
})();
