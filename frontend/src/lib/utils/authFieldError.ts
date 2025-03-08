export function authFieldError(
    validationErrors: Record<string, string[] | undefined>,
    formStateErrors: Record<string, string[] | undefined>,
    fieldName: string
  ) {
    return validationErrors[fieldName]?.length
      ? validationErrors[fieldName]
      : formStateErrors[fieldName] ?? [];
  }
  