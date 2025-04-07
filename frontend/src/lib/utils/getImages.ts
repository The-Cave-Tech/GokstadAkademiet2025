// Helper function to get image URL
const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
export const getImageUrl = (imageField: any): string | null => {
  if (!imageField) return null;
  if (imageField.url) return `${baseUrl}${imageField.url}`;
  return null;
};
