// src/components/ui/SortDropdown.tsx
import React from "react";
import { Theme } from "@/styles/activityTheme";

export interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  sort: string;
  setSort: (sort: string) => void;
  options: SortOption[];
  ariaLabel?: string;
  placeholder?: string;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  sort,
  setSort,
  options,
  ariaLabel = "Sort options",
  placeholder,
}) => {
  return (
    <div className="relative">
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 appearance-none pr-8"
        style={{
          backgroundColor: "white",
          color: Theme.colors.text.primary,
        }}
        aria-label={ariaLabel}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};
