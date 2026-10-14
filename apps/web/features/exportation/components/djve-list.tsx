"use client"

import { formatRecordedDate } from "@workspace/ui/lib/date"

import { useMemo, useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/navigation/page-header"
import { Input } from "@workspace/ui/components/input"

import {
  demonstrationDjves,
  demonstrationPermits,
} from "../data/exportation-scenarios"

export function DjveList({
  returnTo = "/operaciones?tipo=exportacion",
}: {
  returnTo?: string
}) {
  const [query, setQuery] = useState("")
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es-AR")
    if (!normalized) return demonstrationDjves
    return demonstrationDjves.filter((djve) => {
      const linkedPermits = djve.permitIds
        .map(
          (permitId) =>
            demonstrationPermits.find((permit) => permit.id === permitId)
              ?.reference ?? ""
        )
        .join(" ")
      return `${djve.reference} ${djve.description} ${linkedPermits}`
        .toLocaleLowerCase("es-AR")
        .includes(normalized)
    })
  }, [query])

  return (
    <div className="space-y-6">
      <Link
        href={returnTo}
        className="inline-flex min-h-9 items-center text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
      >
        Volver al contexto anterior
      </Link>
      <PageHeader title="DJVE y permisos" />
      <div className="max-w-xl space-y-2">
        <label htmlFor="djve-search" className="text-sm font-medium">
          Buscar DJVE o permiso
        </label>
        <Input
          id="djve-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Referencia o permiso"
        />
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "trámite" : "trámites"} en
          el escenario local · no confirma registros externos
        </p>
      </div>
      {filtered.length ? (
        <ul className="divide-y divide-border border-y border-border">
          {filtered.map((djve) => {
            const permits = djve.permitIds
              .map((permitId) =>
                demonstrationPermits.find((item) => item.id === permitId)
              )
              .filter((item) => item !== undefined)
            return (
              <li
                key={djve.id}
                className="grid gap-3 py-4 md:grid-cols-[minmax(0,1fr)_minmax(12rem,0.8fr)_auto] md:items-center"
              >
                <div>
                  <Link
                    href={`/tramites/djve/${djve.id}?returnTo=${encodeURIComponent(returnTo)}`}
                    className="font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {djve.reference}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {djve.description}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {djve.autonomous
                      ? "Fixture autónomo, no depende de una Operación"
                      : "Fixture relacionado con una Operación"}
                  </p>
                </div>
                <div className="text-sm">
                  <p>
                    <span className="text-muted-foreground">
                      Permisos relacionados:{" "}
                    </span>
                    {permits.length
                      ? permits.map((permit) => permit.reference).join(", ")
                      : "Ninguno en el fixture"}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Vencimiento ilustrativo:{" "}
                    {formatRecordedDate(djve.expirationDate)}
                  </p>
                </div>
                <Link
                  href={`/tramites/djve/${djve.id}?returnTo=${encodeURIComponent(returnTo)}`}
                  className="min-h-9 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                >
                  Abrir detalle
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <p
          role="status"
          className="border-y border-border py-6 text-sm text-muted-foreground"
        >
          No hay resultados para esta búsqueda. Los datos del escenario no
          cambian.
        </p>
      )}
      <aside className="max-w-3xl border-l-2 border-muted pl-4 text-sm text-muted-foreground">
        Este prototipo permite consultar relaciones sintéticas. Alta real,
        reglas de vigencia, cantidades, permisos y estados dependen de
        definiciones funcionales y fuentes autorizadas pendientes. No hay
        conexión con Alpha2000 ni ARCA/MOA.
      </aside>
    </div>
  )
}
