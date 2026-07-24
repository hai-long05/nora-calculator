interface SectionHeaderProps {
  title: string
  hint?: string
}

export function SectionHeader({ title, hint }: SectionHeaderProps) {
  return (
    <div className="mb-2.5 flex items-center justify-between">
      <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </h2>
      {hint ? (
        <span className="text-[11.5px] text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  )
}
