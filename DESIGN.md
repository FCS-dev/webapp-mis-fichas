---
name: Mis Fichas
description: Dashboard financiero personal minimalista que transforma datos en claridad
colors:
  primary: "#8e2f37"
  primary-hover: "#6e2028"
  on-primary: "#ffffff"
  income: "#52998b"
  expense: "#ce3737"
  warning: "#f59e0b"
  bg: "#dddddd"
  bg-dark: "#181715"
  card: "#f2f2f2"
  card-dark: "#262522"
  text: "#252525"
  text-dark: "#d3d3d3"
  text-secondary: "#746354"
  text-secondary-dark: "#a39e94"
  border: "#c8c8c8"
  border-dark: "#3a3834"
  input-bg: "#e4e4e4"
  input-bg-dark: "#302e2a"
  income-bg: "rgba(82,153,139,0.12)"
  expense-bg: "rgba(206,55,55,0.12)"
  primary-bg: "rgba(142,47,55,0.12)"
  warning-bg: "rgba(245,158,11,0.12)"
typography:
  body:
    fontFamily: "'Inter', sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.5
  display:
    fontFamily: "'Inter', sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "'Inter', sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "'Inter', sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.2
  label:
    fontFamily: "'Inter', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: "'Inter', sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.5px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  pill: "28px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  xxl: "24px"
  "3xl": "32px"
  "4xl": "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.md}"
    padding: "20px"
  card-tonal:
    backgroundColor: "{colors.input-bg}"
    rounded: "{rounded.md}"
    padding: "18px"
  input:
    backgroundColor: "{colors.input-bg}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  badge-income:
    backgroundColor: "{colors.income-bg}"
    textColor: "{colors.income}"
    rounded: "{rounded.lg}"
  badge-expense:
    backgroundColor: "{colors.expense-bg}"
    textColor: "{colors.expense}"
    rounded: "{rounded.lg}"
---

# Design System: Mis Fichas

## Overview

**Creative North Star: "La Ventana Clara"**

Mis Fichas es una ventana limpia a la realidad financiera del usuario. El diseño se aparta de los dashboards genéricos saturados de datos y gradientes, optando por una estética donde la información habla por sí misma. Cada elemento existe para comunicar, no para decorar.

La personalidad es minimalista funcional: sin ruido visual, sin adornos innecesarios. Los colores son herramientas de comunicación (verde para ingreso, rojo para gasto, rojo oscuro para acción), no paletas decorativas. El espacio en blanco es tan informativo como el contenido.

