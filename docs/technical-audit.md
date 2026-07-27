# Auditoría técnica y de experiencia — ANTOJO.

Fecha: 27 de julio de 2026  
Rama auditada: `feat/editorial-blog-ui-audit`  
Estado: primera intervención lista para revisión visual antes de integrar a `main`.

## Resumen ejecutivo

La web ya funcionaba como catálogo y configurador, pero había crecido mediante capas sucesivas de CSS y JavaScript. Eso provocó reglas comerciales duplicadas, componentes que se corregían después de renderizarse y comportamientos distintos entre escritorio y móvil.

Esta intervención estabiliza los puntos que afectan directamente conversión y confianza:

- Una sola matriz oficial de precios.
- Cotización de entrega desde servidor.
- Resumen de pedido usable en móvil.
- Acciones de confirmar y vaciar siempre accesibles.
- Corrección del recorte de paquetes.
- Comunidad e Instagram actualizados.
- Mood switcher controlado.
- Diario editorial responsive con dark mode.
- Pruebas automáticas y CI.

La intervención **no convierte todavía el sitio en un sistema completo de pedidos**. El cierre sigue ocurriendo por WhatsApp y no existe aún una base de datos de clientes, pedidos, anticipos o saldos.

## Hallazgos críticos corregidos

### P0 — Reglas comerciales inconsistentes

Existían diferentes funciones y rangos de precio en `app.js`, los paquetes y el parche de envíos. Una misma cantidad podía mostrar valores distintos dependiendo de la sección.

**Corrección:** `pricing-rules.js` es la fuente compartida para menú, personalización, eventos, pruebas y API.

### P0 — Envío calculado solamente en navegador

La cotización dependía de una llamada externa desde el dispositivo del usuario y de lógica duplicada. Esto hacía más difícil validar, mantener y auditar el total.

**Corrección:** `/api/quote` valida cantidad, personalización y código postal desde servidor. El total continúa marcado como estimado y sujeto a confirmación.

### P0 — Acciones de conversión perdidas al hacer scroll

En pedidos largos, “Continuar por WhatsApp” y “Vaciar selección” quedaban fuera de la vista.

**Corrección:** bloque de acciones sticky dentro del resumen, con altura y scroll separados para productos y totales.

### P1 — Cards de paquetes recortadas

El contenedor horizontal tenía poco espacio vertical mientras los cards activos se trasladaban hacia arriba.

**Corrección:** espacio real en el eje vertical, menor desplazamiento y estados de foco visibles.

### P1 — Mensajes de marca desactualizados

La interfaz conservaba “15K+” y enlaces al handle anterior.

**Corrección:** +16K y `@antojo.beb` en los puntos visibles e interacciones generadas dinámicamente.

## Mejoras de experiencia incorporadas

- Tres moods deliberados: Crema, Pulso y Mariposa.
- Gradiente animado con respeto a `prefers-reduced-motion`.
- Acceso al Diario desde inicio, header, menú y footer.
- Capítulo editorial a pantalla completa.
- Revelado progresivo de palabras con scroll.
- Barra de progreso de lectura.
- Dark mode persistente en el Diario.
- Diseño responsive desde 320 px.
- Headers básicos de seguridad y control de caché.

## Deuda técnica que permanece

### P1 — Arquitectura basada en parches de DOM

`app.js` sigue siendo un archivo grande y varias mejoras se aplican después del render mediante observers e interceptores. Funciona, pero aumenta el riesgo de regresiones.

**Siguiente fase recomendada:** dividir estado, catálogo, precios, pedido, envío, navegación y analítica en módulos explícitos. Los datos de producto deben vivir en un único archivo JSON o módulo.

### P1 — No existe persistencia de pedidos

El pedido vive en `localStorage` y termina en WhatsApp. No se genera folio, registro de cliente, anticipo, saldo ni estado operativo.

**Siguiente fase recomendada:** endpoint para crear pedido, base de datos y panel mínimo con estados: borrador, pendiente de anticipo, confirmado, producción, entregado y cancelado.

### P1 — Dependencia externa para códigos postales

La API postal puede fallar, limitar solicitudes o devolver una coordenada aproximada del código postal.

**Siguiente fase recomendada:** caché server-side, tabla propia de zonas y reglas manuales para estacionamiento, casetas, múltiples destinos y pedidos voluminosos.

### P2 — Pruebas visuales y de flujo

Hay validación de sintaxis, precios y build, pero todavía no existen pruebas E2E de navegador.

**Siguiente fase recomendada:** Playwright para:

- Seleccionar y vaciar paquete.
- Editar cantidades.
- Activar personalización.
- Cotizar recolección y entrega.
- Generar mensaje de WhatsApp.
- Navegar el Diario en claro y oscuro.
- Capturas de regresión en 390, 430, 768, 1024 y 1440 px.

### P2 — Rendimiento de imágenes

Los renders PNG son visualmente importantes, pero deben medirse y servirse en tamaños modernos.

**Siguiente fase recomendada:** WebP/AVIF, `srcset`, tamaños explícitos y presupuesto de peso por página. Medir Lighthouse en móvil antes y después.

### P2 — SEO editorial y local

Faltan piezas para aprovechar el Diario y búsquedas locales.

**Siguiente fase recomendada:** canonical, sitemap, robots, Open Graph por capítulo y datos estructurados `LocalBusiness`, `Product` y `Article`.

### P2 — Accesibilidad avanzada

Se mejoraron focos y reducción de movimiento, pero falta auditoría completa de teclado, contraste, lectores de pantalla y focus trapping en overlays.

### P3 — Content Security Policy

Se agregaron headers básicos, pero no una CSP estricta porque la implementación actual conserva scripts inline y servicios externos.

**Siguiente fase recomendada:** retirar scripts inline, declarar dominios necesarios y activar CSP en modo reporte antes de bloquear.

## Criterios para integrar esta PR

- CI y build de Vercel en verde.
- Revisión visual aprobada en cinco breakpoints.
- Pedido probado con recolección y entrega.
- Personalización probada en 49 y 50 bebidas.
- Vaciar selección accesible en móvil.
- `/api/quote` probado con CP válido, inválido y servicio no disponible.
- Diario probado en modo claro, oscuro y reduced motion.
- Contenido del Capítulo 01 aprobado por Israel.

## Prioridad posterior al merge

1. **Principal:** modularizar pedido/precios/envío y eliminar lógica duplicada de `app.js`.
2. **Secundaria:** crear persistencia real de pedidos y folios antes de sumar más funciones visuales.

No conviene añadir pagos, cuentas, membresías o un CMS complejo hasta que el pedido tenga una fuente de datos confiable y un flujo operativo definido.
