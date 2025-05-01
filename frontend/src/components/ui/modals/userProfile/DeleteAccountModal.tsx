"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/custom/Button";
import PageIcons from "@/components/ui/custom/PageIcons";

interface DeleteAccountModalProps {
  isOpen: boolean;
  currentEmail: string;
  onClose: () => void;
  onVerify: (password: string) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function DeleteAccountModal({
  isOpen,
  currentEmail,
  onClose,
  onVerify,
  isLoading,
  setIsLoading,
}: DeleteAccountModalProps) {
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
    setError(""); // Nullstill feilmelding ved endring
  };

  const handleSubmit = async () => {
    if (!currentPassword) {
      setError("Vennligst skriv inn passordet ditt");
      return;
    }

    try {
      setIsLoading(true);
      await onVerify(currentPassword);
      setCurrentPassword(""); // Nullstill passordfelt
    } catch (error) {
      console.error("Feil ved passordvalidering:", error);
      setError(error instanceof Error ? error.message : "Ugyldig passord");
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
                  For å bekrefte at du ønsker å slette kontoen din ({currentEmail}), vennligst skriv inn passordet ditt.
                </p>
              </div>

              <div className="space-y-4">
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
                    disabled={isLoading || !currentPassword}
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