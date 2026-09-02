function getTokens() {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : null;
}

function saveTokens(accessToken, refreshToken) {
    localStorage.setItem('auth', JSON.stringify({ accessToken, refreshToken }));
}

function clearTokens() {
    localStorage.removeItem('auth');
    localStorage.removeItem('userInfo');
}

function getUserInfo() {
    const stored = localStorage.getItem('userInfo');
    return stored ? JSON.parse(stored) : null;
}

function saveUserInfoFromToken(accessToken) {
    try {
        const base64Url = accessToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join('')
        );
        const payload = JSON.parse(jsonPayload);
        localStorage.setItem('userInfo', JSON.stringify({
            name: payload.name || payload.sub || '',
            email: payload.sub || '',
            role: payload.role || 'USER'
        }));
    } catch {
        localStorage.setItem('userInfo', JSON.stringify({ name: '', email: '', role: 'USER' }));
    }
}

function isAdmin() {
    const info = getUserInfo();
    return info?.role === 'ADMIN';
}

async function apiRefresh() {
    const tokens = getTokens();
    if (!tokens?.refreshToken) throw new Error('No hay token de refresco');
    const res = await fetch(`${CONFIG.API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: tokens.refreshToken })
    });
    let json;
    try {
        json = await res.json();
    } catch {
        const text = await res.text().catch(() => '');
        throw new Error(`Error ${res.status}${text ? ': ' + text.slice(0, 200) : ' - El servidor no devolvió JSON'}`);
    }
    if (!json.success) throw new Error(json.message || 'Sesión expirada');
    const data = json.data;
    saveTokens(data.accessToken, data.refreshToken || tokens.refreshToken);
    return data.accessToken;
}

async function apiRequest(method, path, body) {
    const doRequest = async (token) => {
        const headers = {};
        if (body !== undefined || method === 'POST' || method === 'PUT') {
            headers['Content-Type'] = 'application/json';
        }
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const opts = { method, headers };
        if (body !== undefined) opts.body = JSON.stringify(body);
        const res = await fetch(`${CONFIG.API_BASE}${path}`, opts);
        let json;
        try {
            json = await res.json();
        } catch {
            const text = await res.text().catch(() => '');
            throw new Error(`Error ${res.status}${text ? ': ' + text.slice(0, 200) : ' - El servidor no devolvió JSON'}`);
        }
        if (res.status === 401) return null;
        if (!json.success) throw new Error(json.message || `Error ${res.status}`);
        return json.data;
    };

    const tokens = getTokens();
    let result = await doRequest(tokens?.accessToken);
    if (result === null && tokens?.refreshToken) {
        try {
            const newToken = await apiRefresh();
            result = await doRequest(newToken);
        } catch (e) {
            clearTokens();
            window.location.hash = '#login';
            throw e;
        }
    } else if (result === null) {
        clearTokens();
        window.location.hash = '#login';
        throw new Error('Sesión expirada');
    }
    return result;
}
