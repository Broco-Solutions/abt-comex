import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { PageHeader } from "@/components/navigation/page-header"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import { demonstrationOperations } from "@/features/operations/data/operations"

import {
  clientListHref,
  demonstrationClients,
  getClientOperations,
} from "../data/clients"

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

function safeReturnTo(value: string) {
  if (
    /^\/clientes(\?.*)?(#.*)?$/.test(value) ||
    /^\/mi-trabajo(\?.*)?(#.*)?$/.test(value) ||
    /^\/cotizaciones(?:\/quote-demo-\d{3})?(?:\?[^#]*)?(#.*)?$/.test(value)
  ) {
    return value
  }
  const operationId = /^\/operaciones\/([^/?#]+)(\?.*)?(#.*)?$/.exec(value)?.[1]
  if (
    operationId &&
    demonstrationOperations.some((item) => item.id === operationId)
  ) {
    return value
  }
  return "/clientes"
}

export function ClientDetail({
  clientId,
  searchParams,
}: {
  clientId: string
  searchParams: Record<string, string | string[] | undefined>
}) {
  const client = demonstrationClients.find((item) => item.id === clientId)
  if (!client) notFound()

  const returnTo = safeReturnTo(first(searchParams.returnTo))
  const operations = getClientOperations(client.id)

  return (
    <div className="space-y-6">
      <Link
        href={returnTo}
        className="inline-flex min-h-9 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Volver a Clientes
      </Link>

      <PageHeader
        title={client.name}
        description="Ficha demostrativa de cliente · datos ficticios y sin conexión con sistemas externos"
      />

      <section
        aria-labelledby="client-context-title"
        className="max-w-5xl border-y border-border py-4"
      >
        <h2 id="client-context-title" className="text-base font-semibold">
          Datos de referencia
        </h2>
        <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">
              Identificador del escenario
            </dt>
            <dd className="mt-1 font-medium">{client.id}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Procedencia</dt>
            <dd className="mt-1 font-medium">{client.source}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Última actualización simulada
            </dt>
            <dd className="mt-1 font-medium">
              <time dateTime={client.updatedOn}>{client.updatedOn}</time>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Conexión</dt>
            <dd className="mt-1 font-medium">No conectada · fixture local</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="client-contacts-title" className="max-w-5xl">
        <div className="border-b border-border pb-3">
          <h2 id="client-contacts-title" className="font-semibold">
            Contactos de referencia
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sólo identidades ficticias; no se incluyen datos personales reales.
          </p>
        </div>
        {client.contacts.length ? (
          <ul className="divide-y divide-border">
            {client.contacts.map((contact) => (
              <li key={contact.id} className="py-3 text-sm">
                {contact.label}
              </li>
            ))}
          </ul>
        ) : (
          <p role="status" className="py-4 text-sm text-muted-foreground">
            Este caso no tiene contactos cargados en el fixture.
          </p>
        )}
      </section>

      <section aria-labelledby="client-operations-title" className="max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
          <div>
            <h2 id="client-operations-title" className="font-semibold">
              Operaciones relacionadas
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Relación local por identificador estable de cliente; no representa
              actividad actual de ABT.
            </p>
          </div>
          <Link
            href="/operaciones"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Ir a Operaciones
          </Link>
        </div>
        {operations.length ? (
          <ul className="divide-y divide-border">
            {operations.map((operation) => {
              const operationReturn = `/operaciones/${operation.id}?returnTo=${encodeURIComponent(returnTo)}`
              return (
                <li
                  key={operation.id}
                  className="grid gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                >
                  <div>
                    <p className="font-medium">
                      {operation.reference}{" "}
                      <span className="font-normal text-muted-foreground">
                        · {operation.kind}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {operation.situation} · responsable de referencia:{" "}
                      {operation.responsible}
                    </p>
                  </div>
                  <Link
                    href={operationReturn}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "w-fit"
                    )}
                  >
                    Abrir operación <ArrowRight aria-hidden="true" />
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p role="status" className="py-4 text-sm text-muted-foreground">
            No hay operaciones relacionadas en este fixture.
          </p>
        )}
      </section>

      <section
        aria-labelledby="client-quotes-title"
        className="max-w-5xl border-y border-border py-4"
      >
        <h2 id="client-quotes-title" className="font-semibold">
          Cotizaciones
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Consultá el circuito comercial en la sección autorizada de
          Cotizaciones. Esta ficha no muestra precios, honorarios ni conteos
          comerciales.
        </p>
        <Link
          href={`/cotizaciones?cliente=${encodeURIComponent(client.id)}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "mt-3"
          )}
        >
          Abrir Cotizaciones del cliente
        </Link>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link
          href={clientListHref("")}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <ArrowLeft aria-hidden="true" /> Volver al listado
        </Link>
        <Button
          type="button"
          variant="outline"
          disabled
          aria-describedby="client-readonly-note"
        >
          Editar datos
        </Button>
      </div>
      <p
        id="client-readonly-note"
        className="max-w-5xl text-xs text-muted-foreground"
      >
        La actualización de datos maestros y la parametrización de requisitos
        requieren definición de campos, unicidad, responsables y capacidades con
        ABT. No están habilitadas en este prototipo.
      </p>
    </div>
  )
}
