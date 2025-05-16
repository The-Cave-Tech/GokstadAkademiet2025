"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { getAuthCookie } from "@/lib/utils/cookie";
import { UniversalModal } from "@/components/ui/custom/UniversalModal";
import PageIcons from "@/components/ui/custom/PageIcons";
import { formatTimeRemaining, getTimeToExpiration } from "@/lib/utils/jwt";

export function SessionHandler() {
  const { handleTokenExpired, isAuthenticated } = useAuth();
  const [showExpirationWarning, setShowExpirationWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [nextWarningTime, setNextWarningTime] = useState<number | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastWarningTimeRef = useRef<number>(0);

  // for cleaning up intervals
  const cleanupIntervals = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  // for manual logout
  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      cleanupIntervals();
      setShowExpirationWarning(false);
      await handleTokenExpired();
    } catch (error) {
      console.error("[SessionHandler] Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  }, [handleTokenExpired, cleanupIntervals]);

  // for token expiration check
  const checkTokenExpiration = useCallback(async () => {
    if (!isAuthenticated) {
      setShowExpirationWarning(false);
      cleanupIntervals();
      return;
    }

    try {
      const token = await getAuthCookie();
      if (!token) {
        setShowExpirationWarning(false);
        return;
      }

      const timeToExpiration = getTimeToExpiration(token);
      const now = Date.now();
      const canShowWarning = !nextWarningTime || now >= nextWarningTime;

      if (timeToExpiration <= 0) {
        cleanupIntervals();
        setShowExpirationWarning(false);
        handleLogout();
        return;
      }

      // Show warning 5 minutes before expiration
      if (timeToExpiration < 5 * 60 * 1000 && canShowWarning) {
        setTimeRemaining(formatTimeRemaining(timeToExpiration));
        setShowExpirationWarning(true);
        lastWarningTimeRef.current = now;
        
        // Clean up any existing countdown
        cleanupIntervals();
        
        // Schedule countdown updates
        countdownIntervalRef.current = setInterval(() => {
          const newTimeToExpiration = getTimeToExpiration(token);
          if (newTimeToExpiration <= 0) {
            cleanupIntervals();
            handleLogout();
          } else {
            setTimeRemaining(formatTimeRemaining(newTimeToExpiration));
          }
        }, 1000);
      }
    } catch (error) {
      console.error("[SessionHandler] Error checking token expiration:", error);
      setShowExpirationWarning(false);
    }
  }, [cleanupIntervals, handleLogout, nextWarningTime, isAuthenticated]);

  // Håndterer lukking av advarselen
  const handleCloseWarning = useCallback(() => {
    setShowExpirationWarning(false);
    setNextWarningTime(Date.now() + 2 * 60 * 1000);
  }, []);

  // Oppdater sjekk-intervall basert på autentiseringsstatus
  useEffect(() => {
    // Hvis ikke autentisert, ikke gjør noe
    if (!isAuthenticated) {
      setShowExpirationWarning(false);
      cleanupIntervals();
      
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      
      return;
    }

    // Start periodisk sjekk bare hvis brukeren er logget inn
    checkTokenExpiration();
    
    if (!checkIntervalRef.current) {
      checkIntervalRef.current = setInterval(checkTokenExpiration, 15000);
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [isAuthenticated, checkTokenExpiration, cleanupIntervals]);

  // Event-lytter for token-utløp
  useEffect(() => {
    const handleTokenExpiredEvent = () => {
      cleanupIntervals();
      setShowExpirationWarning(false); // Skjul advarsel umiddelbart
      handleLogout();
    };
    
    window.addEventListener('auth-token-expired', handleTokenExpiredEvent);

    return () => {
      window.removeEventListener('auth-token-expired', handleTokenExpiredEvent);
      cleanupIntervals();
    };
  }, [cleanupIntervals, handleLogout]);

  // Ikke vis noe hvis brukeren ikke er logget inn
  if (!isAuthenticated) {
    return null;
  }

  return (
    <UniversalModal
      isOpen={showExpirationWarning}
      onClose={handleCloseWarning}
      title="Økten din er i ferd med å utløpe"
    >
      <div className="space-y-6">
        <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-md flex items-start">
          <PageIcons name="warning" directory="profileIcons" size={20} alt="" className="mt-0.5 mr-2 flex-shrink-0" />
          <span>
            Du vil bli logget ut om omtrent <span className="font-semibold text-red-600">{timeRemaining}</span>
          </span>
        </div>
        
        <div className="text-gray-700">
          <p className="text-base">Din økt er i ferd med å utløpe. Vennligst lagre eventuelt arbeid du holder på med.</p>
          <p className="mt-2 text-base">Du kan enten fortsette arbeidet frem til økten utløper, eller du kan logge ut nå.</p>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="secondary"
            onClick={handleCloseWarning}
            disabled={isLoading}
            ariaLabel="Fortsett arbeidet"
            className="px-6 py-2 rounded-3xl"
          >
            Fortsett arbeidet
          </Button>
          <Button
            variant="primary"
            onClick={handleLogout}
            disabled={isLoading}
            ariaLabel={isLoading ? "Logger ut..." : "Logg ut nå"}
            className="px-6 py-2 rounded-3xl"
          >
            {isLoading ? "Logger ut..." : "Logg ut nå"}
          </Button>
        </div>
      </div>
    </UniversalModal>
  );
}