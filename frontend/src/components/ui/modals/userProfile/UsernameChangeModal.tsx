"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { UsernameModalProps } from "@/types/loginInfoManage.types";
import { Button } from "@/components/ui/custom/Button";
import PageIcons from "@/components/ui/custom/PageIcons";

export function UsernameChangeModal({
  isOpen,
  currentUsername,
  onClose,
  onUpdate,
  isLoading,
  setIsLoading,
}: UsernameModalProps) {
  // State
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [currentPassword, setCurrentPassword] = useState("");
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

  // Handle escape key and clicks outside modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Handle username input change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(e.target.value);
  };

  // Handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };

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

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (newUsername === currentUsername) {
      showError("Det nye brukernavnet er det samme som det eksisterende");
      return;
    }

    if (newUsername.length < 3) {
      showError("Brukernavnet må være minst 3 tegn langt");
      return;
    }

    if (!currentPassword) {
      showError("Vennligst oppgi ditt nåværende passord");
      return;
    }

    try {
      setIsLoading(true);
      // Call the update function passed from parent
      await onUpdate(newUsername);
      showSuccess("Verifiseringskode sendt til din e-post");
    } catch (error) {
      console.error("Feil ved forespørsel om brukernavnendring:", error);
      showError("Kunne ikke sende forespørsel om brukernavnendring");
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
      aria-labelledby="username-modal-title"
    >
      <div ref={modalRef} className="w-full max-w-[600px] mx-4 my-8">
        <Card className="w-full shadow-xl">
          <CardHeader className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 id="username-modal-title" className="text-lg font-medium text-gray-900">
              Endre brukernavn
            </h3>
          </CardHeader>

          <CardBody className="px-6 py-4">
            {/* Error and success messages */}
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
                <svg
                  className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            <div className="space-y-4">

            <div>
                <label htmlFor="current-password-for-username" className="block text-sm font-medium text-gray-700 mb-1">
                  Nåværende passord
                </label>
                <input
                  id="current-password-for-username"
                  name="current-password-for-username"
                  type="password"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Skriv ditt nåværende passord"
                  required
                  disabled={isLoading}
                  aria-describedby="password-description"
                />
              </div>

              <div>
                <label htmlFor="new-username" className="block text-sm font-medium text-gray-700 mb-1">
                  Nytt brukernavn
                </label>
                <input
                  ref={inputRef}
                  id="new-username"
                  name="new-username"
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newUsername}
                  onChange={handleUsernameChange}
                  placeholder="Skriv inn nytt brukernavn"
                  required
                  disabled={isLoading}
                  aria-describedby="username-description"
                />
              </div>

              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                <p id="username-description">
                  Når du endrer brukernavn, vil du motta en verifiseringskode på e-post. Dette er for å bekrefte at det er deg som gjør endringen.
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