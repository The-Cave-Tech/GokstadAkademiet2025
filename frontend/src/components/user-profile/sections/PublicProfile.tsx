"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import { useState } from "react";
import { ProfileImageUploader } from "@/components/ui/userProfile/ProfileImageUploader";
import ToggleSwitch from "@/components/ui/custom/ToogleSwith";
import { Button } from "@/components/ui/custom/button";
import PageIcons from "@/components/ui/custom/PageIcons";

export function PublicProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "Mitt visningsnavn",
    biography: "Kort om meg",
    profileImage: "https://images.desenio.com/zoom/pre0082_2.jpg",
  });
  
  // Håndterer kontaktinformasjon separat for uavhengig oppdatering
  const [contactInfo, setContactInfo] = useState({
    showEmail: true,
    showPhone: false,
    showAddress: false
  });

  // Loading states for toggles
  const [toggleLoadingStates, setToggleLoadingStates] = useState({
    showEmail: false,
    showPhone: false,
    showAddress: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleChange = (key) => async (enabled) => {
    // Start loading
    setToggleLoadingStates(prev => ({
      ...prev,
      [key]: true
    }));
    
    try {
      // Simulerer API-kall
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Oppdater tilstand etter vellykket API-kall
      setContactInfo(prev => ({
        ...prev,
        [key]: enabled
      }));
      
      console.log(`Endret ${key} til ${enabled}`);
    } catch (error) {
      console.error(`Feil ved oppdatering av ${key}:`, error);
      // Ikke oppdater tilstand ved feil
    } finally {
      // Avslutt loading uansett
      setToggleLoadingStates(prev => ({
        ...prev,
        [key]: false
      }));
    }
  };

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }));
    }
  };

  const handleImageDelete = () => {
    setFormData((prev) => ({
      ...prev,
      profileImage: "/images/default-profile.png", 
    }));
  };

  const buttonState = isLoading ? "loading" : isEditing ? "save" : "edit";

  return (
    <Card className="w-full bg-profile-background p-2">
      <CardHeader className="flex items-center gap-3 rounded-md">
        <figure className="w-profile-icon-container h-profile-icon-container rounded-full bg-profile-profileIcons flex items-center justify-center">
          <PageIcons name="eye" directory="profileIcons" size={24} alt="Offentlig profil" />
        </figure>
        <div>
          <h2 className="text-base font-medium text-gray-900">Offentlig profil</h2>
          <p className="text-sm text-gray-600">Dine opplysninger som er synlig for alle</p>
        </div>
      </CardHeader>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <CardBody className="py-5 px-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-6 md:gap-10 items-baseline">
            {/* Profilbilde */}
            <div className="justify-self-center md:justify-self-start">
              <ProfileImageUploader
                imageUrl={formData.profileImage}
                isEditing={isEditing}
                onImageChange={handleImageChange}
                onImageDelete={handleImageDelete}
              />
            </div>

            {/* Visningsnavn, biografi og knapp */}
            <div className="flex flex-col space-y-4 min-h-full">
              {/* Visningsnavn */}
              <div>
                <label htmlFor="displayName" className="block p-1 font-medium text-gray-700 leading-6">
                  Visningsnavn
                </label>
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

              {/* Biografi */}
              <div>
                <label htmlFor="biography" className="block mb-1 font-medium text-gray-700 leading-6">
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
              <div className="flex justify-end mt-auto">
                <Button
                  variant="change"
                  changeState={buttonState}
                  onClick={handleSave}
                  disabled={isLoading}
                  ariaLabel={isEditing ? "Lagre offentlig profil" : "Endre offentlig profil"}
                  type="button"
                />
              </div>
            </div>
          </div>
        </CardBody>
      </form>

      <CardFooter className="flex justify-center border-t border-gray-350 px-3 sm:p-6">
        <div className="space-y-1 w-full max-w-3xl">
          <h3 className="text-lg font-medium text-gray-600">Kontaktinformasjon</h3>
          <p className="text-sm text-gray-600">Dine opplysninger som er synlig for alle</p>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center justify-between sm:justify-start sm:space-x-2">
              <label htmlFor="showEmail" className="text-sm font-medium text-gray-600">
                E-post
              </label>
              <ToggleSwitch
                enabled={contactInfo.showEmail}
                onChange={handleToggleChange("showEmail")}
                isLoading={toggleLoadingStates.showEmail}
              />
            </div>
            <div className="flex items-center justify-between sm:justify-start sm:space-x-2">
              <label htmlFor="showPhone" className="text-sm font-medium text-gray-600">
                Telefonnummer
              </label>
              <ToggleSwitch
                enabled={contactInfo.showPhone}
                onChange={handleToggleChange("showPhone")}
                isLoading={toggleLoadingStates.showPhone}
              />
            </div>
            <div className="flex items-center justify-between sm:justify-start sm:space-x-2">
              <label htmlFor="showAddress" className="text-sm font-medium text-gray-600">
                Adresse
              </label>
              <ToggleSwitch
                enabled={contactInfo.showAddress}
                onChange={handleToggleChange("showAddress")}
                isLoading={toggleLoadingStates.showAddress}
              />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}