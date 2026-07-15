(()=>{
  'use strict';

  const VERSION='6.0.0';
  const STORAGE_KEY='antojo_state_v6';
  const ONBOARDING_KEY='antojo_onboarding_seen';
  const LAST_REGISTRATION_KEY='antojo_last_registration_v6';
  const PENDING_KEY='antojo_pending_registration_v6';
  const SESSION_KEY='antojo_session_v6';
  const UTM_KEY='antojo_utm_v6';
  const WHATSAPP_NUMBER_V6='5215522026291';

  const EVENT_TYPES=[
    {id:'Boda',label:'Boda',copy:'Bienvenida, brindis o barra para celebrar.'},
    {id:'Cumpleaños',label:'Cumpleaños',copy:'Bebidas listas para servir y compartir.'},
    {id:'Evento corporativo',label:'Corporativo',copy:'Workshop, reunión, lanzamiento o convivencia.'},
    {id:'Activación de marca',label:'Activación',copy:'Volumen, branding y operación en sitio.'},
    {id:'Reunión privada',label:'Reunión privada',copy:'Un plan más pequeño, pero bien presentado.'},
    {id:'Otro',label:'Otro',copy:'Cuéntanos el plan y lo armamos contigo.'}
  ];

  const EVENT_PACKAGES=[
    {id:'Solo bebidas',label:'Solo bebidas',badge:'Flexible',copy:'Elige cada sabor y cantidad desde cero.',factor:1,mix:null},
    {id:'Mix sin alcohol',label:'Mix sin alcohol',badge:'Fresco',copy:'Pepino-limón, maracuyá-limón y jamaica-limón.',factor:1.2,mix:[['pepino-limon',.4],['maracuya-limon',.35],['jamaica-limon',.25]]},
    {id:'Mix con alcohol',label:'Mix para brindar',badge:'Favorito',copy:'Mojito mariposa, mezcalita de jamaica y una opción sin alcohol.',factor:1.2,mix:[['mojito-mariposa',.4],['mezcalita-jamaica',.3],['maracuya-limon',.3]]},
    {id:'Café y sobremesa',label:'Café y sobremesa',badge:'Día',copy:'Espresso horchata, cold brew y horchata clásica.',factor:1,mix:[['espresso-horchata',.4],['cold-brew',.3],['horchata',.3]]},
    {id:'Barra ANTOJO.',label:'Barra ANTOJO.',badge:'Experiencia',copy:'Cotización de bebidas, montaje y operación para el evento.',factor:2,mix:null},
    {id:'Personalizado',label:'Personalizado',badge:'A tu manera',copy:'Frases, logo, combinación y logística especial.',factor:1.2,mix:null}
  ];

  const EXTRA_KEYS=['eventType','eventGuests','eventVenue','eventVenueName','eventPlaceId','eventLat','eventLng','eventDateUnknown','eventTimeUnknown','eventVenueUnknown','eventPackage','logoData','logoName','logoMime','registrationStatus','notionUrl'];
  EXTRA_KEYS.forEach(key=>{if(typeof state[key]==='undefined')state[key]=key.endsWith('Unknown')?false:''});
  state.eventGuests=Number(state.eventGuests||100);
  state.eventPackage=state.eventPackage||'Solo bebidas';
  state.registrationStatus=state.registrationStatus||'';

  const parse=(value,fallback)=>{try{return JSON.parse(value)}catch{return fallback}};
  const esc=(value='')=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const q=(selector,root=document)=>root.querySelector(selector);
  const qa=(selector,root=document)=>[...root.querySelectorAll(selector)];

  function restoreV6(){
    const saved=parse(localStorage.getItem(STORAGE_KEY),null)||parse(localStorage.getItem('antojo_state_v5'),null);
    if(!saved||!saved.state)return;
    Object.entries(saved.state).forEach(([key,value])=>{state[key]=value});
  }

  function persistV6(){
    const keys=['mode','cart','category','occasion','eventTarget','fulfillment','date','time','address','shippingFee','shippingZone','shippingEta','shippingStatus','personalization','personalizationText','name','phone','notes','adultConfirmed','consent','folio','requestFingerprint',...EXTRA_KEYS];
    const snapshot={};keys.forEach(key=>snapshot[key]=state[key]);
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify({version:VERSION,savedAt:Date.now(),state:snapshot}))}catch{
      snapshot.logoData='';
      localStorage.setItem(STORAGE_KEY,JSON.stringify({version:VERSION,savedAt:Date.now(),state:snapshot}));
    }
  }

  restoreV6();
  isQuote=function(){return state.mode==='quote'||totalQty()>50||state.occasion==='event'||state.personalization!=='normal'};
  personalizationSurcharge=function(){return 0};
  totalEstimate=function(){const quantity=totalQty(),plan=pricePlan(quantity);return !isQuote()&&plan.unit?quantity*plan.unit+deliveryEstimate():null};
  localStorage.removeItem('antojo_last_submission_v5');
  localStorage.removeItem('antojo_pending_requests_v5');
  if(!localStorage.getItem(SESSION_KEY))localStorage.setItem(SESSION_KEY,crypto?.randomUUID?.()||`session-${Date.now()}`);
  const urlParams=new URLSearchParams(location.search);
  const currentUtm={source:urlParams.get('utm_source')||'',medium:urlParams.get('utm_medium')||'',campaign:urlParams.get('utm_campaign')||''};
  if(Object.values(currentUtm).some(Boolean))localStorage.setItem(UTM_KEY,JSON.stringify(currentUtm));

  function markOnboardingSeen(){
    try{localStorage.setItem(ONBOARDING_KEY,'1');localStorage.setItem('antojo_onboarding_seen_v5','1')}catch{}
    document.cookie=`${ONBOARDING_KEY}=1; Max-Age=31536000; Path=/; SameSite=Lax`;
  }

  function onboardingWasSeen(){
    try{if(localStorage.getItem(ONBOARDING_KEY)==='1'||localStorage.getItem('antojo_onboarding_seen_v5')==='1')return true}catch{}
    return document.cookie.split(';').some(item=>item.trim()===`${ONBOARDING_KEY}=1`);
  }

  function fixOnboarding(){
    const onboarding=q('#onboarding');
    if(!onboarding)return;
    if(onboardingWasSeen()){
      onboarding.classList.add('closed');
      q('#topbar')?.classList.add('visible');
      q('#bottomNav')?.classList.add('visible');
    }
    q('#skipOnboarding')?.addEventListener('click',markOnboardingSeen,{capture:true});
    q('#nextSlide')?.addEventListener('click',()=>{if(state.onboarding>=2)setTimeout(markOnboardingSeen,0)},{capture:true});
    const observer=new MutationObserver(()=>{if(onboarding.classList.contains('closed'))markOnboardingSeen()});
    observer.observe(onboarding,{attributes:true,attributeFilter:['class']});
  }

  function generateFolioV6(){
    const d=new Date();
    const stamp=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('');
    const code=Math.random().toString(36).slice(2,7).toUpperCase();
    return `ANT-${stamp}-${code}`;
  }

  function eventMode(){return state.mode==='quote'||state.occasion==='event'}
  function packageById(id){return EVENT_PACKAGES.find(item=>item.id===id)||EVENT_PACKAGES[0]}
  function eventTypeById(id){return EVENT_TYPES.find(item=>item.id===id)||EVENT_TYPES[EVENT_TYPES.length-1]}

  function suggestedQuantity(){
    const pack=packageById(state.eventPackage);
    const guests=Math.max(1,Number(state.eventGuests)||1);
    return Math.max(50,Math.ceil(guests*pack.factor/10)*10);
  }

  function distributeMix(target,mix){
    if(!mix||!mix.length)return;
    const next={};let used=0;
    mix.forEach(([id,portion],index)=>{
      const qty=index===mix.length-1?target-used:Math.max(1,Math.round(target*portion));
      next[id]=qty;used+=qty;
    });
    state.cart=next;
  }

  function ensureEventWizard(){
    if(q('#eventWizard'))return;
    q('#appShell')?.insertAdjacentHTML('beforeend',`
      <div class="event-wizard-backdrop" id="eventWizard">
        <section class="event-wizard-panel" role="dialog" aria-modal="true" aria-label="Cotiza tu evento">
          <div class="event-wizard-head"><div><span>COTIZACIÓN PARA EVENTO</span><h2>Cuéntanos tu plan.</h2></div><button id="closeEventWizard" aria-label="Cerrar">×</button></div>
          <div class="event-wizard-progress"><i></i><i></i><i></i></div>
          <div id="eventWizardBody"></div>
          <div class="event-wizard-actions"><button class="secondary-btn" id="eventWizardBack">Atrás</button><button class="primary-btn" id="eventWizardNext">Continuar</button></div>
        </section>
      </div>`);
    q('#closeEventWizard').onclick=closeEventWizard;
    q('#eventWizard').addEventListener('click',event=>{if(event.target.id==='eventWizard')closeEventWizard()});
  }

  let eventWizardStep=0;

  function openEventWizard(){
    ensureEventWizard();
    eventWizardStep=0;
    state.mode='quote';
    state.occasion='event';
    state.fulfillment='event';
    state.eventType=state.eventType||'';
    state.eventGuests=Number(state.eventGuests||100);
    state.eventTarget=Number(state.eventTarget||100);
    state.eventPackage=state.eventPackage||'Solo bebidas';
    renderEventWizard();
    q('#eventWizard').classList.add('open');
    q('#bottomNav')?.classList.remove('visible');
  }

  function closeEventWizard(){
    q('#eventWizard')?.classList.remove('open');
    if(['home','menu','cart'].includes(state.screen))q('#bottomNav')?.classList.add('visible');
    persistV6();
  }

  function renderEventWizard(){
    const body=q('#eventWizardBody');if(!body)return;
    qa('.event-wizard-progress i').forEach((node,index)=>node.classList.toggle('active',index<=eventWizardStep));
    q('#eventWizardBack').style.visibility=eventWizardStep===0?'hidden':'visible';
    q('#eventWizardNext').textContent=eventWizardStep===2?'Armar mi cotización':'Continuar';

    if(eventWizardStep===0){
      body.innerHTML=`<div class="wizard-kicker">Paso 1 de 3</div><h3>¿Qué tipo de evento es?</h3><p class="wizard-help">Esto cambia la recomendación de sabores, cantidades y operación.</p><div class="event-type-grid">${EVENT_TYPES.map(item=>`<button class="event-type-card ${state.eventType===item.id?'selected':''}" data-event-type="${item.id}"><b>${item.label}</b><small>${item.copy}</small></button>`).join('')}</div><div class="wizard-field-row"><label><span>¿Para cuántas personas?</span><input id="eventGuests" type="number" min="1" max="2000" inputmode="numeric" value="${Number(state.eventGuests)||''}" placeholder="Ej. 120"></label><label><span>Bebidas de referencia</span><input id="eventTargetInput" type="number" min="10" max="2000" inputmode="numeric" value="${Number(state.eventTarget)||''}" placeholder="Ej. 150"></label></div><div class="target-presets">${[50,100,200].map(value=>`<button data-event-target="${value}" class="${Number(state.eventTarget)===value?'selected':''}">${value}</button>`).join('')}<button data-event-target="custom">Otra</button></div><div class="wizard-tip">La cantidad es una referencia editable; el precio final se cotiza según bebidas, personalización y logística.</div>`;
      qa('[data-event-type]',body).forEach(button=>button.onclick=()=>{state.eventType=button.dataset.eventType;renderEventWizard()});
      qa('[data-event-target]',body).forEach(button=>button.onclick=()=>{if(button.dataset.eventTarget==='custom')return q('#eventTargetInput')?.focus();state.eventTarget=Number(button.dataset.eventTarget);renderEventWizard()});
      q('#eventGuests').oninput=event=>{state.eventGuests=Math.max(1,Number(event.target.value||0));if(!state.eventTarget)state.eventTarget=suggestedQuantity();persistV6()};
      q('#eventTargetInput').oninput=event=>{state.eventTarget=Math.max(0,Number(event.target.value||0));persistV6()};
    }

    if(eventWizardStep===1){
      body.innerHTML=`<div class="wizard-kicker">Paso 2 de 3</div><h3>Elige un punto de partida.</h3><p class="wizard-help">No es un paquete cerrado. Puedes ajustar cantidades y sabores después.</p><div class="package-grid">${EVENT_PACKAGES.map(item=>`<button class="package-card ${state.eventPackage===item.id?'selected':''}" data-package="${item.id}"><span>${item.badge}</span><b>${item.label}</b><small>${item.copy}</small><em>${item.id==='Barra ANTOJO.'?'Montaje y operación por cotizar':'Mix editable · precio por cotizar'}</em></button>`).join('')}</div><div class="package-recommendation"><span>Recomendación inicial</span><strong>${suggestedQuantity()} bebidas para ${Number(state.eventGuests)||0} personas</strong><small>Puedes conservar la cantidad que elegiste o usar esta recomendación.</small><button id="useSuggestedQty">Usar ${suggestedQuantity()}</button></div>`;
      qa('[data-package]',body).forEach(button=>button.onclick=()=>{state.eventPackage=button.dataset.package;renderEventWizard()});
      q('#useSuggestedQty').onclick=()=>{state.eventTarget=suggestedQuantity();showToast(`Usaremos ${state.eventTarget} bebidas como referencia.`);persistV6()};
    }

    if(eventWizardStep===2){
      body.innerHTML=`<div class="wizard-kicker">Paso 3 de 3</div><h3>¿Dónde y cuándo será?</h3><p class="wizard-help">Puedes dejar estos datos por definir. No bloquearemos tu cotización.</p><label class="wizard-check"><input type="checkbox" id="venueUnknown" ${state.eventVenueUnknown?'checked':''}><span>Todavía no tengo definido el lugar</span></label><div class="places-box ${state.eventVenueUnknown?'disabled':''}"><label><span>Lugar o dirección exacta</span><input id="eventVenue" value="${esc(state.eventVenue||'')}" placeholder="Busca salón, hotel, oficina o dirección" autocomplete="off" ${state.eventVenueUnknown?'disabled':''}></label><div id="placesStatus" class="places-status"></div><button id="openMapsSearch" type="button">Buscar en Google Maps</button></div><div class="wizard-field-row date-row"><label><span>Fecha</span><input id="eventDate" type="date" value="${state.date||''}" ${state.eventDateUnknown?'disabled':''}></label><label><span>Hora</span><input id="eventTime" type="time" value="${state.time||''}" ${state.eventTimeUnknown?'disabled':''}></label></div><div class="unknown-row"><label class="wizard-check"><input type="checkbox" id="dateUnknown" ${state.eventDateUnknown?'checked':''}><span>Fecha por definir</span></label><label class="wizard-check"><input type="checkbox" id="timeUnknown" ${state.eventTimeUnknown?'checked':''}><span>Hora por definir</span></label></div><div class="wizard-summary"><b>${eventTypeById(state.eventType).label||'Evento'} · ${state.eventPackage}</b><span>${Number(state.eventGuests)||0} personas · ${Number(state.eventTarget)||0} bebidas de referencia</span></div>`;
      q('#venueUnknown').onchange=event=>{state.eventVenueUnknown=event.target.checked;if(state.eventVenueUnknown){state.eventVenue='';state.eventVenueName='';state.eventPlaceId='';state.eventLat='';state.eventLng=''}renderEventWizard()};
      q('#dateUnknown').onchange=event=>{state.eventDateUnknown=event.target.checked;if(state.eventDateUnknown)state.date='';renderEventWizard()};
      q('#timeUnknown').onchange=event=>{state.eventTimeUnknown=event.target.checked;if(state.eventTimeUnknown)state.time='';renderEventWizard()};
      q('#eventDate')?.addEventListener('change',event=>{state.date=event.target.value;persistV6()});
      q('#eventTime')?.addEventListener('change',event=>{state.time=event.target.value;persistV6()});
      q('#eventVenue')?.addEventListener('input',event=>{state.eventVenue=event.target.value;state.address=event.target.value;persistV6()});
      q('#openMapsSearch')?.addEventListener('click',()=>{const text=q('#eventVenue')?.value||state.eventVenue;if(!text)return showToast('Escribe primero un lugar o dirección.');window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`,'_blank','noopener')});
      initPlacesAutocomplete();
    }

    q('#eventWizardBack').onclick=()=>{eventWizardStep=Math.max(0,eventWizardStep-1);renderEventWizard()};
    q('#eventWizardNext').onclick=()=>{
      if(eventWizardStep===0){
        state.eventGuests=Math.max(1,Number(q('#eventGuests')?.value||state.eventGuests||0));
        state.eventTarget=Math.max(10,Number(q('#eventTargetInput')?.value||state.eventTarget||0));
        if(!state.eventType)return showToast('Elige el tipo de evento.');
        if(!state.eventGuests)return showToast('Indica para cuántas personas es.');
      }
      if(eventWizardStep===2){
        if(!state.eventVenueUnknown&&!String(state.eventVenue||'').trim())return showToast('Escribe el lugar o marca que aún está por definir.');
        finalizeEventSetup();return;
      }
      eventWizardStep+=1;renderEventWizard();
    };
  }

  function finalizeEventSetup(){
    state.mode='quote';state.occasion='event';state.fulfillment='event';
    state.address=state.eventVenueUnknown?'':state.eventVenue;
    const pack=packageById(state.eventPackage);
    if(totalQty()===0&&pack.mix)distributeMix(Math.max(10,Number(state.eventTarget)||suggestedQuantity()),pack.mix);
    if(state.eventPackage==='Personalizado'&&state.personalization==='normal')state.personalization='logo';
    closeEventWizard();
    persistV6();
    updateCartUI(false);
    showScreen('menu');
    showToast('Listo. Ahora ajusta sabores y cantidades.');
  }

  let mapsLoadingPromise=null;
  async function loadMaps(){
    if(window.google?.maps?.places)return true;
    if(mapsLoadingPromise)return mapsLoadingPromise;
    mapsLoadingPromise=(async()=>{
      try{
        const response=await fetch('/api/config',{cache:'no-store'});const config=await response.json();
        if(!config.googleMapsEnabled||!config.googleMapsKey)return false;
        await new Promise((resolve,reject)=>{
          const script=document.createElement('script');
          script.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(config.googleMapsKey)}&libraries=places&v=weekly&language=es&region=MX`;
          script.async=true;script.defer=true;script.onload=resolve;script.onerror=reject;document.head.appendChild(script);
        });
        return Boolean(window.google?.maps?.places);
      }catch{return false}
    })();
    return mapsLoadingPromise;
  }

  async function initPlacesAutocomplete(){
    const input=q('#eventVenue'),status=q('#placesStatus');if(!input||input.disabled)return;
    if(status)status.textContent='Preparando búsqueda de lugares…';
    const enabled=await loadMaps();
    if(!q('#eventVenue')||input!==q('#eventVenue'))return;
    if(!enabled){if(status)status.textContent='Escribe la dirección manualmente. La búsqueda exacta se activa al configurar Google Maps.';return}
    const autocomplete=new google.maps.places.Autocomplete(input,{componentRestrictions:{country:'mx'},fields:['formatted_address','geometry','name','place_id'],types:['establishment','geocode']});
    autocomplete.addListener('place_changed',()=>{
      const place=autocomplete.getPlace();
      state.eventVenueName=place.name||'';
      state.eventVenue=place.formatted_address||input.value;
      state.address=state.eventVenue;
      state.eventPlaceId=place.place_id||'';
      state.eventLat=place.geometry?.location?.lat?.()||'';
      state.eventLng=place.geometry?.location?.lng?.()||'';
      input.value=state.eventVenueName?`${state.eventVenueName} · ${state.eventVenue}`:state.eventVenue;
      if(status)status.textContent='Ubicación encontrada en Google Maps.';
      persistV6();
    });
    if(status)status.textContent='Busca y selecciona una sugerencia de Google Maps.';
  }

  const inheritedSetMode=setMode;
  setMode=function(mode,target){
    if(mode==='quote'){openEventWizard();return}
    state.mode='order';state.occasion=state.occasion==='event'?'':state.occasion;return inheritedSetMode(mode,target);
  };

  const inheritedRenderOccasions=renderOccasions;
  renderOccasions=function(){
    inheritedRenderOccasions();
    const eventButton=q('[data-occasion="event"]');if(eventButton)eventButton.onclick=openEventWizard;
  };

  function personalizationPreview(){
    const base=byId('mojito-mariposa')?.image||byId('espresso-horchata')?.image||'';
    const phrase=esc(state.personalizationText||'Tu frase aquí');
    return `<div class="can-customizer"><div class="customizer-stage"><img src="${base}" alt="Vista previa de lata personalizada"><div class="custom-overlay ${state.personalization==='logo'?'logo-mode':''}">${state.personalization==='logo'&&state.logoData?`<img src="${state.logoData}" alt="Logo cargado">`:`<span>${phrase}</span>`}</div></div><div><b>Vista previa aproximada</b><p>La posición, legibilidad y producción final se revisan antes de confirmar la cotización.</p></div></div>`;
  }

  function renderPersonalStep(){
    return `<div class="step-kicker">Personalización</div><h2 class="step-title">¿Cómo quieres las latas?</h2><p class="step-sub">La presentación normal está incluida. Las opciones personalizadas pasan a cotización.</p><div class="personal-grid">${personalOptions.map(option=>`<button class="personal-card ${state.personalization===option.id?'selected':''}" data-v6-personal="${option.id}"><span><b>${option.title}</b><small>${option.copy}</small></span><strong>${option.id==='normal'?'Incluido':'Cotizar'}</strong></button>`).join('')}</div>${state.personalization==='phrase'?`<div class="custom-input-block"><label class="field-label">Frase o nombre</label><input class="field" id="v6PersonalText" maxlength="80" value="${esc(state.personalizationText)}" placeholder="Ej. Ana & Luis · 21.11.26"></div>${personalizationPreview()}`:''}${state.personalization==='logo'?`<div class="custom-input-block"><label class="field-label">Sube tu logo</label><label class="logo-upload"><input type="file" id="v6LogoFile" accept="image/png,image/jpeg,image/webp"><span>${state.logoName?`Cambiar ${esc(state.logoName)}`:'Elegir PNG, JPG o WEBP'}</span><small>Máximo recomendado: 5 MB. Lo optimizamos antes de guardarlo.</small></label><label class="field-label logo-note-label">Indicaciones</label><textarea class="field textarea" id="v6PersonalText" placeholder="Colores, frase, fecha o detalles del diseño">${esc(state.personalizationText)}</textarea></div>${personalizationPreview()}`:''}${hasAlcohol()?`<div class="confirm-box"><input type="checkbox" id="adultConfirmV6" ${state.adultConfirmed?'checked':''}><label for="adultConfirmV6">Confirmo que las bebidas con alcohol son para personas adultas.</label></div>`:''}`;
  }

  function renderContactStep(){
    return `<div class="step-kicker">Datos de contacto</div><h2 class="step-title">¿A nombre de quién?</h2><p class="step-sub">Registraremos tu pedido en ANTOJO. y te contactaremos por WhatsApp para confirmar disponibilidad y total.</p><div class="field-grid"><div><label class="field-label">Nombre</label><input class="field" id="nameFieldV6" value="${esc(state.name)}" placeholder="Tu nombre"></div><div><label class="field-label">WhatsApp</label><input class="field" id="phoneFieldV6" inputmode="tel" value="${esc(state.phone||'+52 ')}" placeholder="+52 55 0000 0000"></div><div><label class="field-label">Notas opcionales</label><textarea class="field textarea" id="notesFieldV6" placeholder="Algo que debamos considerar">${esc(state.notes)}</textarea></div></div><label class="consent-box"><input type="checkbox" id="privacyConsentV6" ${state.consent?'checked':''}><span>Autorizo a ANTOJO. a usar estos datos para registrar y dar seguimiento a mi pedido o cotización. <button type="button" data-legal="privacy">Leer aviso.</button></span></label>`;
  }

  function registrationReview(){
    const quote=isQuote(),qty=totalQty(),plan=pricePlan(qty),fulfillment=fulfillmentOptions.find(item=>item.id===state.fulfillment)?.title||'—';
    const dateText=eventMode()?(state.eventDateUnknown?'Por definir':state.date||'Por definir'):state.date||'—';
    return `<div class="step-kicker">Revisión final</div><h2 class="step-title">Revisa y registra.</h2><p class="step-sub">El registro ocurre directamente en ANTOJO. WhatsApp será opcional después.</p><div class="review-summary"><h3>${quote?'Cotización':'Pedido'} de ${qty} bebidas</h3>${eventMode()?`<div class="review-line"><span>Evento</span><b>${esc(state.eventType||'Por definir')}</b></div><div class="review-line"><span>Personas</span><b>${Number(state.eventGuests)||'—'}</b></div><div class="review-line"><span>Paquete</span><b>${esc(state.eventPackage)}</b></div><div class="review-line"><span>Lugar</span><b>${esc(state.eventVenueUnknown?'Por definir':state.eventVenue||'Por definir')}</b></div>`:''}<div class="review-line"><span>Fecha</span><b>${esc(dateText)}${state.eventTimeUnknown||!state.time?'':` · ${esc(state.time)}`}</b></div><div class="review-line"><span>Entrega</span><b>${esc(fulfillment)}</b></div><div class="review-line"><span>Sabores</span><b>${cartItems().length}</b></div><div class="review-line"><span>Personalización</span><b>${esc(personalOptions.find(item=>item.id===state.personalization)?.title||'Normal')}</b></div><div class="review-line"><span>${quote?'Precio':'Total estimado'}</span><b>${quote?'Por cotizar':money(qty*plan.unit+deliveryEstimate())}</b></div></div><div class="registration-note"><strong>Qué sucederá al continuar</strong><span>Guardaremos la información en ANTOJO. y te mostraremos un folio. No es necesario enviar un mensaje para que quede registrada.</span></div>`;
  }

  function bindPersonalizationUi(){
    qa('[data-v6-personal]').forEach(button=>button.onclick=()=>{saveV6Fields();state.personalization=button.dataset.v6Personal;if(state.personalization==='normal'){state.personalizationText='';state.logoData='';state.logoName='';state.logoMime=''}renderCheckout()});
    q('#v6PersonalText')?.addEventListener('input',event=>{state.personalizationText=event.target.value;persistV6();const preview=q('.custom-overlay span');if(preview)preview.textContent=event.target.value||'Tu frase aquí'});
    q('#adultConfirmV6')?.addEventListener('change',event=>{state.adultConfirmed=event.target.checked;persistV6()});
    q('#v6LogoFile')?.addEventListener('change',async event=>{
      const file=event.target.files?.[0];if(!file)return;
      try{
        const optimized=await optimizeLogo(file);
        state.logoData=optimized.data;state.logoName=optimized.name;state.logoMime=optimized.mime;persistV6();renderCheckout();showToast('Logo cargado para la vista previa.');
      }catch(error){showToast(error.message||'No pudimos procesar ese archivo.')}
    });
  }

  async function optimizeLogo(file){
    if(!/^image\/(png|jpeg|webp)$/.test(file.type))throw new Error('Usa un archivo PNG, JPG o WEBP.');
    if(file.size>5*1024*1024)throw new Error('El archivo supera 5 MB.');
    const src=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file)});
    const image=await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src});
    const max=700,scale=Math.min(1,max/Math.max(image.width,image.height));
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));
    const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
    let data=canvas.toDataURL('image/webp',.82);
    if(data.length>900000)data=canvas.toDataURL('image/webp',.62);
    return {data,name:`logo-${Date.now()}.webp`,mime:'image/webp'};
  }

  function saveV6Fields(){
    if(q('#nameFieldV6'))state.name=q('#nameFieldV6').value.trim();
    if(q('#phoneFieldV6'))state.phone=q('#phoneFieldV6').value.trim();
    if(q('#notesFieldV6'))state.notes=q('#notesFieldV6').value.trim();
    if(q('#privacyConsentV6'))state.consent=q('#privacyConsentV6').checked;
    if(q('#v6PersonalText'))state.personalizationText=q('#v6PersonalText').value.trim();
    if(q('#addressField'))state.address=q('#addressField').value.trim();
    if(q('#dateField'))state.date=q('#dateField').value;
    if(q('#timeField'))state.time=q('#timeField').value;
    persistV6();
  }

  const baseRenderCheckout=renderCheckout;
  renderCheckout=function(){
    if(!eventMode()){
      baseRenderCheckout();
      if(state.checkoutStep===1){q('[data-checkoccasion="event"]')?.remove();const dateField=q('#dateField');if(dateField){const min=new Date();min.setDate(min.getDate()+2);dateField.min=min.toISOString().slice(0,10);dateField.parentElement?.insertAdjacentHTML('beforeend','<div class="lead-note">Pedidos estándar: mínimo 48 horas de anticipación. Urgencias sujetas a disponibilidad.</div>')}}
      if(state.checkoutStep===2){
        const root=q('#checkoutContent');
        if(root){root.innerHTML=checkoutHeader()+renderPersonalStep();q('#checkoutBack').onclick=()=>{saveV6Fields();state.checkoutStep=1;renderCheckout()};bindPersonalizationUi()}
      }
      if(state.checkoutStep===3){
        const root=q('#checkoutContent');
        if(root){root.innerHTML=checkoutHeader()+renderContactStep();q('#checkoutBack').onclick=()=>{saveV6Fields();state.checkoutStep=2;renderCheckout()};bindLegalLinks()}
      }
      bindCheckoutAction(false);persistV6();return;
    }

    const step=Math.min(Number(state.checkoutStep)||0,2);state.checkoutStep=step;
    let content='';
    if(step===0)content=renderPersonalStep();
    if(step===1)content=renderContactStep();
    if(step===2)content=registrationReview();
    const root=q('#checkoutContent');if(!root)return;
    root.innerHTML=`<div class="checkout-head"><button class="back-round" id="checkoutBack">←</button><h1>Tu cotización para evento</h1></div><div class="checkout-progress event-checkout-progress">${[0,1,2].map(index=>`<span class="${index<=step?'done':''}"></span>`).join('')}</div>${content}`;
    q('#checkoutBack').onclick=()=>{saveV6Fields();if(step===0)showScreen('cart');else{state.checkoutStep=step-1;renderCheckout()}};
    if(step===0)bindPersonalizationUi();if(step===1)bindLegalLinks();
    bindCheckoutAction(true);persistV6();
  };

  function ensureLegalModal(){
    if(q('#legalModalV6'))return;
    q('#appShell')?.insertAdjacentHTML('beforeend',`<div class="legal-modal" id="legalModalV6"><section class="legal-panel"><div class="legal-head"><h2>Aviso de privacidad</h2><button id="closeLegalV6">×</button></div><div><h3>Cómo usamos tus datos</h3><p>Nombre, teléfono, fecha, ubicación y detalles del pedido se usan para registrar, cotizar y dar seguimiento a tu solicitud.</p><h3>Almacenamiento</h3><p>La información se guarda en el sistema privado de ANTOJO. y puede utilizarse para contactarte por WhatsApp. No vendemos tus datos.</p><h3>Control</h3><p>Puedes solicitar corrección o eliminación escribiendo a ANTOJO. No incluyas información bancaria en las notas.</p></div></section></div>`);
    q('#closeLegalV6').onclick=()=>q('#legalModalV6').classList.remove('open');
    q('#legalModalV6').onclick=event=>{if(event.target.id==='legalModalV6')event.currentTarget.classList.remove('open')};
  }

  function bindLegalLinks(){
    ensureLegalModal();
    qa('[data-legal]').forEach(button=>button.onclick=()=>q('#legalModalV6').classList.add('open'));
  }

  function bindCheckoutAction(isEvent){
    const action=q('#checkoutAction'),button=q('#checkoutNext');if(!action||!button)return;
    action.classList.add('show');
    const totalSteps=isEvent?3:4;
    q('#checkoutMeta').textContent=`Paso ${state.checkoutStep+1} de ${totalSteps}`;
    q('#checkoutTotal').textContent=isQuote()?'Cotización':money(totalEstimate());
    const lastStep=state.checkoutStep===totalSteps-1;
    button.textContent=lastStep?(isQuote()?'Registrar mi cotización':'Registrar mi pedido'):'Continuar';
    button.onclick=async()=>{
      saveV6Fields();
      if(!validateV6Step(isEvent))return;
      if(!lastStep){state.checkoutStep+=1;renderCheckout();return}
      await registerOrder(button);
    };
  }

  function validateV6Step(isEvent){
    const step=state.checkoutStep;
    if(isEvent){
      if(step===0){
        if(state.personalization==='logo'&&!state.logoData){showToast('Sube el logo para continuar.');return false}
        if(state.personalization==='phrase'&&!state.personalizationText.trim()){showToast('Escribe la frase o nombre.');return false}
        if(hasAlcohol()&&!state.adultConfirmed){showToast('Confirma que las bebidas con alcohol son para personas adultas.');return false}
      }
      if(step===1){
        if(state.name.length<2){showToast('Escribe tu nombre.');return false}
        if(state.phone.replace(/\D/g,'').length<10){showToast('Escribe un WhatsApp válido.');return false}
        if(!state.consent){showToast('Autoriza el uso de datos para registrar la cotización.');return false}
      }
      return true;
    }
    if(step===0){
      if(!state.fulfillment){showToast('Elige cómo quieres recibirlo.');return false}
      if(state.fulfillment==='delivery'&&totalQty()<10){showToast('La entrega a domicilio inicia desde 10 bebidas.');return false}
      if(state.fulfillment==='delivery'&&state.address.length<4){showToast('Escribe una dirección o código postal.');return false}
    }
    if(step===1){
      if(!state.occasion||state.occasion==='event'){showToast('Elige para qué plan es.');return false}
      if(!state.date){showToast('Elige la fecha del pedido.');return false}
      const min=new Date();min.setDate(min.getDate()+2);if(state.date<min.toISOString().slice(0,10)){showToast('Elige una fecha con al menos 48 horas de anticipación.');return false}
    }
    if(step===2){
      if(state.personalization==='logo'&&!state.logoData){showToast('Sube el logo para continuar.');return false}
      if(state.personalization==='phrase'&&!state.personalizationText.trim()){showToast('Escribe la frase o nombre.');return false}
      if(hasAlcohol()&&!state.adultConfirmed){showToast('Confirma que las bebidas con alcohol son para personas adultas.');return false}
    }
    if(step===3){
      if(state.name.length<2){showToast('Escribe tu nombre.');return false}
      if(state.phone.replace(/\D/g,'').length<10){showToast('Escribe un WhatsApp válido.');return false}
      if(!state.consent){showToast('Autoriza el uso de datos para registrar el pedido.');return false}
    }
    return true;
  }

  function buildPayloadV6(){
    const qty=totalQty(),quote=isQuote(),plan=pricePlan(qty);
    return {
      folio:state.folio,
      type:quote?'quote':'order',
      createdAt:new Date().toISOString(),
      name:state.name,
      phone:state.phone,
      consent:Boolean(state.consent),
      items:cartItems().map(item=>({id:item.id,name:item.name,qty:item.qty,alcohol:item.alcohol})),
      units:qty,
      targetQuantity:quote?Number(state.eventTarget||qty):qty,
      occasion:state.occasion,
      fulfillment:state.fulfillment,
      requiredDate:state.eventDateUnknown?'':state.date,
      requiredTime:state.eventTimeUnknown?'':state.time,
      dateUnknown:Boolean(state.eventDateUnknown),
      address:eventMode()?(state.eventVenueUnknown?'':state.eventVenue):state.address,
      shippingFee:Number(state.shippingFee||0),
      shippingZone:state.shippingZone,
      personalization:state.personalization,
      personalizationText:state.personalizationText,
      unitPrice:quote?null:plan.unit,
      totalEstimate:quote?null:totalEstimate(),
      notes:state.notes,
      eventType:eventMode()?state.eventType:'',
      eventGuests:eventMode()?Number(state.eventGuests||0):null,
      eventVenue:eventMode()?state.eventVenue:'',
      eventVenueName:eventMode()?state.eventVenueName:'',
      eventVenueUnknown:Boolean(state.eventVenueUnknown),
      eventPlaceId:eventMode()?state.eventPlaceId:'',
      eventLat:eventMode()?state.eventLat:'',
      eventLng:eventMode()?state.eventLng:'',
      eventPackage:eventMode()?state.eventPackage:'Solo bebidas',
      logoData:state.personalization==='logo'?state.logoData:'',
      logoName:state.personalization==='logo'?state.logoName:'',
      logoMime:state.personalization==='logo'?state.logoMime:'',
      utm:parse(localStorage.getItem(UTM_KEY),{})||{},
      sessionId:localStorage.getItem(SESSION_KEY)||'',
      eventTrail:[],
      pageUrl:location.href,
      userAgent:navigator.userAgent,
      website:'',
      whatsappOpened:false
    };
  }

  async function registerOrder(button){
    const original=button.textContent;button.disabled=true;button.textContent='Registrando…';
    const fingerprint=JSON.stringify({cart:state.cart,name:state.name,phone:state.phone,eventTarget:state.eventTarget,eventType:state.eventType,date:state.date,personalization:state.personalization,logoName:state.logoName});
    if(!state.folio||state.requestFingerprint!==fingerprint){state.folio=generateFolioV6();state.requestFingerprint=fingerprint}
    const payload=buildPayloadV6();
    try{
      localStorage.setItem(PENDING_KEY,JSON.stringify(payload));persistV6();
      const response=await fetch('/api/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const data=await response.json().catch(()=>({}));
      if(!response.ok||!data.ok)throw new Error(data.detail||data.error||'No pudimos registrar la información.');
      state.registrationStatus='registered';state.notionUrl=data.notionUrl||'';
      localStorage.removeItem(PENDING_KEY);
      const registered={folio:state.folio,type:payload.type,at:Date.now(),notionUrl:data.notionUrl||'',message:buildMessageV6(payload)};
      localStorage.setItem(LAST_REGISTRATION_KEY,JSON.stringify(registered));persistV6();
      renderRegisteredSuccess(registered);showScreen('success');
    }catch(error){
      button.disabled=false;button.textContent=original;
      showRegistrationError(error.message||'No pudimos registrar el pedido.');
    }
  }

  function showRegistrationError(message){
    showToast('No quedó registrado. Revisa tu conexión e intenta nuevamente.');
    let box=q('.registration-error');
    if(!box){box=document.createElement('div');box.className='registration-error';q('#checkoutContent')?.appendChild(box)}
    box.innerHTML=`<strong>No registramos todavía tu pedido.</strong><span>${esc(message)}</span><small>Tus datos siguen guardados en este dispositivo.</small>`;
  }

  function buildMessageV6(payload){
    const lines=payload.items.map(item=>`• ${item.qty} × ${item.name}`).join('\n');
    return `Hola ANTOJO. Mi ${payload.type==='quote'?'cotización':'pedido'} ya quedó registrado con el folio ${payload.folio}.\n\n${lines}\n\n${payload.eventType?`Evento: ${payload.eventType}\nPersonas: ${payload.eventGuests}\nPaquete: ${payload.eventPackage}\n`:''}¿Me ayudan con el seguimiento, por favor?`;
  }

  function whatsappBusinessUrl(message){
    const encoded=encodeURIComponent(message);
    const android=/Android/i.test(navigator.userAgent);
    if(android)return `intent://send?phone=${WHATSAPP_NUMBER_V6}&text=${encoded}#Intent;scheme=whatsapp;package=com.whatsapp.w4b;S.browser_fallback_url=${encodeURIComponent(`https://wa.me/${WHATSAPP_NUMBER_V6}?text=${encoded}`)};end`;
    return `https://wa.me/${WHATSAPP_NUMBER_V6}?text=${encoded}`;
  }

  async function markWhatsappOpened(folio){
    try{await fetch('/api/whatsapp-opened',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({folio})})}catch{}
  }

  function renderRegisteredSuccess(last){
    const quote=last.type==='quote',root=q('#successScreen > div');if(!root)return;
    root.innerHTML=`<div class="success-burst"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m5 12 4 4L19 6"/></svg></div><h1>Tu ${quote?'cotización':'pedido'}<br>quedó registrado.</h1><p>El equipo de ANTOJO. revisará la información y te contactará por WhatsApp para confirmar ${quote?'precio, disponibilidad y logística':'disponibilidad, entrega y total'}. No necesitas enviarnos un mensaje para que quede registrado.</p><div class="success-folio">${esc(last.folio)}</div><div class="registered-status"><i></i><span>Registro guardado en ANTOJO.</span></div><div class="success-actions"><button class="primary-btn" id="openWhatsappBusiness">Abrir WhatsApp Business <small>Opcional</small></button><button class="secondary-btn" id="copyOrderSummary">Copiar resumen</button><button class="secondary-btn" id="newOrderV6">Hacer otro pedido</button></div>`;
    q('#openWhatsappBusiness').onclick=async()=>{await markWhatsappOpened(last.folio);location.href=whatsappBusinessUrl(last.message)};
    q('#copyOrderSummary').onclick=async()=>{try{await navigator.clipboard.writeText(last.message);showToast('Resumen copiado.')}catch{showToast('No pudimos copiarlo automáticamente.')}};
    q('#newOrderV6').onclick=resetOrderV6;
  }

  function resetOrderV6(){
    const keep={name:state.name,phone:state.phone};
    Object.assign(state,{cart:{},mode:'order',occasion:'',eventTarget:100,fulfillment:'',date:'',time:'',address:'',shippingFee:0,shippingZone:'',shippingEta:'',personalization:'normal',personalizationText:'',notes:'',adultConfirmed:false,consent:false,folio:'',requestFingerprint:'',eventType:'',eventGuests:100,eventVenue:'',eventVenueName:'',eventPlaceId:'',eventLat:'',eventLng:'',eventDateUnknown:false,eventTimeUnknown:false,eventVenueUnknown:false,eventPackage:'Solo bebidas',logoData:'',logoName:'',logoMime:'',registrationStatus:'',notionUrl:'',...keep});
    localStorage.removeItem(LAST_REGISTRATION_KEY);localStorage.removeItem(PENDING_KEY);persistV6();updateCartUI(false);showScreen('home');
  }

  sendWhatsApp=async function(){const button=q('#checkoutNext');if(button)await registerOrder(button)};

  const originalStartCheckout=startCheckout;
  startCheckout=function(){
    if(!totalQty())return;
    state.checkoutStep=0;
    if(eventMode())state.fulfillment='event';
    originalStartCheckout();
    setTimeout(renderCheckout,0);
  };

  function patchStandardOccasions(){
    const original=OCCASIONS.slice();
    if(!eventMode()&&state.checkoutStep===1){
      const eventChoice=q('[data-checkoccasion="event"]');eventChoice?.remove();
    }
    return original;
  }

  const inheritedShowScreen=showScreen;
  showScreen=function(name){const result=inheritedShowScreen(name);setTimeout(()=>{if(name==='checkout')renderCheckout();patchStandardOccasions();persistV6()},220);return result};

  document.addEventListener('input',event=>{if(event.target.matches('input,textarea'))setTimeout(persistV6,0)});
  document.addEventListener('change',()=>setTimeout(persistV6,0));
  window.addEventListener('beforeunload',persistV6);

  ensureEventWizard();
  renderOccasions();
  bindGoButtons();
  fixOnboarding();
  updateCartUI(false);
  persistV6();

  const last=parse(localStorage.getItem(LAST_REGISTRATION_KEY),null);
  if(last&&Date.now()-last.at<60*60*1000&&state.registrationStatus==='registered')renderRegisteredSuccess(last);
})();