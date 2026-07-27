const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'blog/index.html'), 'utf8');
const article = fs.readFileSync(path.join(root, 'blog/capitulo-1.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'blog/blog.css'), 'utf8');
const script = fs.readFileSync(path.join(root, 'blog/blog.js'), 'utf8');

[index, article].forEach(html => {
  assert.ok(html.includes('instagram.com/antojo.bebidas/'), 'Instagram del Diario debe ser correcto.');
  assert.ok(!html.includes('instagram.com/antojo.beb/'), 'No debe existir el usuario incorrecto.');
  assert.ok(html.includes('blog.css?v=3'), 'Debe invalidar la caché del CSS del Diario.');
  assert.ok(html.includes('blog.js?v=3'), 'Debe invalidar la caché del JS del Diario.');
});

assert.ok(index.includes('$219 MXN'), 'La portada del Diario debe mostrar la edición de $219.');
assert.ok(article.includes('article-campaign'), 'El artículo debe incluir la campaña editorial.');
assert.ok(script.includes("const MOOD_KEY = 'antojo-mood-v3'"), 'El Diario debe compartir el mood del sitio.');
assert.ok(styles.includes('.journal-hero__aside'), 'La portada debe usar la nueva composición editorial.');
assert.ok(styles.includes('.article-deck'), 'El artículo debe tener una bajada legible.');
assert.ok(styles.includes('@media(prefers-reduced-motion:reduce)'), 'El Diario debe respetar reducción de movimiento.');

console.log('✓ Diario ANTOJO. v3 validado');
