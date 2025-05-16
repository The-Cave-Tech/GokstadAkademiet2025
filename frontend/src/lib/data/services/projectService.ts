// Updated projectService.ts following your current structure with Strapi v5 fixes
import { ProjectAttributes, ProjectResponse, Media } from "@/types/content.types";
import { strapiService } from "@/lib/data/services/strapiClient";

// Projects service
export const projectService = {
  // Get all projects with optional filters, sorting, and pagination
  getAll: async (params: Record<string, unknown> = {}): Promise<ProjectResponse[]> => {
    try {
      // Add default sorting to show the most recently created projects first
      const queryParams: Record<string, unknown> = {
        ...params,
        populate: params.populate || ["projectImage"], // Ensure projectImage is populated
      };

      const projectsCollection = strapiService.collection("projects");
      const response = await projectsCollection.find(queryParams);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response format: No projects found or data is not an array");
      }

      return response.data.map((item) => {
        const project: ProjectResponse = {
          id: item.id,
          documentId: item.documentId || undefined,
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

        if (item.projectImage) {
          const imageUrl = strapiService.media.getMediaUrl(item.projectImage);
          project.projectImage = {
            id: item.projectImage.id || 0,
            url: imageUrl,
            alternativeText: item.projectImage.alternativeText,
            width: item.projectImage.width,
            height: item.projectImage.height,
            formats: item.projectImage.formats,
          };
        }

        return project;
      });
    } catch (error) {
      console.error(
        "Error fetching projects:",
        new Error(`Failed to retrieve projects: ${error instanceof Error ? error.message : String(error)}`)
      );
      return [];
    }
  },

  // Get a single project by ID
  getOne: async (id: string | number, params: Record<string, unknown> = {}): Promise<ProjectResponse | null> => {
    try {
      const projectsCollection = strapiService.collection("projects");

      // Define a properly typed query params object
      const queryParams: Record<string, unknown> = {
        ...params,
        populate: params.populate || ["projectImage"], // Ensure projectImage is populated
      };

      // Use the collection's findOne method
      const response = await projectsCollection.findOne(id.toString(), queryParams);

      if (!response.data) {
        throw new Error(`Project with ID ${id} not found`);
      }

      // Transform to match our ProjectResponse type without attributes nesting
      const project: ProjectResponse = {
        id: response.data.id,
        documentId: response.data.documentId || undefined,
        title: response.data.title,
        description: response.data.description,
        content: response.data.content || "",
        state: response.data.state || "draft",
        category: response.data.category || "Other",
        technologies: response.data.technologies || [],
        demoUrl: response.data.demoUrl || "",
        githubUrl: response.data.githubUrl || "",
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
          imageUrl = strapiService.media.getMediaUrl(response.data.projectImage);

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
        new Error(`Failed to retrieve project: ${error instanceof Error ? error.message : String(error)}`)
      );
      return null;
    }
  },

  // Helper method to get media URL (for backward compatibility)
  getMediaUrl: (media: Media | Record<string, unknown>) => {
    return strapiService.media.getMediaUrl(media);
  },

  // Create a new project - with TypeScript-safe implementation
  create: async (data: Partial<ProjectAttributes>, projectImage?: File | null): Promise<ProjectResponse> => {
    try {
      // Process technologies if they come as a comma-separated string
      let technologiesArray: string[] = [];

      // Check if technologies exists before testing its type
      if (data.technologies !== undefined) {
        if (typeof data.technologies === "string") {
          technologiesArray = data.technologies
            .split(",")
            .map((tech: string) => tech.trim())
            .filter(Boolean);
        } else if (Array.isArray(data.technologies)) {
          technologiesArray = data.technologies;
        }
      }

      // Clean up the data object - remove any properties that shouldn't be sent to Strapi
      const cleanData = { ...data };

      // Remove properties that cause issues with Strapi v5
      delete cleanData.id;
      delete cleanData.documentId;
      delete cleanData.createdAt;
      delete cleanData.updatedAt;
      delete cleanData.publishedAt;
      delete cleanData.projectImage; // Will be handled separately

      // Set the processed technologies array - ensure it's always an array for Strapi
      cleanData.technologies = technologiesArray;

      // Ensure all required fields are present with default values
      if (!cleanData.title) cleanData.title = "Untitled Project";
      if (!cleanData.description) cleanData.description = "";
      if (!cleanData.state) cleanData.state = "draft";
      if (!cleanData.category) cleanData.category = "Other";

      // Create payload for Strapi - IMPORTANT: wrap in a data property for create
      const payload = { data: cleanData };

      // Use the direct API call approach
      const response = await strapiService.fetch<{ data?: { id?: number } }>("projects", {
        method: "POST",
        body: payload,
      });

      if (!response?.data?.id) {
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
          title: cleanData.title as string,
          description: cleanData.description as string,
          content: cleanData.content || "",
          state: cleanData.state as string,
          category: cleanData.category as string,
          technologies: technologiesArray,
          demoUrl: (cleanData.demoUrl as string) || "",
          githubUrl: (cleanData.githubUrl as string) || "",
        };
      }

      return newProject;
    } catch (error) {
      console.error(
        "Error creating project:",
        new Error(`Failed to create project: ${error instanceof Error ? error.message : String(error)}`)
      );
      throw error;
    }
  },

  // Update an existing project - with TypeScript-safe implementation
  update: async (
    id: string | number,
    data: Partial<ProjectAttributes>,
    projectImage?: File | null
  ): Promise<ProjectResponse> => {
    try {
      // Determine if this is a documentId or a numeric ID
      const isDocumentId = typeof id === "string" && id.length > 10;

      // If it's not a documentId, try to find the actual documentId first
      if (!isDocumentId) {
        // Fetch all projects to find the matching one with its documentId
        const allProjects = await projectService.getAll({});
        const matchingProject = allProjects.find((project) => String(project.id) === String(id));

        if (matchingProject && matchingProject.documentId) {
          id = matchingProject.documentId;
        }
      }

      // Clean up the data object - remove any properties that shouldn't be sent to Strapi
      const cleanData = { ...data };

      // Remove properties that cause issues with Strapi v5
      delete cleanData.id;
      delete cleanData.documentId;
      delete cleanData.createdAt;
      delete cleanData.updatedAt;
      delete cleanData.publishedAt;
      delete cleanData.projectImage; // Will be handled separately

      // Process technologies if they're a comma-separated string
      if (cleanData.technologies !== undefined) {
        if (typeof cleanData.technologies === "string") {
          cleanData.technologies = cleanData.technologies
            .split(",")
            .map((tech: string) => tech.trim())
            .filter(Boolean);
        } else if (!Array.isArray(cleanData.technologies)) {
          // If it's neither string nor array but is defined, delete it
          delete cleanData.technologies;
        }
      }

      // IMPORTANT: DO NOT wrap cleanData in a data property for updates
      const projectsCollection = strapiService.collection("projects");
      await projectsCollection.update(id.toString(), cleanData);

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
        new Error(`Failed to update project: ${error instanceof Error ? error.message : String(error)}`)
      );
      throw error;
    }
  },

  delete: async (id: string | number): Promise<boolean> => {
    try {
      // Convert to string for consistency
      const stringId = String(id);

      const projectsCollection = strapiService.collection("projects");

      // Attempt deletion
      await projectsCollection.delete(stringId);
      return true;
    } catch (error) {
      console.error(
        "Error deleting project:",
        `Failed to delete project: ${error instanceof Error ? error.message : String(error)}`
      );
      return false;
    }
  },

  // Upload project image
  uploadProjectImage: async (projectId: number | string, image: File): Promise<void> => {
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
        new Error(`Failed to upload image: ${error instanceof Error ? error.message : String(error)}`)
      );
      throw error;
    }
  },
};
