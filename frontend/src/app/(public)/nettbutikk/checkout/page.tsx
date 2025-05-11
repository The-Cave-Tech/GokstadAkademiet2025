"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { useCart } from '@/lib/context/shopContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { formatPrice } from '@/lib/adapters/cardAdapter';
import BackButton from '@/components/BackButton';
import { FaCheckCircle } from 'react-icons/fa';

// Steg i utsjekk-prosessen
enum CheckoutStep {
  SHIPPING = 1,
  PAYMENT = 2,
  CONFIRMATION = 3,
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cart, clearCart } = useCart();
  
  // State for utsjekk-prosessen
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.SHIPPING);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for leveringsinformasjon
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    postalCode: '',
    city: '',
    email: '',
    phone: ''
  });
  
  // State for betalingsmetode
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  
  // State for vilkår og betingelser
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Sjekk om brukeren er innlogget og at det finnes produkter i handlekurven
  useEffect(() => {
    const checkRequirements = async () => {
      setIsLoading(true);
      
      try {
        // Sjekk om brukeren er innlogget
        if (!isAuthenticated) {
          router.push(`/login?redirect=${encodeURIComponent("/nettbutikk/checkout")}`);
          return;
        }
        
        // Sjekk om handlekurven har varer
        if (!cart?.items || cart.items.length === 0) {
          router.push('/nettbutikk/cart');
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
  }, [isAuthenticated, router, cart]);

  // Håndter endringer i leveringsskjema
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Håndter endringer i betalingsskjema
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Valider leveringsinformasjon
  const validateShippingInfo = () => {
    const { fullName, address, postalCode, city, email } = shippingInfo;
    if (!fullName || !address || !postalCode || !city || !email) {
      setError('Vennligst fyll ut alle påkrevde felt');
      return false;
    }
    
    // Enkel e-postvalidering
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Vennligst oppgi en gyldig e-postadresse');
      return false;
    }
    
    // Enkel postnummervalidering (4 siffer for Norge)
    if (!/^\d{4}$/.test(postalCode)) {
      setError('Postnummeret må bestå av 4 siffer');
      return false;
    }
    
    return true;
  };

  // Valider betalingsinformasjon
  const validatePaymentInfo = () => {
    if (paymentMethod === 'card') {
      const { cardNumber, cardHolder, expiryDate, cvv } = cardInfo;
      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        setError('Vennligst fyll ut alle påkrevde felt');
        return false;
      }
      
      // Enkel validering av kortnummer (fjern mellomrom og sjekk lengde)
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        setError('Kortnummeret må være 16 siffer');
        return false;
      }
      
      // Enkel validering av utløpsdato (MM/YY format)
      if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        setError('Utløpsdato må være på formatet MM/ÅÅ');
        return false;
      }
      
      // Enkel validering av CVV (3-4 siffer)
      if (!/^\d{3,4}$/.test(cvv)) {
        setError('CVV må være 3 eller 4 siffer');
        return false;
      }
    }
    
    return true;
  };
  
  // Valider at vilkår er akseptert
  const validateTerms = () => {
    if (!acceptTerms) {
      setError('Du må akseptere vilkårene for å fortsette');
      return false;
    }
    return true;
  };

  // Gå til neste steg
  const nextStep = () => {
    setError(null);
    
    if (currentStep === CheckoutStep.SHIPPING) {
      if (validateShippingInfo()) {
        setCurrentStep(CheckoutStep.PAYMENT);
      }
    } else if (currentStep === CheckoutStep.PAYMENT) {
      if (validatePaymentInfo()) {
        setCurrentStep(CheckoutStep.CONFIRMATION);
      }
    }
  };

  // Gå tilbake til forrige steg
  const prevStep = () => {
    setError(null);
    if (currentStep > CheckoutStep.SHIPPING) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Send bestilling
  const placeOrder = async () => {
    if (!validateTerms()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Her ville du normalt sende bestillingen til API-et
      // Simuler API-kall med en timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Tøm handlekurven
      await clearCart();
      
      // Redirect til en ordrebekreftelses-side
      router.push('/nettbutikk/order-confirmation');
      
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Kunne ikke fullføre bestillingen. Vennligst prøv igjen.');
      setIsSubmitting(false);
    }
  };

  // Beregn totaler
  const subtotal = cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const shipping = subtotal >= 1000 ? 0 : 79; // Gratis frakt over 1000 NOK
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[300px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Steg 1: Leveringsinformasjon
  if (currentStep === CheckoutStep.SHIPPING) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center">Utsjekk</h1>
          <div className="flex justify-center mt-4">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center">1</div>
              <div className="text-sm ml-2">Levering</div>
            </div>
            <div className="w-16 h-1 bg-gray-300 mx-2"></div>
            <div className="flex items-center">
              <div className="bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center">2</div>
              <div className="text-sm text-gray-600 ml-2">Betaling</div>
            </div>
            <div className="w-16 h-1 bg-gray-300 mx-2"></div>
            <div className="flex items-center">
              <div className="bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center">3</div>
              <div className="text-sm text-gray-600 ml-2">Bekreftelse</div>
            </div>
          </div>
        </div>
        
        {error && <ErrorMessage message={error} className="mb-6" />}
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Leveringsinformasjon</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Fullt navn *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleShippingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postnummer *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={handleShippingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Sted *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-post *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <Link href="/nettbutikk/cart" className="text-blue-600 hover:text-blue-800">
                Tilbake til handlekurv
              </Link>
              
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Fortsett til betaling
              </button>
            </div>
          </div>
          
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium mb-4">Ordresammendrag</h2>
              
              <div className="border-t border-b py-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cart?.items?.length || 0} varer)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frakt</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between font-medium text-lg my-4">
                <span>Totalt</span>
                <span className="text-blue-600">{formatPrice(total)}</span>
              </div>
              
              <div className="mt-4 text-sm border-t pt-4">
                <h3 className="font-medium mb-2">Bestilte varer:</h3>
                <ul className="space-y-2 text-gray-600">
                  {cart?.items?.map((item, i) => (
                    <li key={i} className="flex justify-between">
                      <span>
                        {item.title} ({item.quantity}x)
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Steg 2: Betalingsinformasjon
  if (currentStep === CheckoutStep.PAYMENT) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center">Utsjekk</h1>
          <div className="flex justify-center mt-4">
            <div className="flex items-center">
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center">✓</div>
              <div className="text-sm ml-2">Levering</div>
            </div>
            <div className="w-16 h-1 bg-blue-600 mx-2"></div>
            <div className="flex items-center">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center">2</div>
              <div className="text-sm ml-2">Betaling</div>
            </div>
            <div className="w-16 h-1 bg-gray-300 mx-2"></div>
            <div className="flex items-center">
              <div className="bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center">3</div>
              <div className="text-sm text-gray-600 ml-2">Bekreftelse</div>
            </div>
          </div>
        </div>
        
        {error && <ErrorMessage message={error} className="mb-6" />}
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Betalingsinformasjon</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Velg betalingsmetode:
                  </label>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span>Kredittkort</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="vipps"
                        checked={paymentMethod === 'vipps'}
                        onChange={() => setPaymentMethod('vipps')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span>Vipps</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="invoice"
                        checked={paymentMethod === 'invoice'}
                        onChange={() => setPaymentMethod('invoice')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span>Faktura (14 dagers betalingsfrist)</span>
                    </label>
                  </div>
                </div>
                
                {paymentMethod === 'card' && (
                  <div className="pt-4 space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Kortnummer *
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={cardInfo.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                        Kortinnehaver *
                      </label>
                      <input
                        type="text"
                        id="cardHolder"
                        name="cardHolder"
                        value={cardInfo.cardHolder}
                        onChange={handlePaymentChange}
                        placeholder="Ola Nordmann"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Utløpsdato *
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={cardInfo.expiryDate}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={cardInfo.cvv}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'vipps' && (
                  <div className="pt-4">
                    <p className="text-gray-700">
                      Du vil bli videresendt til Vipps for å fullføre betalingen etter at du har bekreftet bestillingen.
                    </p>
                  </div>
                )}
                
                {paymentMethod === 'invoice' && (
                  <div className="pt-4">
                    <p className="text-gray-700">
                      Faktura vil bli sendt til din e-postadresse. Betalingsfrist er 14 dager fra bestillingsdato.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={prevStep}
                className="text-blue-600 hover:text-blue-800"
              >
                Tilbake til leveringsinformasjon
              </button>
              
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Fortsett til bekreftelse
              </button>
            </div>
          </div>
          
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium mb-4">Ordresammendrag</h2>
              
              <div className="border-t border-b py-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cart?.items?.length || 0} varer)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frakt</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between font-medium text-lg my-4">
                <span>Totalt</span>
                <span className="text-blue-600">{formatPrice(total)}</span>
              </div>
              
              <div className="mt-4 text-sm border-t pt-4">
                <h3 className="font-medium mb-2">Leveringsadresse:</h3>
                <address className="not-italic text-gray-600">
                  {shippingInfo.fullName}<br />
                  {shippingInfo.address}<br />
                  {shippingInfo.postalCode} {shippingInfo.city}<br />
                  {shippingInfo.email}<br />
                  {shippingInfo.phone && <>{shippingInfo.phone}</>}
                </address>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Steg 3: Bekreftelse
  if (currentStep === CheckoutStep.CONFIRMATION) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center">Bekreft bestilling</h1>
          <div className="flex justify-center mt-4">
            <div className="flex items-center">
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center">✓</div>
              <div className="text-sm ml-2">Levering</div>
            </div>
            <div className="w-16 h-1 bg-green-600 mx-2"></div>
            <div className="flex items-center">
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center">✓</div>
              <div className="text-sm ml-2">Betaling</div>
            </div>
            <div className="w-16 h-1 bg-blue-600 mx-2"></div>
            <div className="flex items-center">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center">3</div>
              <div className="text-sm ml-2">Bekreftelse</div>
            </div>
          </div>
        </div>
        
        {error && <ErrorMessage message={error} className="mb-6" />}
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Gjennomgang av bestilling</h2>
              
              <div className="space-y-6">
                {/* Produkter */}
                <div>
                  <h3 className="font-medium mb-3">Produkter</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Produkt
                          </th>
                          <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Antall
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sum
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cart?.items?.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                              {item.product.title}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-800">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-800">
                              {formatPrice(item.subtotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Leveringsinformasjon */}
                  <div>
                    <h3 className="font-medium mb-3">Leveringsinformasjon</h3>
                    <div className="bg-gray-50 border rounded-md p-4">
                      <address className="not-italic text-gray-700">
                        <strong>{shippingInfo.fullName}</strong><br />
                        {shippingInfo.address}<br />
                        {shippingInfo.postalCode} {shippingInfo.city}<br />
                        {shippingInfo.email}<br />
                        {shippingInfo.phone && <>{shippingInfo.phone}</>}
                      </address>
                    </div>
                  </div>
                  
                  {/* Betalingsinformasjon */}
                  <div>
                    <h3 className="font-medium mb-3">Betalingsinformasjon</h3>
                    <div className="bg-gray-50 border rounded-md p-4">
                      <p className="text-gray-700">
                        <strong>Betalingsmetode:</strong><br />
                        {paymentMethod === 'card' && (
                          <>
                            Kredittkort (xxxx xxxx xxxx {cardInfo.cardNumber.slice(-4)})<br />
                            Utløpsdato: {cardInfo.expiryDate}
                          </>
                        )}
                        {paymentMethod === 'vipps' && 'Vipps'}
                        {paymentMethod === 'invoice' && 'Faktura (14 dagers betalingsfrist)'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Vilkår og betingelser */}
                <div className="pt-4 border-t">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="h-4 w-4 text-blue-600"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      Jeg godtar <Link href="/vilkår" className="text-blue-600 hover:underline">vilkår og betingelser</Link> for kjøp
                    </span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={prevStep}
                className="text-blue-600 hover:text-blue-800"
              >
                Tilbake til betaling
              </button>
              
              <button
                onClick={placeOrder}
                disabled={isSubmitting || !acceptTerms}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="small" color="white" className="mr-2" />
                    Behandler...
                  </>
                ) : (
                  'Bekreft og betal'
                )}
              </button>
            </div>
          </div>
          
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium mb-4">Ordresammendrag</h2>
              
              <div className="border-t border-b py-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cart?.items?.length || 0} varer)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frakt</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between font-medium text-lg my-4">
                <span>Totalt å betale</span>
                <span className="text-blue-600">{formatPrice(total)}</span>
              </div>
              
              <div className="mt-6 text-sm text-gray-600 space-y-2">
                <p>
                  <span className="font-medium">Leveringstid:</span> 2-5 virkedager
                </p>
                <p>
                  <span className="font-medium">Returfrist:</span> 14 dager
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
}