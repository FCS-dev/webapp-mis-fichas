function initTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    }
}

function getThemeIcon() {
    return document.documentElement.classList.contains('dark') ? '\u2600' : '\u263E';
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.textContent = getThemeIcon();
    });
    if (window.refreshChartTheme) window.refreshChartTheme();
    updateLogoSrc();
}

function router() {
    const hash = window.location.hash || '#login';
    if (hash === '#login') return renderLogin();
    if (hash === '#register') return renderRegister();
    if (hash === '#dashboard') {
        if (!getTokens()) {
            window.location.hash = '#login';
            return;
        }
        return renderDashboard();
    }
    window.location.hash = '#login';
}

window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
    initTheme();
    router();
});

window.toggleTheme = toggleTheme;
