"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { useState } from "react";
import { PageIcons } from "@/components/ui/custom/PageIcons";
import { Button } from "@/components/ui/custom/button";

export function LoginInfoManage() {
  const [userData, setUserData] = useState({
    username: "TheCaveTech25",
    email: "cave@tech.no",
    password: "•••••••"
  });

  // For å holde styr på hvilket felt som skal redigeres i modalen
  const [modalField, setModalField] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // Håndter klikk på modalChange-knappen
  const handleOpenModal = (fieldName) => {
    console.log(`Åpner modal for ${fieldName}`);
    setModalField(fieldName);
    // Her ville den faktiske modal-logikken komme
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
            {/* Brukernavn */}
            <div className="flex flex-col">
              <dt className="text-gray-600 mb-2">Brukernavn</dt>
              <dd className="flex items-center">

                <span 
                  id="username-value" 
                  className="flex-grow bg-white p-3 rounded-md border border-gray-200 shadow-sm h-12 flex items-center"
                >
                  {userData.username}
                </span>
                <div className="ml-3">
                  <Button 
                    variant="modalChange"
                    modalState={isModalLoading && modalField === 'username' ? "loading" : "edit"}
                    onClick={() => handleOpenModal('username')}
                    ariaLabel="Endre brukernavn"
                    disabled={isModalLoading}
                    size="sm"
                  />
                </div>
              </dd>
            </div>

            {/* E-post */}
            <div className="flex flex-col">
              <dt className="text-gray-600 mb-2">E-post</dt>
              <dd className="flex items-center">

                <span 
                  id="email-value" 
                  className="flex-grow bg-white p-3 rounded-md border border-gray-200 shadow-sm h-12 flex items-center"
                >
                  {userData.email}
                </span>
                <div className="ml-3">
                  <Button 
                    variant="modalChange"
                    modalState={isModalLoading && modalField === 'email' ? "loading" : "edit"}
                    onClick={() => handleOpenModal('email')}
                    ariaLabel="Endre e-post"
                    disabled={isModalLoading}
                    size="sm"
                  />
                </div>
              </dd>
            </div>

            {/* Passord */}
            <div className="flex flex-col">
              <dt className="text-gray-600 mb-2">Passord</dt>
              <dd className="flex items-center">

                <span 
                  id="password-value" 
                  className="flex-grow bg-white p-3 rounded-md border border-gray-200 shadow-sm font-mono h-12 flex items-center"
                >
                  {userData.password}
                </span>
                <div className="ml-3">
                  <Button 
                    variant="modalChange"
                    modalState={isModalLoading && modalField === 'password' ? "loading" : "edit"}
                    onClick={() => handleOpenModal('password')}
                    ariaLabel="Endre passord"
                    disabled={isModalLoading}
                    size="sm"
                  />
                </div>
              </dd>
            </div>
          </dl>

          {/* Her ville modalene bli rendret */}
          {modalField && (
            <div className="hidden" aria-hidden="true">
              {/* Dette er en placeholder for framtidige modaler */}
              {/* Vil bli erstattet med faktiske modale komponenter */}
            </div>
          )}
        </CardBody>
      </Card>
    </section>
  );
}