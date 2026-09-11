// ===================================================================
// ADMIN DASHBOARD
// ===================================================================
function renderAdminDashboardSection() {
  destroyChart("userGrowth");
  destroyChart("incomeVsExpense");
  destroyChart("adminCategory");
  destroyChart("adminSubcategory");

  document.getElementById("dashContent").innerHTML = `
        <div class="section-header">
            <h2>Panel de Administraci&oacute;n</h2>
            <p id="adminDashboardTimestamp" style="font-size:0.75rem;color:var(--text-secondary);margin-top:4px;"></p>
            <div id="adminPeriodSubtitle"></div>
        </div>

        <div class="admin-hero-cards" id="adminHeroCards">
            <div class="admin-hero-card"><div class="skeleton skeleton-text"></div></div>
            <div class="admin-hero-card"><div class="skeleton skeleton-text"></div></div>
            <div class="admin-hero-card"><div class="skeleton skeleton-text"></div></div>
            <div class="admin-hero-card"><div class="skeleton skeleton-text"></div></div>
        </div>

        <div class="admin-montos-section">
            <div class="admin-montos-header">
                <h3 class="admin-montos-title" id="montosTitle">Estad&iacute;sticas (Todos)</h3>
                <div class="admin-montos-filter" id="montosFilter"></div>
            </div>
            <div class="stat-cards" id="montosCards">
                <div class="stat-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                <div class="stat-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                <div class="stat-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                <div class="stat-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                <div class="stat-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                <div class="stat-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
            </div>
        </div>

        <div class="dash-content-area">
            <div class="dash-tabs" role="tablist">
                <button class="dash-tab-btn active" data-tab="sec1" role="tab" aria-selected="true" onclick="window.switchAdminTab('sec1')">Evoluci&oacute;n de Usuarios</button>
                <button class="dash-tab-btn" data-tab="sec2" role="tab" aria-selected="false" onclick="window.switchAdminTab('sec2')">Evoluci&oacute;n de Transacciones</button>
                <button class="dash-tab-btn" data-tab="sec6" role="tab" aria-selected="false" onclick="window.switchAdminTab('sec6')">Distribuci&oacute;n de Usuarios por Actividad</button>
                <button class="dash-tab-btn" data-tab="sec5" role="tab" aria-selected="false" onclick="window.switchAdminTab('sec5')">Usuarios con Mayor Actividad</button>
                <button class="dash-tab-btn" data-tab="expBreakdown" role="tab" aria-selected="false" onclick="window.switchAdminTab('expBreakdown')">Desglose de Gastos</button>
            </div>

            <div class="dash-tab-panel active" data-tab-panel="sec1" role="tabpanel">
                <p class="admin-section-criteria" id="sec1Criteria"></p>
                <div class="admin-section-filters" id="sec1Filters"></div>
                <div class="stat-cards" id="sec1Cards">
                    <div class="stat-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                </div>
                <div class="chart-card" style="margin-top:12px"><div class="chart-wrapper"><canvas id="sec1Chart" role="img" aria-label="Gráfico de evolución de usuarios"></canvas></div></div>
            </div>

            <div class="dash-tab-panel" data-tab-panel="sec2" role="tabpanel">
                <p class="admin-section-criteria" id="sec2Criteria"></p>
                <div class="admin-section-filters" id="sec2Filters"></div>
                <div class="stat-cards" id="sec2Cards">
                    <div class="stat-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                    <div class="stat-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                </div>
                <div class="chart-card" style="margin-top:12px"><div class="chart-wrapper"><canvas id="sec2Chart" role="img" aria-label="Gráfico de evolución de transacciones"></canvas></div></div>
            </div>

            <div class="dash-tab-panel" data-tab-panel="sec6" role="tabpanel">
                <p class="admin-section-criteria" id="sec6Criteria"></p>
                <div class="admin-section-filters" id="sec6Filters"></div>
                <div id="sec6Cards"><div class="loading-message">Cargando…</div></div>
            </div>

            <div class="dash-tab-panel" data-tab-panel="sec5" role="tabpanel">
                <p class="admin-section-criteria" id="sec5Criteria"></p>
                <div class="admin-section-filters" id="sec5Filters"></div>
                <div class="mini-tables" id="sec5Cards">
                    <div class="mini-table-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                    <div class="mini-table-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                    <div class="mini-table-card"><div class="skeleton skeleton-text-sm"></div><div class="skeleton skeleton-card"></div></div>
                </div>
            </div>

            <div class="dash-tab-panel" data-tab-panel="expBreakdown" role="tabpanel">
                <p class="admin-section-criteria" id="expBreakdownCriteria"></p>
                <div class="admin-section-filters" id="expBreakdownFilters"></div>
                <div class="dashboard-charts">
                    <div class="chart-card">
                        <p class="chart-title">Gastos por categor&iacute;a</p>
                        <div class="chart-wrapper"><canvas id="adminCategoryChart" role="img" aria-label="Gráfico de gastos por categoría"></canvas></div>
                    </div>
                    <div class="chart-card">
                        <div class="chart-header chart-header--row">
                            <span class="chart-header-label">Distribuci&oacute;n de </span>
                            <select id="adminCategoryFilter" onchange="window.handleAdminCategoryFilterChange()">
                                <option value="">Seleccionar</option>
                            </select>
                        </div>
                        <div class="chart-wrapper"><canvas id="adminSubcategoryChart" role="img" aria-label="Gráfico de gastos por subcategoría"></canvas></div>
                    </div>
                </div>
            </div>
        </div>`;

  renderSec1Filters();
  renderSec2Filters();
  renderExpBreakdownFilters();
  renderSec5Filters();
  renderSec6Filters();
  renderMontosFilter();
  loadAdminAllData();
  initTabsScrollFade();
}

