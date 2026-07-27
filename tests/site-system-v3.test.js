const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'design-system-v3.js'), 'utf8');
const theme = fs.readFileSync(path.join(root, 'theme-system-v3.css'), 'utf8');
const layout = fs.readFileSync(path.join(root, 'layout-system-v3.css'), 'utf8');
const build = fs.readFileSync(path.join(root, 'build.js'), 'utf8');

['editorial', 'rojo', 'mariposa', 'crema', 'tinta', 'mantequilla', 'pulse'].forEach(mood => {
  assert.ok(script.includes(`'${mood}'`), `Falta mood en JS: ${mood}`);
  assert.ok(theme.includes(`data-mood="${mood}"`), `Falta mood en CSS: ${mood}`);
});

assert.ok(script.includes("const DEFAULT_MOOD = 'editorial'"), 'El default debe ser blanco editorial.');
assert.ok(theme.includes('@keyframes antojoPulseAmbient'), 'Pulse debe usar ambiente animado sutil.');
assert.ok(layout.includes('.announcement-grid'), 'La top bar debe usar una grilla estable.');
assert.ok(layout.includes('grid-template-columns:repeat(2,minmax(0,1fr))'), 'Las rutas de Home deben balancearse en dos columnas.');
assert.ok(layout.includes('height:auto!important'), 'Home no debe depender de una altura que recorte contenido.');
assert.ok(layout.includes('overflow:visible!important'), 'Home debe permitir scroll sin ocultar accesos.');
assert.ok(build.includes("readRequired('design-system-v3.js')"), 'El build debe incluir design-system-v3.js.');
assert.ok(build.includes("readRequired('campaign-dia-novia-v3.js')"), 'El build debe incluir campaign v3.');
assert.ok(!build.includes("readRequired('site-system-v2.js')"), 'El build no debe cargar el sistema v2.');
assert.ok(!build.includes("readRequired('studio-upgrade-v1.css')"), 'El build no debe apilar el CSS v1.');

console.log('✓ Sistema visual v3 validado');
