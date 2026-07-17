const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (condition, message) => {
  if (!condition) {
    console.error(`✖ ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`✓ ${message}`);
  }
};

const index = read('index.html');
const cleanApp = read('clean.js');
const cleanStyles = read('clean.css');
const serviceWorker = read('sw.js');
const submit = read('api/submit.js');

assert(index.includes('/clean.css'), 'El frontend limpio carga clean.css');
assert(index.includes('/clean.js'), 'El frontend limpio carga clean.js');
assert(index.includes('id="menu"'), 'El menú forma parte de la portada única');
assert(!index.includes('data-screen="menu"'), 'El menú ya no vive en una pantalla separada');
assert(!index.includes('class="bottom-nav"'), 'La navegación inferior de tres pantallas fue retirada');
assert(!index.includes('v5-final.js') && !index.includes('v9-final.js'), 'Las capas funcionales antiguas ya no se cargan');
assert(!index.includes('v4-app-01.js'), 'La aplicación anterior ya no se inicializa');
assert(cleanStyles.length > 1000, 'La hoja de estilos limpia contiene la interfaz completa');
assert(cleanApp.includes("const STORE='antojo_clean_state_v1'"), 'Existe persistencia local de la nueva versión');
assert(cleanApp.includes("fetch('/api/submit'"), 'La app registra pedidos mediante el backend');
assert(cleanApp.includes("if(name==='menu')"), 'Los CTA del menú regresan a la portada única');
assert(cleanApp.includes('https://wa.me/5215522026291'), 'WhatsApp apunta al número correcto');
assert(cleanApp.includes("if(n<=5)return{unit:65"), 'Precio de 1 a 5 piezas configurado');
assert(cleanApp.includes("if(n<=20)return{unit:60"), 'Precio de 6 a 20 piezas configurado');
assert(cleanApp.includes("if(n<=50)return{unit:55"), 'Precio de 21 a 50 piezas configurado');
assert(!cleanApp.includes('NOTION_TOKEN'), 'El secreto de Notion no está expuesto en el frontend');
assert(serviceWorker.includes('unregister'), 'El service worker anterior se retira del navegador');
assert(submit.includes('process.env.NOTION_TOKEN'), 'El backend usa un secreto de servidor');
assert(submit.includes('119298bb-476d-40f3-b8f0-eab4c5bd5d8a'), 'El backend apunta a la bandeja correcta de Notion');
assert(submit.includes("'Notion-Version':NOTION_VERSION") || submit.includes("'Notion-Version': NOTION_VERSION"), 'La API de Notion está versionada');

if (process.exitCode) process.exit(process.exitCode);
console.log('\nANTOJO. clean frontend smoke checks passed.');
