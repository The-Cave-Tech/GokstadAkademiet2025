"use client";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import { uploadImageToStrapi } from "./imageUploadHandler";
import { MouseEvent } from "react";

interface ProjectEventEditorProps {
  content: string;
  onChange: (html: string) => void;
  type?: "project" | "event";
  editable?: boolean;
}

const ProjectEventEditor = ({
  content,
  onChange,
  type = "project",
  editable = true,
}: ProjectEventEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({
        placeholder:
          type === "project"
            ? "Create your project content here..."
            : "Create your event details here...",
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // If we're just displaying content (not editing)
  if (!editable) {
    return (
      <div className="prose max-w-none">
        <EditorContent editor={editor} />
      </div>
    );
  }

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        try {
          const imageUrl = await uploadImageToStrapi(file);
          editor?.chain().focus().setImage({ src: imageUrl }).run();
        } catch (error) {
          console.error("Failed to upload image:", error);
          alert("Image upload failed. Please try again.");
        }
      }
    };
    input.click();
  };

  // Layout section buttons for quick layout templates
  const insertTwoColumnLayout = () => {
    editor
      ?.chain()
      .focus()
      .insertContent(
        `
      <div class="flex flex-col md:flex-row gap-4 my-4">
        <div class="w-full md:w-1/2 p-4 border border-gray-200 rounded">
          <p>First column content here...</p>
        </div>
        <div class="w-full md:w-1/2 p-4 border border-gray-200 rounded">
          <p>Second column content here...</p>
        </div>
      </div>
    `
      )
      .run();
  };

  const insertFeaturedImageSection = () => {
    editor
      ?.chain()
      .focus()
      .insertContent(
        `
      <div class="my-6">
        <div class="rounded overflow-hidden mb-4 bg-gray-100 h-64 flex items-center justify-center">
          <p class="text-gray-500">Click to insert featured image</p>
        </div>
        <h3>Section Heading</h3>
        <p>Add your description here...</p>
      </div>
    `
      )
      .run();
  };

  const insertEventDetailsSection = () => {
    editor
      ?.chain()
      .focus()
      .insertContent(
        `
      <div class="my-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3>Event Details</h3>
        <ul>
          <li><strong>Date:</strong> [Add date]</li>
          <li><strong>Time:</strong> [Add time]</li>
          <li><strong>Location:</strong> [Add location]</li>
          <li><strong>Registration:</strong> [Add link or info]</li>
        </ul>
      </div>
    `
      )
      .run();
  };

  // Editing mode with enhanced toolbar
  return (
    <div className="border border-gray-300 rounded-md">
      {editor && (
        <>
          {/* Text Formatting Toolbar */}
          <div className="flex flex-wrap gap-2 p-2 border-b border-gray-300 bg-gray-50">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1 rounded ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
              title="Bold"
            >
              Bold
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1 rounded ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
              title="Italic"
            >
              Italic
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-1 rounded ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}`}
              title="H2"
            >
              H2
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-1 rounded ${editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""}`}
              title="H3"
            >
              H3
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1 rounded ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
              title="Bullet List"
            >
              List
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1 rounded ${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}
              title="Numbered List"
            >
              Numbered
            </button>
            <button
              onClick={() => {
                const url = window.prompt("URL");
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }}
              className={`p-1 rounded ${editor.isActive("link") ? "bg-gray-200" : ""}`}
              title="Link"
            >
              Link
            </button>
            <button
              onClick={handleImageUpload}
              className="p-1 rounded"
              title="Image"
            >
              Image
            </button>
          </div>

          {/* Layout Templates Toolbar */}
          <div className="flex flex-wrap gap-2 p-2 border-b border-gray-300 bg-gray-100">
            <span className="text-sm font-medium">Layout Templates:</span>
            <button
              onClick={insertTwoColumnLayout}
              className="p-1 rounded bg-white border border-gray-300"
              title="Two Column Layout"
            >
              Two Columns
            </button>
            <button
              onClick={insertFeaturedImageSection}
              className="p-1 rounded bg-white border border-gray-300"
              title="Featured Image Section"
            >
              Image + Text
            </button>
            {type === "event" && (
              <button
                onClick={insertEventDetailsSection}
                className="p-1 rounded bg-white border border-gray-300"
                title="Event Details Block"
              >
                Event Details
              </button>
            )}
          </div>
        </>
      )}
      <EditorContent editor={editor} className="p-4 min-h-[400px]" />
    </div>
  );
};

export default ProjectEventEditor;
