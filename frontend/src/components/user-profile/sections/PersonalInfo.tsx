"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { useState } from "react";
import { Button } from "@/components/ui/custom/button";
import { PageIcons } from "@/components/ui/custom/PageIcons";

export function PersonalInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Mitt Fullenavn",
    birthDate: "01.01.2000",
    gender: "Mann",
    phoneNumber: "(+47)",
    streetAddress: "Gate",
    postalCode: "Postnummer",
    city: "By",
  });

  const handleSave = async () => {
    if (isEditing) {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsEditing(false);
      } catch (error) {
        console.error("Feil ved lagring av profil:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buttonState = isLoading ? "loading" : isEditing ? "save" : "edit";

  return (
    <Card className="w-full bg-[rgb(245,238,231)]">
      <CardHeader className="flex items-center gap-3 rounded-md">
        <figure className="w-10 h-10 rounded-full bg-[#d1d1d1] flex items-center justify-center">
          <PageIcons name="lock" directory="profileIcons" size={24} alt="Private opplysninger" />
          <figcaption className="sr-only">Ikon for private opplysninger</figcaption>
        </figure>
        <div>
          <h2 className="text-base font-medium text-gray-900">
            Personlig informasjon
          </h2>
          <p className="text-sm text-gray-600">
            Dine private opplysninger
          </p>
        </div>
      </CardHeader>

      <CardBody className="pt-5 px-4 rounded-md">
        <form className="flex flex-col space-y-6">
          {/* Responsiv grid for 2x2 layout (større enn 475px) eller 1-kolonne layout (mindre enn 475px) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Første div: Navn, fødselsdato */}
            <div className="space-y-4">
              {/* Navn */}
              <div>
                <label htmlFor="fullName" className="block mb-1 font-medium text-gray-700">
                  Navn <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  readOnly={!isEditing}
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Skriv inn navn"
                  aria-describedby="fullName-description"
                  className={`w-full px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                  required
                />
                <p id="fullName-description" className="sr-only">
                  Ditt fulle navn som er privat
                </p>
              </div>

              {/* Fødselsdato */}
              <div>
                <label htmlFor="birthDate" className="block mb-1 font-medium text-gray-700">
                  Fødselsdato
                </label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="text"
                  readOnly={!isEditing}
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  placeholder="DD.MM.ÅÅÅÅ"
                  aria-describedby="birthDate-description"
                  className={`w-full px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                />
                <p id="birthDate-description" className="sr-only">
                  Din fødselsdato
                </p>
              </div>
            </div>

            {/* Andre div: Kjønn, telefonnummer */}
            <div className="space-y-4">
              {/* Kjønn */}
              <div>
                <label htmlFor="gender" className="block mb-1 font-medium text-gray-700">
                  Kjønn
                </label>
                <select
                  id="gender"
                  name="gender"
                  disabled={!isEditing}
                  value={formData.gender}
                  onChange={handleInputChange}
                  aria-describedby="gender-description"
                  className={`w-full px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                >
                  <option value="">Velg kjønn</option>
                  <option value="Mann">Mann</option>
                  <option value="Kvinne">Kvinne</option>
                  <option value="Annet">Annet</option>
                </select>
                <p id="gender-description" className="sr-only">
                  Ditt kjønn som er privat
                </p>
              </div>

              {/* Telefonnummer */}
              <div>
                <label htmlFor="phoneNumber" className="block mb-1 font-medium text-gray-700">
                  Telefonnummer
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  readOnly={!isEditing}
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Skriv inn telefonnummer"
                  aria-describedby="phoneNumber-description"
                  className={`w-full px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                />
                <p id="phoneNumber-description" className="sr-only">
                  Ditt telefonnummer som er privat
                </p>
              </div>
            </div>
          </div>

          {/* Tredje div: Adresse, postnr, by - med samme bredde som navn/fødselsdato-feltene */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4 sm:col-span-1">
              {/* Adresse */}
              <div>
                <label htmlFor="streetAddress" className="block mb-1 font-medium text-gray-700">
                  Adresse
                </label>
                <input
                  id="streetAddress"
                  name="streetAddress"
                  type="text"
                  readOnly={!isEditing}
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  placeholder="Skriv inn adresse"
                  aria-describedby="streetAddress-description"
                  className={`w-full px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                />
                <p id="streetAddress-description" className="sr-only">
                  Din adresse som er privat
                </p>
              </div>

              {/* Postnr og By */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="postalCode" className="block mb-1 font-medium text-gray-700">
                    Postnr
                  </label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    readOnly={!isEditing}
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="Skriv inn postnummer"
                    aria-describedby="postalCode-description"
                    className={`w-full px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none ${
                      isEditing ? "bg-white" : "bg-gray-100"
                    }`}
                  />
                  <p id="postalCode-description" className="sr-only">
                    Ditt postnummer som er privat
                  </p>
                </div>
                <div>
                  <label htmlFor="city" className="block mb-1 font-medium text-gray-700">
                    By
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    readOnly={!isEditing}
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Skriv inn by"
                    aria-describedby="city-description"
                    className={`w-full px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none ${
                      isEditing ? "bg-white" : "bg-gray-100"
                    }`}
                  />
                  <p id="city-description" className="sr-only">
                    Din by som er privat
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fjerde div: Endre/Lagre-knapp nederst */}
          <div className="pt-4 flex justify-end">
          <Button
                  variant="change"
                  changeState={buttonState}
                  onClick={handleSave}
                  disabled={isLoading}
                  ariaLabel={isEditing ? "Lagre offentlig profil" : "Endre offentlig profil"}
                  type="button"
                />
          </div>
        </form>
      </CardBody>
    </Card>
  );
}