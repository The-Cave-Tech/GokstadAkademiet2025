// src/components/checkout/CheckoutSteps.tsx
import { Fragment } from 'react';

type Step = {
  id: number;
  label: string;
};

type CheckoutStepsProps = {
  currentStep: number;
};

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps: Step[] = [
    { id: 1, label: 'Levering' },
    { id: 2, label: 'Betaling' },
    { id: 3, label: 'Bekreftelse' },
  ];
  
  return (
    <nav aria-label="Checkout-prosess" className="flex justify-center mt-4">
      {steps.map((step, index) => (
        <Fragment key={step.id}>
          <div className="flex items-center">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${currentStep > step.id
                  ? 'bg-green-600 text-white'
                  : currentStep === step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }
              `}
              aria-current={currentStep === step.id ? "step" : undefined}
            >
              {currentStep > step.id ? '✓' : step.id}
            </div>
            <div
              className={`text-sm ml-2 ${currentStep >= step.id ? '' : 'text-gray-600'}`}
            >
              {step.label}
            </div>
          </div>
          
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-1 mx-2
                ${currentStep > step.id + 1
                  ? 'bg-green-600'
                  : currentStep > step.id
                    ? 'bg-blue-600'
                    : 'bg-gray-300'
                }
              `}
              role="presentation"
            />
          )}
        </Fragment>
      ))}
    </nav>
  );
}