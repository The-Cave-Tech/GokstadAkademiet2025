// components/ui/TabSelector.tsx
import React from "react";
import { Theme } from "@/styles/activityTheme";

export interface TabOption {
  id: string;
  label: React.ReactNode;
}

interface TabSelectorProps {
  tabs: TabOption[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  className?: string;
  orientation?: "horizontal" | "vertical";
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  className = "",
  orientation = "horizontal",
  fullWidth = false,
  size = "medium",
}) => {
  // Size mapping
  const sizeMap = {
    small: "text-xs px-2 py-1",
    medium: "text-sm px-4 py-2",
    large: "text-base px-6 py-3",
  };

  const sizeClass = sizeMap[size];

  // Layout classes based on orientation
  const containerClass =
    orientation === "horizontal" ? "flex" : "flex flex-col";

  const fullWidthClass = fullWidth ? "w-full" : "";

  return (
    <div className={`${containerClass} ${className} ${fullWidthClass}`}>
      {tabs.map((tab, index) => {
        const isFirst = index === 0;
        const isLast = index === tabs.length - 1;

        // Set border radius based on position and orientation
        let borderRadiusClass = "";
        if (orientation === "horizontal") {
          if (isFirst) borderRadiusClass = "rounded-l-md";
          if (isLast) borderRadiusClass = "rounded-r-md";
        } else {
          if (isFirst) borderRadiusClass = "rounded-t-md";
          if (isLast) borderRadiusClass = "rounded-b-md";
        }

        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${sizeClass} ${borderRadiusClass} font-medium ${fullWidthClass}`}
            style={{
              border: `1px solid ${Theme.colors.divider}`,
              backgroundColor: isActive ? Theme.colors.primary : "transparent",
              color: isActive ? "white" : Theme.colors.text.primary,
              // Remove double borders between tabs
              ...(orientation === "horizontal" &&
                !isFirst && { marginLeft: "-1px" }),
              ...(orientation === "vertical" &&
                !isFirst && { marginTop: "-1px" }),
              position: "relative", // For z-index to work
              zIndex: isActive ? 1 : 0, // Active tab appears above others
            }}
            aria-selected={isActive}
            role="tab"
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
