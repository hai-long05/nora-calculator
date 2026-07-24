/**
 * Surcharge calculation engine.
 *
 * The shift is split at every boundary where category membership can change
 * (midnights, night-window edges, break edges). Each atomic segment is assigned
 * to exactly one category — the highest-priority category whose predicate holds
 * for that segment — or to "Normal" when none apply. Break time is excluded from
 * the net category totals but retained as a "pause" segment for the timeline.
 */

import type { CategoryKey, SurchargeCategory } from "@/lib/calculator-data"
import { CATEGORY_DISPLAY_ORDER } from "@/lib/calculator-data"
import { isoDate } from "@/lib/holidays"
import { formatBound, formatRangeEnd, formatTime } from "@/lib/format"

export interface SurchargeInput {
  start: Date
  end: Date
  breakStart: Date | null
  breakEnd: Date | null
  /** Night window bounds as minutes from midnight [0, 1440). */
  nightFromMinutes: number
  nightToMinutes: number
  /** Priority order (highest first); "normal" is always the implicit fallback. */
  priority: SurchargeCategory[]
  /** ISO dates (local) that count as public holidays for this shift. */
  holidayDates: Set<string>
}

export interface CategoryResult {
  category: CategoryKey
  minutes: number
  hours: number
  /** Overall span this category covers, or `null` when it has no time. */
  range: { start: string; end: string } | null
}

export interface TimelineSegment {
  kind: "category" | "pause"
  category?: CategoryKey
  minutes: number
  widthPercent: number
}

export interface SurchargeResult {
  categories: CategoryResult[]
  timeline: TimelineSegment[]
  totalMinutes: number
  totalHours: number
  bounds: { start: string; end: string }
}

export interface CalculationOutcome {
  result: SurchargeResult | null
  error: string | null
}

const MS_PER_MINUTE = 60_000

export function timeStringToMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number)
  return (hours || 0) * 60 + (minutes || 0)
}

/** Whether the moment falls inside the (possibly midnight-crossing) night window. */
function isNight(moment: Date, fromMinutes: number, toMinutes: number): boolean {
  if (fromMinutes === toMinutes) return false
  const tod = moment.getHours() * 60 + moment.getMinutes()
  if (fromMinutes < toMinutes) return tod >= fromMinutes && tod < toMinutes
  return tod >= fromMinutes || tod < toMinutes
}

function matchesCategory(
  category: SurchargeCategory,
  moment: Date,
  input: SurchargeInput
): boolean {
  switch (category) {
    case "feiertag":
      return input.holidayDates.has(isoDate(moment))
    case "sonntag":
      return moment.getDay() === 0
    case "nacht":
      return isNight(moment, input.nightFromMinutes, input.nightToMinutes)
    case "samstag":
      return moment.getDay() === 6
  }
}

function winningCategory(moment: Date, input: SurchargeInput): CategoryKey {
  for (const category of input.priority) {
    if (matchesCategory(category, moment, input)) return category
  }
  return "normal"
}

/** All timestamps (ms) where category membership can change, within the shift. */
function collectBoundaries(input: SurchargeInput): number[] {
  const startMs = input.start.getTime()
  const endMs = input.end.getTime()
  const boundaries = new Set<number>([startMs, endMs])

  const add = (ms: number) => {
    if (ms > startMs && ms < endMs) boundaries.add(ms)
  }

  const day = new Date(
    input.start.getFullYear(),
    input.start.getMonth(),
    input.start.getDate()
  )
  while (day.getTime() <= endMs) {
    add(day.getTime())
    add(day.getTime() + input.nightFromMinutes * MS_PER_MINUTE)
    add(day.getTime() + input.nightToMinutes * MS_PER_MINUTE)
    day.setDate(day.getDate() + 1)
  }

  if (input.breakStart && input.breakEnd) {
    add(input.breakStart.getTime())
    add(input.breakEnd.getTime())
  }

  return [...boundaries].sort((a, b) => a - b)
}

