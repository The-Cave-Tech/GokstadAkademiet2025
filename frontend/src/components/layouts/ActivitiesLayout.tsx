// src/components/layouts/ActivitiesLayout.tsx
"use client";

import React from "react";
import { Theme } from "@/styles/activityTheme";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { TabSelector, TabOption } from "@/components/ui/TabSelector";

// Define project filters
const PROJECT_FILTERS = [
  { value: "all", label: "Alle prosjekter" },
  { value: "planning", label: "Planlegger" },
  { value: "in-progress", label: "Pågående" },
  { value: "complete", label: "Fullført" },
];

// Define event filters
const EVENT_FILTERS = [
  { value: "all", label: "Alle arrangementer" },
  { value: "upcoming", label: "Kommende" },
  { value: "past", label: "Tidligere" },
];

// Tab options
const TAB_OPTIONS: TabOption[] = [
  { id: "projects", label: "Prosjekter" },
  { id: "events", label: "Arrangementer" },
];

interface ActivitiesLayoutProps {
  children: React.ReactNode;
  activeTab: "projects" | "events";
  onTabAction: (tab: "projects" | "events") => void;
  searchQuery: string;
  onSearchAction: (query: string) => void;
  filter: string;
  onFilterAction: (filter: string) => void;
}

export const ActivitiesLayout: React.FC<ActivitiesLayoutProps> = ({
  children,
  activeTab,
  onTabAction,
  searchQuery,
  onSearchAction,
  filter,
  onFilterAction,
}) => {
  // Get the appropriate filter options based on active tab
  const filterOptions =
    activeTab === "projects" ? PROJECT_FILTERS : EVENT_FILTERS;

  // Create a type-safe adapter for the tab action
  const handleTabChange = (tabId: string) => {
    // Type assertion here is safe because we know tabId will only be from TAB_OPTIONS
    onTabAction(tabId as "projects" | "events");
  };

  return (
    <div className="bg-background min-h-screen p-6 sm:p-8 md:p-10">
      <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
        Aktiviteter
      </h2>
      <div
        className="max-w-7xl mx-auto rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: Theme.colors.surface }}
      >
        {/* Header */}
        <div className="text-profile-text px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            {/* Navigation Tabs - Using Universal TabSelector with adapter function */}
            <TabSelector
              tabs={TAB_OPTIONS}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              size="medium"
            />

            {/* Search and Filter */}
            <div className="flex flex-col text-black sm:flex-row items-center gap-4 mt-4 sm:mt-0">
              {/* Universal SearchBar */}
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={onSearchAction}
                placeholder={
                  activeTab === "projects"
                    ? "Søk i prosjekter"
                    : "Søk i arrangementer"
                }
                ariaLabel={`Søk i ${activeTab === "projects" ? "prosjekter" : "arrangementer"}`}
              />

              {/* Universal FilterDropdown */}
              <FilterDropdown
                filter={filter}
                setFilter={onFilterAction}
                options={filterOptions}
                ariaLabel={`Filtrer ${activeTab === "projects" ? "prosjekter" : "arrangementer"}`}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
};
