// ✅ TanStack Query er jonno fetch wrapper
export async function apiFetch(path) {
  const authData = getToken();
  const headers = {};

  if (authData?.adminToken) {
    headers.Authorization = `Bearer ${authData.adminToken}`;
  } else if (authData?.customer?.token) {
    headers.Authorization = `Bearer ${authData.customer.token}`;
  } else if (authData?.token) {
    headers.Authorization = `Bearer ${authData.token}`;
  }

  const safePath = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${API_BASE}${safePath}`, { headers });

  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  return res.json();
}
