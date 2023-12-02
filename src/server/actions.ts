"use server"

import { SignUpData } from "~/lib/schemas"

export async function signUp(data: SignUpData) {
  await new Promise(resolve => setTimeout(resolve, 3000))

  console.log(data)
}
