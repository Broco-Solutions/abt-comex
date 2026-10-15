"use client"

import { formatRecordedDate } from "@workspace/ui/lib/date"

import Link from "next/link"
import { ArrowLeft, ArrowRight, CircleAlert, ChevronDown } from "lucide-react"

import { PageHeader } from "@/components/navigation/page-header"
import { Badge } from "@workspace/ui/components/badge"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { demonstrationClients } from "@/features/clients/data/clients"

import {
  calculateQuoteTotal,
  formatQuoteAmount,
  getCurrentQuoteVersion,
  quoteStatus,
  transitionDemoQuote,
} from "../data/quotes"
import { useDemoQuotes } from "../state/use-demo-quotes"

type SearchParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

function safeReturnTo(value: string) {
  if (
    /^\/(?:mi-trabajo|cotizaciones|operaciones\/op-demo-\d{4})(\?[^#]*)?(#.*)?$/.test(
      value
    )
  )
    return value
  return "/cotizaciones"
}

export function QuoteDetail({
  quoteId,
  searchParams,
}: {
  quoteId: string
  searchParams: SearchParams
}) {
  const { quotes, ready, updateQuotes } = useDemoQuotes()
  const error = first(searchParams.error)
  const returnTo = safeReturnTo(first(searchParams.returnTo))
  const returnLabel = returnTo.startsWith("/operaciones/")
    ? "Volver a la operación"
    : returnTo.startsWith("/mi-trabajo")
      ? "Volver a Mi trabajo"
      : "Volver a Cotizaciones"

  if (error === "sin-permiso") {
    return (
      <section
        className="max-w-3xl space-y-3"
        aria-labelledby="quote-unavailable-title"
      >
        <PageHeader title="Cotización no disponible" />
        <p
          id="quote-unavailable-title"
          className="text-sm text-muted-foreground"
        >
          Este escenario no tiene capacidad comercial autorizada para mostrar.
          No se confirma si existe el registro.
        </p>
        <Link
          href="/cotizaciones"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Volver a Cotizaciones
        </Link>
      </section>
    )
  }

  if (error === "lectura") {
    return (
      <section
        className="max-w-3xl space-y-3"
        aria-labelledby="quote-read-error-title"
      >
        <PageHeader title="No se pudo leer el escenario" />
        <p
          id="quote-read-error-title"
          role="alert"
          className="text-sm text-muted-foreground"
        >
          No se confirma ningún dato de la cotización. Los cambios locales
          previos se conservan en esta pestaña.
        </p>
        <Link
          href={returnTo}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Volver a Cotizaciones
        </Link>
      </section>
    )
  }

  const quote = ready ? quotes.find((item) => item.id === quoteId) : undefined
  if (!ready)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Cargando escenario local…
      </p>
    )
  if (!quote) {
    return (
      <section className="max-w-3xl space-y-3">
        <PageHeader title="Cotización no disponible" />
        <p className="text-sm text-muted-foreground">
          No hay información autorizada para este contexto.
        </p>
        <Link
          href="/cotizaciones"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Volver a Cotizaciones
        </Link>
      </section>
    )
  }

  const currentVersion = getCurrentQuoteVersion(quote)
  const requestedVersion = first(searchParams.version)
  const version = requestedVersion
    ? quote.versions.find((item) => String(item.number) === requestedVersion)
    : currentVersion
  if (!version)
    return (
      <section className="space-y-3">
        <PageHeader title="Versión no disponible" />
        <p role="status" className="text-sm">
          No existe esa versión en el contexto autorizado.
        </p>
        <Link
          href={`/cotizaciones/${quote.id}`}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Ver versión vigente
        </Link>
      </section>
    )
  const historical = version.number !== currentVersion.number
  const workflow = version.workflow
  const client = demonstrationClients.find((item) => item.id === quote.clientId)
  const currentTotal = calculateQuoteTotal(version.lines)
  const hasAcceptedResponse = workflow.clientResponse === "Aceptación simulada"
  const currentQuoteId = quote.id

  function applyAction(action: "approve" | "send" | "accept" | "reject") {
    if (historical) return
    updateQuotes((current) =>
      current.map((item) => {
        if (item.id !== currentQuoteId) return item
        return transitionDemoQuote(item, action) ?? item
      })
    )
  }

  return (
    <div className="space-y-6">
      <Link
        href={returnTo}
        className="inline-flex min-h-9 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> {returnLabel}
      </Link>

      <PageHeader
        title={quote.reference}
        eyebrow={`Versión ${version.number}${historical ? " · histórica, sólo lectura" : " · vigente"}`}
        status={
          <Badge variant="outline">
            {quoteStatus({ ...quote, versions: [version] })}
          </Badge>
        }
        secondaryActions={
          <Link
            href={
              historical
                ? `/cotizaciones/${quote.id}?returnTo=${encodeURIComponent(returnTo)}`
                : `/cotizaciones/${quote.id}/editar`
            }
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            {historical ? "Ver versión vigente" : "Crear versión"}
          </Link>
        }
      />

      <section
        aria-labelledby="quote-summary-title"
        className="max-w-6xl border-y border-border py-4"
      >
        <h2 id="quote-summary-title" className="text-base font-semibold">
          Contexto comercial
        </h2>
        <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">Cliente</dt>
            <dd className="mt-1 font-medium">
              <Link
                href={`/clientes/${quote.clientId}?returnTo=${encodeURIComponent(`/cotizaciones/${quote.id}?returnTo=${encodeURIComponent(returnTo)}`)}`}
                className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
              >
                {client?.name ?? "Cliente de referencia no disponible"}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Servicio</dt>
            <dd className="mt-1 font-medium">{version.service}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Responsable de referencia
            </dt>
            <dd className="mt-1 font-medium">{quote.responsible}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Fuente y actualización
            </dt>
            <dd className="mt-1 font-medium">
              Fixture local · {formatRecordedDate(version.updatedOn)}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-muted-foreground">{version.context}</p>
      </section>

      <section
        aria-labelledby="quote-workflow-title"
        className="max-w-6xl border-y border-border py-4"
      >
        <div className="flex items-start gap-3">
          <CircleAlert
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-primary"
          />
          <div>
            <h2 id="quote-workflow-title" className="font-semibold">
              Secuencia de esta versión
            </h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted-foreground">
                  Aprobación interna
                </dt>
                <dd className="mt-1 text-sm font-medium">
                  {workflow.internalApproval}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  Envío al cliente
                </dt>
                <dd className="mt-1 text-sm font-medium">{workflow.send}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  Respuesta del cliente
                </dt>
                <dd className="mt-1 text-sm font-medium">
                  {workflow.clientResponse}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            disabled={
              historical ||
              workflow.internalApproval !== "Pendiente" ||
              workflow.send !== "No enviado"
            }
            onClick={() => applyAction("approve")}
          >
            Simular aprobación interna
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={
              historical ||
              workflow.internalApproval !== "Aprobación simulada" ||
              workflow.send !== "No enviado"
            }
            onClick={() => applyAction("send")}
          >
            Simular envío local
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={
              historical ||
              workflow.send !== "Envío simulado" ||
              workflow.clientResponse !== "Sin respuesta"
            }
            onClick={() => applyAction("accept")}
          >
            Simular aceptación del cliente
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={
              historical ||
              workflow.send !== "Envío simulado" ||
              workflow.clientResponse !== "Sin respuesta"
            }
            onClick={() => applyAction("reject")}
          >
            Simular rechazo del cliente
          </Button>
        </div>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Estas acciones sólo cambian la sesión local. No aprueban, envían
          mensajes ni registran respuestas reales; los niveles de aprobación,
          evidencia y capacidades requieren validación de ABT.
        </p>
      </section>

      <section aria-labelledby="quote-lines-title" className="max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
          <div>
            <h2 id="quote-lines-title" className="font-semibold">
              Versión {version.number} · líneas y cálculo
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Cálculo: suma de cantidad × precio unitario, sin otros conceptos.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Moneda: {version.currency} · valores enteros sintéticos
          </p>
        </div>
        <ul
          aria-label="Líneas de la cotización"
          className="divide-y divide-border"
        >
          {version.lines.map((line) => (
            <li
              key={line.id}
              className="grid gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_6rem_10rem_10rem] sm:items-center"
            >
              <p className="font-medium">{line.description}</p>
              <p className="text-sm">Cantidad: {line.quantity}</p>
              <p className="text-sm sm:text-right">
                Unitario: {formatQuoteAmount(line.unitPrice, version.currency)}
              </p>
              <p className="text-sm font-medium sm:text-right">
                Subtotal:{" "}
                {formatQuoteAmount(
                  line.quantity * line.unitPrice,
                  version.currency
                )}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-border py-3">
          <p className="text-sm text-muted-foreground">
            Total de la versión · {version.currency}
          </p>
          <p className="text-lg font-semibold">
            {formatQuoteAmount(currentTotal, version.currency)}
          </p>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          No hay conversión monetaria, descuentos, impuestos, gastos ni redondeo
          configurado. Esas reglas siguen pendientes de validación comercial.
        </p>
      </section>

      <section
        aria-labelledby="quote-conditions-title"
        className="max-w-6xl border-y border-border py-4"
      >
        <h2 id="quote-conditions-title" className="font-semibold">
          Condiciones registradas en esta versión
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {version.conditions || "Sin condición cargada en este escenario."}
        </p>
      </section>

      <section aria-labelledby="quote-version-title" className="max-w-6xl">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
            <ChevronDown
              aria-hidden="true"
              className="size-4 shrink-0 transition-transform group-open:rotate-180"
            />
            <h2
              id="quote-version-title"
              className="border-b border-border pb-3 font-semibold"
            >
              Historial de versiones
            </h2>
          </summary>
          <div className="mt-3 space-y-3">
            <ol className="divide-y divide-border">
              {[...quote.versions]
                .sort((left, right) => right.number - left.number)
                .map((historical) => (
                  <li
                    key={historical.number}
                    className="grid gap-2 py-3 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:items-center"
                  >
                    <Link
                      className="font-medium text-primary underline underline-offset-4"
                      href={`/cotizaciones/${quote.id}?version=${historical.number}&returnTo=${encodeURIComponent(returnTo)}`}
                    >
                      Versión {historical.number}
                    </Link>
                    <div>
                      <p className="text-sm">
                        {historical.service} ·{" "}
                        {formatQuoteAmount(
                          calculateQuoteTotal(historical.lines),
                          historical.currency
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {historical.workflow.internalApproval} ·{" "}
                        {historical.workflow.send} · respuesta:{" "}
                        {historical.workflow.clientResponse}
                      </p>
                    </div>
                    <time
                      className="text-xs text-muted-foreground"
                      dateTime={historical.updatedOn}
                    >
                      {formatRecordedDate(historical.updatedOn)}
                    </time>
                  </li>
                ))}
            </ol>
            <p className="mt-2 text-xs text-muted-foreground">
              Una nueva edición crea una versión y conserva las anteriores. El
              historial local no equivale a auditoría productiva.
            </p>
          </div>
        </details>
      </section>

      <section aria-labelledby="quote-conversion-title" className="max-w-6xl">
        <h2 id="quote-conversion-title" className="font-semibold">
          Continuidad hacia Operaciones
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          La apertura desde cotización requiere la aceptación del cliente en una
          versión específica. También se admite alta directa y no se presupone
          cardinalidad uno a uno.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {hasAcceptedResponse ? (
            <Link
              href={`/operaciones/nueva?cotizacion=${encodeURIComponent(quote.id)}&version=${version.number}&returnTo=${encodeURIComponent(`/cotizaciones/${quote.id}?returnTo=${encodeURIComponent(returnTo)}`)}`}
              className={cn(buttonVariants({ size: "sm" }))}
              aria-describedby="quote-conversion-note"
            >
              Crear operación desde esta versión{" "}
              <ArrowRight aria-hidden="true" />
            </Link>
          ) : (
            <Button
              type="button"
              disabled
              aria-describedby="quote-conversion-note"
            >
              Crear operación desde esta versión{" "}
              <ArrowRight aria-hidden="true" />
            </Button>
          )}
          <Link
            href="/operaciones"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Abrir Operaciones
          </Link>
        </div>
        <p
          id="quote-conversion-note"
          className="mt-2 text-xs text-muted-foreground"
        >
          {hasAcceptedResponse
            ? "La apertura local conserva la versión aceptada como origen; no marca la cotización como consumida ni limita cuántas operaciones pueden relacionarse."
            : "El alta desde cotización requiere una versión con aceptación simulada del cliente; también podés iniciar una operación directa."}
        </p>
      </section>
    </div>
  )
}
