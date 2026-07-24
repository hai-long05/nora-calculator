import { cn } from "@/lib/utils"
import {
  CATEGORY_BG,
  TIMELINE_BOUNDS,
  TIMELINE_SEGMENTS,
} from "@/lib/calculator-data"

const PAUSE_PATTERN =
  "bg-[repeating-linear-gradient(45deg,var(--muted),var(--muted)_3px,var(--border)_3px,var(--border)_6px)]"

export function ShiftTimeline() {
  return (
    <div>
      <div className="mb-[5px] flex justify-between text-[11px] text-muted-foreground">
        <span>{TIMELINE_BOUNDS.start}</span>
        <span>{TIMELINE_BOUNDS.end}</span>
      </div>
      <div className="flex h-2.5 overflow-hidden rounded-[3px] border">
        {TIMELINE_SEGMENTS.map((segment, index) => (
          <div
            key={index}
            className={cn(
              "h-full",
              segment.pause ? PAUSE_PATTERN : CATEGORY_BG[segment.category]
            )}
            style={{ width: `${segment.width}%` }}
          />
        ))}
      </div>
    </div>
  )
}
