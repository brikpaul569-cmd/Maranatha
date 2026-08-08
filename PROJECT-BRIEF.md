# PROJECT BRIEF — Sitio Web "Detalles Maranatha" (nombre provisional)
**Versión:** 1.0 — Documento base para iteración de desarrollo
**Rol asumido:** Ingeniero Frontend Senior (14 años exp.) — React + GSAP + Motion Design
**Fecha:** Agosto 2026

---

## 1. Resumen ejecutivo

Detalles Maranatha es un emprendimiento colombiano de arreglos florales, detalles y regalos (bouquets de listón, flores de limpiapipas, arreglos con peluches, canastas, catálogos temáticos como café y comida). El objetivo es lanzar un sitio web de nivel *premium/agencia*, con animaciones GSAP de alto impacto, que le permita:

1. Posicionarse a nivel **nacional** (Colombia) rápidamente, no solo local.
2. Competir visualmente con sitios de referencia como **Cosechas.com** (paleta pastel, e-commerce floral consolidado) y sitios de "wow-factor" tipo **motionsites.ai** (landing agencies con scroll storytelling, parallax avanzado, microinteracciones).
3. Funcionar como un **sitio vivo**: catálogo que se actualiza con frecuencia (nuevos productos, precios, temporadas — San Valentín, Amor y Amistad, Día de la Madre, Navidad), sin fricción técnica para el dueño del negocio.
4. Convertir visitantes en pedidos (WhatsApp / catálogo / formulario) con una experiencia memorable de principio a fin.

**No es "otro sitio de floristería genérico"**: la diferenciación está en el motion design, el storytelling de marca y la velocidad de percepción (primera impresión de 3 segundos que debe sorprender).

---

## 2. Objetivos de negocio

| Objetivo | Métrica de éxito |
|---|---|
| Posicionamiento nacional | Tráfico orgánico desde ciudades fuera de la ciudad base en 3-6 meses |
| Generación de pedidos | # de clics a WhatsApp / formularios de pedido por semana |
| Percepción de marca premium | Tiempo en sitio > 1:30 min, bounce rate < 40% |
| Reconocimiento en redes | Tráfico referido desde Instagram/TikTok |
| Fidelización | Catálogo actualizado ≥ 1 vez por semana sin depender de un dev |

---

## 3. Público objetivo (buyer persona)

- **Persona A — "El detallista espontáneo"**: 18-35 años, compra desde el celular, busca algo bonito y rápido para una fecha especial (cumpleaños, aniversario, disculpas). Decide por impacto visual + facilidad de pedir por WhatsApp.
- **Persona B — "Comprador de temporada"**: busca con antelación para fechas como San Valentín, Amor y Amistad, Día de la Madre. Compara varias tiendas, sensible a precio y variedad.
- **Persona C — "Cliente corporativo/eventos"**: empresas o personas que buscan detalles para eventos, catering, regalos empresariales (relevante por las bandejas de comida vistas en el catálogo).

Insight clave: **>80% del tráfico de este tipo de negocio en Colombia es móvil**, por lo que el diseño debe pensarse mobile-first, no como adaptación de desktop.

---

## 4. Análisis competitivo / referencias

### Referencias directas de industria (floristerías/e-commerce de regalos)
- **Cosechas.com** — paleta pastel, fotografía de producto limpia, checkout simple, confianza (testimonios, garantías). Tomar de aquí: la calidez cromática y la claridad de catálogo.
- Interflora / Flores Colombia / Rosatel — benchmarks de UX de e-commerce floral: filtros por ocasión, "regalos para..." como taxonomía principal, entrega el mismo día como CTA fuerte.

### Referencias de motion/experiencia (agencias de alto nivel)
- **motionsites.ai** — scroll storytelling, hero con video/animación inmediata, transiciones GSAP entre secciones, cursor personalizado, microinteracciones en botones.
- Estudio general de sitios "Awwwards/FWA": parallax multicapa, texto que se revela con scroll (SplitText), imágenes con reveal por máscara, transiciones de página fluidas.

### Qué tomamos de cada uno
- De Cosechas: **estructura de catálogo, confianza, calidez pastel**.
- De motionsites.ai y sitios FWA: **el "wow" de los primeros 3 segundos, movimiento con propósito (no decorativo), performance percibido**.

---

## 5. Identidad de marca y tono

- **Tono de voz:** cálido, cercano, emocional ("un detalle dice lo que las palabras no alcanzan"), pero con lenguaje profesional — no infantil a pesar de usar peluches como producto.
- **Paleta de color (pastel):**
  - Primario: rosa pastel cálido `#F7C9D6` / `#FADCE4`
  - Secundario: crema/beige `#FBF3E9` (fondo)
  - Acento dorado suave: `#D9A94E` (usado en los catálogos actuales — moños, detalles)
  - Verde salvia (para flores/plantas): `#A9C4A0`
  - Texto principal: marrón oscuro cálido `#3A2A24` (no negro puro, mantiene la calidez)
  - Blanco roto para tarjetas: `#FFFDF9`
