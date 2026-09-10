---
name: Mis Fichas
description: Dashboard financiero personal minimalista que transforma datos en claridad
colors:
  primary: "#8e2f37"
  primary-hover: "#6e2028"
  primary-light: "#c45a62"
  primary-dark: "#7a2830"
  income: "#52998b"
  income-light: "#7dbdb1"
  expense: "#ce3737"
  expense-light: "#e86c6c"
  bg: "#dddddd"
  bg-dark: "#181715"
  card: "#f2f2f2"
  card-dark: "#262522"
  text: "#252525"
  text-light: "#d3d3d3"
  text-secondary: "#746354"
  text-secondary-dark: "#d3cfc7"
  border: "#c8c8c8"
  border-dark: "#262522"
  input-bg: "#f2f2f2"
  input-bg-dark: "#262522"
  amber: "#f59e0b"
typography:
  body:
    fontFamily: "'Inter', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  display:
    fontFamily: "'Inter', sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "'Inter', sans-serif"
    fontSize: "1.3rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "'Inter', sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.2
  label:
    fontFamily: "'Inter', sans-serif"
    fontSize: "0.85rem"
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
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "#ffffff"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.md}"
    padding: "20px"
  card-tonal:
    backgroundColor: "{colors.input-bg}"
    rounded: "{rounded.md}"
    padding: "14px"
  input:
    backgroundColor: "{colors.input-bg}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  badge-income:
    backgroundColor: "rgba(82,153,139,0.15)"
    textColor: "{colors.income}"
    rounded: "{rounded.lg}"
  badge-expense:
    backgroundColor: "rgba(206,55,55,0.15)"
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

Paleta funcional con tres roles claros: acción (rojo oscuro), semáforo financiero (verde/rojo), y neutros para estructura.

