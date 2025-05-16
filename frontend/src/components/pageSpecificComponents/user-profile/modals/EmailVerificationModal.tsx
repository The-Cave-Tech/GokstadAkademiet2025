"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { VerificationModalProps } from "@/types/loginInfoManage.types";
import PageIcons from "@/components/ui/custom/PageIcons";
import { ZodErrors } from "@/components/ui/ZodErrors";
import { universalVerificationCodeValidation } from "@/lib/validation/universalValidation";
import { handleStrapiError } from "@/lib/utils/serverAction-errorHandler";
import { z } from "zod";

export function EmailVerificationModal({
  isOpen,
  onClose,
  onVerify,
  email,
  isLoading,
  setIsLoading,
  onResendCode // New prop to handle resending code
}: VerificationModalProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState<string[]>([]);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
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

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendCountdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [resendCountdown, resendDisabled]);
  
  // Handle verification code input change
  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
    
    // Validate the verification code
    try {
      universalVerificationCodeValidation.parse(value);
      setValidationError([]);
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Extract properly formatted error messages
        setValidationError(
          err.errors
            .filter(e => e.message) // Filter out empty messages
            .map(e => e.message)    // Extract just the message
        );
      } else if (err instanceof Error) {
        setValidationError([err.message]);
      }
    }
  };
  
  const handleSubmit = async () => {
    setError("");
    setResendSuccess(false);
    
    // Validate the verification code before submitting
    try {
      universalVerificationCodeValidation.parse(verificationCode);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationError(
          err.errors
            .filter(e => e.message)
            .map(e => e.message)
        );
      } else if (err instanceof Error) {
        setValidationError([err.message]);
      }
      return;
    }
    
    try {
      setIsLoading(true);
      await onVerify(verificationCode);
      setTimeout(onClose, 1500);
    } catch (error) {
      console.error("Feil ved verifisering:", error);
      setError(handleStrapiError(error));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    if (!onResendCode || resendDisabled) return;
    
    try {
      setIsLoading(true);
      setError("");
      setResendSuccess(false);
      
      await onResendCode();
      
      // Show success message
      setResendSuccess(true);
      
      // Disable resend button for 60 seconds
      setResendDisabled(true);
      setResendCountdown(60);
      
      // Clear verification code field
      setVerificationCode("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error("Feil ved sending av ny kode:", error);
      setError(handleStrapiError(error));
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
            
            {resendSuccess && (
              <div 
                className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-start"
                role="alert"
                aria-live="assertive"
              >
                <span>Ny verifiseringskode er sendt til din e-post</span>
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
                  <ZodErrors error={validationError} />
                  <p id="code-description" className="text-sm text-gray-500">
                    Koden er 6 siffer
                  </p>
                </div>
                
                <div className="flex items-center">
                  <p className="text-gray-700">Har du ikke mottatt e-posten?</p>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className={`ml-2 text-blue-600 hover:text-blue-800 font-medium focus:outline-none ${
                      resendDisabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isLoading || resendDisabled}
                  >
                    {resendDisabled 
                      ? `Prøv igjen om ${resendCountdown} sekunder` 
                      : 'Klikk her for å sende på nytt'}
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
                    disabled={isLoading || validationError.length > 0 || verificationCode.length !== 6}
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