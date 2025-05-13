import React from "react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  ariaLabel?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  placeholder = "Search",
  className = "",
  onSearch,
  ariaLabel = "Search input",
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative ${className}`}
      aria-label="Search form" // Add aria-label for better accessibility
    >
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 pr-10"
      />
      {onSearch && (
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
          Submit search
        </button>
      )}
    </form>
  );
};
