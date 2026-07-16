(()=>{
  'use strict';
  const loadStyle = href => {
    if (document.querySelector(`link[href^="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${href}?v=2`;
    document.head.appendChild(link);
  };
  const loadScript = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${src}?v=2`;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  loadStyle('/clean-personalizer.css');
  loadScript('/clean-personalizer.js')
    .then(() => loadScript('/clean-init-core.js'))
    .catch(error => {
      console.error('ANTOJO clean bootstrap failed', error);
      const node = document.getElementById('toast');
      if (node) {
        node.textContent = 'No pudimos cargar la aplicación. Recarga la página.';
        node.classList.add('show');
      }
    });
})();
