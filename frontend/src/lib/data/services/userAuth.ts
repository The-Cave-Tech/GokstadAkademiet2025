import { SignUpFormData } from "@/lib/validation/authInput";
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