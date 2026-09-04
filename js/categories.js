// CATEGORIES SECTION — Admin CRUD
// ===================================================================
function renderCategoriesSection() {
    catPage = 0;

    document.getElementById('dashContent').innerHTML = `
        <button class="btn-back-dashboard" onclick="window.navigateTo('dashboard')">&#x2190; Volver al panel</button>
        <div class="section-header">
            <h2>Categor&iacute;as</h2>
            <p>Gesti&oacute;n de categor&iacute;as</p>
        </div>
        <div class="section-actions">
            <button class="btn-primary" onclick="window.showCatForm()">+ Nueva categor&iacute;a</button>
        </div>
        <div id="catPageSize"></div>
        <div class="table-scroll">
            <table class="data-table">
                <caption>Gesti&oacute;n de categor&iacute;as</caption>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="catBody">
                    <tr><td colspan="3" class="empty-state">Cargando…</td></tr>
                </tbody>
            </table>
        </div>
        <div class="pagination" id="catPagination"></div>`;

    loadCategoriesData();
}

async function loadCategoriesData() {
    try {
        const res = await apiRequest(
            'GET',
            `/admin/categories?page=${catPage}&size=${catPageSize}&sort=id,asc`
        );
        catCategories = res?.content || [];
        catPagination = res?.pagination || null;

        renderCatTable();
        renderCatPagination();
    } catch (err) {
        document.getElementById('catBody').innerHTML =
            `<tr><td colspan="3" class="empty-state">Error: ${escHtml(err.message)}</td></tr>`;
    }
}

function renderCatTable() {
    const tbody = document.getElementById('catBody');
    if (!catCategories.length) {
        tbody.innerHTML = '<tr><td colspan="3" class="empty-state">No hay categor&iacute;as</td></tr>';
        return;
    }
    tbody.innerHTML = catCategories.map(c => {
        const isIncome = c.type === 'INCOME';
        return `<tr>
            <td>${escHtml(c.name)}</td>
            <td><span class="badge ${isIncome ? 'badge-income' : 'badge-expense'}">${isIncome ? 'Ingreso' : 'Gasto'}</span></td>
            <td class="actions-cell">
                <button class="btn-icon" onclick="window.editCat(${c.id})" title="Editar" aria-label="Editar categor&iacute;a">&#x270E;</button>
                <button class="btn-icon btn-icon-danger" onclick="window.deleteCat(${c.id})" title="Eliminar" aria-label="Eliminar categor&iacute;a">&#x2715;</button>
            </td>
        </tr>`;
    }).join('');
}

function renderCatPagination() {
    const el = document.getElementById('catPagination');
    const sizeEl = document.getElementById('catPageSize');
    if (sizeEl) sizeEl.innerHTML = buildPageSizeSelect(catPageSize, 'window.handleCatPageSizeChange');
    if (!catPagination || catPagination.totalPages <= 1) {
        el.innerHTML = '';
        return;
    }
    el.innerHTML = buildPaginationHtml(catPagination, 'window.changeCatPage');
}

function changeCatPage(page) {
    catPage = page;
    const tbody = document.getElementById('catBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="3" class="loading-spinner">Cargando…</td></tr>';
    loadCategoriesData();
}

function handleCatPageSizeChange(value) {
    catPageSize = parseInt(value);
    catPage = 0;
    loadCategoriesData();
}

// ---- Category CRUD ----
function showCatForm(catId) {
    const cat = catId ? catCategories.find(c => c.id === catId) : null;

    const typeOptions = [
        { value: 'INCOME', label: 'Ingreso' },
        { value: 'EXPENSE', label: 'Gasto' }
    ].map(t =>
        `<option value="${t.value}"${cat?.type === t.value ? ' selected' : ''}>${t.label}</option>`
    ).join('');

    showModal({
        title: cat ? 'Editar categor&iacute;a' : 'Nueva categor&iacute;a',
        bodyHtml: `
            <form id="catForm">
                <div class="form-group">
                    <label for="catName">Nombre</label>
                    <input type="text" id="catName" required placeholder="Nombre de la categor&iacute;a" maxlength="100" value="${cat ? escHtml(cat.name) : ''}">
                </div>
                <div class="form-group">
                    <label for="catType">Tipo</label>
                    <select id="catType" required>
                        <option value="">Seleccionar</option>
                        ${typeOptions}
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="window.hideModal()">Cancelar</button>
                    <button type="submit" class="btn-primary">${cat ? 'Guardar cambios' : 'Crear categor&iacute;a'}</button>
                </div>
                <p class="form-error" id="catFormError" role="alert" aria-live="polite"></p>
            </form>`
    });

    document.getElementById('catForm').addEventListener('submit', handleCatSubmit);
}

async function handleCatSubmit(e) {
    e.preventDefault();
    const errorEl = document.getElementById('catFormError');
    errorEl.textContent = '';
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Guardando…';

    const payload = {
        name: document.getElementById('catName').value.trim(),
        type: document.getElementById('catType').value
    };

    try {
        if (window.__editingCatId) {
            await apiRequest('PUT', `/admin/categories/${window.__editingCatId}`, payload);
        } else {
            await apiRequest('POST', '/admin/categories', payload);
        }
        hideModal();
        window.__editingCatId = null;
        showToast('Categor&iacute;a guardada correctamente', 'success');
        await loadCategoriesData();
    } catch (err) {
        errorEl.textContent = err.message;
    } finally {
        btn.disabled = false;
        btn.textContent = window.__editingCatId ? 'Guardar cambios' : 'Crear categor&iacute;a';
    }
}

function editCat(id) {
    window.__editingCatId = id;
    showCatForm(id);
}

function deleteCat(id) {
    showConfirm('¿Eliminar esta categor&iacute;a?', async () => {
        try {
            await apiRequest('DELETE', `/admin/categories/${id}`);
            showToast('Categor&iacute;a eliminada', 'success');
            await loadCategoriesData();
        } catch (err) {
            showToast(err.message, 'error');
        }
    });
}

window.changeCatPage = changeCatPage;
window.handleCatPageSizeChange = handleCatPageSizeChange;
window.showCatForm = showCatForm;
window.editCat = editCat;
window.deleteCat = deleteCat;
