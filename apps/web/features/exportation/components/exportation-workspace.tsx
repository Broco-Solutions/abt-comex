"use client"

import { formatRecordedDate } from "@workspace/ui/lib/date"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, CircleAlert, FileText, ShieldCheck } from "lucide-react"

import { PageHeader } from "@/components/navigation/page-header"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { Badge } from "@workspace/ui/components/badge"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { useDemoOperations } from "@/features/operations/state/use-demo-operations"
import type { DemonstrationOperation } from "@/features/operations/types/operation"

import {
  canCompleteExportDoubleControl,
  demonstrationDjves,
  demonstrationPermits,
  getExportationProgress,
} from "../data/exportation-scenarios"
import { useExportationScenario } from "../state/use-exportation-scenario"
import {
  demonstrationExportReviewers,
  type ExportReviewerId,
} from "../types/exportation"

type SearchParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

function safeReturnTo(
  operationId: string,
  value: string,
  operations: DemonstrationOperation[]
) {
  const operationExists = operations.some((item) => item.id === operationId)
  if (!operationExists) return "/operaciones"
  const prefix = `/operaciones/${operationId}`
  if (value === prefix) return prefix
  if (value.startsWith(`${prefix}?returnTo=`)) {
    const nested = new URLSearchParams(
      `returnTo=${value.slice(prefix.length + 10)}`
    ).get("returnTo")
    if (
      nested &&
      /^\/(operaciones|mi-trabajo|clientes)(?:\/|\?|$)/.test(nested)
    )
      return value
  }
  if (/^\/(operaciones|mi-trabajo|clientes)(?:\/|\?|$)/.test(value))
    return value
  return prefix
}

