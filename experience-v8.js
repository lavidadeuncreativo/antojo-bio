(()=>{
  'use strict';

  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const STORE='antojo_clean_state_v4';
  const CAN_IMAGES=[
    '/renders/03_mojito_clasico_te_de_mariposa.png',
    '/renders/05_horchata_espresso.png',
    '/renders/09_maracuya.png',
    '/renders/13_mezcalita_de_jamaica.png',
    '/renders/04_horchata.png'
  ];

  let revealObserver=null;
  let socialTimer=0;
  let socialIndex=0;
  let trailIndex=0;
  let trailLast=0;

  function state(){
    try{return JSON.parse(localStorage.getItem(STORE)||'null')||{};}catch{return {};}
  }

  function totalUnits(){
    return Object.values(state().cart||{}).reduce((sum,value)=>sum+(Number(value)||0),0);
  }

  function escapeHTML(value=''){
    return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  }

  function bootLoader(){
    const loader=$('#loader');
    if(!loader)return;
    loader.className='loader loader-v8';
    loader.innerHTML=`<div class="loader-v8-inner"><small>HECHO CON CARIÑO EN MÉXICO</small><div class="loader-v8-word" aria-label="ANTOJO.">${[...'ANTOJO.'].map((letter,index)=>`<span style="--i:${index}">${letter}</span>`).join('')}</div><p>Algo rico está por aparecer.</p><i><b></b></i></div>`;
    document.documentElement.classList.add('experience-v8','v8-loading');
    const finish=()=>{
      loader.classList.add('v8-complete','hide');
      document.documentElement.classList.remove('v8-loading');
      document.documentElement.classList.add('v8-entered');
      registerReveal(document);
    };
    window.setTimeout(finish,2250);
    window.setTimeout(finish,3400);
  }

  function buildHero(){
    const hero=$('.screen[data-screen="home"] .hero-card');
    if(!hero||hero.dataset.v8==='true')return;
    hero.dataset.v8='true';
    hero.className='hero-card hero-card-v8';
    hero.innerHTML=`
      <div class="hero-v8-copy">
        <p class="hero-v8-kicker"><i></i>BEBIDAS FRÍAS EN LATA</p>
        <h1><span>¿Qué se te</span><span>antoja hoy?</span></h1>
        <p>Listas para compartir: cítricas, cremosas, con café o con mezcal.</p>
      </div>
      <div class="hero-v8-cans" aria-hidden="true">
        <img src="/renders/03_mojito_clasico_te_de_mariposa.png" alt="">
        <img src="/renders/09_maracuya.png" alt="">
        <img src="/renders/05_horchata_espresso.png" alt="">
      </div>
      <div class="hero-v8-actions">
        <button type="button" class="hero-v8-primary" data-route="menu">Ver sabores <b>→</b></button>
        <button type="button" class="hero-v8-secondary" data-journey="event">Cotizar evento</button>
      </div>`;
  }

  function buildNeeds(){
    const section=$('#needs');
    if(!section)return;
    section.className='home-section needs-v8';
    const heading=$('.section-heading',section);
    if(heading)heading.innerHTML='<p>ELIGE CÓMO EMPEZAR</p><h2>¿Qué necesitas?</h2><span>Elige lo que estás armando y te llevamos al camino correcto.</span>';
    const copy=[
      ['Pedido pequeño','Quiero unas bebidas','Para compartir, probar sabores o resolver un antojo de hoy.'],
      ['Evento','Estoy armando algo más grande','Cumple, reunión, oficina o cualquier plan con más personas.'],
      ['Personalizadas','Quiero latas con frase o logo','Para bodas, regalos, marcas o una ocasión especial.']
    ];
    $$('.need-card',section).forEach((card,index)=>{
      const row=copy[index];
      if(!row)return;
      const small=$('small',card),strong=$('strong',card),paragraph=$('p',card);
      if(small)small.textContent=row[0];
      if(strong)strong.textContent=row[1];
      if(paragraph)paragraph.textContent=row[2];
      card.classList.add(`need-v8-${index+1}`);
    });
  }

  function buildFavorites(){
    const section=$('#favorites');
    if(!section)return;
    section.className='home-section favorites-v8';
    const heading=$('.section-heading',section);
    if(heading)heading.innerHTML='<div><p>LOS QUE MÁS SE ANTOJAN</p><h2>Los favoritos.</h2><span>Los sabores que más se repiten cuando alguien no sabe por cuál empezar.</span></div><button type="button" data-route="menu">Ver todos</button>';
    if($('.favorites-marquee-v8',section))return;
    const original=$('[data-carousel="favorites"]',section);
    const cards=original?$$('.mini-product',original):[];
    if(!cards.length)return;
    const unique=cards.slice(0,Math.max(1,Math.floor(cards.length/2)));
    const groupHTML=unique.map(card=>card.outerHTML).join('');
    const marquee=document.createElement('div');
    marquee.className='favorites-marquee-v8';
    marquee.innerHTML=`<div class="favorites-track-v8"><div class="favorites-group-v8">${groupHTML}</div><div class="favorites-group-v8" aria-hidden="true">${groupHTML}</div></div>`;
    original.replaceWith(marquee);
  }

  function buildPackages(){
    const section=$('#packages');
    if(!section)return;
    section.className='home-section package-section packages-v8';
    const heading=$('.section-heading',section);
    if(heading)heading.innerHTML='<p>PARA PEDIR SIN COMPLICARTE</p><h2>Tres formas de resolver el plan.</h2><span>Cada tarjeta tiene una función distinta y ninguna abre un flujo por accidente.</span>';
    const data=[
      ['PARA EL ANTOJO','Para el antojo','Un mix para probar, compartir poquito o descubrir tus favoritos.','Armar mix','menu'],
      ['PARA COMPARTIR','Mejor que sobre y no que falte','Para reuniones, oficina o planes donde siempre aparece alguien más.','Ver opción de evento','event'],
      ['PARA HACERLO TUYO','Latas con tu idea','Frase, fecha o logo sencillo para convertir la bebida en parte del momento.','Ver personalizadas','custom']
    ];
    $$('.package-card',section).forEach((card,index)=>{
      const row=data[index];
      if(!row)return;
      card.className=`package-card package-v8-${index+1}`;
      const small=$('small',card),title=$('h3',card),paragraph=$('p',card),button=$('button',card);
      if(small)small.textContent=row[0];
      if(title)title.textContent=row[1];
      if(paragraph)paragraph.textContent=row[2];
      if(button){
        button.textContent=row[3];
        button.removeAttribute('data-journey');
        button.removeAttribute('data-route');
        button.removeAttribute('data-v7-focus');
        button.removeAttribute('data-v8-focus');
        if(row[4]==='menu')button.dataset.route='menu';
        else button.dataset.v8Focus=row[4];
      }
    });
  }

  function buildHow(){
    const section=$('#how');
    const packages=$('#packages');
    if(!section||!packages)return;
    section.className='home-section how-v8';
    section.innerHTML=`<div class="how-v8-card"><div><p>SIN VUELTAS</p><h2>Pedir es así de fácil.</h2><span>Solo te pedimos información cuando realmente hace falta.</span></div><section><article><i>01</i><b>Elige cómo pedir</b><span>Pedido, evento o personalizadas.</span></article><article><i>02</i><b>Arma tu mezcla</b><span>Sabores y cantidades a tu manera.</span></article><article><i>03</i><b>Confirma por WhatsApp</b><span>Recibes folio y cerramos detalles.</span></article></section></div>`;
    if(packages.nextElementSibling!==section)packages.insertAdjacentElement('afterend',section);
  }

  function buildPlan(){
    const plan=$('.plan-marquee');
    if(!plan)return;
    plan.className='plan-marquee plan-v8';
    const chips=['ANTOJO DE HOY','CUMPLE','SOBREMESA','OFICINA','BODA','REUNIÓN','REGALO'];
    plan.innerHTML=`<div class="plan-v8-copy"><small>PARA LO QUE SE ARME</small><strong>Que al plan nunca le falte algo rico.</strong><p>Unas cuantas, una mesa completa o latas hechas para tu evento.</p></div><div class="plan-v8-window"><div class="plan-v8-track">${[...chips,...chips].map(item=>`<b>${item}</b>`).join('')}</div></div>`;
  }

  function buildFAQ(){
    const faq=$('#faq');
    if(!faq)return;
    faq.className='home-section faq-v8';
    const heading=$('.section-heading',faq);
    if(heading)heading.innerHTML='<p>PREGUNTAS FRECUENTES</p><h2>Antes de pedir.</h2><span>Lo importante, explicado sin publicar toda la estructura comercial.</span>';
    $$('.faq-list details',faq).forEach(detail=>{
      const summary=$('summary',detail),paragraph=$('p',detail);
      if(!summary||!paragraph)return;
      const question=summary.textContent.trim().toLowerCase();
      if(question.includes('precio')){
        summary.textContent='¿Cómo se calcula el precio?';
        paragraph.textContent='Depende de la cantidad, la presentación y la logística. Al armar el pedido verás un estimado y antes de producir confirmamos contigo el total y el anticipo.';
      }
      if(question.includes('duran'))paragraph.textContent='Recomendamos consumirlas en un máximo de 72 horas. Bien refrigeradas pueden mantenerse entre 2 y 4 días, según el sabor y sus ingredientes.';
    });
  }

  function buildSocial(){
    const faq=$('#faq');
    if(!faq)return;
    $('.instagram-card')?.remove();
    $$('.home-section').filter(section=>section!==faq&&$('.community-grid',section)).forEach(section=>section.remove());
    let social=$('#community');
    if(!social){social=document.createElement('section');social.id='community';}
    social.className='home-section social-v8';
    social.innerHTML=`
      <div class="section-heading"><p>LA PARTE MÁS VIVA DEL PROYECTO</p><h2>Lo que pasa en ANTOJO.</h2><span>Tres espacios distintos para seguir el proyecto, opinar y enterarte antes.</span></div>
      <div class="social-stage-v8">
        <article class="social-card-v8 social-instagram-v8 is-active" data-social-v8="0"><small>INSTAGRAM</small><h3>Estamos construyendo esto en público.</h3><p>Pruebas, pedidos, nuevos sabores y cómo va creciendo este proyecto para ayudar a pagar nuestra boda.</p><a href="https://www.instagram.com/antojo.bebidas/" target="_blank" rel="noopener">Seguir el proyecto <b>↗</b></a><img src="/renders/03_mojito_clasico_te_de_mariposa.png" alt=""></article>
        <article class="social-card-v8 social-review-v8" data-social-v8="1" aria-hidden="true"><small>RESEÑAS</small><h3>¿Cuál volverías a pedir?</h3><p>Tu experiencia nos ayuda a mejorar sabores, presentación y entregas.</p><button type="button" data-rating="5">Contar mi experiencia <b>→</b></button><div>★★★★★</div></article>
        <article class="social-card-v8 social-club-v8" data-social-v8="2" aria-hidden="true"><small>ANTOJO. CLUB</small><h3>Lo nuevo, antes.</h3><p>Sabores, preventas y oportunidades para quienes siempre quieren probar el siguiente.</p><button type="button" id="clubButton">Quiero enterarme <b>→</b></button><img src="/renders/13_mezcalita_de_jamaica.png" alt=""></article>
      </div>
      <div class="social-dots-v8">${[0,1,2].map(index=>`<button type="button" class="${index===0?'is-active':''}" data-social-dot-v8="${index}" aria-label="Ver tarjeta ${index+1}"></button>`).join('')}</div>`;
    faq.insertAdjacentElement('afterend',social);
    showSocial(0);
    startSocial();
  }

  function showSocial(index){
    const cards=$$('.social-card-v8');
    if(!cards.length)return;
    socialIndex=(index+cards.length)%cards.length;
    cards.forEach((card,cardIndex)=>{
      const active=cardIndex===socialIndex;
      card.classList.toggle('is-active',active);
      card.setAttribute('aria-hidden',active?'false':'true');
      if(active)card.removeAttribute('inert');else card.setAttribute('inert','');
    });
    $$('[data-social-dot-v8]').forEach((dot,dotIndex)=>dot.classList.toggle('is-active',dotIndex===socialIndex));
  }

  function startSocial(){
    window.clearInterval(socialTimer);
    socialTimer=window.setInterval(()=>showSocial(socialIndex+1),1700);
  }

  function reorderHome(){
    const home=$('.screen[data-screen="home"]');
    if(!home)return;
    [$('.hero-card-v8',home),$('#needs'),$('#favorites'),$('#packages'),$('#how'),$('.plan-v8'),$('#faq'),$('#community')].filter(Boolean).forEach(section=>home.appendChild(section));
  }

  function buildMenuFooter(){
    const menu=$('#menu');
    const grid=$('#productGrid');
    if(!menu||!grid)return;
    let footer=$('.menu-footer-v8',menu);
    if(!footer){footer=document.createElement('section');footer.className='menu-footer-v8';grid.insertAdjacentElement('afterend',footer);}
    const units=totalUnits();
    footer.dataset.units=String(units);
    footer.innerHTML=units
      ? `<small>YA CASI</small><h2>Tienes ${units} ${units===1?'bebida':'bebidas'} en tu pedido.</h2><p>Revisa cantidades y continúa cuando tu mezcla esté lista.</p><button type="button" data-route="cart">Ver mi pedido <b>→</b></button>`
      : '<small>¿NO SABES POR CUÁL EMPEZAR?</small><h2>Empieza por uno de los favoritos.</h2><p>También puedes escribirnos y te ayudamos a elegir según el tipo de plan.</p><div><button type="button" data-v8-home-favorites>Volver a favoritos</button><a href="https://wa.me/525522026291?text=Hola%20ANTOJO.%20%C2%BFMe%20ayudan%20a%20elegir%20sabores%3F" target="_blank" rel="noopener">Ayúdame a elegir</a></div>';
  }

  function removeBalance(root=document){
    $$('.summary-row',root).forEach(row=>{
      const label=$('span',row)?.textContent.trim().toLowerCase()||'';
      if(label.includes('saldo restante')||label==='balance')row.remove();
    });
  }

  function enhanceSheet(){
    const inner=$('#productSheetContent .sheet-inner');
    if(!inner||inner.dataset.v8==='true')return;
    inner.dataset.v8='true';
    const quick=$('.quick-qty',inner);
    if(!quick)return;
    const current=Number($('#sheetQty',inner)?.textContent)||1;
    quick.innerHTML=[10,25,50,75,100,150].map(value=>`<button type="button" class="${current===value?'active':''}" data-sheet-qty="${value}">${value}</button>`).join('');
    quick.insertAdjacentHTML('afterend',`<div class="exact-qty-v8"><label for="exactQtyV8">Cantidad exacta</label><div><input id="exactQtyV8" type="number" min="1" max="2000" value="${current}" inputmode="numeric"><button type="button" data-exact-qty-v8>Usar</button></div></div>`);
  }

  function removeFlowSwitcher(){
    const content=$('#flowModalContent');
    if(!content)return;
    $$('.flow-journey-switcher,[data-flow-switcher],.flow-mode-tabs,.journey-tabs',content).forEach(node=>node.remove());
    $$('div,nav,section',content).forEach(node=>{
      const labels=$$('button',node).map(button=>button.textContent.trim());
      if(labels.length===3&&['Pedido','Evento','Personalizadas'].every(label=>labels.includes(label)))node.remove();
    });
  }

  function enhanceFlow(){
    const modal=$('#flowModal');
    const content=$('#flowModalContent');
    if(!modal||!content)return;
    modal.classList.remove('experience-order-flow','experience-core-flow');
    removeFlowSwitcher();
    const eventGrid=$('[data-event-qty]',content)?.parentElement;
    if(eventGrid&&eventGrid.dataset.v8!=='true'){
      eventGrid.dataset.v8='true';
      const selected=Number(state().event?.quantity)||0;
      eventGrid.innerHTML=[10,25,50,75,100,150].map(value=>`<button type="button" class="${selected===value?'active':''}" data-event-qty="${value}"><b>${value}</b><small>bebidas</small></button>`).join('');
    }
    const customGrid=$('[data-custom-qty]',content)?.parentElement;
    if(customGrid&&customGrid.dataset.v8!=='true'){
      customGrid.dataset.v8='true';
      const selected=Number(state().custom?.quantity)||50;
      customGrid.innerHTML=[50,75,100,150,250,500].map(value=>`<button type="button" class="${selected===value?'active':''}" data-custom-qty="${value}"><b>${value}</b><small>latas</small></button>`).join('');
    }
  }

  function buildCheckoutStepper(form,journey){
    if($('.checkout-stepper-v8',form))return;
    const title=$('.page-title-row',form);
    if(!title)return;
    title.insertAdjacentHTML('beforebegin','<div class="checkout-stepper-v8"><div class="done"><i>1</i><span>Resumen</span></div><b></b><div class="active"><i>2</i><span>Datos y entrega</span></div><b></b><div><i>3</i><span>Confirmación</span></div></div>');
    const eyebrow=$('.eyebrow',title),heading=$('h1',title),intro=$('.checkout-intro',form);
    if(eyebrow)eyebrow.textContent='PASO 2 DE 3';
    if(heading)heading.textContent=journey==='event'?'Confirma tu evento.':journey==='custom'?'Termina tu solicitud personalizada.':'Completa tu pedido.';
    if(intro)intro.textContent=journey==='event'?'Ya tenemos el contexto, la cantidad y los sabores. Solo faltan tus datos y la entrega.':journey==='custom'?'Revisa tu idea, tus datos y la forma de entrega.':'Revisa tus datos y elige cómo quieres recibirlo.';
  }

  function replacePresentation(form){
    $$('[data-journey]',form).forEach(trigger=>trigger.removeAttribute('data-journey'));
    const presentation=$$('.field',form).find(field=>field.textContent.includes('Presentación'));
    if(presentation&&!$('.presentation-v8',presentation))presentation.innerHTML='<span>Presentación</span><div class="presentation-v8"><b>Lata ANTOJO.</b><p>Presentación estándar. Para personalizar, inicia desde “Personalizadas” en el inicio.</p></div>';
  }

  function buildBlankPreview(form){
    const preview=$('.personal-preview',form);
    if(!preview||preview.dataset.v8==='true')return;
    preview.dataset.v8='true';
    const current=state();
    const stage=$('.can-stage',preview);
    if(stage)stage.innerHTML=`<div class="blank-can-v8"><i></i><div><span data-custom-copy-v8>${escapeHTML(current.custom?.text||'TU FRASE')}</span><img data-custom-logo-v8 ${current.custom?.logoData?`src="${current.custom.logoData}"`:'hidden'} alt="Logo cargado"></div><i></i></div>`;
    const title=$('h3',preview),paragraph=$('p',preview);
    if(title)title.textContent='Tu lata, sin el logo de ANTOJO.';
    if(paragraph)paragraph.textContent='Usa una frase breve de hasta tres renglones o carga un logo. El arte final se revisa contigo antes de producir.';
    const input=$('[name="customText"]',form);
    if(input&&input.tagName!=='TEXTAREA'){
      const textarea=document.createElement('textarea');
      [...input.attributes].forEach(attribute=>textarea.setAttribute(attribute.name,attribute.value));
      textarea.value=input.value;input.replaceWith(textarea);
    }
    const finalInput=$('[name="customText"]',form);
    if(finalInput){finalInput.maxLength=90;finalInput.rows=3;finalInput.placeholder='Ej. Ana + Luis · 21.11.26';}
  }

  function enhanceCheckout(){
    const form=$('#checkoutForm');
    if(!form)return;
    const current=state();
    const journey=current.journey||'order';
    form.className=`checkout-page checkout-v8 checkout-v8-${journey}`;
    buildCheckoutStepper(form,journey);
    removeBalance(form);
    replacePresentation(form);
    if(journey==='custom'||(journey==='event'&&current.event?.personalized))buildBlankPreview(form);
    registerReveal(form);
  }

  function registerReveal(root=document){
    const selector='.hero-v8-copy>*,.hero-v8-cans,.hero-v8-actions,.section-heading,.need-card,.mini-product,.package-card,.how-v8-card,.plan-v8,.faq-list details,.social-stage-v8,.product-card,.menu-footer-v8,.cart-page>*,.checkout-page>*';
    const nodes=root.matches?.(selector)?[root,...$$(selector,root)]:$$(selector,root);
    nodes.forEach((node,index)=>{
      if(node.classList.contains('v8-reveal'))return;
      node.classList.add('v8-reveal');
      node.style.setProperty('--v8-delay',`${(index%5)*58}ms`);
      revealObserver?.observe(node);
    });
  }

  function setupReveal(){
    const root=$('#appShell');
    revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-v8-visible');revealObserver.unobserve(entry.target);}
    }),{root,threshold:.05,rootMargin:'8% 0px -4% 0px'});
    registerReveal(document);
  }

  function setupLeftTrail(){
    const stage=$('.brand-stage');
    if(!stage||!window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    stage.addEventListener('pointermove',event=>{
      const now=performance.now();
      if(now-trailLast<86)return;
      trailLast=now;
      const image=document.createElement('img');
      image.className='can-trail-v8';
      image.src=CAN_IMAGES[trailIndex%CAN_IMAGES.length];
      image.alt='';
      image.style.left=`${event.clientX}px`;
      image.style.top=`${event.clientY}px`;
      image.style.setProperty('--r',`${(trailIndex++%2?1:-1)*(5+trailIndex%7)}deg`);
      document.body.appendChild(image);
      requestAnimationFrame(()=>image.classList.add('live'));
      window.setTimeout(()=>image.remove(),950);
    },{passive:true});
  }

  function focusNeed(kind){
    const home=$('[data-route="home"]');
    home?.click();
    window.setTimeout(()=>{
      const target=$(`.need-card[data-journey="${kind}"]`);
      target?.scrollIntoView({behavior:'smooth',block:'center'});
      target?.classList.add('v8-focus');
      window.setTimeout(()=>target?.classList.remove('v8-focus'),1400);
    },120);
  }

  function bind(){
    document.addEventListener('click',event=>{
      const focus=event.target.closest('[data-v8-focus]');
      if(focus){event.preventDefault();event.stopImmediatePropagation();focusNeed(focus.dataset.v8Focus);return;}
      const favorites=event.target.closest('[data-v8-home-favorites]');
      if(favorites){event.preventDefault();event.stopImmediatePropagation();$('[data-route="home"]')?.click();window.setTimeout(()=>$('#favorites')?.scrollIntoView({behavior:'smooth',block:'start'}),120);return;}
      const exact=event.target.closest('[data-exact-qty-v8]');
      if(exact){
        event.preventDefault();
        const input=$('#exactQtyV8');
        const value=Math.min(2000,Math.max(1,Math.round(Number(input?.value)||1)));
        const proxy=document.createElement('button');proxy.type='button';proxy.hidden=true;proxy.dataset.sheetQty=String(value);document.body.appendChild(proxy);proxy.click();proxy.remove();
        if(input)input.value=String(value);
        return;
      }
      const dot=event.target.closest('[data-social-dot-v8]');
      if(dot){showSocial(Number(dot.dataset.socialDotV8)||0);startSocial();return;}
    },true);

    document.addEventListener('click',event=>{
      const journey=event.target.closest('[data-journey]');
      if(!journey)return;
      const allowed=journey.matches('.need-card[data-journey],.hero-v8-secondary[data-journey]');
      if(!allowed){event.preventDefault();event.stopImmediatePropagation();}
    },true);

    document.addEventListener('input',event=>{
      if(event.target.matches('#checkoutForm [name="customText"]')){
        const copy=$('[data-custom-copy-v8]');
        if(copy)copy.textContent=(event.target.value||'TU FRASE').slice(0,90);
      }
    });

    document.addEventListener('change',event=>{
      if(event.target.matches('#checkoutForm [name="logo"]')){
        const file=event.target.files?.[0];
        if(!file)return;
        const reader=new FileReader();
        reader.onload=()=>{const logo=$('[data-custom-logo-v8]');if(logo){logo.src=String(reader.result);logo.hidden=false;}};
        reader.readAsDataURL(file);
      }
    });
  }

  function observeDynamic(){
    const watch=(selector,callback)=>{
      const node=$(selector);if(!node)return;
      new MutationObserver(()=>window.setTimeout(callback,0)).observe(node,{childList:true,subtree:true});
    };
    watch('#productSheetContent',enhanceSheet);
    watch('#flowModalContent',enhanceFlow);
    watch('#checkoutContent',enhanceCheckout);
    watch('#cartContent',()=>{removeBalance($('#cartContent'));registerReveal($('#cartContent'));});
    watch('#productGrid',()=>{buildMenuFooter();registerReveal($('#menu'));});
  }

  function initStatic(){
    document.documentElement.classList.add('experience-v8');
    buildHero();
    buildNeeds();
    buildFavorites();
    buildPackages();
    buildHow();
    buildPlan();
    buildFAQ();
    buildSocial();
    reorderHome();
    buildMenuFooter();
    removeBalance();
    setupReveal();
    registerReveal(document);
  }

  function start(){
    bootLoader();
    bind();
    initStatic();
    observeDynamic();
    setupLeftTrail();
    window.setTimeout(()=>{enhanceSheet();enhanceFlow();enhanceCheckout();buildMenuFooter();},120);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
