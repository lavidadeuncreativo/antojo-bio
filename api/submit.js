const NOTION_VERSION = '2026-03-11';
const DEFAULT_DATA_SOURCE_ID = '119298bb-476d-40f3-b8f0-eab4c5bd5d8a';
const requestsByIp = new Map();

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function clean(value, max = 2000) {
  return String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);
}

function richText(value) {
  const content = clean(value);
  return { rich_text: content ? [{ type: 'text', text: { content } }] : [] };
}

function title(value) {
  return { title: [{ type: 'text', text: { content: clean(value, 200) || 'Solicitud web' } }] };
}

function numberProperty(value) {
  const parsed = Number(value);
  return { number: Number.isFinite(parsed) ? parsed : null };
}

function getBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  return null;
}

function allowedOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  const configured = clean(process.env.ALLOWED_ORIGINS || '', 1000)
    .split(',').map(v => v.trim()).filter(Boolean);
  if (configured.includes(origin)) return true;
  try {
    const originHost = new URL(origin).host;
    const requestHost = clean(req.headers['x-forwarded-host'] || req.headers.host, 300);
    return originHost === requestHost;
  } catch {
    return false;
  }
}

function rateLimited(req) {
  const ip = clean((req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket?.remoteAddress || 'unknown', 100);
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const current = requestsByIp.get(ip) || { startedAt: now, count: 0 };
  if (now - current.startedAt > windowMs) {
    requestsByIp.set(ip, { startedAt: now, count: 1 });
    return false;
  }
  current.count += 1;
  requestsByIp.set(ip, current);
  return current.count > 12;
}

function validate(payload) {
  if (!payload || typeof payload !== 'object') return 'Solicitud inválida.';
  if (clean(payload.website)) return 'Solicitud inválida.';
  if (!/^ANT-\d{8}-[A-Z0-9]{4,8}$/.test(clean(payload.folio, 40))) return 'Folio inválido.';
  if (clean(payload.name, 120).length < 2) return 'Nombre inválido.';
  if (clean(payload.phone, 40).replace(/\D/g, '').length < 10) return 'Teléfono inválido.';
  if (payload.consent !== true) return 'Se requiere consentimiento para atender la solicitud.';
  if (!['order', 'quote'].includes(payload.type)) return 'Tipo de solicitud inválido.';
  if (!Array.isArray(payload.items) || payload.items.length < 1 || payload.items.length > 18) return 'Productos inválidos.';
  const total = payload.items.reduce((sum, item) => sum + Math.max(0, Number(item.qty) || 0), 0);
  if (total < 1 || total > 2000) return 'Cantidad inválida.';
  return null;
}

async function notionRequest(path, token, options = {}) {
  return fetch(`https://api.notion.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
}

async function findExisting(folio, token, dataSourceId) {
  try {
    const response = await notionRequest(`/v1/data_sources/${dataSourceId}/query`, token, {
      method: 'POST',
      body: JSON.stringify({
        page_size: 1,
        filter: { property: 'Folio', rich_text: { equals: folio } }
      })
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.results?.[0] || null;
  } catch {
    return null;
  }
}

function dateProperty(value, includeTime = false) {
  const text = clean(value, 40);
  if (!text) return { date: null };
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return { date: null };
  return { date: { start: includeTime ? date.toISOString() : text.slice(0, 10) } };
}

function mapDelivery(value) {
  return ({ wtc: 'Recoger en WTC', delivery: 'Domicilio', event: 'Logística para evento' })[value] || 'Logística para evento';
}

function mapOccasion(value) {
  return ({ fin: 'Para el fin', event: 'Evento', office: 'Oficina', birthday: 'Cumple' })[value] || 'Otro';
}

function mapPersonalization(value) {
  return ({ normal: 'Normal', phrase: 'Nombre o frase', logo: 'Logo o concepto' })[value] || 'Normal';
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return sendJson(res, 204, {});
  if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'Método no permitido.' });
  if (!allowedOrigin(req)) return sendJson(res, 403, { ok: false, error: 'Origen no permitido.' });
  if (rateLimited(req)) return sendJson(res, 429, { ok: false, error: 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.' });

  const token = process.env.NOTION_TOKEN;
  const dataSourceId = clean(process.env.NOTION_DATA_SOURCE_ID || process.env.NOTION_DATABASE_ID || DEFAULT_DATA_SOURCE_ID, 100);
  if (!token) {
    return sendJson(res, 503, {
      ok: false,
      code: 'NOTION_NOT_CONFIGURED',
      error: 'El respaldo en Notion aún no está configurado.'
    });
  }

  const payload = getBody(req);
  const error = validate(payload);
  if (error) return sendJson(res, 400, { ok: false, error });

  const folio = clean(payload.folio, 40);
  const existing = await findExisting(folio, token, dataSourceId);
  if (existing) {
    return sendJson(res, 200, { ok: true, duplicate: true, folio, notionUrl: existing.url });
  }

  const units = payload.items.reduce((sum, item) => sum + Math.max(0, Number(item.qty) || 0), 0);
  const flavors = payload.items.map(item => `${Number(item.qty) || 0} × ${clean(item.name, 100)}`).join(' · ');
  const createdAt = payload.createdAt || new Date().toISOString();
  const requestType = payload.type === 'quote' ? 'Cotización' : 'Pedido';
  const requestTitle = `${folio} · ${clean(payload.name, 90)}`;
  const utm = payload.utm || {};

  const properties = {
    'Solicitud': title(requestTitle),
    'Folio': richText(folio),
    'Estado': { select: { name: 'Nueva' } },
    'Tipo': { select: { name: requestType } },
    'Origen': { select: { name: 'Web app' } },
    'Fecha solicitud': dateProperty(createdAt, true),
    'Fecha requerida': dateProperty(payload.requiredDate),
    'Nombre': richText(payload.name),
    'Teléfono': { phone_number: clean(payload.phone, 40) || null },
    'Unidades': numberProperty(units),
    'Cantidad objetivo': numberProperty(payload.targetQuantity),
    'Sabores': richText(flavors),
    'Entrega': { select: { name: mapDelivery(payload.fulfillment) } },
    'Dirección': richText(payload.address),
    'Envío estimado': numberProperty(payload.shippingFee),
    'Ocasión': { select: { name: mapOccasion(payload.occasion) } },
    'Personalización': { select: { name: mapPersonalization(payload.personalization) } },
    'Detalle personalización': richText(payload.personalizationText),
    'Precio unitario': numberProperty(payload.unitPrice),
    'Total estimado': numberProperty(payload.totalEstimate),
    'Notas': richText(payload.notes),
    'UTM Source': richText(utm.source),
    'UTM Medium': richText(utm.medium),
    'UTM Campaign': richText(utm.campaign),
    'Consentimiento': { checkbox: true },
    'WhatsApp abierto': { checkbox: true },
    'Seguimiento': dateProperty(createdAt)
  };

  const eventTrail = Array.isArray(payload.eventTrail)
    ? payload.eventTrail.slice(-30).map(event => `- ${clean(event.name, 80)} · ${clean(event.at, 40)}`).join('\n')
    : '- Sin eventos registrados';
  const details = payload.items.map(item => `- **${Number(item.qty) || 0}** × ${clean(item.name, 120)}`).join('\n');
  const markdown = `## Solicitud desde la web app\n\n**Folio:** ${folio}\n\n**Tipo:** ${requestType}\n\n**Contacto:** ${clean(payload.name, 120)} · ${clean(payload.phone, 40)}\n\n**Fecha requerida:** ${clean(payload.requiredDate, 40) || 'Por confirmar'} ${clean(payload.requiredTime, 20)}\n\n## Bebidas\n${details}\n\n## Entrega y personalización\n\n- Entrega: ${mapDelivery(payload.fulfillment)}\n- Dirección: ${clean(payload.address, 500) || 'No aplica'}\n- Ocasión: ${mapOccasion(payload.occasion)}\n- Personalización: ${mapPersonalization(payload.personalization)}\n- Detalle: ${clean(payload.personalizationText, 1000) || 'No aplica'}\n\n## Recorrido registrado\n${eventTrail}\n\n## Información técnica\n\n- Sesión: ${clean(payload.sessionId, 100)}\n- Página: ${clean(payload.pageUrl, 500)}\n- Navegador: ${clean(payload.userAgent, 500)}\n- Creada: ${clean(createdAt, 50)}`;

  try {
    const response = await notionRequest('/v1/pages', token, {
      method: 'POST',
      body: JSON.stringify({
        parent: { data_source_id: dataSourceId },
        properties,
        markdown
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('Notion API error', response.status, data);
      return sendJson(res, 502, { ok: false, error: 'No fue posible respaldar la solicitud en Notion.', detail: data.message || null });
    }
    return sendJson(res, 201, { ok: true, folio, notionUrl: data.url, pageId: data.id });
  } catch (notionError) {
    console.error('Notion request failed', notionError);
    return sendJson(res, 502, { ok: false, error: 'No fue posible conectar con Notion.' });
  }
};
