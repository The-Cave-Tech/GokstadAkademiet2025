// src/types/contact.types.ts
export interface ContactPageData {
    streetAddress: string;
    city: string;
    postalCode: string;
    phoneNumber: string;
    email: string;
  }
  
  export interface ContactFormData {
    name: string;
    email: string;
    phoneNumber?: string;
    message: string;
  }
  
  export interface ContactSubmission extends ContactFormData {
    createdAt?: string;
  }
  
  export interface ContactFormState {
    success: boolean;
    error: string | null;
  }