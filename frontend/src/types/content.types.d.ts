// frontend/src/types/content.types.d.ts
// Media type for Strapi v5
export interface Media {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  formats?: Record<string, any>;
}

// Base content interface with common fields for all content types
interface BaseContent {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

// Event attributes matching Strapi v5 structure
export interface EventAttributes extends BaseContent {
  title: string;
  description: string;
  content?: string;
  startDate?: string;
  endDate?: string;
  time?: string;
  location?: string;
  eventCardImage?: Media;
}

// Project attributes
export interface ProjectAttributes extends BaseContent {
  title: string;
  description: string;
  content?: string;
  projectImage?: Media;
  state?: string;
  category?: string;
  technologies?: string[];
  demoUrl?: string;
  githubUrl?: string;
}

// Blog attributes
export interface BlogAttributes extends BaseContent {
  title: string;
  summary: string;
  content: string;
  category?: string;
  tags?: string[] | string;
  state: "draft" | "published" | "archived";
  blogImage?: Media;
  author?: {
    id: number;
    username: string;
    email?: string;
  };
}

// Product attributes extending the BaseContent interface
export interface ProductAttributes extends BaseContent {
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  category: string;
  productImage?: Media;
}

// Response types
export type ProductResponse = ProductAttributes;
export type EventResponse = EventAttributes;
export type ProjectResponse = ProjectAttributes;
export type BlogResponse = BlogAttributes;
