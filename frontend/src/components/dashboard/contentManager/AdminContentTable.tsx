// components/dashboard/adminPanel/AdminTable.tsx
import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

// Theme definition (imported from your theme file)
export const Theme = {
  colors: {
    primary: "rgb(121, 85, 72)", // Brown
    background: "rgb(245, 241, 237)", // Light beige
    surface: "rgb(255, 253, 250)", // Creamy white
    surfaceHover: "rgb(237, 231, 225)", // Light warm gray
    text: {
      primary: "rgb(62, 39, 35)", // Dark brown text
      secondary: "rgb(97, 79, 75)", // Medium brown text
      light: "rgb(145, 131, 127)", // Light brown text
    },
    divider: "rgb(225, 217, 209)", // Soft divider
    error: {
      background: "rgba(168, 77, 70, 0.1)",
      text: "rgb(168, 77, 70)",
      border: "rgb(168, 77, 70)",
    },
    success: {
      background: "rgba(96, 125, 83, 0.1)",
      text: "rgb(96, 125, 83)",
      border: "rgb(96, 125, 83)",
    },
  },
};

// Column configuration type
export interface AdminColumn {
  key: string;
  header: string;
  width?: string;
  render?: (item: any, index: number) => ReactNode;
}

// Action button configuration type
export interface AdminAction {
  label: string;
  color: keyof typeof actionColors;
  href?: string | ((id: string | number) => string); // For links - can be string or function that returns string
  onClick?: (id: string | number) => void; // For buttons
  external?: boolean; // For opening links in new tab
  showCondition?: (item: any) => boolean; // Optional condition to show the action
}

// Colors for action buttons (based on Theme colors)
const actionColors = {
  error: {
    bg: "rgb(168, 77, 70)",
    hover: "rgb(150, 69, 63)",
  },
  warning: {
    bg: "rgb(190, 142, 79)",
    hover: "rgb(171, 128, 71)",
  },
  info: {
    bg: "rgb(84, 110, 122)",
    hover: "rgb(75, 99, 110)",
  },
  success: {
    bg: "rgb(96, 125, 83)",
    hover: "rgb(85, 111, 74)",
  },
  primary: {
    bg: Theme.colors.primary,
    hover: "rgb(109, 76, 65)",
  },
};

export interface AdminTableProps {
  title: string;
  items: any[];
  columns: AdminColumn[];
  actions: AdminAction[];
  isLoading: boolean;
  error: string | null;
  successMessage?: string | null;
  emptyMessage?: {
    title: string;
    description: string;
    icon?: ReactNode;
  };
  createButton?: {
    label: string;
    href: string;
  };
  getItemId: (item: any) => string | number; // Function to get item ID
  imageKey?: string; // Key to access the image in items
  getImageUrl?: (image: any) => string; // Function to get image URL
}

