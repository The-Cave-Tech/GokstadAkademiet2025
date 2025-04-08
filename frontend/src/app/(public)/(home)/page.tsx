"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  // Vis meldingen når komponenten lastes og det finnes en melding
  const [showMessage, setShowMessage] = useState(false); 

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  return (
    <main className="mt-24">
      {showMessage && message && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md text-center max-w-md mx-auto">
          {message}
        </div>
      )}
      <p>This is THE-CAVETECH-</p>
    </main>
  );
}