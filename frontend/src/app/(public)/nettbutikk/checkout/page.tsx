// src/app/(public)/nettbutikk/checkout/page.tsx
import { redirect } from 'next/navigation';

export default function CheckoutPage() {
  redirect('/nettbutikk/checkout/shipping');
}