import { CalculatorProvider } from "@/components/calculator/calculator-provider";
import { CalculatorHeader } from "@/components/calculator/calculator-header";
import { ShiftDataCard } from "@/components/calculator/shift-data-card";
import { PriorityCard } from "@/components/calculator/priority-card";
import { ResultCard } from "@/components/calculator/result-card";

export function CalculatorPage() {
  return (
    <div className="flex min-h-svh flex-col justify-center px-4 pt-4.5 pb-8">
      <div className="mx-auto w-full max-w-205">
        <CalculatorHeader />

        <CalculatorProvider>
          <div className="flex flex-col gap-2.5">
            <ShiftDataCard />
            <PriorityCard />
            <ResultCard />
          </div>
        </CalculatorProvider>
      </div>
    </div>
  );
}
