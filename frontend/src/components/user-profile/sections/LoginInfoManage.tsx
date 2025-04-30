"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { useState } from "react";
import PageIcons from "@/components/ui/custom/PageIcons";
import { Button } from "@/components/ui/custom/Button";
import { ModalType, UserCredentials, UpdatePayload } from "@/types/loginInfoManage.types";
import { UsernameChangeModal } from "@/components/ui/modals/userProfile/UsernameChangeModal";
import { EmailChangeModal } from "@/components/ui/modals/userProfile/EmailChangeModal";
import { PasswordChangeModal } from "@/components/ui/modals/userProfile/PasswordChangeModal";
import { EmailVerificationModal } from "@/components/ui/modals/userProfile/EmailVerificationModal";

export function LoginInfoManage() {
  const [userData, setUserData] = useState<UserCredentials>({
    username: "TheCaveTech25",
    email: "cave@tech.no",
    password: "•••••••",
  });

  const [modalType, setModalType] = useState<ModalType>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [pendingData, setPendingData] = useState<{
    type: "username" | "email" | null;
    value: string;
  }>({ type: null, value: "" });

  const handleOpenModal = (fieldName: ModalType) => {
    setModalType(fieldName);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setShowVerificationModal(false);
    setPendingData({ type: null, value: "" });
  };

  const handleUpdate = async (payload: UpdatePayload) => {
    try {
      setIsModalLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (payload.type === "username") {
        setPendingData({ type: "username", value: payload.value });
        setModalType(null);
        setShowVerificationModal(true);
      } else if (payload.type === "email") {
        setPendingData({ type: "email", value: payload.value });
        setModalType(null);
        setShowVerificationModal(true);
      } else if (payload.type === "password") {
        setUserData(prev => ({
          ...prev,
          password: "•••••••",
        }));
        handleCloseModal();
      }
    } catch (error) {
      console.error(`Feil ved initiering av ${payload.type}-endring:`, error);
      throw error;
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleVerification = async () => {
    try {
      setIsModalLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (pendingData.type === "username") {
        setUserData(prev => ({
          ...prev,
          username: pendingData.value,
        }));
      } else if (pendingData.type === "email") {
        setUserData(prev => ({
          ...prev,
          email: pendingData.value,
        }));
      }

      handleCloseModal();
    } catch (error) {
      console.error("Feil ved verifisering:", error);
      throw error;
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleUsernameUpdate = async (newUsername: string) => {
    return handleUpdate({ type: "username", value: newUsername });
  };

  const handleEmailUpdate = async (newEmail: string) => {
    return handleUpdate({ 
      type: "email", 
      value: newEmail, 
      password: "" // This would be filled in the real implementation
    });
  };

  const handlePasswordUpdate = async () => {
    return handleUpdate({ 
      type: "password", 
      currentPassword: "",
      newPassword: "" 
    });
  };

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