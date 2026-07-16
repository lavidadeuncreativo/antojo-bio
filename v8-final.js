(()=>{
  'use strict';

  const V8_KEY='antojo_journey_v8';
  const INSTAGRAM_URL='https://www.instagram.com/antojo.bebidas/';
  const $v=(selector,root=document)=>root.querySelector(selector);
  const $$v=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const safeJson=(value,fallback={})=>{try{return JSON.parse(value)||fallback}catch{return fallback}};
  const clamp=(number,min,max)=>Math.min(max,Math.max(min,number));
  const roundTen=number=>Math.max(10,Math.ceil(Number(number||0)/10)*10);
  const getStored=key=>{try{return localStorage.getItem(key)}catch{return null}};
  const journey=safeJson(getStored(V8_KEY),{
    kind:'personal',
    wizardStep:0,
    coverage:1.5,
    targetMode:'auto',
    activationGoal:'',
    phraseScale:18
  });

  const SOCIAL_TYPES=[
    ['Boda','Boda','Bienvenida, brindis, sobremesa o barra.'],
    ['Cumpleaños','Cumpleaños','Bebidas listas para celebrar y compartir.'],
    ['Reunión privada','Reunión privada','Una comida, cena o plan entre amigos.'],
    ['Evento corporativo','Evento corporativo','Workshop, convivencia o evento interno.'],
    ['Otro','Otro','Cuéntanos el plan y lo armamos contigo.']
  ];

  const ACTIVATION_TYPES=[
    ['Activación · Sampling','Sampling o giveaway','Entrega de producto, sampling o dinámica.'],
    ['Activación · Lanzamiento','Lanzamiento','Presentación de producto, marca o campaña.'],
    ['Activación · Evento de marca','Evento de marca','Experiencia, invitados y contenido.'],
    ['Activación · Workshop','Workshop o corporativo','Bebidas para asistentes, equipo o clientes.'],
    ['Activación · Otro','Otra activación','Cuéntanos el objetivo y lo aterrizamos.']
  ];

  const EXPERIENCES=[
    ['Solo bebidas','Elegir desde cero','Flexible','Tú decides cada sabor y cantidad.'],
    ['Mix sin alcohol','Mix sin alcohol','Fresco','Una combinación equilibrada de opciones sin alcohol.'],
    ['Mix con alcohol','Mix para brindar','Favorito','Opciones con alcohol y una alternativa sin alcohol.'],
    ['Café y sobremesa','Café y sobremesa','Día','Café, horchata y bebidas cremosas.'],
    ['Barra ANTOJO.','Barra ANTOJO.','Experiencia','Bebidas, montaje y operación por cotizar.'],
    ['Personalizado','Personalizado','A tu manera','Sabores, identidad y logística especial.']
  ];

  function persistJourney(){
    journey.eventType=state.eventType||'';journey.eventGuests=Number(state.eventGuests||0);journey.eventTarget=Number(state.eventTarget||0);journey.eventPackage=state.eventPackage||'';journey.eventVenue=state.eventVenue||'';journey.eventVenueUnknown=Boolean(state.eventVenueUnknown);journey.date=state.date||'';journey.time=state.time||'';journey.eventDateUnknown=Boolean(state.eventDateUnknown);journey.eventTimeUnknown=Boolean(state.eventTimeUnknown);
    try{localStorage.setItem(V8_KEY,JSON.stringify(journey))}catch{}
  }

  ['eventType','eventPackage','eventVenue','date','time'].forEach(key=>{if(!state[key]&&journey[key])state[key]=journey[key]});
  ['eventGuests','eventTarget'].forEach(key=>{if(!Number(state[key])&&Number(journey[key]))state[key]=Number(journey[key])});
  ['eventVenueUnknown','eventDateUnknown','eventTimeUnknown'].forEach(key=>{if(typeof journey[key]==='boolean')state[key]=journey[key]});

  function smoothPulse(){
    const shell=$v('#appShell');
    if(!shell)return;
    shell.classList.remove('v8-transitioning');
    void shell.offsetWidth;
    shell.classList.add('v8-transitioning');
    clearTimeout(smoothPulse.timer);
    smoothPulse.timer=setTimeout(()=>shell.classList.remove('v8-transitioning'),760);
  }

  function setPersonalJourney(){
    journey.kind='personal';
    state.mode='order';
    state.occasion='fin';
    state.fulfillment=state.fulfillment==='event'?'':state.fulfillment;
    state.eventType='';
    state.eventPackage='Solo bebidas';
    persistJourney();
    smoothPulse();
    showScreen('menu');
    setTimeout(()=>{
      renderJourneyContext();
      showToast('Elige bebidas y ve el precio según la cantidad.');
    },180);
  }

  function openJourneyWizard(kind='event',step=0){
    journey.kind=kind;
    journey.wizardStep=clamp(Number(step)||0,0,3);
    state.mode='quote';
    state.occasion='event';
    state.fulfillment='event';
    state.eventGuests=Math.max(1,Number(state.eventGuests)||50);
    if(!Number(state.eventTarget))state.eventTarget=roundTen(state.eventGuests*Number(journey.coverage||1.5));
    if(kind==='activation'&&!String(state.eventType||'').startsWith('Activación'))state.eventType='';
    if(kind==='event'&&String(state.eventType||'').startsWith('Activación'))state.eventType='';
    ensureJourneyWizard();
    renderJourneyWizard();
    $v('#v8JourneyWizard')?.classList.add('open');
    $v('#bottomNav')?.classList.remove('visible');
    persistJourney();
  }

  function closeJourneyWizard(){
    $v('#v8JourneyWizard')?.classList.remove('open');
    if(['home','menu','cart'].includes(state.screen))$v('#bottomNav')?.classList.add('visible');
    persistJourney();
  }

  function ensureJourneyWizard(){
    if($v('#v8JourneyWizard'))return;
    $v('#appShell')?.insertAdjacentHTML('beforeend',`
      <div class="v8-wizard-backdrop" id="v8JourneyWizard">
        <section class="v8-wizard-panel" role="dialog" aria-modal="true" aria-label="Planea tu pedido">
          <header class="v8-wizard-head">
            <div><span id="v8WizardKicker">PEDIDO PARA EVENTO</span><h2 id="v8WizardTitle">Cuéntanos tu plan.</h2></div>
            <button id="v8WizardClose" aria-label="Cerrar">×</button>
          </header>
          <div class="v8-wizard-progress">${[0,1,2,3].map(index=>`<i data-v8-progress="${index}"></i>`).join('')}</div>
          <div class="v8-wizard-body" id="v8WizardBody"></div>
          <footer class="v8-wizard-actions"><button class="secondary-btn" id="v8WizardBack">Atrás</button><button class="primary-btn" id="v8WizardNext">Continuar</button></footer>
        </section>
      </div>`);
    $v('#v8WizardClose').onclick=closeJourneyWizard;
    $v('#v8JourneyWizard').addEventListener('click',event=>{if(event.target.id==='v8JourneyWizard')closeJourneyWizard()});
  }

  function guests(){return Math.max(1,Number(state.eventGuests)||1)}
  function target(){return Math.max(10,Number(state.eventTarget)||10)}
  function drinksPerGuest(){return target()/guests()}
  function coverageCopy(){
    const ratio=drinksPerGuest();
    if(ratio<.8)return {tone:'warning',title:'La cantidad está por debajo de una bebida por persona.',copy:`${target()} bebidas para ${guests()} personas equivalen a ${ratio.toFixed(1)} por persona.`};
    if(ratio<1.25)return {tone:'ok',title:'Cubre aproximadamente una bebida por persona.',copy:`${target()} bebidas para ${guests()} personas equivalen a ${ratio.toFixed(1)} por persona.`};
    if(ratio<1.75)return {tone:'good',title:'Cobertura equilibrada para un evento breve.',copy:`${target()} bebidas para ${guests()} personas equivalen a ${ratio.toFixed(1)} por persona.`};
    return {tone:'great',title:'Cobertura amplia para brindar o repetir.',copy:`${target()} bebidas para ${guests()} personas equivalen a ${ratio.toFixed(1)} por persona.`};
  }

  function updateAutoTarget(){
    if(journey.targetMode!=='manual')state.eventTarget=roundTen(guests()*Number(journey.coverage||1.5));
  }

  function renderJourneyWizard(){
    const body=$v('#v8WizardBody');
    if(!body)return;
    const step=journey.wizardStep;
    const activation=journey.kind==='activation';
    $v('#v8WizardKicker').textContent=activation?'ACTIVACIÓN O PEDIDO CORPORATIVO':'PEDIDO PARA EVENTO';
    $v('#v8WizardTitle').textContent=activation?'Cuéntanos la activación.':'Cuéntanos tu evento.';
    $$v('[data-v8-progress]').forEach((node,index)=>node.classList.toggle('active',index<=step));
    $v('#v8WizardBack').style.visibility=step===0?'hidden':'visible';
    $v('#v8WizardNext').textContent=step===3?'Elegir mis bebidas':'Continuar';

    if(step===0){
      const types=activation?ACTIVATION_TYPES:SOCIAL_TYPES;
      body.innerHTML=`
        <div class="v8-step-kicker">Paso 1 de 4</div>
        <h3>${activation?'¿Qué quieres activar?':'¿Qué estás planeando?'}</h3>
        <p class="v8-help">Esta respuesta adapta las siguientes preguntas; no te mete a un flujo genérico.</p>
        <div class="v8-type-grid">${types.map(([id,label,copy])=>`<button class="v8-type-card ${state.eventType===id?'selected':''}" data-v8-type="${id}"><b>${label}</b><small>${copy}</small></button>`).join('')}</div>`;
      $$v('[data-v8-type]',body).forEach(button=>button.onclick=()=>{state.eventType=button.dataset.v8Type;renderJourneyWizard()});
    }

    if(step===1){
      const coverage=coverageCopy();
      body.innerHTML=`
        <div class="v8-step-kicker">Paso 2 de 4</div>
        <h3>¿Cuánto quieres servir?</h3>
        <p class="v8-help">Primero dinos cuántas personas esperas. Nosotros traducimos eso a una cobertura fácil de entender.</p>
        <label class="v8-field"><span>Personas estimadas</span><input id="v8Guests" type="number" min="1" max="3000" inputmode="numeric" value="${guests()}"></label>
        <div class="v8-coverage-grid">
          ${[[1,'1 por persona','Para un momento puntual'],[1.5,'1.5 por persona','Equilibrado · recomendado'],[2,'2 por persona','Para brindar o repetir']].map(([value,label,copy])=>`<button data-v8-coverage="${value}" class="${journey.targetMode!=='manual'&&Number(journey.coverage)===value?'selected':''}"><b>${label}</b><small>${copy}</small></button>`).join('')}
          <button data-v8-coverage="manual" class="${journey.targetMode==='manual'?'selected':''}"><b>Otra cantidad</b><small>Escribe el total exacto</small></button>
        </div>
        <label class="v8-field"><span>Bebidas de referencia</span><input id="v8Target" type="number" min="10" max="5000" inputmode="numeric" value="${target()}"></label>
        <div class="v8-coverage-result ${coverage.tone}"><strong>${coverage.title}</strong><span>${coverage.copy}</span></div>`;
      $v('#v8Guests').oninput=event=>{state.eventGuests=Math.max(1,Number(event.target.value||1));updateAutoTarget();persistJourney();renderJourneyWizard()};
      $v('#v8Target').oninput=event=>{journey.targetMode='manual';state.eventTarget=Math.max(10,Number(event.target.value||10));persistJourney();renderJourneyWizard()};
      $$v('[data-v8-coverage]',body).forEach(button=>button.onclick=()=>{
        const value=button.dataset.v8Coverage;
        if(value==='manual'){journey.targetMode='manual'}else{journey.targetMode='auto';journey.coverage=Number(value);updateAutoTarget()}
        persistJourney();renderJourneyWizard();
      });
    }

    if(step===2){
      body.innerHTML=`
        <div class="v8-step-kicker">Paso 3 de 4</div>
        <h3>¿Qué estilo te gustaría?</h3>
        <p class="v8-help">Es una recomendación, no un paquete cerrado. <b>No reemplazaremos las bebidas que ya elegiste.</b></p>
        ${totalQty()?`<div class="v8-preserve-note">Tu selección actual de ${totalQty()} bebidas se conservará.</div>`:''}
        <div class="v8-experience-grid">${EXPERIENCES.map(([id,label,badge,copy])=>`<button class="v8-experience-card ${state.eventPackage===id?'selected':''}" data-v8-package="${id}"><span>${badge}</span><b>${label}</b><small>${copy}</small><em>Editable · precio por cotizar</em></button>`).join('')}</div>`;
      $$v('[data-v8-package]',body).forEach(button=>button.onclick=()=>{state.eventPackage=button.dataset.v8Package;renderJourneyWizard()});
    }

    if(step===3){
      const dateUnknown=Boolean(state.eventDateUnknown);
      const timeUnknown=Boolean(state.eventTimeUnknown);
      body.innerHTML=`
        <div class="v8-step-kicker">Paso 4 de 4</div>
        <h3>¿Dónde y cuándo será?</h3>
        <p class="v8-help">Puedes dejar lugar, fecha u hora por definir. Nada de esto bloquea tu cotización.</p>
        <label class="v8-toggle"><input id="v8VenueUnknown" type="checkbox" ${state.eventVenueUnknown?'checked':''}><span>Lugar todavía por definir</span></label>
        <label class="v8-field ${state.eventVenueUnknown?'disabled':''}"><span>Lugar o dirección</span><input id="v8Venue" value="${escapeHtml(state.eventVenue||'')}" placeholder="Salón, oficina, colonia o dirección" ${state.eventVenueUnknown?'disabled':''}></label>
        <div class="v8-date-grid">
          <label class="v8-field ${dateUnknown?'disabled':''}"><span>Fecha</span><input id="v8Date" type="date" value="${state.date||''}" ${dateUnknown?'disabled':''}></label>
          <label class="v8-field ${timeUnknown?'disabled':''}"><span>Hora</span><input id="v8Time" type="time" value="${state.time||''}" ${timeUnknown?'disabled':''}></label>
        </div>
        <div class="v8-unknown-grid"><label class="v8-toggle"><input id="v8DateUnknown" type="checkbox" ${dateUnknown?'checked':''}><span>Fecha por definir</span></label><label class="v8-toggle"><input id="v8TimeUnknown" type="checkbox" ${timeUnknown?'checked':''}><span>Hora por definir</span></label></div>
        <div class="v8-plan-summary"><span>${journey.kind==='activation'?'Activación':'Evento'}</span><b>${escapeHtml(state.eventType||'Tipo por definir')}</b><small>${guests()} personas · ${target()} bebidas · ${escapeHtml(state.eventPackage||'Elegir desde cero')}</small></div>`;
      $v('#v8VenueUnknown').onchange=event=>{state.eventVenueUnknown=event.target.checked;if(state.eventVenueUnknown){state.eventVenue='';state.address=''}renderJourneyWizard()};
      $v('#v8Venue')?.addEventListener('input',event=>{state.eventVenue=event.target.value;state.address=event.target.value});
      $v('#v8DateUnknown').onchange=event=>{state.eventDateUnknown=event.target.checked;if(state.eventDateUnknown)state.date='';renderJourneyWizard()};
      $v('#v8TimeUnknown').onchange=event=>{state.eventTimeUnknown=event.target.checked;if(state.eventTimeUnknown)state.time='';renderJourneyWizard()};
      $v('#v8Date')?.addEventListener('change',event=>state.date=event.target.value);
      $v('#v8Time')?.addEventListener('change',event=>state.time=event.target.value);
    }

    $v('#v8WizardBack').onclick=()=>{journey.wizardStep=Math.max(0,journey.wizardStep-1);persistJourney();renderJourneyWizard()};
    $v('#v8WizardNext').onclick=()=>{
      if(step===0&&!state.eventType)return showToast(activation?'Elige el tipo de activación.':'Elige el tipo de evento.');
      if(step===1){
        state.eventGuests=guests();state.eventTarget=target();
        if(drinksPerGuest()<.5)return showToast('La cantidad es demasiado baja para el número de personas.');
      }
      if(step===3){finishJourneyWizard();return}
      journey.wizardStep+=1;persistJourney();renderJourneyWizard();
    };
  }

  function finishJourneyWizard(){
    state.mode='quote';
    state.occasion='event';
    state.fulfillment='event';
    state.eventGuests=guests();
    state.eventTarget=target();
    state.address=state.eventVenueUnknown?'':state.eventVenue;
    closeJourneyWizard();
    persistJourney();
    updateCartUI(false);
    smoothPulse();
    showScreen('menu');
    setTimeout(()=>{
      renderJourneyContext();
      showToast('Listo. Ahora elige o ajusta tus bebidas.');
    },180);
  }

  function renderJourneyContext(){
    const root=$v('#eventPlanner');
    if(!root)return;
    if(state.mode!=='quote'&&state.occasion!=='event'){
      root.innerHTML=`<section class="v8-menu-context personal"><span>PEDIDO PERSONAL</span><b>Elige sabores y cantidades.</b><small>Verás el precio correspondiente al total de tu pedido.</small></section>`;
      return;
    }
    const ratio=drinksPerGuest();
    const contextLabel=journey.kind==='activation'?escapeHtml(state.eventType||'ACTIVACIÓN'):`EVENTO · ${escapeHtml(state.eventType||'POR DEFINIR')}`;
    root.innerHTML=`<section class="v8-menu-context event"><div><span>${contextLabel}</span><b>${target()} bebidas para ${guests()} personas</b><small>${ratio.toFixed(1)} bebidas por persona · ${escapeHtml(state.eventPackage||'Elegir desde cero')} · Tu selección siempre es editable.</small></div><button id="v8EditPlan">Editar plan</button><div class="v8-context-progress"><i style="width:${Math.min(100,totalQty()/target()*100)}%"></i></div><em>${totalQty()} seleccionadas</em></section>`;
    $v('#v8EditPlan').onclick=()=>openJourneyWizard(journey.kind,1);
  }

  const originalRenderEventPlanner=window.renderEventPlanner;
  window.renderEventPlanner=function(){
    if(state.mode==='quote'||state.occasion==='event'){renderJourneyContext();return}
    if(typeof originalRenderEventPlanner==='function')originalRenderEventPlanner();
    renderJourneyContext();
  };

  const originalRenderSheet=window.renderSheet;
  window.renderSheet=function(){
    originalRenderSheet?.();
    const quick=$v('#productSheet .quick-qty');
    if(quick&&(state.mode==='quote'||state.occasion==='event')){
      quick.innerHTML=[10,25,50,100].map(value=>`<button data-v8-direct-qty="${value}">${value}</button>`).join('');
      $$v('[data-v8-direct-qty]',quick).forEach(button=>button.onclick=()=>{state.sheetQty=Number(button.dataset.v8DirectQty);window.renderSheet()});
    }
    const add=$v('#sheetAdd');
    if(add&&!add.dataset.v8Bound){
      add.dataset.v8Bound='1';
      const original=add.onclick;
      add.onclick=event=>{
        original?.call(add,event);
        setTimeout(()=>{
          closeSheet?.();
          smoothPulse();
          showScreen('cart');
        },110);
      };
    }
  };

  const originalStartCheckout=window.startCheckout;
  window.startCheckout=function(){
    if(!totalQty())return showToast('Agrega al menos una bebida para continuar.');
    originalStartCheckout?.();
    setTimeout(()=>{
      if(state.screen!=='checkout')showScreen('checkout');
      renderCheckout?.();
    },80);
  };

  const originalRenderFeatured=window.renderFeatured;
  window.renderFeatured=function(){
    if(typeof renderCollection==='function'){
      renderCollection('#featuredStrip',['espresso-horchata','mojito-mariposa','maracuya-limon','clericot']);
      renderCollection('#eventStrip',['clericot','mezcalita-jamaica','mojito-clasico','maracuya-limon']);
      renderCollection('#zeroStrip',['maracuya-limon','jamaica-limon','horchata','pepino-limon']);
    }else originalRenderFeatured?.();
    setTimeout(setupAllLoops,60);
  };

  function patchCustomizer(){
    const customizer=$v('.can-customizer');
    if(!customizer)return;
    customizer.classList.add('v8-customizer');
    const overlay=$v('.custom-overlay',customizer);
    if(overlay)overlay.style.setProperty('--phrase-size',`${Number(journey.phraseScale||18)}px`);
    if(state.personalization==='phrase'&&!$v('#v8PhraseScale')){
      customizer.insertAdjacentHTML('beforeend',`<label class="v8-size-control"><span>Tamaño de la frase</span><input id="v8PhraseScale" type="range" min="11" max="28" value="${Number(journey.phraseScale||18)}"><small>La vista es aproximada; el arte final se revisa antes de producir.</small></label>`);
      $v('#v8PhraseScale').oninput=event=>{
        journey.phraseScale=Number(event.target.value);
        $v('.custom-overlay',customizer)?.style.setProperty('--phrase-size',`${journey.phraseScale}px`);
        persistJourney();
      };
    }
  }

  const originalRenderCheckout=window.renderCheckout;
  window.renderCheckout=function(){
    originalRenderCheckout?.();
    setTimeout(patchCustomizer,0);
  };

  function setupAutoStrip(strip){
    if(!strip||strip.dataset.v8Loop==='1'||strip.children.length<2)return;
    strip.dataset.v8Loop='1';
    const originals=[...strip.children];
    originals.forEach(node=>{const clone=node.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.dataset.v8Clone='1';strip.appendChild(clone)});
    let paused=false;
    let resumeTimer;
    const pause=duration=>{paused=true;clearTimeout(resumeTimer);resumeTimer=setTimeout(()=>paused=false,duration)};
    strip.addEventListener('pointerdown',()=>pause(2600));
    strip.addEventListener('wheel',()=>pause(2200),{passive:true});
    strip.addEventListener('mouseenter',()=>paused=true);
    strip.addEventListener('mouseleave',()=>paused=false);
    const firstClone=strip.querySelector('[data-v8-clone="1"]');
    let last=performance.now();
    const tick=now=>{
      const dt=Math.min(40,now-last);last=now;
      if(!paused&&strip.isConnected){
        strip.scrollLeft+=Math.max(.55,dt*.04);
        const resetAt=firstClone?.offsetLeft||strip.scrollWidth/2;
        if(resetAt&&strip.scrollLeft>=resetAt)strip.scrollLeft-=resetAt;
      }
      if(strip.isConnected)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function setupAllLoops(){
    ['#featuredStrip','#eventStrip','#zeroStrip'].forEach(selector=>setupAutoStrip($v(selector)));
  }

  function syncNavigation(){
    const nav=$v('.nav-btn[data-nav="cart"]');
    if(nav){
      const text=[...nav.childNodes].find(node=>node.nodeType===Node.TEXT_NODE);
      if(text)text.textContent=(state.mode==='quote'||state.occasion==='event')?'Cotización':'Pedido';
    }
  }

  function bindLanding(){
    $$v('[data-v8-journey]').forEach(button=>button.onclick=()=>{
      const kind=button.dataset.v8Journey;
      if(kind==='personal')setPersonalJourney();
      else openJourneyWizard(kind,0);
    });
    $v('#v8Instagram')?.setAttribute('href',INSTAGRAM_URL);
    $v('#v8InstagramHandle')?.setAttribute('href',INSTAGRAM_URL);
  }

  document.addEventListener('click',event=>{
    const product=event.target.closest('.product-strip .mini-product[data-product]');
    if(product){
      event.preventDefault();event.stopImmediatePropagation();
      openProduct(product.dataset.product);
      return;
    }
    const edit=event.target.closest('[data-v8-edit-journey]');
    if(edit){event.preventDefault();openJourneyWizard(journey.kind,Number(edit.dataset.v8EditJourney)||0)}
  },true);

  const originalUpdateCartUI=window.updateCartUI;
  window.updateCartUI=function(animate=false){
    originalUpdateCartUI?.(animate);
    syncNavigation();
    setTimeout(()=>{renderJourneyContext();setupAllLoops()},40);
  };

  const originalShowScreen=window.showScreen;
  window.showScreen=function(name){
    smoothPulse();
    const result=originalShowScreen?.(name);
    setTimeout(()=>{
      syncNavigation();
      if(name==='menu')renderJourneyContext();
      if(name==='home')setupAllLoops();
    },220);
    return result;
  };

  function animateLanding(){
    const root=$v('#homeScreen');
    if(!root)return;
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('v8-visible');observer.unobserve(entry.target)}
    }),{root,threshold:.08,rootMargin:'0px 0px 80px'});
    $$v('.v8-reveal',root).forEach((node,index)=>{node.style.setProperty('--v8-delay',`${Math.min(index,8)*55}ms`);observer.observe(node)});
  }

  bindLanding();
  window.renderFeatured();
  setupAllLoops();
  syncNavigation();
  animateLanding();
  renderJourneyContext();
  persistJourney();
})();
