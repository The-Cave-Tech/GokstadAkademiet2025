// app/(public)/nettbutikk/product/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { productService } from "@/lib/data/services/productService";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { ProductResponse } from "@/types/content.types";
import { MdCategory, MdShoppingBasket } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import { useCart } from "@/lib/context/shopContext";
import { formatPrice } from "@/lib/adapters/cardAdapter";
import BackButton from "@/components/BackButton";
import PageIcons from "@/components/ui/custom/PageIcons";

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart(); // Use the cart context
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<ProductResponse[]>([]);

  // Get the ID from params
  const productId = params.id as string;

  useEffect(() => {
    async function fetchProductDetails() {
      if (!productId) return;

      setIsLoading(true);
      setError(null);

      try {
        // First get all products
        const allProducts = await productService.getAll();

        // Find the specific product from the collection
        const numericId = parseInt(productId, 10);
        const foundProduct = allProducts.find((p) => p.id === numericId);

        if (!foundProduct) {
          throw new Error(`Product with ID ${productId} not found`);
        }

        setProduct(foundProduct);

        // Find related products (same category)
        if (foundProduct.category) {
          const related = allProducts
            .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
            .slice(0, 3); // Limit to 3 related products
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Could not load product details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProductDetails();
  }, [productId]);

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && (!product || value <= product.stock)) {
      setQuantity(value);
    }
  };

  // Increment quantity
  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.discountedPrice || product.price,
        image: product.productImage?.url,
      });

      alert(`${product.title} er lagt til i handlekurven!`);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Product not found" />;

  // Calculate discount percentage if applicable
  const discountPercentage = product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  return (
    <main className="bg-white min-h-screen">
      {/* Back button */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <BackButton />
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              {/* Product Image Banner */}
              <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-200 mb-6 relative">
                {product.productImage?.url ? (
                  <Image src={product.productImage.url} alt={product.title} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-gray-400">
                    {product.title.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <section>
                <h4 className="font-medium text-gray-700 mb-2">Produktinformasjon</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <MdCategory className="text-gray-500" />
                    <span>{product.category || "Ikke kategorisert"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaBoxOpen className="text-gray-500" />
                    <span>{product.stock > 0 ? `${product.stock} på lager` : "Ikke på lager"}</span>
                  </li>
                </ul>
              </section>

              {/* Price Section */}
              <section className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="font-medium text-gray-700 mb-2">Pris</h4>
                {product.discountedPrice ? (
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-green-600">{formatPrice(product.discountedPrice)}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-500 line-through">{formatPrice(product.price)}</span>
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs">
                        {discountPercentage}% RABATT
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-gray-800">{formatPrice(product.price)}</span>
                )}
              </section>

              {/* Add to Cart Section */}
              {product.stock > 0 && (
                <section className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-700">Antall:</span>
                    <div className="flex border border-gray-300 rounded">
                      <button
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        max={product.stock}
                        className="w-12 text-center border-x border-gray-300"
                      />
                      <button
                        onClick={incrementQuantity}
                        disabled={quantity >= product.stock}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <PageIcons name="cart" directory="shopIcons" size={24} alt="Handlekurv" />
                  </button>
                </section>
              )}
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="md:w-3/4">
            {/* Product Title and Header */}
            <header className="border-b border-gray-200 pb-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
              <div className="text-sm text-red-500 mt-2 tracking-wider uppercase">
                PRODUKT • {product.category || "UKATEGORISERT"} •{" "}
                {formatDate(product.publishedAt || product.createdAt || "")}
              </div>
            </header>

            {/* Product Description */}
            {product.description && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">
                  Produktbeskrivelse
                </h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </section>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
