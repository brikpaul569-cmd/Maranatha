# PROJECT BRIEF 02 — Decisión de stack, SEO en Next.js y análisis de referencia (sorpresascolombia.com)
**Continúa de:** PROJECT-BRIEF.md
**Versión:** 1.0

---

## 1. Decisión de stack: confirmado Next.js

Queda cerrado: el sitio se construye en **Next.js** (App Router), no en una SPA de Vite. Esto no sacrifica el motion design — GSAP + ScrollTrigger funcionan igual dentro de componentes cliente (`"use client"`). Lo que ganamos:

- **SSR/SSG real**: Google indexa HTML ya renderizado, no depende de ejecutar JS para "ver" el contenido.
- **Metadata API de Next.js**: `generateMetadata` por página/producto → títulos, descripciones y Open Graph dinámicos sin trabajo manual.
- **Rutas de archivo = arquitectura de información clara**, ideal para categorías/ocasiones/ciudades (ver punto 3).
- Compatible con Vercel (deploy simple, edge/CDN automático — importante para que el sitio cargue rápido en todo el país).

**Regla técnica clave:** las animaciones GSAP van en componentes `"use client"`, pero el contenido (texto, precios, nombres de producto) se renderiza en el servidor. Nunca ocultar contenido real detrás de una animación que dependa 100% de JS para existir en el DOM — eso perjudica el SEO aunque se vea bien.

---

## 2. Análisis de referencia: sorpresascolombia.com

Es un e-commerce de regalos/sorpresas construido sobre WooCommerce, con años de indexación en Google. Esto es lo que hace bien y que le sirve a Maranatha:

### 2.1 Segmentación geográfica como estrategia de SEO nacional
Tienen un selector de **"Destino del regalo"** con ciudades específicas: Armenia, Barranquilla, Bogotá, Bogotá - Centro, Bogotá - Soacha, Bogotá - Zona Sur, Bucaramanga, etc. Es decir, **no tienen una sola página nacional genérica**, sino páginas/categorías segmentadas por ciudad y hasta por zona dentro de una misma ciudad.

**Por qué funciona:** cada página captura búsquedas tipo "regalos a domicilio en Soacha" o "flores a domicilio Bucaramanga", que son mucho menos competidas que "regalos Colombia" y generan tráfico orgánico real desde múltiples ciudades — exactamente el objetivo de posicionamiento nacional que buscas.

**Aplicación a Maranatha:** en vez de intentar competir de una sola vez a nivel nacional, definir 3-5 ciudades/zonas de cobertura real (o próximas a cubrir) y crear una página por ciudad con contenido único (no solo cambiar el nombre), ej: `/domicilios/bogota-soacha`, `/domicilios/bogota-centro`. Cada una con su propio `<title>`, meta-descripción y algo de texto único.

### 2.2 Taxonomía por ocasión, no solo por tipo de producto
Categorías como Cumpleaños, Aniversario, Ocasiones Especiales, Super Regalos, Combos Creativos. La gente busca por **motivo del regalo**, no por "tipo de flor".

**Aplicación:** mantener la taxonomía por tipo de producto que ya definimos (listón, limpiapipas, peluche, etc.) pero **añadir una capa de navegación por ocasión** (Cumpleaños, Amor y Amistad, Aniversario, San Valentín, "Perdón/Disculpas", Día de la Madre) que cruce con los productos existentes. Esto multiplica las páginas indexables sin duplicar productos.

### 2.3 Blog con intención de búsqueda informacional
Tienen artículos tipo "Ideas de regalos según la ocasión", "Por qué regalar peluches es importante". Contenido simple pero que captura búsquedas antes de la decisión de compra.

**Aplicación:** sección `/novedades` o `/ideas-de-regalo` con 1-2 artículos cortos por mes, enlazando siempre a categorías de producto reales (link interno = SEO + conversión).

### 2.4 CTA de WhatsApp omnipresente
Widget de chat con mensaje tipo "Hola 👋 Qué deseas comprar hoy!" visible en todas las páginas, no solo en contacto.

