const assert=require('node:assert/strict');
const {getPricing,getDateStatus,getSelectionStatus,businessDaysBetween}=require('../pricing');

const cases=[
  [8,false,60,480,240,240],
  [20,false,58,1160,580,580],
  [80,false,53,4240,2120,2120],
  [100,false,52,5200,2600,2600],
  [150,false,50,7500,3750,3750],
  [50,true,65,3250,1625,1625],
  [100,true,62,6200,3100,3100],
  [200,true,60,12000,6000,6000]
];
for(const [qty,personalized,unit,subtotal,deposit,balance] of cases){
  const result=getPricing(qty,personalized);
  assert.equal(result.isValid,true);
  assert.equal(result.unitPrice,unit);
  assert.equal(result.subtotal,subtotal);
  assert.equal(result.deposit,deposit);
  assert.equal(result.balance,balance);
}
assert.equal(getPricing(40,true).isValid,false);
assert.match(getPricing(40,true).error,/50 piezas/);
assert.equal(getPricing(1001,false).needsHumanReview,true);
assert.equal(getPricing(1001,false).unitPrice,null);
assert.deepEqual(getSelectionStatus(80,100),{selected:80,target:100,difference:-20,isExact:false,remaining:20,extra:0});
assert.equal(getDateStatus('2026-07-16',false,'2026-07-17').isValid,false);
assert.equal(getDateStatus('2026-07-18',false,'2026-07-17').isUrgent,true);
assert.equal(getDateStatus('2026-07-27',true,'2026-07-17').isUrgent,false);
assert.equal(getDateStatus('2026-07-23',true,'2026-07-17').isUrgent,true);
assert.equal(businessDaysBetween('2026-07-17','2026-07-24'),5);
console.log('pricing.test.js: all assertions passed');
