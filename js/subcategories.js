// SUBCATEGORIES SECTION
// ===================================================================
function renderSubcategoriesSection() {
    subPage = 0;

    document.getElementById('dashContent').innerHTML = `
        <div class="section-header">
            <h2>Subcategor&iacute;as</h2>
            <p>Gesti&oacute;n de subcategor&iacute;as</p>
        </div>
        <div class="section-actions">
            <button class="btn-primary" onclick="window.showSubForm()">+ Nueva subcategor&iacute;a</button>
        </div>
        <div class="table-scroll">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Categor&iacute;a</th>
                        <th>Comentarios</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="subBody">
                    <tr><td colspan="4" class="empty-state">Cargando…</td></tr>
                </tbody>
            </table>
        </div>
        <div class="pagination" id="subPagination"></div>`;

    loadSubcategoriesData();
}

async function loadSubcategoriesData() {
    try {
        const res = await apiRequest(
            'GET',
            `/subcategories?page=${subPage}&size=20&sort=name,asc`
        );
        subSubcategories = res?.content || [];
        subPagination = res?.pagination || null;

        renderSubTable();
        renderSubPagination();
    } catch (err) {
        document.getElementById('subBody').innerHTML =
            `<tr><td colspan="4" class="empty-state">Error: ${escHtml(err.message)}</td></tr>`;
    }
}

function renderSubTable() {
    const tbody = document.getElementById('subBody');
    if (!subSubcategories.length) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No hay subcategor&iacute;as</td></tr>';
        return;
    }
    tbody.innerHTML = subSubcategories.map(s =>
        `<tr>
            <td>${escHtml(s.name)}</td>
            <td>${escHtml(s.categoryName || getCategoryName(s.categoryId))}</td>
            <td>${escHtml(s.comments || '—')}</td>
            <td class="actions-cell">
                <button class="btn-icon" onclick="window.editSub(${s.id})" title="Editar">&#x270E;</button>
                <button class="btn-icon btn-icon-danger" onclick="window.deleteSub(${s.id})" title="Eliminar">&#x2715;</button>
            </td>
        </tr>`
    ).join('');
}

function renderSubPagination() {
    const el = document.getElementById('subPagination');
    if (!subPagination || subPagination.totalPages <= 1) {
        el.innerHTML = '';
        return;
    }
    el.innerHTML = buildPaginationHtml(subPagination, 'window.changeSubPage');
}

function changeSubPage(page) {
    subPage = page;
    loadSubcategoriesData();
}

// ---- Subcategory CRUD ----
async function showSubForm(subId) {
    await ensureCategoryCache();

    const sub = subId ? subSubcategories.find(s => s.id === subId) : null;

    const catOptions = cachedCategories.map(c =>
        `<option value="${c.id}"${sub?.categoryId === c.id ? ' selected' : ''}>${escHtml(c.name)}</option>`
    ).join('');

    showModal({
        title: sub ? 'Editar subcategoria' : 'Nueva subcategoria',
        bodyHtml: `
            <form id="subForm">
                <div class="form-group">
                    <label for="subName">Nombre</label>
                    <input type="text" id="subName" required placeholder="Nombre de la subcategor&iacute;a" value="${sub ? escHtml(sub.name) : ''}">
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
                    <textarea id="subComments" placeholder="Comentarios">${sub ? escHtml(sub.comments || '') : ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="window.hideModal()">Cancelar</button>
                    <button type="submit" class="btn-primary">${sub ? 'Guardar cambios' : 'Crear subcategor&iacute;a'}</button>
                </div>
                <p class="form-error" id="subFormError"></p>
            </form>`
    });

    document.getElementById('subForm').addEventListener('submit', handleSubSubmit);
}

async function handleSubSubmit(e) {
    e.preventDefault();
    const errorEl = document.getElementById('subFormError');
    errorEl.textContent = '';
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Guardando…';

    const payload = {
        name: document.getElementById('subName').value.trim(),
        categoryId: parseInt(document.getElementById('subCategory').value)
    };
    const comments = document.getElementById('subComments').value.trim();
    if (comments) payload.comments = comments;

    try {
        if (window.__editingSubId) {
            await apiRequest('PUT', `/subcategories/${window.__editingSubId}`, payload);
        } else {
            await apiRequest('POST', '/subcategories', payload);
        }
        hideModal();
        window.__editingSubId = null;
        subPage = 0;
        showToast('Subcategoria guardada correctamente', 'success');
        await loadSubcategoriesData();
    } catch (err) {
        errorEl.textContent = err.message;
    } finally {
        btn.disabled = false;
        btn.textContent = window.__editingSubId ? 'Guardar cambios' : 'Crear subcategor&iacute;a';
    }
}

async function editSub(id) {
    window.__editingSubId = id;
    await showSubForm(id);
}

function deleteSub(id) {
    showConfirm('Eliminar esta subcategoria?', async () => {
        try {
            await apiRequest('DELETE', `/subcategories/${id}`);
            showToast('Subcategoria eliminada', 'success');
            subPage = 0;
            await loadSubcategoriesData();
        } catch (err) {
            showToast(err.message, 'error');
        }
    });
}

window.showSubForm = showSubForm;
window.editSub = editSub;
window.deleteSub = deleteSub;
window.changeSubPage = changeSubPage;
