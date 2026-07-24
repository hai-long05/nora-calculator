import { CalculatorHeader } from "@/components/calculator/calculator-header"
import { ShiftDataCard } from "@/components/calculator/shift-data-card"
import { PriorityCard } from "@/components/calculator/priority-card"
import { ResultCard } from "@/components/calculator/result-card"

export function CalculatorPage() {
  return (
    <div className="flex min-h-svh flex-col justify-center px-4 pt-[18px] pb-8">
      <div className="mx-auto w-full max-w-[820px]">
        <CalculatorHeader />

        <div className="flex flex-col gap-2.5">
          <ShiftDataCard />
          <PriorityCard />
          <ResultCard />
        </div>

        <footer className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
          <span>Zuschlagsrechner</span>
          <span className="font-mono tabular-nums">Beleg 2607-0042</span>
        </footer>
      </div>
    </div>
  )
}
