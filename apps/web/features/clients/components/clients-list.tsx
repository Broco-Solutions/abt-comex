"use client"

import { ClientTable } from "./client-table"

import Link from "next/link"

import { PageHeader } from "@/components/navigation/page-header"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

import {
  clientListHref,
  demonstrationClients,
  filterClients,
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
      <PageHeader title="Clientes" />

      <section aria-label="Búsqueda de clientes" className="max-w-5xl">
        <form
          key={JSON.stringify(state)}
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
                : "No hay clientes disponibles en esta vista."}
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-3 text-sm">
              <p role="status" aria-label="Resultados de clientes">
                <span className="font-medium">{clients.length}</span> de{" "}
                {demonstrationClients.length} clientes
              </p>
            </div>
            <ClientTable
              clients={clients}
              operations={operations}
              query={state.query}
            />
          </>
        )}
      </section>
    </div>
  )
}
