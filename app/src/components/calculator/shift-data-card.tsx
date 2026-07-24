import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { FEDERAL_STATES } from "@/lib/calculator-data"
import { CalcCard } from "@/components/calculator/calc-card"
import { SectionHeader } from "@/components/calculator/section-header"
import { Field } from "@/components/calculator/field"
import { DatePicker } from "@/components/calculator/date-picker"
import { TimePicker } from "@/components/calculator/time-picker"
import { HolidayOverrides } from "@/components/calculator/holiday-overrides"

export function ShiftDataCard() {
  const [shiftStartDate, setShiftStartDate] = React.useState<Date | undefined>(
    new Date(2026, 6, 18)
  )
  const [shiftStartTime, setShiftStartTime] = React.useState("20:00")
  const [shiftEndDate, setShiftEndDate] = React.useState<Date | undefined>(
    new Date(2026, 6, 19)
  )
  const [shiftEndTime, setShiftEndTime] = React.useState("06:00")
  const [breakMinutes, setBreakMinutes] = React.useState("30")
  const [breakStartDate, setBreakStartDate] = React.useState<Date | undefined>(
    new Date(2026, 6, 19)
  )
  const [breakStartTime, setBreakStartTime] = React.useState("00:00")
  const [nightFrom, setNightFrom] = React.useState("22:00")
  const [nightTo, setNightTo] = React.useState("06:00")
  const [state, setState] = React.useState("brandenburg")

  return (
    <CalcCard>
      <SectionHeader title="Schichtdaten" />

      <div className="grid grid-cols-1 gap-x-3 gap-y-2.5 sm:grid-cols-2">
        <Field label="Schichtbeginn " required>
          <div className="flex gap-1.5">
            <div className="min-w-0 flex-1">
              <DatePicker value={shiftStartDate} onChange={setShiftStartDate} />
            </div>
            <TimePicker
              value={shiftStartTime}
              onChange={setShiftStartTime}
              aria-label="Schichtbeginn Uhrzeit"
              className="w-24 shrink-0"
            />
          </div>
        </Field>

        <Field label="Schichtende " required>
          <div className="flex gap-1.5">
            <div className="min-w-0 flex-1">
              <DatePicker value={shiftEndDate} onChange={setShiftEndDate} />
            </div>
            <TimePicker
              value={shiftEndTime}
              onChange={setShiftEndTime}
              aria-label="Schichtende Uhrzeit"
              className="w-24 shrink-0"
            />
          </div>
        </Field>

        <Field label="Pausendauer (Minuten) " required htmlFor="break-minutes">
          <Input
            id="break-minutes"
            type="number"
            inputMode="numeric"
            min={0}
            value={breakMinutes}
            onChange={(event) => setBreakMinutes(event.target.value)}
            className="font-mono tabular-nums"
          />
        </Field>

        <Field label="Pausenbeginn">
          <div className="flex gap-1.5">
            <div className="min-w-0 flex-1">
              <DatePicker value={breakStartDate} onChange={setBreakStartDate} />
            </div>
            <TimePicker
              value={breakStartTime}
              onChange={setBreakStartTime}
              aria-label="Pausenbeginn Uhrzeit"
              className="w-24 shrink-0"
            />
          </div>
        </Field>

        <Field label="Nachtzuschlag-Zeitfenster " required>
          <div className="flex gap-1.5">
            <TimePicker
              value={nightFrom}
              onChange={setNightFrom}
              aria-label="Nachtzuschlag von"
            />
            <TimePicker
              value={nightTo}
              onChange={setNightTo}
              aria-label="Nachtzuschlag bis"
            />
          </div>
        </Field>

        <Field label="Bundesland" htmlFor="federal-state">
          <Select
            value={state}
            onValueChange={(value) => setState(value ?? "")}
          >
            <SelectTrigger id="federal-state" className="w-full">
              <SelectValue placeholder="Bundesland wählen" />
            </SelectTrigger>
            <SelectContent>
              {FEDERAL_STATES.map((fs) => (
                <SelectItem key={fs.value} value={fs.value}>
                  {fs.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <HolidayOverrides />
    </CalcCard>
  )
}
