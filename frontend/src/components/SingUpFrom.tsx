"use client";

//Stylingen må jobbes på mer
// Enkel validering før Zod/Yup legges til senere

import { useState } from "react";
import AuthCard from "@/components/ui/AuthCard";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { SiteLogo } from "./ui/SiteLogo";

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setErrorMessage("Ugyldig e-postadresse.");
      return;
    }
    if (password !== repeatPassword) {
      setErrorMessage("Passordene må være like.");
      return;
    }
    setErrorMessage("");
    console.log("Submitted:", { email, password, repeatPassword });
  };

  return (
    <section className="w-full max-w-md">
      <AuthCard
        header={
          <section className="flex flex-col items-center gap-4">
            <h1 className="text-xl font-semibold">Opprett Konto</h1>
            <SiteLogo width={90} height={40} />
            <div className="flex gap-1 mt-4 text-center text-sm text-gray-700">
              <p>Allerede har en konto?</p>
              <Link href="/signin" className="text-blue-500 hover:underline">
                Logg Inn
              </Link>
            </div>
          </section>
        }
        content={
          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset className="space-y-4">
              <legend className="sr-only">Registreringsdetaljer</legend>

              {/* E-post */}
              <section className="block">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-post
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  placeholder="Skriv inn e-post"
                  required
                />
                {errorMessage === "Ugyldig e-postadresse." && (
                  <small className="text-red-500">Bruk en gyldig e-postadresse.</small>
                )}
              </section>

              {/* Passord */}
              <section className="block">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Passord
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  placeholder="Lag et passord"
                  required
                />
              </section>

              {/* Gjenta Passord */}
              <section className="block">
                <label htmlFor="repeat_password" className="text-sm font-medium text-gray-700">
                  Passord
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="repeat_password"
                    value={repeatPassword} 
                    onChange={(e) => setRepeatPassword(e.target.value)} 
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                    placeholder="Gjenta passord"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                    aria-label="Veksle synlighet av passord"
                    aria-pressed={showPassword}
                    title="Veksle synlighet av passord"
                  >
                    {showPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                  </button>
                </div>
                {errorMessage === "Passordene må være like." && (
                  <small className="text-red-500">Passordene må være like.</small>
                )}
              </section>
            </fieldset>

            {/* Feilmelding */}
            {errorMessage && ![ "Ugyldig e-postadresse.", "Passordene må være like."].includes(errorMessage) && (
              <p className="text-red-500 mt-2" role="alert" aria-live="polite">
                {errorMessage}
              </p>
            )}

          </form>
        }
        footer={
          <div className="text-sm text-gray-700">
            <p>Ved å opprette en konto godtar du våre <Link href="/terms" className="text-blue-500 hover:underline">bruksvilkår</Link> og <Link href="/privacy" className="text-blue-500 hover:underline">personvernerklæring</Link>.</p>

              {/* Opprett -knapp */}
              <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 my-4"
            >
              Opprett en bruker
            </button>
          </div>
        }
      />
    </section>
  );
}