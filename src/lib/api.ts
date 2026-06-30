// Minimal API helper for the customer-care calling module.
// Replace token storage keys and API base URL to match your app.

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  '';

export function getSocketBaseUrl() {
  return API_BASE_URL || window.location.origin;
}

export function getToken(role: 'admin' | 'delivery') {
  const key = role === 'admin' ? 'adminToken' : 'deliveryToken';
  return localStorage.getItem(key) || '';
}

export function setToken(role: 'admin' | 'delivery', token: string) {
  const key = role === 'admin' ? 'adminToken' : 'deliveryToken';
  localStorage.setItem(key, token);
}

export function clearToken(role: 'admin' | 'delivery') {
  const key = role === 'admin' ? 'adminToken' : 'deliveryToken';
  localStorage.removeItem(key);
}

function resolveToken(roleOrToken: 'admin' | 'delivery' | string = 'delivery') {
  if (roleOrToken === 'admin' || roleOrToken === 'delivery') return getToken(roleOrToken);
  return roleOrToken || '';
}

async function request(path: string, options: RequestInit = {}, roleOrToken: 'admin' | 'delivery' | string = 'delivery') {
  const token = resolveToken(roleOrToken);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  get: <T = any>(path: string, roleOrToken?: 'admin' | 'delivery' | string) => request(path, { method: 'GET' }, roleOrToken) as Promise<T>,
  post: <T = any>(path: string, body?: unknown, roleOrToken?: 'admin' | 'delivery' | string) => request(path, { method: 'POST', body: JSON.stringify(body || {}) }, roleOrToken) as Promise<T>,
  patch: <T = any>(path: string, body?: unknown, roleOrToken?: 'admin' | 'delivery' | string) => request(path, { method: 'PATCH', body: JSON.stringify(body || {}) }, roleOrToken) as Promise<T>,
};
