// src/components/checkout/PaymentForm.tsx
type CardInfo = {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
};

type PaymentFormProps = {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  cardInfo: CardInfo;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Record<string, string[]>;
};

export default function PaymentForm({ 
  paymentMethod, 
  setPaymentMethod,
  cardInfo,
  onChange,
  errors = {}
}: PaymentFormProps) {
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  
  return (
    <div className="space-y-6" role="group" aria-labelledby="payment-heading">
      <div>
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-3">
            Velg betalingsmetode:
          </legend>
          
          <div className="space-y-3">
            <PaymentOption 
              value="card" 
              label="Kredittkort" 
              selected={paymentMethod === 'card'} 
              onChange={() => setPaymentMethod('card')} 
            />
            
            <PaymentOption 
              value="vipps" 
              label="Vipps" 
              selected={paymentMethod === 'vipps'} 
              onChange={() => setPaymentMethod('vipps')} 
            />
            
            <PaymentOption 
              value="invoice" 
              label="Faktura (14 dagers betalingsfrist)" 
              selected={paymentMethod === 'invoice'} 
              onChange={() => setPaymentMethod('invoice')} 
            />
          </div>
        </fieldset>
      </div>
      
      {paymentMethod === 'card' && (
        <div className="pt-4 space-y-4" role="group" aria-labelledby="card-details-heading">
          <h3 id="card-details-heading" className="sr-only">Kortdetaljer</h3>
          
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Kortnummer *
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={cardInfo.cardNumber}
              onChange={onChange}
              placeholder="1234 5678 9012 3456"
              className={inputClass}
              required
              aria-required="true"
              aria-invalid={!!errors.cardNumber}
              aria-describedby={errors.cardNumber ? "cardNumber-error" : undefined}
            />
            {errors.cardNumber && (
              <p id="cardNumber-error" className="text-red-500 text-sm mt-1">{errors.cardNumber[0]}</p>
            )}
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
              onChange={onChange}
              placeholder="Ola Nordmann"
              className={inputClass}
              required
              aria-required="true"
              aria-invalid={!!errors.cardHolder}
              aria-describedby={errors.cardHolder ? "cardHolder-error" : undefined}
            />
            {errors.cardHolder && (
              <p id="cardHolder-error" className="text-red-500 text-sm mt-1">{errors.cardHolder[0]}</p>
            )}
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
                onChange={onChange}
                placeholder="MM/YY"
                className={inputClass}
                required
                aria-required="true"
                aria-invalid={!!errors.expiryDate}
                aria-describedby={errors.expiryDate ? "expiryDate-error" : undefined}
              />
              {errors.expiryDate && (
                <p id="expiryDate-error" className="text-red-500 text-sm mt-1">{errors.expiryDate[0]}</p>
              )}
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
                onChange={onChange}
                placeholder="123"
                className={inputClass}
                required
                aria-required="true"
                aria-invalid={!!errors.cvv}
                aria-describedby={errors.cvv ? "cvv-error" : undefined}
              />
              {errors.cvv && (
                <p id="cvv-error" className="text-red-500 text-sm mt-1">{errors.cvv[0]}</p>
              )}
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
  );
}

type PaymentOptionProps = {
  value: string;
  label: string;
  selected: boolean;
  onChange: () => void;
};

function PaymentOption({ value, label, selected, onChange }: PaymentOptionProps) {
  return (
    <label className="flex items-center space-x-3 p-4 border rounded-md cursor-pointer hover:bg-gray-50">
      <input
        type="radio"
        name="paymentMethod"
        value={value}
        checked={selected}
        onChange={onChange}
        className="h-4 w-4 text-blue-600"
        aria-label={`Velg ${label} som betalingsmetode`}
      />
      <span>{label}</span>
    </label>
  );
}