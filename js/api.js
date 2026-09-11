function getAccessToken() {
  return localStorage.getItem("accessToken");
}

function saveAccessToken(accessToken) {
  localStorage.setItem("accessToken", accessToken);
}

function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userInfo");
}

function getUserInfo() {
  const stored = localStorage.getItem("userInfo");
  return stored ? JSON.parse(stored) : null;
}

function saveUserInfoFromToken(accessToken) {
  try {
    const base64Url = accessToken.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes));
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        name: payload.name || payload.sub || "",
        email: payload.sub || "",
        role: payload.role || "USER",
        userId: payload.userId || null,
      }),
    );
  } catch {
    localStorage.setItem(
      "userInfo",
      JSON.stringify({ name: "", email: "", role: "USER", userId: null }),
    );
  }
}

function isAdmin() {
  const info = getUserInfo();
  return info?.role === "ADMIN";
}

async function apiRefresh() {
  const res = await fetch(`${CONFIG.API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  let json;
  try {
    json = await res.json();
  } catch {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Error ${res.status}${text ? ": " + text.slice(0, 200) : " - El servidor no devolvió JSON"}`,
    );
  }
  if (!json.success) throw new Error(json.message || "Sesión expirada");
  const data = json.data;
  saveAccessToken(data.accessToken);
  return data.accessToken;
}

async function apiRequest(method, path, body) {
  const doRequest = async (token) => {
    const headers = {};
    if (body !== undefined || method === "POST" || method === "PUT") {
      headers["Content-Type"] = "application/json";
    }
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const opts = { method, headers, credentials: "include" };
    if (body !== undefined) opts.body = JSON.stringify(body);
    const res = await fetch(`${CONFIG.API_BASE}${path}`, opts);
    let json;
    try {
      json = await res.json();
    } catch {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Error ${res.status}${text ? ": " + text.slice(0, 200) : " - El servidor no devolvió JSON"}`,
      );
    }
    if (res.status === 401 || res.status === 403) return null;
    if (!json.success) throw new Error(json.message || `Error ${res.status}`);
    return json.data;
  };

  const token = getAccessToken();
  let result = await doRequest(token);
  if (result === null) {
    try {
      const newToken = await apiRefresh();
      result = await doRequest(newToken);
    } catch (e) {
      clearTokens();
      window.location.hash = "#login";
      throw e;
    }
  }
  return result;
}
