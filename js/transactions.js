// TRANSACTIONS SECTION
// ===================================================================
async function renderTransactionsSection() {
  txPage = 0;
  txAdminUserId = 0;

  if (isAdmin()) {
    if (adminUsers.length === 0) await loadAdminUsers();
    document.getElementById("dashContent").innerHTML = `
            <div class="section-header">
                <h2>Transacciones</h2>
            </div>
            <div class="admin-section-filters" style="margin-bottom:16px">
                <label>Usuario
                    <select id="txAdminUserSelect" onchange="window.handleTxAdminUserChange()">
                        <option value="0">Seleccionar...</option>
                    </select>
                </label>
            </div>
            <div class="table-scroll">
                <table class="data-table">
                    <caption>Transacciones del usuario</caption>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Categor&iacute;a</th>
                            <th>Subcategor&iacute;a</th>
                            <th>Descripci&oacute;n</th>
                            <th>Monto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="txBody">
                        <tr><td colspan="6" class="empty-state">Seleccion&aacute; un usuario para ver sus transacciones</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination" id="txPagination"></div>`;
    populateUserSelect("txAdminUserSelect", txAdminUserId, "Seleccionar...");
  } else {
    // <button class="btn-back-dashboard" onclick="window.navigateTo('dashboard')">&#x2190; Volver al panel</button>
    // <div class="section-actions">
    //   <button class="btn-primary" onclick="window.showTxForm()">
    //     + Nueva transacci&oacute;n
    //   </button>
    // </div>;
    document.getElementById("dashContent").innerHTML = `
            <div class="section-header">
                <h2>Transacciones</h2>
                <p>Todas las transacciones</p>
            </div>
            
            <div class="table-scroll">
                <table class="data-table">
                    <caption>Mis transacciones</caption>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Categor&iacute;a</th>
                            <th>Subcategor&iacute;a</th>
                            <th>Descripci&oacute;n</th>
                            <th>Monto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="txBody">
                        <tr><td colspan="6" class="empty-state">Cargando…</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination" id="txPagination"></div>`;
    loadTransactionsData();
  }
}

async function loadTransactionsData() {
  try {
    let url = `/transactions/date-range?page=${txPage}&size=20&sort=transactionDate,desc`;
    if (isAdmin() && txAdminUserId > 0) {
      url += `&userId=${txAdminUserId}`;
    }
    const res = await apiRequest("GET", url);
    txTransactions = res?.content || [];
    txPagination = res?.pagination || null;

    renderTxTable();
    renderTxPagination();
  } catch (err) {
    document.getElementById("txBody").innerHTML =
      `<tr><td colspan="6" class="empty-state">Error: ${escHtml(err.message)}</td></tr>`;
  }
}

