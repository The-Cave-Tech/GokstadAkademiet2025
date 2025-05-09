// components/SearchBar.tsx
import React from "react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: "projects" | "events";
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  activeTab,
}) => {
  return (
    <input
      type="text"
      placeholder={
        activeTab === "projects" ? "Søk i prosjekter" : "Søk i arrangementer"
      }
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2"
    />
  );
};
