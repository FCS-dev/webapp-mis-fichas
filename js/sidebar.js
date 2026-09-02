// ===================================================================
// SIDEBAR
// ===================================================================
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('open');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('open');
}

window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
