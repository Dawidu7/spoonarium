import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  PASSWORD_REGEX_1,
  PASSWORD_REGEX_2_1,
  PASSWORD_REGEX_2_2,
  PASSWORD_REGEX_3,
  PASSWORD_REGEX_4_1,
  PASSWORD_REGEX_4_2,
  PASSWORD_REGEX_5,
} from "./regexes"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(length = 15) {
  return Math.random().toString(36).slice(2, length)
}

export function getPasswordStrength(password: string) {
  switch (true) {
    case PASSWORD_REGEX_5.test(password):
      return 5
    case PASSWORD_REGEX_4_1.test(password):
    case PASSWORD_REGEX_4_2.test(password):
      return 4
    case PASSWORD_REGEX_3.test(password):
      return 3
    case PASSWORD_REGEX_2_1.test(password):
    case PASSWORD_REGEX_2_2.test(password):
      return 2
    case PASSWORD_REGEX_1.test(password):
      return 1
    default:
      return 0
  }
}
