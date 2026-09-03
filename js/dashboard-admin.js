// ===================================================================
// ADMIN DASHBOARD
// ===================================================================
function renderAdminDashboardSection() {
    destroyChart('userGrowth');
    destroyChart('incomeVsExpense');
    destroyChart('adminCategory');
    destroyChart('adminSubcategory');

    document.getElementById('dashContent').innerHTML = `
        <div class="section-header">
            <h2>Panel de Administraci&oacute;n</h2>
            <p id="adminDashboardTimestamp" style="font-size:0.75rem;color:var(--text-secondary);margin-top:4px;"></p>
        </div>

        <div class="admin-hero-cards" id="adminHeroCards">
            <div class="admin-hero-card"><div class="skeleton skeleton-text"></div></div>
            <div class="admin-hero-card"><div class="skeleton skeleton-text"></div></div>
            <div class="admin-hero-card"><div class="skeleton skeleton-text"></div></div>
            <div class="admin-hero-card"><div class="skeleton skeleton-text"></div></div>
        </div>

        <div class="admin-accordion" id="adminAccordion">
            <div class="accordion-item open" data-accordion="sec1">
                <button class="accordion-header" onclick="window.toggleAccordion('sec1')" aria-expanded="true">
                    <span class="accordion-title">Evoluci&oacute;n de Usuarios</span>
                    <span class="accordion-chevron">&#x25BC;</span>
                </button>
                <div class="accordion-panel">
                    <p class="admin-section-criteria" id="sec1Criteria"></p>
                    <div class="admin-section-filters" id="sec1Filters"></div>
                    <div class="stat-cards" id="sec1Cards">
                        <div class="stat-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                        <div class="stat-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                    </div>
                    <div class="chart-card" style="margin-top:12px"><div class="chart-wrapper"><canvas id="sec1Chart" role="img" aria-label="Gráfico de evolución de usuarios"></canvas></div></div>
                </div>
            </div>

            <div class="accordion-item" data-accordion="sec2">
                <button class="accordion-header" onclick="window.toggleAccordion('sec2')" aria-expanded="false">
                    <span class="accordion-title">Evoluci&oacute;n de Transacciones</span>
                    <span class="accordion-chevron">&#x25BC;</span>
                </button>
                <div class="accordion-panel">
                    <p class="admin-section-criteria" id="sec2Criteria"></p>
                    <div class="admin-section-filters" id="sec2Filters"></div>
                    <div class="stat-cards" id="sec2Cards">
                        <div class="stat-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                        <div class="stat-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                    </div>
                    <div class="chart-card" style="margin-top:12px"><div class="chart-wrapper"><canvas id="sec2Chart" role="img" aria-label="Gráfico de evolución de transacciones"></canvas></div></div>
                </div>
            </div>

            <div class="accordion-item" data-accordion="sec5">
                <button class="accordion-header" onclick="window.toggleAccordion('sec5')" aria-expanded="false">
                    <span class="accordion-title">Usuarios con Mayor Actividad</span>
                    <span class="accordion-chevron">&#x25BC;</span>
                </button>
                <div class="accordion-panel">
                    <p class="admin-section-criteria" id="sec5Criteria"></p>
                    <div class="admin-section-filters" id="sec5Filters"></div>
                    <div class="mini-tables" id="sec5Cards">
                        <div class="mini-table-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                        <div class="mini-table-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                        <div class="mini-table-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                    </div>
                </div>
            </div>

            <div class="accordion-item" data-accordion="sec6">
                <button class="accordion-header" onclick="window.toggleAccordion('sec6')" aria-expanded="false">
                    <span class="accordion-title">Distribuci&oacute;n de Usuarios por Actividad</span>
                    <span class="accordion-chevron">&#x25BC;</span>
                </button>
                <div class="accordion-panel">
                    <p class="admin-section-criteria" id="sec6Criteria"></p>
                    <div class="admin-section-filters" id="sec6Filters"></div>
                    <div id="sec6Cards"><div class="loading-message">Cargando…</div></div>
                </div>
            </div>

            <div class="accordion-item" data-accordion="secExpBreakdown">
                <button class="accordion-header" onclick="window.toggleAccordion('secExpBreakdown')" aria-expanded="false">
                    <span class="accordion-title">Desglose de Gastos</span>
                    <span class="accordion-chevron">&#x25BC;</span>
                </button>
                <div class="accordion-panel">
                    <p class="admin-section-criteria" id="expBreakdownCriteria"></p>
                    <div class="admin-section-filters" id="expBreakdownFilters"></div>
                    <div class="dashboard-charts">
                        <div class="chart-card">
                            <p class="chart-title">Gastos por categor&iacute;a</p>
                            <div class="chart-wrapper"><canvas id="adminCategoryChart" role="img" aria-label="Gráfico de gastos por categoría"></canvas></div>
                        </div>
                        <div class="chart-card">
                            <div class="chart-header">
                                <div>
                                    <p class="chart-title" style="margin:0">Gastos por subcategor&iacute;a</p>
                                    <span id="adminSubcategoryLabel" class="chart-sub-label"></span>
                                </div>
                                <select id="adminCategoryFilter" onchange="window.handleAdminCategoryFilterChange()">
                                    <option value="">Seleccionar</option>
                                </select>
                            </div>
                            <div class="chart-wrapper"><canvas id="adminSubcategoryChart" role="img" aria-label="Gráfico de gastos por subcategoría"></canvas></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="accordion-item" data-accordion="sec3">
                <button class="accordion-header" onclick="window.toggleAccordion('sec3')" aria-expanded="false">
                    <span class="accordion-title">Movimientos de Dinero</span>
                    <span class="accordion-chevron">&#x25BC;</span>
                </button>
                <div class="accordion-panel">
                    <p class="admin-section-criteria" id="sec3Criteria"></p>
                    <div class="admin-section-filters" id="sec3Filters"></div>
                    <div class="money-cards" id="sec3Cards">
                        <div class="money-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                        <div class="money-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                        <div class="money-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                    </div>
                </div>
            </div>

            <div class="accordion-item" data-accordion="sec4">
                <button class="accordion-header" onclick="window.toggleAccordion('sec4')" aria-expanded="false">
                    <span class="accordion-title">Promedios</span>
                    <span class="accordion-chevron">&#x25BC;</span>
                </button>
                <div class="accordion-panel">
                    <p class="admin-section-criteria" id="sec4Criteria"></p>
                    <div class="admin-section-filters" id="sec4Filters"></div>
                    <div class="averages-grid" id="sec4Cards">
                        <div class="avg-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                        <div class="avg-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                        <div class="avg-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                    </div>
                </div>
            </div>
        </div>`;

    document.querySelectorAll('.accordion-panel').forEach(panel => {
        const wrapper = document.createElement('div');
        wrapper.className = 'accordion-content';
        wrapper.innerHTML = panel.innerHTML;
        panel.innerHTML = '';
        panel.appendChild(wrapper);
    });

    renderSec1Filters();
    renderSec2Filters();
    renderExpBreakdownFilters();
    renderSec3Filters();
    renderSec4Filters();
    renderSec5Filters();
    renderSec6Filters();
    loadAdminAllData();
}

