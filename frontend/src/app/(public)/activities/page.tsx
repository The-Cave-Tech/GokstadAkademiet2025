"use client";

import React, { useState, useEffect } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { TabSelector } from "@/components/ui/TabSelector";
import { ProjectCard } from "@/components/dashboard/contentManager/ProjectCard";
import { EventCard } from "@/components/dashboard/contentManager/EventCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { isDatePast } from "@/lib/utils/dateUtils";
import { useDataFetching } from "@/hooks/useContentFetching";
import { Theme } from "@/styles/activityTheme";
import { Project, Event } from "@/types/activity.types";

const ActivitiesPage = () => {
  const [activeTab, setActiveTab] = useState<"projects" | "events">("projects");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");

  // Lagre aktivt tab i localStorage ved endring
  useEffect(() => {
    localStorage.setItem("activities-active-tab", activeTab);
  }, [activeTab]);

  // Custom hook for data fetching
  const {
    data: { projects, events },
    isLoading,
    error,
  } = useDataFetching(activeTab);

  // State for custom filtered data
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  // Handle special filtering for events based on date
  useEffect(() => {
    // Apply search filter first
    let searchFiltered = events;
    if (searchQuery) {
      searchFiltered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (event.Description &&
            event.Description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Then apply specific filters
    if (activeTab === "events") {
      if (filter === "upcoming") {
        // Filter to only show upcoming events
        setFilteredEvents(
          searchFiltered.filter((event) => !isDatePast(event.startDate))
        );
      } else if (filter === "past") {
        // Filter to only show past events
        setFilteredEvents(
          searchFiltered.filter((event) => isDatePast(event.startDate))
        );
      } else {
        // Show all events
        setFilteredEvents(searchFiltered);
      }
    }
  }, [events, filter, searchQuery, activeTab]);

  // Handle filtering for projects
  useEffect(() => {
    // Apply search filter first
    let filtered = projects;

    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (project.description &&
            project.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category/status filters
    if (activeTab === "projects" && filter !== "all") {
      if (["planning", "in-progress", "completed"].includes(filter)) {
        // Filter by status
        filtered = filtered.filter((project) => project.status === filter);
      } else {
        // Filter by category
        filtered = filtered.filter((project) => project.category === filter);
      }
    }

    setFilteredProjects(filtered);
  }, [projects, filter, searchQuery, activeTab]);

  return (
    <div
      className="min-h-screen p-6 sm:p-8 md:p-10"
      style={{ backgroundColor: Theme.colors.background }}
    >
      <div
        className="max-w-7xl mx-auto rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: Theme.colors.surface }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 sm:px-8 sm:py-6"
          style={{ backgroundColor: Theme.colors.primary, color: "white" }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center">
            {/* Navigation Tabs */}
            <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Search and Filter */}
            <div className="flex flex-col text-black sm:flex-row items-center gap-4 mt-4 sm:mt-0">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeTab={activeTab}
              />
              <FilterDropdown
                filter={filter}
                setFilter={setFilter}
                activeTab={activeTab}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {renderContent(
            isLoading,
            error,
            activeTab,
            filteredProjects,
            filteredEvents
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to render the appropriate content based on state
const renderContent = (
  isLoading: boolean,
  error: string | null,
  activeTab: string,
  filteredProjects: Project[],
  filteredEvents: Event[]
) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // No results message
  if (
    (activeTab === "projects" && filteredProjects.length === 0) ||
    (activeTab === "events" && filteredEvents.length === 0)
  ) {
    return (
      <div className="text-center py-10">
        <h3
          className="text-xl font-medium"
          style={{ color: Theme.colors.text.secondary }}
        >
          Ingen resultater funnet
        </h3>
        <p className="mt-2" style={{ color: Theme.colors.text.light }}>
          Prøv å justere søk eller filter
        </p>
      </div>
    );
  }

  if (activeTab === "projects") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default ActivitiesPage;
