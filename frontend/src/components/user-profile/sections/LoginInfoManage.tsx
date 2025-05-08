"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { useState, useEffect } from "react";
import PageIcons from "@/components/ui/custom/PageIcons";
import { Button } from "@/components/ui/custom/Button";
import { LoginInfoManageProps, ModalType, UserCredentials } from "@/types/loginInfoManage.types";
import { EmailChangeModal } from "@/components/user-profile/modals/EmailChangeModal";
import { EmailVerificationModal } from "@/components/user-profile/modals/EmailVerificationModal";
import { UsernameChangeModal } from "../modals/UsernameChangeModal";
import { PasswordChangeModal } from "../modals/PasswordChangeModal";
import { getUserCredentials } from "@/lib/data/services/userProfile";
import { handleStrapiError } from "@/lib/utils/serverAction-errorHandler";
import { useAuth } from "@/lib/context/AuthContext";
import { getProviderDisplayName, getProviderLoginUrl } from "@/types/userProfile.types";
import { requestUsernameChange, changeUsername, requestEmailChange, 
  verifyEmailChange, changePassword, resendUsernameVerification, resendEmailVerification 
} from "@/lib/data/services/profileSections/credentialsService";

export function LoginInfoManage({ refreshProfile }: LoginInfoManageProps) {
  const { authProvider, refreshAuthStatus } = useAuth();
  const isOAuthUser = authProvider && authProvider !== 'local';
  
  // State
  const [userData, setUserData] = useState<UserCredentials>({ username: "", email: "", password: "•••••••" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [pendingData, setPendingData] = useState<{ type: "username" | "email" | null; value: string }>({ type: null, value: "" });

  // Hent oppdatert autentiseringsstatus og brukerdata
  useEffect(() => {
    refreshAuthStatus().then(() => {
      loadUserData();
    });
  }, [refreshAuthStatus]);
  
  // Separat funksjon for lasting av brukerdata
  const loadUserData = async () => {
    try {
      setLoading(true);
      const credentials = await getUserCredentials();
      setUserData({
        username: credentials.username,
        email: credentials.email,
        password: "•••••••", 
      });
      setError(null);
    } catch (err) {
      console.error("Feil ved henting av brukerdata:", err);
      setError(handleStrapiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleOpenModal = (fieldName: ModalType) => setModalType(fieldName);
  const handleCloseModal = () => {
    setModalType(null);
    setShowVerificationModal(false);
    setPendingData({ type: null, value: "" });
  };

  // Update handlers
  const handleUsernameUpdate = async (newUsername: string, password: string) => {
    try {
      setIsModalLoading(true);
      const response = await requestUsernameChange(newUsername, password);
      
      if (response.success) {
        setPendingData({ type: "username", value: newUsername });
        setModalType(null);
        setShowVerificationModal(true);
      } else {
        throw new Error(response.message || "Kunne ikke sende forespørsel om brukernavn-endring");
      }
    } catch (error) {
      console.error("Feil ved forespørsel om brukernavn-endring:", error);
      throw new Error(handleStrapiError(error));
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleEmailUpdate = async (newEmail: string, password: string) => {
    try {
      setIsModalLoading(true);
      
      // Refresh auth status før endring for å sikre at vi har oppdatert informasjon
      await refreshAuthStatus();
      
      if (authProvider && authProvider !== 'local') {
        throw new Error(`Du må endre e-post hos ${getProviderDisplayName(authProvider)}`);
      }
      
      const response = await requestEmailChange(newEmail, password);
      
      if (response.success) {
        setPendingData({ type: "email", value: newEmail });
        setModalType(null);
        setShowVerificationModal(true);
      } else {
        throw new Error(response.message || "Kunne ikke sende forespørsel om e-post-endring");
      }
    } catch (error) {
      console.error("Feil ved forespørsel om e-post-endring:", error);
      throw new Error(handleStrapiError(error));
    } finally {
      setIsModalLoading(false);
    }
  };

  const handlePasswordUpdate = async (currentPassword: string, newPassword: string) => {
    try {
      setIsModalLoading(true);
      
      // Refresh auth status før endring for å sikre at vi har oppdatert informasjon
      await refreshAuthStatus();
      
      if (authProvider && authProvider !== 'local') {
        throw new Error(`Du må endre passord hos ${getProviderDisplayName(authProvider)}`);
      }
      
      const response = await changePassword(currentPassword, newPassword);
      
      if (response.success) {
        setUserData(prev => ({ ...prev, password: "•••••••" }));
        await refreshProfile();
        handleCloseModal();
      } else {
        throw new Error(response.message || "Kunne ikke endre passord");
      }
    } catch (error) {
      console.error("Feil ved passord-endring:", error);
      throw new Error(handleStrapiError(error));
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleVerification = async (verificationCode: string) => {
    try {
      setIsModalLoading(true);
      
      if (pendingData.type === "username" && pendingData.value) {
        const response = await changeUsername(pendingData.value, verificationCode);
        if (response.success) {
          setUserData(prev => ({ ...prev, username: response.username }));
        } else {
          throw new Error(response.message || "Kunne ikke verifisere brukernavn-endring");
        }
      } else if (pendingData.type === "email") {
        const response = await verifyEmailChange(verificationCode);
        if (response.success) {
          setUserData(prev => ({ ...prev, email: response.email }));
        } else {
          throw new Error(response.message || "Kunne ikke verifisere e-post-endring");
        }
      }
      
      await refreshProfile();
      handleCloseModal();
    } catch (error) {
      console.error("Feil ved verifisering:", error);
      throw new Error(handleStrapiError(error));
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleResendVerificationCode = async () => {
    try {
      setIsModalLoading(true);
      
      let response: { success: boolean; message?: string };
      
      if (pendingData.type === "username") {
        response = await resendUsernameVerification();
      } else if (pendingData.type === "email") {
        response = await resendEmailVerification();
      } else {
        response = { success: false, message: "Ingen aktiv verifisering funnet" };
      }
      
      if (!response.success) {
        throw new Error(response.message || "Kunne ikke sende ny kode");
      }
      
      return true;
    } catch (error) {
      console.error("Feil ved sending av ny kode:", error);
      throw new Error(handleStrapiError(error));
    } finally {
      setIsModalLoading(false);
    }
  };

  // Loading and error states
  if (loading) {
    return (
      <Card className="w-full bg-[rgb(245,238,231)]">
        <CardBody>
          <div className="flex justify-center items-center p-8">
            <span className="text-gray-600">Laster påloggingsinformasjon...</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-[rgb(245,238,231)]">
        <CardBody>
          <div className="flex justify-center items-center p-8">
            <span className="text-red-600">{error}</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  // UI Components
  const InfoField = ({ label, value, fieldType }: { label: string; value: string; fieldType: ModalType }) => (
    <div className="flex flex-col">
      <dt className="text-gray-700 font-medium mb-2">{label}</dt>
      <dd className="flex items-center">
        <span
          id={`${fieldType}-value`}
          className={`flex-grow bg-white p-3 rounded-md border border-gray-200 shadow-sm h-12 flex items-center ${fieldType === "password" ? "font-mono" : ""}`}
          aria-live="polite"
        >
          {value}
        </span>
        <div className="ml-3">
          {isOAuthUser && (fieldType === "email" || fieldType === "password" || fieldType === "username") ? (
            <div className="p-2 bg-gray-100 rounded-full text-xs text-gray-500 flex items-center justify-center">
              <PageIcons name="lock" directory="profileIcons" size={18} alt="Låst" />
            </div>
          ) : (
            <Button
              variant="modalChange"
              modalState={isModalLoading && modalType === fieldType ? "loading" : "edit"}
              onClick={() => handleOpenModal(fieldType)}
              ariaLabel={`Endre ${label.toLowerCase()}`}
              disabled={isModalLoading}
              size="sm"
            />
          )}
        </div>
      </dd>
    </div>
  );

  return (
    <section aria-labelledby="login-info-heading" className="w-full max-w-[600px] mx-auto">
      <Card className="w-full bg-[rgb(245,238,231)]">
        <CardHeader className="flex items-center gap-3 rounded-md">
          <figure className="w-10 h-10 rounded-full bg-[#d1d1d1] flex items-center justify-center" aria-hidden="true">
            <PageIcons name="key" directory="profileIcons" size={24} alt="Påloggingsinformasjon" />
          </figure>
          <div>
            <h2 id="login-info-heading" className="text-base font-medium text-gray-900">
              Påloggingsinformasjon
            </h2>
            <p className="text-sm text-gray-600">
              Brukes for å logge inn på kontoen din
            </p>
          </div>
        </CardHeader>

        <CardBody className="rounded-md">
          {isOAuthUser && (
            <div className="mb-2 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-base font-medium text-blue-800 flex items-center">
                Du er logget inn via {getProviderDisplayName(authProvider)}
              </h3>
              <p className="mt-2 text-sm text-blue-600">
                For å endre brukernavn eller e-post:{" "}
                <a href={getProviderLoginUrl(authProvider as string)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800">
                  Gå til {getProviderDisplayName(authProvider)}
                </a>
              </p>
            </div>
          )}

          <dl className="space-y-4">
            <InfoField label="Brukernavn" value={userData.username} fieldType="username" />
            <InfoField label="E-post" value={userData.email} fieldType="email" />
            {/* Skjul passordfeltet helt for OAuth-brukere */}
            {!isOAuthUser && (
              <InfoField label="Passord" value={userData.password} fieldType="password" />
            )}
          </dl>

          {/* Modals */}
          {modalType === "username" && (
            <UsernameChangeModal
              isOpen={true}
              currentUsername={userData.username}
              onClose={handleCloseModal}
              onUpdate={handleUsernameUpdate}
              isLoading={isModalLoading}
              setIsLoading={setIsModalLoading}
            />
          )}

          {modalType === "email" && (
            <EmailChangeModal
              isOpen={true}
              currentEmail={userData.email}
              onClose={handleCloseModal}
              onUpdate={handleEmailUpdate}
              isLoading={isModalLoading}
              setIsLoading={setIsModalLoading}
            />
          )}

          {modalType === "password" && (
            <PasswordChangeModal
              isOpen={true}
              onClose={handleCloseModal}
              onUpdate={handlePasswordUpdate}
              isLoading={isModalLoading}
              setIsLoading={setIsModalLoading}
            />
          )}

          {showVerificationModal && (
            <EmailVerificationModal
              isOpen={true}
              onClose={handleCloseModal}
              onVerify={handleVerification}
              onResendCode={handleResendVerificationCode}
              email={pendingData.type === "email" ? pendingData.value : userData.email}
              isLoading={isModalLoading}
              setIsLoading={setIsModalLoading}
            />
          )}
        </CardBody>
      </Card>
    </section>
  );
}