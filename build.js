const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const dist = path.join(root, 'dist');
const files = [
  'index.html',
  'app.css',
  'home-upgrades.css',
  'commerce-upgrades.css',
  'v16-mobile.css',
  'pricing.js',
  'app.js',
  'experience-upgrades.js',
  'favicon.svg',
  'sw.js',
  'renders'
];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of files) {
  const from = path.join(root, file);
  if (!fs.existsSync(from)) throw new Error(`Falta ${file}`);
  fs.cpSync(from, path.join(dist, file), { recursive: true });
}

const indexPath = path.join(dist, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
html = html
  .replaceAll('20260722-6', '20260725-16')
  .replace(
    '<link rel="stylesheet" href="/commerce-upgrades.css?v=20260725-16">',
    '<link rel="stylesheet" href="/commerce-upgrades.css?v=20260725-16">\n  <link rel="stylesheet" href="/v16-mobile.css?v=20260725-16">'
  )
  .replace(
    '<script defer src="/app.js?v=20260725-16"></script>',
    '<script defer src="/pricing.js?v=20260725-16"></script>\n  <script defer src="/app.js?v=20260725-16"></script>'
  )
  .replace(
    'Elige un paquete, combina sabores, escribe cantidades y calcula personalización y entrega.',
    'Elige un paquete, combina sabores, escribe cantidades y solicita personalización o entrega.'
  )
  .replace(
    'Desde 50 piezas · +$10 por lata.',
    'Desde 50 piezas · costo por cotizar según diseño, impresión y colocación.'
  )
  .replace(
    'El precio base baja según la cantidad: pedidos personales desde $65, menos de 50 piezas hasta $60, 50 a 99 piezas en $60, 100 a 149 en $55, 150 a 199 en $53, 200 a 499 en $52 y 500 o más en $50 por bebida. Personalizar suma $10 por lata desde 50 piezas.',
    'El precio se calcula por la cantidad total: 1 a 29 en $65, 30 a 59 en $60, 60 a 149 en $55, 150 a 199 en $54, 200 a 299 en $53, 300 a 499 en $52 y 500 o más en $50 por bebida. Envío y personalización se cotizan aparte.'
  )
  .replace(
    'La página estima el envío usando el código postal, la distancia aproximada desde WTC y el volumen del pedido. La tarifa se confirma antes del cobro.',
    'La página estima la entrega desde nuestro punto operativo usando el código postal, la distancia aproximada y el volumen. La tarifa se confirma antes del cobro.'
  )
  .replace(
    'La personalización está disponible desde 50 piezas y suma $10 por cada lata al precio correspondiente por volumen.',
    'La personalización está disponible desde 50 piezas. El costo depende del diseño, impresión, colocación y merma, por lo que se confirma antes del cobro.'
  );
fs.writeFileSync(indexPath, html, 'utf8');

console.log('✓ ANTOJO. v16 build listo');
