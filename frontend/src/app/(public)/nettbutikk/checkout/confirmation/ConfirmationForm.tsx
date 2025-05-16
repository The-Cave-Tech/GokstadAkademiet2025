// src/app/(public)/nettbutikk/checkout/confirmation/ConfirmationForm.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/context/shopContext";
import { useCheckout } from "@/lib/context/CheckoutContext";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import PageIcons from "@/components/ui/custom/PageIcons";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import CheckoutSteps from "@/components/pageSpecificComponents/checkout/CheckoutSteps";
import OrderSummary from "@/components/pageSpecificComponents/checkout/OrderSummary";
import { formatPrice } from "@/lib/adapters/cardAdapter";
import BackButton from "@/components/ui/BackButton";

export default function ConfirmationPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const {
    shippingInfo,
    paymentMethod,
    cardInfo,
    acceptTerms,
    setAcceptTerms,
    validateTerms,
    validateShippingInfo,
    validatePaymentInfo,
  } = useCheckout();

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verifiser tidligere steg er fullført
  useEffect(() => {
    const shippingValidation = validateShippingInfo();
    const paymentValidation = validatePaymentInfo();

    if (!shippingValidation.valid) {
      router.replace("/nettbutikk/checkout/shipping");
      return;
    }

    if (!paymentValidation.valid) {
      router.replace("/nettbutikk/checkout/payment");
      return;
    }
  }, [
    shippingInfo,
    paymentMethod,
    cardInfo,
    router,
    validateShippingInfo,
    validatePaymentInfo,
  ]);

  const handlePlaceOrder = async () => {
    if (!validateTerms()) {
      setError("Du må akseptere vilkårene for å fortsette");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Her ville du normalt sende bestillingen til API-et
      // Simuler API-kall med en timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Tøm handlekurven
      await clearCart();

      // Redirect til en ordrebekreftelses-side
      router.push("/nettbutikk/order-confirmation");
    } catch (err) {
      console.error("Error placing order:", err);
      setError("Kunne ikke fullføre bestillingen. Vennligst prøv igjen.");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold text-center">Bekreft bestilling</h1>
          <CheckoutSteps currentStep={3} />
        </CardHeader>

        <CardBody>
          {error && <ErrorMessage message={error} />}

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">
                    Gjennomgang av bestilling
                  </h2>
                </CardHeader>

                <CardBody className="space-y-6">
                  {/* Produkter */}
                  <section aria-labelledby="products-heading">
                    <h3 id="products-heading" className="font-medium mb-3">
                      Produkter
                    </h3>
                    <div className="border rounded-md overflow-hidden">
                      <table
                        className="min-w-full"
                        aria-describedby="products-heading"
                      >
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Produkt
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Antall
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Sum
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {cart?.items?.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                                {item.title}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-800">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">
                                {formatPrice(item.price * item.quantity)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Leveringsinformasjon */}
                    <section aria-labelledby="shipping-heading">
                      <h3 id="shipping-heading" className="font-medium mb-3">
                        Leveringsinformasjon
                      </h3>
                      <div className="bg-gray-50 border rounded-md p-4">
                        <address className="not-italic text-gray-700">
                          <strong>{shippingInfo.fullName}</strong>
                          <br />
                          {shippingInfo.address}
                          <br />
                          {shippingInfo.postalCode} {shippingInfo.city}
                          <br />
                          {shippingInfo.email}
                          <br />
                          {shippingInfo.phone && <>{shippingInfo.phone}</>}
                        </address>
                      </div>
                    </section>

                    {/* Betalingsinformasjon */}
                    <section aria-labelledby="payment-heading">
                      <h3 id="payment-heading" className="font-medium mb-3">
                        Betalingsinformasjon
                      </h3>
                      <div className="bg-gray-50 border rounded-md p-4">
                        <p className="text-gray-700">
                          <strong>Betalingsmetode:</strong>
                          <br />
                          {paymentMethod === "card" && (
                            <>
                              Kredittkort (xxxx xxxx xxxx{" "}
                              {cardInfo.cardNumber.slice(-4)})<br />
                              Utløpsdato: {cardInfo.expiryDate}
                            </>
                          )}
                          {paymentMethod === "vipps" && "Vipps"}
                          {paymentMethod === "invoice" &&
                            "Faktura (14 dagers betalingsfrist)"}
                        </p>
                      </div>
                    </section>
                  </div>

                  {/* Vilkår og betingelser */}
                  <section
                    aria-labelledby="terms-heading"
                    className="pt-4 border-t"
                  >
                    <h3 id="terms-heading" className="sr-only">
                      Vilkår og betingelser
                    </h3>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="h-4 w-4 text-blue-600"
                        required
                        aria-required="true"
                      />
                      <div className="flex gap-1 mt-3 justify-center flex-wrap text-center text-body-small text-typographySecondary">
                        <p>Ved å logge inn aksepterer du våre</p>
                        <Link
                          href="/bruksvilkar"
                          className="text-standard hover:text-standard-hover hover:underline"
                          target="_blank"
                        >
                          bruksvilkår
                        </Link>
                        <p>og</p>
                        <Link
                          href="/personvern"
                          className="text-standard hover:text-standard-hover hover:underline"
                          target="_blank"
                        >
                          personvernerklæring
                        </Link>
                      </div>
                    </div>
                  </section>
                </CardBody>
              </Card>
            </div>

            <div className="md:w-1/3">
              <OrderSummary
                shippingInfo={shippingInfo}
                paymentMethod={paymentMethod}
                paymentDetails={cardInfo}
                showShippingDetails={true}
                showPaymentDetails={true}
                showShippingInfo={true}
              />
            </div>
          </div>
        </CardBody>

        <CardFooter className="flex justify-between items-center">
          <BackButton
            route="/nettbutikk/checkout/payment"
            className="flex bg-slate-400 p-2 text-white rounded-xl shadow-lg"
            iconClassName="mr-3"
            iconSize={20}
          >
            <span className="font-semibold">Tilbake til betaling</span>
          </BackButton>

          <Button
            variant="primary"
            onClick={handlePlaceOrder}
            disabled={isSubmitting || !acceptTerms}
            className="bg-green-600 hover:bg-green-700"
            ariaLabel="Bekreft og betal"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <PageIcons
                  name="loading"
                  directory="profileIcons"
                  size={20}
                  alt=""
                  className="animate-spin mr-2"
                />
                Behandler...
              </span>
            ) : (
              "Bekreft og betal"
            )}
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
