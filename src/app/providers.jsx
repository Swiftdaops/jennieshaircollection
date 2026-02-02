"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient, getAxiosErrorMessage } from "@/lib/apiClient";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchMe() {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/api/auth/me");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login({ email, password }) {
    try {
      await apiClient.post("/api/auth/login", { email, password }, { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      throw new Error(getAxiosErrorMessage(err, "Login failed"));
    }
    await fetchMe();
  }

  async function logout() {
    await apiClient.post("/api/auth/logout").catch(() => {});
    setUser(null);
  }

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === "admin",
        login,
        logout,
        refresh: fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
