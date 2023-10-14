import { FormFieldId } from "./form/interfaces";

export type AuthErrorType =
  | "FIELD_ERROR"
  | "GENERAL_ERROR"
  | "WRONG_CREDENTIALS_ERROR"
  | "USER_NOT_CONFIRMED_ERROR"
  | "PASSWORD_POLICY_VIOLATED_ERROR"
  | "EMAIL_ALREADY_EXISTS_ERROR";

export class AuthError extends Error {
  public readonly name: AuthErrorType = "GENERAL_ERROR";
  constructor(
    type: AuthErrorType,
    public formFields?: { error: string; id: FormFieldId }[],
    message?: string
  ) {
    super(message);
    if (message) {
      this.message = message;
    }
    if (formFields) {
      this.formFields = formFields;
    }
    this.name = type;
  }
}
