import { cn } from "~/lib/utils"

type SpinnerProps = {
  className?: string
  lineCount?: number
}

export function Spinner({ className, lineCount = 8 }: SpinnerProps) {
  return (
    <div
      className={cn(
        "relative grid aspect-square h-3/4 place-items-center",
        className,
      )}
    >
      {Array.from({ length: lineCount }).map((_, i) => {
        const angle = Math.floor((360 / lineCount) * i)
        const duration = 1

        return (
          <div
            key={i}
            className="animate-spinner bg-spinner absolute h-1/3 w-0.5 rounded-full"
            style={{
              transform: `rotate(${angle}deg) translateY(-100%)`,
              animationDuration: `${duration}s`,
              animationDelay: `${(duration / lineCount) * i}s`,
            }}
          />
        )
      })}
    </div>
  )
}
