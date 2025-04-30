"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/custom/Button";
import { PageIcons } from "@/components/ui/custom/PageIcons";
import { DatePicker } from "@/components/ui/custom/DatePciker";

import {
  updateFullName,
  updateBirthDate,
  updateGender,
  updatePhoneNumber,
  updateStreetAddress,
  updatePostalCode,
  updateCity
} from "@/lib/data/services/profileSections/personalInfoService";
import { getUserProfile } from "@/lib/data/services/userProfile";

import {
  PersonalInfoProps,
  PersonalInformation,
  FormValues,
  FieldConfig,
  ExtendedUserProfile
} from "@/types/personalInfo.types";

export function PersonalInfo({ profile, onProfileUpdate = () => {} }: PersonalInfoProps) {
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

  useEffect(() => {
    if (profile) {
      const extendedProfile = profile as unknown as ExtendedUserProfile;
      const personalInfo = extendedProfile.personalInformation || {};
      
      let birthDateFormatted = personalInfo.birthDate || '';
      if (birthDateFormatted) {
        try {
          const [year, month, day] = birthDateFormatted.split('-');
          if (year && month && day) {
            birthDateFormatted = `${day}.${month}.${year}`;
          }
        } catch (error) {
          console.error("Error formatting date:", error);
        }
      }
      
      const newValues: FormValues = {
        fullName: personalInfo.fullName || "",
        birthDate: birthDateFormatted,
        gender: personalInfo.gender || "",
        phoneNumber: personalInfo.phoneNumber || "",
        streetAddress: personalInfo.streetAddress || "",
        postalCode: personalInfo.postalCode || "",
        city: personalInfo.city || ""
      };
      
      console.log("Formatted birth date for display:", birthDateFormatted);
      setFormValues(newValues);
      setOriginalValues({...newValues});
    }
  }, [profile]);

  // Generic handler for input changes
  const handleInputChange = (fieldId: keyof PersonalInformation, value: string) => {
    // Special handling for phone number
    if (fieldId === "phoneNumber") {
      // Remove all non-digit characters first
      const digitsOnly = value.replace(/\D/g, "");
      
      // Format the phone number
      let formattedNumber = "";
      
      if (digitsOnly.length > 0) {
        // Add +47 prefix if not already starting with + and not empty
        if (!value.trim().startsWith("+")) {
          formattedNumber = "+47 ";
        } else if (value.startsWith("+")) {
          // Preserve existing country code if any
          const countryCodeMatch = value.match(/^\+(\d+)/);
          if (countryCodeMatch) {
            formattedNumber = `+${countryCodeMatch[1]} `;
          }
        }
        
        // Format the remaining digits with spaces
        const formatGroups = (num: string): string => {
          if (num.length <= 3) return num;
          if (num.length <= 6) return `${num.slice(0, 3)} ${num.slice(3)}`;
          return `${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6, 8)}`;
        };
        
        // Only format the local part (after country code)
        const localPart = digitsOnly.slice(digitsOnly.startsWith("47") ? 2 : 0);
        formattedNumber += formatGroups(localPart);
      }
      
      value = formattedNumber || value;
    }
    
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    
    try {
      setIsSaving(true);
      
      let updatesPerformed = false;
      const updatedFields = [];
      
      for (const fieldConfig of fieldConfigs) {
        const fieldId = fieldConfig.id;
        if (formValues[fieldId] !== originalValues[fieldId]) {
          updatedFields.push(fieldConfig);
        }
      }
      
      for (const fieldConfig of updatedFields) {
        const fieldId = fieldConfig.id;
        
        try {
          if (fieldId === 'birthDate' && formValues[fieldId]) {
            if (!formValues[fieldId].match(/^\d{4}-\d{2}-\d{2}$/)) {
              const [day, month, year] = formValues[fieldId].split('.');
              if (day && month && year) {
                const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                console.log(`Converting date from ${formValues[fieldId]} to ${isoDate} for API`);
                await fieldConfig.updateFn(isoDate);
              } else {
                await fieldConfig.updateFn(formValues[fieldId]);
              }
            } else {
              await fieldConfig.updateFn(formValues[fieldId]);
            }
          } else {
            await fieldConfig.updateFn(formValues[fieldId]);
          }
          
          updatesPerformed = true;
        } catch (error) {
          console.error(`Feil ved oppdatering av ${fieldId}:`, error);
        }
      }
      
      if (updatesPerformed) {
        const updatedProfile = await getUserProfile();
        onProfileUpdate(updatedProfile);
        
        setOriginalValues({...formValues});
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Feil ved lagring av profil:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormValues({...originalValues});
    setIsEditing(false);
  };

  const buttonState = isSaving ? "loading" : isEditing ? "save" : "edit";

  // Helper function to render field based on type
  const renderField = (config: FieldConfig) => {
    const { id, label, type, placeholder, required, options, description } = config;
    
    const commonProps = {
      id,
      name: id,
      readOnly: !isEditing,
      value: formValues[id],
      'aria-describedby': `${id}-description`,
      className: `w-full px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none ${
        isEditing ? "bg-white" : "bg-gray-100"
      }`
    };

    return (
      <div key={id}>
        <label htmlFor={id} className="block mb-1 font-medium text-gray-700">
          {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
        </label>
        
        {type === 'select' ? (
          <select
            {...commonProps}
            disabled={!isEditing}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              handleInputChange(id, e.target.value)}
          >
            <option value="">Velg {label.toLowerCase()}</option>
            {options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : type === 'date' ? (
          <DatePicker
            {...commonProps}
            placeholder={placeholder}
            required={required}
            onChange={(value: string) => handleInputChange(id, value)}
          />
        ) : (
          <input
            {...commonProps}
            type={type}
            placeholder={placeholder}
            required={required}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              handleInputChange(id, e.target.value)}
            // Apply special handling for telephone input
            onBlur={id === "phoneNumber" ? (e) => {
              if (e.target.value && !e.target.value.startsWith("+")) {
                handleInputChange(id, "+47 " + e.target.value.replace(/\D/g, ""));
              }
            } : undefined}
          />
        )}
        
        <p id={`${id}-description`} className="sr-only">
          {description}
        </p>
      </div>
    );
  };

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
        <form className="flex flex-col space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              {renderField(fieldConfigs[0])} 
              {renderField(fieldConfigs[1])} 
            </div>
            
            <div className="space-y-4">
              {renderField(fieldConfigs[2])} 
              {renderField(fieldConfigs[3])} 
            </div>
          </div>
       
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4 sm:col-span-1">
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
          <div className="pt-4 flex justify-end space-x-2">
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
              ariaLabel={isEditing ? "Lagre personlig informasjon" : "Endre personlig informasjon"}
              type="button"
            />
          </div>
        </form>
      </CardBody>
    </Card>
  );
}