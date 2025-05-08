"use client";

import { useActionState, useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteLogo } from "@/components/ui/SiteLogo";
import { useSignInValidation } from "@/hooks/useValidation";
import { login } from "@/lib/data/actions/auth";
import { LoginFormState, SignInValidationErrorKeys, SocialLoginButton } from "@/types/auth.types";
import { SignInFormData } from "@/lib/validation/userAuthValidation";
import { authFieldError } from "@/lib/utils/serverAction-errorHandler";
import { ZodErrors } from "../ZodErrors";
import { PasswordToggle } from "../ui/custom/PasswordToggle";
import { useAuth } from "@/lib/context/AuthContext";
import { PageIcons } from "@/components/ui/custom/PageIcons";

const initialState: LoginFormState = {
  zodErrors: null,
  strapiErrors: null,
  values: {},
  success: false
};

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState<SignInFormData>({
    identifier: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { validationErrors, validateField } = useSignInValidation();
  const [formState, formAction] = useActionState(login, initialState);
  const { setIsAuthenticated, refreshAuthStatus, handleSuccessfulAuth } = useAuth(); 

  // Here can providere be added or removed easy
  const socialButtons: SocialLoginButton[] = [
    { provider: "google", text: "Google", src: "google" },
    { provider: "facebook", text: "Facebook", src: "facebook" },
   /*  { provider: "microsoft", text: "Microsoft", src: "microsoft" } */
  ];

  // OAuth login
  const handleSocialLogin = (provider: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace(/\/api$/, "") || "http://localhost:1337";
    const callbackUrl = `${window.location.origin}/api/auth/callback/${provider}`;
    
    router.push(`${baseUrl}/api/connect/${provider}?callback=${encodeURIComponent(callbackUrl)}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValues = { ...formValues, [name]: value };
    setFormValues(newValues);
    validateField(name as SignInValidationErrorKeys, value);
  };

  useEffect(() => {
    if (
      formState &&
      Object.keys(formState.values || {}).length > 0 &&
      !formState.zodErrors &&
      !formState.strapiErrors &&
      formState.success
    ) {
      setIsAuthenticated(true);
      refreshAuthStatus();
      handleSuccessfulAuth();
    }
    
    setIsSubmitting(false);
  }, [formState, setIsAuthenticated, refreshAuthStatus, handleSuccessfulAuth]);

  const inputClass = "w-full p-2 mt-1 border border-gray-300 rounded-md";
  const labelClass = "text-base font-roboto font-normal text-gray-700";

  return (
    <section className="auth-card-section flex items-center justify-center min-h-[calc(100vh-64px)] mt-16">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <section className="flex flex-col items-center gap-4">
            <h1 className="text-xl font-semibold">Logg Inn</h1>
            <SiteLogo
              className="/* Dark mode støtte */"
              style={{ width: "90px", height: "45px" }}
            />
          </section>
        </CardHeader>

        <CardBody>
          <form action={formAction} onSubmit={() => setIsSubmitting(true)}>
            {formState.strapiErrors?.message && (
              <p className="text-red-500 text-center text-xs sm:text-sm font-medium animate-fade-in">
                {formState.strapiErrors?.message}
              </p>
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
                  error={authFieldError(
                    validationErrors,
                    formState.zodErrors ?? validationErrors,
                    "identifier"
                  )}
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
                  error={authFieldError(
                    validationErrors,
                    formState.zodErrors ?? validationErrors,
                    "password"
                  )}
                />
              </section>
            </fieldset>

            <div className="flex justify-end items-center my-4">
              <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                Glemt passord?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              {isSubmitting ? "Logger inn..." : "Logg inn"}
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
              {socialButtons.map(({ src, text, provider }) => (
                <li key={text}>
                  <button 
                    type="button" 
                    onClick={() => handleSocialLogin(provider)}
                    className="flex justify-center border w-full gap-2 rounded-lg p-2 hover:bg-gray-300"
                  >
                    <PageIcons
                      name={src}
                      directory="authlogo"
                      size={24}
                      alt={`${text} logo`}
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