**Key Characteristics:**
- Tono sobrio y confiable con rojo oscuro (#8e2f37) como acento de acción
- Superficies planas y tonales, sin sombras pronunciadas
- Jerarquía clara por tamaño, peso y posición, no por decoración
- Consistencia absoluta entre componentes similares
- Responsive progresivo: móvil primero, desktop como extensión natural

## Colors

Paleta funcional con tres roles claros: acción (rojo oscuro), semáforo financiero (verde/rojo), y neutros para estructura. Dark mode usa una paleta separada con tonos cálidos; no es simplemente una inversión del modo claro.

### Primary
- **Rojo Oscuro** (#8e2f37): Color de acción principal. Botones primarios, links, FAB, estado activo de navegación, foco. Dark mode: #ff9100 (naranja cálido).
- **Rojo Oscuro Hover** (#6e2028): Estados hover y activos del primario. Dark mode: #e67800.
- **On Primary** (#ffffff): Texto sobre superficies primary. Dark mode: #181715.

### Financial
- **Verde Ingreso** (#52998b): Montos de ingreso, badges de tipo ingreso, indicadores positivos. Dark mode: #00b475.
- **Rojo Gasto** (#ce3737): Montos de gasto, badges de tipo gasto, indicadores de pérdida, estados de error. Dark mode: #ff6352.
- **Ámbar** (#f59e0b): Indicador de actividad "ocasional" (1-4 transacciones). Dark mode: #ffb74d.

### Neutral
- **Fondo Página** (#dddddd): Superficie base. Dark mode: #181715 (oscuro cálido, no negro puro).
- **Fondo Tarjeta** (#f2f2f2): Cards elevadas, tablas, sidebar, header, modales. Dark mode: #262522.
- **Fondo Input** (#e4e4e4): Campos de formulario, headers de tabla, tarjetas tonales (stat-cards). Dark mode: #302e2a.
- **Texto Principal** (#252525): Contenido primario. Dark mode: #d3d3d3.
- **Texto Secundario** (#746354): Labels, placeholders, metadata. Dark mode: #a39e94.
- **Borde** (#c8c8c8): Separadores estructurales, bordes de inputs. Dark mode: #3a3834.

### Named Rules

**The Traffic Light Rule.** Verde es ingreso, rojo es gasto, rojo oscuro es acción del sistema. Estos tres colores nunca se usan para otros propósitos. Su consistencia es la comprensión instantánea.

**The Tonal Card Rule.** Las tarjetas informativas (stat-cards, mini-tables, avg-cards) usan `--input-bg` como fondo, no `--card-bg`. La elevación se comunica por tono, no por sombra.

## Typography

**Display Font:** Inter (con fallback a sans-serif)
**Body Font:** Inter (misma familia)

**Character:** Tipografía sans-serif moderna, limpia y neutral. Su trabajo es desaparecer y dejar que los datos sean protagonistas. Alta legibilidad en tamaños pequeños para tablas y badges.

### Hierarchy
- **Display** (700, 1.75rem, 1.2): Títulos de auth (h1 del login). Donde empieza la experiencia.
- **Headline** (700, 1.375rem, 1.2): Títulos de sección del dashboard, nombre de usuario en header.
- **Title** (700, 1rem, 1.2): Títulos de gráficos, encabezados de tabla en desktop.
- **Body** (400, 0.9rem, 1.5): Contenido de tablas, texto de modales, descripciones. Ancho máximo ~65ch en contenido de texto.
- **Label** (500, 0.8125rem, 1.4): Labels de formularios, botones, filtros, badges.
- **Caption** (500, 0.75rem, 1.4, 0.5px letterSpacing uppercase): Headers de tabla mini, fechas pequeñas, badges de estado.

### Named Rules

**The Number Hierarchy Rule.** Los montos monetarios siempre usan font-weight: 600 o 700. Los datos financieros deben ser lo más visualmente pesado en cualquier vista.

## Layout

Modelo responsive con sidebar off-screen en móvil/tablet y contenido centrado en desktop. El sidebar se oculta completamente en desktop (no hay sidebar visible en ningún breakpoint).

**Estructura por breakpoint:**

**Móvil (<641px):**
```
┌─────────────────────────────────────┐
│ Header (fixed, z-index: 100)        │
│ [hamburger] [logo]        [logout]  │
├─────────────────────────────────────┤
│                                     │
│ Main Content (padding: 16px)        │
│ (flujo normal, scroll con página)   │
│                                     │
├─────────────────────────────────────┤
│ Footer (border-top)                 │
└─────────────────────────────────────┘
```
Sidebar: off-screen (translateX(-100%)), se desliza con hamburger.

**Tablet (641px+):**
```
┌─────────────────────────────────────┐
│ Header (grid 3 col, z-index: 100)   │
│ [logo]     [nav tabs]     [controls]│
├─────────────────────────────────────┤
│                                     │
│ Main Content (padding: 18px)        │
│ (flujo normal, scroll con página)   │
│                                     │
├─────────────────────────────────────┤
│ Footer (border-top)                 │
└─────────────────────────────────────┘
```
Header: grid `1fr auto 1fr` con logo izquierda, nav al centro, controles derecha. Sidebar toggle oculto, nav horizontal visible. Sidebar sigue off-screen.

**Desktop (1024px+):**
```
┌─────────────────────────────────────┐
│ Header (fixed, grid 3 col)          │
│ [logo]     [nav tabs]    [theme]... │
├─── 5% ─┬───────────────────┬─ 5% ───┤
│        │                   │        │
│        │  Main Content     │        │
│        │  (position: fixed)│        │
│        │  max-width: 90%   │        │
│        │  centered         │        │
│        │  padding: 28x36   │        │
│        │  overflow-y: auto │        │
│        │                   │        │
├────────┴───────────────────┴────────┤
│ Footer (fixed, z-index: 100)        │
└─────────────────────────────────────┘
```
Sidebar: `display: none` (completamente oculto). Main content: `position: fixed` entre header y footer, centrado con `max-width: 90%`. Footer: `position: fixed` bottom 0.

**Responsive Breakpoints:**
- **Móvil (<641px):** Sidebar off-screen, contenido a 16px padding, grids de 1 columna. Dash-tabs con scroll horizontal. Header: flex row simple. FAB bottom-right en ≤640px para evitar solapamiento con cards de ancho completo; bottom-center en 641px–1023px.
- **Tablet (641px+):** Sidebar off-screen, contenido a 18px padding, grids de 2-4 columnas. Header: grid 3 columnas (logo | nav | controls). Sidebar toggle oculto. Modal centrado.
- **Small desktop (768px+):** Comparison cards y top expenses section van a 2 columnas.
- **Desktop (1024px+):** Sidebar hidden, theme-toggle visible, contenido fixed centrado al 90% con padding 28px 36px. Footer fixed. FAB hidden. Layouts flex row para balance-section y sec6Cards. Dash-tabs permiten wrap y usan padding/font más compactos para que quepan 5 tabs.

**Grids:**
- Summary cards: `repeat(4, 1fr)` en tablet+
- Dashboard charts: `1fr 1fr` en tablet+
- Comparison cards: `1fr 1fr` en 768px+
- Stat cards: `repeat(2, 1fr)` en 768px+
- Mini tables: `repeat(3, 1fr)` en tablet+
- Admin hero cards: `repeat(4, 1fr)` en tablet+
- Top expenses: `1fr 1fr` en 768px+

**Spacing Rhythm:** Base de 4px. Pasos comunes: 4, 8, 12, 16, 20, 24, 32, 40px.

**Content Area:** `.dash-content-area` envuelve los paneles de tabs del dashboard con `--radius-lg` y margen superior. Incluye un degradado de desvanecimiento `::after` que sugire overflow horizontal; el degradado se oculta cuando `.scroll-end` se aplica al contenedor de tabs.

## Elevation & Depth

Estrategia **plana y tonal**. La profundidad se comunica por variación del color de fondo, no por sombras pronunciadas.

### Capas de elevación
1. **Base** (`--bg`): Página.
2. **Tonal** (`--input-bg`): Stat-cards, mini-tables, avg-cards, money-cards. Separación sutil del fondo.
3. **Elevada** (`--card-bg` + `--shadow`): Summary cards, chart cards, tablas, admin sections, toasts.
4. **Overlay** (sombras pesadas): Sidebar (`2px 0 12px`), modal (`0 20px 60px`).

### Shadow Vocabulary
- **Ambient** (`0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)`): Sombras diffusas en cards y tablas. Dark mode: `0 1px 3px rgba(0,0,0,0.3)`.
- **Sidebar** (`2px 0 12px rgba(0,0,0,0.2)`): Sombra direccional en slide-in del sidebar móvil.
- **Modal** (`0 20px 60px rgba(0,0,0,0.2)`): Sombra de overlay para modales.
- **Focus Ring** (`0 0 0 2px rgba(142,47,55,0.25)`): Anillo de foco accesible en inputs y filtros. Dark mode: `0 0 0 2px rgba(255,145,0,0.35)`.
- **FAB** (`0 4px 20px rgba(142,47,55,0.45)`): Sombra del FAB en reposo. Hover: `0 6px 28px rgba(142,47,55,0.55)`.

### Named Rules

**The Flat-By-Default Rule.** Las superficies están planas en reposo. Las sombras aparecen solo en overlays (sidebar, modal). Las cards confían en el tono, no en la sombra, para su jerarquía.

## Shapes

Lenguaje de formas limpio y preciso. Bordes redondeados moderados que equilibran amabilidad con profesionalismo.

### Border Radius
- **Cards y contenedores principales:** 8px (`--radius`). Generoso pero no infantil.
- **Badges:** 12px (`--radius-lg`). Ligeramente más redondeados para diferenciarse de cards.
- **Modales:** 12px. Bottom-sheet en móvil (12px 12px 0 0), dialog centrado en tablet+.
- **FAB (transactions):** 28px (`--radius-pill`). Forma de cápsula con borde, fondo transparente.
- **Activity bars:** 10px. Barras de progreso con esquinas suaves.
- **Inputs:** 8px (`--radius`). Consistente con cards.
- **Dash-tabs:** pill (28px) en botones individuales, scroll horizontal en móvil.

### Named Rules

**The Consistent Corner Rule.** Todos los contenedores de mismo nivel usan el mismo radio. Cards = 8px, modales = 12px, FAB = pill. No hay mezcla de radios en componentes del mismo tipo.

## Components

### Buttons
- **Size Tokens:** `--btn-sm` (6px 12px), `--btn-md` (10px 20px), `--btn-lg` (12px 24px).
- **Shape:** Radio 8px, font-size 0.9rem, font-weight 600.
- **Primary:** Fondo `--primary`, texto `--on-primary`. Hover: `--primary-hover` (0.2s). Active: scale(0.97). Disabled: opacity 0.6.
- **Danger:** Fondo `--expense`, texto #fff. Hover: opacity 0.85. Active: scale(0.97).
- **Secondary:** Fondo transparente, borde 1px solid `--border`, texto `--text`. Hover: relleno con `--border`.
- **Logout:** Outline pequeño (`--btn-sm`), hover rellena con `--expense`, texto #fff.
- **Icon (btn-icon):** Sin fondo, `--btn-sm`, borde 1px solid `--border`. Hover: rellena con `--border`. Danger variant: hover con `--expense`.
- **Pagination (btn-page):** `--btn-md`, 0.85rem. Active: fondo `--primary`, texto `--on-primary`.

### Cards
- **Elevated Card:** Fondo `--card-bg`, radio 8px, shadow ambient, padding 20px. Para summary cards, chart cards, admin sections, auth card.
- **Tonal Card:** Fondo `--input-bg`, radio 8px, sin shadow, padding 18px. Para stat-cards, mini-tables, avg-cards, money-cards, activity bars.
- **Summary Card:** Elevated card con animación `cardEnter` escalonada (0ms, 80ms, 160ms, 240ms). Hover: translateY(-2px) + shadow más pronunciada. Iconos circulares de 44px con fondos tintados.
- **Comparison Card:** Fondo `--card-bg`, borde 1px solid `--border`, padding 16px 20px. Flex row con icono circular 48px a la izquierda. Borde izquierdo diferenciado: `--expense` para gasto, `--income` para ingreso.
- **Auth Card:** Fondo `--card-bg`, radio 12px, padding 32px 24px (44px en tablet), max-width 380px. Shadow elevada. Hover: translateY(-2px).

### Admin Cards
- **Hero Card:** `.admin-hero-card` con fondo `--card-bg`, radio 8px, shadow ambient, texto centrado. Contiene `.admin-hero-label` (caption, `--text-secondary`) y `.admin-hero-value` (número en negrita). Layout: `.admin-hero-cards` grid `1fr` en móvil, `repeat(4, 1fr)` en tablet+.
- **Stat Card:** `.stat-card` tarjeta tonal (`--input-bg`) que muestra una etiqueta de métrica, `.stat-card-value` y `.stat-card-change` con variantes `.up`/`.down`/`.neutral`.
- **Montos Section:** `.admin-montos-section` agrupa `.admin-montos-header` (título + `.admin-montos-filter`) y `.admin-montos-grid` de tarjetas de montos.

### Inputs / Forms
- **Style:** Fondo `--input-bg`, borde 1px solid `--border`, radio 8px, padding 10px 12px.
- **Focus:** Borde cambia a `--primary`, focus ring `box-shadow: var(--shadow-focus)`.
- **Filter Controls:** Borde 1.5px solid `--primary` permanentemente (sin estado unfocused). Padding 8px 14px.
- **Error:** Texto en `--expense`, font-size 0.8125rem.
- **Success:** Texto en `--income`, font-size 0.8125rem.

### Filters
- **Filter Section:** `.filter-section` card con fondo `--card-bg`, borde 1px `--border`, radio 8px, padding 14px. Usada para agrupar los controles de filtro.
- **Filter Controls:** `.filter-controls` flex column en móvil, flex row en tablet+. Contiene `input[type="month"]` y selects con borde permanente de 1.5px solid `--primary`.
- **Admin Section Filters:** `.admin-section-filters` usado en los paneles del dashboard de admin. Labels e inputs distribuidos en layout responsive; incluye select de usuario, select de mes "Desde", select de mes "Hasta" y botón "Actualizar".
- **Admin Montos Filter:** `.admin-montos-filter` con select de usuario + botón actualizar, distribuido horizontalmente en tablet+.
- **Section Header Row:** `.section-header-row` coloca el título de sección y la sección de filtros lado a lado en tablet+; apilados en móvil.

### Accordion
- **Pattern:** `.admin-filters-accordion` envuelve un botón `.accordion-toggle` y un `.accordion-content`.
- **Toggle:** Flex row con space-between, fondo `--card-bg`, borde 1px `--border`, radio 8px. Muestra la etiqueta "Filtros" y un indicador de chevron.
- **Content:** Oculto por defecto (`display: none`), se muestra cuando el padre tiene la clase `.open`. El toggle actualiza `aria-expanded`.
- **Responsive behavior:** El accordion es colapsable en móvil/tablet; en desktop (≥1024px) `.accordion-toggle` está oculto y `.accordion-content` siempre es visible (`display: block !important`).

### Navigation — Sidebar
- **Mobile/Tablet (<1024px):** Fijo off-screen (width 240px), slide-in con `transform: translateX(0)` al hacer clic en hamburger. Z-index 99. Shadow: `2px 0 12px rgba(0,0,0,0.2)`.
- **Desktop (1024px+):** `display: none` (completamente oculto). El hamburger se oculta y el header-nav se muestra.
- **Links:** Flex row, 14px 32px padding, 0.9rem, icon + texto con 10px gap.
- **States:** Hover = fondo `--input-bg`. Active = fondo `--primary`, texto `--on-primary`.
- **Overlay:** `rgba(0,0,0,0.4)` backdrop, z-index 98. Se oculta en desktop con `!important`.
- **Theme toggle in sidebar:** `.sidebar-theme-toggle` rendered as the last item inside `.sidebar-nav`, styled like a `.sidebar-link` with icon + label.

### Navigation — Header
- **Structure:** `.dash-header` usa `display: grid; grid-template-columns: 1fr auto 1fr;`.
  - **Izquierda:** `.sidebar-toggle` (hamburger, visible solo en móvil/tablet).
  - **Centro:** `.header-center` (flex column) que contiene `.header-logo` y `.header-user-name.only-mobile`.
  - **Medio:** `.header-nav` (tabs horizontales: Dashboard, Transacciones, Sub-Categorías, Categorías/Mantenimiento para admin, "Nueva Transacción" para usuario).
  - **Derecha:** `.header-right` con `.theme-toggle`, `.header-user-name` y `.btn-logout`.
- **Mobile (<641px):** Hamburger visible; `.header-nav` oculto; `.theme-toggle` oculto; `.header-user-name` oculto salvo `.only-mobile` bajo el logo. Logout es solo un icono.
- **Tablet (641px+):** Hamburger oculto; `.header-nav` visible como tabs horizontales; `.theme-toggle` sigue oculto; `.header-user-name` oculto.
- **Desktop (1024px+):** `.theme-toggle` visible; `.header-user-name` visible; `.only-mobile` oculto; `.header-center` alinea `flex-start` para simetría con `.header-right`.
- **Fixed:** `position: fixed`, top 0, z-index 100. Fondo `--card-bg` con `border-bottom`.

### Dash Tabs
- **Mobile:** Overflow horizontal (`overflow-x: auto; overflow-y: hidden`), scroll con `-webkit-overflow-scrolling: touch`. Botones pill (radio 28px top), white-space nowrap.
- **Desktop (1024px+):** Overflow visible, todos los tabs caben en una fila.
- **Active state:** Color `--primary`, borde inferior `--primary`, font-weight 600, fondo `rgba(primary-rgb, 0.08)`.
- **Animation:** `fadeSlideIn` 0.3s cubic-bezier(0.16, 1, 0.3, 1) al cambiar de panel.

### Tables
- **Data Table:** Full width, fondo `--card-bg`. TH: 0.75rem, uppercase, letter-spacing 0.5px, fondo `--input-bg`, border-bottom 2px solid `--border`, font-weight 600. TD: 0.9rem, border-bottom 1px solid `--border`. Hover row: fondo `--input-bg` + inset shadow `rgba(142,47,55,0.08)`.
- **Mini Table:** 0.75rem headers, 0.8125rem celdas, padding reducido. Rank en `--primary` bold.
- **Scroll:** Contenedor `.table-scroll` con shadow ambient para overflow horizontal.

### Badges
- **Shape:** Radio 12px, padding 2px 10px, 0.75rem, uppercase, font-weight 600, letter-spacing 0.5px.
- **Income:** Fondo `--income-bg`, texto `--income`.
- **Expense:** Fondo `--expense-bg`, texto `--expense`.

### Toasts
- **Position:** Fixed top-right (16px from edges), z-index 300.
- **Style:** Padding 14px 24px, radio 8px, 0.9rem, font-weight 500, shadow ambient, max-width 360px.
- **Success:** Fondo `--income`, texto #fff.
- **Error:** Fondo `--expense`, texto #fff.
- **Animation:** `toastIn` — opacity 0→1, translateX(100%)→translateX(0) en 0.3s ease-out.

### Modals
- **Mobile:** Bottom-sheet (align-items: flex-end), radio 12px 12px 0 0, max-height 90vh.
- **Tablet+:** Dialog centrado, max-width 600px, radio 12px, padding 24px.
- **Overlay:** `rgba(0,0,0,0.45)` backdrop, z-index 200.
- **Animation:** `modalIn` — opacity 0→1, scale(0.95)+translateY(10px)→scale(1)+translateY(0) en 0.2s ease-out.

### FAB (Floating Action Button — Transacciones)
- **Shape:** Fixed pill, height 52px, radio 28px, z-index 50.
  - **≤640px:** bottom-right (right 16px, bottom 16px) para evitar solapamiento con cards de ancho completo.
  - **641px–1023px:** bottom-center (left 50%, translateX(-50%), bottom 30px).
  - **1024px+:** Hidden.
- **Style:** Fondo transparente, borde 2px solid `--primary`, texto `--primary`. Outline, no filled.
- **Hover:** Rellena con `--primary`, texto `--on-primary`, scale(1.05) + shadow `var(--shadow-fab-hover)`.
- **Scrim (401px+):** Fondo `rgba(0,0,0,0.3)` para contraste.
- **Visibility:** Solo para usuarios regulares (no admin). Hidden en desktop (1024px+).

### Skeleton Loading
- **Style:** Gradient background (border→input-bg→border), animation shimmer 1.5s ease-in-out infinite, radio `--radius`.
- **Variants:** `skeleton-text` (1rem height, 60% width), `skeleton-text-sm` (caption height, 40% width), `skeleton-card` (80px height), `skeleton-chart` (200px height).

### Activity Distribution (Admin sec6)
- **Mobile:** Layout vertical. `.activity-bars` y `.activity-legend` apilados.
- **Desktop (1024px+):** Flex row. `.activity-bars` width 90%, legend a la derecha con borde izquierdo como separador.
- **Activity bars:** Grid con columnas label | bar | percent | count. Barras con radio 10px, altura 24px, colores por categoría.
- **Colors:** Frecuente = `--primary`, Regular = `--income`, Ocasional = `--warning`, Inactivo = `--text-secondary`.

### Activity Legend
- **Dots:** 10x10px circles. Mismos colores que bar fills.
- **Typography:** 0.75rem, `--text-secondary`.

### Footer
- **Container:** `.dash-footer` con `border-top` y sutil `box-shadow: 0 -2px 8px rgba(0,0,0,0.04)`. Fondo `--card-bg`.
- **Inner:** `.footer-inner` usa grid: `grid-template-columns: 1fr` (móvil), `grid-template-columns: 1fr 1fr 1fr` (tablet+).
- **Zonas:** `.footer-brand` (izquierda), `.footer-links` (centro), `.footer-copy` (derecha).
- **Desktop (1024px+):** `.dash-footer` pasa a `position: fixed`, bottom 0, z-index 100, altura `var(--footer-height)` (48px).

### Auth Theme Toggle
- **Position:** Dentro de `.auth-theme-row`, debajo de `.auth-card`, centrado.
- **Style:** Botón con SVG sun/moon (20x20), borde 1px solid `--border`, radio 8px, padding 6px.
- **States:** Hover con fondo `--border` y color `--primary`.
- **Visibility:** `display: inline-flex` (override del `display: none` base de `.theme-toggle` que solo se muestra en desktop del header).

### Charts
- **Chart Card:** Fondo `--card-bg`, radio 8px, shadow ambient, padding 24px.
- **Responsive Heights:** `#sec1Chart`, `#sec2Chart` y `#balanceChart` usan una estrategia de altura mobile-first:
  - Base: `aspect-ratio: 16/9` con `min-height: 220px`.
  - 401px+: `height: clamp(220px, calc(220px + (100vw - 401px) * 120 / 1039), 340px)`, centrados vertical y horizontalmente dentro del wrapper.
- **Doughnut:** Sin borde (borderWidth: 0). Leyenda: bottom en móvil, right en desktop. Labels custom plugin con bold 11px, sombra para contraste.
- **Line:** Fill con 6% opacity, tension 0.3, pointRadius 3. Balance usa borderDash [6, 3]. Data labels deshabilitados en el balance chart para evitar solapamiento con el eje Y; se mantienen en admin sec1/sec2 con formato compacto.
- **Bar:** Fill 70% opacity, borderRadius 4. beginAtZero.
- **Axis Padding:** Todos los charts de línea/barras usan `layout.padding: 10` y `ticks.padding: 10` para evitar que etiquetas de ejes rocen bordes o datos. Eje Y limitado a ~6 ticks (`maxTicksLimit`) para mantener legibilidad en viewports estrechos.
- **Range Selector:** `.range-checkboxes` con radios `.range-label` (3m/6m/12m) dentro del header del gráfico de balance.
- **Balance Section:** `.balance-section` apila el gráfico y `.monthly-summary-table` verticalmente en móvil; cambia a flex row en desktop con el gráfico al 60% de ancho máximo y la tabla fija a 353px de ancho máximo.
- **Palette:** 15 colores: primary, income, expense, amber, violet (#8b5cf6), pink (#ec4899), teal (#14b8a6), orange (#f97316), indigo (#6366f1), lime (#84cc16), cyan (#06b6d4), fuchsia (#d946ef), yellow (#eab308), blue (#3b82f6), green (#22c55e).

### Tree View (Subcategories)
- **Container:** Flex column, gap 16px.
- **Category Card:** Fondo `--card-bg`, radio 8px, shadow ambient. Header con padding 16px 20px, border-bottom 1px solid `--border`.
- **Subcategory Item:** Flex row, padding 12px 20px (40px indent), border-bottom. Hover: fondo `--input-bg`.
- **Count Badge:** 0.75rem, text-secondary, fondo `--input-bg`, radio 10px.

## Do's and Don'ts

### Do:
- **Do** usar `--input-bg` para tarjetas informativas tonales (stat-cards, mini-tables). Nunca `--card-bg`.
- **Do** mantener el semáforo: verde=ingreso, rojo=gasto, rojo oscuro=acción. Sin excepciones.
- **Do** usar font-weight 600-700 para montos monetarios. Los números deben ser lo más visualmente pesado.
- **Do** usar radio 8px para cards y contenedores principales, 12px para modales y badges.
- **Do** aplicar el flat-by-default: sombras solo en overlays, no en cards del contenido.
- **Do** usar la paleta oscura `#181715` como fondo dark, no negro puro `#000`.
- **Do** mantener padding consistente: 20px para cards elevadas, 18px para tonal cards.
- **Do** usar `overflow-y: hidden` junto con `overflow-x: auto` en contenedores de scroll horizontal.
- **Do** usar `font-variant-numeric: tabular-nums` en montos y porcentajes para alineación de columnas.
- **Do** respetar `prefers-reduced-motion: reduce` — todas las animaciones se desactivan.

### Don't:
- **Don't** usar gradientes decorativos. La paleta es funcional, no estética.
- **Don't** agregar sombras a stat-cards o mini-tables. Su elevación es tonal.
- **Don't** usar verde o rojo para elementos que no sean financieros (ingreso/gasto).
- **Don't** mezclar radios de border en componentes del mismo nivel.
- **Don't** usar `--primary` en badges de tipo (usa `--income` o `--expense`).
- **Don't** crear variantes de botones que no existen. El sistema tiene primary, danger, secondary, icon, y logout.
- **Don't** usar animaciones excesivas. Solo modalIn, toastIn, cardEnter, fadeSlideIn, y transiciones de tema (0.2-0.3s).
- **Don't** posicionar el theme-toggle de auth con `position: absolute` fuera del card. Siempre dentro de `.auth-theme-row`.
- **Don't** usar negro puro `#000` como fondo dark. Usa `#181715`.
- **Don't** olvidar `min-height: 44px` / `min-width: 44px` en targets táctiles (hamburger, modal close, theme toggle).
