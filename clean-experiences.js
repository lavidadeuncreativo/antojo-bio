(()=>{
  'use strict';
  const A = window.ANTOJO;
  const {$, $$, state} = A;
  const inherited = A.renderEventStep;
  const EXPERIENCES = [
    ['Solo bebidas','Flexible','Elige cada sabor y cantidad desde cero.'],
    ['Mix sin alcohol','Fresco','Una combinación equilibrada de bebidas sin alcohol.'],
    ['Mix para brindar','Favorito','Opciones con alcohol y al menos una alternativa sin alcohol.'],
    ['Café y sobremesa','Día','Café, horchata y bebidas cremosas para una experiencia más tranquila.'],
    ['Barra o montaje','Experiencia','Requiere revisar operación, montaje, accesos y horarios.'],
    ['Personalizado','A tu manera','Sabores, presentación, identidad y logística especial.']
  ];

  A.renderEventStep = (body, step) => {
    if (step !== 2) return inherited(body, step);
    body.innerHTML = `<p class="eyebrow">Paso 3 de 4</p><h3>Elige un punto de partida.</h3><p>Es una preferencia, no un paquete cerrado. No reemplazaremos ninguna bebida de tu carrito.</p><div class="journey-grid">${EXPERIENCES.map(([title,badge,copy]) => `<button type="button" class="journey-choice ${state.eventService === title ? 'selected' : ''}" data-event-experience="${title}"><b>${title}</b><small>${badge} · ${copy}</small></button>`).join('')}</div><div class="coverage-message"><b>Tu selección siempre será editable.</b><br>Después eliges cada sabor y cantidad directamente en el menú.</div>`;
    $$('[data-event-experience]', body).forEach(button => button.onclick = () => {
      state.eventService = button.dataset.eventExperience;
      A.persist();
      A.renderJourney();
    });
  };
})();
