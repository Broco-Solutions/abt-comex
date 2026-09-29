export type DateInput = Date | string | number

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
