import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../api";

const C = createContext(null);

// ✅ Helper: read admin token from localStorage (tie_auth)
function readAdminToken() {
  try {
    const raw = localStorage.getItem("tie_auth");
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    return parsed?.adminToken || "";
  } catch {
    return "";
  }
}

// ✅ Helper: save admin token to localStorage (tie_auth)
function saveAdminToken(token) {
  try {
    if (!token) {
      localStorage.removeItem("tie_auth");
      return;
    }
    localStorage.setItem("tie_auth", JSON.stringify({ adminToken: token }));
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tie_customer") || "null");
    } catch {
      return null;
    }
  });

  // ✅ Admin token now stored in localStorage "tie_auth" so api.js can read it
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
    localStorage.setItem("tie_customer", JSON.stringify(x));
    setCustomer(x);
    return x;
  }

  async function registerCustomer(data) {
    const x = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      auth: false,
    });
    localStorage.setItem("tie_customer", JSON.stringify(x));
    setCustomer(x);
    return x;
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
    const n = { ...customer, user: x.user };
    localStorage.setItem("tie_customer", JSON.stringify(n));
    setCustomer(n);
    return x.user;
  }

  async function loginAdmin(data) {
    const x = await api("/admin/login", {
      method: "POST",
      body: JSON.stringify(data),
      auth: false,
    });

    // ✅ Save token in localStorage "tie_auth" as { adminToken }
    saveAdminToken(x.token);
    setAdminToken(x.token);
    return x;
  }

  function logoutAdmin() {
    // ✅ Clear from localStorage
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
