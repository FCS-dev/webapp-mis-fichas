// ===================================================================
// MODAL
// ===================================================================
function showModal({ title, bodyHtml }) {
    const prev = document.getElementById('modalOverlay');
    if (prev) prev.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modalOverlay';
    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${escHtml(title)}</h3>
                <button class="modal-close" id="modalCloseBtn">&#x2715;</button>
            </div>
            <div class="modal-body">
                ${bodyHtml}
            </div>
        </div>`;

    document.body.appendChild(overlay);

    document.getElementById('modalCloseBtn').addEventListener('click', hideModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) hideModal();
    });

    const first = overlay.querySelector('input, select, textarea, button');
    if (first) setTimeout(() => first.focus(), 100);
}

function hideModal() {
    const el = document.getElementById('modalOverlay');
    if (el) el.remove();
}

function showConfirm(message, onConfirm) {
    showModal({
        title: 'Confirmar',
        bodyHtml: `
            <p class="confirm-text">${escHtml(message)}</p>
            <div class="confirm-actions">
                <button class="btn-secondary" id="confirmCancel">Cancelar</button>
                <button class="btn-primary" id="confirmOk">Eliminar</button>
            </div>`
    });
    document.getElementById('confirmOk').addEventListener('click', () => {
        hideModal();
        onConfirm();
    });
    document.getElementById('confirmCancel').addEventListener('click', hideModal);
}

window.hideModal = hideModal;
