// components/dashboard/contentManager/BlogCard.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { Theme } from "@/styles/activityTheme";
import { BlogAttributes } from "@/types/content.types";
import { formatDate } from "@/lib/utils/eventUtils";

interface BlogCardProps {
  blog: BlogAttributes;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const router = useRouter();

  // Format date for display
  const formattedDate = blog.createdAt ? formatDate(blog.createdAt) : "";

  // Format tags for display
  const formattedTags = Array.isArray(blog.tags)
    ? blog.tags
    : typeof blog.tags === "string"
      ? blog.tags.split(",").map((tag) => tag.trim())
      : [];

  // Navigate to blog post details
  const handleClick = () => {
    router.push(`/blog/${blog.id}`);
  };

  // Truncate summary
  const truncateSummary = (text: string, maxLength: number = 120) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  // Get state color (changed from status to state)
  const getStateColor = (state: string) => {
    switch (state) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <article
      className="relative flex flex-col h-full rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-white overflow-hidden"
      style={{ border: `1px solid ${Theme.colors.divider}` }}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={`Read blog post: ${blog.title}`}
    >
      {/* Blog Image */}
      {blog.blogImage?.url && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={blog.blogImage.url}
            alt={blog.blogImage.alternativeText || blog.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category and State */}
        <div className="mb-3 flex flex-wrap justify-between gap-2">
          {blog.category && (
            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: `${Theme.colors.primary}15`,
                color: Theme.colors.primary,
              }}
            >
              {blog.category}
            </span>
          )}

          {blog.state && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md ${getStateColor(blog.state)}`}
            >
              {blog.state}
            </span>
          )}
        </div>

        {/* Title and Summary */}
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: Theme.colors.text.primary }}
        >
          {blog.title}
        </h3>

        {blog.summary && (
          <p
            className="text-sm mb-4 line-clamp-3"
            style={{ color: Theme.colors.text.secondary }}
          >
            {truncateSummary(blog.summary)}
          </p>
        )}

        {/* Tags */}
        {formattedTags.length > 0 && (
          <div className="mt-auto mb-3">
            <div className="flex flex-wrap gap-1">
              {formattedTags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: Theme.colors.divider,
                    color: Theme.colors.text.primary,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
