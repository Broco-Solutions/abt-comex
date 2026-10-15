"use client"
import Link from "next/link"
import { PageHeader } from "@/components/navigation/page-header"
import { useListContext } from "@/components/navigation/list-context"
import { hasCapability } from "@/features/demo/data/capabilities"
import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"
import { formatDate } from "@workspace/ui/lib/date"
import { Button } from "@workspace/ui/components/button"
import { useReportingData } from "@/features/finance/state/use-reporting-data"
import {
  useReportingUrl,
  type ReportingSearchParams,
} from "@/features/finance/state/use-reporting-url"
import { reportingContext } from "@/features/finance/data/reporting-context"
import {
  billingSeries,
  canReportMetric,
  eventBuckets,
  obligationBuckets,
  reportMetricLabels,
  selectExecutiveReport,
  type ReportMetric,
} from "@/features/finance/data/reporting"
import {
  ReportFilters,
  reportControl,
} from "@/features/finance/components/report-filters"
import { ReportSummary } from "@/features/finance/components/report-summary"
import {
  ReportAmount,
  Variation,
  variation,
} from "@/features/finance/components/report-values"
import {
  ReportEvents,
  ReportObligations,
} from "@/features/finance/components/report-records"
import {
  BillingChart,
  DistributionChart,
} from "@/features/finance/components/financial-charts"
import { PartyAnalysis } from "./party-analysis"
import { DirectionConsultations } from "./direction-consultations"
import {
  answerDirectionQuestion,
  recognizeDirectionIntent,
  directionQueryCatalog,
  directionQueryPreset,
} from "../data/direction-queries"
const views = {
  resumen: "Panorama",
  clientes: "Clientes",
  proveedores: "Proveedores",
  evolucion: "Evolución",
  obligaciones: "Obligaciones",
  consultas: "Consultas (demo)",
}
export function ExecutiveOverview({
  searchParams,
}: {
  searchParams: ReportingSearchParams
}) {
  const { input, ready } = useReportingData(),
    { params, href, change } = useReportingUrl(searchParams, "/gestion")
  const capture = useListContext(ready, href)
  const view =
    params.get("vista") && params.get("vista")! in views
      ? (params.get("vista")! as keyof typeof views)
      : params.get("serie")
        ? params.get("dimension") === "due"
          ? "obligaciones"
          : "evolucion"
        : "resumen"
  const url = (patch: Record<string, string | undefined>, anchor = "") => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    return `/gestion?${next}${anchor}`
  }
  if (
    !hasCapability(input.scenario, "management.read") ||
    input.scenario.id === "client" ||
    params.get("error") === "sin-permiso"
  )
    return (
      <div className="space-y-4">
        <PageHeader title="Dirección" />
        <p role="status">
          Esta vista no confirma si existen registros o métricas. Información de
          Gestión no disponible para esta perspectiva.
        </p>
      </div>
    )
  if (!ready) return <p role="status">Cargando escenario local…</p>
  const effectiveParams = new URLSearchParams(params)
  if (
    view === "consultas" &&
    params.get("pregunta") &&
    !params.get("consultaAplicada")
  ) {
    const resolved = answerDirectionQuestion(
      params.get("pregunta")!,
      input,
      reportingContext(params, input).context,
      params.get("error") === "lectura"
    ).context
    if (resolved) {
      effectiveParams.set("desde", resolved.from)
      effectiveParams.set("hasta", resolved.to)
      effectiveParams.set(
        "periodo",
        directionQueryPreset(
          params.get("pregunta")!,
          reportingContext(params, input).period.preset
        )
      )
      if (resolved.clientId) effectiveParams.set("cliente", resolved.clientId)
    }
  }
  const state = reportingContext(effectiveParams, input)
  const context = {
    ...state.context,
    ...(view === "proveedores" ? { supplierId: state.supplierId } : {}),
    query: ["clientes", "proveedores"].includes(view)
      ? (params.get("buscar") ?? "")
      : "",
    partyScope:
      view === "proveedores" ? ("supplier" as const) : ("client" as const),
  }
  const report = selectExecutiveReport(input, context),
    previous = state.comparePeriod
      ? selectExecutiveReport(input, { ...context, ...state.comparePeriod })
      : undefined
  const metric = canReportMetric(input.scenario, state.metric)
    ? state.metric
    : (Object.keys(reportMetricLabels).find((key) =>
        canReportMetric(input.scenario, key as ReportMetric)
      ) as ReportMetric | undefined)
  const metricHref = (key: ReportMetric, dimension?: string, group?: string) =>
    url(
      { vista: "evolucion", metrica: key, serie: key, dimension, grupo: group },
      "#registros"
    )
  const events = report.events.filter((event) => event.metric === metric)
  const selected = params.get("grupo"),
    dimension = params.get("dimension")
  const records = selected
    ? events.filter((event) =>
        dimension === "month"
          ? event.date.startsWith(selected)
          : dimension === "client"
            ? event.clientIds.length === 1 && event.clientIds[0] === selected
            : dimension === "category"
              ? (event.categoryId || "uncategorized") === selected
              : true
      )
    : events
  const side = params.get("lado") === "pagar" ? "Pagar" : "Cobrar"
  const obligations = report.obligations.filter(
    (row) =>
      row.side === side &&
      (!selected || row.band === selected) &&
      (params.get("vencimiento") === "vencido"
        ? row.band === "Vencido" || row.band === "Sin fecha"
        : params.get("vencimiento") === "proximo"
          ? ["Vence hoy", "Próximos 30 días", "Sin fecha"].includes(row.band)
          : true)
  )
  const error = params.get("error") === "lectura"
  return (
    <div className="space-y-5" onClickCapture={capture}>
      <PageHeader title="Dirección" />
      <nav
        aria-label="Vistas de Dirección"
        className="hidden flex-wrap gap-1 border-b border-border pb-2 sm:flex"
      >
        {Object.entries(views).map(([key, label]) => (
          <Link
            key={key}
            href={url({
              vista: key,
              grupo: undefined,
              dimension: undefined,
              serie: undefined,
              buscar: undefined,
            })}
            aria-current={view === key ? "page" : undefined}
            className={`inline-flex min-h-9 items-center rounded-md px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring ${view === key ? "bg-secondary font-semibold text-primary" : "text-muted-foreground hover:bg-muted"}`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <label className="grid gap-1 text-xs font-medium sm:hidden">
        Vista de Dirección
        <select
          aria-label="Vista de Dirección"
          className={reportControl}
          value={view}
          onChange={(event) =>
            change({
              vista: event.target.value,
              buscar: undefined,
              grupo: undefined,
              dimension: undefined,
            })
          }
        >
          {Object.entries(views).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <ReportFilters
        input={input}
        params={effectiveParams}
        change={(patch) =>
          change({
            ...patch,
            ...(view === "consultas" &&
            "cliente" in patch &&
            recognizeDirectionIntent(params.get("pregunta") ?? "")
              ? {
                  pregunta:
                    directionQueryCatalog[
                      recognizeDirectionIntent(params.get("pregunta")!)!
                    ].example,
                }
              : {}),
            consultaAplicada: view === "consultas" ? "1" : undefined,
          })
        }
        consultations={view === "consultas"}
      />
      {error && view !== "consultas" ? (
        <section role="alert">
          <h2 className="font-semibold">No se pudo leer la fuente</h2>
          <p className="text-sm">
            Se conservaron los filtros. No se muestra un conteo que no pudo
            confirmarse.
          </p>
          <Button
            variant="outline"
            onClick={() => change({ error: undefined })}
          >
            Reintentar lectura
          </Button>
        </section>
      ) : view === "consultas" ? (
        <DirectionConsultations
          input={input}
          context={context}
          question={params.get("pregunta") ?? ""}
          preset={state.period.preset}
          origin={href}
          change={change}
          readError={error}
        />
      ) : report.error ? (
        <p
          id="financial-period-error"
          role="alert"
          className="text-sm text-destructive"
        >
          {report.error}
        </p>
      ) : (
        <>
          {!report.completeHistory && (
            <p role="status" className="text-sm text-muted-foreground">
              Historia sintética disponible desde el 01/05/2026. Los importes
              del período son parciales; no se confirma una variación
              comparable.
            </p>
          )}
          {report.undatedOperations > 0 && (
            <p role="status" className="text-sm text-muted-foreground">
              {report.undatedOperations} operaciones sin fecha explícita de alta
              no se incluyen en los conteos del período. Consultar su existencia
              actual no requiere ese filtro temporal.
            </p>
          )}
          {view === "resumen" && (
            <>
              <ReportSummary
                report={report}
                previous={previous}
                comparable={!!state.comparePeriod?.comparable}
                cut={context.to}
                metricHref={metricHref}
                obligationHref={(key, band) =>
                  url({
                    vista: "obligaciones",
                    lado: key,
                    vencimiento: band,
                    grupo: undefined,
                  })
                }
              />
              <div className="grid min-w-0 gap-4 xl:grid-cols-2">
                {report.totals.invoice && report.totals.receipt && (
                  <BillingChart
                    series={billingSeries(report.events)}
                    currency="USD"
                    drill={(key, dim, group) => metricHref(key, dim, group)}
                  />
                )}
                {report.totals.invoice && (
                  <DistributionChart
                    title="Clientes por facturación"
                    id="billing-clients-title"
                    data={eventBuckets(
                      report.events.filter((row) => row.metric === "invoice"),
                      "client",
                      input.organizations
                    ).slice(0, 5)}
                    currency="USD"
                    href={(key) => metricHref("invoice", "client", key)}
                  />
                )}
              </div>
              <Link
                href={url({ vista: "clientes" })}
                className="inline-flex min-h-11 items-center text-sm text-primary underline"
              >
                Analizar toda la cartera de clientes
              </Link>
            </>
          )}
          {(view === "clientes" || view === "proveedores") && (
            <PartyAnalysis
              input={input}
              context={context}
              params={params}
              change={change}
              origin={href}
              previousContext={
                state.comparePeriod && { ...context, ...state.comparePeriod }
              }
              comparable={
                !!state.comparePeriod?.comparable &&
                report.completeHistory &&
                !!previous?.completeHistory
              }
              suppliers={view === "proveedores"}
            />
          )}
          {view === "evolucion" && (
            <div className="space-y-4">
              <label className="grid w-fit max-w-full gap-1 text-xs font-medium">
                Indicador
                <select
                  aria-label="Indicador"
                  className={reportControl}
                  value={metric ?? ""}
                  onChange={(event) =>
                    change({
                      metrica: event.target.value,
                      grupo: undefined,
                      dimension: undefined,
                    })
                  }
                >
                  {Object.entries(reportMetricLabels)
                    .filter(([key]) =>
                      canReportMetric(input.scenario, key as ReportMetric)
                    )
                    .map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                </select>
              </label>
              {metric ? (
                <>
                  <div className="grid gap-4 xl:grid-cols-2">
                    <DistributionChart
                      title={`${reportMetricLabels[metric]} por mes`}
                      id="report-evolution-title"
                      data={eventBuckets(events, "month", input.organizations)}
                      currency="USD"
                      href={(key) => metricHref(metric, "month", key)}
                    />
                    {metric === "expense" && (
                      <DistributionChart
                        title="Gastos por categoría"
                        id="report-categories-title"
                        data={eventBuckets(
                          events,
                          "category",
                          input.organizations
                        )}
                        currency="USD"
                        href={(key) => metricHref(metric, "category", key)}
                      />
                    )}
                    {previous &&
                      report.completeHistory &&
                      previous.completeHistory &&
                      state.comparePeriod?.comparable &&
                      report.totals[metric]?.complete &&
                      previous.totals[metric]?.complete && (
                        <DistributionChart
                          title={`${reportMetricLabels[metric]} · comparación`}
                          id="report-comparison-title"
                          currency="USD"
                          data={[
                            {
                              key: "current",
                              label: "Período activo",
                              value: report.totals[metric]!.usd!,
                              ids: events.map((event) => event.id),
                            },
                            {
                              key: "previous",
                              label:
                                state.comparison === "year"
                                  ? "Mismo período del año anterior"
                                  : "Período anterior equivalente",
                              value: previous.totals[metric]!.usd!,
                              ids: previous.events
                                .filter((event) => event.metric === metric)
                                .map((event) => event.id),
                            },
                          ]}
                          href={(key) =>
                            key === "current"
                              ? metricHref(metric)
                              : url(
                                  {
                                    vista: "evolucion",
                                    metrica: metric,
                                    desde: state.comparePeriod!.from,
                                    hasta: state.comparePeriod!.to,
                                    periodo: "custom",
                                    grupo: undefined,
                                    dimension: undefined,
                                  },
                                  "#registros"
                                )
                          }
                        />
                      )}
                  </div>
                  <p className="text-sm">
                    {reportMetricLabels[metric]}:{" "}
                    <ReportAmount
                      total={report.totals[metric]}
                      partialHistory={!report.completeHistory}
                    />{" "}
                    {previous && (
                      <Variation
                        value={variation(
                          report.totals[metric],
                          previous.totals[metric],
                          !!state.comparePeriod?.comparable &&
                            previous.completeHistory &&
                            report.completeHistory
                        )}
                      />
                    )}
                  </p>
                  <section
                    id="registros"
                    aria-label="Registros del análisis"
                    className="workspace-surface scroll-mt-20 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="font-semibold">Registros del indicador</h2>
                      {selected && (
                        <Link
                          className="inline-flex min-h-11 items-center text-sm text-primary underline"
                          href={url(
                            {
                              grupo: undefined,
                              dimension: undefined,
                              serie: undefined,
                            },
                            "#registros"
                          )}
                        >
                          Quitar selección del gráfico
                        </Link>
                      )}
                    </div>
                    <ReportEvents
                      input={input}
                      events={records}
                      origin={`${href}#registros`}
                    />
                  </section>
                </>
              ) : (
                <p role="status">
                  Sin indicadores autorizados para esta perspectiva.
                </p>
              )}
            </div>
          )}
          {view === "obligaciones" && (
            <div className="space-y-4">
              <label className="grid w-fit gap-1 text-xs font-medium">
                Cuenta
                <select
                  aria-label="Cuenta"
                  value={side}
                  className={reportControl}
                  onChange={(event) =>
                    change({
                      lado: event.target.value === "Pagar" ? "pagar" : "cobrar",
                      grupo: undefined,
                      vencimiento: undefined,
                    })
                  }
                >
                  {report.receivables && (
                    <option value="Cobrar">Cuentas por cobrar</option>
                  )}
                  {report.payables && (
                    <option value="Pagar">Cuentas por pagar</option>
                  )}
                </select>
              </label>
              <p className="text-sm">
                Saldo al {formatDate(context.to)}:{" "}
                <ReportAmount
                  total={
                    side === "Cobrar" ? report.receivables : report.payables
                  }
                />
                . Los saldos incluyen comprobantes anteriores al período y sus
                aplicaciones al corte; no son flujos del período.
              </p>
              <DistributionChart
                title="Obligaciones por vencimiento"
                id="report-obligations-title"
                data={obligationBuckets(
                  report.obligations.filter((row) => row.side === side)
                )}
                currency="USD"
                href={(key) =>
                  url({ grupo: key, vencimiento: undefined }, "#registros")
                }
              />
              <section
                id="registros"
                className="workspace-surface scroll-mt-20 p-4"
              >
                <h2 className="font-semibold">Obligaciones al corte</h2>
                {(selected || params.get("vencimiento")) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      change({ grupo: undefined, vencimiento: undefined })
                    }
                  >
                    Quitar selección de vencimiento
                  </Button>
                )}
                <ReportObligations
                  input={input}
                  rows={obligations}
                  origin={`${href}#registros`}
                />
              </section>
            </div>
          )}
          {report.events.some((event) => !event.valuation) && (
            <p role="status" className="text-sm text-muted-foreground">
              Hay conversiones pendientes. Los gráficos omiten grupos
              incompletos; los detalles y subtotales indican los registros
              pendientes.
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Datos sintéticos compartidos · corte del escenario{" "}
            {formatDate(DEMONSTRATION_DATE)} · ARS convertido por fecha de
            evento; saldos valorados al corte seleccionado. La política contable
            definitiva está pendiente de validación.
          </p>
        </>
      )}
      <details className="text-sm">
        <summary className="min-h-11 cursor-pointer text-muted-foreground">
          Consultas operativas y fuentes históricas
        </summary>
        <div className="flex flex-wrap gap-4">
          {[
            ["operaciones", "Situación de operaciones"],
            ["trabajo", "Carga y vencimientos"],
            ["economia", "Fuentes y definiciones pendientes"],
          ].map(([key, label]) => (
            <Link
              key={key}
              href={url({ vista: key })}
              className="inline-flex min-h-11 items-center text-primary underline"
            >
              {label}
            </Link>
          ))}
        </div>
      </details>
    </div>
  )
}
