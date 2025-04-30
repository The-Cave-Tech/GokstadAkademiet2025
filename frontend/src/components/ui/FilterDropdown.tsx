import React from "react";

interface FilterDropdownProps {
  filter: string;
  setFilter: (filter: string) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filter,
  setFilter,
}) => {
  return (
    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2"
    >
      <option value="all">All</option>
      <option value="category1">Category 1</option>
      <option value="category2">Category 2</option>
      <option value="category3">Category 3</option>
    </select>
  );
};
