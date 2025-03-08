"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import Link from "next/link";
import { SiteLogo } from "@/components/ui/SiteLogo";
import { register } from "@/lib/data/actions/auth-actions";
import { useActionState } from "react";
import { ZodErrors } from "@/components/ZodErrors";
import { PasswordToggle } from "../ui/random/PasswordToggle";
import { useValidation } from "@/hooks/useSignUpValidation";
import { authFieldError } from "@/lib/utils/authFieldError";


const initialState: FormState = {
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
  const { validationErrors, validateField } = useValidation();

  const [formState, formAction] = useActionState<FormState, FormData>(register,initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    validateField(name as ValidationErrorKeys, value);
  };

  const inputClass = "w-full p-2 mt-1 border border-gray-300 rounded-md";
  const labelClass = "text-base font-roboto font-normal text-gray-700";
  console.log("Form State:", formState);
  console.log("Validation Errors:", validationErrors);

  return (
    <section className="auth-card-section flex items-center justify-center min-h-[calc(100vh-64px)] mt-16">
      <form action={formAction} className="space-y-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <section className="flex flex-col items-center gap-4">
              <h1 className="text-xl font-semibold">Opprett Konto</h1>
              <SiteLogo
                className="/* Dark mode støtte */"
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

              <section className="block">
                <label htmlFor="username" className={labelClass}>
                  Brukernavn
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={inputClass}
                  placeholder="Skriv inn brukernavn"
                  required
                  autoComplete="username"
                  value={formValues.username}
                  onChange={handleChange}
                />
                <ZodErrors error={authFieldError(validationErrors, formState?.zodErrors ?? {}, "username")} />
              </section>

              <section className="block">
                <label htmlFor="email" className={labelClass}>
                  E-post
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={inputClass}
                  placeholder="Skriv inn e-post"
                  required
                  autoComplete="email"
                  value={formValues.email}
                  onChange={handleChange}
                />
               <ZodErrors error={authFieldError(validationErrors, formState?.zodErrors ?? {}, "email")} />
              </section>

              <section className="block">
                <label htmlFor="password" className={labelClass}>
                  Passord
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className={inputClass}
                    placeholder="Lag et passord"
                    required
                    autoComplete="new-password"
                    value={formValues.password}
                    onChange={handleChange}
                  />
                  <PasswordToggle
                    showPassword={showPassword}
                    togglePassword={() => setShowPassword((prev) => !prev)}
                  />
                </div>
                <ZodErrors error={authFieldError(validationErrors, formState?.zodErrors ?? {}, "password")} />
              </section>

              <section className="block">
                <label htmlFor="repeat_password" className={labelClass}>
                  Gjenta passord
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="repeat_password"
                    name="repeatPassword"
                    className={inputClass}
                    placeholder="Gjenta passord"
                    required
                    autoComplete="new-password"
                    value={formValues.repeatPassword}
                    onChange={handleChange}
                  />
                  <PasswordToggle
                    showPassword={showPassword}
                    togglePassword={() => setShowPassword((prev) => !prev)}
                  />
                </div>
                <ZodErrors error={authFieldError(validationErrors, formState?.zodErrors ?? {}, "repeatPassword")} />
              </section>
            </fieldset>

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
                  <Link href="/privacy" className="text-blue-500 hover:underline">
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