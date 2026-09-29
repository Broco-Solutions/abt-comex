"use client"

import * as React from "react"
import { cn } from "cn"
import { ResponsiveContainer, Tooltip } from "recharts"

export type ChartConfig = Record<string, { label: string; color: string }>

function ChartContainer({
  className,
  config,
  children,
  ...props
}: React.ComponentProps<"div"> & { config: ChartConfig }) {
  return (
    <div
      data-slot="chart"
      className={cn(
        "h-64 w-full text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border",
        className
      )}
      style={
        Object.fromEntries(
          Object.entries(config).map(([key, value]) => [
            `--color-${key}`,
            value.color,
          ])
        ) as React.CSSProperties
      }
      {...props}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 640, height: 256 }}
      >
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  )
}

function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  valueFormatter,
}: {
  active?: boolean
  payload?: Array<{
    name?: string
    value?: number | string
    color?: string
    fill?: string
  }>
  label?: string
  className?: string
  valueFormatter?: (value: number | string) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div
      className={cn(
        "min-w-36 rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md",
        className
      )}
    >
      {label ? <p className="mb-2 font-medium">{label}</p> : null}
      <div className="space-y-1.5">
        {payload.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-center justify-between gap-5"
          >
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className="size-2 rounded-sm"
                style={{ backgroundColor: item.color ?? item.fill }}
              />
              {item.name}
            </span>
            <span className="font-mono font-medium tabular-nums">
              {item.value === undefined
                ? "—"
                : valueFormatter
                  ? valueFormatter(item.value)
                  : String(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { ChartContainer, Tooltip as ChartTooltip, ChartTooltipContent }
