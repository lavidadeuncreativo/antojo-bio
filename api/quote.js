'use strict';

const Pricing = require('../pricing-rules.js');

const WHATSAPP_NUMBER = '525522026291';
const POSTAL_API_TIMEOUT_MS = 3500;

function json(response, status, payload) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.end(JSON.stringify(payload));
}

function parseBoolean(value) {
  return value === true || value === 'true' || value === '1' || value === 1;
}

function parseInput(request) {
  const source = request.method === 'POST' && request.body && typeof request.body === 'object'
    ? request.body
    : request.query || {};

  return {
    postalCode: String(source.postalCode || source.cp || '').replace(/\D/g, '').slice(0, 5),
    quantity: Pricing.normalizeQuantity(source.quantity),
    personalized: parseBoolean(source.personalized)
  };
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = value => value * Math.PI / 180;
  const earth = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return earth * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function coordinatesForPostalCode(postalCode, fallback = null) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), POSTAL_API_TIMEOUT_MS);

  try {
    const response = await fetch(`https://api.zippopotam.us/mx/${postalCode}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('postal_not_found');
    const payload = await response.json();
    const place = payload?.places?.[0];
    const lat = Number(place?.latitude);
    const lon = Number(place?.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error('invalid_coordinates');
    return { lat, lon, source: 'postal-api' };
  } catch (error) {
    if (fallback) return { ...fallback, source: 'fallback' };
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = async function quoteHandler(request, response) {
  if (request.method === 'OPTIONS') {
    response.statusCode = 204;
    response.setHeader('Allow', 'GET, POST, OPTIONS');
    response.end();
    return;
  }

  if (!['GET', 'POST'].includes(request.method)) {
    response.setHeader('Allow', 'GET, POST, OPTIONS');
    json(response, 405, { ok: false, error: 'Método no permitido.' });
    return;
  }

  const input = parseInput(request);
  if (!input.quantity) {
    json(response, 400, { ok: false, error: 'La cantidad debe ser mayor a cero.' });
    return;
  }
  if (input.quantity < Pricing.DELIVERY_MINIMUM) {
    json(response, 422, {
      ok: false,
      code: 'delivery_minimum',
      error: `La entrega a domicilio está disponible desde ${Pricing.DELIVERY_MINIMUM} bebidas.`,
      minimum: Pricing.DELIVERY_MINIMUM,
      pickupAvailable: true
    });
    return;
  }
  if (!/^\d{5}$/.test(input.postalCode)) {
    json(response, 400, { ok: false, error: 'Escribe un código postal válido de 5 dígitos.' });
    return;
  }

  try {
    const [origin, destination] = await Promise.all([
      coordinatesForPostalCode(Pricing.ORIGIN_POSTAL_CODE, Pricing.ORIGIN_FALLBACK),
      coordinatesForPostalCode(input.postalCode)
    ]);
    const directDistance = haversineKm(origin.lat, origin.lon, destination.lat, destination.lon);
    const operationalDistance = Math.round(Math.max(0, directDistance * 1.18) * 10) / 10;
    const deliveryFee = Pricing.shippingFee(operationalDistance, input.quantity);
    const order = Pricing.quote({
      quantity: input.quantity,
      personalized: input.personalized,
      shipping: deliveryFee
    });

    json(response, 200, {
      ok: true,
      currency: 'MXN',
      postalCode: input.postalCode,
      distanceKm: operationalDistance,
      source: destination.source,
      confirmationRequired: true,
      whatsappNumber: WHATSAPP_NUMBER,
      order
    });
  } catch {
    json(response, 422, {
      ok: false,
      code: 'postal_unavailable',
      error: 'No pudimos calcular ese código postal. El envío puede confirmarse por WhatsApp.',
      confirmationRequired: true,
      whatsappNumber: WHATSAPP_NUMBER
    });
  }
};
