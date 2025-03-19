"use client";

import { useActionState, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import Image from "next/image";
import Link from "next/link";
import { SiteLogo } from "@/components/ui/SiteLogo";
import { useSignInValidation } from "@/hooks/useValidation";
import { login } from "@/lib/data/actions/auth-actions";
import { LoginFormState, SignInValidationErrorKeys } from "@/types/auth.types";
import { SignInFormData } from "@/lib/validation/authInput";
import { authFieldError } from "@/lib/utils/authFieldError";
import { ZodErrors } from "../ZodErrors";
import { PasswordToggle } from "../ui/custom/PasswordToggle";

const initialState: LoginFormState = {
  zodErrors: null,
  strapiErrors: null,
  values: {},
};

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formValues, setFormValues] = useState<SignInFormData>({
    identifier: "",
    password: "",
  });

  const { validationErrors, validateField } = useSignInValidation();
  const [formState, formAction] = useActionState(login, initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    
    if (type === "checkbox") {
      setRememberMe(checked);
    } else {
      const newValues = { ...formValues, [name]: value };
      setFormValues(newValues);
      validateField(name as SignInValidationErrorKeys, value);
    }
  };

  const inputClass = "w-full p-2 mt-1 border border-gray-300 rounded-md";
  const labelClass = "text-base font-roboto font-normal text-gray-700";

  // Vis eventuelle Strapi-feil
  const strapiError = formState.strapiErrors?.message;

  return (
    <section className="auth-card-section flex items-center justify-center min-h-[calc(100vh-64px)] mt-16">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <section className="flex flex-col items-center gap-4">
            <h1 className="text-xl font-semibold">Logg Inn</h1>
            <SiteLogo className="/* Dark mode støtte */" style={{ width: "90px", height: "45px" }} />
          </section>
        </CardHeader>

        <CardBody>
          <form action={formAction}>
            {strapiError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {strapiError}
              </div>
            )}
            
            <fieldset className="space-y-4">
              <legend className="sr-only">Påloggingsdetaljer</legend>

              <section className="block">
                <label htmlFor="identifier" className={labelClass}>
                  E-post eller brukernavn
                </label>
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={formValues.identifier}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Skriv inn e-post eller brukernavn"
                  autoComplete="email username"
                  aria-describedby="Skriv inn brukernavn eller epost"
                />
                <ZodErrors
                  error={authFieldError(validationErrors, formState.zodErrors ?? validationErrors, "identifier")}
                />
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
                    value={formValues.password}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Skriv inn passord"
                    autoComplete="current-password"
                    aria-describedby="passord"
                  />
                  <PasswordToggle
                    showPassword={showPassword}
                    togglePassword={() => setShowPassword((prev) => !prev)}
                  />
                </div>
                <ZodErrors
                  error={authFieldError(validationErrors, formState.zodErrors ?? validationErrors, "password")}
                />
              </section>
            </fieldset>

            <div className="flex justify-between items-center my-4">
              <section className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={rememberMe}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="remember">Husk meg</label>
              </section>
              <a href="#" className="text-sm text-blue-500 hover:underline">
                Glemt passord?
              </a>
            </div>

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