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
const app = read('v4-app-01.js');
const finalLayer = read('v5-final.js');
const submit = read('api/submit.js');

assert(index.includes('v5-final.css'), 'La capa final de estilos está cargada');
assert(index.includes('v5-final.js'), 'La capa funcional final está cargada');
assert(index.includes('manifest.webmanifest'), 'El manifest está vinculado');
assert(app.includes("WHATSAPP_NUMBER='5215522026291'"), 'WhatsApp apunta al número correcto');
assert(app.includes("if(q<=5)return{unit:65"), 'Precio de 1 a 5 piezas configurado');
assert(app.includes("if(q<=20)return{unit:60"), 'Precio de 6 a 20 piezas configurado');
assert(app.includes("if(q<=50)return{unit:55"), 'Precio de 21 a 50 piezas configurado');
assert(finalLayer.includes('localStorage'), 'Existe persistencia local del pedido');
assert(finalLayer.includes('NOTION') === false, 'El token de Notion no está expuesto en el frontend');
assert(finalLayer.includes("fetch('/api/submit'"), 'La app envía solicitudes al backend');
assert(submit.includes("process.env.NOTION_TOKEN"), 'El backend usa un secreto de servidor');
assert(submit.includes('119298bb-476d-40f3-b8f0-eab4c5bd5d8a'), 'El backend apunta a la bandeja de Notion correcta');
assert(submit.includes("'Notion-Version': NOTION_VERSION"), 'La API de Notion está versionada');

if (process.exitCode) process.exit(process.exitCode);
console.log('\nANTOJO. smoke checks passed.');
