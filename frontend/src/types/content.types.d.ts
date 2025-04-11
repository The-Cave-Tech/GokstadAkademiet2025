// Generelle media-typer som kan brukes på tvers av innholdstyper
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

// Base-interface for felles attributter på tvers av innholdstyper
export interface BaseAttributes {
  title: string;
  content?: string;
  description?: string;
  featuredImage?: Media;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// Base-interface for alle innholdstyper
export interface ContentItem<T extends BaseAttributes> {
  id: number;
  attributes: T;
}

// Event-spesifikke attributter
export interface EventAttributes extends BaseAttributes {
  shortDescription?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  registrationLink?: string;
  time?: string;
}

// Project-spesifikke attributter
export interface ProjectAttributes extends BaseAttributes {
  excerpt?: string;
  completionDate?: string;
  client?: string;
  projectUrl?: string;
  gallery?: {
    data: Array<{
      id: number;
      attributes: {
        url: string;
        alternativeText?: string;
      };
    }>;
  };
}

// Blog-spesifikke attributter
export interface BlogAttributes extends BaseAttributes {
  excerpt?: string;
  tags?: string[];
  author?: {
    data: {
      id: number;
      attributes: {
        name: string;
        email?: string;
      };
    };
  };
}

// Typer for API-respons
export interface ApiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Definisjon av innholdstyper
export type Event = ContentItem<EventAttributes>;
export type Project = ContentItem<ProjectAttributes>;
export type Blog = ContentItem<BlogAttributes>;

// Form data interfaces
export interface EventFormData {
  title: string;
  shortDescription: string;
  content: string;
  startDate: string;
  endDate?: string;
  location?: string;
  registrationLink?: string;
  time?: string;
}

export interface ProjectFormData {
  title: string;
  excerpt: string;
  content: string;
  completionDate?: string;
  client?: string;
  projectUrl?: string;
}

export interface GenericContentQuery {
  filters?: Record<string, any>;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  populate?: string | string[] | Record<string, any>;
  fields?: string[];
}

// Felles interface for content manager komponenter
export interface ContentManagerProps<T extends ContentItem<any>, F> {
  contentType: string;
  apiEndpoint: string;
  fetchItems: (query?: GenericContentQuery) => Promise<T[]>;
  createItem: (data: F) => Promise<T | null>;
  updateItem: (id: number, data: F) => Promise<T | null>;
  deleteItem: (id: number) => Promise<boolean>;
  itemTitle: (item: T) => string;
  itemSubtitle?: (item: T) => string;
  formComponent: React.ComponentType<any>;
  listComponent: React.ComponentType<any>;
}
