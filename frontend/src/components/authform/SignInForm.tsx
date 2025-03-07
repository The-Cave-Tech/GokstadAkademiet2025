"use client";
// Stylingen må jobbes på mer
// Validering fikser jeg senere med zod eller yup

import { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { SiteLogo } from "@/components/ui/SiteLogo";

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setErrorMessage("Ugyldig e-postadresse.");
      return;
    }
    setErrorMessage("");
    console.log("Submitted:", { email, password });
  };

  return (
    <section className="w-full max-w-md">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <section className="flex flex-col items-center gap-4">
            <h1 className="text-xl font-semibold">Logg Inn</h1>
            <SiteLogo className="/* Dark mode støtte */" style={{ width: "90px", height: "45px" }} />
          </section>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit}>
            <fieldset className="space-y-4">
              <legend className="sr-only">Påloggingsdetaljer</legend>

              <section className="block">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  E-post eller brukernavn
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  placeholder="Skriv inn e-post eller brukernavn"
                  required
                  autoComplete="email"
                  aria-describedby="email-desc"
                />
                <small id="email-desc" className="text-red-500">
                  Bruk en gyldig e-postadresse.
                </small>{" "}
                {/* bare for visualisering */}
              </section>

              <section className="block">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Passord
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                    placeholder="Skriv inn passord"
                    required
                    autoComplete="current-password"
                    aria-describedby="password-desc"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                    aria-label="Veksle synlighet av passord"
                    aria-pressed={showPassword}
                    title="Veksle synlighet av passord"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-xl" />
                    ) : (
                      <FaEye className="text-xl" />
                    )}
                  </button>
                </div>
                <small id="password-desc" className="text-red-500">
                  Passord må være minst 8 tegn langt.
                </small>{" "}
                {/* bare eksempel */}
              </section>
            </fieldset>

            <div className="flex justify-between items-center my-4">
              <section className="flex items-center text-sm text-gray-700">
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember">Husk meg</label>
              </section>
              <a href="#" className="text-sm text-blue-500 hover:underline">
                Glemt passord?
              </a>
            </div>

            {errorMessage && (
              <p className="text-red-500 mt-2" role="alert" aria-live="polite">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Logg inn
            </button>

            <div className="flex gap-1 mt-4 text-center text-sm text-gray-700">
              <p>Har du ikke en konto?</p>
              <Link href="/signup" className="text-blue-500 hover:underline">
                Registrer deg
              </Link>
            </div>
          </form>
        </CardBody>

        <CardFooter>
          <div className="mt-4">
            <section className="flex gap-1 mt-4 text-center items-center text-sm text-gray-700">
              <hr className="flex-grow border-t-2 border-gray-700" />
              <span className="mx-4 text-sm text-gray-700">Eller</span>
              <hr className="flex-grow border-t-2 border-gray-700" />
            </section>

            <ul className="mt-4 flex flex-col gap-2">
              {[
                { src: "/authlogo/facebook.svg", text: "Facebook" },
                { src: "/authlogo/microsoft.svg", text: "Microsoft" },
                { src: "/authlogo/google.svg", text: "Google" },
              ].map(({ src, text }) => (
                <li key={text}>
                  <button className="flex justify-center border w-full gap-2 rounded-lg p-2 hover:bg-gray-300">
                    <Image
                      src={src}
                      alt={`${text} logo`}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <span className="text-gray-900 dark:text-white">
                      Logg inn med {text}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
