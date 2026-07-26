const assert = require('node:assert/strict');
const fs = require('node:fs');

const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const build = fs.readFileSync('build.js', 'utf8');

assert.equal(app.includes('+$10'), false, 'app.js no debe cobrar +$10 automáticamente');
assert.equal(html.includes('+$10'), false, 'index.html no debe mostrar +$10 automáticamente');
assert.match(app, /data-order-purpose/, 'el pedido debe preguntar para qué es');
assert.match(app, /items: false, context: false/, 'fulfillment debe actualizar configuración sin reconstruir bebidas');
assert.match(app, /Personalización: .*por cotizar/s, 'WhatsApp debe marcar personalización por cotizar');
assert.match(app, /Tipo de pedido:/, 'WhatsApp debe incluir el tipo de pedido');
assert.match(app, /eventQuoteDirect/, 'el flujo de eventos debe permitir cotizar sin elegir sabores');
assert.equal(build.includes('replace('), false, 'el build no debe parchear HTML con replace');
assert.equal(build.includes('mobile-shipping-audit'), false, 'el build no debe concatenar el parche móvil anterior');

console.log('✓ Regresiones de pedido y personalización validadas');
