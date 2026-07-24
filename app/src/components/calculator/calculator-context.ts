import * as React from "react"

import type { SurchargeCategory } from "@/lib/calculator-data"
import type { SurchargeResult } from "@/lib/surcharge"

export interface CalculatorForm {
  shiftStartDate?: Date
  shiftStartTime: string
  shiftEndDate?: Date
  shiftEndTime: string
  breakMinutes: string
  breakStartDate?: Date
  breakStartTime: string
  nightFrom: string
  nightTo: string
  stateValue: string
  priority: SurchargeCategory[]
  /** ISO date → manual holiday decision, overriding automatic detection. */
  holidayOverrides: Record<string, boolean>
}

/** One calendar day spanned by the shift, for the holiday-override list. */
export interface HolidayDay {
  iso: string
  date: Date
  autoName: string | null
  autoHoliday: boolean
  effective: boolean
  overridden: boolean
}

export interface CalculatorContextValue {
  form: CalculatorForm
  setField: <K extends keyof CalculatorForm>(
    key: K,
    value: CalculatorForm[K]
  ) => void
  movePriority: (index: number, direction: -1 | 1) => void
  reorderPriority: (from: number, to: number) => void
  toggleHoliday: (iso: string, value: boolean) => void
  holidays: HolidayDay[]
  holidaysLoading: boolean
  holidaysError: string | null
  result: SurchargeResult | null
  error: string | null
}

export const CalculatorContext =
  React.createContext<CalculatorContextValue | null>(null)

export function useCalculator(): CalculatorContextValue {
  const ctx = React.use(CalculatorContext)
  if (!ctx)
    throw new Error("useCalculator must be used within a CalculatorProvider")
  return ctx
}
