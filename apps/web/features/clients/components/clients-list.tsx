"use client"

import { ClientTable } from "./client-table"
import { useListContext } from "@/components/navigation/list-context"
import { useEffect, useState } from "react"
import { useOrganizations } from "@/features/organizations/state/use-organizations"
import { projectClients } from "@/features/organizations/data/organizations"
import { OrganizationEditor } from "@/features/organizations/components/organization-editor"

import Link from "next/link"

import { PageHeader } from "@/components/navigation/page-header"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

import {
  clientListHref,
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
  const sourceState = parseClientListState(searchParams)
  const sourceKey = JSON.stringify(sourceState)
  const [state, setState] = useState(sourceState)
  const [queryDraft, setQueryDraft] = useState(sourceState.query)
  const [previousQuery, setPreviousQuery] = useState(state.query)
  if (previousQuery !== state.query) {
    setPreviousQuery(state.query)
    setQueryDraft(state.query)
  }
  const [previousSource, setPreviousSource] = useState(sourceKey)
  if (previousSource !== sourceKey) {
    setPreviousSource(sourceKey)
    setState(sourceState)
  }
  useEffect(() => {
    const restore = () =>
      setState(
        parseClientListState(
          Object.fromEntries(new URLSearchParams(window.location.search))
        )
      )
    window.addEventListener("popstate", restore)
    return () => window.removeEventListener("popstate", restore)
  }, [])
  const { operations, ready } = useDemoOperations()
  const { organizations, ready: organizationsReady } = useOrganizations()
  const allClients = projectClients(organizations)
  const includeInactive = state.includeInactive
  const captureContext = useListContext(
    ready && organizationsReady,
    clientListHref(state.query, includeInactive)
  )
  const [feedback, setFeedback] = useState("")
  const restricted = state.error === "sin-permiso"
  const failed = state.error === "lectura"
  const clients =
    restricted || failed || !ready
      ? []
      : filterClients(
          state.query,
          allClients.filter(
            (client) =>
              includeInactive ||
              client.roles.some(
                (entry) => entry.role === "client" && entry.active
              )
          ),
          operations
        )
  if (!ready || !organizationsReady)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Cargando escenario local…
      </p>
    )

  return (
    <div className="space-y-6" onClickCapture={captureContext}>
      <PageHeader
        title="Clientes"
        primaryAction={
          !restricted && !failed ? (
            <OrganizationEditor
              onSaved={(organization) =>
                setFeedback(
                  `${organization.name} guardado. Disponible para cotizaciones y operaciones.`
                )
              }
            />
          ) : undefined
        }
      />
      <nav
        aria-label="Maestros de organizaciones"
        className="flex flex-wrap gap-2 text-sm"
      >
        <Link
          href="/clientes"
          className="rounded-md border px-3 py-2 text-primary"
        >
          Clientes
        </Link>
        <Link
          href="/proveedores"
          className="rounded-md border px-3 py-2 text-primary"
        >
          Proveedores de ABT
        </Link>
        <Link
          href="/proveedores?ambito=operacion"
          className="rounded-md border px-3 py-2 text-primary"
        >
          Contrapartes de operaciones
        </Link>
      </nav>
      {!restricted && !failed && (
        <label className="flex min-h-9 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(event) => {
              const includeInactive = event.target.checked
              setState((current) => ({ ...current, includeInactive }))
              window.history.pushState(
                null,
                "",
                clientListHref(state.query, includeInactive)
              )
            }}
          />
          Incluir clientes inactivos
        </label>
      )}
      {feedback && (
        <p role="status" className="text-sm">
          {feedback}
        </p>
      )}

      <section aria-label="Búsqueda de clientes" className="max-w-5xl">
        <form
          action="/clientes"
          method="get"
          onSubmit={(event) => {
            event.preventDefault()
            const query = String(
              new FormData(event.currentTarget).get("q") ?? ""
            )
            window.history.pushState(
              null,
              "",
              clientListHref(query, includeInactive)
            )
            setState({ query, error: "", includeInactive })
          }}
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
              value={queryDraft}
              onChange={(event) => setQueryDraft(event.target.value)}
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
                {allClients.length} clientes
              </p>
            </div>
            <ClientTable
              clients={clients}
              operations={operations}
              query={state.query}
              includeInactive={includeInactive}
            />
          </>
        )}
      </section>
    </div>
  )
}
