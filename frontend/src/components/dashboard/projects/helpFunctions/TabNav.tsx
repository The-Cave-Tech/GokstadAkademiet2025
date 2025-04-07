import React from "react";

export type TabType = "basic" | "details";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex border-b mb-4">
      <button
        type="button"
        className={`py-2 px-4 ${
          activeTab === "basic"
            ? "border-b-2 border-blue-500 font-semibold"
            : "text-gray-500"
        }`}
        onClick={() => onTabChange("basic")}
      >
        Kortet
      </button>
      <button
        type="button"
        className={`py-2 px-4 ${
          activeTab === "details"
            ? "border-b-2 border-blue-500 font-semibold"
            : "text-gray-500"
        }`}
        onClick={() => onTabChange("details")}
      >
        Detaljevisning
      </button>
    </div>
  );
};

export default TabNavigation;
