"use client";

import React from 'react';
import Link from 'next/link';
import { FaCheckCircle, FaShoppingCart } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';

export default function OrderConfirmationPage() {
  // Generere et enkelt "ordrenummer" for demo-formål
  const orderNumber = `ORD-${Math.floor(Math.random() * 10000)}-${new Date().getFullYear()}`;
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <FaCheckCircle className="text-green-600 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Takk for din bestilling!</h1>
          <p className="text-gray-600">
            Din ordre er mottatt og er under behandling. 
          </p>
          <p className="text-gray-600 mt-1">
            Vi har sendt en bekreftelse til din e-post.
          </p>
        </div>
        
        <div className="border-t border-b py-4 mb-6">
          <div className="flex justify-between">
            <span className="font-medium">Ordrenummer:</span>
            <span>{orderNumber}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-medium">Bestillingsdato:</span>
            <span>{new Date().toLocaleDateString('no-NO')}</span>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-3">Hva skjer nå?</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Ordren din blir bekreftet og behandlet</li>
            <li>Vi pakker varene dine</li>
            <li>Varene sendes fra vårt lager (du vil motta en e-post med sporingsinformasjon)</li>
            <li>Du mottar bestillingen din om 2-5 virkedager</li>
          </ol>
        </div>
        
        <div className="mb-8 border-t pt-6">
          <h2 className="font-semibold text-lg mb-3">Trenger du hjelp?</h2>
          <p className="text-gray-700 mb-4">
            Har du spørsmål om din bestilling, ikke nøl med å kontakte oss:
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 border rounded-lg p-4 flex items-center gap-3">
              <MdEmail className="text-blue-600 text-xl" />
              <div>
                <h3 className="font-medium">E-post</h3>
                <a href="mailto:support@thecavetech.com" className="text-blue-600 hover:underline">
                  support@thecavetech.com
                </a>
              </div>
            </div>
            
            <div className="flex-1 border rounded-lg p-4 flex items-center gap-3">
              <MdPhone className="text-blue-600 text-xl" />
              <div>
                <h3 className="font-medium">Telefon</h3>
                <a href="tel:+4712345678" className="text-blue-600 hover:underline">
                  +47 12 34 56 78
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/nettbutikk" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaShoppingCart className="mr-2" />
            Fortsett å handle
          </Link>
        </div>
      </div>
    </div>
  );
}