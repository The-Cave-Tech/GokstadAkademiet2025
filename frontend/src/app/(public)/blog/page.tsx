"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { UniversalCard } from "@/components/dashboard/contentManager/ContentCard";
import { blogService } from "@/lib/data/services/blogService";
import { adaptBlogToCardProps } from "@/lib/adapters/cardAdapter";
import { BlogResponse } from "@/types/content.types";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { SortDropdown, SortOption } from "@/components/ui/SortDropdown";

// Define sort options for blog
const BLOG_SORT_OPTIONS: SortOption[] = [
  { value: "newest", label: "Nyeste først" },
  { value: "oldest", label: "Eldste først" },
  { value: "alphabetical", label: "A til Å" },
  { value: "reverseAlphabetical", label: "Å til A" },
];

export default function BlogPage() {
  const router = useRouter();

  // State variables
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogResponse[]>([]);
  const [filteredBlogPosts, setFilteredBlogPosts] = useState<BlogResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filter, setFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<string>("newest"); // Default sort by newest
  const [categories, setCategories] = useState<string[]>([]);
  const [announceFilterChange, setAnnounceFilterChange] = useState<string | null>(null);

  // Fetch blog posts on component mount
  useEffect(() => {
    loadBlogPosts();
  }, []);

  // Apply filters and sorting when posts, search query, filter, or sort changes
  useEffect(() => {
    applyFiltersAndSort();
  }, [blogPosts, searchQuery, filter, sort]);

  // Create announcement for screen readers when filters change
  useEffect(() => {
    if (filteredBlogPosts.length > 0) {
      setAnnounceFilterChange(`Showing ${filteredBlogPosts.length} blog posts`);
    } else if (filteredBlogPosts.length === 0 && !isLoading) {
      setAnnounceFilterChange("No blog posts match your current filters.");
    }
  }, [filteredBlogPosts, isLoading]);

  // Fetch blog posts from the API
  const loadBlogPosts = async () => {
    setIsLoading(true);
    try {
      const data = await blogService.getAll({
        sort: ["createdAt:desc"],
        populate: ["blogImage", "author"],
      });

      setBlogPosts(data);
      setFilteredBlogPosts(data); // Initially show all posts

      // Extract unique categories for the filter dropdown
      const uniqueCategories = Array.from(new Set(data.map((post) => post.category).filter(Boolean))) as string[];
      setCategories(uniqueCategories);

      setError(null);
    } catch (err) {
      console.error("Error loading blog posts:", err);
      setError("An error occurred while loading blog posts.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to sort blog posts
  const sortBlogPosts = (posts: BlogResponse[], sortOption: string): BlogResponse[] => {
    const sortedPosts = [...posts];

    switch (sortOption) {
      case "newest":
        return sortedPosts.sort((a, b) => {
          const dateA = a.publishedAt || a.createdAt || "";
          const dateB = b.publishedAt || b.createdAt || "";
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
      case "oldest":
        return sortedPosts.sort((a, b) => {
          const dateA = a.publishedAt || a.createdAt || "";
          const dateB = b.publishedAt || b.createdAt || "";
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        });
      case "alphabetical":
        return sortedPosts.sort((a, b) => a.title.localeCompare(b.title));
      case "reverseAlphabetical":
        return sortedPosts.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sortedPosts;
    }
  };

  // Apply filters and sort
  const applyFiltersAndSort = () => {
    if (!blogPosts || blogPosts.length === 0) return;

    let filtered = [...blogPosts];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title?.toLowerCase().includes(query) ||
          post.summary?.toLowerCase().includes(query) ||
          (typeof post.content === "string" && post.content.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filter) {
      filtered = filtered.filter((post) => post.category === filter);
    }

    // Apply sorting
    filtered = sortBlogPosts(filtered, sort);

    setFilteredBlogPosts(filtered);
  };

  // Handle blog post click
  const handleBlogClick = (id: number) => {
    router.push(`/blog/${id}`);
  };

  // Clear search, category filters and reset sort
  const clearFilters = () => {
    setSearchQuery("");
    setFilter(null);
    setSort("newest"); // Reset to default sort
  };

  // Render content based on loading, error, or filtered results
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner size="medium" />;
    }

    if (error) {
      return (
        <div className="text-center py-10 text-red-600" role="alert">
          <p className="text-xl font-medium">{error}</p>
          <p className="mt-2">Please try reloading the page.</p>
        </div>
      );
    }

    if (!filteredBlogPosts || filteredBlogPosts.length === 0) {
      return (
        <div className="text-center py-10" role="status">
          <h2 className="text-xl font-medium text-gray-700">No blog posts found</h2>
          <p className="mt-2 text-gray-500">Try adjusting your search or filter.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Clear all filters"
          >
            Clear filters
          </button>
        </div>
      );
    }

    return (
      <section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        role="feed"
        aria-busy={isLoading}
        aria-label="Blog posts grid"
      >
        {filteredBlogPosts.map((post) => {
          try {
            const cardProps = adaptBlogToCardProps(post, handleBlogClick);
            return <UniversalCard key={post.id} {...cardProps} />;
          } catch (error) {
            console.error(`Error rendering post ${post.id}:`, error);
            return (
              <div key={post.id} className="p-4 border rounded-md bg-red-50 text-red-500" role="alert">
                Error displaying post: {post.title}
              </div>
            );
          }
        })}
      </section>
    );
  };

  // Main render
  return (
    <main className="bg-white min-h-screen">
      {/* Skip navigation link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:border focus:border-blue-500 focus:text-blue-600 focus:rounded"
      >
        Skip to main content
      </a>

      <section className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-10">Blog</h1>

          {/* Search, Filter, and Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search blog posts..."
              className="flex-grow"
              ariaLabel="Search blog posts"
            />

            <FilterDropdown
              filter={filter || ""}
              setFilter={(value) => setFilter(value === "" ? null : value)}
              options={[
                { value: "", label: "All Categories" },
                ...categories.map((category) => ({
                  value: category,
                  label: category,
                })),
              ]}
              ariaLabel="Filter by category"
            />

            <SortDropdown
              sort={sort}
              setSort={setSort}
              options={BLOG_SORT_OPTIONS}
              ariaLabel="Sort blog posts"
              placeholder="Sort by"
            />
          </div>

          {/* Live region for announcing filter changes to screen readers */}
          <div className="sr-only" aria-live="polite" role="status">
            {announceFilterChange}
          </div>
        </header>

        {/* Main content */}
        <section>
          <div>{renderContent()}</div>
        </section>
      </section>
    </main>
  );
}
