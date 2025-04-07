import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// Define the Strapi client interface to support both patterns
export interface StrapiClient extends AxiosInstance {
  // Include any additional methods your client might have
}

// Create and configure the Strapi client
export const strapiClient: StrapiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337/",
  headers: {
    "Content-Type": "application/json",
    // Add API token if needed
    ...(process.env.NEXT_PUBLIC_STRAPI_TOKEN
      ? { Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}` }
      : {}),
  },
}) as StrapiClient;

// Optional: Add request/response interceptors if needed
strapiClient.interceptors.request.use(
  (config) => {
    // Modify request config if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

strapiClient.interceptors.response.use(
  (response) => {
    // Process successful responses
    return response;
  },
  (error) => {
    // Handle response errors
    console.error("Strapi API error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default strapiClient;
