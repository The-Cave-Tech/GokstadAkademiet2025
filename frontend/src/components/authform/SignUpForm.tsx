"use client";

import { useState, useEffect, startTransition } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import Link from "next/link";
import { SiteLogo } from "@/components/ui/SiteLogo";
import { register } from "@/lib/data/actions/auth";
import { useActionState } from "react";
import { ZodErrors } from "@/components/ZodErrors";
import { PasswordToggle } from "@/components/ui/custom/PasswordToggle";
import PasswordStrengthMeter from "@/components/ui/custom/PasswordStrengthMeter";
import { authFieldError } from "@/lib/utils/serverAction-errorHandler"; 
import { useSignUpValidation } from "@/hooks/useValidation";
import { RegisterFormState, SignUpValidationErrorKeys } from "@/types/auth.types";
import { SignUpFormData } from "@/lib/validation/userAuthValidation";

const initialState: RegisterFormState = {
  zodErrors: null,
  strapiErrors: null,
  values: {},
};

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState<SignUpFormData>({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { validationErrors, validateField } = useSignUpValidation();

  const [formState, formAction] = useActionState(register, initialState);
  const [displayedServerErrors, setDisplayedServerErrors] = useState<RegisterFormState["zodErrors"]>(null);

  useEffect(() => {
    if (isSubmitted) {
      setDisplayedServerErrors(formState.zodErrors);
    }
  }, [formState.zodErrors, isSubmitted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setTermsAccepted(checked);
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
      validateField(name as SignUpValidationErrorKeys, value, formValues);
      if (!validationErrors[name as SignUpValidationErrorKeys]?.length && displayedServerErrors) {
        setDisplayedServerErrors((prev) => (prev ? { ...prev, [name]: [] } : null));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    Object.entries(formValues).forEach(([name, value]) => {
      validateField(name as SignUpValidationErrorKeys, value, formValues);
    });
    startTransition(() => {
      formAction(new FormData(e.currentTarget));
    });
  };

  const isFormComplete = Object.values(formValues).every((val) => val.trim() !== "") && termsAccepted;

  const inputClass = "w-full p-2 mt-1 border rounded-md transition-all focus:outline-none focus:ring-2";
  const labelClass = "text-base font-roboto font-normal text-gray-700 flex items-center gap-1";
  const getInputStateClass = (field: SignUpValidationErrorKeys) => {
    const clientError = (validationErrors[field]?.length ?? 0) > 0;
    const serverError = (displayedServerErrors?.[field]?.length ?? 0) > 0;

    if (isSubmitted && !formValues[field]) return "border-red-500 focus:ring-red-200"; 
    if (clientError || (isSubmitted && serverError)) return "border-red-500 focus:ring-red-200"; 
    return "border-gray-300 focus:ring-black"; 
  };


  const showAsterisk = (field: SignUpValidationErrorKeys) => {
    if (!isSubmitted) {
      return !formValues[field] || validationErrors[field]?.length > 0;
    } else if (formState.strapiErrors) {
      return ["username", "email"].includes(field);
    } else {
      return !formValues[field];
    }
  };

  return (
    <section className="auth-card-section">
        <Card className="w-full sm:w-[26rem] max-w-full mx-auto shadow-lg">
          <CardHeader className="pb-3 sm:pb-4">
            <section className="flex flex-col items-center gap-2 sm:gap-4">
              <SiteLogo className="dark:invert" style={{ width: "90px", height: "40px", maxWidth: "100%" }} />
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Opprett Konto</h1>
              <div className="flex gap-1 text-xs sm:text-sm text-gray-600">
                <p>Allerede har en konto?</p>
                <Link href="/signin" className="text-blue-500 hover:underline">
                  Logg Inn
                </Link>
              </div>
            </section>
          </CardHeader>
          
          <form onSubmit={handleSubmit} className="w-full">
          <CardBody>
            <div className="text-center mb-3 sm:mb-4">
              {formState.strapiErrors ? (
                <p className="text-red-500 text-xs sm:text-sm font-medium animate-fade-in">{formState.strapiErrors.message}</p>
              ) : isSubmitted && Object.values(formValues).some((val) => !val) ? (
                <p className="text-red-500 text-xs sm:text-sm font-medium animate-fade-in">Alle felt merket med * er obligatoriske</p>
              ) : null}
            </div>

            <fieldset className="space-y-3 sm:space-y-5">
              <legend className="sr-only">Registreringsdetaljer</legend>

              <section>
                <label htmlFor="username" className={`${labelClass} text-sm sm:text-base`}>
                  Brukernavn {showAsterisk("username") && <span className="text-red-500 text-lg leading-none inline-block w-2">*</span>}
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`${inputClass} ${getInputStateClass("username")} text-sm sm:text-base`}
                  placeholder="Skriv inn brukernavn"
                  autoComplete="username"
                  value={formValues.username}
                  onChange={handleChange}
                  aria-describedby="Skriv inn brukernavn"
                />
                <ZodErrors
                  error={authFieldError(validationErrors, displayedServerErrors ?? validationErrors, "username")}
                />
              </section>

              <section>
                <label htmlFor="email" className={`${labelClass} text-sm sm:text-base`}>
                  E-post {showAsterisk("email") && <span className="text-red-500 text-lg leading-none inline-block w-2">*</span>}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`${inputClass} ${getInputStateClass("email")} text-sm sm:text-base`}
                  placeholder="Skriv inn e-post"
                  autoComplete="email"
                  value={formValues.email}
                  onChange={handleChange}
                  aria-describedby="Skriv inn epost"
                />
                <ZodErrors
                  error={authFieldError(validationErrors, displayedServerErrors ?? validationErrors, "email")}
                />
              </section>

              <section>
                <label htmlFor="password" className={`${labelClass} text-sm sm:text-base`}>
                  Passord {showAsterisk("password") && <span className="text-red-500 text-lg leading-none inline-block w-2">*</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className={`${inputClass} ${getInputStateClass("password")} text-sm sm:text-base`}
                    placeholder="Lag et passord"
                    autoComplete="new-password"
                    value={formValues.password}
                    onChange={handleChange}
                    aria-describedby="Skriv inn passord"
                  />
                  <PasswordToggle
                    showPassword={showPassword}
                    togglePassword={() => setShowPassword((prev) => !prev)}
                  />
                </div>
                {formValues.password && (
                  <PasswordStrengthMeter 
                    password={formValues.password} 
                    className="mt-1"
                  />
                )}
                <ZodErrors
                  error={authFieldError(validationErrors, displayedServerErrors ?? validationErrors, "password")}
                />
              </section>

              <section>
                <label htmlFor="repeatPassword" className={`${labelClass} text-sm sm:text-base`}>
                  Gjenta passord {showAsterisk("repeatPassword") && <span className="text-red-500 text-lg leading-none inline-block w-2">*</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="repeatPassword"
                    name="repeatPassword"
                    className={`${inputClass} ${getInputStateClass("repeatPassword")} text-sm sm:text-base`}
                    placeholder="Gjenta passord"
                    autoComplete="new-password"
                    value={formValues.repeatPassword}
                    onChange={handleChange}
                    aria-describedby="Gjenta passord"
                  />
                  <PasswordToggle
                    showPassword={showPassword}
                    togglePassword={() => setShowPassword((prev) => !prev)}
                  />
                </div>
                <ZodErrors
                  error={authFieldError(validationErrors, displayedServerErrors ?? validationErrors, "repeatPassword")}
                />
              </section>
            </fieldset>

            <fieldset className="pt-4">
              <legend className="sr-only">Vilkår og betingelser</legend>
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    name="termsAccepted"
                    className="cursor-pointer accent-blue-500"
                    checked={termsAccepted}
                    onChange={handleChange}
                    aria-describedby="Jeg aksepterer bruksvilkårene."
                  />
                </div>
                <div className="flex-grow text-xs sm:text-sm text-gray-700">
                  <label htmlFor="terms" className="flex flex-wrap items-center">
                    Jeg aksepterer{" "}
                    <Link href="/terms" className="text-blue-500 hover:underline mx-1">
                    bruksvilkårene.
                    </Link>
                    {!termsAccepted && <span className="text-red-500 text-lg leading-none inline-block w-2">*</span>}
                  </label>
                </div>
              </div>
            </fieldset>
          </CardBody>
          <CardFooter >
            <button
              type="submit"
              disabled={!isFormComplete}
              className={`w-full p-2 rounded-md text-white text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                isFormComplete ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Opprett konto
            </button>
          </CardFooter>
          </form>
        </Card>
    </section>
  );
}