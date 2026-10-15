"use client"
import Link from "next/link"
import { useReportingData } from "../state/use-reporting-data"
import { reportingContext } from "../data/reporting-context"
import { reportParties, reportMetricLabels } from "../data/reporting"
import { ReportAmount } from "./report-values"
import { ReportEvents, ReportObligations } from "./report-records"
import { formatDate } from "@workspace/ui/lib/date"
export function PartySituation({
  partyId,
  supplier = false,
  origin,
  returnTo,
}: {
  partyId: string
  supplier?: boolean
  origin: string
  returnTo: string
}) {
  const { input, ready } = useReportingData()
  const params = returnTo.startsWith("/gestion?")
    ? new URL(returnTo, "https://abt.local").searchParams
    : new URLSearchParams()
  const state = reportingContext(params, input),
    context = {
      ...state.context,
      clientId: supplier ? state.context.clientId : partyId,
      supplierId: supplier ? partyId : undefined,
    }
  const row = reportParties(
    input,
    context,
    supplier ? "abt-supplier" : "client"
  ).find((item) => item.organization.id === partyId)
  if (!ready || !row || (!Object.keys(row.metrics).length && !row.balance))
    return null
  const analysis = new URLSearchParams(params)
  analysis.set("vista", supplier ? "proveedores" : "clientes")
  analysis.set(supplier ? "proveedor" : "cliente", partyId)
  return (
    <section
      className="workspace-surface space-y-3 p-4"
      aria-label="Situación económica y operativa"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold">Situación económica y operativa</h2>
        <p className="text-xs text-muted-foreground">
          {formatDate(context.from)}–{formatDate(context.to)} · USD
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Object.entries(row.metrics).map(([key, total]) => (
          <div key={key}>
            <dt className="text-xs text-muted-foreground">
              {reportMetricLabels[key as keyof typeof reportMetricLabels]}
            </dt>
            <dd className="mt-1 text-sm">
              <ReportAmount total={total} />
            </dd>
          </div>
        ))}
        {row.balance && (
          <div>
            <dt className="text-xs text-muted-foreground">Saldo al corte</dt>
            <dd className="mt-1 text-sm">
              <ReportAmount total={row.balance} />
            </dd>
          </div>
        )}
        {row.overdue && (
          <div>
            <dt className="text-xs text-muted-foreground">Vencido</dt>
            <dd className="mt-1 text-sm">
              <ReportAmount total={row.overdue} />
            </dd>
          </div>
        )}
      </dl>
      <details>
        <summary className="min-h-11 cursor-pointer text-sm text-primary">
          Comprobantes, movimientos y obligaciones explicativos
        </summary>
        <ReportEvents events={row.events} input={input} origin={origin} />
        <ReportObligations
          rows={row.obligations}
          input={input}
          origin={origin}
        />
      </details>
      {input.scenario.capabilities?.includes("management.read") && (
        <Link
          href={`/gestion?${analysis}`}
          className="inline-flex min-h-11 items-center text-sm text-primary underline"
        >
          Analizar en Dirección
        </Link>
      )}
      <p className="text-xs text-muted-foreground">
        Mismos registros que Administración y Dirección. Flujos por evento;
        saldo con historia y aplicaciones al corte. Datos sintéticos.
      </p>
    </section>
  )
}
