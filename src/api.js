// api.js
const API_BASE = (
  import.meta.env.VITE_API_URL ||
  "https://take-it-easy-bd-server.vercel.app/api"
).replace(/\/+$/, "");

// ✅ Priority: path অনুযায়ী টোকেন খোঁজা (Admin vs Customer)
function getToken(path = "") {
  try {
    const isAdminRoute = path.includes("/admin");

    // ১. অ্যাডমিন রিকোয়েস্ট হলে অ্যাডমিন টোকেন
    if (isAdminRoute) {
      const adminRaw = localStorage.getItem("tie_auth");
      if (adminRaw) {
        const adminData = JSON.parse(adminRaw);
        if (adminData?.adminToken) return adminData.adminToken;
      }
    }

    // ২. কাস্টমার রিকোয়েস্ট হলে কাস্টমার টোকেন
    const customerRaw = localStorage.getItem("tie_customer");
    if (customerRaw) {
      const customerData = JSON.parse(customerRaw);
      if (customerData?.token) return customerData.token;
    }

    // ৩. Fallback (যদি অ্যাডমিন রিকোয়েস্ট না হয় কিন্তু অ্যাডমিন টোকেন থাকে)
    if (!isAdminRoute) {
      const adminRaw = localStorage.getItem("tie_auth");
      if (adminRaw) {
        const adminData = JSON.parse(adminRaw);
        if (adminData?.adminToken) return adminData.adminToken;
      }
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
  const headers = { ...extraHeaders };

  // ✅ Content-Type সেট করা
  if (body && typeof body !== "string") {
    headers["Content-Type"] = "application/json";
  }

  // ✅ টোকেন সেট করা
  if (auth) {
    const token = getToken(safePath);
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  // ✅ Body handle (object হলে stringify করবে)
  let finalBody = undefined;
  if (body) {
    finalBody = typeof body === "string" ? body : JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${safePath}`, {
    method,
    headers,
    body: finalBody,
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
  const safePath = path.startsWith("/") ? path : `/${path}`;
  const token = getToken(safePath);

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

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
