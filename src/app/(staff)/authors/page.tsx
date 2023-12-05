"use client"

import { valibotResolver } from "@hookform/resolvers/valibot"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import type { AxiosError, AxiosResponse } from "axios"
import { useForm } from "react-hook-form"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Spinner } from "~/components/ui/spinner"
import { useToast } from "~/components/ui/use-toast"
import { authorSchema } from "~/lib/schemas"
import type { AuthorData } from "~/lib/schemas"
import { revalidate } from "~/server/actions"

const defaultValues = {
  name: "",
}

export default function Authors() {
  const { toast } = useToast()
  const form = useForm({
    defaultValues,
    resolver: valibotResolver(authorSchema),
  })
  const { isPending, mutate } = useMutation<
    AxiosResponse,
    AxiosError<{
      errors?: Record<keyof typeof defaultValues, string | null>
    }>,
    AuthorData
  >({
    mutationFn: data => axios.post("/api/authors", data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Author successfully added.",
        variant: "success",
      })

      revalidate("/authors")
    },
    onError: error => {
      if (!error.response) return

      if (error.response.status === 500) {
        toast({
          title: "Error",
          description: "Something went wrong.",
          variant: "destructive",
        })
      }

      const errors = error.response.data.errors

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
    <Card>
      <CardHeader>
        <CardTitle>Add Authors</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(data => mutate(data))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                Add Author
              </>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
