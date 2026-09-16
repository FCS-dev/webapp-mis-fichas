// ADMIN SECURITY SECTION — Bloqueos por fuerza bruta y limpieza de tokens
// ===================================================================

let blockedPage = 0;
let blockedPageSize = 10;
let blockedSort = "email,asc";
let blockedItems = [];
let blockedPagination = null;

const ICON_ARROW_UP =
  '<svg class="sort-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
const ICON_ARROW_DOWN =
  '<svg class="sort-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7"/></svg>';

function renderBlockedUsersSection() {
  blockedPage = 0;
  document.getElementById("dashContent").innerHTML = `
        <div class="section-header">
            <h2>Eliminación de refresh tokens vencidos / Usuarios bloqueados</h2>
            <p>Gesti&oacute;n de bloqueos por intentos fallidos de inicio de sesi&oacute;n</p>
        </div>
        <div id="section-mantenimiento">
          <div class="section-actions" style="margin-bottom:40px;">
            <h3 style="margin-bottom:20px;">🗑️ Eliminación de refresh tokens vencidos</h3>
            <button class="btn-danger" onclick="window.cleanupRefreshTokens()">
              <span class="btn-with-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Limpiar refreshTokens
              </span>
            </button>
          </div>
          <div class="section-actions">
            <h3>🔐 Usuarios Bloqueados</h3>
            <div id="blockedPageSize"></div>
            <div class="table-scroll">
              <table class="data-table">
                <thead>
                  <tr>
                    <th class="sortable-header" onclick="window.toggleBlockedSort('email')">
                      <span class="sort-header-content">Email <span data-sort-indicator="email">${getSortIndicator("email")}</span></span>
                    </th>
                    <th class="sortable-header" onclick="window.toggleBlockedSort('lockedUntil')">
                      <span class="sort-header-content">Desbloqueo <span data-sort-indicator="lockedUntil">${getSortIndicator("lockedUntil")}</span></span>
                    </th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody id="blockedBody">
                  <tr><td colspan="3" class="empty-state">Cargando…</td></tr>
                </tbody>
              </table>
            </div>
            <div class="pagination" id="blockedPagination"></div>
          </div>
        </div>`;

  loadBlockedUsers();
}

async function loadBlockedUsers() {
  try {
    const res = await apiRequest(
      "GET",
      `/admin/security/brute-force/blocked?page=${blockedPage}&size=${blockedPageSize}&sort=${blockedSort}`,
    );
    blockedItems = res?.content || [];
    blockedPagination = res?.pagination || null;

    renderBlockedUsersTable();
    renderBlockedUsersPagination();
  } catch (err) {
    const body = document.getElementById("blockedBody");
    if (body) {
      body.innerHTML = `<tr><td colspan="3" class="empty-state">Error: ${escHtml(err.message)}</td></tr>`;
    }
  }
}

function renderBlockedUsersTable() {
  const tbody = document.getElementById("blockedBody");
  if (!blockedItems.length) {
    tbody.innerHTML =
      '<tr><td colspan="3" class="empty-state">No hay usuarios bloqueados actualmente.</td></tr>';
    return;
  }
  tbody.innerHTML = blockedItems
    .map((item) => {
      const lockedDate = item.lockedUntil
        ? new Date(item.lockedUntil).toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "—";
      return `<tr>
            <td>${escHtml(item.email)}</td>
            <td>${escHtml(lockedDate)}</td>
            <td class="actions-cell">
                <button class="btn-icon btn-icon-danger" onclick="window.unblockUser('${escHtml(item.email)}')" title="Desbloquear" aria-label="Desbloquear usuario ${escHtml(item.email)}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </button>
            </td>
        </tr>`;
    })
    .join("");
}

function renderBlockedUsersPagination() {
  const el = document.getElementById("blockedPagination");
  const sizeEl = document.getElementById("blockedPageSize");
  if (sizeEl) {
    sizeEl.innerHTML = buildPageSizeSelect(
      blockedPageSize,
      "window.handleBlockedPageSizeChange",
    );
  }
  if (!blockedPagination || blockedPagination.totalPages <= 1) {
    el.innerHTML = "";
    return;
  }
  el.innerHTML = buildPaginationHtml(
    blockedPagination,
    "window.changeBlockedPage",
  );
}

function changeBlockedPage(page) {
  blockedPage = page;
  const tbody = document.getElementById("blockedBody");
  if (tbody) {
    tbody.innerHTML =
      '<tr><td colspan="3" class="loading-spinner">Cargando…</td></tr>';
  }
  loadBlockedUsers();
}

function handleBlockedPageSizeChange(value) {
  blockedPageSize = parseInt(value);
  blockedPage = 0;
  loadBlockedUsers();
}

function toggleBlockedSort(column) {
  const [currentColumn, currentDirection] = blockedSort.split(",");
  const newDirection =
    currentColumn === column
      ? currentDirection === "asc"
        ? "desc"
        : "asc"
      : "asc";
  blockedSort = `${column},${newDirection}`;
  blockedPage = 0;
  updateSortIndicators();
  loadBlockedUsers();
}

function updateSortIndicators() {
  document.querySelectorAll("[data-sort-indicator]").forEach((el) => {
    el.innerHTML = getSortIndicator(el.dataset.sortIndicator);
  });
}

function getSortIndicator(column) {
  const [currentColumn, currentDirection] = blockedSort.split(",");
  if (currentColumn !== column) return "";
  return currentDirection === "asc" ? ICON_ARROW_UP : ICON_ARROW_DOWN;
}

function unblockUser(email) {
  showConfirm(
    `¿Está seguro de desbloquear a ${escHtml(email)}?`,
    async () => {
      try {
        await apiRequest("POST", "/admin/security/brute-force/unblock", {
          email,
        });
        showToast("Usuario desbloqueado correctamente", "success");
        await loadBlockedUsers();
      } catch (err) {
        showToast(err.message, "error");
      }
    },
    "Desbloquear",
  );
}

function cleanupRefreshTokens() {
  showConfirm(
    "¿Está seguro de eliminar los refresh tokens expirados?",
    async () => {
      try {
        const res = await apiRequest(
          "POST",
          "/admin/security/refresh-tokens/cleanup",
        );
        const count = res?.deletedCount || 0;
        showToast(
          `${count} refresh token${count === 1 ? "" : "s"} eliminado${count === 1 ? "" : "s"}`,
          "success",
        );
      } catch (err) {
        showToast(err.message, "error");
      }
    },
    "Limpiar",
  );
}

window.renderBlockedUsersSection = renderBlockedUsersSection;
window.changeBlockedPage = changeBlockedPage;
window.handleBlockedPageSizeChange = handleBlockedPageSizeChange;
window.toggleBlockedSort = toggleBlockedSort;
window.unblockUser = unblockUser;
window.cleanupRefreshTokens = cleanupRefreshTokens;
