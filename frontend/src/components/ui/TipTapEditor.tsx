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
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({
  value,
  onChange,
  placeholder = "Skriv innhold her...",
  disabled = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!mounted) {
    return <div className="border rounded min-h-[300px] bg-gray-50" />;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-50 p-2 border-b flex flex-wrap gap-2">
        {/* Text formatting */}
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
          <svg viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"
            ></path>
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"
            ></path>
          </svg>
        </button>

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
          <svg viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
            <line
              x1="19"
              y1="4"
              x2="10"
              y2="4"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="14"
              y1="20"
              x2="5"
              y2="20"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="15"
              y1="4"
              x2="9"
              y2="20"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
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
          <span className="px-1 font-bold">H2</span>
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
          <span className="px-1 font-bold">H3</span>
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
          <svg viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
            <line
              x1="8"
              y1="6"
              x2="21"
              y2="6"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="8"
              y1="12"
              x2="21"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="8"
              y1="18"
              x2="21"
              y2="18"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="3"
              y1="6"
              x2="3.01"
              y2="6"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="3"
              y1="12"
              x2="3.01"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="3"
              y1="18"
              x2="3.01"
              y2="18"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={`p-1 rounded hover:bg-gray-200 ${
            editor?.isActive("orderedList") ? "bg-gray-200" : ""
          }`}
          title="Nummerert liste"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
            <line
              x1="10"
              y1="6"
              x2="21"
              y2="6"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="10"
              y1="12"
              x2="21"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="10"
              y1="18"
              x2="21"
              y2="18"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M4 6h1v4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path d="M4 10h2" stroke="currentColor" strokeWidth="2" />
            <path
              d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
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
          <svg viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
            <path
              d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
            />
            <path
              d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
            />
          </svg>
        </button>

        {/* Image */}
        <button
          onClick={() => {
            const url = prompt("Enter image URL");
            if (url) {
              editor?.chain().focus().setImage({ src: url }).run();
            }
          }}
          disabled={disabled}
          className="p-1 rounded hover:bg-gray-200"
          title="Legg til bilde"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
              ry="2"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
            />
            <circle
              cx="8.5"
              cy="8.5"
              r="1.5"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
            />
            <polyline
              points="21 15 16 10 5 21"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
            />
          </svg>
        </button>

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

      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[300px]"
      />
    </div>
  );
};

export default TipTapEditor;
