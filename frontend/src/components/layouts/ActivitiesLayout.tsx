// src/components/layouts/ActivitiesLayout.tsx
"use client";

import React from "react";
import { Theme } from "@/styles/activityTheme";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { SortDropdown, SortOption } from "@/components/ui/SortDropdown";
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

// Define common sort options
const COMMON_SORT_OPTIONS: SortOption[] = [
  { value: "newest", label: "Nyeste først" },
  { value: "oldest", label: "Eldste først" },
  { value: "alphabetical", label: "A til Å" },
  { value: "reverseAlphabetical", label: "Å til A" },
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
  sort: string;
  onSortAction: (sort: string) => void;
}

export const ActivitiesLayout: React.FC<ActivitiesLayoutProps> = ({
  children,
  activeTab,
  onTabAction,
  searchQuery,
  onSearchAction,
  filter,
  onFilterAction,
  sort,
  onSortAction,
}) => {
  // Get the appropriate filter options based on active tab
  const filterOptions = activeTab === "projects" ? PROJECT_FILTERS : EVENT_FILTERS;

  // Get the appropriate sort options based on active tab
  const sortOptions = activeTab === "events" ? COMMON_SORT_OPTIONS : COMMON_SORT_OPTIONS;

  // Create a type-safe adapter for the tab action
  const handleTabChange = (tabId: string) => {
    onTabAction(tabId as "projects" | "events");
  };

  return (
    <main className="bg-background min-h-screen p-6 sm:p-8 md:p-10">
      <header>
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Aktiviteter</h2>
      </header>
      <div
        className="max-w-7xl mx-auto rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: Theme.colors.surface }}
      >
        {/* Header */}
        <header className="text-profile-text px-6 py-5 sm:px-8 sm:py-6">
          <section className="flex flex-col sm:flex-row justify-between items-center">
            {/* Navigation Tabs */}
            <nav>
              <TabSelector tabs={TAB_OPTIONS} activeTab={activeTab} setActiveTab={handleTabChange} size="medium" />
            </nav>

            {/* Search, Filter, and Sort */}
            <section className="flex flex-col text-black sm:flex-row items-center gap-4 mt-4 sm:mt-0">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={onSearchAction}
                placeholder={activeTab === "projects" ? "Søk etter prosjekter" : "Søk etter arrangementer"}
                ariaLabel={`Søk etter ${activeTab === "projects" ? "prosjekter" : "arrangementer"}`}
              />

              <div className="flex flex-row gap-4">
                <FilterDropdown
                  filter={filter}
                  setFilter={onFilterAction}
                  options={filterOptions}
                  ariaLabel={`Filtrer ${activeTab === "projects" ? "prosjekter" : "arrangementer"}`}
                />

                <SortDropdown
                  sort={sort}
                  setSort={onSortAction}
                  options={sortOptions}
                  ariaLabel={`Sorter ${activeTab === "projects" ? "prosjekter" : "arrangementer"}`}
                  placeholder="Sorter etter"
                />
              </div>
            </section>
          </section>
        </header>

        {/* Content */}
        <section className="p-6 sm:p-8">{children}</section>
      </div>
    </main>
  );
};
