"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
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
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        refreshAuthStatus,
        userRole,
        isAdmin,
        handleSuccessfulAuth,
      }}
    >
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
("use client");

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getAuthCookie } from "@/lib/utils/cookie";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  refreshAuthStatus: () => Promise<void>;
  userRole: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const refreshAuthStatus = async () => {
    try {
      const token = await getAuthCookie();
      console.log("[AuthContext] Token:", token);

      if (!token) {
        console.log("[AuthContext] No token found");
        setIsAuthenticated(false);
        setUserRole(null);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
      const response = await fetch(
        `${baseUrl}/api/users/me?populate[role][fields][0]=name`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch user data: ${response.status} - ${errorText}`
        );
      }

      const userData = await response.json();
      console.log("[AuthContext] User data:", userData);

      setIsAuthenticated(true);
      setUserRole(userData.role?.name || "Authenticated users");
    } catch (error) {
      console.error("[AuthContext] Failed to refresh auth status:", error);
      setIsAuthenticated(false);
      setUserRole(null);
    }
  };

  useEffect(() => {
    refreshAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        refreshAuthStatus,
        userRole,
      }}
    >
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
