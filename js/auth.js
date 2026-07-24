function renderLogin() {
    document.getElementById('app').innerHTML = `
        <div class="auth-container">
            <button class="theme-toggle auth-theme-toggle" onclick="window.toggleTheme()" title="Cambiar tema" aria-label="Cambiar tema día/noche">${getThemeIcon()}</button>
            <div class="auth-card">
                <div class="auth-header">
                    <img class="logo" src="assets/logo/mis-fichas-logo-modo-claro.png" alt="Mis Fichas" style="height:256px;width:auto;margin-bottom:8px">
                    <p>Inicia sesi&oacute;n para continuar</p>
                </div>
                <form id="loginForm" class="auth-form">
                    <div class="form-group">
                        <label for="loginEmail">Email</label>
                        <input type="email" id="loginEmail" required placeholder="tu@email.com" autocomplete="email">
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Contraseña</label>
                        <input type="password" id="loginPassword" required placeholder="Contraseña" autocomplete="current-password">
                    </div>
                    <p class="form-error" id="loginError"></p>
                    <button type="submit" class="btn-primary btn-full">Iniciar sesión</button>
                </form>
                <p class="auth-footer">¿No tienes cuenta? <a href="#register">Regístrate</a></p>
            </div>
        </div>
    `;
    document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);
    updateLogoSrc();
}

async function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    errorEl.textContent = '';
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Ingresando…';
    try {
        const data = await apiRequest('POST', '/auth/login', { email, password });
        saveTokens(data.accessToken, data.refreshToken);
        saveUserInfoFromToken(data.accessToken);
        window.location.hash = '#dashboard';
    } catch (err) {
        errorEl.textContent = err.message;
    } finally {
        btn.disabled = false;
        btn.textContent = 'Iniciar sesión';
    }
}

function renderRegister() {
    document.getElementById('app').innerHTML = `
        <div class="auth-container">
            <button class="theme-toggle auth-theme-toggle" onclick="window.toggleTheme()" title="Cambiar tema" aria-label="Cambiar tema día/noche">${getThemeIcon()}</button>
            <div class="auth-card">
                <div class="auth-header">
                    <img class="logo" src="assets/logo/mis-fichas-logo-modo-claro.png" alt="Mis Fichas" style="height:256px;width:auto;margin-bottom:8px">
                    <h1 style="font-size:1.3rem;margin-bottom:4px;">Crear cuenta</h1>
                    <p>Reg&iacute;strate para usar Mis Fichas</p>
                </div>
                <form id="registerForm" class="auth-form">
                    <div class="form-group">
                        <label for="regName">Nombre</label>
                        <input type="text" id="regName" required placeholder="Tu nombre" autocomplete="name">
                    </div>
                    <div class="form-group">
                        <label for="regEmail">Email</label>
                        <input type="email" id="regEmail" required placeholder="tu@email.com" autocomplete="email">
                    </div>
                    <div class="form-group">
                        <label for="regPassword">Contraseña</label>
                        <input type="password" id="regPassword" required minlength="6" placeholder="Mínimo 6 caracteres" autocomplete="new-password">
                    </div>
                    <p class="form-error" id="registerError"></p>
                    <p class="form-success" id="registerSuccess"></p>
                    <button type="submit" class="btn-primary btn-full">Crear cuenta</button>
                </form>
                <p class="auth-footer">¿Ya tienes cuenta? <a href="#login">Inicia sesión</a></p>
            </div>
        </div>
    `;
    document.getElementById('registerForm').addEventListener('submit', handleRegisterSubmit);
    updateLogoSrc();
}

async function handleRegisterSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const errorEl = document.getElementById('registerError');
    const successEl = document.getElementById('registerSuccess');
    errorEl.textContent = '';
    successEl.textContent = '';
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Registrando…';
    try {
        const data = await apiRequest('POST', '/auth/register', { name, email, password });
        saveTokens(data.accessToken, data.refreshToken);
        saveUserInfoFromToken(data.accessToken);
        window.location.hash = '#dashboard';
    } catch (err) {
        errorEl.textContent = err.message;
    } finally {
        btn.disabled = false;
        btn.textContent = 'Crear cuenta';
    }
}
