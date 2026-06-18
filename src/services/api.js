// FitNex AI — Unified API Client
// Microservice Architecture: Routes 'analyze' traffic to Hugging Face, everything else to Render.
const CORE_URL = import.meta.env.VITE_CORE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000';
const VISION_URL = import.meta.env.VITE_VISION_API_URL || CORE_URL;

async function apiFetch(path, options = {}) {
  // Route /analyze requests to Hugging Face, all other requests to Render Core API
  const baseUrl = path.includes('/analyze') ? VISION_URL : CORE_URL;
  const url = `${baseUrl}${path}`;
  const token = localStorage.getItem('fitnex_token');

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { headers, ...options };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  let res;
  try {
    res = await fetch(url, config);
  } catch (networkError) {
    throw new Error('Network error — check your connection or backend server.');
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    // auto-logout on 401 only if user was already logged in (token expired)
    if (res.status === 401 && token) {
      localStorage.removeItem('fitnex_token');
      localStorage.removeItem('fitnex_user');
      window.location.href = '/login';
    }
    const msg = json.detail || json.message || json.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return json;
}

export const api = {
  get: (path) => apiFetch(path, { method: 'GET' }),
  post: (path, payload) => apiFetch(path, { method: 'POST', body: payload }),
  put: (path, payload) => apiFetch(path, { method: 'PUT', body: payload }),
  delete: (path) => apiFetch(path, { method: 'DELETE' }),
};

export default api;
