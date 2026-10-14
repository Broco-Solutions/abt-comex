import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { PageHeader } from "@/components/navigation/page-header"
import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import {
  demonstrationDjves,
  demonstrationPermits,
} from "../data/exportation-scenarios"

function safeReturnTo(value: string) {
  return /^\/(operaciones|tramites\/djve|gestion|administracion)(?:\/|\?|$)/.test(
    value
  )
    ? value
    : "/tramites/djve"
}

export function DjveDetail({
  djveId,
  returnTo = "/tramites/djve",
  restricted = false,
}: {
  djveId: string
  returnTo?: string
  restricted?: boolean
}) {
  const backTo = safeReturnTo(returnTo)
  if (restricted) {
    return (
      <section className="max-w-3xl space-y-3">
        <PageHeader title="DJVE no disponible" />
        <p className="text-sm text-muted-foreground">
          Este escenario no tiene información autorizada. No se confirma si la
          referencia existe.
        </p>
        <Link
          href={backTo}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Volver al contexto anterior
        </Link>
      </section>
    )
  }
  const djve = demonstrationDjves.find((item) => item.id === djveId)
  if (!djve) {
    return (
      <section className="max-w-3xl space-y-3">
        <PageHeader title="DJVE no disponible" />
        <p className="text-sm text-muted-foreground">
          No hay información autorizada para este contexto.
        </p>
        <Link
          href={backTo}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Volver al registro de DJVE
        </Link>
      </section>
    )
  }
  const permits = djve.permitIds
    .map((permitId) =>
      demonstrationPermits.find((item) => item.id === permitId)
    )
    .filter((item) => item !== undefined)

  return (
    <div className="space-y-6">
      <Link
        href={backTo}
        className="inline-flex min-h-9 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Volver al contexto anterior
      </Link>
      <PageHeader
        title={djve.reference}
        description="Detalle de trámite de demostración · no equivale a una declaración consultada u oficializada"
        secondaryActions={
          <Badge variant="outline">
            {djve.autonomous ? "Autónoma en fixture" : "Relacionada en fixture"}
          </Badge>
        }
      />

      <section
        aria-label="Datos de contexto"
        className="border-y border-border py-4"
      >
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">Descripción</dt>
            <dd className="mt-1 font-medium">{djve.description}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Vencimiento ilustrativo
            </dt>
            <dd className="mt-1 font-medium">
              <time dateTime={djve.expirationDate}>{djve.expirationDate}</time>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Cantidad declarada · fixture
            </dt>
            <dd className="mt-1 font-medium">
              {djve.declaredQuantity} {djve.quantityUnit}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Afectación registrada · fixture
            </dt>
            <dd className="mt-1 font-medium">
              {djve.affectedQuantity} {djve.quantityUnit}
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="djve-relations-title" className="space-y-3">
        <h2 id="djve-relations-title" className="font-semibold">
          Permisos relacionados
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          El mismo trámite puede relacionarse con múltiples permisos y
          operaciones; también existen permisos sin DJVE. Estas cardinalidades
          son ejemplos sintéticos, no una regla de asignación automática.
        </p>
        {permits.length ? (
          <ul className="divide-y divide-border border-y border-border">
            {permits.map((permit) => (
              <li
                key={permit.id}
                className="grid gap-2 py-3 sm:grid-cols-3 sm:items-center"
              >
                <div>
                  <p className="font-medium">{permit.reference}</p>
                  <p className="text-xs text-muted-foreground">
                    Referencia sintética · vence {permit.expirationDate}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Declarado {permit.declaredQuantity} {permit.quantityUnit} ·
                  afectado {permit.affectedQuantity} {permit.quantityUnit}
                </p>
                <Link
                  href={`/operaciones/${permit.operationId}/exportacion?returnTo=${encodeURIComponent(`/tramites/djve/${djve.id}`)}`}
                  className="min-h-9 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                >
                  Abrir Exportación vinculada
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Este fixture no contiene permisos asociados. No se infiere que no
            existan.
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          No se calcula saldo, porcentaje, cumplimiento ni bloqueo. Fórmula,
          unidad, período, vigencia y excepciones requieren validación; el rango
          90%–104% observado para un caso de granos no se aplica aquí.
        </p>
      </section>

      <section
        aria-labelledby="djve-source-title"
        className="space-y-3 border-t border-border pt-5"
      >
        <h2 id="djve-source-title" className="font-semibold">
          Origen, actualización y uso
        </h2>
        <p className="max-w-4xl text-sm text-muted-foreground">
          Fixture sintético local. Alpha2000/MARÍA y ARCA/MOA no están
          conectados; no se consultaron estados, documentos, intervenciones ni
          cumplidos. El modelo muestra una relación compartida para control
          operativo y una eventual salida a Facturación, sin duplicar registros
          ni exponer información comercial.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/operaciones?tipo=exportacion"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Ver Exportaciones
          </Link>
          <Link
            href="/tramites/djve"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Ver todas las DJVE
          </Link>
        </div>
      </section>
    </div>
  )
}
