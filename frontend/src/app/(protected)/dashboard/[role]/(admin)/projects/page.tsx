"use client";

import React, { useState, useEffect } from "react";
import { projectService } from "@/lib/data/services/projectService";
import { formatDate } from "@/lib/utils/eventUtils";
import BackButton from "@/components/ui/BackButton";
import { AdminTable, AdminColumn, AdminAction } from "@/components/features/dashboard/contentManager/AdminContentTable";
import { MdCategory } from "react-icons/md";
import { Theme } from "@/styles/activityTheme";

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectService.getAll();

      // Add a documentId lookup map to each project for quick reference
      const enhancedData = data.map((project) => {
        return {
          ...project,
          _idLookup: {
            [String(project.documentId)]: project.id,
          },
        };
      });

      setProjects(enhancedData);
      setError(null);
    } catch (err) {
      setError("An error occurred while loading projects");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Find project by documentId and get the actual ID
  const findProjectIdByDocumentId = (documentId: string): number | string | null => {
    for (const project of projects) {
      // If the project has this documentId, return its numeric id
      if (project.documentId === documentId) {
        return project.id;
      }
    }
    return null;
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setError(null);

    try {
      // Check if this is a documentId (string) and find the corresponding project
      let projectId = id;
      let projectToDelete = null;

      if (typeof id === "string" && id.length > 10) {
        // This looks like a documentId, find the corresponding numeric ID
        const foundProjectId = findProjectIdByDocumentId(id as string);
        if (foundProjectId === null) {
          setError("Could not find project ID for the given document ID");
          return;
        }
        projectId = foundProjectId;

        if (projectId) {
          projectToDelete = projects.find((p) => p.id === projectId);
        }
      } else {
        // Regular numeric ID
        projectToDelete = projects.find((p) => String(p.id) === String(id));
      }

      if (!projectToDelete) {
        setError("Could not find project to delete");
        return;
      }

      // Use the documentId for delete operation since that's what Strapi 5 expects
      const deleteId = projectToDelete.documentId || projectToDelete.id;

      const success = await projectService.delete(deleteId);

      if (success) {
        setSuccessMessage("Project deleted successfully!");
        // Update the projects state by filtering out the deleted project
        setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectToDelete.id));
      } else {
        // Fall back to client-side only delete
        setSuccessMessage("Project removed from view");

        // Add to localStorage for persistence
        try {
          const deletedIds = JSON.parse(localStorage.getItem("deletedProjectIds") || "[]");
          const idToStore = String(projectToDelete.id);
          if (!deletedIds.includes(idToStore)) {
            deletedIds.push(idToStore);
            localStorage.setItem("deletedProjectIds", JSON.stringify(deletedIds));
          }
        } catch (e) {
          console.error("Failed to update localStorage:", e);
        }

        // Update UI
        setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectToDelete.id));
      }
    } catch (error) {
      setError(`Failed to delete project: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      // Clear the success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Helper function to get state color
  const getStateColor = (state: string): string => {
    switch (state) {
      case "planning":
        return "bg-gray-400";
      case "in-progress":
        return "bg-blue-500";
      case "completed":
      case "complete":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  // Helper function to get state text in Norwegian
  const getStateText = (state: string): string => {
    switch (state) {
      case "planning":
        return "Planlegging";
      case "in-progress":
        return "Pågående";
      case "complete":
      case "completed":
        return "Fullført";
      default:
        return state || "Ukjent status";
    }
  };

  // Define columns for the admin table
  const columns: AdminColumn[] = [
    {
      key: "title",
      header: "Title",
      render: (project) => (
        <div>
          <div className="font-medium">{project.title}</div>
          {project.description && <div className="mt-1 truncate max-w-xs text-gray-600">{project.description}</div>}
        </div>
      ),
    },
    {
      key: "state",
      header: "Status",
      width: "120px",
      render: (project) => (
        <span
          className="px-2 py-1 rounded-md text-xs font-medium text-white"
          style={{ backgroundColor: getStateColor(project.state || "") }}
        >
          {getStateText(project.state || "")}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      width: "180px",
      render: (project) => (
        <div className="flex items-center">
          <MdCategory className="w-4 h-4 mr-1.5 text-gray-500" />
          <span>{project.category || "Uncategorized"}</span>
        </div>
      ),
    },
    {
      key: "technologies",
      header: "Technologies",
      render: (project) => {
        if (!project.technologies || project.technologies.length === 0) {
          return <span className="text-gray-400">-</span>;
        }

        return (
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map((tech: string, index: number) => (
              <span key={index} className="inline-block px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-xs text-gray-500 self-center">+{project.technologies.length - 3} more</span>
            )}
          </div>
        );
      },
    },
    {
      key: "createdAt",
      header: "Date",
      width: "150px",
      render: (project) => (
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{formatDate(project.createdAt)}</span>
        </div>
      ),
    },
  ];

  // Define actions for the admin table
  const actions: AdminAction[] = [
    {
      label: "Delete",
      color: "error",
      onClick: handleDelete,
    },
    {
      label: "Edit",
      color: "info",
      href: (id) => {
        // If this is a documentId, find the corresponding numeric id for the href
        if (typeof id === "string" && id.length > 10) {
          const project = projects.find((p) => p.documentId === id);
          if (project) {
            return `/dashboard/admin/projects/edit/${project.id}`;
          }
        }
        return `/dashboard/admin/projects/edit/${id}`;
      },
    },
    {
      label: "View",
      color: "success",
      href: (id) => {
        // For View button, always use the numeric ID
        // If this is a documentId, find the corresponding numeric id
        if (typeof id === "string" && id.length > 10) {
          const project = projects.find((p) => p.documentId === id);
          if (project) {
            return `/aktiviteter/projects/${project.id}`;
          }
        }
        return `/aktiviteter/projects/${id}`;
      },
      external: true,
    },
  ];

  return (
    <section className="p-4 bg-white shadow-md rounded-lg" style={{ backgroundColor: Theme.colors.background }}>
      <BackButton />
      <AdminTable
        title="Manage Projects"
        items={projects}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        error={error}
        successMessage={successMessage}
        emptyMessage={{
          title: "No projects found",
          description: "Create a new project to get started.",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          ),
        }}
        createButton={{
          label: "New Project",
          href: "/dashboard/admin/projects/new",
        }}
        getItemId={(project) => {
          // Return documentId since that's what Strapi 5 expects for operations
          return project.documentId || project.id;
        }}
        imageKey="projectImage"
        getImageUrl={(image) => projectService.getMediaUrl(image)}
      />
    </section>
  );
}