function renderTxTable() {
  const tbody = document.getElementById("txBody");
  if (!txTransactions.length) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="empty-state">No hay transacciones en este per&iacute;odo</td></tr>';
    return;
  }
  const admin = isAdmin();
  tbody.innerHTML = txTransactions
    .map((tx) => {
      const type = getCategoryType(tx.categoryId);
      return `<tr>
            <td>${formatDate(tx.transactionDate)}</td>
            <td>${escHtml(tx.categoryName || "—")}</td>
            <td>${escHtml(tx.subcategoryName || "—")}</td>
            <td>${escHtml(tx.description || "—")}</td>
            <td class="amount ${type === "INCOME" ? "income" : "expense"}">${formatMoney(tx.amount)}</td>
            <td class="actions-cell">
                ${
                  admin
                    ? `<button class="btn-icon btn-icon-danger" onclick="window.deleteTx(${tx.id})" title="Eliminar" aria-label="Eliminar transacción">&#x2715;</button>`
                    : `<button class="btn-icon" onclick="window.editTx(${tx.id})" title="Editar" aria-label="Editar transacción">&#x270E;</button>
                       <button class="btn-icon btn-icon-danger" onclick="window.deleteTx(${tx.id})" title="Eliminar" aria-label="Eliminar transacción">&#x2715;</button>`
                }
            </td>
        </tr>`;
    })
    .join("");
}

function renderTxPagination() {
  const el = document.getElementById("txPagination");
  if (!txPagination || txPagination.totalPages <= 1) {
    el.innerHTML = "";
    return;
  }
  el.innerHTML = buildPaginationHtml(txPagination, "window.changeTxPage");
}

function changeTxPage(page) {
  txPage = page;
  const tbody = document.getElementById("txBody");
  if (tbody)
    tbody.innerHTML =
      '<tr><td colspan="6" class="loading-spinner">Cargando…</td></tr>';
  loadTransactionsData();
}

function handleTxAdminUserChange() {
  const sel = document.getElementById("txAdminUserSelect");
  if (!sel) return;
  txAdminUserId = parseInt(sel.value);
  txPage = 0;
  if (txAdminUserId > 0) {
    loadTransactionsData();
  } else {
    txTransactions = [];
    txPagination = null;
    renderTxTable();
    renderTxPagination();
  }
}

// ---- Transaction CRUD ----
async function showTxForm(txId) {
  await ensureCategoryCache();

  const tx = txId ? txTransactions.find((t) => t.id === txId) : null;

  const today = new Date().toISOString().split("T")[0];

  const catOptions = cachedCategories
    .map(
      (c) =>
        `<option value="${c.id}"${tx?.categoryId === c.id ? " selected" : ""}>${escHtml(c.name)}</option>`,
    )
    .join("");

  let subOptions = "";
  if (tx) {
    const subs = await fetchSubcategoriesByCategory(tx.categoryId);
    subOptions = subs
      .map(
        (s) =>
          `<option value="${s.id}"${tx.subcategoryId === s.id ? " selected" : ""}>${escHtml(s.name)}</option>`,
      )
      .join("");
  }

  showModal({
    title: tx ? "Editar transacción" : "Nueva transacción",
    bodyHtml: `
            <form id="txForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="txCategory">Categor&iacute;a</label>
                        <select id="txCategory" required>
                            <option value="">Seleccionar</option>
                            ${catOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="txSubcategory">Subcategor&iacute;a</label>
                        <select id="txSubcategory" required>
                            <option value="">Seleccionar</option>
                            ${subOptions}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="txAmount">Monto</label>
                        <input type="number" id="txAmount" step="0.01" min="0.01" required placeholder="0.00" value="${tx ? tx.amount : ""}">
                    </div>
                    <div class="form-group">
                        <label for="txDate">Fecha</label>
                        <input type="date" id="txDate" required value="${tx ? tx.transactionDate : today}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="txDesc">Descripci&oacute;n (opcional)</label>
                    <input type="text" id="txDesc" placeholder="Descripci&oacute;n" value="${tx ? escHtml(tx.description || "") : ""}">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="window.hideModal()">Cancelar</button>
                    <button type="submit" class="btn-primary">${tx ? "Guardar cambios" : "Crear transacci&oacute;n"}</button>
                </div>
                <p class="form-error" id="txFormError" role="alert" aria-live="polite"></p>
            </form>`,
  });

  const catSelect = document.getElementById("txCategory");
  const subcatSelect = document.getElementById("txSubcategory");

  const updateSubs = async () => {
    const catId = parseInt(catSelect.value);
    subcatSelect.innerHTML = '<option value="">Cargando…</option>';
    if (!catId) {
      subcatSelect.innerHTML = '<option value="">Seleccionar</option>';
      return;
    }
    const subs = await fetchSubcategoriesByCategory(catId);
    subcatSelect.innerHTML = '<option value="">Seleccionar</option>';
    subs.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.name;
      if (tx?.subcategoryId === s.id && tx.categoryId === catId)
        opt.selected = true;
      subcatSelect.appendChild(opt);
    });
  };

  catSelect.addEventListener("change", updateSubs);
  if (!tx) updateSubs();

  document.getElementById("txForm").addEventListener("submit", handleTxSubmit);
}

async function handleTxSubmit(e) {
  e.preventDefault();
  const errorEl = document.getElementById("txFormError");
  errorEl.textContent = "";
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = "Guardando…";

  const payload = {
    amount: parseFloat(document.getElementById("txAmount").value),
    categoryId: parseInt(document.getElementById("txCategory").value),
    subcategoryId: parseInt(document.getElementById("txSubcategory").value),
    description: document.getElementById("txDesc").value.trim(),
    transactionDate: document.getElementById("txDate").value,
  };

  const isEdit = !!window.__editingTxId;

  try {
    if (isEdit) {
      await apiRequest("PUT", `/transactions/${window.__editingTxId}`, payload);
    } else {
      await apiRequest("POST", "/transactions", payload);
    }
    hideModal();
    window.__editingTxId = null;
    txPage = 0;
    showToast("Transacción guardada correctamente", "success");
    await loadTransactionsData();
    await refreshDashboardIfActive();
  } catch (err) {
    errorEl.textContent = err.message;
  } finally {
    btn.disabled = false;
    btn.textContent = isEdit ? "Guardar cambios" : "Crear transacción";
  }
}

async function editTx(id) {
  window.__editingTxId = id;
  await showTxForm(id);
}

function deleteTx(id) {
  showConfirm("¿Eliminar esta transacción?", async () => {
    try {
      await apiRequest("DELETE", `/transactions/${id}`);
      showToast("Transacción eliminada", "success");
      txPage = 0;
      await loadTransactionsData();
      await refreshDashboardIfActive();
    } catch (err) {
      showToast(err.message, "error");
    }
  });
}

window.showTxForm = showTxForm;
window.editTx = editTx;
window.deleteTx = deleteTx;
window.changeTxPage = changeTxPage;
window.handleTxAdminUserChange = handleTxAdminUserChange;
