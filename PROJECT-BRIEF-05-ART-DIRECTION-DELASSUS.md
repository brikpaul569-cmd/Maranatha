# PROJECT BRIEF 05 — Art Direction "Collage Flotante" + Parallax Multicapa (Referencia: delassus.com)

**Continúa de:** PROJECT-BRIEF.md, PROJECT-BRIEF-02-SEO-Y-REFERENCIA.md, PROJECT-BRIEF-03-LANZAMIENTO-BOGOTA-SITEMAP.md y "PROJECT-BRIEF - copia.md" (Brief 04)
**Versión:** 1.0 — Decisión de art direction basada en la referencia delassus.com

---

## 1. Resumen ejecutivo

Se adopta el **lenguaje visual del sitio delassus.com** (producido por el estudio Bonhomme, París) como referencia maestra de art direction para Detalles Maranatha. Es un sitio corporativo de un grupo agrícola marroquí (cítricos, uvas, aguacates y flores) — productos orgánicos, artesanales y con historia, el mismo "alma" que el catálogo de Maranatha.

La decisión: **el catálogo es el protagonista y el fondo es un lienzo vivo que cambia**. Productos flotando en collage con parallax multicapa, fondo pastel que muta de color por sección, tipografía editorial gigante y transiciones de página sin saltos.

Todo es compatible con el stack ya cerrado (Next.js App Router + GSAP + Tailwind): no cambia ninguna decisión técnica previa, solo eleva el nivel de diseño y movimiento.

---

## 2. Referencia analizada: delassus.com (verificado)

| Aspecto | Detalle |
|---|---|
| Producción | Bonhomme (París) — sitio a medida, no plantilla |
| Stack | HTML/CSS/JS custom, Cloudinary para imágenes, videos propios |
| Transiciones | Navegación con transición de página (`data-route`, clase `is-transition`), nunca "salta" |
| Parallax | Imágenes por capa con velocidades distintas (0.8 a 1.3) vía atributos `data-prllx-item` / `data-delta` |
| Fondo por sección | Cada sección cambia de color de fondo (naranja, verde, amarillo, rosas) |
| Tipografía | Gigante, editorial, con peso visual de marca (incluye sprites de letras) |
| Collage | Productos con posiciones relativas (top/left/width en %) superpuestos en la pantalla |
| Video | Loops por sección con poster estático; intro con botón skip |
| Mobile | Overlay "gire el dispositivo" para pantallas pequeñas |

### Qué tomamos de Delassus (adaptado a Maranatha)

| Técnica Delassus | Adaptación Maranatha | Herramienta |
|---|---|---|
| Parallax multicapa con velocidades distintas | Productos del catálogo que flotan a velocidad propia al hacer scroll | GSAP ScrollTrigger con `scrub` |
| Fondo que cambia por sección | Mood pastel por sección aplicado con CSS variables | Design tokens (ya definidos) |
| Tipografía gigante editorial | Headlines display enormes con Fraunces | `next/font` |
| Collage flotante de productos | Composición desbalanceada de 3-5 imágenes por sección | Componentes React + posicionamiento relativo |
| Transiciones de página suaves | Fade/slide entre rutas sin recarga brusca | Router de Next + GSAP en componentes cliente |
| Intro con video y skip | Preloader de 1.5s máx. con trazo SVG del logo | GSAP (brief 04) |

### Qué descartamos (y por qué)

| Técnica Delassus | Motivo de descarte |
|---|---|
| Videos loop pesados | Rompen el presupuesto LCP < 2s; en mobile se sustituyen por imagen + parallax (brief 03) |
| Sprites de letras para tipografía | JS innecesario; Fraunces variable con `next/font` logra el mismo impacto con menos peso |
| Overlay "gire el dispositivo" | Bloquea mobile y el 80% del tráfico es móvil — nunca bloquear la experiencia móvil |
| Sonido / toggle de audio | Fricción y peso; sin valor para conversión por WhatsApp |
| Micro-parallax de ratón | Solo desktop opcional; nunca en mobile (brief 04) |

---

## 3. Art direction: "Collage Flotante Maranatha"

### 3.1 Principio rector

