// src/components/layouts/ActivitiesLayout.tsx
"use client";

import React from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { TabSelector } from "@/components/ui/TabSelector";
import { Theme } from "@/styles/activityTheme";

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
            {/* Navigation Tabs */}
            <TabSelector activeTab={activeTab} setActiveTab={onTabAction} />

            {/* Search and Filter */}
            <div className="flex flex-col text-black sm:flex-row items-center gap-4 mt-4 sm:mt-0">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={onSearchAction}
                activeTab={activeTab}
              />
              <FilterDropdown
                filter={filter}
                setFilter={onFilterAction}
                activeTab={activeTab}
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
