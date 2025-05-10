//frontend/src/lib/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { getAuthCookie, removeAuthCookie } from "@/lib/utils/cookie";
import { getUserWithRole } from "@/lib/data/services/userAuth";
import { useRouter } from "next/navigation";
import { UserAuthProvider } from "@/types/userProfile.types";
import { isTokenExpired } from "@/lib/utils/jwt";
import { logout } from "@/lib/data/actions/auth";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  refreshAuthStatus: () => Promise<void>;
  userRole: string | null;
  isAdmin: boolean;
  authProvider: UserAuthProvider; 
  handleSuccessfulAuth: () => void;
  handleTokenExpired: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authProvider, setAuthProvider] = useState<UserAuthProvider>(null); 

  // Handle token expiration
  const handleTokenExpired = useCallback(async () => {
    console.log("[AuthContext] Token expired - logging out");
    try {
      // Call server-side logout action to properly end the session
      await logout();
      
      // Clear auth state client-side
      setIsAuthenticated(false);
      setUserRole(null);
      setIsAdmin(false);
      setAuthProvider(null);
      
      // Redirect with message
      router.push("/?message=Din økt har utløpt. Vennligst logg inn på nytt.");
    } catch (error) {
      console.error("[AuthContext] Error handling token expiration:", error);
      // Even if server-side logout fails, clean up client-side
      await removeAuthCookie();
      setIsAuthenticated(false);
      setUserRole(null);
      setIsAdmin(false);
      setAuthProvider(null);
      router.push("/signin");
    }
  }, [router]);

  const handleSuccessfulAuth = () => {
    console.log("[AuthContext] Håndterer vellykket autentisering");
    refreshAuthStatus();
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

      // Check if token is expired
      if (isTokenExpired(token)) {
        handleTokenExpired();
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

  // Set up event listener for token expiration events
  useEffect(() => {
    const handleTokenExpiredEvent = () => {
      handleTokenExpired();
    };

    window.addEventListener('auth-token-expired', handleTokenExpiredEvent);
    
    // Initial auth check
    refreshAuthStatus();
    
    return () => {
      window.removeEventListener('auth-token-expired', handleTokenExpiredEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleTokenExpired]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated, 
      refreshAuthStatus, 
      userRole,
      isAdmin,
      authProvider, 
      handleSuccessfulAuth,
      handleTokenExpired
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