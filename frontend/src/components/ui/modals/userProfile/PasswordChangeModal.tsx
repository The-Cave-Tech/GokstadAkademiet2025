"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import { PasswordModalProps } from "@/types/loginInfoManage.types";
import PasswordStrengthMeter from "@/components/ui/custom/PasswordStrengthMeter";
import { calculatePasswordStrength } from "@/lib/validation/universalValidation";
import { Button } from "@/components/ui/custom/Button";

export function PasswordChangeModal({ 
  isOpen, 
  onClose, 
  onUpdate,
  isLoading,
  setIsLoading
}: PasswordModalProps) {
  // State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Fokus på input når modal åpnes
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Håndter escape-tast
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  
  // Vis feilmelding med auto-dismiss
  const showError = (message: string) => {
    setError(message);
    setSuccessMessage("");
    setTimeout(() => setError(""), 5000);
  };
  
  // Vis suksessmelding med auto-dismiss
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setError("");
    setTimeout(() => setSuccessMessage(""), 5000);
  };
  
  // Håndter endring av nåværende passord
  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };
  
  // Håndter endring av nytt passord
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };
  
  // Håndter endring av bekreft passord
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };
  
  // Valider nytt passord
  const validatePassword = () => {
    if (!currentPassword) {
      showError("Vennligst oppgi ditt nåværende passord");
      return false;
    }
    
    if (newPassword.length < 8) {
      showError("Passordet må være minst 8 tegn");
      return false;
    }
    
    if (calculatePasswordStrength(newPassword) < 50) {
      showError("Passordet er for svakt. Bruk en kombinasjon av store og små bokstaver, tall og spesialtegn.");
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      showError("Passordene samsvarer ikke");
      return false;
    }
    
    return true;
  };
  
  // Håndter sending av skjema
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    
    try {
      setIsLoading(true);
      
      // Kall tilbake til parent for å oppdatere passord
      await onUpdate();
      
      showSuccess("Passord oppdatert");
      setTimeout(onClose, 1500);
    } catch (error) {
      console.error("Feil ved oppdatering av passord:", error);
      showError("Kunne ikke oppdatere passord");
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
        className="max-w-md w-full mx-4 my-8"
      >
        <Card className="w-full shadow-xl">
          <CardHeader className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 id="password-modal-title" className="text-lg font-medium text-gray-900">
              Endre passord
            </h3>
          </CardHeader>
          
          <CardBody className="px-6 py-4">
            {/* Status meldinger - viktig for skjermlesere */}
            {error && (
              <div 
                className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start"
                role="alert"
                aria-live="assertive"
              >
                <svg className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
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
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Nåværende passord
                </label>
                <input
                  ref={inputRef}
                  id="current-password"
                  type="password"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={currentPassword}
                  onChange={handleCurrentPasswordChange}
                  placeholder="Skriv ditt nåværende passord"
                  required
                  disabled={isLoading}
                  aria-describedby="current-password-description"
                />
              </div>

              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Nytt passord
                </label>
                <input
                  id="new-password"
                  type="password"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  placeholder="Skriv nytt passord (minst 8 tegn)"
                  required
                  disabled={isLoading}
                  aria-describedby="password-strength-meter new-password-description"
                />
                
                {newPassword && (
                  <PasswordStrengthMeter 
                    password={newPassword} 
                    className="mt-1"
                    showLabel={true}
                  />
                )}
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Bekreft nytt passord
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Skriv passordet igjen"
                  required
                  disabled={isLoading}
                  aria-describedby="confirm-password-description"
                />
              </div>
              
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                <p id="new-password-description">Et sterkt passord bør være minst 8 tegn langt og inneholde en kombinasjon av 
                  store og små bokstaver, tall og spesialtegn.</p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  disabled={isLoading}
                  ariaLabel="Avbryt"
                  type="button"
                >
                  Avbryt
                </Button>
                <Button
                  variant="primary"
                  disabled={isLoading}
                  ariaLabel={isLoading ? "Oppdaterer..." : "Oppdater passord"}
                  type="submit"
                >
                  {isLoading ? "Oppdaterer..." : "Oppdater passord"}
                </Button>
              </div>
            </form>
          </CardBody>
          
          <CardFooter className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <p className="text-xs text-gray-500">
              Ditt passord beskyttes med kryptering og brukes for å logge inn på kontoen din.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}