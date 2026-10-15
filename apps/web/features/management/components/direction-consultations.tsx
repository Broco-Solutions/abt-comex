"use client"
import { useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { formatDate, isIsoCalendarDate } from "@workspace/ui/lib/date"
import { hasCapability } from "@/features/demo/data/capabilities"
import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"
import {
  ReportEvents,
  ReportObligations,
} from "@/features/finance/components/report-records"
import { money } from "@/features/finance/data/financial-records"
import {
  canReportMetric,
  type ReportContext,
  type ReportInput,
} from "@/features/finance/data/reporting"
import {
  answerDirectionQuestion,
  directionQueryCatalog,
} from "../data/direction-queries"

export function DirectionConsultations({
  input,
  context,
  question,
  origin,
  change,
  readError = false,
}: {
  input: ReportInput
  context: ReportContext
  question: string
  origin: string
  change: (patch: Record<string, string | undefined>) => void
  readError?: boolean
}) {
  const [draft, setDraft] = useState(question),
    [previous, setPrevious] = useState(question)
  const response = useRef<HTMLElement>(null)
  if (question !== previous) {
    setPrevious(question)
    setDraft(question)
  }
  if (
    input.scenario.id === "client" ||
    !hasCapability(input.scenario, "management.read")
  )
    return (
      <p role="status">
        Esta perspectiva no permite consultar esta información. No se confirma
        la existencia de registros ni métricas.
      </p>
    )
  const answer = question
    ? answerDirectionQuestion(question, input, context, readError, false)
    : undefined
  const sources =
    (answer?.events?.length ?? 0) +
    (answer?.obligations?.length ?? 0) +
    (answer?.operations?.length ?? 0)
  const submit = (text: string, clientId?: string) => {
    // Resolved ranges become visible URL filters; no hidden date interpretation.
    const result = answerDirectionQuestion(
      text,
      input,
      { ...context, clientId: clientId ?? context.clientId },
      readError
    )
    change({
      pregunta: text.trim().slice(0, 500),
      consultaAplicada: "1",
      cliente: result.context?.clientId ?? clientId ?? context.clientId,
      desde: result.context?.from ?? context.from,
      hasta: result.context?.to ?? context.to,
      periodo: "custom",
    })
    requestAnimationFrame(() =>
      response.current?.focus({ preventScroll: true })
    )
  }
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Consultas de Dirección</h2>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Demostración local con datos sintéticos. No consulta sistemas externos
          ni utiliza un proveedor de IA
        </p>
      </div>
      <section className="workspace-surface space-y-3 p-4">
        <form
          className="space-y-2"
          onSubmit={(event) => {
            event.preventDefault()
            if (draft.trim()) submit(draft)
          }}
        >
          <label htmlFor="direction-question" className="text-sm font-medium">
            Tu pregunta
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="direction-question"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={500}
              aria-describedby="direction-question-help"
              className="min-h-11 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
              placeholder="Por ejemplo: ¿Cuánto facturamos en este período?"
            />
            <Button type="submit" disabled={!draft.trim()}>
              Consultar
            </Button>
          </div>
          <p
            id="direction-question-help"
            className="text-xs text-muted-foreground"
          >
            Catálogo acotado: facturación, cobros de un cliente, operaciones,
            saldo abierto de facturas y gastos por categoría. Usá el filtro
            Cliente o su nombre completo. Fechas escritas: entre DD/MM/AAAA y
            DD/MM/AAAA.
          </p>
        </form>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Ejemplos admitidos
          </p>
          <ul className="mt-1 grid gap-1 sm:grid-cols-2">
            {Object.entries(directionQueryCatalog)
              .slice(0, 4)
              .filter(
                ([key, item]) =>
                  hasCapability(input.scenario, item.permission) &&
                  (key !== "expenses" ||
                    canReportMetric(input.scenario, "expense"))
              )
              .map(([key, item]) => (
                <li key={key}>
                  <button
                    type="button"
                    className="min-h-11 w-full rounded-md px-2 py-1 text-left text-sm text-primary underline underline-offset-2 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                    onClick={() => {
                      setDraft(item.example)
                      submit(item.example)
                    }}
                  >
                    {{
                      ranking: "Principales clientes por facturación",
                      billing: "Facturación del período",
                      clientBilling: "Facturación de un cliente",
                      receipts: "Cobros de un cliente",
                    }[key] ?? item.example}
                  </button>
                </li>
              ))}
          </ul>
          <details>
            <summary className="min-h-9 cursor-pointer text-sm text-muted-foreground">
              Otros ejemplos
            </summary>
            <ul>
              {Object.entries(directionQueryCatalog)
                .slice(4)
                .filter(
                  ([key, item]) =>
                    hasCapability(input.scenario, item.permission) &&
                    (key !== "expenses" ||
                      canReportMetric(input.scenario, "expense"))
                )
                .map(([key, item]) => (
                  <li key={key}>
                    <button
                      type="button"
                      className="min-h-11 rounded-md px-2 text-left text-sm text-primary underline focus-visible:outline-2 focus-visible:outline-ring"
                      onClick={() => {
                        setDraft(item.example)
                        submit(item.example)
                      }}
                    >
                      {item.example}
                    </button>
                  </li>
                ))}
            </ul>
          </details>
        </div>
      </section>
      <section
        ref={response}
        tabIndex={-1}
        aria-label="Respuesta a la consulta"
        className="workspace-surface space-y-3 p-4 focus-visible:outline-2 focus-visible:outline-ring"
      >
        <div aria-live="polite" aria-atomic="true">
          <h3 className="text-sm font-semibold">
            {answer
              ? answer.status === "ok"
                ? "Respuesta"
                : {
                    unsupported: "Pregunta no admitida",
                    clarification: "Necesito una aclaración",
                    "ambiguous-client": "Cliente ambiguo",
                    "invalid-date": "Fecha inválida",
                    empty: "Período sin registros",
                    incomplete: "Datos incompletos",
                    "missing-rate": "Referencia de cambio pendiente",
                    "read-error": "Error de lectura",
                    forbidden: "Sin permiso",
                  }[answer.status]
              : "Hacé una consulta"}
          </h3>
          <p className="mt-1 text-sm">
            {answer?.message ??
              "Elegí un ejemplo o escribí una variante sobre los indicadores admitidos."}
          </p>
        </div>
        {answer?.options && (
          <div className="flex flex-wrap gap-2">
            {answer.options.map((option) => (
              <Button
                key={option.label}
                variant="outline"
                size="sm"
                onClick={() => submit(option.question, option.clientId)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        )}
        {answer?.status === "read-error" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => change({ error: undefined })}
          >
            Reintentar lectura
          </Button>
        )}
        {answer?.ranking && (
          <ol
            className="divide-y divide-border"
            aria-label={
              answer.intent === "ranking"
                ? "Clientes por facturación USD descendente"
                : "Gastos por categoría USD"
            }
          >
            {answer.ranking.map((row) => (
              <li
                key={row.key}
                className="flex justify-between gap-3 py-2 text-sm"
              >
                <span className="min-w-0">{row.label}</span>
                <span className="shrink-0 font-mono">
                  {money(row.value, "USD")}
                </span>
              </li>
            ))}
          </ol>
        )}
        {answer?.intent && answer.status !== "forbidden" && (
          <div className="space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
            <p>{directionQueryCatalog[answer.intent].definition}</p>
            <p>
              Fecha aplicable: {directionQueryCatalog[answer.intent].date}.{" "}
              {sources} registros de respaldo. Fuente: registros sintéticos
              compartidos de Administración y Operaciones.
            </p>
            <p>
              Corte y actualización del escenario:{" "}
              {formatDate(DEMONSTRATION_DATE)}.{" "}
              {answer.context &&
                isIsoCalendarDate(answer.context.from) &&
                isIsoCalendarDate(answer.context.to) && (
                  <>
                    Rango efectivo: {formatDate(answer.context.from)}–
                    {formatDate(answer.context.to)}.
                  </>
                )}
            </p>
            {sources > 0 && (
              <a
                href="#registros-consulta"
                className="inline-flex min-h-11 items-center text-sm text-primary underline"
              >
                Ver registros
              </a>
            )}
          </div>
        )}
      </section>
      {answer && sources > 0 && (
        <section
          id="registros-consulta"
          className="workspace-surface scroll-mt-20 space-y-3 p-4"
          aria-label="Registros que explican la consulta"
        >
          <h3 className="font-semibold">Registros de la consulta</h3>
          <p className="text-xs text-muted-foreground">
            Esta población es exactamente la utilizada en la respuesta. Cada
            ficha conserva el retorno a esta pregunta y sus filtros.
          </p>
          {answer.events && (
            <ReportEvents
              events={answer.events}
              input={input}
              origin={`${origin}#registros-consulta`}
            />
          )}
          {answer.obligations && (
            <ReportObligations
              rows={answer.obligations}
              input={input}
              origin={`${origin}#registros-consulta`}
            />
          )}
          {answer.operations && (
            <ul className="divide-y divide-border">
              {answer.operations.map((operation) => (
                <li key={operation.id} className="py-2 text-sm">
                  <Link
                    href={`/operaciones/${operation.id}?returnTo=${encodeURIComponent(origin + "#registros-consulta")}`}
                    className="inline-flex min-h-11 items-center text-primary underline"
                  >
                    {operation.reference} · {operation.kind}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <details className="text-xs text-muted-foreground">
            <summary className="min-h-9 cursor-pointer font-medium">
              Método y referencias de cambio
            </summary>
            <p>
              ARS: referencia sintética vigente a la fecha de cada evento; los
              saldos se valoran a Hasta. USD conserva su valor. Cálculo
              compartido en micro-USD, redondeo sólo al presentar; la política
              contable definitiva está pendiente de ABT.
            </p>
            {[...(answer.events ?? []), ...(answer.obligations ?? [])].map(
              (row) => (
                <p key={row.id} className="mt-2">
                  {row.reference}:{" "}
                  {row.valuation
                    ? row.valuation.rate
                      ? `${row.valuation.rate.id} · revisión ${row.valuation.rate.revision} · vigente desde ${formatDate(row.valuation.rate.effectiveOn)} · ${row.valuation.rate.arsPerUsd} ARS/USD · valoración ${formatDate(row.valuation.valuedOn)} · ${row.valuation.rate.source}`
                      : "Original USD · sin conversión"
                    : "Valoración pendiente; revisar importe, saldo y referencia de cambio"}
                  .
                </p>
              )
            )}
          </details>
        </section>
      )}
    </div>
  )
}