function toggleAccordion(sectionId) {
    const item = document.querySelector(`[data-accordion="${sectionId}"]`);
    if (!item) return;
    const wasOpen = item.classList.contains('open');
    item.classList.toggle('open');
    const btn = item.querySelector('.accordion-header');
    if (btn) btn.setAttribute('aria-expanded', !wasOpen);
}

window.toggleAccordion = toggleAccordion;

// ===================================================================
// ADMIN DASHBOARD — HELPERS
// ===================================================================
function buildMonthOptions(selected) {
    return MONTH_NAMES_SHORT.map((n, i) => `<option value="${i+1}"${i+1 === selected ? ' selected' : ''}>${n}</option>`).join('');
}

function buildYearOptions(selected) {
    const year = new Date().getFullYear();
    let html = '';
    for (let y = year - 5; y <= year + 1; y++) {
        html += `<option value="${y}"${y === selected ? ' selected' : ''}>${y}</option>`;
    }
    return html;
}

function getMaxMonthValue() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function buildMonthInput(id, year, month) {
    return `<input type="month" id="${id}" value="${year}-${String(month).padStart(2, '0')}" max="${getMaxMonthValue()}">`;
}

function initMonthPicker(selector, year, month, onChange) {
    flatpickr(selector, {
        plugins: [new monthSelectPlugin({ shorthand: true, dateFormat: 'Y-m', altInput: true, altFormat: 'F Y' })],
        defaultDate: `${year}-${String(month).padStart(2, '0')}`,
        maxDate: new Date(),
        onChange: onChange
    });
}

