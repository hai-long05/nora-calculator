import { cn } from "@/lib/utils"
import {
  CATEGORY_BG,
  CATEGORY_BORDER_L,
  CATEGORY_LABELS,
  RESULT_STATS,
  TOTAL_HOURS,
  type ResultStat,
} from "@/lib/calculator-data"
import { CalcCard } from "@/components/calculator/calc-card"
import { SectionHeader } from "@/components/calculator/section-header"
import { ShiftTimeline } from "@/components/calculator/shift-timeline"

function StatTile({ stat }: { stat: ResultStat }) {
  return (
    <div
      className={cn(
        "rounded-[calc(var(--radius)-2px)] border border-l-[3px] bg-background px-2.5 py-2",
        CATEGORY_BORDER_L[stat.category]
      )}
    >
      <div className="mb-1.5 flex items-center gap-1.5 text-[10.5px] font-semibold tracking-wide text-muted-foreground uppercase">
        <span
          className={cn("size-1.5 rounded-full", CATEGORY_BG[stat.category])}
        />
        {CATEGORY_LABELS[stat.category]}
      </div>
      <div className="font-mono text-[17px] leading-none font-semibold tabular-nums">
        {stat.value}
      </div>
      {stat.range ? (
        <div className="mt-1 font-mono text-[10.5px] text-muted-foreground tabular-nums">
          {stat.range}
        </div>
      ) : null}
    </div>
  )
}

export function ResultCard() {
  return (
    <CalcCard>
      <SectionHeader title="Ergebnis" hint="netto, nach Pausenabzug" />

      <div className="mb-2.5 grid grid-cols-2 gap-1.5 sm:grid-cols-5">
        {RESULT_STATS.map((stat) => (
          <StatTile key={stat.category} stat={stat} />
        ))}
      </div>

      <ShiftTimeline />

      <div className="mt-2.5 flex items-center justify-between rounded-[calc(var(--radius)-2px)] border border-primary bg-accent px-3.5 py-2.5">
        <span className="text-[12.5px] font-semibold text-foreground">
          Gesamt
        </span>
        <span className="font-mono text-[21px] font-bold text-primary tabular-nums">
          {TOTAL_HOURS}
        </span>
      </div>
    </CalcCard>
  )
}
