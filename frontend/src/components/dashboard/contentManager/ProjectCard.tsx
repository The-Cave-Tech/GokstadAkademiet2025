// components/ProjectCard.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { Theme } from "@/styles/activityTheme";
import { Project } from "@/types/activity.types";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa"; // Import basic icons
import { MdCategory } from "react-icons/md"; // Category icon
import { AiOutlineTool } from "react-icons/ai"; // Technology icon

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const router = useRouter();

  // Function to navigate to the project details page
  const handleClick = () => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <div
      className="p-4 rounded-md shadow hover:shadow-lg transition-all cursor-pointer"
      style={{
        backgroundColor: Theme.colors.surface,
        border: `1px solid ${Theme.colors.divider}`,
        transition: "all 0.2s ease-in-out",
        transform: "translateY(0)",
      }}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      tabIndex={0}
      role="button"
      aria-label={`Vis detaljer om prosjektet ${project.title}`}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.1)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {project.projectImage && (
        <div className="relative w-full h-48 overflow-hidden rounded-md mb-3">
          <img
            src={project.projectImage.url}
            alt={project.projectImage.alternativeText || project.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          {project.state && (
            <span
              className="absolute top-2 right-2 px-2 py-1 text-xs rounded-md shadow-sm flex items-center gap-1"
              style={{
                backgroundColor: getStateColor(project.state),
                color: "white",
              }}
            >
              <AiOutlineTool className="w-4 h-4" /> {/* Basic icon for state */}
              {getStateText(project.state)}
            </span>
          )}
        </div>
      )}

      <h3
        className="text-lg font-semibold"
        style={{ color: Theme.colors.text.primary }}
      >
        {project.title}
      </h3>

      {project.description && (
        <p
          className="mt-2 text-sm line-clamp-2"
          style={{ color: Theme.colors.text.secondary }}
        >
          {project.description}
        </p>
      )}

      {/* Category */}
      {project.category && (
        <div className="mt-3 flex items-center gap-2">
          <MdCategory className="w-4 h-4 text-gray-500" /> {/* Category icon */}
          <span
            className="text-xs px-2 py-1 rounded-md"
            style={{
              backgroundColor: `${Theme.colors.primary}15`,
              color: Theme.colors.primary,
            }}
          >
            {project.category}
          </span>
        </div>
      )}

      {/* Technologies */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <div
              key={index}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: Theme.colors.divider,
                color: Theme.colors.text.primary,
              }}
            >
              <AiOutlineTool className="w-4 h-4 text-gray-500" />{" "}
              {/* Tech icon */}
              {tech}
            </div>
          ))}
          {project.technologies.length > 3 && (
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: Theme.colors.divider,
                color: Theme.colors.text.primary,
              }}
            >
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      )}

      {/* External Links */}
      {(project.demoUrl || project.githubUrl) && (
        <div className="mt-3 flex gap-2">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 rounded inline-flex items-center gap-1"
              style={{
                backgroundColor: Theme.colors.primary,
                color: "white",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <FaExternalLinkAlt className="w-4 h-4" /> {/* Demo icon */}
              Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 rounded inline-flex items-center gap-1"
              style={{
                backgroundColor: "#333",
                color: "white",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <FaGithub className="w-4 h-4" /> {/* GitHub icon */}
              GitHub
            </a>
          )}
        </div>
      )}

      {/* Visual indicator for clickable card */}
      <div className="mt-3 flex justify-end">
        <span
          className="text-xs py-1 px-2 rounded-full bg-opacity-10"
          style={{
            backgroundColor: `${Theme.colors.primary}20`,
            color: Theme.colors.primary,
          }}
        >
          Klikk for detaljer
        </span>
      </div>
    </div>
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
    case "completed":
      return "Fullført";
    default:
      return state;
  }
};
