# ANTOJO. biolink

Experiencia web responsive para convertir el enlace de Instagram de ANTOJO. en una ruta clara hacia pedido, menú, cotización de eventos, dinámicas y recompensas.

## Experiencia principal

- Inicio tipo biolink con cinco acciones concretas.
- Acceso a WhatsApp con mensajes prellenados.
- Menú editorial de 18 bebidas, sin fondos pesados detrás de las latas.
- Filtros por categoría y buscador en desktop.
- Selector de cantidades con estimación de precio por volumen.
- Onboarding de tres pasos para cotizar eventos.
- Sección de dinámicas para activaciones y contenido.
- Primera versión visual del programa de recompensas.
- Navegación móvil fija y menú lateral en desktop.
- Loader con salida garantizada para evitar pantallas bloqueadas.
- Compatibilidad con reducción de movimiento y etiquetas accesibles.

## Arquitectura

La aplicación quedó intencionalmente simple y mantenible:

- `index.html`: estructura y contenido de las cinco rutas.
- `app.css`: sistema visual y comportamiento responsive.
- `app.js`: navegación, menú, selección, cotización y WhatsApp.
- `renders/`: imágenes de producto existentes.
- `build.js`: copia los archivos publicados a `dist/`.
- `vercel.json`: configuración del despliegue estático.

No usa frameworks, bundles comprimidos ni módulos generados. El objetivo es que cualquier ajuste futuro sea fácil de encontrar y revisar.

## Desarrollo

```bash
npm test
```

El comando valida la sintaxis de JavaScript y genera la carpeta `dist/`.

## Publicación

Vercel ejecuta `node build.js` y publica `dist/`.

## WhatsApp

El número se configura en `CONFIG.whatsappNumber`, al inicio de `app.js`, usando formato internacional sin `+` ni espacios. Cuando no está configurado, WhatsApp abre el selector para compartir el mensaje generado.
