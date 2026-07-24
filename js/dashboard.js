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

// Subcategories section
let subPage = 0;
let subSubcategories = [];
let subPagination = null;

// Categories section
let catPage = 0;
let catCategories = [];
let catPagination = null;

// Admin section
let adminPeriodMode = 'month';
let adminMonthFrom = new Date().getMonth() + 1;
let adminYearFrom = new Date().getFullYear();
let adminMonthTo = new Date().getMonth() + 1;
let adminYearTo = new Date().getFullYear();
let adminUserId = 0;
let adminUsers = [];
let adminCategoryFilter = null;
let chartAdminCategory = null;
let chartAdminSubcategory = null;
let chartAdminAvgIncome = null;
let chartAdminAvgExpense = null;
let adminCategoryChartData = [];
let adminLastUpdate = null;

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
    else if (ref === 'adminCategory' && chartAdminCategory) { chartAdminCategory.destroy(); chartAdminCategory = null; }
    else if (ref === 'adminSubcategory' && chartAdminSubcategory) { chartAdminSubcategory.destroy(); chartAdminSubcategory = null; }
    else if (ref === 'adminAvgIncome' && chartAdminAvgIncome) { chartAdminAvgIncome.destroy(); chartAdminAvgIncome = null; }
    else if (ref === 'adminAvgExpense' && chartAdminAvgExpense) { chartAdminAvgExpense.destroy(); chartAdminAvgExpense = null; }
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
    const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const monthOptionsFrom = months.map((name, i) =>
        `<option value="${i+1}"${adminMonthFrom === i+1 ? ' selected' : ''}>${name}</option>`
    ).join('');
    const monthOptionsTo = months.map((name, i) =>
        `<option value="${i+1}"${adminMonthTo === i+1 ? ' selected' : ''}>${name}</option>`
    ).join('');
    const yearOptionsFrom = [];
    for (let y = adminYearFrom - 5; y <= adminYearFrom + 1; y++) {
        yearOptionsFrom.push(`<option value="${y}"${adminYearFrom === y ? ' selected' : ''}>${y}</option>`);
    }
    const yearOptionsTo = [];
    for (let y = adminYearTo - 5; y <= adminYearTo + 1; y++) {
        yearOptionsTo.push(`<option value="${y}"${adminYearTo === y ? ' selected' : ''}>${y}</option>`);
    }

    document.getElementById('dashContent').innerHTML = `
        <div class="section-header-row">
            <div class="section-header">
                <h2>Panel de Administraci&oacute;n</h2>
                <p id="adminDashboardSubtitle"></p>
                <p id="adminDashboardTimestamp" style="font-size:0.75rem;color:var(--text-secondary);margin-top:4px;"></p>
            </div>
            <div class="filter-section">
                <div class="filter-controls" id="adminFilters">
                <label>Periodo
                    <select id="adminPeriodType" onchange="window.handleAdminPeriodToggle()">
                        <option value="month">Mes</option>
                        <option value="range">Rango</option>
                    </select>
                </label>
                <label>Desde
                    <select id="adminMonthFrom">${monthOptionsFrom}</select>
                    <select id="adminYearFrom">${yearOptionsFrom}</select>
                </label>
                <span id="adminRangeTo" style="display:none">
                    <label>Hasta
                        <select id="adminMonthTo">${monthOptionsTo}</select>
                        <select id="adminYearTo">${yearOptionsTo}</select>
                    </label>
                </span>
                <label>Usuario
                    <select id="adminUserSelect">
                        <option value="0">Todos</option>
                    </select>
                </label>
                <button class="btn-primary" onclick="window.handleAdminApplyFilters()">Actualizar</button>
            </div>
            </div>
        </div>
        <div class="summary-cards" id="adminStats">
            <div class="summary-card">
                <span class="summary-label">Usuarios activos</span>
                <span class="summary-value" id="adminUsersValue">—</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Transacciones registradas</span>
                <span class="summary-value" id="adminTxValue">—</span>
            </div>
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
            <div class="chart-card">
                <h4 class="chart-title">Promedio mensual ingresos</h4>
                <div class="chart-wrapper"><canvas id="adminAvgIncomeChart"></canvas></div>
            </div>
            <div class="chart-card">
                <h4 class="chart-title">Promedio mensual gastos</h4>
                <div class="chart-wrapper"><canvas id="adminAvgExpenseChart"></canvas></div>
            </div>
        </div>`;

    loadAdminData();
}

