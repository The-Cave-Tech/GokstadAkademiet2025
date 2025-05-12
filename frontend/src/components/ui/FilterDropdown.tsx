// components/ui/FilterDropdown.tsx
"use client";

import React, { useId } from "react";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDropdownProps {
  filter: string;
  setFilter: (filter: string) => void;
  options: FilterOption[];
  ariaLabel?: string;
  label?: string;
  className?: string;
  id?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filter,
  setFilter,
  options,
  ariaLabel,
  label,
  className = "",
  id: propId,
}) => {
  // Generate a unique ID if not provided
  const generatedId = useId();
  const id = propId || `filter-dropdown-${generatedId}`;
  const labelId = `${id}-label`;

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label id={labelId} htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={ariaLabel}
          aria-labelledby={label ? labelId : undefined}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2" aria-hidden="true">
          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
