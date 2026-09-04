// ===================================================================
// DASHBOARD USER SECTION
// ===================================================================
function renderDashboardSection() {
    const now = new Date();
    const maxMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    document.getElementById('dashContent').innerHTML = `
        <div class="comparison-cards" id="dashComparison" role="region" aria-label="Comparativa mensual">
            <div class="comparison-card" id="expenseComparisonCard">
                <span class="comparison-icon expense" aria-hidden="true">&darr;</span>
                <div class="comparison-content">
                    <span class="comparison-period" id="expenseComparisonPeriod"></span>
                    <span class="comparison-text" id="expenseGlossary">Cargando...</span>
                </div>
            </div>
            <div class="comparison-card" id="incomeComparisonCard">
                <span class="comparison-icon income" aria-hidden="true">&uarr;</span>
                <div class="comparison-content">
                    <span class="comparison-period" id="incomeComparisonPeriod"></span>
                    <span class="comparison-text" id="incomeGlossary">Cargando...</span>
                </div>
            </div>
        </div>
        <div class="section-header-row">
            <div class="section-header">
                <h2>Resumen financiero</h2>
                <p id="dashPeriodSubtitle">${getMonthFullName(dashMonth)} ${dashYear}</p>
            </div>
            <div class="filter-section">
                <div class="filter-controls" id="dashFilters">
                <label>Per&iacute;odo
                    <input type="text" id="dashMonthInput" class="flatpickr-input" value="${dashYear}-${String(dashMonth).padStart(2, '0')}" onchange="window.handleFilterChange()">
                </label>
            </div>
            </div>
        </div>
        <div class="summary-cards" id="dashSummary" role="group" aria-label="Resumen financiero">
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
            <div class="summary-card" id="savingRateCard">
                <span class="summary-label">Tasa de ahorro</span>
                <span class="summary-value" id="savingRateValue">0%</span>
            </div>
        </div>
        <div class="chart-card chart-card-full" style="margin-top:20px">
            <div class="chart-header">
                <p class="chart-title" style="margin:0">Balance mensual &uacute;ltimos <span id="balanceRangeLabel">${dashMonthsRange}</span> meses</p>
                <fieldset class="range-checkboxes" style="border:none;padding:0">
                    <legend class="sr-only">Rango de meses</legend>
                    <label class="range-label"><input type="radio" name="dashMonthsRange" value="3"${dashMonthsRange === 3 ? ' checked' : ''} onchange="window.handleRangeChange(3)"> 3m</label>
                    <label class="range-label"><input type="radio" name="dashMonthsRange" value="6"${dashMonthsRange === 6 ? ' checked' : ''} onchange="window.handleRangeChange(6)"> 6m</label>
                    <label class="range-label"><input type="radio" name="dashMonthsRange" value="12"${dashMonthsRange === 12 ? ' checked' : ''} onchange="window.handleRangeChange(12)"> 12m</label>
                </fieldset>
            </div>
            <div class="balance-section">
                <div class="chart-wrapper" style="flex:1;min-width:0"><canvas id="balanceChart" role="img" aria-label="Gráfico de balance mensual"></canvas></div>
                <div class="monthly-summary-table" id="monthlySummaryTable">
                    <p class="empty-state">Cargando...</p>
                </div>
            </div>
        </div>
        <div class="admin-accordion" id="userChartsAccordion" style="margin-top:20px">
            <div class="accordion-item" data-accordion="userGastos">
                <button class="accordion-header" onclick="window.toggleAccordion('userGastos')" aria-expanded="false">
                    <span class="accordion-title">Gastos</span>
                    <span class="accordion-chevron">&#x25BC;</span>
                </button>
                <div class="accordion-panel">
                    <div class="accordion-content">
                        <div class="dashboard-charts">
                            <div class="chart-card">
                                <p class="chart-title">Gastos por categor&iacute;a</p>
                                <div id="categoryChartEmpty" class="empty-state" style="display:none;padding:24px 0">Sin datos para este per&iacute;odo</div>
                                <div class="chart-wrapper"><canvas id="categoryChart" role="img" aria-label="Gráfico de gastos por categoría"></canvas></div>
                            </div>
                            <div class="chart-card">
                                <div class="chart-header">
                                    <div>
                                        <p class="chart-title" style="margin:0">Gastos por subcategor&iacute;a</p>
                                        <span id="subcategoryCategoryLabel" class="chart-sub-label"></span>
                                    </div>
                                    <select id="subcategoryCategoryFilter" onchange="window.handleCategoryFilterChange()">
                                        <option value="">Seleccionar categor&iacute;a</option>
                                    </select>
                                </div>
                                <div id="subcategoryChartEmpty" class="empty-state" style="display:none;padding:24px 0">Sin datos para este per&iacute;odo</div>
                                <div class="chart-wrapper"><canvas id="subcategoryChart" role="img" aria-label="Gráfico de gastos por subcategoría"></canvas></div>
                            </div>
                        </div>
                        <div class="top-expenses-section">
                            <div class="chart-card top-card">
                                <p class="chart-title">Top 3 categor&iacute;as con m&aacute;s gasto</p>
                                <span class="top-card-period" id="topCategoriesPeriod"></span>
                                <div id="topCategoriesContent"><p class="empty-state">Cargando...</p></div>
                            </div>
                            <div class="chart-card top-card">
                                <p class="chart-title">Top 3 subcategor&iacute;as con m&aacute;s gasto</p>
                                <span class="top-card-period" id="topSubcategoriesPeriod"></span>
                                <div id="topSubcategoriesContent"><p class="empty-state">Cargando...</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    loadDashboardData();

    initMonthPicker('#dashMonthInput', dashYear, dashMonth, function(selectedDates, dateStr) {
        const [y, m] = dateStr.split('-');
        dashYear = parseInt(y);
        dashMonth = parseInt(m);
        dashCategoryFilter = null;
        updateDashboardPeriodLabel();
        loadDashboardData();
    });
}

async function loadDashboardData() {
    const summaryEl = document.getElementById('dashSummary');
    try {
        if (summaryEl) summaryEl.setAttribute('aria-busy', 'true');
        await ensureCategoryCache();

        const expenseCats = cachedCategories.filter(c => c.type === 'EXPENSE');

        const [summaryRes, catExpenses, balanceRes, comparisonRes, topExpensesRes] = await Promise.all([
            apiRequest('GET', `/dashboard/me/summary-card?month=${dashMonth}&year=${dashYear}`),
            apiRequest('GET', `/dashboard/me/expenses-by-category?month=${dashMonth}&year=${dashYear}`),
            apiRequest('GET', `/dashboard/me/monthly-balance?months=${dashMonthsRange}`),
            apiRequest('GET', '/dashboard/me/monthly-comparison'),
            apiRequest('GET', `/dashboard/me/top-expenses?month=${dashMonth}&year=${dashYear}`)
        ]);

        const income = summaryRes?.income || 0;
        const expense = summaryRes?.expense || 0;
        const savingRate = summaryRes?.savingRate ?? 0;
        renderDashboardCards(income, expense, savingRate);

        renderComparisonCards(comparisonRes);

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
        renderMonthlySummaryTable(balanceData);

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

        renderTopExpenses(topExpensesRes);
    } catch (err) {
        const s = document.getElementById('dashSummary');
        if (s) s.innerHTML = `<p class="error-message">Error al cargar: ${escHtml(err.message)}</p>`;
        const compEl = document.getElementById('dashComparison');
        if (compEl) compEl.innerHTML = `<p class="error-message">Error al cargar comparativa</p>`;
        const topCatEl = document.getElementById('topCategoriesContent');
        if (topCatEl) topCatEl.innerHTML = `<p class="error-message">Error al cargar datos</p>`;
        const topSubEl = document.getElementById('topSubcategoriesContent');
        if (topSubEl) topSubEl.innerHTML = `<p class="error-message">Error al cargar datos</p>`;
    } finally {
        if (summaryEl) summaryEl.removeAttribute('aria-busy');
    }
}

function renderDashboardCards(income, expense, savingRate) {
    const balance = income - expense;
    const incEl = document.getElementById('incomeValue');
    const expEl = document.getElementById('expenseValue');
    const balEl = document.getElementById('balanceValue');
    const srEl = document.getElementById('savingRateValue');
    if (incEl) incEl.textContent = formatMoney(income);
    if (expEl) expEl.textContent = formatMoney(expense);
    if (balEl) {
        balEl.textContent = formatMoney(balance);
        balEl.className = 'summary-value ' + (balance >= 0 ? 'income' : 'expense');
    }
    if (srEl) {
        srEl.textContent = savingRate.toFixed(1) + '%';
        srEl.className = 'summary-value ' + (savingRate >= 0 ? 'income' : 'expense');
    }
}

function renderComparisonCards(data) {
    const expEl = document.getElementById('expenseGlossary');
    const incEl = document.getElementById('incomeGlossary');
    const expPeriod = document.getElementById('expenseComparisonPeriod');
    const incPeriod = document.getElementById('incomeComparisonPeriod');

    const now = new Date(dashYear, dashMonth - 1, 1);
    const prev = new Date(dashYear, dashMonth - 2, 1);
    const curLabel = getMonthFullName(dashMonth) + ' ' + dashYear;
    const prevLabel = getMonthFullName(prev.getMonth() + 1) + ' ' + prev.getFullYear();

    if (expPeriod) expPeriod.textContent = curLabel + ' vs ' + prevLabel;
    if (incPeriod) incPeriod.textContent = curLabel + ' vs ' + prevLabel;
    if (expEl) expEl.textContent = data?.expenseGlossary || 'Sin datos comparativos';
    if (incEl) incEl.textContent = data?.incomeGlossary || 'Sin datos comparativos';
}

function renderMonthlySummaryTable(data) {
    const container = document.getElementById('monthlySummaryTable');
    if (!container) return;
    if (!data || !data.length) {
        container.innerHTML = '<p class="empty-state">Sin datos para este per&iacute;odo</p>';
        return;
    }
    let html = `<table class="summary-mini-table">
        <caption>Resumen mensual de ingresos, gastos y tasa de ahorro</caption>
        <thead><tr><th>Mes</th><th>Ingreso</th><th>Gasto</th><th>Tasa de ahorro</th></tr></thead><tbody>`;
    data.forEach(d => {
        const srClass = d.savingRate >= 0 ? 'income' : 'expense';
        html += `<tr>
            <td>${MONTH_NAMES_SHORT[d.month-1]} ${String(d.year).slice(-2)}</td>
            <td class="income">${formatMoney(d.income)}</td>
            <td class="expense">${formatMoney(d.expense)}</td>
            <td class="${srClass}">${d.savingRate.toFixed(1)}%</td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

function renderTopExpenses(data) {
    const catContainer = document.getElementById('topCategoriesContent');
    const subContainer = document.getElementById('topSubcategoriesContent');
    const topCatPeriod = document.getElementById('topCategoriesPeriod');
    const topSubPeriod = document.getElementById('topSubcategoriesPeriod');
    const periodLabel = getMonthFullName(dashMonth) + ' ' + dashYear;

    if (topCatPeriod) topCatPeriod.textContent = periodLabel;
    if (topSubPeriod) topSubPeriod.textContent = periodLabel;

    if (catContainer) {
        if (!data?.topCategories?.length) {
            catContainer.innerHTML = '<p class="empty-state">Sin datos para este per&iacute;odo</p>';
        } else {
            catContainer.innerHTML = '<ol class="top-list">' + data.topCategories.map(c => `
                <li class="top-entry">
                    <span class="top-rank">${data.topCategories.indexOf(c) + 1}.</span>
                    <span class="top-name">${escHtml(c.name)}</span>
                    <span class="top-amount">${formatMoney(c.amount)}</span>
                    <span class="top-pct">${c.percentage.toFixed(1)}%</span>
                </li>
            `).join('') + '</ol>';
        }
    }
    if (subContainer) {
        if (!data?.topSubcategories?.length) {
            subContainer.innerHTML = '<p class="empty-state">Sin datos para este per&iacute;odo</p>';
        } else {
            subContainer.innerHTML = '<ol class="top-list">' + data.topSubcategories.map((s, i) => `
                <li class="top-entry">
                    <span class="top-rank">${i + 1}.</span>
                    <span class="top-name">${escHtml(s.name)}</span>
                    <span class="top-amount">${formatMoney(s.amount)}</span>
                </li>
            `).join('') + '</ol>';
        }
    }
}

function handleRangeChange(months) {
    dashMonthsRange = months;
    const label = document.getElementById('balanceRangeLabel');
    if (label) label.textContent = months;
    loadDashboardData();
}

function renderCategoryChart(data) {
    destroyChart('category');
    categoryChartData = data;
    const canvas = document.getElementById('categoryChart');
    const emptyEl = document.getElementById('categoryChartEmpty');
    if (!canvas) return;

    if (!data.length) {
        canvas.style.display = 'none';
        if (emptyEl) emptyEl.style.display = 'block';
        return;
    }
    canvas.style.display = '';
    if (emptyEl) emptyEl.style.display = 'none';

    const onClick = (event, elements) => {
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
    };

    chartCategory = createDoughnutChart('categoryChart', data.map(d => d.categoryName), data.map(d => d.total), onClick);
}

function renderBalanceChart(data) {
    destroyChart('balance');
    const canvas = document.getElementById('balanceChart');
    if (!canvas) return;

    if (!data.length) {
        canvas.style.display = 'none';
        const wrapper = canvas.parentElement;
        if (wrapper && !wrapper.querySelector('.empty-state')) {
            wrapper.insertAdjacentHTML('afterbegin', '<p class="empty-state">Sin datos para este período</p>');
        }
        return;
    }
    canvas.style.display = '';
    const existingEmpty = canvas.parentElement?.querySelector('.empty-state');
    if (existingEmpty) existingEmpty.remove();

    const sorted = [...data].sort((a, b) => a.year - b.year || a.month - b.month);
    const labels = sorted.map(d => MONTH_NAMES_SHORT[d.month - 1] + ' ' + d.year);
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
    renderSubcategoryDoughnut('subcategoryChart', 'subcategory', data);
    const emptyEl = document.getElementById('subcategoryChartEmpty');
    const canvas = document.getElementById('subcategoryChart');
    if (!canvas) return;
    if (!data.length) {
        canvas.style.display = 'none';
        if (emptyEl) emptyEl.style.display = 'block';
        return;
    }
    canvas.style.display = '';
    if (emptyEl) emptyEl.style.display = 'none';
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
    const el = document.getElementById('dashPeriodSubtitle');
    if (el) el.textContent = `${getMonthFullName(dashMonth)} ${dashYear}`;
}

function handleFilterChange() {
    const fp = document.getElementById('dashMonthInput')?._flatpickr;
    if (fp) {
        const dateStr = fp.formatDate(fp.selectedDates[0], 'Y-m');
        const [year, month] = dateStr.split('-');
        dashYear = parseInt(year);
        dashMonth = parseInt(month);
    } else {
        const input = document.getElementById('dashMonthInput');
        if (!input || !input.value) return;
        const [year, month] = input.value.split('-');
        dashYear = parseInt(year);
        dashMonth = parseInt(month);
    }
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

window.handleFilterChange = handleFilterChange;
window.handleCategoryFilterChange = handleCategoryFilterChange;
window.handleRangeChange = handleRangeChange;
window.refreshDashboardIfActive = refreshDashboardIfActive;

window.toggleAccordion = toggleAccordion;
