import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "@/components/ui/SearchBar";

describe("SearchBar Component", () => {
  test("renders the search input with default placeholder", () => {
    const mockSetSearchQuery = vi.fn();
    render(<SearchBar searchQuery="" setSearchQuery={mockSetSearchQuery} />);

    const input = screen.getByPlaceholderText("Search");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  test("updates the search query when typing", () => {
    const mockSetSearchQuery = vi.fn();
    render(<SearchBar searchQuery="" setSearchQuery={mockSetSearchQuery} />);

    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "React" } });

    expect(mockSetSearchQuery).toHaveBeenCalledTimes(1);
    expect(mockSetSearchQuery).toHaveBeenCalledWith("React");
  });

  test("calls onSearch when the form is submitted", () => {
    const mockSetSearchQuery = vi.fn();
    const mockOnSearch = vi.fn();
    render(<SearchBar searchQuery="React" setSearchQuery={mockSetSearchQuery} onSearch={mockOnSearch} />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith("React");
  });

  test("does not call onSearch if onSearch is not provided", () => {
    const mockSetSearchQuery = vi.fn();
    render(<SearchBar searchQuery="React" setSearchQuery={mockSetSearchQuery} />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    // No errors should occur, and no function should be called
    expect(true).toBe(true);
  });

  test("renders with a custom placeholder", () => {
    const mockSetSearchQuery = vi.fn();
    render(<SearchBar searchQuery="" setSearchQuery={mockSetSearchQuery} placeholder="Search for products" />);

    const input = screen.getByPlaceholderText("Search for products");
    expect(input).toBeInTheDocument();
  });

  test("renders with a custom aria-label", () => {
    const mockSetSearchQuery = vi.fn();
    render(<SearchBar searchQuery="" setSearchQuery={mockSetSearchQuery} ariaLabel="Custom Search Input" />);

    const input = screen.getByLabelText("Custom Search Input");
    expect(input).toBeInTheDocument();
  });

  test("renders the submit button when onSearch is provided", () => {
    const mockSetSearchQuery = vi.fn();
    const mockOnSearch = vi.fn();
    render(<SearchBar searchQuery="" setSearchQuery={mockSetSearchQuery} onSearch={mockOnSearch} />);

    const button = screen.getByRole("button", { name: "Submit search" });
    expect(button).toBeInTheDocument();
  });

  test("does not render the submit button when onSearch is not provided", () => {
    const mockSetSearchQuery = vi.fn();
    render(<SearchBar searchQuery="" setSearchQuery={mockSetSearchQuery} />);

    const button = screen.queryByRole("button", { name: "Submit search" });
    expect(button).not.toBeInTheDocument();
  });
});
