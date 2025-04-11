"use client";
import React from "react";
import { ContentBlock } from "@/types/eventTypes";

interface RichTextRendererProps {
  content: ContentBlock[] | string;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content }) => {
  if (!content) return null;

  // If content is a string (HTML or markdown content)
  if (typeof content === "string") {
    return (
      <div
        className="rich-text-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // If content is an array of blocks (Strapi's format)
  return (
    <div className="rich-text-content">
      {content.map((block, blockIndex) => {
        // Handle different block types
        switch (block.type) {
          case "paragraph":
            return (
              <p key={blockIndex} className="mb-4">
                {block.children.map((child, childIndex) => (
                  <React.Fragment key={childIndex}>{child.text}</React.Fragment>
                ))}
              </p>
            );
          case "heading":
            return (
              <h2 key={blockIndex} className="text-2xl font-bold mb-4">
                {block.children.map((child, childIndex) => (
                  <React.Fragment key={childIndex}>{child.text}</React.Fragment>
                ))}
              </h2>
            );
          case "list":
            return (
              <ul key={blockIndex} className="list-disc pl-5 mb-4">
                {block.children.map((child, childIndex) => (
                  <li key={childIndex}>{child.text}</li>
                ))}
              </ul>
            );
          default:
            return (
              <div key={blockIndex}>
                {block.children.map((child, childIndex) => (
                  <React.Fragment key={childIndex}>{child.text}</React.Fragment>
                ))}
              </div>
            );
        }
      })}
    </div>
  );
};

export default RichTextRenderer;
