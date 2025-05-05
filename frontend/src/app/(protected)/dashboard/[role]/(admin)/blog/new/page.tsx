"use client";

import React from "react";
import ContentForm from "@/components/dashboard/contentManager/ContentForm";
import { blogService } from "@/lib/data/services/blogService";
import { useRouter } from "next/navigation";

const colors = {
  primary: "rgb(121, 85, 72)", // Brown
  background: "rgb(245, 241, 237)", // Light beige
  surface: "rgb(255, 253, 250)", // Creamy white
  text: {
    primary: "rgb(62, 39, 35)", // Dark brown text
    secondary: "rgb(97, 79, 75)", // Medium brown text
  },
};

const NewBlogPostPage = () => {
  const router = useRouter();

  const handleSave = async (data: any, image?: File | null) => {
    try {
      await blogService.create(data, image);
      router.push("/dashboard/admin/blog"); // Redirect to user's blog list after successful creation
    } catch (error) {
      console.error("Error creating blog post:", error);
      // Handle error (could add error state and display an error message)
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/blog");
  };

  return (
    <div
      className="min-h-screen p-6 sm:p-8 md:p-10"
      style={{ backgroundColor: colors.background }}
    >
      <div
        className="max-w-4xl mx-auto rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: colors.surface }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 sm:px-8 sm:py-6"
          style={{ backgroundColor: colors.primary, color: "white" }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold">
            Create New Blog Post
          </h1>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8">
          <ContentForm
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={false}
            config={{
              type: "blog",
              fields: [
                { name: "title", label: "Title", type: "text", required: true },
                {
                  name: "summary",
                  label: "Summary",
                  type: "textarea",
                  required: true,
                },
                {
                  name: "category",
                  label: "Category",
                  type: "select",
                  options: [
                    "Technology",
                    "Events",
                    "News",
                    "Tutorial",
                    "Opinion",
                    "Other",
                  ],
                  required: true,
                },
                { name: "tags", label: "Tags (comma separated)", type: "text" },
                {
                  name: "state", // Changed from status to state
                  label: "State",
                  type: "select",
                  options: ["draft", "published"],
                  required: true,
                },
                {
                  name: "content",
                  label: "Content",
                  type: "editor",
                  required: true,
                },
              ],
              getImageUrl: blogService.getMediaUrl,
              imageName: "Blog Cover Image",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NewBlogPostPage;
