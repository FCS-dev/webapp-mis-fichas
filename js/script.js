function initTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.setAttribute('aria-pressed', isDark);
        btn.innerHTML = getThemeIcon(isDark);
    });
    if (window.refreshChartTheme) window.refreshChartTheme();
    updateLogoSrc();
}

function router() {
    const hash = window.location.hash || '#login';
    if (hash === '#login') return renderLogin();
    if (hash === '#register') return renderRegister();
    if (hash === '#dashboard') {
        if (!getAccessToken()) {
            window.location.hash = '#login';
            return;
        }
        return renderDashboard();
    }
    window.location.hash = '#login';
}

window.addEventListener('hashchange', router);
window.onerror = function(msg) {
    if (msg?.includes('startTime')) return true;
};
window.addEventListener('load', () => {
    initTheme();
    router();
});

window.toggleTheme = toggleTheme;
