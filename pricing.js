(function attachAntojoPricing(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.ANTOJO_PRICING = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createAntojoPricing() {
  'use strict';

  const PRICING_TIERS = Object.freeze([
    Object.freeze({ min: 1, max: 29, unitPrice: 65 }),
    Object.freeze({ min: 30, max: 59, unitPrice: 60 }),
    Object.freeze({ min: 60, max: 149, unitPrice: 55 }),
    Object.freeze({ min: 150, max: 199, unitPrice: 54 }),
    Object.freeze({ min: 200, max: 299, unitPrice: 53 }),
    Object.freeze({ min: 300, max: 499, unitPrice: 52 }),
    Object.freeze({ min: 500, max: Infinity, unitPrice: 50 })
  ]);

  function normalizeQuantity(value) {
    const quantity = Math.floor(Number(value));
    return Number.isFinite(quantity) && quantity > 0 ? quantity : 0;
  }

  function getUnitPrice(value) {
    const quantity = normalizeQuantity(value);
    if (!quantity) return 0;
    const tier = PRICING_TIERS.find(item => quantity >= item.min && quantity <= item.max);
    return tier ? tier.unitPrice : 50;
  }

  function getPricingTier(value) {
    const quantity = normalizeQuantity(value);
    if (!quantity) return null;
    return PRICING_TIERS.find(item => quantity >= item.min && quantity <= item.max) || PRICING_TIERS.at(-1);
  }

  return Object.freeze({ PRICING_TIERS, getUnitPrice, getPricingTier, normalizeQuantity });
});
