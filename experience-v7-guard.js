(()=>{
  'use strict';

  const css=`
    html.v7-entered .hero-v7-kicker,
    html.v7-entered .hero-v7-copy h1,
    html.v7-entered .hero-v7-lead,
    html.v7-entered .hero-v7-actions,
    html.v7-entered .hero-v7-note{animation:v7GuardEntry .82s cubic-bezier(.16,1,.3,1) both}
    html.v7-entered .hero-v7-copy h1{animation-delay:.08s}
    html.v7-entered .hero-v7-lead{animation-delay:.15s}
    html.v7-entered .hero-v7-actions{animation-delay:.22s}
    html.v7-entered .hero-v7-note{animation-delay:.3s}
    html.v7-entered .hero-v7-cans{animation:v7GuardCans 1.05s .16s cubic-bezier(.16,1,.3,1) both}
    @keyframes v7GuardEntry{from{opacity:0;filter:blur(14px);transform:translateY(24px) scale(.98)}to{opacity:1;filter:none;transform:none}}
    @keyframes v7GuardCans{from{opacity:0;filter:blur(15px);transform:translateY(34px) rotate(5deg) scale(.9)}to{opacity:1;filter:none;transform:none}}
    .package-v7-1:after,.package-v7-2:after,.package-v7-3:after{content:'';position:absolute;right:-8px;bottom:-10px;width:188px;height:225px;pointer-events:none;background-repeat:no-repeat;filter:drop-shadow(0 20px 13px rgba(45,29,20,.2));transition:transform .7s cubic-bezier(.16,1,.3,1);z-index:1}
    .package-v7-1:after{background-image:url('/renders/03_mojito_clasico_te_de_mariposa.png'),url('/renders/05_horchata_espresso.png');background-size:90px 205px,90px 205px;background-position:100% 100%,48% 104%}
    .package-v7-2:after{background-image:url('/renders/03_mojito_clasico_te_de_mariposa.png'),url('/renders/09_maracuya.png'),url('/renders/13_mezcalita_de_jamaica.png');background-size:88px 205px,86px 200px,84px 196px;background-position:100% 100%,54% 104%,12% 108%}
    .package-v7-3:after{background-image:url('/renders/04_horchata.png');background-size:108px 220px;background-position:100% 100%}
    .package-v7-1:hover:after,.package-v7-2:hover:after,.package-v7-3:hover:after{transform:translateY(-10px) rotate(2deg)}
    .packages-v7 .package-card>*{position:relative;z-index:2}
    @media(max-width:370px){.package-v7-1:after,.package-v7-2:after,.package-v7-3:after{right:-20px;opacity:.8}}
  `;

  const style=document.createElement('style');
  style.dataset.experienceV7Guard='true';
  style.textContent=css;
  document.head.appendChild(style);

  function normalizePersonalization(){
    const form=document.querySelector('#checkoutForm');
    const input=form?.querySelector('[name="customText"]');
    if(!input||input.tagName==='TEXTAREA')return;
    const textarea=document.createElement('textarea');
    [...input.attributes].forEach(attribute=>textarea.setAttribute(attribute.name,attribute.value));
    textarea.value=input.value;
    textarea.maxLength=90;
    textarea.rows=3;
    textarea.placeholder='Ej. Ana + Luis · 21.11.26';
    input.replaceWith(textarea);
  }

  const observer=new MutationObserver(()=>normalizePersonalization());
  observer.observe(document.body,{childList:true,subtree:true});
  normalizePersonalization();
})();
