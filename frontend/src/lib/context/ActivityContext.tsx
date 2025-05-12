// lib/context/ActivityContext.tsx
"use client";
import React, { createContext, useReducer, useContext, useEffect } from "react";
import { EventResponse, ProjectResponse } from "@/types/content.types";
import { eventsService } from "@/lib/data/services/eventService";
import { projectService } from "@/lib/data/services/projectService";
import { isDatePast } from "@/lib/utils/dateUtils";

// Define the state type
interface ActivityState {
  activeTab: "projects" | "events";
  filter: string;
  searchQuery: string;
  sort: string; // Added sort field
  projects: ProjectResponse[];
  events: EventResponse[];
  filteredProjects: ProjectResponse[];
  filteredEvents: EventResponse[];
  isLoading: boolean;
  error: string | null;
}

// Define action types
type ActivityAction =
  | { type: "SET_ACTIVE_TAB"; payload: "projects" | "events" }
  | { type: "SET_FILTER"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SORT"; payload: string } // Added SET_SORT action
  | { type: "SET_PROJECTS"; payload: ProjectResponse[] }
  | { type: "SET_EVENTS"; payload: EventResponse[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "FILTER_PROJECTS" }
  | { type: "FILTER_EVENTS" };

// Create the context
const ActivityContext = createContext<{
  state: ActivityState;
  dispatch: React.Dispatch<ActivityAction>;
}>({
  state: {
    activeTab: "projects",
    filter: "all",
    searchQuery: "",
    sort: "newest", // Default sort value
    projects: [],
    events: [],
    filteredProjects: [],
    filteredEvents: [],
    isLoading: false,
    error: null,
  },
  dispatch: () => null,
});

// Reducer function
const activityReducer = (state: ActivityState, action: ActivityAction): ActivityState => {
  switch (action.type) {
    case "SET_ACTIVE_TAB":
      return {
        ...state,
        activeTab: action.payload,
      };
    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload,
      };
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
      };
    case "SET_SORT": // Added SET_SORT case
      return {
        ...state,
        sort: action.payload,
      };
    case "SET_PROJECTS":
      return {
        ...state,
        projects: action.payload,
        // Also update filtered projects
        filteredProjects: filterAndSortProjects(action.payload, state.filter, state.searchQuery, state.sort),
      };
    case "SET_EVENTS":
      return {
        ...state,
        events: action.payload,
        // Also update filtered events
        filteredEvents: filterAndSortEvents(action.payload, state.filter, state.searchQuery, state.sort),
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "FILTER_PROJECTS":
      return {
        ...state,
        filteredProjects: filterAndSortProjects(state.projects, state.filter, state.searchQuery, state.sort),
      };
    case "FILTER_EVENTS":
      return {
        ...state,
        filteredEvents: filterAndSortEvents(state.events, state.filter, state.searchQuery, state.sort),
      };
    default:
      return state;
  }
};

// Helper function to sort items
const sortItems = <T extends { createdAt?: string; publishedAt?: string; title: string; startDate?: string }>(
  items: T[],
  sort: string
): T[] => {
  const sortedItems = [...items];

  switch (sort) {
    case "newest":
      return sortedItems.sort((a, b) => {
        const dateA = a.publishedAt || a.createdAt || "";
        const dateB = b.publishedAt || b.createdAt || "";
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    case "oldest":
      return sortedItems.sort((a, b) => {
        const dateA = a.publishedAt || a.createdAt || "";
        const dateB = b.publishedAt || b.createdAt || "";
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      });
    case "alphabetical":
      return sortedItems.sort((a, b) => a.title.localeCompare(b.title));
    case "reverseAlphabetical":
      return sortedItems.sort((a, b) => b.title.localeCompare(a.title));
    case "upcoming":
      // For events with dates, sort by upcoming date
      return sortedItems.sort((a, b) => {
        if (!a.startDate) return 1;
        if (!b.startDate) return -1;
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
    default:
      return sortedItems;
  }
};

// Helper function to filter and sort projects
const filterAndSortProjects = (
  projects: ProjectResponse[],
  filter: string,
  searchQuery: string,
  sort: string
): ProjectResponse[] => {
  // Filter by state
  let filtered = projects;
  if (filter !== "all") {
    filtered = filtered.filter((project) => project.state === filter);
  }

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        (project.description && project.description.toLowerCase().includes(query)) ||
        (project.category && project.category.toLowerCase().includes(query)) ||
        (project.technologies && project.technologies.some((tech) => tech.toLowerCase().includes(query)))
    );
  }

  // Sort the results
  return sortItems(filtered, sort);
};

// Helper function to filter and sort events
const filterAndSortEvents = (
  events: EventResponse[],
  filter: string,
  searchQuery: string,
  sort: string
): EventResponse[] => {
  // Filter by upcoming/past
  let filtered = events;
  if (filter === "upcoming") {
    filtered = filtered.filter((event) => !event.startDate || !isDatePast(event.startDate));
  } else if (filter === "past") {
    filtered = filtered.filter((event) => event.startDate && isDatePast(event.startDate));
  }

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        (event.description && event.description.toLowerCase().includes(query)) ||
        (event.location && event.location.toLowerCase().includes(query))
    );
  }

  // Sort the results
  return sortItems(filtered, sort);
};

// ActivitiesProvider component
export const ActivitiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(activityReducer, {
    activeTab: "projects",
    filter: "all",
    searchQuery: "",
    sort: "newest", // Default sort value
    projects: [],
    events: [],
    filteredProjects: [],
    filteredEvents: [],
    isLoading: false,
    error: null,
  });

  // Load projects when the provider mounts
  useEffect(() => {
    const loadProjects = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      try {
        const data = await projectService.getAll();
        dispatch({ type: "SET_PROJECTS", payload: data });
      } catch (error) {
        console.error("Error loading projects:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Error loading projects. Please try again.",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadProjects();
  }, []);

  // Load events when the provider mounts
  useEffect(() => {
    const loadEvents = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      try {
        const data = await eventsService.getAll();
        dispatch({ type: "SET_EVENTS", payload: data });
      } catch (error) {
        console.error("Error loading events:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Error loading events. Please try again.",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadEvents();
  }, []);

  // Filter projects and events when filter, search query, or sort changes
  useEffect(() => {
    dispatch({ type: "FILTER_PROJECTS" });
  }, [state.filter, state.searchQuery, state.sort, state.projects]);

  useEffect(() => {
    dispatch({ type: "FILTER_EVENTS" });
  }, [state.filter, state.searchQuery, state.sort, state.events]);

  return <ActivityContext.Provider value={{ state, dispatch }}>{children}</ActivityContext.Provider>;
};

// useActivities hook
export const useActivities = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error("useActivities must be used within an ActivitiesProvider");
  }
  return context;
};
