import { ThemeToggle } from "@/components/theme/theme-toggle";

export function CalculatorHeader() {
  return (
    <header className="mb-3.5 flex items-center justify-between">
      <div>
        <h1 className="text-[19px] leading-tight font-bold tracking-tight">
          Zuschlagsrechner
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
