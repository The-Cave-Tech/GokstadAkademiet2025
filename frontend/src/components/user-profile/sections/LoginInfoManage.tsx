"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { useState } from "react";
import { PageIcons } from "@/components/ui/custom/PageIcons";
import { Button } from "@/components/ui/custom/Button";
import { ModalType, UserCredentials } from "@/types/loginInfoManage.types";
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

  const [modalField, setModalField] = useState<ModalType>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [pendingData, setPendingData] = useState<{
    type: "username" | "email" | null;
    value: string;
  }>({ type: null, value: "" });

  const handleOpenModal = (fieldName: ModalType) => {
    setModalField(fieldName);
  };

  const handleCloseModal = () => {
    setModalField(null);
    setShowVerificationModal(false);
    setPendingData({ type: null, value: "" });
  };

  const handleUsernameUpdate = async (newUsername: string) => {
    try {
      setIsModalLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPendingData({ type: "username", value: newUsername });
      setModalField(null);
      setShowVerificationModal(true);
    } catch (error) {
      console.error("Feil ved initiering av brukernavnendring:", error);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleInitiateEmailUpdate = async (newEmail: string) => {
    try {
      setIsModalLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPendingData({ type: "email", value: newEmail });
      setModalField(null);
      setShowVerificationModal(true);
    } catch (error) {
      console.error("Feil ved initiering av e-postendring:", error);
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
      throw error; // La EmailVerificationModal håndtere feilen
    } finally {
      setIsModalLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      setIsModalLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserData(prev => ({
        ...prev,
        password: "•••••••",
      }));
      handleCloseModal();
    } catch (error) {
      console.error("Feil ved oppdatering av passord:", error);
    } finally {
      setIsModalLoading(false);
    }
  };

  return (
    <section aria-labelledby="login-info-heading">
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
                    modalState={isModalLoading && modalField === "username" ? "loading" : "edit"}
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
                    modalState={isModalLoading && modalField === "email" ? "loading" : "edit"}
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
                    modalState={isModalLoading && modalField === "password" ? "loading" : "edit"}
                    onClick={() => handleOpenModal("password")}
                    ariaLabel="Endre passord"
                    disabled={isModalLoading}
                    size="sm"
                  />
                </div>
              </dd>
            </div>
          </dl>

          {modalField === "username" && (
            <UsernameChangeModal
              isOpen={true}
              currentUsername={userData.username}
              onClose={handleCloseModal}
              onUpdate={handleUsernameUpdate}
              isLoading={isModalLoading}
              setIsLoading={setIsModalLoading}
            />
          )}

          {modalField === "email" && (
            <EmailChangeModal
              isOpen={true}
              currentEmail={userData.email}
              onClose={handleCloseModal}
              onUpdate={handleInitiateEmailUpdate}
              isLoading={isModalLoading}
              setIsLoading={setIsModalLoading}
            />
          )}

          {modalField === "password" && (
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