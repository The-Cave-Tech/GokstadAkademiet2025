"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/Card';

import ToggleSwitch from '@/components/ui/custom/ToogleSwith';
import { Button } from '@/components/ui/custom/button';
import PageIcons from '@/components/ui/custom/PageIcons';
import { 
  getUserProfile,
  updateDisplayName, 
  updateBiography,
  updateShowEmail,
  updateShowPhone,
  updateShowAddress,
  UserProfile 
} from '@/lib/data/services/publicProfileService';
import { ProfileImageUploader } from '@/components/ui/userProfile/ProfileImageUploader';

interface PublicProfileProps {
  profile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

export function PublicProfile({ profile, onProfileUpdate }: PublicProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Separate state for each field
  const [displayName, setDisplayName] = useState(profile.publicProfile?.displayName || "");
  const [biography, setBiography] = useState(profile.publicProfile?.biography || "");
  const [originalDisplayName, setOriginalDisplayName] = useState(profile.publicProfile?.displayName || "");
  const [originalBiography, setOriginalBiography] = useState(profile.publicProfile?.biography || "");
  
  // Contact information toggles
  const [contactInfo, setContactInfo] = useState({
    showEmail: profile.publicProfile?.showEmail || false,
    showPhone: profile.publicProfile?.showPhone || false,
    showAddress: profile.publicProfile?.showAddress || false
  });

  // Loading states for individual fields and actions
  const [fieldLoadingStates, setFieldLoadingStates] = useState({
    displayName: false,
    biography: false,
    showEmail: false,
    showPhone: false,
    showAddress: false
  });

  // Update states when the profile changes
  useEffect(() => {
    if (profile && profile.publicProfile) {
      const displayNameValue = profile.publicProfile.displayName || "";
      const biographyValue = profile.publicProfile.biography || "";
      
      setDisplayName(displayNameValue);
      setBiography(biographyValue);
      setOriginalDisplayName(displayNameValue);
      setOriginalBiography(biographyValue);
      
      setContactInfo({
        showEmail: profile.publicProfile.showEmail || false,
        showPhone: profile.publicProfile.showPhone || false,
        showAddress: profile.publicProfile.showAddress || false
      });
    }
  }, [profile]);

  // Handle input changes
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };
  
  const handleBiographyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBiography(e.target.value);
  };

  // Handle toggle changes for contact information
  const handleToggleChange = (key: 'showEmail' | 'showPhone' | 'showAddress') => async (enabled: boolean) => {
    setFieldLoadingStates(prev => ({ ...prev, [key]: true }));
    
    try {
      setContactInfo(prev => ({
        ...prev,
        [key]: enabled
      }));
      
      let updatedProfile;
      
      if (key === 'showEmail') {
        updatedProfile = await updateShowEmail(enabled);
      } else if (key === 'showPhone') {
        updatedProfile = await updateShowPhone(enabled);
      } else if (key === 'showAddress') {
        updatedProfile = await updateShowAddress(enabled);
      }
      
      if (updatedProfile) {
        onProfileUpdate(updatedProfile);
      }
    } catch (error) {
      console.error(`Feil ved oppdatering av ${key}:`, error);
      // Revert on error
      setContactInfo(prev => ({
        ...prev,
        [key]: !enabled
      }));
    } finally {
      setFieldLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  // Save text fields sequentially
  const handleSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Track if any updates were made
      let updatesPerformed = false;
      
      // Update display name if changed
      if (displayName !== originalDisplayName) {
        await updateDisplayName(displayName);
        updatesPerformed = true;
      }
      
      // Update biography if changed
      if (biography !== originalBiography) {
        await updateBiography(biography);
        updatesPerformed = true;
      }
      
      // If any updates were performed, refresh the profile
      if (updatesPerformed) {
        const updatedProfile = await getUserProfile();
        onProfileUpdate(updatedProfile);
      }
      
      // Update original values
      setOriginalDisplayName(displayName);
      setOriginalBiography(biography);
      
      setIsEditing(false);
    } catch (error) {
      console.error("Feil ved lagring av profil:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing and revert changes
  const handleCancel = () => {
    setDisplayName(originalDisplayName);
    setBiography(originalBiography);
    setIsEditing(false);
  };

  const buttonState = isSaving ? "loading" : isEditing ? "save" : "edit";

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

      <CardBody className="py-5 px-4 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-6 md:gap-10 items-start">
          <div className="justify-self-center md:justify-self-start">
            <ProfileImageUploader
              profile={profile}
              onImageUpdate={onProfileUpdate}
            />
          </div>

          {/* Form for display name and biography */}
          <div className="flex flex-col space-y-4">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              {/* Display name */}
              <div className="mb-4">
                <label htmlFor="displayName" className="block p-1 font-medium text-gray-700 leading-6">
                  Visningsnavn
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  readOnly={!isEditing}
                  value={displayName}
                  onChange={handleDisplayNameChange}
                  placeholder="Skriv inn visningsnavn"
                  aria-describedby="displayName-description"
                  className={`w-full px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>

              {/* Biography */}
              <div className="mb-4">
                <label htmlFor="biography" className="block mb-1 font-medium text-gray-700 leading-6">
                  Biografi
                </label>
                <textarea
                  id="biography"
                  name="biography"
                  readOnly={!isEditing}
                  rows={4}
                  placeholder="Skriv om deg selv"
                  value={biography}
                  onChange={handleBiographyChange}
                  aria-describedby="biography-description"
                  maxLength={256}
                  className={`w-full px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>

              {/* Edit/Save button */}
              <div className="flex justify-end space-x-2">
                {isEditing && (
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={isSaving}
                    ariaLabel="Avbryt redigering"
                    type="button"
                  >
                    Avbryt
                  </Button>
                )}
                <Button
                  variant="change"
                  changeState={buttonState}
                  onClick={handleSave}
                  disabled={isSaving}
                  ariaLabel={isEditing ? "Lagre offentlig profil" : "Endre offentlig profil"}
                  type="button"
                />
              </div>
            </form>
          </div>
        </div>
      </CardBody>

      {/* Contact info section */}
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
                isLoading={fieldLoadingStates.showEmail}
              />
            </div>
            <div className="flex items-center justify-between sm:justify-start sm:space-x-2">
              <label htmlFor="showPhone" className="text-sm font-medium text-gray-600">
                Telefonnummer
              </label>
              <ToggleSwitch
                enabled={contactInfo.showPhone}
                onChange={handleToggleChange("showPhone")}
                isLoading={fieldLoadingStates.showPhone}
              />
            </div>
            <div className="flex items-center justify-between sm:justify-start sm:space-x-2">
              <label htmlFor="showAddress" className="text-sm font-medium text-gray-600">
                Adresse
              </label>
              <ToggleSwitch
                enabled={contactInfo.showAddress}
                onChange={handleToggleChange("showAddress")}
                isLoading={fieldLoadingStates.showAddress}
              />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}