// Minimal interface for Strapi's API response
export interface StrapiResponse<T> {
  id: number;
  attributes: T;
}

// Media type
export interface Media {
  data: {
    id: number;
    attributes: {
      url: string;
      alternativeText?: string;
      width?: number;
      height?: number;
      formats?: Record<string, any>;
    };
  } | null;
}

// Multiple media
export interface MediaCollection {
  data: Array<{
    id: number;
    attributes: {
      url: string;
      alternativeText?: string;
      width?: number;
      height?: number;
      formats?: Record<string, any>;
    };
  }>;
}

// Event attributes matching our Strapi structure
export interface EventAttributes {
  title: string;
  Description?: string;
  content?: string;
  startDate: string;
  endDate?: string;
  time?: string;
  location?: string;
  eventCardImage?: Media;
  eventImages?: MediaCollection;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

// Strapi response for events
export type EventResponse = StrapiResponse<EventAttributes>;
