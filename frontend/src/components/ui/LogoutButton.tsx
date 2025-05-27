"use client";

import { useTransition } from "react";
import { logout } from "@/lib/data/actions/auth";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/Button"; // Adjust path as needed

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
    <Button
      onClick={handleLogout}
      disabled={isPending}
      variant="secondary" 
      className={`text-sm hover:underline !justify-start focus:ring-2 ${className}`}
      ariaLabel="Logg ut"
    >
      {isPending ? "Logger ut..." : "Logg ut"}
    </Button>
  );
}