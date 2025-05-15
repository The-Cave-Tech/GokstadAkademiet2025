"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/Card';
import ToggleSwitch from '@/components/ui/custom/ToogleSwith';
import PageIcons from '@/components/ui/custom/PageIcons';
import { ZodErrors } from "@/components/common/ZodErrors";
import { usePublicProfileValidation } from "@/hooks/useProfileValidation";
import { profileFieldError } from "@/lib/utils/serverAction-errorHandler";
import { 
  updateDisplayName, 
  updateBiography, 
  updateShowEmail, 
  updateShowPhone, 
  updateShowAddress,
} from '@/lib/data/services/profileSections/publicProfileService';
import { ProfileImageUploader } from '@/components/features/user-profile/profileImage/ProfileImageUploader';
import { UserProfile } from '@/lib/data/services/userProfile';
import { Button } from '@/components/ui/Button';


interface PublicProfileProps {
  profile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
  refreshProfile: () => Promise<void>;
}

export function PublicProfile({ profile, onProfileUpdate, refreshProfile }: PublicProfileProps) {
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

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Get validation hook
  const { validationErrors, validateField, validateForm } = usePublicProfileValidation();

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
    const value = e.target.value;
    setDisplayName(value);
    validateField("displayName", value);
  };
  
  const handleBiographyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setBiography(value);
    validateField("biography", value);
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
        await refreshProfile();
      }
    } catch (error) {
      console.error(`Feil ved oppdatering av ${key}:`, error);
      setContactInfo(prev => ({
        ...prev,
        [key]: !enabled
      }));
      setError(`Kunne ikke oppdatere innstilling for ${key}`);
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
    
    const formData = {
      displayName,
      biography,
      showEmail: contactInfo.showEmail,
      showPhone: contactInfo.showPhone,
      showAddress: contactInfo.showAddress
    };
    
    const isValid = validateForm(formData);
    
    if (!isValid) {
      setError("Vennligst rett feilene før du lagrer");
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
      
      let updatesPerformed = false;
      
      if (displayName !== originalDisplayName) {
        await updateDisplayName(displayName);
        updatesPerformed = true;
      }
      
      if (biography !== originalBiography) {
        await updateBiography(biography);
        updatesPerformed = true;
      }
      
      if (updatesPerformed) {
        await refreshProfile();
      }
      
      setOriginalDisplayName(displayName);
      setOriginalBiography(biography);
      
      setIsEditing(false);
    } catch (error) {
      console.error("Feil ved lagring av profil:", error);
      setError("Det oppstod en feil ved lagring av profilen din");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(originalDisplayName);
    setBiography(originalBiography);
    setIsEditing(false);
    setError(null);
  };

  const buttonState = isSaving ? "loading" : isEditing ? "save" : "edit";

return (
  <Card className="w-full bg-secondary shadow-elevation">
    <CardHeader className="flex items-center gap-3 rounded-t-md bg-primary p-4">
      <figure className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
        <PageIcons name="eye" directory="profileIcons" size={24} alt="Offentlig profil" className="text-typographyPrimaryWH" />
        <figcaption className="sr-only">Ikon for offentlig profil</figcaption>
      </figure>
      <div>
        <h2 className="text-section-title-small font-medium text-typographyPrimaryWH">
          Offentlig profil
        </h2>
        <p className="text-body-small text-typographyPrimaryWH opacity-90">
          Dine opplysninger som er synlig for alle
        </p>
      </div>
    </CardHeader>

    <CardBody className="pt-6 px-6 pb-6 rounded-md">
      {error && (
        <div className="mb-6 p-4 bg-danger bg-opacity-10 border border-danger border-opacity-20 text-danger rounded-md flex items-start">
          <PageIcons name="warning" directory="profileIcons" size={20} alt="" className="mt-0.5 mr-3 flex-shrink-0" />
          <span className="text-body-small">{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-8 md:gap-10 items-start">
        <div className="justify-self-center md:justify-self-start">
          <ProfileImageUploader
            profile={profile}
            onImageUpdate={onProfileUpdate}
            refreshProfile={refreshProfile}
          />
        </div>

        <div className="flex flex-col space-y-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="mb-6">
              <label htmlFor="displayName" className="block text-sub-section-title-small font-medium text-typographyPrimary mb-2">
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
                className={`w-full px-4 py-2 rounded-md shadow-sm border ${
                  isEditing 
                    ? "bg-white border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                    : "bg-secondary border-gray-300"
                } text-body-small text-typographyPrimary transition-all duration-200`}
              />
              <ZodErrors
                error={profileFieldError(
                  validationErrors,
                  null,
                  "displayName"
                )}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="biography" className="block text-sub-section-title-small font-medium text-typographyPrimary mb-2">
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
                className={`w-full px-4 py-2 rounded-md shadow-sm border ${
                  isEditing 
                    ? "bg-white border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                    : "bg-secondary border-gray-300"
                } text-body-small text-typographyPrimary transition-all duration-200`}
              />
              <ZodErrors
                error={profileFieldError(
                  validationErrors,
                  null,
                  "biography"
                )}
              />
              <div className="text-captions-small text-typographySecondary text-right mt-1">
                {biography.length}/256 tegn
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              {isEditing && (
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={isSaving}
                  ariaLabel="Avbryt redigering"
                  type="button"
                  className="text-btn-cta-medium"
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
                className="text-btn-cta-medium"
              />
            </div>
          </form>
        </div>
      </div>
    </CardBody>

    <CardFooter className="flex justify-center border-t border-gray-300 px-6 py-6">
      <div className="space-y-4 w-full max-w-3xl">
        <div>
          <h3 className="text-sub-section-title-big font-medium text-typographyPrimary">Kontaktinformasjon</h3>
          <p className="text-body-small text-typographySecondary mt-1">Dine opplysninger som er synlig for alle</p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center justify-between sm:justify-start sm:space-x-3">
            <label htmlFor="showEmail" className="text-body-small font-medium text-typographyPrimary">
              E-post
            </label>
            <ToggleSwitch
              enabled={contactInfo.showEmail}
              onChange={handleToggleChange("showEmail")}
              isLoading={fieldLoadingStates.showEmail}
            />
          </div>
          <div className="flex items-center justify-between sm:justify-start sm:space-x-3">
            <label htmlFor="showPhone" className="text-body-small font-medium text-typographyPrimary">
              Telefonnummer
            </label>
            <ToggleSwitch
              enabled={contactInfo.showPhone}
              onChange={handleToggleChange("showPhone")}
              isLoading={fieldLoadingStates.showPhone}
            />
          </div>
          <div className="flex items-center justify-between sm:justify-start sm:space-x-3">
            <label htmlFor="showAddress" className="text-body-small font-medium text-typographyPrimary">
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