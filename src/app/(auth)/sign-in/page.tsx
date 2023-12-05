"use client"

import { valibotResolver } from "@hookform/resolvers/valibot"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import type { AxiosError, AxiosResponse } from "axios"
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
import type { SignInData } from "~/lib/schemas"
import { revalidate } from "~/server/actions"

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
  const { isPending, mutate } = useMutation<
    AxiosResponse,
    AxiosError<{
      errors?: Record<keyof typeof defaultValues, string | null>
    }>,
    SignInData
  >({
    mutationFn: data => axios.post("/api/auth/sign-in", data),
    onSuccess: () => {
      toast({
        title: "Signed In",
        description: "You have successfully signed in.",
        variant: "success",
      })

      startTransition(() => {
        revalidate("/")
        redirect("/")
      })
    },
    onError: error => {
      if (!error.response) return

      if (error.response.status === 401) {
        toast({
          title: "Error",
          description: "Invalid credentials",
          variant: "destructive",
        })
        return
      }

      if (error.response.status === 500) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
        return
      }

      const errors = error.response?.data.errors

      if (!errors) return

      Object.entries(errors).forEach(([key, value]) => {
        if (!value) return

        form.setError(key as keyof typeof defaultValues, {
          message: value,
        })
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