**Aplicación:** ya está contemplado en el brief 1 (botón WhatsApp reutilizable por producto); reforzar que también exista un widget flotante global, no solo botones puntuales.

### 2.5 Filtros de tienda por precio/popularidad/fecha
Su página de tienda permite ordenar por precio, popularidad, fecha, valoración — señal de e-commerce maduro que reduce fricción de decisión.

**Aplicación:** el catálogo de Maranatha debería tener al menos orden por precio y por "novedades", aunque el catálogo sea más pequeño al inicio.

### 2.6 Lo que NO conviene copiar
El sitio de referencia es funcional pero visualmente genérico (plantilla WooCommerce estándar) — no tiene el "wow factor" de motion design que sí queremos para Maranatha. La diferenciación de Maranatha frente a competidores como este debe ser: **misma solidez de SEO/estructura, pero con una experiencia visual muy superior** (GSAP, paleta pastel, storytelling de marca).

---

## 3. Definición formal de SEO (con Next.js)

### 3.1 Arquitectura de URLs (SEO-first)
```
/                                    → Home
/nosotros                           → Marca/historia
/catalogo                           → Catálogo general
/catalogo/[categoria]                → ej: /catalogo/flores-liston
/catalogo/[categoria]/[producto]     → ficha de producto (SSG con ISR)
/ocasiones/[ocasion]                 → ej: /ocasiones/amor-y-amistad
/domicilios/[ciudad]                 → páginas de cobertura por ciudad
/galeria                            → Galería inmersiva
/novedades                          → Blog/ideas de regalo
/novedades/[slug]                    → artículo individual
/contacto
```

### 3.2 Renderizado
- **SSG + ISR (Incremental Static Regeneration)** para páginas de producto y categoría: se generan estáticas pero se revalidan automáticamente (ej. cada hora) cuando el CMS headless actualiza un producto — así el sitio sigue siendo "vivo" sin perder velocidad de carga ni SEO.
- Home y páginas institucionales: estáticas (SSG puro).

### 3.3 Metadata dinámica
- `generateMetadata()` por producto: título (`Nombre del producto | Detalles Maranatha`), descripción con precio y categoría, `og:image` con la foto principal del producto para que se vea bien al compartir en WhatsApp/redes.
- Sitemap dinámico (`sitemap.xml` generado con `next-sitemap` o la API nativa de Next.js) que se actualiza solo al agregar productos/ciudades nuevas.
- `robots.txt` permitiendo todo el sitio salvo rutas de admin/CMS.

### 3.4 Datos estructurados (Schema.org)
- `LocalBusiness` en el layout global (nombre, dirección, teléfono, horario, redes).
- `Product` + `Offer` en cada ficha de producto (precio en COP, disponibilidad).
- `BreadcrumbList` en categorías/productos para mejorar cómo se ve en resultados de Google.

### 3.5 Performance (Core Web Vitals) con animaciones pesadas
- Usar `next/image` para todas las fotos de producto (optimización automática, lazy-load nativo).
- Videos de fondo (si se usan en el hero) comprimidos y con `preload="metadata"`, nunca autoplay de video pesado sin optimizar en mobile — en conexiones móviles colombianas esto es crítico.
- GSAP: cargar solo los plugins necesarios por página (code-splitting), no todo el paquete en el layout global.
- Medir siempre con Lighthouse mobile antes de dar por cerrada una sección.

### 3.6 Contenido único por ciudad (evitar contenido duplicado)
Si se implementan páginas `/domicilios/[ciudad]`, cada una necesita al menos 2-3 párrafos de texto único (no la misma plantilla con el nombre de la ciudad cambiado), para que Google no las trate como contenido duplicado.

---

## 4. Nueva funcionalidad: el sitio como "ecosistema" (fondo dinámico por sesión)

**Requisito:** cada vez que un usuario entra al sitio (nueva sesión), el fondo/ambiente visual cambia drásticamente, como si el sitio fuera un organismo vivo con múltiples "estados" en uno solo.

