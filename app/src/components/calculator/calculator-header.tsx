import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme/theme-toggle"

export function CalculatorHeader() {
  return (
    <header className="mb-3.5 flex items-center justify-between">
      <div>
        <h1 className="text-[19px] leading-tight font-bold tracking-tight">
          Zuschlagsrechner
        </h1>
        <p className="text-[12.5px] text-muted-foreground">
          Berechnung der Zuschlagsstunden je Schicht
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="border border-border">
          Brandenburg
        </Badge>
        <ThemeToggle />
      </div>
    </header>
  )
}
