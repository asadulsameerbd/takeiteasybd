// api.js
const API_BASE = (
  import.meta.env.VITE_API_URL ||
  "https://take-it-easy-bd-server.vercel.app/api"
).replace(/\/+$/, "");

// ✅ Priority: admin token → customer token
function getToken() {
  try {
    const adminRaw = localStorage.getItem("tie_auth");
    if (adminRaw) {
      const adminData = JSON.parse(adminRaw);
      if (adminData?.adminToken)
        return { type: "admin", token: adminData.adminToken };
    }
    const customerRaw = localStorage.getItem("tie_customer");
    if (customerRaw) {
      const customerData = JSON.parse(customerRaw);
      if (customerData?.token)
        return { type: "customer", token: customerData.token };
    }
    return null;
  } catch {
    return null;
  }
}

export async function api(path, options = {}) {
  const {
    method = "GET",
    body,
    auth = true,
    headers: extraHeaders = {},
  } = options;

  const safePath = path.startsWith("/") ? path : `/${path}`;
  const headers = { "Content-Type": "application/json", ...extraHeaders };

  if (auth) {
    const authData = getToken();
    if (authData?.token) headers.Authorization = `Bearer ${authData.token}`;
  }

  const res = await fetch(`${API_BASE}${safePath}`, {
    method,
    headers,
    body,
    cache: "no-store",
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }

  if (!res.ok)
    throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}

export async function apiFetch(path) {
  const authData = getToken();
  const headers = {};
  if (authData?.token) headers.Authorization = `Bearer ${authData.token}`;

  const safePath = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${API_BASE}${safePath}`, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let msg = `Request failed (${res.status})`;
    try {
      msg = JSON.parse(text)?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function fileData(file, maxWidth = 1600, quality = 0.8) {
  if (!file) throw new Error("No file provided.");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image."));
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality).split(",")[1]);
        } catch (err) {
          reject(err);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
