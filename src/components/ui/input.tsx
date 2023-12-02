"use client"

import { Eye, EyeOff } from "lucide-react"
import * as React from "react"
import {
  FlagImage,
  defaultCountries,
  guessCountryByPartialPhoneNumber,
  usePhoneInput,
} from "react-international-phone"
import { Button } from "./button"
import { cn } from "~/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, ...props }, ref) => {
    const [isPasswordShown, setShowPassword] = React.useState(false)

    return type !== "password" ? (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        value={value}
        {...props}
      />
    ) : (
      <div className="relative flex items-center">
        <input
          type={isPasswordShown ? "text" : "password"}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          className="absolute right-0 px-2"
          onClick={() => setShowPassword(p => !p)}
        >
          {isPasswordShown ? <EyeOff /> : <Eye />}
        </Button>
      </div>
    )
  },
)
Input.displayName = "Input"

const InputPhone = React.forwardRef<
  HTMLInputElement,
  InputProps & { onChange?: (value: string) => void }
>(({ className, value, onChange, ...props }, ref) => {
  const { country, inputValue, handlePhoneValueChange, phone } = usePhoneInput({
    countries: defaultCountries,
    onChange: ({ phone }) => {
      if (typeof onChange === "function") onChange(phone)
    },
    disableDialCodePrefill: true,
  })

  const isCorrectDialCode = guessCountryByPartialPhoneNumber({
    phone,
  }).fullDialCodeMatch

  return (
    <div className="relative flex items-center">
      {isCorrectDialCode && (
        <FlagImage iso2={country.iso2} className="absolute ml-2 max-w-[2rem]" />
      )}
      <Input
        ref={ref}
        {...props}
        value={inputValue}
        onChange={handlePhoneValueChange}
        className={cn(
          "transition-[padding-left]",
          isCorrectDialCode && "pl-12",
        )}
      />
    </div>
  )
})
InputPhone.displayName = "InputPhone"

export { Input, InputPhone }
