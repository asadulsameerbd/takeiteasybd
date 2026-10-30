const API_BASE = (
  import.meta.env.VITE_API_URL ||
  "https://take-it-easy-bd-server.vercel.app/api"
).replace(/\/+$/, "");

// Admin ও Customer token আলাদা রাখা হয়েছে
function getToken(path = "") {
  try {
    const isAdminRoute = path.startsWith("/admin");

    if (isAdminRoute) {
      const raw = localStorage.getItem("tie_auth");
      return raw ? JSON.parse(raw)?.adminToken || null : null;
    }

    const raw = localStorage.getItem("tie_customer");
    return raw ? JSON.parse(raw)?.token || null : null;
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
  const headers = { Accept: "application/json", ...extraHeaders };

  let finalBody;

  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      finalBody = body;
    } else {
      headers["Content-Type"] = "application/json";
      finalBody = typeof body === "string" ? body : JSON.stringify(body);
    }
  }

  if (auth) {
    const token = getToken(safePath);
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let response;

  try {
    response = await fetch(`${API_BASE}${safePath}`, {
      method,
      headers,
      body: finalBody,
      cache: "no-store",
    });
  } catch {
    throw new Error("Server connection failed. Please try again.");
  }

  const responseText = await response.text();

  let data = null;

  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    data = { message: responseText };
  }

  if (!response.ok) {
    if (response.status === 401 && safePath.startsWith("/admin")) {
      localStorage.removeItem("tie_auth");
    }

    throw new Error(data?.message || `Request failed (${response.status})`);
  }

  return data;
}

export async function apiFetch(path) {
  return api(path, { method: "GET" });
}

export async function fileData(file, maxWidth = 1600, quality = 0.8) {
  if (!file) throw new Error("No file provided.");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Failed to read file."));

    reader.onload = (event) => {
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

          if (!ctx) throw new Error("Canvas is not supported.");

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL("image/jpeg", quality).split(",")[1]);
        } catch (error) {
          reject(error);
        }
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
}
