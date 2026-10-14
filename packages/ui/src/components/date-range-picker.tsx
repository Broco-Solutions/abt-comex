"use client"

import * as React from "react"
import { CalendarDays } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { formatDate } from "@workspace/ui/lib/date"
import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"

export type DatePeriodPreset =
  | "today"
  | "last-7"
  | "last-30"
  | "this-month"
  | "previous-month"
  | "custom"

export type DateRangeValue = { from?: Date; to?: Date }

function labelForRange(range: DateRangeValue) {
  if (!range.from) return "Seleccionar período"
  if (!range.to) return formatDate(range.from)
  return `${formatDate(range.from)} — ${formatDate(range.to)}`
}

function DateRangePicker({
  value,
  onChange,
  id = "date-period",
  open,
  onOpenChange,
}: {
  value: DateRangeValue
  onChange: (range: DateRangeValue) => void
  id?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            variant="outline"
            size="lg"
            className="w-full min-w-0 justify-start overflow-hidden font-normal"
            aria-label={`Período: ${labelForRange(value)}`}
          />
        }
      >
        <CalendarDays aria-hidden="true" />
        <span className="truncate">{labelForRange(value)}</span>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-2">
        <p className="px-2 pt-1 text-xs font-medium text-muted-foreground">
          Desde y hasta
        </p>
        <Calendar
          className="mt-1"
          mode="range"
          selected={value as DateRange}
          onSelect={(range) => onChange(range ?? {})}
          numberOfMonths={1}
          defaultMonth={value.from}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DateRangePicker }
