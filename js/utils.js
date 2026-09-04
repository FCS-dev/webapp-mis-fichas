// ===================================================================
// UTILITIES
// ===================================================================
const MONTH_NAMES_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const MONTH_NAMES_FULL = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const NOW = new Date();
const CURRENT_MONTH = NOW.getMonth() + 1;
const CURRENT_YEAR = NOW.getFullYear();

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
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function getMonthFullName(m) {
    return MONTH_NAMES_FULL[m - 1] || '';
}

function validatePeriod(fromYear, fromMonth, toYear, toMonth) {
    if (toYear < fromYear || (toYear === fromYear && toMonth < fromMonth)) {
        return 'El periodo "Hasta" debe ser posterior o igual a "Desde"';
    }
    return null;
}

function getCategoryName(id) {
    const cat = cachedCategories.find(c => c.id === id);
    return cat ? cat.name : '—';
}

function getCategoryType(id) {
    const cat = cachedCategories.find(c => c.id === id);
    return cat ? cat.type : null;
}

function getLogoSrc(isSmall) {
    const isDark = document.documentElement.classList.contains('dark');
    if (isSmall) {
        return isDark ? 'assets/logo/mis-fichas-logo-solo-oscuro.png' : 'assets/logo/mis-fichas-logo-solo-claro.png';
    }
    return isDark ? 'assets/logo/mis-fichas-logo-modo-oscuro.png' : 'assets/logo/mis-fichas-logo-modo-claro.png';
}

function updateLogoSrc() {
    const src = getLogoSrc(false);
    document.querySelectorAll('.logo').forEach(img => { img.src = src; });
}
