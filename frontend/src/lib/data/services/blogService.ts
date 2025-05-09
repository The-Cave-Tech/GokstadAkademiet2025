// services/blogService.ts
import { BlogAttributes, Media } from "@/types/content.types";
import { strapiService } from "@/lib/data/services/strapiClient";

// Define BlogResponse type that includes id
interface BlogResponse extends BlogAttributes {
  id: number;
}

// Blog service
export const blogService = {
  // Get all blog posts with optional filters, sorting, and pagination
  getAll: async (params: any = {}): Promise<BlogResponse[]> => {
    try {
      const queryParams = {
        ...params,
        populate: params.populate || ["blogImage", "author"], // Ensure blogImage is populated
      };

      const response = await strapiService.fetch<any>("blogs", {
        params: queryParams,
      });

      if (!response.data || !Array.isArray(response.data)) {
        console.warn("No blog posts found or data is not an array");
        return [];
      }

      return response.data.map((item: any) => ({
        id: item.id,
        ...item, // This includes all fields directly
        blogImage: strapiService.media.getMediaUrl(item.blogImage),
      }));
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return [];
    }
  },

  // Get only the current user's blog posts
  getUserPosts: async (params: any = {}): Promise<BlogResponse[]> => {
    try {
      const queryParams = {
        ...params,
        populate: params.populate || ["blogImage"],
        filters: {
          ...params.filters,
          "author.id": { $eq: "$currentUser" }, // This is a placeholder, the actual filter will be applied by the server
        },
      };

      const response = await strapiService.fetch<any>("blogs/me", {
        params: queryParams,
      });

      if (!response.data || !Array.isArray(response.data)) {
        console.warn("No blog posts found for current user");
        return [];
      }

      return response.data.map((item: any) => ({
        id: item.id,
        ...item,
        blogImage: strapiService.media.getMediaUrl(item.blogImage),
      }));
    } catch (error) {
      console.error("Error fetching user blog posts:", error);
      return [];
    }
  },

  // Get media URL helper
  getMediaUrl: (media: any) => {
    return strapiService.media.getMediaUrl(media);
  },

  // Get a single blog post by ID
  getOne: async (
    id: number | string,
    params: any = {}
  ): Promise<BlogResponse | null> => {
    try {
      const queryParams = {
        ...params,
        populate: params.populate || ["blogImage", "author"], // Ensure blogImage is populated
      };

      const response = await strapiService.fetch<any>(`blogs/${id}`, {
        params: queryParams,
      });

      if (!response.data) return null;

      // Handle flat structure (no attributes)
      return {
        id: response.data.id,
        ...response.data, // Include all fields directly
        blogImage: strapiService.media.getMediaUrl(response.data.blogImage),
      };
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return null;
    }
  },

  // Create a new blog post
  create: async (
    data: Partial<BlogAttributes>,
    blogImage?: File | null
  ): Promise<BlogResponse> => {
    try {
      // Process tags if they come as a comma-separated string
      let processedTags: string[] = [];
      if (typeof data.tags === "string") {
        processedTags = data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      } else if (Array.isArray(data.tags)) {
        processedTags = data.tags;
      }

      // Ensure all required fields are present with default values
      const payload = {
        title: data.title || "Untitled Blog Post",
        summary: data.summary || "No summary provided",
        content: data.content || "",
        category: data.category || "Other",
        tags: processedTags,
        state: (data.state as "draft" | "published" | "archived") || "draft",
      };

      console.log("[BlogService] Creating blog post with payload:", payload);

      const response = await strapiService.fetch<any>("blogs", {
        method: "POST",
        body: { data: payload },
      });

      console.log("[BlogService] Create blog response:", response);

      if (!response || !response.data || !response.data.id) {
        throw new Error("Invalid response from server when creating blog post");
      }

      const blogId = response.data.id;

      // Upload blog image if provided
      if (blogImage) {
        await blogService.uploadBlogImage(blogId, blogImage);
      }

      // If fetch fails, construct a valid BlogResponse from the payload
      // but don't include blogImage since we can't create a valid Media object
      const fallbackResponse: BlogResponse = {
        id: blogId,
        title: payload.title,
        summary: payload.summary,
        content: payload.content,
        category: payload.category,
        tags: payload.tags,
        state: payload.state,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Don't include blogImage in the fallback response
        // since we can't create a valid Media object with the required id
      };

      return fallbackResponse;
    } catch (error) {
      console.error("[BlogService] Error creating blog post:", error);
      throw error;
    }
  },

  // Update an existing blog post
  update: async (
    id: number | string,
    data: Partial<BlogAttributes>,
    blogImage?: File | null
  ): Promise<BlogResponse> => {
    try {
      // Process tags if they come as a comma-separated string
      if (typeof data.tags === "string") {
        data.tags = data.tags.split(",").map((tag) => tag.trim());
      }

      // Log the update payload for debugging
      console.log(`Updating blog post ${id} with data:`, data);

      const response = await strapiService.fetch<any>(`blogs/${id}`, {
        method: "PUT",
        body: { data },
      });

      console.log("Update response:", response);

      // Upload blog image if provided
      if (blogImage) {
        await blogService.uploadBlogImage(id, blogImage);
      }

      // Fetch and return the updated blog post
      const updatedBlog = await blogService.getOne(id);
      if (!updatedBlog) {
        throw new Error("Failed to fetch the updated blog post.");
      }
      return updatedBlog;
    } catch (error) {
      console.error("Error updating blog post:", error);
      throw error;
    }
  },

  // Delete a blog post
  delete: async (id: string | number): Promise<boolean> => {
    try {
      console.log(`Deleting blog post with ID: ${id}`);
      await strapiService.fetch<any>(`blogs/${id}`, {
        method: "DELETE",
      });
      return true;
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return false;
    }
  },

  // Upload blog image
  uploadBlogImage: async (
    blogId: number | string,
    image: File
  ): Promise<void> => {
    try {
      console.log(`Uploading image for blog post ${blogId}`);

      const formData = new FormData();
      formData.append("ref", "api::blog.blog");
      formData.append("refId", blogId.toString());
      formData.append("field", "blogImage");
      formData.append("files", image);

      const response = await strapiService.fetch<any>("upload", {
        method: "POST",
        body: formData,
      });

      console.log("Image upload response:", response);
    } catch (error) {
      console.error("Error uploading blog image:", error);
      throw error;
    }
  },
};
