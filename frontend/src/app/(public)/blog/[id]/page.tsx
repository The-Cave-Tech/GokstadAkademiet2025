"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { blogService } from "@/lib/data/services/blogService";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { BlogResponse } from "@/types/content.types";
import { MdCategory, MdDateRange } from "react-icons/md";
import BackButton from "@/components/BackButton";
import ReactMarkdown from "react-markdown";

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [blogPost, setBlogPost] = useState<BlogResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogResponse[]>([]);

  // Get the ID from params
  const blogId = params.id as string;

  useEffect(() => {
    async function fetchBlogDetails() {
      if (!blogId) return;

      setIsLoading(true);
      setError(null);

      try {
        // First get all blog posts
        const allPosts = await blogService.getAll({
          populate: ["blogImage", "author"],
          sort: ["createdAt:desc"],
        });

        // Find the specific post from the collection
        const numericId = parseInt(blogId, 10);
        const foundPost = allPosts.find((p) => p.id === numericId);

        if (!foundPost) {
          throw new Error(`Blog post with ID ${blogId} not found`);
        }

        setBlogPost(foundPost);

        // Find related posts (same category, excluding current post)
        if (foundPost.category) {
          const related = allPosts
            .filter((p) => p.category === foundPost.category && p.id !== foundPost.id)
            .slice(0, 3); // Limit to 3 related posts
          setRelatedPosts(related);
        }
      } catch (err) {
        console.error("Error fetching blog post details:", err);
        setError("Could not load blog post details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogDetails();
  }, [blogId]);

  // Handle related post click
  const handleRelatedPostClick = (id: number) => {
    router.push(`/blog/${id}`);
  };

  // Format date for better accessibility
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("nb-NO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get machine-readable ISO date for datetime attribute
  const getISODate = (dateString: string): string => {
    if (!dateString) return "";
    return new Date(dateString).toISOString();
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!blogPost) return <ErrorMessage message="Blog post not found" />;

  return (
    <main className="bg-white min-h-screen">
      {/* Skip navigation link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:border focus:border-blue-500 focus:text-blue-600 focus:rounded"
      >
        Skip to main content
      </a>

      {/* Header/Banner Image */}
      <div className="w-full h-64 relative bg-gray-200 mt-4" role="banner">
        {blogPost.blogImage?.url ? (
          <Image
            src={blogPost.blogImage.url}
            alt={`Banner image for blog post: ${blogPost.title}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
            <h1 className="text-3xl font-bold text-gray-700">{blogPost.title}</h1>
          </div>
        )}
      </div>

      {/* Back button */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <BackButton />
        <span id="back-to-blog" className="sr-only">
          Back to blog listing
        </span>
      </div>

      {/* Main Content Container */}
      <section className="max-w-6xl mx-auto px-4 py-8" id="main-content">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <aside className="md:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              {/* Blog Post Info */}
              <div className="mt-6">
                <h2 className="font-medium text-gray-700 mb-2">Blog Post Information</h2>
                <dl>
                  <div className="flex items-center gap-2 mb-2">
                    <dt className="sr-only">Category</dt>
                    <MdCategory className="text-gray-500" aria-hidden="true" />
                    <dd>{blogPost.category || "Uncategorized"}</dd>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <dt className="sr-only">Publication Date</dt>
                    <MdDateRange className="text-gray-500" aria-hidden="true" />
                    <dd>
                      <time dateTime={getISODate(blogPost.publishedAt || blogPost.createdAt || "")}>
                        {formatDate(blogPost.publishedAt || blogPost.createdAt || "")}
                      </time>
                    </dd>
                  </div>
                </dl>

                {blogPost.tags && blogPost.tags.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-gray-700 mb-1">Tags:</h3>
                    <ul className="flex flex-wrap gap-2 mt-1" aria-label="Post tags">
                      {Array.isArray(blogPost.tags) &&
                        blogPost.tags.map((tag, index) => (
                          <li key={index} className="px-2 py-1 bg-gray-100 text-xs rounded-md text-gray-700">
                            #{tag}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Social Sharing Links */}
              <div className="mt-8 space-y-3">
                <h3 className="font-medium text-gray-700 mb-2">Share this post</h3>
                <div className="flex gap-4" role="group" aria-label="Share on social media">
                  <button
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Share on Facebook"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </button>
                  <button
                    className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Share on Twitter"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </button>
                  <button
                    className="bg-blue-800 text-white p-2 rounded-full hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    aria-label="Share on LinkedIn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Blog Metadata */}
              <footer className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                {blogPost.publishedAt && (
                  <p>
                    Published:{" "}
                    <time dateTime={getISODate(blogPost.publishedAt)}>{formatDate(blogPost.publishedAt)}</time>
                  </p>
                )}
                {blogPost.createdAt && (
                  <p>
                    Created: <time dateTime={getISODate(blogPost.createdAt)}>{formatDate(blogPost.createdAt)}</time>
                  </p>
                )}
                {blogPost.updatedAt && (
                  <p>
                    Last updated:{" "}
                    <time dateTime={getISODate(blogPost.updatedAt)}>{formatDate(blogPost.updatedAt)}</time>
                  </p>
                )}
              </footer>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="md:w-3/4">
            {/* Blog Title and Header */}
            <header className="border-b border-gray-200 pb-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-800">{blogPost.title}</h1>
              <div className="text-sm text-red-500 mt-2 tracking-wider uppercase">
                BLOG • {blogPost.category || "UNCATEGORIZED"} •{" "}
                <time dateTime={getISODate(blogPost.publishedAt || blogPost.createdAt || "")}>
                  {formatDate(blogPost.publishedAt || blogPost.createdAt || "")}
                </time>
              </div>
            </header>

            {/* Blog Summary */}
            {blogPost.summary && (
              <section className="mb-8" aria-label="Summary">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">Summary</h2>
                <p className="text-gray-700 leading-relaxed italic">{blogPost.summary}</p>
              </section>
            )}

            {/* Blog Content */}
            <section className="prose max-w-none" aria-label="Article content">
              {blogPost.content ? (
                <ReactMarkdown>{blogPost.content}</ReactMarkdown>
              ) : (
                <p>No content available for this post.</p>
              )}
            </section>

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
              <section className="mt-12 pt-8 border-t border-gray-200" aria-labelledby="related-posts-heading">
                <h2 id="related-posts-heading" className="text-xl font-semibold text-gray-800 mb-4">
                  Related Posts
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((post) => (
                    <li
                      key={post.id}
                      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleRelatedPostClick(post.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRelatedPostClick(post.id);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Read related post: ${post.title}`}
                    >
                      <div className="h-40 relative bg-gray-200">
                        {post.blogImage?.url ? (
                          <Image src={post.blogImage.url} alt="" fill className="object-cover" aria-hidden="true" />
                        ) : (
                          <div
                            className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-lg"
                            aria-hidden="true"
                          >
                            {post.title.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-800 hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">
                          <time dateTime={getISODate(post.publishedAt || post.createdAt || "")}>
                            {formatDate(post.publishedAt || post.createdAt || "")}
                          </time>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
