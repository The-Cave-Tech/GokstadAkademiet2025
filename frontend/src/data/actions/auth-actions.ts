"use server";

type FormState = {
  message: string;
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    repeatPassword?: string[];
  };
  data?: {
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
  };
};

// Testing dummy validation and server signup action
export async function register(_prevState: FormState, formData: FormData): Promise<FormState> {
  console.log("Server aksjon - Mottar data:", formData);

  const formFields = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    repeatPassword: formData.get("repeatPassword") as string,
  };

  console.log("Mottatte felter:", formFields); // Logg feltene du mottar

  if (!formFields.username || formFields.username.trim() === "") {
    return {
      message: "Brukernavn er påkrevd",
      errors: { username: ["Brukernavn er påkrevd"] },
    };
  }

  if (!formFields.email || !formFields.email.includes("@")) {
    return {
      message: "Ugyldig e-postadresse.",
      errors: { email: ["Ugyldig e-postadresse"] },
    };
  }

  if (!formFields.password || formFields.password.length < 8) {
    return {
      message: "Passordet må være minst 8 tegn",
      errors: { password: ["Passordet må være minst 8 tegn"] },
    };
  }

  if (formFields.password !== formFields.repeatPassword) {
    return {
      message: "Passordene må være like.",
      errors: { repeatPassword: ["Passordene må være like"] },
    };
  }

  console.log("Server rendring");
  console.log("Submitted:", formFields);
  console.log("#############");

  return {
    ..._prevState,
    data: formFields,
    message: "Konto opprettet!",
    errors: {},
  };
}



  
  

// SignIn event
export async function login(formData: FormData) {
    
  }
  
  // SignOut event
  export async function logout() {
   
  }
  
