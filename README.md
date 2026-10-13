# Submerge in Silence — landing page

Landing de la experiencia *Submerge in Silence* (Rocío Navarro · Tecopa, 3–6 de diciembre 2026).
Copy tomado íntegro de `submerge-in-silence-landing.md`. Sistema visual extraído de **rocionavarro.org**.

---

## 1. Cómo verlo

**Opción A — Live Server (recomendada en VS Code)**
1. Abre la carpeta `submerge-in-silence` en VS Code.
2. Instala la extensión *Live Server* (Ritwick Dey).
3. Clic derecho en `index.html` → **Open with Live Server**.

**Opción B — servidor estático**

```bash
python -m http.server 5510
```

Luego abre `http://localhost:5510`.

---

## 2. Estructura

```
submerge-in-silence/
├── index.html          — hero + 12 secciones + cierre + barra de reserva fija
├── css/styles.css      — sistema de diseño completo (tokens, tipografía, layout, responsive)
├── js/water.js         — hero WebGL: superficie de agua con shader (Three.js)
├── js/main.js          — loader, smooth scroll, animaciones GSAP, menú, contador, gate de términos
├── assets/img/         — las 5 fotografías + 2 placeholders SVG de respaldo
└── README.md
```

Dependencias por CDN (sin build, sin npm): **GSAP 3.12 + ScrollTrigger**, **Three.js r128**, **Lenis 1.1**,
y las tipografías **Marcellus** + **PT Serif** de Google Fonts.

---

## 3. Sistema de diseño (heredado de rocionavarro.org)

| Token | Valor | Uso |
|---|---|---|
| `--cream` | `#F6F3EC` | fondo base |
| `--shell` | `#ECE4DA` | fondo alterno de sección |
| `--ink` | `#36302A` | texto |
| `--ink-deep` | `#241F1B` | secciones oscuras, footer |
| `--bark` | `#574C3F` | testimonio, texto secundario |
| `--sand` | `#B9A590` | acento, botones, numeración |

- **Marcellus** en títulos con tracking `-0.02em` (igual que el sitio original); **PT Serif** en cuerpo.
- Sans del sistema en mayúsculas con tracking amplio para micro-etiquetas (`01 — THE PREMISE`), el rol que allí cumple *Clarkson*.
- Escala fluida con `clamp()`: sin saltos entre 320 px y 1440+ px.

---

## 4. Fotografías

Ya están integradas, copiadas desde tu carpeta `Imagenes/` y renombradas:

| Archivo en `assets/img/` | Origen | Dónde se usa |
|---|---|---|
| `springs-sunset.webp` | IMG_6912 | Sección 03, imagen grande vertical |
| `springs-day.webp` | IMG_8430 | Sección 03, imagen superpuesta + textura de fondo en la sección "Silence" |
| `desert-meditation.webp` | WhatsApp Image 2026-03-05 | Sección 06, full bleed con parallax |
| `las-vegas.webp` | las-vegas-airport… | Sección 11, tarjeta LAS |
| `lax.webp` | jeremy-bezanger… | Sección 11, tarjeta LAX |

Si más adelante consigues versiones en mayor resolución, reemplázalas con **el mismo nombre** y listo
(la de Tecopa a pantalla completa es la que más lo agradecería: hoy mide 1000 px de ancho).
Los dos SVG `placeholder-*` quedan solo como red de seguridad si un archivo falta.

**Las habitaciones no llevan foto.** Como no había imágenes reales, la sección 09 se resolvió de forma
tipográfica: precio, tabla de características y CTA por opción. Se ve terminada tal cual; si quieres sumar
fotos después, es un cambio acotado.

---

## 5. Pendientes de contenido (los `[FALTA]` del brief)

Marcados en `index.html` con comentarios `<!-- PENDIENTE: ... -->`.

1. **Los 8 módulos (Sección 05).** Solo *Living the Current* venía nombrado. Los nombres 01–07
   (*The Quieting, What You Carry, Arrival, The Water, The Fire, The Dream, Return*) son **provisionales**,
   escritos en la voz del brief; sustitúyelos, junto con el formato de cada módulo y cuántas semanas antes
   arranca la preparación.
2. **Lodging (Sección 09).** Ocupación, tipo de cama y baño son supuestos razonables, igual que las dos
   líneas descriptivas y la etiqueta "Most requested" de la privada. Confírmalos o cámbialos.
3. **Getting here (Sección 11).** Harry Reid (LAS) ≈ 2 h y LAX ≈ 4 h, más la nota de carpool tras confirmar
   plaza: confirma tiempos y logística real.
4. **Cupo.** «12 places» aparece en la franja de datos, en el cierre y en la barra fija; cámbialo en los tres
   sitios si el número es otro.
5. **Recorte respecto al brief.** El bloque *Who this is not for* (Sección 7 del `.md` original: «If you are
   looking for a spa week…» / «People cry here. Things surface…») se quitó a propósito. La sección 07 solo
   implementa *Who this is for*, centrada a una columna; si quieres recuperar esa advertencia, el texto
   sigue en el brief.

---

## 6. Qué hace cada pieza de la experiencia

- **Hero WebGL**: shader propio (fbm + bandas cáusticas + specular cálido) en Three.js. Reacciona al puntero
  y se «hunde» con el scroll. Se pausa fuera de viewport y con la pestaña oculta; en móvil baja DPR y frame cap.
- **Franja "at a glance"** bajo el hero: fechas, lugar, estructura, cupo y precio desde — el lector entiende
  de qué se trata en tres segundos.
- **Barra de reserva fija**: aparece al salir del hero y se retira al llegar a la sección de reserva.
- **Sección 04** «What the four days hold»: recorrido horizontal con pin en ≥ 900 px y contador `01 / 05`;
  en móvil es un carrusel con *scroll-snap* nativo y arrastre.
- **Sección 05**: tres fases con encabezado sticky y los 8 módulos en retícula.
- **GSAP + ScrollTrigger**: titulares revelados palabra a palabra con máscara, parallax, clip-path de entrada
  en las imágenes, testimonio que se ilumina con scrub.
- **Lenis** para el scroll suave, sincronizado con el ticker de GSAP.
- **Medidor de profundidad** a la izquierda (≥ 1180 px), que cambia a claro sobre las secciones oscuras.

### Accesibilidad y robustez

- `prefers-reduced-motion`: sin loader, sin grano, sin parallax; todo el contenido visible y quieto.
- Si el JS o un CDN falla, el contenido se muestra igual (`[data-reveal]` solo se oculta con la clase `.js`),
  y un temporizador retira el loader a los 6 s pase lo que pase.
- Foco visible, `aria-expanded` en el menú, checkbox de términos operable por teclado (los CTA avisan si falta).
- Sin scroll horizontal a 360, 390, 430, 768, 820, 900 y 1536 px.
