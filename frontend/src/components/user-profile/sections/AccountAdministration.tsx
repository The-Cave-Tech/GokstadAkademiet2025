"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import PageIcons from "@/components/ui/custom/PageIcons";

import { useRouter } from "next/navigation";
import { DeleteAccountModal } from "@/components/ui/modals/userProfile/DeleteAccountModal";
import { EmailVerificationModal } from "@/components/ui/modals/userProfile/EmailVerificationModal";

export function AccountAdministration() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [deletionReason, setDeletionReason] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEmailVerificationOpen, setIsEmailVerificationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDeleteRequestToggle = () => {
    setIsConfirming(!isConfirming);
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDeletionReason(e.target.value);
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true); // Åpne modal for passordbekreftelse
  };

  const handlePasswordVerification = async (password: string) => {
    try {
      setIsLoading(true);
      // Simuler API-kall for å validere passord og sende verifiseringskode
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulert forsinkelse
      setIsDeleteModalOpen(false); // Lukk passordmodal
      setIsEmailVerificationOpen(true); // Åpne e-postverifiseringsmodal
    } catch (error) {
      console.error("Feil ved passordvalidering:", error);
      throw new Error("Ugyldig passord");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async (code: string) => {
    try {
      setIsLoading(true);
      // Simuler API-kall for å validere verifiseringskode og slette konto
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulert forsinkelse
      console.log("Sletter konto med årsak:", deletionReason);

      // Fjern JWT 
     

      // Logg ut brukeren og redirect til landingssiden
      router.push("/");
    } catch (error) {
      console.error("Feil ved e-postverifisering:", error);
      throw new Error("Ugyldig verifiseringskode");
    } finally {
      setIsLoading(false);
      setIsConfirming(false);
      setDeletionReason("");
      setIsEmailVerificationOpen(false);
    }
  };

  return (
    <Card className="w-full bg-[#d1c0c0]">
      <CardHeader className="flex items-center gap-3 rounded-md">
        <figure className="w-10 h-10 rounded-full bg-[#ff6b6b] flex items-center justify-center">
          <PageIcons name="warning" directory="profileIcons" size={24} alt="Advarsel" color="white" />
          <figcaption className="sr-only">Ikon for kontoadministrasjon</figcaption>
        </figure>
        <div>
          <h2 className="text-base font-medium text-gray-900">Kontoadministrasjon</h2>
          <p className="text-sm text-gray-600">Faresone</p>
        </div>
      </CardHeader>

      <CardBody className="pt-5 px-4 rounded-md">
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-base text-gray-800">
              Sletting av kontoen er permanent og kan ikke angres. All din data vil bli slettet, inkludert personlig informasjon, reservasjoner og favoritter.
            </p>

            {isConfirming ? (
              <div className="space-y-4 p-4 bg-white rounded-md shadow-sm">
                <div>
                  <label htmlFor="deletionReason" className="block mb-1 font-medium text-gray-700">
                    Hvorfor ønsker du å slette kontoen din? (valgfritt)
                  </label>
                  <textarea
                    id="deletionReason"
                    name="deletionReason"
                    rows={3}
                    value={deletionReason}
                    onChange={handleReasonChange}
                    placeholder="Fortell oss hvorfor du ønsker å slette kontoen din..."
                    className="w-full px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none bg-white"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleDeleteRequestToggle}
                    className="px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-md focus:outline-none"
                  >
                    Avbryt
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-500 text-white font-medium rounded-md focus:outline-none"
                  >
                    Bekreft sletting
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleDeleteRequestToggle}
                  className="px-4 py-2 bg-red-500 text-white font-medium rounded-md focus:outline-none"
                >
                  Slett konto
                </button>
              </div>
            )}
          </div>
        </div>
      </CardBody>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        currentEmail="bruker@eksempel.no" // Erstatt med faktisk e-post fra kontekst
        onClose={() => setIsDeleteModalOpen(false)}
        onVerify={handlePasswordVerification}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      <EmailVerificationModal
        isOpen={isEmailVerificationOpen}
        onClose={() => setIsEmailVerificationOpen(false)}
        onVerify={handleEmailVerification}
        email="bruker@eksempel.no" // Erstatt med faktisk e-post fra kontekst
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </Card>
  );
}