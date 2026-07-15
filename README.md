# ANTOJO. web app

Web app mobile-first para explorar el menú, armar un pedido o solicitar una cotización para un evento.

## Funciones principales

- Catálogo visual de 18 bebidas.
- Flujo separado entre **Armar mi pedido** y **Solicitar cotización**.
- Cantidades rápidas para eventos: 50, 100, 200 u otra cantidad.
- Ajuste individual de piezas por sabor.
- Precios públicos: 1–5 a $65 c/u, 6–20 a $60 c/u y 21–50 a $55 c/u.
- A partir de 51 piezas se solicita cotización especial sin mostrar un precio final inventado.
- Recolección en WTC, entrega a domicilio desde 10 piezas y logística para evento.
- Estimador de envío dentro del checkout.
- Personalización, validación para alcohol y resumen final.
- Pedido o cotización prellenada para WhatsApp al `+52 55 2202 6291`.
- Favicon, manifest, service worker, animaciones blur y slider automático.

## Publicación

Sitio estático compatible con Vercel. El punto de entrada es `index.html` y no requiere comando de compilación.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flavidadeuncreativo%2Fantojo-bio)

## Estructura

- `index.html`: estructura principal.
- `v4-styles-*.css`: interfaz responsiva y animaciones.
- `v4-render-*.js`: renders optimizados de las bebidas.
- `v4-app-*.js`: catálogo, precios, carrito, cotización, envío, checkout y WhatsApp.
- `favicon.svg`, `manifest.webmanifest` y `sw.js`: instalación y experiencia web app.
- `vercel.json`: configuración para publicación estática.
