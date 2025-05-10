// lib/adapters/cardAdapters.ts
// This file contains the adapter functions for different content types to convert them into a format suitable for the UniversalCard component.
import { MdCategory, MdLocationOn, MdAccessTime } from "react-icons/md";
import { AiOutlineTool } from "react-icons/ai";
import { FaTag, FaBoxOpen, FaStar } from "react-icons/fa";
import {
  BlogResponse,
  EventResponse,
  ProjectResponse,
} from "@/types/content.types";
import { ProductResponse } from "@/types/content.types";
import {
  Badge,
  DetailItem,
  Tag,
  UniversalCardProps,
} from "@/components/dashboard/contentManager/ContentCard";
import { formatDate } from "@/lib/utils/eventUtils";
import { isDatePast } from "@/lib/utils/dateUtils";
import AddToCartButton from "@/components/ui/custom/AddToCartButton";

// Helper function to format time from HH:MM:SS to HH.MM
export const formatTime = (timeString: string): string => {
  if (!timeString) return "";

  const parts = timeString.split(":");
  if (parts.length < 2) return timeString;

  const hours = parts[0].padStart(2, "0");
  const minutes = parts[1].padStart(2, "0");

  return `${hours}.${minutes}`;
};

// Helper function to format event date
export const formatEventDate = (
  startDate: string,
  endDate?: string
): string => {
  if (!startDate) return "Dato kommer";

  const formattedStart = formatDate(startDate);

  if (endDate && endDate !== startDate) {
    const formattedEnd = formatDate(endDate);
    return `${formattedStart} - ${formattedEnd}`;
  }

  return formattedStart;
};

// Helper function to get project state color
export const getProjectStateColor = (state: string): string => {
  switch (state) {
    case "planning":
      return "rgb(156, 163, 175)"; // gray
    case "in-progress":
      return "rgb(79, 70, 229)"; // indigo
    case "completed":
    case "complete":
      return "rgb(22, 163, 74)"; // green
    default:
      return "#6366f1"; // Default primary color
  }
};

// Helper function to get project state text in Norwegian
export const getProjectStateText = (state: string): string => {
  switch (state) {
    case "planning":
      return "Planlegging";
    case "in-progress":
      return "Pågående";
    case "completed":
    case "complete":
      return "Fullført";
    default:
      return state;
  }
};

// Helper function to get badge type based on blog state
export const getBlogStateType = (state: string): Badge["type"] => {
  switch (state) {
    case "published":
      return "success";
    case "draft":
      return "warning";
    case "archived":
      return "neutral";
    default:
      return "neutral";
  }
};

// Format price with NOK currency
export const formatPrice = (price: number): string => {
  return `${price.toFixed(2)} kr`;
};

// Adapter for Blog content type
export const adaptBlogToCardProps = (
  blog: BlogResponse,
  onCardClick?: (id: number) => void
): UniversalCardProps => {
  // Format tags for display
  const formattedTags: Tag[] = Array.isArray(blog.tags)
    ? blog.tags.map((tag) => ({ text: tag, prefix: "#" }))
    : typeof blog.tags === "string"
      ? blog.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
          .map((tag) => ({ text: tag, prefix: "#" }))
      : [];

  return {
    title: blog.title,
    description: blog.summary,
    image: blog.blogImage
      ? {
          src: blog.blogImage.url,
          alt: blog.blogImage.alternativeText || blog.title,
        }
      : undefined,
    badges: [
      blog.category
        ? {
            text: blog.category,
            type: "primary",
            icon: <MdCategory className="w-3 h-3" />,
          }
        : null,
      blog.state
        ? {
            text: blog.state,
            type: getBlogStateType(blog.state),
          }
        : null,
    ].filter(Boolean) as Badge[],
    tags: formattedTags,
    onClick: onCardClick ? () => onCardClick(blog.id) : undefined,
    variant: "vertical",
    size: "medium",
  };
};

