"use client"

import Link from "next/link"

import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { formatDate } from "@workspace/ui/lib/date"
import { useDemoOperations } from "@/features/operations/state/use-demo-operations"
import { getPortalContext, PORTAL_DEMO_CLIENT_ID } from "../data/portal"

export function PortalHome({
  requestedClientId,
}: {
  requestedClientId: string
}) {
  const { operations, ready } = useDemoOperations()

  if (!ready) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Cargando escenario del Portal…
      </p>
    )
  }

  const context = getPortalContext(requestedClientId, operations)
  if (!context.authorized) return <PortalUnavailable />

  const pending = context.operations.filter(
    (operation) => operation.situation === "Pendiente documental"
  )

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-medium text-primary">Vista de cliente</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Hola, {context.client.name}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Consultá las operaciones incluidas en este escenario. La visibilidad y
          la identidad son simuladas; no representan una cuenta real.
        </p>
      </header>

      <section
        aria-label="Procedencia de la información"
        className="flex flex-wrap items-center justify-between gap-2 border-y border-border py-3"
      >
        <p className="text-sm">
          <span className="font-medium">Escenario ficticio</span> · datos
          locales sin conexión externa.
        </p>
        <p className="text-xs text-muted-foreground">
          Fixture actualizado: 14/10/2026
        </p>
      </section>

      {pending.length > 0 ? (
        <section aria-labelledby="portal-pending-title" className="space-y-3">
          <div>
            <h2 id="portal-pending-title" className="text-lg font-semibold">
              Situaciones documentales
            </h2>
            <p className="text-sm text-muted-foreground">
              El fixture señala documentación pendiente; no incluye el detalle
              del requerimiento ni una notificación enviada.
            </p>
          </div>
          <ul className="divide-y divide-border border-y border-border">
            {pending.map((operation) => (
              <li
                key={operation.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-medium">{operation.reference}</p>
                  <p className="text-sm text-muted-foreground">
                    {operation.kind} · estado del escenario
                  </p>
                </div>
                <Link
                  href={`/portal/operaciones/${operation.id}?cliente=${PORTAL_DEMO_CLIENT_ID}`}
                  className="min-h-10 rounded-sm px-2 py-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Consultar estado
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="portal-operations-title" className="space-y-3">
        <div>
          <h2 id="portal-operations-title" className="text-lg font-semibold">
            Mis operaciones
          </h2>
        </div>

        {context.operations.length === 0 ? (
          <p className="border-y border-border py-5 text-sm text-muted-foreground">
            No hay operaciones visibles en este escenario.
          </p>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {context.operations.map((operation) => (
              <li
                key={operation.id}
                className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(9rem,auto)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="font-medium">{operation.reference}</p>
                  <p className="text-sm text-muted-foreground">
                    {operation.kind}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{operation.situation}</Badge>
                  <span className="text-xs text-muted-foreground">
                    Actualizada {formatDate(operation.updatedOn)}
                  </span>
                </div>
                <Link
                  href={`/portal/operaciones/${operation.id}?cliente=${PORTAL_DEMO_CLIENT_ID}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-full sm:w-auto"
                  )}
                >
                  Ver estado
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        aria-labelledby="portal-documents-title"
        className="space-y-2 border-y border-border py-4"
      >
        <h2 id="portal-documents-title" className="font-semibold">
          Documentos compartidos
        </h2>
        <p className="text-sm text-muted-foreground">
          No hay documentos externos disponibles en este escenario. La carga y
          descarga documental todavía no están habilitadas.
        </p>
      </section>

      <section
        aria-labelledby="portal-notifications-title"
        className="space-y-2"
      >
        <h2 id="portal-notifications-title" className="font-semibold">
          Avisos y ayuda
        </h2>
        <p className="text-sm text-muted-foreground">
          No se envían emails ni notificaciones. Los estados de ejemplo sólo se
          consultan dentro del Portal.
        </p>
        <details id="ayuda" className="max-w-2xl border-y border-border py-3">
          <summary className="min-h-10 cursor-pointer py-2 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            Ayuda sobre esta demostración
          </summary>
          <p className="pb-2 text-sm text-muted-foreground">
            No ingreses ni compartas datos reales. Para consultas sobre un caso
            real, utilizá los canales que ABT haya definido fuera de este
            escenario.
          </p>
        </details>
      </section>
    </div>
  )
}

function PortalUnavailable() {
  return (
    <section
      role="status"
      className="max-w-2xl space-y-3 border-y border-border py-6"
    >
      <h1 className="text-xl font-semibold">Contexto no disponible</h1>
      <p className="text-sm text-muted-foreground">
        No se puede mostrar información para este escenario. El Portal no
        confirma si existen registros fuera de la identidad de demostración.
      </p>
      <Link
        href="/portal/acceso"
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        Volver al acceso de demostración
      </Link>
    </section>
  )
}