- **Tipografía sugerida:**
  - Display/Headings: una serif elegante con carácter editorial (ej. "Fraunces", "Playfair Display" o similar variable font) para transmitir artesanía.
  - Texto/UI: sans-serif geométrica y legible (ej. "General Sans", "Inter" o "Satoshi").
- **Iconografía:** trazo fino, orgánico (hojas, lazos, corazones sutiles), evitar clip-art genérico.

---

## 6. Arquitectura de información (estructura del sitio)

```
/                       → Home (hero animado + storytelling de marca)
/nosotros               → Historia, valores, proceso artesanal
/catalogo               → Catálogo general con filtros
  /catalogo/flores-liston
  /catalogo/flores-limpiapipas
  /catalogo/arreglos-peluche
  /catalogo/canastas-detalles
  /catalogo/ocasiones (San Valentín, Cumpleaños, Amor y Amistad, etc.)
/galeria                → Galería inmersiva (masonry animado, casos reales)
/contacto               → Formulario + WhatsApp + mapa/zona de entrega
/blog o /novedades       → (opcional fase 2) contenido SEO, ideas de regalo
```

**Header (no fijo o semi-fijo con transición al hacer scroll):**
Inicio · Nosotros · Catálogo (con submenú por categoría) · Galería · Contacto — + botón CTA "Pedir por WhatsApp" siempre visible.

**Footer:** redes sociales (Instagram, TikTok, WhatsApp), horarios de atención, zona de cobertura/domicilios, mini-mapa del sitio.

---

## 7. Stack técnico propuesto

| Capa | Tecnología |
|---|---|
| Framework | React 18/19 (Vite) — sin Next.js si se prioriza SPA con animación total; **evaluar Next.js si SEO nacional es prioridad #1** (SSR/SSG mejora indexación) |
| Animación | **GSAP** (core) + `ScrollTrigger` + `SplitText`/`SplitType` + `Flip` para transiciones de galería |
| Estilos | Tailwind CSS (utilidades) + tokens de diseño en CSS variables (paleta pastel) |
| Iconos | Lucide React |
| Gestión de catálogo | Headless CMS ligero (Sanity.io o Strapi) para que el dueño edite productos sin tocar código → clave para el requisito de "sitio vivo" |
| Imágenes | Cloudinary o similar (optimización automática, WebP/AVIF) |
| Formularios/Pedidos | Integración directa a WhatsApp Business (deep link con mensaje prellenado por producto) + formulario de contacto (Resend/EmailJS) |
| Analítica | Google Analytics 4 + Meta Pixel (para campañas pagas futuras) |
| Hosting | Vercel o Netlify (despliegue continuo desde CMS/Git) |
| SEO técnico | Schema.org `LocalBusiness` + `Product`, sitemap.xml, metadatos dinámicos por producto |

> **Recomendación técnica:** Si el objetivo real es "posicionamiento nacional rápido" (SEO), un framework con **SSR/SSG (Next.js)** es muy superior a una SPA pura de React, porque Google indexa contenido renderizado en servidor mucho más rápido y confiablemente. GSAP funciona perfecto dentro de Next.js. Vale la pena decidir esto antes de iterar.

---

## 8. Sistema de animación GSAP (concepto)

1. **Preloader/entrada:** carga breve con logo animado (trazo SVG dibujándose) — máx. 1.5s, con opción de skip.
2. **Hero:** headline con `SplitText` (revelado letra por letra o línea por línea), imagen/video de fondo con leve parallax al mover el mouse, CTA con micro-hover (glass/liquid button, como el ejemplo de referencia "flowpath" que se compartió).
3. **Scroll storytelling (secciones "Nosotros"/proceso):** pinning de secciones con `ScrollTrigger`, elementos que entran con stagger, contadores animados (ej. "+500 detalles entregados").
4. **Galería avanzada:** grid masonry con `Flip` para transiciones al filtrar por categoría, hover con reveal de precio/nombre, lightbox con transición fluida (no modal abrupto).
5. **Transiciones de página:** fade/slide suaves entre rutas (si es SPA) para que nunca se sienta un "salto".
6. **Microinteracciones:** botones con estados líquidos/glass (como el ejemplo `.liquid-glass` compartido), cursor personalizado en desktop (opcional), hover en tarjetas de producto con leve tilt/scale.

**Regla de oro:** cada animación debe tener un propósito narrativo o de usabilidad — nunca movimiento porque sí (esto es lo que diferencia un sitio "premium" de uno "cargado").

---

## 9. El sitio como "organismo vivo" (actualización continua)

- Catálogo gestionado 100% desde CMS headless (sin depender de un desarrollador para subir/quitar productos o cambiar precios).
- Sección de "Novedades" o "Temporada actual" en home, que cambia automáticamente según fecha (San Valentín, Amor y Amistad, Navidad, etc.) mediante banderas de temporada configurables.
- Integración de feed de Instagram/TikTok en la galería o footer, para que el sitio se sienta siempre actualizado sin trabajo extra.
- Plan de contenido: mínimo 2-4 productos nuevos o actualizados por semana, apoyado en la producción real del negocio (evidente en las imágenes: hay variedad constante de bouquets).

---

