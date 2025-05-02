// components/ProjectCard.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { strapiService } from "@/lib/data/services/strapiClient";
import { Theme } from "@/styles/activityTheme";
import { Project } from "@/types/activity.types";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const router = useRouter();

  // Funksjon for å navigere til detaljsiden
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
            src={strapiService.media.getMediaUrl(project.projectImage)}
            alt={project.projectImage.alternativeText || project.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          {project.status && (
            <span
              className="absolute top-2 right-2 px-2 py-1 text-xs rounded-md shadow-sm"
              style={{
                backgroundColor: getStatusColor(project.status),
                color: "white",
              }}
            >
              {getStatusText(project.status)}
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

      {/* Kategori og teknologier */}
      <div className="mt-3">
        {project.category && (
          <span
            className="inline-block text-xs px-2 py-1 rounded-md mr-2"
            style={{
              backgroundColor: `${Theme.colors.primary}15`,
              color: Theme.colors.primary,
            }}
          >
            {project.category}
          </span>
        )}
      </div>

      {project.technologies && project.technologies.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: Theme.colors.divider,
                color: Theme.colors.text.primary,
              }}
            >
              {tech}
            </span>
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

      {/* Eksterne lenker hvis tilgjengelig */}
      {(project.demoUrl || project.githubUrl) && (
        <div className="mt-3 flex gap-2">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 rounded inline-flex items-center"
              style={{
                backgroundColor: Theme.colors.primary,
                color: "white",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
              Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 rounded inline-flex items-center"
              style={{
                backgroundColor: "#333",
                color: "white",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                ></path>
              </svg>
              GitHub
            </a>
          )}
        </div>
      )}

      {/* Visuell indikator for å vise at kortet er klikkbart */}
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

// Hjelpefunksjon for å få statusfarge
const getStatusColor = (status: string): string => {
  switch (status) {
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

// Hjelpefunksjon for å få statustekst på norsk
const getStatusText = (status: string): string => {
  switch (status) {
    case "planning":
      return "Planlegging";
    case "in-progress":
      return "Pågående";
    case "completed":
      return "Fullført";
    default:
      return status;
  }
};
