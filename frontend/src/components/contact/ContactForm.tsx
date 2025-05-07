// src/components/contact/ContactForm.tsx
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { getUserCredentials, getUserProfile } from "@/lib/data/services/userProfile";
import { contactService } from "@/lib/data/services/contactService";
import { Button } from "@/components/ui/custom/Button";
import PageIcons from "@/components/ui/custom/PageIcons";

export default function ContactForm() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: ""
  });
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple client-side validation
    if (!formData.name || !formData.email || !formData.message) {
      setError("Vennligst fyll ut alle påkrevde felt.");
      return;
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Vennligst oppgi en gyldig e-postadresse.");
      return;
    }
    
    startTransition(async () => {
      try {
        // Submit to Strapi using the service
        await contactService.submitContactForm({
          ...formData,
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
        setError("Det oppstod en feil ved sending av skjema. Vennligst prøv igjen senere.");
      }
    });
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
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
          <PageIcons name="warning" directory="profileIcons" size={20} alt="" className="mt-0.5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6" aria-label="Kontaktskjema">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="sr-only">Navn</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Navn"
              required
              disabled={isPending || isLoadingUserData}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              autoComplete="name"
              aria-required="true"
            />
          </div>
          
          <div>
            <label htmlFor="phoneNumber" className="sr-only">Telefonnummer</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Telefonnummer"
              disabled={isPending || isLoadingUserData}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              autoComplete="tel"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="sr-only">E-post adresse</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-post adresse"
            required
            disabled={isPending || isLoadingUserData}
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            autoComplete="email"
            aria-required="true"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="sr-only">Kort beskrivelse av hva du lurer på</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Kort beskrivelse av hva du lurer på."
            required
            rows={8}
            disabled={isPending}
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            aria-required="true"
          ></textarea>
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