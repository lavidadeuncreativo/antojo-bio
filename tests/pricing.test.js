'use strict';

const assert = require('node:assert/strict');
const Pricing = require('../pricing-rules.js');

const cases = [
  [1, 65], [29, 65],
  [30, 60], [59, 60],
  [60, 55], [149, 55],
  [150, 54], [199, 54],
  [200, 53], [299, 53],
  [300, 52], [499, 52],
  [500, 50], [9999, 50]
];

for (const [quantity, expected] of cases) {
  assert.equal(Pricing.unitPrice(quantity), expected, `Precio incorrecto para ${quantity} bebidas`);
}

assert.equal(Pricing.unitPrice(0), 0);
assert.equal(Pricing.personalizationAllowed(49), false);
assert.equal(Pricing.personalizationAllowed(50), true);
assert.equal(Pricing.personalizedUnitPrice(50, true), 70);
assert.equal(Pricing.personalizedUnitPrice(49, true), 60);

const quote = Pricing.quote({ quantity: 150, personalized: true, shipping: 120 });
assert.equal(quote.baseUnitPrice, 54);
assert.equal(quote.finalUnitPrice, 64);
assert.equal(quote.drinkSubtotal, 9600);
assert.equal(quote.total, 9720);

console.log('✓ Reglas de precio ANTOJO. verificadas');
