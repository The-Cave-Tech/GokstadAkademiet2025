/**
 * Formats a date string into a more readable format
 * @param dateString - ISO date string or any valid date string
 * @returns Formatted date string (e.g., "Apr 30, 2025")
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if invalid
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original string on error
  }
};

/**
 * Returns a relative time string (e.g., "2 days ago", "in 3 months")
 * @param dateString - ISO date string or any valid date string
 * @returns Relative time string
 */
export const getRelativeTimeString = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return ""; // Return empty string if invalid
    }

    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < -365) {
      return `${Math.floor(-diffInDays / 365)} years ago`;
    } else if (diffInDays < -30) {
      return `${Math.floor(-diffInDays / 30)} months ago`;
    } else if (diffInDays < -1) {
      return `${-diffInDays} days ago`;
    } else if (diffInDays === -1) {
      return "Yesterday";
    } else if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Tomorrow";
    } else if (diffInDays < 30) {
      return `In ${diffInDays} days`;
    } else if (diffInDays < 365) {
      return `In ${Math.floor(diffInDays / 30)} months`;
    } else {
      return `In ${Math.floor(diffInDays / 365)} years`;
    }
  } catch (error) {
    console.error("Error calculating relative time:", error);
    return ""; // Return empty string on error
  }
};

/**
 * Checks if a date is in the past
 * @param dateString - ISO date string or any valid date string
 * @returns Boolean indicating if the date is in the past
 */
export const isDatePast = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    const now = new Date();

    // Set both dates to midnight for fair comparison
    date.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    return date < now;
  } catch (error) {
    console.error("Error checking if date is past:", error);
    return false;
  }
};

/**
 * Creates a date range string (e.g., "Apr 30 - May 5, 2025")
 * @param startDateString - Start date string
 * @param endDateString - End date string
 * @returns Formatted date range string
 */
export const formatDateRange = (
  startDateString: string,
  endDateString: string
): string => {
  try {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return `${startDateString} - ${endDateString}`;
    }

    // If dates are in the same year
    if (startDate.getFullYear() === endDate.getFullYear()) {
      // If dates are in the same month
      if (startDate.getMonth() === endDate.getMonth()) {
        return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.getDate()}, ${endDate.getFullYear()}`;
      } else {
        // Different months, same year
        return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${endDate.getFullYear()}`;
      }
    } else {
      // Different years
      return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }
  } catch (error) {
    console.error("Error formatting date range:", error);
    return `${startDateString} - ${endDateString}`;
  }
};
