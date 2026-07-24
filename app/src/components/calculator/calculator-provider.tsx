import * as React from "react"

import { INITIAL_PRIORITY, stateCodeFromValue } from "@/lib/calculator-data"
import { fetchHolidays, isoDate } from "@/lib/holidays"
import {
  calculateSurcharges,
  timeStringToMinutes,
  type SurchargeInput,
} from "@/lib/surcharge"
import {
  CalculatorContext,
  type CalculatorContextValue,
  type CalculatorForm,
  type HolidayDay,
} from "@/components/calculator/calculator-context"

const HOUR_MS = 60 * 60 * 1000

function pad2(value: number): string {
  return String(value).padStart(2, "0")
}

/** Round a datetime to the nearest full hour (00 minutes). */
function roundToHour(date: Date): Date {
  const rounded = new Date(date)
  const roundUp = rounded.getMinutes() >= 30
  rounded.setMinutes(0, 0, 0)
  if (roundUp) rounded.setHours(rounded.getHours() + 1)
  return rounded
}

function dateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function timeOfDay(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

/** Default form: shift starts at the current rounded hour and lasts 9 hours. */
function createInitialForm(): CalculatorForm {
  const start = roundToHour(new Date())
  const end = new Date(start.getTime() + 9 * HOUR_MS)
  const breakStart = new Date(start.getTime() + 4 * HOUR_MS)

  return {
    shiftStartDate: dateOnly(start),
    shiftStartTime: timeOfDay(start),
    shiftEndDate: dateOnly(end),
    shiftEndTime: timeOfDay(end),
    breakMinutes: "30",
    breakStartDate: dateOnly(breakStart),
    breakStartTime: timeOfDay(breakStart),
    nightFrom: "22:00",
    nightTo: "06:00",
    stateValue: "berlin",
    priority: INITIAL_PRIORITY,
    holidayOverrides: {},
  }
}

/** Combine a calendar date with an "HH:mm" string into a full datetime. */
function combineDateTime(date: Date | undefined, time: string): Date {
  if (!date) return new Date(NaN)
  const [hours, minutes] = time.split(":").map(Number)
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours || 0,
    minutes || 0
  )
}

