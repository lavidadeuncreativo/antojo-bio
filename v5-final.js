(()=>{
  const VERSION='5.0.0';
  const STORAGE_KEY='antojo_state_v5';
  const ONBOARDING_KEY='antojo_onboarding_seen_v5';
  const QUEUE_KEY='antojo_pending_requests_v5';
  const EVENTS_KEY='antojo_event_trail_v5';
  const SESSION_KEY='antojo_session_v5';
  const UTM_KEY='antojo_utm_v5';
  const LAST_KEY='antojo_last_submission_v5';
  const MAX_AGE=30*24*60*60*1000;
  const ORDER_LEAD_DAYS=2;
  const EVENT_LEAD_DAYS=7;
  const STATE_KEYS=['mode','cart','category','occasion','eventTarget','fulfillment','date','time','address','shippingFee','shippingZone','shippingEta','shippingStatus','personalization','personalizationText','name','phone','notes','adultConfirmed','consent','folio','requestFingerprint'];

  const parse=(value,fallback)=>{try{return JSON.parse(value)}catch{return fallback}};
  const uid=()=>crypto?.randomUUID?.()||`s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;
  const nowIso=()=>new Date().toISOString();
  const getSession=()=>{let id=localStorage.getItem(SESSION_KEY);if(!id){id=uid();localStorage.setItem(SESSION_KEY,id)}return id};
  const sessionId=getSession();

  function captureUtm(){
    const params=new URLSearchParams(location.search);
    const current={source:params.get('utm_source')||'',medium:params.get('utm_medium')||'',campaign:params.get('utm_campaign')||'',content:params.get('utm_content')||'',term:params.get('utm_term')||''};
    if(Object.values(current).some(Boolean)){localStorage.setItem(UTM_KEY,JSON.stringify(current));return current}
    return parse(localStorage.getItem(UTM_KEY),{})||{};
  }
  const utm=captureUtm();

  let eventTrail=parse(localStorage.getItem(EVENTS_KEY),[])||[];
  function track(name,meta={}){
    eventTrail.push({name,at:nowIso(),meta});
    eventTrail=eventTrail.slice(-100);
    localStorage.setItem(EVENTS_KEY,JSON.stringify(eventTrail));
  }

  function restoreState(){
    const saved=parse(localStorage.getItem(STORAGE_KEY),null);
    if(!saved||!saved.savedAt||Date.now()-saved.savedAt>MAX_AGE){localStorage.removeItem(STORAGE_KEY);return}
    STATE_KEYS.forEach(key=>{if(saved.state&&Object.prototype.hasOwnProperty.call(saved.state,key))state[key]=saved.state[key]});
  }
  restoreState();
  state.consent=Boolean(state.consent);
  state.folio=state.folio||'';
  state.requestFingerprint=state.requestFingerprint||'';

  function persist(){
    const snapshot={};STATE_KEYS.forEach(key=>snapshot[key]=state[key]);
    localStorage.setItem(STORAGE_KEY,JSON.stringify({version:VERSION,savedAt:Date.now(),state:snapshot}));
  }

  function fingerprint(){
    const compact={cart:state.cart,mode:state.mode,occasion:state.occasion,eventTarget:state.eventTarget,fulfillment:state.fulfillment,date:state.date,time:state.time,address:state.address,personalization:state.personalization,personalizationText:state.personalizationText,name:state.name,phone:state.phone};
    const text=JSON.stringify(compact);let hash=2166136261;
    for(let i=0;i<text.length;i++){hash^=text.charCodeAt(i);hash=Math.imul(hash,16777619)}
    return (hash>>>0).toString(36);
  }

  function generateFolio(){
    const d=new Date();
    const stamp=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('');
    const code=Math.random().toString(36).slice(2,7).toUpperCase();
    return `ANT-${stamp}-${code}`;
  }

  const originalIsQuote=isQuote;
  isQuote=function(){return state.mode==='quote'||totalQty()>50||state.occasion==='event'||state.personalization!=='normal'};
  personalizationSurcharge=function(){return 0};
  totalEstimate=function(){const q=totalQty(),plan=pricePlan(q);return !isQuote()&&plan.unit?q*plan.unit+deliveryEstimate():null};

  function minDateValue(){
    const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+(isQuote()?EVENT_LEAD_DAYS:ORDER_LEAD_DAYS));return d.toISOString().slice(0,10);
  }

  function updateNavLabel(){
    const button=document.querySelector('[data-nav="cart"]');if(!button)return;
    const node=[...button.childNodes].reverse().find(item=>item.nodeType===Node.TEXT_NODE);
    if(node)node.nodeValue=isQuote()?'Cotización':'Pedido';
  }

  function factsFor(product){
    const facts=['330 ml',product.alcohol?'Con alcohol':'Sin alcohol'];
    if(product.category==='cafe'||/espresso|americano|cold brew|latte|carajillo/i.test(product.name))facts.push('Con cafeína');
    if(/horchata|latte/i.test(product.name))facts.push('Contiene leche');
    facts.push('Mantener en frío');
    return facts;
  }

  function createLegalUi(){
    if(!document.querySelector('.legal-links')){
      document.querySelector('#homeScreen')?.insertAdjacentHTML('beforeend','<div class="legal-links"><button data-legal="privacy">Aviso de privacidad</button><button data-legal="terms">Términos de pedido</button></div>');
    }
    if(!document.querySelector('#legalModal')){
      document.querySelector('#appShell')?.insertAdjacentHTML('beforeend',`<div class="legal-modal" id="legalModal"><section class="legal-panel"><div class="legal-head"><h2 id="legalTitle">Aviso de privacidad</h2><button class="legal-close" aria-label="Cerrar">×</button></div><div id="legalBody"></div></section></div>`);
    }
    document.querySelectorAll('[data-legal]').forEach(button=>button.onclick=()=>openLegal(button.dataset.legal));
    document.querySelector('.legal-close')?.addEventListener('click',closeLegal);
    document.querySelector('#legalModal')?.addEventListener('click',event=>{if(event.target.id==='legalModal')closeLegal()});
  }

  function openLegal(type='privacy'){
    const privacy=`<h3>Cómo usamos tus datos</h3><p>Usamos nombre, teléfono, fecha, dirección y detalles del pedido únicamente para atender tu solicitud, confirmar disponibilidad, calcular logística y dar seguimiento comercial.</p><h3>Dónde se almacenan</h3><p>La solicitud puede guardarse en el sistema operativo privado de ANTOJO. y enviarse por WhatsApp. No vendemos tus datos ni los utilizamos para fines distintos sin tu autorización.</p><h3>Control de tus datos</h3><p>Puedes solicitar corrección o eliminación escribiendo al WhatsApp de ANTOJO. No incluyas datos bancarios ni información sensible en el campo de notas.</p>`;
    const terms=`<h3>Precios y disponibilidad</h3><p>Los precios mostrados aplican a pedidos estándar de hasta 50 piezas. Pedidos mayores, productos personalizados y logística para eventos se confirman mediante cotización.</p><h3>Envíos</h3><p>El costo mostrado es un estimado por zona. La tarifa, horario y disponibilidad final se confirman por WhatsApp antes del pago.</p><h3>Fechas</h3><p>Los pedidos estándar requieren al menos 48 horas de anticipación y los eventos al menos 7 días. Las solicitudes urgentes quedan sujetas a capacidad de producción.</p><h3>Alcohol</h3><p>Las bebidas con alcohol solo se venden a personas adultas. ANTOJO. puede solicitar confirmación de edad al entregar.</p>`;
    document.querySelector('#legalTitle').textContent=type==='terms'?'Términos de pedido':'Aviso de privacidad';
    document.querySelector('#legalBody').innerHTML=type==='terms'?terms:privacy;
    document.querySelector('#legalModal').classList.add('open');
  }
  function closeLegal(){document.querySelector('#legalModal')?.classList.remove('open')}

  function createSyncStatus(){
    if(!document.querySelector('#syncStatus'))document.querySelector('#appShell')?.insertAdjacentHTML('beforeend','<div class="sync-status" id="syncStatus"></div>');
  }
  function showSync(message,warning=false){const el=document.querySelector('#syncStatus');if(!el)return;el.textContent=message;el.classList.toggle('warning',warning);el.classList.add('show');clearTimeout(showSync.timer);showSync.timer=setTimeout(()=>el.classList.remove('show'),3200)}

  const originalRenderSheet=renderSheet;
  renderSheet=function(){
    originalRenderSheet();
    const product=byId(state.sheetProduct);
    const body=document.querySelector('#sheetContent .sheet-body');
    if(product&&body&&!body.querySelector('.product-facts')){
      const facts=factsFor(product).map(value=>`<span>${value}</span>`).join('');
      body.querySelector('p')?.insertAdjacentHTML('afterend',`<div class="product-facts">${facts}</div>`);
    }
    if(isQuote()){
      const values=[10,25,50,100];
      document.querySelectorAll('#sheetContent [data-quick]').forEach((button,index)=>{
        const value=values[index]||10;button.textContent=value;button.onclick=()=>{state.sheetQty=value;persist();renderSheet()};
      });
    }
  };

  const originalSaveFields=saveFields;
  saveFields=function(){originalSaveFields();const consent=document.querySelector('#privacyConsent');if(consent)state.consent=consent.checked;persist()};

  const originalRenderCheckout=renderCheckout;
  let lastTrackedStep=-1;
  renderCheckout=function(){
    originalRenderCheckout();
    const dateField=document.querySelector('#dateField');
    if(dateField){
      const min=minDateValue();dateField.min=min;
      if(!document.querySelector('.lead-note'))dateField.parentElement.insertAdjacentHTML('beforeend',`<div class="lead-note">Anticipación mínima: ${isQuote()?`${EVENT_LEAD_DAYS} días para eventos`:`${ORDER_LEAD_DAYS} días para pedidos estándar`}. Urgencias sujetas a disponibilidad.</div>`);
    }
    if(state.checkoutStep===2&&state.personalization!=='normal'&&!document.querySelector('.quote-callout')){
      document.querySelector('.personal-grid')?.insertAdjacentHTML('afterend','<div class="quote-callout"><strong>Esta solicitud pasará a cotización.</strong><br>La personalización se revisa antes de confirmar el precio final.</div>');
    }
    if(state.checkoutStep===3&&!document.querySelector('#privacyConsent')){
      const review=document.querySelector('.review-summary');
      review?.insertAdjacentHTML('beforebegin',`<label class="consent-box"><input type="checkbox" id="privacyConsent" ${state.consent?'checked':''}><span>Autorizo a ANTOJO. a usar estos datos para atender y dar seguimiento a mi solicitud. <button type="button" data-legal="privacy">Leer aviso de privacidad</button>.</span></label>`);
      document.querySelector('#privacyConsent')?.addEventListener('change',event=>{state.consent=event.target.checked;persist()});
      document.querySelectorAll('[data-legal]').forEach(button=>button.onclick=()=>openLegal(button.dataset.legal));
    }
    updateNavLabel();persist();
    if(lastTrackedStep!==state.checkoutStep){lastTrackedStep=state.checkoutStep;track('checkout_step_viewed',{step:state.checkoutStep+1,quote:isQuote()})}
  };

  const originalValidateStep=validateStep;
  validateStep=function(){
    const valid=originalValidateStep();if(!valid)return false;
    if(state.checkoutStep===1&&state.date<minDateValue()){showToast(`Elige una fecha con al menos ${isQuote()?EVENT_LEAD_DAYS:ORDER_LEAD_DAYS} días de anticipación.`);return false}
    if(state.checkoutStep===3&&!state.consent){showToast('Confirma el aviso de privacidad para continuar.');return false}
    return true;
  };

  const originalUpdateCartUI=updateCartUI;
  updateCartUI=function(animate=false){const result=originalUpdateCartUI(animate);persist();updateNavLabel();renderResumeCard();if(animate)track('add_to_cart',{units:totalQty(),quote:isQuote()});return result};

  const originalSetMode=setMode;
  setMode=function(mode,target){track(mode==='quote'?'quote_started':'order_started',{target:target||null});const result=originalSetMode(mode,target);persist();updateNavLabel();return result};

  const originalOpenProduct=openProduct;
  openProduct=function(id){track('product_view',{product:id});return originalOpenProduct(id)};

  const originalShowScreen=showScreen;
  showScreen=function(name){track('screen_view',{screen:name});const result=originalShowScreen(name);setTimeout(()=>{updateNavLabel();renderResumeCard()},260);persist();return result};

  function renderResumeCard(){
    const home=document.querySelector('#homeScreen'),existing=document.querySelector('#resumeOrder');
    if(!home)return;
    if(totalQty()<1){existing?.remove();return}
    if(existing){existing.querySelector('b').textContent=`Tienes ${totalQty()} bebidas guardadas`;return}
    document.querySelector('.mode-grid')?.insertAdjacentHTML('afterend',`<div class="resume-card reveal in" id="resumeOrder"><div><b>Tienes ${totalQty()} bebidas guardadas</b><br><span>Tu pedido no se perderá aunque cierres la página.</span></div><button>Continuar</button></div>`);
    document.querySelector('#resumeOrder button').onclick=()=>showScreen('cart');
  }

  function buildPayload(folio){
    const q=totalQty(),quote=isQuote(),plan=pricePlan(q);
    return {
      folio,
      type:quote?'quote':'order',
      createdAt:nowIso(),
      name:state.name,
      phone:state.phone,
      consent:Boolean(state.consent),
      items:cartItems().map(item=>({id:item.id,name:item.name,qty:item.qty,alcohol:item.alcohol})),
      units:q,
      targetQuantity:quote?Number(state.eventTarget||q):q,
      occasion:state.occasion,
      fulfillment:state.fulfillment,
      requiredDate:state.date,
      requiredTime:state.time,
      address:state.address,
      shippingFee:Number(state.shippingFee||0),
      shippingZone:state.shippingZone,
      personalization:state.personalization,
      personalizationText:state.personalizationText,
      unitPrice:quote?null:plan.unit,
      totalEstimate:quote?null:totalEstimate(),
      notes:state.notes,
      utm,
      sessionId,
      eventTrail:eventTrail.slice(-30),
      pageUrl:location.href,
      userAgent:navigator.userAgent,
      website:''
    };
  }

  function queueRead(){return parse(localStorage.getItem(QUEUE_KEY),[])||[]}
  function queueWrite(queue){localStorage.setItem(QUEUE_KEY,JSON.stringify(queue.slice(-20)))}
  function enqueue(payload){const queue=queueRead().filter(item=>item.payload?.folio!==payload.folio);queue.push({payload,attempts:0,lastAttempt:0});queueWrite(queue)}
  function dequeue(folio){queueWrite(queueRead().filter(item=>item.payload?.folio!==folio))}

  async function submitPayload(payload,quiet=false){
    try{
      const response=await fetch('/api/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),keepalive:true});
      const data=await response.json().catch(()=>({}));
      if(response.ok&&data.ok){dequeue(payload.folio);if(!quiet)showSync('Solicitud respaldada en Notion');track('request_saved',{folio:payload.folio});return true}
      if(!quiet&&data.code==='NOTION_NOT_CONFIGURED')showSync('WhatsApp listo · respaldo pendiente',true);
      return false;
    }catch{if(!quiet)showSync('WhatsApp listo · respaldo pendiente',true);return false}
  }

  async function flushQueue(){
    if(!navigator.onLine)return;
    const queue=queueRead(),now=Date.now();let changed=false;
    for(const item of queue){
      const wait=Math.min(24*60*60*1000,Math.max(60000,2**item.attempts*60000));
      if(item.attempts>=8||now-item.lastAttempt<wait)continue;
      item.attempts+=1;item.lastAttempt=now;changed=true;
      const ok=await submitPayload(item.payload,true);if(ok){dequeue(item.payload.folio)}
    }
    if(changed){const current=queueRead();const attempted=new Map(queue.map(item=>[item.payload.folio,item]));queueWrite(current.map(item=>attempted.get(item.payload.folio)||item))}
  }

  buildMessage=function(){
    const quote=isQuote(),items=cartItems().map(item=>`• ${item.qty} × ${item.name}`).join('\n'),fulfillment=fulfillmentOptions.find(item=>item.id===state.fulfillment)?.title||'',occasion=OCCASIONS.find(item=>item.id===state.occasion)?.title||'',personal=personalOptions.find(item=>item.id===state.personalization)?.title||'',plan=pricePlan(totalQty()),estimate=totalEstimate();
    return `Hola ANTOJO. ${quote?'Quiero solicitar una cotización':'Quiero confirmar este pedido'} 👋\n\nFolio: ${state.folio}\n\nBEBIDAS\n${items}\n\nCantidad seleccionada: ${totalQty()}${quote?`\nCantidad de referencia: ${state.eventTarget||totalQty()}\nPrecio: por cotizar`:`\nPrecio por cantidad: $${plan.unit} c/u · ${plan.band}\nSubtotal estimado: ${money(totalQty()*plan.unit)}`}\nPersonalización: ${personal}${state.personalizationText?` — ${state.personalizationText}`:''}${state.fulfillment==='delivery'?`\nEnvío: ${state.shippingFee?`${money(state.shippingFee)} estimado · ${state.shippingZone}`:'por confirmar'}`:''}${!quote&&estimate?`\nTotal estimado: ${money(estimate)}`:''}\n\nDETALLES\nPlan: ${occasion}\nFecha: ${state.date}${state.time?` · ${state.time}`:''}\nEntrega: ${fulfillment}${state.address?` · ${state.address}`:''}\nNombre: ${state.name}\nWhatsApp: ${state.phone}${state.notes?`\nNotas: ${state.notes}`:''}\n\n¿Me ayudan a confirmar disponibilidad y ${quote?'enviarme la cotización final':'confirmar el total final'}?`;
  };

  function renderSuccess(last){
    const root=document.querySelector('#successScreen > div');if(!root)return;
    root.innerHTML=`<div class="success-burst"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m5 12 4 4L19 6"/></svg></div><h1>Tu solicitud<br>quedó registrada.</h1><p>Conserva el folio y termina de enviarla en WhatsApp.</p><div class="success-folio">${last.folio}</div><div class="success-actions"><button class="primary-btn" id="reopenWhatsapp">Abrir WhatsApp</button><button class="secondary-btn" id="newOrder">Hacer otro pedido</button></div>`;
    document.querySelector('#reopenWhatsapp').onclick=()=>location.assign(last.url);
    document.querySelector('#newOrder').onclick=()=>{state.cart={};state.mode='order';state.occasion='';state.eventTarget=100;state.fulfillment='';state.date='';state.time='';state.address='';state.shippingFee=0;state.personalization='normal';state.personalizationText='';state.notes='';state.adultConfirmed=false;state.consent=false;state.folio='';state.requestFingerprint='';localStorage.removeItem(LAST_KEY);eventTrail=[];localStorage.removeItem(EVENTS_KEY);updateCartUI();showScreen('home')};
  }

  sendWhatsApp=function(){
    saveFields();
    const currentFingerprint=fingerprint();
    if(!state.folio||state.requestFingerprint!==currentFingerprint){state.folio=generateFolio();state.requestFingerprint=currentFingerprint}
    track('whatsapp_clicked',{folio:state.folio,quote:isQuote(),units:totalQty()});
    const payload=buildPayload(state.folio);enqueue(payload);persist();
    const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
    const last={folio:state.folio,url,at:Date.now(),type:payload.type};localStorage.setItem(LAST_KEY,JSON.stringify(last));
    submitPayload(payload);
    renderSuccess(last);showScreen('success');
    location.assign(url);
  };

  openWhatsAppText=function(text){location.assign(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`)};

  function applyOnboardingRule(){
    const onboarding=document.querySelector('#onboarding');if(!onboarding)return;
    if(localStorage.getItem(ONBOARDING_KEY)==='1'){
      onboarding.classList.add('closed');document.querySelector('#topbar')?.classList.add('visible');document.querySelector('#bottomNav')?.classList.add('visible');
    }
    const observer=new MutationObserver(()=>{if(onboarding.classList.contains('closed'))localStorage.setItem(ONBOARDING_KEY,'1')});observer.observe(onboarding,{attributes:true,attributeFilter:['class']});
  }

  function restoreUi(){
    renderOccasions();renderFeatured();renderCategories();renderMenu();renderCart();updateCartUI(false);createLegalUi();createSyncStatus();applyOnboardingRule();renderResumeCard();updateNavLabel();
    const last=parse(localStorage.getItem(LAST_KEY),null);if(last&&Date.now()-last.at<30*60*1000)renderSuccess(last);
  }

  document.addEventListener('input',event=>{if(event.target.matches('input,textarea'))setTimeout(()=>{saveFields();persist()},0)});
  document.addEventListener('change',()=>setTimeout(persist,0));
  window.addEventListener('beforeunload',persist);
  window.addEventListener('online',flushQueue);
  window.addEventListener('pageshow',event=>{const last=parse(localStorage.getItem(LAST_KEY),null);if(last&&(event.persisted||Date.now()-last.at<10*60*1000)){renderSuccess(last);showScreen('success')}flushQueue()});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')flushQueue()});

  restoreUi();track('session_started',{version:VERSION,restored:totalQty()>0});persist();flushQueue();
})();
