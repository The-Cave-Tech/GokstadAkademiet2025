// components/ui/custom/CartIcon.tsx
"use client";

import React from "react";
import { useCart } from "@/lib/context/shopContext";
import PageIcons from "@/components/ui/custom/PageIcons";
import Link from "next/link";
import { useHydration } from "@/hooks/useHydration";

interface CartIconProps {
  className?: string;
}

export function CartIcon({ className = "" }: CartIconProps) {
  const { cart } = useCart();
  const hasHydrated = useHydration();

  return (
    <Link href="/nettbutikk/cart" className={`relative ${className}`}>
      <div className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200">
        <PageIcons
          name="cart"
          directory="shopIcons"
          size={24}
          alt="Handlekurv"
        />

        {hasHydrated && cart.totalItems > 0 && (
          <div
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            style={{ minWidth: "18px", height: "18px", padding: "2px" }}
          >
            {cart.totalItems > 99 ? "99+" : cart.totalItems}
          </div>
        )}
      </div>
    </Link>
  );
}

export default CartIcon;