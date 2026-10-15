"use client"

import { formatRecordedDate } from "@workspace/ui/lib/date"

import Link from "next/link"
import { DocumentsPanel } from "@/features/documents/components/documents-panel"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { ArrowLeft, CircleAlert, ShieldCheck, ChevronDown } from "lucide-react"

import { PageHeader } from "@/components/navigation/page-header"
import { AssistedQueries } from "@/features/assisted/components/assisted-queries"
import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import { demonstrationOperations } from "../data/operations"
import { useDemoOperations } from "../state/use-demo-operations"
import type { DemonstrationOperation } from "../types/operation"

type SearchParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

function safeReturnTo(
  value: string,
  operations: DemonstrationOperation[] = demonstrationOperations
) {
  if (
    /^\/administracion\/(?:gastos|movimientos|rendiciones|comprobantes)\/[a-z0-9-]+(?:\?[^#]*)?(?:#.*)?$/.test(
      value
    )
  )
    return value
  if (
    !/^\/(tramites\/djve|operaciones|mi-trabajo|clientes|proveedores|cotizaciones|administracion|gestion|inicio)(?:\/[a-z0-9-]+)?(\?.*)?(#.*)?$/.test(
      value
    )
  ) {
    return "/operaciones"
  }
  const operationId = /^\/operaciones\/([^/?#]+)/.exec(value)?.[1]
  if (
    operationId &&
    !operations.some((operation) => operation.id === operationId)
  )
    return "/operaciones"
  return value
}

export function OperationDetail({
  operationId,
  searchParams,
}: {
  operationId: string
  searchParams: SearchParams
}) {
  const { operations, ready } = useDemoOperations()
  const { scenario } = useScenario()
  const restricted = first(searchParams.error) === "sin-permiso"
  if (restricted) {
    return (
      <section
        className="max-w-3xl space-y-3"
        aria-labelledby="restricted-title"
      >
        <PageHeader title="Operación no disponible" />
        <p id="restricted-title" className="text-sm text-muted-foreground">
          Este escenario no tiene información autorizada para mostrar. No se
          confirma si la referencia existe.
        </p>
        <Link
          href="/operaciones"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Volver a Operaciones
        </Link>
      </section>
    )
  }

  if (!ready)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Cargando escenario local…
      </p>
    )

  const operation = operations.find((item) => item.id === operationId)
  if (!operation) {
    return (
      <section className="max-w-3xl space-y-3">
        <PageHeader title="Operación no disponible" />
        <p className="text-sm text-muted-foreground">
          No hay información autorizada para este contexto.
        </p>
        <Link
          href="/operaciones"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Volver a Operaciones
        </Link>
      </section>
    )
  }

  const returnTo = safeReturnTo(first(searchParams.returnTo), operations)
  const returnLabel = returnTo.startsWith("/tramites/djve")
    ? "Volver a DJVE"
    : returnTo.startsWith("/mi-trabajo")
      ? "Volver a Mi trabajo"
      : returnTo.startsWith("/clientes/")
        ? "Volver al cliente"
        : returnTo.startsWith("/gestion")
          ? "Volver al análisis"
          : returnTo.startsWith("/administracion")
            ? "Volver a Administración"
            : "Volver a resultados"

  return (
    <div className="space-y-6">
      <Link
        href={returnTo}
        className="inline-flex min-h-9 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        {returnLabel}
      </Link>

      <PageHeader
        title={operation.reference}
        secondaryActions={
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/operaciones?tipo=${operation.kind === "Importación" ? "importacion" : "exportacion"}`}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Ver{" "}
              {operation.kind === "Importación"
                ? "Importaciones"
                : "Exportaciones"}
            </Link>
            {operation.kind === "Importación" ? (
              <Link
                href={`/operaciones/${operation.id}/importacion?returnTo=${encodeURIComponent(`/operaciones/${operation.id}?returnTo=${encodeURIComponent(returnTo)}`)}`}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Abrir espacio de Importación
              </Link>
            ) : (
              <Link
                href={`/operaciones/${operation.id}/exportacion?returnTo=${encodeURIComponent(`/operaciones/${operation.id}?returnTo=${encodeURIComponent(returnTo)}`)}`}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Abrir espacio de Exportación
              </Link>
            )}
            {scenario.financial ? (
              <Link
                href={`/administracion/${operation.id}?returnTo=${encodeURIComponent(`/operaciones/${operation.id}?returnTo=${encodeURIComponent(returnTo)}`)}`}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Ver contexto administrativo
              </Link>
            ) : null}
          </div>
        }
      />

      <section
        aria-label="Identidad y situación de la operación"
        className="space-y-4 border-y border-border py-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{operation.kind}</Badge>
          <Badge
            variant={
              operation.alert === "Bloqueo" ? "destructive" : "secondary"
            }
          >
            {operation.situation}
          </Badge>
          {operation.alert !== "Sin alerta" ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <CircleAlert aria-hidden="true" className="size-4" />
              {operation.alert}
            </span>
          ) : null}
        </div>
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">Cliente</dt>
            <dd className="mt-1 font-medium">
              <Link
                href={`/clientes/${operation.clientId}?returnTo=${encodeURIComponent(`/operaciones/${operation.id}?returnTo=${encodeURIComponent(returnTo)}`)}`}
                className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
              >
                {operation.client}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Responsable de referencia
            </dt>
            <dd className="mt-1 font-medium">{operation.responsible}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Modalidad</dt>
            <dd className="mt-1 font-medium">{operation.modality}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Actualización del escenario
            </dt>
            <dd className="mt-1 font-medium">
              <time dateTime={operation.updatedOn}>
                {formatRecordedDate(operation.updatedOn)}
              </time>
            </dd>
          </div>
        </dl>
      </section>

      {operation.origin ? (
        <section
          aria-labelledby="operation-origin-title"
          className="max-w-4xl border-l-2 border-muted pl-4"
        >
          <h2 id="operation-origin-title" className="text-sm font-semibold">
            Origen de apertura
          </h2>
          {operation.origin.type === "accepted-quote" ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Desde{" "}
              {scenario.commercial ? (
                <Link
                  className="underline-offset-4 hover:underline"
                  href={`/cotizaciones/${operation.origin.quoteId}?version=${operation.origin.quoteVersion}&returnTo=${encodeURIComponent("/operaciones/" + operation.id + "?returnTo=" + encodeURIComponent(returnTo))}`}
                >
                  {operation.origin.quoteReference} · versión{" "}
                  {operation.origin.quoteVersion}
                </Link>
              ) : (
                "antecedente comercial"
              )}
              .
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Alta directa desde escenario local, sin cotización de origen.
            </p>
          )}
          {operation.initialContext ? (
            <p className="mt-2 text-sm">{operation.initialContext}</p>
          ) : null}
        </section>
      ) : null}

      <section
        aria-labelledby="next-step-title"
        className="max-w-4xl rounded-md border border-border p-4"
      >
        <h2 id="next-step-title" className="text-base font-semibold">
          Próximo paso
        </h2>
        <p className="mt-2">{operation.nextAction}</p>
      </section>

      <section
        aria-labelledby="source-title"
        className="max-w-4xl border-l-2 border-muted pl-4"
      >
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
            <ChevronDown
              aria-hidden="true"
              className="size-4 shrink-0 transition-transform group-open:rotate-180"
            />
            <h2 id="source-title" className="text-sm font-semibold">
              Procedencia y actualidad
            </h2>
          </summary>
          <div className="mt-3 space-y-3">
            <p className="mt-1 text-sm text-muted-foreground">
              Escenario sintético local · última actualización del registro:{" "}
              {formatRecordedDate(operation.updatedOn)}. Alpha2000 no está
              conectada; no se consultaron fuentes externas.
            </p>
          </div>
        </details>
      </section>

      <DocumentsPanel operationId={operation.id} />
      <div className="grid gap-4 xl:grid-cols-2">
        <section
          aria-labelledby="controls-title"
          className="space-y-3 border-t border-border pt-4"
        >
          <h2
            id="controls-title"
            className="flex items-center gap-2 font-semibold"
          >
            <ShieldCheck aria-hidden="true" className="size-4" />
            Controles y seguimiento
          </h2>
          <p className="text-sm text-muted-foreground">
            {operation.kind === "Importación"
              ? "El doble control previo a oficialización requiere dos personas distintas."
              : "El espacio de Exportación reúne controles, permisos, DJVE, hitos y custodia documental."}
          </p>
        </section>
      </div>

      <AssistedQueries
        operation={{
          id: operation.id,
          reference: operation.reference,
          kind: operation.kind,
          situation: operation.situation,
          updatedOn: operation.updatedOn,
          nextAction: operation.nextAction,
        }}
      />
    </div>
  )
}

export { safeReturnTo }
