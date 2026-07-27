const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'campaign-dia-novia-v3.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'campaign-dia-novia-v3.css'), 'utf8');

[
  '/renders/antojo-dia-novia-front.jpg',
  '/renders/antojo-dia-novia-angle.jpg',
  '/renders/antojo-dia-novia-close.jpg'
].forEach(asset => {
  assert.ok(script.includes(asset), `Falta asset responsive: ${asset}`);
  assert.ok(fs.existsSync(path.join(root, asset)), `No existe el archivo: ${asset}`);
});

assert.ok(script.includes("price: '$219 MXN'"), 'El precio debe ser $219 MXN.');
assert.ok(script.includes('100 piezas por reservación'), 'Debe comunicar 100 piezas por reservación.');
assert.ok(script.includes('Envío por separado'), 'Debe separar el envío.');
assert.ok(script.includes('localStorage'), 'El cierre debe persistirse.');
assert.ok(script.includes('sessionStorage'), 'Debe mostrarse máximo una vez por sesión.');
assert.ok(styles.includes('100dvh'), 'El popup debe usar viewport dinámico.');
assert.ok(styles.includes('env(safe-area-inset-bottom)'), 'El popup debe respetar safe areas.');
assert.ok(styles.includes('@media(prefers-reduced-motion:reduce)'), 'Debe respetar reducción de movimiento.');

console.log('✓ Campaña Día de la Novia v3 validada');
