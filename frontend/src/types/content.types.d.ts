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
  category?: string;
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

// Content card types for universal usage
export interface UniversalCardProps {
  title: string;
  description?: string;
  image?: {
    src: string;
    alt?: string;
    fallbackLetter?: boolean;
    overlay?: ReactNode;
    aspectRatio?: "square" | "video" | "auto" | number;
  };
  badges?: Badge[];
  tags?: Tag[];
  details?: DetailItem[];
  actionButton?: {
    text: string;
    onClick?: (e: React.MouseEvent) => void;
    isProduct?: boolean;
  };
  variant?: "vertical" | "horizontal";
  size?: "small" | "medium" | "large";
  hoverEffect?: boolean;
  onClick?: () => void;
  className?: string;
  headerSlot?: ReactNode;
  footerSlot?: ReactNode;
  cornerElement?: ReactNode;
}

// Content table props for creating or editing content
export interface AdminTableProps {
  title: string;
  items: any[];
  columns: AdminColumn[];
  actions: AdminAction[];
  isLoading: boolean;
  error: string | null;
  successMessage?: string | null;
  emptyMessage?: {
    title: string;
    description: string;
    icon?: ReactNode;
  };
  createButton?: {
    label: string;
    href: string;
  };
  getItemId: (item: any) => string | number; // Function to get item ID
  imageKey?: string; // Key to access the image in items
  getImageUrl?: (image: any) => string; // Function to get image URL
}

// Content form props for displaying content
export interface ContentFormProps {
  event?: Event;
  onSave: (data: any, image?: File | null) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  config: {
    type: "event" | "project" | "blog"; // Determines the type of content
    fields: Array<{
      name: string;
      label: string;
      type: string;
      required?: boolean;
      options?: string[]; // For dropdowns like state
    }>;
    getImageUrl?: (item: any) => string; // Function to get the image URL
    imageName?: string; // Label for the image field
  };
  data?: any; // Existing data for editing (optional)
}
