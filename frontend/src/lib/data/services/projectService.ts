// services/projectService.ts
import {
  ProjectAttributes,
  ProjectResponse,
  Media,
} from "@/types/content.types";
import { strapiService } from "@/lib/data/services/strapiClient";

// Projects service
export const projectService = {
  // Get all projects with optional filters, sorting, and pagination
  getAll: async (
    params: Record<string, unknown> = {}
  ): Promise<ProjectResponse[]> => {
    try {
      // Using collection method for consistent approach
      const projectsCollection = strapiService.collection("projects");

      // Ensure populate parameter is properly typed
      const queryParams: Record<string, unknown> = {
        ...params,
        populate: params.populate || ["projectImage"], // Ensure projectImage is populated
      };

      // Use the collection's find method
      const response = await projectsCollection.find(queryParams);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error(
          "Invalid response format: No projects found or data is not an array"
        );
      }

      console.log("Fetched projects:", response.data);

      // Transform the response to match our ProjectResponse type
      return response.data.map((item) => {
        // Extract the base project data directly without attributes nesting
        const project: ProjectResponse = {
          id: item.id,
          title: item.title,
          description: item.description,
          content: item.content || "",
          state: item.state || "draft",
          category: item.category || "Other",
          technologies: item.technologies || [],
          demoUrl: item.demoUrl || "",
          githubUrl: item.githubUrl || "",
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          publishedAt: item.publishedAt,
        };

        // Process the image data if it exists
        if (item.projectImage) {
          // Handle both direct and nested data structures
          let imageUrl: string;

          // For Strapi v5
          if (typeof item.projectImage.data !== "undefined") {
            // This means we're dealing with the original nested structure
            const data = item.projectImage.data;

            if (data) {
              // Structure with attributes (old format)
              imageUrl = strapiService.media.getMediaUrl(data);

              project.projectImage = {
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
            imageUrl = strapiService.media.getMediaUrl(item.projectImage);

            project.projectImage = {
              id: item.projectImage.id || 0,
              url: imageUrl,
              alternativeText: item.projectImage.alternativeText,
              width: item.projectImage.width,
              height: item.projectImage.height,
              formats: item.projectImage.formats,
            };
          }
        }

        return project;
      });
    } catch (error) {
      console.error(
        "Error fetching projects:",
        new Error(
          `Failed to retrieve projects: ${error instanceof Error ? error.message : String(error)}`
        )
      );
      return [];
    }
  },

  // Get a single project by ID
  getOne: async (
    id: string | number,
    params: Record<string, unknown> = {}
  ): Promise<ProjectResponse | null> => {
    try {
      const projectsCollection = strapiService.collection("projects");

      // Define a properly typed query params object
      const queryParams: Record<string, unknown> = {
        ...params,
        populate: params.populate || ["projectImage"], // Ensure projectImage is populated
      };

      // Use the collection's findOne method
      const response = await projectsCollection.findOne(
        id.toString(),
        queryParams
      );

      if (!response.data) {
        throw new Error(`Project with ID ${id} not found`);
      }

      // Transform to match our ProjectResponse type without attributes nesting
      const project: ProjectResponse = {
        id: response.data.id,
        title: response.data.title,
        description: response.data.description,
        content: response.data.content || "",
        state: response.data.state || "draft",
        category: response.data.category || "Other",
        technologies: response.data.technologies || [],
        demoUrl: response.data.demoUrl || "",
        githubUrl: response.data.githubUrl || "",
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
        publishedAt: response.data.publishedAt,
      };

      // Process the image data if it exists
      if (response.data.projectImage) {
        // Handle both direct and nested data structures
        let imageUrl: string;

        // For Strapi v5
        if (typeof response.data.projectImage.data !== "undefined") {
          // This means we're dealing with the original nested structure
          const data = response.data.projectImage.data;

          if (data && data.attributes) {
            // Structure with attributes (old format)
            imageUrl = strapiService.media.getMediaUrl(data);

            project.projectImage = {
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
          imageUrl = strapiService.media.getMediaUrl(
            response.data.projectImage
          );

          project.projectImage = {
            id: response.data.projectImage.id || 0,
            url: imageUrl,
            alternativeText: response.data.projectImage.alternativeText,
            width: response.data.projectImage.width,
            height: response.data.projectImage.height,
            formats: response.data.projectImage.formats,
          };
        }
      }

      return project;
    } catch (error) {
      console.error(
        "Error fetching project:",
        new Error(
          `Failed to retrieve project: ${error instanceof Error ? error.message : String(error)}`
        )
      );
      return null;
    }
  },

  getProjectById: async (
    id: number | string,
    params: Record<string, unknown> = {}
  ) => {
    try {
      return await projectService.getOne(id, params);
    } catch (error) {
      console.error(
        "Error in getProjectById:",
        new Error(
          `Failed to get project by ID ${id}: ${error instanceof Error ? error.message : String(error)}`
        )
      );
      throw error;
    }
  },

  // Helper method to get media URL (for backward compatibility)
  getMediaUrl: (media: Media | Record<string, unknown>) => {
    return strapiService.media.getMediaUrl(media);
  },

  // Create a new project
  create: async (
    data: Partial<ProjectAttributes & { technologies?: string | string[] }>,
    projectImage?: File | null
  ): Promise<ProjectResponse> => {
    try {
      // Process technologies if they come as a comma-separated string
      if (typeof data.technologies === "string") {
        data.technologies = data.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean);
      }

      // Ensure all required fields are present with default values
      const payload = {
        data: {
          title: data.title || "Untitled Project",
          description: data.description || "",
          content: data.content || "",
          state: data.state || "draft",
          category: data.category || "Other",
          technologies: data.technologies || [],
          demoUrl: data.demoUrl,
          githubUrl: data.githubUrl,
        },
      };

      const projectsCollection = strapiService.collection("projects");
      const response = await projectsCollection.create(payload);

      if (!response || !response.data || !response.data.id) {
        throw new Error("Invalid response from server when creating project");
      }

      const projectId = response.data.id;

      // Upload project image if provided
      if (projectImage) {
        await projectService.uploadProjectImage(projectId, projectImage);
      }

      // Fetch and return the created project
      const newProject = await projectService.getOne(projectId);
      if (!newProject) {
        // Provide a fallback if fetch fails
        return {
          id: projectId,
          title: payload.data.title,
          description: payload.data.description,
          content: payload.data.content,
          state: payload.data.state,
          category: payload.data.category,
          technologies: payload.data.technologies,
          demoUrl: payload.data.demoUrl || "",
          githubUrl: payload.data.githubUrl || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      return newProject;
    } catch (error) {
      console.error(
        "Error creating project:",
        new Error(
          `Failed to create project: ${error instanceof Error ? error.message : String(error)}`
        )
      );
      throw error;
    }
  },

  // Update an existing project
  update: async (
    id: string | number,
    data: Partial<ProjectAttributes>,
    projectImage?: File | null
  ): Promise<ProjectResponse> => {
    try {
      const projectsCollection = strapiService.collection("projects");
      await projectsCollection.update(id.toString(), { data });

      // Upload project image if provided
      if (projectImage) {
        await projectService.uploadProjectImage(id, projectImage);
      }

      // Fetch and return the updated project
      const updatedProject = await projectService.getOne(id);
      if (!updatedProject) {
        throw new Error("Failed to fetch the updated project.");
      }
      return updatedProject;
    } catch (error) {
      console.error(
        "Error updating project:",
        new Error(
          `Failed to update project: ${error instanceof Error ? error.message : String(error)}`
        )
      );
      throw error;
    }
  },

  // Delete a project
  delete: async (id: string | number): Promise<boolean> => {
    try {
      const projectsCollection = strapiService.collection("projects");
      await projectsCollection.delete(id.toString());
      return true;
    } catch (error) {
      console.error(
        "Error deleting project:",
        new Error(
          `Failed to delete project: ${error instanceof Error ? error.message : String(error)}`
        )
      );
      return false;
    }
  },

  // Upload project image
  uploadProjectImage: async (
    projectId: number | string,
    image: File
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("ref", "api::project.project");
      formData.append("refId", projectId.toString());
      formData.append("field", "projectImage");
      formData.append("files", image);

      await strapiService.fetch("upload", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error(
        "Error uploading project image:",
        new Error(
          `Failed to upload image: ${error instanceof Error ? error.message : String(error)}`
        )
      );
      throw error;
    }
  },
};
