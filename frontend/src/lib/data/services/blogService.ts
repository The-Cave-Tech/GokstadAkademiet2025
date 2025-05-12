// services/blogService.ts - Updated with proper types
import { BlogAttributes, BlogResponse, Media } from "@/types/content.types";
import { strapiService } from "@/lib/data/services/strapiClient";

// Blog service
export const blogService = {
  // Get all blog posts with optional filters, sorting, and pagination
  getAll: async (params: Record<string, unknown> = {}): Promise<BlogResponse[]> => {
    try {
      // Using collection method for consistent approach
      const blogsCollection = strapiService.collection("blogs");

      // Ensure populate parameter is properly typed
      const queryParams: Record<string, unknown> = {
        ...params,
        populate: ["blogImage", "author"],
      };

      // Use the collection's find method
      const response = await blogsCollection.find(queryParams);

      if (!response.data || !Array.isArray(response.data)) {
        console.warn("No blog posts found or data is not an array");
        return [];
      }

      console.log("Fetched blog posts:", response.data);

      // Transform the response to match our BlogResponse type
      return response.data.map((item) => {
        // Extract the base blog data
        const blog: BlogResponse = {
          id: item.id,
          title: item.title || "",
          summary: item.summary || "",
          content: item.content || "",
          category: item.category || "",
          tags: item.tags || [],
          state: item.state || "draft",
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          publishedAt: item.publishedAt,
        };

        // Handle author data if it exists
        if (item.author) {
          blog.author = {
            id: item.author.id,
            username: item.author.username || "Unknown",
            email: item.author.email,
          };
        }

        // Process the image data if it exists
        if (item.blogImage) {
          // Handle both direct and nested data structures
          let imageUrl: string = "";

          // For nested structure with data property
          if (typeof item.blogImage.data !== "undefined") {
            const data = item.blogImage.data;
            if (data) {
              imageUrl = strapiService.media.getMediaUrl(data);
              blog.blogImage = {
                id: data.id || 0,
                url: imageUrl,
                alternativeText: data.alternativeText,
                width: data.width,
                height: data.height,
                formats: data.formats,
              };
            }
          } else {
            // Direct format - no nesting
            imageUrl = strapiService.media.getMediaUrl(item.blogImage);
            blog.blogImage = {
              id: item.blogImage.id || 0,
              url: imageUrl,
              alternativeText: item.blogImage.alternativeText,
              width: item.blogImage.width,
              height: item.blogImage.height,
              formats: item.blogImage.formats,
            };
          }
        }

        return blog;
      });
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return [];
    }
  },

  // Get media URL helper
  getMediaUrl: (media: any): string => {
    return strapiService.media.getMediaUrl(media);
  },

  // Get a single blog post by ID
  getOne: async (id: number | string, params: Record<string, unknown> = {}): Promise<BlogResponse | null> => {
    try {
      const blogsCollection = strapiService.collection("blogs");

      // Define query params
      const queryParams: Record<string, unknown> = {
        ...params,
        populate: params.populate || ["blogImage", "author"],
      };

      // Use the collection's findOne method
      const response = await blogsCollection.findOne(id.toString(), queryParams);

      if (!response.data) return null;

      // Create blog object with proper types
      const blog: BlogResponse = {
        id: response.data.id,
        title: response.data.title || "",
        summary: response.data.summary || "",
        content: response.data.content || "",
        category: response.data.category || "",
        tags: response.data.tags || [],
        state: response.data.state || "draft",
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
        publishedAt: response.data.publishedAt,
      };

      // Handle author data
      if (response.data.author) {
        blog.author = {
          id: response.data.author.id,
          username: response.data.author.username || "Unknown",
          email: response.data.author.email,
        };
      }

      // Process the image data if it exists
      if (response.data.blogImage) {
        let imageUrl: string = "";

        // Handle nested structure
        if (typeof response.data.blogImage.data !== "undefined") {
          const data = response.data.blogImage.data;
          if (data && data.attributes) {
            imageUrl = strapiService.media.getMediaUrl(data);
            blog.blogImage = {
              id: data.id || 0,
              url: imageUrl,
              alternativeText: data.attributes.alternativeText,
              width: data.attributes.width,
              height: data.attributes.height,
              formats: data.attributes.formats,
            };
          }
        } else {
          // Direct format - no nesting
          imageUrl = strapiService.media.getMediaUrl(response.data.blogImage);
          blog.blogImage = {
            id: response.data.blogImage.id || 0,
            url: imageUrl,
            alternativeText: response.data.blogImage.alternativeText,
            width: response.data.blogImage.width,
            height: response.data.blogImage.height,
            formats: response.data.blogImage.formats,
          };
        }
      }

      return blog;
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return null;
    }
  },

  // Create a new blog post
  create: async (data: Partial<BlogAttributes>, blogImage?: File | null): Promise<BlogResponse> => {
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

      // Prepare payload with proper typing
      const payload = {
        data: {
          title: data.title || "Untitled Blog Post",
          summary: data.summary || "No summary provided",
          content: data.content || "",
          category: data.category || "",
          tags: processedTags,
          state: data.state || "draft",
        },
      };

      const blogsCollection = strapiService.collection("blogs");
      const response = await blogsCollection.create(payload);

      if (!response || !response.data || !response.data.id) {
        throw new Error("Invalid response from server when creating blog post");
      }

      const blogId = response.data.id;

      // Upload blog image if provided
      if (blogImage) {
        await blogService.uploadBlogImage(blogId, blogImage);
      }

      // Fetch and return the created blog post
      const newBlog = await blogService.getOne(blogId);
      if (!newBlog) {
        // Create a fallback response if fetch fails
        return {
          id: blogId,
          title: payload.data.title,
          summary: payload.data.summary,
          content: payload.data.content,
          category: payload.data.category || "",
          tags: processedTags,
          state: (payload.data.state as "draft" | "published" | "archived") || "draft",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      return newBlog;
    } catch (error) {
      console.error("Error creating blog post:", error);
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
      let updatedData = { ...data };

      if (typeof data.tags === "string") {
        updatedData.tags = data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }

      const blogsCollection = strapiService.collection("blogs");
      await blogsCollection.update(id.toString(), { data: updatedData });

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
      const blogsCollection = strapiService.collection("blogs");
      await blogsCollection.delete(id.toString());
      return true;
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return false;
    }
  },

  // Upload blog image
  uploadBlogImage: async (blogId: number | string, image: File): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("ref", "api::blog.blog");
      formData.append("refId", blogId.toString());
      formData.append("field", "blogImage");
      formData.append("files", image);

      await strapiService.fetch("upload", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error("Error uploading blog image:", error);
      throw error;
    }
  },
};