### Primary
- **Rojo Oscuro** (#8e2f37): Color de acción principal. Botones primarios, links, FAB, estado activo de navegación, foco. En dark mode se aclara a un tono cálido para mantener legibilidad.
- **Rojo Oscuro Hover** (#6e2028): Estados hover y activos del primario.

### Financial
- **Verde Ingreso** (#52998b): Montos de ingreso, badges de tipo ingreso, indicadores positivos. Dark mode: más claro.
- **Rojo Gasto** (#ce3737): Montos de gasto, badges de tipo gasto, indicadores de pérdida, estados de error. Dark mode: más claro.
- **Ámbar Ocasional** (#f59e0b): Indicador de actividad "ocasional" (1-4 transacciones). No se adapta a dark mode.

### Neutral
- **Fondo Página** (#dddddd): Superficie base. Dark mode: #181715 (oscuro cálido, no negro puro).
- **Fondo Tarjeta** (#f2f2f2): Cards elevadas, tablas, sidebar, header, modales. Dark mode: #262522.
- **Texto Principal** (#252525): Contenido primario. Dark mode: #d3d3d3.
- **Texto Secundario** (#746354): Labels, placeholders, metadata. Dark mode: #d3cfc7.
- **Borde** (#c8c8c8): Separadores estructurales, bordes de inputs. Dark mode: #262522.
- **Fondo Input** (#f2f2f2): Campos de formulario, headers de tabla, tarjetas tonales (stat-cards). Dark mode: #262522 (igual que card).

### Named Rules

**The Traffic Light Rule.** Verde es ingreso, rojo es gasto, rojo oscuro es acción del sistema. Estos tres colores nunca se usan para otros propósitos. Su consistencia es la comprensión instantánea.

**The Tonal Card Rule.** Las tarjetas informativas (stat-cards, mini-tables, avg-cards) usan `--input-bg` como fondo, no `--card-bg`. La elevación se comunica por tono, no por sombra.

## Typography

**Display Font:** Inter (con fallback a sans-serif)
**Body Font:** Inter (misma familia)

**Character:** Tipografía sans-serif moderna, limpia y neutral. Su trabajo es desaparecer y dejar que los datos sean protagonistas. Alta legibilidad en tamaños pequeños para tablas y badges.

### Hierarchy
- **Display** (700, 1.75rem, 1.2): Títulos de auth (h1 del login). Donde empieza la experiencia.
- **Headline** (700, 1.3rem, 1.2): Títulos de sección del dashboard, nombre de usuario en header.
- **Title** (700, 1rem, 1.2): Títulos de gráficos, encabezados de tabla en desktop.
- **Body** (400, 0.9rem, 1.5): Contenido de tablas, texto de modales, descripciones. Ancho máximo ~65ch en contenido de texto.
- **Label** (500, 0.85rem, 1.4): Labels de formularios, botones, filtros, badges.
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
│ Main Content (padding: 12px)        │
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
│ Main Content (padding: 16px)        │
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
│ Header (fixed, z-index: 100)        │
│ [logo]     [nav tabs]    [theme]... │
├─── 5% ─┬───────────────────┬─ 5% ───┤
│        │                   │        │
│        │  Main Content     │        │
│        │  (position: fixed)│        │
│        │  max-width: 90%   │        │
│        │  centered         │        │
│        │  padding: 24x32   │        │
│        │  overflow-y: auto │        │
│        │                   │        │
├────────┴───────────────────┴────────┤
│ Footer (fixed, z-index: 100)        │
└─────────────────────────────────────┘
```
Sidebar: `display: none` (completamente oculto). Main content: `position: fixed` entre header y footer, centrado con `max-width: 90%`. Footer: `position: fixed` bottom 0.

**Responsive Breakpoints:**
- **Móvil (<641px):** Sidebar off-screen, contenido a 12px padding, grids de 1 columna. Dash-tabs con scroll horizontal. Header: flex row simple.
- **Tablet (641px+):** Sidebar off-screen, contenido a 16px padding, grids de 2-4 columnas. Header: grid 3 columnas (logo | nav | controls). Sidebar toggle oculto.
- **Tablet large (768px+):** Comparison cards y top expenses section van a 2 columnas.
- **Desktop (1024px+):** Sidebar hidden, theme-toggle visible, contenido fixed centrado al 90% con padding 24px 32px. Footer fixed. Layouts flex row para balance-section y sec6Cards.

**Grids:**
- Summary cards: `repeat(4, 1fr)` en tablet+
- Charts: `1fr 1fr` en tablet+
- Stat cards: `repeat(3, 1fr)` en tablet, `repeat(2, 1fr)` en desktop
- Mini tables: `repeat(3, 1fr)` en tablet+
- Admin hero cards: `repeat(4, 1fr)` en tablet+

**Spacing Rhythm:** Base de 4px. Pasos comunes: 4, 8, 12, 16, 20, 24, 32px.

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
- **Focus Ring** (`0 0 0 2px rgba(142,47,55,0.25)`): Anillo de foco accesible en inputs y filtros.

### Named Rules

**The Flat-By-Default Rule.** Las superficies están planas en reposo. Las sombras aparecen solo en overlays (sidebar, modal). Las cards confían en el tono, no en la sombra, para su jerarquía.

## Shapes

Lenguaje de formas limpio y preciso. Bordes redondeados moderados que equilibran amabilidad con profesionalismo.

### Border Radius
- **Cards y contenedores principales:** 8px (`--radius`). Generoso pero no infantil.
- **Badges:** 12px. Ligeramente más redondeados para diferenciarse de cards.
- **Modales:** 12px. Bottom-sheet en móvil (12px 12px 0 0), dialog centrado en tablet+.
- **FAB (transactions):** 28px (pill). Forma de cápsula con borde, fondo transparente.
- **Activity bars:** 10px. Barras de progreso con esquinas suaves.
- **Inputs:** 8px (`--radius`). Consistente con cards.
- **Dash-tabs:** pill (28px) en botones individuales, scroll horizontal en móvil.

### Named Rules

**The Consistent Corner Rule.** Todos los contenedores de mismo nivel usan el mismo radio. Cards = 8px, modales = 12px, FAB = pill. No hay mezcla de radios en componentes del mismo tipo.

## Components

### Buttons
- **Size Tokens:** `--btn-sm` (6px 12px), `--btn-md` (10px 20px), `--btn-lg` (12px 24px).
- **Shape:** Radio 8px, font-size 0.9rem, font-weight 600.
- **Primary:** Fondo `--primary`, texto blanco. Hover: transición a `--primary-hover` (0.2s). Disabled: opacity 0.6.
- **Secondary:** Fondo transparente, borde 1px solid `--border`, texto `--text`. Hover: relleno con `--border`.
- **Logout:** Outline pequeño (`--btn-sm`), hover rellena con `--expense`.
- **Icon (btn-icon):** Sin fondo, `--btn-sm`, hover rellena con `--border`. Danger variant: hover con `--expense`.
- **Pagination (btn-page):** `--btn-md`, 0.85rem. Active rellena con `--primary`.
- **Back to Dashboard:** Inline-flex, `--btn-sm`, fondo `--input-bg`, hover con `--primary`.

### Cards
- **Elevated Card:** Fondo `--card-bg`, radio 8px, shadow ambient, padding 20px. Para summary cards, chart cards, admin sections.
- **Tonal Card:** Fondo `--input-bg`, radio 8px, sin shadow, padding 14-18px. Para stat-cards, mini-tables, avg-cards, money-cards.
- **Comparison Card:** Fondo `--card-bg`, shadow ambient, padding 16px 18px, borde izquierdo 4px (color según tipo). Flex row con 14px gap.

### Inputs / Forms
- **Style:** Fondo `--input-bg`, borde 1px solid `--border`, radio 8px, padding 10px 12px.
- **Focus:** Borde cambia a `--primary`, focus ring `box-shadow: 0 0 0 2px rgba(142,47,55,0.25)`.
- **Filter Controls:** Borde 1.5px solid `--primary` permanentemente (sin estado unfocused). Padding 8px 14px.
- **Error:** Texto en `--expense`, font-size 0.85rem.
- **Success:** Texto en `--income`, font-size 0.85rem.

### Navigation (Sidebar)
- **Mobile/Tablet (<1024px):** Fijo off-screen (width 240px), slide-in con `transform: translateX(0)` al hacer clic en hamburger. Z-index 99. El header-nav no es visible; se usa hamburger para acceder al sidebar.
- **Desktop (1024px+):** `display: none` (completamente oculto). El hamburger se oculta y el header-nav se muestra con `display: flex` en un grid de 3 columnas (logo | nav | controls).
- **Links:** Flex row, 12px 32px padding, 0.9rem, icon + texto con 10px gap.
- **States:** Hover = fondo `--input-bg`. Active = fondo `--primary`, texto blanco.
- **Overlay:** `rgba(0,0,0,0.4)` backdrop, z-index 98. Se oculta en desktop con `!important`.
- **Theme toggle in sidebar:** Posicionado con `margin: 65vh auto 0` (centrado verticalmente).

### Dash Tabs
- **Mobile:** Overflow horizontal (`overflow-x: auto; overflow-y: hidden`), scroll con `-webkit-overflow-scrolling: touch`. Botones pill (radio 28px top), white-space nowrap.
- **Desktop (1024px+):** Overflow visible, todos los tabs caben en una fila.
- **Active state:** Fondo `--primary` con opacidad, texto `--primary`, borde inferior `--primary`.

### Activity Distribution (sec6Cards)
- **Mobile:** Layout vertical. `.activity-bars` y `.activity-legend` apilados.
- **Desktop (1024px+):** Flex row. `.activity-bars` ocupa ~60% a la izquierda, `.activity-legend` a la derecha con borde izquierdo como separador.
- **Activity bars:** Grid con columnas label | bar | percent | count. Barras con radio 10px, colores por categoría (primary, income, amber, text-secondary).
- **Activity legend:** Lista vertical de items con dot de color + descripción.

### Auth Theme Toggle
- **Position:** Dentro de `.auth-card`, debajo de `.auth-footer`, centrado.
- **Style:** Botón con SVG sun/moon (20x20), borde 1px solid `--border`, radio 8px, padding 6px.
- **States:** Hover con fondo `--border` y color `--primary`.
- **Visibility:** `display: inline-flex` (override del `display: none` base de `.theme-toggle` que solo se muestra en desktop del header).

### Modals
- **Mobile:** Bottom-sheet (align-items: flex-end), radio 12px 12px 0 0, max-height 90vh, slide-up animation.
- **Tablet+:** Dialog centrado, max-width 600px, radio 12px.
- **Overlay:** `rgba(0,0,0,0.45)` backdrop, z-index 200.
- **Animation:** `modalIn` — opacity 0→1, scale(0.95)+translateY(10px)→scale(1)+translateY(0) en 0.2s ease-out.

### Tables
- **Data Table:** Full width, fondo `--card-bg`. TH: 0.78rem, uppercase, letter-spacing 0.5px, fondo `--input-bg`. TD: 0.9rem. Hover row: fondo `--input-bg`.
- **Mini Table:** Compacta, 0.75rem headers, 0.82rem celdas, padding reducido.
- **Scroll:** Contenedor `.table-scroll` con shadow ambient para overflow horizontal.

### Badges
- **Shape:** Radio 12px (pill-ish), padding 2px 10px, 0.75rem, uppercase, font-weight 600.
- **Income:** Fondo `rgba(82,153,139,0.15)`, texto `--income`. Dark: más claro.
- **Expense:** Fondo `rgba(206,55,55,0.15)`, texto `--expense`. Dark: más claro.

### Toasts
- **Style:** Fixed top-right, z-index 300, padding 12px 20px, radio 8px, 0.9rem, font-weight 500, shadow ambient.
- **Success:** Fondo `--income`, texto blanco.
- **Error:** Fondo `--expense`, texto blanco.
- **Animation:** `toastIn` — opacity 0→1, translateX(100%)→translateX(0) en 0.3s ease-out.

### FAB (Floating Action Button — Transacciones)
- **Shape:** Fixed bottom-center en móvil, bottom-right (7%) en desktop, z-index 50, height 52px, radio 28px (pill).
- **Style:** Fondo transparente, borde 2px solid `--primary`, texto `--primary`. Outline, no filled.
- **Hover:** Rellena con `--primary`, texto blanco, scale(1.05) + shadow `var(--shadow-fab-hover)`.
- **Visibility:** Solo para usuarios regulares (no admin).

### Header
- **Mobile (<641px):** Flex row space-between. Logo a la izquierda, controles a la derecha (hamburger, logout). Nav oculta. Padding 6px 16px.
- **Tablet (641px+):** Grid 3 columnas (`1fr auto 1fr`). Logo izquierda, nav tabs al centro, controles derecha. Hamburger oculto. Padding 6px 20px.
- **Desktop (1024px+):** Misma estructura que tablet. Theme-toggle visible. Nav tabs visibles.
- **Fixed:** `position: fixed`, top 0, z-index 100. Background `--card-bg` con border-bottom.
- **Shrink on Scroll:** Padding reduce a 0 12px, min-height 32px, fondo translúcido `rgba(255,255,255,0.8)` con `backdrop-filter: blur(8px)`, oculta email, reduce tamaños de fuente.

### Footer
- **Mobile/Tablet:** Flex column centrado, padding 16px, border-top 1px solid `--border`, background `--card-bg`. Contenido: brand, links, copy.
- **Desktop (1024px+):** `position: fixed`, bottom 0, z-index 100, height `var(--footer-height)` (48px). Flex row con space-between.
- **Inner:** Flex column (mobile) / row (tablet+), gap 8px, centrado.

## Do's and Don'ts

### Do:
- **Do** usar `--input-bg` para tarjetas informativas tonales (stat-cards, mini-tables). Nunca `--card-bg`.
- **Do** mantener el semáforo: verde=ingreso, rojo=gasto, rojo oscuro=acción. Sin excepciones.
- **Do** usar font-weight 600-700 para montos monetarios. Los números deben ser lo más visualmente pesado.
- **Do** usar radio 8px para cards y contenedores principales, 12px para modales y badges.
- **Do** aplicar el flat-by-default: sombras solo en overlays, no en cards del contenido.
- **Do** usar la paleta oscura `#181715` como fondo dark, no negro puro `#000`.
- **Do** mantener padding consistente: 20px para cards elevadas, 14px para tonal cards.
- **Do** usar `overflow-y: hidden` junto con `overflow-x: auto` en contenedores de scroll horizontal para evitar scroll vertical fantasma.

### Don't:
- **Don't** usar gradientes decorativos. La paleta es funcional, no estética.
- **Don't** agregar sombras a stat-cards o mini-tables. Su elevación es tonal.
- **Don't** usar verde o rojo para elementos que no sean financieros (ingreso/gasto).
- **Don't** mezclar radios de border en componentes del mismo nivel.
- **Don't** usar `--primary` en badges de tipo (usa `--income` o `--expense`).
- **Don't** crear variantes de botones que no existen. El sistema tiene primary, secondary, icon, y logout. No agregar más sin necesidad real.
- **Don't** usar animaciones excesivas. Solo modalIn, toastIn, y transiciones de tema (0.2-0.3s).
- **Don't** posicionar el theme-toggle de auth con `position: absolute` fuera del card. Siempre dentro de `.auth-card`, centrado debajo del footer.
