window.ANTOJO_RENDERS=window.ANTOJO_RENDERS||{};
(()=>{
  const r=window.ANTOJO_RENDERS;
  const copy=(target,source)=>{if(r[source])r[target]=r[source]};
  copy('mojito-mocktail','mojito-clasico');
  copy('mariposa-mocktail','mojito-mariposa');
  copy('jamaica-limon','mezcalita-jamaica');
  copy('pepino-limon','pepino-mezcal');
  copy('maracuya-limon','maracuya-mezcal');

  window.addEventListener('load',()=>{
    const currentUpdate=window.updateCartUI;
    if(typeof currentUpdate==='function'){
      window.updateCartUI=function(...args){
        const result=currentUpdate.apply(this,args);
        setTimeout(()=>window.renderEventPlanner?.(),110);
        return result;
      };
    }
    const currentShow=window.showScreen;
    if(typeof currentShow==='function'){
      window.showScreen=function(name){
        const result=currentShow.call(this,name);
        if(name==='menu')setTimeout(()=>window.renderEventPlanner?.(),290);
        return result;
      };
    }
  });
})();
