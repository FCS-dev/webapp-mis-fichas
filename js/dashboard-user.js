// ===================================================================
// DASHBOARD USER SECTION
// ===================================================================
function renderDashboardSection() {
  const now = new Date();
  const maxMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  document.getElementById("dashContent").innerHTML = `
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
                    <input type="month" id="dashMonthInput" value="${dashYear}-${String(dashMonth).padStart(2, "0")}" onchange="window.handleFilterChange()">
                </label>
            </div>
            </div>
        </div>
        <div class="summary-cards" id="dashSummary" role="group" aria-label="Resumen financiero">
            <div class="summary-card summary-card" id="incomeCard">
                <div class="summary-card-header">
                    <span class="summary-label">Ingresos</span>
                    <span class="summary-icon income" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                    </span>
                </div>
                <span class="summary-value income" id="incomeValue">${CONFIG.CURRENCY_SYMBOL || "$"} 0</span>
                <span class="summary-change" id="incomeChange"></span>
            </div>
            <div class="summary-card summary-card" id="expenseCard">
                <div class="summary-card-header">
                    <span class="summary-label">Gastos</span>
                    <span class="summary-icon expense" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                    </span>
                </div>
                <span class="summary-value expense" id="expenseValue">${CONFIG.CURRENCY_SYMBOL || "$"} 0</span>
                <span class="summary-change" id="expenseChange"></span>
            </div>
            <div class="summary-card summary-card" id="balanceCard">
                <div class="summary-card-header">
                    <span class="summary-label">Balance</span>
                    <span class="summary-icon balance" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                    </span>
                </div>
                <span class="summary-value" id="balanceValue">${CONFIG.CURRENCY_SYMBOL || "$"} 0</span>
                <span class="summary-change" id="balanceChange"></span>
            </div>
            <div class="summary-card summary-card" id="savingRateCard">
                <div class="summary-card-header">
                    <span class="summary-label">Tasa de ahorro</span>
                    <span class="summary-icon saving" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                    </span>
                </div>
                <span class="summary-value" id="savingRateValue">0%</span>
                <span class="summary-change" id="savingChange"></span>
            </div>
        </div>
        <div class="dash-content-area">
        <div class="dash-tabs" role="tablist">
            <button class="dash-tab-btn active" data-tab="balance" role="tab" aria-selected="true" onclick="window.switchTab('balance')">Balance General</button>
            <button class="dash-tab-btn" data-tab="gastos" role="tab" aria-selected="false" onclick="window.switchTab('gastos')">Desglose Gastos</button>
        </div>
        <div class="dash-tab-panel active" data-tab-panel="balance" role="tabpanel">
            <div class="chart-card chart-card-full">
                <div class="chart-header">
                    <p class="chart-title" style="margin:0">Balance mensual &uacute;ltimos <span id="balanceRangeLabel">${dashMonthsRange}</span> meses</p>
                    <fieldset class="range-checkboxes" style="border:none;padding:0">
                        <legend class="sr-only">Rango de meses</legend>
                        <label class="range-label"><input type="radio" name="dashMonthsRange" value="3"${dashMonthsRange === 3 ? " checked" : ""} onchange="window.handleRangeChange(3)"> 3m</label>
                        <label class="range-label"><input type="radio" name="dashMonthsRange" value="6"${dashMonthsRange === 6 ? " checked" : ""} onchange="window.handleRangeChange(6)"> 6m</label>
                        <label class="range-label"><input type="radio" name="dashMonthsRange" value="12"${dashMonthsRange === 12 ? " checked" : ""} onchange="window.handleRangeChange(12)"> 12m</label>
                    </fieldset>
                </div>
                <div class="balance-section">
                    <div class="chart-wrapper" style="flex:1;min-width:0"><canvas id="balanceChart" role="img" aria-label="Gráfico de balance mensual"></canvas></div>
                    <div class="monthly-summary-table" id="monthlySummaryTable">
                        <p class="empty-state">Cargando...</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="dash-tab-panel" data-tab-panel="gastos" role="tabpanel">
            <div class="dashboard-charts">
                <div class="chart-card">
                    <p class="chart-title">Gastos por categor&iacute;a</p>
                    <div id="categoryChartEmpty" class="empty-state" style="display:none;padding:24px 0">Sin datos para este per&iacute;odo</div>
                    <div class="chart-wrapper"><canvas id="categoryChart" role="img" aria-label="Gráfico de gastos por categoría"></canvas></div>
                </div>
                <div class="chart-card">
                    <div class="chart-header chart-header--row">
                        <span class="chart-header-label">Distribuci&oacute;n de </span>
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
        </div>`;

  loadDashboardData();

  initMonthPicker(
    "#dashMonthInput",
    dashYear,
    dashMonth,
    function (e) {
      const [y, m] = e.target.value.split("-");
      dashYear = parseInt(y);
      dashMonth = parseInt(m);
      dashCategoryFilter = null;
      updateDashboardPeriodLabel();
      loadDashboardData();
    },
  );
}

