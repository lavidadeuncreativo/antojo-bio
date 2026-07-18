(()=>{
  'use strict';

  const RELEASE='antojo-app-v11-20260718-1';
  const JS_PARTS=['/bundles/app-js-00.b64','/bundles/app-js-01.b64','/bundles/app-js-02.b64','/bundles/app-js-03.b64'];
  const CSS_PARTS=['/bundles/app-css-00.b64','/bundles/app-css-01.b64'];
  const JS_HASH='59433b7ce5afb77f389ad937f346bf53bb06d68c1eb33803b12a1bf29c58414f';
  const CSS_HASH='12145a80ba9682a9ec1a4f9bcd37e956b156dc0411b192c22aadbe76e7460590';

  function fatal(error){
    console.error('[ANTOJO bootstrap]',error);
    document.documentElement.classList.remove('is-loading');
    document.body.innerHTML='<main style="min-height:100vh;display:grid;place-items:center;padding:32px;background:#fffaf3;font-family:system-ui;text-align:center"><div><b style="color:#d43824;font-size:42px">ANTOJO.</b><h1>No pudimos abrir la página.</h1><p>Recarga para intentarlo de nuevo. Si continúa, escríbenos por Instagram.</p><button onclick="location.reload()" style="border:0;border-radius:999px;background:#151311;color:#fff;padding:14px 22px;font-weight:800">Recargar</button></div></main>';
  }

  async function fetchParts(paths){
    const responses=await Promise.all(paths.map(path=>fetch(`${path}?v=${RELEASE}`,{cache:'no-store'})));
    for(const response of responses)if(!response.ok)throw new Error(`No se pudo cargar ${response.url}`);
    return (await Promise.all(responses.map(response=>response.text()))).join('');
  }

  function base64Bytes(value){
    const binary=atob(value.trim());
    const bytes=new Uint8Array(binary.length);
    for(let index=0;index<binary.length;index+=1)bytes[index]=binary.charCodeAt(index);
    return bytes;
  }

  async function ungzip(base64){
    if(typeof DecompressionStream!=='function')throw new Error('Este navegador necesita una versión más reciente.');
    const stream=new Blob([base64Bytes(base64)]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Response(stream).text();
  }

  async function hash(value){
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
    return Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');
  }

  async function start(){
    try{
      if(!window.ANTOJO_PRICING)throw new Error('No se cargaron las reglas comerciales.');
      const [js64,css64]=await Promise.all([fetchParts(JS_PARTS),fetchParts(CSS_PARTS)]);
      const [javascript,css]=await Promise.all([ungzip(js64),ungzip(css64)]);
      const [jsHash,cssHash]=await Promise.all([hash(javascript),hash(css)]);
      if(jsHash!==JS_HASH||cssHash!==CSS_HASH)throw new Error('La versión descargada no pasó la validación de integridad.');
      const style=document.createElement('style');
      style.dataset.antojoRelease=RELEASE;
      style.textContent=css;
      document.head.appendChild(style);
      const script=document.createElement('script');
      script.dataset.antojoRelease=RELEASE;
      script.textContent=javascript;
      document.body.appendChild(script);
    }catch(error){fatal(error);}
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
