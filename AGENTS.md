# AGENTS.md — Mis Fichas WebApp

Pure vanilla HTML/CSS/JS webapp. No build tools, no package manager, no framework. Requires backend API (`mis-fichas-api`) running at `http://localhost:8080/api/v1`.

## Run

Open `index.html` via Live Server (VS Code) or any static server (port 5501 typical). Backend must be running first.

## Entrypoints

- `index.html` — single HTML page, loads all JS modules in order (see `index.html` for sequence)
- `css/style.css` — design tokens, components, responsive (mobile-first), light/dark themes
- `js/script.js` — entry point: initializes app, routes to dashboard/transactions/admin based on role
- `config.js` — runtime config: `API_BASE`, `CURRENCY_SYMBOL`

## Architecture

### Module Responsibilities

| Module | Responsibility |
|--------|----------------|
| `config.js` | API base URL, currency symbol |
| `api.js` | Fetch wrapper with JWT headers, HTTP error handling (401, 429), token refresh |
| `auth.js` | Login, register, logout, token management, UI sync |
| `utils.js` | Date formatting, currency, helpers |
| `sidebar.js` | Responsive nav (off-screen slide-in mobile, hidden desktop XL) |
| `dashboard.js` | Shared dashboard init/events |
| `dashboard-user.js` | User dashboard: summary cards, donut/line charts, comparisons, top expenses |
| `dashboard-admin.js` | Admin dashboard: 7 analytical sections, tables, averages |
| `transactions.js` | CRUD transactions, filters, pagination, category→subcategory cascade |
| `subcategories.js` | CRUD subcategories, cascade from category |
| `categories.js` | List active categories, admin CRUD |
| `charts.js` | Chart.js config/render (donut, line) |
| `modal.js` | Modal system (bottom-sheet mobile, dialog desktop) |
| `toast.js` | Toast notifications (success/error) |
| `pagination.js` | Reusable pagination component |
| `icons.js` | Inline SVG icons |

### Load Order

Scripts load sequentially in `index.html`. Order matters: `config.js` → `api.js` → `auth.js` → `utils.js` → UI modules → `script.js`.

## Conventions

- Locale: `es` (Spanish UI, comments, commit messages)
- No external dependencies except Chart.js via CDN
- CSS uses `content-box` box-sizing
- Design tokens in CSS custom properties (see `DESIGN.md` for full system)
- Auth: JWT access + refresh token in HttpOnly cookie

## API

Base: `http://localhost:8080/api/v1` (configured in `config.js`)

Key endpoints:
- Auth: `/auth/login`, `/auth/register`, `/auth/refresh`, `/auth/logout`
- Transactions: `/transactions` (CRUD + filters: userId, categoryId, subcategoryId, date, dateFrom, dateTo, pagination)
- Subcategories: `/subcategories` (CRUD + filter by category)
- Categories: `/categories` (list active), `/admin/categories` (admin CRUD)
- Dashboard user: `/dashboard/me/*` (totals, balance, expenses by category/subcategory)
- Dashboard admin: `/dashboard/admin/*` (stats, evolution, top users, money movement, averages)
- Admin users: `/admin/users` (list with filters, update, soft delete)

## Key Gotchas

- Backend must be running before frontend works — no mock/fallback data
- Token refresh happens automatically in `api.js` on 401
- Soft delete used everywhere (entities marked `deleted: true`, not removed)
- Desktop (≥1024px): sidebar hidden, main content fixed/centered at 90% width, header/footer fixed
- Chart.js loaded from CDN — works offline only if cached
- `config.js` is the single source of truth for API URL and currency

## Testing

No test setup exists. Manual verification via browser.

## Files to Reference

- `DESIGN.md` — complete design system (colors, typography, components, rules)
- `README.md` — full feature list, API endpoints, architecture diagrams
- `PRODUCT.md` — product context (if exists)


