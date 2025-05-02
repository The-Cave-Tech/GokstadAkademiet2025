"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/custom/Button";
import PageIcons from "@/components/ui/custom/PageIcons";
import { AccountEmailVerificationModalProps } from "@/types/accountAdministration.types";
import { useAccountDeletionVerificationValidation } from "@/hooks/useProfileValidation";
import { ZodErrors } from "@/components/ZodErrors";
import { profileFieldError } from "@/lib/utils/serverAction-errorHandler";

export function AccountDeletionVerificationModal({
  isOpen,
  onClose,
  onVerify,
  email,
  isLoading,
  setIsLoading,
  deletionReason,
  setDeletionReason
}: AccountEmailVerificationModalProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Get validation hook
  const { validationErrors, validateField, validateForm } = useAccountDeletionVerificationValidation();
  
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

  const resetForm = () => {
    setVerificationCode("");
    setError("");
  };
  
  // Handle verification code input change
  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
    validateField("verificationCode", value);
  };

  const handleDeletionReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDeletionReason(value);
    validateField("deletionReason", value);
  };
  
  const handleSubmit = async () => {
    setError("");
    
    // Validate the entire form
    const formData = {
      verificationCode,
      deletionReason
    };
    
    const isValid = validateForm(formData);
    
    if (!isValid) {
      return;
    }
    
    try {
      setIsLoading(true);
      await onVerify(verificationCode, deletionReason);
    } catch (error) {
      console.error("Feil ved verifisering:", error);
      setError(error instanceof Error ? error.message : "Ugyldig verifiseringskode");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      setError("Funksjonen for å sende ny kode er ikke implementert ennå");
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulert forsinkelse
    } catch (error) {
      console.error("Feil ved sending av ny kode:", error);
      setError(error instanceof Error ? error.message : "Kunne ikke sende ny kode");
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
              Bekreft sletting av konto
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
                  <ZodErrors
                    error={profileFieldError(
                      validationErrors,
                      null,
                      "verificationCode"
                    )}
                  />
                  <p id="code-description" className="text-sm text-gray-500">
                    Koden er 6 siffer
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="deletion-reason" className="block text-gray-700 font-medium">
                    Hvorfor ønsker du å slette kontoen din? (valgfritt)
                  </label>
                  <textarea
                    id="deletion-reason"
                    className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={deletionReason}
                    onChange={handleDeletionReasonChange}
                    placeholder="Din tilbakemelding er viktig for oss..."
                    disabled={isLoading}
                    rows={3}
                    maxLength={256}
                  />
                  <ZodErrors
                    error={profileFieldError(
                      validationErrors,
                      null,
                      "deletionReason"
                    )}
                  />
                  <div className="text-xs text-gray-500 text-right">
                  {deletionReason.length}/256 tegn
                </div>
                  <p className="text-sm text-gray-500">
                    Din tilbakemelding blir sendt til vårt team på e-post (maad1006@gmail.com), 
                    men vil ikke bli lagret i systemet ettersom kontoen din slettes umiddelbart.
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
                    onClick={() => {
                      resetForm();
                      onClose();
                    }}
                    disabled={isLoading}
                    ariaLabel="Avbryt"
                    type="button"
                    className="px-6 py-2 rounded-3xl"
                  >
                    Avbryt
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleSubmit}
                    disabled={isLoading || validationErrors.verificationCode?.length > 0 || verificationCode.length !== 6}
                    ariaLabel={isLoading ? "Verifiserer..." : "Bekreft sletting"}
                    type="button"
                    className="px-6 py-2 rounded-3xl"
                  >
                    {isLoading ? "Verifiserer..." : "Bekreft sletting"}
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