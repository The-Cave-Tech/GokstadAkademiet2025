import React from "react";
import { Theme } from "@/styles/activityTheme";

interface FilterDropdownProps {
  filter: string;
  setFilter: (filter: string) => void;
  activeTab: "projects" | "events";
}

// Filter options based on the active tab
const PROJECT_FILTERS = [
  { value: "all", label: "All Projects" },
  { value: "planning", label: "Planning" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const EVENT_FILTERS = [
  { value: "all", label: "All Events" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
];

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filter,
  setFilter,
  activeTab,
}) => {
  // Determine which filter options to show based on the active tab
  const filterOptions =
    activeTab === "projects" ? PROJECT_FILTERS : EVENT_FILTERS;

  return (
    <div className="relative">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 appearance-none pr-8"
        style={{
          backgroundColor: "white",
          color: Theme.colors.text.primary,
        }}
      >
        {filterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};
