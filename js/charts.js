// ===================================================================
// CHARTS
// ===================================================================
function getCssVar(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

const CHART_COLORS = [
  getCssVar("--primary") || "#8e2f37",
  getCssVar("--income") || "#52998b",
  getCssVar("--expense") || "#ce3737",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
  "#06b6d4",
  "#d946ef",
  "#eab308",
  "#3b82f6",
  "#22c55e",
];

function getChartTextColor() {
  return document.documentElement.classList.contains("dark")
    ? getCssVar("--text")
    : "#475569";
}

function getChartGridColor() {
  return document.documentElement.classList.contains("dark")
    ? getCssVar("--border")
    : "#e2e8f0";
}

const _charts = {
  category:       [() => chartCategory,       v => (chartCategory = v)],
  subcategory:    [() => chartSubcategory,    v => (chartSubcategory = v)],
  balance:        [() => chartBalance,         v => (chartBalance = v)],
  userGrowth:     [() => chartUserGrowth,     v => (chartUserGrowth = v)],
  incomeVsExpense:[() => chartIncomeVsExpense,v => (chartIncomeVsExpense = v)],
  adminCategory:  [() => chartAdminCategory,  v => (chartAdminCategory = v)],
  adminSubcategory:[() => chartAdminSubcategory,v => (chartAdminSubcategory = v)],
};

function destroyChart(ref) {
  const [get, set] = _charts[ref] || [];
  if (get?.()) { try { get().stop(); get().destroy(); } catch {} set(null); }
}

function destroyAllCharts() {
  Object.keys(_charts).forEach(destroyChart);
}

function createDrillDownHandler(chartData, filterSelectId, filterVar, loadFn) {
  return (event, elements) => {
    if (elements.length > 0) {
      const idx = elements[0].index;
      const catData = chartData[idx];
      if (!catData || !catData.categoryId) return;
      const sel = document.getElementById(filterSelectId);
      if (!sel) return;
      const opt = sel.querySelector(`option[value="${catData.categoryId}"]`);
      if (!opt) return;
      sel.value = catData.categoryId;
      sel.dispatchEvent(new Event("change"));
    }
  };
}

function createDoughnutChart(canvasId, labels, values, onClick) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !values.length) return null;
  const colors = values.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);
  return new Chart(canvas.getContext("2d"), {
    type: "doughnut",
    data: {
      labels,
      datasets: [{ data: values, backgroundColor: colors, borderWidth: 0 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      ...(onClick ? { onClick } : {}),
      plugins: {
        legend: {
          position: window.innerWidth < 641 ? "bottom" : "right",
          maxWidth: 100,
          labels: {
            color: getChartTextColor(),
            boxWidth: 12,
            padding: 8,
            font: { size: 10 },
          },
        },
      },
    },
  });
}

// ===================================================================
// DOUGHNUT VALUE LABELS — custom Chart.js plugin
// ===================================================================
Chart.register({
  id: "doughnutLabels",
  afterDraw(chart) {
    if (chart.config.type !== "doughnut") return;
    const ctx = chart.ctx;
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.length) return;
    const isDark = document.documentElement.classList.contains("dark");
    ctx.save();
    meta.data.forEach((el, i) => {
      const value = chart.data.datasets[0].data[i];
      if (!value) return;
      const pos = el.tooltipPosition();
      ctx.font = "bold 11px sans-serif";
      ctx.fillStyle = isDark ? getCssVar("--text") : "#1e293b";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.6)";
      ctx.shadowBlur = 3;
      ctx.fillText(formatMoney(value), pos.x, pos.y);
    });
    ctx.restore();
  },
});

function refreshChartTheme() {
  const textColor = getChartTextColor();
  const gridColor = getChartGridColor();

  [
    chartCategory,
    chartSubcategory,
    chartBalance,
    chartUserGrowth,
    chartIncomeVsExpense,
    chartAdminCategory,
    chartAdminSubcategory,
  ].forEach((chart) => {
    if (!chart) return;

    const legendLabels = chart.options.plugins?.legend?.labels;
    if (legendLabels) legendLabels.color = textColor;

    const scales = chart.options.scales;
    if (scales) {
      Object.values(scales).forEach((scale) => {
        if (scale.ticks) scale.ticks.color = textColor;
        if (scale.grid && scale.grid.display !== false) {
          scale.grid.color = gridColor;
        }
      });
    }

    const datalabels = chart.options.plugins?.datalabels;
    if (datalabels) datalabels.color = textColor;

    chart.update("none");
  });
}

window.refreshChartTheme = refreshChartTheme;

function renderSubcategoryDoughnut(canvasId, chartRefProp, data) {
  destroyChart(chartRefProp);
  const canvas = document.getElementById(canvasId);
  if (!canvas || !data.length) return null;
  const chart = createDoughnutChart(
    canvasId,
    data.map((d) => d.subcategoryName),
    data.map((d) => d.total),
  );
  _charts[chartRefProp]?.[1]?.(chart);
  return chart;
}
