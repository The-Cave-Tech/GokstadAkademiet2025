// src/app/(public)/nettbutikk/checkout/payment/PaymentForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/lib/context/CheckoutContext";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import CheckoutSteps from "@/components/features/checkout/CheckoutSteps";
import PaymentForm from "@/components/features/checkout/PaymentForm";
import OrderSummary from "@/components/features/checkout/OrderSummary";
import BackButton from "@/components/ui/BackButton";

export default function PaymentPage() {
  const router = useRouter();
  const {
    shippingInfo,
    paymentMethod,
    setPaymentMethod,
    cardInfo,
    setCardInfo,
    validatePaymentInfo,
    validateShippingInfo,
  } = useCheckout();

  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Sjekk om leveringsinformasjon er utfylt
  useEffect(() => {
    const shippingValidation = validateShippingInfo();
    if (!shippingValidation.valid) {
      router.replace("/nettbutikk/checkout/shipping");
    }
  }, [shippingInfo, router, validateShippingInfo]);

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo({ ...cardInfo, [name]: value });
  };

  const nextStep = () => {
    setError(null);
    setErrors({});

    const validation = validatePaymentInfo();
    if (validation.valid) {
      router.push("/nettbutikk/checkout/confirmation");
    } else if (validation.errors) {
      setErrors(validation.errors);
    } else {
      setError(validation.error || "Vennligst fyll ut alle påkrevde felt");
    }
  };

  return (
    <section className="container mx-auto px-4 py-8">

      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold text-center">Utsjekk</h1>
          <CheckoutSteps currentStep={2} />
        </CardHeader>

        <CardBody>
          {error && <ErrorMessage message={error} />}

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <Card className="h-full">
                <CardHeader>
                  <h2 id="payment-heading" className="text-xl font-semibold">
                    Betalingsinformasjon
                  </h2>
                </CardHeader>

                <CardBody>
                  <PaymentForm
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    cardInfo={cardInfo}
                    onChange={handlePaymentChange}
                    errors={errors}
                  />
                </CardBody>
              </Card>
            </div>

            <div className="md:w-1/3">
              <OrderSummary
                shippingInfo={shippingInfo}
                showShippingDetails={true}
              />
            </div>
          </div>
        </CardBody>

        <CardFooter className="flex justify-between items-center">
          <BackButton
            route="/nettbutikk/checkout/shipping"
            className="flex bg-slate-400 p-2 text-white rounded-xl shadow-lg"
            iconClassName="mr-3"
            iconSize={20}
          >
            <span className="font-semibold">Tilbake til levering</span>
          </BackButton>

          <Button
            variant="primary"
            onClick={nextStep}
            ariaLabel="Fortsett til bekreftelse"
          >
            Fortsett til bekreftelse
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
