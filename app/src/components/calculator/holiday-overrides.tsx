import { format } from "date-fns"
import { de } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useCalculator } from "@/components/calculator/calculator-context"
import type { HolidayDay } from "@/components/calculator/calculator-context"

function statusText(day: HolidayDay): string {
  const source = day.overridden ? "Manuell gesetzt" : "Automatisch erkannt"
  if (day.effective) {
    const name = day.overridden ? "Feiertag" : (day.autoName ?? "Feiertag")
    return `${source} · ${name}`
  }
  return `${source} · kein Feiertag`
}

function HolidayRow({ day }: { day: HolidayDay }) {
  const { toggleHoliday } = useCalculator()
  const switchId = `holiday-${day.iso}`

  return (
    <div className="flex items-center gap-3 rounded-[calc(var(--radius)-2px)] border bg-background px-2.5 py-1.5">
      <div className="flex w-42.5 shrink-0 items-baseline gap-2">
        <span className="font-mono text-[13px] font-medium tabular-nums">
          {format(day.date, "dd.MM.yyyy", { locale: de })}
        </span>
        <span className="text-xs text-muted-foreground capitalize">
          {format(day.date, "EEEE", { locale: de })}
        </span>
      </div>
      <span
        className={
          day.effective
            ? "flex-1 text-xs font-medium text-foreground"
            : "flex-1 text-xs text-muted-foreground"
        }
      >
        {statusText(day)}
      </span>
      <Switch
        id={switchId}
        checked={day.effective}
        onCheckedChange={(checked) => toggleHoliday(day.iso, checked)}
        aria-label={`${format(day.date, "dd.MM.yyyy")} als Feiertag behandeln`}
      />
    </div>
  )
}

export function HolidayOverrides() {
  const { holidays, holidaysLoading, holidaysError } = useCalculator()

  return (
    <div className="mt-3 border-t pt-3">
      <Label className="mb-1.75 flex items-center gap-2 text-[12.5px]">
        Feiertage in diesem Zeitraum
        {holidaysLoading ? (
          <span className="text-[11px] font-normal text-muted-foreground">
            wird geladen …
          </span>
        ) : null}
      </Label>
      {holidaysError ? (
        <p className="mb-1.5 text-[11px] text-destructive">{holidaysError}</p>
      ) : null}
      {holidays.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Bitte einen gültigen Schichtzeitraum wählen.
        </p>
      ) : (
        <div
          className={cn(
            "flex flex-col gap-1.5",
            // Show ~2 rows and scroll the rest when a shift spans many days.
            holidays.length > 2 &&
              "scrollbar-app max-h-21 overflow-y-auto pr-1"
          )}
        >
          {holidays.map((day) => (
            <HolidayRow key={day.iso} day={day} />
          ))}
        </div>
      )}
    </div>
  )
}
