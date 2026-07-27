const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'site-system-v2.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'site-system-v2.css'), 'utf8');

[
  '/renders/antojo-dia-novia-front.jpg',
  '/renders/antojo-dia-novia-angle.jpg',
  '/renders/antojo-dia-novia-close.jpg'
].forEach(asset => {
  assert.ok(script.includes(asset), `Falta asset responsive: ${asset}`);
  assert.ok(fs.existsSync(path.join(root, asset)), `No existe el archivo: ${asset}`);
});

assert.ok(script.includes("price: '$219 MXN'"), 'El precio publicado debe ser $219 MXN.');
assert.ok(script.includes('100 piezas por reservación'), 'La primera tanda debe comunicar 100 piezas por reservación.');
assert.ok(script.includes('Envío por separado'), 'El popup debe separar el envío.');
assert.ok(script.includes('antojo.bebidas'), 'Instagram debe usar @antojo.bebidas.');
assert.ok(!script.includes("instagram.com/antojo.beb/'"), 'No debe regresar al usuario incorrecto de Instagram.');
assert.ok(script.includes('localStorage'), 'El cierre debe persistirse.');
assert.ok(script.includes('sessionStorage'), 'El popup debe mostrarse máximo una vez por sesión.');
assert.ok(script.includes('prefers-reduced-motion'), 'El script debe respetar reducción de movimiento.');
assert.ok(styles.includes('@media(prefers-reduced-motion:reduce)'), 'Los estilos deben respetar reducción de movimiento.');
assert.ok(styles.includes('100dvh'), 'El modal y la home deben utilizar el viewport dinámico.');
assert.ok(styles.includes('env(safe-area-inset-bottom)'), 'El modal debe respetar safe areas.');
assert.ok(script.includes('announcement-item--campaign'), 'La campaña debe integrarse al ticker, no como un bloque fijo.');
assert.ok(styles.includes('.novia-announcement{\n  display:none!important;'), 'El bloque fijo anterior debe quedar desactivado.');

console.log('✓ Campaña Día de la Novia validada');
