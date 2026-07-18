(()=>{
  'use strict';

  const style=document.createElement('style');
  style.dataset.softMobileGuard='true';
  style.textContent='@media(max-width:600px){.hero-v7-copy h1{max-width:none!important}.hero-v7-copy h1 span{white-space:nowrap}}';
  document.head.appendChild(style);

  const apply=()=>{
    document.documentElement.classList.add('v7-soft-mobile');

    const heroLead=document.querySelector('.hero-v7-lead');
    if(heroLead)heroLead.textContent='Listas para compartir: cítricas, cremosas, con café o con mezcal.';

    const needs=document.querySelector('#needs');
    if(needs){
      const heading=needs.querySelector('.section-heading');
      if(heading)heading.innerHTML='<p>ELIGE CÓMO EMPEZAR</p><h2>¿Qué necesitas?</h2><span>Elige lo que estás armando y te llevamos al camino correcto.</span>';

      const copy=[
        ['Pedido pequeño','Quiero unas bebidas','Para compartir, probar sabores o resolver un antojo de hoy.'],
        ['Evento','Estoy armando algo más grande','Cumple, reunión, oficina o cualquier plan con más personas.'],
        ['Personalizadas','Quiero latas con frase o logo','Para bodas, regalos, marcas o una ocasión especial.']
      ];

      [...needs.querySelectorAll('.need-card')].forEach((card,index)=>{
        const row=copy[index];
        if(!row)return;
        const small=card.querySelector('small');
        const strong=card.querySelector('strong');
        const paragraph=card.querySelector('p');
        if(small)small.textContent=row[0];
        if(strong)strong.textContent=row[1];
        if(paragraph)paragraph.textContent=row[2];
      });
    }
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();
