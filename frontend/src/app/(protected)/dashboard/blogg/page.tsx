"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { blogService } from "@/lib/data/services/blogService";
import { formatDate } from "@/lib/utils/eventUtils";
import { useAuth } from "@/lib/context/AuthContext";
import { Theme } from "@/styles/activityTheme";

// User Blog Posts Page - Similar to admin page but only shows the user's own posts
export default function UserBlogPage() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { userRole } = useAuth();

  useEffect(() => {
    loadUserBlogPosts();
  }, []);

  const loadUserBlogPosts = async () => {
    setIsLoading(true);
    try {
      // Get only the current user's blog posts
      const data = await blogService.getUserPosts({
        sort: ["createdAt:desc"],
        populate: ["blogImage"],
      });
      setBlogPosts(data);
      setError(null);
    } catch (err) {
      setError("An error occurred while loading your blog posts");
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

  const getStateColor = (state: string) => {
    switch (state) {
      case "published":
        return {
          bg: "rgba(96, 125, 83, 0.2)",
          text: Theme.colors.success || "rgb(96, 125, 83)",
        };
      case "draft":
        return {
          bg: "rgba(190, 142, 79, 0.2)",
          text: Theme.colors.warning || "rgb(190, 142, 79)",
        };
      case "archived":
        return {
          bg: "rgba(168, 77, 70, 0.2)",
          text: Theme.colors.error || "rgb(168, 77, 70)",
        };
      default:
        return {
          bg: "rgba(84, 110, 122, 0.2)",
          text: Theme.colors.info || "rgb(84, 110, 122)",
        };
    }
  };

  return (
    <div
      className="min-h-screen p-6 sm:p-8 md:p-10"
      style={{ backgroundColor: Theme.colors.background }}
    >
      {/* Success Message */}
      {successMessage && (
        <div
          className="px-4 py-3 mb-6 rounded-md"
          style={{
            backgroundColor: "rgba(96, 125, 83, 0.1)", // Light green background
            color: Theme.colors.success,
            border: `1px solid ${Theme.colors.success}`,
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
            color: Theme.colors.error,
            border: `1px solid ${Theme.colors.error}`,
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
        style={{ backgroundColor: Theme.colors.surface }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 sm:px-8 sm:py-6"
          style={{ backgroundColor: Theme.colors.primary, color: "white" }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">My Blog Posts</h1>
            <Link
              href="/dashboard/blog/new"
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
                  borderColor: `${Theme.colors.divider}`,
                  borderTopColor: Theme.colors.primary,
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
                style={{ color: Theme.colors.tertiary }}
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
                style={{ color: Theme.colors.text.primary }}
              >
                You haven't created any blog posts yet
              </p>
              <p
                className="mt-2"
                style={{ color: Theme.colors.text.secondary }}
              >
                Create your first blog post to get started.
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
                        backgroundColor: Theme.colors.tertiary,
                        color: Theme.colors.text.primary,
                      }}
                    >
                      Image
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        backgroundColor: Theme.colors.tertiary,
                        color: Theme.colors.text.primary,
                      }}
                    >
                      Title
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        backgroundColor: Theme.colors.tertiary,
                        color: Theme.colors.text.primary,
                      }}
                    >
                      State
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        backgroundColor: Theme.colors.tertiary,
                        color: Theme.colors.text.primary,
                      }}
                    >
                      Date
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tr-md"
                      style={{
                        backgroundColor: Theme.colors.tertiary,
                        color: Theme.colors.text.primary,
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y"
                  style={{
                    color: Theme.colors.text.primary,
                    borderColor: Theme.colors.divider,
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
                          Theme.colors.surfaceHover)
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
                            style={{ backgroundColor: Theme.colors.divider }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              style={{ color: Theme.colors.text.light }}
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

                      {/* Title and Summary */}
                      <td className="px-4 py-4">
                        <div className="font-medium">{post.title}</div>
                        {post.summary && (
                          <div
                            className="mt-1 truncate max-w-xs"
                            style={{ color: Theme.colors.text.secondary }}
                          >
                            {post.summary}
                          </div>
                        )}
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
                            style={{ color: Theme.colors.accent }}
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
                              backgroundColor: Theme.colors.error,
                              color: "white",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                Theme.colors.errorHover)
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                Theme.colors.error)
                            }
                          >
                            Delete
                          </button>
                          <Link
                            href={`/dashboard/blog/${post.documentId}`}
                            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ease-in-out"
                            style={{
                              backgroundColor: Theme.colors.info,
                              color: "white",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                Theme.colors.infoHover)
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                Theme.colors.info)
                            }
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/blog/${post.documentId}`}
                            target="_blank"
                            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ease-in-out"
                            style={{
                              backgroundColor: Theme.colors.success,
                              color: "white",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                Theme.colors.successHover)
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                Theme.colors.success)
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
