"use client"
import Link from "next/link"
import { useListContext } from "@/components/navigation/list-context"
import { ReportFilters } from "./report-filters"
import { ReportEvents, ReportObligations } from "./report-records"
import { DistributionChart } from "./financial-charts"
import { ReportAmount } from "./report-values"
import { useReportingData } from "../state/use-reporting-data"
import {
  useReportingUrl,
  type ReportingSearchParams,
} from "../state/use-reporting-url"
import { reportingContext } from "../data/reporting-context"
import {
  canReportMetric,
  reportMetricLabels,
  type ReportMetric,
  eventBuckets,
  obligationBuckets,
  selectExecutiveReport,
} from "../data/reporting"
export function AdministrativeAnalysis({
  searchParams = {},
}: {
  searchParams?: ReportingSearchParams
}) {
  const { input, ready } = useReportingData(),
    { params, href, change } = useReportingUrl(
      searchParams,
      "/administracion/finanzas"
    ),
    capture = useListContext(ready, href)
  const state = reportingContext(params, input, true),
    report = selectExecutiveReport(input, state.context),
    expenses = report.events.filter((row) => row.metric === "expense"),
    receivables = report.obligations.filter((row) => row.side === "Cobrar")
  const selected = params.get("grupo"),
    due = params.get("dimension") === "due",
    metric =
      params.get("serie") &&
      params.get("serie")! in reportMetricLabels &&
      canReportMetric(input.scenario, params.get("serie")! as ReportMetric)
        ? (params.get("serie")! as ReportMetric)
        : "expense",
    sourceEvents = report.events.filter((row) => row.metric === metric),
    rows = selected
      ? sourceEvents.filter(
          (row) =>
            (row.categoryId || "uncategorized") === selected ||
            row.category === selected
        )
      : sourceEvents,
    balances = selected
      ? receivables.filter((row) => row.band === selected)
      : receivables
  const drill = (type: string, dimension: string, key: string) => {
    const next = new URLSearchParams(params)
    next.set("serie", type)
    next.set("dimension", dimension)
    next.set("grupo", key)
    return `/administracion/finanzas?${next}#registros`
  }
  if (!ready) return <p role="status">Cargando registros locales…</p>
  if (
    params.get("serie") &&
    params.get("serie")! in reportMetricLabels &&
    !canReportMetric(input.scenario, params.get("serie")! as ReportMetric)
  )
    return (
      <p role="status">
        Esta selección no está disponible para tus capacidades.
      </p>
    )
  if (
    !Object.keys(report.totals).length &&
    !report.receivables &&
    !report.error
  )
    return (
      <p role="status">
        Sin acceso a esta información administrativa. No se confirman registros
        ni importes.
      </p>
    )
  return (
    <div className="space-y-4" onClickCapture={capture}>
      <ReportFilters
        input={input}
        params={params}
        change={change}
        administrative
      />
      {report.error ? (
        <p id="financial-period-error" role="alert">
          {report.error}
        </p>
      ) : params.get("error") === "lectura" ? (
        <p role="alert">
          No se pudo leer la fuente. No se confirman registros ni importes.
        </p>
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-2">
            {report.totals.expense && (
              <DistributionChart
                title="Gastos por categoría"
                id="expenses-categories-title"
                currency="USD"
                data={eventBuckets(expenses, "category", input.organizations)}
                href={(key) => drill("expense", "category", key)}
              />
            )}
            {report.receivables && (
              <DistributionChart
                title="Cuentas por cobrar por vencimiento"
                id="receivables-due-title"
                currency="USD"
                data={obligationBuckets(receivables)}
                href={(key) => drill("invoice", "due", key)}
              />
            )}
          </div>
          <div className="text-sm">
            {report.totals.expense && (
              <>
                Gastos registrados:{" "}
                <ReportAmount
                  total={report.totals.expense}
                  partialHistory={!report.completeHistory}
                />
              </>
            )}
            {report.receivables && (
              <>
                {" "}
                · Saldo por cobrar al corte:{" "}
                <ReportAmount total={report.receivables} />
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Gastos según su fecha; saldos abiertos al corte, con aplicaciones
            explícitas. USD de gestión sintético. Los grupos con conversiones o
            saldos incompletos se omiten del gráfico; el detalle los identifica.
          </p>
          <section
            id="registros"
            aria-label="Registros del análisis"
            className="workspace-surface scroll-mt-20 p-4"
          >
            <h2 className="font-semibold">Registros del análisis</h2>
            {selected && (
              <Link
                href={href
                  .replace(/([?&])(serie|dimension|grupo)=[^&]*/g, "$1")
                  .replace(/[?&]+$/g, "")}
                className="inline-flex min-h-11 items-center text-sm text-primary underline"
              >
                Quitar selección del gráfico
              </Link>
            )}
            {due ? (
              <ReportObligations
                rows={balances}
                input={input}
                origin={`${href}#registros`}
              />
            ) : (
              <ReportEvents
                events={rows}
                input={input}
                origin={`${href}#registros`}
              />
            )}
          </section>
        </>
      )}
    </div>
  )
}
