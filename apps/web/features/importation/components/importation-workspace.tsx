"use client"

import Link from "next/link"
import { DocumentsPanel } from "@/features/documents/components/documents-panel"
import { useState } from "react"
import { ArrowLeft, CircleAlert, ShieldCheck, ChevronDown } from "lucide-react"

import { PageHeader } from "@/components/navigation/page-header"
import { Badge } from "@workspace/ui/components/badge"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { DemonstrationOperation } from "@/features/operations/types/operation"
import { useDemoOperations } from "@/features/operations/state/use-demo-operations"

import { canCompleteDoubleControl } from "../data/importation-scenarios"
import { useImportationScenario } from "../state/use-importation-scenario"
import {
  demonstrationReviewers,
  type DemonstrationReviewerId,
} from "../types/importation"

type SearchParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

function operationReturn(
  operationId: string,
  returnTo: string,
  operations: DemonstrationOperation[]
) {
  const operationExists = operations.some((item) => item.id === operationId)
  if (!operationExists) return "/operaciones"
  const expectedPrefix = `/operaciones/${operationId}`
  if (returnTo === expectedPrefix) return expectedPrefix
  const nestedReturn = returnTo.startsWith(`${expectedPrefix}?returnTo=`)
    ? new URLSearchParams(
        `returnTo=${returnTo.slice(expectedPrefix.length + 10)}`
      ).get("returnTo")
    : null
  return nestedReturn &&
    /^\/(operaciones|mi-trabajo|clientes)(?:\/|\?|$)/.test(nestedReturn)
    ? returnTo
    : expectedPrefix
}

