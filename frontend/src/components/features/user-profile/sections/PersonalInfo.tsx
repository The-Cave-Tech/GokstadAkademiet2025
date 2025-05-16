"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { PageIcons } from "@/components/ui/custom/PageIcons";
import { DatePicker } from "@/components/ui/custom/DatePciker";
import { ZodErrors } from "@/components/ui/ZodErrors";
import { usePersonalInfoValidation } from "@/hooks/useProfileValidation";
import { profileFieldError } from "@/lib/utils/serverAction-errorHandler";

import {
  updateFullName,
  updateBirthDate,
  updateGender,
  updatePhoneNumber,
  updateStreetAddress,
  updatePostalCode,
  updateCity
} from "@/lib/data/services/profileSections/personalInfoService";
import { UserProfile } from "@/lib/data/services/userProfile";

import {
  formatDateForDisplay,
  formatDateForStorage,
  formatPhoneNumber
} from "@/lib/validation/profileSectionValidation";

import {
  FormValues,
  FieldConfig,
  ExtendedUserProfile
} from "@/types/personalInfo.types";

interface PersonalInfoProps {
  profile: UserProfile;
  refreshProfile: () => Promise<void>;
}

export function PersonalInfo({ profile, refreshProfile }: PersonalInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    fullName: "",
    birthDate: "",
    gender: "",
    phoneNumber: "",
    streetAddress: "",
    postalCode: "",
    city: ""
  });
  const [originalValues, setOriginalValues] = useState<FormValues>({...formValues});
  const [error, setError] = useState<string | null>(null);

  // Hent valideringshooken som håndterer Zod-skjemaene
  const { validationErrors, validateField, validateForm } = usePersonalInfoValidation();

  // Feltdefinisjoner for å gjøre koden mer DRY
  const fieldConfigs: FieldConfig[] = [
    {
      id: "fullName",
      label: "Navn",
      type: "text",
      placeholder: "Skriv inn navn",
      required: true,
      description: "Ditt fulle navn som er privat",
      updateFn: updateFullName
    },
    {
      id: "birthDate",
      label: "Fødselsdato",
      type: "date",
      placeholder: "DD.MM.ÅÅÅÅ",
      description: "Din fødselsdato",
      updateFn: updateBirthDate
    },
    {
      id: "gender",
      label: "Kjønn",
      type: "select",
      placeholder: "",
      options: ["Mann", "Kvinne", "Annet"],
      description: "Ditt kjønn som er privat",
      updateFn: updateGender
    },
    {
      id: "phoneNumber",
      label: "Telefonnummer",
      type: "tel",
      placeholder: "+47 123 456 78",
      description: "Ditt telefonnummer som er privat (landkode legges til automatisk)",
      updateFn: updatePhoneNumber
    },
    {
      id: "streetAddress",
      label: "Adresse",
      type: "text",
      placeholder: "Skriv inn adresse",
      description: "Din adresse som er privat",
      updateFn: updateStreetAddress
    },
    {
      id: "postalCode",
      label: "Postnr",
      type: "text",
      placeholder: "Skriv inn postnummer",
      description: "Ditt postnummer som er privat",
      updateFn: updatePostalCode
    },
    {
      id: "city",
      label: "By",
      type: "text",
      placeholder: "Skriv inn by",
      description: "Din by som er privat",
      updateFn: updateCity
    }
  ];

  // Last inn profilen når den endres
  useEffect(() => {
    if (profile) {
      const extendedProfile = profile as ExtendedUserProfile;
      const personalInfo = extendedProfile.personalInformation || {};
      
      // Bruk formatDateForDisplay for å konvertere ISO-dato til norsk format
      const birthDateFormatted = personalInfo.birthDate ? formatDateForDisplay(personalInfo.birthDate) : '';
      
      const newValues: FormValues = {
        fullName: personalInfo.fullName || "",
        birthDate: birthDateFormatted,
        gender: personalInfo.gender || "",
        phoneNumber: personalInfo.phoneNumber || "",
        streetAddress: personalInfo.streetAddress || "",
        postalCode: personalInfo.postalCode || "",
        city: personalInfo.city || ""
      };
      
      setFormValues(newValues);
      setOriginalValues({...newValues});
    }
  }, [profile]);

  // Håndter input-endringer for alle felt
  const handleInputChange = (
    fieldId: keyof NonNullable<UserProfile['personalInformation']>, 
    value: string
  ) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Valider feltet med Zod via usePersonalInfoValidation-hooken
    validateField(fieldId, value);
  };

  // Håndter formatering av telefonnummer
  const handlePhoneNumberChange = (
    fieldId: keyof NonNullable<UserProfile['personalInformation']>,
    value: string
  ) => {
    // Kun tillate tall og +-tegn som input
    const filteredValue = value.replace(/[^\d+]/g, '');
    
    // Bruk formatPhoneNumber for å formatere nummeret riktig
    const formattedValue = formatPhoneNumber(filteredValue);
    
    setFormValues(prev => ({
      ...prev,
      [fieldId]: formattedValue
    }));
    
    validateField(fieldId, formattedValue);
  };

  // Håndter lagring av skjema
  const handleSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    
    // Valider hele skjemaet med Zod via usePersonalInfoValidation-hooken
    const isValid = validateForm(formValues);
    
    if (!isValid) {
      setError("Vennligst rett feilene før du lagrer");
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
      
      // Finn ut hvilke felt som har endret seg
      const changedFieldConfigs = fieldConfigs.filter(config => 
        formValues[config.id] !== originalValues[config.id]
      );
      
      let updatesPerformed = false;
      
      // Oppdatere hvert endrede felt
      for (const fieldConfig of changedFieldConfigs) {
        const fieldId = fieldConfig.id;
        
        try {
          if (fieldId === 'birthDate' && formValues[fieldId]) {
            // Konverterer datoen til ISO-format for lagring
            await fieldConfig.updateFn(formatDateForStorage(formValues[fieldId]));
          } else {
            await fieldConfig.updateFn(formValues[fieldId]);
          }
          
          updatesPerformed = true;
        } catch (error) {
          console.error(`Feil ved oppdatering av ${fieldId}:`, error);
          setError(`Det oppstod en feil ved lagring av ${fieldConfig.label.toLowerCase()}`);
        }
      }
      
      if (updatesPerformed) {
        await refreshProfile();
        setOriginalValues({...formValues});
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Feil ved lagring av profil:", error);
      setError("Det oppstod en feil ved lagring av profilen din");
    } finally {
      setIsSaving(false);
    }
  };

  // Avbryt redigering
  const handleCancel = () => {
    setFormValues({...originalValues});
    setIsEditing(false);
    setError(null);
  };

  const buttonState = isSaving ? "loading" : isEditing ? "save" : "edit";

  // Rendrer felt basert på type
  const renderField = (config: FieldConfig) => {
    const { id, label, type, placeholder, required, options, description } = config;
    
    const commonProps = {
      id,
      name: id,
      readOnly: !isEditing,
      value: formValues[id],
      'aria-describedby': `${id}-description`,
      className: `w-full px-4 py-2 rounded-md shadow-sm border ${
        isEditing 
          ? "bg-white border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
          : "bg-secondary border-gray-300"
      } text-body-small text-typographyPrimary transition-all duration-200`
    };

    return (
      <div key={id} className="space-y-2">
        <label htmlFor={id} className="block text-sub-section-title-small font-medium text-typographyPrimary">
          {label} {required && <span className="text-danger" aria-hidden="true">*</span>}
        </label>
        
        {type === 'select' ? (
          <div>
            <select
              {...commonProps}
              disabled={!isEditing}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                handleInputChange(id, e.target.value)}
              className={`${commonProps.className} appearance-none`}
            >
              <option value="">Velg {label.toLowerCase()}</option>
              {options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <ZodErrors
              error={profileFieldError(
                validationErrors,
                null,
                id
              )}
            />
          </div>
        ) : type === 'date' ? (
          <div>
            <DatePicker
              {...commonProps}
              placeholder={placeholder}
              required={required}
              onChange={(value: string) => handleInputChange(id, value)}
              onBlur={(value: string) => {
                if (value) {
                  validateField(id, value);
                }
              }}
            />
            <ZodErrors
              error={profileFieldError(
                validationErrors,
                null,
                id
              )}
            />
          </div>
        ) : type === 'tel' ? (
          <div>
            <input
              {...commonProps}
              type={type}
              placeholder={placeholder}
              required={required}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handlePhoneNumberChange(id, e.target.value)}
              onBlur={(e) => {
                if (e.target.value && !e.target.value.startsWith("+")) {
                  handlePhoneNumberChange(id, "+47" + e.target.value);
                }
              }}
            />
            <ZodErrors
              error={profileFieldError(
                validationErrors,
                null,
                id
              )}
            />
          </div>
        ) : (
          <div>
            <input
              {...commonProps}
              type={type}
              placeholder={placeholder}
              required={required}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleInputChange(id, e.target.value)}
            />
            <ZodErrors
              error={profileFieldError(
                validationErrors,
                null,
                id
              )}
            />
          </div>
        )}
        
        <p id={`${id}-description`} className="sr-only">
          {description}
        </p>
      </div>
    );
  };

  return (
    <Card className="w-full bg-secondary shadow-elevation">
      <CardHeader className="flex items-center gap-3 rounded-t-md bg-primary p-4">
        <figure className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
          <PageIcons name="lock" directory="profileIcons" size={24} alt="Private opplysninger" className="text-typographyPrimaryWH" />
          <figcaption className="sr-only">Ikon for private opplysninger</figcaption>
        </figure>
        <div>
          <h2 className="text-section-title-small font-medium text-typographyPrimaryWH">
            Personlig informasjon
          </h2>
          <p className="text-body-small text-typographyPrimaryWH opacity-90">
            Dine private opplysninger
          </p>
        </div>
      </CardHeader>

      <CardBody className="pt-6 px-6 pb-6 rounded-b-md">
        {error && (
          <div className="mb-6 p-4 bg-danger bg-opacity-10 border border-danger border-opacity-20 text-danger rounded-md flex items-start">
            <PageIcons name="warning" directory="profileIcons" size={20} alt="" className="mt-0.5 mr-3 flex-shrink-0" />
            <span className="text-body-small">{error}</span>
          </div>
        )}
        
        <form className="flex flex-col space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {renderField(fieldConfigs[0])} 
              {renderField(fieldConfigs[1])} 
            </div>
            
            <div className="space-y-6">
              {renderField(fieldConfigs[2])} 
              {renderField(fieldConfigs[3])} 
            </div>
          </div>
       
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 md:col-span-1">
              {renderField(fieldConfigs[4])} 
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {renderField(fieldConfigs[5])}
                </div>
                <div>
                  {renderField(fieldConfigs[6])} 
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-6 flex justify-end space-x-4">
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
              ariaLabel={isEditing ? "Lagre personlig informasjon" : "Endre personlig informasjon"}
              type="button"
              className="text-btn-cta-medium"
            />
          </div>
        </form>
      </CardBody>
    </Card>
  );
}