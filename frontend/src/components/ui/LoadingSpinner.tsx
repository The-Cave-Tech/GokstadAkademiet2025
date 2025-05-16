import React from "react";
import { Theme } from "@/styles/activityTheme";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  borderWidth?: number;
  className?: string;
  color?: string;
  backgroundColor?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  borderWidth = 3,
  className = "",
  color = Theme.colors.primary,
  backgroundColor = Theme.colors.divider,
}) => {
  // Size mapping
  const sizeMap = {
    small: "h-6 w-6",
    medium: "h-12 w-12",
    large: "h-16 w-16",
  };

  const sizeClass = sizeMap[size];

  return (
    <div className={`flex justify-center my-4 ${className}`}>
      <div
        className={`animate-spin rounded-full ${sizeClass}`}
        style={{
          borderWidth: `${borderWidth}px`,
          borderStyle: "solid",
          borderColor: backgroundColor,
          borderTopColor: color,
        }}
        role="status"
        aria-label="Loading"
      ></div>
    </div>
  );
};
