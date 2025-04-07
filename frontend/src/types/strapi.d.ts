// Purpose: Define TypeScript interfaces for Strapi data

// Base Strapi response structure
export interface StrapiResponse<T> {
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

// Strapi media object
export interface StrapiMedia {
  data: {
    id: number;
    attributes: {
      name: string;
      alternativeText?: string;
      caption?: string;
      width: number;
      height: number;
      formats?: {
        thumbnail?: { url: string; width: number; height: number };
        small?: { url: string; width: number; height: number };
        medium?: { url: string; width: number; height: number };
        large?: { url: string; width: number; height: number };
      };
      hash: string;
      ext: string;
      mime: string;
      size: number;
      url: string;
      previewUrl?: string;
      provider: string;
      createdAt: string;
      updatedAt: string;
    };
  } | null;
}

// Content block component
export interface ContentBlock {
  id: number;
  title?: string;
  content?: string;
  image?: StrapiMedia;
}

// Two columns layout component
export interface TwoColumnsLayout {
  __component: "layouts.two-columns";
  id: number;
  leftColumn?: ContentBlock;
  rightColumn?: ContentBlock;
}

// Full width layout component
export interface FullWidthLayout {
  __component: "layouts.full-width";
  id: number;
  title?: string;
  content?: string;
  image?: StrapiMedia;
}

// Union type for all dynamic zone components
export type DynamicZoneComponent = TwoColumnsLayout | FullWidthLayout;

// Base content item attributes
export interface ContentItemAttributes {
  title: string;
  slug: string;
  description?: string;
  image?: StrapiMedia;
  dynamicZone?: DynamicZoneComponent[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Content item structure
export interface ContentItem {
  id: number;
  attributes: ContentItemAttributes;
}
