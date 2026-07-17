const assert=require('node:assert/strict');
const handler=require('../api/submit');
const {validate,mapDelivery,numberProperty}=handler._test;

function payload(overrides={}){
  return {
    folio:'ANT-20260717-ABCDE',
    type:'quote',
    name:'Israel',
    phone:'+52 55 1234 5678',
    consent:true,
    adultConfirmed:true,
    website:'',
    items:[{id:'mojito-clasico',name:'ignored',qty:100,alcohol:true}],
    targetQuantity:100,
    personalization:'normal',
    fulfillment:'wtc',
    dateUnknown:true,
    requiredDate:'',
    ...overrides
  };
}
let result=validate(payload());
assert.equal(result.error,null);
assert.equal(result.pricing.unitPrice,52);
assert.equal(result.pricing.subtotal,5200);
assert.equal(result.units,100);
assert.equal(result.targetQuantity,100);

result=validate(payload({personalization:'phrase',items:[{id:'mojito-clasico',qty:40,alcohol:true}],targetQuantity:40}));
assert.match(result.error,/50 piezas/);

result=validate(payload({items:[{id:'mojito-clasico',qty:80,alcohol:true}],targetQuantity:100}));
assert.match(result.error,/cantidad objetivo/);

result=validate(payload({fulfillment:'delivery',address:'',neighborhood:''}));
assert.match(result.error,/dirección/);

result=validate(payload({fulfillment:'special_event_logistics'}));
assert.equal(result.error,null);
assert.equal(result.needsReview,true);
assert.equal(mapDelivery('special_event_logistics'),'Logística para evento');
assert.deepEqual(numberProperty(null),{number:null});

result=validate(payload({dateUnknown:false,requiredDate:'2000-01-01'}));
assert.match(result.error,/pasado/);

result=validate(payload({adultConfirmed:false}));
assert.match(result.error,/mayoría de edad/);

console.log('api-validation.test.js: all assertions passed');
