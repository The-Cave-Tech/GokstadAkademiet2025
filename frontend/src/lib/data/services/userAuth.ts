import { SignInFormData, SignUpFormData } from "@/lib/validation/userAuthValidation";
import { strapiService } from "@/lib/data/services/strapiClient";

export interface StrapiAuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: {
      id: number;
      name: string;
    };
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

export async function getUserWithRole(): Promise<StrapiAuthResponse['user']> {
  return strapiService.fetch<StrapiAuthResponse['user']>('users/me?populate[role][fields][0]=name');
}