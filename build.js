const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const dist = path.join(root, 'dist');
const releaseVersion = '20260727-3';
const files = [
  'index.html',
  'app.css',
  'home-upgrades.css',
  'commerce-upgrades.css',
  'app.js',
  'experience-upgrades.js',
  'favicon.svg',
  'sw.js',
  'renders',
  'blog'
];

function readRequired(file) {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) throw new Error(`Falta ${file}`);
  return fs.readFileSync(target, 'utf8');
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of files) {
  const from = path.join(root, file);
  if (!fs.existsSync(from)) throw new Error(`Falta ${file}`);
  fs.cpSync(from, path.join(dist, file), { recursive: true });
}

const experienceBundle = [
  readRequired('pricing-rules.js'),
  readRequired('experience-upgrades.js'),
  readRequired('mobile-shipping-audit-v2.js'),
  readRequired('announcement-system-v2.js'),
  readRequired('site-system-v2.js')
].join('\n\n');

fs.writeFileSync(path.join(dist, 'experience-upgrades.js'), `${experienceBundle}\n`, 'utf8');
fs.appendFileSync(
  path.join(dist, 'app.css'),
  `\n\n${readRequired('studio-upgrade-v1.css')}\n\n${readRequired('site-system-v2.css')}\n`,
  'utf8'
);

const indexPath = path.join(dist, 'index.html');
const index = fs.readFileSync(indexPath, 'utf8').replace(/\?v=\d{8}-\d+/g, `?v=${releaseVersion}`);
fs.writeFileSync(indexPath, index, 'utf8');

console.log(`✓ ANTOJO. build listo · ${releaseVersion}`);
