"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { PageHeader } from "@/components/navigation/page-header"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

import {
  clientDetailHref,
  clientListHref,
  demonstrationClients,
  filterClients,
  getClientOperations,
  parseClientListState,
} from "../data/clients"
import type { ClientSearchParams } from "../data/clients"
import { useDemoOperations } from "@/features/operations/state/use-demo-operations"

export function ClientsList({
  searchParams,
}: {
  searchParams: ClientSearchParams
}) {
  const state = parseClientListState(searchParams)
  const { operations, ready } = useDemoOperations()
  const restricted = state.error === "sin-permiso"
  const failed = state.error === "lectura"
  const clients =
    restricted || failed || !ready
      ? []
      : filterClients(state.query, demonstrationClients, operations)
  if (!ready)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Cargando escenario local…
      </p>
    )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Consultá el contexto maestro reutilizable y sus operaciones relacionadas. Este escenario no es un CRM ni contiene datos reales de ABT."
      />

      <section aria-label="Búsqueda de clientes" className="max-w-5xl">
        <form
          action="/clientes"
          method="get"
          className="grid gap-3 border-b border-border pb-4 sm:grid-cols-[minmax(14rem,32rem)_auto] sm:items-end"
        >
          <div>
            <label
              htmlFor="client-search"
              className="mb-1 block text-xs font-medium"
            >
              Buscar cliente o referencia de operación
            </label>
            <Input
              id="client-search"
              type="search"
              name="q"
              defaultValue={state.query}
              placeholder="Ej.: Cliente Demo Norte u OP-DEM-2048"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm">
              Buscar
            </Button>
            {state.query ? (
              <Link
                href="/clientes"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Limpiar
              </Link>
            ) : null}
          </div>
        </form>

        {restricted ? (
          <div role="status" className="border-b border-border py-5">
            <h2 className="font-medium">Clientes no disponibles</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Este escenario no tiene información autorizada para mostrar. No se
              confirma si existen registros.
            </p>
          </div>
        ) : failed ? (
          <div role="alert" className="border-b border-border py-5">
            <h2 className="font-medium">No se pudo leer el escenario</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Se conservaron los filtros. No hay conexión con un maestro de
              clientes externo.
            </p>
            <Link
              href={clientListHref(state.query)}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-3"
              )}
            >
              Reintentar
            </Link>
          </div>
        ) : clients.length === 0 ? (
          <div role="status" className="border-b border-border py-5">
            <h2 className="font-medium">
              {state.query
                ? "No hay coincidencias"
                : "No hay clientes en este escenario"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {state.query
                ? "Probá con otro nombre o referencia y volvé a buscar."
                : "El fixture local todavía no contiene registros para mostrar."}
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-3 text-sm">
              <p>
                <span className="font-medium">{clients.length}</span> de{" "}
                {demonstrationClients.length} clientes sintéticos visibles
              </p>
              <p className="text-xs text-muted-foreground">
                Sólo conteo del escenario local; no representa el total de ABT.
              </p>
            </div>
            <ul
              aria-label="Clientes del escenario"
              className="divide-y divide-border"
            >
              {clients.map((client) => {
                const clientOperations = getClientOperations(
                  client.id,
                  operations
                )
                return (
                  <li
                    key={client.id}
                    className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                  >
                    <div className="min-w-0">
                      <h2 className="font-medium">{client.name}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {clientOperations.length} operaciones de referencia ·{" "}
                        {client.contacts.length} contacto
                        {client.contacts.length === 1
                          ? " ficticio"
                          : "s ficticios"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Fuente: {client.source} · actualización simulada{" "}
                        {client.updatedOn}
                      </p>
                    </div>
                    <Link
                      href={clientDetailHref(
                        client.id,
                        clientListHref(state.query)
                      )}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "w-fit"
                      )}
                    >
                      Abrir ficha <ArrowRight aria-hidden="true" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </section>

      <p className="max-w-5xl border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
        Consulta demostrativa de sólo lectura. No se crean ni modifican clientes
        y no hay permisos productivos implementados.
      </p>
    </div>
  )
}
