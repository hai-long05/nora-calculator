import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { FEDERAL_STATE_ITEMS, FEDERAL_STATES } from "@/lib/calculator-data"
import { useCalculator } from "@/components/calculator/calculator-context"
import { CalcCard } from "@/components/calculator/calc-card"
import { SectionHeader } from "@/components/calculator/section-header"
import { Field } from "@/components/calculator/field"
import { DatePicker } from "@/components/calculator/date-picker"
import { TimePicker } from "@/components/calculator/time-picker"
import { HolidayOverrides } from "@/components/calculator/holiday-overrides"

export function ShiftDataCard() {
  const { form, setField } = useCalculator()

  return (
    <CalcCard>
      <SectionHeader title="Schichtdaten" />

      <div className="grid grid-cols-1 gap-x-3 gap-y-2.5 sm:grid-cols-2">
        <Field label="Schichtbeginn " required>
          <div className="flex gap-1.5">
            <div className="min-w-0 flex-1">
              <DatePicker
                value={form.shiftStartDate}
                onChange={(date) => setField("shiftStartDate", date)}
              />
            </div>
            <TimePicker
              value={form.shiftStartTime}
              onChange={(value) => setField("shiftStartTime", value)}
              aria-label="Schichtbeginn Uhrzeit"
              className="w-24 shrink-0"
            />
          </div>
        </Field>

        <Field label="Schichtende " required>
          <div className="flex gap-1.5">
            <div className="min-w-0 flex-1">
              <DatePicker
                value={form.shiftEndDate}
                onChange={(date) => setField("shiftEndDate", date)}
              />
            </div>
            <TimePicker
              value={form.shiftEndTime}
              onChange={(value) => setField("shiftEndTime", value)}
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
            value={form.breakMinutes}
            onChange={(event) => setField("breakMinutes", event.target.value)}
            className="font-mono tabular-nums"
          />
        </Field>

        <Field label="Pausenbeginn">
          <div className="flex gap-1.5">
            <div className="min-w-0 flex-1">
              <DatePicker
                value={form.breakStartDate}
                onChange={(date) => setField("breakStartDate", date)}
              />
            </div>
            <TimePicker
              value={form.breakStartTime}
              onChange={(value) => setField("breakStartTime", value)}
              aria-label="Pausenbeginn Uhrzeit"
              className="w-24 shrink-0"
            />
          </div>
        </Field>

        <Field label="Nachtzuschlag-Zeitfenster " required>
          <div className="flex gap-1.5">
            <TimePicker
              value={form.nightFrom}
              onChange={(value) => setField("nightFrom", value)}
              aria-label="Nachtzuschlag von"
            />
            <TimePicker
              value={form.nightTo}
              onChange={(value) => setField("nightTo", value)}
              aria-label="Nachtzuschlag bis"
            />
          </div>
        </Field>

        <Field label="Bundesland" htmlFor="federal-state">
          <Select
            items={FEDERAL_STATE_ITEMS}
            value={form.stateValue}
            onValueChange={(value) => setField("stateValue", value ?? "none")}
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