> El arreglo floral es la estrella. El fondo es un lienzo pastel que respira y cambia de estado; los productos flotan en él como piezas de un escaparate vivo, con profundidad y aire alrededor. Nada se amontona: el 60% de la pantalla respira (brief 04).

### 3.2 Sistema de secciones (moods)

| Sección | Mood / fondo | Rol |
|---|---|---|
| Hero | Rosa pastel cálido (`#F7C9D6`) | Impacto de 3 segundos: headline gigante + 1-2 arreglos flotando |
| Nosotros / proceso | Crema (`#FBF3E9`) | Storytelling con parallax suave y stagger |
| Catálogo / categorías | Variante por categoría (verde salvia `#A9C4A0` para plantas, dorado suave `#D9A94E` para detalles) | Foco en producto, filtros con Flip |
| Galería | Blanco roto (`#FFFDF9`) | Inmersión, lightbox |
| Ocasiones | Tema activo de temporada | Decorativo, puede sobreescribir el random (brief 2 §4) |
| Contacto / domicilios | Crema oscurecido | Conversión: WhatsApp CTA dominante |

El cambio de mood por sección usa el mismo mecanismo que los temas de sesión (brief 2): **CSS variables en el contenedor de la sección**, sin tocar layout.

### 3.3 Reglas de composición del collage

- **3-5 imágenes por sección como máximo** (menos es más).
- **Posiciones desbalanceadas**: una imagen dominante (~55-60% del ancho) + satélites superpuestos en los bordes, con profundidad (`z-index` distinto).
- **Aire**: mínimo 20% de la sección libre; nunca llenar el lienzo.
- **Superposición con intención**: los arreglos pueden tocarse levemente entre sí o con el texto gigante, nunca obstruir el CTA.
- **Sombras suaves** (drop-shadow sutil, no box-shadow dura) para dar sensación de objeto físico sobre el fondo.

### 3.4 Tipografía gigante editorial

- **Display**: Fraunces (variable) en tamaños `clamp(3rem, 12vw, 9rem)`, trazos con `font-variation-settings` para peso óptico.
- **Contraste**: headline serif gigante + etiquetas UI en sans geométrica pequeña con `letter-spacing` amplio (estilo editorial premium, brief 1 §5).
- **Revelado**: SplitType por líneas con blur inicial y stagger (brief 4 §2.1).
- **Regla SEO**: el texto gigante es HTML real renderizado en servidor; el efecto de revelado solo anima, nunca oculta contenido.

---

## 4. Coreografía de movimiento (integra brief 04 con Delassus)

### 4.1 Preloader
Trazo SVG del logo dibujándose (máx. 1.5s, con skip). El fondo del preloader usa el tema de la sesión.

### 4.2 Hero ("wow" de 3 segundos)
1. Headline con SplitType: líneas que suben desde abajo con desenfoque inicial.
2. Arreglo principal que entra con escala 1.08 → 1 (fade + scale, 0.8s máx).
3. Satélites del collage entran con stagger ligero (50-80ms entre cada uno).
4. (Desktop) micro-parallax de ratón opcional con `gsap.matchMedia()`.

### 4.3 Secciones con scroll storytelling
- **Parallax multicapa**: imágenes a velocidades 0.8 / 1.0 / 1.2 según su rol (fondo lento, satélite medio, dominante rápido), con `scrub: true`.
- **Cambio de mood**: el fondo de la sección transiciona su color via `gsap.to` sobre las CSS variables cuando la sección entra al viewport.
- **Entradas con stagger**: tarjetas, contadores y textos entran en cascada (brief 4 §2.2).
- **Pinning** solo donde aporta narrativa (ej. "cómo trabajamos"), nunca decorativo.

### 4.4 Catálogo y galería
- **Filtros por categoría/ocasión** con GSAP Flip: el grid se reordena como transición continua, no como recarga.
- **Lightbox con Flip** (brief 2 §5): la imagen crece desde su posición en el grid; navegación swipe en mobile, ESC en desktop.
- **Hover de producto**: tilt/scale sutil + revelado de precio/nombre (brief 4 §2.3).

### 4.5 Transiciones de página
- Fade/slide entre rutas (máx. 0.4s) gestionado en el layout con componentes `"use client"`.
- El contenido real queda en el DOM para SEO; la transición es una superposición visual.

