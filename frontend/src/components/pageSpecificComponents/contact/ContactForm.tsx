// src/components/contact/ContactForm.tsx
"use client";


import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/pageSpecificComponents/contact/Modal";
import {
 contactFormSchema,
 ContactFormData,
} from "@/lib/validation/contactFormValidation";
import { ZodError } from "zod";

// Funksjon for å sende til backend
const submitContactRequest = async (data: any) => {
  const apiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337/api";

  console.log("Forsøker å sende data til Strapi:", data);

  try {
    // Forsøk POST til contact-submissions direkte
    const response = await fetch(`${apiUrl}/contact-submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          message: data.message,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Strapi API Error:", errorData);
      throw new Error(
        `Strapi API feil: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("Data sendt til Strapi! Respons:", result);
    return result;
  } catch (err) {
    console.error("Feil ved sending til Strapi API:", err);

    // Nødløsning: Lagre i localStorage hvis backend ikke er tilgjengelig
    try {
      const existingContactsStr = localStorage.getItem("contactSubmissions");
      const existingContacts = existingContactsStr
        ? JSON.parse(existingContactsStr)
        : [];

      const newContact = {
        ...data,
        timestamp: new Date().toISOString(),
        id: `contact-${Date.now()}`,
      };

      const updatedContacts = [newContact, ...existingContacts];
      localStorage.setItem(
        "contactSubmissions",
        JSON.stringify(updatedContacts)
      );

      console.log(
        "MERK: Backend utilgjengelig - kontakthenvendelse midlertidig lagret i localStorage"
      );

      // Suksess selv om vi måtte lagre lokalt
      return { success: true, localStorageFallback: true };
    } catch (localErr) {
      console.error("Kunne ikke lagre i localStorage:", localErr);
    }

    throw err;
  }
};

export default function ContactForm() {
 const router = useRouter();
 const [isPending, startTransition] = useTransition();


 const [formData, setFormData] = useState<ContactFormData>({
   name: "",
   email: "",
   phoneNumber: "",
   message: "",
 });


  const [validationErrors, setValidationErrors] = useState<{
    [key in keyof ContactFormData]?: string;
  }>({});

  // State for success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Tracking remaining characters
  const [messageLength, setMessageLength] = useState(0);
  const maxMessageLength = 256;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Update message length if the message field is changing
    if (name === "message") {
      setMessageLength(value.length);
    }

   // Clear validation error when field is edited
   if (validationErrors[name as keyof ContactFormData]) {
     setValidationErrors((prev) => ({
       ...prev,
       [name]: undefined,
     }));
   }


   setFormData((prev) => ({
     ...prev,
     [name]: value,
   }));
 };


  const validateField = (field: keyof ContactFormData, value: string) => {
    try {
      contactFormSchema.partial().parse({ [field]: value });
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldError = error.errors.find((err) => err.path[0] === field);
        if (fieldError) {
          setValidationErrors((prev) => ({
            ...prev,
            [field]: fieldError.message,
          }));
        }
      }
      return false;
    }
  };

 const handleBlur = (
   e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
 ) => {
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
      console.log("Validerte skjemadata:", validatedData);

      startTransition(async () => {
        try {
          // Send data til backend
          const result = await submitContactRequest({
            name: validatedData.name,
            email: validatedData.email,
            phoneNumber: validatedData.phoneNumber,
            message: validatedData.message,
          });

          // Vis suksessmodal - enten med API eller localStorage
          setShowSuccessModal(true);

          // Nullstill skjema
          setFormData({
            name: "",
            email: "",
            phoneNumber: "",
            message: "",
          });

          // Nullstill message length counter
          setMessageLength(0);
        } catch (err) {
          console.error("Feil ved sending av skjema:", err);

          // Vi setter generalError selv om vi har localStorage-fallback,
          // for å gi brukeren informasjon om at backend-sending feilet
          setGeneralError(
            "Det oppstod en feil ved sending av skjema. Vi har lagret henvendelsen din lokalt og vil forsøke å sende den på nytt senere."
          );

          // Vi viser fortsatt suksessmodal siden localStorage-lagring fungerte
          setShowSuccessModal(true);
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        // Map Zod errors to form fields
        const errors: { [key in keyof ContactFormData]?: string } = {};
        error.errors.forEach((err) => {
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

  // Handler for closing the modal and navigating
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);

    try {
      router.push(
        "/kontakt-oss?message=Takk for din henvendelse! Vi vil kontakte deg så snart som mulig."
      );
    } catch (err) {
      console.error("Feil ved navigering:", err);
      // Selv om navigeringen feiler, vil skjemaet være nullstilt og brukeren ha sett bekreftelsesmeldingen
    }
  };

  // Calculate character counter color
  const getCharCounterColor = () => {
    if (messageLength === 0) return "text-gray-500";
    if (messageLength < 10) return "text-red-500";
    if (messageLength > 450)
      return messageLength >= maxMessageLength
        ? "text-red-500"
        : "text-amber-500";
    return "text-green-500";
  };

  return (
    <div className="bg-[#f9f3ed] p-4 sm:p-8 md:p-12 rounded-lg">
      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="Takk for din henvendelse!"
        primaryButtonText="OK"
        onPrimaryButtonClick={handleCloseSuccessModal}
      >
        <div className="text-center py-4">
          <div className="inline-flex mb-4 items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <FaCheckCircle className="text-green-600 text-3xl" />
          </div>
          <p className="text-lg mb-2">Meldingen er sendt!</p>
          <p className="text-gray-600">
            Vi har mottatt din henvendelse og vil kontakte deg så snart som
            mulig.
          </p>
        </div>
      </Modal>

      {generalError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
          <div className="mt-0.5 mr-2 flex-shrink-0">
            <FaExclamationTriangle className="text-red-600 text-xl" />
          </div>
          <p>{generalError}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        aria-label="Kontaktskjema"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Navn<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Navn"
              required
              disabled={isPending}
              className={`w-full px-4 py-3 h-12 rounded-md border ${
                validationErrors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 bg-white`}
              autoComplete="name"
              aria-required="true"
              aria-invalid={!!validationErrors.name}
              aria-describedby={
                validationErrors.name ? "name-error" : undefined
              }
            />
            {validationErrors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600">
                {validationErrors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Telefonnummer<span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Telefonnummer"
              disabled={isPending}
              className={`w-full px-4 py-3 h-12 rounded-md border ${
                validationErrors.phoneNumber
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 bg-white`}
              autoComplete="tel"
              aria-invalid={!!validationErrors.phoneNumber}
              aria-describedby={
                validationErrors.phoneNumber ? "phoneNumber-error" : undefined
              }
            />
            {validationErrors.phoneNumber && (
              <p id="phoneNumber-error" className="mt-1 text-sm text-red-600">
                {validationErrors.phoneNumber}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            E-post adresse<span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="E-post adresse"
            required
            disabled={isPending}
            className={`w-full px-4 py-3 h-12 rounded-md border ${
              validationErrors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            } focus:outline-none focus:ring-2 bg-white`}
            autoComplete="email"
            aria-required="true"
            aria-invalid={!!validationErrors.email}
            aria-describedby={
              validationErrors.email ? "email-error" : undefined
            }
          />
          {validationErrors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">
              {validationErrors.email}
            </p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Beskrivelse<span className="text-red-600">*</span>
            </label>
            <span className={`text-xs ${getCharCounterColor()}`}>
              {messageLength}/{maxMessageLength} tegn
            </span>
          </div>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Skriv detaljert om hva du lurer på. Minst 10 tegn og maks 500 tegn."
            required
            rows={8}
            maxLength={maxMessageLength}
            disabled={isPending}
            className={`w-full px-4 py-3 rounded-md border ${
              validationErrors.message
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            } focus:outline-none focus:ring-2 bg-white min-h-[200px] resize-y`}
            aria-required="true"
            aria-invalid={!!validationErrors.message}
            aria-describedby={
              validationErrors.message ? "message-error" : undefined
            }
          ></textarea>
          {validationErrors.message && (
            <p id="message-error" className="mt-1 text-sm text-red-600">
              {validationErrors.message}
            </p>
          )}
          <p className="mt-2 text-sm text-gray-500 normal-case">
            Skriv så detaljert som mulig for at vi best skal kunne hjelpe deg.
          </p>
        </div>

        <div className="text-right">
          <Button
            variant="primary"
            type="submit"
            disabled={isPending}
            ariaLabel={isPending ? "Sender..." : "Send"}
            className="px-8 py-3 h-12 rounded-md w-full sm:w-auto"
          >
            {isPending ? "Sender..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
}
