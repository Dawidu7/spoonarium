"use client"

import { useMutation } from "@tanstack/react-query"
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
import { useTheme } from "next-themes"
import Link from "next/link"
import { redirect, usePathname } from "next/navigation"
import { useTransition } from "react"
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
import { useToast } from "../ui/use-toast"
import { cn } from "~/lib/utils"
import { signOut } from "~/server/actions"
import type { User } from "~/server/db/schema"

export default function Sidebar({ user }: { user: User | null }) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const { toast } = useToast()
  const [, startTransition] = useTransition()
  const { mutate } = useMutation({
    mutationFn: signOut,
    onSuccess: ({ success }) => {
      if (!success) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "You have successfully signed out.",
        variant: "success",
      })

      startTransition(() => {
        redirect(`/`)
      })
    },
  })

  if (!user) return null

  const tabs = [
    {
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
          {tabs.map(({ name, items }) => (
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
                        <form action={() => mutate()}>
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
          ))}
        </nav>
      </div>
      <ThemeSwitch />
    </aside>
  )
}
