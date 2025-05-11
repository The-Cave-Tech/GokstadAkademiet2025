"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { UniversalCard } from "@/components/dashboard/contentManager/ContentCard";
import { blogService } from "@/lib/data/services/blogService";
import { adaptBlogToCardProps } from "@/lib/adapters/cardAdapter";
import { BlogResponse } from "@/types/content.types";

export default function BlogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogResponse[]>([]);
  const [filteredBlogPosts, setFilteredBlogPosts] = useState<BlogResponse[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filter, setFilter] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch blog posts on component mount
  useEffect(() => {
    loadBlogPosts();
  }, []);

  // Apply filters when posts, search, or filter changes
  useEffect(() => {
    applyFilters();
  }, [blogPosts, searchQuery, filter]);

  // Load blog posts from API using the collection approach
  const loadBlogPosts = async () => {
    setIsLoading(true);
    try {
      const data = await blogService.getAll({
        sort: ["createdAt:desc"],
        populate: ["blogImage", "author"],
      });

      console.log(`Found ${data.length} blog posts`);

      setBlogPosts(data);
      setFilteredBlogPosts(data); // Initially show all posts

      // Extract categories for filter dropdown
      const uniqueCategories = Array.from(
        new Set(
          data.filter((post) => post.category).map((post) => post.category)
        )
      ) as string[];
      setCategories(uniqueCategories);

      setError(null);
    } catch (err) {
      console.error("Error in loadBlogPosts:", err);
      setError("An error occurred while loading blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters to blog posts
  const applyFilters = () => {
    if (!blogPosts || blogPosts.length === 0) {
      return;
    }

    let filtered = [...blogPosts];

    // Only show published posts if state is available
    // filtered = filtered.filter(post => post.state === "published");

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          (post.title && post.title.toLowerCase().includes(query)) ||
          (post.summary && post.summary.toLowerCase().includes(query)) ||
          (post.content &&
            typeof post.content === "string" &&
            post.content.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filter) {
      filtered = filtered.filter((post) => post.category === filter);
    }

    setFilteredBlogPosts(filtered);
  };

  // Handle blog post click
  const handleBlogClick = (id: number) => {
    router.push(`/blog/${id}`);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setFilter(null);
  };

  // Render content based on loading/error state
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner size="medium" />;
    }

    if (error) {
      return (
        <div className="text-center py-10 text-red-600">
          <p className="text-xl font-medium">{error}</p>
          <p className="mt-2">Prøv å laste siden på nytt.</p>
        </div>
      );
    }

    if (!filteredBlogPosts || filteredBlogPosts.length === 0) {
      return (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-700">
            Ingen blogginnlegg funnet
          </h3>
          <p className="mt-2 text-gray-500">Prøv å justere søk eller filter</p>
          {(searchQuery || filter) && (
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Fjern filtre
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogPosts.map((post) => {
          try {
            const cardProps = adaptBlogToCardProps(post, handleBlogClick);
            return <UniversalCard key={post.id} {...cardProps} />;
          } catch (error) {
            console.error(`Error rendering post ${post.id}:`, error);
            return (
              <div
                key={post.id}
                className="p-4 border rounded-md bg-red-50 text-red-500"
              >
                Feil ved visning av innlegg: {post.title}
              </div>
            );
          }
        })}
      </div>
    );
  };

  // Main render
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-3xl font-bold">Blogg</h1>

            <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
              <span className="text-gray-500 self-center">
                {filteredBlogPosts.length}{" "}
                {filteredBlogPosts.length === 1 ? "innlegg" : "innlegg"} funnet
              </span>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
            <input
              type="text"
              placeholder="Søk i blogginnlegg..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter || ""}
              onChange={(e) =>
                setFilter(e.target.value === "" ? null : e.target.value)
              }
            >
              <option value="">Alle kategorier</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {(searchQuery || filter) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Nullstill
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
}
