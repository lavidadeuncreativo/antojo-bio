(()=>{
  'use strict';
  const VERSION = '6';
  const loadStyle = href => {
    if (document.querySelector(`link[href^="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${href}?v=${VERSION}`;
    document.head.appendChild(link);
  };
  const loadScript = src => new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src^="${src}"]`);
    if (existing) return existing.dataset.loaded === '1' ? resolve() : existing.addEventListener('load', resolve, {once:true});
    const script = document.createElement('script');
    script.src = `${src}?v=${VERSION}`;
    script.onload = () => { script.dataset.loaded = '1'; resolve(); };
    script.onerror = reject;
    document.head.appendChild(script);
  });
  const sequence = sources => sources.reduce((promise, source) => promise.then(() => loadScript(source)), Promise.resolve());
  const fail = error => {
    console.error('ANTOJO clean bootstrap failed', error);
    const node = document.getElementById('toast');
    if (node) {
      node.textContent = 'No pudimos cargar la aplicación. Recarga la página.';
      node.classList.add('show');
    }
  };

  loadStyle('/clean-personalizer.css');
  sequence([
    '/clean-render-data-01.js','/clean-render-data-02.js','/clean-render-data-03.js',
    '/clean-render-data-04.js','/clean-render-data-05.js','/clean-render-data-06.js',
    '/clean-render-sprite.js'
  ])
    .then(() => window.ANTOJO_RENDER_READY)
    .then(() => loadScript('/clean-experiences.js'))
    .then(() => loadScript('/clean-payload-map.js'))
    .then(() => loadScript('/clean-personalizer.js'))
    .then(() => loadScript('/clean-render-bind.js'))
    .then(() => loadScript('/clean-init-core.js'))
    .then(() => window.ANTOJO?.applyRenderMap?.())
    .catch(fail);
})();
