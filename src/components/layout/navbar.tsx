"use client"

import { BookOpenText } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { ThemeSwitch } from "../ui/switch"
import type { User } from "~/server/db/schema"

export default function Navbar({ user }: { user: User | null }) {
  if (user) return null

  return (
    <header className="mb-8 border-b py-4">
      <div className="container flex items-center justify-between">
        <Button
          asChild
          variant="ghost"
          className="gap-2 text-2xl font-semibold"
        >
          <Link href="/">
            <BookOpenText />
            Spoonarium
          </Link>
        </Button>
        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <ThemeSwitch />
            </li>
            <li>
              <Button asChild variant="ghost">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="primary">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
