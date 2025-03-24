"use client";

import { useTransition } from "react";
import { logout } from "@/lib/data/actions/auth-actions";

export function LogoutButton({ className = "" }: { className?: string }) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      logout();
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