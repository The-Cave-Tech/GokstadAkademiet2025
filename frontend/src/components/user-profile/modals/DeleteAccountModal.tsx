"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/custom/Button";
import PageIcons from "@/components/ui/custom/PageIcons";
import { AccountDeletionModalProps } from "@/types/accountAdministration.types";
import { useAccountDeletionValidation } from "@/hooks/useProfileValidation";
import { ZodErrors } from "@/components/ZodErrors";
import { profileFieldError, handleStrapiError } from "@/lib/utils/serverAction-errorHandler";
import { useAuth } from "@/lib/context/AuthContext";

export function DeleteAccountModal({
  isOpen,
  currentEmail,
  onClose,
  onVerify,
  isLoading,
  setIsLoading,
}: AccountDeletionModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { authProvider } = useAuth();
  
  // Check if user is using OAuth (third-party login)
  const isOAuthUser = authProvider && authProvider !== 'local';

  // Get validation hook
  const { validationErrors, validateField, validateForm } = useAccountDeletionValidation();

  useEffect(() => {
    if (isOpen && inputRef.current && !isOAuthUser) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isOAuthUser]);

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
    setCurrentPassword("");
    setError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentPassword(value);
    validateField("password", value);
  };

  const handleSubmit = async () => {
    setError("");
    
    // For OAuth users, we don't need password validation
    if (isOAuthUser) {
      try {
        setIsLoading(true);
        // Call onVerify with an empty string for OAuth users
        await onVerify("");
        resetForm();
      } catch (error) {
        setError(handleStrapiError(error));
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // Validate the entire form for non-OAuth users
    const formData = {
      password: currentPassword
    };
    
    const isValid = validateForm(formData);
    
    if (!isValid) {
      return;
    }

    try {
      setIsLoading(true);
      // Here we send the password to the API for verification before sending the verification code
      await onVerify(currentPassword);
      resetForm(); 
    } catch (error) {
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
      aria-labelledby="delete-account-modal-title"
    >
      <div ref={modalRef} className="w-full max-w-[600px] mx-4 my-8">
        <Card className="w-full shadow-xl rounded-lg border">
          <CardHeader className="px-6 py-4 border-b border-gray-200">
            <h2 id="delete-account-modal-title" className="text-xl font-semibold text-gray-900">
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
                  {isOAuthUser 
                    ? `Vil du bekrefte at du ønsker å slette kontoen din (${currentEmail})?` 
                    : `For å bekrefte at du ønsker å slette kontoen din (${currentEmail}), vennligst skriv inn passordet ditt.`
                  }
                </p>
              </div>

              <div className="space-y-4">
                {!isOAuthUser && (
                  <div className="space-y-2">
                    <label htmlFor="current-password" className="block text-gray-700 font-medium">
                      Passord
                    </label>
                    <input
                      ref={inputRef}
                      id="current-password"
                      type="password"
                      className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Skriv inn passordet for kontoen din"
                      required
                      disabled={isLoading}
                      aria-describedby="password-description"
                    />
                    <ZodErrors
                      error={profileFieldError(
                        validationErrors,
                        null,
                        "password"
                      )}
                    />
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-2">
                  <div className="flex gap-2">
                    <PageIcons name="warning" directory="profileIcons" size={20} alt="" className="flex-shrink-0" />
                    <p className="text-amber-800">
                      Når du bekrefter, vil du motta en e-post med en verifiseringskode som du må skrive inn for å fullføre slettingen.
                      <strong className="block mt-2">Dette er en permanent handling som ikke kan angres. All din data vil bli slettet.</strong>
                    </p>
                  </div>
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
                    disabled={isLoading || (!isOAuthUser && (!currentPassword || validationErrors.password?.length > 0))}
                    ariaLabel={isLoading ? "Sender..." : "Send verifiseringskode"}
                    type="button"
                    className="px-6 py-2 rounded-3xl"
                  >
                    {isLoading ? "Sender..." : "Send verifiseringskode"}
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