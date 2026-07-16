(()=>{
  'use strict';
  const A = window.ANTOJO;
  const map = window.ANTOJO_RENDER_MAP || {};
  A.applyRenderMap = () => {
    const bindings = {
      desktopCanA:'mojito-mariposa', desktopCanB:'espresso-horchata',
      onboardCanA:'maracuya', onboardCanB:'mojito-mariposa', onboardCanC:'horchata',
      heroCanA:'maracuya', heroCanB:'espresso-horchata', heroCanC:'mojito-mariposa'
    };
    Object.entries(bindings).forEach(([id, key]) => {
      const image = document.getElementById(id);
      if (image && map[key]) image.src = map[key];
    });
  };
  const inherited = A.personalizationStep;
  if (typeof inherited === 'function') {
    A.personalizationStep = label => inherited(label).replace('/assets/renders/horchata.webp', map.horchata || A.product('horchata')?.image || '');
  }
})();
