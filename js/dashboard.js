// ===================================================================
// STATE
// ===================================================================
let currentSection = 'dashboard';
let cachedCategories = [];

// Dashboard filter state
let dashMonth = new Date().getMonth() + 1;
let dashYear = new Date().getFullYear();
let dashCategoryFilter = null;
let chartCategory = null;
let chartSubcategory = null;
let chartBalance = null;
let categoryChartData = [];

// Dashboard section
let dashTransactions = [];
let dashDateFrom = '';
let dashDateTo = '';

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
let sec1MonthFrom = new Date().getMonth() + 1;
let sec1YearFrom = new Date().getFullYear();
let sec1MonthTo = new Date().getMonth() + 1;
let sec1YearTo = new Date().getFullYear();
let chartUserGrowth = null;

// Section 2: Transaction evolution
let sec2MonthFrom = new Date().getMonth() + 1;
let sec2YearFrom = new Date().getFullYear();
let sec2MonthTo = new Date().getMonth() + 1;
let sec2YearTo = new Date().getFullYear();
let sec2UserId = 0;
let chartIncomeVsExpense = null;

// Section 3: Money movement
let sec3UserId = 0;

// Section 4: Averages
let sec4UserId = 0;

// Section 5: Top users
let sec5MonthFrom = new Date().getMonth() + 1;
let sec5YearFrom = new Date().getFullYear();
let sec5MonthTo = new Date().getMonth() + 1;
let sec5YearTo = new Date().getFullYear();

// Section 6: Activity distribution
let sec6Month = new Date().getMonth() + 1;
let sec6Year = new Date().getFullYear();

// Expense breakdown (category + subcategory pie charts)
let chartAdminCategory = null;
let chartAdminSubcategory = null;
let adminCategoryFilter = null;
let adminCategoryChartData = [];
let expBreakdownUserId = 0;
let expBreakdownMonthFrom = new Date().getMonth() + 1;
let expBreakdownYearFrom = new Date().getFullYear();
let expBreakdownMonthTo = new Date().getMonth() + 1;
let expBreakdownYearTo = new Date().getFullYear();

// ===================================================================
// UTILITIES
// ===================================================================
function formatMoney(amount) {
    return (CONFIG.CURRENCY_SYMBOL || '$') + ' ' + Number(amount).toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

function escHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function getMonthDates() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();
    return {
        from: `${y}-${m}-01`,
        to: `${y}-${m}-${String(lastDay).padStart(2, '0')}`
    };
}

function getMonthLabel() {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
}

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

function getCategoryName(id) {
    const cat = cachedCategories.find(c => c.id === id);
    return cat ? cat.name : '—';
}

function getCategoryType(id) {
    const cat = cachedCategories.find(c => c.id === id);
    return cat ? cat.type : null;
}

function updateLogoSrc() {
    const isDark = document.documentElement.classList.contains('dark');
    const src = isDark ? 'assets/logo/mis-fichas-logo-modo-oscuro.png' : 'assets/logo/mis-fichas-logo-modo-claro.png';
    document.querySelectorAll('.logo').forEach(img => { img.src = src; });
}

// ===================================================================
// TOAST
// ===================================================================
function showToast(message, type) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===================================================================
// MODAL
// ===================================================================
function showModal({ title, bodyHtml, wide }) {
    const prev = document.getElementById('modalOverlay');
    if (prev) prev.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modalOverlay';
    overlay.innerHTML = `
        <div class="modal${wide ? ' modal-wide' : ''}">
            <div class="modal-header">
                <h3>${escHtml(title)}</h3>
                <button class="modal-close" id="modalCloseBtn">&#x2715;</button>
            </div>
            <div class="modal-body">
                ${bodyHtml}
            </div>
        </div>`;

    document.body.appendChild(overlay);

    document.getElementById('modalCloseBtn').addEventListener('click', hideModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) hideModal();
    });

    const first = overlay.querySelector('input, select, textarea, button');
    if (first) setTimeout(() => first.focus(), 100);
}

function hideModal() {
    const el = document.getElementById('modalOverlay');
    if (el) el.remove();
}

function showConfirm(message, onConfirm) {
    showModal({
        title: 'Confirmar',
        bodyHtml: `
            <p class="confirm-text">${escHtml(message)}</p>
            <div class="confirm-actions">
                <button class="btn-secondary" id="confirmCancel">Cancelar</button>
                <button class="btn-primary" id="confirmOk">Eliminar</button>
            </div>`
    });
    document.getElementById('confirmOk').addEventListener('click', () => {
        hideModal();
        onConfirm();
    });
    document.getElementById('confirmCancel').addEventListener('click', hideModal);
}

