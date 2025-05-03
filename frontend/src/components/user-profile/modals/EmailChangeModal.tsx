"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { EmailModalProps } from "@/types/loginInfoManage.types";
import { Button } from "@/components/ui/custom/Button";
import PageIcons from "@/components/ui/custom/PageIcons";
import { useEmailChangeValidation } from "@/hooks/useProfileValidation";
import { ZodErrors } from "@/components/ZodErrors";
import { profileFieldError, handleStrapiError } from "@/lib/utils/serverAction-errorHandler";

export function EmailChangeModal({
  isOpen,
  currentEmail,
  onClose,
  onUpdate,
  isLoading,
  setIsLoading,
}: EmailModalProps) {
  const [newEmail, setNewEmail] = useState(currentEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get validation hook
  const { validationErrors, validateField, validateForm } = useEmailChangeValidation();

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
    setNewEmail(currentEmail);
    setCurrentPassword("");
    setError("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewEmail(value);
    validateField("email", value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentPassword(value);
    validateField("currentPassword", value);
  };

  const handleSubmit = async () => {
    setError("");
    
    if (newEmail === currentEmail) {
      setError("Den nye e-postadressen er den samme som den eksisterende");
      return;
    }

    // Validate the entire form
    const formData = {
      email: newEmail,
      currentPassword
    };
    
    const isValid = validateForm(formData);
    
    if (!isValid) {
      return;
    }

    try {
      setIsLoading(true);
      await onUpdate(newEmail, currentPassword);
      resetForm();
    } catch (error) {
      // Use handleStrapiError to translate the error to a user-friendly message
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
      aria-labelledby="email-modal-title"
    >
      <div ref={modalRef} className="w-full max-w-[600px] mx-4 my-8">
        <Card className="w-full shadow-xl">
          <CardHeader className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 id="email-modal-title" className="text-lg font-medium text-gray-900">
              Endre e-postadresse
            </h3>
          </CardHeader>

          <CardBody className="px-6 py-4">
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

            <div className="space-y-4">
              <div>
                <label htmlFor="current-password-for-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Passord
                </label>
                <input
                  id="current-password-for-email"
                  name="current-password-for-email"
                  type="password"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Skriv ditt passord"
                  required
                  disabled={isLoading}
                  aria-describedby="password-description"
                />
                <ZodErrors
                  error={profileFieldError(
                    validationErrors,
                    null,
                    "currentPassword"
                  )}
                />
              </div>

              <div>
                <label htmlFor="new-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Ny e-postadresse
                </label>
                <input
                  ref={inputRef}
                  id="new-email"
                  name="new-email"
                  type="email"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newEmail}
                  onChange={handleEmailChange}
                  placeholder="din.nye@epost.no"
                  required
                  disabled={isLoading}
                  aria-describedby="email-description"
                />
                <ZodErrors
                  error={profileFieldError(
                    validationErrors,
                    null,
                    "email"
                  )}
                />
              </div>

              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                <p id="email-description">
                  Når du endrer e-post, vil du motta en verifiseringskode på din nye e-postadresse. Dette er for å bekrefte at du har tilgang til e-postadressen.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  disabled={isLoading}
                  ariaLabel="Avbryt"
                  type="button"
                  className="rounded-3xl"
                >
                  Avbryt
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isLoading || !currentPassword || !newEmail || newEmail === currentEmail}
                  ariaLabel={isLoading ? "Sender..." : "Send verifiseringskode"}
                  type="button"
                  className="rounded-3xl"
                >
                  {isLoading ? "Sender..." : "Send verifiseringskode"}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}