"use client"

import * as React from "react"
import { DayPicker, type DayPickerProps } from "react-day-picker"
import { cn } from "cn"
import { es } from "react-day-picker/locale"

function Calendar({ className, classNames, ...props }: DayPickerProps) {
  return (
    <DayPicker
      showOutsideDays
      locale={es}
      labels={{
        labelNext: () => "Mes siguiente",
        labelPrevious: () => "Mes anterior",
        labelMonthDropdown: () => "Mes",
        labelYearDropdown: () => "Año",
        labelDayButton: (date) =>
          new Intl.DateTimeFormat("es-AR", { dateStyle: "full" }).format(date),
      }}
      className={cn("relative p-1 text-sm", className)}
      classNames={{
        months: "flex flex-col",
        month: "space-y-3",
        month_caption:
          "relative flex h-8 items-center justify-center px-10 text-sm font-medium",
        nav: "pointer-events-none absolute inset-x-1 top-0 z-10 flex items-center justify-between",
        button_previous:
          "pointer-events-auto inline-flex size-8 items-center justify-center rounded-md hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
        button_next:
          "pointer-events-auto inline-flex size-8 items-center justify-center rounded-md hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-center text-xs font-normal text-muted-foreground",
        week: "mt-1 flex w-full",
        day: "size-9 p-0 text-center",
        day_button:
          "inline-flex size-9 items-center justify-center rounded-md hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none aria-selected:bg-primary aria-selected:text-primary-foreground",
        selected: "bg-primary text-primary-foreground",
        range_start: "rounded-l-md bg-primary text-primary-foreground",
        range_middle: "rounded-none bg-accent text-accent-foreground",
        range_end: "rounded-r-md bg-primary text-primary-foreground",
        today: "font-semibold text-primary",
        outside: "text-muted-foreground",
        disabled: "text-muted-foreground opacity-40",
        ...classNames,
      }}
      {...props}
    />
  )
}

export { Calendar }
