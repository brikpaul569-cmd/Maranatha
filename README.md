# Detalles Maranatha 🌸

![Detalles Maranatha](./maranatha.jpeg)

> **"Un detalle dice lo que las palabras no alcanzan"**

Sitio web *premium* para **Detalles Maranatha**, emprendimiento colombiano de arreglos florales, detalles y regalos artesanales: bouquets de listón, flores de limpiapipas, arreglos con peluches, canastas temáticas y talleres presenciales en Bogotá.

No es una floristería genérica: es una experiencia de marca construida con motion design de alto impacto (GSAP + Lenis), mobile-first y pensada para convertir visitas en pedidos por WhatsApp.

---

## ✨ Características

### Dos ecosistemas en un solo sitio
- **Tienda (`/`)** — catálogo, ocasiones, domicilios y venta por WhatsApp.
- **Taller (`/taller`)** — mundo pastel dedicado a los talleres artesanales presenciales, con scrapbook infográfico del producto estrella (el osito de peluche), horarios por zona, niveles y ambiente propio.
- **Toggle de tijeras** en el header que alterna entre ecosistemas con una transición de cortina animada.

### Catálogo completo
- **4 categorías**: Flores de listón · Flores de limpiapipas · Arreglos con peluche · Canastas y detalles.
- **9 ocasiones**: San Valentín, Cumpleaños, Amor y Amistad, Día de la Madre, Aniversarios, Condolencias, Navidad, Agradecimiento y Recién nacido.
- **16 productos** con páginas propias (`/producto/[slug]`) pre-renderizadas (SSG) y schema.org `Product`.

### Domicilios en Bogotá
- Páginas por zona (`/domicilios/bogota`, `bogota-norte`, `bogota-centro`, `bogota-sur`, `bogota-soacha`) con sitemap y schema `LocalBusiness`.
- Fase 1 lanzada solo con zonas de cobertura real de entrega.

### Motion design (GSAP 3 + Lenis)
- **Preloader** de entrada con revelado de marca.
- **SplitText** con revelado carácter a carácter en titulares.
- **Parallax multicapa** (Collage Flotante) con `ParallaxFloat` por sección.
- **ScrollTrigger** + smooth scroll de **Lenis**.
- **Curtain transition** entre páginas/ecosistemas (ondulación desde el punto de clic).
- **Scroll progress**, revelados por scroll, collage flotante y scrapbook animado.
- **`prefers-reduced-motion`** respetado: solo se anima `transform`/`opacity`.

### Temas dinámicos
- **Paleta pastel por tokens CSS** (`--color-mar-*`).
- **Modo oscuro** (luna/sol) con transición suave y persistencia en `localStorage`.
- **Temas por sesión** curados (4–6) aplicados vía CSS variables y persistidos en `sessionStorage` (decorativo, no afecta SEO).

### SEO y performance (fase 1)
- **Sitemap index**: `sitemap.xml` + páginas, productos y zonas (`sitemap-paginas`, `sitemap-productos`, `sitemap-zonas`).
- `robots.ts`, metadatos dinámicos por página, **schema.org** `LocalBusiness`/`Product`.
- **`next/font`** auto-optimizado (Fraunces, Inter, Great Vibes, Jost) — sin `<link>` externo.
- **Presupuesto móvil**: LCP < 2.0s · INP < 150ms · CLS < 0.05 · Lighthouse ≥ 90 · home < 1.5 MB transferidos.

### Conversión
- **WhatsApp flotante** siempre visible (canal único de pedido).
- CTA "Ver catálogo" en hero y CTAs por producto.
- Lightbox con **swipe** en móvil (>80% del tráfico en Colombia es móvil).

---

## 🧱 Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | **Next.js 16.3** (App Router, Turbopack/Webpack) |
| UI | **React 19** + **TypeScript** |
| Estilos | **Tailwind CSS v4** (CSS-first, sin `tailwind.config`) |
| Animación | **GSAP 3.15** (ScrollTrigger, SplitType) + **Lenis 1.3.26** smooth scroll |
| Tipografía | `next/font`: Fraunces (display), Inter (sans), Great Vibes (script), Jost (futura) |
| Renderizado | SSG para catálogo/productos, SSG para institucionales, ISR para actualizaciones |

---

## 📁 Estructura del proyecto

