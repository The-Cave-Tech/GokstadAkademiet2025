"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Theme } from "@/styles/activityTheme";
import { ProjectResponse } from "@/types/content.types";
import { MdCategory } from "react-icons/md";
import { AiOutlineTool } from "react-icons/ai";
import { strapiService } from "@/lib/data/services/strapiClient";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";

interface ProjectCardProps {
  project: ProjectResponse;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const router = useRouter();

  // Function to navigate to the project details page within the aktiviteter route
  const handleClick = () => {
    if (project.id) {
      router.push(`/aktiviteter/projects/${project.id}`);
    } else {
      console.error("Project has no id:", project);
    }
  };

  // Helper function to safely get image URL using strapiService
  const getImageUrl = (): string | null => {
    if (!project.projectImage) return null;

    // Use the global strapiService.media.getMediaUrl function
    return strapiService.media.getMediaUrl(project.projectImage);
  };

  const imageUrl = getImageUrl();

  return (
    <Card
      className="relative flex flex-col h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer p-0 overflow-hidden border"
      tabIndex={0}
      role="button"
      aria-label={`Vis detaljer om prosjektet ${project.title}`}
      onClick={handleClick}
    >
      {/* Project Image */}
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden relative">
          <Image
            src={imageUrl}
            alt={project.title || "Project image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              // Hide the image container on error
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-grow">
        <CardHeader className="p-0 mb-2">
          {/* Header with badges */}
          <div className="flex flex-wrap justify-between gap-2 mb-2">
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

          {/* Title */}
          <h3
            className="text-lg font-semibold line-clamp-2"
            style={{ color: Theme.colors.text.primary }}
          >
            {project.title}
          </h3>
        </CardHeader>

        <CardBody className="p-0">
          {/* Description */}
          {project.description && (
            <p
              className="text-sm line-clamp-3"
              style={{ color: Theme.colors.text.secondary }}
            >
              {project.description}
            </p>
          )}
        </CardBody>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <CardFooter className="p-0 mt-2">
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
          </CardFooter>
        )}
      </div>
    </Card>
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
