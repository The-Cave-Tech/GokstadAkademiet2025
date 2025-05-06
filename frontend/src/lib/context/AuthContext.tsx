"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAuthCookie } from "@/lib/utils/cookie";
import { getUserWithRole } from "@/lib/data/services/userAuth";
import { useRouter } from "next/navigation";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  refreshAuthStatus: () => Promise<void>;
  userRole: string | null;
  isAdmin: boolean;
  handleSuccessfulAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Sentralisert metode for å håndtere vellykket autentisering
  const handleSuccessfulAuth = () => {
    console.log("[AuthContext] Håndterer vellykket autentisering");
    router.push("/dashboard");
  };

  const refreshAuthStatus = async () => {
    try {
      const token = await getAuthCookie();

      if (!token) {
        setIsAuthenticated(false);
        setUserRole(null);
        setIsAdmin(false);
        return;
      }

      try {
        const userData = await getUserWithRole();
        
        setIsAuthenticated(true);
        const role = userData.role?.name || "Authenticated users";
        setUserRole(role);
        setIsAdmin(role === "Admin/moderator/superadmin");
      } catch (error) {
        console.error("[AuthContext] Failed to fetch user data:", error);
        setIsAuthenticated(false);
        setUserRole(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("[AuthContext] Failed to refresh auth status:", error);
      setIsAuthenticated(false);
      setUserRole(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    refreshAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated, 
      refreshAuthStatus, 
      userRole,
      isAdmin,
      handleSuccessfulAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}