window.switchAdminTab = switchTab;

function initTabsScrollFade() {
  const tabs = document.querySelector("#dashContent .dash-tabs");
  const area = document.querySelector("#dashContent .dash-content-area");
  if (!tabs || !area) return;
  const checkScroll = () => {
    const maxScroll = tabs.scrollWidth - tabs.clientWidth;
    area.classList.toggle("scroll-end", tabs.scrollLeft >= maxScroll - 2);
  };
  tabs.addEventListener("scroll", checkScroll, { passive: true });
  checkScroll();
}

// ===================================================================
// ADMIN DASHBOARD — HELPERS
// ===================================================================
function buildMonthInput(id, year, month) {
  return `<input type="month" id="${id}" value="${year}-${String(month).padStart(2, "0")}">`;
}

function initMonthPicker(selector, year, month, onChange) {
  const el = document.querySelector(selector);
  if (!el) return;
  if (onChange) el.addEventListener("change", onChange);
}

function getMonthPickerValue(selector) {
  const el = document.querySelector(selector);
  return el?.value || "";
}

function renderComparisonIndicator(current, previous) {
  const pct =
    previous === 0
      ? current === 0
        ? 0
        : 100
      : ((current - previous) / previous) * 100;
  const rounded = Math.round(pct * 10) / 10;
  if (rounded > 0)
    return `<span class="stat-card-change up" aria-hidden="true">&#x25B2; ${rounded}%</span>`;
  if (rounded < 0)
    return `<span class="stat-card-change down" aria-hidden="true">&#x25BC; ${Math.abs(rounded)}%</span>`;
  return `<span class="stat-card-change neutral">— 0%</span>`;
}

function criteriaPeriod(mFrom, yFrom, mTo, yTo) {
  return `Periodo: ${MONTH_NAMES_FULL[mFrom - 1]} ${yFrom} – ${MONTH_NAMES_FULL[mTo - 1]} ${yTo}`;
}

function criteriaUser(userId) {
  const name =
    userId === 0
      ? "Todos"
      : adminUsers.find((u) => u.id === userId)?.name || "Todos";
  return `Usuario: ${name}`;
}

function criteriaMonth(m, y) {
  return `Mes: ${MONTH_NAMES_FULL[m - 1]} ${y}`;
}

function showEmptyState(containerId) {
  const el = document.getElementById(containerId);
  if (el)
    el.innerHTML =
      '<div class="empty-state">Sin información para mostrar en este período.</div>';
}

function readPeriodRange(fromSel, toSel) {
  const [yf, mf] = getMonthPickerValue(fromSel).split("-").map(Number);
  const [yt, mt] = getMonthPickerValue(toSel).split("-").map(Number);
  const err = validatePeriod(yf, mf, yt, mt);
  if (err) {
    showToast(err, "error");
    return null;
  }
  return { yf, mf, yt, mt };
}

function renderPeriodFilters(cfg) {
  document.getElementById(cfg.filtersId).innerHTML = `
        <label>Desde ${buildMonthInput(cfg.fromId, cfg.fromYear, cfg.fromMonth)}</label>
        <label>Hasta ${buildMonthInput(cfg.toId, cfg.toYear, cfg.toMonth)}</label>
        <button class="btn-primary" onclick="window.${cfg.applyHandler}()">Actualizar</button>`;
  document.getElementById(cfg.criteriaId).textContent = criteriaPeriod(
    cfg.fromMonth, cfg.fromYear, cfg.toMonth, cfg.toYear,
  );
  initMonthPicker(`#${cfg.fromId}`, cfg.fromYear, cfg.fromMonth);
  initMonthPicker(`#${cfg.toId}`, cfg.toYear, cfg.toMonth);
}

function applyPeriodFilter(fromSel, toSel, criteriaId, assignFn, loadFn) {
  const r = readPeriodRange(fromSel, toSel);
  if (!r) return;
  assignFn(r);
  document.getElementById(criteriaId).textContent = criteriaPeriod(r.mf, r.yf, r.mt, r.yt);
  loadFn();
}

function renderSec1Filters() {
  renderPeriodFilters({
    filtersId: "sec1Filters", criteriaId: "sec1Criteria",
    fromId: "sec1MonthFrom", toId: "sec1MonthTo",
    fromYear: sec1YearFrom, fromMonth: sec1MonthFrom,
    toYear: sec1YearTo, toMonth: sec1MonthTo,
    applyHandler: "handleApplySec1",
  });
}

