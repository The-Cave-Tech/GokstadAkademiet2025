import { EventResponse, ProjectResponse } from "@/types/content.types";

export type {
  Media,
  EventAttributes,
  EventResponse,
  ProjectAttributes,
  ProjectResponse,
} from "@/types/content.types";

// Type aliases for convenience
export type Project = ProjectResponse;
export type Event = EventResponse;

export interface DataFetchingResult {
  data: {
    projects: Project[];
    events: Event[];
  };
  isLoading: boolean;
  error: string | null;
}

export interface FilterAndSearchResult {
  filteredProjects: Project[];
  filteredEvents: Event[];
}