function getMonthPickerValue(selector) {
    const el = document.querySelector(selector);
    if (el && el._flatpickr && el._flatpickr.selectedDates[0]) {
        return el._flatpickr.formatDate(el._flatpickr.selectedDates[0], 'Y-m');
    }
    return el?.value || '';
}

function renderComparisonIndicator(current, previous) {
    const pct = previous === 0 ? (current === 0 ? 0 : 100) : ((current - previous) / previous * 100);
    const rounded = Math.round(pct * 10) / 10;
    if (rounded > 0) return `<span class="stat-card-change up" aria-hidden="true">&#x25B2; ${rounded}%</span>`;
    if (rounded < 0) return `<span class="stat-card-change down" aria-hidden="true">&#x25BC; ${Math.abs(rounded)}%</span>`;
    return `<span class="stat-card-change neutral">— 0%</span>`;
}

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
        <label>Desde ${buildMonthInput('sec1MonthFrom', sec1YearFrom, sec1MonthFrom)}</label>
        <label>Hasta ${buildMonthInput('sec1MonthTo', sec1YearTo, sec1MonthTo)}</label>
        <button class="btn-primary" onclick="window.handleApplySec1()">Actualizar</button>`;
    updateSec1Criteria();
    initMonthPicker('#sec1MonthFrom', sec1YearFrom, sec1MonthFrom, function() {});
    initMonthPicker('#sec1MonthTo', sec1YearTo, sec1MonthTo, function() {});
}

function renderSec2Filters() {
    document.getElementById('sec2Filters').innerHTML = `
        <label>Usuario
            <select id="sec2UserSelect"><option value="0">Todos</option></select>
        </label>
        <label>Desde ${buildMonthInput('sec2MonthFrom', sec2YearFrom, sec2MonthFrom)}</label>
        <label>Hasta ${buildMonthInput('sec2MonthTo', sec2YearTo, sec2MonthTo)}</label>
        <button class="btn-primary" onclick="window.handleApplySec2()">Actualizar</button>`;
    populateUserSelect('sec2UserSelect', sec2UserId);
    updateSec2Criteria();
    initMonthPicker('#sec2MonthFrom', sec2YearFrom, sec2MonthFrom, function() {});
    initMonthPicker('#sec2MonthTo', sec2YearTo, sec2MonthTo, function() {});
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
        <label>Desde ${buildMonthInput('sec5MonthFrom', sec5YearFrom, sec5MonthFrom)}</label>
        <label>Hasta ${buildMonthInput('sec5MonthTo', sec5YearTo, sec5MonthTo)}</label>
        <button class="btn-primary" onclick="window.handleApplySec5()">Actualizar</button>`;
    updateSec5Criteria();
    initMonthPicker('#sec5MonthFrom', sec5YearFrom, sec5MonthFrom, function() {});
    initMonthPicker('#sec5MonthTo', sec5YearTo, sec5MonthTo, function() {});
}

function renderSec6Filters() {
    document.getElementById('sec6Filters').innerHTML = `
        <label>Mes ${buildMonthInput('sec6Month', sec6Year, sec6Month)}</label>
        <button class="btn-primary" onclick="window.handleApplySec6()">Actualizar</button>`;
    updateSec6Criteria();
    initMonthPicker('#sec6Month', sec6Year, sec6Month, function() {});
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
    document.getElementById('expBreakdownFilters').innerHTML = `
        <label>Usuario
            <select id="expBreakdownUser"><option value="0">Todos</option></select>
        </label>
        <label>Desde ${buildMonthInput('expBreakdownMonthFrom', expBreakdownYearFrom, expBreakdownMonthFrom)}</label>
        <label>Hasta ${buildMonthInput('expBreakdownMonthTo', expBreakdownYearTo, expBreakdownMonthTo)}</label>
        <button class="btn-primary" onclick="window.handleApplyExpBreakdown()">Actualizar</button>`;
    populateUserSelect('expBreakdownUser', expBreakdownUserId);
    updateExpBreakdownCriteria();
    initMonthPicker('#expBreakdownMonthFrom', expBreakdownYearFrom, expBreakdownMonthFrom, function() {});
    initMonthPicker('#expBreakdownMonthTo', expBreakdownYearTo, expBreakdownMonthTo, function() {});
}

