(()=>{
  'use strict';
  window.setTimeout(()=>{
    const loader=document.getElementById('loader');
    if(loader&&!loader.classList.contains('v9-done'))loader.classList.remove('hide');
  },1080);
})();
