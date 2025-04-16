// lib/data/services/userAuth.ts
import { SignInFormData, SignUpFormData } from "@/lib/validation/validationSchemas";
import { strapiService } from "@/lib/data/services/strapiClient";

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
  return strapiService.fetch<StrapiAuthResponse>('auth/local/register', {
    method: 'post',
    body: userData
  });
}

export async function loginUserService(credentials: LoginUserProps): Promise<StrapiAuthResponse> {
  return strapiService.fetch<StrapiAuthResponse>('auth/local', {
    method: 'post',
    body: {
      identifier: credentials.identifier,
      password: credentials.password
    }
  });
}