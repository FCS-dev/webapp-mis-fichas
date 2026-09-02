// ===================================================================
// PAGINATION HELPER
// ===================================================================
function buildPaginationHtml(pagination, handlerFn) {
    const { currentPage, totalPages, first, last } = pagination;
    let html = '';
    html += `<button class="btn-page" onclick="${handlerFn}(${currentPage - 1})" ${first ? 'disabled' : ''}>Anterior</button>`;
    const start = Math.max(0, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);
    for (let i = start; i <= end; i++) {
        html += `<button class="btn-page${i === currentPage ? ' btn-page-active' : ''}" onclick="${handlerFn}(${i})">${i + 1}</button>`;
    }
    html += `<button class="btn-page" onclick="${handlerFn}(${currentPage + 1})" ${last ? 'disabled' : ''}>Siguiente</button>`;
    return html;
}
