/**
 * Presentation constants for the Zuschlagsrechner UI: category identity,
 * colours and labels, plus the list of selectable federal states. Runtime
 * results are produced by the calculation engine in `@/lib/surcharge`.
 */

import type { GermanState } from "@/lib/holidays";

export type CategoryKey =
  | "feiertag"
  | "sonntag"
  | "nacht"
  | "samstag"
  | "normal";

/** Categories that can carry a surcharge; "normal" is the implicit fallback. */
export type SurchargeCategory = Exclude<CategoryKey, "normal">;

/** Order the categories are shown in the result grid. */
export const CATEGORY_DISPLAY_ORDER: CategoryKey[] = [
  "feiertag",
  "sonntag",
  "nacht",
  "samstag",
  "normal",
];

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  feiertag: "Feiertag",
  sonntag: "Sonntag",
  nacht: "Nacht",
  samstag: "Samstag",
  normal: "Regulär",
};

/** Tailwind background-color utilities backed by the --cat-* CSS variables. */
export const CATEGORY_BG: Record<CategoryKey, string> = {
  feiertag: "bg-cat-feiertag",
  sonntag: "bg-cat-sonntag",
  nacht: "bg-cat-nacht",
  samstag: "bg-cat-samstag",
  normal: "bg-cat-normal",
};

/** Left-border accent utilities for the result stat cards. */
export const CATEGORY_BORDER_L: Record<CategoryKey, string> = {
  feiertag: "border-l-cat-feiertag",
  sonntag: "border-l-cat-sonntag",
  nacht: "border-l-cat-nacht",
  samstag: "border-l-cat-samstag",
  normal: "border-l-cat-normal",
};

/** Default priority when several categories overlap (highest first). */
export const INITIAL_PRIORITY: SurchargeCategory[] = [
  "feiertag",
  "sonntag",
  "nacht",
  "samstag",
];

export interface FederalStateOption {
  value: string;
  label: string;
  /** Bundesland code for the holiday calendar; `null` disables detection. */
  code: GermanState | null;
}

export const FEDERAL_STATES: FederalStateOption[] = [
  { value: "baden-wuerttemberg", label: "Baden-Württemberg", code: "BW" },
  { value: "bayern", label: "Bayern", code: "BY" },
  { value: "berlin", label: "Berlin", code: "BE" },
  { value: "brandenburg", label: "Brandenburg", code: "BB" },
  { value: "bremen", label: "Bremen", code: "HB" },
  { value: "hamburg", label: "Hamburg", code: "HH" },
  { value: "hessen", label: "Hessen", code: "HE" },
  {
    value: "mecklenburg-vorpommern",
    label: "Mecklenburg-Vorpommern",
    code: "MV",
  },
  { value: "niedersachsen", label: "Niedersachsen", code: "NI" },
  { value: "nordrhein-westfalen", label: "Nordrhein-Westfalen", code: "NW" },
  { value: "rheinland-pfalz", label: "Rheinland-Pfalz", code: "RP" },
  { value: "saarland", label: "Saarland", code: "SL" },
  { value: "sachsen", label: "Sachsen", code: "SN" },
  { value: "sachsen-anhalt", label: "Sachsen-Anhalt", code: "ST" },
  { value: "schleswig-holstein", label: "Schleswig-Holstein", code: "SH" },
  { value: "thueringen", label: "Thüringen", code: "TH" },
];

export function stateCodeFromValue(value: string): GermanState | null {
  return FEDERAL_STATES.find((state) => state.value === value)?.code ?? null;
}

/** value → label map, so the Select trigger can display the readable label. */
export const FEDERAL_STATE_ITEMS: Record<string, string> = Object.fromEntries(
  FEDERAL_STATES.map((state) => [state.value, state.label]),
);
