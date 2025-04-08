// dashboard/projects/create/page.tsx
import { redirect } from "next/navigation";
import ProjectForm from "@/components/dashboard/projects/ProjectForm";

export default function CreateProjectPage() {
  // Server action for form submission
  async function createProject(formData: FormData) {
    "use server";

    try {
      // Extract form data
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const layout = formData.get("layout") as string;

      // Prepare data for Strapi
      const jsonData = {
        data: {
          title,
          description,
          layout,
          // Add other fields as needed based on layout
        },
      };

      // Send to API
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

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      // Redirect on success
      redirect("/dashboard/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>

      <ProjectForm action={createProject} cancelHref="/dashboard/projects" />
    </div>
  );
}
