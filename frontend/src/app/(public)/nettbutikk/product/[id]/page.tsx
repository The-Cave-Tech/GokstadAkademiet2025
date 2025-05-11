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
import { FaStar, FaTag, FaBoxOpen } from "react-icons/fa";
import Link from "next/link";
import { formatPrice } from "@/lib/adapters/cardAdapter";
import BackButton from "@/components/BackButton";
import { useCart } from "@/lib/context/shopContext";

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
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
            .filter(
              (p) =>
                p.category === foundProduct.category && p.id !== foundProduct.id
            )
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
      }, quantity);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Product not found" />;

  // Calculate discount percentage if applicable
  const discountPercentage = product.discountedPrice
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100
      )
    : 0;

  return (
    <div className="bg-white min-h-screen">
      {/* Back button */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <BackButton />
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar - Product Info */}
          <div className="md:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              {/* Product Image and Name */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200 mb-4 relative">
                  {product.productImage?.url ? (
                    <Image
                      src={product.productImage.url}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-gray-400">
                      {product.title.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-center">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {`ID: ${product.id}`}
                </p>
              </div>

              {/* Product Info */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-2">
                  Produktinformasjon
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <MdCategory className="text-gray-500" />
                    <span>{product.category || "Ikke kategorisert"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaBoxOpen className="text-gray-500" />
                    <span>
                      {product.stock > 0
                        ? `${product.stock} på lager`
                        : "Ikke på lager"}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Price Section */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="font-medium text-gray-700 mb-2">Pris</h4>
                {product.discountedPrice ? (
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-green-600">
                      {formatPrice(product.discountedPrice)}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs">
                        {discountPercentage}% RABATT
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-gray-800">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Add to Cart Section */}
              {product.stock > 0 && (
                <div className="mt-6">
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
                  {/* Add to Cart Button */}
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MdShoppingBasket className="text-lg" />
                    <span>Legg i handlekurv</span>
                  </button>
                </div>
              )}

              {/* Product Metadata */}
              <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                {product.publishedAt && (
                  <p>Publisert: {formatDate(product.publishedAt)}</p>
                )}
                {product.createdAt && (
                  <p>Opprettet: {formatDate(product.createdAt)}</p>
                )}
                {product.updatedAt && (
                  <p>Sist oppdatert: {formatDate(product.updatedAt)}</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:w-3/4">
            {/* Product Title and Header */}
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                {product.title}
              </h1>
              <div className="text-sm text-red-500 mt-2 tracking-wider uppercase">
                PRODUKT • {product.category || "UKATEGORISERT"} •{" "}
                {formatDate(product.publishedAt || product.createdAt || "")}
              </div>
            </div>

            {/* Product Status Banner */}
            {product.stock <= 0 && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center gap-2">
                <FaBoxOpen />
                <span>Dette produktet er midlertidig utsolgt</span>
              </div>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <div className="bg-yellow-100 text-yellow-700 px-4 py-3 rounded-md mb-6 flex items-center gap-2">
                <FaBoxOpen />
                <span>Kun {product.stock} igjen på lager!</span>
              </div>
            )}

            {/* Product Description */}
            {product.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">
                  Produktbeskrivelse
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Specifications Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Spesifikasjoner
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 text-gray-500 font-medium">
                        Kategori
                      </td>
                      <td className="py-3">
                        {product.category || "Ikke spesifisert"}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 text-gray-500 font-medium">
                        Tilgjengelighet
                      </td>
                      <td className="py-3">
                        {product.stock > 0 ? "På lager" : "Ikke på lager"}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 text-gray-500 font-medium">Pris</td>
                      <td className="py-3">
                        {product.discountedPrice ? (
                          <>
                            <span className="text-green-600 font-medium">
                              {formatPrice(product.discountedPrice)}
                            </span>{" "}
                            <span className="text-gray-500 line-through text-sm">
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          formatPrice(product.price)
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Related Products section */}
            {relatedProducts.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Lignende produkter
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <Link
                      href={`/nettbutikk/product/${relatedProduct.id}`}
                      key={relatedProduct.id}
                      className="group"
                    >
                      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-40 relative bg-gray-200">
                          {relatedProduct.productImage?.url ? (
                            <Image
                              src={relatedProduct.productImage.url}
                              alt={relatedProduct.title}
                              fill
                              className="object-cover group-hover:opacity-90 transition-opacity"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-gray-400">
                              {relatedProduct.title.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                            {relatedProduct.title}
                          </h3>
                          <div className="mt-2">
                            {relatedProduct.discountedPrice ? (
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-green-600">
                                  {formatPrice(relatedProduct.discountedPrice)}
                                </span>
                                <span className="text-gray-500 line-through text-sm">
                                  {formatPrice(relatedProduct.price)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-bold">
                                {formatPrice(relatedProduct.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
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
