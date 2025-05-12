// src/lib/context/CheckoutContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

type ShippingInfo = {
  fullName: string;
  address: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
};

type CardInfo = {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
};

type ValidationResult = {
  valid: boolean;
  error?: string;
  errors?: Record<string, string[]>;
};

type CheckoutContextType = {
  // Shipping
  shippingInfo: ShippingInfo;
  setShippingInfo: (info: ShippingInfo) => void;
  validateShippingInfo: () => ValidationResult;
  
  // Payment
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  cardInfo: CardInfo;
  setCardInfo: (info: CardInfo) => void;
  validatePaymentInfo: () => ValidationResult;
  
  // Terms
  acceptTerms: boolean;
  setAcceptTerms: (accept: boolean) => void;
  validateTerms: () => boolean;
};

const defaultShippingInfo: ShippingInfo = {
  fullName: '',
  address: '',
  postalCode: '',
  city: '',
  email: '',
  phone: ''
};

const defaultCardInfo: CardInfo = {
  cardNumber: '',
  cardHolder: '',
  expiryDate: '',
  cvv: ''
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  // State for shipping information
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(defaultShippingInfo);
  
  // State for payment information
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [cardInfo, setCardInfo] = useState<CardInfo>(defaultCardInfo);
  
  // State for terms acceptance
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  
  // Sjekk om brukeren er autentisert når konteksten lastes
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin?redirect=/nettbutikk/checkout/shipping&message=Du må være logget inn for å få tilgang til utsjekk.');
    }
  }, [isAuthenticated, router]);
  
  // Validate shipping information
  const validateShippingInfo = (): ValidationResult => {
    const { fullName, address, postalCode, city, email } = shippingInfo;
    const errors: Record<string, string[]> = {};
    
    if (!fullName) errors.fullName = ['Vennligst oppgi fullt navn'];
    if (!address) errors.address = ['Vennligst oppgi adresse'];
    
    if (!postalCode) {
      errors.postalCode = ['Vennligst oppgi postnummer'];
    } else if (!/^\d{4}$/.test(postalCode)) {
      errors.postalCode = ['Postnummeret må bestå av 4 siffer'];
    }
    
    if (!city) errors.city = ['Vennligst oppgi sted'];
    
    if (!email) {
      errors.email = ['Vennligst oppgi e-post'];
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        errors.email = ['Vennligst oppgi en gyldig e-postadresse'];
      }
    }
    
    if (Object.keys(errors).length > 0) {
      return { valid: false, errors };
    }
    
    return { valid: true };
  };
  
  // Validate payment information
  const validatePaymentInfo = (): ValidationResult => {
    if (paymentMethod === 'card') {
      const { cardNumber, cardHolder, expiryDate, cvv } = cardInfo;
      const errors: Record<string, string[]> = {};
      
      if (!cardNumber) {
        errors.cardNumber = ['Vennligst oppgi kortnummer'];
      } else if (cardNumber.replace(/\s/g, '').length !== 16) {
        errors.cardNumber = ['Kortnummeret må være 16 siffer'];
      }
      
      if (!cardHolder) errors.cardHolder = ['Vennligst oppgi kortinnehaver'];
      
      if (!expiryDate) {
        errors.expiryDate = ['Vennligst oppgi utløpsdato'];
      } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        errors.expiryDate = ['Utløpsdato må være på formatet MM/ÅÅ'];
      }
      
      if (!cvv) {
        errors.cvv = ['Vennligst oppgi CVV'];
      } else if (!/^\d{3,4}$/.test(cvv)) {
        errors.cvv = ['CVV må være 3 eller 4 siffer'];
      }
      
      if (Object.keys(errors).length > 0) {
        return { valid: false, errors };
      }
    }
    
    return { valid: true };
  };
  
  // Validate terms acceptance
  const validateTerms = (): boolean => {
    return acceptTerms;
  };
  
  return (
    <CheckoutContext.Provider 
      value={{ 
        shippingInfo, 
        setShippingInfo, 
        validateShippingInfo,
        paymentMethod, 
        setPaymentMethod, 
        cardInfo, 
        setCardInfo,
        validatePaymentInfo,
        acceptTerms, 
        setAcceptTerms,
        validateTerms
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}