import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface TimePickerProps {
  value?: string
  onChange?: (value: string) => void
  id?: string
  className?: string
  "aria-label"?: string
}

/**
 * A native time picker styled to match the design. Uses `<input type="time">`
 * so the browser provides the clock/stepper UI without extra dependencies.
 */
export function TimePicker({
  value,
  onChange,
  id,
  className,
  "aria-label": ariaLabel,
}: TimePickerProps) {
  return (
    <Input
      id={id}
      type="time"
      aria-label={ariaLabel}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      className={cn(
        "font-mono tabular-nums [&::-webkit-calendar-picker-indicator]:opacity-60",
        className
      )}
    />
  )
}
