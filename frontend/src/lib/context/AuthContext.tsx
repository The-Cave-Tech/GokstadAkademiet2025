"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  refreshAuthStatus: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Function to check authentication status from the server
  const refreshAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/check');
      if (!response.ok) {
        throw new Error('Failed to fetch auth status');
      }
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
      console.log("[Client] Auth status refreshed:", data.authenticated);
    } catch (error) {
      console.error("[Client] Failed to check authentication status:", error);
      setIsAuthenticated(false);
    }
  };

  // Check auth status when component mounts
  useEffect(() => {
    refreshAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, refreshAuthStatus }}>
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