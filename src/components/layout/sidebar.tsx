"use client"

import {
  BookOpenText,
  BookUser,
  CircleUserRound,
  Library,
  LogOut,
  Settings,
  TableProperties,
  Users,
} from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { ThemeSwitch } from "../ui/switch"
import type { User } from "~/server/db/schema"

export default function Sidebar({ user }: { user: User | null }) {
  if (!user) return null

  const tabs = [
    {
      isHidden: !user.isStaff,
      name: "staff",
      items: [
        { name: "authors", icon: BookUser },
        { name: "books", icon: Library },
        { name: "users", icon: Users },
      ],
    },
    {
      name: "overview",
      items: [{ name: "dashboard", icon: TableProperties }],
    },
    {
      name: "profile",
      items: [
        { name: "profile", icon: CircleUserRound },
        { name: "settings", icon: Settings },
      ],
    },
  ]

  return (
    <aside className="flex min-h-screen flex-col justify-between border-r px-4 pb-8 pt-2">
      <div className="space-y-16">
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
        <nav className="mt-12 space-y-16">
          {tabs.map(
            ({ name, items, isHidden }) =>
              !isHidden && (
                <div key={name}>
                  <Label
                    htmlFor={name}
                    className="text-xs uppercase text-muted-foreground"
                  >
                    {name}
                  </Label>
                  <ul id={name} className="space-y-2">
                    {items.map(({ name, icon: Icon }) => (
                      <li key={name}>
                        <Button
                          asChild
                          variant="ghost"
                          className="flex items-center justify-start gap-2 px-1.5 capitalize"
                        >
                          <Link href={`/${name}`}>
                            <Icon />
                            {name}
                          </Link>
                        </Button>
                      </li>
                    ))}
                    {name === "profile" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex w-full items-center justify-start gap-2 px-1.5"
                          >
                            <LogOut />
                            <span>Logout</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Sign Out</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to sign out?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <form action="/api/auth/sign-out" method="POST">
                              <AlertDialogAction asChild>
                                <Button type="submit">Sign Out</Button>
                              </AlertDialogAction>
                            </form>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </ul>
                </div>
              ),
          )}
        </nav>
      </div>
      <ThemeSwitch />
    </aside>
  )
}
