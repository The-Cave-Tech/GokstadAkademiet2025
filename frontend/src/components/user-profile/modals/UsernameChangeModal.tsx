"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { UsernameModalProps } from "@/types/loginInfoManage.types";
import { Button } from "@/components/ui/custom/Button";
import PageIcons from "@/components/ui/custom/PageIcons";
import { useUsernameChangeValidation } from "@/hooks/useProfileValidation";
import { ZodErrors } from "@/components/ZodErrors";
import { profileFieldError, handleStrapiError } from "@/lib/utils/serverAction-errorHandler";

export function UsernameChangeModal({
  isOpen,
  currentUsername,
  onClose,
  onUpdate,
  isLoading,
  setIsLoading,
}: UsernameModalProps) {
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get validation hook
  const { validationErrors, validateField, validateForm } = useUsernameChangeValidation();

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
    setNewUsername(currentUsername);
    setCurrentPassword("");
    setError("");
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewUsername(value);
    validateField("username", value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentPassword(value);
    validateField("currentPassword", value);
  };
  
  const handleSubmit = async () => {
    setError("");
    
    if (newUsername === currentUsername) {
      setError("Det nye brukernavnet er det samme som det eksisterende");
      return;
    }

    // Validate the entire form
    const formData = {
      username: newUsername,
      currentPassword
    };
    
    const isValid = validateForm(formData);
    
    if (!isValid) {
      return;
    }

    try {
      setIsLoading(true);
      await onUpdate(newUsername, currentPassword);
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
            {/* Error message */}
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
                <label htmlFor="current-password-for-username" className="block text-sm font-medium text-gray-700 mb-1">
                 Passord
                </label>
                <input
                  id="current-password-for-username"
                  name="current-password-for-username"
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
                <ZodErrors
                  error={profileFieldError(
                    validationErrors,
                    null,
                    "username"
                  )}
                />
              </div>

              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                <p id="username-description">
                  Når du endrer brukernavn, vil du motta en verifiseringskode på e-post. Dette er for å bekrefte at det er deg som gjør endringen.
                </p>
                <p className="mt-1">
                  Et gyldig brukernavn må være 6-20 tegn, inneholde minst ett tall, og kan kun inneholde bokstaver, tall, understrek og bindestrek.
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
                  disabled={isLoading || !currentPassword || !newUsername || newUsername === currentUsername}
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