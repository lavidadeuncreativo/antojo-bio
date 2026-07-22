const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const dist = path.join(root, 'dist');
const files = ['index.html', 'app.css', 'home-upgrades.css', 'app.js', 'favicon.svg', 'sw.js', 'renders'];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of files) {
  const from = path.join(root, file);
  if (!fs.existsSync(from)) throw new Error(`Falta ${file}`);
  fs.cpSync(from, path.join(dist, file), { recursive: true });
}

console.log('✓ ANTOJO. build listo');
