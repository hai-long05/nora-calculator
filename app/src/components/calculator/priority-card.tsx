import * as React from "react"
import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  CATEGORY_BG,
  CATEGORY_LABELS,
  INITIAL_PRIORITY,
  type PriorityEntry,
} from "@/lib/calculator-data"
import { CalcCard } from "@/components/calculator/calc-card"
import { SectionHeader } from "@/components/calculator/section-header"

interface PriorityRowProps {
  entry: PriorityEntry
  index: number
  isFirst: boolean
  isLast: boolean
  onMove: (index: number, direction: -1 | 1) => void
}

function PriorityRow({
  entry,
  index,
  isFirst,
  isLast,
  onMove,
}: PriorityRowProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-[calc(var(--radius)-2px)] border bg-background px-2.5 py-1.5">
      <GripVerticalIcon className="size-3.5 cursor-grab text-muted-foreground" />
      <span className="w-4 font-mono text-[11.5px] font-semibold text-muted-foreground tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className={cn("size-2 shrink-0 rounded-full", CATEGORY_BG[entry.category])}
      />
      <span className="flex-1 text-[13.5px] font-medium">
        {CATEGORY_LABELS[entry.category]}
      </span>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="icon-xs"
          disabled={isFirst}
          onClick={() => onMove(index, -1)}
          aria-label="nach oben"
        >
          <ChevronUpIcon />
        </Button>
        <Button
          variant="outline"
          size="icon-xs"
          disabled={isLast}
          onClick={() => onMove(index, 1)}
          aria-label="nach unten"
        >
          <ChevronDownIcon />
        </Button>
      </div>
    </div>
  )
}

export function PriorityCard() {
  const [priority, setPriority] =
    React.useState<PriorityEntry[]>(INITIAL_PRIORITY)

  const move = (index: number, direction: -1 | 1) => {
    setPriority((prev) => {
      const target = index + direction
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  return (
    <CalcCard>
      <SectionHeader
        title="Prioritätsreihenfolge"
        hint="bei Überschneidung mehrerer Kategorien"
      />

      <div className="flex flex-col gap-1.5">
        {priority.map((entry, index) => (
          <PriorityRow
            key={entry.category}
            entry={entry}
            index={index}
            isFirst={index === 0}
            isLast={index === priority.length - 1}
            onMove={move}
          />
        ))}
      </div>

      <Button className="mt-2.5 h-[34px] w-full font-semibold">
        Zuschläge berechnen
      </Button>
    </CalcCard>
  )
}
