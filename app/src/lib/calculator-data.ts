/**
 * Static domain data and type definitions for the Zuschlagsrechner UI.
 * This file intentionally contains no calculation logic — it only describes
 * the shape of the data and provides the placeholder values shown in the design.
 */

export type CategoryKey = "feiertag" | "sonntag" | "nacht" | "samstag" | "normal"

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  feiertag: "Feiertag",
  sonntag: "Sonntag",
  nacht: "Nacht",
  samstag: "Samstag",
  normal: "Normal",
}

/** Tailwind background-color utilities backed by the --cat-* CSS variables. */
export const CATEGORY_BG: Record<CategoryKey, string> = {
  feiertag: "bg-cat-feiertag",
  sonntag: "bg-cat-sonntag",
  nacht: "bg-cat-nacht",
  samstag: "bg-cat-samstag",
  normal: "bg-cat-normal",
}

/** Left-border accent utilities for the result stat cards. */
export const CATEGORY_BORDER_L: Record<CategoryKey, string> = {
  feiertag: "border-l-cat-feiertag",
  sonntag: "border-l-cat-sonntag",
  nacht: "border-l-cat-nacht",
  samstag: "border-l-cat-samstag",
  normal: "border-l-cat-normal",
}

/** A single entry in the surcharge priority list. */
export interface PriorityEntry {
  category: Exclude<CategoryKey, "normal">
}

export const INITIAL_PRIORITY: PriorityEntry[] = [
  { category: "feiertag" },
  { category: "sonntag" },
  { category: "nacht" },
  { category: "samstag" },
]

/** A calculated result value for one category. */
export interface ResultStat {
  category: CategoryKey
  /** Pre-formatted hours value, e.g. "5,50 h". */
  value: string
  /** Optional pre-formatted time range, e.g. "00:30–06:00". */
  range?: string
}

export const RESULT_STATS: ResultStat[] = [
  { category: "feiertag", value: "0,00 h" },
  { category: "sonntag", value: "5,50 h", range: "00:30–06:00" },
  { category: "nacht", value: "2,00 h", range: "22:00–24:00" },
  { category: "samstag", value: "2,00 h", range: "20:00–22:00" },
  { category: "normal", value: "0,00 h" },
]

/** A single segment of the shift timeline bar. */
export interface TimelineSegment {
  category: CategoryKey
  /** Width as a percentage of the whole shift. */
  width: number
  /** When true, renders a hatched "break" pattern instead of a solid fill. */
  pause?: boolean
}

export const TIMELINE_SEGMENTS: TimelineSegment[] = [
  { category: "samstag", width: 20 },
  { category: "nacht", width: 20 },
  { category: "normal", width: 5, pause: true },
  { category: "sonntag", width: 55 },
]

export const TIMELINE_BOUNDS = {
  start: "20:00 · Sa 18.07.2026",
  end: "06:00 · So 19.07.2026",
}

export const TOTAL_HOURS = "9,50 h"

export interface FederalState {
  value: string
  label: string
}

export const FEDERAL_STATES: FederalState[] = [
  { value: "brandenburg", label: "Brandenburg" },
  { value: "bayern", label: "Bayern" },
  { value: "berlin", label: "Berlin" },
  { value: "none", label: "— ohne Auswahl —" },
]