export function ImportationWorkspace({
  operationId,
  searchParams,
}: {
  operationId: string
  searchParams: SearchParams
}) {
  const { operations, ready: operationsReady } = useDemoOperations()
  const {
    scenario,
    ready: scenarioReady,
    updateDoubleControl,
  } = useImportationScenario(operationId)
  const [firstReviewer, setFirstReviewer] = useState<
    DemonstrationReviewerId | ""
  >("")
  const [secondReviewer, setSecondReviewer] = useState<
    DemonstrationReviewerId | ""
  >("")
  const [message, setMessage] = useState("")
  const restricted = first(searchParams.error) === "sin-permiso"

  if (restricted) {
    return (
      <section className="max-w-3xl space-y-3">
        <PageHeader title="Importación no disponible" />
        <p className="text-sm text-muted-foreground">
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

  if (!operationsReady || !scenarioReady)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Cargando escenario local…
      </p>
    )

  const operation = operations.find((item) => item.id === operationId)
  if (!operation || operation.kind !== "Importación") {
    return (
      <section className="max-w-3xl space-y-3">
        <PageHeader title="Importación no disponible" />
        <p className="text-sm text-muted-foreground">
          No hay información autorizada de Importación para este contexto.
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

  const returnTo = operationReturn(
    operationId,
    first(searchParams.returnTo),
    operations
  )
  const isControlComplete = scenario.doubleControl.completed

  function registerDemonstrationControl() {
    const control = {
      firstReviewer,
      secondReviewer,
      completed: true,
    }
    if (!canCompleteDoubleControl(control)) {
      setMessage("Elegí dos personas diferentes para este escenario.")
      return
    }
    updateDoubleControl(control)
    setMessage("Control de demostración registrado en esta sesión local.")
  }

  function resetDemonstrationControl() {
    updateDoubleControl({
      firstReviewer: "",
      secondReviewer: "",
      completed: false,
    })
    setFirstReviewer("")
    setSecondReviewer("")
    setMessage("El control local volvió al estado pendiente.")
  }

  return (
    <div className="space-y-6">
      <Link
        href={returnTo}
        className="inline-flex min-h-9 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Volver a la operación
      </Link>

      <PageHeader
        title={`Importación · ${operation.reference}`}
        secondaryActions={
          <Link
            href={`/operaciones/${operation.id}?returnTo=${encodeURIComponent(returnTo)}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Ficha de Operación
          </Link>
        }
      />

      <section
        aria-label="Contexto de la operación"
        className="border-y border-border py-4"
      >
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">Cliente</dt>
            <dd className="mt-1 font-medium">{operation.client}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Modalidad</dt>
            <dd className="mt-1 font-medium">{operation.modality}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Responsable de referencia
            </dt>
            <dd className="mt-1 font-medium">{operation.responsible}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Fuente aduanera</dt>
            <dd className="mt-1 font-medium">
              <span>Alpha2000 / MARÍA</span> · <span>No conectada</span>
            </dd>
          </div>
        </dl>
      </section>

      <section
        aria-labelledby="import-control-title"
        className="max-w-5xl space-y-4 border-l-2 border-destructive pl-4"
      >
        <div className="flex items-start gap-2">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 size-5 text-destructive"
          />
          <div>
            <h2 id="import-control-title" className="font-semibold">
              Doble control previo a oficialización
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              La regla documentada exige dos personas distintas. El control
              siguiente sólo demuestra la barrera en datos locales; no registra
              una revisión real ni habilita oficialización.
            </p>
          </div>
        </div>

        {isControlComplete ? (
          <div role="status" className="space-y-3 rounded-md border p-3">
            <p className="font-medium">
              Doble control completado en el escenario local
            </p>
            <p className="text-sm text-muted-foreground">
              {
                demonstrationReviewers.find(
                  (person) => person.id === scenario.doubleControl.firstReviewer
                )?.label
              }{" "}
              y{" "}
              {
                demonstrationReviewers.find(
                  (person) =>
                    person.id === scenario.doubleControl.secondReviewer
                )?.label
              }
              . No es una aprobación, auditoría ni autorización operativa.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetDemonstrationControl}
            >
              Reiniciar escenario de control
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium">
              Primera persona de demostración
              <select
                value={firstReviewer}
                onChange={(event) => {
                  const value = event.target.value as
                    | DemonstrationReviewerId
                    | ""
                  setFirstReviewer(value)
                  if (value && secondReviewer === value) setSecondReviewer("")
                  setMessage("")
                }}
                className="h-10 rounded-md border border-input bg-background px-3"
              >
                <option value="">Seleccionar persona</option>
                {demonstrationReviewers.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-medium">
              Segunda persona de demostración
              <select
                value={secondReviewer}
                onChange={(event) => {
                  setSecondReviewer(
                    event.target.value as DemonstrationReviewerId | ""
                  )
                  setMessage("")
                }}
                className="h-10 rounded-md border border-input bg-background px-3"
              >
                <option value="">Seleccionar persona diferente</option>
                {demonstrationReviewers
                  .filter((person) => person.id !== firstReviewer)
                  .map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.label}
                    </option>
                  ))}
              </select>
            </label>
            <div className="space-y-2 md:col-span-2">
              <Button
                type="button"
                onClick={registerDemonstrationControl}
                disabled={
                  !canCompleteDoubleControl({
                    firstReviewer,
                    secondReviewer,
                    completed: false,
                  })
                }
              >
                Registrar control de demostración
              </Button>
              {message ? (
                <p role="alert" className="text-sm text-destructive">
                  {message}
                </p>
              ) : null}
            </div>
          </div>
        )}

        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          La preparación y oficialización aduanera permanecen en
          Alpha2000/MARÍA; el prototipo no las ejecuta.
        </p>
      </section>

      <DocumentsPanel operationId={operation.id} />

      <section aria-labelledby="import-stage-title" className="max-w-5xl">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="import-stage-title" className="font-semibold">
            Seguimiento por etapas
          </h2>
          <Badge variant="outline">Definiciones parciales</Badge>
        </div>
        <ol className="mt-3 divide-y divide-border border-y border-border">
          <li className="grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <span className="text-sm font-medium">Clasificación inicial</span>
            <span className="text-sm text-muted-foreground">
              Tipo, Cliente y modalidad se reutilizan. Mercadería, origen,
              destinos y requisitos aplicables requieren definición.
            </span>
          </li>
          <li className="grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <span className="text-sm font-medium">Pre-embarque</span>
            <span className="text-sm text-muted-foreground">
              No hay un checklist universal configurado. Documentación y
              vencimientos dependen del caso; esta vista no afirma que falten
              documentos en ABT.
            </span>
          </li>
          <li className="grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <span className="text-sm font-medium">Preparación provisoria</span>
            <span className="text-sm text-muted-foreground">
              La preparación aduanera continúa en Alpha2000/MARÍA. No se
              muestran valores aduaneros ni se duplica esa preparación aquí.
            </span>
          </li>
          <li className="grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <span className="text-sm font-medium">Arribo y seguimiento</span>
            <span className="text-sm text-muted-foreground">
              Arribo/ETA, oficialización, canal, intervenciones y liberación:
              sin consulta conectada; no hay estado externo confirmado.
            </span>
          </li>
          <li className="grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <span className="text-sm font-medium">Cierre y Administración</span>
            <span className="text-sm text-muted-foreground">
              El criterio de carpeta completa y aceptación del pase está
              pendiente; no se crea un handoff ni se marca cerrado.
            </span>
          </li>
        </ol>
      </section>

      <section
        aria-labelledby="import-source-title"
        className="max-w-5xl space-y-2 border-t border-border pt-4"
      >
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
            <ChevronDown
              aria-hidden="true"
              className="size-4 shrink-0 transition-transform group-open:rotate-180"
            />
            <h2 id="import-source-title" className="font-semibold">
              Fuente aduanera y actualidad
            </h2>
          </summary>
          <div className="mt-3 space-y-3">
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">
                  Sistema previsto
                </dt>
                <dd className="mt-1 text-sm font-medium">Alpha2000 / MARÍA</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  Estado de conexión
                </dt>
                <dd className="mt-1 text-sm font-medium">
                  No conectada · sin datos aduaneros confirmados
                </dd>
              </div>
            </dl>
            <p className="text-sm text-muted-foreground">
              No se consultó ARCA/MOA ni Alpha2000. Los datos de referencia
              visibles provienen exclusivamente del fixture local y no reflejan
              el estado actual de una destinación.
            </p>
          </div>
        </details>
      </section>
    </div>
  )
}
