"use client"

import { valibotResolver } from "@hookform/resolvers/valibot"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Spinner } from "~/components/ui/spinner"
import { useToast } from "~/components/ui/use-toast"
import { signInSchema } from "~/lib/schemas"
import { signIn } from "~/server/actions"

const defaultValues = {
  login: "",
  password: "",
}

export default function SignUp() {
  const { toast } = useToast()
  const [, startTransition] = useTransition()
  const form = useForm({
    defaultValues,
    resolver: valibotResolver(signInSchema),
  })
  const { isPending, mutate } = useMutation({
    mutationFn: signIn,
    onSuccess: data => {
      if (!data.success) {
        Object.entries(data.errors!).forEach(([key, message]) => {
          if (!message) return

          form.setError(key as keyof typeof defaultValues, { message })
        })
        return
      }

      toast({
        title: "Signed In",
        description: "You have successfully signed in.",
        variant: "success",
      })

      startTransition(() => {
        redirect(`/`)
      })
    },
    onError: error => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  return (
    <Card className="mx-auto w-full max-w-xs">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(data => mutate(data))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isPending}
            >
              <>
                {isPending && <Spinner className="mr-2" />}
                Create Account
              </>
            </Button>
            <FormDescription className="text-center">
              Don{"'"}t have an account?{" "}
              <Button asChild variant="link" className="p-0">
                <Link href="/sign-in">Sign Up</Link>
              </Button>
            </FormDescription>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
