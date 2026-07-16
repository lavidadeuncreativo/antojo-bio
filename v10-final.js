(()=>{
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const WA='525522026291';
  const LAST='antojo_last_registration_v6';
  const custom={step:0,type:'logo',use:'Evento',qty:50,idea:''};
  const safeParse=(value,fallback=null)=>{try{return JSON.parse(value)}catch{return fallback}};

  function prepareHome(){
    $('.hero-cans')?.classList.add('v10-floating');
    bindQuickNav();bindCustomTriggers();bindTrust();setupParallax();ownCarousels();
  }

  function bindQuickNav(){
    $$('[data-v10-jump]').forEach(button=>button.onclick=()=>$(button.dataset.v10Jump)?.scrollIntoView({behavior:'smooth',block:'start'}));
  }
  function bindCustomTriggers(){$$('[data-v10-custom]').forEach(button=>button.onclick=openCustom)}
  function bindTrust(){
    $$('[data-v10-rating]').forEach(button=>button.onclick=()=>location.href=waUrl(`Hola ANTOJO. Ya probé sus bebidas y mi calificación es ${button.dataset.v10Rating}/5 ⭐. Quiero contarles cómo me fue:`));
    $('[data-v10-club]')?.addEventListener('click',()=>location.href=waUrl('Hola ANTOJO. Quiero enterarme cuando lancen ANTOJO. Club 👀'));
  }

  function setupParallax(){
    if(matchMedia('(max-width:900px)').matches)return;
    const hero=$('.home-hero'),heroItems=$$('.hero-cans img');
    hero?.addEventListener('mousemove',event=>moveRelative(event,hero,heroItems,[7,11,15]));
    hero?.addEventListener('mouseleave',()=>resetTransforms(heroItems));
    const panel=$('.brand-panel'),floaters=$$('.float-can',panel);
    panel?.addEventListener('mousemove',event=>moveRelative(event,panel,floaters,[12,18]));
    panel?.addEventListener('mouseleave',()=>resetTransforms(floaters));
  }
  function moveRelative(event,root,nodes,factors){const box=root.getBoundingClientRect(),x=(event.clientX-box.left)/box.width-.5,y=(event.clientY-box.top)/box.height-.5;nodes.forEach((node,index)=>node.style.transform=`translate3d(${x*factors[index]}px,${-y*factors[index]}px,0)`)}
  function resetTransforms(nodes){nodes.forEach(node=>node.style.transform='')}

  function ownCarousels(){
    ['#featuredStrip','#eventStrip','#zeroStrip'].forEach(selector=>{
      const strip=$(selector);if(!strip||strip.dataset.v10Loop==='1')return;
      strip.dataset.v10Loop='1';let position=strip.scrollLeft,last=performance.now(),manualUntil=0;
      const interact=()=>{manualUntil=performance.now()+2600;position=strip.scrollLeft};
      strip.addEventListener('pointerdown',interact,{passive:true});strip.addEventListener('touchstart',interact,{passive:true});strip.addEventListener('wheel',interact,{passive:true});
      const tick=now=>{const dt=Math.min(40,now-last);last=now;const clone=strip.querySelector('[data-v8-clone="1"]');if(now>manualUntil){position+=dt*.012;const reset=clone?.offsetLeft||strip.scrollWidth/2;if(reset&&position>=reset)position-=reset;strip.scrollLeft=position}else position=strip.scrollLeft;if(strip.isConnected)requestAnimationFrame(tick)};
      requestAnimationFrame(tick);
    });
  }
  const inheritedRenderFeatured=window.renderFeatured;
  if(typeof inheritedRenderFeatured==='function')window.renderFeatured=function(){const result=inheritedRenderFeatured.apply(this,arguments);setTimeout(ownCarousels,120);return result};

  window.renderSheet=function(){
    const product=byId(state.sheetProduct);if(!product)return;
    const projected=totalQty()+Number(state.sheetQty||1),plan=pricePlan(projected),quote=isQuote()||projected>50,line=plan.unit?plan.unit*state.sheetQty:null;
    $('#sheetContent').innerHTML=`<div class="sheet-media" style="background:${theme(product.id)}"><button class="sheet-close" id="sheetClose" type="button" aria-label="Cerrar">×</button><span class="sheet-tag">${product.categoryLabel}</span><img src="${product.image}" alt="${product.name}"></div><div class="sheet-body"><h2>${product.name}</h2><p>${product.description} ${product.friendly}</p><div class="sheet-price"><div><small>${quote?'Precio por confirmar':'Precio según el total del pedido'}<br>${quote?'Revisamos cantidad, personalización y logística.':'Se actualiza automáticamente al sumar bebidas.'}</small></div><strong>${quote?'Cotizar':`$${plan.unit} c/u`}</strong></div>${quote?'<div class="quick-qty"><button data-v10-qty="10">10</button><button data-v10-qty="25">25</button><button data-v10-qty="50">50</button><button data-v10-qty="100">100</button></div>':''}<div class="sheet-controls"><b>¿Cuántas agregamos?</b><div class="large-stepper"><button id="sheetMinus" type="button">−</button><span>${state.sheetQty}</span><button id="sheetPlus" type="button">+</button></div></div><button class="sheet-add" id="sheetAdd" type="button"><span>Agregar al pedido</span><span>${line?money(line):'Cotizar'}</span></button></div>`;
    $('#sheetClose').onclick=closeSheet;$('#sheetMinus').onclick=()=>{state.sheetQty=Math.max(1,state.sheetQty-1);renderSheet()};$('#sheetPlus').onclick=()=>{state.sheetQty=Math.min(1000,state.sheetQty+1);renderSheet()};
    $$('[data-v10-qty]').forEach(button=>button.onclick=()=>{state.sheetQty=Number(button.dataset.v10Qty);renderSheet()});
    $('#sheetAdd').onclick=()=>{state.cart[product.id]=(state.cart[product.id]||0)+state.sheetQty;updateCartUI(true);closeSheet();setTimeout(()=>showScreen('cart'),90);showToast(`${state.sheetQty} bebidas agregadas.`)};
  };
  $('#sheetBackdrop')?.addEventListener('click',event=>{event.preventDefault();closeSheet()});document.addEventListener('keydown',event=>{if(event.key==='Escape')closeSheet?.()});

  function ensureCustom(){
    if($('#v10Custom'))return;
    $('#appShell')?.insertAdjacentHTML('beforeend','<div class="v10-custom-backdrop" id="v10Custom"><section class="v10-custom-panel" role="dialog" aria-modal="true"><header class="v10-custom-head"><div><span>BEBIDAS PERSONALIZADAS</span><h2>Cuéntanos tu idea.</h2></div><button id="v10CustomClose" type="button" aria-label="Cerrar">×</button></header><div class="v10-custom-progress"><i></i><i></i><i></i></div><div class="v10-custom-body" id="v10CustomBody"></div><footer class="v10-custom-actions"><button class="secondary-btn" id="v10CustomBack" type="button">Atrás</button><button class="primary-btn" id="v10CustomNext" type="button">Continuar</button></footer></section></div>');
    $('#v10CustomClose').onclick=closeCustom;$('#v10Custom').onclick=event=>{if(event.target.id==='v10Custom')closeCustom()};
  }
  function openCustom(){custom.step=0;custom.qty=Number(state.eventTarget||50);custom.idea=state.personalizationText||'';ensureCustom();renderCustom();$('#v10Custom').classList.add('open');$('#bottomNav')?.classList.remove('visible')}
  function closeCustom(){$('#v10Custom')?.classList.remove('open');if(['home','menu','cart'].includes(state.screen))$('#bottomNav')?.classList.add('visible')}
  function renderCustom(){
    const body=$('#v10CustomBody');if(!body)return;
    $$('.v10-custom-progress i').forEach((item,index)=>item.classList.toggle('active',index<=custom.step));$('#v10CustomBack').style.visibility=custom.step===0?'hidden':'visible';$('#v10CustomNext').textContent=custom.step===2?'Elegir bebidas':'Continuar';
    if(custom.step===0){body.innerHTML='<div class="v8-step-kicker">Paso 1 de 3</div><h3>¿Qué quieres personalizar?</h3><p class="v10-custom-help">Puede ser una frase, un nombre, un logo o una identidad más completa.</p><div class="v10-choice-grid"><button class="v10-choice '+(custom.type==='phrase'?'selected':'')+'" data-v10-type="phrase"><b>Frase o nombre</b><small>Para bodas, regalos o detalles.</small></button><button class="v10-choice '+(custom.type==='logo'?'selected':'')+'" data-v10-type="logo"><b>Logo</b><small>Para una marca, empresa o evento.</small></button><button class="v10-choice '+(custom.type==='identity'?'selected':'')+'" data-v10-type="identity"><b>Identidad visual</b><small>Cuando necesitas algo más producido.</small></button></div>';$$('[data-v10-type]',body).forEach(button=>button.onclick=()=>{custom.type=button.dataset.v10Type;renderCustom()})}
    if(custom.step===1){body.innerHTML='<div class="v8-step-kicker">Paso 2 de 3</div><h3>¿Para qué y cuántas?</h3><p class="v10-custom-help">No necesitas tener todo definido; solo danos una referencia útil.</p><div class="v10-choice-grid"><button class="v10-choice '+(custom.use==='Evento'?'selected':'')+'" data-v10-use="Evento"><b>Evento</b><small>Boda, cumpleaños o reunión.</small></button><button class="v10-choice '+(custom.use==='Marca'?'selected':'')+'" data-v10-use="Marca"><b>Marca o empresa</b><small>Regalo, activación o experiencia.</small></button><button class="v10-choice '+(custom.use==='Regalo'?'selected':'')+'" data-v10-use="Regalo"><b>Regalo</b><small>Un detalle personalizado.</small></button><button class="v10-choice '+(custom.use==='Otro'?'selected':'')+'" data-v10-use="Otro"><b>Otro</b><small>Lo aterrizamos contigo.</small></button></div><div class="v10-preset">'+[10,25,50,100].map(q=>`<button class="${custom.qty===q?'selected':''}" data-v10-preset="${q}">${q}</button>`).join('')+'</div><label class="v10-field"><span>Otra cantidad</span><input id="v10CustomQty" type="number" min="1" value="'+custom.qty+'"></label>';$$('[data-v10-use]',body).forEach(button=>button.onclick=()=>{custom.use=button.dataset.v10Use;renderCustom()});$$('[data-v10-preset]',body).forEach(button=>button.onclick=()=>{custom.qty=Number(button.dataset.v10Preset);renderCustom()});$('#v10CustomQty').oninput=event=>custom.qty=Math.max(1,Number(event.target.value||1))}
    if(custom.step===2){body.innerHTML='<div class="v8-step-kicker">Paso 3 de 3</div><h3>Bájalo a tierra tantito.</h3><p class="v10-custom-help">La frase se trabaja en vertical sobre la lata. El arte final siempre se revisa antes de producir.</p><label class="v10-field"><span>Frase, idea o indicaciones</span><textarea id="v10CustomIdea" placeholder="Ej. nombres, fecha, colores, frase o concepto">'+escapeHtml(custom.idea)+'</textarea></label><label class="v10-field"><span>Fecha aproximada (opcional)</span><input id="v10CustomDate" type="date" value="'+(state.date||'')+'"></label>';$('#v10CustomIdea').oninput=event=>custom.idea=event.target.value;$('#v10CustomDate').onchange=event=>state.date=event.target.value}
    $('#v10CustomBack').onclick=()=>{custom.step=Math.max(0,custom.step-1);renderCustom()};$('#v10CustomNext').onclick=()=>{if(custom.step<2){custom.step++;renderCustom();return}finishCustom()};
  }
  function finishCustom(){state.mode='quote';state.occasion='event';state.eventType='Bebidas personalizadas';state.eventPackage='Personalizado';state.eventTarget=Math.max(1,Number(custom.qty||1));state.eventGuests=state.eventTarget;state.fulfillment='';state.personalization=custom.type==='phrase'?'phrase':'logo';state.personalizationText=custom.idea;state.notes=[state.notes,`Uso: ${custom.use}`,custom.idea].filter(Boolean).join(' · ');closeCustom();updateCartUI(false);showScreen('menu');setTimeout(()=>{renderEventPlanner();showToast('Listo. Ahora elige tus bebidas.')},190)}
  const previousPlanner=window.renderEventPlanner;
  window.renderEventPlanner=function(){previousPlanner?.();if(state.eventType!=='Bebidas personalizadas')return;const root=$('#eventPlanner');if(!root)return;root.innerHTML=`<section class="v8-menu-context event"><div><span>PERSONALIZADAS · ${escapeHtml(custom.use||'TU IDEA')}</span><b>${Number(state.eventTarget||0)} bebidas de referencia</b><small>${escapeHtml(state.personalizationText||'Elige sabores y completa tu idea en el checkout.')}</small></div><button id="v10EditCustom">Editar idea</button><div class="v8-context-progress"><i style="width:${Math.min(100,totalQty()/Math.max(1,state.eventTarget)*100)}%"></i></div><em>${totalQty()} seleccionadas</em></section>`;$('#v10EditCustom').onclick=openCustom};

  function waUrl(message){return `https://wa.me/${WA}?text=${encodeURIComponent(message||'')}`}
  function clearCompletedOrder(){const keep={name:state.name||'',phone:state.phone||''};Object.assign(state,{cart:{},mode:'order',occasion:'',eventTarget:100,fulfillment:'',date:'',time:'',address:'',shippingFee:0,shippingZone:'',shippingEta:'',shippingStatus:'',personalization:'normal',personalizationText:'',notes:'',adultConfirmed:false,consent:false,folio:'',requestFingerprint:'',eventType:'',eventGuests:100,eventVenue:'',eventVenueName:'',eventPlaceId:'',eventLat:'',eventLng:'',eventDateUnknown:false,eventTimeUnknown:false,eventVenueUnknown:false,eventPackage:'Solo bebidas',logoData:'',logoName:'',logoMime:'',registrationStatus:'',notionUrl:'',...keep});localStorage.removeItem('antojo_state_v6');localStorage.removeItem('antojo_pending_registration_v6');localStorage.removeItem('antojo_journey_v8');localStorage.removeItem('antojo_v9_custom');updateCartUI(false)}
  function enhanceSuccess(){const folio=$('#successScreen .success-folio');if(!folio||folio.dataset.v10Ready==='1')return;const last=safeParse(localStorage.getItem(LAST),null);if(!last?.folio)return;folio.dataset.v10Ready='1';clearCompletedOrder();const root=$('#successScreen > div');if(!root)return;const quote=last.type==='quote';root.innerHTML=`<div class="success-burst"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m5 12 4 4L19 6"/></svg></div><h1>Tu ${quote?'cotización':'pedido'}<br>quedó registrado.</h1><p>Ya recibimos la información. El equipo de ANTOJO. te contactará para confirmar ${quote?'precio, disponibilidad y logística':'disponibilidad, entrega y total'}.</p><div class="success-folio">${escapeHtml(last.folio)}</div><div class="v10-success-note"><b>Tu pedido anterior ya se limpió.</b><br>WhatsApp es opcional; el registro ya está guardado y no depende de que envíes un mensaje.</div><div class="v10-success-actions"><button class="whatsapp" id="v10SuccessWhatsApp">Continuar por WhatsApp</button><a class="instagram" href="https://www.instagram.com/antojo.bebidas/" target="_blank" rel="noopener">Seguir nuestra historia en Instagram</a><button class="home" id="v10SuccessHome">Volver al inicio</button></div>`;$('#v10SuccessWhatsApp').onclick=()=>location.href=waUrl(last.message);$('#v10SuccessHome').onclick=()=>showScreen('home')}
  const success=$('#successScreen');if(success)new MutationObserver(enhanceSuccess).observe(success,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});enhanceSuccess();prepareHome();
})();