interface RawSegment {
  kind: "category" | "pause"
  category?: CategoryKey
  startMs: number
  endMs: number
}

export function calculateSurcharges(input: SurchargeInput): CalculationOutcome {
  if (
    Number.isNaN(input.start.getTime()) ||
    Number.isNaN(input.end.getTime())
  ) {
    return { result: null, error: "Bitte Schichtbeginn und Schichtende angeben." }
  }
  if (input.end.getTime() <= input.start.getTime()) {
    return {
      result: null,
      error: "Das Schichtende muss nach dem Schichtbeginn liegen.",
    }
  }

  const breakStartMs = input.breakStart?.getTime() ?? null
  const breakEndMs = input.breakEnd?.getTime() ?? null
  const hasBreak =
    breakStartMs !== null && breakEndMs !== null && breakEndMs > breakStartMs

  const boundaries = collectBoundaries(input)
  const rawSegments: RawSegment[] = []

  for (let i = 0; i < boundaries.length - 1; i++) {
    const startMs = boundaries[i]
    const endMs = boundaries[i + 1]
    if (endMs <= startMs) continue
    const midMs = (startMs + endMs) / 2

    const inBreak =
      hasBreak && midMs >= breakStartMs! && midMs < breakEndMs!

    if (inBreak) {
      rawSegments.push({ kind: "pause", startMs, endMs })
    } else {
      rawSegments.push({
        kind: "category",
        category: winningCategory(new Date(midMs), input),
        startMs,
        endMs,
      })
    }
  }

  // Net totals + covered ranges per category.
  const minutesByCategory = new Map<CategoryKey, number>()
  const rangeByCategory = new Map<CategoryKey, { start: Date; end: Date }>()

  for (const segment of rawSegments) {
    if (segment.kind !== "category" || !segment.category) continue
    const minutes = (segment.endMs - segment.startMs) / MS_PER_MINUTE
    minutesByCategory.set(
      segment.category,
      (minutesByCategory.get(segment.category) ?? 0) + minutes
    )
    const existing = rangeByCategory.get(segment.category)
    const start = new Date(segment.startMs)
    const end = new Date(segment.endMs)
    if (!existing) {
      rangeByCategory.set(segment.category, { start, end })
    } else {
      if (segment.startMs < existing.start.getTime()) existing.start = start
      if (segment.endMs > existing.end.getTime()) existing.end = end
    }
  }

  const categories: CategoryResult[] = CATEGORY_DISPLAY_ORDER.map((category) => {
    const minutes = minutesByCategory.get(category) ?? 0
    const range = rangeByCategory.get(category)
    return {
      category,
      minutes,
      hours: minutes / 60,
      range: range
        ? { start: formatTime(range.start), end: formatRangeEnd(range.end) }
        : null,
    }
  })

  const totalMinutes = categories.reduce((sum, c) => sum + c.minutes, 0)
  const grossMinutes =
    (input.end.getTime() - input.start.getTime()) / MS_PER_MINUTE

  // Merge adjacent raw segments of the same kind/category for the timeline.
  const timeline: TimelineSegment[] = []
  for (const segment of rawSegments) {
    const minutes = (segment.endMs - segment.startMs) / MS_PER_MINUTE
    const previous = timeline[timeline.length - 1]
    if (
      previous &&
      previous.kind === segment.kind &&
      previous.category === segment.category
    ) {
      previous.minutes += minutes
    } else {
      timeline.push({
        kind: segment.kind,
        category: segment.category,
        minutes,
        widthPercent: 0,
      })
    }
  }
  for (const segment of timeline) {
    segment.widthPercent = grossMinutes > 0 ? (segment.minutes / grossMinutes) * 100 : 0
  }

  return {
    result: {
      categories,
      timeline,
      totalMinutes,
      totalHours: totalMinutes / 60,
      bounds: {
        start: formatBound(input.start),
        end: formatBound(input.end),
      },
    },
    error: null,
  }
}
