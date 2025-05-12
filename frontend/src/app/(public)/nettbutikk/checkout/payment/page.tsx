// src/app/(public)/nettbutikk/checkout/payment/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useCart } from '@/lib/context/shopContext';
import { useCheckout } from '@/lib/context/CheckoutContext';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/custom/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import PaymentForm from '@/components/checkout/PaymentForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import LoadingCheckout from '@/components/checkout/LoadingCheckout';
import PageIcons from '@/components/ui/custom/PageIcons';

export default function PaymentPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cart } = useCart();
  const { 
    shippingInfo, 
    paymentMethod, 
    setPaymentMethod,
    cardInfo, 
    setCardInfo,
    validatePaymentInfo 
  } = useCheckout();
  
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkRequirements = async () => {
      try {
        // Check if user is authenticated
        if (!isAuthenticated) {
          router.push(`/signin?redirect=${encodeURIComponent("/nettbutikk/checkout/payment")}&message=Du må være logget inn for å få tilgang til utsjekk.`);
          return;
        }
        
        // Check if cart has items
        if (!cart?.items || cart.items.length === 0) {
          router.push('/nettbutikk/cart');
          return;
        }
        
        // Check if shipping info is provided
        if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.postalCode || !shippingInfo.city || !shippingInfo.email) {
          router.push('/nettbutikk/checkout/shipping');
          return;
        }
      } catch (err) {
        console.error('Error checking checkout requirements:', err);
        setError('Det oppstod en feil ved lasting av utsjekksinformasjon');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkRequirements();
  }, [isAuthenticated, router, cart, shippingInfo]);
  
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo({ ...cardInfo, [name]: value });
  };
  
  const nextStep = () => {
    setError(null);
    setErrors({});
    
    const validation = validatePaymentInfo();
    if (validation.valid) {
      router.push('/nettbutikk/checkout/confirmation');
    } else if (validation.errors) {
      setErrors(validation.errors);
    } else {
      setError(validation.error || 'Vennligst fyll ut alle påkrevde felt');
    }
  };
  
  const prevStep = () => {
    router.push('/nettbutikk/checkout/shipping');
  };
  
  if (isLoading) {
    return <LoadingCheckout />;
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="mb-4">
        <CardBody className="p-0">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            className="flex items-center gap-2"
            ariaLabel="Tilbake til leveringsinformasjon"
          >
            <PageIcons name="arrow-left" directory="shopIcons" size={18} alt="" />
            <span>Tilbake til leveringsinformasjon</span>
          </Button>
        </CardBody>
      </Card>
      
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold text-center">Utsjekk</h1>
          <CheckoutSteps currentStep={2} />
        </CardHeader>
        
        <CardBody>
          {error && <ErrorMessage message={error}/>}
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <Card className="h-full">
                <CardHeader>
                  <h2 id="payment-heading" className="text-xl font-semibold">Betalingsinformasjon</h2>
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
          <Button 
            variant="outline" 
            onClick={prevStep}
            ariaLabel="Tilbake til leveringsinformasjon"
          >
            Tilbake til leveringsinformasjon
          </Button>
          
          <Button
            variant="primary"
            onClick={nextStep}
            ariaLabel="Fortsett til bekreftelse"
          >
            Fortsett til bekreftelse
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}