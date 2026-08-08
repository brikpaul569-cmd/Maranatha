# PROJECT BRIEF 04 — Filosofía UX/UI, Coreografía de Movimiento (GSAP) y Minimalismo Premium
**Continúa de:** PROJECT-BRIEF-03-SITEMAP-PERFORMANCE.md
**Versión:** 1.0 — Enfoque: Estética Limpia (Estilo Cosechas) + Animación Avanzada

---

## 1. Filosofía de Diseño: "El Enfoque Cosechas Inmersivo"

El error común de los sitios con muchas animaciones es saturar al usuario. Nuestra dirección de diseño toma la **calidez, espacios en blanco y limpieza visual** de Cosechas.com, pero le añade **capas de profundidad y transiciones cinemáticas** con GSAP.

### 1.1 Principios de UI/UX Pura
*   **Espacio en Blanco Generoso (Negative Space):** El 60% de la pantalla debe respirar. El espacio en blanco no es "vacío", es el lienzo que guía el ojo hacia el producto premium.
*   **Contraste Tipográfico Editorial:** Encabezados grandes y refinados en tipografía Serif (estilo artesanal/premium) combinados con textos de interfaz pequeños, limpios y geométricos (Sans-Serif).
*   **Cromática Orgánica y Sutil:** El fondo nunca es blanco puro (`#FFFFFF`). Usamos un crema/beige ultra suave (`#FBF3E9`) como base, permitiendo que las fotos de los arreglos resalten de forma hiperrealista.
*   **Diseño Invisible:** Los menús, botones de navegación y filtros se ocultan o se simplifican de forma elegante hasta que el usuario los necesita, reduciendo la carga cognitiva.

---

## 2. Coreografía de Movimiento con GSAP (El Plan de Animación)

Cada movimiento debe tener un propósito: **comunicar calidad, guiar la lectura o deleitar el tacto digital.** Usaremos un sistema de tres capas de movimiento soportado por un scroll suave global (`Lenis Scroll`).

### 2.1 La Capa Hero: "Wow Factor" Instantáneo al Cargar
*   **Preloader Orgánico:** El sitio inicia con una pantalla limpia del color de la marca. Un trazo SVG del logotipo (o una silueta floral) se dibuja dinámicamente con `gsap.fromTo("path", {drawSVG: "0%"}, {drawSVG: "100%"})`. Al terminar, la pantalla se desliza hacia arriba revelando el sitio.
*   **Text Reveal Cinematic:** El titular principal no aparece de golpe. Usando `Split-Type`, separamos el texto en líneas. Las líneas rotan y flotan desde abajo hacia arriba con un leve desenfoque inicial (`blur`), simulando una revelación de revista digital de lujo.
*   **Micro-Parallax de Ratón (Desktop Only):** Al mover el cursor por la pantalla del Hero, la imagen principal del arreglo floral se mueve sutilmente en dirección opuesta al mouse, creando un efecto de profundidad tridimensional (3D percibido).

### 2.2 La Capa Scroll Storytelling: "El Sitio Vive al Navegar"
*   **Parallax de Imágenes Multicapa:** En las secciones de "Nosotros" o "Proceso Artesanal", las imágenes se desplazan a diferentes velocidades utilizando `gsap.to(image, {yPercent: -20, ease: "none", scrollTrigger: {scrub: true}})` al hacer scroll.
*   **Revelación por Máscaras (Image Mask Reveal):** Las fotos de los catálogos entran bloqueadas en un contenedor sin desbordamiento (`overflow-hidden`). Al hacer scroll, una máscara CSS se expande horizontal o verticalmente revelando la imagen de fondo con un movimiento fluido.
*   **Pinning con Staggered Entrance:** Fijamos una sección en la pantalla (ej. "Cómo trabajamos"). El fondo se congela y, a medida que el usuario sigue haciendo scroll, 3 pasos explicativos entran uno tras otro en una secuencia fluida (stagger), antes de liberar la pantalla.

### 2.3 La Capa de Acción: "Transiciones sin Saltos"
*   **GSAP Flip para el Lightbox del Catálogo:** Cuando el usuario toca una tarjeta de producto en el grid, no abrimos un modal genérico. Usando `GSAP Flip`, la imagen de la tarjeta se expande físicamente ocupando la mitad de la pantalla, mientras el panel de detalles (precio, descripción, botón de WhatsApp) aparece con un fade-in coordinado. Al cerrar, la imagen regresa a su tamaño original en el grid de forma inversa.
*   **Hover Reaccionario (Microinteracciones):** 
    *   Los botones principales usan un efecto líquido o magnético: el botón se desplaza levemente hacia el cursor del usuario cuando este se acerca, aumentando la tasa de clics (CTR).
    *   Las tarjetas de producto tienen un sutil efecto de inclinación (`tilt`) al pasar el cursor sobre ellas.

---

## 3. UX Móvil: Adaptación de Movimiento Inteligente

Dado que más del 80% del tráfico en Colombia comprará desde su teléfono celular, la experiencia móvil debe ser perfecta:

*   **Desactivación Selectiva de Parallax:** En dispositivos móviles, el parallax complejo de ratón y ciertos ScrollTriggers pesados se desactivan automáticamente usando `gsap.matchMedia()`. Esto evita saltos bruscos causados por el rebote de la barra de navegación del navegador móvil.
*   **Gestos Naturales (Swipe & Tap):** El Lightbox expandido de productos permite cerrar deslizando la imagen hacia abajo (`swipe down`) o avanzar de producto deslizando hacia los lados (`swipe left/right`).
*   **Interacciones al Alcance del Pulgar (Thumb-Zone UX):** El widget flotante de WhatsApp y los botones de añadir al carrito se ubican en la zona inferior de la pantalla para que el usuario pueda operarlos fácilmente con una sola mano.

---

## 4. Checklist de Validación de Animación y UX

Antes de pasar a producción cada componente animado, debe cumplir la regla de **"Animación Invisible y Funcional"**:

*   [ ] **¿Es rápida?:** Ninguna animación de transición o revelación de texto dura más de 0.8 segundos. El preloader dura máximo 1.5 segundos.
*   [ ] **¿Afecta el CLS?:** Las animaciones se ejecutan utilizando propiedades CSS que no alteran el diseño de la página (`transform: translate3d`, `opacity`, `scale`), garantizando un Cumulative Layout Shift de 0.
*   [ ] **¿Es accesible?:** Si un usuario tiene activada la preferencia del sistema de "Reducir movimiento" (`prefers-reduced-motion`), el sitio desactiva automáticamente todos los efectos de GSAP y muestra transiciones estáticas instantáneas.
*   [ ] **¿Se siente nativo?:** Gracias a `Lenis Scroll`, el desplazamiento del sitio se siente con una inercia natural, idéntico a las aplicaciones móviles nativas de iOS o Android.

---

## 5. Siguiente Paso de Ejecución Técnica

Para empezar a programar esta experiencia visual sin retrasos, te propongo el siguiente orden de desarrollo:
1. Configurar el archivo global de estilos (`globals.css`) con los esquemas de color y variables CSS.
2. Crear el componente `<SmoothScroll />` que inicializa `Lenis` y lo vincula con `GSAP ScrollTrigger`.
3. Desarrollar el esqueleto del Hero Component aplicando `Split-Type` para la coreografía del texto de entrada.
