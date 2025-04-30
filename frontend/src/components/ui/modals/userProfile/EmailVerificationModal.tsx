"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/custom/Button";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  email?: string;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export function EmailVerificationModal({
  isOpen,
  onClose,
  onVerify,
  isLoading,
  setIsLoading
}: EmailVerificationModalProps) {
  // State
  const [verificationCode, setVerificationCode] = useState("");
  
  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Fokus på input når modal åpnes
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Håndter escape-tast
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  
  // Håndtere endring av verifiseringskode
  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
  };
  
  // Håndter sending av skjema
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await onVerify(verificationCode);
    } catch (error) {
      console.error("Feil ved verifisering:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Håndter sending på nytt
  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      // Simuler API-kall for å sende ny kode
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Feil ved sending av ny kode:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center overflow-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verification-modal-title"
    >
      <div 
        ref={modalRef}
        className="max-w-md w-full mx-4 my-8"
      >
        <Card className="w-full shadow-xl rounded-lg border">
          <CardHeader className="px-6 py-4 border-b border-gray-200">
            <h2 id="verification-modal-title" className="text-xl font-semibold text-gray-900">
              Sjekk din e-post
            </h2>
          </CardHeader>
          
          <CardBody className="px-6 py-6">
            <div className="space-y-6">
              <div className="text-gray-700">
                <p>
                  Vi har sendt deg en kode på e-post for å verifisere at dette er deg.
                </p>
                <p>
                  Vennligst sjekk innboksen din (og eventuelt søppelpost)
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="verification-code" className="block text-gray-700 font-medium">
                    Verifiseringskode
                  </label>
                  <input
                    ref={inputRef}
                    id="verification-code"
                    type="text"
                    className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={verificationCode}
                    onChange={handleVerificationCodeChange}
                    placeholder="6-sifret kode"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    required
                    disabled={isLoading}
                    aria-describedby="code-description"
                  />
                  <p id="code-description" className="text-sm text-gray-500">
                    Koden er 6 siffer
                  </p>
                </div>
                
                <div className="flex items-center">
                  <p className="text-gray-700">Har du ikke mottatt e-posten?</p>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
                    disabled={isLoading}
                  >
                    Klikk her for å sende på nytt...
                  </button>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={isLoading}
                    ariaLabel="Avbryt"
                    type="button"
                    className="px-6 py-2"
                  >
                    Avbryt
                  </Button>
                  <Button
                    variant="primary"
                    disabled={isLoading}
                    ariaLabel={isLoading ? "Verifiserer..." : "Gå videre"}
                    type="submit"
                    className="px-6 py-2"
                  >
                    {isLoading ? "Verifiserer..." : "Gå videre"}
                  </Button>
                </div>
              </form>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}