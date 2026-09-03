# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Usuarios del público general que necesitan controlar sus finanzas personales: saber en qué gastan, cuánto ahorran y cuál es su salud financiera. Incluye usuarios regulares (gestión personal) y administradores (vista consolidada de todos los usuarios).

## Product Purpose

Dar una visión clara y completa de la salud financiera personal. Permitir a los usuarios registrar ingresos y gastos, categorizarlos, visualizar patrones de gasto a través de gráficos, y tomar decisiones informadas sobre su dinero.

## Positioning

Dashboard financiero personal con visualización de datos por categorías/subcategorías, comparativas mensuales, y vista de administrador para gestión consolidada. Se diferencia por su enfoque en la visualización de datos (gráficos de dona, líneas, barras) y la capacidad de filtrar por período y categoría.

## Operating Context

- Los usuarios registran transacciones (ingresos/gastos) con categoría, subcategoría, monto, fecha y descripción
- Pueden filtrar por mes/período y navegar entre secciones (Panel, Transacciones, Subcategorías, Categorías)
- El admin ve métricas consolidadas: evolución de usuarios, movimientos de dinero, distribución de actividad, promedios
- La app funciona en navegador, con tema claro/oscuro, responsive (móvil → desktop)

## Capabilities and Constraints

- **Funcionalidades confirmadas:**
  - Autenticación JWT (login, registro, logout, refresh de token)
  - CRUD completo de transacciones y subcategorías
  - Lectura de categorías (sin CRUD en frontend)
  - Dashboard de usuario con cards de resumen, gráficos de dona y línea, comparativas
  - Dashboard de admin con 7 secciones analíticas
  - Tema claro/oscuro con persistencia en localStorage
  - Paginación en todas las listas
  - Toast notifications para feedback

- **Restricciones técnicas:**
  - Vanilla HTML/CSS/JS (sin framework, sin build tools)
  - Dependencias CDN: Chart.js, Flatpickr
  - Backend REST en `http://localhost:8080/api/v1`
  - Moneda: EUR
  - Locale: español (es-ES)

- **Decisiones pendientes:**
  - No hay funcionalidades de metas de ahorro o presupuestos
  - No hay exportación de datos
  - No hay notificaciones push

## Brand Commitments

- **Nombre:** Mis Fichas
- **Voz:** Minimalista, limpio, sin distracciones
- **Personalidad:** Funcional, directo, fácil de usar
- **Logo:** Archivos en `assets/logo/` (modo claro y oscuro, versión completa y solo icono)

## Evidence on Hand

- Aplicación funcional con todas las funcionalidades descritas
- Logo actual en `assets/logo/`
- CSS con sistema de temas (claro/oscuro) y responsive design
- Gráficos funcionales con Chart.js

## Product Principles

1. **Claridad sobre complejidad:** Mostrar información financiera de forma simple y visual
2. **Acción inmediata:** El usuario debe poder registrar una transacción en segundos
3. **Consistencia:** Todos los patrones de UI (modals, tablas, gráficos) deben ser coherentes
4. **Privacidad:** Los datos financieros son sensibles; manejo seguro de tokens y sesiones

## Accessibility & Inclusion

- Accesibilidad básica web (labels en formularios, contraste suficiente, navegación por teclado)
- Responsive design para móviles y desktop
- Tema claro/oscuro para diferentes condiciones de iluminación
