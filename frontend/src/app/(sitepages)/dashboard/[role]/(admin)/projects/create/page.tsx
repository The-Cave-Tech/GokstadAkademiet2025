// dashboard/projects/create/page.tsx
import { redirect } from "next/navigation";
import ProjectForm from "@/components/dashboard/projects/ProjectForm";

export default function CreateProjectPage() {
  // Server action for form submission
  async function createProject(formData: FormData) {
    "use server";

    try {
      // Get basic fields
      const title = formData.get("title");
      const description = formData.get("description");

      // Prepare layouts array based on the selected layout type
      const layoutType = formData.get("layoutType");
      let layouts = [];

      if (layoutType === "full-width") {
        layouts.push({
          __component: "layouts.full-width",
          content: formData.get("content"),
        });
      } else if (layoutType === "two-columns") {
        layouts.push({
          __component: "layouts.two-columns",
          leftColumnTitle: formData.get("leftColumnTitle"),
          leftColumnContent: formData.get("leftColumnContent"),
          rightColumnTitle: formData.get("rightColumnTitle"),
          rightColumnContent: formData.get("rightColumnContent"),
        });
      } else if (layoutType === "image-text") {
        layouts.push({
          __component: "layouts.image-text",
          text: formData.get("textContent"),
          mediaPosition: formData.get("imagePosition"),
        });
      }

      // Create the complete request body
      const jsonData = {
        data: {
          title,
          description,
          layouts,
        },
      };

      console.log("Sending to Strapi:", JSON.stringify(jsonData));

      // Send to Strapi
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        }
      );

      // Handle response
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Strapi error response:", errorData);
        throw new Error(`Failed to create project: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in createProject action:", error);
      throw error;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>

      <ProjectForm
        action={createProject}
        cancelHref="/dashboard/admin/projects"
      />
    </div>
  );
}
