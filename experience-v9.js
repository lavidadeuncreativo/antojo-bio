(()=>{
  'use strict';

  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const STORE='antojo_clean_state_v4';
  const DRAFT='antojo_checkout_draft_v9';
  const CAN_IMAGES=[
    '/renders/03_mojito_clasico_te_de_mariposa.png',
    '/renders/05_horchata_espresso.png',
    '/renders/09_maracuya.png',
    '/renders/13_mezcalita_de_jamaica.png'
  ];

  let revealObserver=null;
  let socialTimer=0;
  let socialIndex=0;
  let previousScreen=null;
  let trailIndex=0;
  let trailLast=0;

  function readState(){
    try{return JSON.parse(localStorage.getItem(STORE)||'null')||{};}catch{return {};}
  }

  function totalUnits(){
    return Object.values(readState().cart||{}).reduce((sum,value)=>sum+(Number(value)||0),0);
  }

  function finishLoader(){
    const loader=$('#loader');
    if(!loader||loader.classList.contains('v9-done'))return;
    loader.classList.add('v9-leaving');
    window.setTimeout(()=>{
      loader.classList.add('v9-done','hide');
      document.documentElement.classList.remove('v9-loading');
      document.documentElement.classList.add('v9-entered');
      registerReveal(document);
    },330);
  }

  function bootLoader(){
    const loader=$('#loader');
    if(!loader)return;
    loader.className='loader loader-v9';
    loader.innerHTML=`<div class="loader-v9-word" aria-label="ANTOJO.">${[...'ANTOJO.'].map((letter,index)=>`<span style="--i:${index}">${letter}</span>`).join('')}</div>`;
    document.documentElement.classList.add('experience-v9','v9-loading');
    window.setTimeout(finishLoader,1180);
    window.setTimeout(finishLoader,1800);
  }

  function buildHero(){
    const hero=$('.screen[data-screen="home"] .hero-card');
    if(!hero||hero.dataset.v9==='true')return;
    hero.dataset.v9='true';
    hero.className='hero-card hero-card-v9';
    hero.innerHTML=`
      <div class="hero-v9-copy">
        <p class="hero-v9-kicker">BEBIDAS FRÍAS EN LATA</p>
        <h1><span>¿Qué se te</span><span>antoja hoy?</span></h1>
        <p>Listas para compartir: cítricas, cremosas, con café o con mezcal.</p>
      </div>
      <div class="hero-v9-cans" aria-hidden="true">
        <img src="/renders/03_mojito_clasico_te_de_mariposa.png" alt="">
        <img src="/renders/05_horchata_espresso.png" alt="">
        <img src="/renders/09_maracuya.png" alt="">
      </div>
      <div class="hero-v9-actions">
        <button type="button" class="hero-v9-primary" data-route="menu">Ver sabores <b>→</b></button>
        <button type="button" class="hero-v9-secondary" data-journey="event">Cotizar evento</button>
      </div>
      <div class="hero-v9-shortcuts">
        <button type="button" data-section="packages">Ver paquetes</button>
        <button type="button" data-section="faq">Preguntas frecuentes</button>
        <button type="button" data-section="favorites">Lo más pedido</button>
      </div>`;
  }

  function refineHome(){
    const needs=$('#needs');
    if(needs){
      needs.className='home-section needs-v9';
      const heading=$('.section-heading',needs);
      if(heading)heading.innerHTML='<p>ELIGE CÓMO EMPEZAR</p><h2>¿Qué necesitas?</h2><span>Elige lo que estás armando y te llevamos al camino correcto.</span>';
      const copy=[
        ['Pedido pequeño','Quiero unas bebidas','Para compartir, probar sabores o resolver un antojo de hoy.'],
        ['Evento','Estoy armando algo más grande','Cumple, reunión, oficina o cualquier plan con más personas.'],
        ['Personalizadas','Quiero latas con frase o logo','Para bodas, regalos, marcas o una ocasión especial.']
      ];
      $$('.need-card',needs).forEach((card,index)=>{
        const row=copy[index];if(!row)return;
        card.classList.add(`need-v9-${index+1}`);
        const small=$('small',card),strong=$('strong',card),paragraph=$('p',card);
        if(small)small.textContent=row[0];
        if(strong)strong.textContent=row[1];
        if(paragraph)paragraph.textContent=row[2];
      });
    }

    const favorites=$('#favorites');
    if(favorites){
      favorites.className='home-section favorites-v9';
      const heading=$('.section-heading',favorites);
      if(heading)heading.innerHTML='<div><p>LOS QUE MÁS SE ANTOJAN</p><h2>Los favoritos.</h2><span>Sabores que se repiten cuando alguien no sabe por cuál empezar.</span></div><button type="button" data-route="menu">Ver todos</button>';
      buildFavoriteMarquee(favorites);
    }

    const packages=$('#packages');
    if(packages){
      packages.className='home-section package-section packages-v9';
      const heading=$('.section-heading',packages);
      if(heading)heading.innerHTML='<p>PARA PEDIR SIN COMPLICARTE</p><h2>Elige el tamaño del plan.</h2><span>Tres caminos claros para pedir sin llenar formularios de más.</span>';
      const data=[
        ['PARA EL ANTOJO','Para el antojo','Un mix para probar, compartir poquito o descubrir favoritos.','Armar mix','menu'],
        ['PARA COMPARTIR','Mejor que sobre y no que falte','Más bebidas para reuniones, oficina o planes con más personas.','Cotizar evento','event'],
        ['PARA HACERLO TUYO','Latas con tu idea','Frase, fecha o logo sencillo para eventos, regalos y marcas.','Crear idea','custom']
      ];
      $$('.package-card',packages).forEach((card,index)=>{
        const row=data[index];if(!row)return;
        card.className=`package-card package-v9-${index+1}`;
        const small=$('small',card),title=$('h3',card),paragraph=$('p',card),button=$('button',card);
        if(small)small.textContent=row[0];
        if(title)title.textContent=row[1];
        if(paragraph)paragraph.textContent=row[2];
        if(button){
          button.textContent=row[3];
          button.removeAttribute('data-route');button.removeAttribute('data-journey');
          if(row[4]==='menu')button.dataset.route='menu';
          else button.dataset.v9Focus=row[4];
        }
      });
    }

    const how=$('#how');
    if(how&&packages){
      how.className='home-section how-v9';
      how.innerHTML=`<div class="how-v9-card"><div><p>SIN VUELTAS</p><h2>Pedir es así de fácil.</h2><span>Solo te pedimos información cuando realmente hace falta.</span></div><section><article><i>01</i><b>Elige cómo pedir</b><span>Pedido, evento o personalizadas.</span></article><article><i>02</i><b>Arma tu mezcla</b><span>Sabores y cantidades a tu manera.</span></article><article><i>03</i><b>Confirma por WhatsApp</b><span>Recibes folio y cerramos detalles.</span></article></section></div>`;
      if(packages.nextElementSibling!==how)packages.insertAdjacentElement('afterend',how);
    }

    const plan=$('.plan-marquee');
    if(plan){
      const chips=['ANTOJO DE HOY','CUMPLE','SOBREMESA','OFICINA','BODA','REUNIÓN','REGALO'];
      plan.className='plan-marquee plan-v9';
      plan.innerHTML=`<div class="plan-v9-copy"><small>PARA LO QUE SE ARME</small><strong>Que al plan nunca le falte algo rico.</strong><p>Unas cuantas, una mesa completa o latas hechas para tu evento.</p></div><div class="plan-v9-window"><div class="plan-v9-track">${[...chips,...chips].map(item=>`<b>${item}</b>`).join('')}</div></div>`;
    }

    const faq=$('#faq');
    if(faq){
      faq.className='home-section faq-v9';
      const heading=$('.section-heading',faq);
      if(heading)heading.innerHTML='<p>PREGUNTAS FRECUENTES</p><h2>Antes de pedir.</h2><span>Lo importante, explicado sin publicar toda la estructura comercial.</span>';
      $$('.faq-list details',faq).forEach(detail=>{
        const summary=$('summary',detail),paragraph=$('p',detail);if(!summary||!paragraph)return;
        const question=summary.textContent.toLowerCase();
        if(question.includes('precio')){summary.textContent='¿Cómo se calcula el precio?';paragraph.textContent='Depende de la cantidad, la presentación y la logística. Al armar el pedido verás un estimado y antes de producir confirmamos contigo el total y el anticipo.';}
        if(question.includes('duran'))paragraph.textContent='Recomendamos consumirlas en un máximo de 72 horas. Bien refrigeradas pueden mantenerse entre 2 y 4 días, según el sabor y sus ingredientes.';
      });
    }

    buildSocial(faq);
    reorderHome();
  }

  function buildFavoriteMarquee(section){
    if($('.favorites-marquee-v9',section))return;
    const original=$('[data-carousel="favorites"]',section);
    const all=original?$$('.mini-product',original):[];
    if(!all.length)return;
    const unique=all.slice(0,Math.max(1,Math.floor(all.length/2)));
    const html=unique.map(card=>card.outerHTML).join('');
    const marquee=document.createElement('div');
    marquee.className='favorites-marquee-v9';
    marquee.innerHTML=`<div class="favorites-track-v9"><div>${html}</div><div aria-hidden="true">${html}</div></div>`;
    original.replaceWith(marquee);
  }

  function buildSocial(faq){
    if(!faq)return;
    $('.instagram-card')?.remove();
    $$('.home-section').filter(section=>section!==faq&&$('.community-grid',section)).forEach(section=>section.remove());
    let social=$('#community');
    if(!social){social=document.createElement('section');social.id='community';}
    social.className='home-section social-v9';
    social.innerHTML=`
      <div class="section-heading"><p>LA PARTE MÁS VIVA DEL PROYECTO</p><h2>Lo que pasa en ANTOJO.</h2><span>Instagram, reseñas y novedades; cada espacio con una función distinta.</span></div>
      <div class="social-stage-v9">
        <article class="social-card-v9 social-instagram-v9 is-active" data-social-v9="0"><small>INSTAGRAM</small><h3>Estamos construyendo esto en público.</h3><p>Pruebas, pedidos, nuevos sabores y cómo va creciendo este proyecto para ayudar a pagar nuestra boda.</p><a href="https://www.instagram.com/antojo.bebidas/" target="_blank" rel="noopener">Seguir el proyecto <b>↗</b></a><img src="/renders/03_mojito_clasico_te_de_mariposa.png" alt=""></article>
        <article class="social-card-v9 social-review-v9" data-social-v9="1" aria-hidden="true"><small>RESEÑAS</small><h3>¿Cuál volverías a pedir?</h3><p>Tu experiencia nos ayuda a mejorar sabores, presentación y entregas.</p><button type="button" data-rating="5">Contar mi experiencia <b>→</b></button><div>★★★★★</div></article>
        <article class="social-card-v9 social-club-v9" data-social-v9="2" aria-hidden="true"><small>ANTOJO. CLUB</small><h3>Lo nuevo, antes.</h3><p>Sabores, preventas y oportunidades para quienes siempre quieren probar el siguiente.</p><button type="button" id="clubButton">Quiero enterarme <b>→</b></button><img src="/renders/13_mezcalita_de_jamaica.png" alt=""></article>
      </div>
      <div class="social-dots-v9">${[0,1,2].map(index=>`<button type="button" class="${index===0?'is-active':''}" data-social-dot-v9="${index}" aria-label="Ver tarjeta ${index+1}"></button>`).join('')}</div>`;
    faq.insertAdjacentElement('afterend',social);
    showSocial(0);startSocial();
  }

  function showSocial(index){
    const cards=$$('.social-card-v9');if(!cards.length)return;
    socialIndex=(index+cards.length)%cards.length;
    cards.forEach((card,cardIndex)=>{
      const active=cardIndex===socialIndex;
      card.classList.toggle('is-active',active);
      card.setAttribute('aria-hidden',active?'false':'true');
      if(active)card.removeAttribute('inert');else card.setAttribute('inert','');
    });
    $$('[data-social-dot-v9]').forEach((dot,dotIndex)=>dot.classList.toggle('is-active',dotIndex===socialIndex));
  }

  function startSocial(){
    window.clearInterval(socialTimer);
    socialTimer=window.setInterval(()=>showSocial(socialIndex+1),3200);
  }

  function reorderHome(){
    const home=$('.screen[data-screen="home"]');if(!home)return;
    [$('.hero-card-v9',home),$('#needs'),$('#favorites'),$('#packages'),$('#how'),$('.plan-v9'),$('#faq'),$('#community')].filter(Boolean).forEach(section=>home.appendChild(section));
  }

  function buildMenuFooter(){
    const menu=$('#menu'),grid=$('#productGrid');if(!menu||!grid)return;
    let footer=$('.menu-footer-v9',menu);
    if(!footer){footer=document.createElement('section');footer.className='menu-footer-v9';grid.insertAdjacentElement('afterend',footer);}
    const units=totalUnits();
    footer.dataset.units=String(units);
    footer.innerHTML=units
      ? `<small>YA CASI</small><h2>Tienes ${units} ${units===1?'bebida':'bebidas'} en tu pedido.</h2><p>Revisa cantidades y continúa cuando tu mezcla esté lista.</p><button type="button" data-route="cart">Ver mi pedido <b>→</b></button>`
      : '<small>¿NO SABES POR CUÁL EMPEZAR?</small><h2>Empieza por uno de los favoritos.</h2><p>También puedes escribirnos y te ayudamos a elegir según el plan.</p><div><button type="button" data-v9-home-favorites>Volver a favoritos</button><a href="https://wa.me/525522026291?text=Hola%20ANTOJO.%20%C2%BFMe%20ayudan%20a%20elegir%20sabores%3F" target="_blank" rel="noopener">Ayúdame a elegir</a></div>';
  }

  function ensureFlowScreen(){
    let screen=$('#flowScreenV9');
    if(screen)return screen;
    screen=document.createElement('section');
    screen.id='flowScreenV9';
    screen.className='screen flow-screen-v9';
    screen.dataset.screen='flow-v9';
    screen.innerHTML='<div class="flow-screen-host-v9" id="flowScreenHostV9"></div>';
    $('#appMain')?.appendChild(screen);
    return screen;
  }

  function enterFlowScreen(){
    const modal=$('#flowModal'),content=$('#flowModalContent');
    if(!modal?.classList.contains('open')||!content)return;
    const screen=ensureFlowScreen(),host=$('#flowScreenHostV9');
    if(!screen.classList.contains('active'))previousScreen=$$('.screen.active').find(item=>item!==screen)||null;
    $$('.screen').forEach(item=>item.classList.remove('active'));
    screen.classList.add('active');
    if(content.parentElement!==host)host.appendChild(content);
    modal.classList.add('v9-detached');
    document.documentElement.classList.add('v9-flow-open');
    $('#appShell')?.scrollTo({top:0,behavior:'instant'});
    decorateFlow();
  }

  function exitFlowScreen(){
    const modal=$('#flowModal'),content=$('#flowModalContent'),screen=$('#flowScreenV9');
    if(modal?.classList.contains('open'))return;
    if(content&&modal&&content.parentElement!==modal)modal.appendChild(content);
    modal?.classList.remove('v9-detached');
    screen?.classList.remove('active');
    document.documentElement.classList.remove('v9-flow-open');
    if(!$('.screen.active')){
      const target=previousScreen&&document.contains(previousScreen)?previousScreen:$('.screen[data-screen="home"]');
      target?.classList.add('active');
    }
    previousScreen=null;
  }

  function decorateFlow(){
    const root=$('#flowModalContent');if(!root)return;
    root.classList.add('flow-content-v9');
    $$('.flow-journey-switcher,[data-flow-switcher],.flow-mode-tabs,.journey-tabs',root).forEach(node=>node.remove());
    $$('div,nav,section',root).forEach(node=>{
      const labels=$$('button',node).map(button=>button.textContent.trim());
      if(labels.length===3&&['Pedido','Evento','Personalizadas'].every(label=>labels.includes(label)))node.remove();
    });
    const eventGrid=$('[data-event-qty]',root)?.parentElement;
    if(eventGrid&&eventGrid.dataset.v9!=='true'){
      eventGrid.dataset.v9='true';
      const selected=Number(readState().event?.quantity)||0;
      eventGrid.innerHTML=[10,25,50,75,100,150].map(value=>`<button type="button" class="${selected===value?'active':''}" data-event-qty="${value}"><b>${value}</b><small>bebidas</small></button>`).join('');
    }
    const customGrid=$('[data-custom-qty]',root)?.parentElement;
    if(customGrid&&customGrid.dataset.v9!=='true'){
      customGrid.dataset.v9='true';
      const selected=Number(readState().custom?.quantity)||50;
      customGrid.innerHTML=[50,75,100,150,250,500].map(value=>`<button type="button" class="${selected===value?'active':''}" data-custom-qty="${value}"><b>${value}</b><small>latas</small></button>`).join('');
    }
    registerReveal(root);
  }

  function captureCheckoutDraft(){
    const form=$('#checkoutForm');if(!form)return;
    const draft={};
    $$('input[name],textarea[name],select[name]',form).forEach(field=>{
      if(field.type==='file'||field.name==='website')return;
      draft[field.name]=(field.type==='checkbox'||field.type==='radio')?field.checked:field.value;
    });
    try{sessionStorage.setItem(DRAFT,JSON.stringify(draft));}catch{}
  }

  function restoreCheckoutDraft(){
    const form=$('#checkoutForm');if(!form)return;
    let draft={};
    try{draft=JSON.parse(sessionStorage.getItem(DRAFT)||'{}')||{};}catch{}
    Object.entries(draft).forEach(([name,value])=>{
      $$(`[name="${CSS.escape(name)}"]`,form).forEach(field=>{
        if(field.type==='checkbox'||field.type==='radio')field.checked=Boolean(value);
        else if(field.type!=='file')field.value=String(value??'');
      });
    });
  }

  function clearCheckoutDraft(){
    try{sessionStorage.removeItem(DRAFT);}catch{}
  }

  function removeBalance(root=document){
    $$('.summary-row',root).forEach(row=>{
      const label=$('span',row)?.textContent.trim().toLowerCase()||'';
      if(label.includes('saldo restante')||label.includes('saldo a pagar')||label==='balance')row.remove();
    });
  }

  function scrubWhatsAppBalance(root=document){
    $$('a[href*="wa.me"]',root).forEach(link=>{
      try{
        const url=new URL(link.href);
        const text=url.searchParams.get('text');if(!text)return;
        const clean=text
          .replace(/\n\nSaldo restante:\n[^\n]*/gi,'')
          .replace(/\n\nSaldo a pagar:\n[^\n]*/gi,'')
          .replace(/\nSaldo restante[^\n]*/gi,'');
        url.searchParams.set('text',clean);link.href=url.toString();
      }catch{}
    });
  }

  function enhanceCheckout(){
    const form=$('#checkoutForm');if(!form)return;
    const state=readState(),journey=state.journey||'order';
    form.classList.add('checkout-v9',`checkout-v9-${journey}`);
    if(!$('.checkout-stepper-v9',form)){
      const title=$('.page-title-row',form);
      if(title){
        title.insertAdjacentHTML('beforebegin','<div class="checkout-stepper-v9"><div class="done"><i>1</i><span>Resumen</span></div><b></b><div class="active"><i>2</i><span>Datos y entrega</span></div><b></b><div><i>3</i><span>Confirmación</span></div></div>');
        const eyebrow=$('.eyebrow',title),heading=$('h1',title),intro=$('.checkout-intro',form);
        if(eyebrow)eyebrow.textContent='PASO 2 DE 3';
        if(heading)heading.textContent=journey==='event'?'Confirma tu evento.':journey==='custom'?'Termina tu solicitud personalizada.':'Completa tu pedido.';
        if(intro)intro.textContent=journey==='event'?'Ya tenemos el contexto, la cantidad y los sabores. Solo faltan tus datos y la entrega.':journey==='custom'?'Revisa tu idea, tus datos y la forma de entrega.':'Revisa tus datos y elige cómo quieres recibirlo.';
      }
    }
    restoreCheckoutDraft();
    removeBalance(form);
    scrubWhatsAppBalance(form);
    registerReveal(form);
  }

  function registerReveal(root=document){
    const selector='.hero-v9-copy>*,.hero-v9-cans,.hero-v9-actions,.section-heading,.need-card,.mini-product,.package-card,.how-v9-card,.plan-v9,.faq-list details,.social-stage-v9,.product-card,.menu-footer-v9,.cart-page>*,.checkout-page>*,.flow-content-v9>*';
    const nodes=root.matches?.(selector)?[root,...$$(selector,root)]:$$(selector,root);
    nodes.forEach((node,index)=>{
      if(node.classList.contains('v9-reveal'))return;
      node.classList.add('v9-reveal');
      node.style.setProperty('--v9-delay',`${(index%5)*45}ms`);
      revealObserver?.observe(node);
    });
  }

  function setupReveal(){
    const root=$('#appShell');
    revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-v9-visible');revealObserver.unobserve(entry.target);}
    }),{root,threshold:.04,rootMargin:'10% 0px -4% 0px'});
    registerReveal(document);
  }

  function setupLeftTrail(){
    const stage=$('.brand-stage');
    if(!stage||!window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    stage.addEventListener('pointermove',event=>{
      const now=performance.now();if(now-trailLast<92)return;trailLast=now;
      const rect=stage.getBoundingClientRect();
      const image=document.createElement('img');
      image.className='can-trail-v9';image.src=CAN_IMAGES[trailIndex%CAN_IMAGES.length];image.alt='';
      image.style.left=`${event.clientX-rect.left}px`;image.style.top=`${event.clientY-rect.top}px`;
      image.style.setProperty('--r',`${(trailIndex++%2?1:-1)*(5+trailIndex%7)}deg`);
      stage.appendChild(image);requestAnimationFrame(()=>image.classList.add('live'));
      window.setTimeout(()=>image.remove(),900);
    },{passive:true});
  }

  function focusNeed(kind){
    $('[data-route="home"]')?.click();
    window.setTimeout(()=>{
      const target=$(`.need-card[data-journey="${kind}"]`);
      target?.scrollIntoView({behavior:'smooth',block:'center'});
      target?.classList.add('v9-focus');window.setTimeout(()=>target?.classList.remove('v9-focus'),1300);
    },120);
  }

  function bind(){
    document.addEventListener('pointerdown',event=>{
      if(event.target.closest('#checkoutForm [data-fulfillment],#checkoutForm [name="dateUnknown"],#checkoutForm [name="customSize"]'))captureCheckoutDraft();
    },true);

    document.addEventListener('click',event=>{
      const focus=event.target.closest('[data-v9-focus]');
      if(focus){event.preventDefault();event.stopImmediatePropagation();focusNeed(focus.dataset.v9Focus);return;}
      const favorites=event.target.closest('[data-v9-home-favorites]');
      if(favorites){event.preventDefault();event.stopImmediatePropagation();$('[data-route="home"]')?.click();window.setTimeout(()=>$('#favorites')?.scrollIntoView({behavior:'smooth',block:'start'}),120);return;}
      const dot=event.target.closest('[data-social-dot-v9]');
      if(dot){showSocial(Number(dot.dataset.socialDotV9)||0);startSocial();return;}
      if(event.target.closest('[data-new-order]'))clearCheckoutDraft();
      if(event.target.closest('#submitButton'))captureCheckoutDraft();
    },true);

    document.addEventListener('input',event=>{if(event.target.closest('#checkoutForm'))captureCheckoutDraft();});
    document.addEventListener('change',event=>{if(event.target.closest('#checkoutForm'))captureCheckoutDraft();});
  }

  function observeDynamic(){
    const modal=$('#flowModal'),content=$('#flowModalContent');
    if(modal)new MutationObserver(()=>modal.classList.contains('open')?enterFlowScreen():exitFlowScreen()).observe(modal,{attributes:true,attributeFilter:['class']});
    if(content)new MutationObserver(()=>{if($('#flowModal')?.classList.contains('open')){enterFlowScreen();decorateFlow();}}).observe(content,{childList:true,subtree:true});

    const watch=(selector,callback)=>{
      const node=$(selector);if(!node)return;
      new MutationObserver(()=>window.setTimeout(callback,0)).observe(node,{childList:true,subtree:true});
    };
    watch('#checkoutContent',enhanceCheckout);
    watch('#cartContent',()=>{removeBalance($('#cartContent'));registerReveal($('#cartContent'));});
    watch('#productGrid',()=>{buildMenuFooter();registerReveal($('#menu'));});
    watch('#successContent',()=>{clearCheckoutDraft();removeBalance($('#successContent'));scrubWhatsAppBalance($('#successContent'));registerReveal($('#successContent'));});
  }

  function start(){
    bootLoader();
    document.documentElement.classList.add('experience-v9');
    bind();
    buildHero();
    refineHome();
    buildMenuFooter();
    ensureFlowScreen();
    setupReveal();
    observeDynamic();
    setupLeftTrail();
    removeBalance();
    scrubWhatsAppBalance();
    window.setTimeout(()=>{enhanceCheckout();buildMenuFooter();removeBalance();},120);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