## 10. Estrategia SEO y de mercado (nacional)

1. **SEO on-page:** título y meta-descripción únicos por categoría/producto, uso de palabras clave long-tail ("detalles para regalar en [ciudad]", "arreglos florales a domicilio Colombia", "flores de listón hechas a mano").
2. **SEO técnico:** Core Web Vitals cuidados a pesar de las animaciones (lazy-load de video/imágenes pesadas, `will-change` controlado, evitar layout shift).
3. **SEO local + nacional combinado:** Google Business Profile para la ciudad base + páginas de cobertura si hay envíos nacionales (ej. "Enviamos a toda Colombia").
4. **Contenido:** blog/novedades con ideas de regalo por ocasión — capta búsquedas informacionales que luego convierten.
5. **Redes sociales como canal de adquisición primario** (más realista para "viralizar rápido" que el SEO puro en el corto plazo): Reels/TikTok mostrando el proceso artesanal, con link en bio al catálogo.
6. **Prueba social:** reseñas de clientes, contador de pedidos entregados, testimonios con foto real.

---

## 11. Categorías de producto detectadas (según catálogo actual)

- Flores de listón (ramos de rosas de satín) — rango $15.000–$85.000
- Flores de limpiapipas (bouquets artesanales pequeños) — ~$25.000–$35.000
- Arreglos con peluche + flores (canastas temáticas: conejito, dinosaurio, unicornio) — precio variable
- Canastas de café + detalle (marca propia "Café Cerquera")
- Bandejas de comida/pasabocas para eventos
- Catálogos temáticos por fecha (ej. amor y amistad)

Esto sugiere una **taxonomía de catálogo por tipo de producto + por ocasión**, con precios visibles (buena práctica para reducir fricción en Colombia, donde el cliente suele preguntar precio primero).

---

## 12. Roadmap de desarrollo sugerido

**Fase 0 — Fundación (1 semana) — ✅ COMPLETADA (Ago 2026)**
- Definir stack final (Next.js vs Vite SPA) → **Next.js 16.3 App Router** (confirmado en Brief 02)
- Setup de repo → scaffold + GSAP 3.15 + Lenis 1.3.26 instalados (ver Brief 05 §9)
- Design tokens → paleta pastel + moods de sección en CSS variables + Fraunces/Inter con `next/font`
- Base de animación → `SmoothScroll` (Lenis+GSAP), `Reveal` (ScrollTrigger), `FloatingCollage` (parallax multicapa)
- Wireframes de baja fidelidad → pendiente, se hará junto a la Fase 1

**Fase 1 — Home + Hero + Sistema de diseño (1-2 semanas)**
- Hero con animación GSAP completa, header/nav, footer, sistema de componentes base (botones, cards).

**Fase 2 — Catálogo + Galería (1-2 semanas)**
- Conexión a CMS headless, filtros, grid animado, ficha de producto, integración WhatsApp.

**Fase 3 — Nosotros + Contacto + SEO técnico (1 semana)**
- Storytelling de marca, formulario, schema.org, sitemap, metadatos.

**Fase 4 — Pulido de motion + performance + QA mobile (1 semana)**
- Auditoría Lighthouse/Core Web Vitals, ajuste de animaciones en mobile (reducir motion si es necesario), testing cross-device.

**Fase 5 — Lanzamiento + medición**
- GA4/Meta Pixel activos, plan de contenido en redes conectado al lanzamiento.

---

## 13. Checklist técnico inicial (para arrancar el repo)

- [x] Definir framework: Next.js (recomendado para SEO) vs React+Vite puro → **Next.js 16 App Router**
- [x] Setup Tailwind con tokens de color/tipografía de marca → tokens `mar-*` + moods en `globals.css`
- [x] Instalar GSAP + plugins (`ScrollTrigger`, `SplitText`/`SplitType`, `Flip`) — nota: algunos plugins premium de GSAP (SplitText, MorphSVG) requieren licencia Club GreenSock o usar alternativas open-source (`SplitType`). Estado: GSAP core + ScrollTrigger instalados; SplitType/Flip se cargan por ruta en Fase 1/2
- [ ] Definir CMS headless y modelar el schema de "Producto" (nombre, categoría, precio, imágenes, ocasión, disponible)
- [ ] Componente de botón "Pedir por WhatsApp" reutilizable con deep-link dinámico por producto
- [x] Definir breakpoints y estrategia mobile-first → `gsap.matchMedia()` desactiva parallax en mobile (Brief 05 §5)
- [ ] Configurar analítica y eventos de conversión (clic en WhatsApp = evento clave)

---

## 14. Notas finales

- El documento de referencia que compartiste (hero "flowpath" con `.liquid-glass`, nav con dropdowns, video de fondo) es un **excelente punto de partida técnico** para el hero de este proyecto: se puede adaptar directamente la paleta pastel, el copy de marca y el video/imagen de producto real en lugar del video genérico.
- Próximo paso natural: iterar sobre este brief sección por sección — sugiero empezar por **Fase 0 (definir stack) + wireframe del Hero**, ya que ahí está el mayor impacto de "sorpresa" que buscas.
