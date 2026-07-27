const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'site-system-v2.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'site-system-v2.css'), 'utf8');
const build = fs.readFileSync(path.join(root, 'build.js'), 'utf8');

['editorial', 'rojo', 'mariposa', 'crema', 'tinta', 'mantequilla', 'matcha', 'pulse'].forEach(mood => {
  assert.ok(script.includes(`id: '${mood}'`), `Falta mood en JS: ${mood}`);
  assert.ok(styles.includes(`data-mood="${mood}"`), `Falta mood en CSS: ${mood}`);
});

assert.ok(script.includes("const DEFAULT_MOOD = 'editorial'"), 'El mood default debe ser blanco editorial.');
assert.ok(styles.includes('@keyframes antojoAtmospherePulse'), 'Pulse debe tener animación visible.');
assert.ok(styles.includes('.home-layout{\n    height:auto!important;'), 'La home no debe cortar el menú en escritorio.');
assert.ok(styles.includes('overflow:visible!important'), 'La home debe permitir crecer sin recortar enlaces.');
assert.ok(styles.includes('.mood-menu'), 'Debe existir selector visual de moods.');
assert.ok(build.includes("readRequired('site-system-v2.js')"), 'El build debe incluir el sistema JS v2.');
assert.ok(build.includes("readRequired('site-system-v2.css')"), 'El build debe incluir el sistema CSS v2.');
assert.ok(!build.includes("readRequired('studio-upgrade-v1.js')"), 'El build no debe ejecutar el sistema de moods anterior.');

console.log('✓ Sistema visual v2 validado');
