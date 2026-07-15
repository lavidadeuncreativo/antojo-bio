# ANTOJO. web app

Web app mobile-first para explorar el menú, armar un pedido o solicitar una cotización para un evento.

## Funciones principales

- Catálogo visual de 18 bebidas.
- Flujo separado entre **Armar mi pedido** y **Solicitar cotización**.
- Cantidades rápidas para eventos: 50, 100, 200 u otra cantidad.
- Ajuste individual de piezas por sabor.
- Precios públicos: 1–5 a $65 c/u, 6–20 a $60 c/u y 21–50 a $55 c/u.
- A partir de 51 piezas o con personalización se solicita cotización especial.
- Recolección en WTC, entrega a domicilio desde 10 piezas y logística para evento.
- Estimador de envío dentro del checkout.
- Validación para alcohol, anticipación mínima y consentimiento de privacidad.
- Persistencia local: el carrito sobrevive a recargas y cierres.
- Folio único para cada solicitud.
- Pedido o cotización prellenada para WhatsApp al `+52 55 2202 6291`.
- Cola de respaldo: si Notion no responde, la solicitud queda pendiente y se reintenta.
- Favicon, manifest, service worker, animaciones blur y slider automático.

## Integración con Notion

Las solicitudes se guardan en la base privada **13 — Solicitudes web** del sistema ANTOJO. OS.

El backend vive en `api/submit.js` y usa una variable protegida de Vercel:

```text
NOTION_TOKEN=secret_de_la_integracion
```

El identificador de la base ya está configurado. Puede sobrescribirse opcionalmente con:

```text
NOTION_DATA_SOURCE_ID=119298bb-476d-40f3-b8f0-eab4c5bd5d8a
```

La integración de Notion debe tener permiso para insertar contenido y acceso explícito a la base. El token nunca debe colocarse en archivos del repositorio.

La ruta `/api/health` indica si el secreto está configurado, sin exponerlo.

## Publicación

Sitio estático con funciones de servidor compatible con Vercel. El punto de entrada es `index.html` y las rutas bajo `api/` se publican como Vercel Functions.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flavidadeuncreativo%2Fantojo-bio)

## Validación automática

Cada cambio en `main` ejecuta:

- Comprobación de sintaxis de todos los archivos JavaScript.
- Pruebas estáticas de precios, WhatsApp, persistencia y backend.
- Despliegue automático en Vercel.

## Estructura

- `index.html`: estructura principal.
- `v4-styles-*.css`: interfaz responsiva y animaciones base.
- `v4-render-*.js`: renders optimizados de las bebidas.
- `v4-app-*.js`: catálogo, precios, carrito, cotización, envío y checkout.
- `v5-final.css` y `v5-final.js`: persistencia, privacidad, folios, validaciones y sincronización.
- `api/submit.js`: respaldo seguro en Notion.
- `api/health.js`: estado de la integración.
- `tests/smoke.js`: validaciones de lanzamiento.
- `favicon.svg`, `manifest.webmanifest` y `sw.js`: instalación y experiencia web app.
- `vercel.json`: configuración para publicación.
