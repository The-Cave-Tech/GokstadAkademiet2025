// src/app/(public)/nettbutikk/checkout/layout.tsx
import { CheckoutProvider } from '@/lib/context/CheckoutContext';

type CheckoutLayoutProps = {
  children: React.ReactNode;
};

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  return (
    <CheckoutProvider>
      {children}
    </CheckoutProvider>
  );
}