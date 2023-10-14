export type FormFieldId =
  | "email"
  | "password"
  | "first_name"
  | "last_name"
  | "avatarUrl";

export interface IFormField<T = FormFieldId> {
  id: T;
  value: string;
}
