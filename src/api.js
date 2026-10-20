// api.js

const API_BASE = (
  import.meta.env.VITE_API_URL ||
  "https://take-it-easy-bd-server.vercel.app/api"
).replace(/\/+$/, ""); // ✅ trailing slash remove

function getToken() {
  try {
    const raw = localStorage.getItem("tie_auth");
    if (!raw) return null;
    return JSON.parse(raw);
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

  // ✅ Ensure path always starts with single slash
  const safePath = path.startsWith("/") ? path : `/${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  if (auth) {
    const authData = getToken();

    if (authData?.adminToken) {
      headers.Authorization = `Bearer ${authData.adminToken}`;
    } else if (authData?.customer?.token) {
      headers.Authorization = `Bearer ${authData.customer.token}`;
    } else if (authData?.token) {
      headers.Authorization = `Bearer ${authData.token}`;
    }
  }

  const res = await fetch(`${API_BASE}${safePath}`, {
    method,
    headers,
    body,
  });

  const text = await res.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }

  return data;
}

/**
 * ✅ Image file → base64 string with automatic compression
 */
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

          const compressed = canvas.toDataURL("image/jpeg", quality);

          resolve(compressed.split(",")[1]);
        } catch (err) {
          reject(err);
        }
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}
