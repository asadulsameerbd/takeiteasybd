import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../api";

const C = createContext(null);

function readCustomer() {
  try {
    const raw = localStorage.getItem("tie_customer");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readAdminToken() {
  try {
    const raw = localStorage.getItem("tie_auth");
    return raw ? JSON.parse(raw)?.adminToken || "" : "";
  } catch {
    return "";
  }
}

function saveCustomer(data) {
  try {
    if (!data) localStorage.removeItem("tie_customer");
    else localStorage.setItem("tie_customer", JSON.stringify(data));
  } catch {}
}

function saveAdminToken(token) {
  try {
    if (!token) localStorage.removeItem("tie_auth");
    else
      localStorage.setItem("tie_auth", JSON.stringify({ adminToken: token }));
  } catch {}
}

// ✅ user object-এ সবসময় `id` আর `_id` দুটোই থাকবে (defensive)
function normalizeUser(user) {
  if (!user) return null;
  const id = user.id || user._id;
  return { ...user, id, _id: id };
}

function normalizeCustomer(payload) {
  if (!payload?.token) return null;
  return { ...payload, user: normalizeUser(payload.user) };
}

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(() =>
    normalizeCustomer(readCustomer()),
  );
  const [adminToken, setAdminToken] = useState(() => readAdminToken());

  useEffect(() => {
    if (customer?.token) localStorage.setItem("tie_token", customer.token);
    else localStorage.removeItem("tie_token");
  }, [customer]);

  async function customerLogin(data) {
    const x = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      auth: false,
    });
    const normalized = normalizeCustomer(x);
    saveCustomer(normalized);
    setCustomer(normalized);
    return normalized;
  }

  async function registerCustomer(data) {
    const x = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      auth: false,
    });
    const normalized = normalizeCustomer(x);
    saveCustomer(normalized);
    setCustomer(normalized);
    return normalized;
  }

  function logoutCustomer() {
    localStorage.removeItem("tie_customer");
    localStorage.removeItem("tie_token");
    setCustomer(null);
  }

  async function updateProfile(data) {
    const x = await api("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    const n = { ...customer, user: normalizeUser(x.user) };
    saveCustomer(n);
    setCustomer(n);
    return n.user;
  }

  async function loginAdmin(data) {
    const x = await api("/admin/login", {
      method: "POST",
      body: JSON.stringify(data),
      auth: false,
    });
    saveAdminToken(x.token);
    setAdminToken(x.token);
    return x;
  }

  function logoutAdmin() {
    saveAdminToken("");
    setAdminToken("");
  }

  const value = useMemo(
    () => ({
      customer,
      adminToken,
      customerLogin,
      registerCustomer,
      logoutCustomer,
      updateProfile,
      loginAdmin,
      logoutAdmin,
    }),
    [customer, adminToken],
  );

  return <C.Provider value={value}>{children}</C.Provider>;
}

export const useAuth = () => useContext(C);
