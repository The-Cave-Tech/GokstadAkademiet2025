// Updated: frontend/src/components/dashboard/contentManager/ProjectCard.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { Theme } from "@/styles/activityTheme";
import { Project } from "@/types/activity.types";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { AiOutlineTool } from "react-icons/ai";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const router = useRouter();

  // Function to navigate to the project details page within the aktiviteter route
  const handleClick = () => {
    // Use documentId and route through aktiviteter/project/:id
    if (project.documentId) {
      router.push(`/aktiviteter/projects/${project.id}`);
    } else {
      console.error("Project has no documentId:", project);
    }
  };

  return (
    <article
      className="relative flex flex-col h-full rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-white overflow-hidden"
      style={{ border: `1px solid ${Theme.colors.divider}` }}
      tabIndex={0}
      role="button"
      aria-label={`Vis detaljer om prosjektet ${project.title}`}
      onClick={handleClick}
    >
      {/* Project Image */}
      {project.projectImage && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={project.projectImage.url}
            alt={project.projectImage.alternativeText || project.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Header with badges */}
        <div className="mb-3 flex flex-wrap justify-between gap-2">
          {/* Category Badge */}
          {project.category && (
            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: `${Theme.colors.primary}15`,
                color: Theme.colors.primary,
              }}
            >
              <MdCategory className="w-3 h-3" />
              {project.category}
            </span>
          )}

          {/* State Badge */}
          {project.state && (
            <span
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md"
              style={{
                backgroundColor: getStateColor(project.state),
                color: "white",
              }}
            >
              {getStateText(project.state)}
            </span>
          )}
        </div>

        {/* Title and Description */}
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: Theme.colors.text.primary }}
        >
          {project.title}
        </h3>

        {project.description && (
          <p
            className="text-sm mb-4 line-clamp-3"
            style={{ color: Theme.colors.text.secondary }}
          >
            {project.description}
          </p>
        )}

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mt-auto mb-3">
            <div className="flex flex-wrap gap-1">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: Theme.colors.divider,
                    color: Theme.colors.text.primary,
                  }}
                >
                  <AiOutlineTool className="w-3 h-3" />
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer with links */}
        <div className="mt-auto pt-2 flex gap-2">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded inline-flex items-center gap-1 font-medium"
              style={{
                backgroundColor: Theme.colors.primary,
                color: "white",
              }}
              onClick={(e) => e.stopPropagation()}
              aria-label="Demo link"
            >
              <FaExternalLinkAlt className="w-3 h-3" />
              Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded inline-flex items-center gap-1 font-medium"
              style={{
                backgroundColor: "#333",
                color: "white",
              }}
              onClick={(e) => e.stopPropagation()}
              aria-label="GitHub repository link"
            >
              <FaGithub className="w-3 h-3" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

// Helper function to get state color
const getStateColor = (state: string): string => {
  switch (state) {
    case "planning":
      return "rgb(156, 163, 175)"; // gray
    case "in-progress":
      return "rgb(79, 70, 229)"; // indigo
    case "completed":
      return "rgb(22, 163, 74)"; // green
    default:
      return Theme.colors.primary;
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
      return "Fullført";
    default:
      return state;
  }
};
