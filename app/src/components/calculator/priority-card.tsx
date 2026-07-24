import * as React from "react"
import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  CATEGORY_BG,
  CATEGORY_LABELS,
  type SurchargeCategory,
} from "@/lib/calculator-data"
import { useCalculator } from "@/components/calculator/calculator-context"
import { CalcCard } from "@/components/calculator/calc-card"
import { SectionHeader } from "@/components/calculator/section-header"

interface PriorityRowProps {
  category: SurchargeCategory
  index: number
  isFirst: boolean
  isLast: boolean
  isDragging: boolean
  isDropTarget: boolean
  onMove: (index: number, direction: -1 | 1) => void
  onDragStart: (index: number) => void
  onDragEnterRow: (index: number) => void
  onDragEnd: () => void
  onDrop: () => void
}

function PriorityRow({
  category,
  index,
  isFirst,
  isLast,
  isDragging,
  isDropTarget,
  onMove,
  onDragStart,
  onDragEnterRow,
  onDragEnd,
  onDrop,
}: PriorityRowProps) {
  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move"
        onDragStart(index)
      }}
      onDragEnter={() => onDragEnterRow(index)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        onDrop()
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "flex items-center gap-2.5 rounded-[calc(var(--radius)-2px)] border bg-background px-2.5 py-1.5 transition-[opacity,box-shadow]",
        isDragging && "opacity-40",
        isDropTarget && !isDragging && "border-primary ring-1 ring-primary"
      )}
    >
      <GripVerticalIcon
        className="size-3.5 cursor-grab text-muted-foreground active:cursor-grabbing"
        aria-hidden
      />
      <span className="w-4 font-mono text-[11.5px] font-semibold text-muted-foreground tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className={cn("size-2 shrink-0 rounded-full", CATEGORY_BG[category])} />
      <span className="flex-1 text-[13.5px] font-medium">
        {CATEGORY_LABELS[category]}
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
  const { form, movePriority, reorderPriority } = useCalculator()
  const { priority } = form

  const [dragIndex, setDragIndex] = React.useState<number | null>(null)
  const [overIndex, setOverIndex] = React.useState<number | null>(null)

  const handleDrop = () => {
    if (dragIndex !== null && overIndex !== null) {
      reorderPriority(dragIndex, overIndex)
    }
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <CalcCard>
      <SectionHeader
        title="Prioritätsreihenfolge"
        hint="bei Überschneidung mehrerer Kategorien"
      />

      <div className="flex flex-col gap-1.5">
        {priority.map((category, index) => (
          <PriorityRow
            key={category}
            category={category}
            index={index}
            isFirst={index === 0}
            isLast={index === priority.length - 1}
            isDragging={dragIndex === index}
            isDropTarget={overIndex === index}
            onMove={movePriority}
            onDragStart={setDragIndex}
            onDragEnterRow={setOverIndex}
            onDragEnd={() => {
              setDragIndex(null)
              setOverIndex(null)
            }}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </CalcCard>
  )
}