async function loadDashboardData() {
  const summaryEl = document.getElementById("dashSummary");
  try {
    if (summaryEl) summaryEl.setAttribute("aria-busy", "true");
    await ensureCategoryCache();

    const expenseCats = cachedCategories.filter((c) => c.type === "EXPENSE");

    const [summaryRes, catExpenses, balanceRes, comparisonRes, topExpensesRes] =
      await Promise.all([
        apiRequest(
          "GET",
          `/dashboard/me/summary-card?month=${dashMonth}&year=${dashYear}`,
        ),
        apiRequest(
          "GET",
          `/dashboard/me/expenses-by-category?month=${dashMonth}&year=${dashYear}`,
        ),
        apiRequest(
          "GET",
          `/dashboard/me/monthly-balance?months=${dashMonthsRange}`,
        ),
        apiRequest("GET", "/dashboard/me/monthly-comparison"),
        apiRequest(
          "GET",
          `/dashboard/me/top-expenses?month=${dashMonth}&year=${dashYear}`,
        ),
      ]);

    const income = summaryRes?.income || 0;
    const expense = summaryRes?.expense || 0;
    const savingRate = summaryRes?.savingRate ?? 0;
    renderDashboardCards(income, expense, savingRate);

    const _now = new Date(dashYear, dashMonth - 1, 1);
    const _prev = new Date(dashYear, dashMonth - 2, 1);
    const _curLabel = getMonthFullName(dashMonth) + " " + dashYear;
    const _prevLabel = getMonthFullName(_prev.getMonth() + 1) + " " + _prev.getFullYear();
    const _periodText = _curLabel + " vs " + _prevLabel;
    const expPeriod = document.getElementById("expenseComparisonPeriod");
    const incPeriod = document.getElementById("incomeComparisonPeriod");
    if (expPeriod) expPeriod.textContent = _periodText;
    if (incPeriod) incPeriod.textContent = _periodText;
    const expEl = document.getElementById("expenseGlossary");
    const incEl = document.getElementById("incomeGlossary");
    if (expEl) expEl.textContent = comparisonRes?.expenseGlossary || "Sin datos comparativos";
    if (incEl) incEl.textContent = comparisonRes?.incomeGlossary || "Sin datos comparativos";

    const catExpenseData = Array.isArray(catExpenses) ? catExpenses : [];
    categoryChartData = catExpenseData;
    renderCategoryChart(catExpenseData);

    if (catExpenseData.length > 0) {
      const highest = catExpenseData.reduce((a, b) =>
        a.total > b.total ? a : b,
      );
      dashCategoryFilter = highest.categoryId;
    } else {
      dashCategoryFilter = null;
    }

    const balanceData = Array.isArray(balanceRes) ? balanceRes : [];
    renderBalanceChart(balanceData);
    renderMonthlySummaryTable(balanceData);

    const catSelect = document.getElementById("subcategoryCategoryFilter");
    if (catSelect) {
      catSelect.innerHTML =
        '<option value="">Seleccionar categor&iacute;a</option>';
      expenseCats.forEach((c) => {
        const opt = document.createElement("option");
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
        destroyChart("subcategory");
      }
    }

    renderTopExpenses(topExpensesRes);
  } catch (err) {
    const s = document.getElementById("dashSummary");
    if (s)
      s.innerHTML = `<p class="error-message">Error al cargar: ${escHtml(err.message)}</p>`;
    const compEl = document.getElementById("dashComparison");
    if (compEl)
      compEl.innerHTML = `<p class="error-message">Error al cargar comparativa</p>`;
    const topCatEl = document.getElementById("topCategoriesContent");
    if (topCatEl)
      topCatEl.innerHTML = `<p class="error-message">Error al cargar datos</p>`;
    const topSubEl = document.getElementById("topSubcategoriesContent");
    if (topSubEl)
      topSubEl.innerHTML = `<p class="error-message">Error al cargar datos</p>`;
  } finally {
    if (summaryEl) summaryEl.removeAttribute("aria-busy");
  }
}

function renderDashboardCards(income, expense, savingRate) {
  const balance = income - expense;
  const incEl = document.getElementById("incomeValue");
  const expEl = document.getElementById("expenseValue");
  const balEl = document.getElementById("balanceValue");
  const srEl = document.getElementById("savingRateValue");
  if (incEl) incEl.textContent = formatMoney(income);
  if (expEl) expEl.textContent = formatMoney(expense);
  if (balEl) {
    balEl.textContent = formatMoney(balance);
    balEl.className = "summary-value " + (balance >= 0 ? "income" : "expense");
  }
  if (srEl) {
    srEl.textContent = savingRate.toFixed(1) + "%";
    srEl.className =
      "summary-value " + (savingRate >= 0 ? "income" : "expense");
  }
}

function renderMonthlySummaryTable(data) {
  const container = document.getElementById("monthlySummaryTable");
  if (!container) return;
  if (!data || !data.length) {
    container.innerHTML =
      '<p class="empty-state">Sin datos para este período. Agrega transacciones para ver el resumen.</p>';
    return;
  }
  let html = `<table class="summary-mini-table">
        <thead><tr><th>Mes</th><th>Ingreso</th><th>Gasto</th><th>Ahorro</th></tr></thead><tbody>`;
  data.forEach((d) => {
    const srClass = d.savingRate >= 0 ? "income" : "expense";
    html += `<tr>
            <td>${MONTH_NAMES_SHORT[d.month - 1]} ${String(d.year).slice(-2)}</td>
            <td class="amount income">${formatMoney(d.income)}</td>
            <td class="amount expense">${formatMoney(d.expense)}</td>
            <td class="pct ${srClass}">${d.savingRate.toFixed(1)}%</td>
        </tr>`;
  });
  html += "</tbody></table>";
  container.innerHTML = html;
}

function renderTopExpenses(data) {
  const catContainer = document.getElementById("topCategoriesContent");
  const subContainer = document.getElementById("topSubcategoriesContent");
  const topCatPeriod = document.getElementById("topCategoriesPeriod");
  const topSubPeriod = document.getElementById("topSubcategoriesPeriod");
  const periodLabel = getMonthFullName(dashMonth) + " " + dashYear;

  if (topCatPeriod) topCatPeriod.textContent = periodLabel;
  if (topSubPeriod) topSubPeriod.textContent = periodLabel;

  if (catContainer) {
    if (!data?.topCategories?.length) {
      catContainer.innerHTML =
        '<p class="empty-state">Sin datos para este período. Agrega transacciones para ver las categorías top.</p>';
    } else {
      catContainer.innerHTML =
        '<ol class="top-list">' +
        data.topCategories
          .map(
            (c) => `
                <li class="top-entry">
                    <span class="top-rank">${data.topCategories.indexOf(c) + 1}.</span>
                    <span class="top-name">${escHtml(c.name)}</span>
                    <span class="top-amount">${formatMoney(c.amount)}</span>
                    <span class="pct top-pct">${c.percentage.toFixed(1)}%</span>
                </li>
            `,
          )
          .join("") +
        "</ol>";
    }
  }
  if (subContainer) {
    if (!data?.topSubcategories?.length) {
      subContainer.innerHTML =
        '<p class="empty-state">Sin datos para este período. Agrega transacciones para ver las subcategorías top.</p>';
    } else {
      subContainer.innerHTML =
        '<ol class="top-list">' +
        data.topSubcategories
          .map(
            (s, i) => `
                <li class="top-entry">
                    <span class="top-rank">${i + 1}.</span>
                    <span class="top-name">${escHtml(s.name)}</span>
                    <span class="top-amount">${formatMoney(s.amount)}</span>
                </li>
            `,
          )
          .join("") +
        "</ol>";
    }
  }
}

function handleRangeChange(months) {
  dashMonthsRange = months;
  const label = document.getElementById("balanceRangeLabel");
  if (label) label.textContent = months;
  loadDashboardData();
}

function renderCategoryChart(data) {
  destroyChart("category");
  categoryChartData = data;
  const canvas = document.getElementById("categoryChart");
  const emptyEl = document.getElementById("categoryChartEmpty");
  if (!canvas) return;

  if (!data.length) {
    canvas.style.display = "none";
    if (emptyEl) emptyEl.style.display = "block";
    return;
  }
  canvas.style.display = "";
  if (emptyEl) emptyEl.style.display = "none";

  const onClick = createDrillDownHandler(
    categoryChartData,
    "subcategoryCategoryFilter",
    "dashCategoryFilter",
    loadSubcategoryChart,
  );

  chartCategory = createDoughnutChart(
    "categoryChart",
    data.map((d) => d.categoryName),
    data.map((d) => d.total),
    onClick,
  );
}

function renderBalanceChart(data) {
  destroyChart("balance");
  const canvas = document.getElementById("balanceChart");
  if (!canvas) return;

  if (!data.length) {
    canvas.style.display = "none";
    const wrapper = canvas.parentElement;
    if (wrapper && !wrapper.querySelector(".empty-state")) {
      wrapper.insertAdjacentHTML(
        "afterbegin",
        '<p class="empty-state">Sin datos para este período</p>',
      );
    }
    return;
  }
  canvas.style.display = "";
  const existingEmpty = canvas.parentElement?.querySelector(".empty-state");
  if (existingEmpty) existingEmpty.remove();

  const sorted = [...data].sort((a, b) => a.year - b.year || a.month - b.month);
  const labels = sorted.map(
    (d) => MONTH_NAMES_SHORT[d.month - 1] + " " + d.year,
  );
  const textColor = getChartTextColor();
  const gridColor = getChartGridColor();

  const allValues = sorted.flatMap((d) => [d.income, d.expense, d.balance]);
  const globalMin = Math.min(...allValues);
  const globalMax = Math.max(...allValues);
  const padding = (globalMax - globalMin) * 0.1 || 1;

  chartBalance = new Chart(canvas.getContext("2d"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Ingresos",
          data: sorted.map((d) => d.income),
          borderColor: getCssVar("--income"),
          backgroundColor: `rgba(${getCssVar("--income-rgb") || "82,153,139"},0.06)`,
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          yAxisID: "y",
        },
        {
          label: "Gastos",
          data: sorted.map((d) => d.expense),
          borderColor: getCssVar("--expense"),
          backgroundColor: `rgba(${getCssVar("--expense-rgb") || "206,55,55"},0.06)`,
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          yAxisID: "y",
        },
        {
          label: "Balance",
          data: sorted.map((d) => d.balance),
          borderColor: getCssVar("--primary"),
          backgroundColor: `rgba(${getCssVar("--primary-rgb") || "142,47,55"},0.06)`,
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          borderDash: [6, 3],
          yAxisID: "y2",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: textColor, boxWidth: 12, padding: 12 },
        },
        datalabels: {
          display: true,
          align: "top",
          anchor: "end",
          formatter: (value) => {
            if (value >= 1000) {
              return (
                (value / 1000).toLocaleString("es-ES", {
                  maximumFractionDigits: 1,
                }) + "k"
              );
            }
            return value.toLocaleString("es-ES", {
              maximumFractionDigits: 0,
            });
          },
          color: textColor,
        },
      },
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor },
        },
        y: {
          position: "left",
          min: globalMin - padding,
          max: globalMax + padding,
          ticks: { color: textColor },
          grid: { color: gridColor },
        },
        y2: {
          position: "right",
          min: globalMin - padding,
          max: globalMax + padding,
          ticks: { color: textColor },
          grid: { display: false },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}

