"use client"

import Link from "next/link"
import { DocumentsPanel } from "@/features/documents/components/documents-panel"

import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { formatDate } from "@workspace/ui/lib/date"
import { useDemoOperations } from "@/features/operations/state/use-demo-operations"
import { findPortalOperation, PORTAL_DEMO_CLIENT_ID } from "../data/portal"

export function PortalOperationDetail({
  requestedClientId,
  operationId,
}: {
  requestedClientId: string
  operationId: string
}) {
  const { operations, ready } = useDemoOperations()

  if (!ready) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Cargando escenario del Portal…
      </p>
    )
  }

  const operation = findPortalOperation(
    requestedClientId,
    operationId,
    operations
  )
  if (!operation) return <PortalOperationUnavailable />

  return (
    <div className="max-w-3xl space-y-7">
      <Link
        href={`/portal?cliente=${PORTAL_DEMO_CLIENT_ID}`}
        className="inline-flex min-h-10 items-center rounded-sm py-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Volver a Mis operaciones
      </Link>

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {operation.reference}
        </h1>
        <p className="text-sm text-muted-foreground">{operation.kind}</p>
      </header>

      <section
        aria-labelledby="portal-status-title"
        className="space-y-3 border-y border-border py-4"
      >
        <h2 id="portal-status-title" className="font-semibold">
          Situación actual
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline">{operation.situation}</Badge>
          <p className="text-sm text-muted-foreground">
            Actualización {formatDate(operation.updatedOn)} · sin consulta
            externa.
          </p>
        </div>
      </section>

      <section aria-labelledby="portal-milestones-title" className="space-y-2">
        <h2 id="portal-milestones-title" className="font-semibold">
          Hitos
        </h2>
        <p className="text-sm text-muted-foreground">
          Sin hitos informados. La actualización del registro no implica un
          evento aduanero.
        </p>
      </section>

      <DocumentsPanel operationId={operation.id} external />
    </div>
  )
}

function PortalOperationUnavailable() {
  return (
    <section
      role="status"
      className="max-w-2xl space-y-3 border-y border-border py-6"
    >
      <h1 className="text-xl font-semibold">Contexto no disponible</h1>
      <p className="text-sm text-muted-foreground">
        No se puede mostrar información para este contexto. El Portal no
        confirma si la operación existe ni a qué cliente pertenece.
      </p>
      <Link
        href="/portal/acceso"
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        Volver al Portal
      </Link>
    </section>
  )
}
