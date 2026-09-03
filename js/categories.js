// CATEGORIES SECTION
// ===================================================================
function renderCategoriesSection() {
    catPage = 0;

    document.getElementById('dashContent').innerHTML = `
        <button class="btn-back-dashboard" onclick="window.navigateTo('dashboard')">&#x2190; Volver al panel</button>
        <div class="section-header">
            <h2>Categor&iacute;as</h2>
            <p>Listado de categor&iacute;as activas</p>
        </div>
        <div class="table-scroll">
            <table class="data-table">
                <caption>Categorías activas</caption>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                    </tr>
                </thead>
                <tbody id="catBody">
                    <tr><td colspan="2" class="empty-state">Cargando…</td></tr>
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
            `/categories?page=${catPage}&size=20&sort=name,asc`
        );
        catCategories = res?.content || [];
        catPagination = res?.pagination || null;

        renderCatTable();
        renderCatPagination();
    } catch (err) {
        document.getElementById('catBody').innerHTML =
            `<tr><td colspan="2" class="empty-state">Error: ${escHtml(err.message)}</td></tr>`;
    }
}

function renderCatTable() {
    const tbody = document.getElementById('catBody');
    if (!catCategories.length) {
        tbody.innerHTML = '<tr><td colspan="2" class="empty-state">No hay categor&iacute;as</td></tr>';
        return;
    }
    tbody.innerHTML = catCategories.map(c => {
        const isIncome = c.type === 'INCOME';
        return `<tr>
            <td>${escHtml(c.name)}</td>
            <td><span class="badge ${isIncome ? 'badge-income' : 'badge-expense'}">${isIncome ? 'Ingreso' : 'Gasto'}</span></td>
        </tr>`;
    }).join('');
}

function renderCatPagination() {
    const el = document.getElementById('catPagination');
    if (!catPagination || catPagination.totalPages <= 1) {
        el.innerHTML = '';
        return;
    }
    el.innerHTML = buildPaginationHtml(catPagination, 'window.changeCatPage');
}

function changeCatPage(page) {
    catPage = page;
    const tbody = document.getElementById('catBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="2" class="loading-spinner">Cargando…</td></tr>';
    loadCategoriesData();
}

// ===================================================================
// PAGINATION HELPER
// ===================================================================
window.changeCatPage = changeCatPage;