function handleApplyExpBreakdown() {
    expBreakdownUserId = parseInt(document.getElementById('expBreakdownUser').value);
    const from = getMonthPickerValue('#expBreakdownMonthFrom').split('-');
    const to = getMonthPickerValue('#expBreakdownMonthTo').split('-');
    expBreakdownYearFrom = parseInt(from[0]); expBreakdownMonthFrom = parseInt(from[1]);
    expBreakdownYearTo = parseInt(to[0]); expBreakdownMonthTo = parseInt(to[1]);
    const periodErr = validatePeriod(expBreakdownYearFrom, expBreakdownMonthFrom, expBreakdownYearTo, expBreakdownMonthTo); if (periodErr) { showToast(periodErr, "error"); return; }
    updateExpBreakdownCriteria();
    loadExpBreakdownData();
}

async function loadExpBreakdownData(catExpenses) {
    try {
        if (!catExpenses) {
            const uid = expBreakdownUserId;
            const mf = expBreakdownMonthFrom, yf = expBreakdownYearFrom;
            const mt = expBreakdownMonthTo, yt = expBreakdownYearTo;
            catExpenses = await apiRequest('GET', `/dashboard/admin/expenses-by-category?userId=${uid}&monthFrom=${mf}&yearFrom=${yf}&monthTo=${mt}&yearTo=${yt}`);
        }
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
                    <p class="chart-title">Gastos por categor&iacute;a</p>
                    <div class="chart-wrapper"><canvas id="adminCategoryChart" role="img" aria-label="Gráfico de gastos por categoría"></canvas></div>
                </div>
                <div class="chart-card">
                    <div class="chart-header">
                        <div>
                            <p class="chart-title" style="margin:0">Gastos por subcategor&iacute;a</p>
                            <span id="adminSubcategoryLabel" class="chart-sub-label"></span>
                        </div>
                        <select id="adminCategoryFilter" onchange="window.handleAdminCategoryFilterChange()">
                            <option value="">Seleccionar</option>
                        </select>
                    </div>
                    <div class="chart-wrapper"><canvas id="adminSubcategoryChart" role="img" aria-label="Gráfico de gastos por subcategoría"></canvas></div>
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

    const onClick = (event, elements) => {
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
    };

    chartAdminCategory = createDoughnutChart('adminCategoryChart', data.map(d => d.categoryName), data.map(d => d.total), onClick);
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

    chartAdminSubcategory = createDoughnutChart('adminSubcategoryChart', data.map(d => d.subcategoryName), data.map(d => d.total));
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
        const mfExp = expBreakdownMonthFrom, yfExp = expBreakdownYearFrom;
        const mtExp = expBreakdownMonthTo, ytExp = expBreakdownYearTo;

        const [sec1Data, sec2Data, sec3Data, sec4Data, sec5Data, sec6Data, expBreakdownData] = await Promise.all([
            apiRequest('GET', `/dashboard/admin/user-evolution?monthFrom=${mf1}&yearFrom=${yf1}&monthTo=${mt1}&yearTo=${yt1}`),
            apiRequest('GET', `/dashboard/admin/transaction-evolution?monthFrom=${mf2}&yearFrom=${yf2}&monthTo=${mt2}&yearTo=${yt2}&userId=${sec2UserId}`),
            apiRequest('GET', `/dashboard/admin/money-movement?userId=${sec3UserId}`),
            apiRequest('GET', `/dashboard/admin/averages?userId=${sec4UserId}`),
            apiRequest('GET', `/dashboard/admin/top-users?monthFrom=${mf5}&yearFrom=${yf5}&monthTo=${mt5}&yearTo=${yt5}`),
            apiRequest('GET', `/dashboard/admin/activity-distribution?month=${sec6Month}&year=${sec6Year}`),
            apiRequest('GET', `/dashboard/admin/expenses-by-category?userId=${expBreakdownUserId}&monthFrom=${mfExp}&yearFrom=${yfExp}&monthTo=${mtExp}&yearTo=${ytExp}`)
        ]);

        renderAdminHeroCards({ sec1Data, sec2Data, sec3Data, sec4Data, sec5Data, sec6Data, expBreakdownData });
        renderSec1(sec1Data);
        renderSec2(sec2Data);
        renderSec3(sec3Data);
        renderSec4(sec4Data);
        renderSec5(sec5Data);
        renderSec6(sec6Data);
        loadExpBreakdownData(expBreakdownData);
    } catch (err) {
        showToast('Error al cargar datos del panel', 'error');
        ['sec1Cards','sec2Cards','sec3Cards','sec4Cards','sec5Cards','sec6Cards'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '<div class="error-message">Error al cargar datos</div>';
        });
    }
}