### Enfoque de implementación
- Definir 4-6 **"temas visuales"** predefinidos (no aleatorio infinito, sino curado), por ejemplo:
  1. Amanecer pastel (rosa + durazno)
  2. Jardín (verde salvia + crema)
  3. Atardecer romántico (rosa intenso + dorado)
  4. Minimal crema (beige + blanco roto)
  5. Temporada activa (ej. rojo/dorado en San Valentín — puede sobreescribir el random en fechas clave)
- Al cargar la sesión (client-side, `useEffect` en el layout), se selecciona un tema al azar entre los disponibles (excluyendo el anterior guardado en `sessionStorage`, para que nunca se repita dos veces seguidas) y se aplica mediante **CSS variables** en el `<html>` o `<body>` (mismo patrón de design tokens ya definido en el brief 1 — solo cambian los valores de las variables, no el layout).
- Transición del cambio de fondo con GSAP (`gsap.to` sobre las variables de color o sobre un gradiente animado) para que el cambio se sienta como parte de la experiencia y no como un parpadeo.
- **Importante para SEO:** este cambio debe ser puramente decorativo/cliente — el HTML y contenido real no dependen de qué tema salga, así que no afecta la indexación.
- Persistencia: usar `sessionStorage` (no `localStorage`) para que el tema cambie en cada sesión nueva pero se mantenga estable mientras el usuario navega entre páginas dentro de la misma visita.

---

## 5. Nueva funcionalidad: galería con imagen ampliada + detalle

**Requisito:** al tocar/hacer clic en una imagen (galería o catálogo), se abre la imagen en grande con un apartado de detalle del producto.

### Enfoque de implementación
- Componente `Lightbox` en cliente, activado por clic/tap en cualquier tarjeta de producto o imagen de galería.
- Transición de apertura con **GSAP Flip**: la imagen crece desde su posición original en el grid hasta ocupar la vista ampliada (no un modal que aparece de la nada — se siente como continuidad visual, coherente con el resto del motion design).
- Layout del lightbox: imagen grande a un lado (o arriba en mobile) + panel de detalle al otro lado con:
  - Nombre del producto
  - Precio
  - Descripción corta
  - Categoría/ocasión relacionada
  - Botón "Pedir por WhatsApp" (con mensaje prellenado del producto específico)
  - Miniaturas si el producto tiene varias fotos
- Navegación entre imágenes dentro del lightbox (flechas/swipe) sin cerrarlo, para que el usuario pueda recorrer varios productos seguidos — importante en mobile, donde el swipe es el gesto natural.
- Cierre con botón X, tecla ESC (desktop) o swipe hacia abajo (mobile).
- Accesibilidad: `focus-trap` dentro del lightbox y `aria-label` apropiados, además de que el contenido de detalle exista también en el DOM normal de la página de producto (para que no dependa solo del lightbox para ser indexado por Google).

---

## 6. Resumen de decisiones tomadas en esta iteración

| Tema | Decisión |
|---|---|
| Framework | **Next.js (App Router)** confirmado |
| Renderizado | SSG + ISR para catálogo, SSG puro para institucionales |
| Estrategia SEO geográfica | Páginas por ciudad/zona (`/domicilios/[ciudad]`), inspirado en sorpresascolombia.com |
| Taxonomía | Producto + Ocasión (doble navegación cruzada) |
| Fondo dinámico | Temas curados que rotan por sesión (`sessionStorage` + CSS variables + transición GSAP) |
| Galería | Lightbox con GSAP Flip + panel de detalle + navegación entre imágenes |
| Contenido | Blog corto de ideas de regalo para SEO informacional |

---

## 7. Siguiente paso sugerido

Con el stack y el SEO ya definidos, el siguiente entregable lógico es el **wireframe/estructura de carpetas de Next.js** (rutas, componentes base, estructura del CMS headless) para empezar a escribir código sobre una base sólida, en vez de seguir solo en documentación.