function renderSec2Filters() {
  document.getElementById("sec2Filters").innerHTML = `
        <label>Usuario
            <select id="sec2UserSelect"><option value="0">Todos</option></select>
        </label>
        <label>Desde ${buildMonthInput("sec2MonthFrom", sec2YearFrom, sec2MonthFrom)}</label>
        <label>Hasta ${buildMonthInput("sec2MonthTo", sec2YearTo, sec2MonthTo)}</label>
        <button class="btn-primary" onclick="window.handleApplySec2()">Actualizar</button>`;
  populateUserSelect("sec2UserSelect", sec2UserId);
  document.getElementById("sec2Criteria").textContent =
    `${criteriaUser(sec2UserId)} | ${criteriaPeriod(sec2MonthFrom, sec2YearFrom, sec2MonthTo, sec2YearTo)}`;
  initMonthPicker("#sec2MonthFrom", sec2YearFrom, sec2MonthFrom);
  initMonthPicker("#sec2MonthTo", sec2YearTo, sec2MonthTo);
}

function renderMontosFilter() {
  document.getElementById("montosFilter").innerHTML = `
        <label>Cambiar a</label>
        <select id="montosUserSelect"><option value="0">Todos</option></select>
        <button class="btn-primary" onclick="window.handleApplyMontos()">Actualizar</button>`;
  populateUserSelect("montosUserSelect", montosUserId);
  updateMontosTitle();
}

function updateMontosTitle() {
  const el = document.getElementById("montosTitle");
  if (!el) return;
  const user =
    montosUserId === 0 ? null : adminUsers.find((u) => u.id === montosUserId);
  el.innerHTML = user
    ? `Estad&iacute;sticas de ${escHtml(user.name || user.email)}`
    : "Estad&iacute;sticas (Todos)";
}

function renderSec5Filters() {
  renderPeriodFilters({
    filtersId: "sec5Filters", criteriaId: "sec5Criteria",
    fromId: "sec5MonthFrom", toId: "sec5MonthTo",
    fromYear: sec5YearFrom, fromMonth: sec5MonthFrom,
    toYear: sec5YearTo, toMonth: sec5MonthTo,
    applyHandler: "handleApplySec5",
  });
}

function renderSec6Filters() {
  document.getElementById("sec6Filters").innerHTML = `
        <label>Mes ${buildMonthInput("sec6Month", sec6Year, sec6Month)}</label>
        <button class="btn-primary" onclick="window.handleApplySec6()">Actualizar</button>`;
  document.getElementById("sec6Criteria").textContent = criteriaMonth(
    sec6Month,
    sec6Year,
  );
  initMonthPicker("#sec6Month", sec6Year, sec6Month);
}

function populateUserSelect(selectId, selectedValue, defaultLabel) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = `<option value="0">${defaultLabel || "Todos"}</option>`;
  adminUsers.forEach((u) => {
    const opt = document.createElement("option");
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
  document.getElementById("expBreakdownFilters").innerHTML = `
        <label>Usuario
            <select id="expBreakdownUser"><option value="0">Todos</option></select>
        </label>
        <label>Desde ${buildMonthInput("expBreakdownMonthFrom", expBreakdownYearFrom, expBreakdownMonthFrom)}</label>
        <label>Hasta ${buildMonthInput("expBreakdownMonthTo", expBreakdownYearTo, expBreakdownMonthTo)}</label>
        <button class="btn-primary" onclick="window.handleApplyExpBreakdown()">Actualizar</button>`;
  populateUserSelect("expBreakdownUser", expBreakdownUserId);
  document.getElementById("expBreakdownCriteria").textContent =
    `${criteriaUser(expBreakdownUserId)} | ${criteriaPeriod(expBreakdownMonthFrom, expBreakdownYearFrom, expBreakdownMonthTo, expBreakdownYearTo)}`;
  initMonthPicker("#expBreakdownMonthFrom", expBreakdownYearFrom, expBreakdownMonthFrom);
  initMonthPicker("#expBreakdownMonthTo", expBreakdownYearTo, expBreakdownMonthTo);
}

function handleApplyExpBreakdown() {
  expBreakdownUserId = parseInt(
    document.getElementById("expBreakdownUser").value,
  );
  const r = readPeriodRange("#expBreakdownMonthFrom", "#expBreakdownMonthTo");
  if (!r) return;
  expBreakdownMonthFrom = r.mf;
  expBreakdownYearFrom = r.yf;
  expBreakdownMonthTo = r.mt;
  expBreakdownYearTo = r.yt;
  document.getElementById("expBreakdownCriteria").textContent =
    `${criteriaUser(expBreakdownUserId)} | ${criteriaPeriod(r.mf, r.yf, r.mt, r.yt)}`;
  loadExpBreakdownData();
}

async function loadExpBreakdownData(catExpenses) {
  try {
    if (!catExpenses) {
      const uid = expBreakdownUserId;
      const mf = expBreakdownMonthFrom,
        yf = expBreakdownYearFrom;
      const mt = expBreakdownMonthTo,
        yt = expBreakdownYearTo;
      catExpenses = await apiRequest(
        "GET",
        `/dashboard/admin/expenses-by-category?userId=${uid}&monthFrom=${mf}&yearFrom=${yf}&monthTo=${mt}&yearTo=${yt}`,
      );
    }
    adminCategoryChartData = Array.isArray(catExpenses) ? catExpenses : [];

    if (adminCategoryChartData.length === 0) {
      destroyChart("adminCategory");
      destroyChart("adminSubcategory");
      const chartsEl = document.querySelector(
        '[data-tab-panel="expBreakdown"] .dashboard-charts',
      );
      if (chartsEl)
        chartsEl.innerHTML =
          '<div class="empty-state">Sin informaci&oacute;n para mostrar</div>';
      return;
    }

    const chartsEl = document.querySelector(
      '[data-tab-panel="expBreakdown"] .dashboard-charts',
    );
    if (chartsEl && chartsEl.querySelector(".empty-state")) {
      chartsEl.innerHTML = `
                <div class="chart-card">
                    <p class="chart-title">Gastos por categor&iacute;a</p>
                    <div class="chart-wrapper"><canvas id="adminCategoryChart" role="img" aria-label="Gráfico de gastos por categoría"></canvas></div>
                </div>
                <div class="chart-card">
                    <div class="chart-header chart-header--row">
                        <span class="chart-header-label">Distribuci&oacute;n de </span>
                        <select id="adminCategoryFilter" onchange="window.handleAdminCategoryFilterChange()">
                            <option value="">Seleccionar</option>
                        </select>
                    </div>
                    <div class="chart-wrapper"><canvas id="adminSubcategoryChart" role="img" aria-label="Gráfico de gastos por subcategoría"></canvas></div>
                </div>`;
    }

    renderAdminCategoryChart(adminCategoryChartData);

    const expenseCats = cachedCategories.filter((c) => c.type === "EXPENSE");
    const catSelect = document.getElementById("adminCategoryFilter");
    if (catSelect) {
      catSelect.innerHTML = '<option value="">Seleccionar</option>';
      expenseCats.forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.name;
        catSelect.appendChild(opt);
      });
      if (adminCategoryChartData.length > 0) {
        const highest = adminCategoryChartData.reduce((a, b) =>
          a.total > b.total ? a : b,
        );
        catSelect.value = highest.categoryId;
        adminCategoryFilter = highest.categoryId;
      } else {
        adminCategoryFilter = null;
      }
      loadAdminSubcategoryChart();
    }
  } catch (err) {
    console.error("Error loading category chart:", err);
    destroyChart("adminCategory");
    destroyChart("adminSubcategory");
  }
}

