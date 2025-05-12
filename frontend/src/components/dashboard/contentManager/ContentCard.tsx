import React from "react";
import Image from "next/image";
import { Theme } from "@/styles/activityTheme";
import { Card, CardBody, CardFooter } from "@/components/ui/Card";
import { UniversalCardProps } from "@/types/universal.content.types";
import { Badge } from "@/types/universal.content.types";

export const UniversalCard: React.FC<UniversalCardProps> = ({
  title,
  description,
  image,
  badges = [],
  tags = [],
  details = [],
  actionButton,
  size = "medium",
  hoverEffect = true,
  onClick,
  className = "",
  headerSlot,
  footerSlot,
  cornerElement,
}) => {
  // Define size styles for different card sizes
  const sizeMap = {
    small: {
      container: "p-3",
      imageHeight: "h-40",
      title: "text-base",
      description: "text-sm",
      badges: "text-xs px-2 py-1",
      tags: "text-xs px-2 py-1",
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
      imageHeight: "h-56",
      title: "text-xl",
      description: "text-base",
      badges: "text-sm px-2.5 py-1.5",
      tags: "text-sm px-2.5 py-1.5",
      details: "text-base",
    },
  };

  const sizeStyle = sizeMap[size];

  // Helper function to get badge colors with contrast check
  const getBadgeColors = (badge: Badge) => {
    if (badge.customColor && badge.customBgColor) {
      return {
        backgroundColor: badge.customBgColor,
        color: badge.customColor,
      };
    }

    // Enhanced contrast colors
    switch (badge.type) {
      case "primary":
        return {
          backgroundColor: `${Theme.colors.primary}15`,
          color: Theme.colors.primary,
        };
      case "success":
        return {
          backgroundColor: "rgb(235, 247, 237)",
          color: "rgb(30, 90, 40)", // Darker green for better contrast
        };
      case "warning":
        return {
          backgroundColor: "rgb(254, 243, 199)",
          color: "rgb(146, 64, 14)", // Darker yellow/amber for better contrast
        };
      case "danger":
        return {
          backgroundColor: "rgb(254, 226, 226)",
          color: "rgb(153, 27, 27)", // Darker red for better contrast
        };
      case "info":
        return {
          backgroundColor: "rgb(219, 234, 254)",
          color: "rgb(30, 64, 175)", // Darker blue for better contrast
        };
      case "neutral":
        return {
          backgroundColor: "rgb(243, 244, 246)",
          color: "rgb(55, 65, 81)", // Darker gray for better contrast
        };
      default:
        return {
          backgroundColor: `${Theme.colors.primary}15`,
          color: Theme.colors.primary,
        };
    }
  };

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Handle keyboard interactions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <section
      className={`relative ${
        hoverEffect ? "hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1" : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      aria-label={onClick ? `View details of ${title}` : undefined}
    >
      {/* Corner Element */}
      {cornerElement && (
        <div className="absolute top-0 left-0 z-10" aria-hidden="true">
          {cornerElement}
        </div>
      )}

      {/* Image Section */}
      {image && (
        <figure className={`${sizeStyle.imageHeight} relative overflow-hidden rounded-t-lg`}>
          {image.src ? (
            <>
              <Image
                src={image.src}
                alt={image.alt || title || "Card image"}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
              {/* Overlay for Date */}
              {image.overlay && (
                <figcaption className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-sm p-2">
                  {image.overlay}
                </figcaption>
              )}
            </>
          ) : image.fallbackLetter ? (
            <div
              className="flex items-center justify-center bg-gray-200 text-gray-700 text-3xl font-bold h-full w-full"
              aria-hidden="true"
            >
              {title.charAt(0).toUpperCase()}
            </div>
          ) : null}
        </figure>
      )}

      <div className="p-4">
        {/* Header Slot */}
        {headerSlot}

        {/* Badges */}
        {badges.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {badges.map((badge, index) => {
              const badgeColors = getBadgeColors(badge);
              return (
                <span
                  key={index}
                  className={`inline-flex items-center gap-1 rounded-md font-medium ${sizeStyle.badges}`}
                  style={badgeColors}
                >
                  {badge.icon && (
                    <span className="mr-1" aria-hidden="true">
                      {badge.icon}
                    </span>
                  )}
                  {badge.text}
                </span>
              );
            })}
          </div>
        )}

        {/* Title */}
        <h2
          className={`${sizeStyle.title} font-semibold mb-2 line-clamp-2`}
          style={{ color: Theme.colors.text.primary }}
        >
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className={`${sizeStyle.description} mb-4 line-clamp-3`} style={{ color: Theme.colors.text.secondary }}>
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`inline-flex items-center gap-1 rounded-full ${sizeStyle.tags}`}
                style={{
                  backgroundColor: tag.customBgColor || Theme.colors.divider,
                  color: tag.customColor || Theme.colors.text.primary,
                }}
              >
                {tag.icon && <span aria-hidden="true">{tag.icon}</span>}
                {tag.prefix && <span>{tag.prefix}</span>}
                {tag.text}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {(details.length > 0 || actionButton) && (
        <footer className="p-4 border-t border-gray-200">
          {/* Details */}
          {details.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {details.map((detail, index) => (
                <div key={index} className="flex items-center">
                  {detail.icon && (
                    <span className="mr-2" aria-hidden="true">
                      {detail.icon}
                    </span>
                  )}
                  <span
                    className={`truncate max-w-xs ${sizeStyle.details}`}
                    style={{ color: Theme.colors.text.secondary }}
                  >
                    {detail.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Action Button */}
          {actionButton && (
            <button
              className="ml-auto text-xs py-1.5 px-3 rounded-full"
              style={{
                backgroundColor: `${Theme.colors.primary}20`,
                color: Theme.colors.primary,
              }}
              onClick={(e) => {
                e.stopPropagation();
                actionButton.onClick?.(e);
              }}
              aria-label={actionButton.text}
            >
              {actionButton.text}
            </button>
          )}
        </footer>
      )}

      {/* Footer Slot */}
      {footerSlot}
    </section>
  );
};
