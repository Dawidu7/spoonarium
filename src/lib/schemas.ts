import { phone } from "phone"
import {
  email,
  getOutput,
  getPipeIssues,
  maxLength,
  minLength,
  object,
  string,
} from "valibot"
import type { BaseSchema, Output } from "valibot"
import { safeParse } from "valibot"

export function getErrors<T>(schema: BaseSchema<any, any>, data: T) {
  const result = safeParse(schema, data)
  return !result.success
    ? result.issues.reduce<Record<string, string>>(
        (acc, { path, message }) => ({
          ...acc,
          [path![0].key]: message,
        }),
        {},
      )
    : null
}

export const signUpSchema = object({
  firstName: string([
    minLength(1, "Field is required."),
    minLength(2, "Must be at least 2 characters."),
    maxLength(50, "Must be at most 50 characters."),
  ]),
  lastName: string([
    minLength(1, "Field is required."),
    minLength(2, "Must be at least 2 characters."),
    maxLength(50, "Must be at most 50 characters."),
  ]),
  email: string([minLength(1, "Field is required."), email()]),
  phone: string([
    input => {
      if (input.length === 0) return getOutput(input)

      const { isValid } = phone(input)

      return !isValid
        ? getPipeIssues("custom", "Invalid phone.", input)
        : getOutput(input)
    },
  ]),
  password: string([
    minLength(1, "Field is required."),
    minLength(5, "Must be at least 5 characters."),
  ]),
  passwordConfirm: string([minLength(1, "Field is required.")]),
})

export type SignUpData = Output<typeof signUpSchema>

export const signInSchema = object({
  login: string([minLength(1, "Field is required.")]),
  password: string([minLength(1, "Field is required.")]),
})

export type SignInData = Output<typeof signInSchema>

export const authorSchema = object({
  name: string([minLength(1, "Field is required.")]),
})

export type AuthorData = Output<typeof authorSchema>
