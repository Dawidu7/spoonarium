import type { QueryError } from "mysql2"
import * as context from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { safeParse } from "valibot"
import { signUpSchema } from "~/lib/schemas"
import type { SignUpData } from "~/lib/schemas"
import { auth } from "~/server/auth/lucia"

export async function POST(request: NextRequest) {
  const data: SignUpData = await request.json()

  const result = safeParse(signUpSchema, data)
  if (!result.success) {
    return NextResponse.json(
      {
        errors: {
          ...result.issues.reduce<Record<string, string>>(
            (acc, { message, path }) => ({ ...acc, [path![0].key]: message }),
            {},
          ),
          passwordConfirm:
            data.password !== data.passwordConfirm && "Passwords do not match",
        },
      },
      { status: 400 },
    )
  }

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

    return NextResponse.json(null, { status: 201 })
  } catch (e) {
    const error = e as QueryError

    const match = error.message.match(
      /Duplicate entry '([^']+)' for key '([^']+)'/,
    )

    const [, value, key] = match || []

    switch (key) {
      case "users_username_unique":
        return NextResponse.json(
          {
            errors: {
              username: `Username '${value}' is already taken.`,
            },
          },
          { status: 400 },
        )
      case "users_email_unique":
        return NextResponse.json(
          {
            errors: {
              email: `Email '${value}' is already taken.`,
            },
          },
          { status: 400 },
        )
      case "users_phone_unique":
        return NextResponse.json(
          {
            errors: {
              phone: `Phone '${value}' is already taken.`,
            },
          },
          { status: 400 },
        )
    }

    return NextResponse.json(null, { status: 500 })
  }
}
