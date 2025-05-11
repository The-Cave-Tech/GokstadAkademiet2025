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
const activityReducer = (
  state: ActivityState,
  action: ActivityAction
): ActivityState => {
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
    case "SET_PROJECTS":
      return {
        ...state,
        projects: action.payload,
        // Also update filtered projects
        filteredProjects: filterProjects(
          action.payload,
          state.filter,
          state.searchQuery
        ),
      };
    case "SET_EVENTS":
      return {
        ...state,
        events: action.payload,
        // Also update filtered events
        filteredEvents: filterEvents(
          action.payload,
          state.filter,
          state.searchQuery
        ),
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
        filteredProjects: filterProjects(
          state.projects,
          state.filter,
          state.searchQuery
        ),
      };
    case "FILTER_EVENTS":
      return {
        ...state,
        filteredEvents: filterEvents(
          state.events,
          state.filter,
          state.searchQuery
        ),
      };
    default:
      return state;
  }
};

// Helper function to filter projects
const filterProjects = (
  projects: ProjectResponse[],
  filter: string,
  searchQuery: string
): ProjectResponse[] => {
  // Filter by state
  let filtered = projects;
  if (filter !== "all") {
    filtered = filtered.filter((project) => project.state === filter);
  }

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter((project) => {
      const technologiesMatch =
        Array.isArray(project.technologies) &&
        project.technologies.some((tech) => tech.toLowerCase().includes(query));

      return (
        project.title.toLowerCase().includes(query) ||
        (project.description &&
          project.description.toLowerCase().includes(query)) ||
        (project.category && project.category.toLowerCase().includes(query)) ||
        technologiesMatch
      );
    });
  }

  return filtered;
};

// Helper function to filter events
const filterEvents = (
  events: EventResponse[],
  filter: string,
  searchQuery: string
): EventResponse[] => {
  // Filter by upcoming/past
  let filtered = events;
  if (filter === "upcoming") {
    filtered = filtered.filter(
      (event) => !event.startDate || !isDatePast(event.startDate)
    );
  } else if (filter === "past") {
    filtered = filtered.filter(
      (event) => event.startDate && isDatePast(event.startDate)
    );
  }

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        (event.description &&
          event.description.toLowerCase().includes(query)) ||
        (event.location && event.location.toLowerCase().includes(query))
    );
  }

  return filtered;
};

// ActivitiesProvider component
export const ActivitiesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(activityReducer, {
    activeTab: "projects",
    filter: "all",
    searchQuery: "",
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

  // Filter projects and events when filter or search query changes
  useEffect(() => {
    dispatch({ type: "FILTER_PROJECTS" });
  }, [state.filter, state.searchQuery, state.projects]);

  useEffect(() => {
    dispatch({ type: "FILTER_EVENTS" });
  }, [state.filter, state.searchQuery, state.events]);

  return (
    <ActivityContext.Provider value={{ state, dispatch }}>
      {children}
    </ActivityContext.Provider>
  );
};

// useActivities hook
export const useActivities = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error("useActivities must be used within an ActivitiesProvider");
  }
  return context;
};
