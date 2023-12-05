"use client"

import { valibotResolver } from "@hookform/resolvers/valibot"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input, InputPhone } from "~/components/ui/input"
import { ProgressPassword } from "~/components/ui/progress"
import { Spinner } from "~/components/ui/spinner"
import { useToast } from "~/components/ui/use-toast"
import { signUpSchema } from "~/lib/schemas"
import type { SignUpData } from "~/lib/schemas"
import { signUp } from "~/server/actions"

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  passwordConfirm: "",
}

export default function SignUp() {
  const { toast } = useToast()
  const [, startTransition] = useTransition()
  const form = useForm({
    defaultValues,
    resolver: valibotResolver(signUpSchema),
  })
  const { isPending, mutate } = useMutation({
    mutationFn: signUp,
    onSuccess: data => {
      if (!data.success) {
        Object.entries(data.errors!).forEach(([key, message]) => {
          if (!message) return

          form.setError(key as keyof typeof defaultValues, { message })
        })
        return
      }

      toast({
        title: "Signed Up",
        description: "You have successfully signed up.",
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

  function onSubmit(data: SignUpData) {
    if (data.password !== data.passwordConfirm) {
      form.setError("passwordConfirm", { message: "Passwords do not match." })
      return
    }

    mutate(data)
  }

  return (
    <Card className="mx-auto max-w-xs">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          Create your free <b>spoonarium</b> account!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <InputPhone
                      {...field}
                      // @ts-ignore onChange type mismatch
                      onChange={(value: string) => field.onChange(value)}
                    />
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
                  <FormLabel required>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <ProgressPassword value={field.value} showText />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Password Confirm</FormLabel>
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
              Already have an account?{" "}
              <Button asChild variant="link" className="p-0">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </FormDescription>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
