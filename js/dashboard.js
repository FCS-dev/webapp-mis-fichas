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
let currentSection = 'dashboard';
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
let txTransactions = [];
let txPagination = null;
let txAdminUserId = 0;

// Subcategories section
let subPage = 0;
let subSubcategories = [];
let subPagination = null;

// Categories section
let catPage = 0;
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
        const res = await apiRequest('GET', '/categories?page=0&size=100&sort=name,asc');
        cachedCategories = res?.content || [];
    } catch {}
}

async function loadSharedCache() {
    await ensureCategoryCache();
}

async function fetchSubcategoriesByCategory(categoryId) {
    try {
        const res = await apiRequest(
            'GET',
            `/subcategories/category/${categoryId}?page=0&size=100&sort=name,asc`
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
    document.querySelectorAll('.sidebar-link').forEach(el => {
        el.classList.toggle('active', el.dataset.section === section);
    });
    closeSidebar();

    const content = document.getElementById('dashContent');
    content.innerHTML = '<p class="loading-message">Cargando…</p>';

    if (section === 'dashboard') {
        if (isAdmin()) renderAdminDashboardSection();
        else renderDashboardSection();
    }
    else if (section === 'transactions') renderTransactionsSection();
    else if (section === 'subcategories') renderSubcategoriesSection();
    else if (section === 'categories') renderCategoriesSection();
}

// ===================================================================
// LAYOUT
// ===================================================================
function renderDashboardLayout() {
    const user = getUserInfo();
    const icon = getThemeIcon();

    document.getElementById('app').innerHTML = `
        <div class="dash-layout">
            <header class="dash-header">
                <div class="dash-header-left">
                    <button class="sidebar-toggle" onclick="window.toggleSidebar()" aria-label="Menú">&#x2630;</button>
                    <a onclick="window.navigateTo('dashboard')" class="logo-desktop logo-link">
                        <img class="logo" src="assets/logo/mis-fichas-logo-modo-claro.png" alt="Mis Fichas" style="height:128px;width:auto">
                    </a>
                </div>
                <div class="dash-header-center">
                    <a onclick="window.navigateTo('dashboard')" class="logo-mobile logo-link">
                        <img class="logo" src="assets/logo/mis-fichas-logo-modo-claro.png" alt="Mis Fichas" style="height:128px;width:auto">
                    </a>
                    <div class="header-user-info">
                        ${!isAdmin() ? '<span class="header-welcome">Bienvenido,</span>' : ''}
                        <h2 class="header-name">${escHtml(user?.name || '')}</h2>
                        <h3 class="header-email">${escHtml(user?.email || '')}</h3>
                    </div>
                </div>
                <div class="dash-header-right">
                    <button class="sidebar-toggle-right" onclick="window.toggleSidebar()" aria-label="Menú">&#x2630;</button>
                    <button class="theme-toggle" onclick="window.toggleTheme()" title="Cambiar tema" aria-label="Cambiar tema">${icon}</button>
                    <button class="btn-logout" onclick="window.handleLogout()" title="Cerrar sesión">&#x2B06;</button>
                </div>
            </header>
            <div class="dash-body">
                <div class="sidebar-overlay" id="sidebarOverlay" onclick="window.closeSidebar()"></div>
                <nav class="dash-sidebar" id="sidebar">
                    <ul class="sidebar-nav">
                        <li><button class="sidebar-link active" data-section="dashboard" onclick="window.navigateTo('dashboard')"><span class="icon">&#x25C9;</span> Panel</button></li>
                        <li><button class="sidebar-link" data-section="transactions" onclick="window.navigateTo('transactions')"><span class="icon">&#x2195;</span> Transacciones</button></li>
                        <li><button class="sidebar-link" data-section="subcategories" onclick="window.navigateTo('subcategories')"><span class="icon">&#x229E;</span> Subcategor&iacute;as</button></li>
                        <li><button class="sidebar-link" data-section="categories" onclick="window.navigateTo('categories')"><span class="icon">&#x2630;</span> Categor&iacute;as</button></li>
                    </ul>
                </nav>
                <main class="dash-main" id="dashContent">
                    <p class="loading-message">Cargando…</p>
                </main>
            </div>
        </div>
        <footer class="dash-footer">
            <span>Mis Fichas &copy; ${new Date().getFullYear()}</span>
        </footer>
        ${!isAdmin() ? '<a class="fab-tx" onclick="window.showTxForm()" title="Nueva transacci&oacute;n"><span class="fab-icon">+</span><span class="fab-label">Nueva transacci&oacute;n</span></a>' : ''}
    `;

    updateLogoSrc();
    loadSharedCache().then(() => {
        navigateTo(currentSection);
        initHeaderShrink();
    });
}

function initHeaderShrink() {
    const header = document.querySelector('.dash-header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        const shrunk = window.scrollY > 30;
        header.classList.toggle('shrink', shrunk);
        const src = getLogoSrc(shrunk);
        document.querySelectorAll('.logo').forEach(img => { img.src = src; });
    });
}

// ===================================================================
// DASHBOARD ENTRY POINT
// ===================================================================
function renderDashboard() {
    currentSection = 'dashboard';
    window.__editingTxId = null;
    window.__editingSubId = null;
    renderDashboardLayout();
}

// ===================================================================
// LOGOUT
// ===================================================================
async function handleLogout() {
    try {
        await apiRequest('POST', '/auth/logout');
    } catch { /* ignore */ }
    clearTokens();
    window.location.hash = '#login';
}

// ===================================================================
// EXPORTS
// ===================================================================
window.handleLogout = handleLogout;
window.navigateTo = navigateTo;
