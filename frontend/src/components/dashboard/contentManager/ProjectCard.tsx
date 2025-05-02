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
    <article
      className="relative p-4 rounded-md shadow hover:shadow-lg transition-all cursor-pointer"
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
      {/* Header Section */}
      <header className="flex items-center justify-between mb-7">
        {/* Category Badge */}
        {project.category && (
          <span
            className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs"
            style={{
              backgroundColor: `${Theme.colors.primary}15`,
              color: Theme.colors.primary,
            }}
          >
            <MdCategory className="w-4 h-4" />
            {project.category}
          </span>
        )}

        {/* Technologies Badges */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-wrap gap-1">
            {project.technologies.slice(0, 2).map((tech, index) => (
              <span
                key={index}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: Theme.colors.divider,
                  color: Theme.colors.text.primary,
                }}
              >
                <AiOutlineTool className="w-4 h-4" />
                {tech}
              </span>
            ))}
            {project.technologies.length > 2 && (
              <span
                className="px-2 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: Theme.colors.divider,
                  color: Theme.colors.text.primary,
                }}
              >
                +{project.technologies.length - 2}
              </span>
            )}
          </div>
        )}
      </header>

      {/* Project Image */}
      {project.projectImage && (
        <figure className="relative w-full h-48 overflow-hidden rounded-md mb-3">
          <img
            src={project.projectImage.url}
            alt={project.projectImage.alternativeText || project.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          {project.state && (
            <figcaption
              className="absolute top-2 right-2 px-2 py-1 text-xs rounded-md shadow-sm flex items-center gap-1"
              style={{
                backgroundColor: getStateColor(project.state),
                color: "white",
              }}
            >
              {getStateText(project.state)}
            </figcaption>
          )}
        </figure>
      )}

      {/* Title and Description */}
      <section>
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
      </section>

      {/* Footer Section */}
      <footer className="mt-3 flex gap-2">
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
            aria-label="Demo link"
          >
            <FaExternalLinkAlt className="w-4 h-4" />
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
            aria-label="GitHub repository link"
          >
            <FaGithub className="w-4 h-4" />
            GitHub
          </a>
        )}
      </footer>
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
    case "completed":
      return "Fullført";
    default:
      return state;
  }
};
