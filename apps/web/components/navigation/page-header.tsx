import { cn } from "@workspace/ui/lib/utils"

export function PageHeader({
  eyebrow,
  title,
  description,
  status,
  primaryAction,
  secondaryActions,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  status?: React.ReactNode
  primaryAction?: React.ReactNode
  secondaryActions?: React.ReactNode
  className?: string
}) {
  const hasActions = primaryAction || secondaryActions

  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="max-w-3xl min-w-0">
        {eyebrow ? (
          <p className="text-xs font-medium tracking-wider text-primary uppercase">
            {eyebrow}
          </p>
        ) : null}
        <div
          className={cn(
            "flex flex-wrap items-center gap-2",
            eyebrow && "mt-1.5"
          )}
        >
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
          {status}
        </div>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {hasActions ? (
        <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row sm:items-center">
          {secondaryActions}
          {primaryAction}
        </div>
      ) : null}
    </header>
  )
}
