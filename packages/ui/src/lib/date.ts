export type DateInput = Date | string | number

/** A real calendar date. Never normalizes impossible dates into another month. */
export function isIsoCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T12:00:00Z`)
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  )
}

export function parseSpanishDate(value: string): string | undefined {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim())
  const iso = match ? `${match[3]}-${match[2]}-${match[1]}` : ""
  return isIsoCalendarDate(iso) ? iso : undefined
}

function toDate(value: DateInput) {
  if (value instanceof Date) return value
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T12:00:00`)
  }
  return new Date(value)
}

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

const dateTimeFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})

const monthFormatter = new Intl.DateTimeFormat("es-AR", {
  month: "long",
  year: "numeric",
})

/** Formato visible estándar ABT: DD/MM/AAAA. */
export function formatDate(value: DateInput) {
  return dateFormatter.format(toDate(value))
}

/** Keeps unavailable event dates explicit instead of manufacturing a date. */
export function formatRecordedDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? formatDate(value) : value
}

/** Formato visible estándar ABT: DD/MM/AAAA HH:mm. */
export function formatDateTime(value: DateInput) {
  return dateTimeFormatter.format(toDate(value)).replace(",", "")
}

export function formatMonth(value: DateInput) {
  return monthFormatter.format(toDate(value))
}

export function toIsoDate(value: Date) {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, "0")
  const day = String(value.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
