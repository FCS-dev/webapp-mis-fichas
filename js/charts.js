// ===================================================================
// CHARTS
// ===================================================================
function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const CHART_COLORS = [
    '#4f46e5', '#059669', '#dc2626', '#f59e0b', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
    '#06b6d4', '#d946ef', '#eab308', '#3b82f6', '#22c55e'
];

function getChartTextColor() {
    return document.documentElement.classList.contains('dark') ? getCssVar('--text') : '#475569';
}

function getChartGridColor() {
    return document.documentElement.classList.contains('dark') ? getCssVar('--border') : '#e2e8f0';
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

function createDoughnutChart(canvasId, labels, values, onClick) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !values.length) return null;
    const colors = generateColors(values.length);
    return new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{ data: values, backgroundColor: colors, borderWidth: 0 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            ...(onClick ? { onClick } : {}),
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: getChartTextColor(), boxWidth: 12, padding: 12 }
                }
            }
        }
    });
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
            ctx.fillStyle = isDark ? getCssVar('--text') : '#1e293b';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)';
            ctx.shadowBlur = 3;
            ctx.fillText(formatMoney(value), pos.x, pos.y);
        });
        ctx.restore();
    }
});

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

function renderSubcategoryDoughnut(canvasId, chartRefProp, data) {
    if (chartRefProp === 'subcategory' && chartSubcategory) { chartSubcategory.destroy(); chartSubcategory = null; }
    else if (chartRefProp === 'adminSubcategory' && chartAdminSubcategory) { chartAdminSubcategory.destroy(); chartAdminSubcategory = null; }
    const canvas = document.getElementById(canvasId);
    if (!canvas || !data.length) return null;
    const chart = createDoughnutChart(canvasId, data.map(d => d.subcategoryName), data.map(d => d.total));
    if (chartRefProp === 'subcategory') chartSubcategory = chart;
    else if (chartRefProp === 'adminSubcategory') chartAdminSubcategory = chart;
    return chart;
}
