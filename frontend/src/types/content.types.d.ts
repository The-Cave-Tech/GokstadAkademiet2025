// frontend/src/types/content.types.d.ts
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
  description: string;
  content?: string;
  startDate?: string; // Ensure startDate is a string or null
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

// Project attributes
export interface ProjectAttributes {
  id: number;
  title: string;
  description: string;
  content?: string;
  projectImage?: Media; // Updated to use Media type
  state?: string; // Ensure 'state' is defined
  category?: string;
  technologies?: string[];
  demoUrl?: string;
  githubUrl?: string;
}

// Project response type
export type ProjectResponse = ProjectAttributes;

export interface BlogAttributes {
  id: number;
  title: string;
  summary: string;
  content: string;
  category?: string;
  tags?: string[] | string; // Can be array or comma-separated string
  state: "draft" | "published" | "archived";
  blogImage?: Media;
  author?: {
    id: number;
    username: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  documentId?: string;
}

// Blog response type (represents the blog post structure)
export type BlogResponse = BlogAttributes;

// BlogCard props for rendering blog post cards
export interface BlogCardProps {
  blog: BlogAttributes;
}
