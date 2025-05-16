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

  // Helper function to get badge colors
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

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card
      className={`relative ${hoverEffect ? "hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1" : ""} ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={handleCardClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      aria-label={onClick ? `View details of ${title}` : undefined}
    >
      {/* Corner Element */}
      {cornerElement && (
        <div className="absolute top-0 left-0 z-10">{cornerElement}</div>
      )}

      {/* Image Section */}
      {image && (
        <div
          className={`${sizeStyle.imageHeight} relative overflow-hidden rounded-t-lg`}
        >
          {image.src ? (
            <>
              <Image
                src={image.src}
                alt={image.alt || title}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              {/* Overlay for Date */}
              {image.overlay && (
                <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-sm p-2">
                  {image.overlay}
                </div>
              )}
            </>
          ) : image.fallbackLetter ? (
            <div className="flex items-center justify-center bg-gray-200 text-gray-700 text-3xl font-bold">
              {title.charAt(0).toUpperCase()}
            </div>
          ) : null}
        </div>
      )}

      <CardBody className="p-4">
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
                {tag.icon && <span>{tag.icon}</span>}
                {tag.prefix && <span>{tag.prefix}</span>}
                {tag.text}
              </span>
            ))}
          </div>
        )}
      </CardBody>

      {/* Footer */}
      {(details.length > 0 || actionButton) && (
        <CardFooter className="p-4 border-t border-gray-200">
          {/* Details */}
          {details.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {details.map((detail, index) => (
                <div key={index} className="flex items-center">
                  {detail.icon && <span className="mr-2">{detail.icon}</span>}
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
            >
              {actionButton.text}
            </button>
          )}
        </CardFooter>
      )}

      {/* Footer Slot */}
      {footerSlot}
    </Card>
  );
};