function renderAdminCategoryChart(data) {
  destroyChart("adminCategory");
  adminCategoryChartData = data;
  const canvas = document.getElementById("adminCategoryChart");
  if (!canvas || !data.length) return;

  const onClick = createDrillDownHandler(
    adminCategoryChartData,
    "adminCategoryFilter",
    "adminCategoryFilter",
    loadAdminSubcategoryChart,
  );

  chartAdminCategory = createDoughnutChart(
    "adminCategoryChart",
    data.map((d) => d.categoryName),
    data.map((d) => d.total),
    onClick,
  );
}

async function loadAdminSubcategoryChart() {
  if (!adminCategoryFilter) {
    destroyChart("adminSubcategory");
    return;
  }
  try {
    const uid = expBreakdownUserId;
    const mf = expBreakdownMonthFrom,
      yf = expBreakdownYearFrom;
    const mt = expBreakdownMonthTo,
      yt = expBreakdownYearTo;
    const res = await apiRequest(
      "GET",
      `/dashboard/admin/expenses-by-subcategory?userId=${uid}&categoryId=${adminCategoryFilter}&monthFrom=${mf}&yearFrom=${yf}&monthTo=${mt}&yearTo=${yt}`,
    );
    renderAdminSubcategoryChart(Array.isArray(res) ? res : []);
  } catch (err) {
    console.error("Error loading subcategory chart:", err);
    destroyChart("adminSubcategory");
  }
}

function renderAdminSubcategoryChart(data) {
  renderSubcategoryDoughnut("adminSubcategoryChart", "adminSubcategory", data);
}

