"use client"
import Link from "next/link"
import { formatDate } from "@workspace/ui/lib/date"
import { useWorkItems } from "@/features/work/state/use-work-items"
import { useDemoOperations } from "@/features/operations/state/use-demo-operations"
import { AdministrationNav } from "./administration-nav"
import { ArrowRight } from "lucide-react"

import { PageHeader } from "@/components/navigation/page-header"
import { Badge } from "@workspace/ui/components/badge"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import type { AdministrationQueueStatus } from "../data/administration"
import {
  filterAdministrationQueue,
  getAdministrationQueue,
} from "../data/administration"

type SearchParams = Record<string, string | string[] | undefined>
const statuses: Array<"" | AdministrationQueueStatus> = [
  "",
  "Lista para facturar",
  "Facturada",
  "Con pendientes",
]

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

export function AdministrationQueue({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const work = useWorkItems()
  const { operations } = useDemoOperations()
  const query = first(searchParams.q)
  const status = statuses.includes(
    first(searchParams.estado) as (typeof statuses)[number]
  )
    ? (first(searchParams.estado) as (typeof statuses)[number])
    : ""
  const restricted = first(searchParams.error) === "sin-permiso"
  const readError = first(searchParams.error) === "lectura"
  const entries =
    restricted || readError
      ? []
      : filterAdministrationQueue(
          getAdministrationQueue(operations, work),
          query,
          status
        )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administración y Finanzas"
        secondaryActions={
          <Link
            href="/administracion/finanzas"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Gastos y vencimientos
          </Link>
        }
      />

      <AdministrationNav />
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-base font-semibold">Bandeja administrativa</h2>
        {!restricted && !readError ? (
          <p
            role="status"
            className="text-sm text-muted-foreground tabular-nums"
          >
            {entries.length} {entries.length === 1 ? "elemento" : "elementos"}
          </p>
        ) : null}
      </div>
      {restricted || readError ? (
        <section
          className="max-w-3xl border-y border-border py-4"
          aria-live="polite"
        >
          <h2 className="font-medium">
            {restricted
              ? "Información no disponible"
              : "No se pudo leer la fuente"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {restricted
              ? "Este escenario no confirma si existen elementos administrativos."
              : "Se preservaron los filtros; la información externa no está conectada en esta demostración."}
          </p>
        </section>
      ) : (
        <>
          <form
            action="/administracion"
            method="get"
            className="grid gap-3 border-b border-border pb-4 sm:grid-cols-[minmax(12rem,1fr)_13rem_auto] sm:items-end"
          >
            <div>
              <label
                htmlFor="admin-search"
                className="mb-1 block text-xs font-medium"
              >
                Buscar referencia o cliente
              </label>
              <Input
                id="admin-search"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Ej.: OP-DEM-3107"
              />
            </div>
            <div>
              <label
                htmlFor="admin-status"
                className="mb-1 block text-xs font-medium"
              >
                Situación administrativa
              </label>
              <select
                id="admin-status"
                name="estado"
                defaultValue={status}
                className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {statuses.map((item) => (
                  <option key={item || "all"} value={item}>
                    {item || "Todas"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Aplicar
              </Button>
              {query || status ? (
                <Link
                  href="/administracion"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                >
                  Limpiar
                </Link>
              ) : null}
            </div>
          </form>

          {entries.length ? (
            <>
              <ul
                aria-label="Cola administrativa compacta"
                className="divide-y divide-border xl:hidden"
              >
                {entries.map((entry) => {
                  const href =
                    entry.kind === "operation"
                      ? `/administracion/${entry.operationId}?returnTo=${encodeURIComponent(`/administracion?${new URLSearchParams({ q: query, estado: status })}`)}`
                      : `/administracion/finanzas?trabajo=${entry.id}`
                  return (
                    <li key={entry.id} className="space-y-2 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <Link
                          href={href}
                          className="font-semibold text-primary hover:underline"
                        >
                          {entry.reference}
                        </Link>
                        <Link
                          href={href}
                          aria-label={`Abrir ${entry.reference}`}
                          className="inline-flex min-h-11 items-center gap-1 font-medium text-primary focus-visible:outline-2 focus-visible:outline-ring"
                        >
                          Abrir{" "}
                          <ArrowRight aria-hidden="true" className="size-4" />
                        </Link>
                      </div>
                      <p className="text-sm">
                        {entry.kind === "operation"
                          ? entry.client
                          : entry.title}
                      </p>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <dt className="text-xs text-muted-foreground">
                            Facturación
                          </dt>
                          <dd>
                            {entry.kind === "operation"
                              ? entry.billing
                              : entry.status}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-muted-foreground">
                            Cobranza
                          </dt>
                          <dd>
                            {entry.kind === "operation"
                              ? entry.collection
                              : "No aplica"}
                          </dd>
                        </div>
                      </dl>
                      <p className="mt-2 text-sm">{entry.nextAction}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {entry.responsible || "Responsable pendiente"}
                        {entry.updatedOn
                          ? ` · Actualización ${formatDate(entry.updatedOn)}`
                          : " · Fecha pendiente"}
                      </p>
                    </li>
                  )
                })}
              </ul>
              <div
                role="region"
                aria-label="Cola administrativa, tabla desplazable horizontalmente"
                tabIndex={0}
                className="hidden overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring xl:block"
              >
                <table className="w-full min-w-[46rem] text-left text-sm">
                  <caption className="sr-only">
                    Cola administrativa de demostración, sin importes
                  </caption>
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th scope="col" className="px-3 py-2 font-medium">
                        Referencia
                      </th>
                      <th scope="col" className="px-3 py-2 font-medium">
                        Contexto
                      </th>
                      <th scope="col" className="px-3 py-2 font-medium">
                        Facturación
                      </th>
                      <th scope="col" className="px-3 py-2 font-medium">
                        Cobranza
                      </th>
                      <th scope="col" className="px-3 py-2 font-medium">
                        Acceso
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => {
                      const href =
                        entry.kind === "operation"
                          ? `/administracion/${entry.operationId}?returnTo=${encodeURIComponent(`/administracion${query || status ? `?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(status ? { estado: status } : {}) })}` : ""}`)}`
                          : `/administracion/finanzas?trabajo=${encodeURIComponent(entry.id)}`
                      const context =
                        entry.kind === "operation"
                          ? `${entry.client} · ${entry.operationKind}`
                          : entry.title
                      const billing =
                        entry.kind === "operation"
                          ? entry.billing
                          : entry.status
                      const collection =
                        entry.kind === "operation"
                          ? entry.collection
                          : "No aplica"
                      return (
                        <tr key={entry.id} className="border-b last:border-0">
                          <th scope="row" className="px-3 py-3 font-medium">
                            <Link
                              href={href}
                              className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                            >
                              {entry.reference}
                            </Link>
                          </th>
                          <td className="max-w-sm px-3 py-3">
                            <p>{context}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {entry.nextAction}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {entry.responsible || "Responsable pendiente"}
                              {entry.updatedOn
                                ? ` · Actualización ${formatDate(entry.updatedOn)}`
                                : " · Fecha pendiente"}
                            </p>
                          </td>
                          <td className="px-3 py-3">
                            <Badge variant="outline">{billing}</Badge>
                          </td>
                          <td className="px-3 py-3">{collection}</td>
                          <td className="px-3 py-3">
                            <Link
                              href={href}
                              aria-label={`Abrir ${entry.reference}`}
                              className="inline-flex min-h-9 items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
                            >
                              Abrir{" "}
                              <ArrowRight
                                aria-hidden="true"
                                className="size-4"
                              />
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="border-y border-border py-8 text-sm text-muted-foreground">
              No hay elementos para estos filtros. La cola no crea estados ni
              operaciones implícitas.
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Facturada, cobrada, cumplida, post-embarque y cierre documental son
            dimensiones separadas.
          </p>
        </>
      )}
    </div>
  )
}
