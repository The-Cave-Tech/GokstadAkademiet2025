"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { SiteLogo } from "@/components/ui/SiteLogo";
import { register } from "@/data/actions/auth-actions";
import { useActionState } from "react"; // Oppdatert import

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(register, { message: "", errors: {} }); // Oppdatert fra useFormState til useActionState

  return (
    <section className="w-full max-w-md">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <section className="flex flex-col items-center gap-4">
            <h1 className="text-xl font-semibold">Opprett Konto</h1>
            <SiteLogo className="/* Dark mode støtte */" style={{ width: "90px", height: "45px" }} />
            <div className="flex gap-1 mt-4 text-center text-sm text-gray-700">
              <p>Allerede har en konto?</p>
              <Link href="/signin" className="text-blue-500 hover:underline">
                Logg Inn
              </Link>
            </div>
          </section>
        </CardHeader>

        <CardBody>
          <form action={formAction} className="space-y-4">
            <fieldset className="space-y-4">
              <legend className="sr-only">Registreringsdetaljer</legend>

              <section className="block">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Brukernavn
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  placeholder="Skriv inn brukernavn"
                  required
                  autoComplete="username"
                />
              </section>

              <section className="block">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-post
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  placeholder="Skriv inn e-post"
                  required
                  autoComplete="email"
                />
              </section>

              <section className="block">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Passord
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  placeholder="Lag et passord"
                  required
                  autoComplete="new-password"
                />
              </section>

              <section className="block">
                <label htmlFor="repeat_password" className="text-sm font-medium text-gray-700">
                  Gjenta passord
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="repeat_password"
                    name="repeatPassword"
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                    placeholder="Gjenta passord"
                    required
                    autoComplete="new-password"
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
              </section>
            </fieldset>

            {state.message && (
              <p className="text-red-500 mt-2" role="alert" aria-live="polite">
                {state.message}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Opprett en bruker
            </button>
          </form>
        </CardBody>

        <CardFooter>
          <div className="text-sm text-gray-700">
            <p>
              Ved å opprette en konto godtar du våre{" "}
              <Link href="/terms" className="text-blue-500 hover:underline">
                bruksvilkår
              </Link>{" "}
              og{" "}
              <Link href="/privacy" className="text-blue-500 hover:underline">
                personvernerklæring
              </Link>
              .
            </p>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}