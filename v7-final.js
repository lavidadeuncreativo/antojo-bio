(()=>{
  'use strict';
  const CORRECT_WHATSAPP='525522026291';
  const LAST_KEY='antojo_last_registration_v6';
  const shell=document.getElementById('appShell');
  const safeParse=(value,fallback=null)=>{try{return JSON.parse(value)}catch{return fallback}};

  function markSoftMove(){
    if(!shell)return;
    shell.classList.remove('v7-moving');
    void shell.offsetWidth;
    shell.classList.add('v7-moving');
    clearTimeout(markSoftMove.timer);
    markSoftMove.timer=setTimeout(()=>shell.classList.remove('v7-moving'),620);
  }

  document.addEventListener('click',event=>{
    if(event.target.closest('[data-nav],[data-go],[data-mode],[data-occasion],.back-round,.product-card,.mini-product,.hero-action,.cart-icon-btn'))markSoftMove();
  },true);

  function cleanOccasions(){
    const strip=document.getElementById('occasionStrip');
    if(!strip)return;
    strip.classList.add('compact-plans');
    strip.querySelector('[data-occasion="event"]')?.remove();
  }

  const occasionObserver=new MutationObserver(cleanOccasions);
  const occasionStrip=document.getElementById('occasionStrip');
  if(occasionStrip)occasionObserver.observe(occasionStrip,{childList:true,subtree:true});
  cleanOccasions();

  function genericWhatsAppUrl(message){return `https://wa.me/${CORRECT_WHATSAPP}?text=${encodeURIComponent(message||'')}`}
  function markWhatsappOpened(folio){
    try{
      const blob=new Blob([JSON.stringify({folio})],{type:'application/json'});
      if(navigator.sendBeacon)navigator.sendBeacon('/api/whatsapp-opened',blob);
      else fetch('/api/whatsapp-opened',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({folio}),keepalive:true}).catch(()=>{});
    }catch{}
  }

  function configureRegisteredSuccess(){
    const button=document.getElementById('openWhatsappBusiness');
    const status=document.querySelector('#successScreen .registered-status');
    if(!button||!status||button.dataset.v7Ready==='1')return;
    const last=safeParse(localStorage.getItem(LAST_KEY),null);
    if(!last?.folio||!last?.message)return;
    button.dataset.v7Ready='1';
    button.innerHTML='Abrir WhatsApp para enviar <small>El mensaje ya está preparado</small>';
    button.removeAttribute('disabled');
    const successCopy=document.querySelector('#successScreen p');
    if(successCopy)successCopy.innerHTML=`Tu ${last.type==='quote'?'cotización':'pedido'} ya quedó guardado en ANTOJO. Abriremos WhatsApp con el resumen listo; solo falta tocar <b>Enviar</b>.`;
    if(!document.querySelector('#successScreen .whatsapp-handoff')){
      status.insertAdjacentHTML('afterend','<div class="whatsapp-handoff"><b>Tu registro no depende de WhatsApp.</b>Ya está guardado en ANTOJO. WhatsApp se abre para acelerar la conversación y confirmar los detalles.</div>');
    }
    const time=new Intl.DateTimeFormat('es-MX',{timeZone:'America/Mexico_City',hour:'2-digit',minute:'2-digit',hour12:true}).format(new Date(last.at||Date.now()));
    const folio=document.querySelector('#successScreen .success-folio');
    if(folio&&!document.querySelector('#successScreen .registration-time'))folio.insertAdjacentHTML('afterend',`<div class="registration-time">Registrado a las ${time} · CDMX</div>`);
    const go=()=>{markWhatsappOpened(last.folio);location.href=genericWhatsAppUrl(last.message)};
    button.onclick=go;
    const autoKey=`antojo_wa_auto_${last.folio}`;
    if(!sessionStorage.getItem(autoKey)){
      sessionStorage.setItem(autoKey,'1');
      setTimeout(()=>{if(document.visibilityState==='visible'&&document.querySelector('#successScreen.active'))go()},1450);
    }
  }

  const successObserver=new MutationObserver(configureRegisteredSuccess);
  const success=document.getElementById('successScreen');
  if(success)successObserver.observe(success,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  configureRegisteredSuccess();

  /* The standard wa.me link lets the device choose WhatsApp or WhatsApp Business. */
  document.addEventListener('click',event=>{
    const rating=event.target.closest('[data-rating]');
    if(rating){
      event.preventDefault();event.stopImmediatePropagation();
      location.href=genericWhatsAppUrl(`Hola ANTOJO. Ya probé sus bebidas y mi calificación es ${rating.dataset.rating}/5 ⭐. Quiero dejarles este comentario:`);
      return;
    }
    const club=event.target.closest('#clubInterest');
    if(club){event.preventDefault();event.stopImmediatePropagation();location.href=genericWhatsAppUrl('Hola ANTOJO. Quiero enterarme cuando lancen ANTOJO. Club 👀')}
  },true);

  /* Extra onboarding persistence for in-app browsers and aggressive cache restores. */
  function persistOnboarding(){
    try{localStorage.setItem('antojo_onboarding_seen','1');localStorage.setItem('antojo_onboarding_seen_v5','1')}catch{}
    document.cookie='antojo_onboarding_seen=1; Max-Age=31536000; Path=/; SameSite=Lax';
  }
  document.getElementById('skipOnboarding')?.addEventListener('click',persistOnboarding,true);
  document.getElementById('nextSlide')?.addEventListener('click',()=>setTimeout(()=>{if(document.getElementById('onboarding')?.classList.contains('closed'))persistOnboarding()},80),true);

  /* Replace any stale Mexican WhatsApp number embedded by older cached scripts. */
  document.addEventListener('click',event=>{
    const anchor=event.target.closest('a[href*="wa.me/5215522026291"],a[href*="api.whatsapp.com"]');
    if(!anchor)return;
    try{const url=new URL(anchor.href);const text=url.searchParams.get('text')||'';anchor.href=genericWhatsAppUrl(text)}catch{}
  },true);
})();