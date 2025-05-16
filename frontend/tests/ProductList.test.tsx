import { render, screen } from "@testing-library/react";
import NettbutikkPage from "@/app/(public)/nettbutikk/page";
import { productService } from "@/lib/data/services/productService";
import { useRouter } from "next/navigation";
import { CartProvider } from "@/lib/context/shopContext"; // Import CartProvider

vi.mock("@/lib/data/services/productService");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("Product List Integration", () => {
  beforeEach(() => {
    // Mock useRouter to prevent invariant error
    (useRouter as jest.Mock).mockReturnValue({
      push: vi.fn(), // Mock the `push` method
    });
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(<CartProvider>{ui}</CartProvider>);
  };

  test("fetches and displays products from API", async () => {
    productService.getAll = vi.fn().mockResolvedValue([
      { id: 1, title: "Product 1", price: 100 },
      { id: 2, title: "Product 2", price: 200 },
    ]);

    renderWithProviders(<NettbutikkPage />);

    // Assert that products are displayed
    expect(await screen.findByText("Product 1")).toBeInTheDocument();
    expect(await screen.findByText("Product 2")).toBeInTheDocument();
  });
});