export function ExportationWorkspace({
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
  } = useExportationScenario(operationId)
  const [firstReviewer, setFirstReviewer] = useState<ExportReviewerId | "">("")
  const [secondReviewer, setSecondReviewer] = useState<ExportReviewerId | "">(
    ""
  )
  const [message, setMessage] = useState("")
  const restricted = first(searchParams.error) === "sin-permiso"

  if (restricted) {
    return (
      <section className="max-w-3xl space-y-3">
        <PageHeader title="Exportación no disponible" />
        <p className="text-sm text-muted-foreground">
          Este escenario no tiene información autorizada para mostrar. No se
          confirma si la referencia existe.
        </p>
        <Link
          href="/operaciones?tipo=exportacion"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Volver a Exportaciones
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
  if (!operation || operation.kind !== "Exportación") {
    return (
      <section className="max-w-3xl space-y-3">
        <PageHeader title="Exportación no disponible" />
        <p className="text-sm text-muted-foreground">
          No hay información autorizada de Exportación para este contexto.
        </p>
        <Link
          href="/operaciones?tipo=exportacion"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Volver a Exportaciones
        </Link>
      </section>
    )
  }

  const returnTo = safeReturnTo(
    operationId,
    first(searchParams.returnTo),
    operations
  )
  const progress = getExportationProgress(operationId)
  const operationPermits = demonstrationPermits.filter(
    (permit) => permit.operationId === operationId
  )
  const linkedDjves = demonstrationDjves.filter((djve) =>
    djve.permitIds.some((permitId) =>
      operationPermits.some((permit) => permit.id === permitId)
    )
  )

  function registerControl() {
    const control = { firstReviewer, secondReviewer, completed: true }
    if (!canCompleteExportDoubleControl(control)) {
      setMessage("Elegí dos personas diferentes para este escenario local.")
      return
    }
    updateDoubleControl(control)
    setMessage("Control de demostración registrado en esta sesión local.")
  }

  function resetControl() {
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
        <ArrowLeft aria-hidden="true" className="size-4" /> Volver a la
        operación
      </Link>

      <PageHeader
        title={`Exportación · ${operation.reference}`}
        description="Workspace operativo de demostración · datos sintéticos, sin conexión aduanera"
        secondaryActions={
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/operaciones/${operation.id}?returnTo=${encodeURIComponent(returnTo)}`}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Ficha de Operación
            </Link>
            <Link
              href={`/tramites/djve?returnTo=${encodeURIComponent(`/operaciones/${operation.id}/exportacion`)}`}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Ver DJVE
            </Link>
            <Link
              href={`/administracion/${operation.id}?returnTo=${encodeURIComponent(`/operaciones/${operation.id}/exportacion`)}`}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Ver Administración
            </Link>
          </div>
        }
      />

      <section
        aria-label="Contexto de la operación"
        className="border-y border-border py-4"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline">Exportación</Badge>
          <Badge variant="secondary">{operation.situation}</Badge>
          {operation.alert !== "Sin alerta" ? (
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <CircleAlert aria-hidden="true" className="size-4" />
              {operation.alert}
            </span>
          ) : null}
        </div>
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

      <Alert variant="info">
        <CircleAlert aria-hidden="true" />
        <AlertTitle>
          Escenario sintético; Alpha2000/MARÍA no está conectada
        </AlertTitle>
        <AlertDescription>
          No se consultan ni confirman oficialización, VEP, canal, cumplido,
          documentos o eventos aduaneros. La preparación y oficialización
          continúan en el sistema especializado.
        </AlertDescription>
      </Alert>

      <section
        aria-labelledby="export-instruction-title"
        className="space-y-2 border-t border-border pt-5"
      >
        <h2 id="export-instruction-title" className="font-semibold">
          Instrucción y provisorio
        </h2>
        <p className="max-w-4xl text-sm text-muted-foreground">
          El contenido de la instrucción del cliente y del provisorio depende
          del caso. Este fixture no incorpora esos documentos ni sus datos; no
          se interpreta como faltante real. La preparación y oficialización se
          realizan en Alpha2000/MARÍA, que no está conectada.
        </p>
      </section>

      <section
        aria-labelledby="export-control-title"
        className="space-y-4 border-t border-border pt-5"
      >
        <div>
          <h2
            id="export-control-title"
            className="flex items-center gap-2 font-semibold"
          >
            <ShieldCheck aria-hidden="true" className="size-4" />
            Doble control previo a oficialización
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            El control es bloqueante y requiere personas distintas. Este
            registro local sólo demuestra la interacción: no constituye
            revisión, identidad, auditoría ni autorización reales y no ofrece
            una acción de oficialización.
          </p>
        </div>
        {scenario.doubleControl.completed ? (
          <div className="max-w-3xl space-y-3 rounded-md border border-success/30 bg-success/5 p-4">
            <p className="font-medium">
              Doble control completado en el escenario local
            </p>
            <p className="text-sm text-muted-foreground">
              {
                demonstrationExportReviewers.find(
                  (person) => person.id === scenario.doubleControl.firstReviewer
                )?.label
              }{" "}
              y{" "}
              {
                demonstrationExportReviewers.find(
                  (person) =>
                    person.id === scenario.doubleControl.secondReviewer
                )?.label
              }
              . No registra una revisión real ni habilita oficialización.
            </p>
            <Button variant="outline" onClick={resetControl}>
              Reiniciar escenario de control
            </Button>
          </div>
        ) : (
          <form
            className="grid max-w-3xl gap-4 rounded-md border border-border p-4 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault()
              registerControl()
            }}
          >
            <label className="space-y-1.5 text-sm font-medium">
              Primera persona de demostración
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={firstReviewer}
                onChange={(event) => {
                  setFirstReviewer(event.target.value as ExportReviewerId | "")
                  setMessage("")
                }}
              >
                <option value="">Seleccionar persona</option>
                {demonstrationExportReviewers.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              Segunda persona de demostración
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={secondReviewer}
                onChange={(event) => {
                  setSecondReviewer(event.target.value as ExportReviewerId | "")
                  setMessage("")
                }}
              >
                <option value="">Seleccionar persona</option>
                {demonstrationExportReviewers
                  .filter((person) => person.id !== firstReviewer)
                  .map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.label}
                    </option>
                  ))}
              </select>
            </label>
            <div className="sm:col-span-2">
              <Button type="submit">Registrar control de demostración</Button>
              {message ? (
                <p role="status" className="mt-2 text-sm text-muted-foreground">
                  {message}
                </p>
              ) : null}
            </div>
          </form>
        )}
      </section>

      <div className="grid gap-x-10 gap-y-7 border-t border-border pt-5 lg:grid-cols-2">
        <section aria-labelledby="permits-title" className="space-y-3">
          <h2 id="permits-title" className="font-semibold">
            Permisos y trámites relacionados
          </h2>
          {operationPermits.length ? (
            <ul className="divide-y divide-border border-y border-border">
              {operationPermits.map((permit) => {
                const djve = permit.djveId
                  ? demonstrationDjves.find((item) => item.id === permit.djveId)
                  : undefined
                return (
                  <li
                    key={permit.id}
                    className="grid gap-2 py-3 sm:grid-cols-2"
                  >
                    <div>
                      <p className="font-medium">{permit.reference}</p>
                      <p className="text-sm text-muted-foreground">
                        Permiso · identificador sintético
                      </p>
                    </div>
                    <div className="text-sm sm:text-right">
                      {djve ? (
                        <Link
                          className="font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                          href={`/tramites/djve/${djve.id}?returnTo=${encodeURIComponent(`/operaciones/${operation.id}/exportacion`)}`}
                        >
                          {djve.reference}
                        </Link>
                      ) : (
                        <span>Sin DJVE relacionada en este escenario</span>
                      )}
                      <p className="mt-1 text-muted-foreground">
                        Relación ilustrativa; fuente externa no consultada
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay permisos vinculados en el escenario disponible; no se
              infiere que no existan en la realidad.
            </p>
          )}
          {linkedDjves.length ? (
            <p className="text-sm text-muted-foreground">
              Una DJVE puede relacionarse con varios permisos u operaciones. La
              cardinalidad exacta, las reglas de vigencia y el tratamiento de
              relaciones requieren validación.
            </p>
          ) : null}
          <Link
            href={`/tramites/djve?returnTo=${encodeURIComponent(`/operaciones/${operation.id}/exportacion`)}`}
            className="inline-flex min-h-9 items-center text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
          >
            Abrir registro de DJVE y permisos
          </Link>
        </section>

        <section aria-labelledby="quantity-title" className="space-y-3">
          <h2 id="quantity-title" className="font-semibold">
            Cantidades y vencimientos
          </h2>
          {operationPermits.length ? (
            <ul className="space-y-3">
              {operationPermits.map((permit) => (
                <li
                  key={permit.id}
                  className="border-l-2 border-muted pl-3 text-sm"
                >
                  <p className="font-medium">
                    {permit.reference} · vencimiento{" "}
                    {formatRecordedDate(permit.expirationDate)}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Declarado: {permit.declaredQuantity} {permit.quantityUnit} ·
                    afectación registrada: {permit.affectedQuantity}{" "}
                    {permit.quantityUnit}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="text-sm text-muted-foreground">
            Cantidades ilustrativas del fixture. No se calcula saldo, porcentaje
            ni bloqueo: fórmula, tolerancias, período y excepciones requieren
            validación.
          </p>
        </section>
      </div>

      <section
        aria-labelledby="custody-title"
        className="space-y-3 border-t border-border pt-5"
      >
        <h2
          id="custody-title"
          className="flex items-center gap-2 font-semibold"
        >
          <FileText aria-hidden="true" className="size-4" />
          Legajo aduanero y originales para el exterior
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1 border-l-2 border-muted pl-3">
            <h3 className="text-sm font-medium">Legajo aduanero</h3>
            <p className="text-sm text-muted-foreground">
              {progress.customsFile}. No se adjuntan ni conservan archivos en
              este prototipo; cumplimiento y fuentes no están verificados.
            </p>
          </div>
          <div className="space-y-1 border-l-2 border-muted pl-3">
            <h3 className="text-sm font-medium">
              Sobre de originales exteriores
            </h3>
            <p className="text-sm text-muted-foreground">
              Custodia física: {progress.physicalOriginals}. Copia/registro
              digital: {progress.digitalCopy}. No hay ubicación, recepción ni
              entrega real registrada.
            </p>
          </div>
          <div className="space-y-1 border-l-2 border-muted pl-3">
            <h3 className="text-sm font-medium">Certificados y carga</h3>
            <p className="text-sm text-muted-foreground">
              Documentación, organismo, hitos y responsables dependen de la
              modalidad y del caso; no hay checklist universal configurado.
            </p>
          </div>
          <div className="space-y-1 border-l-2 border-muted pl-3">
            <h3 className="text-sm font-medium">Fuente y actualización</h3>
            <p className="text-sm text-muted-foreground">
              Fixture sintético local · actualización del registro{" "}
              {formatRecordedDate(operation.updatedOn)}. Alpha2000 y ARCA/MOA no
              están conectados.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="continuity-title"
        className="space-y-3 border-t border-border pt-5"
      >
        <h2 id="continuity-title" className="font-semibold">
          Continuidad operativa y administrativa
        </h2>
        <p className="max-w-4xl text-sm text-muted-foreground">
          La situación de facturación no reemplaza el seguimiento del permiso,
          cumplido, post-embarque ni cierre documental. El fixture no permite
          crear factura, ejecutar el pase ni afirmar eventos externos.
        </p>
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div>
            <dt className="text-xs text-muted-foreground">
              Facturación · fixture
            </dt>
            <dd className="mt-1 font-medium">{progress.billing}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Cobranza · fixture
            </dt>
            <dd className="mt-1 font-medium">{progress.collection}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Cumplido · fixture
            </dt>
            <dd className="mt-1 font-medium">{progress.fulfilled}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Post-embarque · fixture
            </dt>
            <dd className="mt-1 font-medium">{progress.postShipment}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Cierre documental · fixture
            </dt>
            <dd className="mt-1 font-medium">{progress.documentaryClose}</dd>
          </div>
        </dl>
        <p className="text-sm text-muted-foreground">
          Facturada, cobrada, cumplida y cerrada documentalmente son situaciones
          diferentes. La cobranza es sólo un estado sintético independiente; no
          expone saldos, importes ni consulta externa.
        </p>
      </section>
    </div>
  )
}