// Adapter for Event content type
export const adaptEventToCardProps = (
  event: EventResponse,
  onCardClick?: (id: number) => void
): UniversalCardProps => {
  const isPastEvent = event.startDate ? isDatePast(event.startDate) : false;

  const details: DetailItem[] = [];

  // Add location if available
  if (event.location) {
    details.push({
      text: event.location,
      icon: <MdLocationOn className="w-4 h-4" />,
    });
  }

  // Add time if available
  if (event.time) {
    details.push({
      text: `kl: ${formatTime(event.time)}`,
      icon: <MdAccessTime className="w-4 h-4" />,
    });
  }

  return {
    title: event.title,
    description: event.description,
    image: event.eventCardImage
      ? {
          src: event.eventCardImage.url,
          alt: event.title,
          fallbackLetter: true,
          overlay: formatEventDate(event.startDate || "", event.endDate),
        }
      : {
          src: "",
          fallbackLetter: true,
        },
    details,
    actionButton: {
      text: "Klikk for detaljer",
    },
    cornerElement: isPastEvent ? (
      <div className="p-2 bg-red-500 text-white text-xs">
        Tidligere arrangement
      </div>
    ) : null,
    onClick: onCardClick ? () => onCardClick(event.id) : undefined,
    variant: "horizontal",
    size: "medium",
  };
};

// Adapter for Project content type
export const adaptProjectToCardProps = (
  project: ProjectResponse,
  onCardClick?: (id: number) => void
): UniversalCardProps => {
  return {
    title: project.title,
    description: project.description,
    image: project.projectImage
      ? {
          src: project.projectImage.url,
          alt: project.title || "Project image",
        }
      : undefined,
    badges: [
      project.category
        ? {
            text: project.category,
            type: "primary",
            icon: <MdCategory className="w-3 h-3" />,
          }
        : null,
      project.state
        ? {
            text: getProjectStateText(project.state),
            customBgColor: getProjectStateColor(project.state),
            customColor: "white",
          }
        : null,
    ].filter(Boolean) as Badge[],
    tags:
      project.technologies?.map((tech) => ({
        text: tech,
        icon: <AiOutlineTool className="w-3 h-3" />,
      })) || [],
    onClick: onCardClick ? () => onCardClick(project.id) : undefined,
    variant: "vertical",
    size: "medium",
  };
};

// Adapter for Product content type
export const adaptProductToCardProps = (
  product: ProductResponse,
  onCardClick?: (id: number) => void,
  onAddToCart?: (id: number) => void
): UniversalCardProps => {
  // Generate badges for product status
  const badges: Badge[] = [];

  // Add category badge if available
  if (product.category) {
    badges.push({
      text: product.category,
      type: "primary",
      icon: <MdCategory className="w-3 h-3" />,
    });
  }

  // Add stock status badge
  if (product.stock <= 0) {
    badges.push({
      text: "Utsolgt",
      type: "danger",
    });
  } else if (product.stock < 5) {
    badges.push({
      text: `Kun ${product.stock} igjen!`,
      type: "warning",
      icon: <FaBoxOpen className="w-3 h-3" />,
    });
  }

  // Add price badge
  if (product.price) {
    badges.push({
      text: `${product.price.toFixed(2)} kr`,
      type: "success",
    });
  }

  // Generate tags for category and product tags
  const tags: Tag[] = [];

  if (product.category) {
    tags.push({
      text: product.category,
      icon: <FaTag className="w-3 h-3" />,
    });
  }

  // Generate detail items for product
  const details: DetailItem[] = [];

  // Add price detail with icon
  if (product.price) {
    details.push({
      text: `${product.price.toFixed(2)} kr`,
      icon: <span className="font-bold">Pris:</span>,
    });
  }

  // Add stock detail with icon
  details.push({
    text: product.stock > 0 ? `${product.stock} på lager` : "Utsolgt",
    icon: <span className="font-bold">Lager:</span>,
  });

  // IMPORTANT: Keep your original image handling
  const image = product.productImage
    ? {
        src: product.productImage.url,
        alt: product.productImage.alternativeText || product.title,
        fallbackLetter: true,
      }
    : {
        src: "", // Keep this empty to use the fallbackLetter
        alt: product.title,
        fallbackLetter: true,
      };

  // Create the AddToCartButton as a footer slot only if onAddToCart is provided and product is in stock
  const footerSlot =
    product.stock > 0 && onAddToCart ? (
      <AddToCartButton
        productId={product.id}
        onAddToCart={(id) => onAddToCart(Number(id))}
        className="w-full mt-4"
        variant="primary"
        showText={true}
      />
    ) : null;

  return {
    title: product.title,
    description: product.description,
    image,
    badges,
    tags,
    details,
    // Action button for viewing details
    actionButton: {
      text: "Se produkt",
    },
    // Include the AddToCartButton as the footerSlot
    footerSlot,
    onClick: onCardClick ? () => onCardClick(product.id) : undefined,
    variant: "vertical",
    size: "medium",
    hoverEffect: true,
  };
};
