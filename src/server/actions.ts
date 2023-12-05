"use server"

import { LuciaError } from "lucia"
import type { QueryError } from "mysql2/promise"
import * as context from "next/headers"
import { safeParse } from "valibot"
import { auth } from "./auth/lucia"
import { signInSchema, signUpSchema } from "~/lib/schemas"
import type { SignInData, SignUpData } from "~/lib/schemas"

export async function signUp(data: SignUpData) {
  // Input validation
  const result = safeParse(signUpSchema, data)
  if (!result.success) {
    return {
      success: false,
      errors: {
        ...result.issues.reduce<Record<string, string>>(
          (acc, { message, path }) => ({ ...acc, [path![0].key]: message }),
          {},
        ),
        passwordConfirm:
          data.password !== data.passwordConfirm && "Passwords do not match",
      },
    }
  }

  // User creation
  try {
    const { userId } = await auth.createUser({
      attributes: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
      },
      key: {
        providerId: "email",
        providerUserId: data.email,
        password: data.password,
      },
    })

    if (data.phone) {
      await auth.createKey({
        userId,
        providerId: "phone",
        providerUserId: data.phone,
        password: data.password,
      })
    }

    const session = await auth.createSession({
      userId,
      attributes: {},
    })

    const authRequest = auth.handleRequest("POST", context)
    authRequest.setSession(session)

    const { user } = await authRequest.validate()

    return { success: true, user }
  } catch (e) {
    const error = e as QueryError

    const match = error.message.match(
      /Duplicate entry '([^']+)' for key '([^']+)'/,
    )

    const [, value, key] = match || []

    switch (key) {
      case "users_username_unique":
        return {
          success: false,
          errors: {
            username: `Username '${value}' is already taken.`,
          },
        }
      case "users_email_unique":
        return {
          success: false,
          errors: {
            email: `Email '${value}' is already taken.`,
          },
        }
      case "users_phone_unique":
        return {
          success: false,
          errors: {
            phone: `Phone '${value}' is already taken.`,
          },
        }
    }

    throw new Error("Internal Server Error.")
  }
}

export async function signIn(data: SignInData) {
  // Input validation
  const result = safeParse(signInSchema, data)
  if (!result.success) {
    return {
      success: false,
      errors: result.issues.reduce<Record<string, string>>(
        (acc, { message, path }) => ({ ...acc, [path![0].key]: message }),
        {},
      ),
    }
  }

  try {
    const { userId } = await auth.useKey(
      data.login.includes("@") ? "email" : "phone",
      data.login,
      data.password,
    )

    const session = await auth.createSession({
      userId,
      attributes: {},
    })

    const authRequest = auth.handleRequest("POST", context)
    authRequest.setSession(session)

    const { user } = await authRequest.validate()

    return { success: true, user }
  } catch (error) {
    console.error(error)

    if (
      error instanceof LuciaError &&
      (error.message === "AUTH_INVALID_KEY_ID" ||
        error.message === "AUTH_INVALID_PASSWORD")
    ) {
      throw new Error("Invalid credentials.")
    }

    throw new Error("Internal Server Error.")
  }
}

export async function signOut() {
  const authRequest = auth.handleRequest("POST", context)
  const session = await authRequest.validate()

  if (!session) {
    return { success: false }
  }

  await auth.invalidateSession(session.sessionId)
  authRequest.setSession(null)

  return { success: true }
}
