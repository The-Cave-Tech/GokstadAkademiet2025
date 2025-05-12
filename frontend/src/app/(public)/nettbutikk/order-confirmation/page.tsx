// src/app/(public)/nettbutikk/order-confirmation/page.tsx
"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/custom/Button';
import PageIcons from '@/components/ui/custom/PageIcons';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/shopContext';

export default function OrderConfirmationPage() {
  // Generate a random order number
  const orderNumber = `ORD-${Date.now().toString().substring(6)}-${Math.floor(Math.random() * 1000)}`;
  const router = useRouter();
  const { cart } = useCart();
  
  // Redirect to homepage if there's no cart or if order wasn't placed
  useEffect(() => {
    if (cart && cart.items && cart.items.length > 0) {
      // If cart still has items, it means the order wasn't placed
      router.push('/nettbutikk/checkout/shipping');
    }
  }, [cart, router]);

  return (
    <main className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex flex-col items-center">
          <div className="mb-4 text-green-500">
            <PageIcons 
              name="check-circle" 
              directory="shopIcons" 
              size={64} 
              alt="" 
              aria-hidden="true"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Takk for din bestilling!</h1>
          <p className="text-gray-600 text-lg">
            Din ordre er nå bekreftet og vil bli behandlet så snart som mulig.
          </p>
        </CardHeader>
        
        <CardBody>
          <div className="border-t border-b py-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Ordrenummer:</span>
              <span className="text-blue-600 font-bold">{orderNumber}</span>
            </div>
            <p className="text-gray-600 text-sm">
              Du vil motta en e-post med ordrebekreftelse og følgenummer.
            </p>
          </div>
          
          <div className="space-y-6 mb-8">
            <section aria-labelledby="order-details-heading">
              <h2 id="order-details-heading" className="text-lg font-medium mb-3">Ordredetaljer</h2>
              <div className="bg-gray-50 rounded-md p-4">
                <p className="mb-1">Ordren vil bli sendt til leveringsadressen du oppga.</p>
                <p className="mb-1">Forventet leveringstid: <strong>2-5 virkedager</strong></p>
                <p>Returfrist: <strong>14 dager</strong> fra mottak av varer</p>
              </div>
            </section>
            
            <section aria-labelledby="next-steps-heading">
              <h2 id="next-steps-heading" className="text-lg font-medium mb-3">Hva skjer nå?</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 pl-2">
                <li>Vi behandler din bestilling (normalt innen 24 timer)</li>
                <li>Vi sender varene til deg så snart de er klare</li>
                <li>Du får en e-post med sporingsinformasjon</li>
                <li>Varen leveres til din oppgitte adresse</li>
              </ol>
            </section>
          </div>
        </CardBody>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/mine-bestillinger" passHref>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              ariaLabel="Se mine bestillinger"
            >
              Se mine bestillinger
            </Button>
          </Link>
          
          <Link href="/nettbutikk" passHref>
            <Button
              variant="primary"
              className="w-full sm:w-auto"
              ariaLabel="Fortsett å handle"
            >
              Fortsett å handle
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}