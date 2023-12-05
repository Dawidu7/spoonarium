import * as context from "next/headers"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { auth } from "~/server/auth/lucia"

export async function POST(request: NextRequest) {
  const authRequest = auth.handleRequest(request.method, context)

  const session = await authRequest.validate()

  if (!session) {
    return NextResponse.json(null, { status: 401 })
  }

  await auth.invalidateSession(session.sessionId)
  authRequest.setSession(null)

  return NextResponse.redirect(new URL("/", request.url), { status: 302 })
}
