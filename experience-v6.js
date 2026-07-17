(()=>{
  'use strict';

  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const STORE='antojo_clean_state_v4';
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)');
  const RENDERS=[
    '/renders/03_mojito_clasico_te_de_mariposa.png',
    '/renders/05_horchata_espresso.png',
    '/renders/09_maracuya.png',
    '/renders/13_mezcalita_de_jamaica.png',
    '/renders/04_horchata.png'
  ];

  let socialTimer=0;
  let socialIndex=0;
  let revealObserver=null;
  let mutationTimer=0;
  let trailIndex=0;
  let lastTrailAt=0;
  let staticReady=false;

  function readState(){
    try{return JSON.parse(localStorage.getItem(STORE)||'null')||{};}catch{return {};}
  }

  function fireNativeClick(element){
    if(!element)return;
    element.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
  }

  function icon(type){
    const icons={
      box:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m9 15 15-8 15 8-15 8-15-8Z"/><path d="m9 15 15 8 15-8v19l-15 8-15-8V15Z"/><path d="M24 23v19"/></svg>',
      citrus:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 35C15 18 25 10 40 9c-1 15-9 25-26 31l-5-5Z"/><path d="M14 34 35 13M21 39l3-17M32 31l-16-2"/></svg>',
      whatsapp:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m9 40 3-9a17 17 0 1 1 7 6l-10 3Z"/><path d="M19 18c1-2 3-1 4 1l2 4c.5 1 0 2-1 3l-2 2c3 5 6 7 11 9l2-2c1-1 2-1 3 0l4 2c2 1 2 3 1 4-2 3-5 4-8 3-10-3-18-11-21-21-1-3 0-6 3-8Z"/></svg>',
      instagram:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="7" width="34" height="34" rx="10"/><circle cx="24" cy="24" r="8"/><path d="M34 14h.01"/></svg>',
      star:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 6 5.4 11 12.1 1.8-8.8 8.5 2.1 12.1L24 33.7l-10.8 5.7 2.1-12.1-8.8-8.5L18.6 17 24 6Z"/></svg>',
      drop:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5S11 19 11 29a13 13 0 0 0 26 0C37 19 24 5 24 5Z"/><path d="M18 31c1 4 4 6 8 6"/></svg>'
    };
    return icons[type]||icons.box;
  }

  function forceLoaderSequence(){
    const loader=$('#loader');
    if(!loader)return;
    loader.classList.remove('loader-v5');
    loader.classList.add('loader-v6');
    loader.classList.remove('is-release-ready');
    document.documentElement.classList.add('antojo-loading');

    window.setTimeout(()=>{
      loader.classList.add('is-release-ready');
      document.documentElement.classList.remove('antojo-loading');
      document.documentElement.classList.add('antojo-entered');
    },reduceMotion.matches?120:2450);
  }

  function setFootCopy(){
    const foot=$('.brand-foot');
    if(foot)foot.innerHTML='<i></i>Hecho con cariño en México';
  }

  function refineFavorites(){
    const section=$('#favorites');
    if(!section)return;
    section.classList.add('favorites-v6');
    const heading=$('.section-heading',section);
    if(heading&&heading.dataset.v6Copy!=='true'){
      heading.dataset.v6Copy='true';
      heading.classList.remove('heading-row');
      heading.innerHTML='<div><p>LOS QUE MÁS SE ANTOJAN</p><h2>Favoritos que se acaban primero.</h2><span>Empieza por estos si quieres ir a la segura.</span></div><button type="button" data-route="menu">Ver todos</button>';
    }

    const carousel=$('[data-carousel="favorites"]',section);
    if(carousel&&!carousel.classList.contains('v6-carousel')){
      const clone=carousel.cloneNode(true);
      clone.classList.add('v6-carousel');
      const track=$('.carousel-track',clone);
      if(track){
        track.removeAttribute('style');
        track.setAttribute('aria-label','Sabores favoritos de ANTOJO.');
      }
      carousel.replaceWith(clone);
    }
  }

  function refinePackages(){
    const section=$('#packages');
    if(!section)return;
    section.classList.add('packages-v6');
    const heading=$('.section-heading',section);
    if(heading&&heading.dataset.v6Copy!=='true'){heading.dataset.v6Copy='true';heading.innerHTML='<p>PARA PEDIR SIN COMPLICARTE</p><h2>Paquetes para que el plan fluya.</h2><span>Elige una base y después ajusta sabores y cantidades.</span>';}
    const cards=$$('.package-card',section);
    const copy=[
      ['PARA EL ANTOJO','Para el antojo','Un mix para probar, compartir poquito o descubrir tus favoritos.'],
      ['PARA COMPARTIR','Mejor que sobre y no que falte','Más bebidas para reuniones, oficina o planes donde siempre llega alguien más.'],
      ['PARA HACERLO TUYO','Latas con tu idea','Frase, fecha o logo sencillo para eventos, regalos y marcas.']
    ];
    cards.forEach((card,index)=>{
      if(card.dataset.v6Copy==='true')return;
      const row=copy[index];
      if(!row)return;
      const small=$('small',card),title=$('h3',card),paragraph=$('p',card);
      if(small)small.textContent=row[0];
      if(title)title.textContent=row[1];
      if(paragraph)paragraph.textContent=row[2];
      card.dataset.v6Copy='true';
    });
  }

  function refinePlanBanner(){
    const plan=$('.plan-marquee');
    if(!plan)return;
    plan.classList.add('plan-v6');
    if(plan.dataset.v6Copy==='true')return;
    plan.dataset.v6Copy='true';
    const copy=$('.plan-copy',plan)||$('div',plan);
    if(copy){
      copy.classList.add('plan-copy');
      copy.innerHTML='<span>PARA LO QUE SE ARME</span><strong>Que al plan nunca le falte algo rico.</strong><p>Unas cuantas, una mesa completa o latas hechas para tu evento.</p><em aria-hidden="true"><i></i><i></i><i></i></em>';
    }
    const chips=$('.plan-chip-track',plan);
    if(chips)chips.innerHTML=['ANTOJO DE HOY','CUMPLE','SOBREMESA','OFICINA','BODA','REUNIÓN','REGALO','ANTOJO DE HOY','CUMPLE','SOBREMESA','OFICINA','BODA','REUNIÓN','REGALO'].map(x=>`<b>${x}</b>`).join('');
  }

  function refineHow(){
    const how=$('#how');
    const packages=$('#packages');
    if(!how||!packages)return;
    how.classList.add('how-v6');
    if(packages.nextElementSibling!==how)packages.insertAdjacentElement('afterend',how);
    const card=$('.how-v4-card',how);
    if(card&&card.dataset.v6Copy!=='true'){
      card.dataset.v6Copy='true';
      const small=$('small',card),title=$('h2',card),paragraph=$(':scope>p',card);
      if(small)small.textContent='SIN VUELTAS';
      if(title)title.textContent='Pedir es así de fácil';
      if(paragraph)paragraph.textContent='Elige cómo vienes, arma tu mezcla y te confirmamos por WhatsApp.';
      const steps=$$('.how-v4-step',card);
      const text=[
        ['Elige cómo pedir','Para ti, un evento o personalizadas.'],
        ['Arma tu mezcla','Combina sabores y define cantidades.'],
        ['Confirma y recibe','Te damos folio y cerramos los detalles.']
      ];
      steps.forEach((step,index)=>{
        const strong=$('strong',step),span=$(':scope>span',step);
        if(strong)strong.textContent=text[index][0];
        if(span)span.textContent=text[index][1];
      });
    }
  }

  function buildSocialSection(){
    const faq=$('#faq');
    const old=$('.social-widget-section');
    if(!faq||!old)return;
    if(old.classList.contains('social-v6')){
      if(faq.nextElementSibling!==old)faq.insertAdjacentElement('afterend',old);
      return;
    }

    old.className='home-section social-v6';
    old.id='community';
    old.innerHTML=`
      <div class="section-heading social-v6-heading">
        <p>LA PARTE MÁS VIVA DEL PROYECTO</p>
        <h2>Lo que pasa en ANTOJO.</h2>
        <span>Nuevos sabores, pedidos reales y lo que estamos preparando.</span>
      </div>
      <div class="social-v6-stage" role="region" aria-label="Novedades de ANTOJO.">
        <article class="social-v6-card is-active" data-social-v6="0">
          <div class="social-v6-copy"><span class="social-v6-icon">${icon('instagram')}</span><small>INSTAGRAM</small><h3>Detrás de cada lata.</h3><p>Pruebas, pedidos, errores, nuevos sabores y cómo va creciendo el proyecto.</p><a href="https://www.instagram.com/antojo.bebidas/" target="_blank" rel="noopener">Seguir el proyecto <b>→</b></a></div>
          <div class="social-v6-visual"><img src="/renders/03_mojito_clasico_te_de_mariposa.png" alt=""></div>
        </article>
        <article class="social-v6-card" data-social-v6="1" aria-hidden="true">
          <div class="social-v6-copy"><span class="social-v6-icon">${icon('star')}</span><small>RESEÑAS</small><h3>Lo que sí repetirían.</h3><p>Cuéntanos qué sabor pediste, cómo llegó y cuál volverías a pedir.</p><button type="button" data-rating="5">Contar mi experiencia <b>→</b></button></div>
          <div class="social-v6-visual"><img src="/renders/09_maracuya.png" alt=""></div>
        </article>
        <article class="social-v6-card" data-social-v6="2" aria-hidden="true">
          <div class="social-v6-copy"><span class="social-v6-icon">${icon('drop')}</span><small>ANTOJO. CLUB</small><h3>Lo nuevo, antes.</h3><p>Sabores, preventas y oportunidades para quienes siempre quieren probar el siguiente.</p><button type="button" id="clubButton">Quiero enterarme <b>→</b></button></div>
          <div class="social-v6-visual"><img src="/renders/13_mezcalita_de_jamaica.png" alt=""></div>
        </article>
      </div>
      <div class="social-v6-dots" aria-label="Cambiar tarjeta">
        <button class="is-active" data-social-v6-dot="0" aria-label="Ver Instagram"></button>
        <button data-social-v6-dot="1" aria-label="Ver reseñas"></button>
        <button data-social-v6-dot="2" aria-label="Ver ANTOJO. Club"></button>
      </div>`;
    faq.insertAdjacentElement('afterend',old);
    startSocialRotation();
  }

  function showSocial(index){
    const cards=$$('.social-v6-card');
    const dots=$$('[data-social-v6-dot]');
    if(!cards.length)return;
    socialIndex=(index+cards.length)%cards.length;
    cards.forEach((card,i)=>{
      const active=i===socialIndex;
      card.classList.toggle('is-active',active);
      card.classList.toggle('is-before',i===(socialIndex-1+cards.length)%cards.length);
      card.classList.toggle('is-after',i===(socialIndex+1)%cards.length);
      card.setAttribute('aria-hidden',active?'false':'true');
      if(active)card.removeAttribute('inert');else card.setAttribute('inert','');
    });
    dots.forEach((dot,i)=>dot.classList.toggle('is-active',i===socialIndex));
  }

  function startSocialRotation(){
    window.clearInterval(socialTimer);
    showSocial(0);
    if(reduceMotion.matches)return;
    socialTimer=window.setInterval(()=>showSocial(socialIndex+1),1700);
  }

  function refineFaq(){
    const faq=$('#faq');
    if(!faq)return;
    faq.classList.add('faq-v6');
    const heading=$('.section-heading',faq);
    if(heading&&heading.dataset.v6Copy!=='true'){heading.dataset.v6Copy='true';heading.innerHTML='<p>PREGUNTAS FRECUENTES</p><h2>Lo que conviene saber antes de pedir.</h2><span>Respuestas claras, sin letra chiquita ni vueltas innecesarias.</span>';}
    $$('.faq-list details',faq).forEach(detail=>{
      const summary=$('summary',detail),paragraph=$('p',detail);
      if(!summary||!paragraph)return;
      if(detail.dataset.v6Copy==='true')return;
      const question=summary.textContent.trim();
      if(question.includes('precio')){
        summary.textContent='¿Cómo se calcula el precio?';
        paragraph.textContent='Depende de la cantidad, la presentación y la logística. Mientras armas tu pedido verás un estimado; antes de producir confirmamos contigo el total, el anticipo y cualquier costo de entrega.';
      }
      if(question.includes('duran')){
        paragraph.textContent='Recomendamos consumirlas en un máximo de 72 horas. Bien refrigeradas pueden mantenerse entre 2 y 4 días, dependiendo del sabor y sus ingredientes.';
      }
      detail.dataset.v6Copy='true';
    });
  }

  function setRevealTargets(){
    if(revealObserver)revealObserver.disconnect();
    const targets=$$('.screen[data-screen="home"] .section-heading, .screen[data-screen="home"] .need-card, .screen[data-screen="home"] .package-card, .screen[data-screen="home"] .how-v4-step, .screen[data-screen="home"] .plan-v6, .screen[data-screen="home"] .faq-list details, .screen[data-screen="home"] .social-v6-stage, .screen[data-screen="menu"] .product-card, .cart-page>*, .checkout-page>*');
    targets.forEach((target,index)=>{
      target.classList.add('v6-reveal');
      target.style.setProperty('--v6-delay',`${(index%4)*58}ms`);
    });
    if(reduceMotion.matches){targets.forEach(x=>x.classList.add('is-v6-visible'));return;}
    revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting)entry.target.classList.add('is-v6-visible');
    }),{threshold:.07,rootMargin:'0px 0px -5% 0px'});
    targets.forEach(target=>revealObserver.observe(target));
  }

  function enhanceProductSheet(){
    const root=$('#productSheetContent');
    if(!root||!$('.sheet-inner',root)||root.dataset.v6Enhanced==='true')return;
    root.dataset.v6Enhanced='true';
    const quick=$('.quick-qty',root);
    if(quick){
      const current=Number($('#sheetQty',root)?.textContent)||1;
      const values=[10,25,50,75,100,150];
      quick.innerHTML=values.map(value=>`<button type="button" class="${current===value?'active':''}" data-sheet-qty="${value}">${value}</button>`).join('');
      quick.insertAdjacentHTML('afterend',`<div class="exact-qty-v6"><label for="exactSheetQty">Otra cantidad</label><div><input id="exactSheetQty" type="number" min="1" max="2000" value="${current}" inputmode="numeric"><button type="button" data-apply-exact-qty>Usar cantidad</button></div></div>`);
    }
  }

  function enhanceFlow(){
    const modal=$('#flowModalContent');
    if(!modal)return;
    const eventPreset=$('.quantity-preset-grid [data-event-qty]',modal)?.parentElement;
    if(eventPreset&&eventPreset.dataset.v6Preset!=='true'){
      const state=readState(),selected=Number(state.event?.quantity)||0;
      eventPreset.dataset.v6Preset='true';
      eventPreset.innerHTML=[10,25,50,75,100,150].map(value=>`<button type="button" class="${selected===value?'active':''}" data-event-qty="${value}"><b>${value}</b><small>bebidas</small></button>`).join('');
    }
    const customPreset=$('.quantity-preset-grid [data-custom-qty]',modal)?.parentElement;
    if(customPreset&&customPreset.dataset.v6Preset!=='true'){
      const state=readState(),selected=Number(state.custom?.quantity)||50;
      customPreset.dataset.v6Preset='true';
      customPreset.innerHTML=[50,75,100,150,250,500].map(value=>`<button type="button" class="${selected===value?'active':''}" data-custom-qty="${value}"><b>${value}</b><small>latas</small></button>`).join('');
    }
  }

  function checkoutJourney(){
    const state=readState();
    return state.journey||'order';
  }

  function removeBalanceRows(root=document){
    $$('.summary-row',root).forEach(row=>{
      const label=$('span',row)?.textContent.trim().toLowerCase()||'';
      if(label.includes('saldo restante')||label==='balance')row.remove();
    });
  }

  function buildCheckoutSteps(form,journey){
    if($('.checkout-steps-v6',form))return;
    const title=$('.page-title-row',form);
    if(!title)return;
    title.insertAdjacentHTML('beforebegin',`<div class="checkout-steps-v6" aria-label="Progreso del pedido"><div class="is-done"><i>1</i><span>Resumen</span></div><b></b><div class="is-active"><i>2</i><span>Datos y entrega</span></div><b></b><div><i>3</i><span>Confirmación</span></div></div>`);
    const eyebrow=$('.eyebrow',title),h1=$('h1',title),intro=$('.checkout-intro',form);
    if(eyebrow)eyebrow.textContent='PASO 2 DE 3';
    if(h1)h1.textContent=journey==='event'?'Confirma los datos de tu evento.':journey==='custom'?'Termina tu solicitud personalizada.':'¿Dónde te entregamos tu antojo?';
    if(intro)intro.textContent=journey==='event'?'Ya tenemos el tipo de evento, cantidad y sabores. Solo faltan tus datos y la forma de entrega.':journey==='custom'?'Ya tenemos la cantidad, bebida base e idea. Revisa la personalización y cuéntanos cómo entregarla.':'Revisa tus datos, elige entrega o recolección y registra la solicitud.';
  }

  function replaceStandardPresentation(form){
    const customButton=$('[data-journey="custom"]',form);
    if(!customButton)return;
    const field=customButton.closest('.field');
    if(!field)return;
    field.innerHTML='<span>Presentación</span><div class="checkout-presentation-v6"><b>Lata ANTOJO.</b><p>Presentación estándar. Para una frase o logo, inicia desde “Personalizadas” antes de elegir sabores.</p></div>';
  }

  function makeBlankCanPreview(form){
    const preview=$('.personal-preview',form);
    if(!preview||preview.dataset.v6Blank==='true')return;
    preview.dataset.v6Blank='true';
    const state=readState();
    const stage=$('.can-stage',preview);
    if(!stage)return;
    const oldImage=$('img',stage),oldCopy=$('.vertical-copy',stage);
    if(oldImage)oldImage.remove();
    if(oldCopy)oldCopy.remove();
    stage.innerHTML=`<div class="blank-can-v6"><span class="blank-can-rim top"></span><div class="blank-can-art"><span data-v6-custom-copy>${escapeHtml(state.custom?.text||'TU FRASE')}</span><img data-v6-custom-logo alt="Logo cargado" ${state.custom?.logoData?`src="${state.custom.logoData}"`:'hidden'}></div><span class="blank-can-rim bottom"></span></div>`;
    const title=$('h3',preview),copy=$('p',preview);
    if(title)title.textContent='Tu lata, sin el logo de ANTOJO.';
    if(copy)copy.textContent='Escribe una frase corta de hasta tres renglones o carga un logo. Antes de producir revisamos contigo tamaño, posición y legibilidad.';

    const input=$('[name="customText"]',form);
    if(input&&input.tagName!=='TEXTAREA'){
      const textarea=document.createElement('textarea');
      [...input.attributes].forEach(attr=>textarea.setAttribute(attr.name,attr.value));
      textarea.value=input.value;
      textarea.maxLength=90;
      textarea.rows=3;
      textarea.placeholder='Ej. Ana + Luis · 21.11.26';
      input.replaceWith(textarea);
    }else if(input){
      input.maxLength=90;
      input.rows=3;
    }
  }

  function enhanceCheckout(){
    const form=$('#checkoutForm');
    if(!form)return;
    const journey=checkoutJourney();
    form.classList.add('checkout-v6',`checkout-v6-${journey}`);
    buildCheckoutSteps(form,journey);
    removeBalanceRows(form);
    if(journey==='order'||journey==='')replaceStandardPresentation(form);
    if(journey==='custom'||(journey==='event'&&readState().event?.personalized))makeBlankCanPreview(form);
    setRevealTargets();
  }

  function escapeHtml(value=''){
    return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  }

  function updateBlankCanCopy(value){
    const copy=$('[data-v6-custom-copy]');
    if(copy)copy.textContent=(value||'TU FRASE').trim().slice(0,90);
  }

  function setupCanTrail(){
    if(!finePointer.matches||reduceMotion.matches||document.documentElement.dataset.v6Trail==='true')return;
    document.documentElement.dataset.v6Trail='true';
    document.addEventListener('pointermove',event=>{
      const now=performance.now();
      if(now-lastTrailAt<78)return;
      lastTrailAt=now;
      const img=document.createElement('img');
      img.className='can-cursor-v6';
      img.src=RENDERS[trailIndex++%RENDERS.length];
      img.alt='';
      img.style.left=`${event.clientX}px`;
      img.style.top=`${event.clientY}px`;
      img.style.setProperty('--trail-rotate',`${(trailIndex%2?1:-1)*(4+trailIndex%7)}deg`);
      document.body.appendChild(img);
      requestAnimationFrame(()=>img.classList.add('is-live'));
      window.setTimeout(()=>img.remove(),900);
    },{passive:true});
  }

  function reorderHome(){
    const home=$('.screen[data-screen="home"]');
    const hero=$('.hero-card-v4',home),needs=$('#needs'),favorites=$('#favorites'),packages=$('#packages'),how=$('#how'),plan=$('.plan-marquee'),faq=$('#faq'),social=$('.social-v6');
    if(!home||!hero||home.dataset.v6Ordered==='true')return;
    home.dataset.v6Ordered='true';
    [needs,favorites,packages,how,plan,faq,social].filter(Boolean).forEach(section=>home.appendChild(section));
  }

  function finalizeStatic(){
    document.documentElement.classList.add('experience-v6');
    setFootCopy();
    refineFavorites();
    refinePackages();
    refinePlanBanner();
    refineHow();
    refineFaq();
    buildSocialSection();
    reorderHome();
    enhanceProductSheet();
    enhanceFlow();
    enhanceCheckout();
    removeBalanceRows();
    setRevealTargets();
    setupCanTrail();
  }

  function watchChanges(){
    const observer=new MutationObserver(()=>{
      if(!staticReady)return;
      window.clearTimeout(mutationTimer);
      mutationTimer=window.setTimeout(finalizeStatic,55);
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }

  function bind(){
    document.addEventListener('click',event=>{
      const dot=event.target.closest('[data-social-v6-dot]');
      if(dot){
        showSocial(Number(dot.dataset.socialV6Dot)||0);
        window.clearInterval(socialTimer);
        window.setTimeout(startSocialRotation,2800);
        return;
      }
      const exact=event.target.closest('[data-apply-exact-qty]');
      if(exact){
        const input=$('#exactSheetQty');
        const value=Math.min(2000,Math.max(1,Math.round(Number(input?.value)||1)));
        const proxy=document.createElement('button');
        proxy.type='button';
        proxy.hidden=true;
        proxy.dataset.sheetQty=String(value);
        document.body.appendChild(proxy);
        fireNativeClick(proxy);
        proxy.remove();
        if(input)input.value=String(value);
        $$('.quick-qty [data-sheet-qty]').forEach(button=>button.classList.toggle('active',Number(button.dataset.sheetQty)===value));
      }
    });

    document.addEventListener('click',event=>{
      const customCheckout=event.target.closest('#checkoutForm [data-journey="custom"]');
      if(customCheckout){
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },true);

    document.addEventListener('input',event=>{
      if(event.target.matches('#checkoutForm [name="customText"]'))updateBlankCanCopy(event.target.value);
    });

    document.addEventListener('change',event=>{
      if(event.target.matches('#checkoutForm [name="logo"]')){
        const file=event.target.files?.[0];
        if(!file)return;
        const reader=new FileReader();
        reader.onload=()=>{
          const image=$('[data-v6-custom-logo]');
          if(image){image.src=String(reader.result);image.hidden=false;}
        };
        reader.readAsDataURL(file);
      }
    });
  }

  function start(){
    forceLoaderSequence();
    bind();
    watchChanges();
    setupCanTrail();
    window.setTimeout(()=>{staticReady=true;finalizeStatic();},780);
    window.setTimeout(finalizeStatic,1320);
    window.setTimeout(finalizeStatic,2200);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
