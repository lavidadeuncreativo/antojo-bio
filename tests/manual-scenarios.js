const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {getPricing,getDateStatus,getSelectionStatus}=require('../pricing');
const api=require('../api/submit')._test;
const app=fs.readFileSync(path.join(__dirname,'../clean-v2.js'),'utf8');

function ok(number,fn){
  try{fn();console.log(`CASO ${number}: PASS`)}
  catch(error){console.error(`CASO ${number}: FAIL - ${error.message}`);process.exitCode=1}
}
function payload(overrides={}){
  return {
    folio:'ANT-20260717-ABCDE',type:'quote',name:'Israel',phone:'+52 55 1234 5678',consent:true,adultConfirmed:true,website:'',
    items:[{id:'mojito-clasico',qty:100,alcohol:true}],targetQuantity:100,personalization:'normal',fulfillment:'wtc',dateUnknown:true,requiredDate:'',
    ...overrides
  };
}

ok(1,()=>assert.deepEqual([getPricing(8,false).unitPrice,getPricing(8,false).subtotal,getPricing(8,false).deposit,getPricing(8,false).balance],[60,480,240,240]));
ok(2,()=>assert.deepEqual([getPricing(20,false).unitPrice,getPricing(20,false).subtotal,getPricing(20,false).deposit,getPricing(20,false).balance],[58,1160,580,580]));
ok(3,()=>assert.deepEqual([getPricing(80,false).unitPrice,getPricing(80,false).subtotal,getPricing(80,false).deposit,getPricing(80,false).balance],[53,4240,2120,2120]));
ok(4,()=>{const result=getPricing(100,false);assert.deepEqual([result.unitPrice,result.subtotal,result.deposit,result.needsHumanReview],[52,5200,2600,false])});
ok(5,()=>assert.deepEqual([getPricing(100,true).unitPrice,getPricing(100,true).subtotal,getPricing(100,true).deposit],[62,6200,3100]));
ok(6,()=>{const result=getPricing(40,true);assert.equal(result.isValid,false);assert.match(result.error,/50 piezas/)});
ok(7,()=>assert.deepEqual([getPricing(200,true).unitPrice,getPricing(200,true).subtotal,getPricing(200,true).deposit],[60,12000,6000]));
ok(8,()=>{assert.equal(getSelectionStatus(80,100).remaining,20);const result=api.validate(payload({items:[{id:'mojito-clasico',qty:80,alcohol:true}]}));assert.match(result.error,/cantidad objetivo/)});
ok(9,()=>assert.equal(getDateStatus('2026-07-16',false,'2026-07-17').isValid,false));
ok(10,()=>{const result=getDateStatus('2026-07-18',false,'2026-07-17');assert.equal(result.isValid,true);assert.equal(result.isUrgent,true)});
ok(11,()=>{const result=getDateStatus('2026-07-23',true,'2026-07-17');assert.equal(result.isValid,true);assert.equal(result.isUrgent,true)});
ok(12,()=>{for(const fulfillment of ['wtc','delivery','special_event_logistics']){const extra=fulfillment==='delivery'?{address:'Insurgentes 1',neighborhood:'Nápoles'}:{};assert.equal(api.validate(payload({fulfillment,...extra})).error,null)}assert.equal(api.mapDelivery('special_event_logistics'),'Logística para evento')});
ok(13,()=>{assert.match(app,/Cantidad total:/);assert.match(app,/Subtotal estimado:/);assert.match(app,/Anticipo para confirmar:/);assert.doesNotMatch(app,/Total:\s*\$\{n\}/)});
ok(14,()=>{const source=fs.readFileSync(path.join(__dirname,'../api/submit.js'),'utf8');assert.match(source,/findExisting/);assert.match(source,/NOTION_TOKEN/);assert.match(source,/\/v1\/pages/);assert.match(source,/parent:\{data_source_id:dataSourceId\}/);assert.match(source,/properties,markdown/)});
