// src/app/(public)/nettbutikk/checkout/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { PageIcons } from "@/components/ui/custom/PageIcons";

/**
 * Root checkout-side
 * Omdirigerer til shipping-steget med en jevn overgang
 */
export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Middleware håndterer allerede autentiseringssjekker
    // Bruk replace for å unngå å legge til i historikk-stacken
    const timeout = setTimeout(() => {
      router.replace("/nettbutikk/checkout/shipping");
    }, 300);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-16">
      <Card>
        <CardBody className="flex flex-col items-center justify-center py-12">
          <div aria-live="polite" aria-busy="true">
            <PageIcons
              name="loading"
              directory="profileIcons"
              size={40}
              alt=""
              className="animate-spin mb-4"
            />
            <h1 className="text-xl font-medium text-gray-700">
              Forbereder utsjekk...
            </h1>
            <p className="text-gray-500 mt-2">
              Vennligst vent mens vi gjør klar utsjekksprosessen.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}