"use client";

//eksempel kompontent på gjenbrukbare knapper

import { cn } from "@/lib/utils/buttonUtils"; 

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "danger"; 
  size?: "small" | "medium" | "large"; 
  fullWidth?: boolean; 
  children: React.ReactNode; 
  className?: string; 
  onClick?: () => void; 
}

export function Button({
  variant = "primary",
  size = "medium",
  className,
  fullWidth = false,
  children,
  onClick, 
}: ButtonProps) {
  const baseStyles = "rounded-md font-semibold transition-all duration-300 flex items-center justify-center";

  // Variant-stiler
  const variantStyles: Record<string, string> = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-300 text-gray-800 hover:bg-gray-400",
    outline: "border-2 border-gray-500 text-gray-500 hover:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  // Størrelsesstiler
  const sizeStyles: Record<string, string> = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };

  const classes = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? "w-full" : "",
    className
  );

  return (
    <button className={classes} onClick={onClick}> 
      {children}
    </button>
  );
}
