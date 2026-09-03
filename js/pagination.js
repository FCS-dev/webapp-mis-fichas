// ===================================================================
// PAGINATION HELPER
// ===================================================================
function buildPaginationHtml(pagination, handlerFn) {
    const { currentPage, totalPages, first, last } = pagination;
    let html = '<nav class="pagination" aria-label="Paginación">';
    html += `<button class="btn-page" onclick="${handlerFn}(${currentPage - 1})" ${first ? 'disabled' : ''} aria-label="Página anterior">Anterior</button>`;
    const start = Math.max(0, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);
    for (let i = start; i <= end; i++) {
        const active = i === currentPage;
        html += `<button class="btn-page${active ? ' btn-page-active' : ''}" onclick="${handlerFn}(${i})"${active ? ' aria-current="page"' : ''}>${i + 1}</button>`;
    }
    html += `<button class="btn-page" onclick="${handlerFn}(${currentPage + 1})" ${last ? 'disabled' : ''} aria-label="Página siguiente">Siguiente</button>`;
    html += '</nav>';
    return html;
}
