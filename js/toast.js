// ===================================================================
// TOAST
// ===================================================================
function showToast(message, type) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.id = 'toastContainer';
        container.setAttribute('aria-live', 'assertive');
        container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'info');
    toast.setAttribute('role', 'alert');
    toast.textContent = message;
    container.appendChild(toast);
    let timeout;
    const remove = () => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    };
    timeout = setTimeout(remove, 4000);
    toast.addEventListener('mouseenter', () => clearTimeout(timeout));
    toast.addEventListener('mouseleave', () => { timeout = setTimeout(remove, 2000); });
}
