// Media type
export interface Media {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  formats?: Record<string, any>;
}

// Event attributes matching the updated structure
export interface EventAttributes {
  id: number; // Include the ID directly in the attributes
  title: string;
  Description?: string;
  content?: string;
  startDate: string;
  endDate?: string;
  time?: string;
  location?: string;
  eventCardImage?: Media;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

// Event response type (directly represents the event structure)
export type EventResponse = EventAttributes;
