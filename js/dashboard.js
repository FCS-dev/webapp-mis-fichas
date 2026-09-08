// ===================================================================
// HELPERS
// ===================================================================
function getDefaultDateFrom(monthsBack) {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsBack);
  return { month: d.getMonth() + 1, year: d.getFullYear() };
}

// ===================================================================
// STATE
// ===================================================================
let currentSection = "dashboard";
let cachedCategories = [];

// Dashboard filter state
let dashMonth = CURRENT_MONTH;
let dashYear = CURRENT_YEAR;
let dashCategoryFilter = null;
let dashMonthsRange = 3;
let chartCategory = null;
let chartSubcategory = null;
let chartBalance = null;
let categoryChartData = [];

// Transactions section
let txPage = 0;
let txPageSize = 10;
let txTransactions = [];
let txPagination = null;
let txAdminUserId = 0;

// Subcategories section
let subPage = 0;
let subPageSize = 15;
let subSubcategories = [];
let subPagination = null;

// Categories section
let catPage = 0;
let catPageSize = 15;
let catCategories = [];
let catPagination = null;

// Admin section
let adminUsers = [];
let adminLastUpdate = null;

// Section 1: User evolution
const _6m = getDefaultDateFrom(6);
let sec1MonthFrom = _6m.month;
let sec1YearFrom = _6m.year;
let sec1MonthTo = CURRENT_MONTH;
let sec1YearTo = CURRENT_YEAR;
let chartUserGrowth = null;

// Section 2: Transaction evolution
let sec2MonthFrom = _6m.month;
let sec2YearFrom = _6m.year;
let sec2MonthTo = CURRENT_MONTH;
let sec2YearTo = CURRENT_YEAR;
let sec2UserId = 0;
let chartIncomeVsExpense = null;

// Section 3: Money movement
let sec3UserId = 0;

// Section 4: Averages
let sec4UserId = 0;

// Section 5: Top users
let sec5MonthFrom = _6m.month;
let sec5YearFrom = _6m.year;
let sec5MonthTo = CURRENT_MONTH;
let sec5YearTo = CURRENT_YEAR;

// Section 6: Activity distribution
let sec6Month = CURRENT_MONTH;
let sec6Year = CURRENT_YEAR;

// Expense breakdown (category + subcategory pie charts)
let chartAdminCategory = null;
let chartAdminSubcategory = null;
let adminCategoryFilter = null;
let adminCategoryChartData = [];
let expBreakdownUserId = 0;
let expBreakdownMonthFrom = _6m.month;
let expBreakdownYearFrom = _6m.year;
let expBreakdownMonthTo = CURRENT_MONTH;
let expBreakdownYearTo = CURRENT_YEAR;

// ===================================================================
// CATEGORY CACHE
// ===================================================================
async function ensureCategoryCache() {
  if (cachedCategories.length > 0) return;
  try {
    const res = await apiRequest(
      "GET",
      "/categories?page=0&size=100&sort=name,asc",
    );
    cachedCategories = res?.content || [];
  } catch {}
}

async function fetchSubcategoriesByCategory(categoryId) {
  try {
    const res = await apiRequest(
      "GET",
      `/subcategories/category/${categoryId}?page=0&size=100&sort=id,asc`,
    );
    return res?.content || [];
  } catch {
    return [];
  }
}

// ===================================================================
// NAVIGATION
// ===================================================================
function navigateTo(section) {
  currentSection = section;
  document.querySelectorAll(".sidebar-link").forEach((el) => {
    el.classList.toggle("active", el.dataset.section === section);
  });
  document.querySelectorAll(".header-nav-link").forEach((el) => {
    el.classList.toggle("active", el.dataset.section === section);
  });
  closeSidebar();

  const content = document.getElementById("dashContent");
  content.innerHTML = '<p class="loading-message">Cargando…</p>';

  if (section === "dashboard") {
    if (isAdmin()) renderAdminDashboardSection();
    else renderDashboardSection();
  } else if (section === "transactions") renderTransactionsSection();
  else if (section === "subcategories") renderSubcategoriesSection();
  else if (section === "categories" && isAdmin()) renderCategoriesSection();
  else if (section === "categories") navigateTo("dashboard");
}

