"use client";

import { useEffect, useState, createContext, useContext, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";

export interface AuthUser {
  userId: string;
  email: string;
  username: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isCustomer: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  isStaff: false,
  isCustomer: false,
  login: () => {},
  logout: async () => {},
  refreshAuth: async () => {},
});

const AUTH_STORAGE_KEY = "md_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore session from storage
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored) as AuthUser);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        await fetch("/api/auth/refresh", { method: "POST" });
      } catch {
        // Silent fail — will redirect on next page load
      }
    }, 13 * 60 * 1000); // every 13 minutes (token = 15min)

    return () => clearInterval(interval);
  }, [user]);

  const login = useCallback((userData: AuthUser) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }, [router]);

  const refreshAuth = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (!res.ok) {
        logout();
      }
    } catch {
      logout();
    }
  }, [user, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        isStaff: user?.role === "STAFF",
        isCustomer: user?.role === "CUSTOMER",
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
