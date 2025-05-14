import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import NettbutikkPage from "@/app/(public)/nettbutikk/page";
import { CartProvider } from "@/lib/context/shopContext";
import { productService } from "@/lib/data/services/productService";
import { ProductResponse } from "@/types/content.types";

// Mock Next.js router - create mockRouter that we can control
const mockPush = vi.fn();
const mockRouter = {
  push: mockPush,
};

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Cast useRouter to a mock so we can use mockReturnValue
const useRouterMock = useRouter as any;

// Mock the product service - the main thing we want to test
vi.mock("@/lib/data/services/productService", () => ({
  productService: {
    getAll: vi.fn(),
  },
}));

describe("Nettbutikk Page", () => {
  // Test data that's easy to understand
  const mockProducts: ProductResponse[] = [
    {
      id: 1,
      title: "Test Product 1",
      description: "This is the first test product",
      price: 100,
      stock: 5,
      category: "Electronics",
      productImage: {
        id: 1,
        url: "/test-image-1.jpg",
        alternativeText: "Test image 1",
        width: 500,
        height: 500,
        formats: {},
      },
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
      publishedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: 2,
      title: "Test Product 2",
      description: "This is the second test product",
      price: 200,
      stock: 3,
      category: "Books",
      productImage: {
        id: 2,
        url: "/test-image-2.jpg",
        alternativeText: "Test image 2",
        width: 500,
        height: 500,
        formats: {},
      },
      createdAt: "2023-01-02T00:00:00.000Z",
      updatedAt: "2023-01-02T00:00:00.000Z",
      publishedAt: "2023-01-02T00:00:00.000Z",
    },
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Make sure useRouter returns our mock router in every test
    useRouterMock.mockReturnValue(mockRouter);
  });

  // Helper function to render the component with required providers
  const renderPage = () => {
    return render(
      <CartProvider>
        <NettbutikkPage />
      </CartProvider>
    );
  };

  test("shows loading spinner initially", () => {
    // Mock an API call that never resolves to keep loading state
    (productService.getAll as any).mockImplementation(() => new Promise(() => {}));

    renderPage();

    // Check that loading spinner is shown by looking for the aria-label
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();

    // Or you can check for the role="status" element
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("displays products after loading", async () => {
    // Mock successful API response
    (productService.getAll as any).mockResolvedValue(mockProducts);

    renderPage();

    // Wait for products to appear
    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      expect(screen.getByText("Test Product 2")).toBeInTheDocument();
    });
  });

  test("shows error message when API fails", async () => {
    // Mock API failure
    (productService.getAll as any).mockRejectedValue(new Error("API Error"));

    renderPage();

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
    });
  });

  test("shows 'no products' message when API returns empty array", async () => {
    // Mock empty response
    (productService.getAll as any).mockResolvedValue([]);

    renderPage();

    // Wait for no products message
    await waitFor(() => {
      expect(screen.getByText(/Ingen produkter funnet/i)).toBeInTheDocument();
    });
  });

  test("filters products when searching", async () => {
    (productService.getAll as any).mockResolvedValue(mockProducts);

    renderPage();

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    });

    // Find the search input and type in it
    const searchInput = screen.getByPlaceholderText(/søk/i);
    fireEvent.change(searchInput, { target: { value: "Product 1" } });

    // Check that only Product 1 is shown
    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      expect(screen.queryByText("Test Product 2")).not.toBeInTheDocument();
    });
  });

  test("calls productService.getAll with correct parameters", async () => {
    (productService.getAll as any).mockResolvedValue(mockProducts);

    renderPage();

    // Check that the service was called with the right parameters
    expect(productService.getAll).toHaveBeenCalledWith({
      sort: ["createdAt:desc"],
      populate: ["productImage"],
    });
  });

  test("navigates to product page when product is clicked", async () => {
    // Mock products
    (productService.getAll as any).mockResolvedValue(mockProducts);

    renderPage();

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    });

    // Click on the first product
    fireEvent.click(screen.getByText("Test Product 1"));

    // Verify navigation was triggered
    expect(mockPush).toHaveBeenCalledWith("/nettbutikk/product/1");
  });
});