// ===================================================================
// SIDEBAR
// ===================================================================
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('open');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('open');
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
                    <span class="user-greeting">${user?.name ? escHtml(user.role || '') + ' · ' + escHtml(user.name) : ''}</span>
                </div>
                <div class="dash-header-right">
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
        </div>`;

    updateLogoSrc();
    loadSharedCache().then(() => {
        navigateTo(currentSection);
    });
}

// ===================================================================
// DASHBOARD SECTION
// ===================================================================
const CHART_COLORS = [
    '#4f46e5', '#059669', '#dc2626', '#f59e0b', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
    '#06b6d4', '#d946ef', '#eab308', '#3b82f6', '#22c55e'
];

function getChartTextColor() {
    return document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#475569';
}

function getChartGridColor() {
    return document.documentElement.classList.contains('dark') ? '#334155' : '#e2e8f0';
}

function destroyChart(ref) {
    if (ref === 'category' && chartCategory) { chartCategory.destroy(); chartCategory = null; }
    else if (ref === 'subcategory' && chartSubcategory) { chartSubcategory.destroy(); chartSubcategory = null; }
    else if (ref === 'balance' && chartBalance) { chartBalance.destroy(); chartBalance = null; }
    else if (ref === 'userGrowth' && chartUserGrowth) { chartUserGrowth.destroy(); chartUserGrowth = null; }
    else if (ref === 'incomeVsExpense' && chartIncomeVsExpense) { chartIncomeVsExpense.destroy(); chartIncomeVsExpense = null; }
    else if (ref === 'adminCategory' && chartAdminCategory) { chartAdminCategory.destroy(); chartAdminCategory = null; }
    else if (ref === 'adminSubcategory' && chartAdminSubcategory) { chartAdminSubcategory.destroy(); chartAdminSubcategory = null; }
}

function generateColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(CHART_COLORS[i % CHART_COLORS.length]);
    }
    return colors;
}

// ===================================================================
// DOUGHNUT VALUE LABELS — custom Chart.js plugin
// ===================================================================
Chart.register({
    id: 'doughnutLabels',
    afterDraw(chart) {
        if (chart.config.type !== 'doughnut') return;
        const ctx = chart.ctx;
        const meta = chart.getDatasetMeta(0);
        if (!meta?.data?.length) return;
        const isDark = document.documentElement.classList.contains('dark');
        ctx.save();
        meta.data.forEach((el, i) => {
            const value = chart.data.datasets[0].data[i];
            if (!value) return;
            const pos = el.tooltipPosition();
            ctx.font = 'bold 11px sans-serif';
            ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)';
            ctx.shadowBlur = 3;
            ctx.fillText(formatMoney(value), pos.x, pos.y);
        });
        ctx.restore();
    }
});

function renderDashboardSection() {
    const md = getMonthDatesForFilter(dashMonth, dashYear);
    dashDateFrom = md.from;
    dashDateTo = md.to;
    dashCategoryFilter = null;

    const months = [
        'Enero','Febrero','Marzo','Abril','Mayo','Junio',
        'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
    ];
    const monthOptions = months.map((name, i) =>
        `<option value="${i + 1}"${dashMonth === i + 1 ? ' selected' : ''}>${name}</option>`
    ).join('');

    const yearOptions = [];
    for (let y = dashYear - 5; y <= dashYear + 1; y++) {
        yearOptions.push(`<option value="${y}"${dashYear === y ? ' selected' : ''}>${y}</option>`);
    }

    document.getElementById('dashContent').innerHTML = `
        <div class="section-header-row">
            <div class="section-header">
                <h2>Resumen financiero</h2>
                <p id="dashPeriodSubtitle">${months[dashMonth-1]} ${dashYear}</p>
            </div>
            <div class="filter-section">
                <div class="filter-controls" id="dashFilters">
                <label>Mes
                    <select id="dashMonthSelect" onchange="window.handleFilterChange()">${monthOptions}</select>
                </label>
                <label>A&ntilde;o
                    <select id="dashYearSelect" onchange="window.handleFilterChange()">${yearOptions}                </select>
                </label>
            </div>
            </div>
        </div>
        <div class="summary-cards" id="dashSummary">
            <div class="summary-card" id="incomeCard">
                <span class="summary-label">Ingresos</span>
                <span class="summary-value income" id="incomeValue">${CONFIG.CURRENCY_SYMBOL || '$'} 0</span>
            </div>
            <div class="summary-card" id="expenseCard">
                <span class="summary-label">Gastos</span>
                <span class="summary-value expense" id="expenseValue">${CONFIG.CURRENCY_SYMBOL || '$'} 0</span>
            </div>
            <div class="summary-card" id="balanceCard">
                <span class="summary-label">Balance</span>
                <span class="summary-value" id="balanceValue">${CONFIG.CURRENCY_SYMBOL || '$'} 0</span>
            </div>
        </div>
        <div class="dashboard-charts" id="chartsContainer">
            <div class="chart-card">
                <h4 class="chart-title">Gastos por categor&iacute;a</h4>
                <div class="chart-wrapper"><canvas id="categoryChart"></canvas></div>
            </div>
            <div class="chart-card">
                <div class="chart-header">
                    <div>
                        <h4 class="chart-title" style="margin:0">Gastos por subcategor&iacute;a</h4>
                        <span id="subcategoryCategoryLabel" class="chart-sub-label"></span>
                    </div>
                    <select id="subcategoryCategoryFilter" onchange="window.handleCategoryFilterChange()">
                        <option value="">Seleccionar categor&iacute;a</option>
                    </select>
                </div>
                <div class="chart-wrapper"><canvas id="subcategoryChart"></canvas></div>
            </div>
            <div class="chart-card chart-card-full">
                <h4 class="chart-title">Balance mensual &uacute;ltimos 12 meses</h4>
                <div class="chart-wrapper"><canvas id="balanceChart"></canvas></div>
            </div>
        </div>
        <h3 style="margin:24px 0 12px;font-weight:600;font-size:1rem;">&Uacute;ltimas transacciones</h3>
        <div class="table-scroll">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Categor&iacute;a</th>
                        <th>Subcategor&iacute;a</th>
                        <th>Descripci&oacute;n</th>
                        <th>Monto</th>
                    </tr>
                </thead>
                <tbody id="dashTxBody">
                    <tr><td colspan="5" class="empty-state">Cargando…</td></tr>
                </tbody>
            </table>
        </div>`;

    loadDashboardData();
}

function getMonthDatesForFilter(month, year) {
    const m = String(month).padStart(2, '0');
    const lastDay = new Date(year, month, 0).getDate();
    return {
        from: `${year}-${m}-01`,
        to: `${year}-${m}-${String(lastDay).padStart(2, '0')}`
    };
}

async function loadDashboardData() {
    try {
        await ensureCategoryCache();
        const md = getMonthDatesForFilter(dashMonth, dashYear);
        dashDateFrom = md.from;
        dashDateTo = md.to;

        const expenseCats = cachedCategories.filter(c => c.type === 'EXPENSE');

        const [incomeRes, expenseRes, catExpenses, balanceRes, txsRes] = await Promise.all([
            apiRequest('GET', `/dashboard/me/total-income?month=${dashMonth}&year=${dashYear}`),
            apiRequest('GET', `/dashboard/me/total-expense?month=${dashMonth}&year=${dashYear}`),
            apiRequest('GET', `/dashboard/me/expenses-by-category?month=${dashMonth}&year=${dashYear}`),
            apiRequest('GET', '/dashboard/me/monthly-balance'),
            apiRequest('GET', `/transactions/date-range?from=${md.from}&to=${md.to}&page=0&size=500&sort=transactionDate,desc`)
        ]);

        const income = incomeRes?.total || 0;
        const expense = expenseRes?.total || 0;
        renderDashboardCards(income, expense);

        const catExpenseData = Array.isArray(catExpenses) ? catExpenses : [];
        categoryChartData = catExpenseData;
        renderCategoryChart(catExpenseData);

        if (catExpenseData.length > 0) {
            const highest = catExpenseData.reduce((a, b) => a.total > b.total ? a : b);
            dashCategoryFilter = highest.categoryId;
        } else {
            dashCategoryFilter = null;
        }
        updateSubcategoryLabel();

        const balanceData = Array.isArray(balanceRes) ? balanceRes : [];
        renderBalanceChart(balanceData);

        const catSelect = document.getElementById('subcategoryCategoryFilter');
        if (catSelect) {
            catSelect.innerHTML = '<option value="">Seleccionar categor&iacute;a</option>';
            expenseCats.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.textContent = c.name;
                if (dashCategoryFilter === c.id) opt.selected = true;
                catSelect.appendChild(opt);
            });
            if (dashCategoryFilter && !catSelect.value) {
                dashCategoryFilter = null;
            }
            if (dashCategoryFilter) {
                await loadSubcategoryChart();
            } else {
                destroyChart('subcategory');
            }
        }

        dashTransactions = txsRes?.content || [];
        renderDashboardTable();
    } catch (err) {
        const s = document.getElementById('dashSummary');
        if (s) s.innerHTML = `<p class="error-message">Error al cargar: ${escHtml(err.message)}</p>`;
    }
}

function renderDashboardCards(income, expense) {
    const balance = income - expense;
    const incEl = document.getElementById('incomeValue');
    const expEl = document.getElementById('expenseValue');
    const balEl = document.getElementById('balanceValue');
    if (incEl) incEl.textContent = formatMoney(income);
    if (expEl) expEl.textContent = formatMoney(expense);
    if (balEl) {
        balEl.textContent = formatMoney(balance);
        balEl.className = 'summary-value ' + (balance >= 0 ? 'income' : 'expense');
    }
}

function renderCategoryChart(data) {
    destroyChart('category');
    categoryChartData = data;
    const canvas = document.getElementById('categoryChart');
    if (!canvas || !data.length) return;

    const labels = data.map(d => d.categoryName);
    const values = data.map(d => d.total);
    const colors = generateColors(data.length);

    chartCategory = new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{ data: values, backgroundColor: colors, borderWidth: 0 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const idx = elements[0].index;
                    const catData = categoryChartData[idx];
                    if (!catData || !catData.categoryId) return;
                    const sel = document.getElementById('subcategoryCategoryFilter');
                    if (!sel) return;
                    const opt = sel.querySelector(`option[value="${catData.categoryId}"]`);
                    if (!opt) return;
                    sel.value = catData.categoryId;
                    dashCategoryFilter = catData.categoryId;
                    updateSubcategoryLabel();
                    loadSubcategoryChart();
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: getChartTextColor(), boxWidth: 12, padding: 12 }
                }
            }
        }
    });
}

function renderBalanceChart(data) {
    destroyChart('balance');
    const canvas = document.getElementById('balanceChart');
    if (!canvas || !data.length) return;

    const sorted = [...data].sort((a, b) => a.year - b.year || a.month - b.month);
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const labels = sorted.map(d => months[d.month - 1] + ' ' + d.year);
    const textColor = getChartTextColor();
    const gridColor = getChartGridColor();

    const allValues = sorted.flatMap(d => [d.income, d.expense, d.balance]);
    const globalMin = Math.min(...allValues);
    const globalMax = Math.max(...allValues);
    const padding = (globalMax - globalMin) * 0.1 || 1;

    chartBalance = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: sorted.map(d => d.income),
                    borderColor: '#059669',
                    backgroundColor: 'rgba(5,150,105,0.06)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    yAxisID: 'y'
                },
                {
                    label: 'Gastos',
                    data: sorted.map(d => d.expense),
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220,38,38,0.06)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    yAxisID: 'y'
                },
                {
                    label: 'Balance',
                    data: sorted.map(d => d.balance),
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79,70,229,0.06)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    borderDash: [6, 3],
                    yAxisID: 'y2'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: textColor, boxWidth: 12, padding: 12 }
                }
            },
            scales: {
                x: {
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                },
                y: {
                    position: 'left',
                    min: globalMin - padding,
                    max: globalMax + padding,
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                },
                y2: {
                    position: 'right',
                    min: globalMin - padding,
                    max: globalMax + padding,
                    ticks: { color: textColor },
                    grid: { display: false }
                }
            }
        }
    });
}

async function loadSubcategoryChart() {
    if (!dashCategoryFilter) {
        destroyChart('subcategory');
        return;
    }
    try {
        const res = await apiRequest(
            'GET',
            `/dashboard/me/expenses-by-subcategory?categoryId=${dashCategoryFilter}&month=${dashMonth}&year=${dashYear}`
        );
        const data = Array.isArray(res) ? res : [];
        renderSubcategoryChart(data);
    } catch {
        destroyChart('subcategory');
    }
}

function renderSubcategoryChart(data) {
    destroyChart('subcategory');
    const canvas = document.getElementById('subcategoryChart');
    if (!canvas || !data.length) return;

    const labels = data.map(d => d.subcategoryName);
    const values = data.map(d => d.total);
    const colors = generateColors(data.length);

    chartSubcategory = new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{ data: values, backgroundColor: colors, borderWidth: 0 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: getChartTextColor(), boxWidth: 12, padding: 12 }
                }
            }
        }
    });
}

function renderDashboardTable() {
    const tbody = document.getElementById('dashTxBody');
    const recent = dashTransactions.slice(0, 10);
    if (!recent.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No hay transacciones este mes</td></tr>';
        return;
    }
    tbody.innerHTML = recent.map(tx => {
        const type = getCategoryType(tx.categoryId);
        return `<tr>
            <td>${formatDate(tx.transactionDate)}</td>
            <td>${escHtml(tx.categoryName || '—')}</td>
            <td>${escHtml(tx.subcategoryName || '—')}</td>
            <td>${escHtml(tx.description || '—')}</td>
            <td class="amount ${type === 'INCOME' ? 'income' : 'expense'}">${formatMoney(tx.amount)}</td>
        </tr>`;
    }).join('');
}

function updateSubcategoryLabel() {
    const el = document.getElementById('subcategoryCategoryLabel');
    if (!el) return;
    if (!dashCategoryFilter) {
        el.textContent = '';
        return;
    }
    const cat = cachedCategories.find(c => c.id === dashCategoryFilter);
    el.textContent = cat ? `Categoría: ${cat.name}` : '';
}

function updateDashboardPeriodLabel() {
    const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const el = document.getElementById('dashPeriodSubtitle');
    if (el) el.textContent = `${months[dashMonth-1]} ${dashYear}`;
}

function handleFilterChange() {
    const m = document.getElementById('dashMonthSelect');
    const y = document.getElementById('dashYearSelect');
    if (!m || !y) return;
    dashMonth = parseInt(m.value);
    dashYear = parseInt(y.value);
    dashCategoryFilter = null;
    updateDashboardPeriodLabel();
    loadDashboardData();
}

function handleCategoryFilterChange() {
    const sel = document.getElementById('subcategoryCategoryFilter');
    if (!sel) return;
    dashCategoryFilter = sel.value ? parseInt(sel.value) : null;
    updateSubcategoryLabel();
    loadSubcategoryChart();
}

async function refreshDashboardIfActive() {
    if (!document.getElementById('incomeCard')) return;
    await loadDashboardData();
}

// ===================================================================
// ADMIN DASHBOARD
// ===================================================================
function renderAdminDashboardSection() {
    const now = new Date();
    const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

    document.getElementById('dashContent').innerHTML = `
        <div class="section-header">
            <h2>Panel de Administraci&oacute;n</h2>
            <p id="adminDashboardTimestamp" style="font-size:0.75rem;color:var(--text-secondary);margin-top:4px;"></p>
        </div>

        <div class="admin-section" id="sec1">
            <div class="admin-section-header">
                <div class="admin-section-title-group">
                    <h3>Evoluci&oacute;n de Usuarios</h3>
                    <p class="admin-section-criteria" id="sec1Criteria"></p>
                </div>
                <div class="admin-section-filters" id="sec1Filters"></div>
            </div>
            <div class="stat-cards" id="sec1Cards"><div class="loading-message">Cargando…</div></div>
            <div class="chart-card" style="margin-top:12px"><div class="chart-wrapper"><canvas id="sec1Chart"></canvas></div></div>
        </div>

        <div class="admin-section" id="sec2">
            <div class="admin-section-header">
                <div class="admin-section-title-group">
                    <h3>Evoluci&oacute;n de Transacciones</h3>
                    <p class="admin-section-criteria" id="sec2Criteria"></p>
                </div>
                <div class="admin-section-filters" id="sec2Filters"></div>
            </div>
            <div class="stat-cards" id="sec2Cards"><div class="loading-message">Cargando…</div></div>
            <div class="chart-card" style="margin-top:12px"><div class="chart-wrapper"><canvas id="sec2Chart"></canvas></div></div>
        </div>

        <div class="admin-section" id="secExpBreakdown">
            <div class="admin-section-header">
                <div class="admin-section-title-group">
                    <h3>Desglose de Gastos</h3>
                    <p class="admin-section-criteria" id="expBreakdownCriteria"></p>
                </div>
                <div class="admin-section-filters" id="expBreakdownFilters"></div>
            </div>
            <div class="dashboard-charts">
                <div class="chart-card">
                    <h4 class="chart-title">Gastos por categor&iacute;a</h4>
                    <div class="chart-wrapper"><canvas id="adminCategoryChart"></canvas></div>
                </div>
                <div class="chart-card">
                    <div class="chart-header">
                        <div>
                            <h4 class="chart-title" style="margin:0">Gastos por subcategor&iacute;a</h4>
                            <span id="adminSubcategoryLabel" class="chart-sub-label"></span>
                        </div>
                        <select id="adminCategoryFilter" onchange="window.handleAdminCategoryFilterChange()">
                            <option value="">Seleccionar</option>
                        </select>
                    </div>
                    <div class="chart-wrapper"><canvas id="adminSubcategoryChart"></canvas></div>
                </div>
            </div>
        </div>

        <div class="admin-section" id="sec3">
            <div class="admin-section-header">
                <div class="admin-section-title-group">
                    <h3>Movimientos de Dinero</h3>
                    <p class="admin-section-criteria" id="sec3Criteria"></p>
                </div>
                <div class="admin-section-filters" id="sec3Filters"></div>
            </div>
            <div class="money-cards" id="sec3Cards"><div class="loading-message">Cargando…</div></div>
        </div>

        <div class="admin-section" id="sec4">
            <div class="admin-section-header">
                <div class="admin-section-title-group">
                    <h3>Promedios</h3>
                    <p class="admin-section-criteria" id="sec4Criteria"></p>
                </div>
                <div class="admin-section-filters" id="sec4Filters"></div>
            </div>
            <div class="averages-grid" id="sec4Cards"><div class="loading-message">Cargando…</div></div>
        </div>

        <div class="admin-section" id="sec5">
            <div class="admin-section-header">
                <div class="admin-section-title-group">
                    <h3>Usuarios con Mayor Actividad</h3>
                    <p class="admin-section-criteria" id="sec5Criteria"></p>
                </div>
                <div class="admin-section-filters" id="sec5Filters"></div>
            </div>
            <div class="mini-tables" id="sec5Cards"><div class="loading-message">Cargando…</div></div>
        </div>

        <div class="admin-section" id="sec6">
            <div class="admin-section-header">
                <div class="admin-section-title-group">
                    <h3>Distribuci&oacute;n de Usuarios por Actividad</h3>
                    <p class="admin-section-criteria" id="sec6Criteria"></p>
                </div>
                <div class="admin-section-filters" id="sec6Filters"></div>
            </div>
            <div id="sec6Cards"><div class="loading-message">Cargando…</div></div>
        </div>`;

    renderSec1Filters();
    renderSec2Filters();
    renderExpBreakdownFilters();
    renderSec3Filters();
    renderSec4Filters();
    renderSec5Filters();
    renderSec6Filters();
    loadAdminAllData();
}

// ===================================================================
// ADMIN DASHBOARD — HELPERS
// ===================================================================
function buildMonthOptions(selected) {
    const names = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return names.map((n, i) => `<option value="${i+1}"${i+1 === selected ? ' selected' : ''}>${n}</option>`).join('');
}

function buildYearOptions(selected) {
    const year = new Date().getFullYear();
    let html = '';
    for (let y = year - 5; y <= year + 1; y++) {
        html += `<option value="${y}"${y === selected ? ' selected' : ''}>${y}</option>`;
    }
    return html;
}

function renderComparisonIndicator(current, previous) {
    const pct = previous === 0 ? (current === 0 ? 0 : 100) : ((current - previous) / previous * 100);
    const rounded = Math.round(pct * 10) / 10;
    if (rounded > 0) return `<span class="stat-card-change up">&#x25B2; ${rounded}%</span>`;
    if (rounded < 0) return `<span class="stat-card-change down">&#x25BC; ${Math.abs(rounded)}%</span>`;
    return `<span class="stat-card-change neutral">— 0%</span>`;
}

