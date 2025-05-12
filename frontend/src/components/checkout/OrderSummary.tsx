// src/components/checkout/OrderSummary.tsx
"use client";

import { useCart } from '@/lib/context/shopContext';
import { formatPrice } from '@/lib/adapters/cardAdapter';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

type ShippingInfo = {
  fullName: string;
  address: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
};

type OrderSummaryProps = {
  shippingInfo?: ShippingInfo;
  paymentMethod?: string;
  paymentDetails?: any;
  showShippingDetails?: boolean;
  showPaymentDetails?: boolean;
  showShippingInfo?: boolean;
  className?: string;
};

export default function OrderSummary({
  shippingInfo,
  paymentMethod,
  paymentDetails,
  showShippingDetails = false,
  showPaymentDetails = false,
  showShippingInfo = false,
  className = '',
}: OrderSummaryProps) {
  const { cart } = useCart();
  
  // Beregn totaler
  const subtotal = cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const shipping = subtotal >= 1000 ? 0 : 79; // Gratis frakt over 1000 NOK
  const total = subtotal + shipping;
  
  return (
    <Card className={className}>
      <CardHeader>
        <h2 id="order-summary-heading" className="text-lg font-medium">Ordresammendrag</h2>
      </CardHeader>
      
      <CardBody>
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
          <span>Totalt{showShippingInfo ? ' å betale' : ''}</span>
          <span className="text-blue-600">{formatPrice(total)}</span>
        </div>
        
        {/* Items list */}
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
        
        {/* Shipping address */}
        {showShippingDetails && shippingInfo && (
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
        )}
        
        {/* Payment details */}
        {showPaymentDetails && paymentMethod && (
          <div className="mt-4 text-sm border-t pt-4">
            <h3 className="font-medium mb-2">Betalingsinformasjon:</h3>
            <div className="text-gray-600">
              <p><strong>Betalingsmetode:</strong></p>
              {paymentMethod === 'card' && paymentDetails && (
                <p>
                  Kredittkort (xxxx xxxx xxxx {paymentDetails.cardNumber?.slice(-4)})<br />
                  Utløpsdato: {paymentDetails.expiryDate}
                </p>
              )}
              {paymentMethod === 'vipps' && <p>Vipps</p>}
              {paymentMethod === 'invoice' && <p>Faktura (14 dagers betalingsfrist)</p>}
            </div>
          </div>
        )}
        
        {/* Shipping info */}
        {showShippingInfo && (
          <div className="mt-6 text-sm text-gray-600 space-y-2">
            <p>
              <span className="font-medium">Leveringstid:</span> 2-5 virkedager
            </p>
            <p>
              <span className="font-medium">Returfrist:</span> 14 dager
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}