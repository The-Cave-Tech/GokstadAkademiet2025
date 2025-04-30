import { useState, useEffect } from "react";

export const useFilterAndSearch = (
  projects: any[],
  events: any[],
  activeTab: "projects" | "events",
  searchQuery: string,
  filter: string
) => {
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === "projects") {
      setFilteredProjects(filterProjects(projects, searchQuery, filter));
    } else if (activeTab === "events") {
      setFilteredEvents(filterEvents(events, searchQuery, filter));
    }
  }, [searchQuery, filter, projects, events, activeTab]);

  return {
    filteredProjects,
    filteredEvents,
  };
};

// Helper function to filter projects
const filterProjects = (
  projects: any[],
  searchQuery: string,
  filter: string
) => {
  let filtered = [...projects];

  // Apply search filter
  if (searchQuery) {
    filtered = filtered.filter((project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply additional filters
  if (filter !== "all") {
    filtered = filtered.filter((project) => project.category === filter);
  }

  return filtered;
};

// Helper function to filter events
const filterEvents = (events: any[], searchQuery: string, filter: string) => {
  let filtered = [...events];

  // Apply search filter
  if (searchQuery) {
    filtered = filtered.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply additional filters
  if (filter !== "all") {
    filtered = filtered.filter((event) => event.type === filter);
  }

  return filtered;
};