const MONTH_NAMES_FULL = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function criteriaPeriod(mFrom, yFrom, mTo, yTo) {
    return `Periodo: ${MONTH_NAMES_FULL[mFrom - 1]} ${yFrom} – ${MONTH_NAMES_FULL[mTo - 1]} ${yTo}`;
}

function criteriaUser(userId) {
    const name = userId === 0 ? 'Todos' : (adminUsers.find(u => u.id === userId)?.name || 'Todos');
    return `Usuario: ${name}`;
}

function criteriaMonth(m, y) {
    return `Mes: ${MONTH_NAMES_FULL[m - 1]} ${y}`;
}

function showEmptyState(containerId) {
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = '<div class="empty-state">Sin informaci&oacute;n para mostrar</div>';
}

function updateSec1Criteria() {
    const el = document.getElementById('sec1Criteria');
    if (el) el.textContent = criteriaPeriod(sec1MonthFrom, sec1YearFrom, sec1MonthTo, sec1YearTo);
}

function updateSec2Criteria() {
    const el = document.getElementById('sec2Criteria');
    if (el) el.textContent = `${criteriaUser(sec2UserId)} | ${criteriaPeriod(sec2MonthFrom, sec2YearFrom, sec2MonthTo, sec2YearTo)}`;
}

function updateExpBreakdownCriteria() {
    const el = document.getElementById('expBreakdownCriteria');
    if (el) el.textContent = `${criteriaUser(expBreakdownUserId)} | ${criteriaPeriod(expBreakdownMonthFrom, expBreakdownYearFrom, expBreakdownMonthTo, expBreakdownYearTo)}`;
}

function updateSec3Criteria() {
    const el = document.getElementById('sec3Criteria');
    if (el) el.textContent = criteriaUser(sec3UserId);
}

function updateSec4Criteria() {
    const el = document.getElementById('sec4Criteria');
    if (el) el.textContent = sec4UserId === 0 ? 'Todos' : criteriaUser(sec4UserId);
}

function updateSec5Criteria() {
    const el = document.getElementById('sec5Criteria');
    if (el) el.textContent = criteriaPeriod(sec5MonthFrom, sec5YearFrom, sec5MonthTo, sec5YearTo);
}

function updateSec6Criteria() {
    const el = document.getElementById('sec6Criteria');
    if (el) el.textContent = criteriaMonth(sec6Month, sec6Year);
}

function renderSec1Filters() {
    document.getElementById('sec1Filters').innerHTML = `
        <label>Desde
            <select id="sec1MonthFrom">${buildMonthOptions(sec1MonthFrom)}</select>
            <select id="sec1YearFrom">${buildYearOptions(sec1YearFrom)}</select>
        </label>
        <label id="sec1RangeTo">Hasta
            <select id="sec1MonthTo">${buildMonthOptions(sec1MonthTo)}</select>
            <select id="sec1YearTo">${buildYearOptions(sec1YearTo)}</select>
        </label>
        <button class="btn-primary" onclick="window.handleApplySec1()">Actualizar</button>`;
    updateSec1Criteria();
}

function renderSec2Filters() {
    document.getElementById('sec2Filters').innerHTML = `
        <label>Usuario
            <select id="sec2UserSelect"><option value="0">Todos</option></select>
        </label>
        <label>Desde
            <select id="sec2MonthFrom">${buildMonthOptions(sec2MonthFrom)}</select>
            <select id="sec2YearFrom">${buildYearOptions(sec2YearFrom)}</select>
        </label>
        <label id="sec2RangeTo">Hasta
            <select id="sec2MonthTo">${buildMonthOptions(sec2MonthTo)}</select>
            <select id="sec2YearTo">${buildYearOptions(sec2YearTo)}</select>
        </label>
        <button class="btn-primary" onclick="window.handleApplySec2()">Actualizar</button>`;
    populateUserSelect('sec2UserSelect', sec2UserId);
    updateSec2Criteria();
}