function renderAdminHeroCards(allData) {
    const el = document.getElementById('adminHeroCards');
    if (!el) return;

    const sec1 = allData.sec1Data;
    const sec3 = allData.sec3Data;
    const sec4 = allData.sec4Data;

    const activeUsers = sec1?.summary?.activeUsers?.current ?? '—';
    const totalIncome = sec3?.totalIncome != null ? formatMoney(sec3.totalIncome) : '—';
    const totalExpense = sec3?.totalExpense != null ? formatMoney(sec3.totalExpense) : '—';
    const avgIncome = sec4?.globalAvgIncomePerUser != null ? formatMoney(sec4.globalAvgIncomePerUser) : '—';

    el.innerHTML = `
        <div class="admin-hero-card">
            <span class="admin-hero-label">Usuarios activos</span>
            <span class="admin-hero-value">${Number(activeUsers).toLocaleString('es-ES')}</span>
        </div>
        <div class="admin-hero-card income">
            <span class="admin-hero-label">Ingresos totales</span>
            <span class="admin-hero-value">${totalIncome}</span>
        </div>
        <div class="admin-hero-card expense">
            <span class="admin-hero-label">Gastos totales</span>
            <span class="admin-hero-value">${totalExpense}</span>
        </div>
        <div class="admin-hero-card">
            <span class="admin-hero-label">Ingreso promedio / usuario</span>
            <span class="admin-hero-value">${avgIncome}</span>
        </div>`;
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
    const from = getMonthPickerValue('#sec1MonthFrom').split('-');
    const to = getMonthPickerValue('#sec1MonthTo').split('-');
    sec1YearFrom = parseInt(from[0]); sec1MonthFrom = parseInt(from[1]);
    sec1YearTo = parseInt(to[0]); sec1MonthTo = parseInt(to[1]);
    const periodErr = validatePeriod(sec1YearFrom, sec1MonthFrom, sec1YearTo, sec1MonthTo); if (periodErr) { showToast(periodErr, "error"); return; }
    updateSec1Criteria();
    loadSec1Data();
}

async function loadSec1Data() {
    try {
        const data = await apiRequest('GET', `/dashboard/admin/user-evolution?monthFrom=${sec1MonthFrom}&yearFrom=${sec1YearFrom}&monthTo=${sec1MonthTo}&yearTo=${sec1YearTo}`);
        renderSec1(data);
    } catch { destroyChart('userGrowth'); document.getElementById('sec1Cards').innerHTML = '<div class="error-message">Error al cargar</div>'; }
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
    const labels = monthly.map(d => MONTH_NAMES_SHORT[d.month - 1] + ' ' + d.year);
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
    const from = getMonthPickerValue('#sec2MonthFrom').split('-');
    const to = getMonthPickerValue('#sec2MonthTo').split('-');
    sec2YearFrom = parseInt(from[0]); sec2MonthFrom = parseInt(from[1]);
    sec2YearTo = parseInt(to[0]); sec2MonthTo = parseInt(to[1]);
    const periodErr = validatePeriod(sec2YearFrom, sec2MonthFrom, sec2YearTo, sec2MonthTo); if (periodErr) { showToast(periodErr, "error"); return; }
    updateSec2Criteria();
    loadSec2Data();
}

