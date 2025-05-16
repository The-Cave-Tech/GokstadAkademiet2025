import { render, fireEvent } from "@testing-library/react";
import { AddToCartButton } from "@/components/ui/custom/AddToCartButton";

describe("AddToCartButton", () => {
  test("calls onAddToCart with the correct product ID when clicked", () => {
    const mockOnAddToCart = vi.fn(); // Mock the onAddToCart function
    const productId = 1;

    const { getByRole } = render(<AddToCartButton productId={productId} onAddToCart={mockOnAddToCart} />);

    // Find the button by its role and aria-label
    const button = getByRole("button", { name: "Legg til i handlekurv" });

    // Simulate a click event
    fireEvent.click(button);

    // Assert that the mock function was called with the correct product ID
    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
    expect(mockOnAddToCart).toHaveBeenCalledWith(productId);
  });

  test("does not call onAddToCart when the button is disabled", () => {
    const mockOnAddToCart = vi.fn();
    const productId = 1;

    const { getByRole } = render(
      <AddToCartButton productId={productId} onAddToCart={mockOnAddToCart} disabled={true} />
    );

    const button = getByRole("button", { name: "Legg til i handlekurv" });

    // Simulate a click event
    fireEvent.click(button);

    // Assert that the mock function was not called
    expect(mockOnAddToCart).not.toHaveBeenCalled();
  });

  test("shows animation when clicked", () => {
    const mockOnAddToCart = vi.fn();
    const productId = 1;

    const { getByRole, container } = render(<AddToCartButton productId={productId} onAddToCart={mockOnAddToCart} />);

    const button = getByRole("button", { name: "Legg til i handlekurv" });

    // Simulate a click event
    fireEvent.click(button);

    // Assert that the animation class is applied
    const animatedElement = container.querySelector(".animate-bounce");
    expect(animatedElement).toBeInTheDocument();
  });
});
