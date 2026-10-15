"use client"

import { useState } from "react"
import { formatDate } from "@workspace/ui/lib/date"
import { SearchableCombobox } from "@workspace/ui/components/searchable-combobox"
import { usePeople } from "@/features/people/state/use-people"
import type { OperationListFilters } from "../data/operations"

const control =
  "h-9 min-w-0 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
const situations = [
  "Pre-embarque",
  "En seguimiento",
  "Requiere atención",
  "Pendiente documental",
  "Lista para revisión",
]
const teams = [
  "Equipo Impo A",
  "Equipo Impo B",
  "Equipo Expo A",
  "Equipo Expo B",
]

export function OperationsToolbar({
  filters,
  change,
}: {
  filters: OperationListFilters
  change: (patch: Partial<OperationListFilters>) => void
}) {
  const [query, setQuery] = useState(filters.q)
  const { state: people } = usePeople()
  const [from, setFrom] = useState(filters.from)
  const [to, setTo] = useState(filters.to)
  const [rangeError, setRangeError] = useState("")
  const applied = JSON.stringify([filters.q, filters.from, filters.to])
  const [previousApplied, setPreviousApplied] = useState(applied)
  if (previousApplied !== applied) {
    setPreviousApplied(applied)
    setQuery(filters.q)
    setFrom(filters.from)
    setTo(filters.to)
  }
  return (
    <section aria-label="Filtros de operaciones" className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <form
          className="flex w-full min-w-0 items-end gap-2 sm:w-auto sm:min-w-64 sm:flex-1"
          onSubmit={(event) => {
            event.preventDefault()
            change({ q: query, page: 1 })
          }}
        >
          <label className="grid min-w-0 flex-1 gap-1 text-xs font-medium">
            Buscar operaciones
            <input
              className={`${control} w-full`}
              type="search"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Referencia o cliente"
            />
          </label>
          <button
            className={`${control} font-medium text-primary`}
            type="submit"
          >
            Buscar
          </button>
        </form>
        <label className="grid min-w-0 flex-1 gap-1 text-xs font-medium sm:flex-none">
          Situación
          <select
            className={control}
            name="situacion"
            value={filters.situation}
            onChange={(event) =>
              change({ situation: event.target.value, page: 1 })
            }
          >
            <option value="">Todas</option>
            {situations.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <details className="group w-auto">
          <summary
            className={`${control} inline-flex cursor-pointer items-center font-medium`}
          >
            Más filtros
          </summary>
          <div className="mt-3 grid gap-3 rounded-md bg-muted p-3 sm:grid-cols-2">
            {!filters.kind && (
              <label className="grid gap-1 text-xs font-medium">
                Tipo
                <select
                  className={control}
                  name="tipo"
                  value={filters.kind}
                  onChange={(event) =>
                    change({
                      kind: event.target.value as OperationListFilters["kind"],
                      page: 1,
                    })
                  }
                >
                  <option value="">Todos</option>
                  <option value="importacion">Importación</option>
                  <option value="exportacion">Exportación</option>
                </select>
              </label>
            )}
            <SearchableCombobox
              label="Responsable"
              value={filters.responsible}
              onChange={(responsible) => change({ responsible, page: 1 })}
              options={[
                { value: "", label: "Todos" },
                { value: "pending", label: "Sin asignación individual" },
                ...people.members.map((person) => ({
                  value: person.id,
                  label: person.name,
                  description: person.area,
                })),
                ...teams.map((value) => ({
                  value,
                  label: value,
                  description: "Referencia de evaluación",
                })),
              ]}
            />
            <form
              className="grid gap-2 sm:col-span-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
              onSubmit={(event) => {
                event.preventDefault()
                if (from && to && from > to) {
                  setRangeError("Desde no puede ser posterior a Hasta.")
                  return
                }
                setRangeError("")
                change({ from, to, page: 1 })
              }}
            >
              <label className="grid min-w-0 gap-1 text-xs font-medium">
                Actualización desde
                <input
                  className={control}
                  name="desde"
                  type="date"
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                />
              </label>
              <label className="grid min-w-0 gap-1 text-xs font-medium">
                Actualización hasta
                <input
                  className={control}
                  name="hasta"
                  type="date"
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                />
              </label>
              <button className={`${control} font-medium text-primary`}>
                Aplicar período
              </button>
              {rangeError && (
                <p
                  role="alert"
                  className="text-sm text-destructive sm:col-span-3"
                >
                  {rangeError}
                </p>
              )}
            </form>
          </div>
        </details>
      </div>
      {(filters.q ||
        filters.responsible ||
        filters.situation ||
        filters.from ||
        filters.to) && (
        <div
          aria-label="Filtros activos"
          className="flex flex-wrap items-center gap-2 text-xs"
        >
          {(
            [
              ["q", filters.q],
              [
                "responsible",
                people.members.find(
                  (person) => person.id === filters.responsible
                )?.name ??
                  (filters.responsible === "pending"
                    ? "Sin asignación individual"
                    : filters.responsible),
              ],
              ["situation", filters.situation],
              [
                "from",
                filters.from
                  ? `Actualización desde ${formatDate(filters.from)}`
                  : "",
              ],
              [
                "to",
                filters.to
                  ? `Actualización hasta ${formatDate(filters.to)}`
                  : "",
              ],
            ] as const
          )
            .filter(([, value]) => value)
            .map(([field, label]) => (
              <button
                key={field}
                className="min-h-8 rounded-md border border-primary/30 bg-accent px-2 text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring"
                onClick={() => {
                  change({ [field]: "", page: 1 })
                  if (field === "q") setQuery("")
                  if (field === "from") setFrom("")
                  if (field === "to") setTo("")
                }}
                aria-label={`Quitar filtro ${label}`}
              >
                {label} ×
              </button>
            ))}
          <button
            className="min-h-8 px-2 text-primary underline"
            onClick={() => {
              setQuery("")
              setFrom("")
              setTo("")
              change({
                q: "",
                responsible: "",
                situation: "",
                from: "",
                to: "",
                page: 1,
              })
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </section>
  )
}
