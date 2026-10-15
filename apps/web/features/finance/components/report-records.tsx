"use client"
import Link from "next/link"
import { formatDate, isIsoCalendarDate } from "@workspace/ui/lib/date"
import { money } from "../data/financial-records"
import {
  reportMetricLabels,
  type ReportEvent,
  type ReportInput,
  type ReportObligation,
} from "../data/reporting"

export function ReportEvents({
  events,
  input,
  origin,
}: {
  events: ReportEvent[]
  input: ReportInput
  origin: string
}) {
  return (
    <ul
      aria-label="Registros financieros seleccionados"
      className="divide-y divide-border"
    >
      {[...events]
        .sort(
          (a, b) =>
            b.date.localeCompare(a.date) ||
            a.reference.localeCompare(b.reference)
        )
        .map((event) => (
          <li
            key={`${event.metric}-${event.id}`}
            className="grid gap-2 py-3 text-sm sm:grid-cols-[minmax(0,1fr)_auto]"
          >
            <div className="min-w-0">
              <Link
                href={`${event.href}?returnTo=${encodeURIComponent(origin)}`}
                className="inline-flex min-h-9 items-center font-medium text-primary underline"
              >
                {event.reference}
              </Link>
              <p className="text-muted-foreground">
                {reportMetricLabels[event.metric]} · {formatDate(event.date)} ·{" "}
                {input.organizations.find(
                  (organization) => organization.id === event.partyId
                )?.name ?? "Sin contraparte identificada"}
              </p>
              {event.operationIds.map((id) => (
                <Link
                  key={id}
                  href={`/operaciones/${id}?returnTo=${encodeURIComponent(origin)}`}
                  className="mr-3 inline-flex min-h-11 items-center text-primary underline"
                >
                  Abrir operación
                  {event.operationIds.length > 1
                    ? ` ${input.operations.find((operation) => operation.id === id)?.reference ?? "vinculada"}`
                    : ""}
                </Link>
              ))}
            </div>
            <div className="font-mono sm:text-right">
              <p className="font-medium">
                {event.valuation
                  ? money(event.valuation.usd, "USD")
                  : "Pendiente de conversión"}
              </p>
              <p className="text-xs text-muted-foreground">
                Original: {money(event.amount, event.currency)}
              </p>
            </div>
          </li>
        ))}
      {!events.length && (
        <li className="py-4 text-sm text-muted-foreground">
          Sin registros para los filtros aplicados.
        </li>
      )}
    </ul>
  )
}
export function ReportObligations({
  rows,
  input,
  origin,
}: {
  rows: ReportObligation[]
  input: ReportInput
  origin: string
}) {
  return (
    <ul
      aria-label="Obligaciones del análisis al corte"
      className="divide-y divide-border"
    >
      {[...rows]
        .sort(
          (a, b) =>
            (a.dueOn || "9999").localeCompare(b.dueOn || "9999") ||
            a.reference.localeCompare(b.reference)
        )
        .map((row) => (
          <li
            key={row.id}
            className="grid gap-2 py-3 text-sm sm:grid-cols-[minmax(0,1fr)_auto]"
          >
            <div className="min-w-0">
              <Link
                href={`/administracion/comprobantes/${row.id}?returnTo=${encodeURIComponent(origin)}`}
                className="inline-flex min-h-9 items-center font-medium text-primary underline"
              >
                {row.reference}
              </Link>
              <p className="text-muted-foreground">
                {row.side === "Cobrar" ? "Por cobrar" : "Por pagar"} ·{" "}
                {input.organizations.find(
                  (organization) => organization.id === row.partyId
                )?.name ?? "Sin contraparte identificada"}
              </p>
              <p className="text-xs text-muted-foreground">
                Emisión {formatDate(row.issuedOn)} ·{" "}
                {isIsoCalendarDate(row.dueOn)
                  ? `vence ${formatDate(row.dueOn)}`
                  : "Vencimiento pendiente"}{" "}
                · {row.band}
              </p>
            </div>
            <div className="font-mono sm:text-right">
              <p className="font-medium">
                {row.valuation
                  ? money(row.valuation.usd, "USD")
                  : row.balance === undefined
                    ? "Saldo pendiente de informar"
                    : "Pendiente de conversión"}
              </p>
              <p className="text-xs text-muted-foreground">
                Saldo original:{" "}
                {row.balance === undefined
                  ? "no disponible"
                  : money(row.balance, row.currency)}
              </p>
            </div>
          </li>
        ))}
      {!rows.length && (
        <li className="py-4 text-sm text-muted-foreground">
          Sin obligaciones abiertas para los filtros y el corte.
        </li>
      )}
    </ul>
  )
}