async function loadAdminUsers() {
    try {
        const res = await apiRequest('GET', '/admin/users?role=USER&status=ACTIVE&size=100&sort=name,asc');
        adminUsers = res?.content || [];
        const sel = document.getElementById('adminUserSelect');
        if (!sel) return;
        sel.innerHTML = '<option value="0">Todos</option>';
        adminUsers.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.id;
            opt.textContent = u.name || u.email;
            sel.appendChild(opt);
        });
        sel.value = adminUserId;
    } catch {}
}

async function loadAdminData() {
    try {
        await ensureCategoryCache();

        if (adminUsers.length === 0) {
            await loadAdminUsers();
        }

        const statsEl = document.getElementById('adminUsersValue');
        if (statsEl && statsEl.textContent === '—') {
            const stats = await apiRequest('GET', '/dashboard/admin/stats');
            renderAdminStats(stats);
        }

        const userId = adminUserId;
        const mf = adminMonthFrom, yf = adminYearFrom;
        const mt = adminPeriodMode === 'month' ? mf : adminMonthTo;
        const yt = adminPeriodMode === 'month' ? yf : adminYearTo;

        const params = `userId=${userId}&monthFrom=${mf}&yearFrom=${yf}&monthTo=${mt}&yearTo=${yt}`;
        const expenseCats = cachedCategories.filter(c => c.type === 'EXPENSE');

        const [catExpenses, avgIncome, avgExpense] = await Promise.all([
            apiRequest('GET', `/dashboard/admin/expenses-by-category?${params}`),
            apiRequest('GET', `/dashboard/admin/avg-income?userId=${userId}`),
            apiRequest('GET', `/dashboard/admin/avg-expense?userId=${userId}`)
        ]);

        updateAdminTitle(userId, mf, yf, mt, yt);
        adminLastUpdate = new Date();
        updateAdminTimestamp();

        adminCategoryChartData = Array.isArray(catExpenses) ? catExpenses : [];
        renderAdminCategoryChart(adminCategoryChartData);

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
            await loadAdminSubcategoryChart();
        }

        renderAdminAvgIncomeChart(Array.isArray(avgIncome) ? avgIncome : []);
        renderAdminAvgExpenseChart(Array.isArray(avgExpense) ? avgExpense : []);
    } catch (err) {
        const s = document.getElementById('adminDashboardSubtitle');
        if (s && s.closest('#dashContent')) {
            showToast('Error al cargar datos del panel', 'error');
        }
    }
}

function renderAdminStats(stats) {
    const usersEl = document.getElementById('adminUsersValue');
    const txEl = document.getElementById('adminTxValue');
    if (stats) {
        if (usersEl) usersEl.textContent = Number(stats.totalUsers).toLocaleString('es-ES');
        if (txEl) txEl.textContent = Number(stats.totalTransactions).toLocaleString('es-ES');
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
        const userId = adminUserId;
        const mf = adminMonthFrom, yf = adminYearFrom;
        const mt = adminPeriodMode === 'month' ? mf : adminMonthTo;
        const yt = adminPeriodMode === 'month' ? yf : adminYearTo;

        const res = await apiRequest(
            'GET',
            `/dashboard/admin/expenses-by-subcategory?userId=${userId}&categoryId=${adminCategoryFilter}&monthFrom=${mf}&yearFrom=${yf}&monthTo=${mt}&yearTo=${yt}`
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

function renderAdminAvgIncomeChart(data) {
    destroyChart('adminAvgIncome');
    const canvas = document.getElementById('adminAvgIncomeChart');
    if (!canvas || !data.length) return;

    const sorted = [...data].sort((a, b) => a.year - b.year || a.month - b.month);
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const labels = sorted.map(d => months[d.month - 1] + ' ' + d.year);
    const values = sorted.map(d => d.average);
    const textColor = getChartTextColor();
    const gridColor = getChartGridColor();

    chartAdminAvgIncome = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Promedio ingresos',
                data: values,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16,185,129,0.06)',
                fill: true,
                tension: 0.3,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
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
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                }
            }
        }
    });
}

function renderAdminAvgExpenseChart(data) {
    destroyChart('adminAvgExpense');
    const canvas = document.getElementById('adminAvgExpenseChart');
    if (!canvas || !data.length) return;

    const sorted = [...data].sort((a, b) => a.year - b.year || a.month - b.month);
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const labels = sorted.map(d => months[d.month - 1] + ' ' + d.year);
    const values = sorted.map(d => d.average);
    const textColor = getChartTextColor();
    const gridColor = getChartGridColor();

    chartAdminAvgExpense = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Promedio gastos',
                data: values,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239,68,68,0.06)',
                fill: true,
                tension: 0.3,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
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
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                }
            }
        }
    });
}

