"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Project, Event } from "@/types/activity.types";
import { projectService } from "@/lib/data/services/projectService";
import { eventsService } from "@/lib/data/services/eventService";
import { isDatePast } from "../utils/dateUtils";

// State interface
interface ActivitiesState {
  activeTab: "projects" | "events";
  searchQuery: string;
  filter: string;
  projects: Project[];
  events: Event[];
  filteredProjects: Project[];
  filteredEvents: Event[];
  isLoading: boolean;
  error: string | null;
}

// Action types
type ActivitiesAction =
  | { type: "SET_ACTIVE_TAB"; payload: "projects" | "events" }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_FILTER"; payload: string }
  | { type: "SET_PROJECTS"; payload: Project[] }
  | { type: "SET_EVENTS"; payload: Event[] }
  | { type: "SET_FILTERED_PROJECTS"; payload: Project[] }
  | { type: "SET_FILTERED_EVENTS"; payload: Event[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

// Initial state
const initialState: ActivitiesState = {
  activeTab: "projects",
  searchQuery: "",
  filter: "all",
  projects: [],
  events: [],
  filteredProjects: [],
  filteredEvents: [],
  isLoading: false,
  error: null,
};

// Reducer function
const activitiesReducer = (
  state: ActivitiesState,
  action: ActivitiesAction
): ActivitiesState => {
  switch (action.type) {
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "SET_PROJECTS":
      return { ...state, projects: action.payload };
    case "SET_EVENTS":
      return { ...state, events: action.payload };
    case "SET_FILTERED_PROJECTS":
      return { ...state, filteredProjects: action.payload };
    case "SET_FILTERED_EVENTS":
      return { ...state, filteredEvents: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Context creation
const ActivitiesContext = createContext<{
  state: ActivitiesState;
  dispatch: React.Dispatch<ActivitiesAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Provider component
export const ActivitiesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(activitiesReducer, initialState);

  // Effect to fetch data when active tab changes
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        if (state.activeTab === "projects") {
          // Only fetch projects data when activeTab is projects
          const data = await projectService.getAll({
            sort: ["createdAt:desc"],
            populate: ["projectImage", "technologies"],
          });
          dispatch({ type: "SET_PROJECTS", payload: data });
        } else if (state.activeTab === "events") {
          // Only fetch events data when activeTab is events
          const data = await eventsService.getAll({
            sort: ["startDate:desc"],
            populate: ["eventCardImage"],
          });
          dispatch({ type: "SET_EVENTS", payload: data });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to load data. Please try again.",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchData();
  }, [state.activeTab]);

  // Effect to filter projects when search query, filter, or projects change
  useEffect(() => {
    if (state.activeTab === "projects") {
      let filtered = state.projects;

      // Apply search filter
      if (state.searchQuery) {
        filtered = filtered.filter(
          (project) =>
            project.title
              .toLowerCase()
              .includes(state.searchQuery.toLowerCase()) ||
            (project.description &&
              project.description
                .toLowerCase()
                .includes(state.searchQuery.toLowerCase()))
        );
      }

      // Apply category/status filters
      if (state.filter !== "all") {
        if (["planning", "in-progress", "completed"].includes(state.filter)) {
          // Filter by status
          filtered = filtered.filter(
            (project) => project.state === state.filter
          );
        } else {
          // Filter by category
          filtered = filtered.filter(
            (project) => project.category === state.filter
          );
        }
      }

      dispatch({ type: "SET_FILTERED_PROJECTS", payload: filtered });
    }
  }, [state.projects, state.searchQuery, state.filter, state.activeTab]);

  // Effect to filter events when search query, filter, or events change
  useEffect(() => {
    if (state.activeTab === "events") {
      let filtered = state.events;

      // Apply search filter
      if (state.searchQuery) {
        filtered = filtered.filter(
          (event) =>
            event.title
              .toLowerCase()
              .includes(state.searchQuery.toLowerCase()) ||
            (event.description &&
              event.description
                .toLowerCase()
                .includes(state.searchQuery.toLowerCase()))
        );
      }

      // Apply date-based filters
      if (state.filter === "upcoming") {
        filtered = filtered.filter(
          (event) => event.startDate && !isDatePast(event.startDate)
        );
      } else if (state.filter === "past") {
        filtered = filtered.filter(
          (event) => event.startDate && isDatePast(event.startDate)
        );
      }

      dispatch({ type: "SET_FILTERED_EVENTS", payload: filtered });
    }
  }, [state.events, state.searchQuery, state.filter, state.activeTab]);

  return (
    <ActivitiesContext.Provider value={{ state, dispatch }}>
      {children}
    </ActivitiesContext.Provider>
  );
};

// Custom hook to use the context
export const useActivities = () => {
  const context = useContext(ActivitiesContext);
  if (!context) {
    throw new Error("useActivities must be used within an ActivitiesProvider");
  }
  return context;
};
