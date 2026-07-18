(()=>{
  'use strict';

  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const STORE='antojo_clean_state_v4';
  const DRAFT='antojo_checkout_draft_v10';
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
  let favoritesFallback=0;

  function readState(){
    try{return JSON.parse(localStorage.getItem(STORE)||'null')||{};}catch{return {};}
  }

  function totalUnits(){
    return Object.values(readState().cart||{}).reduce((sum,value)=>sum+(Number(value)||0),0);
  }

  function escapeHTML(value=''){
    return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  }

  function bootLoader(){
    const loader=$('#loader');
    if(!loader)return;
    loader.className='loader loader-v10';
    loader.innerHTML=`<div class="loader-v10-word" aria-label="ANTOJO.">${[...'ANTOJO.'].map((letter,index)=>`<span style="--i:${index}">${letter}</span>`).join('')}</div>`;
    document.documentElement.classList.add('experience-v9','experience-v10','v10-loading');
    const finish=()=>{
      if(loader.classList.contains('v10-done'))return;
      loader.classList.add('v10-leaving');
      window.setTimeout(()=>{
        loader.classList.add('v10-done','hide');
        document.documentElement.classList.remove('v10-loading');
        document.documentElement.classList.add('v10-entered');
        registerReveal(document);
      },520);
    };
    window.setTimeout(finish,1850);
    window.setTimeout(finish,2600);
  }

  function buildHero(){
    const hero=$('.screen[data-screen="home"] .hero-card');
    if(!hero||hero.dataset.v10==='true')return;
    hero.dataset.v10='true';
    hero.className='hero-card hero-card-v9 hero-card-v10';
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
        ['PARA COMPARTIR','Mejor que sobre y no que falte','Más bebidas para reuniones, oficina o planes con más personas.','Ver opción de evento','event'],
        ['PARA HACERLO TUYO','Latas con tu idea','Frase, fecha o logo sencillo para eventos, regalos y marcas.','Ver personalizadas','custom']
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
          button.removeAttribute('data-route');
          button.removeAttribute('data-journey');
          if(row[4]==='menu')button.dataset.route='menu';
          else button.dataset.v10Focus=row[4];
        }
      });
    }

    const how=$('#how');
    if(how&&packages){
      how.className='home-section how-v9';
      how.innerHTML='<div class="how-v9-card"><div><p>SIN VUELTAS</p><h2>Pedir es así de fácil.</h2><span>Solo te pedimos información cuando realmente hace falta.</span></div><section><article><i>01</i><b>Elige cómo pedir</b><span>Pedido, evento o personalizadas.</span></article><article><i>02</i><b>Arma tu mezcla</b><span>Sabores y cantidades a tu manera.</span></article><article><i>03</i><b>Confirma por WhatsApp</b><span>Recibes folio y cerramos detalles.</span></article></section></div>';
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
        if(question.includes('precio')){
          summary.textContent='¿Cómo se calcula el precio?';
          paragraph.textContent='Depende de la cantidad, la presentación y la logística. Al armar el pedido verás un estimado y antes de producir confirmamos contigo el total y el anticipo.';
        }
        if(question.includes('duran'))paragraph.textContent='Recomendamos consumirlas en un máximo de 72 horas. Bien refrigeradas pueden mantenerse entre 2 y 4 días, según el sabor y sus ingredientes.';
      });
    }

    buildSocial(faq);
    reorderHome();
  }

  function buildFavoriteMarquee(section){
    if($('.favorites-marquee-v10',section))return;
    const original=$('[data-carousel="favorites"]',section);
    const all=original?$$('.mini-product',original):[];
    if(!all.length){
      window.clearTimeout(buildFavoriteMarquee.timer);
      buildFavoriteMarquee.timer=window.setTimeout(()=>buildFavoriteMarquee(section),80);
      return;
    }
    const unique=all.slice(0,Math.max(1,Math.floor(all.length/2)));
    const html=unique.map(card=>card.outerHTML).join('');
    const marquee=document.createElement('div');
    marquee.className='favorites-marquee-v10';
    marquee.innerHTML=`<div class="favorites-track-v10"><div>${html}</div><div aria-hidden="true">${html}</div></div>`;
    original.replaceWith(marquee);
    ensureFavoriteMotion();
  }

  function ensureFavoriteMotion(){
    const track=$('.favorites-track-v10');
    if(!track)return;
    track.style.animationPlayState='running';
    window.clearInterval(favoritesFallback);
    window.setTimeout(()=>{
      if(track.getAnimations?.().length)return;
      let x=0,last=performance.now();
      const tick=now=>{
        if(!document.contains(track))return;
        const dt=Math.min(40,now-last);last=now;x-=dt*.035;
        const half=track.scrollWidth/2;
        if(Math.abs(x)>=half)x+=half;
        track.style.transform=`translate3d(${x}px,0,0)`;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },120);
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
        <article class="social-card-v9 social-instagram-v9 is-active" data-social-v10="0"><small>INSTAGRAM</small><h3>Detrás de cada lata.</h3><p>Pedidos, pruebas, nuevos sabores y cómo va creciendo ANTOJO.</p><a href="https://www.instagram.com/antojo.bebidas/" target="_blank" rel="noopener">Seguir el proyecto <b>↗</b></a><img src="/renders/03_mojito_clasico_te_de_mariposa.png" alt=""></article>
        <article class="social-card-v9 social-review-v9" data-social-v10="1" aria-hidden="true"><small>RESEÑAS</small><h3>¿Cuál volverías a pedir?</h3><p>Tu experiencia nos ayuda a mejorar sabores, presentación y entregas.</p><button type="button" data-rating="5">Contar mi experiencia <b>→</b></button><div>★★★★★</div></article>
        <article class="social-card-v9 social-club-v9" data-social-v10="2" aria-hidden="true"><small>ANTOJO. CLUB</small><h3>Lo nuevo, antes.</h3><p>Sabores, preventas y oportunidades para quienes siempre quieren probar el siguiente.</p><button type="button" id="clubButton">Quiero enterarme <b>→</b></button><img src="/renders/13_mezcalita_de_jamaica.png" alt=""></article>
      </div>
      <div class="social-dots-v9">${[0,1,2].map(index=>`<button type="button" class="${index===0?'is-active':''}" data-social-dot-v10="${index}" aria-label="Ver tarjeta ${index+1}"></button>`).join('')}</div>`;
    if(faq.nextElementSibling!==social)faq.insertAdjacentElement('afterend',social);
    showSocial(0);
    startSocial();
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
    $$('[data-social-dot-v10]').forEach((dot,dotIndex)=>dot.classList.toggle('is-active',dotIndex===socialIndex));
  }

  function startSocial(){
    window.clearInterval(socialTimer);
    socialTimer=window.setInterval(()=>showSocial(socialIndex+1),1700);
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
    if(footer.dataset.units===String(units))return;
    footer.dataset.units=String(units);
    footer.innerHTML=units
      ? `<small>YA CASI</small><h2>Tienes ${units} ${units===1?'bebida':'bebidas'} en tu pedido.</h2><p>Revisa cantidades y continúa cuando tu mezcla esté lista.</p><button type="button" data-route="cart">Ver mi pedido <b>→</b></button>`
      : '<small>¿NO SABES POR CUÁL EMPEZAR?</small><h2>Empieza por uno de los favoritos.</h2><p>También puedes escribirnos y te ayudamos a elegir según el plan.</p><div><button type="button" data-v10-home-favorites>Volver a favoritos</button><a href="https://wa.me/525522026291?text=Hola%20ANTOJO.%20%C2%BFMe%20ayudan%20a%20elegir%20sabores%3F" target="_blank" rel="noopener">Ayúdame a elegir</a></div>';
  }

  function ensureFlowScreen(){
    let screen=$('#flowScreenV10');
    if(screen)return screen;
    screen=document.createElement('section');
    screen.id='flowScreenV10';
    screen.className='screen flow-screen-v9 flow-screen-v10';
    screen.dataset.screen='flow-v10';
    screen.innerHTML='<div class="flow-screen-host-v9" id="flowScreenHostV10"></div>';
    $('#appMain')?.appendChild(screen);
    return screen;
  }

  function enterFlowScreen(){
    const modal=$('#flowModal'),content=$('#flowModalContent');
    if(!modal?.classList.contains('open')||!content)return;
    const screen=ensureFlowScreen(),host=$('#flowScreenHostV10');
    if(!screen.classList.contains('active'))previousScreen=$$('.screen.active').find(item=>item!==screen)||null;
    $$('.screen').forEach(item=>item.classList.remove('active'));
    screen.classList.add('active');
    if(content.parentElement!==host)host.appendChild(content);
    modal.classList.add('v9-detached');
    document.documentElement.classList.add('v10-flow-open');
    $('#appShell')?.scrollTo({top:0,behavior:'auto'});
    decorateFlow();
  }

  function exitFlowScreen(){
    const modal=$('#flowModal'),content=$('#flowModalContent'),screen=$('#flowScreenV10');
    if(modal?.classList.contains('open'))return;
    if(content&&modal&&content.parentElement!==modal)modal.appendChild(content);
    modal?.classList.remove('v9-detached');
    screen?.classList.remove('active');
    document.documentElement.classList.remove('v10-flow-open');
    if(!$('.screen.active')){
      const target=previousScreen&&document.contains(previousScreen)?previousScreen:$('.screen[data-screen="home"]');
      target?.classList.add('active');
    }
    previousScreen=null;
  }

  function decorateFlow(){
    const root=$('#flowModalContent');if(!root)return;
    root.classList.add('flow-content-v9','flow-content-v10');
    $$('.flow-journey-switcher,[data-flow-switcher],.flow-mode-tabs,.journey-tabs',root).forEach(node=>node.remove());
    $$('div,nav,section',root).forEach(node=>{
      const labels=$$('button',node).map(button=>button.textContent.trim());
      if(labels.length===3&&['Pedido','Evento','Personalizadas'].every(label=>labels.includes(label)))node.remove();
    });
    const eventGrid=$('[data-event-qty]',root)?.parentElement;
    if(eventGrid&&eventGrid.dataset.v10!=='true'){
      eventGrid.dataset.v10='true';
      const selected=Number(readState().event?.quantity)||0;
      eventGrid.innerHTML=[10,25,50,75,100,150].map(value=>`<button type="button" class="${selected===value?'active':''}" data-event-qty="${value}"><b>${value}</b><small>bebidas</small></button>`).join('');
    }
    const customGrid=$('[data-custom-qty]',root)?.parentElement;
    if(customGrid&&customGrid.dataset.v10!=='true'){
      customGrid.dataset.v10='true';
      const selected=Number(readState().custom?.quantity)||50;
      customGrid.innerHTML=[50,75,100,150,250,500].map(value=>`<button type="button" class="${selected===value?'active':''}" data-custom-qty="${value}"><b>${value}</b><small>latas</small></button>`).join('');
    }
    registerReveal(root);
  }

  function enhanceSheet(){
    const content=$('#productSheetContent'),inner=$('.sheet-inner',content);
    if(!inner||inner.dataset.v10==='true')return;
    inner.dataset.v10='true';
    const quick=$('.quick-qty',inner);if(!quick)return;
    const current=Number($('#sheetQty',inner)?.textContent)||1;
    quick.innerHTML=[10,25,50,75,100,150].map(value=>`<button type="button" class="${current===value?'active':''}" data-sheet-qty="${value}">${value}</button>`).join('');
    quick.insertAdjacentHTML('afterend',`<div class="exact-qty-v10"><label for="exactQtyV10">Cantidad exacta</label><div><input id="exactQtyV10" type="number" min="1" max="2000" value="${current}" inputmode="numeric"><button type="button" data-exact-qty-v10>Usar</button></div></div>`);
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

  function clearCheckoutDraft(){try{sessionStorage.removeItem(DRAFT);}catch{}}

  function removeBalance(root=document){
    $$('.summary-row',root).forEach(row=>{
      const label=$('span',row)?.textContent.trim().toLowerCase()||'';
      if(label.includes('saldo restante')||label.includes('saldo a pagar')||label==='balance')row.remove();
    });
  }

  function scrubWhatsAppBalance(root=document){
    $$('a[href*="wa.me"]',root).forEach(link=>{
      try{
        const url=new URL(link.href),text=url.searchParams.get('text');if(!text)return;
        const clean=text.replace(/\n\nSaldo restante:\n[^\n]*/gi,'').replace(/\n\nSaldo a pagar:\n[^\n]*/gi,'').replace(/\nSaldo restante[^\n]*/gi,'');
        url.searchParams.set('text',clean);link.href=url.toString();
      }catch{}
    });
  }

  function replaceStandardPresentation(form){
    const trigger=$('[data-journey="custom"]',form);if(!trigger)return;
    const field=trigger.closest('.field');if(!field)return;
    field.innerHTML='<span>Presentación</span><div class="checkout-presentation-v10"><b>Lata ANTOJO.</b><p>Presentación estándar. Para personalizar, inicia desde la opción “Personalizadas” del inicio.</p></div>';
  }

  function buildBlankPreview(form){
    const preview=$('.personal-preview',form);if(!preview||preview.dataset.v10==='true')return;
    preview.dataset.v10='true';
    const state=readState(),stage=$('.can-stage',preview);
    if(stage)stage.innerHTML=`<div class="blank-can-v10"><div class="blank-can-v10-art"><span data-custom-copy-v10>${escapeHTML(state.custom?.text||'TU FRASE')}</span><img data-custom-logo-v10 ${state.custom?.logoData?`src="${state.custom.logoData}"`:'hidden'} alt="Logo cargado"></div></div>`;
    const title=$('h3',preview),paragraph=$('p',preview);
    if(title)title.textContent='Tu lata, sin el logo de ANTOJO.';
    if(paragraph)paragraph.textContent='Usa una frase breve de hasta tres renglones o carga un logo. El arte final se revisa contigo antes de producir.';
    const input=$('[name="customText"]',form);
    if(input){input.maxLength=90;input.setAttribute('rows','3');input.setAttribute('placeholder','Ej. Ana + Luis · 21.11.26');}
  }

  function enhanceCheckout(){
    const form=$('#checkoutForm');if(!form)return;
    const state=readState(),journey=state.journey||'order';
    form.classList.add('checkout-v9','checkout-v10',`checkout-v10-${journey}`);
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
    if(journey==='order'||journey==='')replaceStandardPresentation(form);
    if(journey==='custom'||(journey==='event'&&state.event?.personalized))buildBlankPreview(form);
    scrubWhatsAppBalance(form);
    registerReveal(form);
  }

  function registerReveal(root=document){
    const selector='.hero-v9-copy>*,.hero-v9-cans,.hero-v9-actions,.section-heading,.need-card,.mini-product,.package-card,.how-v9-card,.plan-v9,.faq-list details,.social-stage-v9,.product-card,.menu-footer-v9,.cart-page>*,.checkout-page>*,.flow-content-v10>*';
    const nodes=root.matches?.(selector)?[root,...$$(selector,root)]:$$(selector,root);
    nodes.forEach((node,index)=>{
      if(node.classList.contains('v10-reveal'))return;
      node.classList.add('v10-reveal');
      node.style.setProperty('--v10-delay',`${(index%5)*45}ms`);
      revealObserver?.observe(node);
      const rect=node.getBoundingClientRect();
      if(rect.top<window.innerHeight*1.05&&rect.bottom>-20)requestAnimationFrame(()=>node.classList.add('is-v10-visible'));
    });
  }

  function setupReveal(){
    revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-v10-visible');revealObserver.unobserve(entry.target);}
    }),{root:null,threshold:.03,rootMargin:'10% 0px -4% 0px'});
    registerReveal(document);
  }

  function setupLeftTrail(){
    const stage=$('.brand-stage');
    if(!stage||!window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    stage.addEventListener('pointermove',event=>{
      const now=performance.now();if(now-trailLast<92)return;trailLast=now;
      const rect=stage.getBoundingClientRect(),image=document.createElement('img');
      image.className='can-trail-v10';image.src=CAN_IMAGES[trailIndex%CAN_IMAGES.length];image.alt='';
      image.style.left=`${event.clientX-rect.left}px`;image.style.top=`${event.clientY-rect.top}px`;
      image.style.setProperty('--r',`${(trailIndex++%2?1:-1)*(5+trailIndex%7)}deg`);
      stage.appendChild(image);window.setTimeout(()=>image.remove(),950);
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
    document.addEventListener('click',event=>{
      const journey=event.target.closest('[data-journey]');
      if(!journey)return;
      const allowed=journey.matches('.need-card[data-journey],.hero-card-v10 [data-journey]');
      if(!allowed){event.preventDefault();event.stopImmediatePropagation();}
    },true);

    document.addEventListener('pointerdown',event=>{
      if(event.target.closest('#checkoutForm [data-fulfillment],#checkoutForm [name="dateUnknown"],#checkoutForm [name="customSize"]'))captureCheckoutDraft();
    },true);

    document.addEventListener('click',event=>{
      const focus=event.target.closest('[data-v10-focus]');
      if(focus){event.preventDefault();event.stopImmediatePropagation();focusNeed(focus.dataset.v10Focus);return;}
      const favorites=event.target.closest('[data-v10-home-favorites]');
      if(favorites){event.preventDefault();event.stopImmediatePropagation();$('[data-route="home"]')?.click();window.setTimeout(()=>$('#favorites')?.scrollIntoView({behavior:'smooth',block:'start'}),120);return;}
      const dot=event.target.closest('[data-social-dot-v10]');
      if(dot){showSocial(Number(dot.dataset.socialDotV10)||0);startSocial();return;}
      const exact=event.target.closest('[data-exact-qty-v10]');
      if(exact){
        event.preventDefault();
        const input=$('#exactQtyV10'),value=Math.min(2000,Math.max(1,Math.round(Number(input?.value)||1)));
        const proxy=document.createElement('button');proxy.type='button';proxy.hidden=true;proxy.dataset.sheetQty=String(value);
        document.body.appendChild(proxy);proxy.click();proxy.remove();if(input)input.value=String(value);return;
      }
      if(event.target.closest('[data-new-order]'))clearCheckoutDraft();
      if(event.target.closest('#submitButton'))captureCheckoutDraft();
    },true);

    document.addEventListener('input',event=>{
      if(event.target.closest('#checkoutForm'))captureCheckoutDraft();
      if(event.target.matches('#checkoutForm [name="customText"]')){
        const copy=$('[data-custom-copy-v10]');if(copy)copy.textContent=(event.target.value||'TU FRASE').slice(0,90);
      }
    });

    document.addEventListener('change',event=>{
      if(event.target.closest('#checkoutForm'))captureCheckoutDraft();
      if(event.target.matches('#checkoutForm [name="logo"]')){
        const file=event.target.files?.[0];if(!file)return;
        const reader=new FileReader();
        reader.onload=()=>{const logo=$('[data-custom-logo-v10]');if(logo){logo.src=String(reader.result);logo.hidden=false;}};
        reader.readAsDataURL(file);
      }
    });
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
    watch('#productSheetContent',enhanceSheet);
    watch('#successContent',()=>{clearCheckoutDraft();removeBalance($('#successContent'));scrubWhatsAppBalance($('#successContent'));registerReveal($('#successContent'));});
  }

  function start(){
    bootLoader();
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
    window.setTimeout(()=>{enhanceCheckout();enhanceSheet();buildMenuFooter();removeBalance();ensureFavoriteMotion();},140);
    window.setTimeout(()=>{registerReveal(document);ensureFavoriteMotion();},900);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
