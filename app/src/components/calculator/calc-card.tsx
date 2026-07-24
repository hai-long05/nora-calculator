import * as React from "react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

/**
 * Thin wrapper around the shadcn Card that applies the tighter padding,
 * radius and shadow used throughout the calculator layout.
 */
export function CalcCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "gap-0 rounded-md border px-[18px] py-3.5 shadow-xs ring-0",
        className
      )}
      {...props}
    />
  )
}
