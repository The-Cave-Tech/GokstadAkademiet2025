// src/components/checkout/ShippingForm.tsx
type ShippingInfo = {
  fullName: string;
  address: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
};

type ShippingFormProps = {
  shippingInfo: ShippingInfo;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Record<string, string[]>;
};

export default function ShippingForm({ 
  shippingInfo, 
  onChange,
  errors = {}
}: ShippingFormProps) {
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  
  return (
    <div className="space-y-4" role="group" aria-labelledby="shipping-heading">
      <div>
        <label htmlFor="fullName" className={labelClass}>
          Fullt navn *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={shippingInfo.fullName}
          onChange={onChange}
          className={inputClass}
          required
          aria-required="true"
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
        />
        {errors.fullName && (
          <p id="fullName-error" className="text-red-500 text-sm mt-1">{errors.fullName[0]}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="address" className={labelClass}>
          Adresse *
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={shippingInfo.address}
          onChange={onChange}
          className={inputClass}
          required
          aria-required="true"
          aria-invalid={!!errors.address}
          aria-describedby={errors.address ? "address-error" : undefined}
        />
        {errors.address && (
          <p id="address-error" className="text-red-500 text-sm mt-1">{errors.address[0]}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="postalCode" className={labelClass}>
            Postnummer *
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={shippingInfo.postalCode}
            onChange={onChange}
            className={inputClass}
            required
            aria-required="true"
            aria-invalid={!!errors.postalCode}
            aria-describedby={errors.postalCode ? "postalCode-error" : undefined}
          />
          {errors.postalCode && (
            <p id="postalCode-error" className="text-red-500 text-sm mt-1">{errors.postalCode[0]}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="city" className={labelClass}>
            Sted *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={shippingInfo.city}
            onChange={onChange}
            className={inputClass}
            required
            aria-required="true"
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? "city-error" : undefined}
          />
          {errors.city && (
            <p id="city-error" className="text-red-500 text-sm mt-1">{errors.city[0]}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className={labelClass}>
          E-post *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={shippingInfo.email}
          onChange={onChange}
          className={inputClass}
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="phone" className={labelClass}>
          Telefon
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={shippingInfo.phone}
          onChange={onChange}
          className={inputClass}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>
        )}
      </div>
    </div>
  );
}