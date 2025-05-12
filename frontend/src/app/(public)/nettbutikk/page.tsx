// app/(public)/nettbutikk/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { UniversalCard } from "@/components/dashboard/contentManager/ContentCard";
import { productService } from "@/lib/data/services/productService";
import { adaptProductToCardProps } from "@/lib/adapters/cardAdapter";
import { ProductResponse } from "@/types/content.types";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { SortDropdown, SortOption } from "@/components/ui/SortDropdown";
import CartIcon from "@/components/ui/CartIcon";
import { useCart } from "@/lib/context/shopContext";

// Define sort options for products
const PRODUCT_SORT_OPTIONS: SortOption[] = [
  { value: "newest", label: "Nyeste først" },
  { value: "oldest", label: "Eldste først" },
  { value: "alphabetical", label: "A til Å" },
  { value: "reverseAlphabetical", label: "Å til A" },
];

export default function NettbutikkPage() {
  const router = useRouter();
  const { addToCart } = useCart();

  // State variables
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [sort, setSort] = useState<string>("newest"); // Default sort by newest

  // Fetch products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Apply filters and sorting when products, search query, filter, or sort changes
  useEffect(() => {
    applyFiltersAndSorting();
  }, [products, searchQuery, filter, sort]);

  // Fetch products from the API
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getAll({
        sort: ["createdAt:desc"],
        populate: ["productImage"],
      });

      setProducts(data);
      setFilteredProducts(data); // Initially show all products
      setError(null);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("An error occurred while loading products.");
    } finally {
      setIsLoading(false);
    }
  };

  // Apply search, category filters, and sorting
  const applyFiltersAndSorting = () => {
    if (!products || products.length === 0) return;

    let filtered = [...products];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) => product.title?.toLowerCase().includes(query) || product.description?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filter) {
      filtered = filtered.filter((product) => product.category === filter);
    }

    // Apply sorting
    if (sort === "newest") {
      filtered = filtered.sort(
        (a, b) =>
          new Date(b.createdAt || "1970-01-01T00:00:00Z").getTime() -
          new Date(a.createdAt || "1970-01-01T00:00:00Z").getTime()
      );
    } else if (sort === "oldest") {
      filtered = filtered.sort(
        (a, b) =>
          new Date(a.createdAt || "1970-01-01T00:00:00Z").getTime() -
          new Date(b.createdAt || "1970-01-01T00:00:00Z").getTime()
      );
    } else if (sort === "alphabetical") {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "reverseAlphabetical") {
      filtered = filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    setFilteredProducts(filtered);
  };

  // Handle product click
  const handleProductClick = (id: number) => {
    router.push(`/nettbutikk/product/${id}`);
  };

  // Handle add to cart
  const handleAddToCart = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.productImage?.url,
      });

      alert(`${product.title} er lagt til i handlekurven!`);
    }
  };

  // Get unique categories for filter options
  const getCategoryOptions = () => {
    if (!products || products.length === 0) return [{ value: "", label: "Alle kategorier" }];

    const categories = new Set<string>();
    products.forEach((product) => {
      if (product.category) {
        categories.add(product.category);
      }
    });

    return [
      { value: "", label: "Alle kategorier" },
      ...Array.from(categories).map((category) => ({
        value: category,
        label: category,
      })),
    ];
  };

  // Render content based on loading/error state
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner size="medium" />;
    }

    if (error) {
      return (
        <div className="text-center py-10 text-red-600">
          <p className="text-xl font-medium">{error}</p>
          <p className="mt-2">Try refreshing the page.</p>
        </div>
      );
    }

    if (!filteredProducts || filteredProducts.length === 0) {
      return (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-700">Ingen produkter funnet</h3>
          <p className="mt-2 text-gray-500">Prøv å justere søket eller filteret</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          try {
            const cardProps = adaptProductToCardProps(product, handleProductClick, handleAddToCart);
            return <UniversalCard key={product.id} {...cardProps} />;
          } catch (error) {
            console.error(`Error rendering product ${product.id}:`, error);
            return (
              <div key={product.id} className="p-4 border rounded-md bg-red-50 text-red-500">
                Error rendering product: {product.title}
              </div>
            );
          }
        })}
      </div>
    );
  };

  // Main render
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-3xl font-bold">Nettbutikk</h1>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
              <span className="text-gray-500 self-center">
                {filteredProducts.length} {filteredProducts.length === 1 ? "produkt" : "produkter"} funnet
              </span>
            </div>
          </div>

          {/* Search, Filter, and Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Søk etter produkter..."
              className="flex-grow"
            />

            <FilterDropdown
              filter={filter}
              setFilter={setFilter}
              options={getCategoryOptions()}
              ariaLabel="Filter by category"
            />

            <SortDropdown
              sort={sort}
              setSort={setSort}
              options={PRODUCT_SORT_OPTIONS}
              ariaLabel="Sort products"
              placeholder="Sorter etter"
            />
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
}
