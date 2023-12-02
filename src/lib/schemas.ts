import { phone } from "phone"
import {
  custom,
  email,
  getOutput,
  getPipeIssues,
  maxLength,
  minLength,
  object,
  string,
} from "valibot"
import type { Output } from "valibot"

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
