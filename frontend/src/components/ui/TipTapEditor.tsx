"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { useState, useEffect } from "react";

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onImageUpload?: (file: File) => Promise<string>; // Function to handle image upload
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({
  value,
  onChange,
  placeholder = "Skriv innhold her...",
  disabled = false,
  onImageUpload,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.extend({
        addAttributes() {
          return {
            src: { default: null },
            alt: { default: null },
            width: { default: "100px" }, // Default width for images
            height: { default: "auto" },
          };
        },
        renderHTML({ HTMLAttributes }) {
          return [
            "img",
            {
              ...HTMLAttributes,
              style: `width: ${HTMLAttributes.width}; height: ${HTMLAttributes.height};`,
            },
          ];
        },
      }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && onImageUpload) {
      try {
        const imageUrl = await onImageUpload(file); // Upload the image and get the URL

        // Determine the current text alignment
        const currentAlignment =
          editor?.getAttributes("paragraph").textAlign || "left";

        // Map alignment to styles
        const alignmentStyle =
          currentAlignment === "center"
            ? "display: block; margin: 0 auto;"
            : currentAlignment === "right"
              ? "float: right;"
              : "float: left;";

        // Insert the image with the alignment style
        editor
          ?.chain()
          .focus()
          .setImage({ src: imageUrl, width: "100px", style: alignmentStyle })
          .run();
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
  };

  if (!mounted) {
    return <div className="border rounded min-h-[300px] bg-gray-50" />;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 p-2 border-b flex flex-wrap gap-2">
        {/* Bold */}
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={
            !editor?.can().chain().focus().toggleBold().run() || disabled
          }
          className={`p-1 rounded hover:bg-gray-200 ${
            editor?.isActive("bold") ? "bg-gray-200" : ""
          }`}
          title="Fet"
        >
          <b>B</b>
        </button>

        {/* Italic */}
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={
            !editor?.can().chain().focus().toggleItalic().run() || disabled
          }
          className={`p-1 rounded hover:bg-gray-200 ${
            editor?.isActive("italic") ? "bg-gray-200" : ""
          }`}
          title="Kursiv"
        >
          <i>I</i>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Image Alignment */}
        <button
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .updateAttributes("image", { style: "float: left;" })
              .run()
          }
          disabled={disabled}
          className="p-1 rounded hover:bg-gray-200"
          title="Venstrejuster bilde"
        >
          Left
        </button>

        <button
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .updateAttributes("image", {
                style: "display: block; margin: 0 auto;",
              })
              .run()
          }
          disabled={disabled}
          className="p-1 rounded hover:bg-gray-200"
          title="Midtstill bilde"
        >
          Center
        </button>

        <button
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .updateAttributes("image", { style: "float: right;" })
              .run()
          }
          disabled={disabled}
          className="p-1 rounded hover:bg-gray-200"
          title="Høyrejuster bilde"
        >
          Right
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Headings */}
        <button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={disabled}
          className={`p-1 rounded hover:bg-gray-200 ${
            editor?.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
          }`}
          title="Overskrift 2"
        >
          H2
        </button>

        <button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          disabled={disabled}
          className={`p-1 rounded hover:bg-gray-200 ${
            editor?.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
          }`}
          title="Overskrift 3"
        >
          H3
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Lists */}
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={`p-1 rounded hover:bg-gray-200 ${
            editor?.isActive("bulletList") ? "bg-gray-200" : ""
          }`}
          title="Punktliste"
        >
          •
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={`p-1 rounded hover:bg-gray-200 ${
            editor?.isActive("orderedList") ? "bg-gray-200" : ""
          }`}
          title="Nummerert liste"
        >
          1.
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Link */}
        <button
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) {
              editor?.chain().focus().setLink({ href: url }).run();
            }
          }}
          disabled={disabled}
          className={`p-1 rounded hover:bg-gray-200 ${
            editor?.isActive("link") ? "bg-gray-200" : ""
          }`}
          title="Legg til lenke"
        >
          🔗
        </button>

        {/* Image Upload */}
        <label
          htmlFor="image-upload"
          className="p-1 rounded hover:bg-gray-200 cursor-pointer"
          title="Last opp bilde"
        >
          🖼️
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={disabled}
          />
        </label>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Text alignment */}
        <button
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          disabled={disabled}
          className={`p-1 rounded hover:bg-gray-200 ${
            editor?.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
          }`}
          title="Venstrejuster"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
            <line
              x1="17"
              y1="10"
              x2="3"
              y2="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="21"
              y1="6"
              x2="3"
              y2="6"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="21"
              y1="14"
              x2="3"
              y2="14"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="17"
              y1="18"
              x2="3"
              y2="18"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>

        <button
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          disabled={disabled}
          className={`p-1 rounded hover:bg-gray-200 ${
            editor?.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
          }`}
          title="Midtstill"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
            <line
              x1="18"
              y1="10"
              x2="6"
              y2="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="21"
              y1="6"
              x2="3"
              y2="6"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="21"
              y1="14"
              x2="3"
              y2="14"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="18"
              y1="18"
              x2="6"
              y2="18"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>

        <button
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          disabled={disabled}
          className={`p-1 rounded hover:bg-gray-200 ${
            editor?.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
          }`}
          title="Høyrejuster"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
            <line
              x1="21"
              y1="10"
              x2="7"
              y2="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="21"
              y1="6"
              x2="3"
              y2="6"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="21"
              y1="14"
              x2="3"
              y2="14"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="21"
              y1="18"
              x2="7"
              y2="18"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[300px]"
      />
    </div>
  );
};

export default TipTapEditor;
