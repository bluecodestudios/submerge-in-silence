# Submerge in Silence — Design System

Sistema visual de la landing publicada en `bluecodestudios.github.io/submerge-in-silence`.
Todos los valores están tomados del CSS en producción (`css/styles.css`), no son aproximaciones.

Linaje: la estructura tipográfica y de ritmo viene de **rocionavarro.org**; el color viene del logo
**Water Healing by Rocío Navarro**, cuyo verde `#519484` es el color principal de la marca.

---

## 1. Color

### Tokens

| Token | Valor | Rol |
|---|---|---|
| `--sand` | `#519484` | **Principal.** Botones, numeración, marcadores, barra de progreso, acentos |
| `--sand-soft` | `#9CC4B8` | Acento claro: etiquetas y detalles sobre fondos oscuros |
| `--bark` | `#3C6F63` | Verde profundo: texto secundario, etiquetas, precios |
| `--slate` | `#2E5B51` | Verde medio: degradados y agua |
| `--ink` | `#22302C` | Tinta: todo el texto de cuerpo sobre fondo claro |
| `--ink-deep` | `#152420` | Secciones oscuras, pie de página, barra fija |
| `--cream` | `#F2F5F2` | Fondo base |
| `--shell` | `#E3EDE8` | Fondo alterno, para alternar ritmo entre secciones |
| `--line` | `rgba(34,48,44,.18)` | Filetes y bordes sobre claro |
| `--line-light` | `rgba(242,245,242,.18)` | Filetes sobre oscuro |

### Cómo se combinan

- **Fondo claro** → texto `--ink`; secundario `rgba(34,48,44,.86)`; terciario `.70`–`.75`.
- **Fondo oscuro** → texto `--cream`; secundario `rgba(242,245,242,.78)`.
- **Botón principal**: fondo `--sand` con texto `--ink-deep`. Nunca texto blanco sobre el verde: el
  contraste no alcanza. Al pasar el cursor el fondo se llena de `--ink` y el texto pasa a `--cream`.
- **Alternancia de secciones**: claro → oscuro → claro. Las secciones oscuras usan `--ink-deep`;
  el testimonio usa `--bark` para diferenciarse de ellas.

### Agua del hero (shader WebGL)

| Uniform | Valor | Rol |
|---|---|---|
| `uDeep` | `#102018` | Fondo profundo del agua |
| `uMid` | `#2E5B51` | Masa media |
| `uLight` | `#7FB3A3` | Cáusticas y crestas |
| `uCream` | `#F2F5F2` | Brillo especular |

Degradado de respaldo del hero (si no hay WebGL):
`radial-gradient(120% 90% at 70% 15%, #2E5B51 0%, #1C3B35 45%, #102018 100%)`

---

## 2. Tipografía

| Familia | Token | Uso |
|---|---|---|
| **Marcellus** | `--display` | Todos los títulos, cifras de precio, citas |
| **PT Serif** | `--body` | Cuerpo de texto |
| Sans del sistema | `--mono` | Micro-etiquetas, botones, datos tabulares |

Pila completa: `"Marcellus", "PT Serif", Georgia, serif` · `"PT Serif", Georgia, "Times New Roman", serif` ·
`ui-sans-serif, "Helvetica Neue", Helvetica, Arial, sans-serif`.

### Escala fluida

| Token | Valor | Uso |
|---|---|---|
| `--fs-hero` | `clamp(3.2rem, 12vw, 11rem)` | Título del hero y del cierre |
| `--fs-h1` | `clamp(2.3rem, 6vw, 5.2rem)` | Titular de sección a pantalla completa |
| `--fs-h2` | `clamp(1.95rem, 4.2vw, 3.6rem)` | Titular de sección |
| `--fs-h3` | `clamp(1.5rem, 2.6vw, 2.2rem)` | Subtítulo |
| `--fs-h4` | `clamp(1.15rem, 1.5vw, 1.35rem)` | Encabezado de columna |
| `--fs-lead` | `clamp(1.1rem, 1.6vw, 1.45rem)` | Párrafo destacado |
| `--fs-body` | `clamp(1rem, 1.1vw, 1.08rem)` | Cuerpo |
| `--fs-micro` | `clamp(.66rem, .76vw, .73rem)` | Etiquetas en versalitas |

