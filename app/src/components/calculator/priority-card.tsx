import * as React from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  GripVerticalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_BG,
  CATEGORY_LABELS,
  type SurchargeCategory,
} from "@/lib/calculator-data";
import { useCalculator } from "@/components/calculator/calculator-context";
import { CalcCard } from "@/components/calculator/calc-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

interface PriorityRowProps {
  category: SurchargeCategory;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  onMove: (index: number, direction: -1 | 1) => void;
  onDragStart: (index: number) => void;
  onDragEnterRow: (index: number) => void;
  onDragEnd: () => void;
  onDrop: () => void;
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
        event.dataTransfer.effectAllowed = "move";
        onDragStart(index);
      }}
      onDragEnter={() => onDragEnterRow(index)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDrop();
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "flex items-center gap-2.5 rounded-[calc(var(--radius)-2px)] border bg-background px-2.5 py-1.5 transition-[opacity,box-shadow]",
        isDragging && "opacity-40",
        isDropTarget && !isDragging && "border-primary ring-1 ring-primary",
      )}
    >
      <GripVerticalIcon
        className="size-3.5 cursor-grab text-muted-foreground active:cursor-grabbing"
        aria-hidden
      />
      <span className="w-4 font-mono text-[11.5px] font-semibold text-muted-foreground tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className={cn("size-2 shrink-0 rounded-full", CATEGORY_BG[category])}
      />
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
  );
}

export function PriorityCard() {
  const { form, movePriority, reorderPriority } = useCalculator();
  const { priority } = form;

  const [open, setOpen] = React.useState(false);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);

  const resetDrag = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDrop = () => {
    if (dragIndex !== null && overIndex !== null) {
      reorderPriority(dragIndex, overIndex);
    }
    resetDrag();
  };

  return (
    <CalcCard>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="group flex w-full items-center gap-3 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
          <span className="flex-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Prioritätsreihenfolge
          </span>
          <span className="grid size-6 shrink-0 place-items-center rounded-md border bg-background text-muted-foreground transition-colors group-hover:text-foreground">
            <ChevronDownIcon
              className={cn(
                "size-3.5 transition-transform duration-200 ease-in-out motion-reduce:transition-none",
                open && "rotate-180",
              )}
            />
          </span>
        </CollapsibleTrigger>

        {!open && (
          <div
            aria-hidden={open}
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out motion-reduce:transition-none",
              open
                ? "grid-rows-[0fr] opacity-0"
                : "grid-rows-[1fr] opacity-100",
            )}
          >
            <div className="overflow-hidden">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 pt-2.5 text-xs text-muted-foreground">
                {priority.map((category, i) => (
                  <React.Fragment key={category}>
                    {i > 0 && (
                      <ChevronRightIcon className="size-3 opacity-50" />
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          CATEGORY_BG[category],
                        )}
                      />
                      {CATEGORY_LABELS[category]}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        <CollapsibleContent className="-mx-0.5 overflow-hidden px-0.5 pb-0.5 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down motion-reduce:animate-none">
          <div className="flex flex-col gap-1.5 pt-3">
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
                onDragEnd={resetDrag}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </CalcCard>
  );
}
