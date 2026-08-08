# PROJECT BRIEF 03 — Lanzamiento Fase 1 (Bogotá) + Sitemap y Performance Extrema
**Continúa de:** PROJECT-BRIEF.md y PROJECT-BRIEF-02-SEO-Y-REFERENCIA.md
**Versión:** 1.0

---

## 1. Alcance del lanzamiento Fase 1: solo Bogotá

Se reduce el alcance geográfico inicial para lanzar rápido y con fuerza en un solo mercado antes de expandir. Toda la arquitectura ya definida (`/domicilios/[ciudad]`) se mantiene igual — simplemente se **puebla primero solo con Bogotá y sus zonas**, dejando la estructura lista para escalar sin rehacer nada.

### 1.1 Zonas de Bogotá a cubrir en el lanzamiento
Tomando el patrón de sorpresascolombia.com (que segmenta incluso dentro de una misma ciudad), para Bogotá se recomienda abrir con 3-5 páginas de zona en vez de una sola página genérica:

```
/domicilios/bogota                → página "hub" general de Bogotá
/domicilios/bogota-norte
/domicilios/bogota-centro
/domicilios/bogota-sur
/domicilios/bogota-soacha
/domicilios/bogota-occidente       (si aplica cobertura real)
```

**Regla:** solo crear páginas de zonas donde realmente haya domicilio/entrega — no inflar páginas vacías sin cobertura real, eso perjudica la confianza del usuario y puede leerse como contenido de baja calidad para Google.

Cada página de zona necesita (mínimo):
- H1 único mencionando la zona.
- 2-3 párrafos de texto único (no plantilla repetida) — ej. tiempos de entrega estimados en esa zona, referencia a barrios/localidades específicas.
- Bloque de productos destacados (puede ser el mismo catálogo, pero presentado con contexto local).
- CTA de WhatsApp con mensaje prellenado mencionando la zona ("Hola, quiero un detalle para envío en Bogotá - Norte").

### 1.2 Página hub `/domicilios/bogota`
Actúa como nodo central: enlaza a todas las zonas, tiene el schema `LocalBusiness` principal del sitio, y es la página que se prioriza en campañas y en Google Business Profile.

### 1.3 Preparado para expansión (sin trabajo extra después)
- El modelo de datos del CMS ya debe tener el campo "ciudad/zona de cobertura" desde el día 1, aunque hoy solo tenga valores de Bogotá — así, agregar Barranquilla o Bucaramanga en el futuro es solo **contenido nuevo**, no una reconstrucción técnica.
- El componente de página de zona se construye **genérico** (recibe ciudad/zona como parámetro `[ciudad]` de Next.js), nunca hardcodeado para Bogotá.

---

## 2. Sitemap: especificación técnica

### 2.1 Generación
- Sitemap XML generado dinámicamente con la **Metadata API nativa de Next.js** (`app/sitemap.ts`) o con `next-sitemap` si se necesita más control sobre prioridades/frecuencias.
- Debe **regenerarse automáticamente** cada vez que el CMS headless agrega/quita un producto o una zona — sin intervención manual (coherente con el requisito de "sitio vivo").
- Incluir `lastmod` real (fecha de última edición del producto en el CMS), no una fecha fija — Google usa esto para decidir con qué frecuencia revisitar la página.

### 2.2 Estructura y prioridades sugeridas
| Tipo de página | `priority` | `changefreq` |
|---|---|---|
| Home | 1.0 | daily |
| `/domicilios/bogota` (hub) | 0.9 | weekly |
| `/domicilios/[zona]` | 0.8 | weekly |
| `/catalogo` y categorías | 0.8 | daily |
| Fichas de producto | 0.7 | weekly |
| `/ocasiones/[ocasion]` | 0.7 | weekly (o daily cerca de la fecha de la ocasión) |
| `/galeria`, `/nosotros`, `/contacto` | 0.5 | monthly |
| `/novedades/[slug]` (blog) | 0.6 | monthly |

### 2.3 Sitemap index (para cuando crezca)
Aunque hoy el sitio es pequeño (solo Bogotá), estructurar desde ya como **sitemap index** (`sitemap.xml` que apunta a `sitemap-productos.xml`, `sitemap-zonas.xml`, `sitemap-paginas.xml`) para que escalar a más ciudades o cientos de productos no rompa nada ni obligue a migrar de esquema.