function handleAdminCategoryFilterChange() {
  const sel = document.getElementById("adminCategoryFilter");
  if (!sel) return;
  adminCategoryFilter = sel.value ? parseInt(sel.value) : null;
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

    populateUserSelect("sec2UserSelect", sec2UserId);
    populateUserSelect("montosUserSelect", montosUserId);
    populateUserSelect("expBreakdownUser", expBreakdownUserId);

    const mf1 = sec1MonthFrom,
      yf1 = sec1YearFrom,
      mt1 = sec1MonthTo,
      yt1 = sec1YearTo;
    const mf2 = sec2MonthFrom,
      yf2 = sec2YearFrom,
      mt2 = sec2MonthTo,
      yt2 = sec2YearTo;
    const mf5 = sec5MonthFrom,
      yf5 = sec5YearFrom,
      mt5 = sec5MonthTo,
      yt5 = sec5YearTo;
    const mfExp = expBreakdownMonthFrom,
      yfExp = expBreakdownYearFrom;
    const mtExp = expBreakdownMonthTo,
      ytExp = expBreakdownYearTo;

    const [
      sec1Data,
      sec2Data,
      montosMoneyData,
      montosAvgData,
      sec5Data,
      sec6Data,
      expBreakdownData,
    ] = await Promise.all([
      apiRequest(
        "GET",
        `/dashboard/admin/user-evolution?monthFrom=${mf1}&yearFrom=${yf1}&monthTo=${mt1}&yearTo=${yt1}`,
      ),
      apiRequest(
        "GET",
        `/dashboard/admin/transaction-evolution?monthFrom=${mf2}&yearFrom=${yf2}&monthTo=${mt2}&yearTo=${yt2}&userId=${sec2UserId}`,
      ),
      apiRequest(
        "GET",
        `/dashboard/admin/money-movement?userId=${montosUserId}`,
      ),
      apiRequest("GET", `/dashboard/admin/averages?userId=${montosUserId}`),
      apiRequest(
        "GET",
        `/dashboard/admin/top-users?monthFrom=${mf5}&yearFrom=${yf5}&monthTo=${mt5}&yearTo=${yt5}`,
      ),
      apiRequest(
        "GET",
        `/dashboard/admin/activity-distribution?month=${sec6Month}&year=${sec6Year}`,
      ),
      apiRequest(
        "GET",
        `/dashboard/admin/expenses-by-category?userId=${expBreakdownUserId}&monthFrom=${mfExp}&yearFrom=${yfExp}&monthTo=${mtExp}&yearTo=${ytExp}`,
      ),
    ]);

    renderAdminHeroCards({
      sec1Data,
      sec2Data,
      montosMoneyData,
      montosAvgData,
      sec5Data,
      sec6Data,
      expBreakdownData,
    });
    renderSec1(sec1Data);
    renderSec2(sec2Data);
    renderMontosCards(montosMoneyData, montosAvgData);
    renderSec5(sec5Data);
    renderSec6(sec6Data);
    loadExpBreakdownData(expBreakdownData);
  } catch (err) {
    showToast("Error al cargar datos del panel", "error");
    ["sec1Cards", "sec2Cards", "montosCards", "sec5Cards", "sec6Cards"].forEach(
      (id) => {
        const el = document.getElementById(id);
        if (el)
          el.innerHTML =
            '<div class="error-message">Error al cargar datos</div>';
      },
    );
  }
}

function renderAdminHeroCards(allData) {
  const el = document.getElementById("adminHeroCards");
  if (!el) return;

  const sec1 = allData.sec1Data;
  const money = allData.montosMoneyData;

  const activeUsers = sec1?.summary?.activeUsers?.current ?? "—";
  const totalIncome =
    money?.totalIncome != null ? formatMoney(money.totalIncome) : "—";
  const totalExpense =
    money?.totalExpense != null ? formatMoney(money.totalExpense) : "—";
  const totalBalance =
    money?.totalBalance != null ? formatMoney(money.totalBalance) : "—";
  const balanceColor =
    money?.totalBalance != null
      ? Number(money.totalBalance) >= 0
        ? "var(--income)"
        : "var(--expense)"
      : "var(--text)";

  const usersChange = sec1?.summary?.activeUsers
    ? renderComparisonIndicator(
        sec1.summary.activeUsers.current,
        sec1.summary.activeUsers.previous,
      )
    : "";
  const incomeChange =
    money?.currentMonthIncome != null && money?.previousMonthIncome != null
      ? renderComparisonIndicator(
          Number(money.currentMonthIncome),
          Number(money.previousMonthIncome),
        )
      : "";
  const expenseChange =
    money?.currentMonthExpense != null && money?.previousMonthExpense != null
      ? renderComparisonIndicator(
          Number(money.currentMonthExpense),
          Number(money.previousMonthExpense),
        )
      : "";
  const balanceChange =
    money?.currentMonthBalance != null && money?.previousMonthBalance != null
      ? renderComparisonIndicator(
          Number(money.currentMonthBalance),
          Number(money.previousMonthBalance),
        )
      : "";

  el.innerHTML = `
        <div class="admin-hero-card">
            <span class="admin-hero-label">Usuarios activos</span>
            <span class="admin-hero-value">${Number(activeUsers).toLocaleString("es-ES")}</span>
            ${usersChange}
        </div>
        <div class="admin-hero-card income">
            <span class="admin-hero-label">Ingresos totales</span>
            <span class="admin-hero-value">${totalIncome}</span>
            ${incomeChange}
        </div>
        <div class="admin-hero-card expense">
            <span class="admin-hero-label">Gastos totales</span>
            <span class="admin-hero-value">${totalExpense}</span>
            ${expenseChange}
        </div>
        <div class="admin-hero-card">
            <span class="admin-hero-label">Balance total</span>
            <span class="admin-hero-value" style="color:${balanceColor}">${totalBalance}</span>
            ${balanceChange}
        </div>`;
}

async function loadAdminUsers() {
  try {
    const res = await apiRequest(
      "GET",
      "/admin/users?role=USER&status=ACTIVE&size=100&sort=name,asc",
    );
    adminUsers = res?.content || [];
  } catch (err) {
    console.error("Error loading admin users:", err);
  }
}

