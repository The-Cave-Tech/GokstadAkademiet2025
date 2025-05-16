// src/app/(public)/nettbutikk/checkout/[step]/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/lib/context/shopContext";
import { useHydration } from "@/hooks/useHydration";
import LoadingCheckout from "@/components/pageSpecificComponents/checkout/LoadingCheckout";
import ShippingPage from "../shipping/ShippingForm";
import PaymentPage from "../payment/PaymentForm";
import ConfirmationPage from "../confirmation/ConfirmationForm";

export default function CheckoutStepPage() {
  const hasHydrated = useHydration();
  const params = useParams();
  const router = useRouter();
  const { cart } = useCart();
  
  const step = params.step as string;
  const validSteps = ["shipping", "payment", "confirmation"];

  // Vis loading når komponenten ikke er hydrated
  if (!hasHydrated) {
    return <LoadingCheckout />;
  }

  // Sjekk om handlekurven er tom
  if (!cart?.items || cart.items.length === 0) {
    router.replace("/nettbutikk/cart");
    return <LoadingCheckout />;
  }

  // Sjekk om steg er gyldig
  if (!validSteps.includes(step)) {
    router.replace("/nettbutikk/checkout/shipping");
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
      return <LoadingCheckout />;
  }
}