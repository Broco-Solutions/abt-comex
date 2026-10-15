"use client"

import Link from "next/link"
import { formatDate } from "@workspace/ui/lib/date"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
import { money } from "../data/financial-records"
import { valueInUsd } from "../data/management-rates"
import { useManagementRates } from "../state/use-management-rates"

/** Render only within an already authorized monetary detail. Never exposes additional source fields. */
export function UsdEquivalent({
  amount,
  currency,
  date,
  balance = false,
}: {
  amount?: number
  currency: string
  date: string
  balance?: boolean
}) {
  const { book, ready } = useManagementRates()
  const { scenario } = useScenario()
  if (!ready) return null
  const value = valueInUsd(amount, currency, date, book)
  return (
    <details className="mt-3 space-y-2 text-sm">
      <summary className="cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-ring">
        {balance ? "Valoración del saldo" : "Equivalente de gestión"}:{" "}
        {value ? money(value.usd, "USD") : "Pendiente de conversión"}
      </summary>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>
          {balance ? "Valoración a fecha de corte" : "Fecha del evento"}:{" "}
          {formatDate(date)}. El importe original se conserva.
        </p>
        {value?.rate ? (
          <>
            <p>
              {value.rate.arsPerUsd} ARS por USD · vigencia{" "}
              {formatDate(value.rate.effectiveOn)} · {value.rate.id} · revisión{" "}
              {value.rate.revision}
            </p>
            <p>{value.rate.source}</p>
          </>
        ) : currency === "USD" && value ? (
          <p>Moneda original USD; no requiere conversión.</p>
        ) : (
          <p>
            {amount === undefined
              ? "Importe pendiente de informar."
              : "Falta una cotización válida aplicable; no se trata como cero."}
          </p>
        )}
        {hasCapability(scenario, "catalogs.manage") &&
          hasCapability(scenario, "finance.prepare") && (
            <Link
              href="/configuracion/cotizaciones-gestion"
              className="inline-flex min-h-9 items-center text-primary underline"
            >
              Consultar cotizaciones de gestión
            </Link>
          )}
      </div>
    </details>
  )
}
