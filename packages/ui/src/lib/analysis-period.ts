import { isIsoCalendarDate } from "@workspace/ui/lib/date"

export const analysisPresets = {
  "this-month": "Este mes",
  "previous-month": "Mes anterior",
  "this-quarter": "Este trimestre",
  "this-year": "Este año",
  custom: "Personalizado",
} as const
export type AnalysisPreset = keyof typeof analysisPresets
export type AnalysisPeriod = {
  preset: AnalysisPreset
  from: string
  to: string
}
export type ComparisonMode = "none" | "previous" | "year"
const iso = (date: Date) => date.toISOString().slice(0, 10)
const utc = (value: string) => new Date(`${value}T00:00:00Z`)
const monthStart = (year: number, month: number) =>
  new Date(Date.UTC(year, month, 1))
const monthEnd = (year: number, month: number) =>
  new Date(Date.UTC(year, month + 1, 0))
const addDays = (value: string, count: number) =>
  iso(new Date(utc(value).getTime() + count * 86400000))
export const inclusiveDays = (from: string, to: string) =>
  (utc(to).getTime() - utc(from).getTime()) / 86400000 + 1

export function presetPeriod(
  preset: Exclude<AnalysisPreset, "custom">,
  reference: string
): AnalysisPeriod {
  if (!isIsoCalendarDate(reference))
    throw new Error("Fecha de referencia inválida.")
  const date = utc(reference),
    year = date.getUTCFullYear(),
    month = date.getUTCMonth()
  const from =
    preset === "this-year"
      ? `${year}-01-01`
      : iso(
          monthStart(
            year,
            preset === "previous-month"
              ? month - 1
              : preset === "this-quarter"
                ? Math.floor(month / 3) * 3
                : month
          )
        )
  return {
    preset,
    from,
    to:
      preset === "previous-month" ? iso(monthEnd(year, month - 1)) : reference,
  }
}
function shiftYear(value: string) {
  const date = utc(value),
    year = date.getUTCFullYear() - 1,
    month = date.getUTCMonth()
  return iso(
    new Date(
      Date.UTC(
        year,
        month,
        Math.min(date.getUTCDate(), monthEnd(year, month).getUTCDate())
      )
    )
  )
}
export function comparisonPeriod(period: AnalysisPeriod, mode: ComparisonMode) {
  if (
    mode === "none" ||
    !isIsoCalendarDate(period.from) ||
    !isIsoCalendarDate(period.to) ||
    period.from > period.to
  )
    return undefined
  const first = utc(period.from),
    last = utc(period.to),
    days = inclusiveDays(period.from, period.to)
  let from: string,
    to: string,
    calendarComplete = false
  if (mode === "year" || period.preset === "this-year") {
    from = shiftYear(period.from)
    to = shiftYear(period.to)
    calendarComplete =
      period.from.endsWith("-01-01") && period.to.endsWith("-12-31")
  } else if (period.preset === "custom") {
    to = addDays(period.from, -1)
    from = addDays(to, 1 - days)
  } else {
    const offset = period.preset === "this-quarter" ? 3 : 1
    const previousStart = monthStart(
      first.getUTCFullYear(),
      first.getUTCMonth() - offset
    )
    const currentEnd =
      period.preset === "this-quarter"
        ? monthEnd(first.getUTCFullYear(), first.getUTCMonth() + 2)
        : monthEnd(first.getUTCFullYear(), first.getUTCMonth())
    const previousEnd = monthEnd(
      previousStart.getUTCFullYear(),
      previousStart.getUTCMonth() + offset - 1
    )
    from = iso(previousStart)
    calendarComplete = iso(last) === iso(currentEnd)
    to = calendarComplete
      ? iso(previousEnd)
      : addDays(from, Math.min(days, inclusiveDays(from, iso(previousEnd))) - 1)
  }
  return {
    from,
    to,
    days: inclusiveDays(from, to),
    comparable: calendarComplete || inclusiveDays(from, to) === days,
    calendarComplete,
  }
}
export function analysisPeriodError(
  from: string,
  to: string,
  reference: string
) {
  return !isIsoCalendarDate(from) || !isIsoCalendarDate(to)
    ? "Completá Desde y Hasta con fechas válidas en DD/MM/AAAA. El rango no se aplicó."
    : from > to
      ? "La fecha Desde debe ser anterior o igual a Hasta. El rango no se aplicó."
      : to > reference
        ? "Hasta supera la fecha de referencia del escenario. El rango no se aplicó."
        : ""
}
