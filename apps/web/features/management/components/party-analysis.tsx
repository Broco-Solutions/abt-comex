"use client"
import Link from "next/link"
import { SearchableCombobox } from "@workspace/ui/components/searchable-combobox"
import { formatDate } from "@workspace/ui/lib/date"
import { hasCapability } from "@/features/demo/data/capabilities"
import {
  reportParties,
  selectExecutiveReport,
  canReportMetric,
  reportMetricLabels,
  type ReportMetric,
} from "@/features/finance/data/reporting"
import {
  ReportAmount,
  Variation,
  variation,
} from "@/features/finance/components/report-values"
import {
  ReportEvents,
  ReportObligations,
} from "@/features/finance/components/report-records"
import { reportControl } from "@/features/finance/components/report-filters"

type Input = Parameters<typeof selectExecutiveReport>[0]
type Context = Parameters<typeof selectExecutiveReport>[1]
export function PartyAnalysis({
  input,
  context,
  params,
  change,
  origin,
  previousContext,
  comparable,
  suppliers,
}: {
  input: Input
  context: Context
  params: URLSearchParams
  change: (patch: Record<string, string | undefined>) => void
  origin: string
  previousContext?: Context
  comparable: boolean
  suppliers: boolean
}) {
  const role = suppliers ? "abt-supplier" : "client",
    rows = reportParties(input, context, role),
    before = previousContext ? reportParties(input, previousContext, role) : []
  const metrics: ReportMetric[] = (
    suppliers
      ? (["purchase", "expense", "payment"] as ReportMetric[])
      : (["invoice", "receipt"] as ReportMetric[])
  ).filter((key) => canReportMetric(input.scenario, key))
  const canBalance = hasCapability(
      input.scenario,
      suppliers ? "finance.treasury" : "finance.collections"
    ),
    canOps = !suppliers && hasCapability(input.scenario, "operations.read")
  const options = [
    ...metrics.map((key) => [key, reportMetricLabels[key]]),
    ...(canBalance
      ? [
          ["balance", "Saldo al corte"],
          ["overdue", "Vencido"],
        ]
      : []),
    ...(canOps ? [["operations", "Operaciones"]] : []),
    ...(metrics.length && comparable
      ? [["variation", "Variación de " + reportMetricLabels[metrics[0]!]]]
      : []),
  ]
  const sort = options.some(([key]) => key === params.get("orden"))
      ? params.get("orden")!
      : (options[0]?.[0] ?? "name"),
    ascending = params.get("sentido") === "asc"
  const value = (row: (typeof rows)[number]) => {
    if (sort === "operations") return row.operations.length
    if (sort === "variation")
      return variation(
        row.metrics[metrics[0]!],
        before.find((item) => item.organization.id === row.organization.id)
          ?.metrics[metrics[0]!],
        comparable
      )
    const total =
      sort === "balance"
        ? row.balance
        : sort === "overdue"
          ? row.overdue
          : row.metrics[sort as ReportMetric]
    return total?.complete ? total.usd : undefined
  }
  rows.sort((a, b) => {
    const av = value(a),
      bv = value(b)
    return av === undefined
      ? bv === undefined
        ? a.organization.name.localeCompare(b.organization.name)
        : 1
      : bv === undefined
        ? -1
        : (ascending ? av - bv : bv - av) ||
          a.organization.name.localeCompare(b.organization.name)
  })
  return (
    <section
      className="workspace-surface space-y-4 p-4"
      aria-label={
        suppliers
          ? "Análisis de proveedores de ABT"
          : "Análisis de toda la cartera de clientes"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">
          {suppliers ? "Proveedores de ABT" : "Cartera de clientes"}
        </h2>
        <span className="text-xs text-muted-foreground">
          {rows.length} {suppliers ? "proveedores" : "clientes"} · USD
        </span>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="grid min-w-0 flex-1 gap-1 text-xs font-medium">
          {suppliers ? "Buscar proveedor" : "Buscar cliente"}
          <input
            type="search"
            className={reportControl}
            value={params.get("buscar") ?? ""}
            onChange={(event) => change({ buscar: event.target.value })}
          />
        </label>
        <label className="grid gap-1 text-xs font-medium">
          Ordenar por
          <select
            aria-label="Ordenar por"
            className={reportControl}
            value={sort}
            onChange={(event) => change({ orden: event.target.value })}
          >
            {options.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-medium">
          Sentido
          <select
            aria-label="Sentido"
            className={reportControl}
            value={ascending ? "asc" : "desc"}
            onChange={(event) => change({ sentido: event.target.value })}
          >
            <option value="desc">Mayor a menor</option>
            <option value="asc">Menor a mayor</option>
          </select>
        </label>
      </div>
      {suppliers && (
        <SearchableCombobox
          label="Proveedor de ABT"
          value={context.supplierId ?? ""}
          onChange={(id) => change({ proveedor: id })}
          options={[
            { value: "", label: "Todos los proveedores de ABT" },
            ...input.organizations
              .filter((org) =>
                org.roles.some((entry) => entry.role === "abt-supplier")
              )
              .map((org) => ({ value: org.id, label: org.name })),
          ]}
        />
      )}
      <p className="text-xs text-muted-foreground">
        {suppliers
          ? "Compras referenciadas, gastos y pagos son registros distintos. No se incluyen contrapartes operativas sin rol de proveedor de ABT."
          : "Operaciones del período según fecha explícita de alta. Los saldos se consultan a Hasta, incluyendo facturas anteriores. El detalle conserva período, búsqueda y orden."}
      </p>
      <div className="hidden overflow-x-auto lg:block">
        <table
          className="w-full text-left text-sm"
          aria-label={
            suppliers
              ? "Comparación económica de proveedores"
              : "Comparación económica y operativa de clientes"
          }
        >
          <thead>
            <tr className="border-b border-border text-xs font-medium text-muted-foreground">
              <th scope="col" className="py-3 pr-3">
                {suppliers ? "Proveedor" : "Cliente"}
              </th>
              {metrics.map((key) => (
                <th
                  key={key}
                  scope="col"
                  className="px-2 py-3 text-right font-medium"
                >
                  {reportMetricLabels[key]}
                </th>
              ))}
              {canBalance && (
                <>
                  <th scope="col" className="px-2 py-3 text-right font-medium">
                    Saldo al corte
                  </th>
                  <th scope="col" className="px-2 py-3 text-right font-medium">
                    Vencido
                  </th>
                </>
              )}
              {canOps && (
                <th scope="col" className="py-3 pl-2 text-right font-medium">
                  Operaciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.organization.id}
                className="border-b border-border align-top hover:bg-muted/30"
              >
                <th scope="row" className="max-w-64 py-3 pr-3 font-normal">
                  <Link
                    href={`/${suppliers ? "proveedores" : "clientes"}/${row.organization.id}?returnTo=${encodeURIComponent(origin)}`}
                    aria-label={`Abrir ${suppliers ? "proveedor" : "cliente"} ${row.organization.name}`}
                    className="inline-flex min-h-9 items-center font-medium text-primary underline"
                  >
                    {row.organization.name}
                  </Link>
                  <details className="mt-1 text-xs">
                    <summary className="min-h-9 cursor-pointer text-muted-foreground">
                      Más indicadores
                    </summary>
                    <div className="space-y-2 py-2">
                      <p>
                        {row.activity
                          ? `Actividad: ${formatDate(row.activity)}`
                          : "Sin actividad en el período"}
                      </p>
                      {canOps && (
                        <p>
                          Importaciones{" "}
                          {
                            row.operations.filter(
                              (op) => op.kind === "Importación"
                            ).length
                          }{" "}
                          · Exportaciones{" "}
                          {
                            row.operations.filter(
                              (op) => op.kind === "Exportación"
                            ).length
                          }
                        </p>
                      )}
                      {row.documentCount !== undefined && (
                        <p>{row.documentCount} comprobantes del período.</p>
                      )}
                      {row.concentration !== undefined && (
                        <p>
                          Concentración de facturación:{" "}
                          {(row.concentration * 100).toFixed(1)} %.
                        </p>
                      )}
                      {metrics.length > 0 && (
                        <Variation
                          value={variation(
                            row.metrics[metrics[0]!],
                            before.find(
                              (item) =>
                                item.organization.id === row.organization.id
                            )?.metrics[metrics[0]!],
                            comparable
                          )}
                        />
                      )}
                    </div>
                  </details>
                </th>
                {metrics.map((key) => (
                  <td key={key} className="px-2 py-4 text-right tabular-nums">
                    <ReportAmount total={row.metrics[key]} />
                  </td>
                ))}
                {canBalance && (
                  <>
                    <td className="px-2 py-4 text-right">
                      <ReportAmount total={row.balance} />
                    </td>
                    <td className="px-2 py-4 text-right">
                      <ReportAmount total={row.overdue} />
                    </td>
                  </>
                )}
                {canOps && (
                  <td className="py-4 pl-2 text-right tabular-nums">
                    {row.operations.length}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="divide-y divide-border lg:hidden">
        {rows.map((row) => (
          <li key={row.organization.id} className="py-4">
            <div className="flex flex-wrap justify-between gap-2">
              <Link
                href={`/${suppliers ? "proveedores" : "clientes"}/${row.organization.id}?returnTo=${encodeURIComponent(origin)}`}
                aria-label={`Abrir ${suppliers ? "proveedor" : "cliente"} ${row.organization.name}`}
                className="inline-flex min-h-9 items-center font-medium text-primary underline"
              >
                {row.organization.name}
              </Link>
              <span className="text-xs text-muted-foreground">
                {row.activity
                  ? `Actividad: ${formatDate(row.activity)}`
                  : "Sin actividad en el período"}
              </span>
            </div>
            <dl className="mt-2 grid grid-cols-2 gap-x-5 gap-y-3 md:grid-cols-4 xl:grid-cols-6">
              {metrics.map((key) => (
                <div key={key}>
                  <dt className="text-xs text-muted-foreground">
                    {reportMetricLabels[key]}
                  </dt>
                  <dd className="mt-1 text-sm">
                    <ReportAmount total={row.metrics[key]} />
                  </dd>
                </div>
              ))}
              {canBalance && (
                <>
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      Saldo al corte
                    </dt>
                    <dd className="mt-1 text-sm">
                      <ReportAmount total={row.balance} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Vencido</dt>
                    <dd className="mt-1 text-sm">
                      <ReportAmount total={row.overdue} />
                    </dd>
                  </div>
                </>
              )}
              {canOps && (
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Operaciones por alta
                  </dt>
                  <dd className="mt-1 text-sm">{row.operations.length}</dd>
                </div>
              )}
            </dl>
            <details className="mt-2 text-xs">
              <summary className="min-h-9 cursor-pointer text-muted-foreground">
                Más indicadores y registros
              </summary>
              <div className="space-y-2 py-2">
                {canOps && (
                  <p>
                    Importaciones{" "}
                    {
                      row.operations.filter((op) => op.kind === "Importación")
                        .length
                    }{" "}
                    · Exportaciones{" "}
                    {
                      row.operations.filter((op) => op.kind === "Exportación")
                        .length
                    }
                  </p>
                )}
                {row.documentCount !== undefined && (
                  <p>
                    {row.documentCount} comprobantes registrados del período.
                  </p>
                )}
                {row.concentration !== undefined && (
                  <p>
                    Concentración de facturación en la selección:{" "}
                    {(row.concentration * 100).toFixed(1)} %.
                  </p>
                )}
                {metrics.length > 0 && comparable && (
                  <Variation
                    value={variation(
                      row.metrics[metrics[0]!],
                      before.find(
                        (item) => item.organization.id === row.organization.id
                      )?.metrics[metrics[0]!],
                      comparable
                    )}
                  />
                )}
                <ReportEvents
                  input={input}
                  events={row.events}
                  origin={origin}
                />
                <ReportObligations
                  input={input}
                  rows={row.obligations}
                  origin={origin}
                />
              </div>
            </details>
          </li>
        ))}
      </ul>
      {!rows.length && (
        <p role="status" className="py-3 text-sm text-muted-foreground">
          Sin coincidencias en el catálogo autorizado.
        </p>
      )}
    </section>
  )
}
