// ===================================================================
// SIDEBAR
// ===================================================================
function toggleSidebar() {
    if (window.innerWidth >= 1024) return;
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const isOpen = sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    sidebar.setAttribute('aria-hidden', !isOpen);
}

function closeSidebar() {
    if (window.innerWidth >= 1024) return;
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('open');
    document.getElementById('sidebar').setAttribute('aria-hidden', 'true');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay && document.activeElement === overlay) {
            e.preventDefault();
            closeSidebar();
        }
    }
});

window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