function renderSec3Filters() {
    document.getElementById('sec3Filters').innerHTML = `
        <label>Usuario
            <select id="sec3UserSelect"><option value="0">Todos</option></select>
        </label>
        <button class="btn-primary" onclick="window.handleApplySec3()">Actualizar</button>`;
    populateUserSelect('sec3UserSelect', sec3UserId);
    updateSec3Criteria();
}

function renderSec4Filters() {
    document.getElementById('sec4Filters').innerHTML = `
        <label>Usuario
            <select id="sec4UserSelect"><option value="0">Todos</option></select>
        </label>
        <button class="btn-primary" onclick="window.handleApplySec4()">Actualizar</button>`;
    populateUserSelect('sec4UserSelect', sec4UserId);
    updateSec4Criteria();
}

function renderSec5Filters() {
    document.getElementById('sec5Filters').innerHTML = `
        <label>Desde
            <select id="sec5MonthFrom">${buildMonthOptions(sec5MonthFrom)}</select>
            <select id="sec5YearFrom">${buildYearOptions(sec5YearFrom)}</select>
        </label>
        <label id="sec5RangeTo">Hasta
            <select id="sec5MonthTo">${buildMonthOptions(sec5MonthTo)}</select>
            <select id="sec5YearTo">${buildYearOptions(sec5YearTo)}</select>
        </label>
        <button class="btn-primary" onclick="window.handleApplySec5()">Actualizar</button>`;
    updateSec5Criteria();
}

function renderSec6Filters() {
    document.getElementById('sec6Filters').innerHTML = `
        <label>Mes
            <select id="sec6Month">${buildMonthOptions(sec6Month)}</select>
            <select id="sec6Year">${buildYearOptions(sec6Year)}</select>
        </label>
        <button class="btn-primary" onclick="window.handleApplySec6()">Actualizar</button>`;
    updateSec6Criteria();
}

function populateUserSelect(selectId, selectedValue, defaultLabel) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    sel.innerHTML = `<option value="0">${defaultLabel || 'Todos'}</option>`;
    adminUsers.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.id;
        opt.textContent = u.name || u.email;
        sel.appendChild(opt);
    });
    sel.value = selectedValue;
}

// ===================================================================
// EXPENSE BREAKDOWN — CATEGORY & SUBCATEGORY PIE CHARTS
// ===================================================================
function renderExpBreakdownFilters() {
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    document.getElementById('expBreakdownFilters').innerHTML = `
        <label>Usuario
            <select id="expBreakdownUser"><option value="0">Todos</option></select>
        </label>
        <label>Desde
            <select id="expBreakdownMonthFrom">${buildMonthOptions(expBreakdownMonthFrom)}</select>
            <select id="expBreakdownYearFrom">${buildYearOptions(expBreakdownYearFrom)}</select>
        </label>
        <label>Hasta
            <select id="expBreakdownMonthTo">${buildMonthOptions(expBreakdownMonthTo)}</select>
            <select id="expBreakdownYearTo">${buildYearOptions(expBreakdownYearTo)}</select>
        </label>
        <button class="btn-primary" onclick="window.handleApplyExpBreakdown()">Actualizar</button>`;
    populateUserSelect('expBreakdownUser', expBreakdownUserId);
    updateExpBreakdownCriteria();
}

function handleApplyExpBreakdown() {
    expBreakdownUserId = parseInt(document.getElementById('expBreakdownUser').value);
    expBreakdownMonthFrom = parseInt(document.getElementById('expBreakdownMonthFrom').value);
    expBreakdownYearFrom = parseInt(document.getElementById('expBreakdownYearFrom').value);
    expBreakdownMonthTo = parseInt(document.getElementById('expBreakdownMonthTo').value);
    expBreakdownYearTo = parseInt(document.getElementById('expBreakdownYearTo').value);
    if (expBreakdownYearTo < expBreakdownYearFrom || (expBreakdownYearTo === expBreakdownYearFrom && expBreakdownMonthTo < expBreakdownMonthFrom)) {
        showToast('El periodo "Hasta" debe ser posterior o igual a "Desde"', 'error');
        return;
    }
    updateExpBreakdownCriteria();
    loadExpBreakdownData();
}

async function loadExpBreakdownData() {
    try {
        const uid = expBreakdownUserId;
        const mf = expBreakdownMonthFrom, yf = expBreakdownYearFrom;
        const mt = expBreakdownMonthTo, yt = expBreakdownYearTo;
        const catExpenses = await apiRequest('GET', `/dashboard/admin/expenses-by-category?userId=${uid}&monthFrom=${mf}&yearFrom=${yf}&monthTo=${mt}&yearTo=${yt}`);
        adminCategoryChartData = Array.isArray(catExpenses) ? catExpenses : [];

        if (adminCategoryChartData.length === 0) {
            destroyChart('adminCategory');
            destroyChart('adminSubcategory');
            const chartsEl = document.querySelector('#secExpBreakdown .dashboard-charts');
            if (chartsEl) chartsEl.innerHTML = '<div class="empty-state">Sin informaci&oacute;n para mostrar</div>';
            return;
        }

        const chartsEl = document.querySelector('#secExpBreakdown .dashboard-charts');
        if (chartsEl && chartsEl.querySelector('.empty-state')) {
            chartsEl.innerHTML = `
                <div class="chart-card">
                    <h4 class="chart-title">Gastos por categor&iacute;a</h4>
                    <div class="chart-wrapper"><canvas id="adminCategoryChart"></canvas></div>
                </div>
                <div class="chart-card">
                    <div class="chart-header">
                        <div>
                            <h4 class="chart-title" style="margin:0">Gastos por subcategor&iacute;a</h4>
                            <span id="adminSubcategoryLabel" class="chart-sub-label"></span>
                        </div>
                        <select id="adminCategoryFilter" onchange="window.handleAdminCategoryFilterChange()">
                            <option value="">Seleccionar</option>
                        </select>
                    </div>
                    <div class="chart-wrapper"><canvas id="adminSubcategoryChart"></canvas></div>
                </div>`;
        }

        renderAdminCategoryChart(adminCategoryChartData);

        const expenseCats = cachedCategories.filter(c => c.type === 'EXPENSE');
        const catSelect = document.getElementById('adminCategoryFilter');
        if (catSelect) {
            catSelect.innerHTML = '<option value="">Seleccionar</option>';
            expenseCats.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.textContent = c.name;
                catSelect.appendChild(opt);
            });
            if (adminCategoryChartData.length > 0) {
                const highest = adminCategoryChartData.reduce((a, b) => a.total > b.total ? a : b);
                catSelect.value = highest.categoryId;
                adminCategoryFilter = highest.categoryId;
            } else {
                adminCategoryFilter = null;
            }
            updateAdminSubcategoryLabel();
            loadAdminSubcategoryChart();
        }
    } catch {
        destroyChart('adminCategory');
        destroyChart('adminSubcategory');
    }
}

function renderAdminCategoryChart(data) {
    destroyChart('adminCategory');
    adminCategoryChartData = data;
    const canvas = document.getElementById('adminCategoryChart');
    if (!canvas || !data.length) return;

    const labels = data.map(d => d.categoryName);
    const values = data.map(d => d.total);
    const colors = generateColors(data.length);

    chartAdminCategory = new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{ data: values, backgroundColor: colors, borderWidth: 0 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const idx = elements[0].index;
                    const catData = adminCategoryChartData[idx];
                    if (!catData || !catData.categoryId) return;
                    const sel = document.getElementById('adminCategoryFilter');
                    if (!sel) return;
                    const opt = sel.querySelector(`option[value="${catData.categoryId}"]`);
                    if (!opt) return;
                    sel.value = catData.categoryId;
                    adminCategoryFilter = catData.categoryId;
                    updateAdminSubcategoryLabel();
                    loadAdminSubcategoryChart();
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: getChartTextColor(), boxWidth: 12, padding: 12 }
                }
            }
        }
    });
}

async function loadAdminSubcategoryChart() {
    if (!adminCategoryFilter) {
        destroyChart('adminSubcategory');
        return;
    }
    try {
        const uid = expBreakdownUserId;
        const mf = expBreakdownMonthFrom, yf = expBreakdownYearFrom;
        const mt = expBreakdownMonthTo, yt = expBreakdownYearTo;
        const res = await apiRequest('GET',
            `/dashboard/admin/expenses-by-subcategory?userId=${uid}&categoryId=${adminCategoryFilter}&monthFrom=${mf}&yearFrom=${yf}&monthTo=${mt}&yearTo=${yt}`
        );
        renderAdminSubcategoryChart(Array.isArray(res) ? res : []);
    } catch {
        destroyChart('adminSubcategory');
    }
}

function renderAdminSubcategoryChart(data) {
    destroyChart('adminSubcategory');
    const canvas = document.getElementById('adminSubcategoryChart');
    if (!canvas || !data.length) return;

    const labels = data.map(d => d.subcategoryName);
    const values = data.map(d => d.total);
    const colors = generateColors(data.length);

    chartAdminSubcategory = new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{ data: values, backgroundColor: colors, borderWidth: 0 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: getChartTextColor(), boxWidth: 12, padding: 12 }
                }
            }
        }
    });
}

function updateAdminSubcategoryLabel() {
    const el = document.getElementById('adminSubcategoryLabel');
    if (!el) return;
    if (!adminCategoryFilter) { el.textContent = ''; return; }
    const cat = cachedCategories.find(c => c.id === adminCategoryFilter);
    el.textContent = cat ? `Categoría: ${cat.name}` : '';
}

