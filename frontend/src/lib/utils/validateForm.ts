export const validateField = (name: string, value: string) => {
  let error = "";

  if (name === "telefon") {
    error = /^[0-9]{8}$/.test(value)
      ? ""
      : "Telefonnummer må være nøyaktig 8 siffer";
  }

  if (name === "epost") {
    error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? ""
      : "Ugyldig e-postadresse";
  }

  return error;
};

export const validateForm = (formData: { telefon: string; epost: string }) => {
  return {
    telefon: validateField("telefon", formData.telefon),
    epost: validateField("epost", formData.epost),
  };
};
