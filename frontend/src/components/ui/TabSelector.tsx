// components/ui/TabSelector.tsx
import React from "react";
import { Theme } from "@/styles/activityTheme";

interface TabSelectorProps {
  activeTab: "projects" | "events";
  setActiveTab: (tab: "projects" | "events") => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="flex">
      <button
        onClick={() => setActiveTab("projects")}
        className={`px-4 py-2 rounded-l-md text-sm font-medium ${
          activeTab === "projects"
            ? "bg-secondary text-white"
            : "bg-transparent text-primary"
        }`}
        style={{
          border: `1px solid ${Theme.colors.divider}`,
          backgroundColor:
            activeTab === "projects" ? Theme.colors.primary : "transparent",
        }}
      >
        Prosjekter
      </button>
      <button
        onClick={() => setActiveTab("events")}
        className={`px-4 py-2 rounded-r-md text-sm font-medium ${
          activeTab === "events"
            ? "bg-black text-white"
            : "bg-transparent text-primary"
        }`}
        style={{
          border: `1px solid ${Theme.colors.divider}`,
          backgroundColor:
            activeTab === "events" ? Theme.colors.primary : "transparent",
        }}
      >
        Arrangementer
      </button>
    </div>
  );
};
