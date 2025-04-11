// types/content-types.ts (forenklet)

// Base interface for Strapi's API response
export interface StrapiResponse<T> {
  id: number;
  attributes: T;
}

// Base attributes shared across multiple types
export interface BaseAttributes {
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

// Media type for featured images or other media
export interface Media {
  id: number;
  url: string;
  alternativeText?: string;
  caption?: string;
}

// Event-specific attributes
export interface EventAttributes extends BaseAttributes {
  title: string;
  shortDescription?: string;
  content?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  time?: string;
  featuredImage?: Media;
  detailsEnabled?: boolean;
  displayOrder?: number;
  slug: string;
}

// Strapi response for events
export type EventResponse = StrapiResponse<EventAttributes>;
