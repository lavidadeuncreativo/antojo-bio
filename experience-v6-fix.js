(()=>{
  'use strict';

  const closeLoader=()=>{
    const loader=document.getElementById('loader');
    if(!loader)return;
    loader.classList.add('is-release-ready','hide');
    document.documentElement.classList.remove('antojo-loading');
    document.documentElement.classList.add('antojo-entered');
  };

  window.setTimeout(closeLoader,window.matchMedia('(prefers-reduced-motion: reduce)').matches?160:2480);

  document.addEventListener('click',event=>{
    if(!event.target.closest('[data-product]'))return;
    document.getElementById('productSheetContent')?.removeAttribute('data-v6-enhanced');
  },true);
})();
