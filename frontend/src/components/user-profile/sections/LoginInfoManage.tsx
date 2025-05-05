"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { useState, useEffect } from "react";
import PageIcons from "@/components/ui/custom/PageIcons";
import { Button } from "@/components/ui/custom/Button";
import { ModalType, UserCredentials } from "@/types/loginInfoManage.types";
import { EmailChangeModal } from "@/components/user-profile/modals/EmailChangeModal";
import { EmailVerificationModal } from "@/components/user-profile/modals/EmailVerificationModal";
import { getUserCredentials } from "@/lib/data/services/userProfile";
import { 
  requestUsernameChange, 
  changeUsername, 
  requestEmailChange, 
  verifyEmailChange,
  changePassword,
  resendUsernameVerification,
  resendEmailVerification
} from "@/lib/data/services/profileSections/credentialsService";
import { UsernameChangeModal } from "../modals/UsernameChangeModal";
import { PasswordChangeModal } from "../modals/PasswordChangeModal";
import { handleStrapiError } from "@/lib/utils/serverAction-errorHandler";

export function LoginInfoManage() {
  const [userData, setUserData] = useState<UserCredentials>({
    username: "",
    email: "",
    password: "•••••••",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [pendingData, setPendingData] = useState<{
    type: "username" | "email" | null;
    value: string;
  }>({ type: null, value: "" });

  
  useEffect(() => {
    async function fetchUserCredentials() {
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
    }

    fetchUserCredentials();
  }, []);

  const handleOpenModal = (fieldName: ModalType) => {
    setModalType(fieldName);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setShowVerificationModal(false);
    setPendingData({ type: null, value: "" });
  };

  const handleUsernameUpdate = async (newUsername: string, password: string) => {
    try {
      setIsModalLoading(true);
      
      // Request username change, this will send verification code to email
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
      // Use handleStrapiError here to transform the error before throwing
      const errorMessage = handleStrapiError(error);
      throw new Error(errorMessage);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleEmailUpdate = async (newEmail: string, password: string) => {
    try {
      setIsModalLoading(true);
      
      // Request email change, this will send verification code to new email
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
      // Use handleStrapiError here to transform the error before throwing
      const errorMessage = handleStrapiError(error);
      throw new Error(errorMessage);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handlePasswordUpdate = async (currentPassword: string, newPassword: string) => {
    try {
      setIsModalLoading(true);
      
      // Change password
      const response = await changePassword(currentPassword, newPassword);
      
      if (response.success) {
        setUserData(prev => ({
          ...prev,
          password: "•••••••",
        }));
        
        handleCloseModal();
      } else {
        throw new Error(response.message || "Kunne ikke endre passord");
      }
    } catch (error) {
      console.error("Feil ved passord-endring:", error);
      // Use handleStrapiError here to transform the error before throwing
      const errorMessage = handleStrapiError(error);
      throw new Error(errorMessage);
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
          setUserData(prev => ({
            ...prev,
            username: response.username,
          }));
        } else {
          throw new Error(response.message || "Kunne ikke verifisere brukernavn-endring");
        }
      } else if (pendingData.type === "email") {
        const response = await verifyEmailChange(verificationCode);
        
        if (response.success) {
          setUserData(prev => ({
            ...prev,
            email: response.email,
          }));
        } else {
          throw new Error(response.message || "Kunne ikke verifisere e-post-endring");
        }
      }
      
      handleCloseModal();
    } catch (error) {
      console.error("Feil ved verifisering:", error);
      // Use handleStrapiError here to transform the error before throwing
      const errorMessage = handleStrapiError(error);
      throw new Error(errorMessage);
    } finally {
      setIsModalLoading(false);
    }
  };

  // Handler for resending verification code
  const handleResendVerificationCode = async () => {
    try {
      setIsModalLoading(true);
      
      let response;
      if (pendingData.type === "username") {
        // Resend username verification code
        response = await resendUsernameVerification();
      } else if (pendingData.type === "email") {
        // Resend email verification code
        response = await resendEmailVerification();
      } else {
        throw new Error("Ingen aktiv verifisering funnet");
      }
      
      if (!response.success) {
        throw new Error(response.message || "Kunne ikke sende ny kode");
      }
      
      return true;
    } catch (error) {
      console.error("Feil ved sending av ny kode:", error);
      // Use handleStrapiError here to transform the error before throwing
      const errorMessage = handleStrapiError(error);
      throw new Error(errorMessage);
    } finally {
      setIsModalLoading(false);
    }
  };

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

        <CardBody className="pt-5 px-4 pb-8 rounded-md">
          <dl className="space-y-8">
            <div className="flex flex-col">
              <dt className="text-gray-600 mb-2">Brukernavn</dt>
              <dd className="flex items-center">
                <span
                  id="username-value"
                  className="flex-grow bg-white p-3 rounded-md border border-gray-200 shadow-sm h-12 flex items-center"
                  aria-live="polite"
                >
                  {userData.username}
                </span>
                <div className="ml-3">
                  <Button
                    variant="modalChange"
                    modalState={isModalLoading && modalType === "username" ? "loading" : "edit"}
                    onClick={() => handleOpenModal("username")}
                    ariaLabel="Endre brukernavn"
                    disabled={isModalLoading}
                    size="sm"
                  />
                </div>
              </dd>
            </div>

            <div className="flex flex-col">
              <dt className="text-gray-600 mb-2">E-post</dt>
              <dd className="flex items-center">
                <span
                  id="email-value"
                  className="flex-grow bg-white p-3 rounded-md border border-gray-200 shadow-sm h-12 flex items-center"
                  aria-live="polite"
                >
                  {userData.email}
                </span>
                <div className="ml-3">
                  <Button
                    variant="modalChange"
                    modalState={isModalLoading && modalType === "email" ? "loading" : "edit"}
                    onClick={() => handleOpenModal("email")}
                    ariaLabel="Endre e-post"
                    disabled={isModalLoading}
                    size="sm"
                  />
                </div>
              </dd>
            </div>

            <div className="flex flex-col">
              <dt className="text-gray-600 mb-2">Passord</dt>
              <dd className="flex items-center">
                <span
                  id="password-value"
                  className="flex-grow bg-white p-3 rounded-md border border-gray-200 shadow-sm font-mono h-12 flex items-center"
                  aria-live="polite"
                >
                  {userData.password}
                </span>
                <div className="ml-3">
                  <Button
                    variant="modalChange"
                    modalState={isModalLoading && modalType === "password" ? "loading" : "edit"}
                    onClick={() => handleOpenModal("password")}
                    ariaLabel="Endre passord"
                    disabled={isModalLoading}
                    size="sm"
                  />
                </div>
              </dd>
            </div>
          </dl>

          {/* Username Change Modal */}
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

          {/* Email Change Modal */}
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

          {/* Password Change Modal */}
          {modalType === "password" && (
            <PasswordChangeModal
              isOpen={true}
              onClose={handleCloseModal}
              onUpdate={(currentPassword, newPassword) => handlePasswordUpdate(currentPassword, newPassword)}
              isLoading={isModalLoading}
              setIsLoading={setIsModalLoading}
            />
          )}

          {/* Verification Modal */}
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