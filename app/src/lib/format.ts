/** German-locale formatting helpers for the calculator. */

const GERMAN_WEEKDAYS_SHORT = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]

function pad2(value: number): string {
  return String(value).padStart(2, "0")
}

/** Hours as German decimal with a unit, e.g. 5.5 → "5,50 h". */
export function formatHours(hours: number): string {
  return `${hours.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} h`
}

/** Time-of-day as "HH:mm". */
export function formatTime(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

/**
 * End-of-range time. A range that ends exactly at midnight is shown as "24:00"
 * rather than "00:00" so it reads as the close of the previous day.
 */
export function formatRangeEnd(date: Date): string {
  if (date.getHours() === 0 && date.getMinutes() === 0) return "24:00"
  return formatTime(date)
}

/** Boundary label, e.g. "20:00 · Sa 18.07.2026". */
export function formatBound(date: Date): string {
  const weekday = GERMAN_WEEKDAYS_SHORT[date.getDay()]
  const day = pad2(date.getDate())
  const month = pad2(date.getMonth() + 1)
  return `${formatTime(date)} · ${weekday} ${day}.${month}.${date.getFullYear()}`
}
