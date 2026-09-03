---
name: Mis Fichas
description: Dashboard financiero personal minimalista que transforma datos en claridad
colors:
  primary: "#4f46e5"
  primary-hover: "#4338ca"
  primary-light: "#818cf8"
  primary-dark: "#6366f1"
  income: "#059669"
  income-light: "#34d399"
  expense: "#dc2626"
  expense-light: "#f87171"
  bg: "#f0f2f5"
  bg-dark: "#0f172a"
  card: "#ffffff"
  card-dark: "#1e293b"
  text: "#1f2937"
  text-light: "#f1f5f9"
  text-secondary: "#6b7280"
  text-secondary-dark: "#94a3b8"
  border: "#e5e7eb"
  border-dark: "#334155"
  input-bg: "#f9fafb"
  input-bg-dark: "#1e293b"
  amber: "#f59e0b"
typography:
  body:
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  display:
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "1.3rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.2
  label:
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
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
    backgroundColor: "rgba(5,150,105,0.12)"
    textColor: "{colors.income}"
    rounded: "{rounded.lg}"
  badge-expense:
    backgroundColor: "rgba(220,38,38,0.12)"
    textColor: "{colors.expense}"
    rounded: "{rounded.lg}"
---

# Design System: Mis Fichas

## Overview

**Creative North Star: "La Ventana Clara"**

Mis Fichas es una ventana limpia a la realidad financiera del usuario. El diseño se aparta de los dashboards genéricos saturados de datos y gradientes, optando por una estética donde la información habla por sí misma. Cada elemento existe para comunicar, no para decorar.

La personalidad es minimalista funcional: sin ruido visual, sin adornos innecesarios. Los colores son herramientas de comunicación (verde para ingreso, rojo para gasto, índigo para acción), no paletas decorativas. El espacio en blanco es tan informativo como el contenido.

**Key Characteristics:**
- Tono sobrio y confiable con índigo como acento de acción
- Superficies planas y tonales, sin sombras pronunciadas
- Jerarquía clara por tamaño, peso y posición, no por decoración
- Consistencia absoluta entre componentes similares
- Responsive progresivo: móvil primero, desktop como extensión natural

## Colors

Paleta funcional con tres roles claros: acción (índigo), semáforo financiero (verde/rojo), y neutros para estructura.

