/**
 * German public-holiday lookup via the bundesAPI Feiertage API.
 * @see https://github.com/bundesAPI/feiertage-api
 *
 * The endpoint returns, for a given year and Bundesland, every public holiday
 * valid there (including nationwide ones):
 *   { "Neujahrstag": { "datum": "2026-01-01", "hinweis": "" }, ... }
 *
 * Results are cached per year+state (the calendar never changes retroactively),
 * so repeated lookups during editing hit the network at most once.
 */

export type GermanState =
  | "BW"
  | "BY"
  | "BE"
  | "BB"
  | "HB"
  | "HH"
  | "HE"
  | "MV"
  | "NI"
  | "NW"
  | "RP"
  | "SL"
  | "SN"
  | "ST"
  | "SH"
  | "TH"

const API_BASE = "https://feiertage-api.de/api/"

interface FeiertageApiEntry {
  datum: string
  hinweis: string
}

type FeiertageApiResponse = Record<string, FeiertageApiEntry>

function pad2(value: number): string {
  return String(value).padStart(2, "0")
}

/** Local (not UTC) ISO date key, e.g. "2026-07-18". */
export function isoDate(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

const cache = new Map<string, Promise<Map<string, string>>>()

async function requestHolidays(
  year: number,
  state: GermanState
): Promise<Map<string, string>> {
  const url = `${API_BASE}?jahr=${year}&nur_land=${state}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Feiertage API request failed with status ${response.status}`)
  }
  const data = (await response.json()) as FeiertageApiResponse
  const holidays = new Map<string, string>()
  for (const [name, entry] of Object.entries(data)) {
    if (entry?.datum) holidays.set(entry.datum, name)
  }
  return holidays
}

/**
 * Map of ISO date → holiday name for a year and state, cached across calls.
 * A failed request is not cached, so it can be retried on the next lookup.
 */
export function fetchHolidays(
  year: number,
  state: GermanState
): Promise<Map<string, string>> {
  const key = `${year}:${state}`
  const cached = cache.get(key)
  if (cached) return cached

  const request = requestHolidays(year, state).catch((error) => {
    cache.delete(key)
    throw error
  })
  cache.set(key, request)
  return request
}
