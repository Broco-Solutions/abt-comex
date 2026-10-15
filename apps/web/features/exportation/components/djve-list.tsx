"use client"
import Link from "next/link"
import { PageHeader } from "@/components/navigation/page-header"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { formatRecordedDate } from "@workspace/ui/lib/date"
import {
  demonstrationDjves,
  demonstrationPermits,
} from "../data/exportation-scenarios"
import type { DemonstrationDjve } from "../types/exportation"

export function DjveList({
  returnTo = "/operaciones?tipo=exportacion",
  query = "",
  page = 1,
  djves = demonstrationDjves,
}: {
  returnTo?: string
  query?: string
  page?: number
  djves?: DemonstrationDjve[]
}) {
  const backTo =
    /^\/(?:operaciones(?:\/[a-z0-9-]+(?:\/exportacion)?)?|mi-trabajo|tramites\/djve(?:\/[a-z0-9-]+)?)(?:\?[^#]*)?(?:#.*)?$/.test(
      returnTo
    )
      ? returnTo
      : "/operaciones?tipo=exportacion"
  const filtered = djves.filter((djve) => {
    const permits = djve.permitIds
      .map(
        (id) => demonstrationPermits.find((p) => p.id === id)?.reference ?? ""
      )
      .join(" ")
    return (djve.reference + " " + djve.description + " " + permits)
      .toLocaleLowerCase("es-AR")
      .includes(query.trim().toLocaleLowerCase("es-AR"))
  })
  const pageCount = Math.max(1, Math.ceil(filtered.length / 10))
  const currentPage = Math.min(
    pageCount,
    Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1)
  )
  const visible = filtered.slice((currentPage - 1) * 10, currentPage * 10)
  const params = new URLSearchParams({ returnTo: backTo })
  if (query) params.set("q", query)
  if (currentPage > 1) params.set("pagina", String(currentPage))
  const listContext = "/tramites/djve?" + params
  const pageHref = (value: number) => {
    const next = new URLSearchParams(params)
    next.set("pagina", String(value))
    return "/tramites/djve?" + next
  }
  return (
    <div className="space-y-6">
      <Link
        href={backTo}
        className="inline-flex min-h-9 items-center text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
      >
        Volver al contexto anterior
      </Link>
      <PageHeader title="DJVE y permisos" />
      <form
        action="/tramites/djve"
        method="get"
        className="flex max-w-xl flex-wrap items-end gap-2"
      >
        <input type="hidden" name="returnTo" value={backTo} />
        <label
          htmlFor="djve-search"
          className="min-w-0 flex-1 text-xs font-medium"
        >
          Buscar DJVE o permiso
          <Input
            key={query}
            id="djve-search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Referencia o permiso"
            className="mt-1"
          />
        </label>
        <Button type="submit" size="sm">
          Buscar
        </Button>
        {query ? (
          <Link
            href={pageHref(1).replace(/&q=[^&]*/, "")}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Limpiar
          </Link>
        ) : null}
      </form>
      <p role="status" className="text-xs text-muted-foreground">
        {filtered.length} trámites
        {pageCount > 1 ? ` · página ${currentPage} de ${pageCount}` : ""}
      </p>
      {visible.length ? (
        <ul
          className="divide-y divide-border border-y border-border"
          aria-label="Trámites DJVE"
        >
          {visible.map((djve) => (
            <li
              key={djve.id}
              className="grid gap-3 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center"
            >
              <div>
                <Link
                  href={`/tramites/djve/${djve.id}?returnTo=${encodeURIComponent(listContext)}`}
                  className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                >
                  {djve.reference}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  {djve.description}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {djve.autonomous
                    ? "Trámite autónomo"
                    : "Relacionado con una operación"}
                </p>
              </div>
              <div className="text-sm">
                <p className="break-words">
                  Permisos:{" "}
                  {djve.permitIds
                    .map(
                      (id) =>
                        demonstrationPermits.find((p) => p.id === id)?.reference
                    )
                    .filter(Boolean)
                    .join(", ") || "Sin relaciones informadas"}
                </p>
                <p className="mt-1 text-muted-foreground">
                  Vencimiento: {formatRecordedDate(djve.expirationDate)}
                </p>
              </div>
              <Link
                href={`/tramites/djve/${djve.id}?returnTo=${encodeURIComponent(listContext)}`}
                className="inline-flex min-h-9 items-center text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
              >
                Abrir detalle
                <span className="sr-only"> · {djve.reference}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p role="status" className="py-6 text-sm text-muted-foreground">
          No hay resultados para esta búsqueda.
        </p>
      )}
      {pageCount > 1 ? (
        <nav aria-label="Páginas de DJVE" className="flex gap-2">
          {currentPage > 1 ? (
            <Link
              href={pageHref(currentPage - 1)}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Anterior
            </Link>
          ) : null}
          {currentPage < pageCount ? (
            <Link
              href={pageHref(currentPage + 1)}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Siguiente
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  )
}
