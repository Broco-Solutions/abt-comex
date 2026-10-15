import { formatRecordedDate } from "@workspace/ui/lib/date"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { PageHeader } from "@/components/navigation/page-header"
import { Badge } from "@workspace/ui/components/badge"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { demonstrationOperations } from "@/features/operations/data/operations"
import { getDemonstrationOperationProgress } from "@/features/operations/data/operation-progress"

function safeReturnTo(value: string) {
  return /^\/(administracion|operaciones|mi-trabajo)(\?.*)?$/.test(value)
    ? value
    : "/administracion"
}

export function AdministrationDetail({
  operationId,
  returnTo: rawReturnTo,
}: {
  operationId: string
  returnTo: string
}) {
  const operation = demonstrationOperations.find(
    (item) => item.id === operationId
  )
  const returnTo = safeReturnTo(rawReturnTo)

  if (!operation) {
    return (
      <section className="max-w-3xl space-y-3">
        <PageHeader title="Detalle administrativo no disponible" />
        <p className="text-sm text-muted-foreground">
          No hay información autorizada para este contexto de demostración.
        </p>
        <Link
          href="/administracion"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Volver a Administración
        </Link>
      </section>
    )
  }

  const progress = getDemonstrationOperationProgress(operationId)
  const exportHref = `/operaciones/${operationId}/exportacion?returnTo=${encodeURIComponent(`/administracion/${operationId}?returnTo=${encodeURIComponent(returnTo)}`)}`
  const operationHref = `/operaciones/${operationId}?returnTo=${encodeURIComponent(returnTo)}`
  const dimensions = [
    ["Lista para facturar / Facturada", progress.billing],
    ["Cobranzas", progress.collection],
    ["Cumplido", progress.fulfilled],
    ["Post-embarque", progress.postShipment],
    ["Cierre documental", progress.documentaryClose],
  ] as const

  return (
    <div className="space-y-6">
      <Link
        href={returnTo}
        className="inline-flex min-h-9 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Volver a la cola
      </Link>
      <PageHeader
        title={`Administración · ${operation.reference}`}
        secondaryActions={
          <div className="flex flex-wrap gap-2">
            <Link
              href={operationHref}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Ficha de Operación
            </Link>
            {operation.kind === "Exportación" ? (
              <Link
                href={exportHref}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Volver a Exportación
              </Link>
            ) : null}
          </div>
        }
      />

      <section
        className="border-y border-border py-4"
        aria-label="Contexto administrativo"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{operation.kind}</Badge>
          <Badge variant="secondary">{progress.billing}</Badge>
          <span className="text-sm text-muted-foreground">
            ABT Comex · registro local
          </span>
        </div>
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">Cliente</dt>
            <dd className="mt-1 font-medium">{operation.client}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Responsable operativo
            </dt>
            <dd className="mt-1 font-medium">{operation.responsible}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Actualización del registro
            </dt>
            <dd className="mt-1 font-medium">
              {formatRecordedDate(operation.updatedOn)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Sistema contable</dt>
            <dd className="mt-1 font-medium">Alpha2000 · no conectado</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="admin-status-title" className="space-y-3">
        <div>
          <h2 id="admin-status-title" className="text-lg font-semibold">
            Estados relacionados, por separado
          </h2>
          <p className="text-sm text-muted-foreground">
            Las referencias del escenario no se infieren unas de otras.
          </p>
        </div>
        <dl className="grid gap-x-8 gap-y-4 border-y border-border py-4 sm:grid-cols-2 lg:grid-cols-3">
          {dimensions.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="mt-1 font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <h2 className="font-semibold">Documentación y referencias</h2>
          <p className="text-sm text-muted-foreground">
            No se adjuntan comprobantes reales ni se copian datos contables.
            Faltantes y gastos requieren evidencia y criterios definidos por
            ABT.
          </p>
          <div className="border-y border-border py-3 text-sm">
            Fuente administrativa:{" "}
            <span className="font-medium">no conectada</span>
            <br />
            Actualización externa:{" "}
            <span className="font-medium">no disponible</span>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold">Acciones disponibles</h2>
          <p className="text-sm text-muted-foreground">
            Esta pasada permite consultar el vínculo con la operación y sus
            dimensiones sintéticas. No registra diferencias, emite facturas,
            cobra ni modifica Alpha2000.
          </p>
          <Button disabled aria-describedby="admin-actions-note">
            Registrar referencia externa
          </Button>
          <p id="admin-actions-note" className="text-xs text-muted-foreground">
            Deshabilitado: contrato, permisos y escritura todavía no definidos.
          </p>
        </div>
      </section>
      <p className="border-t border-border pt-4 text-xs text-muted-foreground">
        Los importes aduaneros, honorarios, costos internos, saldos y márgenes
        no están incluidos en esta vista. Las capacidades de visibilidad
        definitivas siguen pendientes de validación; esta interfaz no constituye
        seguridad productiva.
      </p>
    </div>
  )
}
