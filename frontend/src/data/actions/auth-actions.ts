"use server"

type FormState = {
  message: string;
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    repeatPassword?: string[];
  };
};

// testing  dummy validation and server signup action
export async function register(_prevState: FormState, formData: FormData): Promise<FormState> {
  console.log("I am groot and this is Register User Action");

  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const repeatPassword = formData.get("repeatPassword") as string;

  if (!username || username.trim() === "") {
    return {
      message: "Brukernavn er påkrevd",
      errors: { username: ["Brukernavn er påkrevd"] },
    };
  }

  if (!email || !email.includes("@")) {
    return {
      message: "Ugyldig e-postadresse.",
      errors: { email: ["Ugyldig e-postadresse"] },
    };
  }

  if (!password || password.length < 8) {
    return {
      message: "Passordet må være minst 8 tegn",
      errors: { password: ["Passordet må være minst 8 tegn"] },
    };
  }

  if (password !== repeatPassword) {
    return {
      message: "Passordene må være like.",
      errors: { repeatPassword: ["Passordene må være like"] },
    };
  }

  console.log("#############");
  console.log("Submitted:", { username, email, password, repeatPassword });
  console.log("#############");

  return { message: "Konto opprettet!", errors: {} };
}

// SignIn event
export async function login(formData: FormData) {
    
  }
  
  // SignOut event
  export async function logout() {
   
  }
  
