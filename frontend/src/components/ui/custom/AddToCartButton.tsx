// components/ui/custom/AddToCartButton.tsx
"use client";

import { useState } from "react";
import PageIcons from "@/components/ui/custom/PageIcons";

interface AddToCartButtonProps {
  productId: string | number;
  onAddToCart: (id: string | number) => void;
  className?: string;
  variant?: "primary" | "secondary" | "minimal";
  quantity?: number;
  disabled?: boolean;
  showText?: boolean;
}

export function AddToCartButton({
  productId,
  onAddToCart,
  className = "",
  variant = "primary",
  quantity = 1,
  disabled = false,
  showText = true,
}: AddToCartButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking the button

    if (disabled) return;

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 700);
    onAddToCart(productId);
  };

  // Variant styles
  const buttonStyles = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    minimal: "bg-transparent text-white",
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isAnimating}
      className={`rounded-md flex items-center justify-center transition-all duration-200 ${buttonStyles[variant]} ${
        showText ? "px-4 py-2" : "p-2"
      } ${className}`}
      aria-label="Legg til i handlekurv"
    >
      <div className={isAnimating ? "animate-bounce" : ""}>
        <PageIcons name="cart" directory="shopIcons" size={20} alt="" className={`${showText ? "mr-2" : ""}`} />
      </div>

      {showText && <span>Legg til i handlekurv</span>}
    </button>
  );
}

export default AddToCartButton;