/** Calendar days (at midnight) spanned by the shift, inclusive. */
function datesInRange(start?: Date, end?: Date): Date[] {
  if (!start || !end) return []
  const from = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const to = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  if (to < from) return []
  const days: Date[] = []
  const cursor = new Date(from)
  // Guard against pathological ranges (e.g. a mistyped year).
  for (let i = 0; cursor <= to && i < 400; i++) {
    days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

function buildInput(
  form: CalculatorForm,
  holidays: HolidayDay[]
): SurchargeInput {
  const breakMinutes = Number(form.breakMinutes)
  const breakStart =
    Number.isFinite(breakMinutes) && breakMinutes > 0
      ? combineDateTime(form.breakStartDate, form.breakStartTime)
      : null
  const breakEnd =
    breakStart && !Number.isNaN(breakStart.getTime())
      ? new Date(breakStart.getTime() + breakMinutes * 60_000)
      : null

  const holidayDates = new Set(
    holidays.filter((day) => day.effective).map((day) => day.iso)
  )

  return {
    start: combineDateTime(form.shiftStartDate, form.shiftStartTime),
    end: combineDateTime(form.shiftEndDate, form.shiftEndTime),
    breakStart: breakStart && Number.isNaN(breakStart.getTime()) ? null : breakStart,
    breakEnd,
    nightFromMinutes: timeStringToMinutes(form.nightFrom),
    nightToMinutes: timeStringToMinutes(form.nightTo),
    priority: form.priority,
    holidayDates,
  }
}

const EMPTY_HOLIDAY_MAP = new Map<string, string>()

/** A completed Feiertage API load, tagged with the state+years it was for. */
interface FetchState {
  key: string
  map?: Map<string, string>
  error?: string
}

export function CalculatorProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [form, setForm] = React.useState<CalculatorForm>(createInitialForm)
  // Result of the most recent Feiertage API load. Tagged with its request key
  // so a stale response for a previous state/year is ignored during render.
  const [fetched, setFetched] = React.useState<FetchState | null>(null)

  const stateCode = React.useMemo(
    () => stateCodeFromValue(form.stateValue),
    [form.stateValue]
  )
  const dates = React.useMemo(
    () => datesInRange(form.shiftStartDate, form.shiftEndDate),
    [form.shiftStartDate, form.shiftEndDate]
  )
  const yearsKey = React.useMemo(
    () => [...new Set(dates.map((date) => date.getFullYear()))].join(","),
    [dates]
  )
  // Non-null only when there is something to fetch (a state and a date range).
  const requestKey = stateCode && yearsKey ? `${stateCode}:${yearsKey}` : null

  React.useEffect(() => {
    if (!stateCode || !yearsKey) return

    const key = `${stateCode}:${yearsKey}`
    let cancelled = false
    const years = yearsKey.split(",").map(Number)

    Promise.all(years.map((year) => fetchHolidays(year, stateCode)))
      .then((maps) => {
        if (cancelled) return
        const merged = new Map<string, string>()
        for (const map of maps) {
          for (const [iso, name] of map) merged.set(iso, name)
        }
        setFetched({ key, map: merged })
      })
      .catch(() => {
        if (cancelled) return
        setFetched({
          key,
          error:
            "Feiertage konnten nicht geladen werden. Bitte manuell festlegen.",
        })
      })

    return () => {
      cancelled = true
    }
  }, [stateCode, yearsKey])

  // Derive load status for the current request from the tagged fetch result,
  // so no state is set synchronously inside the effect.
  const settled = fetched?.key === requestKey ? fetched : null
  const holidayMap = settled?.map ?? EMPTY_HOLIDAY_MAP
  const holidaysError = settled?.error ?? null
  const holidaysLoading = requestKey !== null && settled === null

  const holidays = React.useMemo<HolidayDay[]>(
    () =>
      dates.map((date) => {
        const iso = isoDate(date)
        const autoName = holidayMap.get(iso) ?? null
        const autoHoliday = autoName !== null
        const override = form.holidayOverrides[iso]
        const overridden = override !== undefined
        return {
          iso,
          date,
          autoName,
          autoHoliday,
          effective: overridden ? override : autoHoliday,
          overridden,
        }
      }),
    [dates, holidayMap, form.holidayOverrides]
  )

  const outcome = React.useMemo(
    () => calculateSurcharges(buildInput(form, holidays)),
    [form, holidays]
  )

  const setField = React.useCallback(
    <K extends keyof CalculatorForm>(key: K, value: CalculatorForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const movePriority = React.useCallback((index: number, direction: -1 | 1) => {
    setForm((prev) => {
      const target = index + direction
      if (target < 0 || target >= prev.priority.length) return prev
      const priority = [...prev.priority]
      ;[priority[index], priority[target]] = [priority[target], priority[index]]
      return { ...prev, priority }
    })
  }, [])

  const reorderPriority = React.useCallback((from: number, to: number) => {
    setForm((prev) => {
      const { length } = prev.priority
      if (from === to || from < 0 || to < 0 || from >= length || to >= length) {
        return prev
      }
      const priority = [...prev.priority]
      const [moved] = priority.splice(from, 1)
      priority.splice(to, 0, moved)
      return { ...prev, priority }
    })
  }, [])

  const toggleHoliday = React.useCallback((iso: string, value: boolean) => {
    setForm((prev) => ({
      ...prev,
      holidayOverrides: { ...prev.holidayOverrides, [iso]: value },
    }))
  }, [])

  const value = React.useMemo<CalculatorContextValue>(
    () => ({
      form,
      setField,
      movePriority,
      reorderPriority,
      toggleHoliday,
      holidays,
      holidaysLoading,
      holidaysError,
      result: outcome.result,
      error: outcome.error,
    }),
    [
      form,
      setField,
      movePriority,
      reorderPriority,
      toggleHoliday,
      holidays,
      holidaysLoading,
      holidaysError,
      outcome,
    ]
  )

  return <CalculatorContext value={value}>{children}</CalculatorContext>
}
