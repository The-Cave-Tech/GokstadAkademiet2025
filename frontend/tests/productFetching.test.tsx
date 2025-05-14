import { describe, test, expect, vi, Mock } from "vitest"; // Import Mock type
import { productService } from "@/lib/data/services/productService";
import { strapiService } from "@/lib/data/services/strapiClient";
import { ProductResponse } from "@/types/content.types"; // Ensure this type is correctly imported

vi.mock("@/lib/data/services/strapiClient", () => ({
  strapiService: {
    collection: vi.fn(),
    media: {
      getMediaUrl: vi.fn((media: { url: string }) => `http://localhost:1337${media.url}`), // Mock media URL generation
    },
  },
}));

describe("productService.getAll", () => {
  test("fetches and transforms product data correctly", async () => {
    // Mock the response from Strapi
    const mockResponse = {
      data: [
        {
          id: 1,
          title: "Product 1",
          description: "Description for Product 1",
          price: 100,
          stock: 10,
          category: "Category 1",
          createdAt: "2023-01-01T00:00:00.000Z",
          updatedAt: "2023-01-02T00:00:00.000Z",
          publishedAt: "2023-01-03T00:00:00.000Z",
          productImage: {
            data: {
              id: 101,
              url: "/uploads/product1.jpg",
              alternativeText: "Product 1 Image",
              width: 800,
              height: 600,
              formats: {
                thumbnail: { url: "/uploads/thumbnail_product1.jpg" },
              },
            },
          },
        },
      ],
    };

    // Mock the collection's find method
    const mockFind = vi.fn().mockResolvedValue(mockResponse);
    (strapiService.collection as Mock).mockReturnValue({
      find: mockFind,
    });

    // Call the method
    const products: ProductResponse[] = await productService.getAll();

    // Assertions
    expect(mockFind).toHaveBeenCalledTimes(1); // Ensure the find method was called
    expect(products).toHaveLength(1); // Ensure one product is returned

    // Check the structure of the returned product
    expect(products[0]).toEqual({
      id: 1,
      title: "Product 1",
      description: "Description for Product 1",
      price: 100,
      stock: 10,
      category: "Category 1",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-02T00:00:00.000Z",
      publishedAt: "2023-01-03T00:00:00.000Z",
      productImage: {
        id: 101,
        url: "http://localhost:1337/uploads/product1.jpg",
        alternativeText: "Product 1 Image",
        width: 800,
        height: 600,
        formats: {
          thumbnail: { url: "/uploads/thumbnail_product1.jpg" },
        },
      },
    });
  });

  test("returns an empty array if no products are found", async () => {
    // Mock the response from Strapi
    const mockResponse = { data: [] };

    const mockFind = vi.fn().mockResolvedValue(mockResponse);
    (strapiService.collection as Mock).mockReturnValue({
      find: mockFind,
    });

    // Call the method
    const products: ProductResponse[] = await productService.getAll();

    // Assertions
    expect(mockFind).toHaveBeenCalledTimes(1);
    expect(products).toEqual([]); // Ensure an empty array is returned
  });

  test("handles errors gracefully and returns an empty array", async () => {
    // Mock the collection's find method to throw an error
    const mockFind = vi.fn().mockRejectedValue(new Error("Network error"));
    (strapiService.collection as Mock).mockReturnValue({
      find: mockFind,
    });

    // Call the method
    const products: ProductResponse[] = await productService.getAll();

    // Assertions
    expect(mockFind).toHaveBeenCalledTimes(1);
    expect(products).toEqual([]); // Ensure an empty array is returned on error
  });
});
