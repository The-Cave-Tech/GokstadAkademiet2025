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
import CartIcon from "@/components/ui/CartIcon";
import { useCart } from "@/lib/context/shopContext";

export default function NettbutikkPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductResponse[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Apply filters when products, search, or filter changes
  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, filter]);

  // Load products from API using the collection approach
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // Fetch from the API, but use mock data if it fails
      let data: ProductResponse[] = [];

      try {
        data = await productService.getAll({
          sort: ["createdAt:desc"],
          populate: ["productImage"],
        });

        console.log("Successfully fetched products:", data);
      } catch (e) {
        console.error("Error fetching from API, using mock data:", e);
      }

      setProducts(data);
      setFilteredProducts(data); // Initially show all products
      setError(null);
    } catch (err) {
      console.error("Error in loadProducts:", err);
      setError("An error occurred while loading products");
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters to products
  const applyFilters = () => {
    if (!products || products.length === 0) {
      console.log("No products to filter");
      return;
    }

    console.log(`Filtering ${products.length} products...`);
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          (product.title && product.title.toLowerCase().includes(query)) ||
          (product.description &&
            product.description.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (filter) {
      filtered = filtered.filter((product) => product.category === filter);
    }
    setFilteredProducts(filtered);
  };

  // Handle product click - updated to ensure proper navigation
  const handleProductClick = (id: number) => {
    console.log(`Navigating to product ${id}`);
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
    }
  };

  // Get unique categories for filter options
  const getCategoryOptions = () => {
    if (!products || products.length === 0)
      return [{ value: "", label: "Alle kategorier" }];

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

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
          <h3 className="text-xl font-medium text-gray-700">
            Ingen produkter funnet
          </h3>
          <p className="mt-2 text-gray-500">
            Prøv å justere søket eller filteret
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          try {
            // Pass both handleProductClick and handleAddToCart to the adapter
            const cardProps = adaptProductToCardProps(
              product,
              handleProductClick,
              handleAddToCart
            );

            return <UniversalCard key={product.id} {...cardProps} />;
          } catch (error) {
            console.error(`Error rendering product ${product.id}:`, error);
            return (
              <div
                key={product.id}
                className="p-4 border rounded-md bg-red-50 text-red-500"
              >
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        {/* Header */}
        <h1 className="text-3xl text-center font-bold mb-6">Nettbutikk</h1>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Søk etter produkter..."
            onSearch={handleSearch}
            className="w-full sm:w-auto"
          />
          <div className="flex items-center gap-4">
            <FilterDropdown
              filter={filter}
              setFilter={setFilter}
              options={getCategoryOptions()}
              ariaLabel="Filter by category"
              placeholder="Velg kategori"
            />
            <CartIcon />
          </div>
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}
