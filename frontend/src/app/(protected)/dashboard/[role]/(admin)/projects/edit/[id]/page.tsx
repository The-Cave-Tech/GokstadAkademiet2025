"use client";

import React, { useState, useEffect } from "react";
import ContentForm from "@/components/pageSpecificComponents/dashboard/contentManager/ContentForm";
import { projectService } from "@/lib/data/services/projectService";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import BackButton from "@/components/ui/BackButton";

const colors = {
  primary: "rgb(121, 85, 72)", // Brown
  background: "rgb(245, 241, 237)", // Light beige
  surface: "rgb(255, 253, 250)", // Creamy white
  text: {
    primary: "rgb(62, 39, 35)", // Dark brown text
    secondary: "rgb(97, 79, 75)", // Medium brown text
  },
};

const EditProjectPage = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;

      try {
        setIsLoading(true);

        // First try to get all projects to find the one with matching ID
        const allProjects = await projectService.getAll({
          populate: ["projectImage"],
        });

        // Find the project with matching ID
        const matchingProject = allProjects.find(
          (p) =>
            p.id.toString() === projectId.toString() ||
            (p.documentId && p.documentId.toString() === projectId.toString())
        );

        if (!matchingProject) {
          throw new Error("Project not found");
        }

        // Use the documentId for fetching if available
        const idToUse = matchingProject.documentId || matchingProject.id;

        // Now fetch the full details using the documentId
        const projectData = await projectService.getOne(idToUse, {
          populate: ["projectImage"],
        });

        if (!projectData) {
          throw new Error("Project details not found");
        }

        // Format technologies for the form - TypeScript-safe conversion
        const formattedProject = {
          ...projectData,
          technologies: Array.isArray(projectData.technologies)
            ? projectData.technologies.join(", ")
            : typeof projectData.technologies === "string"
              ? projectData.technologies
              : "",
        };

        setProject(formattedProject);
      } catch (err) {
        setError(
          `Failed to load project: ${err instanceof Error ? err.message : "Unknown error"}`
        );
        console.error("Error loading project:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleSave = async (data: any, image?: File | null) => {
    try {
      // Use the documentId for the update if available
      const idToUse = project?.documentId || projectId;
      await projectService.update(idToUse, data, image);
      router.push("/dashboard/admin/projects");
    } catch (err) {
      setError(
        `Failed to update project: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      console.error("Error updating project:", err);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/admin/projects");
  };

  if (error) {
    return (
      <div
        className="min-h-screen p-6 sm:p-8 md:p-10"
        style={{ backgroundColor: colors.background }}
      >
        <div
          className="max-w-4xl mx-auto p-6 rounded-xl shadow-lg"
          style={{ backgroundColor: colors.surface }}
        >
          <BackButton />
          <div className="p-4 my-4 rounded-md bg-red-50 border border-red-200 text-red-700">
            <p>{error}</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/admin/projects")}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
          >
            Return to Projects List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6 sm:p-8 md:p-10"
      style={{ backgroundColor: colors.background }}
    >
      <div
        className="max-w-4xl mx-auto rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: colors.surface }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 sm:px-8 sm:py-6"
          style={{ backgroundColor: colors.primary, color: "white" }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold">Edit Project</h1>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8">
          {isLoading ? (
            <div className="flex justify-center my-16">
              <div
                className="animate-spin rounded-full h-12 w-12"
                style={{
                  borderWidth: "3px",
                  borderStyle: "solid",
                  borderColor: "rgb(225, 217, 209)",
                  borderTopColor: colors.primary,
                }}
              ></div>
            </div>
          ) : (
            <ContentForm
              onSave={handleSave}
              onCancel={handleCancel}
              isLoading={false}
              config={{
                type: "project",
                fields: [
                  {
                    name: "title",
                    label: "Title",
                    type: "text",
                    required: true,
                  },
                  {
                    name: "description",
                    label: "Description",
                    type: "textarea",
                  },
                  {
                    name: "state",
                    label: "State",
                    type: "select",
                    options: ["planning", "in-progress", "complete"],
                    required: true,
                  },
                  { name: "category", label: "Category", type: "text" },
                  {
                    name: "technologies",
                    label: "Technologies (comma separated)",
                    type: "text",
                  },
                  { name: "demoUrl", label: "Demo URL", type: "text" },
                  { name: "githubUrl", label: "GitHub URL", type: "text" },
                  { name: "content", label: "Content", type: "editor" },
                ],
                getImageUrl: projectService.getMediaUrl,
                imageName: "Project Image",
              }}
              data={project}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProjectPage;
