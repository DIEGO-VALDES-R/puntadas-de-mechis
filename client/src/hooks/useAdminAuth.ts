import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export interface AdminAuth {
  isAuthenticated: boolean;
  token: string | null;
  role: string | null;
  isLoading: boolean;
}

export function useAdminAuth(): AdminAuth & { logout: () => void } {
  const [auth, setAuth] = useState<AdminAuth>({
    isAuthenticated: false,
    token: null,
    role: null,
    isLoading: true,
  });
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if admin is already logged in
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole");

    if (token && role) {
      setAuth({
        isAuthenticated: true,
        token,
        role,
        isLoading: false,
      });
    } else {
      setAuth({
        isAuthenticated: false,
        token: null,
        role: null,
        isLoading: false,
      });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    setAuth({
      isAuthenticated: false,
      token: null,
      role: null,
      isLoading: false,
    });
    setLocation("/admin/login");
  };

  return { ...auth, logout };
}
