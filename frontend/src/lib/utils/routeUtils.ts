// File: frontend/src/lib/utils/routeUtils.ts
/**
 * Extracts the type and ID parameters from a URL or pathname
 * Works with both /aktiviteter/[type]/[id] and /aktiviteter?type=[type]&id=[id] formats
 *
 * @param pathname The URL pathname or full URL
 * @returns Object containing type and id, or null values if not found
 */
export function extractRouteParams(pathname: string): {
  type: string | null;
  id: string | null;
} {
  // Default return value
  const result = { type: null, id: null };

  // Check if pathname is undefined
  if (!pathname) return result;

  // Log for debugging

  try {
    // Check if it's a query parameter format
    if (pathname.includes("?")) {
      const url = new URL(
        pathname.startsWith("http") ? pathname : `http://example.com${pathname}`
      );
      result.type = url.searchParams.get("type");
      result.id = url.searchParams.get("id");
      console.log("Extracted from query params:", result);
      return result;
    }

    // Path format
    const segments = pathname.split("/").filter(Boolean);
    console.log("Path segments:", segments);

    // Find the index of 'aktiviteter'
    const aktiviteterIndex = segments.findIndex(
      (segment) => segment === "aktiviteter"
    );

    if (aktiviteterIndex >= 0 && segments.length > aktiviteterIndex + 2) {
      result.type = segments[aktiviteterIndex + 1];
      result.id = segments[aktiviteterIndex + 2];
      console.log("Extracted from path segments:", result);
    }

    return result;
  } catch (error) {
    console.error("Error extracting route params:", error);
    return result;
  }
}
