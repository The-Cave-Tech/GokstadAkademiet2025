"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { projectService } from "@/lib/data/services/projectService";
import { formatDate } from "@/lib/utils/eventUtils";
import BackButton from "@/components/BackButton";

// Earthy color palette variables for easy customization
const colors = {
  primary: "rgb(121, 85, 72)", // Brown
  primaryHover: "rgb(109, 76, 65)", // Darker brown
  secondary: "rgb(78, 52, 46)", // Dark brown
  tertiary: "rgb(188, 170, 164)", // Light brown
  accent: "rgb(141, 110, 99)", // Medium brown
  background: "rgb(245, 241, 237)", // Light beige
  surface: "rgb(255, 253, 250)", // Creamy white
  surfaceHover: "rgb(237, 231, 225)", // Light warm gray
  divider: "rgb(225, 217, 209)", // Soft divider
  text: {
    primary: "rgb(62, 39, 35)", // Dark brown text
    secondary: "rgb(97, 79, 75)", // Medium brown text
    light: "rgb(145, 131, 127)", // Light brown text
  },
  success: "rgb(96, 125, 83)", // Mossy green
  successHover: "rgb(85, 111, 74)",
  error: "rgb(168, 77, 70)", // Earthy red
  errorHover: "rgb(150, 69, 63)",
  warning: "rgb(190, 142, 79)", // Amber/ochre
  warningHover: "rgb(171, 128, 71)",
  info: "rgb(84, 110, 122)", // Slate blue-gray
  infoHover: "rgb(75, 99, 110)",
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectService.getAll({
        sort: ["createdAt:desc"],
        populate: ["projectImage"], // Ensure projectImage is populated
      });
      setProjects(data);
      console.log("Projects loaded:", data); // Log the projects to verify
      setError(null);
    } catch (err) {
      setError("An error occurred while loading projects");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setIsLoading(true);
    try {
      const success = await projectService.delete(id);
      if (success) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.documentId !== id)
        );
        setError(null);
      } else {
        setError("Could not delete the project");
      }
    } catch (err) {
      setError("An error occurred while deleting the project");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen p-6 sm:p-8 md:p-10"
      style={{ backgroundColor: colors.background }}
    >
      <BackButton />
      {/* Card Container */}
      <div
        className="max-w-7xl mx-auto rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: colors.surface }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 sm:px-8 sm:py-6"
          style={{ backgroundColor: colors.primary, color: "white" }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Manage Projects</h1>
            <Link
              href="/dashboard/admin/projects/new"
              className="px-4 py-2 rounded-md text-sm font-medium shadow transition duration-150 ease-in-out"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                color: "white",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.25)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.15)")
              }
            >
              + New Project
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8">
          {/* Error Message */}
          {error && (
            <div
              className="px-4 py-3 mb-6 rounded-md"
              style={{
                backgroundColor: "rgba(168, 77, 70, 0.1)",
                color: colors.error,
                border: `1px solid ${colors.error}`,
              }}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Loading Spinner */}
          {isLoading ? (
            <div className="flex justify-center my-16">
              <div
                className="animate-spin rounded-full h-12 w-12"
                style={{
                  borderWidth: "3px",
                  borderStyle: "solid",
                  borderColor: `${colors.divider}`,
                  borderTopColor: colors.primary,
                }}
              ></div>
            </div>
          ) : projects.length === 0 ? (
            // No Projects Found
            <div
              className="text-center my-16 p-8 rounded-lg"
              style={{ backgroundColor: "rgba(188, 170, 164, 0.2)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: colors.tertiary }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p
                className="text-lg font-medium"
                style={{ color: colors.text.primary }}
              >
                No projects found
              </p>
              <p className="mt-2" style={{ color: colors.text.secondary }}>
                Create a new project to get started.
              </p>
            </div>
          ) : (
            // Projects Table
            <div className="overflow-x-auto">
              <table
                className="min-w-full divide-y"
                style={{ borderCollapse: "separate", borderSpacing: "0 0" }}
              >
                <thead>
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-md"
                      style={{
                        backgroundColor: colors.tertiary,
                        color: colors.text.primary,
                      }}
                    >
                      Image
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        backgroundColor: colors.tertiary,
                        color: colors.text.primary,
                      }}
                    >
                      Title
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        backgroundColor: colors.tertiary,
                        color: colors.text.primary,
                      }}
                    >
                      Status
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        backgroundColor: colors.tertiary,
                        color: colors.text.primary,
                      }}
                    >
                      Date
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tr-md"
                      style={{
                        backgroundColor: colors.tertiary,
                        color: colors.text.primary,
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y"
                  style={{
                    color: colors.text.primary,
                    borderColor: colors.divider,
                  }}
                >
                  {projects.map((project, index) => (
                    <tr
                      key={project.id}
                      className="transition-colors duration-150 ease-in-out"
                      style={{
                        backgroundColor:
                          index % 2 === 0
                            ? "transparent"
                            : "rgba(188, 170, 164, 0.08)",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          colors.surfaceHover)
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          index % 2 === 0
                            ? "transparent"
                            : "rgba(188, 170, 164, 0.08)")
                      }
                    >
                      {/* Image */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {project.projectImage?.url ? (
                          <div className="relative h-16 w-16 rounded-md overflow-hidden shadow">
                            <Image
                              src={
                                project.projectImage.url.startsWith("http")
                                  ? project.projectImage.url
                                  : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${project.projectImage.url}`
                              }
                              alt={project.title || "Project Image"}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className="h-16 w-16 rounded-md flex items-center justify-center"
                            style={{ backgroundColor: colors.divider }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              style={{ color: colors.text.light }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </td>

                      {/* Title and Description */}
                      <td className="px-4 py-4">
                        <div className="font-medium">{project.title}</div>
                        {project.description && (
                          <div
                            className="mt-1 truncate max-w-xs"
                            style={{ color: colors.text.secondary }}
                          >
                            {project.description}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className="px-2 py-1 rounded-md text-xs font-medium"
                          style={{
                            backgroundColor:
                              project.status === "published"
                                ? "rgba(96, 125, 83, 0.2)"
                                : "rgba(190, 142, 79, 0.2)",
                            color:
                              project.status === "published"
                                ? colors.success
                                : colors.warning,
                          }}
                        >
                          {project.status || "draft"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            style={{ color: colors.accent }}
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
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(project.documentId)}
                            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ease-in-out"
                            style={{
                              backgroundColor: colors.error,
                              color: "white",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                colors.errorHover)
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                colors.error)
                            }
                          >
                            Delete
                          </button>
                          <Link
                            href={`/admin/projects/${project.documentId}`}
                            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ease-in-out"
                            style={{
                              backgroundColor: colors.info,
                              color: "white",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                colors.infoHover)
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                colors.info)
                            }
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/projects/${project.id}`}
                            target="_blank"
                            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ease-in-out"
                            style={{
                              backgroundColor: colors.success,
                              color: "white",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                colors.successHover)
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                colors.success)
                            }
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
