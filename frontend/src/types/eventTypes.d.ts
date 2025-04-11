// types.ts

export interface EventAttributes {
  // Notice the capital letters - matching Strapi's field names exactly
  documentId: string;
  Title: string;
  Slug: number; // Notice this is a number in your API, not a string
  Summary: string;
  Content: ContentBlock[]; // This is now an array of blocks, not a string
  eventStatus: string;
  EventDate: string;
  EventTime: string;
  Location: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  featuredImage?: {
    data?: {
      attributes?: {
        url: string;
      };
    };
  };
}

// Defining the structure of Content blocks from Strapi
export interface ContentBlock {
  type: string;
  children: ContentChild[];
}

export interface ContentChild {
  text: string;
  type: string;
}

export interface Event {
  id: number;
  // In Strapi 5, attributes are flattened in the response
  documentId: string;
  Title: string;
  Slug: number;
  Summary: string;
  Content: ContentBlock[];
  eventStatus: string;
  EventDate: string;
  EventTime: string;
  Location: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface FormDataState {
  Title: string;
  Slug: string; // We'll still use string in the form for ease of use
  Summary: string;
  Content: string; // For the form we'll use a string representation
  eventStatus: string;
  EventDate: string;
  EventTime: string;
  Location: string;
}

export interface EventResponse {
  data: Event[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
