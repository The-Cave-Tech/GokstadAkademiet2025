"use client";

import { useState, useEffect, startTransition } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import Link from "next/link";
import { SiteLogo } from "@/components/ui/SiteLogo";
import { register } from "@/lib/data/actions/auth";
import { useActionState } from "react";
import { ZodErrors } from "@/components/common/ZodErrors";
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
  const labelClass = "text-body-small font-roboto font-normal text-typographyPrimary flex items-center gap-1";
  const getInputStateClass = (field: SignUpValidationErrorKeys) => {
    const clientError = (validationErrors[field]?.length ?? 0) > 0;
    const serverError = (displayedServerErrors?.[field]?.length ?? 0) > 0;

    if (isSubmitted && !formValues[field]) return "border-danger focus:ring-red-200"; 
    if (clientError || (isSubmitted && serverError)) return "border-danger focus:ring-red-200"; 
    return "border-grayed focus:ring-black"; 
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
              <SiteLogo className="dark:invert" style={{ width: "auto", height: "45px", maxWidth: "100%" }} />
              <h1 className="text-section-title-small sm:text-section-title-medium font-semibold text-typographyPrimary">Opprett Konto</h1>
              <div className="flex gap-1 text-captions-small sm:text-captions-big text-typographySecondary">
                <p>Har du allerede en konto?</p>
                <Link href="/signin" className="text-standard hover:text-standard-hover hover:underline">
                  Logg Inn
                </Link>
              </div>
            </section>
          </CardHeader>
          
          <form onSubmit={handleSubmit} className="w-full">
          <CardBody>
            <div className="text-center mb-3 sm:mb-4">
              {formState.strapiErrors ? (
                <p className="text-danger text-captions-small sm:text-captions-big font-medium animate-fade-in">{formState.strapiErrors.message}</p>
              ) : isSubmitted && Object.values(formValues).some((val) => !val) ? (
                <p className="text-danger text-captions-small sm:text-captions-big font-medium animate-fade-in">Alle felt merket med * er obligatoriske</p>
              ) : null}
            </div>

            <fieldset className="space-y-3 sm:space-y-5">
              <legend className="sr-only">Registreringsdetaljer</legend>

              <section>
                <label htmlFor="username" className={`${labelClass} text-captions-big sm:text-body-small`}>
                  Brukernavn {showAsterisk("username") && <span className="text-danger text-body-big leading-none inline-block w-2">*</span>}
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`${inputClass} ${getInputStateClass("username")} text-captions-big sm:text-body-small`}
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
                <label htmlFor="email" className={`${labelClass} text-captions-big sm:text-body-small`}>
                  E-post {showAsterisk("email") && <span className="text-danger text-body-big leading-none inline-block w-2">*</span>}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`${inputClass} ${getInputStateClass("email")} text-captions-big sm:text-body-small`}
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
                <label htmlFor="password" className={`${labelClass} text-captions-big sm:text-body-small`}>
                  Passord {showAsterisk("password") && <span className="text-danger text-body-big leading-none inline-block w-2">*</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className={`${inputClass} ${getInputStateClass("password")} text-captions-big sm:text-body-small`}
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
                <label htmlFor="repeatPassword" className={`${labelClass} text-captions-big sm:text-body-small`}>
                  Gjenta passord {showAsterisk("repeatPassword") && <span className="text-danger text-body-big leading-none inline-block w-2">*</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="repeatPassword"
                    name="repeatPassword"
                    className={`${inputClass} ${getInputStateClass("repeatPassword")} text-captions-big sm:text-body-small`}
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
                    className="cursor-pointer accent-standard"
                    checked={termsAccepted}
                    onChange={handleChange}
                    aria-describedby="Jeg aksepterer bruksvilkårene."
                  />
                </div>
                <div className="flex-grow text-captions-small sm:text-body-small text-typographyPrimary">
                  <label htmlFor="terms" className="flex flex-wrap items-center">
                    Jeg aksepterer{" "}
                    <Link href="/terms" className="text-standard hover:text-standard-hover hover:underline mx-1">
                    bruksvilkårene.
                    </Link>
                    {!termsAccepted && <span className="text-danger text-body-big leading-none inline-block w-2">*</span>}
                  </label>
                </div>
              </div>
            </fieldset>
          </CardBody>
          <CardFooter >
            <button
              type="submit"
              disabled={!isFormComplete}
              className={`w-full p-2 rounded-md text-background text-captions-big sm:text-body-small transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                isFormComplete ? "bg-standard hover:bg-standard-hover-dark" : "bg-grayed cursor-not-allowed"
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