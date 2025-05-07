"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { projectService } from "@/lib/data/services/projectService";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { ProjectResponse } from "@/types/content.types";
import { AiOutlineTool, AiOutlineGithub, AiOutlineLink } from "react-icons/ai";
import { MdCategory } from "react-icons/md";
import ProjectContent from "@/components/BlockRenderer";

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the ID from params
  const projectId = params.id as string;

  useEffect(() => {
    async function fetchProjectDetails() {
      if (!projectId) return;

      setIsLoading(true);

      try {
        // For Strapi v5, we need to use documentId instead of id in some cases
        // First try to fetch all projects to find the one with the matching URL id
        const allProjects = await projectService.getAll({
          populate: "*", // Use "*" to populate all relations including content
        });

        // Find the project with matching id or documentId
        let targetProject = null;

        // First try to find by numeric ID (for backward compatibility)
        if (!isNaN(Number(projectId))) {
          targetProject = allProjects.find((p) => p.id === Number(projectId));
        }

        // If not found and projectId has a specific format (like documentId)
        if (!targetProject && projectId.includes("-")) {
          targetProject = allProjects.find((p) => p.documentId === projectId);
        }

        // If still not found, try finding by string ID
        if (!targetProject) {
          targetProject = allProjects.find(
            (p) => p.id.toString() === projectId
          );
        }

        if (!targetProject) {
          throw new Error("Project not found");
        }

        setProject(targetProject);
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError("Could not load project details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjectDetails();
  }, [projectId]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!project) return <ErrorMessage message="Project not found" />;

  return (
    <div className="bg-white min-h-screen">
      {/* Header/Banner Image */}
      <div className="w-full h-64 relative bg-gray-200">
        {project.projectImage?.url ? (
          <Image
            src={project.projectImage.url}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
            <h1 className="text-3xl font-bold text-gray-700">
              {project.title}
            </h1>
          </div>
        )}
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              {/* Profile Image and Name */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4 relative">
                  {/* Could be replaced with user profile image if added to ProjectResponse type */}
                  <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-gray-400">
                    {project.title.charAt(0).toUpperCase()}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center">
                  Prosjektnavn
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {project.documentId
                    ? `ID: ${project.documentId}`
                    : `ID: ${project.id}`}
                </p>
              </div>

              {/* Project Info */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-2">
                  Prosjekt info
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <MdCategory className="text-gray-500" />
                    <span>{project.category || "Ikke kategorisert"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${getStateColor(project.state || "")}`}
                    ></span>
                    <span>{getStateText(project.state || "")}</span>
                  </li>
                  {project.technologies && project.technologies.length > 0 && (
                    <li>
                      <div className="text-gray-700 mb-1 mt-4">
                        Teknologier:
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-xs rounded-md text-gray-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              {/* Project Links */}
              <div className="mt-8 space-y-3">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <AiOutlineLink className="text-lg" />
                    <span>Se live demo</span>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <AiOutlineGithub className="text-lg" />
                    <span>GitHub repository</span>
                  </a>
                )}
              </div>

              {/* Project Metadata */}
              <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                {project.publishedAt && (
                  <p>Publisert: {formatDate(project.publishedAt)}</p>
                )}
                {project.createdAt && (
                  <p>Opprettet: {formatDate(project.createdAt)}</p>
                )}
                {project.updatedAt && (
                  <p>Sist oppdatert: {formatDate(project.updatedAt)}</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:w-3/4">
            {/* Project Title and Header */}
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                {project.title}
              </h1>
              <div className="text-sm text-red-500 mt-2 tracking-wider uppercase">
                PROSJEKT • {project.category || "UKATEGORISERT"} •{" "}
                {formatDate(project.publishedAt || project.createdAt || "")}
              </div>
            </div>

            {/* Project Description */}
            {project.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 border-l-4 border-red-500 pl-3">
                  Om Prosjektet
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}

            {/* Project Content using Strapi Blocks Renderer */}
            <div className="prose max-w-none">
              <ProjectContent content={project.content} />
            </div>

            {/* Technologies Detail Section */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Teknologier og verktøy
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {project.technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center"
                    >
                      <AiOutlineTool className="text-2xl text-gray-700 mb-2" />
                      <span className="text-gray-800 font-medium">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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

// Helper function to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
