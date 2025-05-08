// src/components/contact/ContactForm.tsx
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { getUserCredentials, getUserProfile } from "@/lib/data/services/userProfile";
import { contactService } from "@/lib/data/services/contactService";
import { Button } from "@/components/ui/custom/Button";
import PageIcons from "@/components/ui/custom/PageIcons";
import { contactFormSchema, ContactFormData } from "@/lib/validation/contactFormValidation";
import { ZodError } from "zod";

export default function ContactForm() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    message: ""
  });
  
  const [validationErrors, setValidationErrors] = useState<{
    [key in keyof ContactFormData]?: string;
  }>({});
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);

  // Load user data if authenticated
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoadingUserData(true);
        const credentials = await getUserCredentials();
        const profile = await getUserProfile();
        
        // Update form with user data
        setFormData(prev => ({
          ...prev,
          name: profile.personalInformation?.fullName || credentials.username || "",
          email: credentials.email || "",
          phoneNumber: profile.personalInformation?.phoneNumber || ""
        }));
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoadingUserData(false);
      }
    };
    
    fetchUserData();
  }, [isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear validation error when field is edited
    if (validationErrors[name as keyof ContactFormData]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateField = (field: keyof ContactFormData, value: string) => {
    try {
      // Instead of using pick, just validate against the whole schema with a partial object
      // This avoids any syntax issues with the computed property name
      contactFormSchema.partial().parse({ [field]: value });
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldError = error.errors.find(err => err.path[0] === field);
        if (fieldError) {
          setValidationErrors(prev => ({
            ...prev,
            [field]: fieldError.message
          }));
        }
      }
      return false;
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    validateField(name as keyof ContactFormData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setValidationErrors({});

    // Validate all fields using Zod schema
    try {
      const validatedData = contactFormSchema.parse(formData);
      
      startTransition(async () => {
        try {
          // Submit to Strapi using the service
          await contactService.submitContactForm({
            ...validatedData,
            createdAt: new Date().toISOString()
          });
          
          // Show success message
          setSuccess(true);
          
          // Reset form
          setFormData({
            name: "",
            email: "",
            phoneNumber: "",
            message: ""
          });
          
          // Redirect with success message after a short delay
          setTimeout(() => {
            router.push("/kontakt-oss?message=Takk for din henvendelse! Vi vil kontakte deg så snart som mulig.");
          }, 2000);
        } catch (err) {
          console.error("Error submitting form:", err);
          setGeneralError("Det oppstod en feil ved sending av skjema. Vennligst prøv igjen senere.");
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        // Map Zod errors to form fields
        const errors: {[key in keyof ContactFormData]?: string} = {};
        error.errors.forEach(err => {
          const field = err.path[0] as keyof ContactFormData;
          errors[field] = err.message;
        });
        setValidationErrors(errors);
        setGeneralError("Vennligst rett feilene i skjemaet.");
      } else {
        setGeneralError("Det oppstod en feil ved validering av skjemaet.");
      }
    }
  };

  if (success) {
    return (
      <div className="bg-[#f9f3ed] p-12 rounded-lg">
        <div className="bg-green-100 border border-green-300 text-green-700 p-6 rounded-md">
          <h3 className="text-xl font-medium mb-2">Takk for din henvendelse!</h3>
          <p>Vi har mottatt meldingen din og vil kontakte deg så snart som mulig.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f3ed] p-12 rounded-lg">
      {generalError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
          <PageIcons name="warning" directory="profileIcons" size={20} alt="" className="mt-0.5 mr-2 flex-shrink-0" />
          <p>{generalError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6" aria-label="Kontaktskjema">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Navn</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Navn"
              required
              disabled={isPending || isLoadingUserData}
              className={`w-full px-4 py-3 rounded-md border ${validationErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none focus:ring-2 bg-white`}
              autoComplete="name"
              aria-required="true"
              aria-invalid={!!validationErrors.name}
              aria-describedby={validationErrors.name ? "name-error" : undefined}
            />
            {validationErrors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Telefonnummer</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Telefonnummer"
              disabled={isPending || isLoadingUserData}
              className={`w-full px-4 py-3 rounded-md border ${validationErrors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none focus:ring-2 bg-white`}
              autoComplete="tel"
              aria-invalid={!!validationErrors.phoneNumber}
              aria-describedby={validationErrors.phoneNumber ? "phoneNumber-error" : undefined}
            />
            {validationErrors.phoneNumber && (
              <p id="phoneNumber-error" className="mt-1 text-sm text-red-600">{validationErrors.phoneNumber}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-post adresse</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="E-post adresse"
            required
            disabled={isPending || isLoadingUserData}
            className={`w-full px-4 py-3 rounded-md border ${validationErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none focus:ring-2 bg-white`}
            autoComplete="email"
            aria-required="true"
            aria-invalid={!!validationErrors.email}
            aria-describedby={validationErrors.email ? "email-error" : undefined}
          />
          {validationErrors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Beskrivelse</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Kort beskrivelse av hva du lurer på."
            required
            rows={6}
            disabled={isPending}
            className={`w-full px-4 py-3 rounded-md border ${validationErrors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none focus:ring-2 bg-white`}
            aria-required="true"
            aria-invalid={!!validationErrors.message}
            aria-describedby={validationErrors.message ? "message-error" : undefined}
          ></textarea>
          {validationErrors.message && (
            <p id="message-error" className="mt-1 text-sm text-red-600">{validationErrors.message}</p>
          )}
        </div>
        
        <div className="text-right">
          <Button
            variant="primary"
            type="submit"
            disabled={isPending}
            ariaLabel={isPending ? "Sender..." : "Send"}
            className="px-8 py-3 rounded-md"
          >
            {isPending ? "Sender..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
}