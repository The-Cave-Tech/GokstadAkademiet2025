"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { PasswordModalProps } from "@/types/loginInfoManage.types";
import { Button } from "@/components/ui/Button";
import PageIcons from "@/components/ui/custom/PageIcons";
import { PasswordToggle } from "@/components/ui/custom/PasswordToggle";
import { usePasswordChangeValidation } from "@/hooks/useProfileValidation";
import { ZodErrors } from "@/components/common/ZodErrors";
import { profileFieldError, handleStrapiError } from "@/lib/utils/serverAction-errorHandler";
import PasswordStrengthMeter from "@/components/ui/custom/PasswordStrengthMeter";

export function PasswordChangeModal({ 
  isOpen, 
  onClose, 
  onUpdate,
  isLoading,
  setIsLoading
}: PasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Get validation hook
  const { validationErrors, validateField, validateForm } = usePasswordChangeValidation();
  
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
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };
  
  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentPassword(value);
    validateField("currentPassword", value);
  };
  
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    validateField("newPassword", value);
    
    // Also validate confirmPassword if it's not empty
    if (confirmPassword) {
      validateField("confirmPassword", confirmPassword, { newPassword: value });
    }
  };
  
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validateField("confirmPassword", value, { newPassword });
  };
  
  const handlePasswordChange = async () => {
    setError("");
    
    // Validate the entire form
    const formData = {
      currentPassword,
      newPassword,
      confirmPassword
    };
    
    const isValid = validateForm(formData);
    
    if (!isValid) {
      return;
    }
    
    try {
      setIsLoading(true);
      await onUpdate(currentPassword, newPassword);
      resetForm();
      setTimeout(onClose, 1500);
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
      aria-labelledby="password-modal-title"
    >
      <div 
        ref={modalRef}
        className="w-full max-w-[600px] mx-4 my-8"
      >
        <Card className="w-full shadow-xl">
          <CardHeader className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 id="password-modal-title" className="text-lg font-medium text-gray-900">
              Endre passord
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
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Nåværende passord
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentPassword}
                    onChange={handleCurrentPasswordChange}
                    placeholder="Skriv ditt nåværende passord"
                    required
                    disabled={isLoading}
                    aria-describedby="current-password-description"
                  />
                  <PasswordToggle
                    showPassword={showCurrentPassword}
                    togglePassword={() => setShowCurrentPassword(prev => !prev)}
                  />
                </div>
                <ZodErrors
                  error={profileFieldError(
                    validationErrors,
                    null,
                    "currentPassword"
                  )}
                />
              </div>

              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Nytt passord
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    placeholder="Skriv nytt passord (minst 8 tegn)"
                    required
                    disabled={isLoading}
                    aria-describedby="new-password-description"
                  />
                  <PasswordToggle
                    showPassword={showNewPassword}
                    togglePassword={() => setShowNewPassword(prev => !prev)}
                  />
                </div>
                <ZodErrors
                  error={profileFieldError(
                    validationErrors,
                    null,
                    "newPassword"
                  )}
                />
                {newPassword && (
                  <PasswordStrengthMeter 
                    password={newPassword} 
                    className="mt-1"
                  />
                )}
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Bekreft nytt passord
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Skriv passordet igjen"
                    required
                    disabled={isLoading}
                    aria-describedby="confirm-password-description"
                  />
                  <PasswordToggle
                    showPassword={showConfirmPassword}
                    togglePassword={() => setShowConfirmPassword(prev => !prev)}
                  />
                </div>
                <ZodErrors
                  error={profileFieldError(
                    validationErrors,
                    null,
                    "confirmPassword"
                  )}
                />
              </div>
              
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                <p id="new-password-description">Et sterkt passord bør være minst 8 tegn langt og inneholde en kombinasjon av 
                  store og små bokstaver, tall og spesialtegn.</p>
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
                  onClick={handlePasswordChange}
                  disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                  ariaLabel={isLoading ? "Oppdaterer..." : "Oppdater passord"}
                  type="button"
                  className="rounded-3xl"
                >
                  {isLoading ? "Oppdaterer..." : "Oppdater passord"}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}