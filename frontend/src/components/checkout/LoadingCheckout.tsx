// src/components/checkout/LoadingCheckout.tsx
import PageIcons from "@/components/ui/custom/PageIcons";

type LoadingCheckoutProps = {
  height?: string;
};

export default function LoadingCheckout({ height = 'h-[50vh]' }: LoadingCheckoutProps) {
  return (
    <div className={`flex justify-center items-center ${height}`} aria-live="polite" aria-busy="true">
      <PageIcons 
        name="loading" 
        directory="profileIcons" 
        size={40} 
        alt="Laster inn" 
        className="animate-spin" 
      />
      <span className="sr-only">Laster inn utsjekk-informasjon</span>
    </div>
  );
}