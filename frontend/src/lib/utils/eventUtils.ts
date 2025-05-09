// lib/utils.ts

/**
 * Format a date string to a human-readable format
 *
 * @param dateString ISO date string
 * @param options Formatting options
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  options: {
    locale?: string;
    includeTime?: boolean;
    format?: "long" | "medium" | "short";
  } = {}
): string {
  if (!dateString) return "";

  const { locale = "en-US", includeTime = false, format = "medium" } = options;

  const date = new Date(dateString);

  // Return empty string for invalid dates
  if (isNaN(date.getTime())) return "";

  let dateFormatOptions: Intl.DateTimeFormatOptions = {};

  switch (format) {
    case "long":
      dateFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      break;
    case "medium":
      dateFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      break;
    case "short":
      dateFormatOptions = {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      };
      break;
  }

  if (includeTime) {
    dateFormatOptions.hour = "2-digit";
    dateFormatOptions.minute = "2-digit";
  }

  return new Intl.DateTimeFormat(locale, dateFormatOptions).format(date);
}

export function buildUrl(
  baseUrl: string,
  params: Record<string, any> = {}
): string {
  const url = new URL(baseUrl);

  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (Array.isArray(value)) {
      // Handle array parameters (e.g., ?sort[]=value1&sort[]=value2)
      value.forEach((item) => url.searchParams.append(`${key}[]`, item));
    } else if (value !== undefined && value !== null) {
      // Handle regular parameters
      url.searchParams.append(key, value);
    }
  });

  return url.toString();
}

/**
 * Truncate a string to a specified length and add ellipsis
 *
 * @param text The text to truncate
 * @param length Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, length: number): string {
  if (!text) return "";
  if (text.length <= length) return text;

  return text.substring(0, length).trim() + "...";
}