// ===================================================================
// LAYOUT
// ===================================================================
function renderDashboardLayout() {
  const user = getUserInfo();
  const isDark = document.documentElement.classList.contains("dark");
  const logoIcon = isDark ? 'assets/logo/mis-fichas-logo-solo-oscuro.png' : 'assets/logo/mis-fichas-logo-solo-claro.png';
  const logoFull = isDark ? 'assets/logo/mis-fichas-logo-modo-oscuro.png' : 'assets/logo/mis-fichas-logo-modo-claro.png';
  document.getElementById("app").innerHTML = `
        <div class="dash-layout">
            <header class="dash-header">
                <button class="sidebar-toggle" onclick="window.toggleSidebar()" aria-label="Menú">&#x2630;</button>
                <a href="#/" onclick="window.navigateTo('dashboard')" class="header-logo">
                    <img class="header-logo-icon" src="${logoIcon}" alt="">
                    <span class="header-logo-text">Mis Fichas</span>
                </a>
                <nav class="header-nav" aria-label="Navegación principal">
                    <button class="header-nav-link active" data-section="dashboard" onclick="window.navigateTo('dashboard')">Dashboard</button>
                    <button class="header-nav-link" data-section="transactions" onclick="window.navigateTo('transactions')">Transacciones</button>
                    <button class="header-nav-link" data-section="subcategories" onclick="window.navigateTo('subcategories')">Sub-Categor&iacute;as</button>
                    ${isAdmin() ? '<button class="header-nav-link" data-section="categories" onclick="window.navigateTo(\'categories\')">Categor&iacute;as</button>' : ""}
                </nav>
                <div class="header-right">
                    <button class="theme-toggle" onclick="window.toggleTheme()" title="Cambiar tema" aria-label="Cambiar tema" aria-pressed="${isDark}">
                        ${isDark
                            ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
                            : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
                        }
                    </button>
                    <div class="header-user">
                        <span class="header-greeting">Hola</span>
                        <span class="header-user-name">${escHtml(user?.name || "")}</span>
                    </div>
                    <button class="btn-logout" onclick="window.handleLogout()" title="Cerrar sesión" aria-label="Cerrar sesión">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                    </button>
                </div>
            </header>
            <div class="dash-body">
                <div class="sidebar-overlay" id="sidebarOverlay" onclick="window.closeSidebar()" role="button" tabindex="0" aria-label="Cerrar menú"></div>
                <nav class="dash-sidebar" id="sidebar" role="navigation" aria-label="Menú principal">
                    <ul class="sidebar-nav">
                        <li><button class="sidebar-link active" data-section="dashboard" onclick="window.navigateTo('dashboard')"><span class="icon">&#x1F4CA;</span> Dashboard</button></li>
                        <li><button class="sidebar-link" data-section="transactions" onclick="window.navigateTo('transactions')"><span class="icon">&#x1F4B0;</span> Transacciones</button></li>
                        <li><button class="sidebar-link" data-section="subcategories" onclick="window.navigateTo('subcategories')"><span class="icon">&#x1F3F7;</span> Sub-Categor&iacute;as</button></li>
                        ${isAdmin() ? '<li><button class="sidebar-link" data-section="categories" onclick="window.navigateTo(\'categories\')"><span class="icon">&#x1F4C1;</span> Categor&iacute;as</button></li>' : ""}
                    </ul>
                    <button class="theme-toggle sidebar-theme-toggle" onclick="window.toggleTheme()" title="Cambiar tema" aria-label="Cambiar tema" aria-pressed="${isDark}">
                        ${isDark
                            ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
                            : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
                        }
                    </button>
                </nav>
                <main class="dash-main" id="dashContent">
                    <p class="loading-message">Cargando…</p>
                </main>
            </div>
        </div>
        <footer class="dash-footer">
            <div class="footer-inner">
                <span class="footer-brand">Mis Fichas</span>
                <nav class="footer-links" aria-label="Enlaces del pie de página">
                    <a href="#/dashboard">Dashboard</a>
                    <a href="#/dashboard" onclick="window.navigateTo('transactions')">Transacciones</a>
                </nav>
                <span class="footer-copy">&copy; ${new Date().getFullYear()} <a href="https://github.com/FCS-dev/webapp-mis-fichas" target="_blank" rel="noopener noreferrer">Franco Calderón</a></span>
            </div>
        </footer>
        ${!isAdmin() ? '<a class="fab-tx" onclick="window.showTxForm()" title="Nueva transacci&oacute;n" role="button" aria-label="Nueva transacción"><span class="fab-icon">+</span><span class="fab-label">Nueva transacci&oacute;n</span></a>' : ""}
    `;

  updateLogoSrc();
  ensureCategoryCache().then(() => {
    navigateTo(currentSection);
  });
}

// ===================================================================
// DASHBOARD ENTRY POINT
// ===================================================================
function renderDashboard() {
  currentSection = "dashboard";
  window.__editingTxId = null;
  window.__editingSubId = null;
  renderDashboardLayout();
}

// ===================================================================
// LOGOUT
// ===================================================================
async function handleLogout() {
  try {
    await apiRequest("POST", "/auth/logout");
  } catch {
    /* ignore */
  }
  clearTokens();
  window.location.hash = "#login";
}

// ===================================================================
// EXPORTS
// ===================================================================
window.handleLogout = handleLogout;
window.navigateTo = navigateTo;
