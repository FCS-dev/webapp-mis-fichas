// SUBCATEGORIES SECTION — Tree view
// ===================================================================
function renderSubcategoriesSection() {
  document.getElementById("dashContent").innerHTML = `
        <button class="btn-back-dashboard" onclick="window.navigateTo('dashboard')">&#x2190; Volver al panel</button>
        <div class="section-header">
            <h2>Categor&iacute;as y Sub-Categorías</h2>
            <p>Gesti&oacute;n de Sub-Categor&iacute;as personalizadas</p>
        </div>
        <div class="section-actions">
            <button class="btn-primary" onclick="window.showSubForm()">+ Nueva subcategor&iacute;a</button>
        </div>
        <div id="subTreeContainer" class="tree-container">
            <p class="loading-message">Cargando…</p>
        </div>`;

  loadSubcategoriesData();
}

async function loadSubcategoriesData() {
  try {
    subSubcategories = [];
    let page = 0;
    while (true) {
      const res = await apiRequest(
        "GET",
        `/subcategories?page=${page}&size=100`,
      );
      const items = res?.content || [];
      subSubcategories.push(...items);
      if (items.length < 100) break;
      page++;
    }
    renderSubTree();
  } catch (err) {
    document.getElementById("subTreeContainer").innerHTML =
      `<p class="error-message">Error: ${escHtml(err.message)}</p>`;
  }
}

function renderSubTree() {
  const container = document.getElementById("subTreeContainer");
  const userId = getUserId();
  const admin = isAdmin();

  const visibleSubs = subSubcategories.filter(
    (s) => admin || s.isSystem === true || s.createdById === userId,
  );

  if (!visibleSubs.length) {
    container.innerHTML =
      '<p class="tree-empty">No hay subcategor&iacute;as disponibles</p>';
    return;
  }

  const groups = {};
  visibleSubs.forEach((s) => {
    if (!groups[s.categoryId]) {
      groups[s.categoryId] = {
        id: s.categoryId,
        name: s.categoryName || getCategoryName(s.categoryId),
        type: getCategoryType(s.categoryId),
        subs: [],
      };
    }
    groups[s.categoryId].subs.push(s);
  });

  const sortedGroups = Object.values(groups).sort((a, b) => a.id - b.id);
  sortedGroups.forEach((g) => g.subs.sort((a, b) => a.id - b.id));

  container.innerHTML = sortedGroups
    .map((g) => {
      const isIncome = g.type === "INCOME";
      const badgeClass = isIncome ? "badge-income" : "badge-expense";
      const badgeText = isIncome ? "Ingreso" : "Gasto";

      const subsHtml = g.subs.length
        ? g.subs
            .map((s) => {
              const canEdit = admin;
              const canDelete = admin || s.createdById === userId;
              const actions = [];
              if (canEdit)
                actions.push(
                  `<button class="btn-icon" onclick="window.editSub(${s.id})" title="Editar" aria-label="Editar subcategor&iacute;a">&#x270E;</button>`,
                );
              if (canDelete)
                actions.push(
                  `<button class="btn-icon btn-icon-danger" onclick="window.deleteSub(${s.id})" title="Eliminar" aria-label="Eliminar subcategor&iacute;a">&#x2715;</button>`,
                );

              return `<li class="tree-subcategory-item">
                    <div class="tree-subcategory-info">
                        <span class="tree-subcategory-name">${escHtml(s.name)}</span>
                        ${s.comments ? `<span class="tree-subcategory-comment">${escHtml(s.comments)}</span>` : ""}
                    </div>
                    ${actions.length ? `<div class="tree-subcategory-actions">${actions.join("")}</div>` : ""}
                </li>`;
            })
            .join("")
        : '<li class="tree-empty">Sin subcategor&iacute;as</li>';

      return `<div class="tree-category">
            <div class="tree-category-header">
                <span class="tree-category-name">${escHtml(g.name)} <span class="badge ${badgeClass}">${badgeText}</span></span>
                <span class="tree-category-meta">
                    <span class="tree-subcategory-count">${g.subs.length} subcategor&iacute;a${g.subs.length !== 1 ? "s" : ""}</span>
                </span>
            </div>
            <ul class="tree-subcategory-list">${subsHtml}</ul>
        </div>`;
    })
    .join("");
}

// ---- Subcategory CRUD ----
async function showSubForm(subId) {
  await ensureCategoryCache();

  const sub = subId ? subSubcategories.find((s) => s.id === subId) : null;

  const catOptions = [...cachedCategories]
    .sort((a, b) => a.id - b.id)
    .map(
      (c) =>
        `<option value="${c.id}"${sub?.categoryId === c.id ? " selected" : ""}>${escHtml(c.name)}</option>`,
    )
    .join("");

  showModal({
    title: sub ? "Editar subcategor&iacute;a" : "Nueva subcategor&iacute;a",
    bodyHtml: `
            <form id="subForm">
                <div class="form-group">
                    <label for="subName">Nombre</label>
                    <input type="text" id="subName" required placeholder="Nombre de la subcategor&iacute;a" value="${sub ? escHtml(sub.name) : ""}">
                </div>
                <div class="form-group">
                    <label for="subCategory">Categor&iacute;a</label>
                    <select id="subCategory" required>
                        <option value="">Seleccionar</option>
                        ${catOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label for="subComments">Comentarios (opcional)</label>
                    <textarea id="subComments" placeholder="Comentarios">${sub ? escHtml(sub.comments || "") : ""}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="window.hideModal()">Cancelar</button>
                    <button type="submit" class="btn-primary">${sub ? "Guardar cambios" : "Crear subcategor&iacute;a"}</button>
                </div>
                <p class="form-error" id="subFormError" role="alert" aria-live="polite"></p>
            </form>`,
  });

  document
    .getElementById("subForm")
    .addEventListener("submit", handleSubSubmit);
}

async function handleSubSubmit(e) {
  e.preventDefault();
  const errorEl = document.getElementById("subFormError");
  errorEl.textContent = "";
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = "Guardando…";

  const payload = {
    name: document.getElementById("subName").value.trim(),
    categoryId: parseInt(document.getElementById("subCategory").value),
  };
  const comments = document.getElementById("subComments").value.trim();
  if (comments) payload.comments = comments;

  try {
    if (window.__editingSubId) {
      await apiRequest(
        "PUT",
        `/subcategories/${window.__editingSubId}`,
        payload,
      );
    } else {
      await apiRequest("POST", "/subcategories", payload);
    }
    hideModal();
    window.__editingSubId = null;
    showToast("Subcategoría guardada correctamente", "success");
    await loadSubcategoriesData();
  } catch (err) {
    errorEl.textContent = err.message;
  } finally {
    btn.disabled = false;
    btn.textContent = window.__editingSubId
      ? "Guardar cambios"
      : "Crear subcategor&iacute;a";
  }
}

function editSub(id) {
  window.__editingSubId = id;
  showSubForm(id);
}

function deleteSub(id) {
  showConfirm("¿Eliminar esta subcategor&iacute;a?", async () => {
    try {
      await apiRequest("DELETE", `/subcategories/${id}`);
      showToast("Subcategor&iacute;a eliminada", "success");
      await loadSubcategoriesData();
    } catch (err) {
      showToast(err.message, "error");
    }
  });
}

window.showSubForm = showSubForm;
window.editSub = editSub;
window.deleteSub = deleteSub;