### 2.4 robots.txt
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Sitemap: https://[dominio-final]/sitemap.xml
```

### 2.5 Envío y monitoreo
- Registrar el sitio en **Google Search Console** desde el primer deploy (no esperar al lanzamiento "oficial") para que la indexación empiece a correr en paralelo al desarrollo.
- Enviar el sitemap manualmente la primera vez, luego confiar en el recrawl automático.
- Revisar semanalmente el reporte de "Cobertura"/"Páginas" en Search Console durante el primer mes para detectar errores de indexación rápido.

---

## 3. Performance de carga "brutal" — presupuesto de rendimiento

Objetivo explícito: el sitio debe sentirse **instantáneo**, incluso con todo el motion design de GSAP y fondo dinámico. Se define un presupuesto de performance estricto:

### 3.1 Métricas objetivo (Core Web Vitals, mobile)
| Métrica | Objetivo |
|---|---|
| LCP (Largest Contentful Paint) | < 2.0s |
| INP (Interaction to Next Paint) | < 150ms |
| CLS (Cumulative Layout Shift) | < 0.05 |
| Lighthouse Performance (mobile) | ≥ 90 |
| Peso total de la página de inicio (transferido) | < 1.5 MB en la carga inicial |

### 3.2 Reglas técnicas para lograrlo

**Imágenes**
- Todo con `next/image`: formatos AVIF/WebP automáticos, tamaños responsivos (`sizes`), lazy-load nativo excepto la imagen principal del hero (`priority`).
- Fotos de producto comprimidas y servidas desde CDN (Cloudinary o el propio Image Optimization de Vercel).

**Video de fondo (si se usa en el hero)**
- Versión mobile más liviana o incluso **reemplazo por imagen/animación CSS/SVG en mobile** en vez de video pesado — el video de fondo es de los elementos que más pesan en conexiones móviles colombianas.
- `preload="metadata"`, sin autoplay de video >2-3MB sin comprimir agresivamente (H.264/AV1, bitrate bajo).

**GSAP y JS**
- Code-splitting por ruta: no cargar plugins de GSAP que no se usan en esa página (ej. `Flip` solo en galería/lightbox, no en todo el sitio).
- Cargar GSAP y sus plugins de forma diferida (`dynamic import` en componentes cliente) donde sea posible, para no bloquear el primer render.
- Fondo dinámico por sesión (tema random): calcular y aplicar con CSS variables **antes** del primer paint donde sea posible (script mínimo inline), para evitar parpadeo — pero sin bloquear el render del contenido real.

**Fuentes**
- Usar `next/font` (auto-hosting + `font-display: swap`) en vez de cargar fuentes desde servicios externos con `<link>` — reduce solicitudes externas y evita bloqueo de render por fuentes de terceros.

**CSS/JS general**
- Tailwind ya purga clases no usadas por defecto — mantener esa disciplina, evitar CSS-in-JS pesado adicional.
- Evaluar cada dependencia externa (¿de verdad se necesita?) antes de agregarla — cada librería suma peso.

**Cacheo y entrega**
- Vercel Edge Network (CDN) para servir assets estáticos lo más cerca posible del usuario en Colombia.
- Headers de cache agresivos para assets estáticos (imágenes, fuentes, JS/CSS con hash) — `Cache-Control: public, max-age=31536000, immutable`.
- ISR con revalidación razonable (ej. 1 hora) para que el contenido esté fresco sin regenerar en cada request.

### 3.3 Checklist de validación antes de cada release
- [ ] Lighthouse mobile ≥ 90 en Performance, Accessibility, Best Practices, SEO
- [ ] Probado en una conexión simulada 3G/4G lenta (throttling en DevTools), no solo en wifi de oficina
- [ ] Sin layout shift al cargar fuentes, imágenes o al aplicar el tema de fondo dinámico
- [ ] Peso del JS inicial (`First Load JS` que reporta Next.js en build) monitoreado y con alerta si crece sin control
- [ ] Sitemap válido (sin errores) verificado en Search Console

---

## 4. Resumen de esta iteración

| Tema | Decisión |
|---|---|
| Alcance geográfico Fase 1 | Solo Bogotá (hub + 3-5 zonas), estructura ya preparada para expandir sin rehacer nada |
| Sitemap | Dinámico vía Next.js Metadata API, regenerado automáticamente, estructurado como sitemap index desde ya |
| Search Console | Registro desde el primer deploy, no esperar al lanzamiento oficial |
| Performance | Presupuesto estricto (LCP < 2s, Lighthouse mobile ≥ 90), reglas específicas para imágenes, video, GSAP, fuentes y cacheo |

---

## 5. Siguiente paso sugerido

Con Bogotá como alcance y el sitemap/performance ya definidos, el siguiente entregable natural es el **wireframe + estructura de carpetas de Next.js** (rutas reales de Bogotá y sus zonas, componentes base, modelo de datos del CMS) para pasar de documentación a código.
