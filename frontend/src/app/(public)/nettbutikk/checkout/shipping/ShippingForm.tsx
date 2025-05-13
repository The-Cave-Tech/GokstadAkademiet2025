// src/app/(public)/nettbutikk/checkout/shipping/ShippingForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/lib/context/CheckoutContext";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/custom/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import ShippingForm from "@/components/checkout/ShippingForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import BackButton from "@/components/ui/BackButton";

export default function ShippingPage() {
  const router = useRouter();
  const { shippingInfo, setShippingInfo, validateShippingInfo } = useCheckout();

  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const nextStep = () => {
    setError(null);
    setErrors({});

    const validation = validateShippingInfo();
    if (validation.valid) {
      router.push("/nettbutikk/checkout/payment");
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
          <CheckoutSteps currentStep={1} />
        </CardHeader>

        <CardBody>
          {error && <ErrorMessage message={error} />}

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <Card className="h-full">
                <CardHeader>
                  <h2 id="shipping-heading" className="text-xl font-semibold">
                    Leveringsinformasjon
                  </h2>
                </CardHeader>

                <CardBody>
                  <ShippingForm
                    shippingInfo={shippingInfo}
                    onChange={handleShippingChange}
                    errors={errors}
                  />
                </CardBody>
              </Card>
            </div>

            <div className="md:w-1/3">
              <OrderSummary />
            </div>
          </div>
        </CardBody>

        <CardFooter className="flex justify-between items-center">
          <BackButton
            route="/nettbutikk/cart"
            className="flex bg-slate-400 p-2 text-white rounded-xl shadow-lg"
            iconClassName="mr-3"
            iconSize={20}
          >
            <span className="font-semibold">Tilbake til handlekurv</span>
          </BackButton>

          <Button
            variant="primary"
            onClick={nextStep}
            ariaLabel="Fortsett til betaling"
          >
            Fortsett til betaling
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
