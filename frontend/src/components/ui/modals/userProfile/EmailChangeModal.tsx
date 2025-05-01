"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { EmailModalProps } from "@/types/loginInfoManage.types";
import { Button } from "@/components/ui/custom/Button";
import PageIcons from "@/components/ui/custom/PageIcons";

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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };

  const handleSubmit = async () => {
    if (newEmail === currentEmail) {
      setError("Den nye e-postadressen er den samme som den eksisterende");
      return;
    }

    try {
      setIsLoading(true);
      await onUpdate(newEmail);
    } catch (error) {
      console.error("Feil ved forespørsel om e-postendring:", error);
      setError(error instanceof Error ? error.message : "Kunne ikke sende forespørsel om e-postendring");
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
              </div>

              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                <p id="email-description">
                  Når du endrer e-post, vil du motta en verifiseringskode på din nye e-postadresse. Dette er for å bekrefte at du har tilgang til e-postadressen.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={onClose}
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
                  disabled={isLoading}
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