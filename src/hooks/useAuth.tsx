"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface UserData {
  userId: string;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
}

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  login: (token: string, user: UserData) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: UserData) => {
    localStorage.setItem("auth_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    localStorage.removeItem("auth_user");
    setUser(null);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
