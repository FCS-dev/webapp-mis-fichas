// ===================================================================
// PAGINATION HELPER
// ===================================================================
function buildPaginationHtml(pagination, handlerFn) {
  const { currentPage, totalPages, first, last } = pagination;
  let html = '<nav class="pagination" aria-label="Paginación">';
  html += `<button class="btn-page" onclick="${handlerFn}(${currentPage - 1})" ${first ? "disabled" : ""} aria-label="Página anterior">Anterior</button>`;
  const start = Math.max(0, currentPage - 2);
  const end = Math.min(totalPages - 1, currentPage + 2);
  for (let i = start; i <= end; i++) {
    const active = i === currentPage;
    html += `<button class="btn-page${active ? " btn-page-active" : ""}" onclick="${handlerFn}(${i})"${active ? ' aria-current="page"' : ""}>${i + 1}</button>`;
  }
  html += `<button class="btn-page" onclick="${handlerFn}(${currentPage + 1})" ${last ? "disabled" : ""} aria-label="Página siguiente">Siguiente</button>`;
  html += "</nav>";
  return html;
}

function buildPageSizeSelect(currentSize, onChangeFn) {
  const sizes = [10, 15, 20, 25, 30, 35, 40, 45, 50];
  let html =
    '<label class="page-size-label">Cantidad de filas a mostrar: <select class="page-size-select" onchange="' +
    onChangeFn +
    '(this.value)">';
  sizes.forEach((s) => {
    html += `<option value="${s}"${s === currentSize ? " selected" : ""}>${s}</option>`;
  });
  html += `<option value="9999"${currentSize >= 9999 ? " selected" : ""}>Todo</option>`;
  html += "</select></label>";
  return html;
}
