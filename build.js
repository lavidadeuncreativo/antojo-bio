const fs=require('node:fs');
const path=require('node:path');
const zlib=require('node:zlib');
const crypto=require('node:crypto');

const ROOT=__dirname;
const DIST=path.join(ROOT,'dist');

const bundles={
  javascript:{parts:['app-js-00.b64','app-js-01.b64','app-js-02.b64','app-js-03.b64'],hash:'59433b7ce5afb77f389ad937f346bf53bb06d68c1eb33803b12a1bf29c58414f',output:'app.js'},
  stylesheet:{parts:['app-css-00.b64','app-css-01.b64'],hash:'12145a80ba9682a9ec1a4f9bcd37e956b156dc0411b192c22aadbe76e7460590',output:'app.css'}
};

function assemble(name,config){
  const encoded=config.parts.map(file=>fs.readFileSync(path.join(ROOT,'bundles',file),'utf8').trim()).join('');
  const source=zlib.gunzipSync(Buffer.from(encoded,'base64'));
  const digest=crypto.createHash('sha256').update(source).digest('hex');
  if(digest!==config.hash)throw new Error(`${name} no pasó la validación de integridad. Esperado ${config.hash}; recibido ${digest}.`);
  fs.writeFileSync(path.join(DIST,config.output),source);
  console.log(`✓ ${config.output} · ${source.length} bytes · ${digest.slice(0,12)}`);
}

function copy(source,destination){
  const from=path.join(ROOT,source);
  const to=path.join(DIST,destination||source);
  fs.mkdirSync(path.dirname(to),{recursive:true});
  fs.cpSync(from,to,{recursive:true});
}

fs.rmSync(DIST,{recursive:true,force:true});
fs.mkdirSync(DIST,{recursive:true});
Object.entries(bundles).forEach(([name,config])=>assemble(name,config));
['index.html','pricing.js','favicon.svg','sw.js','renders'].forEach(file=>copy(file));
console.log('✓ ANTOJO. build completo');
