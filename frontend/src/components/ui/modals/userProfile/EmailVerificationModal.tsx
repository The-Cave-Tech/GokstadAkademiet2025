"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/custom/Button";
import { VerificationModalProps } from "@/types/loginInfoManage.types";
import PageIcons from "@/components/ui/custom/PageIcons";

export function EmailVerificationModal({
  isOpen,
  onClose,
  onVerify,
  email,
  isLoading,
  setIsLoading
}: VerificationModalProps) {
  // State
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus on input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
  
  // Show error message with auto-dismiss
  const showError = (message: string) => {
    setError(message);
    setSuccessMessage("");
    setTimeout(() => setError(""), 5000);
  };
  
  // Show success message with auto-dismiss
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setError("");
    setTimeout(() => setSuccessMessage(""), 5000);
  };
  
  // Handle verification code input change
  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and limit to 6 characters
    setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Basic validation
    if (verificationCode.length !== 6) {
      showError("Verifiseringskoden må være 6 siffer");
      return;
    }
    
    try {
      setIsLoading(true);
      await onVerify(verificationCode);
      showSuccess("Verifisering fullført");
      setTimeout(onClose, 1500);
    } catch (error) {
      console.error("Feil ved verifisering:", error);
      showError("Ugyldig verifiseringskode");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle sending code again
  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      // This would typically call an API to resend the code
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess("Ny kode sendt");
    } catch (error) {
      console.error("Feil ved sending av ny kode:", error);
      showError("Kunne ikke sende ny kode");
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
        className="w-full max-w-[600px] mx-4 my-8"
      >
        <Card className="w-full shadow-xl rounded-lg border">
          <CardHeader className="px-6 py-4 border-b border-gray-200">
            <h2 id="verification-modal-title" className="text-xl font-semibold text-gray-900">
              Sjekk din e-post
            </h2>
          </CardHeader>
          
          <CardBody className="px-6 py-6">
            {error && (
              <div 
                className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start"
                role="alert"
                aria-live="assertive"
              >
                <PageIcons name="warning" directory="profileIcons" size={20} alt="" className="mt-0.5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {successMessage && (
              <div 
                className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-start"
                role="status"
                aria-live="polite"
              >
                <svg className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}
            
            <div className="space-y-6">
              <div className="text-gray-700">
                <p className="text-base">
                  Vi har sendt deg en kode på e-post for å verifisere at dette er deg.
                </p>
                <p className="mt-2 text-base">
                  Vennligst sjekk innboksen din {email ? `(${email})` : ""} og eventuelt søppelpost-mappen.
                </p>
              </div>
              
              <div className="space-y-4">
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
                    Klikk her for å sende på nytt
                  </button>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={isLoading}
                    ariaLabel="Avbryt"
                    type="button"
                    className="px-6 py-2 rounded-3xl"
                  >
                    Avbryt
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isLoading || verificationCode.length !== 6}
                    ariaLabel={isLoading ? "Verifiserer..." : "Gå videre"}
                    type="button"
                    className="px-6 py-2 rounded-3xl"
                  >
                    {isLoading ? "Verifiserer..." : "Gå videre"}
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}