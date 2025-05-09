// src/app/(public)/kontakt-oss/page.tsx
import React, { Suspense } from "react";
import { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import ClientMessage from "@/components/ClientMessage";

export const metadata: Metadata = {
  title: "Kontakt oss | The Cave Tech",
  description: "Ta kontakt med The Cave Tech. Vi hjelper deg med spørsmål og henvendelser.",
  keywords: "kontakt, henvendelse, support, hjelp, The Cave Tech",
};

function ContactInfoSkeleton() {
  return (
    <div className="animate-pulse" aria-label="Laster kontaktinformasjon" role="status">
      <div className="flex mb-16">
        <div className="mr-6">
          <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
        </div>
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-5 w-40 bg-gray-200 rounded"></div>
          <div className="h-5 w-28 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      <div className="flex mb-16">
        <div className="mr-6">
          <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
        </div>
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-5 w-40 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      <div className="flex mb-16">
        <div className="mr-6">
          <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
        </div>
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-5 w-40 bg-gray-200 rounded"></div>
        </div>
      </div>
      <span className="sr-only">Laster inn...</span>
    </div>
  );
}

function ContactFormSkeleton() {
  return (
    <div className="bg-[#f9f3ed] p-12 rounded-lg animate-pulse" aria-label="Laster kontaktskjema" role="status">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="h-12 bg-gray-200 rounded-md"></div>
        <div className="h-12 bg-gray-200 rounded-md"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded-md mb-6"></div>
      <div className="h-48 bg-gray-200 rounded-md mb-6"></div>
      <div className="flex justify-end">
        <div className="h-12 w-24 bg-blue-300 rounded-md"></div>
      </div>
      <span className="sr-only">Laster inn...</span>
    </div>
  );
}

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-8" aria-labelledby="kontakt-heading">
      <h1 id="kontakt-heading" className="text-4xl font-bold mb-10">Kontakt oss</h1>
      
      <ClientMessage />
      
      <div className="flex flex-col md:flex-row gap-16">
        {/* Contact Information Column */}
        <section className="w-full md:w-1/3" aria-label="Kontaktinformasjon">
          <Suspense fallback={<ContactInfoSkeleton />}>
            <ContactInfo />
          </Suspense>
        </section>
        
        {/* Contact Form Column */}
        <section className="w-full md:w-2/3" aria-label="Kontaktskjema">
          <Suspense fallback={<ContactFormSkeleton />}>
            <ContactForm />
          </Suspense>
        </section>
      </div>
    </main>
  );
}