### 4.6 Accesibilidad
- `prefers-reduced-motion`: todas las animaciones se desactivan y las transiciones se vuelven instantáneas (brief 4 §4).
- Animaciones solo con `transform` / `opacity` → CLS 0.

---

## 5. Adaptación mobile (80% del tráfico)

| Regla | Implementación |
|---|---|
| Parallax fuerte desactivado | `gsap.matchMedia()` — en mobile solo fade/scale suave, sin scrub de velocidades |
| Sin video loop | Imagen `next/image` con parallax mínimo o animación CSS/SVG (brief 3 §3.2) |
| Collage simplificado | 2-3 imágenes como máximo; la dominante ocupa todo el ancho, satélites recortados |
| Lightbox con gestos | Swipe para navegar y cerrar (brief 2 §5) |
| WhatsApp en thumb-zone | CTA fijo en zona inferior, accesible con una mano (brief 4 §3) |
| Tipografía gigante | `clamp()` mantiene el impacto sin desbordes; revisar `overflow` |

---

## 6. Presupuesto de performance (se mantiene estricto, brief 3)

| Métrica | Objetivo |
|---|---|
| LCP (mobile) | < 2.0s |
| INP | < 150ms |
| CLS | < 0.05 |
| Lighthouse Performance (mobile) | ≥ 90 |
| Home (transferido, carga inicial) | < 1.5 MB |

Reglas no negociables con el nuevo lenguaje visual:
- Todo con `next/image` (AVIF/WebP, `sizes`, lazy excepto hero con `priority`).
- GSAP y plugins con code-splitting por ruta (Flip solo en catálogo/galería).
- Lenis + ScrollTrigger sincronizados; sin librerías extra de animación.
- Fondos pastel son colores planos/CSS, no imágenes de fondo pesadas.
- Medir Lighthouse mobile en cada sección antes de darla por cerrada.

---

## 7. Checklist de validación por sección/release

- [ ] Lighthouse mobile ≥ 90 (Performance, A11y, Best Practices, SEO)
- [ ] Probado en conexión 3G/4G simulada (throttling), no solo wifi
- [ ] Sin layout shift al cargar fuentes, imágenes ni al cambiar mood de sección
- [ ] Con `prefers-reduced-motion` activo: todo se muestra estático e instantáneo
- [ ] En mobile (320-768px): collage legible, WhatsApp CTA visible, parallax desactivado
- [ ] Textos gigantes visibles sin JS (SEO): contenido en el DOM desde el SSR
- [ ] First Load JS monitoreado y sin crecimiento descontrolado

---

## 8. Resumen de decisiones tomadas en esta iteración

| Tema | Decisión |
|---|---|
| Referencia maestra | delassus.com (Bonhomme) — lenguaje "collage flotante" + parallax multicapa |
| Fondo | Mood pastel por sección vía CSS variables (reutiliza mecanismo de temas del brief 2) |
| Composición | 3-5 imágenes desbalanceadas, 60% aire, superposición con intención |
| Tipografía | Fraunces gigante (`clamp`) + sans geométrica; revelado con SplitType |
| Parallax | GSAP ScrollTrigger con velocidades 0.8-1.2, scrub; desactivado en mobile |
| Video | Descartado (excepto intro corta); imagen + parallax en su lugar |
| Transiciones de página | Fade/slide ≤ 0.4s, contenido indexable intacto |
| Performance | Presupuesto del brief 3 se mantiene sin excepciones |

---

## 9. Siguiente paso sugerido

✅ **EJECUTADO (Ago 2026) — Fase 0**: repo Next.js 16.3 App Router + Tailwind v4, tokens de paleta y moods en `app/globals.css`, tipografías Fraunces + Inter con `next/font`, y base de animación: `components/smooth-scroll.tsx` (Lenis + GSAP ScrollTrigger), `components/reveal.tsx` (sistema de reveals), `components/floating-collage.tsx` (collage flotante con parallax multicapa + `gsap.matchMedia()`). Estado: lint ✅, build ✅ (`npm run build:webpack` — Turbopack bloqueado por política de Windows en esta máquina).

**Fase 1**: completar el hero con SplitType (revelado de líneas con blur), preloader con trazo SVG, header/nav, footer y sistema de componentes base (botones, cards) — Brief 1 §12.
