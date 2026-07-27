(function initAntojoPricing(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.AntojoPricing = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createAntojoPricing() {
  'use strict';

  const TIERS = Object.freeze([
    Object.freeze({ min: 1, max: 29, price: 65, label: '1 a 29' }),
    Object.freeze({ min: 30, max: 59, price: 60, label: '30 a 59' }),
    Object.freeze({ min: 60, max: 149, price: 55, label: '60 a 149' }),
    Object.freeze({ min: 150, max: 199, price: 54, label: '150 a 199' }),
    Object.freeze({ min: 200, max: 299, price: 53, label: '200 a 299' }),
    Object.freeze({ min: 300, max: 499, price: 52, label: '300 a 499' }),
    Object.freeze({ min: 500, max: Infinity, price: 50, label: '500 o más' })
  ]);

  const PERSONALIZATION_MINIMUM = 50;
  const PERSONALIZATION_UNIT_PRICE = 10;
  const DELIVERY_MINIMUM = 10;
  const ORIGIN_POSTAL_CODE = '03103';
  const ORIGIN_FALLBACK = Object.freeze({ lat: 19.3898, lon: -99.1717 });

  function normalizeQuantity(value) {
    const quantity = Math.round(Number(value) || 0);
    return Math.max(0, Math.min(9999, quantity));
  }

  function tierFor(quantityValue) {
    const quantity = normalizeQuantity(quantityValue);
    if (!quantity) return null;
    return TIERS.find(tier => quantity >= tier.min && quantity <= tier.max) || TIERS[TIERS.length - 1];
  }

  function unitPrice(quantityValue) {
    return tierFor(quantityValue)?.price || 0;
  }

  function personalizationAllowed(quantityValue) {
    return normalizeQuantity(quantityValue) >= PERSONALIZATION_MINIMUM;
  }

  function personalizedUnitPrice(quantityValue, personalized) {
    const base = unitPrice(quantityValue);
    if (!base) return 0;
    return base + (personalized && personalizationAllowed(quantityValue) ? PERSONALIZATION_UNIT_PRICE : 0);
  }

  function roundToTen(value) {
    return Math.round(Number(value || 0) / 10) * 10;
  }

  function distanceBaseFee(distanceValue) {
    const distance = Math.max(0, Number(distanceValue) || 0);
    if (distance <= 2.5) return 49;
    if (distance <= 5) return 59;
    if (distance <= 8) return 79;
    if (distance <= 12) return 99;
    if (distance <= 18) return 129;
    if (distance <= 25) return 169;
    return Math.min(320, roundToTen(169 + (distance - 25) * 6));
  }

  function volumeSurcharge(quantityValue) {
    const quantity = normalizeQuantity(quantityValue);
    if (quantity < 30) return 0;
    if (quantity < 75) return 15;
    if (quantity < 150) return 35;
    if (quantity < 250) return 70;
    if (quantity < 500) return 120;
    return 180;
  }

  function shippingFee(distanceValue, quantityValue) {
    return roundToTen(distanceBaseFee(distanceValue) + volumeSurcharge(quantityValue));
  }

  function quote({ quantity: quantityValue, personalized = false, shipping = 0 } = {}) {
    const quantity = normalizeQuantity(quantityValue);
    const baseUnitPrice = unitPrice(quantity);
    const validPersonalization = Boolean(personalized && personalizationAllowed(quantity));
    const finalUnitPrice = personalizedUnitPrice(quantity, validPersonalization);
    const drinkSubtotal = quantity * finalUnitPrice;
    const shippingFeeValue = Math.max(0, Math.round(Number(shipping) || 0));

    return Object.freeze({
      quantity,
      tier: tierFor(quantity),
      baseUnitPrice,
      personalized: validPersonalization,
      personalizationUnitPrice: validPersonalization ? PERSONALIZATION_UNIT_PRICE : 0,
      finalUnitPrice,
      drinkSubtotal,
      shippingFee: shippingFeeValue,
      total: drinkSubtotal + shippingFeeValue
    });
  }

  return Object.freeze({
    TIERS,
    PERSONALIZATION_MINIMUM,
    PERSONALIZATION_UNIT_PRICE,
    DELIVERY_MINIMUM,
    ORIGIN_POSTAL_CODE,
    ORIGIN_FALLBACK,
    normalizeQuantity,
    tierFor,
    unitPrice,
    personalizationAllowed,
    personalizedUnitPrice,
    shippingFee,
    quote
  });
});
