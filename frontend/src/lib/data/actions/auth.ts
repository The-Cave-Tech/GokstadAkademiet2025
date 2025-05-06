"use server";

// påminnelse til oss: fjerne alle konsoll logger når vi er ferdige, de eksponerer sensitiv informasjon

import {
  signInSchema,
  signUpSchema,
} from "@/lib/validation/userAuthValidation";
import { redirect } from "next/navigation";
import {
  RegisterFormState,
  LoginFormState,
  SignUpValidationErrors,
  SignInValidationErrors,
} from "@/types/auth.types";
import {
  loginUserService,
  registerUserService,
} from "@/lib/data/services/userAuth";
import { removeAuthCookie, setAuthCookie } from "@/lib/utils/cookie";
import {
  handleStrapiError,
  handleValidationErrors,
} from "@/lib/utils/serverAction-errorHandler";

/**
 * Registrerer en ny bruker.
 */
export async function register(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const fields = Object.fromEntries(formData.entries()) as Record<
    string,
    string
  >;
  console.log("[Server] Auth - Input data:", fields);

  const validation = signUpSchema.safeParse(fields);
  console.log("[Server] Auth - Validation result:", {
    success: validation.success,
    errors: validation.success ? null : validation.error.flatten().fieldErrors,
  });

  if (!validation.success) {
    const errors = handleValidationErrors(validation.error, {
      username: [],
      email: [],
      password: [],
      repeatPassword: [],
    }) as SignUpValidationErrors;

    console.warn("[Server] Auth - Validation failed:", errors);

    return {
      ...prevState,
      zodErrors: errors,
      strapiErrors: null,
      values: fields,
    };
  }

  try {
    const { username, email, password } = fields;
    const response = await registerUserService({ username, email, password });

    console.log("[Server] Register - Success. JWT:", response.jwt);

    // NB: Vi setter IKKE auth-cookie her siden brukeren skal bekrefte e-post i fremtiden

    //lenken skal byttes ut senere
  } catch (error) {
    const errorMessage = handleStrapiError(error);
    console.error("[Server] Register - Error:", error);

    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: { message: errorMessage },
      values: fields,
    };
  }
  redirect("/signin");
}

/**
 * Logger inn en bruker.
 */
export async function login(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const fields = Object.fromEntries(formData.entries()) as Record<
    string,
    string
  >;

  const validation = signInSchema.safeParse(fields);

  if (!validation.success) {
    const errors = handleValidationErrors(validation.error, {
      identifier: [],
      password: [],
    }) as SignInValidationErrors;

    return {
      ...prevState,
      zodErrors: errors,
      strapiErrors: null,
      values: fields,
    };
  }

  try {
    const { identifier, password } = fields;
    const response = await loginUserService({ identifier, password });

    if (!response || !response.jwt) {
      throw new Error("Ingen token mottatt fra serveren");
    }

    await setAuthCookie(response.jwt);

    // Return success state
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: null,
      values: fields,
      success: true,
    };
  } catch (error) {
    const errorMessage = handleStrapiError(error);

    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: { message: errorMessage },
      values: fields,
    };
  }
}

/**
 * Logger ut en bruker.
 */
export async function logout(): Promise<void> {
  try {
    console.log("[Server] Logout - Starting logout process");
    await removeAuthCookie();
    console.log("[Server] Logout - Successfully removed auth cookie");
  } catch (error) {
    console.error("[Server] Logout - Error during logout:", error);
    throw error;
  }
  redirect("/?message=Du er logget ut");
}
