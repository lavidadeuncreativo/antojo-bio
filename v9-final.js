(()=>{
  'use strict';

  const $9=(selector,root=document)=>root.querySelector(selector);
  const $$9=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const home=$9('#homeScreen');
  if(!home)return;

  const originalPersonal=$9('[data-v8-journey="personal"]');
  const originalEvent=$9('[data-v8-journey="event"]');
  const custom={step:0,type:'logo',use:'Evento',qty:Number(state.eventTarget||50),idea:''};

  function buildHome(){
    const hero=$9('.home-hero',home);
    const oldNeedsTitle=[...$$9('.section-row',home)].find(row=>row.textContent.includes('¿Qué necesitas?'));
    const oldNeeds=$9('.v8-journey-card',home);
    const how=$9('.v8-how',home);
    const marquee=$9('.v8-home-marquee',home);
    const instagram=$9('.v8-instagram',home);
    const faq=$9('.v8-faq',home);
    const zeroStrip=$9('#zeroStrip',home);

    const heroButton=$9('.hero-action',hero);
    if(heroButton)heroButton.textContent='Ver menú →';
    $9('.hero-cans',hero)?.classList.add('v9-float');

    if(!home.querySelector('.v9-quicknav')){
      const nav=document.createElement('nav');
      nav.className='v9-quicknav v8-reveal v8-visible';
      nav.innerHTML='<button data-v9-jump="how">Cómo funciona</button><button data-v9-jump="needs">Qué necesitas</button><button data-v9-jump="favorites">Favoritos</button><button data-v9-jump="faq">FAQ</button><button data-v9-jump="instagram">Instagram</button>';
      hero.after(nav);
    }

    if(how){
      how.id='v9How';how.classList.add('v9-how');
      const title=$9('h2',how);if(title)title.textContent='Así de fácil';
      const cards=$9('.v8-how-grid',how);
      if(cards)cards.innerHTML='<article class="v8-how-card"><span>01</span><b>Elige tu situación</b><small>Pedido pequeño, evento o personalizadas.</small></article><article class="v8-how-card"><span>02</span><b>Explora el menú</b><small>Combina sabores y cantidades sin perderte.</small></article><article class="v8-how-card"><span>03</span><b>Te acompañamos</b><small>Registramos tu folio y te contactamos para cerrarlo bien.</small></article>';
      const quick=$9('.v9-quicknav',home);quick?.after(how);
    }

    if(oldNeedsTitle){oldNeedsTitle.id='v9NeedsTitle';oldNeedsTitle.classList.add('v9-needs-title')}
    if(oldNeeds){
      oldNeeds.id='v9Needs';oldNeeds.className='v9-needs v8-reveal v8-visible';
      oldNeeds.innerHTML='<div class="v9-needs-grid"><button class="v9-need small" data-v9-journey="small"><small>Para un plan chico o pedido directo</small><b>Quiero hacer un pedido pequeño</b><p>Ve precios por cantidad, elige sabores y pide fácil.</p><i>→</i></button><button class="v9-need event" data-v9-journey="event"><small>Con invitados, fecha o logística</small><b>Estoy planeando un evento</b><p>Te guiamos para estimar bebidas y organizar el plan.</p><i>→</i></button><button class="v9-need custom" data-v9-journey="custom"><span><small>Con logo, frase o identidad</small><b>Quiero bebidas personalizadas</b><p>Para una boda, una marca, regalos o algo más especial.</p></span><i>→</i></button></div><div class="v9-direct"><span>¿Solo quieres explorar?</span><button type="button" data-go="menu">Ir directo al menú</button></div><div class="occasion-strip" id="occasionStrip" hidden></div>';
    }

    const favoriteHeading=[...$$9('.section-row',home)].find(row=>row.textContent.includes('Los favoritos'));
    if(favoriteHeading)favoriteHeading.id='v9Favorites';

    if(marquee&&instagram){
      marquee.id='v9Marquee';marquee.classList.add('v9-marquee');
      const copy=$9('.logo-copy',marquee);
      if(copy)copy.innerHTML='<span>ANTOJO.</span><strong>perfecto para planes pequeños o grandes.</strong>';
      instagram.before(marquee);
    }

    if(instagram){
      instagram.id='v9Instagram';instagram.classList.add('v9-instagram');
      const span=$9('span',instagram),bold=$9('b',instagram),small=$9('small',instagram);
      if(span)span.textContent='Sigue nuestra historia en Instagram';
      if(bold)bold.textContent='@antojo.bebidas';
      if(small)small.textContent='Ahí compartimos pruebas, pedidos, nuevos sabores y cómo va creciendo este proyecto.';
    }

    if(faq){
      faq.id='v9Faq';faq.classList.add('v9-faq');
      const list=$9('.v8-faq-list',faq);
      if(list)list.innerHTML='<details><summary>¿Cómo nació ANTOJO.?</summary><p>Nació como un proyecto para vender bebidas frías listas para tomar y construir algo propio paso a paso. Preferimos enseñar el proceso real y crecer bien.</p></details><details><summary>¿Por qué casi siempre entregan fines de semana?</summary><p>Porque hoy concentramos la producción y las entregas para cuidar mejor cada lote. Los pedidos entre semana se pueden revisar según fecha y cantidad.</p></details><details><summary>¿Cuánto duran las bebidas?</summary><p>Deben mantenerse refrigeradas y recomendamos consumirlas lo más frescas posible. Al confirmar el pedido te indicamos el rango adecuado según los sabores elegidos.</p></details><details><summary>¿Qué precio tienen?</summary><p>De 1 a 5 piezas cuestan $65 c/u; de 6 a 20, $60 c/u; y de 21 a 50, $55 c/u. Más de 50 piezas, personalización o logística especial pasan a cotización.</p></details><details><summary>¿Puedo pedirlas con mi logo, frase o identidad?</summary><p>Sí. Puedes pedir una frase, nombre, logo o concepto visual. Primero registramos la idea y después revisamos contigo la prueba final antes de producir.</p></details><details><summary>¿Puedo recoger o pedir entrega?</summary><p>Puedes recoger en la zona WTC · Polyforum. También hay entrega a domicilio desde 10 bebidas, sujeta a ruta, fecha y horario.</p></details>';
      if(!home.querySelector('.v9-trust')){
        faq.insertAdjacentHTML('afterend','<div class="v9-trust v8-reveal v8-visible"><section class="v9-review"><span class="mini-kicker">Reseñas</span><h3>¿Ya lo probaste?</h3><p>Déjanos una calificación rápida y cuéntanos cómo te fue.</p><div class="v9-stars"><button data-v9-rating="1">★</button><button data-v9-rating="2">★</button><button data-v9-rating="3">★</button><button data-v9-rating="4">★</button><button data-v9-rating="5">★</button></div></section><section class="v9-club"><span class="mini-kicker">Próximamente</span><h3>ANTOJO. Club</h3><p>Pedidos que suman, acceso temprano y recompensas que sí se antojan.</p><button data-v9-club>Quiero enterarme</button></section></div>');
      }
    }

    bindHome();
    slowExistingLoops();
    setupParallax();
  }

  function bindHome(){
    $$9('[data-v9-jump]',home).forEach(button=>button.onclick=()=>{
      const map={how:'#v9How',needs:'#v9NeedsTitle',favorites:'#v9Favorites',faq:'#v9Faq',instagram:'#v9Instagram'};
      $9(map[button.dataset.v9Jump])?.scrollIntoView({behavior:'smooth',block:'start'});
    });
    $$9('[data-v9-journey]',home).forEach(button=>button.onclick=()=>{
      const kind=button.dataset.v9Journey;
      if(kind==='small')originalPersonal?.click();
      if(kind==='event')originalEvent?.click();
      if(kind==='custom')openCustom();
    });
    $$9('[data-go]',home).forEach(button=>button.onclick=()=>showScreen(button.dataset.go));
    $$9('[data-v9-rating]',home).forEach(button=>button.onclick=()=>{
      const text=`Hola ANTOJO. Ya probé sus bebidas y mi calificación es ${button.dataset.v9Rating}/5 ⭐. Quiero contarles cómo me fue:`;
      if(typeof openWhatsAppText==='function')openWhatsAppText(text);
    });
    $9('[data-v9-club]',home)?.addEventListener('click',()=>{
      if(typeof openWhatsAppText==='function')openWhatsAppText('Hola ANTOJO. Quiero enterarme cuando lancen ANTOJO. Club 👀');
    });
  }

  function setupParallax(){
    const hero=$9('.home-hero',home);if(!hero||window.matchMedia('(max-width:900px)').matches)return;
    const cans=$$9('.hero-cans img',hero);
    hero.addEventListener('mousemove',event=>{
      const box=hero.getBoundingClientRect(),x=(event.clientX-box.left)/box.width-.5,y=(event.clientY-box.top)/box.height-.5;
      cans.forEach((img,index)=>img.style.transform=`translate3d(${x*(index+1)*8}px,${-y*(index+1)*7}px,0)`);
    });
    hero.addEventListener('mouseleave',()=>cans.forEach(img=>img.style.transform=''));
  }

  function slowExistingLoops(){
    ['#featuredStrip','#eventStrip','#zeroStrip'].forEach(selector=>{
      const strip=$9(selector);if(!strip||strip.dataset.v9Limiter==='1')return;
      strip.dataset.v9Limiter='1';let previous=strip.scrollLeft,manualUntil=0;
      const manual=()=>manualUntil=performance.now()+2600;
      strip.addEventListener('pointerdown',manual,{passive:true});strip.addEventListener('wheel',manual,{passive:true});strip.addEventListener('touchstart',manual,{passive:true});
      const tick=now=>{
        const current=strip.scrollLeft,delta=current-previous;
        if(now>manualUntil&&delta>0&&delta<3){strip.scrollLeft=current-delta*.74}
        previous=strip.scrollLeft;
        if(strip.isConnected)requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  function ensureCustom(){
    if($9('#v9Custom'))return;
    $9('#appShell')?.insertAdjacentHTML('beforeend','<div class="v9-custom-backdrop" id="v9Custom"><section class="v9-custom-panel" role="dialog" aria-modal="true"><header class="v9-custom-head"><div><span>BEBIDAS PERSONALIZADAS</span><h2>Cuéntanos tu idea.</h2></div><button id="v9CustomClose" aria-label="Cerrar">×</button></header><div class="v9-custom-progress"><i></i><i></i><i></i></div><div class="v9-custom-body" id="v9CustomBody"></div><footer class="v9-custom-actions"><button class="secondary-btn" id="v9CustomBack">Atrás</button><button class="primary-btn" id="v9CustomNext">Continuar</button></footer></section></div>');
    $9('#v9CustomClose').onclick=closeCustom;
    $9('#v9Custom').addEventListener('click',event=>{if(event.target.id==='v9Custom')closeCustom()});
  }

  function openCustom(){custom.step=0;custom.qty=Number(state.eventTarget||50);custom.idea=state.personalizationText||'';ensureCustom();renderCustom();$9('#v9Custom').classList.add('open');$9('#bottomNav')?.classList.remove('visible')}
  function closeCustom(){$9('#v9Custom')?.classList.remove('open');if(['home','menu','cart'].includes(state.screen))$9('#bottomNav')?.classList.add('visible')}

  function renderCustom(){
    const body=$9('#v9CustomBody');if(!body)return;
    $$9('.v9-custom-progress i').forEach((item,index)=>item.classList.toggle('active',index<=custom.step));
    $9('#v9CustomBack').style.visibility=custom.step===0?'hidden':'visible';
    $9('#v9CustomNext').textContent=custom.step===2?'Elegir bebidas':'Continuar';
    if(custom.step===0){
      body.innerHTML='<div class="v8-step-kicker">Paso 1 de 3</div><h3>¿Qué quieres personalizar?</h3><p class="v9-custom-help">Puede ser una frase, un nombre, un logo o una identidad más completa.</p><div class="v9-choice-grid"><button class="v9-choice '+(custom.type==='phrase'?'selected':'')+'" data-v9-type="phrase"><b>Frase o nombre</b><small>Ideal para bodas, regalos o detalles.</small></button><button class="v9-choice '+(custom.type==='logo'?'selected':'')+'" data-v9-type="logo"><b>Logo</b><small>Para una marca, empresa o evento.</small></button><button class="v9-choice '+(custom.type==='identity'?'selected':'')+'" data-v9-type="identity"><b>Identidad visual</b><small>Cuando necesitas algo más producido.</small></button></div>';
      $$9('[data-v9-type]',body).forEach(button=>button.onclick=()=>{custom.type=button.dataset.v9Type;renderCustom()});
    }
    if(custom.step===1){
      body.innerHTML='<div class="v8-step-kicker">Paso 2 de 3</div><h3>¿Para qué y cuántas?</h3><p class="v9-custom-help">No necesitas tener todo definido; solo danos una referencia útil.</p><div class="v9-choice-grid"><button class="v9-choice '+(custom.use==='Evento'?'selected':'')+'" data-v9-use="Evento"><b>Evento</b><small>Boda, cumpleaños o reunión.</small></button><button class="v9-choice '+(custom.use==='Marca'?'selected':'')+'" data-v9-use="Marca"><b>Marca o empresa</b><small>Regalo, activación o experiencia.</small></button><button class="v9-choice '+(custom.use==='Regalo'?'selected':'')+'" data-v9-use="Regalo"><b>Regalo</b><small>Un detalle personalizado.</small></button><button class="v9-choice '+(custom.use==='Otro'?'selected':'')+'" data-v9-use="Otro"><b>Otro</b><small>Lo aterrizamos contigo.</small></button></div><div class="v9-preset">'+[10,25,50,100].map(q=>`<button class="${custom.qty===q?'selected':''}" data-v9-qty="${q}">${q}</button>`).join('')+'</div><label class="v9-field"><span>Otra cantidad</span><input id="v9CustomQty" type="number" min="1" value="'+custom.qty+'"></label>';
      $$9('[data-v9-use]',body).forEach(button=>button.onclick=()=>{custom.use=button.dataset.v9Use;renderCustom()});
      $$9('[data-v9-qty]',body).forEach(button=>button.onclick=()=>{custom.qty=Number(button.dataset.v9Qty);renderCustom()});
      $9('#v9CustomQty').oninput=event=>custom.qty=Math.max(1,Number(event.target.value||1));
    }
    if(custom.step===2){
      body.innerHTML='<div class="v8-step-kicker">Paso 3 de 3</div><h3>Bájalo a tierra tantito.</h3><p class="v9-custom-help">La frase final se trabaja en vertical sobre la lata. El arte definitivo siempre se revisa antes de producir.</p><label class="v9-field"><span>Frase, idea o indicaciones</span><textarea id="v9CustomIdea" placeholder="Ej. nombres, fecha, colores, frase, concepto...">'+escapeHtml(custom.idea)+'</textarea></label><label class="v9-field"><span>Fecha aproximada (opcional)</span><input id="v9CustomDate" type="date" value="'+(state.date||'')+'"></label>';
      $9('#v9CustomIdea').oninput=event=>custom.idea=event.target.value;
      $9('#v9CustomDate').onchange=event=>state.date=event.target.value;
    }
    $9('#v9CustomBack').onclick=()=>{custom.step=Math.max(0,custom.step-1);renderCustom()};
    $9('#v9CustomNext').onclick=()=>{if(custom.step<2){custom.step++;renderCustom();return}finishCustom()};
  }

  function finishCustom(){
    state.mode='quote';state.occasion='event';state.eventType='Bebidas personalizadas';state.eventPackage='Personalizado';state.eventTarget=Math.max(1,Number(custom.qty||1));state.eventGuests=state.eventTarget;state.fulfillment='';state.personalization=custom.type==='phrase'?'phrase':'logo';state.personalizationText=custom.idea;state.notes=[state.notes,`Uso: ${custom.use}`,custom.idea].filter(Boolean).join(' · ');
    try{localStorage.setItem('antojo_v9_custom',JSON.stringify({type:custom.type,use:custom.use,qty:custom.qty,idea:custom.idea}))}catch{}
    closeCustom();updateCartUI(false);showScreen('menu');setTimeout(()=>{renderEventPlanner();showToast('Listo. Ahora elige o ajusta tus bebidas.')},180);
  }

  const previousRenderEventPlanner=window.renderEventPlanner;
  window.renderEventPlanner=function(){
    previousRenderEventPlanner?.();
    if(state.eventType!=='Bebidas personalizadas')return;
    const root=$9('#eventPlanner');if(!root)return;
    root.innerHTML='<section class="v8-menu-context event"><div><span>PERSONALIZADAS · '+escapeHtml(custom.use||'TU IDEA')+'</span><b>'+Number(state.eventTarget||0)+' bebidas de referencia</b><small>'+escapeHtml(state.personalizationText||'Puedes elegir sabores y completar la idea en el checkout.')+'</small></div><button id="v9EditCustom">Editar idea</button><div class="v8-context-progress"><i style="width:'+Math.min(100,totalQty()/Math.max(1,state.eventTarget)*100)+'%"></i></div><em>'+totalQty()+' seleccionadas</em></section>';
    $9('#v9EditCustom').onclick=openCustom;
  };

  buildHome();
})();
