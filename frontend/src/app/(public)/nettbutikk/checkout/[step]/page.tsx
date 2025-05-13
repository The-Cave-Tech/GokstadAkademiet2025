// src/app/(public)/nettbutikk/checkout/[step]/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/lib/context/shopContext";
import LoadingCheckout from "@/components/checkout/LoadingCheckout";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import ShippingPage from "../shipping/ShippingForm";
import PaymentPage from "../payment/PaymentForm";
import ConfirmationPage from "../confirmation/ConfirmationForm";


/**
 * Dynamisk rute-komponent for checkout-prosessen
 * Håndterer visning av riktig checkout-steg basert på URL-parameter
 */
export default function CheckoutStepPage() {
  const params = useParams();
  const router = useRouter();
  const { cart } = useCart();

  const step = params.step as string;
  const validSteps = ["shipping", "payment", "confirmation"];

  // Sjekk om handlekurven er tom og om steg er gyldig
  useEffect(() => {
    // Redirect hvis handlekurven er tom
    if (!cart?.items || cart.items.length === 0) {
      router.replace("/nettbutikk/cart");
      return;
    }

    // Redirect hvis steg er ugyldig
    if (!validSteps.includes(step)) {
      router.replace("/nettbutikk/checkout/shipping");
    }
  }, [step, router, cart]);

  // Vis lasteskjerm mens vi validerer eller omdirigerer
  if (!validSteps.includes(step) || !cart?.items || cart.items.length === 0) {
    return <LoadingCheckout />;
  }

  // Vis riktig komponent basert på steg
  switch (step) {
    case "shipping":
      return <ShippingPage />;
    case "payment":
      return <PaymentPage />;
    case "confirmation":
      return <ConfirmationPage />;
    default:
      return (
        <div className="container mx-auto px-4 py-8" role="alert">
          <ErrorMessage message="Ukjent steg i utsjekk-prosessen" />
        </div>
      );
  }
}