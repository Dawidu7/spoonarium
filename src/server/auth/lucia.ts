import { lucia } from "lucia"
import { nextjs_future } from "lucia/middleware"
import adapter from "./adapter"
import type { User } from "../db/schema"

export const auth = lucia({
  adapter: adapter(),
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  sessionCookie: { expires: false },
  getUserAttributes: (data: User) => ({
    email: data.email,
    phone: data.phone,
    firstName: data.firstName,
    lastName: data.lastName,
    isStaff: data.isStaff,
  }),
})

export type Auth = typeof auth
