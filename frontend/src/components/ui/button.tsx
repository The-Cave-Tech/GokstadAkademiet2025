"use client";

import { ButtonHTMLAttributes } from "react"; // Importer ButtonHTMLAttributes

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "change";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  label?: string; // Label text for the "change" button
}

export function Button({
  variant = "primary",
  size = "medium",
  className,
  fullWidth = false,
  children,
  onClick,
  label = "Edit",
  ...rest // Spre resterende props (som type, aria-label, etc.)
}: ButtonProps) {
  // Special "change" button case
  if (variant === "change") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group relative flex items-center px-1 py-1 rounded-full transition-all duration-200 focus:outline-none bg-[#00b4ff] focus:ring-2 focus:ring-blue-500"
        aria-label="Edit public profile"
        {...rest} // Spre resterende props
      >
        {/* White circle with pencil icon */}
        <span className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-gray-300 shadow-sm z-10">
          ✏️
        </span>

        {/* Label text shown on hover */}
        <span className="overflow-hidden max-w-0 group-hover:max-w-[70px] transition-all duration-300 text-white whitespace-nowrap group-hover:px-3 group-hover:py-2 group-hover:flex group-hover:items-center group-hover:justify-center rounded-full group-hover:ml-2">
          {label}
        </span>
      </button>
    );
  }

  // Regular button styling
  const baseStyles = "rounded-md font-semibold transition-all duration-300 flex items-center justify-center";

  const variantStyles: Record<string, string> = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-300 text-gray-800 hover:bg-gray-400",
    outline: "border-2 border-gray-500 text-gray-500 hover:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  const sizeStyles: Record<string, string> = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };

  const classes = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}