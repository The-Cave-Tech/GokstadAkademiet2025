// Minimal interface for Strapi's API response
export interface StrapiResponse<T> {
  id: number;
  attributes: T;
}

// Simplified event attributes
export interface EventAttributes {
  title: string;
  shortDescription?: string;
  content?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  time?: string;
}

// Strapi response for events
export type EventResponse = StrapiResponse<EventAttributes>;
