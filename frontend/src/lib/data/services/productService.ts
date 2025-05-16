// lib/data/services/productService.ts
import { ProductResponse } from "@/types/content.types";
import { strapiService } from "@/lib/data/services/strapiClient";

export const productService = {
  // Get all products with optional filters, sorting, and pagination
  getAll: async (
    params: Record<string, unknown> = {}
  ): Promise<ProductResponse[]> => {
    try {
      // Using collection method for consistent approach
      const productsCollection = strapiService.collection("products");

      // Ensure populate parameter is properly typed
      const queryParams: Record<string, unknown> = {
        ...params,
        populate: params.populate || ["productImage"], // Ensure productImage is populated
      };

      // Use the collection's find method
      const response = await productsCollection.find(queryParams);

      if (!response.data || !Array.isArray(response.data)) {
        console.warn("No products found or data is not an array");
        return [];
      }

      // Transform the response to match our ProductResponse type
      return response.data.map((item) => {
        // Extract the base product data
        const product: ProductResponse = {
          id: item.id,
          title: item.title || "",
          description: item.description || "",
          price: item.price || 0,
          stock: item.stock || 0,
          category: item.category || "Uncategorized",
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          publishedAt: item.publishedAt,
        };

        // Process the image data if it exists
        if (item.productImage) {
          // Handle both direct and nested data structures
          let imageUrl: string = "";

          // For nested structure with data property
          if (typeof item.productImage.data !== "undefined") {
            const data = item.productImage.data;
            if (data) {
              imageUrl = strapiService.media.getMediaUrl(data);
              product.productImage = {
                id: data.id || 0,
                url: imageUrl,
                alternativeText: data.alternativeText,
                width: data.width,
                height: data.height,
                formats: data.formats,
              };
            }
          } else {
            // Direct format - no nesting
            imageUrl = strapiService.media.getMediaUrl(item.productImage);
            product.productImage = {
              id: item.productImage.id || 0,
              url: imageUrl,
              alternativeText: item.productImage.alternativeText,
              width: item.productImage.width,
              height: item.productImage.height,
              formats: item.productImage.formats,
            };
          }
        }

        return product;
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  // Get a single product by ID
  getOne: async (
    id: number | string,
    params: Record<string, unknown> = {}
  ): Promise<ProductResponse | null> => {
    try {
      const productsCollection = strapiService.collection("products");

      // Define query params
      const queryParams: Record<string, unknown> = {
        ...params,
        populate: params.populate || ["productImage"],
      };

      // Use the collection's findOne method
      const response = await productsCollection.findOne(
        id.toString(),
        queryParams
      );

      if (!response.data) return null;

      // Create product object with proper types
      const product: ProductResponse = {
        id: response.data.id,
        title: response.data.title || "",
        description: response.data.description || "",
        price: response.data.price || 0,
        stock: response.data.stock || 0,
        category: response.data.category || "Uncategorized",
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
        publishedAt: response.data.publishedAt,
      };

      // Process the image data if it exists
      if (response.data.productImage) {
        let imageUrl: string = "";

        // Handle nested structure
        if (typeof response.data.productImage.data !== "undefined") {
          const data = response.data.productImage.data;
          if (data && data.attributes) {
            imageUrl = strapiService.media.getMediaUrl(data);
            product.productImage = {
              id: data.id || 0,
              url: imageUrl,
              alternativeText: data.attributes.alternativeText,
              width: data.attributes.width,
              height: data.attributes.height,
              formats: data.attributes.formats,
            };
          }
        } else {
          // Direct format - no nesting
          imageUrl = strapiService.media.getMediaUrl(
            response.data.productImage
          );
          product.productImage = {
            id: response.data.productImage.id || 0,
            url: imageUrl,
            alternativeText: response.data.productImage.alternativeText,
            width: response.data.productImage.width,
            height: response.data.productImage.height,
            formats: response.data.productImage.formats,
          };
        }
      }

      return product;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },

  // Helper method to get media URL
  getMediaUrl: (media: any): string => {
    return strapiService.media.getMediaUrl(media);
  },
};
