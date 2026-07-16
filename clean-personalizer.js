(()=>{
  'use strict';
  const A = window.ANTOJO;
  const {$, $$, state} = A;
  let phraseSize = 18;

  A.personalizationStep = label => {
    const quote = A.isQuote();
    const forced = state.journey === 'custom';
    const text = state.personalizationText || state.customIdea || '';
    const preview = state.personalization !== 'normal' ? `<section class="personalizer"><div class="personalizer-stage"><img class="can" src="/assets/renders/horchata.webp" alt="Vista previa de lata personalizada"><div class="personalizer-overlay ${state.personalization === 'phrase' ? 'phrase' : 'logo'}" id="personalizerOverlay">${state.personalization === 'phrase' ? `<span style="--phrase-size:${phraseSize}px">${A.escape(text || 'TU FRASE')}</span>` : state.logoData ? `<img src="${state.logoData}" alt="Logo cargado">` : '<span></span>'}</div></div><div class="personalizer-controls"><h3>Vista aproximada</h3><p>Usamos una lata neutra para visualizar la intención. El arte final se revisa contigo antes de producir.</p>${state.personalization === 'phrase' ? `<label><span>Tamaño de la frase</span><input id="phraseSizeField" type="range" min="11" max="29" value="${phraseSize}"></label>` : ''}<small>La frase se trabaja en vertical. El logo se adapta al área segura de impresión.</small></div></section>` : '';
    return `<section class="checkout-step"><p class="eyebrow">${label}</p><h2>¿Cómo quieres las latas?</h2><p>${forced ? 'Ya guardamos la intención del recorrido. Aquí puedes completarla.' : 'Puedes dejar la presentación normal o solicitar una personalización.'}</p><div class="choice-list">${[['normal','Lata ANTOJO.','Presentación normal del menú.'],['phrase','Nombre o frase','La frase se trabaja verticalmente sobre la lata.'],['logo','Logo o identidad','Adaptación visual especial; recibes prueba antes de producción.']].map(([id,title,copy]) => `<button type="button" class="choice-card ${state.personalization === id ? 'selected' : ''}" data-personalization="${id}"><span><b>${title}</b><small>${copy}</small></span><i class="radio"></i></button>`).join('')}</div>${preview}${state.personalization !== 'normal' ? `<label class="field"><span>${state.personalization === 'phrase' ? 'Frase o nombre' : 'Idea, colores o indicaciones'}</span><textarea id="personalTextField" placeholder="Describe lo que quieres">${A.escape(text)}</textarea></label>${state.personalization === 'logo' ? `<label class="field"><span>Sube tu logo</span><input id="logoField" type="file" accept="image/png,image/jpeg,image/webp"><small id="logoStatus">${state.logoName ? `Logo cargado: ${A.escape(state.logoName)}` : 'PNG, JPG o WEBP. También puedes compartirlo después.'}</small></label>` : ''}` : ''}${A.hasAlcohol() ? `<label class="check-row"><input id="adultField" type="checkbox" ${state.adultConfirmed ? 'checked' : ''}><span>Confirmo que las bebidas con alcohol son para personas adultas.</span></label>` : ''}${quote ? '<div class="shipping-result"><b>La personalización se cotiza.</b><span>No agregamos cargos ocultos ni prometemos un precio incompleto.</span></div>' : ''}</section>`;
  };

  const inheritedBindCheckout = A.bindCheckout;
  A.bindCheckout = totalSteps => {
    inheritedBindCheckout(totalSteps);
    $('#phraseSizeField')?.addEventListener('input', event => {
      phraseSize = Number(event.target.value);
      $('#personalizerOverlay span')?.style.setProperty('--phrase-size', `${phraseSize}px`);
    });
    $('#personalTextField')?.addEventListener('input', event => {
      state.personalizationText = event.target.value;
      if (state.personalization === 'phrase') {
        const preview = $('#personalizerOverlay span');
        if (preview) preview.textContent = event.target.value || 'TU FRASE';
      }
    });
    $$('.legal-links button').forEach(button => button.onclick = () => A.openLegal(button.dataset.legal));
  };

  const inheritedContactStep = A.contactStep;
  A.contactStep = label => inheritedContactStep(label).replace('</section>', '<div class="legal-links"><button type="button" data-legal="privacy">Aviso de privacidad</button><button type="button" data-legal="terms">Condiciones del pedido</button></div></section>');

  A.ensureLegalModal = () => {
    if ($('#legalModal')) return;
    $('#app').insertAdjacentHTML('beforeend','<div class="legal-modal" id="legalModal"><section class="legal-panel"><header><h2 id="legalTitle">Aviso</h2><button type="button" id="closeLegal">×</button></header><div id="legalBody"></div></section></div>');
    $('#closeLegal').onclick = () => $('#legalModal').classList.remove('open');
    $('#legalModal').onclick = event => { if (event.target.id === 'legalModal') event.currentTarget.classList.remove('open'); };
  };

  A.openLegal = type => {
    A.ensureLegalModal();
    const privacy = type === 'privacy';
    $('#legalTitle').textContent = privacy ? 'Aviso de privacidad' : 'Condiciones del pedido';
    $('#legalBody').innerHTML = privacy ? '<p>ANTOJO. utiliza nombre, teléfono, datos del pedido y archivos compartidos únicamente para preparar, registrar y dar seguimiento a pedidos o cotizaciones. La información operativa se guarda en Notion y no se vende a terceros.</p><p>Puedes solicitar corrección o eliminación de tus datos contactándonos por Instagram o WhatsApp.</p>' : '<ul><li>Los pedidos quedan sujetos a disponibilidad de ingredientes, producción y ruta.</li><li>Las cotizaciones para eventos o personalización son preliminares hasta que ANTOJO. las confirme.</li><li>Las fechas se reservan después de confirmar condiciones y anticipo.</li><li>Las bebidas deben mantenerse refrigeradas y consumirse dentro del periodo indicado para cada receta.</li></ul>';
    $('#legalModal').classList.add('open');
  };

  const inheritedValidate = A.validateCheckout;
  A.validateCheckout = () => {
    if (!inheritedValidate()) return false;
    if (!A.isQuote() && state.checkoutStep === 1 && state.date) {
      const selected = new Date(`${state.date}T12:00:00`);
      const minimum = new Date();
      minimum.setHours(0,0,0,0);
      minimum.setDate(minimum.getDate() + 2);
      if (selected < minimum) return A.toast('Elige una fecha con al menos 48 horas de anticipación.'), false;
    }
    return true;
  };
})();
