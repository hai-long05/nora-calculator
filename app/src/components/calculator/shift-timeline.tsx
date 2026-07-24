import { cn } from "@/lib/utils"
import { CATEGORY_BG } from "@/lib/calculator-data"
import type { TimelineSegment } from "@/lib/surcharge"

const PAUSE_PATTERN =
  "bg-[repeating-linear-gradient(45deg,var(--muted),var(--muted)_3px,var(--border)_3px,var(--border)_6px)]"

interface ShiftTimelineProps {
  segments: TimelineSegment[]
  bounds: { start: string; end: string }
}

export function ShiftTimeline({ segments, bounds }: ShiftTimelineProps) {
  return (
    <div>
      <div className="mb-1.25 flex justify-between text-[11px] text-muted-foreground">
        <span>{bounds.start}</span>
        <span>{bounds.end}</span>
      </div>
      <div className="flex h-2.5 overflow-hidden rounded-[3px] border">
        {segments.map((segment, index) => (
          <div
            key={index}
            className={cn(
              "h-full",
              segment.kind === "pause" || !segment.category
                ? PAUSE_PATTERN
                : CATEGORY_BG[segment.category]
            )}
            style={{ width: `${segment.widthPercent}%` }}
          />
        ))}
      </div>
    </div>
  )
}
