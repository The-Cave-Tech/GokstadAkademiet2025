// utils/imageUploadHandler.ts
import { Editor } from "@tiptap/react";

/**
 * Uploads an image to Strapi and returns the URL
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The URL of the uploaded image
 */
export async function uploadImageToStrapi(file: File): Promise<string> {
  try {
    // Create a FormData instance
    const formData = new FormData();
    formData.append("files", file);

    // Upload to Strapi
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();

    // Return the URL of the uploaded image
    return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${data[0].url}`;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

/**
 * Example of how to use the upload handler in a component
 */
export function useImageUpload(editor: Editor | null) {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Show loading indicator
      const imageUrl = await uploadImageToStrapi(file);

      // Insert the image into the editor
      if (editor) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
    } catch (error) {
      alert("Failed to upload image. Please try again.");
    }
  };

  return { handleImageUpload };
}