export const AdminTable: React.FC<AdminTableProps> = ({
  title,
  items,
  columns,
  actions,
  isLoading,
  error,
  successMessage,
  emptyMessage = {
    title: "No items found",
    description: "Create a new item to get started.",
  },
  createButton,
  getItemId,
  imageKey = "image",
  getImageUrl,
}) => {
  return (
    <div className="min-h-screen p-6 sm:p-8 md:p-10">
      {/* Success Message */}
      {successMessage && (
        <div
          className="px-4 py-3 mb-6 rounded-md"
          style={{
            backgroundColor: Theme.colors.success.background,
            color: Theme.colors.success.text,
            border: `1px solid ${Theme.colors.success.border}`,
          }}
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="px-4 py-3 mb-6 rounded-md"
          style={{
            backgroundColor: Theme.colors.error.background,
            color: Theme.colors.error.text,
            border: `1px solid ${Theme.colors.error.border}`,
          }}
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Card Container */}
      <div
        className="max-w-7xl mx-auto rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: Theme.colors.surface }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 sm:px-8 sm:py-6"
          style={{ backgroundColor: Theme.colors.primary, color: "white" }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
            {createButton && (
              <Link
                href={createButton.href}
                className="px-4 py-2 rounded-md text-sm font-medium shadow transition duration-150 ease-in-out"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "white",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.25)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.15)")
                }
              >
                + {createButton.label}
              </Link>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8">
          {/* Loading Spinner */}
          {isLoading ? (
            <div className="flex justify-center my-16">
              <div
                className="animate-spin rounded-full h-12 w-12"
                style={{
                  borderWidth: "3px",
                  borderStyle: "solid",
                  borderColor: Theme.colors.divider,
                  borderTopColor: Theme.colors.primary,
                }}
              ></div>
            </div>
          ) : items.length === 0 ? (
            // No Items Found
            <div
              className="text-center my-16 p-8 rounded-lg"
              style={{ backgroundColor: "rgba(121, 85, 72, 0.1)" }}
            >
              {emptyMessage.icon || (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: Theme.colors.text.light }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M8 12h8M8 16h4"
                  />
                </svg>
              )}
              <p
                className="text-lg font-medium"
                style={{ color: Theme.colors.text.primary }}
              >
                {emptyMessage.title}
              </p>
              <p
                className="mt-2"
                style={{ color: Theme.colors.text.secondary }}
              >
                {emptyMessage.description}
              </p>
            </div>
          ) : (
            // Items Table
            <div className="overflow-x-auto">
              <table
                className="min-w-full divide-y"
                style={{
                  borderCollapse: "separate",
                  borderSpacing: "0 0",
                  borderColor: Theme.colors.divider,
                }}
              >
                <thead>
                  <tr>
                    {/* First column for image if imageKey provided */}
                    {imageKey && (
                      <th
                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-md"
                        style={{
                          backgroundColor: "rgba(121, 85, 72, 0.1)",
                          color: Theme.colors.text.primary,
                          width: "80px",
                        }}
                      >
                        Image
                      </th>
                    )}

                    {/* Dynamic columns */}
                    {columns.map((column, idx) => (
                      <th
                        key={column.key}
                        className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          !imageKey && idx === 0 ? "rounded-tl-md" : ""
                        } ${!imageKey && idx === columns.length - 1 && actions.length === 0 ? "rounded-tr-md" : ""}`}
                        style={{
                          backgroundColor: "rgba(121, 85, 72, 0.1)",
                          color: Theme.colors.text.primary,
                          width: column.width,
                        }}
                      >
                        {column.header}
                      </th>
                    ))}

                    {/* Actions column */}
                    {actions.length > 0 && (
                      <th
                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tr-md"
                        style={{
                          backgroundColor: "rgba(121, 85, 72, 0.1)",
                          color: Theme.colors.text.primary,
                        }}
                      >
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody
                  className="divide-y"
                  style={{
                    color: Theme.colors.text.primary,
                    borderColor: Theme.colors.divider,
                  }}
                >
                  {items.map((item, index) => (
                    <tr
                      key={getItemId(item)}
                      className="transition-colors duration-150 ease-in-out"
                      style={{
                        backgroundColor:
                          index % 2 === 0
                            ? "transparent"
                            : "rgba(121, 85, 72, 0.05)",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          Theme.colors.surfaceHover)
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          index % 2 === 0
                            ? "transparent"
                            : "rgba(121, 85, 72, 0.05)")
                      }
                    >
                      {/* Image Cell */}
                      {imageKey && (
                        <td className="px-4 py-4 whitespace-nowrap">
                          {item[imageKey] && getImageUrl ? (
                            <div className="relative h-16 w-16 rounded-md overflow-hidden shadow">
                              <Image
                                src={getImageUrl(item[imageKey])}
                                alt={item.title || "Image"}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div
                              className="h-16 w-16 rounded-md flex items-center justify-center"
                              style={{ backgroundColor: Theme.colors.divider }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                style={{ color: Theme.colors.text.light }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </td>
                      )}

                      {/* Dynamic content cells */}
                      {columns.map((column) => (
                        <td key={column.key} className="px-4 py-4">
                          {column.render
                            ? column.render(item, index)
                            : item[column.key] || "-"}
                        </td>
                      ))}

                      {/* Actions Cell */}
                      {actions.length > 0 && (
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            {actions.map((action, actionIndex) => {
                              // Skip rendering if condition is provided and is false
                              if (
                                action.showCondition &&
                                !action.showCondition(item)
                              ) {
                                return null;
                              }

                              // Get colors for this action
                              const actionColor =
                                actionColors[action.color] ||
                                actionColors.primary;

                              if (action.href) {
                                return (
                                  <Link
                                    key={actionIndex}
                                    href={
                                      typeof action.href === "function"
                                        ? (
                                            action.href as (
                                              id: string | number
                                            ) => string
                                          )(getItemId(item))
                                        : (action.href as string).replace(
                                            ":id",
                                            String(getItemId(item))
                                          )
                                    }
                                    target={
                                      action.external ? "_blank" : undefined
                                    }
                                    className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ease-in-out"
                                    style={{
                                      backgroundColor: actionColor.bg,
                                      color: "white",
                                    }}
                                    onMouseOver={(e) =>
                                      (e.currentTarget.style.backgroundColor =
                                        actionColor.hover)
                                    }
                                    onMouseOut={(e) =>
                                      (e.currentTarget.style.backgroundColor =
                                        actionColor.bg)
                                    }
                                  >
                                    {action.label}
                                  </Link>
                                );
                              } else if (action.onClick) {
                                return (
                                  <button
                                    key={actionIndex}
                                    onClick={() =>
                                      action.onClick!(getItemId(item))
                                    }
                                    className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ease-in-out"
                                    style={{
                                      backgroundColor: actionColor.bg,
                                      color: "white",
                                    }}
                                    onMouseOver={(e) =>
                                      (e.currentTarget.style.backgroundColor =
                                        actionColor.hover)
                                    }
                                    onMouseOut={(e) =>
                                      (e.currentTarget.style.backgroundColor =
                                        actionColor.bg)
                                    }
                                  >
                                    {action.label}
                                  </button>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
