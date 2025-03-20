import { SignInFormData, SignUpFormData } from "@/lib/validation/validationSchemas";
import { fetchStrapiData } from "@/lib/data/services/strapiApiData";

export interface StrapiAuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

type RegisterUserProps = Pick<SignUpFormData, "username" | "email" | "password">;
type LoginUserProps = Pick<SignInFormData, "identifier" | "password">;

export async function registerUserService(userData: RegisterUserProps): Promise<StrapiAuthResponse> {
  const response = await fetchStrapiData("/api/auth/local/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response as StrapiAuthResponse;
}

export async function loginUserService(credentials: LoginUserProps): Promise<StrapiAuthResponse> {
  const response = await fetchStrapiData("/api/auth/local", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier: credentials.identifier,
      password: credentials.password
    }),
  });
  return response as StrapiAuthResponse;
}