### Reglas de ajuste

- Títulos: `line-height` 1.04–1.06, `letter-spacing` **−0.02em**. El hero baja a −0.035em y 0.92 de interlineado.
- Cuerpo: `line-height` 1.66, medida máxima **56ch**; las listas, 52ch.
- Micro-etiquetas: mayúsculas, `letter-spacing` **0.2em**, `--bark` al 75% de opacidad.
- Botones: mayúsculas, `letter-spacing` 0.14em, `line-height` 1.

---

## 3. Espaciado y layout

| Token | Valor | Uso |
|---|---|---|
| `--pad` | `clamp(1.25rem, 5vw, 5rem)` | Margen lateral de toda la página |
| `--gap-sec` | `clamp(4.25rem, 8.5vw, 8.5rem)` | Aire vertical entre secciones |
| `--maxw` | `1440px` | Ancho máximo del contenido |

Retículas recurrentes:

- **Editorial a dos columnas**: `minmax(0,.26fr) minmax(0,1fr)` — etiqueta pegajosa a la izquierda, texto a la derecha.
- **Texto + imagen**: `minmax(0,1fr) minmax(0,1.05fr)`, con la columna de texto en `position:sticky`.
- **Retículas automáticas**: siempre `repeat(auto-fit, minmax(min(100%, Xpx), 1fr))`. El `min(100%, …)`
  no es opcional: sin él las retículas desbordan en móvil.

---

## 4. Forma

- **Radios**: `2px` en imágenes y casillas · `3px` en tarjetas y paneles · `999px` en botones y etiquetas.
  Nada de esquinas muy redondeadas: la marca es editorial, no de producto.
- **Bordes**: siempre 1px con `--line` o `--line-light`.
- **Sombras**: solo al pasar el cursor, nunca en reposo.
  `0 26px 60px -34px rgba(34,48,44,.55)` en tarjetas · `0 30px 70px -40px` en las de alojamiento.
- **Grano**: capa fija de ruido SVG al 20% de opacidad sobre toda la página, con deriva de 6 s.

---

## 5. Movimiento

| Parámetro | Valor |
|---|---|
| Curva | `--ease: cubic-bezier(.22,1,.36,1)` |
| Microinteracción | 0.45–0.6 s |
| Transición de sección | 0.8–1.5 s |
| Revelado de títulos | `expo.out`, 1.15 s, escalonado 0.035 s por palabra |

Patrones:

- **Títulos**: cada palabra sube desde una máscara de desbordamiento. Nunca aparecen por opacidad sola.
- **Cuerpo y elementos**: `opacity 0 → 1` con `y: 22px → 0`, disparado al 92% de la ventana, una sola vez.
- **Imágenes**: parallax vertical del 5–18% más entrada por `clip-path` desde `inset(12% 6%)`.
- **Recorrido horizontal** (sección 04): sección anclada en ≥ 900 px, el carril se desplaza con scrub;
  por debajo, las tarjetas se apilan.
- **Testimonio**: se ilumina palabra por palabra con scrub, de opacidad 0.12 a 1.
- `prefers-reduced-motion`: sin loader, sin grano, sin parallax; todo visible y quieto.

---

## 6. Componentes

**Barra de navegación.** Fija, z-index 800. Sobre el hero es transparente con el logo en claro
(`filter: brightness(0) invert(1)`); pasado el hero se vuelve sólida —`rgba(242,245,242,.9)` con
`backdrop-filter: blur(14px)`— y el logo recupera su verde. Se oculta al bajar y reaparece al subir.
Con el menú móvil abierto sube a z-index 1000 para que el botón de cerrar siga accesible.

**Logo.** Altura `clamp(34px, 3.6vw, 52px)`, proporción 2.59:1, siempre con fondo transparente.