async function loadSubcategoryChart() {
  if (!dashCategoryFilter) {
    destroyChart("subcategory");
    return;
  }
  try {
    const res = await apiRequest(
      "GET",
      `/dashboard/me/expenses-by-subcategory?categoryId=${dashCategoryFilter}&month=${dashMonth}&year=${dashYear}`,
    );
    const data = Array.isArray(res) ? res : [];
    renderSubcategoryChart(data);
  } catch (err) {
    console.error("Error loading subcategory chart:", err);
    destroyChart("subcategory");
  }
}

function renderSubcategoryChart(data) {
  renderSubcategoryDoughnut("subcategoryChart", "subcategory", data);
  const emptyEl = document.getElementById("subcategoryChartEmpty");
  const canvas = document.getElementById("subcategoryChart");
  if (!canvas) return;
  if (!data.length) {
    canvas.style.display = "none";
    if (emptyEl) emptyEl.style.display = "block";
    return;
  }
  canvas.style.display = "";
  if (emptyEl) emptyEl.style.display = "none";
}

function updateDashboardPeriodLabel() {
  const el = document.getElementById("dashPeriodSubtitle");
  if (el) el.textContent = `${getMonthFullName(dashMonth)} ${dashYear}`;
}

function handleFilterChange() {
  const input = document.getElementById("dashMonthInput");
  if (!input || !input.value) return;
  const [year, month] = input.value.split("-");
  dashYear = parseInt(year);
  dashMonth = parseInt(month);
  dashCategoryFilter = null;
  updateDashboardPeriodLabel();
  loadDashboardData();
}

function handleCategoryFilterChange() {
  const sel = document.getElementById("subcategoryCategoryFilter");
  if (!sel) return;
  dashCategoryFilter = sel.value ? parseInt(sel.value) : null;
  loadSubcategoryChart();
}

async function refreshDashboardIfActive() {
  if (!document.getElementById("incomeCard")) return;
  await loadDashboardData();
}

window.handleFilterChange = handleFilterChange;
window.handleCategoryFilterChange = handleCategoryFilterChange;
window.handleRangeChange = handleRangeChange;
window.refreshDashboardIfActive = refreshDashboardIfActive;
window.switchTab = switchTab;