function updateAdminTimestamp() {
  const el = document.getElementById("adminDashboardTimestamp");
  if (!el || !adminLastUpdate) return;
  const d = adminLastUpdate;
  const pad = (n) => String(n).padStart(2, "0");
  el.textContent = `Última actualización: ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

  const sub = document.getElementById("adminPeriodSubtitle");
  if (sub) {
    sub.innerHTML = `<h3>${MONTH_NAMES_FULL[d.getMonth()]} ${d.getFullYear()}</h3><span>(% variaciones respecto al mes anterior)</span>`;
  }
}

// ===================================================================
// SECTION 1 — EVOLUCIÓN DE USUARIOS
// ===================================================================
function handleApplySec1() {
  applyPeriodFilter("#sec1MonthFrom", "#sec1MonthTo", "sec1Criteria", r => {
    sec1MonthFrom = r.mf; sec1YearFrom = r.yf; sec1MonthTo = r.mt; sec1YearTo = r.yt;
  }, loadSec1Data);
}

async function loadSec1Data() {
  try {
    const data = await apiRequest(
      "GET",
      `/dashboard/admin/user-evolution?monthFrom=${sec1MonthFrom}&yearFrom=${sec1YearFrom}&monthTo=${sec1MonthTo}&yearTo=${sec1YearTo}`,
    );
    renderSec1(data);
  } catch (err) {
    console.error("Error loading sec1 data:", err);
    destroyChart("userGrowth");
    document.getElementById("sec1Cards").innerHTML =
      '<div class="error-message">Error al cargar</div>';
  }
}

function renderSec1(data) {
  if (!data) return;
  const monthly = data.monthly || [];
  const hasData = monthly.some(
    (d) => d.activeUsers > 0 || d.registeredUsers > 0,
  );
  if (!hasData) {
    destroyChart("userGrowth");
    showEmptyState("sec1Cards");
    return;
  }
  const s = data.summary;
  document.getElementById("sec1Cards").innerHTML = `
        <div class="stat-card">
            <span class="stat-card-label">Registrados en el Periodo</span>
            <span class="stat-card-value">${Number(s.registeredUsers.current).toLocaleString("es-ES")}</span>
        </div>`;

  renderSec1Chart(monthly);
}

function renderSec1Chart(monthly) {
  const canvas = document.getElementById("sec1Chart");
  if (!canvas) return;
  const labels = monthly.map(
    (d) => MONTH_NAMES_SHORT[d.month - 1] + " " + d.year,
  );
  const textColor = getChartTextColor();
  const gridColor = getChartGridColor();

  if (chartUserGrowth) {
    chartUserGrowth.data.labels = labels;
    chartUserGrowth.data.datasets[0].data = monthly.map((d) => d.activeUsers);
    chartUserGrowth.data.datasets[1].data = monthly.map(
      (d) => d.registeredUsers,
    );
    chartUserGrowth.options.scales.x.ticks.color = textColor;
    chartUserGrowth.options.scales.x.grid.color = gridColor;
    chartUserGrowth.options.scales.y.ticks.color = textColor;
    chartUserGrowth.options.scales.y.grid.color = gridColor;
    chartUserGrowth.options.plugins.legend.labels.color = textColor;
    chartUserGrowth.update();
  } else {
    chartUserGrowth = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Activos",
            data: monthly.map((d) => d.activeUsers),
            borderColor: getCssVar("--primary"),
            backgroundColor: `rgba(${getCssVar("--primary-rgb") || "142,47,55"},0.06)`,
            fill: false,
            tension: 0.3,
            pointRadius: 3,
          },
          {
            label: "Registrados",
            data: monthly.map((d) => d.registeredUsers),
            borderColor: getCssVar("--income"),
            backgroundColor: `rgba(${getCssVar("--income-rgb") || "82,153,139"},0.06)`,
            fill: false,
            tension: 0.3,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: textColor, boxWidth: 12, padding: 12 },
          },
          datalabels: {
            display: true,
            align: "top",
            anchor: "end",
            formatter: (value) => value,
            color: textColor,
          },
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: {
            ticks: { color: textColor },
            grid: { color: gridColor },
            beginAtZero: true,
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }
}

// ===================================================================
// SECTION 2 — EVOLUCIÓN DE TRANSACCIONES
// ===================================================================
function handleApplySec2() {
  sec2UserId = parseInt(document.getElementById("sec2UserSelect").value);
  const r = readPeriodRange("#sec2MonthFrom", "#sec2MonthTo");
  if (!r) return;
  sec2MonthFrom = r.mf;
  sec2YearFrom = r.yf;
  sec2MonthTo = r.mt;
  sec2YearTo = r.yt;
  document.getElementById("sec2Criteria").textContent =
    `${criteriaUser(sec2UserId)} | ${criteriaPeriod(r.mf, r.yf, r.mt, r.yt)}`;
  loadSec2Data();
}

async function loadSec2Data() {
  try {
    const data = await apiRequest(
      "GET",
      `/dashboard/admin/transaction-evolution?monthFrom=${sec2MonthFrom}&yearFrom=${sec2YearFrom}&monthTo=${sec2MonthTo}&yearTo=${sec2YearTo}&userId=${sec2UserId}`,
    );
    renderSec2(data);
  } catch (err) {
    console.error("Error loading sec2 data:", err);
    destroyChart("incomeVsExpense");
    document.getElementById("sec2Cards").innerHTML =
      '<div class="error-message">Error al cargar</div>';
  }
}

function renderSec2(data) {
  if (!data) return;
  const monthly = data.monthly || [];
  const hasData = monthly.some(
    (d) =>
      d.txCount > 0 || Number(d.incomeTotal) > 0 || Number(d.expenseTotal) > 0,
  );
  if (!hasData) {
    destroyChart("incomeVsExpense");
    showEmptyState("sec2Cards");
    return;
  }
  const s = data.summary;
  document.getElementById("sec2Cards").innerHTML = `
        <div class="stat-card">
            <span class="stat-card-label">Transacciones / mes, en el Periodo</span>
            <span class="stat-card-value">${Number(s.transactionsPerMonth.current).toLocaleString("es-ES")}</span>
        </div>
        <div class="stat-card">
            <span class="stat-card-label">Promedio / usuario, en el Periodo</span>
            <span class="stat-card-value">${Number(s.avgPerUser.current).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
        </div>`;

  renderSec2Chart(monthly);
}

function renderSec2Chart(monthly) {
  const canvasTx = document.getElementById("sec2Chart");
  if (!canvasTx) return;
  const labels = monthly.map(
    (d) => MONTH_NAMES_SHORT[d.month - 1] + " " + d.year,
  );
  const textColor = getChartTextColor();
  const gridColor = getChartGridColor();

  if (chartIncomeVsExpense) {
    chartIncomeVsExpense.data.labels = labels;
    chartIncomeVsExpense.data.datasets[0].data = monthly.map((d) =>
      Number(d.incomeTotal),
    );
    chartIncomeVsExpense.data.datasets[1].data = monthly.map((d) =>
      Number(d.expenseTotal),
    );
    chartIncomeVsExpense.options.scales.x.ticks.color = textColor;
    chartIncomeVsExpense.options.scales.x.grid.color = gridColor;
    chartIncomeVsExpense.options.scales.y.ticks.color = textColor;
    chartIncomeVsExpense.options.scales.y.grid.color = gridColor;
    chartIncomeVsExpense.options.plugins.legend.labels.color = textColor;
    chartIncomeVsExpense.update();
  } else {
    chartIncomeVsExpense = new Chart(canvasTx.getContext("2d"), {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Ingresos",
            data: monthly.map((d) => Number(d.incomeTotal)),
            backgroundColor: `rgba(${getCssVar("--income-rgb") || "82,153,139"},0.7)`,
            borderRadius: 4,
          },
          {
            label: "Gastos",
            data: monthly.map((d) => Number(d.expenseTotal)),
            backgroundColor: `rgba(${getCssVar("--expense-rgb") || "206,55,55"},0.7)`,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: textColor, boxWidth: 12, padding: 12 },
          },
          datalabels: {
            display: true,
            anchor: "end",
            align: "top",
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
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: {
            ticks: { color: textColor },
            grid: { color: gridColor },
            beginAtZero: true,
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }
}

// ===================================================================
// MONTOS POR USUARIO (unified money movement + averages)
// ===================================================================
function handleApplyMontos() {
  montosUserId = parseInt(document.getElementById("montosUserSelect").value);
  updateMontosTitle();
  loadMontosData();
}

async function loadMontosData() {
  try {
    const [moneyData, avgData] = await Promise.all([
      apiRequest(
        "GET",
        `/dashboard/admin/money-movement?userId=${montosUserId}`,
      ),
      apiRequest("GET", `/dashboard/admin/averages?userId=${montosUserId}`),
    ]);
    renderMontosCards(moneyData, avgData);
  } catch (err) {
    console.error("Error loading montos data:", err);
    document.getElementById("montosCards").innerHTML =
      '<div class="error-message">Error al cargar</div>';
  }
}

function renderMontosCards(moneyData, avgData) {
  const el = document.getElementById("montosCards");
  if (!el) return;
  const m = moneyData || {};
  const a = avgData || {};
  el.innerHTML = `
        <div class="stat-card">
            <span class="stat-card-label">Total Ingresos</span>
            <span class="stat-card-value" style="color:var(--income)">${m.totalIncome != null ? formatMoney(m.totalIncome) : "—"}</span>
        </div>
        <div class="stat-card">
            <span class="stat-card-label">Total Gastos</span>
            <span class="stat-card-value" style="color:var(--expense)">${m.totalExpense != null ? formatMoney(m.totalExpense) : "—"}</span>
        </div>
        <div class="stat-card">
            <span class="stat-card-label">Total Balance</span>
            <span class="stat-card-value" style="color:${Number(m.totalBalance) >= 0 ? "var(--income)" : "var(--expense)"}">${m.totalBalance != null ? formatMoney(m.totalBalance) : "—"}</span>
        </div>
        <div class="stat-card">
            <span class="stat-card-label">Ingresos Promedio</span>
            <span class="stat-card-value">${a.globalAvgIncomePerUser != null ? formatMoney(a.globalAvgIncomePerUser) : "—"}</span>
        </div>
        <div class="stat-card">
            <span class="stat-card-label">Gastos Promedio</span>
            <span class="stat-card-value">${a.globalAvgExpensePerUser != null ? formatMoney(a.globalAvgExpensePerUser) : "—"}</span>
        </div>
        <div class="stat-card">
            <span class="stat-card-label">Transacciones Promedio</span>
            <span class="stat-card-value">${a.globalAvgTransactionsPerUser != null ? Number(a.globalAvgTransactionsPerUser).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "—"}</span>
        </div>`;
}

// ===================================================================
// SECTION 5 — TOP USUARIOS
// ===================================================================
function handleApplySec5() {
  applyPeriodFilter("#sec5MonthFrom", "#sec5MonthTo", "sec5Criteria", r => {
    sec5MonthFrom = r.mf; sec5YearFrom = r.yf; sec5MonthTo = r.mt; sec5YearTo = r.yt;
  }, loadSec5Data);
}

async function loadSec5Data() {
  try {
    const data = await apiRequest(
      "GET",
      `/dashboard/admin/top-users?monthFrom=${sec5MonthFrom}&yearFrom=${sec5YearFrom}&monthTo=${sec5MonthTo}&yearTo=${sec5YearTo}`,
    );
    renderSec5(data);
  } catch (err) {
    console.error("Error loading sec5 data:", err);
    document.getElementById("sec5Cards").innerHTML =
      '<div class="error-message">Error al cargar</div>';
  }
}

function renderSec5(data) {
  if (!data) return;
  const txList = data.topByTransactions || [];
  const expList = data.topByExpenses || [];
  const incList = data.topByIncome || [];
  const hasData = txList.length > 0 || expList.length > 0 || incList.length > 0;
  if (!hasData) {
    showEmptyState("sec5Cards");
    return;
  }
  document.getElementById("sec5Cards").innerHTML = `
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
  if (!entries.length)
    return '<p style="font-size:0.8rem;color:var(--text-secondary)">Sin datos</p>';
  let html =
    '<table class="mini-table"><thead><tr><th>#</th><th>Usuario</th><th style="text-align:right">Valor</th></tr></thead><tbody>';
  entries.forEach((e, i) => {
    const val = isMoney
      ? formatMoney(e.value)
      : Number(e.value).toLocaleString("es-ES");
    html += `<tr><td class="rank">${i + 1}</td><td class="user-name">${escHtml(e.userName)}</td><td class="user-value">${val}</td></tr>`;
  });
  html += "</tbody></table>";
  return html;
}

// ===================================================================
// SECTION 6 — DISTRIBUCIÓN POR ACTIVIDAD
// ===================================================================
function handleApplySec6() {
  const [y, m] = getMonthPickerValue("#sec6Month").split("-").map(Number);
  sec6Year = y;
  sec6Month = m;
  document.getElementById("sec6Criteria").textContent = criteriaMonth(m, y);
  loadSec6Data();
}

async function loadSec6Data() {
  try {
    const data = await apiRequest(
      "GET",
      `/dashboard/admin/activity-distribution?month=${sec6Month}&year=${sec6Year}`,
    );
    renderSec6(data);
  } catch (err) {
    console.error("Error loading sec6 data:", err);
    document.getElementById("sec6Cards").innerHTML =
      '<div class="error-message">Error al cargar</div>';
  }
}

function renderSec6(data) {
  if (!data) return;
  const cats = [
    { key: "frecuente", label: "Frecuente", desc: ">20 tx", cls: "frecuente" },
    { key: "regular", label: "Regular", desc: "5–20 tx", cls: "regular" },
    { key: "ocasional", label: "Ocasional", desc: "1–4 tx", cls: "ocasional" },
    { key: "inactivo", label: "Inactivo", desc: "0 tx", cls: "inactivo" },
  ];
  const hasData = cats.some((c) => (data[c.key]?.count || 0) > 0);
  if (!hasData) {
    showEmptyState("sec6Cards");
    return;
  }
  let html = '<div class="activity-bars">';
  cats.forEach((c) => {
    const cat = data[c.key] || { count: 0, percentage: 0 };
    html += `
            <div class="activity-row">
                <span class="activity-label">${c.label}</span>
                <div class="activity-bar"><div class="activity-bar-fill ${c.cls}" style="transform:scaleX(${cat.percentage / 100})"></div></div>
                <span class="activity-percent">${cat.percentage}%</span>
                <span class="activity-count">(${cat.count})</span>
            </div>`;
  });
  html += "</div>";
  html += `<div class="activity-legend">
        <span class="activity-legend-item"><span class="activity-dot frecuente"></span> Frecuente: m&aacute;s de 20 transacciones</span>
        <span class="activity-legend-item"><span class="activity-dot regular"></span> Regular: 5–20 transacciones</span>
        <span class="activity-legend-item"><span class="activity-dot ocasional"></span> Ocasional: 1–4 transacciones</span>
        <span class="activity-legend-item"><span class="activity-dot inactivo"></span> Inactivo: 0 transacciones (registrados en el mes)</span>
    </div>`;
  document.getElementById("sec6Cards").innerHTML = html;
}

window.handleApplySec1 = handleApplySec1;
window.handleApplySec2 = handleApplySec2;
window.handleApplyMontos = handleApplyMontos;
window.handleApplySec5 = handleApplySec5;
window.handleApplySec6 = handleApplySec6;
window.handleApplyExpBreakdown = handleApplyExpBreakdown;
window.handleAdminCategoryFilterChange = handleAdminCategoryFilterChange;
