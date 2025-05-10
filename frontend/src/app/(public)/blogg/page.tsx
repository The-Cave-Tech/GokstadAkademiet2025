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

      console.log("Successfully fetched blog posts:", data);

      // Log post count to check if we have posts
      if (data && data.length > 0) {
        console.log(`Found ${data.length} blog posts`);

        // Dump first post for debugging
        console.log("First post details:", JSON.stringify(data[0], null, 2));
      } else {
        console.log("No blog posts returned from API");
      }

      setBlogPosts(data);
      setFilteredBlogPosts(data); // Initially show all posts
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
      console.log("No blog posts to filter");
      return;
    }

    console.log(`Filtering ${blogPosts.length} blog posts...`);
    let filtered = [...blogPosts];

    // For debugging, don't filter by state initially
    // so we can see if there are any posts at all
    // filtered = filtered.filter(post => post.state === "published");
    console.log(`After published filter: ${filtered.length} posts`);

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          (post.title && post.title.toLowerCase().includes(query)) ||
          (post.summary && post.summary.toLowerCase().includes(query)) ||
          (post.content && post.content.toLowerCase().includes(query))
      );
      console.log(`After search filter: ${filtered.length} posts`);
    }

    // Apply category filter
    if (filter) {
      filtered = filtered.filter((post) => post.category === filter);
      console.log(`After category filter: ${filtered.length} posts`);
    }

    console.log(`Setting ${filtered.length} filtered posts`);
    setFilteredBlogPosts(filtered);
  };

  // Handle blog post click
  const handleBlogClick = (id: number) => {
    router.push(`/blog/${id}`);
  };

  // Get unique categories
  const getCategories = () => {
    if (!blogPosts || blogPosts.length === 0) return [];

    const categories = new Set<string>();
    blogPosts.forEach((post) => {
      if (post.category) {
        categories.add(post.category);
      }
    });
    return Array.from(categories);
  };

  // Render content based on loading/error state
  const renderContent = () => {
    console.log("Rendering content with:", {
      isLoading,
      error,
      filteredPostsLength: filteredBlogPosts?.length || 0,
    });

    if (isLoading) {
      return <LoadingSpinner size="medium" />;
    }

    if (error) {
      return (
        <div className="text-center py-10 text-red-600">
          <p className="text-xl font-medium">{error}</p>
          <p className="mt-2">Try refreshing the page.</p>
        </div>
      );
    }

    if (!filteredBlogPosts || filteredBlogPosts.length === 0) {
      return (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-700">
            No blog posts found
          </h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search or filter
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogPosts.map((post) => {
          console.log(`Rendering post ID: ${post.id}, Title: ${post.title}`);

          try {
            const cardProps = adaptBlogToCardProps(post, handleBlogClick);
            console.log("Card props:", cardProps);

            return <UniversalCard key={post.id} {...cardProps} />;
          } catch (error) {
            console.error(`Error rendering post ${post.id}:`, error);
            return (
              <div
                key={post.id}
                className="p-4 border rounded-md bg-red-50 text-red-500"
              >
                Error rendering post: {post.title}
              </div>
            );
          }
        })}
      </div>
    );
  };

  // Main render
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search blog posts..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={filter || ""}
            onChange={(e) =>
              setFilter(e.target.value === "" ? null : e.target.value)
            }
          >
            <option value="">All Categories</option>
            {getCategories().map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}
