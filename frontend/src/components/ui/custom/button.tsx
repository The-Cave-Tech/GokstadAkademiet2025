"use client";

import { PageIcons } from "@/components/ui/custom/PageIcons"; 

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "danger" | "change" | "modalChange";
  fullWidth?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  changeState?: "edit" | "save" | "loading"; 
  modalState?: "edit" | "save" | "loading";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  fullWidth = false,
  disabled = false,
  children,
  className = "",
  onClick,
  type = "button",
  ariaLabel,
  changeState,
  modalState,
  size = "md",
}: ButtonProps) {
  const baseStyles =
    "font-semibold transition-all duration-200 flex items-center justify-center focus:outline-none";

  const variantStyles: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 rounded-md px-4 py-2",
    secondary: "bg-gray-300 text-gray-800 hover:bg-gray-400 rounded-md px-4 py-2",
    outline: "border-2 border-gray-500 text-gray-500 hover:bg-gray-100 rounded-md px-4 py-2",
    danger: "bg-red-500 text-white hover:bg-red-600 rounded-md px-4 py-2",
    change: "bg-blue-600 text-white hover:bg-blue-700 rounded-full px-1 py-1", 
    modalChange: "group relative flex items-center px-1 py-1 rounded-full transition-all duration-200 focus:outline-none bg-blue-600",
  };

  const classes = [
    baseStyles,
    variantStyles[variant],
    fullWidth ? "w-full" : "",
    disabled ? "opacity-50 cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

 
  const sizeConfig = {
    sm: {
      buttonSize: "h-8 w-8",
      iconSize: 16
    },
    md: {
      buttonSize: "h-10 w-10",
      iconSize: 20
    },
    lg: {
      buttonSize: "h-12 w-12",
      iconSize: 24
    }
  };

  
  const changeIcons = {
    edit: <PageIcons name="edit" directory="profileIcons" size={sizeConfig[size].iconSize} alt="Endre" color="black" className="" />,
    save: <PageIcons name="save" directory="profileIcons" size={sizeConfig[size].iconSize} alt="Lagre" color="black" className="" />,
    loading: <PageIcons name="loading" directory="profileIcons" size={sizeConfig[size].iconSize} alt="Lagrer" color="black" className="animate-spin" />,
  };

  const changeText = {
    edit: "Endre",
    save: "Lagre",
    loading: "Lagrer",
  };

  const changeAriaLabel = {
    edit: "Endre offentlig profil",
    save: "Lagre offentlig profil",
    loading: "Lagrer...",
  };

  const modalIcons = {
    edit: <PageIcons name="edit" directory="profileIcons" size={sizeConfig[size].iconSize} alt="Endre" color="black" />,
    save: <PageIcons name="save" directory="profileIcons" size={sizeConfig[size].iconSize} alt="Lagre" color="black" />,
    loading: <PageIcons name="loading" directory="profileIcons" size={sizeConfig[size].iconSize} alt="Lagrer" color="black" className="animate-spin" />,
  };

  const modalAriaLabel = {
    edit: "Endre informasjon",
    save: "Lagre informasjon",
    loading: "Lagrer...",
  };

 
  if (variant === "modalChange") {
    if (!modalState) {
      throw new Error("modalState prop is required for variant='modalChange'");
    }
    return (
      <button
        type={type}
        className={classes}
        onClick={onClick}
        disabled={disabled || modalState === "loading"}
        aria-label={ariaLabel || modalAriaLabel[modalState]}
      >
        <span className={`${sizeConfig[size].buttonSize} flex items-center justify-center bg-white rounded-full border border-gray-300 shadow-sm group-hover:bg-white z-10`}>
          {modalIcons[modalState]}
        </span>
      </button>
    );
  }


  if (variant === "change") {
    if (!changeState) {
      throw new Error("changeState prop is required for variant='change'");
    }
    return (
      <button
        type={type}
        className={classes}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel || changeAriaLabel[changeState]}
      >
        <span className={`${sizeConfig[size].buttonSize} flex items-center justify-center bg-white rounded-full border border-gray-300 shadow-sm z-10`}>
          {changeIcons[changeState]}
        </span>
        <span className="overflow-hidden max-w-[70px] transition-all duration-300 text-white font-bold whitespace-nowrap px-2 rounded-full ml-0 text-base">
          {changeText[changeState]}
        </span>
      </button>
    );
  }


  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}