import * as React from "react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface HolidayItem {
  id: string
  date: string
  weekday: string
}

const HOLIDAYS: HolidayItem[] = [
  { id: "2026-07-18", date: "18.07.2026", weekday: "Samstag" },
  { id: "2026-07-19", date: "19.07.2026", weekday: "Sonntag" },
]

function HolidayRow({ item }: { item: HolidayItem }) {
  const [checked, setChecked] = React.useState(false)
  const switchId = `holiday-${item.id}`

  return (
    <div className="flex items-center gap-3 rounded-[calc(var(--radius)-2px)] border bg-background px-2.5 py-1.5">
      <div className="flex w-[170px] shrink-0 items-baseline gap-2">
        <span className="font-mono text-[13px] font-medium tabular-nums">
          {item.date}
        </span>
        <span className="text-xs text-muted-foreground">{item.weekday}</span>
      </div>
      <span
        className={
          checked
            ? "flex-1 text-xs font-medium text-foreground"
            : "flex-1 text-xs text-muted-foreground"
        }
      >
        {checked
          ? "Manuell gesetzt · Feiertag"
          : "Automatisch erkannt · kein Feiertag"}
      </span>
      <Switch
        id={switchId}
        checked={checked}
        onCheckedChange={setChecked}
        aria-label={`${item.date} als Feiertag behandeln`}
      />
    </div>
  )
}

export function HolidayOverrides() {
  return (
    <div className="mt-3 border-t pt-3">
      <Label className="mb-[7px] text-[12.5px]">
        Feiertage in diesem Zeitraum
      </Label>
      <div className="flex flex-col gap-1.5">
        {HOLIDAYS.map((item) => (
          <HolidayRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
