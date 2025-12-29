// small wrapper using fetch
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = options.headers || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  let body = options.body;
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers, body });
  const dataText = await res.text();
  let data;
  try { data = dataText ? JSON.parse(dataText) : null; } catch { data = dataText; }
  if (!res.ok) throw new Error(data?.message || 'API Error');
  return data;
}
