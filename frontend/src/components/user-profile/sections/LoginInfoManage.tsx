"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { useState } from "react";

export function LoginInfoManage() {
  const [userData, setUserData] = useState({
    username: "TheCaveTech25",
    email: "cave@tech.no",
    password: "•••••••"
  });

  // For å holde styr på hvilket felt som skal redigeres i modalen
  const [modalField, setModalField] = useState(null);

  // Denne vil senere åpne en modal for spesifikke felt
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
            <span className="text-black text-xl">🔑</span>
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
                <span className="text-gray-500 mr-3" aria-hidden="true">
                  👤
                </span>
                <span 
                  id="username-value" 
                  className="flex-grow bg-white p-3 rounded-md border border-gray-200 shadow-sm"
                >
                  {userData.username}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenModal('username')}
                  className="ml-3 h-10 w-10 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-sm text-gray-500 hover:bg-gray-50"
                  aria-label="Endre brukernavn"
                  aria-describedby="username-value"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>
                  </svg>
                </button>
              </dd>
            </div>

            {/* E-post */}
            <div className="flex flex-col">
              <dt className="text-gray-600 mb-2">E-post</dt>
              <dd className="flex items-center">
                <span className="text-gray-500 mr-3" aria-hidden="true">
                  ✉️
                </span>
                <span 
                  id="email-value" 
                  className="flex-grow bg-white p-3 rounded-md border border-gray-200 shadow-sm"
                >
                  {userData.email}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenModal('email')}
                  className="ml-3 h-10 w-10 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-sm text-gray-500 hover:bg-gray-50"
                  aria-label="Endre e-post"
                  aria-describedby="email-value"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>
                  </svg>
                </button>
              </dd>
            </div>

            {/* Passord */}
            <div className="flex flex-col">
              <dt className="text-gray-600 mb-2">Passord</dt>
              <dd className="flex items-center">
                <span className="text-gray-500 mr-3" aria-hidden="true">
                  🔒
                </span>
                <span 
                  id="password-value" 
                  className="flex-grow bg-white p-3 rounded-md border border-gray-200 shadow-sm font-mono"
                >
                  {userData.password}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenModal('password')}
                  className="ml-3 h-10 w-10 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-sm text-gray-500 hover:bg-gray-50"
                  aria-label="Endre passord"
                  aria-describedby="password-value"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>
                  </svg>
                </button>
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