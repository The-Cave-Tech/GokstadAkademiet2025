"use client";
import React, { useEffect, useState } from "react";
import { getProjects, getImageUrl, ProjectData } from "@/lib/strapiFirst/api";
import Link from "next/link";

interface ProjectsListProps {
  limit?: number;
  featured?: boolean;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  limit,
  featured = false,
}) => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        // Prepare query parameters
        const params: any = {};

        if (limit) {
          params.pagination = { limit };
        }

        if (featured) {
          params.filters = { featured: { $eq: true } };
        }

        const response = await getProjects(params);
        console.log("Projects response:", response);

        if (response && response.data) {
          setProjects(response.data);
          console.log("Projects data set:", response.data);
        } else {
          setProjects([]);
          console.log("No projects data found");
        }

        setError(null);
      } catch (err) {
        setError("Failed to load projects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [limit, featured]);

  if (loading) {
    return <div className="py-4">Loading projects...</div>;
  }

  if (error) {
    return <div className="py-4 text-red-500">{error}</div>;
  }

  if (projects.length === 0) {
    return <div className="py-4">No projects found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        // Get image URL, preferring thumbnail or small format if available
        let imageUrl = "";
        if (project.Image) {
          if (project.Image.formats?.thumbnail?.url) {
            imageUrl = getImageUrl(project.Image.formats.thumbnail.url);
          } else if (project.Image.formats?.small?.url) {
            imageUrl = getImageUrl(project.Image.formats.small.url);
          } else {
            imageUrl = getImageUrl(project.Image.url);
          }
        }

        return (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Image section with fallback */}
            <div className="h-48 overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={project.Title || "Project image"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">
                {project.Title || "Untitled Project"}
              </h3>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {project.Description || "No description available"}
              </p>

              <Link href={`/projects/${project.Slug}`}>View Project</Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectsList;
