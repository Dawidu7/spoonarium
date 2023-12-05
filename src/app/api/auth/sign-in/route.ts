import { LuciaError } from "lucia"
import * as context from "next/headers"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getErrors, signInSchema } from "~/lib/schemas"
import type { SignInData } from "~/lib/schemas"
import { auth } from "~/server/auth/lucia"

export async function POST(request: NextRequest) {
  const data: SignInData = await request.json()

  const errors = getErrors(signInSchema, data)
  if (errors) {
    return NextResponse.json({ errors }, { status: 400 })
  }

  try {
    const key = await auth.useKey(
      data.login.includes("@") ? "email" : "phone",
      data.login,
      data.password,
    )

    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    })

    const authRequest = auth.handleRequest(request.method, context)
    authRequest.setSession(session)

    return NextResponse.json(null, { status: 200 })
  } catch (error) {
    console.error(error)

    if (
      error instanceof LuciaError &&
      (error.message === "AUTH_INVALID_KEY_ID" ||
        error.message === "AUTH_INVALID_PASSWORD")
    ) {
      return NextResponse.json(null, { status: 401 })
    }

    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 },
    )
  }
}
