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
  let mutationTimer=0;
  let trailIndex=0;
  let lastTrail=0;

  function readState(){
    try{return JSON.parse(localStorage.getItem(STORE)||'null')||{};}catch{return {};}
  }

  function totalUnits(){
    const state=readState();
    return Object.values(state.cart||{}).reduce((sum,value)=>sum+(Number(value)||0),0);
  }

  function escapeHTML(value=''){
    return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  }

  function setupLoader(){
    const loader=$('#loader');
    if(!loader)return;
    loader.className='loader loader-v7';
    loader.innerHTML=`
      <div class="loader-v7-inner">
        <small>HECHO CON CARIÑO EN MÉXICO</small>
        <div class="loader-v7-word" aria-label="ANTOJO.">
          ${[...'ANTOJO.'].map((letter,index)=>`<span style="--i:${index}">${letter}</span>`).join('')}
        </div>
        <p>Algo rico está por aparecer.</p>
        <i class="loader-v7-progress"><b></b></i>
      </div>`;
    document.documentElement.classList.add('experience-v7','v7-loading');
    window.setTimeout(()=>{
      loader.classList.add('v7-complete','hide');
      document.documentElement.classList.remove('v7-loading');
      document.documentElement.classList.add('v7-entered');
      registerReveal(document);
    },2300);
  }

  function buildHero(){
    const hero=$('.screen[data-screen="home"] .hero-card');
    if(!hero||hero.dataset.v7==='true')return;
    hero.dataset.v7='true';
    hero.className='hero-card hero-card-v7';
    hero.innerHTML=`
      <div class="hero-v7-copy">
        <p class="hero-v7-kicker"><i></i>BEBIDAS FRÍAS EN LATA</p>
        <h1><span>¿Qué se te</span><span>antoja hoy?</span></h1>
        <p class="hero-v7-lead">Cítricas, cremosas, con café o con mezcal. Elige unas para hoy o arma algo más grande.</p>
        <div class="hero-v7-actions">
          <button type="button" class="hero-v7-primary" data-route="menu">Ver sabores <b>→</b></button>
          <button type="button" class="hero-v7-secondary" data-journey="event">Cotizar evento</button>
        </div>
      </div>
      <div class="hero-v7-cans" aria-hidden="true">
        <img src="/renders/03_mojito_clasico_te_de_mariposa.png" alt="">
        <img src="/renders/09_maracuya.png" alt="">
        <img src="/renders/05_horchata_espresso.png" alt="">
      </div>
      <div class="hero-v7-note"><b>18</b><span>sabores para mezclar</span></div>`;
  }

  function refineNeeds(){
    const section=$('#needs');
    if(!section)return;
    section.classList.add('needs-v7');
    if(section.dataset.v7==='true')return;
    section.dataset.v7='true';
    const heading=$('.section-heading',section);
    if(heading&&heading.dataset.v7!=='true'){
      heading.dataset.v7='true';
      heading.innerHTML='<p>ELIGE CÓMO EMPEZAR</p><h2>¿Qué plan traes?</h2><span>Solo abre un flujo cuando realmente necesitas cotizar un evento o una personalización.</span>';
    }
    const cards=$$('.need-card',section);
    const copy=[
      ['Pedido pequeño','Quiero unas bebidas','Elige sabores y cantidades sin pasar por un formulario previo.'],
      ['Evento','Estoy armando algo más grande','Calcula una cantidad y después distribuye tus sabores.'],
      ['Personalizadas','Quiero latas con mi idea','Frase, fecha o logo sencillo desde 50 piezas.']
    ];
    cards.forEach((card,index)=>{
      const row=copy[index];
      if(!row)return;
      const small=$('small',card),strong=$('strong',card),paragraph=$('p',card);
      if(small)small.textContent=row[0];
      if(strong)strong.textContent=row[1];
      if(paragraph)paragraph.textContent=row[2];
    });
  }

  function refineFavorites(){
    const section=$('#favorites');
    if(!section)return;
    section.classList.add('favorites-v7');
    const heading=$('.section-heading',section);
    if(heading&&heading.dataset.v7!=='true'){
      heading.dataset.v7='true';
      heading.classList.remove('heading-row');
      heading.innerHTML='<div><p>LOS QUE MÁS SE ANTOJAN</p><h2>Los favoritos.</h2><span>Los sabores que más se repiten cuando alguien no sabe por cuál empezar.</span></div><button type="button" data-route="menu">Ver todos</button>';
    }
    const carousel=$('[data-carousel="favorites"]',section);
    if(carousel&&!carousel.classList.contains('carousel-v7')){
      const clone=carousel.cloneNode(true);
      clone.classList.add('carousel-v7');
      const track=$('.carousel-track',clone);
      if(track){track.removeAttribute('style');track.classList.add('carousel-track-v7');}
      carousel.replaceWith(clone);
    }
  }

  function focusNeed(kind){
    const target=$(`.need-card[data-journey="${kind}"]`);
    if(!target)return;
    target.scrollIntoView({behavior:'smooth',block:'center'});
    target.classList.remove('v7-focus-pulse');
    requestAnimationFrame(()=>target.classList.add('v7-focus-pulse'));
    window.setTimeout(()=>target.classList.remove('v7-focus-pulse'),1500);
  }

  function refinePackages(){
    const section=$('#packages');
    if(!section)return;
    section.classList.add('packages-v7');
    if(section.dataset.v7==='true')return;
    section.dataset.v7='true';
    const heading=$('.section-heading',section);
    if(heading)heading.innerHTML='<p>PARA PEDIR SIN COMPLICARTE</p><h2>Tres formas de resolver el plan.</h2><span>Cada tarjeta hace algo distinto; ninguna abre un formulario por accidente.</span>';
    const cards=$$('.package-card',section);
    const data=[
      {small:'PARA EL ANTOJO',title:'Para el antojo',copy:'Un mix para probar, compartir poquito o descubrir tus favoritos.',button:'Armar mix',action:'menu'},
      {small:'PARA COMPARTIR',title:'Mejor que sobre y no que falte',copy:'Para reuniones, oficina o planes donde siempre aparece alguien más.',button:'Ver opción de evento',focus:'event'},
      {small:'PARA HACERLO TUYO',title:'Latas con tu idea',copy:'Frase, fecha o logo sencillo para convertir la bebida en parte del momento.',button:'Ver personalizadas',focus:'custom'}
    ];
    cards.forEach((card,index)=>{
      const item=data[index];
      if(!item)return;
      card.classList.add(`package-v7-${index+1}`);
      const small=$('small',card),title=$('h3',card),paragraph=$('p',card),button=$('button',card);
      if(small)small.textContent=item.small;
      if(title)title.textContent=item.title;
      if(paragraph)paragraph.textContent=item.copy;
      if(button){
        button.textContent=item.button;
        button.removeAttribute('data-journey');
        button.removeAttribute('data-route');
        if(item.action==='menu')button.dataset.route='menu';
        if(item.focus)button.dataset.v7Focus=item.focus;
      }
    });
  }

  function refineHow(){
    const section=$('#how');
    const packages=$('#packages');
    if(!section||!packages)return;
    section.classList.add('how-v7');
    if(packages.nextElementSibling!==section)packages.insertAdjacentElement('afterend',section);
    if(section.dataset.v7==='true')return;
    section.dataset.v7='true';
    section.innerHTML=`
      <div class="how-v7-card">
        <div class="how-v7-head"><p>SIN VUELTAS</p><h2>Pedir es así de fácil.</h2><span>Solo te pedimos información cuando realmente hace falta.</span></div>
        <div class="how-v7-grid">
          <article><i>01</i><b>Elige cómo pedir</b><span>Pedido, evento o personalizadas.</span></article>
          <article><i>02</i><b>Arma tu mezcla</b><span>Sabores y cantidades a tu manera.</span></article>
          <article><i>03</i><b>Confirma por WhatsApp</b><span>Recibes folio y cerramos detalles.</span></article>
        </div>
      </div>`;
  }

  function refinePlan(){
    const plan=$('.plan-marquee');
    if(!plan)return;
    plan.className='plan-marquee plan-v7';
    if(plan.dataset.v7==='true')return;
    plan.dataset.v7='true';
    const chips=['ANTOJO DE HOY','CUMPLE','SOBREMESA','OFICINA','BODA','REUNIÓN','REGALO'];
    plan.innerHTML=`
      <div class="plan-v7-copy"><small>PARA LO QUE SE ARME</small><strong>Que al plan nunca le falte algo rico.</strong><p>Unas cuantas, una mesa completa o latas hechas para tu evento.</p></div>
      <div class="plan-v7-window"><div class="plan-v7-track">${[...chips,...chips].map(item=>`<b>${item}</b>`).join('')}</div></div>`;
  }

  function refineFaq(){
    const faq=$('#faq');
    if(!faq)return;
    faq.classList.add('faq-v7');
    if(faq.dataset.v7==='true')return;
    faq.dataset.v7='true';
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
    const instagram=$('.instagram-card');
    const community=$$('.home-section').find(section=>section!==faq&&$('.community-grid',section));
    let section=$('#community');
    if(section?.classList.contains('social-v7')&&section.dataset.v7==='true'){
      faq.insertAdjacentElement('afterend',section);
      return;
    }
    if(!section||!section.classList.contains('social-v7')){
      section=document.createElement('section');
      section.id='community';
      section.className='home-section social-v7';
    }
    section.dataset.v7='true';
    section.innerHTML=`
      <div class="section-heading social-v7-heading"><p>LA PARTE MÁS VIVA DEL PROYECTO</p><h2>Lo que pasa en ANTOJO.</h2><span>Tres espacios diferentes, no tres tarjetas copiadas.</span></div>
      <div class="social-v7-stage">
        <article class="social-v7-card social-v7-instagram is-active" data-social-card="0">
          <small>INSTAGRAM</small><h3>Estamos construyendo esto en público.</h3>
          <p>Pruebas, pedidos, nuevos sabores y cómo va creciendo este proyecto para ayudar a pagar nuestra boda.</p>
          <a href="https://www.instagram.com/antojo.bebidas/" target="_blank" rel="noopener">Seguir el proyecto <b>↗</b></a>
          <img src="/renders/03_mojito_clasico_te_de_mariposa.png" alt="">
        </article>
        <article class="social-v7-card social-v7-review" data-social-card="1" aria-hidden="true">
          <small>RESEÑAS</small><h3>¿Cuál volverías a pedir?</h3>
          <p>Tu experiencia nos ayuda a mejorar sabores, presentación y entregas.</p>
          <button type="button" data-rating="5">Contar mi experiencia <b>→</b></button>
          <div class="social-v7-stars">★★★★★</div>
        </article>
        <article class="social-v7-card social-v7-club" data-social-card="2" aria-hidden="true">
          <small>ANTOJO. CLUB</small><h3>Lo nuevo, antes.</h3>
          <p>Sabores, preventas y oportunidades para quienes siempre quieren probar el siguiente.</p>
          <button type="button" id="clubButton">Quiero enterarme <b>→</b></button>
          <img src="/renders/13_mezcalita_de_jamaica.png" alt="">
        </article>
      </div>
      <div class="social-v7-dots">${[0,1,2].map(index=>`<button type="button" class="${index===0?'is-active':''}" data-social-dot="${index}" aria-label="Ver tarjeta ${index+1}"></button>`).join('')}</div>`;
    instagram?.remove();
    if(community&&community!==section)community.remove();
    faq.insertAdjacentElement('afterend',section);
    startSocial();
  }

  function showSocial(index){
    const cards=$$('.social-v7-card');
    const dots=$$('[data-social-dot]');
    if(!cards.length)return;
    socialIndex=(index+cards.length)%cards.length;
    cards.forEach((card,cardIndex)=>{
      const active=cardIndex===socialIndex;
      card.classList.toggle('is-active',active);
      card.setAttribute('aria-hidden',active?'false':'true');
      if(active)card.removeAttribute('inert');else card.setAttribute('inert','');
    });
    dots.forEach((dot,dotIndex)=>dot.classList.toggle('is-active',dotIndex===socialIndex));
  }

  function startSocial(){
    window.clearInterval(socialTimer);
    showSocial(socialIndex);
    socialTimer=window.setInterval(()=>showSocial(socialIndex+1),1700);
  }

  function reorderHome(){
    const home=$('.screen[data-screen="home"]');
    if(!home||home.dataset.v7Ordered==='true')return;
    home.dataset.v7Ordered='true';
    const sections=[
      $('.hero-card-v7',home),$('#needs'),$('#favorites'),$('#packages'),$('#how'),$('.plan-v7'),$('#faq'),$('#community')
    ].filter(Boolean);
    sections.forEach(section=>home.appendChild(section));
  }

  function buildMenuFooter(){
    const menu=$('#menu');
    const grid=$('#productGrid');
    if(!menu||!grid)return;
    let footer=$('.menu-footer-v7',menu);
    const units=totalUnits();
    if(!footer){
      footer=document.createElement('section');
      footer.className='menu-footer-v7';
      grid.insertAdjacentElement('afterend',footer);
    }
    if(footer.dataset.units===String(units))return;
    footer.dataset.units=String(units);
    footer.innerHTML=`
      <small>¿YA ENCONTRASTE EL TUYO?</small>
      <h2>${units?`Tienes ${units} ${units===1?'bebida':'bebidas'} en tu pedido.`:'No tienes que decidir todo de una.'}</h2>
      <p>${units?'Revisa cantidades y continúa cuando tu mezcla esté lista.':'Empieza por un favorito o cuéntanos qué tipo de plan estás armando.'}</p>
      <div>${units?'<button type="button" data-route="cart">Ver mi pedido <b>→</b></button>':'<button type="button" data-v7-home-favorites>Volver a favoritos</button><a href="https://wa.me/525522026291?text=Hola%20ANTOJO.%20%C2%BFMe%20ayudan%20a%20elegir%20sabores%3F" target="_blank" rel="noopener">Ayúdame a elegir</a>'}</div>`;
  }

  function removeBalance(root=document){
    $$('.summary-row',root).forEach(row=>{
      const label=$('span',row)?.textContent.trim().toLowerCase()||'';
      if(label.includes('saldo restante')||label==='balance')row.remove();
    });
  }

  function enhanceSheet(){
    const content=$('#productSheetContent');
    const inner=$('.sheet-inner',content);
    if(!inner||inner.dataset.v7==='true')return;
    inner.dataset.v7='true';
    const quick=$('.quick-qty',inner);
    if(!quick)return;
    const current=Number($('#sheetQty',inner)?.textContent)||1;
    quick.innerHTML=[10,25,50,75,100,150].map(value=>`<button type="button" class="${current===value?'active':''}" data-sheet-qty="${value}">${value}</button>`).join('');
    quick.insertAdjacentHTML('afterend',`<div class="exact-qty-v7"><label for="exactQtyV7">Cantidad exacta</label><div><input id="exactQtyV7" type="number" min="1" max="2000" value="${current}" inputmode="numeric"><button type="button" data-exact-qty-v7>Usar</button></div></div>`);
  }

  function enhanceFlow(){
    const modal=$('#flowModal');
    const content=$('#flowModalContent');
    if(!modal||!content)return;
    modal.classList.remove('experience-order-flow','experience-core-flow');
    $$('.flow-journey-switcher',content).forEach(node=>node.remove());
    const label=$('.step-label',content)?.textContent||'';
    if(label.includes('EVENTO'))modal.dataset.flowKind='event';
    else if(label.includes('PERSONALIZADAS'))modal.dataset.flowKind='custom';
    else delete modal.dataset.flowKind;
    const eventGrid=$('[data-event-qty]',content)?.parentElement;
    if(eventGrid&&eventGrid.dataset.v7!=='true'){
      eventGrid.dataset.v7='true';
      const selected=Number(readState().event?.quantity)||0;
      eventGrid.innerHTML=[10,25,50,75,100,150].map(value=>`<button type="button" class="${selected===value?'active':''}" data-event-qty="${value}"><b>${value}</b><small>bebidas</small></button>`).join('');
    }
    const customGrid=$('[data-custom-qty]',content)?.parentElement;
    if(customGrid&&customGrid.dataset.v7!=='true'){
      customGrid.dataset.v7='true';
      const selected=Number(readState().custom?.quantity)||50;
      customGrid.innerHTML=[50,75,100,150,250,500].map(value=>`<button type="button" class="${selected===value?'active':''}" data-custom-qty="${value}"><b>${value}</b><small>latas</small></button>`).join('');
    }
  }

  function buildCheckoutStepper(form,journey){
    if($('.checkout-stepper-v7',form))return;
    const title=$('.page-title-row',form);
    if(!title)return;
    title.insertAdjacentHTML('beforebegin',`<div class="checkout-stepper-v7"><div class="done"><i>1</i><span>Resumen</span></div><b></b><div class="active"><i>2</i><span>Datos y entrega</span></div><b></b><div><i>3</i><span>Confirmación</span></div></div>`);
    const eyebrow=$('.eyebrow',title),heading=$('h1',title),intro=$('.checkout-intro',form);
    if(eyebrow)eyebrow.textContent='PASO 2 DE 3';
    if(heading)heading.textContent=journey==='event'?'Confirma los datos de tu evento.':journey==='custom'?'Termina tu solicitud personalizada.':'Completa tu pedido.';
    if(intro)intro.textContent=journey==='event'?'Ya tenemos el contexto, la cantidad y los sabores. Solo faltan tus datos y la forma de entrega.':journey==='custom'?'Revisa tu idea, tus datos y la forma de entrega.':'Revisa tus datos y elige cómo quieres recibirlo.';
  }

  function replaceStandardPresentation(form){
    const customTrigger=$('[data-journey="custom"]',form);
    if(!customTrigger)return;
    const field=customTrigger.closest('.field');
    if(!field)return;
    field.innerHTML='<span>Presentación</span><div class="presentation-v7"><b>Lata ANTOJO.</b><p>Presentación estándar. Para personalizar, inicia desde la opción “Personalizadas” del inicio.</p></div>';
  }

  function buildBlankPreview(form){
    const preview=$('.personal-preview',form);
    if(!preview||preview.dataset.v7==='true')return;
    preview.dataset.v7='true';
    const state=readState();
    const stage=$('.can-stage',preview);
    if(stage)stage.innerHTML=`<div class="blank-can-v7"><i></i><div><span data-custom-copy-v7>${escapeHTML(state.custom?.text||'TU FRASE')}</span><img data-custom-logo-v7 ${state.custom?.logoData?`src="${state.custom.logoData}"`:'hidden'} alt="Logo cargado"></div><i></i></div>`;
    const title=$('h3',preview),paragraph=$('p',preview);
    if(title)title.textContent='Tu lata, sin el logo de ANTOJO.';
    if(paragraph)paragraph.textContent='Usa una frase breve de hasta tres renglones o carga un logo. El arte final se revisa contigo antes de producir.';
    const input=$('[name="customText"]',form);
    if(input){input.maxLength=90;input.setAttribute('rows','3');input.setAttribute('placeholder','Ej. Ana + Luis · 21.11.26');}
  }

  function enhanceCheckout(){
    const form=$('#checkoutForm');
    if(!form)return;
    const state=readState();
    const journey=state.journey||'order';
    form.classList.add('checkout-v7',`checkout-v7-${journey}`);
    buildCheckoutStepper(form,journey);
    removeBalance(form);
    if(journey==='order'||journey==='')replaceStandardPresentation(form);
    if(journey==='custom'||(journey==='event'&&state.event?.personalized))buildBlankPreview(form);
  }

  function registerReveal(root=document){
    const selector='.hero-v7-copy>*,.hero-v7-cans,.section-heading,.need-card,.mini-product,.package-card,.how-v7-card,.plan-v7,.faq-list details,.social-v7-stage,.product-card,.menu-footer-v7,.cart-page>*,.checkout-page>*';
    const nodes=root.matches?.(selector)?[root,...$$(selector,root)]:$$(selector,root);
    nodes.forEach((node,index)=>{
      if(node.classList.contains('v7-reveal'))return;
      node.classList.add('v7-reveal');
      node.style.setProperty('--v7-delay',`${(index%5)*55}ms`);
      revealObserver?.observe(node);
    });
  }

  function setupReveal(){
    revealObserver?.disconnect();
    revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-v7-visible');revealObserver.unobserve(entry.target);}
    }),{threshold:.04,rootMargin:'8% 0px -5% 0px'});
    registerReveal(document);
  }

  function setupCanTrail(){
    if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches||document.documentElement.dataset.canTrailV7==='true')return;
    document.documentElement.dataset.canTrailV7='true';
    document.addEventListener('pointermove',event=>{
      const now=performance.now();
      if(now-lastTrail<82)return;
      lastTrail=now;
      const image=document.createElement('img');
      image.className='can-trail-v7';
      image.src=CAN_IMAGES[trailIndex%CAN_IMAGES.length];
      image.alt='';
      image.style.left=`${event.clientX}px`;
      image.style.top=`${event.clientY}px`;
      image.style.setProperty('--r',`${(trailIndex++%2?1:-1)*(6+trailIndex%8)}deg`);
      document.body.appendChild(image);
      requestAnimationFrame(()=>image.classList.add('live'));
      window.setTimeout(()=>image.remove(),1050);
    },{passive:true});
  }

  function auditDOM(){
    buildHero();
    refineNeeds();
    refineFavorites();
    refinePackages();
    refineHow();
    refinePlan();
    refineFaq();
    buildSocial();
    reorderHome();
    buildMenuFooter();
    enhanceSheet();
    enhanceFlow();
    enhanceCheckout();
    removeBalance();
    registerReveal(document);
  }

  function observeDynamic(){
    const observer=new MutationObserver(()=>{
      window.clearTimeout(mutationTimer);
      mutationTimer=window.setTimeout(auditDOM,45);
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }

  function bind(){
    document.addEventListener('click',event=>{
      const focus=event.target.closest('[data-v7-focus]');
      if(focus){event.preventDefault();event.stopImmediatePropagation();focusNeed(focus.dataset.v7Focus);return;}
      const homeFavorites=event.target.closest('[data-v7-home-favorites]');
      if(homeFavorites){
        event.preventDefault();event.stopImmediatePropagation();
        const homeButton=$('[data-route="home"]');
        homeButton?.click();
        window.setTimeout(()=>$('#favorites')?.scrollIntoView({behavior:'smooth',block:'start'}),120);
        return;
      }
      const exact=event.target.closest('[data-exact-qty-v7]');
      if(exact){
        event.preventDefault();
        const input=$('#exactQtyV7');
        const value=Math.min(2000,Math.max(1,Math.round(Number(input?.value)||1)));
        const proxy=document.createElement('button');
        proxy.type='button';proxy.hidden=true;proxy.dataset.sheetQty=String(value);
        document.body.appendChild(proxy);proxy.click();proxy.remove();
        if(input)input.value=String(value);
        return;
      }
      const dot=event.target.closest('[data-social-dot]');
      if(dot){showSocial(Number(dot.dataset.socialDot)||0);startSocial();return;}
    },true);

    document.addEventListener('click',event=>{
      const journey=event.target.closest('[data-journey]');
      if(!journey)return;
      const allowed=journey.matches('.need-card[data-journey],.hero-card-v7 [data-journey]');
      if(!allowed){event.preventDefault();event.stopImmediatePropagation();}
    },true);

    document.addEventListener('input',event=>{
      if(event.target.matches('#checkoutForm [name="customText"]')){
        const copy=$('[data-custom-copy-v7]');
        if(copy)copy.textContent=(event.target.value||'TU FRASE').slice(0,90);
      }
    });

    document.addEventListener('change',event=>{
      if(event.target.matches('#checkoutForm [name="logo"]')){
        const file=event.target.files?.[0];
        if(!file)return;
        const reader=new FileReader();
        reader.onload=()=>{const logo=$('[data-custom-logo-v7]');if(logo){logo.src=String(reader.result);logo.hidden=false;}};
        reader.readAsDataURL(file);
      }
    });

    document.addEventListener('click',()=>window.setTimeout(()=>{auditDOM();registerReveal(document);},70));
  }

  function start(){
    setupLoader();
    bind();
    setupReveal();
    setupCanTrail();
    auditDOM();
    observeDynamic();
    window.setTimeout(auditDOM,250);
    window.setTimeout(auditDOM,900);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
