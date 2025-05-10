import React, { ReactNode } from "react";
import Image from "next/image";
import { Theme } from "@/styles/activityTheme";

// Badge types for universal usage
export interface Badge {
  text: string;
  type?:
    | "primary"
    | "success"
    | "warning"
    | "info"
    | "danger"
    | "neutral"
    | string;
  icon?: ReactNode;
  customColor?: string;
  customBgColor?: string;
}

// Tag types for universal usage
export interface Tag {
  text: string;
  icon?: ReactNode;
  prefix?: string;
  customColor?: string;
  customBgColor?: string;
}

// Detail item (used for metadata like date, location, etc.)
export interface DetailItem {
  text: string;
  icon?: ReactNode;
}

// Universal card props
export interface UniversalCardProps {
  // Core content
  title: string;
  description?: string;

  // Image options
  image?: {
    src: string;
    alt?: string;
    fallbackLetter?: boolean;
    overlay?: ReactNode;
    aspectRatio?: "square" | "video" | "auto" | number;
  };

  // Metadata and decorators
  badges?: Badge[];
  tags?: Tag[];
  details?: DetailItem[];

  // Action elements
  actionButton?: {
    text: string;
    onClick?: (e: React.MouseEvent) => void;
    isProduct?: boolean;
  };

  // Styling and layout
  variant?: "vertical" | "horizontal";
  size?: "small" | "medium" | "large";
  hoverEffect?: boolean;

  // Callback functions
  onClick?: () => void;

  // Additional props
  className?: string;
  headerSlot?: ReactNode;
  footerSlot?: ReactNode;
  cornerElement?: ReactNode;
}

