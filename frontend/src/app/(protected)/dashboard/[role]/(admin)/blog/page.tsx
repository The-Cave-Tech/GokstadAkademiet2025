"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { blogService } from "@/lib/data/services/blogService";
import { formatDate } from "@/lib/utils/eventUtils";

// Earthy color palette variables for easy customization (matching your existing colors)
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

export default function BlogAdminPage() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    setIsLoading(true);
    try {
      const data = await blogService.getAll({
        sort: ["createdAt:desc"],
        populate: ["blogImage", "author"],
      });
      setBlogPosts(data);
      setError(null);
    } catch (err) {
      setError("An error occurred while loading blog posts");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await blogService.delete(id);
      if (success) {
        setSuccessMessage("Blog post deleted successfully!");
        setBlogPosts((prevBlogPosts) =>
          prevBlogPosts.filter((post) => post.documentId !== id)
        );
      }
    } catch (error) {
      console.error("Failed to delete blog post:", error);
      setError("Failed to delete blog post. Please try again.");
    } finally {
      // Clear the success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await blogService.update(id, { state: "archived" }); // Changed from status to state
      setSuccessMessage("Blog post archived successfully!");

      // Refresh the list to show updated status
      loadBlogPosts();
    } catch (error) {
      console.error("Failed to archive blog post:", error);
      setError("Failed to archive blog post. Please try again.");
    } finally {
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case "published":
        return {
          bg: "rgba(96, 125, 83, 0.2)",
          text: colors.success,
        };
      case "draft":
        return {
          bg: "rgba(190, 142, 79, 0.2)",
          text: colors.warning,
        };
      case "archived":
        return {
          bg: "rgba(168, 77, 70, 0.2)",
          text: colors.error,
        };
      default:
        return {
          bg: "rgba(84, 110, 122, 0.2)",
          text: colors.info,
        };
    }
  };

  return (
    <div
      className="min-h-screen p-6 sm:p-8 md:p-10"
      style={{ backgroundColor: colors.background }}
    >
      {/* Success Message */}
      {successMessage && (
        <div
          className="px-4 py-3 mb-6 rounded-md"
          style={{
            backgroundColor: "rgba(96, 125, 83, 0.1)", // Light green background
            color: colors.success, // Green text
            border: `1px solid ${colors.success}`,
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
            <span>{successMessage}</span>
          </div>
        </div>
      )}

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
            <h1 className="text-2xl sm:text-3xl font-bold">
              Manage Blog Posts
            </h1>
            <Link
              href="/dashboard/admin/blog/new"
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
              + New Blog Post
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8">
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
          ) : blogPosts.length === 0 ? (
            // No Blog Posts Found
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
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M8 12h8M8 16h4"
                />
              </svg>
              <p
                className="text-lg font-medium"
                style={{ color: colors.text.primary }}
              >
                No blog posts found
              </p>
              <p className="mt-2" style={{ color: colors.text.secondary }}>
                Create a new blog post to get started.
              </p>
            </div>
          ) : (
            // Blog Posts Table
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
                      Author
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        backgroundColor: colors.tertiary,
                        color: colors.text.primary,
                      }}
                    >
                      State
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
                  {blogPosts.map((post, index) => (
                    <tr
                      key={post.documentId}
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
                        {post.blogImage?.url ? (
                          <div className="relative h-16 w-16 rounded-md overflow-hidden shadow">
                            <Image
                              src={blogService.getMediaUrl(post.blogImage)}
                              alt={post.title || "Blog Image"}
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
                        <div className="font-medium">{post.title}</div>
                        {post.summary && (
                          <div
                            className="mt-1 truncate max-w-xs"
                            style={{ color: colors.text.secondary }}
                          >
                            {post.summary}
                          </div>
                        )}
                      </td>

                      {/* Author */}
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span>{post.author?.username || "Unknown"}</span>
                        </div>
                      </td>

                      {/* State */}
                      <td className="px-4 py-4">
                        <span
                          className="px-2 py-1 rounded-md text-xs font-medium"
                          style={{
                            backgroundColor: getStateColor(post.state).bg,
                            color: getStateColor(post.state).text,
                          }}
                        >
                          {post.state || "draft"}
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
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(post.documentId)}
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

                          {post.state !== "archived" && (
                            <button
                              onClick={() => handleArchive(post.documentId)}
                              className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ease-in-out"
                              style={{
                                backgroundColor: colors.warning,
                                color: "white",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  colors.warningHover)
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  colors.warning)
                              }
                            >
                              Archive
                            </button>
                          )}

                          <Link
                            href={`/admin/blog/${post.documentId}`}
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
                            href={`/blog/${post.documentId}`}
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
