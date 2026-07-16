const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const exists = file => fs.existsSync(path.join(root, file));
const assert = (condition, message) => {
  if (!condition) {
    console.error(`✖ ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`✓ ${message}`);
  }
};

const index = read('index.html');
const data = read('clean-data.js');
const ui = read('clean-ui.js');
const journeys = read('clean-journeys.js');
const checkout = read('clean-checkout.js');
const personalizer = read('clean-personalizer.js');
const init = read('clean-init.js');
const core = read('clean-init-core.js');
const sprite = read('clean-render-sprite.js');
const submit = read('api/submit.js');

assert(index.includes('clean-styles-01.css') && index.includes('clean-styles-05.css'), 'La versión limpia carga únicamente su sistema visual consolidado');
assert(index.includes('clean-data.js') && index.includes('clean-init.js'), 'La aplicación limpia carga sus módulos principales');
assert(!/v[4-9]-(app|final|styles|render)/.test(index), 'El HTML limpio no ejecuta capas heredadas v4–v9');
assert(index.indexOf('id="needsSection"') < index.indexOf('id="howSection"'), '¿Qué necesitas? aparece antes de Así funciona');
assert(index.includes('Quiero pedir bebidas') && index.includes('Estoy planeando un evento') && index.includes('Quiero latas con frase o logo'), 'Las tres entradas situacionales están presentes');
assert(index.includes('Ver menú →'), 'El CTA principal dice Ver menú');
assert(index.includes('Sigue nuestra historia en Instagram'), 'Instagram está integrado como parte de la historia');
assert(index.includes('Preguntas frecuentes') && index.includes('ANTOJO. Club'), 'FAQ, reseñas y Club están incluidos');

assert(data.includes("if (q <= 5) return {unit:65"), 'Precio 1–5 configurado');
assert(data.includes("if (q <= 10) return {unit:60"), 'Precio 6–10 configurado');
assert(data.includes("if (q <= 20) return {unit:58"), 'Precio 11–20 configurado');
assert(data.includes("if (q <= 49) return {unit:55"), 'Precio 21–49 configurado');
assert(data.includes("A.isQuote = () => ['event','custom'].includes"), 'Eventos y personalizadas usan cotización');
assert(data.includes('localStorage.setItem(A.STORAGE_KEY'), 'El pedido tiene persistencia local');

assert(ui.includes('class AutoCarousel'), 'Existe un único controlador de carrusel');
assert(ui.includes('requestAnimationFrame(tick)'), 'Los carruseles usan animación continua');
assert(ui.includes('this.speed = 0.17'), 'La velocidad del carrusel es lenta');
assert(ui.includes("event.target.id === 'productModal'"), 'La ficha se cierra tocando el fondo');
assert(core.includes("event.key !== 'Escape'"), 'La ficha y modales se cierran con Escape');
assert(core.includes("$('#closeProductModal').onclick = A.closeProduct"), 'La ficha se cierra con el botón X');

assert(journeys.includes('Paso 1 de 4') && journeys.includes('Paso 4 de 4'), 'El recorrido de evento tiene cuatro pasos sin repetir checkout');
assert(journeys.includes('1.5 por persona'), 'El evento ofrece cobertura por persona');
assert(journeys.includes("state.journey = 'custom'"), 'Existe un recorrido específico para personalizadas');
assert(!journeys.includes('state.cart='), 'Los recorridos no reemplazan el carrito');

assert(!personalizer.includes('writing-mode') && read('clean-personalizer.css').includes('writing-mode:vertical-rl'), 'La frase personalizada se muestra vertical');
assert(personalizer.includes('phraseSizeField'), 'La frase permite cambiar de tamaño');
assert(personalizer.includes('Aviso de privacidad'), 'La interfaz incluye aviso de privacidad y condiciones');

assert(checkout.includes("fetch('/api/submit'"), 'La app registra solicitudes mediante el backend');
assert(checkout.includes('A.clearWorkingOrder();'), 'El carrito y el contexto se limpian después del registro');
assert(checkout.includes("$('#successWhatsapp').onclick"), 'WhatsApp queda como botón opcional');
assert(!checkout.includes('setTimeout(()=>{if(document.visibilityState'), 'WhatsApp no se abre automáticamente');
assert(checkout.includes('Seguir nuestra historia en Instagram'), 'La pantalla de éxito ofrece Instagram');
assert(checkout.includes('localStorage.setItem(A.PENDING_KEY'), 'Existe recuperación local cuando falla la red');

for (let index = 1; index <= 6; index += 1) {
  assert(exists(`clean-render-data-0${index}.js`), `Existe el bloque de renders ${index}/6`);
}
assert(init.includes("'/clean-render-data-01.js'") && init.includes("'/clean-render-data-06.js'"), 'El bootstrap carga todo el sprite exacto');
assert(sprite.includes("'mojito-mocktail':'mojito-clasico'"), 'Un render puede alimentar variantes con y sin alcohol');
assert(sprite.includes('canvas.toDataURL'), 'Los renders compartidos se separan en imágenes individuales');

const frontend = [data, ui, journeys, checkout, personalizer, init, core, sprite].join('\n');
assert(!frontend.includes('NOTION_TOKEN'), 'El token de Notion no está expuesto en frontend');
assert(submit.includes('process.env.NOTION_TOKEN'), 'El backend usa el secreto de Notion en servidor');
assert(submit.includes('119298bb-476d-40f3-b8f0-eab4c5bd5d8a'), 'El backend conserva la bandeja de Notion correcta');
assert(/['"]Notion-Version['"]\s*:\s*NOTION_VERSION/.test(submit), 'La API de Notion continúa versionada');

if (process.exitCode) process.exit(process.exitCode);
console.log('\nANTOJO. clean frontend smoke checks passed.');