**Botones.** Píldora con relleno que sube desde abajo al pasar el cursor. Cuatro variantes:
principal (verde), `--ghost` (contorno), `--light` (crema, para fondos oscuros) y `--ghost-light`.
`--sm` reduce a `.7rem 1.25rem`.

**Etiqueta de sección.** `01 — THE PREMISE`: versalitas, 0.2em de tracking, pegajosa en la columna lateral.

**Franja de datos.** Banda `--ink-deep` bajo el hero, cinco pares dato/valor separados por filetes
verticales; a 860 px pasa a dos columnas y la última ocupa el ancho completo.

**Tarjeta de carrusel.** 370px de ancho, mínimo 270–350 de alto, numeral romano al 28% de opacidad
en la esquina superior derecha. La última tarjeta invierte a fondo oscuro.

**Tarjeta de precio.** Borde de 1px, halo radial verde en la esquina inferior derecha, tabla de
características con filetes, etiqueta opcional en píldora.

**Medidor de profundidad.** Línea vertical fija a la izquierda en ≥ 1180 px; cambia a tono claro
sobre las secciones oscuras.

**Barra fija de reserva.** Aparece al salir del hero y se retira al llegar a la sección de reserva.

---

## 7. Puntos de ruptura

| Ancho | Qué cambia |
|---|---|
| ≥ 900 px | Recorrido horizontal anclado en la sección 04 |
| ≤ 1180 px | Desaparece el medidor de profundidad |
| ≤ 1024 px | Las retículas editoriales pasan a una columna |
| ≤ 860 px | Menú hamburguesa; franja de datos a dos columnas |
| ≤ 520 px | Botones a ancho completo |

---

## 8. Accesibilidad

- Foco visible: contorno de 2px en `--sand` con 4px de separación.
- El contenido no depende del JS: `[data-reveal]` solo se oculta cuando la clase `.js` está presente.
- Jerarquía de títulos real (`h1` → `h4`), `aria-label` en navegación y logo, `aria-expanded` en el menú.
- Sin scroll horizontal entre 320 y 1920 px.

---

## 9. Tokens en JSON

```json
{
  "color": {
    "primary": "#519484",
    "primarySoft": "#9CC4B8",
    "deepGreen": "#3C6F63",
    "midGreen": "#2E5B51",
    "ink": "#22302C",
    "inkDeep": "#152420",
    "cream": "#F2F5F2",
    "shell": "#E3EDE8",
    "line": "rgba(34,48,44,0.18)",
    "lineLight": "rgba(242,245,242,0.18)"
  },
  "water": { "deep": "#102018", "mid": "#2E5B51", "light": "#7FB3A3", "spec": "#F2F5F2" },
  "font": {
    "display": "Marcellus",
    "body": "PT Serif",
    "label": "system sans-serif"
  },
  "type": {
    "hero": "clamp(3.2rem, 12vw, 11rem)",
    "h1": "clamp(2.3rem, 6vw, 5.2rem)",
    "h2": "clamp(1.95rem, 4.2vw, 3.6rem)",
    "h3": "clamp(1.5rem, 2.6vw, 2.2rem)",
    "h4": "clamp(1.15rem, 1.5vw, 1.35rem)",
    "lead": "clamp(1.1rem, 1.6vw, 1.45rem)",
    "body": "clamp(1rem, 1.1vw, 1.08rem)",
    "micro": "clamp(0.66rem, 0.76vw, 0.73rem)",
    "headingTracking": "-0.02em",
    "labelTracking": "0.2em",
    "bodyLineHeight": 1.66,
    "measure": "56ch"
  },
  "space": {
    "pagePadding": "clamp(1.25rem, 5vw, 5rem)",
    "sectionGap": "clamp(4.25rem, 8.5vw, 8.5rem)",
    "maxWidth": "1440px"
  },
  "radius": { "image": "2px", "card": "3px", "pill": "999px" },
  "motion": {
    "ease": "cubic-bezier(0.22, 1, 0.36, 1)",
    "micro": "0.45s",
    "section": "1.15s",
    "wordStagger": "0.035s"
  },
  "breakpoints": { "sm": "520px", "md": "860px", "lg": "900px", "xl": "1180px" }
}
```
