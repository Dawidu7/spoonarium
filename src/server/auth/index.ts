"use server"

import * as context from "next/headers"
import { auth } from "./lucia"
import type { User } from "../db/schema"

export async function getSession() {
  const authRequest = auth.handleRequest("GET", context)
  const session = await authRequest.validate()

  return {
    ...session,
    user: session
      ? ({
          ...session.user,
          id: session.user.userId,
        } as User)
      : null,
  }
}
