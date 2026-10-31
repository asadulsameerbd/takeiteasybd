// client/src/context/AuthContext.jsx

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { api } from "../api";

const C = createContext(null);

// ============================================================
// Local Storage Helpers
// ============================================================

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
    if (!data) {
      localStorage.removeItem("tie_customer");
    } else {
      localStorage.setItem("tie_customer", JSON.stringify(data));
    }
  } catch (error) {
    console.error("Customer storage error:", error);
  }
}

function saveAdminToken(token) {
  try {
    if (!token) {
      localStorage.removeItem("tie_auth");
    } else {
      localStorage.setItem("tie_auth", JSON.stringify({ adminToken: token }));
    }
  } catch (error) {
    console.error("Admin storage error:", error);
  }
}

// ============================================================
// Normalize User
// ============================================================

function normalizeUser(user) {
  if (!user) return null;

  const id = user.id || user._id;

  return {
    ...user,
    id,
    _id: id,
  };
}

function normalizeCustomer(payload) {
  if (!payload?.token) return null;

  return {
    ...payload,
    user: normalizeUser(payload.user),
  };
}

// ============================================================
// Auth Provider
// ============================================================

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(() =>
    normalizeCustomer(readCustomer()),
  );

  const [adminToken, setAdminToken] = useState(() => readAdminToken());

  // ==========================================================
  // Sync Customer Token
  // ==========================================================

  useEffect(() => {
    try {
      if (customer?.token) {
        localStorage.setItem("tie_token", customer.token);
      } else {
        localStorage.removeItem("tie_token");
      }
    } catch (error) {
      console.error("Customer token storage error:", error);
    }
  }, [customer]);

  // ==========================================================
  // ✅ Cross-tab Sync (Storage Event Listener)
  // একই ব্রাউজারের অন্য ট্যাবে login/logout হলে এই ট্যাবেও সিঙ্ক হবে
  // ==========================================================

  useEffect(() => {
    const handleStorage = (e) => {
      // Admin token change
      if (e.key === "tie_auth") {
        const newToken = e.newValue
          ? JSON.parse(e.newValue)?.adminToken || ""
          : "";
        setAdminToken(newToken);
      }

      // Customer change (login/logout/profile update)
      if (e.key === "tie_customer") {
        const newCustomer = e.newValue ? JSON.parse(e.newValue) : null;
        setCustomer(normalizeCustomer(newCustomer));
      }

      // Customer token clear হলে (logout)
      if (e.key === "tie_token" && !e.newValue) {
        setCustomer(null);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ==========================================================
  // Customer Login
  // ==========================================================

  async function customerLogin(data) {
    const response = await api("/auth/login", {
      method: "POST",
      body: data,
      auth: false,
    });

    const normalized = normalizeCustomer(response);

    if (!normalized) {
      throw new Error("Customer login failed. Invalid server response.");
    }

    saveCustomer(normalized);
    setCustomer(normalized);

    return normalized;
  }

  // ==========================================================
  // Customer Registration
  // ==========================================================

  async function registerCustomer(data) {
    const response = await api("/auth/register", {
      method: "POST",
      body: data,
      auth: false,
    });

    const normalized = normalizeCustomer(response);

    if (!normalized) {
      throw new Error("Registration failed. Invalid server response.");
    }

    saveCustomer(normalized);
    setCustomer(normalized);

    return normalized;
  }

  // ==========================================================
  // Customer Logout
  // ==========================================================

  function logoutCustomer() {
    try {
      localStorage.removeItem("tie_customer");
      localStorage.removeItem("tie_token");
    } catch (error) {
      console.error("Customer logout error:", error);
    }

    setCustomer(null);
  }

  // ==========================================================
  // Update Customer Profile
  // ==========================================================

  async function updateProfile(data) {
    if (!customer?.token) {
      throw new Error("Please login first.");
    }

    const response = await api("/auth/profile", {
      method: "PATCH",
      body: data,
    });

    const updatedCustomer = {
      ...customer,
      user: normalizeUser(response.user),
    };

    saveCustomer(updatedCustomer);
    setCustomer(updatedCustomer);

    return updatedCustomer.user;
  }

  // ==========================================================
  // Admin Login
  // ==========================================================

  async function loginAdmin(data) {
    const email = String(data?.email || "").trim();
    const password = String(data?.password || "");

    if (!email || !password) {
      throw new Error("Admin email and password are required.");
    }

    const response = await api("/admin/login", {
      method: "POST",
      body: {
        email,
        password,
      },
      auth: false,
    });

    if (!response?.token) {
      throw new Error(
        response?.message || "Admin login failed. Token not received.",
      );
    }

    saveAdminToken(response.token);
    setAdminToken(response.token);

    return response;
  }

  // ==========================================================
  // Admin Logout
  // ==========================================================

  function logoutAdmin() {
    saveAdminToken("");
    setAdminToken("");
  }

  // ==========================================================
  // Context Value
  // ==========================================================

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

// ============================================================
// Auth Hook
// ============================================================

export const useAuth = () => useContext(C);
