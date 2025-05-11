"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MdShoppingCart, MdRemoveShoppingCart, MdShoppingBasket } from 'react-icons/md';
import { useCart } from '@/lib/context/shopContext';
import { useAuth } from '@/lib/context/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatPrice } from '@/lib/adapters/cardAdapter';
import BackButton from '@/components/BackButton';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 1000 ? 0 : 79; // Free shipping over 1000 NOK
  const total = subtotal + shipping;

  // Handle quantity change
  const handleQuantityChange = (itemId: string | number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    try {
      updateQuantity(itemId, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle checkout button click
  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent("/nettbutikk/checkout")}`);
      return;
    }
    
    router.push('/nettbutikk/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-3xl font-bold">Handlekurv</h1>
        <MdShoppingCart className="ml-2 text-3xl text-blue-600" />
      </div>
      
      {isUpdating && (
        <div className="mb-6 flex justify-center">
          <LoadingSpinner size="small" />
        </div>
      )}
      
      {!cart.items || cart.items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MdRemoveShoppingCart className="mx-auto text-6xl text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Handlekurven din er tom</h2>
          <p className="text-gray-600 mb-6">Legg til produkter for å komme i gang</p>
          <Link 
            href="/nettbutikk" 
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
          >
            <MdShoppingBasket className="mr-2" />
            Se butikk
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produkt
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Antall
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pris
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sum
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span className="sr-only">Fjern</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cart.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-100 mr-4">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.title}
                                width={48}
                                height={48}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-500 font-bold">
                                {item.title.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <Link 
                              href={`/nettbutikk/product/${item.id}`}
                              className="text-sm font-medium text-gray-900 hover:text-blue-600"
                            >
                              {item.title}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center">
                          <div className="flex border border-gray-300 rounded">
                            <button 
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isUpdating}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                            >
                              -
                            </button>
                            <div className="w-12 text-center py-1 border-x border-gray-300">
                              {item.quantity}
                            </div>
                            <button 
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={isUpdating}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          disabled={isUpdating}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          Fjern
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => clearCart()}
                disabled={isUpdating}
                className="text-red-600 hover:text-red-900 disabled:opacity-50"
              >
                Tøm handlekurv
              </button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Ordresammendrag</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Frakt</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                  </span>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-bold">
                    <span>Totalt</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  
                  {subtotal >= 1000 && (
                    <p className="text-green-600 text-sm mt-2">
                      Du har kvalifisert til gratis frakt!
                    </p>
                  )}
                  
                  {subtotal > 0 && subtotal < 1000 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Handlekurven din er {formatPrice(1000 - subtotal)} unna gratis frakt
                    </p>
                  )}
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={cart.items.length === 0}
                  className="w-full mt-4 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <MdShoppingBasket className="mr-2" />
                  Gå til kassen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
