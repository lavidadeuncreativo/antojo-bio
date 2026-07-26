'use strict';

const assert = require('node:assert/strict');
const { getUnitPrice } = require('./pricing.js');

const cases = new Map([
  [0, 0],
  [1, 65],
  [29, 65],
  [30, 60],
  [59, 60],
  [60, 55],
  [149, 55],
  [150, 54],
  [199, 54],
  [200, 53],
  [299, 53],
  [300, 52],
  [499, 52],
  [500, 50],
  [501, 50]
]);

for (const [quantity, expected] of cases) {
  assert.equal(getUnitPrice(quantity), expected, `${quantity} bebidas deben costar $${expected} c/u`);
}

assert.equal(getUnitPrice(-10), 0);
assert.equal(getUnitPrice('abc'), 0);
assert.equal(getUnitPrice(30.9), 60);

console.log(`✓ ${cases.size + 3} pruebas de precios pasaron`);
