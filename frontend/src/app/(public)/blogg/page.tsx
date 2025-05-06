"use client";

import React, { useState, useEffect } from "react";
import { blogService } from "@/lib/data/services/blogService";
import { BlogCard } from "@/components/layouts/dashboard/contentManager/BlogCard";
import { Theme } from "@/styles/activityTheme";
import { BlogAttributes } from "@/types/content.types";

export default function BlogListingsPage() {
  const [blogPosts, setBlogPosts] = useState<BlogAttributes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    setIsLoading(true);
    try {
      const data = await blogService.getAll({
        sort: ["createdAt:desc"],
        populate: ["blogImage", "author"],
        filters: { status: { $eq: "published" } }, // Only show published posts
      });

      setBlogPosts(data);

      // Extract unique categories from blog posts
      const uniqueCategories = Array.from(
        new Set(data.map((post) => post.category).filter(Boolean))
      ) as string[];

      setCategories(uniqueCategories);
      setError(null);
    } catch (err) {
      setError("An error occurred while loading blog posts");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter blog posts based on search query and category
  const filteredBlogPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags &&
        (typeof post.tags === "string"
          ? post.tags.toLowerCase().includes(searchQuery.toLowerCase())
          : post.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            )));

    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the latest news, tutorials, and insights from our team
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Categories */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              style={{
                backgroundColor: Theme.colors.surface,
                color: Theme.colors.text.primary,
              }}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="px-4 py-3 mb-6 rounded-md"
            style={{
              backgroundColor: "rgba(168, 77, 70, 0.1)",
              color: Theme.colors.error.text,
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

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex justify-center my-16">
            <div
              className="animate-spin rounded-full h-12 w-12"
              style={{
                borderWidth: "3px",
                borderStyle: "solid",
                borderColor: Theme.colors.divider,
                borderTopColor: Theme.colors.primary,
              }}
            ></div>
          </div>
        ) : filteredBlogPosts.length === 0 ? (
          // No Blog Posts Found
          <div className="text-center my-16 p-8 rounded-lg bg-white shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M8 12h8M8 16h4"
              />
            </svg>
            <p className="text-lg font-medium text-gray-900">
              No blog posts found
            </p>
            <p className="mt-2 text-gray-600">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Check back later for new content"}
            </p>
          </div>
        ) : (
          // Blog Post Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogPosts.map((post) => (
              <BlogCard key={post.id} blog={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
