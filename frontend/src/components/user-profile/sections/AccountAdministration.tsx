"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { useState } from "react";
import PageIcons from "@/components/ui/custom/PageIcons";

export function AccountAdministration() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [deletionReason, setDeletionReason] = useState("");

  const handleDeleteRequestToggle = () => {
    setIsConfirming(!isConfirming);
  };

  const handleReasonChange = (e) => {
    setDeletionReason(e.target.value);
  };

  const handleDeleteAccount = () => {
    // Her ville vi normalt kalle et API for å slette kontoen
    console.log("Sletter konto med årsak:", deletionReason);
    alert("Dette ville ha slettet kontoen din i en faktisk implementasjon.");
    setIsConfirming(false);
    setDeletionReason("");
  };

  return (
    <Card className="w-full bg-[#d1c0c0]">
      <CardHeader className="flex items-center gap-3 rounded-md">
        <figure className="w-10 h-10 rounded-full bg-[#ff6b6b] flex items-center justify-center">
          <PageIcons name="warning" directory="profileIcons" size={24} alt="Advarsel" color="white" />
          <figcaption className="sr-only">Ikon for kontoadministrasjon</figcaption>
        </figure>
        <div>
          <h2 className="text-base font-medium text-gray-900">
            Kontoadministrasjon
          </h2>
          <p className="text-sm text-gray-600">
            Faresone
          </p>
        </div>
      </CardHeader>

      <CardBody className="pt-5 px-4 rounded-md">
        <div className="space-y-6">
          {/* Informasjon om sletting */}
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
    </Card>
  );
}