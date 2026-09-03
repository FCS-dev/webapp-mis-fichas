// ===================================================================
// MODAL
// ===================================================================
let _modalPreviousFocus = null;

function showModal({ title, bodyHtml }) {
    const prev = document.getElementById('modalOverlay');
    if (prev) prev.remove();

    _modalPreviousFocus = document.activeElement;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modalOverlay';

    const titleId = 'modal-title-' + Date.now();
    overlay.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="${titleId}">
            <div class="modal-header">
                <h3 id="${titleId}">${escHtml(title)}</h3>
                <button class="modal-close" id="modalCloseBtn" aria-label="Cerrar">&#x2715;</button>
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

    document.addEventListener('keydown', _modalKeyHandler);

    const first = overlay.querySelector('input, select, textarea, button:not(.modal-close)');
    if (first) setTimeout(() => first.focus(), 100);
}

function _modalKeyHandler(e) {
    if (e.key === 'Escape') {
        hideModal();
        return;
    }
    if (e.key !== 'Tab') return;

    const overlay = document.getElementById('modalOverlay');
    if (!overlay) return;

    const focusable = overlay.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
        if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
        }
    } else {
        if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
}

function hideModal() {
    document.removeEventListener('keydown', _modalKeyHandler);
    const el = document.getElementById('modalOverlay');
    if (el) el.remove();
    if (_modalPreviousFocus && _modalPreviousFocus.focus) {
        _modalPreviousFocus.focus();
        _modalPreviousFocus = null;
    }
}

function showConfirm(message, onConfirm, confirmLabel = 'Eliminar') {
    showModal({
        title: 'Confirmar',
        bodyHtml: `
            <p class="confirm-text">${escHtml(message)}</p>
            <div class="confirm-actions">
                <button class="btn-secondary" id="confirmCancel">Cancelar</button>
                <button class="btn-danger" id="confirmOk">${escHtml(confirmLabel)}</button>
            </div>`
    });
    document.getElementById('confirmOk').addEventListener('click', () => {
        hideModal();
        onConfirm();
    });
    document.getElementById('confirmCancel').addEventListener('click', hideModal);
}

window.hideModal = hideModal;
