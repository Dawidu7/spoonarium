import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { AuthorData } from "~/lib/schemas"
import { authorSchema, getErrors } from "~/lib/schemas"
import { db } from "~/server/db"
import { authors } from "~/server/db/schema"

export async function POST(request: NextRequest) {
  const data: AuthorData = await request.json()

  const errors = getErrors(authorSchema, data)
  if (errors) {
    return NextResponse.json({ errors }, { status: 400 })
  }

  try {
    await db.insert(authors).values(data)

    return NextResponse.json(null, { status: 201 })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 },
    )
  }
}
