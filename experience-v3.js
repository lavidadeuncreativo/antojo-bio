(()=>{
  'use strict';

  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const PRODUCT_ROTATION=[
    {id:'mojito-mariposa',name:'Mojito mariposa',src:'/renders/03_mojito_clasico_te_de_mariposa.png'},
    {id:'espresso-horchata',name:'Espresso horchata',src:'/renders/05_horchata_espresso.png'},
    {id:'maracuya-mezcal',name:'Maracuyá con mezcal',src:'/renders/09_maracuya.png'},
    {id:'mezcalita-jamaica',name:'Mezcalita de jamaica',src:'/renders/13_mezcalita_de_jamaica.png'},
    {id:'horchata',name:'Horchata clásica',src:'/renders/04_horchata.png'},
    {id:'clericot',name:'Clericot',src:'/renders/08_clericot.png'}
  ];

  let nativeOrderClick=false;
  let orderContext='Para compartir';
  let socialTimer=0;
  let socialIndex=0;
  let revealObserver=null;
  let restartSocialRotation=()=>{};

  function splitName(name){
    const words=name.split(' ');
    if(words.length<2)return name;
    return `${words.slice(0,-1).join(' ')}<br>${words.at(-1)}`;
  }

  function setStaticCopy(){
    const desktopTitle=$('.brand-copy h1');
    if(desktopTitle){
      desktopTitle.innerHTML='<span class="brand-line">Porque cuando</span><span class="brand-line brand-line-emphasis">se antoja, se</span><span class="brand-line">antoja...</span>';
      desktopTitle.setAttribute('aria-label','Porque cuando se antoja, se antoja...');
    }

    const desktopInstagram=$('.desktop-instagram-card span');
    if(desktopInstagram)desktopInstagram.textContent='Seguir el proyecto ↗';

    const mobileTitle=$('.hero-card-v3 .hero-copy h1');
    if(mobileTitle){
      mobileTitle.innerHTML='<span>¿Qué se te</span><span>antoja hoy?</span>';
      mobileTitle.setAttribute('aria-label','¿Qué se te antoja hoy?');
    }

    const proof=$('.hero-card-v3 .hero-proof');
    if(proof){
      proof.innerHTML=[
        '<button type="button" data-section="packages">Ver paquetes</button>',
        '<button type="button" data-section="favorites">Favoritos</button>',
        '<button type="button" data-route="menu">+18 sabores</button>'
      ].join('');
      proof.setAttribute('aria-label','Atajos para explorar ANTOJO.');
    }

    const plan=$('.plan-marquee');
    if(plan){
      const chips=['Cumples','Reuniones','Sobremesas','Bodas','Oficina','Regalos','Antojos espontáneos'];
      plan.innerHTML=`
        <div class="plan-copy">
          <span>PARA LO QUE SE ARME</span>
          <strong>Va bien con casi cualquier plan.</strong>
          <p>Cumples, reuniones, sobremesas, bodas y antojos espontáneos.</p>
        </div>
        <div class="plan-chip-window" aria-label="Planes para pedir ANTOJO.">
          <div class="plan-chip-track">${[...chips,...chips].map(item=>`<b>${item}</b>`).join('')}</div>
        </div>`;
    }

    const how=$('#how');
    if(how){
      const heading=$('.section-heading',how);
      if(heading)heading.innerHTML='<p>SIN VUELTAS</p><h2>Pedir está fácil.</h2><span>Elige el tipo de pedido, arma tu selección y te confirmamos por WhatsApp.</span>';
      const grid=$('.how-grid',how);
      if(grid)grid.innerHTML=`
        <article><span>01</span><strong>Elige qué necesitas</strong><p>Pedido pequeño, evento o latas personalizadas.</p></article>
        <article><span>02</span><strong>Arma tu selección</strong><p>Elige sabores, cantidades y, si hace falta, personalización.</p></article>
        <article><span>03</span><strong>Registra y confirma</strong><p>Te damos un folio y te escribimos para cerrar detalles.</p></article>`;
    }

    const faq=$('#faq');
    if(faq){
      const heading=$('.section-heading',faq);
      if(heading)heading.innerHTML='<p>ANTES DE PEDIR</p><h2>Lo que normalmente nos preguntan.</h2><span>Precios, entregas, conservación y personalización, explicado sin letra chiquita.</span>';
      $$('.faq-list details',faq).forEach((detail,index)=>{
        detail.dataset.faqIndex=String(index+1).padStart(2,'0');
      });
    }
  }

  function setupDesktopCanRail(){
    const stage=$('.brand-stage');
    const cards=$$('.desktop-can',stage);
    if(!stage||cards.length<2||$('.desktop-can-rail',stage))return;

    const rail=document.createElement('div');
    rail.className='desktop-can-rail';
    rail.setAttribute('aria-hidden','true');
    cards.forEach((card,index)=>{
      card.classList.remove('desktop-can-a','desktop-can-b');
      card.classList.add('desktop-can-slot',`desktop-can-slot-${index+1}`);
      rail.appendChild(card);
    });
    stage.appendChild(rail);

    let cursor=2;
    let slot=0;
    const updateSlot=()=>{
      if(document.hidden||reduceMotion.matches)return;
      const card=cards[slot];
      const product=PRODUCT_ROTATION[cursor%PRODUCT_ROTATION.length];
      card.classList.add('is-exiting');
      window.setTimeout(()=>{
        const image=$('img',card);
        const label=$('b',card);
        if(image){
          image.src=product.src;
          image.dataset.render=product.id;
          image.alt='';
        }
        if(label)label.innerHTML=splitName(product.name);
        card.classList.remove('is-exiting');
        card.classList.add('is-entering');
        requestAnimationFrame(()=>requestAnimationFrame(()=>card.classList.remove('is-entering')));
        cursor+=1;
        slot=(slot+1)%cards.length;
      },520);
    };

    if(!reduceMotion.matches)window.setInterval(updateSlot,3400);
  }

  function buildWidgetStack(){
    const instagram=$('.instagram-card');
    const community=$('.community-grid')?.closest('.home-section');
    if(!instagram||!community||$('.social-widget-section'))return;

    const section=document.createElement('section');
    section.className='home-section social-widget-section';
    section.id='community';
    section.innerHTML=`
      <div class="section-heading">
        <p>DE ESTE LADO PASAN COSAS</p>
        <h2>Sigue el antojo.</h2>
        <span>Nuevos sabores, reseñas y pequeños avances del proyecto, en un solo lugar.</span>
      </div>
      <div class="widget-stack" role="region" aria-roledescription="carrusel" aria-label="Comunidad ANTOJO.">
        <article class="social-widget widget-instagram is-active" data-widget-index="0" aria-hidden="false">
          <div class="widget-topline"><span>Instagram</span><i>01</i></div>
          <div>
            <small>Sigue el proyecto</small>
            <h3>@antojo.bebidas</h3>
            <p>Pedidos, pruebas, nuevos sabores y cómo va creciendo ANTOJO.</p>
          </div>
          <a href="https://www.instagram.com/antojo.bebidas/" target="_blank" rel="noopener">Ir a Instagram <span>↗</span></a>
        </article>
        <article class="social-widget widget-reviews is-next" data-widget-index="1" aria-hidden="true">
          <div class="widget-topline"><span>Reseñas</span><i>02</i></div>
          <div>
            <small>Lo que nos dicen</small>
            <div class="widget-stars" aria-label="Cinco estrellas">★★★★★</div>
            <p class="widget-review-copy">Cuéntanos qué sabor pediste, cómo llegó y qué repetirías.</p>
          </div>
          <button type="button" data-rating="5">Contar mi experiencia <span>→</span></button>
        </article>
        <article class="social-widget widget-club is-back" data-widget-index="2" aria-hidden="true">
          <div class="widget-topline"><span>Comunidad</span><i>03</i></div>
          <div>
            <small>ANTOJO. Club</small>
            <h3>Lo nuevo, antes.</h3>
            <p>Drops, nuevos sabores y recompensas para quien regresa.</p>
          </div>
          <button type="button" id="clubButton">Quiero enterarme <span>→</span></button>
        </article>
      </div>
      <div class="widget-controls" aria-label="Cambiar widget">
        <button type="button" class="is-active" data-widget-dot="0" aria-label="Ver Instagram"></button>
        <button type="button" data-widget-dot="1" aria-label="Ver reseñas"></button>
        <button type="button" data-widget-dot="2" aria-label="Ver ANTOJO. Club"></button>
      </div>`;

    instagram.replaceWith(section);
    community.remove();
    setupWidgetRotation();
  }

  function setWidget(index){
    const widgets=$$('.social-widget');
    const dots=$$('[data-widget-dot]');
    if(!widgets.length)return;
    socialIndex=(index+widgets.length)%widgets.length;
    widgets.forEach((widget,i)=>{
      const offset=(i-socialIndex+widgets.length)%widgets.length;
      widget.classList.toggle('is-active',offset===0);
      widget.classList.toggle('is-next',offset===1);
      widget.classList.toggle('is-back',offset===2);
      widget.setAttribute('aria-hidden',offset===0?'false':'true');
      if(offset===0)widget.removeAttribute('inert');
      else widget.setAttribute('inert','');
    });
    dots.forEach((dot,i)=>dot.classList.toggle('is-active',i===socialIndex));
  }

  function setupWidgetRotation(){
    const section=$('.social-widget-section');
    if(!section)return;
    const start=()=>{
      window.clearInterval(socialTimer);
      if(reduceMotion.matches)return;
      socialTimer=window.setInterval(()=>setWidget(socialIndex+1),5200);
    };
    restartSocialRotation=start;
    const stop=()=>window.clearInterval(socialTimer);
    section.addEventListener('mouseenter',stop);
    section.addEventListener('mouseleave',start);
    section.addEventListener('focusin',stop);
    section.addEventListener('focusout',start);
    setWidget(0);
    start();
  }

  function openOrderExperience(){
    const modal=$('#flowModal');
    const root=$('#flowModalContent');
    if(!modal||!root)return;
    modal.classList.remove('experience-core-flow');
    modal.classList.add('open','experience-order-flow');
    root.innerHTML=`
      <div class="modal-top experience-modal-top">
        <div>
          <span class="step-label">PEDIDO PEQUEÑO · PASO 1 DE 1</span>
          <h2>¿Qué tipo de antojo vas a armar?</h2>
        </div>
        <button class="modal-close" type="button" data-experience-close aria-label="Cerrar">×</button>
      </div>
      ${journeySwitcher('order')}
      <div class="flow-progress flow-progress-order" aria-label="Progreso"><i class="active"></i></div>
      <p class="flow-intro">No cambia el precio ni te obliga a elegir un paquete. Solo nos ayuda a llevarte al menú con una idea más clara.</p>
      <div class="preference-grid experience-order-options">
        ${[
          ['Para mí','Quiero una o varias para disfrutar sin complicarme.'],
          ['Para compartir','Una reunión, sobremesa o plan pequeño.'],
          ['Para probar sabores','Quiero armar un mix y encontrar favoritos.']
        ].map(([title,copy])=>`<button type="button" class="${orderContext===title?'active':''}" data-order-context="${title}"><b>${title}</b><small>${copy}</small></button>`).join('')}
      </div>
      <div class="flow-summary"><b>${orderContext}</b><p>Después podrás mezclar sabores y cantidades libremente.</p></div>
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-experience-close>Cancelar</button>
        <button class="primary-button" type="button" data-experience-order-next>Ver sabores</button>
      </div>`;
    animateFlow(root);
  }

  function closeOrderExperience(){
    $('#flowModal')?.classList.remove('open','experience-order-flow');
  }

  function journeySwitcher(active){
    return `<div class="flow-journey-switcher" aria-label="Tipo de pedido">
      <button type="button" class="${active==='order'?'active':''}" data-experience-journey="order">Pedido</button>
      <button type="button" class="${active==='event'?'active':''}" data-experience-journey="event">Evento</button>
      <button type="button" class="${active==='custom'?'active':''}" data-experience-journey="custom">Personalizadas</button>
    </div>`;
  }

  function triggerNativeJourney(kind){
    closeOrderExperience();
    const trigger=document.createElement('button');
    trigger.type='button';
    trigger.hidden=true;
    trigger.dataset.journey=kind;
    document.body.appendChild(trigger);
    nativeOrderClick=kind==='order';
    trigger.click();
    nativeOrderClick=false;
    trigger.remove();
  }

  function decorateCoreFlow(){
    const modal=$('#flowModal');
    const root=$('#flowModalContent');
    if(!modal||!root||modal.classList.contains('experience-order-flow'))return;
    const label=$('.step-label',root)?.textContent||'';
    const active=label.includes('PERSONALIZADAS')?'custom':label.includes('EVENTO')?'event':'';
    if(!active)return;
    if(!$('.flow-journey-switcher',root)){
      const top=$('.modal-top',root);
      top?.insertAdjacentHTML('afterend',journeySwitcher(active));
      $$('.flow-progress i',root).forEach((item,index)=>item.setAttribute('aria-label',`Paso ${index+1}`));
    }
    modal.classList.add('experience-core-flow');
    animateFlow(root);
  }

  function animateFlow(root){
    if(reduceMotion.matches||typeof root.animate!=='function')return;
    root.getAnimations().forEach(animation=>animation.cancel());
    root.animate([
      {opacity:.35,filter:'blur(10px)',transform:'translateY(10px)'},
      {opacity:1,filter:'blur(0)',transform:'translateY(0)'}
    ],{duration:430,easing:'cubic-bezier(.16,1,.3,1)'});
  }

  function setupFlowObserver(){
    const root=$('#flowModalContent');
    if(!root)return;
    const observer=new MutationObserver(()=>requestAnimationFrame(decorateCoreFlow));
    observer.observe(root,{childList:true,subtree:false});
  }

  function setupEditorialReveal(){
    if(reduceMotion.matches)return;
    revealObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>entry.target.classList.toggle('is-inview',entry.isIntersecting));
    },{threshold:.08,rootMargin:'5% 0px -8% 0px'});
    registerReveal(document);

    const app=$('#appMain');
    if(app){
      const observer=new MutationObserver(mutations=>{
        mutations.forEach(mutation=>mutation.addedNodes.forEach(node=>{
          if(node.nodeType===1)registerReveal(node);
        }));
      });
      observer.observe(app,{childList:true,subtree:true});
    }
  }

  function registerReveal(root){
    const selector='.hero-copy > *, .need-card, .mini-product, .package-card, .plan-copy > *, .how-grid article, .social-widget-section .section-heading, .widget-stack, .faq-list details, .product-card, .journey-summary, .selection-tracker, .cart-line, .summary-card, .checkout-page > .field, .checkout-page > .field-grid';
    const nodes=root.matches?.(selector)?[root,...$$(selector,root)]:$$(selector,root);
    nodes.forEach((node,index)=>{
      if(node.classList.contains('editorial-reveal'))return;
      node.classList.add('editorial-reveal');
      node.style.setProperty('--reveal-delay',`${Math.min(index%6,5)*35}ms`);
      revealObserver?.observe(node);
    });
  }

  function bindExperience(){
    document.addEventListener('click',event=>{
      const journey=event.target.closest('[data-journey="order"]');
      if(journey&&!nativeOrderClick){
        event.preventDefault();
        event.stopImmediatePropagation();
        openOrderExperience();
        return;
      }
    },true);

    document.addEventListener('click',event=>{
      const context=event.target.closest('[data-order-context]');
      if(context){
        orderContext=context.dataset.orderContext;
        openOrderExperience();
        return;
      }
      if(event.target.closest('[data-experience-close]')){
        closeOrderExperience();
        return;
      }
      if(event.target.closest('[data-experience-order-next]')){
        triggerNativeJourney('order');
        return;
      }
      const switcher=event.target.closest('[data-experience-journey]');
      if(switcher){
        const kind=switcher.dataset.experienceJourney;
        if(kind==='order')openOrderExperience();
        else triggerNativeJourney(kind);
        return;
      }
      const dot=event.target.closest('[data-widget-dot]');
      if(dot){
        setWidget(Number(dot.dataset.widgetDot)||0);
        restartSocialRotation();
      }
    });

    document.addEventListener('visibilitychange',()=>{
      if(document.hidden)window.clearInterval(socialTimer);
      else restartSocialRotation();
    });

    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&$('#flowModal')?.classList.contains('experience-order-flow'))closeOrderExperience();
    });
  }

  function enhanceFaqCopy(){
    const faq=$('#faq');
    if(!faq)return;
    const entries=$$('.faq-list details',faq);
    const answers=[
      'Empezó como una idea para construir un negocio de bebidas y ayudar a pagar nuestra boda. Compartimos el proceso tal cual: pruebas, errores, primeras ventas y cada nuevo sabor.',
      'Concentramos la producción y las entregas para que las bebidas salgan frescas y podamos cuidar mejor cada lote. Entre semana sí podemos atender algunos pedidos y eventos; lo revisamos según fecha, cantidad y disponibilidad.',
      'Siempre se entregan frías. La duración cambia según el sabor, por eso al confirmar tu pedido te decimos cómo conservar cada bebida y cuándo conviene consumirla.',
      null,
      'Sí. En pedidos pequeños puedes mezclar sabores libremente. Para eventos normalmente conviene elegir dos o tres sabores estrella y sumar al menos una opción sin alcohol.',
      'Sí. Podemos trabajar una frase, nombres, fecha o un logo sencillo. Antes de producir revisamos contigo legibilidad, arte final, cantidad y costo.',
      'Puedes recoger en la zona WTC · Polyforum. La entrega está disponible desde 10 bebidas y se cotiza aparte según ubicación, fecha y horario.'
    ];
    entries.forEach((entry,index)=>{
      const answer=answers[index];
      if(answer&&$('p',entry))$('p',entry).textContent=answer;
    });
  }

  function init(){
    document.documentElement.classList.add('experience-v3');
    setStaticCopy();
    setupDesktopCanRail();
    buildWidgetStack();
    bindExperience();
    setupFlowObserver();
    setupEditorialReveal();
    window.setTimeout(()=>{
      setStaticCopy();
      enhanceFaqCopy();
      registerReveal(document);
    },180);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
