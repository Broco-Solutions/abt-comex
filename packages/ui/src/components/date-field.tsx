"use client"

import { useId, useState } from "react"
import { CalendarDays } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import {
  formatDate,
  isIsoCalendarDate,
  parseSpanishDate,
  toIsoDate,
} from "@workspace/ui/lib/date"

/** ISO when valid, raw draft when incomplete. The caller can validate a coordinated range without applying stale dates. */
export function DateField({
  label,
  value,
  onChange,
  readOnly = false,
  required = false,
  invalid = false,
  describedBy,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
  describedBy?: string
}) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [touched, setTouched] = useState(false)
  const valid = isIsoCalendarDate(value)
  const malformed = touched && !!value && !valid
  const selected = valid ? new Date(`${value}T12:00:00`) : undefined
  return (
    <div className="min-w-0 space-y-1">
      <label htmlFor={id} className="block text-xs font-medium">
        {label}
      </label>
      <div className="flex min-w-0 items-center gap-1">
        <Input
          id={id}
          type="text"
          inputMode="text"
          placeholder="DD/MM/AAAA"
          value={valid ? formatDate(value) : value}
          readOnly={readOnly}
          required={required}
          autoComplete="off"
          maxLength={10}
          className="min-w-0 flex-1 tabular-nums"
          aria-invalid={invalid || malformed}
          aria-describedby={
            [describedBy, malformed ? `${id}-error` : ""]
              .filter(Boolean)
              .join(" ") || undefined
          }
          onChange={(event) =>
            onChange(parseSpanishDate(event.target.value) ?? event.target.value)
          }
          onBlur={() => setTouched(true)}
        />
        {!readOnly && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-11 shrink-0"
                  aria-label={`Elegir fecha: ${label}`}
                />
              }
            >
              <CalendarDays aria-hidden="true" className="size-4" />
            </PopoverTrigger>
            <PopoverContent
              aria-label={`Calendario: ${label}`}
              align="start"
              className="w-auto max-w-[calc(100vw-2rem)] p-2"
            >
              <Calendar
                mode="single"
                selected={selected}
                defaultMonth={selected}
                captionLayout="dropdown"
                startMonth={new Date(1900, 0, 1)}
                endMonth={new Date(2100, 11, 31)}
                onSelect={(date) => {
                  if (date) {
                    onChange(toIsoDate(date))
                    setOpen(false)
                  }
                }}
                classNames={{
                  month_caption:
                    "relative flex min-h-11 items-center justify-center px-9 text-sm font-medium",
                  weekday:
                    "w-[min(2.75rem,calc((100vw-4rem)/7))] text-center text-xs font-normal text-muted-foreground",
                  day: "size-[min(2.75rem,calc((100vw-4rem)/7))] p-0 text-center",
                  day_button:
                    "inline-flex size-full items-center justify-center rounded-md hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring aria-selected:bg-primary aria-selected:text-primary-foreground",
                  dropdowns: "flex items-center gap-1",
                  dropdown_root:
                    "relative rounded-md border border-input px-1 py-1",
                  dropdown: "bg-popover text-sm text-popover-foreground",
                  caption_label: "sr-only",
                }}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
      {malformed && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          Ingresá una fecha válida en DD/MM/AAAA.
        </p>
      )}
    </div>
  )
}