```
app/
├── page.tsx                    → Home (hero animado + storytelling)
├── catalogo/                   → Catálogo general + [categoria]
├── ocasiones/                  → Ocasiones + [ocasion]
├── producto/[slug]/            → Detalle de producto (SSG)
├── domicilios/bogota/          → Cobertura Bogotá + [ciudad]
├── nosotros/                   → Historia y valores
├── galeria/                    → Galería inmersiva
├── contacto/                   → Contacto + WhatsApp
├── taller/                     → Ecosistema taller (scrapbook, talleres, aprender)
├── sitemap*.xml/               → Rutas de sitemaps (páginas, productos, zonas)
└── robots.ts                   → robots.txt programático

components/
├── ui/                         → Section, Button, Card, Eyebrow, Icons
├── site-header.tsx             → Header con nav + toggles (ecosistema, tema)
├── site-footer.tsx             → Footer con teaser "Próximamente", créditos, redes
├── hero-home.tsx               → Hero con scroll cue y SplitReveal
├── scrapbook-infographic.tsx   → Infografía scrapbook (producto estrella)
├── bear-infographic.tsx        → Infografía del osito de peluche (frameless)
├── parallax-float.tsx          → Parallax/float reutilizable
├── preloader.tsx               → Preloader de entrada
├── nav-transition.tsx          → Cortina de transición entre páginas
├── smooth-scroll.tsx           → Lenis
├── floating-whatsapp.tsx       → Botón WhatsApp flotante
├── theme-*.tsx                 → Tema modo oscuro / sesión
└── ...                         → Reveals, split text, galería, etc.

lib/
├── products.ts                 → Productos, categorías y ocasiones
├── zones.ts                    → Zonas de domicilio Bogotá
├── constants.ts                → Navegación, talleres, redes sociales
├── theme.ts                    → Temas y modo oscuro
└── seo.ts                      → Metadatos SEO

public/placeholders/            → SVG y fotos de producto (Oso, gift, flower, ribbon)
```

---

## 🚀 Puesta en marcha

```bash
# Instalar dependencias
npm install

# Desarrollo (Turbopack)
npm run dev

# Producción
npm run build          # Linux/macOS
npm run build:webpack  # Windows (Turbopack bloqueado por política del SO)

# Lint
npm run lint
```

Abre [http://localhost:3000](http://localhost:3000).

> **Nota Windows**: en esta máquina `npm run build` falla por las bindings nativas de Turbopack bloqueadas por política de OS — usa `npm run build:webpack`.

---

## 🎨 Sistema de diseño

| Token | Valor | Rol |
|---|---|---|
| `--color-mar-pink` | `#F7C9D6` | Rosa pastel cálido (primario) |
| `--color-mar-pink-light` | `#FADCE4` | Rosa claro |
| `--color-mar-cream` | `#FBF3E9` | Crema/beige (fondo) |
| `--color-mar-gold` | `#D9A94E` | Dorado suave (acento) |
| `--color-mar-sage` | `#A9C4A0` | Verde salvia (flores/plantas) |
| `--color-mar-brown` | `#3A2A24` | Marrón cálido (texto principal) |
| `--color-mar-card` | `#FFFDF9` | Blanco roto (tarjetas) |

- **Tonos**: cálido, cercano, emocional; profesional, nunca infantil.
- **Dirección de arte**: "Collage Flotante" — parallax multicapa, moods por sección, fotos recortadas y scrapbook.
- **Iconografía**: trazo fino y orgánico (hojas, lazos, corazones, regalos).

---

## ✅ Estado del proyecto (Fase 1 — Bogotá)

- [x] Home con hero animado + scroll cue
- [x] Catálogo + filtros por categoría/ocasión
- [x] Páginas de producto (SSG + schema.org)
- [x] Domicilios Bogotá + zonas de cobertura real
- [x] Ecosistema Taller completo (scrapbook, talleres, aprender)
- [x] Modo oscuro + temas por sesión
- [x] Preloader, transiciones de cortina, parallax, smooth scroll
- [x] Sitemaps + robots + SEO on-page
- [ ] Blog / novedades (Fase 2)
- [ ] Deploy a producción (Vercel)

---

## 🔗 Redes y contacto

- Instagram: [@maranatha.detalles](https://www.instagram.com/maranatha.detalles/)
- TikTok: [@detallesmaranatha](https://www.tiktok.com/@detallesmaranatha)
- WhatsApp: botón flotante en el sitio

---

## 📚 Documentación del proyecto

Los briefs autoritativos (en español) viven en el repo:

- `PROJECT-BRIEF.md` — negocio, personas, paleta, taxonomía, roadmap
- `PROJECT-BRIEF-02-SEO-Y-REFERENCIA.md` — decisión de stack, SEO, temas de sesión, lightbox
- `PROJECT-BRIEF-03-LANZAMIENTO-BOGOTA-SITEMAP.md` — alcance Fase 1, sitemap, presupuesto de performance
- `PROJECT-BRIEF-05-ART-DIRECTION-DELASSUS.md` — dirección de arte "Collage Flotante"
- `AGENTS.md` — convenciones de desarrollo para agentes/IA

---

<div align="center">
  Diseñado y desarrollado con 💛 · <strong>by Brik</strong>
</div>
