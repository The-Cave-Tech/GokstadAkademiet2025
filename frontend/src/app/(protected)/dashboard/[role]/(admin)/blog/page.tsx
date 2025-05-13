"use client";

import React, { useState, useEffect } from "react";
import { blogService } from "@/lib/data/services/blogService";
import { formatDate } from "@/lib/utils/eventUtils";
import BackButton from "@/components/ui/BackButton";
import { AdminTable, AdminColumn, AdminAction } from "@/components/dashboard/contentManager/AdminContentTable";
import { MdPerson } from "react-icons/md";

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
      const data = await blogService.getAll();
      setBlogPosts(data);
      setError(null);
    } catch (err) {
      setError("An error occurred while loading blog posts");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed handleDelete function to accept string or number IDs
  const handleDelete = async (id: string | number) => {
    try {
      const idString = String(id);
      const success = await blogService.delete(idString);

      if (success) {
        setSuccessMessage("Blog post deleted successfully!");
        setBlogPosts((prevBlogPosts) => prevBlogPosts.filter((post) => String(post.documentId) !== idString));
      }
    } catch (error) {
      console.error("Failed to delete blog post:", error);
      setError("Failed to delete blog post. Please try again.");
    } finally {
      // Clear the success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Fixed handleArchive function to accept string or number IDs
  const handleArchive = async (id: string | number) => {
    try {
      const idString = String(id);
      await blogService.update(idString, { state: "archived" });
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

  // Define columns for the admin table
  const columns: AdminColumn[] = [
    {
      key: "title",
      header: "Title",
      render: (post) => (
        <div>
          <div className="font-medium">{post.title}</div>
          {post.summary && <div className="mt-1 truncate max-w-xs text-gray-600">{post.summary}</div>}
        </div>
      ),
    },
    {
      key: "author",
      header: "Author",
      width: "150px",
      render: (post) => (
        <div className="flex items-center">
          <MdPerson className="w-4 h-4 mr-1.5 text-gray-500" />
          <span>{post.author?.username || "Unknown"}</span>
        </div>
      ),
    },
    {
      key: "state",
      header: "State",
      width: "120px",
      render: (post) => {
        type StateColorKey = "published" | "draft" | "archived" | "default";
        type StateColorConfig = {
          bg: string;
          text: string;
        };

        const stateColors: Record<StateColorKey, StateColorConfig> = {
          published: {
            bg: "rgba(96, 125, 83, 0.2)",
            text: "rgb(96, 125, 83)",
          },
          draft: {
            bg: "rgba(190, 142, 79, 0.2)",
            text: "rgb(190, 142, 79)",
          },
          archived: {
            bg: "rgba(168, 77, 70, 0.2)",
            text: "rgb(168, 77, 70)",
          },
          default: {
            bg: "rgba(84, 110, 122, 0.2)",
            text: "rgb(84, 110, 122)",
          },
        };

        // Ensure state is a valid key, otherwise use default
        const state = post.state || "draft";
        const stateKey = (Object.keys(stateColors).includes(state) ? state : "default") as StateColorKey;
        const colors = stateColors[stateKey];

        return (
          <span
            className="px-2 py-1 rounded-md text-xs font-medium"
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
            }}
          >
            {state}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: "Date",
      width: "150px",
      render: (post) => (
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
      ),
    },
  ];

  // Define actions for the admin table
  const actions: AdminAction[] = [
    {
      label: "Archive",
      color: "warning",
      onClick: handleArchive,
      showCondition: (post) => post.state !== "archived",
    },
    {
      label: "View",
      color: "success",
      href: "/blog/:id",
      external: true,
    },
  ];

  return (
    <>
      <BackButton />
      <AdminTable
        title="Manage Blog Posts"
        items={blogPosts}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        error={error}
        successMessage={successMessage}
        emptyMessage={{
          title: "No blog posts found",
          description: "Create a new blog post to get started.",
        }}
        createButton={{
          label: "New Blog Post",
          href: "/dashboard/admin/blog/new",
        }}
        getItemId={(post) => post.documentId || post.id}
        imageKey="blogImage"
        getImageUrl={(image) => blogService.getMediaUrl(image)}
      />
    </>
  );
}
