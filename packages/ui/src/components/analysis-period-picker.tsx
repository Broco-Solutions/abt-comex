"use client"
import { useId, useState, type ReactNode } from "react"
import { Button } from "@workspace/ui/components/button"
import { DateField } from "@workspace/ui/components/date-field"
import { formatDate, isIsoCalendarDate } from "@workspace/ui/lib/date"
import {
  analysisPresets,
  analysisPeriodError,
  presetPeriod,
  type AnalysisPeriod,
  type AnalysisPreset,
} from "@workspace/ui/lib/analysis-period"

export function AnalysisPeriodPicker({
  value,
  reference,
  onChange,
  children,
}: {
  value: AnalysisPeriod
  reference: string
  onChange: (period: AnalysisPeriod) => void
  children?: ReactNode
}) {
  const id = useId()
  const [from, setFrom] = useState(value.from),
    [to, setTo] = useState(value.to)
  const [error, setError] = useState("")
  const key = `${value.preset}:${value.from}:${value.to}`
  const [previous, setPrevious] = useState(key)
  if (key !== previous) {
    setPrevious(key)
    setFrom(value.from)
    setTo(value.to)
    setError("")
  }
  const valid =
    isIsoCalendarDate(value.from) &&
    isIsoCalendarDate(value.to) &&
    value.from <= value.to &&
    value.to <= reference
  return (
    <div className="min-w-0 space-y-2">
      <div className="flex flex-wrap items-end gap-3">
        <label
          htmlFor={id}
          className="grid w-full min-w-0 gap-1 text-xs font-medium sm:w-48"
        >
          Período
          <select
            aria-label="Período"
            id={id}
            value={value.preset}
            className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm font-normal focus-visible:outline-2 focus-visible:outline-ring max-sm:min-h-11"
            onChange={(event) => {
              const preset = event.target.value as AnalysisPreset
              onChange(
                preset === "custom"
                  ? { ...value, preset }
                  : presetPeriod(preset, reference)
              )
            }}
          >
            {Object.entries(analysisPresets).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        {children}
      </div>
      {value.preset === "custom" && (
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            const problem = analysisPeriodError(from, to, reference)
            setError(problem)
            if (!problem) onChange({ preset: "custom", from, to })
          }}
        >
          <div className="w-full min-w-0 sm:w-44">
            <DateField
              label="Desde"
              value={from}
              onChange={setFrom}
              invalid={!!error}
              describedBy={error ? `${id}-error` : undefined}
            />
          </div>
          <div className="w-full min-w-0 sm:w-44">
            <DateField
              label="Hasta"
              value={to}
              onChange={setTo}
              invalid={!!error}
              describedBy={error ? `${id}-error` : undefined}
            />
          </div>
          <Button variant="outline" type="submit">
            Aplicar período
          </Button>
          {error && (
            <p
              id={`${id}-error`}
              role="alert"
              className="w-full text-sm text-destructive"
            >
              {error}
            </p>
          )}
        </form>
      )}
      <p className="text-xs text-muted-foreground">
        {valid
          ? `${formatDate(value.from)}–${formatDate(value.to)} · extremos inclusivos`
          : "Período pendiente de validación"}{" "}
        · Referencia: {formatDate(reference)}
      </p>
    </div>
  )
}