### Primary
- **Índigo Sobrio** (#4f46e5): Color de acción principal. Botones primarios, links, FAB, estado activo de navegación, foco. En dark mode se aclara a #818cf8 para mantener legibilidad.
- **Índigo Hover** (#4338ca): Estados hover y activos del primario. Dark mode: #6366f1.

### Financial
- **Verde Ingreso** (#059669): Montos de ingreso, badges de tipo ingreso, indicadores positivos. Dark mode: #34d399.
- **Rojo Gasto** (#dc2626): Montos de gasto, badges de tipo gasto, indicadores de pérdida, estados de error. Dark mode: #f87171.
- **Ámbar Ocasional** (#f59e0b): Indicador de actividad "ocasional" (1-4 transacciones). No se adapta a dark mode.

### Neutral
- **Fondo Página** (#f0f2f5): Superficie base. Dark mode: #0f172a (azul muy oscuro, no negro puro).
- **Fondo Tarjeta** (#ffffff): Cards elevadas, tablas, sidebar, header, modales. Dark mode: #1e293b.
- **Texto Principal** (#1f2937): Contenido primario. Dark mode: #f1f5f9.
- **Texto Secundario** (#6b7280): Labels, placeholders, metadata. Dark mode: #94a3b8.
- **Borde** (#e5e7eb): Separadores estructurales, bordes de inputs. Dark mode: #334155.
- **Fondo Input** (#f9fafb): Campos de formulario, headers de tabla, tarjetas tonales (stat-cards). Dark mode: #1e293b (igual que card).

### Named Rules

**The Traffic Light Rule.** Verde es ingreso, rojo es gasto, índigo es acción del sistema. Estos tres colores nunca se usan para otros propósitos. Su consistencia es la comprensión instantánea.

**The Tonal Card Rule.** Las tarjetas informativas (stat-cards, mini-tables, avg-cards) usan `--input-bg` como fondo, no `--card-bg`. La elevación se comunica por tono, no por sombra.

## Typography

**Display Font:** Segoe UI (con fallback a Tahoma, Geneva, Verdana, sans-serif)
**Body Font:** Segoe UI (misma familia)

**Character:** Tipografía del sistema, neutral y legible. Sin personalidad propia; su trabajo es desaparecer y dejar que los datos sean protagonistas. Suficiente contraste y tamaño para escaneo rápido de números.

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

Modelo de sidebar fijo con contenido flexible. Sin contenedor max-width en el area principal; el contenido se adapta al espacio disponible.

**Estructura:**
```
┌─────────────────────────────────────┐
│ Header (sticky, z-index: 100)       │
├──────┬──────────────────────────────┤
│      │                              │
│ Side │ Main Content                 │
│ bar  │ (flex: 1, padding responsive)│
│240px │                              │
│      │                              │
├──────┴──────────────────────────────┤
│ Footer (border-top)                 │
└─────────────────────────────────────┘
```

**Responsive Breakpoints:**
- **Móvil (<641px):** Sidebar off-screen, contenido a 12px padding, grids de 1 columna.
- **Tablet (641px+):** Sidebar off-screen, contenido a 16px padding, grids de 2-4 columnas según componente.
- **Tablet large (768px+):** Comparison cards y top expenses section van a 2 columnas.
- **Desktop (1024px+):** Sidebar off-screen, toggle derecho visible, contenido a 16px padding, layouts flex row para balance-section.
- **Desktop XL (2560px+):** Sidebar estática (siempre visible), contenido a 24px 32px padding.

**Grids:**
- Summary cards: `repeat(4, 1fr)` en tablet+
- Charts: `1fr 1fr` en tablet+
- Stat cards: `repeat(3, 1fr)` en tablet, `repeat(2, 1fr)` en desktop
- Mini tables: `repeat(3, 1fr)` en tablet+

**Spacing Rhythm:** Base de 4px. Pasos comunes: 4, 8, 12, 16, 20, 24, 32px.

## Elevation & Depth

Estrategia **plana y tonal**. La profundidad se comunica por variación del color de fondo, no por sombras pronunciadas.

### Capas de elevación
1. **Base** (`--bg`): Página.
2. **Tonal** (`--input-bg`): Stat-cards, mini-tables, avg-cards, money-cards. Separación sutil del fondo.
3. **Elevada** (`--card-bg` + `--shadow`): Summary cards, chart cards, tablas, admin sections, toasts.
4. **Overlay** (sombras pesadas): Sidebar (`2px 0 12px`), modal (`0 20px 60px`), FAB (`0 4px 20px` coloreado).

### Shadow Vocabulary
- **Ambient** (`0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)`): Sombras diffusas en cards y tablas. Dark mode: `0 1px 3px rgba(0,0,0,0.3)`.
- **Sidebar** (`2px 0 12px rgba(0,0,0,0.2)`): Sombra direccional en slide-in del sidebar móvil.
- **Modal** (`0 20px 60px rgba(0,0,0,0.2)`): Sombra de overlay para modales.
- **FAB** (`0 4px 20px rgba(79,70,229,0.45)`): Glow coloreado del botón flotante. Hover: `0 6px 28px rgba(79,70,229,0.55)`.
- **Focus Ring** (`0 0 0 2px rgba(79,70,229,0.25)`): Anillo de foco accesible en inputs y filtros.

### Named Rules

**The Flat-By-Default Rule.** Las superficies están planas en reposo. Las sombras aparecen solo en overlays (sidebar, modal) y elementos interactivos destacados (FAB). Las cards confían en el tono, no en la sombra, para su jerarquía.

## Shapes

Lenguaje de formas limpio y preciso. Bordes redondeados moderados que equilibran amabilidad con profesionalismo.

### Border Radius
- **Cards y contenedores principales:** 8px (`--radius`). Generoso pero no infantil.
- **Badges:** 12px. Ligeramente más redondeados para diferenciarse de cards.
- **Modales:** 12px. Bottom-sheet en móvil (12px 12px 0 0), dialog centrado en tablet+.
- **FAB:** 28px (pill). Forma de cápsula que invita al clic.
- **Activity bars:** 10px. Barras de progreso con esquinas suaves.
- **Inputs:** 8px (`--radius`). Consistente con cards.

### Named Rules

**The Consistent Corner Rule.** Todos los contenedores de mismo nivel usan el mismo radio. Cards = 8px, modales = 12px, FAB = pill. No hay mezcla de radios en componentes del mismo tipo.

## Components

### Buttons
- **Shape:** Radio 8px, padding 10px 20px, font-size 0.9rem, font-weight 600.
- **Primary:** Fondo `--primary`, texto blanco. Hover: transición a `--primary-hover` (0.2s). Disabled: opacity 0.6.
- **Secondary:** Fondo transparente, borde 1px solid `--border`, texto `--text`. Hover: relleno con `--border`.
- **Logout:** Outline pequeño, 8px 16px, hover rellena con `--expense`.
- **Icon (btn-icon):** Sin fondo, 4px 8px, hover rellena con `--border`. Danger variant: hover con `--expense`.
- **Pagination (btn-page):** 6px 12px, 0.85rem. Active rellena con `--primary`.
- **Back to Dashboard:** Inline-flex, 8px 16px, fondo `--input-bg`, hover con `--primary`.

### Cards
- **Elevated Card:** Fondo `--card-bg`, radio 8px, shadow ambient, padding 20px. Para summary cards, chart cards, admin sections.
- **Tonal Card:** Fondo `--input-bg`, radio 8px, sin shadow, padding 14-18px. Para stat-cards, mini-tables, avg-cards, money-cards.
- **Comparison Card:** Fondo `--card-bg`, shadow ambient, padding 16px 18px, borde izquierdo 4px (color según tipo). Flex row con 14px gap.

### Inputs / Forms
- **Style:** Fondo `--input-bg`, borde 1px solid `--border`, radio 8px, padding 10px 12px.
- **Focus:** Borde cambia a `--primary`, focus ring `box-shadow: 0 0 0 2px rgba(79,70,229,0.25)`.
- **Filter Controls:** Borde 1.5px solid `--primary` permanentemente (sin estado unfocused). Padding 8px 14px.
- **Error:** Texto en `--expense`, font-size 0.85rem.
- **Success:** Texto en `--income`, font-size 0.85rem.

### Navigation (Sidebar)
- **Style:** Fijo off-screen en móvil (width 240px), slide-in con `transform: translateX(0)`.
- **Links:** Flex row, 12px 32px padding, 0.9rem, icon + texto con 10px gap.
- **States:** Hover = fondo `--input-bg`. Active = fondo `--primary`, texto blanco.
- **Overlay:** `rgba(0,0,0,0.4)` backdrop, z-index 98.
- **Desktop XL (2560px+):** Posición estática, siempre visible, sin sombra.

### Modals
- **Mobile:** Bottom-sheet (align-items: flex-end), radio 12px 12px 0 0, max-height 90vh, slide-up animation.
- **Tablet+:** Dialog centrado, max-width 480px, radio 12px.
- **Overlay:** `rgba(0,0,0,0.45)` backdrop, z-index 200.
- **Animation:** `modalIn` — opacity 0→1, scale(0.95)+translateY(10px)→scale(1)+translateY(0) en 0.2s ease-out.

### Tables
- **Data Table:** Full width, fondo `--card-bg`. TH: 0.78rem, uppercase, letter-spacing 0.5px, fondo `--input-bg`. TD: 0.9rem. Hover row: fondo `--input-bg`.
- **Mini Table:** Compacta, 0.7rem headers, 0.82rem celdas, padding reducido.
- **Scroll:** Contenedor `.table-scroll` con shadow ambient para overflow horizontal.

### Badges
- **Shape:** Radio 12px (pill-ish), padding 2px 10px, 0.75rem, uppercase, font-weight 600.
- **Income:** Fondo `rgba(5,150,105,0.12)`, texto `--income`. Dark: `rgba(52,211,153,0.15)`.
- **Expense:** Fondo `rgba(220,38,38,0.12)`, texto `--expense`. Dark: `rgba(248,113,113,0.15)`.

### Toasts
- **Style:** Fixed top-right, z-index 300, padding 12px 20px, radio 8px, 0.9rem, font-weight 500, shadow ambient.
- **Success:** Fondo `--income`, texto blanco.
- **Error:** Fondo `--expense`, texto blanco.
- **Animation:** `toastIn` — opacity 0→1, translateX(100%)→translateX(0) en 0.3s ease-out.

### FAB (Floating Action Button)
- **Shape:** Fixed bottom-right (28px, 28px), z-index 50, height 52px, radio 28px (pill), fondo `--primary`, texto blanco.
- **Shadow:** `0 4px 20px rgba(79,70,229,0.45)` (glow coloreado).
- **Hover:** scale(1.05) + shadow ampliado `0 6px 28px rgba(79,70,229,0.55)`.
- **Visibility:** Solo para usuarios regulares (no admin).

### Header
- **Style:** Sticky, z-index 100, flex row space-between, 24px 32px padding (tablet+).
- **Shrink on Scroll:** Padding reduce a 0 12px, min-height 32px, fondo translúcido `rgba(255,255,255,0.8)` con `backdrop-filter: blur(8px)`, oculta email, reduce tamaños de fuente.

## Do's and Don'ts

### Do:
- **Do** usar `--input-bg` para tarjetas informativas tonales (stat-cards, mini-tables). Nunca `--card-bg`.
- **Do** mantener el semáforo: verde=ingreso, rojo=gasto, índigo=acción. Sin excepciones.
- **Do** usar font-weight 600-700 para montos monetarios. Los números deben ser lo más visualmente pesado.
- **Do** usar radio 8px para cards y contenedores principales, 12px para modales y badges.
- **Do** aplicar el flat-by-default: sombras solo en overlays y FAB, no en cards del contenido.
- **Do** usar la paleta oscura `#0f172a` como fondo dark, no negro puro `#000`.
- **Do** mantener padding consistente: 20px para cards elevadas, 14px para tonal cards.

### Don't:
- **Don't** usar gradientes decorativos. La paleta es funcional, no estética.
- **Don't** agregar sombras a stat-cards o mini-tables. Su elevación es tonal.
- **Don't** usar verde o rojo para elementos que no sean financieros (ingreso/gasto).
- **Don't** mezclar radios de border en componentes del mismo nivel.
- **Don't** usar `--primary` en badges de tipo (usa `--income` o `--expense`).
- **Don't** crear variantes de botones que no existen. El sistema tiene primary, secondary, icon, y logout. No agregar más sin necesidad real.
- **Don't** usar animaciones excesivas. Solo modalIn, toastIn, y transiciones de tema (0.2-0.3s).