function handleAdminCategoryFilterChange() {
    const sel = document.getElementById('adminCategoryFilter');
    if (!sel) return;
    adminCategoryFilter = sel.value ? parseInt(sel.value) : null;
    updateAdminSubcategoryLabel();
    loadAdminSubcategoryChart();
}

// ===================================================================
// ADMIN DASHBOARD — LOAD ALL
// ===================================================================
async function loadAdminAllData() {
    try {
        await ensureCategoryCache();
        if (adminUsers.length === 0) await loadAdminUsers();
        adminLastUpdate = new Date();
        updateAdminTimestamp();

        populateUserSelect('sec2UserSelect', sec2UserId);
        populateUserSelect('sec3UserSelect', sec3UserId);
        populateUserSelect('sec4UserSelect', sec4UserId);
        populateUserSelect('expBreakdownUser', expBreakdownUserId);

        const mf1 = sec1MonthFrom, yf1 = sec1YearFrom, mt1 = sec1MonthTo, yt1 = sec1YearTo;
        const mf2 = sec2MonthFrom, yf2 = sec2YearFrom, mt2 = sec2MonthTo, yt2 = sec2YearTo;
        const mf5 = sec5MonthFrom, yf5 = sec5YearFrom, mt5 = sec5MonthTo, yt5 = sec5YearTo;

        const [sec1Data, sec2Data, sec3Data, sec4Data, sec5Data, sec6Data] = await Promise.all([
            apiRequest('GET', `/dashboard/admin/user-evolution?monthFrom=${mf1}&yearFrom=${yf1}&monthTo=${mt1}&yearTo=${yt1}`),
            apiRequest('GET', `/dashboard/admin/transaction-evolution?monthFrom=${mf2}&yearFrom=${yf2}&monthTo=${mt2}&yearTo=${yt2}&userId=${sec2UserId}`),
            apiRequest('GET', `/dashboard/admin/money-movement?userId=${sec3UserId}`),
            apiRequest('GET', `/dashboard/admin/averages?userId=${sec4UserId}`),
            apiRequest('GET', `/dashboard/admin/top-users?monthFrom=${mf5}&yearFrom=${yf5}&monthTo=${mt5}&yearTo=${yt5}`),
            apiRequest('GET', `/dashboard/admin/activity-distribution?month=${sec6Month}&year=${sec6Year}`)
        ]);

        renderSec1(sec1Data);
        renderSec2(sec2Data);
        renderSec3(sec3Data);
        renderSec4(sec4Data);
        renderSec5(sec5Data);
        renderSec6(sec6Data);
        loadExpBreakdownData();
    } catch (err) {
        showToast('Error al cargar datos del panel', 'error');
    }
}

async function loadAdminUsers() {
    try {
        const res = await apiRequest('GET', '/admin/users?role=USER&status=ACTIVE&size=100&sort=name,asc');
        adminUsers = res?.content || [];
    } catch {}
}