async function loadSec2Data() {
    try {
        const data = await apiRequest('GET', `/dashboard/admin/transaction-evolution?monthFrom=${sec2MonthFrom}&yearFrom=${sec2YearFrom}&monthTo=${sec2MonthTo}&yearTo=${sec2YearTo}&userId=${sec2UserId}`);
        renderSec2(data);
    } catch { destroyChart('incomeVsExpense'); document.getElementById('sec2Cards').innerHTML = '<div class="error-message">Error al cargar</div>'; }
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
    const labels = monthly.map(d => MONTH_NAMES_SHORT[d.month - 1] + ' ' + d.year);
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
            <span class="money-card-label">Ingresos totales</span>
            <span class="money-card-value income">${formatMoney(data.totalIncome)}</span>
        </div>
        <div class="money-card">
            <span class="money-card-label">Gastos totales</span>
            <span class="money-card-value expense">${formatMoney(data.totalExpense)}</span>
        </div>
        <div class="money-card">
            <span class="money-card-label">Balance total</span>
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
            <span class="avg-card-label">Ingreso promedio / usuario</span>
            <span class="avg-card-value income">${formatMoney(data.globalAvgIncomePerUser)}</span>
        </div>
        <div class="avg-card">
            <span class="avg-card-label">Gasto promedio / usuario</span>
            <span class="avg-card-value expense">${formatMoney(data.globalAvgExpensePerUser)}</span>
        </div>
        <div class="avg-card">
            <span class="avg-card-label">Transacciones promedio / usuario</span>
            <span class="avg-card-value">${Number(data.globalAvgTransactionsPerUser).toLocaleString('es-ES', {minimumFractionDigits:1,maximumFractionDigits:1})}</span>
        </div>`;

    if (data.filteredAvgIncome !== null && data.filteredAvgExpense !== null) {
        html += `
            <div class="avg-card-divider"></div>
            <div class="avg-card">
                <span class="avg-card-label">Ingreso promedio (filtrado)</span>
                <span class="avg-card-value income">${formatMoney(data.filteredAvgIncome)}</span>
            </div>
            <div class="avg-card">
                <span class="avg-card-label">Gasto promedio (filtrado)</span>
                <span class="avg-card-value expense">${formatMoney(data.filteredAvgExpense)}</span>
            </div>`;
    }

    document.getElementById('sec4Cards').innerHTML = html;
}

// ===================================================================
// SECTION 5 — TOP USUARIOS
// ===================================================================
function handleApplySec5() {
    const from = getMonthPickerValue('#sec5MonthFrom').split('-');
    const to = getMonthPickerValue('#sec5MonthTo').split('-');
    sec5YearFrom = parseInt(from[0]); sec5MonthFrom = parseInt(from[1]);
    sec5YearTo = parseInt(to[0]); sec5MonthTo = parseInt(to[1]);
    const periodErr = validatePeriod(sec5YearFrom, sec5MonthFrom, sec5YearTo, sec5MonthTo); if (periodErr) { showToast(periodErr, "error"); return; }
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
            <p style="font-weight:600;margin-bottom:8px">Top Transacciones</p>
            ${buildMiniTable(txList)}
        </div>
        <div class="mini-table-card">
            <p style="font-weight:600;margin-bottom:8px">Top Gastos</p>
            ${buildMiniTable(expList, true)}
        </div>
        <div class="mini-table-card">
            <p style="font-weight:600;margin-bottom:8px">Top Ingresos</p>
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
    const val = getMonthPickerValue('#sec6Month').split('-');
    sec6Year = parseInt(val[0]); sec6Month = parseInt(val[1]);
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
                <div class="activity-bar"><div class="activity-bar-fill ${c.cls}" style="transform:scaleX(${cat.percentage / 100})"></div></div>
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

window.handleApplySec1 = handleApplySec1;
window.handleApplySec2 = handleApplySec2;
window.handleApplySec3 = handleApplySec3;
window.handleApplySec4 = handleApplySec4;
window.handleApplySec5 = handleApplySec5;
window.handleApplySec6 = handleApplySec6;
window.handleApplyExpBreakdown = handleApplyExpBreakdown;
window.handleAdminCategoryFilterChange = handleAdminCategoryFilterChange;