function updateAdminTitle(userId, mf, yf, mt, yt) {
    const userLabel = userId === 0 ? 'Todos' : (adminUsers.find(u => u.id === userId)?.name || '—');
    const mNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const periodLabel = (mf === mt && yf === yt)
        ? `${mNames[mf-1]} ${yf}`
        : `${mNames[mf-1]} ${yf} - ${mNames[mt-1]} ${yt}`;
    const el = document.getElementById('adminDashboardSubtitle');
    if (el) el.textContent = `Usuario: ${userLabel} | Periodo: ${periodLabel}`;
}

function updateAdminTimestamp() {
    const el = document.getElementById('adminDashboardTimestamp');
    if (!el || !adminLastUpdate) return;
    const d = adminLastUpdate;
    const pad = n => String(n).padStart(2, '0');
    el.textContent = `Última actualización: ${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function updateAdminSubcategoryLabel() {
    const el = document.getElementById('adminSubcategoryLabel');
    if (!el) return;
    if (!adminCategoryFilter) {
        el.textContent = '';
        return;
    }
    const cat = cachedCategories.find(c => c.id === adminCategoryFilter);
    el.textContent = cat ? `Categoría: ${cat.name}` : '';
}

function handleAdminPeriodToggle() {
    const sel = document.getElementById('adminPeriodType');
    const rangeTo = document.getElementById('adminRangeTo');
    if (!sel || !rangeTo) return;
    rangeTo.style.display = sel.value === 'range' ? '' : 'none';
}

function handleAdminApplyFilters() {
    const periodTypeEl = document.getElementById('adminPeriodType');
    const monthFromEl = document.getElementById('adminMonthFrom');
    const yearFromEl = document.getElementById('adminYearFrom');
    const monthToEl = document.getElementById('adminMonthTo');
    const yearToEl = document.getElementById('adminYearTo');
    const userEl = document.getElementById('adminUserSelect');

    if (!periodTypeEl || !monthFromEl || !yearFromEl || !userEl) return;

    adminPeriodMode = periodTypeEl.value;
    adminMonthFrom = parseInt(monthFromEl.value);
    adminYearFrom = parseInt(yearFromEl.value);
    adminUserId = parseInt(userEl.value);

    if (adminPeriodMode === 'range') {
        if (!monthToEl || !yearToEl) return;
        adminMonthTo = parseInt(monthToEl.value);
        adminYearTo = parseInt(yearToEl.value);

        if (adminYearTo < adminYearFrom || (adminYearTo === adminYearFrom && adminMonthTo < adminMonthFrom)) {
            showToast('El periodo "Hasta" debe ser posterior o igual a "Desde"', 'error');
            return;
        }
    } else {
        adminMonthTo = adminMonthFrom;
        adminYearTo = adminYearFrom;
    }

    loadAdminData();
}

function handleAdminCategoryFilterChange() {
    const sel = document.getElementById('adminCategoryFilter');
    if (!sel) return;
    adminCategoryFilter = sel.value ? parseInt(sel.value) : null;
    updateAdminSubcategoryLabel();
    loadAdminSubcategoryChart();
}

// ===================================================================
// TRANSACTIONS SECTION
// ===================================================================
function renderTransactionsSection() {
    txPage = 0;

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
                        <th>Categoría</th>
                        <th>Subcategoría</th>
                        <th>Descripción</th>
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

async function loadTransactionsData() {
    try {
        const md = getMonthDates();
        const res = await apiRequest(
            'GET',
            `/transactions/date-range?from=${md.from}&to=${md.to}&page=${txPage}&size=20&sort=transactionDate,desc`
        );
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
    tbody.innerHTML = txTransactions.map(tx => {
        const type = getCategoryType(tx.categoryId);
        return `<tr>
            <td>${formatDate(tx.transactionDate)}</td>
            <td>${escHtml(tx.categoryName || '—')}</td>
            <td>${escHtml(tx.subcategoryName || '—')}</td>
            <td>${escHtml(tx.description || '—')}</td>
            <td class="amount ${type === 'INCOME' ? 'income' : 'expense'}">${formatMoney(tx.amount)}</td>
            <td class="actions-cell">
                <button class="btn-icon" onclick="window.editTx(${tx.id})" title="Editar">&#x270E;</button>
                <button class="btn-icon btn-icon-danger" onclick="window.deleteTx(${tx.id})" title="Eliminar">&#x2715;</button>
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

    [chartCategory, chartSubcategory, chartBalance, chartAdminCategory, chartAdminSubcategory, chartAdminAvgIncome, chartAdminAvgExpense].forEach(chart => {
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
window.handleAdminPeriodToggle = handleAdminPeriodToggle;
window.handleAdminApplyFilters = handleAdminApplyFilters;
window.handleAdminCategoryFilterChange = handleAdminCategoryFilterChange;
