"use client"

import { formatRecordedDate } from "@workspace/ui/lib/date"

import Link from "next/link"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { useOrganizations } from "@/features/organizations/state/use-organizations"
import { OrganizationIdentity } from "@/features/organizations/components/organization-detail"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { PageHeader } from "@/components/navigation/page-header"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import type { DemonstrationOperation } from "@/features/operations/types/operation"
import { useDemoOperations } from "@/features/operations/state/use-demo-operations"

import { clientListHref, getClientOperations } from "../data/clients"

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

function safeReturnTo(value: string, operations: DemonstrationOperation[]) {
  if (
    /^\/gestion(?:\?[^#]*)?(#.*)?$/.test(value) ||
    /^\/clientes(\?.*)?(#.*)?$/.test(value) ||
    /^\/mi-trabajo(\?.*)?(#.*)?$/.test(value) ||
    /^\/cotizaciones(?:\/quote-demo-\d{3})?(?:\?[^#]*)?(#.*)?$/.test(value)
  ) {
    return value
  }
  const operationId = /^\/operaciones\/([^/?#]+)(\?.*)?(#.*)?$/.exec(value)?.[1]
  if (operationId && operations.some((item) => item.id === operationId)) {
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
  const { operations: allOperations, ready } = useDemoOperations()
  const { scenario } = useScenario()
  const { organizations, ready: organizationsReady } = useOrganizations()
  const client = organizations.find(
    (item) =>
      item.id === clientId &&
      item.roles.some((entry) => entry.role === "client")
  )
  if (!ready || !organizationsReady)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Cargando escenario local…
      </p>
    )
  if (!client) {
    return (
      <section className="max-w-3xl space-y-3">
        <PageHeader title="Cliente no disponible" />
        <p className="text-sm text-muted-foreground">
          No hay información autorizada para este contexto.
        </p>
        <Link
          href="/clientes"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Volver a Clientes
        </Link>
      </section>
    )
  }

  const returnTo = safeReturnTo(first(searchParams.returnTo), allOperations)
  const operations = getClientOperations(client.id, allOperations)

  return (
    <div className="space-y-6">
      <Link
        href={returnTo}
        className="inline-flex min-h-9 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        {returnTo.startsWith("/clientes")
          ? "Volver a Clientes"
          : "Volver al contexto anterior"}
      </Link>

      <PageHeader title={client.name} />
      <OrganizationIdentity organization={client} />

      <section aria-labelledby="client-contacts-title" className="max-w-5xl">
        <div className="border-b border-border pb-3">
          <h2 id="client-contacts-title" className="font-semibold">
            Contactos de referencia
          </h2>
        </div>
        {client.contacts.length ? (
          <ul className="divide-y divide-border">
            {client.contacts.map((contact) => (
              <li key={contact.id} className="py-3 text-sm">
                {contact.label}
                {contact.email && <p>{contact.email}</p>}
                {contact.phone && <p>{contact.phone}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p role="status" className="py-4 text-sm text-muted-foreground">
            Sin contactos registrados.
          </p>
        )}
      </section>

      <section aria-labelledby="client-operations-title" className="max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
          <div>
            <h2 id="client-operations-title" className="font-semibold">
              Operaciones relacionadas
            </h2>
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
              const operationReturn = `/operaciones/${operation.id}?returnTo=${encodeURIComponent(`/clientes/${client.id}?returnTo=${encodeURIComponent(returnTo)}`)}`
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
            Sin operaciones relacionadas en esta vista.
          </p>
        )}
      </section>

      {scenario.commercial ? (
        <section
          aria-labelledby="client-quotes-title"
          className="max-w-5xl border-y border-border py-4"
        >
          <h2 id="client-quotes-title" className="font-semibold">
            Cotizaciones
          </h2>
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
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Link
          href={clientListHref("")}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <ArrowLeft aria-hidden="true" /> Volver al listado
        </Link>
      </div>
      <details className="text-xs text-muted-foreground">
        <summary className="min-h-9 cursor-pointer py-2">
          Actividad del maestro
        </summary>
        <ul>
          {client.activity.map((event, index) => (
            <li key={index} className="py-2">
              {formatRecordedDate(event.on)} · {event.description}
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}