function updateAdminTimestamp() {
    const el = document.getElementById('adminDashboardTimestamp');
    if (!el || !adminLastUpdate) return;
    const d = adminLastUpdate;
    const pad = n => String(n).padStart(2, '0');
    el.textContent = `Última actualización: ${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// ===================================================================
// SECTION 1 — EVOLUCIÓN DE USUARIOS
// ===================================================================
function handleApplySec1() {
    sec1MonthFrom = parseInt(document.getElementById('sec1MonthFrom').value);
    sec1YearFrom = parseInt(document.getElementById('sec1YearFrom').value);
    sec1MonthTo = parseInt(document.getElementById('sec1MonthTo').value);
    sec1YearTo = parseInt(document.getElementById('sec1YearTo').value);
    if (sec1YearTo < sec1YearFrom || (sec1YearTo === sec1YearFrom && sec1MonthTo < sec1MonthFrom)) {
        showToast('El periodo "Hasta" debe ser posterior o igual a "Desde"', 'error');
        return;
    }
    updateSec1Criteria();
    loadSec1Data();
}

async function loadSec1Data() {
    try {
        const data = await apiRequest('GET', `/dashboard/admin/user-evolution?monthFrom=${sec1MonthFrom}&yearFrom=${sec1YearFrom}&monthTo=${sec1MonthTo}&yearTo=${sec1YearTo}`);
        renderSec1(data);
    } catch { document.getElementById('sec1Cards').innerHTML = '<div class="error-message">Error al cargar</div>'; }
}

function renderSec1(data) {
    if (!data) return;
    const monthly = data.monthly || [];
    const hasData = monthly.some(d => d.activeUsers > 0 || d.registeredUsers > 0);
    if (!hasData) {
        destroyChart('userGrowth');
        showEmptyState('sec1Cards');
        return;
    }
    const s = data.summary;
    document.getElementById('sec1Cards').innerHTML = `
        <div class="stat-card">
            <span class="stat-card-label">Usuarios activos</span>
            <span class="stat-card-value">${Number(s.activeUsers.current).toLocaleString('es-ES')}</span>
            ${renderComparisonIndicator(s.activeUsers.current, s.activeUsers.previous)}
        </div>
        <div class="stat-card">
            <span class="stat-card-label">Registrados</span>
            <span class="stat-card-value">${Number(s.registeredUsers.current).toLocaleString('es-ES')}</span>
            ${renderComparisonIndicator(s.registeredUsers.current, s.registeredUsers.previous)}
        </div>`;

    renderSec1Chart(monthly);
}

function renderSec1Chart(monthly) {
    const canvas = document.getElementById('sec1Chart');
    if (!canvas) return;
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const labels = monthly.map(d => months[d.month - 1] + ' ' + d.year);
    const textColor = getChartTextColor();
    const gridColor = getChartGridColor();

    if (chartUserGrowth) {
        chartUserGrowth.data.labels = labels;
        chartUserGrowth.data.datasets[0].data = monthly.map(d => d.activeUsers);
        chartUserGrowth.data.datasets[1].data = monthly.map(d => d.registeredUsers);
        chartUserGrowth.options.scales.x.ticks.color = textColor;
        chartUserGrowth.options.scales.x.grid.color = gridColor;
        chartUserGrowth.options.scales.y.ticks.color = textColor;
        chartUserGrowth.options.scales.y.grid.color = gridColor;
        chartUserGrowth.options.plugins.legend.labels.color = textColor;
        chartUserGrowth.update();
    } else {
        chartUserGrowth = new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels,
                datasets: [
                    { label: 'Activos', data: monthly.map(d => d.activeUsers), borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.06)', fill: false, tension: 0.3, pointRadius: 3 },
                    { label: 'Registrados', data: monthly.map(d => d.registeredUsers), borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.06)', fill: false, tension: 0.3, pointRadius: 3 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: true,
                plugins: { legend: { position: 'bottom', labels: { color: textColor, boxWidth: 12, padding: 12 } } },
                scales: {
                    x: { ticks: { color: textColor }, grid: { color: gridColor } },
                    y: { ticks: { color: textColor }, grid: { color: gridColor }, beginAtZero: true }
                }
            }
        });
    }
}

// ===================================================================
// SECTION 2 — EVOLUCIÓN DE TRANSACCIONES
// ===================================================================
function handleApplySec2() {
    sec2UserId = parseInt(document.getElementById('sec2UserSelect').value);
    sec2MonthFrom = parseInt(document.getElementById('sec2MonthFrom').value);
    sec2YearFrom = parseInt(document.getElementById('sec2YearFrom').value);
    sec2MonthTo = parseInt(document.getElementById('sec2MonthTo').value);
    sec2YearTo = parseInt(document.getElementById('sec2YearTo').value);
    if (sec2YearTo < sec2YearFrom || (sec2YearTo === sec2YearFrom && sec2MonthTo < sec2MonthFrom)) {
        showToast('El periodo "Hasta" debe ser posterior o igual a "Desde"', 'error');
        return;
    }
    updateSec2Criteria();
    loadSec2Data();
}

async function loadSec2Data() {
    try {
        const data = await apiRequest('GET', `/dashboard/admin/transaction-evolution?monthFrom=${sec2MonthFrom}&yearFrom=${sec2YearFrom}&monthTo=${sec2MonthTo}&yearTo=${sec2YearTo}&userId=${sec2UserId}`);
        renderSec2(data);
    } catch { document.getElementById('sec2Cards').innerHTML = '<div class="error-message">Error al cargar</div>'; }
}

function renderSec2(data) {
    if (!data) return;
    const monthly = data.monthly || [];
    const hasData = monthly.some(d => d.txCount > 0 || Number(d.incomeTotal) > 0 || Number(d.expenseTotal) > 0);
    if (!hasData) {
        destroyChart('incomeVsExpense');
        showEmptyState('sec2Cards');
        return;
    }
    const s = data.summary;
    document.getElementById('sec2Cards').innerHTML = `
        <div class="stat-card">
            <span class="stat-card-label">Transacciones / mes</span>
            <span class="stat-card-value">${Number(s.transactionsPerMonth.current).toLocaleString('es-ES')}</span>
            ${renderComparisonIndicator(s.transactionsPerMonth.current, s.transactionsPerMonth.previous)}
        </div>
        <div class="stat-card">
            <span class="stat-card-label">Promedio / usuario</span>
            <span class="stat-card-value">${Number(s.avgPerUser.current).toLocaleString('es-ES', {minimumFractionDigits:1,maximumFractionDigits:1})}</span>
            ${renderComparisonIndicator(s.avgPerUser.current, s.avgPerUser.previous)}
        </div>`;

    renderSec2Chart(monthly);
}

function renderSec2Chart(monthly) {
    const canvasTx = document.getElementById('sec2Chart');
    if (!canvasTx) return;
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const labels = monthly.map(d => months[d.month - 1] + ' ' + d.year);
    const textColor = getChartTextColor();
    const gridColor = getChartGridColor();

    if (chartIncomeVsExpense) {
        chartIncomeVsExpense.data.labels = labels;
        chartIncomeVsExpense.data.datasets[0].data = monthly.map(d => Number(d.incomeTotal));
        chartIncomeVsExpense.data.datasets[1].data = monthly.map(d => Number(d.expenseTotal));
        chartIncomeVsExpense.options.scales.x.ticks.color = textColor;
        chartIncomeVsExpense.options.scales.x.grid.color = gridColor;
        chartIncomeVsExpense.options.scales.y.ticks.color = textColor;
        chartIncomeVsExpense.options.scales.y.grid.color = gridColor;
        chartIncomeVsExpense.options.plugins.legend.labels.color = textColor;
        chartIncomeVsExpense.update();
    } else {
        chartIncomeVsExpense = new Chart(canvasTx.getContext('2d'), {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    { label: 'Ingresos', data: monthly.map(d => Number(d.incomeTotal)), backgroundColor: 'rgba(5,150,105,0.7)', borderRadius: 4 },
                    { label: 'Gastos', data: monthly.map(d => Number(d.expenseTotal)), backgroundColor: 'rgba(220,38,38,0.7)', borderRadius: 4 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: true,
                plugins: { legend: { position: 'bottom', labels: { color: textColor, boxWidth: 12, padding: 12 } } },
                scales: {
                    x: { ticks: { color: textColor }, grid: { color: gridColor } },
                    y: { ticks: { color: textColor }, grid: { color: gridColor }, beginAtZero: true }
                }
            }
        });
    }
}

// ===================================================================
// SECTION 3 — MOVIMIENTOS DE DINERO
// ===================================================================
function handleApplySec3() {
    sec3UserId = parseInt(document.getElementById('sec3UserSelect').value);
    updateSec3Criteria();
    loadSec3Data();
}

async function loadSec3Data() {
    try {
        const data = await apiRequest('GET', `/dashboard/admin/money-movement?userId=${sec3UserId}`);
        renderSec3(data);
    } catch { document.getElementById('sec3Cards').innerHTML = '<div class="error-message">Error al cargar</div>'; }
}

function renderSec3(data) {
    if (!data) return;
    const hasData = Number(data.totalIncome) > 0 || Number(data.totalExpense) > 0;
    if (!hasData) {
        showEmptyState('sec3Cards');
        return;
    }
    document.getElementById('sec3Cards').innerHTML = `
        <div class="money-card">
            <span class="money-card-label">Total Income</span>
            <span class="money-card-value income">${formatMoney(data.totalIncome)}</span>
        </div>
        <div class="money-card">
            <span class="money-card-label">Total Expense</span>
            <span class="money-card-value expense">${formatMoney(data.totalExpense)}</span>
        </div>
        <div class="money-card">
            <span class="money-card-label">Total Balance</span>
            <span class="money-card-value" style="color:${Number(data.totalBalance) >= 0 ? 'var(--income)' : 'var(--expense)'}">${formatMoney(data.totalBalance)}</span>
        </div>`;
}

// ===================================================================
// SECTION 4 — PROMEDIOS
// ===================================================================
function handleApplySec4() {
    sec4UserId = parseInt(document.getElementById('sec4UserSelect').value);
    updateSec4Criteria();
    loadSec4Data();
}

async function loadSec4Data() {
    try {
        const data = await apiRequest('GET', `/dashboard/admin/averages?userId=${sec4UserId}`);
        renderSec4(data);
    } catch { document.getElementById('sec4Cards').innerHTML = '<div class="error-message">Error al cargar</div>'; }
}

function renderSec4(data) {
    if (!data) return;
    const hasData = Number(data.globalAvgIncomePerUser) > 0 || Number(data.globalAvgExpensePerUser) > 0 || Number(data.globalAvgTransactionsPerUser) > 0;
    if (!hasData) {
        showEmptyState('sec4Cards');
        return;
    }
    let html = `
        <div class="avg-card">
            <span class="avg-card-label">Avg Income / usuario</span>
            <span class="avg-card-value income">${formatMoney(data.globalAvgIncomePerUser)}</span>
        </div>
        <div class="avg-card">
            <span class="avg-card-label">Avg Expense / usuario</span>
            <span class="avg-card-value expense">${formatMoney(data.globalAvgExpensePerUser)}</span>
        </div>
        <div class="avg-card">
            <span class="avg-card-label">Avg Transacciones / usuario</span>
            <span class="avg-card-value">${Number(data.globalAvgTransactionsPerUser).toLocaleString('es-ES', {minimumFractionDigits:1,maximumFractionDigits:1})}</span>
        </div>`;

    if (data.filteredAvgIncome !== null && data.filteredAvgExpense !== null) {
        html += `
            <div class="avg-card-divider"></div>
            <div class="avg-card">
                <span class="avg-card-label">Avg Income (filtrado)</span>
                <span class="avg-card-value income">${formatMoney(data.filteredAvgIncome)}</span>
            </div>
            <div class="avg-card">
                <span class="avg-card-label">Avg Expense (filtrado)</span>
                <span class="avg-card-value expense">${formatMoney(data.filteredAvgExpense)}</span>
            </div>`;
    }

    document.getElementById('sec4Cards').innerHTML = html;
}

// ===================================================================
// SECTION 5 — TOP USUARIOS
// ===================================================================
function handleApplySec5() {
    sec5MonthFrom = parseInt(document.getElementById('sec5MonthFrom').value);
    sec5YearFrom = parseInt(document.getElementById('sec5YearFrom').value);
    sec5MonthTo = parseInt(document.getElementById('sec5MonthTo').value);
    sec5YearTo = parseInt(document.getElementById('sec5YearTo').value);
    if (sec5YearTo < sec5YearFrom || (sec5YearTo === sec5YearFrom && sec5MonthTo < sec5MonthFrom)) {
        showToast('El periodo "Hasta" debe ser posterior o igual a "Desde"', 'error');
        return;
    }
    updateSec5Criteria();
    loadSec5Data();
}

async function loadSec5Data() {
    try {
        const data = await apiRequest('GET', `/dashboard/admin/top-users?monthFrom=${sec5MonthFrom}&yearFrom=${sec5YearFrom}&monthTo=${sec5MonthTo}&yearTo=${sec5YearTo}`);
        renderSec5(data);
    } catch { document.getElementById('sec5Cards').innerHTML = '<div class="error-message">Error al cargar</div>'; }
}

function renderSec5(data) {
    if (!data) return;
    const txList = data.topByTransactions || [];
    const expList = data.topByExpenses || [];
    const incList = data.topByIncome || [];
    const hasData = txList.length > 0 || expList.length > 0 || incList.length > 0;
    if (!hasData) {
        showEmptyState('sec5Cards');
        return;
    }
    document.getElementById('sec5Cards').innerHTML = `
        <div class="mini-table-card">
            <h4>Top Transacciones</h4>
            ${buildMiniTable(txList)}
        </div>
        <div class="mini-table-card">
            <h4>Top Gastos</h4>
            ${buildMiniTable(expList, true)}
        </div>
        <div class="mini-table-card">
            <h4>Top Ingresos</h4>
            ${buildMiniTable(incList, true)}
        </div>`;
}

function buildMiniTable(entries, isMoney) {
    if (!entries.length) return '<p style="font-size:0.8rem;color:var(--text-secondary)">Sin datos</p>';
    let html = '<table class="mini-table"><thead><tr><th>#</th><th>Usuario</th><th style="text-align:right">Valor</th></tr></thead><tbody>';
    entries.forEach((e, i) => {
        const val = isMoney ? formatMoney(e.value) : Number(e.value).toLocaleString('es-ES');
        html += `<tr><td class="rank">${i + 1}</td><td class="user-name">${escHtml(e.userName)}</td><td class="user-value">${val}</td></tr>`;
    });
    html += '</tbody></table>';
    return html;
}

// ===================================================================
// SECTION 6 — DISTRIBUCIÓN POR ACTIVIDAD
// ===================================================================
function handleApplySec6() {
    sec6Month = parseInt(document.getElementById('sec6Month').value);
    sec6Year = parseInt(document.getElementById('sec6Year').value);
    updateSec6Criteria();
    loadSec6Data();
}

async function loadSec6Data() {
    try {
        const data = await apiRequest('GET', `/dashboard/admin/activity-distribution?month=${sec6Month}&year=${sec6Year}`);
        renderSec6(data);
    } catch { document.getElementById('sec6Cards').innerHTML = '<div class="error-message">Error al cargar</div>'; }
}

function renderSec6(data) {
    if (!data) return;
    const cats = [
        { key: 'frecuente', label: 'Frecuente', desc: '>20 tx', cls: 'frecuente' },
        { key: 'regular', label: 'Regular', desc: '5–20 tx', cls: 'regular' },
        { key: 'ocasional', label: 'Ocasional', desc: '1–4 tx', cls: 'ocasional' },
        { key: 'inactivo', label: 'Inactivo', desc: '0 tx', cls: 'inactivo' }
    ];
    const hasData = cats.some(c => (data[c.key]?.count || 0) > 0);
    if (!hasData) {
        showEmptyState('sec6Cards');
        return;
    }
    let html = '<div class="activity-bars">';
    cats.forEach(c => {
        const cat = data[c.key] || { count: 0, percentage: 0 };
        html += `
            <div class="activity-row">
                <span class="activity-label">${c.label}</span>
                <div class="activity-bar"><div class="activity-bar-fill ${c.cls}" style="width:${cat.percentage}%"></div></div>
                <span class="activity-percent">${cat.percentage}%</span>
                <span class="activity-count">(${cat.count})</span>
            </div>`;
    });
    html += '</div>';
    html += `<div class="activity-legend">
        <span class="activity-legend-item"><span class="activity-dot frecuente"></span> Frecuente: m&aacute;s de 20 transacciones</span>
        <span class="activity-legend-item"><span class="activity-dot regular"></span> Regular: 5–20 transacciones</span>
        <span class="activity-legend-item"><span class="activity-dot ocasional"></span> Ocasional: 1–4 transacciones</span>
        <span class="activity-legend-item"><span class="activity-dot inactivo"></span> Inactivo: 0 transacciones (registrados en el mes)</span>
    </div>`;
    document.getElementById('sec6Cards').innerHTML = html;
}

// ===================================================================
// TRANSACTIONS SECTION
// ===================================================================
async function renderTransactionsSection() {
    txPage = 0;
    txAdminUserId = 0;

    if (isAdmin()) {
        if (adminUsers.length === 0) await loadAdminUsers();
        document.getElementById('dashContent').innerHTML = `
            <div class="section-header">
                <h2>Transacciones</h2>
            </div>
            <div class="admin-section-filters" style="margin-bottom:16px">
                <label>Usuario
                    <select id="txAdminUserSelect" onchange="window.handleTxAdminUserChange()">
                        <option value="0">Seleccionar...</option>
                    </select>
                </label>
            </div>
            <div class="table-scroll">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Categor&iacute;a</th>
                            <th>Subcategor&iacute;a</th>
                            <th>Descripci&oacute;n</th>
                            <th>Monto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="txBody">
                        <tr><td colspan="6" class="empty-state">Seleccion&aacute; un usuario para ver sus transacciones</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination" id="txPagination"></div>`;
        populateUserSelect('txAdminUserSelect', txAdminUserId, 'Seleccionar...');
    } else {
        document.getElementById('dashContent').innerHTML = `
            <div class="section-header">
                <h2>Transacciones</h2>
                <p>${getMonthLabel()}</p>
            </div>
            <div class="section-actions">
                <button class="btn-primary" onclick="window.showTxForm()">+ Nueva transacci&oacute;n</button>
            </div>
            <div class="table-scroll">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Categor&iacute;a</th>
                            <th>Subcategor&iacute;a</th>
                            <th>Descripci&oacute;n</th>
                            <th>Monto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="txBody">
                        <tr><td colspan="6" class="empty-state">Cargando…</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination" id="txPagination"></div>`;
        loadTransactionsData();
    }
}

