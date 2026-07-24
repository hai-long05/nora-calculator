import * as React from "react"

import { Label } from "@/components/ui/label"

interface FieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}

export function Field({ label, htmlFor, required, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={htmlFor} className="text-[12.5px]">
        {label}
        {required ? <span className="text-destructive">*</span> : null}
      </Label>
      {children}
      {hint ? (
        <span className="text-[11px] text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  )
}