export const UniversalCard: React.FC<UniversalCardProps> = ({
  // Core content
  title,
  description,

  // Image options
  image,

  // Metadata and decorators
  badges = [],
  tags = [],
  details = [],

  // Action elements
  actionButton,

  // Styling and layout
  variant = "vertical",
  size = "medium",
  hoverEffect = true,

  // Callback functions
  onClick,

  // Additional props
  className = "",
  headerSlot,
  footerSlot,
  cornerElement,
}) => {
  // Size mapping for padding, font sizes, etc.
  const sizeMap = {
    small: {
      container: "p-2",
      imageHeight: "h-32",
      title: "text-base",
      description: "text-xs",
      badges: "text-xs px-1.5 py-0.5",
      tags: "text-xs px-1.5 py-0.5",
      details: "text-xs",
    },
    medium: {
      container: "p-4",
      imageHeight: "h-48",
      title: "text-lg",
      description: "text-sm",
      badges: "text-xs px-2 py-1",
      tags: "text-xs px-2 py-1",
      details: "text-sm",
    },
    large: {
      container: "p-5",
      imageHeight: "h-64",
      title: "text-xl",
      description: "text-base",
      badges: "text-sm px-2.5 py-1.5",
      tags: "text-sm px-2.5 py-1.5",
      details: "text-base",
    },
  };

  // Get style settings based on selected size
  const sizeStyle = sizeMap[size];

  // Helper function to get badge background and text colors
  const getBadgeColors = (badge: Badge) => {
    if (badge.customColor && badge.customBgColor) {
      return {
        backgroundColor: badge.customBgColor,
        color: badge.customColor,
      };
    }

    switch (badge.type) {
      case "primary":
        return {
          backgroundColor: `${Theme.colors.primary}15`,
          color: Theme.colors.primary,
        };
      case "success":
        return {
          backgroundColor: "bg-green-100",
          color: "text-green-800",
        };
      case "warning":
        return {
          backgroundColor: "bg-yellow-100",
          color: "text-yellow-800",
        };
      case "danger":
        return {
          backgroundColor: "bg-red-100",
          color: "text-red-800",
        };
      case "info":
        return {
          backgroundColor: "bg-blue-100",
          color: "text-blue-800",
        };
      case "neutral":
        return {
          backgroundColor: "bg-gray-100",
          color: "text-gray-800",
        };
      default:
        return {
          backgroundColor: `${Theme.colors.primary}15`,
          color: Theme.colors.primary,
        };
    }
  };

  // Generate layout classes based on orientation
  const layoutClasses =
    variant === "horizontal" ? "flex flex-col sm:flex-row" : "flex flex-col";

  // Generate hover effect classes if enabled
  const hoverClasses = hoverEffect
    ? "hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    : "";

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Calculate image width classes for horizontal layout
  const imageWidthClasses =
    variant === "horizontal" ? "w-full sm:w-2/5" : "w-full";

  return (
    <article
      className={`relative ${layoutClasses} rounded-lg shadow-md ${hoverClasses} ${onClick ? "cursor-pointer" : ""} overflow-hidden bg-white ${className}`}
      style={{ border: `1px solid ${Theme.colors.divider}` }}
      onClick={handleCardClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      aria-label={onClick ? `View details of ${title}` : undefined}
    >
      {/* Corner Element (like a status indicator) */}
      {cornerElement && (
        <div className="absolute top-0 left-0 z-10">{cornerElement}</div>
      )}

      {/* Image Section */}
      {image && (
        <div
          className={`${imageWidthClasses} ${sizeStyle.imageHeight} relative overflow-hidden`}
        >
          {image.src ? (
            <div className="relative w-full h-full">
              <Image
                src={image.src}
                alt={image.alt || title}
                fill
                sizes={
                  variant === "horizontal"
                    ? "(max-width: 640px) 100vw, 40vw"
                    : "100vw"
                }
                className="object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  // If image fails to load, show first letter fallback if enabled
                  if (image.fallbackLetter) {
                    target.style.display = "none";
                  }
                }}
              />

              {/* Image Overlay (like date indicator) */}
              {image.overlay && (
                <div className="absolute bottom-0 right-0 p-2 bg-black bg-opacity-70 text-white text-xs rounded-tl-md">
                  {image.overlay}
                </div>
              )}
            </div>
          ) : image.fallbackLetter ? (
            // Fallback letter if no image or image fails to load
            <div className="relative w-full h-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
              <div className="text-3xl font-semibold text-blue-500">
                {title.charAt(0).toUpperCase()}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Content Section */}
      <div
        className={`${sizeStyle.container} flex flex-col flex-grow justify-between`}
      >
        {/* Header Section */}
        <div>
          {/* Custom Header Slot */}
          {headerSlot}

          {/* Badges Row */}
          {badges.length > 0 && (
            <div className="mb-3 flex flex-wrap justify-between gap-2">
              {badges.map((badge, index) => {
                const badgeColors = getBadgeColors(badge);
                return (
                  <span
                    key={index}
                    className={`inline-flex items-center gap-1 rounded-md font-medium ${sizeStyle.badges}`}
                    style={badgeColors}
                  >
                    {badge.icon && <span className="mr-1">{badge.icon}</span>}
                    {badge.text}
                  </span>
                );
              })}
            </div>
          )}

          {/* Title */}
          <h3
            className={`${sizeStyle.title} font-semibold mb-2 line-clamp-2`}
            style={{ color: Theme.colors.text.primary }}
          >
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p
              className={`${sizeStyle.description} mb-4 line-clamp-3`}
              style={{ color: Theme.colors.text.secondary }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Tags Section */}
        {tags.length > 0 && (
          <div className="mt-auto mb-3">
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center gap-1 rounded-full ${sizeStyle.tags}`}
                  style={{
                    backgroundColor: tag.customBgColor || Theme.colors.divider,
                    color: tag.customColor || Theme.colors.text.primary,
                  }}
                >
                  {tag.icon && <span>{tag.icon}</span>}
                  {tag.prefix && <span>{tag.prefix}</span>}
                  {tag.text}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Details Section (location, time, etc) */}
        {details.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-y-2 gap-x-4">
              {details.map((detail, index) => (
                <div key={index} className="flex items-center">
                  {detail.icon && (
                    <span className="mr-2 flex-shrink-0">{detail.icon}</span>
                  )}
                  <span
                    className={`truncate max-w-xs ${sizeStyle.details}`}
                    style={{ color: Theme.colors.text.secondary }}
                  >
                    {detail.text}
                  </span>
                </div>
              ))}

              {/* Action Button */}
              {actionButton && (
                <div className="ml-auto flex items-center">
                  <span
                    className={`whitespace-nowrap text-xs py-1.5 px-3 rounded-full`}
                    style={{
                      backgroundColor: `${Theme.colors.primary}20`,
                      color: Theme.colors.primary,
                    }}
                    onClick={(e) => {
                      if (actionButton.onClick) {
                        e.stopPropagation();
                        actionButton.onClick(e);
                      }
                    }}
                  >
                    {actionButton.text}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Slot */}
        {footerSlot}
      </div>
    </article>
  );
};
