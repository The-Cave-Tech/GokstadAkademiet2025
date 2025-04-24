"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import Image from "next/image";
import { useState } from "react";
import ToggleSwitch from "@/components/ui/custom/ToogleSwith";

export function PublicProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "Mitt visningsnavn",
    biography: "Kort om meg",
    profileImage: "https://images.desenio.com/zoom/pre0082_2.jpg",
  });
  // Ny tilstand for toggles
  const [contactInfo, setContactInfo] = useState({
    showEmail: true,
    showPhone: false,
    showAddress: false,
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }));
    }
  };

  // Funksjon for å håndtere toggle-endringer
  const handleToggleChange = (key) => (enabled) => {
    setContactInfo((prev) => ({
      ...prev,
      [key]: enabled,
    }));
  };

  return (
    <Card className="w-full bg-[rgb(245,238,231)] p-2">
      <CardHeader className="flex items-center gap-3 rounded-md">
        <figure className="w-10 h-10 rounded-full bg-[#d1d1d1] flex items-center justify-center">
          <span className="text-black text-xl">👁️</span>
        </figure>
        <div>
          <h2 className="text-base font-medium text-gray-900">
            Offentlig profil
          </h2>
          <p className="text-sm text-gray-600">
            Dine opplysninger som er synlig for alle
          </p>
        </div>
      </CardHeader>

      <CardBody className="flex items-start gap-10 py-5 px-4 rounded-md">
        {/* Profilbilde */}
        <figure className="relative">
          <label className="flex justify-center pb-1">Profilbilde</label>
          <Image
            src={formData.profileImage}
            alt="Profilbilde"
            width={70}
            height={64}
            unoptimized
            className="rounded-full object-cover border border-gray-300 w-[140] h-[140]"
          />
          {isEditing && (
            <figcaption className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-300 shadow-sm">
              <label htmlFor="profileImage" className="cursor-pointer">
                <span className="text-xl">✏️</span>
                <span className="sr-only">Endre profilbilde</span>
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </figcaption>
          )}
        </figure>

        {/* Skjema */}
        <form className="flex-1 space-y-4">
          {/* Visningsnavn */}
          <div>
            <label>Visningsnavn</label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              readOnly={!isEditing}
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder="Skriv inn visningsnavn"
              aria-describedby="displayName-description"
              className={`w-full px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            />
            <p id="displayName-description" className="sr-only">
              Ditt visningsnavn som er synlig for alle
            </p>
          </div>

          {/* Om meg */}
          <div>
            <label
              htmlFor="biography"
              className="block mb-1 font-medium text-gray-700"
            >
              Biografi
            </label>
            <textarea
              id="biography"
              name="biography"
              readOnly={!isEditing}
              rows={4}
              placeholder="Skriv om deg selv"
              value={formData.biography}
              onChange={handleInputChange}
              aria-describedby="biography-description"
              maxLength={256}
              className={`w-full px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            />
            <p id="biography-description" className="sr-only">
              En kort beskrivelse om deg selv som er synlig for alle
            </p>
          </div>

          {/* Endre/Lagre-knapp */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleEditToggle}
              className="group relative flex items-center px-1 py-1 rounded-full transition-all duration-200 focus:outline-none bg-blue-600"
              aria-label={isEditing ? "Lagre offentlig profil" : "Endre offentlig profil"}
            >
              {/* Hvit sirkel med ikon */}
              <span className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-gray-300 shadow-sm group-hover:bg-white z-10">
                {isEditing ? "💾" : "✏️"}
              </span>

              {/* "Endre" eller "Lagre"-tekst som dukker opp på hover */}
              <span className="overflow-hidden max-w-0 group-hover:max-w-[70px] transition-all duration-300 text-white font-bold whitespace-nowrap group-hover:px-2 rounded-full group-hover:ml-0">
                {isEditing ? "Lagre" : "Endre"}
              </span>
            </button>
          </div>
        </form>
      </CardBody>

      <CardFooter className="flex justify-center border-t border-gray-350 px-3 sm:p-6">
        {/* Kontaktinformasjon */}
        <div className="space-y-4 w-full max-w-3xl">
          <h3 className="text-lg font-medium text-gray-600">
            Kontaktinformasjon
          </h3>
          <p className="text-sm text-gray-600">
            Dine opplysninger som er synlig for alle
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* E-post toggle */}
            <div className="flex items-center justify-between sm:justify-start sm:space-x-2">
              <label
                htmlFor="showEmail"
                className="text-sm font-medium text-gray-600"
              >
                E-post
              </label>
              <ToggleSwitch
                enabled={contactInfo.showEmail}
                onChange={handleToggleChange("showEmail")}
              />
            </div>

            {/* Telefonnummer toggle */}
            <div className="flex items-center justify-between sm:justify-start sm:space-x-2">
              <label
                htmlFor="showPhone"
                className="text-sm font-medium text-gray-600"
              >
                Telefonnummer
              </label>
              <ToggleSwitch
                enabled={contactInfo.showPhone}
                onChange={handleToggleChange("showPhone")}
              />
            </div>

            {/* Adresse toggle */}
            <div className="flex items-center justify-between sm:justify-start sm:space-x-2">
              <label
                htmlFor="showAddress"
                className="text-sm font-medium text-gray-600"
              >
                Adresse
              </label>
              <ToggleSwitch
                enabled={contactInfo.showAddress}
                onChange={handleToggleChange("showAddress")}
              />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}