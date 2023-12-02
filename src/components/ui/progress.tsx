"use client"

import * as ProgressPrimitive from "@radix-ui/react-progress"
import * as React from "react"
import { cn, getPasswordStrength } from "~/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

const ProgressPassword = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  Omit<
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    "value"
  > & {
    value: string
    showText?: boolean
  }
>(({ className, value, showText, ...props }, ref) => {
  const strength = getPasswordStrength(value)
  const progress = Math.floor((strength / 5) * 100)

  function showStrength() {
    switch (strength) {
      case 0:
      case 1:
        return "bg-red-500"
      case 2:
        return "bg-amber-600"
      case 3:
        return "bg-yellow-500"
      case 4:
        return "bg-green-600"
      case 5:
        return "bg-green-400"
    }
  }

  function Text() {
    const { className, text } = React.useMemo(() => {
      switch (strength) {
        case 0:
          return { className: "text-muted-foreground", text: null }
        case 1:
          return { className: "text-red-500", text: "Very Weak" }
        case 2:
          return { className: "text-amber-600", text: "Weak" }
        case 3:
          return { className: "text-yellow-500", text: "Moderate" }
        case 4:
          return { className: "text-green-600", text: "Strong" }
        case 5:
          return { className: "text-green-400", text: "Very Strong" }
      }
    }, [])

    return <p className={cn("text-sm font-semibold", className)}>{text}</p>
  }

  return (
    <>
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-1.5 w-full overflow-hidden rounded-full bg-secondary",
          className,
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "duration-250 h-full w-full flex-1 transition-all",
            showStrength(),
          )}
          style={{ transform: `translateX(-${100 - (progress || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showText && <Text />}
    </>
  )
})
ProgressPassword.displayName = "ProgressPassword"

export { Progress, ProgressPassword }