async function loadTransactionsData() {
    try {
        let url = `/transactions/date-range?page=${txPage}&size=20&sort=transactionDate,desc`;
        if (isAdmin() && txAdminUserId > 0) {
            url += `&userId=${txAdminUserId}`;
        } else {
            const md = getMonthDates();
            url += `&from=${md.from}&to=${md.to}`;
        }
        const res = await apiRequest('GET', url);
        txTransactions = res?.content || [];
        txPagination = res?.pagination || null;

        renderTxTable();
        renderTxPagination();
    } catch (err) {
        document.getElementById('txBody').innerHTML =
            `<tr><td colspan="6" class="empty-state">Error: ${escHtml(err.message)}</td></tr>`;
    }
}

function renderTxTable() {
    const tbody = document.getElementById('txBody');
    if (!txTransactions.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No hay transacciones en este per&iacute;odo</td></tr>';
        return;
    }
    const admin = isAdmin();
    tbody.innerHTML = txTransactions.map(tx => {
        const type = getCategoryType(tx.categoryId);
        return `<tr>
            <td>${formatDate(tx.transactionDate)}</td>
            <td>${escHtml(tx.categoryName || '—')}</td>
            <td>${escHtml(tx.subcategoryName || '—')}</td>
            <td>${escHtml(tx.description || '—')}</td>
            <td class="amount ${type === 'INCOME' ? 'income' : 'expense'}">${formatMoney(tx.amount)}</td>
            <td class="actions-cell">
                ${admin
                    ? `<button class="btn-icon btn-icon-danger" onclick="window.deleteTx(${tx.id})" title="Eliminar">&#x2715;</button>`
                    : `<button class="btn-icon" onclick="window.editTx(${tx.id})" title="Editar">&#x270E;</button>
                       <button class="btn-icon btn-icon-danger" onclick="window.deleteTx(${tx.id})" title="Eliminar">&#x2715;</button>`
                }
            </td>
        </tr>`;
    }).join('');
}

function renderTxPagination() {
    const el = document.getElementById('txPagination');
    if (!txPagination || txPagination.totalPages <= 1) {
        el.innerHTML = '';
        return;
    }
    el.innerHTML = buildPaginationHtml(txPagination, 'window.changeTxPage');
}

function changeTxPage(page) {
    txPage = page;
    loadTransactionsData();
}

function handleTxAdminUserChange() {
    const sel = document.getElementById('txAdminUserSelect');
    if (!sel) return;
    txAdminUserId = parseInt(sel.value);
    txPage = 0;
    if (txAdminUserId > 0) {
        loadTransactionsData();
    } else {
        txTransactions = [];
        txPagination = null;
        renderTxTable();
        renderTxPagination();
    }
}

// ---- Transaction CRUD ----
async function showTxForm(txId) {
    await ensureCategoryCache();

    const tx = txId ? txTransactions.find(t => t.id === txId) : null;

    const today = new Date().toISOString().split('T')[0];

    const catOptions = cachedCategories.map(c =>
        `<option value="${c.id}"${tx?.categoryId === c.id ? ' selected' : ''}>${escHtml(c.name)}</option>`
    ).join('');

    let subOptions = '';
    if (tx) {
        const subs = await fetchSubcategoriesByCategory(tx.categoryId);
        subOptions = subs.map(s =>
            `<option value="${s.id}"${tx.subcategoryId === s.id ? ' selected' : ''}>${escHtml(s.name)}</option>`
        ).join('');
    }

    showModal({
        title: tx ? 'Editar transaccion' : 'Nueva transaccion',
        bodyHtml: `
            <form id="txForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="txCategory">Categor&iacute;a</label>
                        <select id="txCategory" required>
                            <option value="">Seleccionar</option>
                            ${catOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="txSubcategory">Subcategor&iacute;a</label>
                        <select id="txSubcategory" required>
                            <option value="">Seleccionar</option>
                            ${subOptions}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="txAmount">Monto</label>
                        <input type="number" id="txAmount" step="0.01" min="0.01" required placeholder="0.00" value="${tx ? tx.amount : ''}">
                    </div>
                    <div class="form-group">
                        <label for="txDate">Fecha</label>
                        <input type="date" id="txDate" required value="${tx ? tx.transactionDate : today}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="txDesc">Descripci&oacute;n (opcional)</label>
                    <input type="text" id="txDesc" placeholder="Descripci&oacute;n" value="${tx ? escHtml(tx.description || '') : ''}">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="window.hideModal()">Cancelar</button>
                    <button type="submit" class="btn-primary">${tx ? 'Guardar cambios' : 'Crear transacci&oacute;n'}</button>
                </div>
                <p class="form-error" id="txFormError"></p>
            </form>`
    });

    const catSelect = document.getElementById('txCategory');
    const subcatSelect = document.getElementById('txSubcategory');

    const updateSubs = async () => {
        const catId = parseInt(catSelect.value);
        subcatSelect.innerHTML = '<option value="">Cargando…</option>';
        if (!catId) {
            subcatSelect.innerHTML = '<option value="">Seleccionar</option>';
            return;
        }
        const subs = await fetchSubcategoriesByCategory(catId);
        subcatSelect.innerHTML = '<option value="">Seleccionar</option>';
        subs.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            if (tx?.subcategoryId === s.id && tx.categoryId === catId) opt.selected = true;
            subcatSelect.appendChild(opt);
        });
    };

    catSelect.addEventListener('change', updateSubs);
    if (!tx) updateSubs();

    document.getElementById('txForm').addEventListener('submit', handleTxSubmit);
}

async function handleTxSubmit(e) {
    e.preventDefault();
    const errorEl = document.getElementById('txFormError');
    errorEl.textContent = '';
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Guardando…';

    const payload = {
        amount: parseFloat(document.getElementById('txAmount').value),
        categoryId: parseInt(document.getElementById('txCategory').value),
        subcategoryId: parseInt(document.getElementById('txSubcategory').value),
        description: document.getElementById('txDesc').value.trim(),
        transactionDate: document.getElementById('txDate').value
    };

    const isEdit = !!window.__editingTxId;

    try {
        if (isEdit) {
            await apiRequest('PUT', `/transactions/${window.__editingTxId}`, payload);
        } else {
            await apiRequest('POST', '/transactions', payload);
        }
        hideModal();
        window.__editingTxId = null;
        txPage = 0;
        showToast('Transaccion guardada correctamente', 'success');
        await loadTransactionsData();
        await refreshDashboardIfActive();
    } catch (err) {
        errorEl.textContent = err.message;
    } finally {
        btn.disabled = false;
        btn.textContent = isEdit ? 'Guardar cambios' : 'Crear transaccion';
    }
}

async function editTx(id) {
    window.__editingTxId = id;
    await showTxForm(id);
}

function deleteTx(id) {
    showConfirm('Eliminar esta transaccion?', async () => {
        try {
            await apiRequest('DELETE', `/transactions/${id}`);
            showToast('Transaccion eliminada', 'success');
            txPage = 0;
            await loadTransactionsData();
            await refreshDashboardIfActive();
        } catch (err) {
            showToast(err.message, 'error');
        }
    });
}

// ===================================================================
// SUBCATEGORIES SECTION
// ===================================================================
function renderSubcategoriesSection() {
    subPage = 0;

    document.getElementById('dashContent').innerHTML = `
        <div class="section-header">
            <h2>Subcategor&iacute;as</h2>
            <p>Gesti&oacute;n de subcategor&iacute;as</p>
        </div>
        <div class="section-actions">
            <button class="btn-primary" onclick="window.showSubForm()">+ Nueva subcategor&iacute;a</button>
        </div>
        <div class="table-scroll">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Categor&iacute;a</th>
                        <th>Comentarios</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="subBody">
                    <tr><td colspan="4" class="empty-state">Cargando…</td></tr>
                </tbody>
            </table>
        </div>
        <div class="pagination" id="subPagination"></div>`;

    loadSubcategoriesData();
}

async function loadSubcategoriesData() {
    try {
        const res = await apiRequest(
            'GET',
            `/subcategories?page=${subPage}&size=20&sort=name,asc`
        );
        subSubcategories = res?.content || [];
        subPagination = res?.pagination || null;

        renderSubTable();
        renderSubPagination();
    } catch (err) {
        document.getElementById('subBody').innerHTML =
            `<tr><td colspan="4" class="empty-state">Error: ${escHtml(err.message)}</td></tr>`;
    }
}

function renderSubTable() {
    const tbody = document.getElementById('subBody');
    if (!subSubcategories.length) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No hay subcategor&iacute;as</td></tr>';
        return;
    }
    tbody.innerHTML = subSubcategories.map(s =>
        `<tr>
            <td>${escHtml(s.name)}</td>
            <td>${escHtml(s.categoryName || getCategoryName(s.categoryId))}</td>
            <td>${escHtml(s.comments || '—')}</td>
            <td class="actions-cell">
                <button class="btn-icon" onclick="window.editSub(${s.id})" title="Editar">&#x270E;</button>
                <button class="btn-icon btn-icon-danger" onclick="window.deleteSub(${s.id})" title="Eliminar">&#x2715;</button>
            </td>
        </tr>`
    ).join('');
}

function renderSubPagination() {
    const el = document.getElementById('subPagination');
    if (!subPagination || subPagination.totalPages <= 1) {
        el.innerHTML = '';
        return;
    }
    el.innerHTML = buildPaginationHtml(subPagination, 'window.changeSubPage');
}

function changeSubPage(page) {
    subPage = page;
    loadSubcategoriesData();
}

// ---- Subcategory CRUD ----
async function showSubForm(subId) {
    await ensureCategoryCache();

    const sub = subId ? subSubcategories.find(s => s.id === subId) : null;

    const catOptions = cachedCategories.map(c =>
        `<option value="${c.id}"${sub?.categoryId === c.id ? ' selected' : ''}>${escHtml(c.name)}</option>`
    ).join('');

    showModal({
        title: sub ? 'Editar subcategoria' : 'Nueva subcategoria',
        bodyHtml: `
            <form id="subForm">
                <div class="form-group">
                    <label for="subName">Nombre</label>
                    <input type="text" id="subName" required placeholder="Nombre de la subcategor&iacute;a" value="${sub ? escHtml(sub.name) : ''}">
                </div>
                <div class="form-group">
                    <label for="subCategory">Categor&iacute;a</label>
                    <select id="subCategory" required>
                        <option value="">Seleccionar</option>
                        ${catOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label for="subComments">Comentarios (opcional)</label>
                    <textarea id="subComments" placeholder="Comentarios">${sub ? escHtml(sub.comments || '') : ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="window.hideModal()">Cancelar</button>
                    <button type="submit" class="btn-primary">${sub ? 'Guardar cambios' : 'Crear subcategor&iacute;a'}</button>
                </div>
                <p class="form-error" id="subFormError"></p>
            </form>`
    });

    document.getElementById('subForm').addEventListener('submit', handleSubSubmit);
}

async function handleSubSubmit(e) {
    e.preventDefault();
    const errorEl = document.getElementById('subFormError');
    errorEl.textContent = '';
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Guardando…';

    const payload = {
        name: document.getElementById('subName').value.trim(),
        categoryId: parseInt(document.getElementById('subCategory').value)
    };
    const comments = document.getElementById('subComments').value.trim();
    if (comments) payload.comments = comments;

    try {
        if (window.__editingSubId) {
            await apiRequest('PUT', `/subcategories/${window.__editingSubId}`, payload);
        } else {
            await apiRequest('POST', '/subcategories', payload);
        }
        hideModal();
        window.__editingSubId = null;
        subPage = 0;
        showToast('Subcategoria guardada correctamente', 'success');
        await loadSubcategoriesData();
    } catch (err) {
        errorEl.textContent = err.message;
    } finally {
        btn.disabled = false;
        btn.textContent = window.__editingSubId ? 'Guardar cambios' : 'Crear subcategor&iacute;a';
    }
}

async function editSub(id) {
    window.__editingSubId = id;
    await showSubForm(id);
}

function deleteSub(id) {
    showConfirm('Eliminar esta subcategoria?', async () => {
        try {
            await apiRequest('DELETE', `/subcategories/${id}`);
            showToast('Subcategoria eliminada', 'success');
            subPage = 0;
            await loadSubcategoriesData();
        } catch (err) {
            showToast(err.message, 'error');
        }
    });
}

// ===================================================================
// CATEGORIES SECTION
// ===================================================================
function renderCategoriesSection() {
    catPage = 0;

    document.getElementById('dashContent').innerHTML = `
        <div class="section-header">
            <h2>Categor&iacute;as</h2>
            <p>Listado de categor&iacute;as activas</p>
        </div>
        <div class="table-scroll">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                    </tr>
                </thead>
                <tbody id="catBody">
                    <tr><td colspan="2" class="empty-state">Cargando…</td></tr>
                </tbody>
            </table>
        </div>
        <div class="pagination" id="catPagination"></div>`;

    loadCategoriesData();
}

async function loadCategoriesData() {
    try {
        const res = await apiRequest(
            'GET',
            `/categories?page=${catPage}&size=20&sort=name,asc`
        );
        catCategories = res?.content || [];
        catPagination = res?.pagination || null;

        renderCatTable();
        renderCatPagination();
    } catch (err) {
        document.getElementById('catBody').innerHTML =
            `<tr><td colspan="2" class="empty-state">Error: ${escHtml(err.message)}</td></tr>`;
    }
}

function renderCatTable() {
    const tbody = document.getElementById('catBody');
    if (!catCategories.length) {
        tbody.innerHTML = '<tr><td colspan="2" class="empty-state">No hay categor&iacute;as</td></tr>';
        return;
    }
    tbody.innerHTML = catCategories.map(c => {
        const isIncome = c.type === 'INCOME';
        return `<tr>
            <td>${escHtml(c.name)}</td>
            <td><span class="badge ${isIncome ? 'badge-income' : 'badge-expense'}">${isIncome ? 'Ingreso' : 'Gasto'}</span></td>
        </tr>`;
    }).join('');
}

function renderCatPagination() {
    const el = document.getElementById('catPagination');
    if (!catPagination || catPagination.totalPages <= 1) {
        el.innerHTML = '';
        return;
    }
    el.innerHTML = buildPaginationHtml(catPagination, 'window.changeCatPage');
}

function changeCatPage(page) {
    catPage = page;
    loadCategoriesData();
}

// ===================================================================
// PAGINATION HELPER
// ===================================================================
function buildPaginationHtml(pagination, handlerFn) {
    const { currentPage, totalPages, first, last } = pagination;
    let html = '';
    html += `<button class="btn-page" onclick="${handlerFn}(${currentPage - 1})" ${first ? 'disabled' : ''}>Anterior</button>`;
    const start = Math.max(0, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);
    for (let i = start; i <= end; i++) {
        html += `<button class="btn-page${i === currentPage ? ' btn-page-active' : ''}" onclick="${handlerFn}(${i})">${i + 1}</button>`;
    }
    html += `<button class="btn-page" onclick="${handlerFn}(${currentPage + 1})" ${last ? 'disabled' : ''}>Siguiente</button>`;
    return html;
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
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;

window.showTxForm = showTxForm;
window.editTx = editTx;
window.deleteTx = deleteTx;
window.changeTxPage = changeTxPage;
window.handleTxAdminUserChange = handleTxAdminUserChange;

window.showSubForm = showSubForm;
window.editSub = editSub;
window.deleteSub = deleteSub;
window.changeSubPage = changeSubPage;

window.changeCatPage = changeCatPage;
window.handleFilterChange = handleFilterChange;
window.handleCategoryFilterChange = handleCategoryFilterChange;
window.refreshDashboardIfActive = refreshDashboardIfActive;

window.hideModal = hideModal;

function refreshChartTheme() {
    const textColor = getChartTextColor();
    const gridColor = getChartGridColor();

    [chartCategory, chartSubcategory, chartBalance, chartUserGrowth, chartIncomeVsExpense, chartAdminCategory, chartAdminSubcategory].forEach(chart => {
        if (!chart) return;

        const legendLabels = chart.options.plugins?.legend?.labels;
        if (legendLabels) legendLabels.color = textColor;

        const scales = chart.options.scales;
        if (scales) {
            Object.values(scales).forEach(scale => {
                if (scale.ticks) scale.ticks.color = textColor;
                if (scale.grid && scale.grid.display !== false) {
                    scale.grid.color = gridColor;
                }
            });
        }

        chart.update('none');
    });
}
window.refreshChartTheme = refreshChartTheme;
window.handleApplySec1 = handleApplySec1;
window.handleApplySec2 = handleApplySec2;
window.handleApplySec3 = handleApplySec3;
window.handleApplySec4 = handleApplySec4;
window.handleApplySec5 = handleApplySec5;
window.handleApplySec6 = handleApplySec6;
window.handleApplyExpBreakdown = handleApplyExpBreakdown;
window.handleAdminCategoryFilterChange = handleAdminCategoryFilterChange;
