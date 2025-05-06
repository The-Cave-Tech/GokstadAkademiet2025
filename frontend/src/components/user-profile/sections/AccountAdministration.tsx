"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import PageIcons from "@/components/ui/custom/PageIcons";
import { useRouter } from "next/navigation";
import {
  requestAccountDeletion,
  verifyAndDeleteAccount,
  resendDeletionVerification
} from "@/lib/data/services/profileSections/accountAdministrationService";
import { useAuth } from "@/lib/context/AuthContext";
import { getUserCredentials } from "@/lib/data/services/userProfile";
import { Button } from "@/components/ui/custom/Button";
import { DeleteAccountModal } from "../modals/DeleteAccountModal";
import { AccountDeletionVerificationModal } from "../modals/AccountDeletionVerificationModal";

export function AccountAdministration() {
  const [deletionReason, setDeletionReason] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEmailVerificationOpen, setIsEmailVerificationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  // Hent brukerens e-post når det trengs
  useEffect(() => {
    const fetchUserEmail = async () => {
      if (!userEmail) {
        try {
          const userData = await getUserCredentials();
          setUserEmail(userData.email);
        } catch (error) {
          console.error("Feil ved henting av brukerdata:", error);
        }
      }
    };

    fetchUserEmail();
  }, [userEmail]);

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
  };

  const handlePasswordVerification = async (password: string) => {
    try {
      setIsLoading(true);
      // Pass the password to the service function
      const response = await requestAccountDeletion(password);

      if (response.success) {
        setIsDeleteModalOpen(false);
        setIsEmailVerificationOpen(true);
      } else {
        throw new Error(
          response.message || "Kunne ikke sende verifiseringskode"
        );
      }
    } catch (error) {
      console.error("Feil ved forespørsel om kontosletting:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Kunne ikke sende forespørsel om kontosletting"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async (code: string, reason?: string) => {
    try {
      setIsLoading(true);
      const response = await verifyAndDeleteAccount(code, reason);

      if (response.success) {
        setIsAuthenticated(false);

        router.push("/?message=Din konto er nå slettet");
      } else {
        throw new Error(response.message || "Kunne ikke slette konto");
      }
    } catch (error) {
      console.error("Feil ved sletting av konto:", error);
      throw new Error(
        error instanceof Error ? error.message : "Kunne ikke slette konto"
      );
    } finally {
      setIsLoading(false);
      setDeletionReason("");
      setIsEmailVerificationOpen(false);
    }
  };

  // Handler for resending account deletion verification code
  const handleResendDeletionVerificationCode = async () => {
    try {
      setIsLoading(true);
      
      const response = await resendDeletionVerification();
      
      if (!response.success) {
        throw new Error(response.message || "Kunne ikke sende ny kode");
      }
      
      return true;
    } catch (error) {
      console.error("Feil ved sending av ny kode:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-[#d1c0c0]">
      <CardHeader className="flex items-center gap-3 rounded-md">
        <figure className="w-10 h-10 rounded-full bg-[#ff6b6b] flex items-center justify-center">
          <PageIcons
            name="warning"
            directory="profileIcons"
            size={24}
            alt="Advarsel"
            color="white"
          />
          <figcaption className="sr-only">
            Ikon for kontoadministrasjon
          </figcaption>
        </figure>
        <div>
          <h2 className="text-base font-medium text-gray-900">
            Kontoadministrasjon
          </h2>
          <p className="text-sm text-gray-600">Faresone</p>
        </div>
      </CardHeader>

      <CardBody className="pt-5 px-4 rounded-md">
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-base text-gray-800">
              Sletting av kontoen er permanent og kan ikke angres. All din data
              vil bli slettet, inkludert personlig informasjon, reservasjoner og
              favoritter.
            </p>

            <div className="flex justify-end">
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                ariaLabel="Slett konto"
                type="button"
                className="px-4 py-2 rounded-md"
              >
                Slett konto
              </Button>
            </div>
          </div>
        </div>
      </CardBody>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        currentEmail={userEmail}
        onClose={() => setIsDeleteModalOpen(false)}
        onVerify={handlePasswordVerification}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      <AccountDeletionVerificationModal
        isOpen={isEmailVerificationOpen}
        onClose={() => setIsEmailVerificationOpen(false)}
        onVerify={handleEmailVerification}
        onResendCode={handleResendDeletionVerificationCode}
        email={userEmail}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        deletionReason={deletionReason}
        setDeletionReason={setDeletionReason}
      />
    </Card>
  );
}