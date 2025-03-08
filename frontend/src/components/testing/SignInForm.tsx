/* 

"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import Link from "next/link";
import { SiteLogo } from "@/components/ui/SiteLogo";
import { useActionState } from "react";
import { signUpSchema } from "@/lib/validation/authInput"; // Zod-skjemaet for validering
import { register } from "@/lib/data/actions/auth-actions"; // Server-aksjon
import { PasswordToggle } from "../ui/random/PasswordToggle";
import Draggable from "react-draggable"; // Importer react-draggable

// Valideringsteknikkene samlet i en hook
function useValidation() {
  const [validationErrors, setValidationErrors] = useState({
    username: [],
    email: [],
    password: [],
    repeatPassword: [],
  });

  const validateField = (name: string, value: string) => {
    const validation = signUpSchema.safeParse({ [name]: value });
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      setValidationErrors((prev) => ({
        ...prev,
        [name]: errors[name] || [],
      }));
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: [],
      }));
    }
  };

  return { validationErrors, validateField };
}

const initialState = {
  zodErrors: null,
  strapiErrors: null,
  values: {},
};

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [focusField, setFocusField] = useState<string | null>(null); // For fokus på feilfelt
  const [isErrorsOpen, setIsErrorsOpen] = useState(false); // For å åpne/lukke dropdown
  const [dragging, setDragging] = useState(false); // For å kontrollere dra-status
  const draggableRef = useRef(null); // Ref for Draggable-komponenten

  // Hent valideringsfeil og valideringsteknikkene fra vår hook
  const { validationErrors, validateField } = useValidation();

  const [formAction] = useActionState(register, initialState); // Håndterer innsending av skjema

  // Felles funksjon for å oppdatere skjema-tilstand
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    validateField(name, value); // Kall til validering på feltet
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await formAction({ ...formValues });
  };

  const inputClass = "w-full p-2 mt-1 border border-gray-300 rounded-md";
  const labelClass = "text-base font-roboto font-normal text-gray-700";

  useEffect(() => {
    // Når en feil skjer, sett fokus på feilfeltet
    if (focusField) {
      const element = document.getElementById(focusField);
      if (element) element.focus();
    }
  }, [focusField]);

  return (
    <section className="auth-card-section flex items-center justify-center min-h-[calc(100vh-64px)] mt-16">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <section className="flex flex-col items-center gap-4">
              <h1 className="text-xl font-semibold">Opprett Konto</h1>
              <SiteLogo
                className=""
                style={{ width: "90px", height: "45px" }}
              />
              <div className="flex gap-1 mt-4 text-center text-sm text-gray-700">
                <p>Allerede har en konto?</p>
                <Link href="/signin" className="text-blue-500 hover:underline">
                  Logg Inn
                </Link>
              </div>
            </section>
          </CardHeader>

          <CardBody>
            <fieldset className="space-y-4">
              <legend className="sr-only">Registreringsdetaljer</legend>

              {}
              {["username", "email", "password", "repeatPassword"].map(
                (field) => (
                  <section key={field} className="block">
                    <label htmlFor={field} className={labelClass}>
                      {field === "username"
                        ? "Brukernavn"
                        : field === "email"
                        ? "E-post"
                        : field === "repeatPassword"
                        ? "Gjenta Passord"
                        : "Passord"}
                    </label>
                    <div className="relative">
                      <input
                        type={
                          field.includes("password") && !showPassword
                            ? "password"
                            : "text"
                        }
                        id={field}
                        name={field}
                        className={inputClass}
                        placeholder={`Skriv inn ${field}`}
                        required
                        autoComplete={field}
                        value={formValues[field]}
                        onChange={handleChange}
                        onFocus={() => setFocusField(field)} // Sett fokus når feltet får fokus
                      />
                      {field.includes("password") && (
                        <PasswordToggle
                          showPassword={showPassword}
                          togglePassword={() => setShowPassword((prev) => !prev)}
                        />
                      )}
                    </div>
                  </section>
                )
              )}
            </fieldset>

            
            <Draggable
              nodeRef={draggableRef}
              onStart={() => setDragging(true)}
              onStop={() => setDragging(false)}
            >
              <div
                ref={draggableRef}
                className="absolute z-10"
                style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} // Sentrerer boksen
              >
                <button
                  type="button"
                  onClick={() => setIsErrorsOpen(!isErrorsOpen)}
                  className="w-full p-2 bg-blue-500 text-white rounded-md text-left"
                >
                  {isErrorsOpen ? "Skjul Feilmeldinger" : "Vis Feilmeldinger"}
                </button>
                {isErrorsOpen && (
                  <div className="mt-2 bg-gray-100 p-4 rounded-md shadow-md">
                    <h3 className="font-bold text-gray-700">Feilmeldinger:</h3>
                    {Object.entries(validationErrors).map(([field, errors]) =>
                      errors.length > 0 ? (
                        <div key={field} className="mt-2">
                          <h4 className="font-semibold text-gray-600">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </h4>
                          <ul className="list-disc pl-4">
                            {errors.map((error, index) => (
                              <li
                                key={index}
                                className="text-red-500 text-xs"
                              >
                                {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            </Draggable>

            <fieldset className="flex gap-1 mt-4 text-sm text-gray-700">
              <legend className="sr-only">Vilkår og betingelser</legend>
              <div className="flex gap-2 text-sm text-gray-700">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  id="terms"
                  name="termsAccepted"
                  required
                  aria-invalid
                  aria-describedby="Du må godta bruksvilkårene for å registrere deg"
                />
                <label htmlFor="terms">
                  Jeg godtar{" "}
                  <Link href="/terms" className="text-blue-500 hover:underline">
                    bruksvilkårene
                  </Link>{" "}
                  og{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-500 hover:underline"
                  >
                    personvernerklæringen
                  </Link>
                </label>
              </div>
            </fieldset>
          </CardBody>

          <CardFooter>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Opprett konto
            </button>
          </CardFooter>
        </Card>
      </form>
    </section>
  );
} 

*/