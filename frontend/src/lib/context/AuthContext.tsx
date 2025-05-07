//frontend/src/lib/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAuthCookie } from "@/lib/utils/cookie";
import { getUserWithRole } from "@/lib/data/services/userAuth";
import { useRouter } from "next/navigation";
import { UserAuthProvider } from "@/types/userProfile.types";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  refreshAuthStatus: () => Promise<void>;
  userRole: string | null;
  isAdmin: boolean;
  authProvider: UserAuthProvider; 
  handleSuccessfulAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authProvider, setAuthProvider] = useState<UserAuthProvider>(null); 

  // Sentralisert metode for å håndtere vellykket autentisering
  const handleSuccessfulAuth = () => {
    console.log("[AuthContext] Håndterer vellykket autentisering");
    router.push("/");
  };

  const refreshAuthStatus = async () => {
    try {
      const token = await getAuthCookie();

      if (!token) {
        setIsAuthenticated(false);
        setUserRole(null);
        setIsAdmin(false);
        setAuthProvider(null); 
        return;
      }

      try {
        const userData = await getUserWithRole();
        
        setIsAuthenticated(true);
        const role = userData.role?.name || "Authenticated users";
        setUserRole(role);
        setIsAdmin(role === "Admin/moderator/superadmin");
        setAuthProvider(userData.provider as UserAuthProvider || 'local'); 
      } catch (error) {
        console.error("[AuthContext] Failed to fetch user data:", error);
        setIsAuthenticated(false);
        setUserRole(null);
        setIsAdmin(false);
        setAuthProvider(null);
      }
    } catch (error) {
      console.error("[AuthContext] Failed to refresh auth status:", error);
      setIsAuthenticated(false);
      setUserRole(null);
      setIsAdmin(false);
      setAuthProvider(null);
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
      authProvider, 
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