// services/projectService.ts
import { ProjectAttributes } from "@/types/content.types";
import { strapiService } from "@/lib/data/services/strapiClient";

// Define ProjectResponse type that includes id
interface ProjectResponse extends ProjectAttributes {
  id: number;
}

// Projects service
export const projectService = {
  // Get all projects with optional filters, sorting, and pagination
  getAll: async (params: any = {}): Promise<ProjectResponse[]> => {
    try {
      const queryParams = {
        ...params,
        populate: params.populate || ["projectImage"], // Ensure projectImage and state is populated
      };

      const response = await strapiService.fetch<any>("projects", {
        params: queryParams,
      });

      if (!response.data || !Array.isArray(response.data)) {
        console.warn("No projects found or data is not an array");
        return [];
      }
      console.log("Fetched projects:", response.data);

      return response.data.map((item: any) => ({
        id: item.id,
        ...item,
        projectImage: strapiService.media.getMediaUrl(item.projectImage), // Use media utility
      }));
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  },

  getMediaUrl: (imagePath: string) => `/media/${imagePath}`, // Add this method

  // Get a single project by ID
  getOne: async (
    id: number | string,
    params: any = {}
  ): Promise<ProjectResponse | null> => {
    try {
      const queryParams = {
        ...params,
        populate: params.populate || ["projectImage"], // Ensure projectImage is populated
      };

      const response = await strapiService.fetch<any>(`projects/${id}`, {
        params: queryParams,
      });

      if (!response.data) return null;

      return {
        id: response.data.id,
        ...response.data.attributes,
        projectImage: strapiService.media.getMediaUrl(
          response.data.attributes.projectImage
        ), // Use media utility
      };
    } catch (error) {
      console.error("Error fetching project:", error);
      return null;
    }
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
        title: data.title || "Untitled Project",
        description: data.description || "",
        content: data.content || "",
        state: data.state || "draft",
        category: data.category || "Other",
        technologies: data.technologies || [],
        demoUrl: data.demoUrl,
        githubUrl: data.githubUrl,
      };

      console.log("[ProjectService] Creating project with payload:", payload);

      const response = await strapiService.fetch<any>("projects", {
        method: "POST",
        body: { data: payload },
      });

      console.log("[ProjectService] Create project response:", response);

      if (!response || !response.data || !response.data.id) {
        throw new Error("Invalid response from server when creating project");
      }

      const projectId = response.data.id;

      // Upload project image if provided
      if (projectImage) {
        await projectService.uploadProjectImage(projectId, projectImage);
      }

      // If fetch fails, construct a valid ProjectResponse from the payload
      const fallbackResponse: ProjectResponse = {
        id: projectId,
        title: payload.title,
        description: payload.description,
        content: payload.content,
        state: payload.state,
        category: payload.category,
        technologies: payload.technologies,
        demoUrl: payload.demoUrl,
        githubUrl: payload.githubUrl,
        // projectImage is not included since it's optional and we don't have a valid Media object
      };

      return fallbackResponse;
    } catch (error) {
      console.error("[ProjectService] Error creating project:", error);
      throw error;
    }
  },

  // Update an existing project
  update: async (
    id: number | string,
    data: Partial<ProjectAttributes>,
    projectImage?: File | null
  ): Promise<ProjectResponse> => {
    try {
      await strapiService.fetch<any>(`projects/${id}`, {
        method: "PUT",
        body: { data },
      });

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
      console.error("Error updating project:", error);
      throw error;
    }
  },

  // Delete a project
  delete: async (id: string): Promise<boolean> => {
    try {
      await strapiService.fetch<any>(`projects/${id}`, {
        method: "DELETE",
      });
      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
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

      await strapiService.fetch<any>("upload", {
        method: "POST",
        body: formData as any, // Type cast needed here
      });
    } catch (error) {
      console.error("Error uploading project image:", error);
      throw error;
    }
  },
};
