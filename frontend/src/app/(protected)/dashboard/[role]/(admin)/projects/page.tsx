"use client";

import React, { useState, useEffect } from "react";
import { projectService } from "@/lib/data/services/projectService";
import { formatDate } from "@/lib/utils/eventUtils";
import BackButton from "@/components/BackButton";
import {
  AdminTable,
  AdminColumn,
  AdminAction,
} from "@/components/dashboard/contentManager/AdminContentTable";
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
      const data = await projectService.getAll({
        sort: ["createdAt:desc"],
        populate: ["projectImage"],
      });
      setProjects(data);
      setError(null);
    } catch (err) {
      setError("An error occurred while loading projects");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed handleDelete function to handle both string and number IDs
  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      // Convert id to string since the service.delete expects a string
      const idString = String(id);
      const success = await projectService.delete(idString);

      if (success) {
        setSuccessMessage("Project deleted successfully!");
        setProjects((prevProjects) =>
          prevProjects.filter(
            (project) => String(project.documentId) !== idString
          )
        );
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      setError("Failed to delete project. Please try again.");
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
          {project.description && (
            <div className="mt-1 truncate max-w-xs text-gray-600">
              {project.description}
            </div>
          )}
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
            {project.technologies
              .slice(0, 3)
              .map((tech: string, index: number) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700"
                >
                  {tech}
                </span>
              ))}
            {project.technologies.length > 3 && (
              <span className="text-xs text-gray-500 self-center">
                +{project.technologies.length - 3} more
              </span>
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
      href: "/admin/projects/:id",
    },
    {
      label: "View",
      color: "success",
      href: "/aktiviteter/projects/:id",
      external: true,
    },
  ];

  return (
    <section
      className="p-4 bg-white shadow-md rounded-lg"
      style={{ backgroundColor: Theme.colors.background }}
    >
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
        getItemId={(project) => project.documentId || project.id}
        imageKey="projectImage"
        getImageUrl={(image) => projectService.getMediaUrl(image)}
      />
    </section>
  );
}
