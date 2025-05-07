//frontend/src/components/LogoutButton.tsx
"use client";

import { useTransition } from "react";
import { logout } from "@/lib/data/actions/auth";
import { useAuth } from "@/lib/context/AuthContext";

export function LogoutButton({ className = "" }: { className?: string }) {
  const [isPending, startTransition] = useTransition();
  const { setIsAuthenticated } = useAuth();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        setIsAuthenticated(false);
        await logout();
        
        console.log("[Client] Logout successful");
      } catch (error) {
        console.error("[Client] Logout error:", error);
      }
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className={`text-sm hover:underline focus:outline-none focus:ring-2 ${
        isPending ? "text-gray-400" : "text-white"
      } ${className}`}
      aria-label="Logg ut"
    >
      {isPending ? "Logger ut..." : "Logg ut"}
    </button>
  );
}