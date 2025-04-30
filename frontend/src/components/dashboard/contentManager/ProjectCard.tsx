import React from "react";
import { strapiService } from "@/lib/data/services/strapiClient";
import { Theme } from "@/styles/activityTheme";

interface ProjectCardProps {
  project: any;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div
      className="p-4 rounded-md shadow hover:shadow-lg transition-shadow"
      style={{
        backgroundColor: Theme.colors.surface,
        border: `1px solid ${Theme.colors.divider}`,
      }}
    >
      <h3
        className="text-lg font-semibold"
        style={{ color: Theme.colors.text.primary }}
      >
        {project.title}
      </h3>
      <p>{project.Description}</p>
      {project.projectImage && (
        <img
          src={strapiService.media.getMediaUrl(project.projectImage)}
          alt={strapiService.media.getAltText(project.projectImage)}
          className="mt-2 w-full h-48 object-cover rounded-md"
        />
      )}
      <p className="mt-2" style={{ color: Theme.colors.text.secondary }}>
        {project.summary}
      </p>
    </div>
  );
};
