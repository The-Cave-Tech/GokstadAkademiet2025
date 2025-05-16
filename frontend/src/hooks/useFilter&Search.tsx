import { useState, useEffect } from "react";
import { Project, Event } from "@/types/activity.types";

export const useFilterAndSearch = (
  projects: Project[],
  events: Event[],
  activeTab: "projects" | "events",
  searchQuery: string,
  filter: string
) => {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

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
  projects: Project[],
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
const filterEvents = (events: Event[], searchQuery: string, filter: string) => {
  let filtered = [...events];

  // Apply search filter
  if (searchQuery) {
    filtered = filtered.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply additional filters
  if (filter !== "all") {
    // Note: We used "type" before, but EventAttributes doesn't have a "type" field
    // Filter might need to be adjusted based on what field is used for filtering events
    // Using status or another appropriate field might make sense
    const filterField = "status"; // Replace with appropriate field from EventAttributes
    filtered = filtered.filter(
      (event) => (event as any)[filterField] === filter
    );
  }

  return filtered;
};
