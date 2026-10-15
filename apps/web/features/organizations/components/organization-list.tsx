"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useListContext } from "@/components/navigation/list-context"
import { PageHeader } from "@/components/navigation/page-header"
import {
  DataTable,
  DataTableFrame,
  createColumnHelper,
  dataTableFeatures,
  getDataTableColumnMeta,
} from "@workspace/ui/components/data-table"
import { Input } from "@workspace/ui/components/input"
import { useOrganizations } from "../state/use-organizations"
import {
  organizationsWithRole,
  roleLabels,
  type Organization,
  type OrganizationRole,
} from "../data/organizations"
import { OrganizationEditor } from "./organization-editor"

const helper = createColumnHelper<typeof dataTableFeatures, Organization>()
export function OrganizationList({
  role,
  searchParams,
}: {
  role: OrganizationRole
  searchParams: Record<string, string | string[] | undefined>
}) {
  const { organizations, ready } = useOrganizations()
  const [query, setQuery] = useState(
    typeof searchParams.q === "string" ? searchParams.q : ""
  )
  const [state, setState] = useState(
    typeof searchParams.estado === "string" &&
      ["inactive", "all"].includes(searchParams.estado)
      ? searchParams.estado
      : "active"
  )
  useEffect(() => {
    const restore = () => {
      const params = new URLSearchParams(window.location.search)
      setQuery(params.get("q") ?? "")
      const status = params.get("estado")
      setState(status === "inactive" || status === "all" ? status : "active")
    }
    window.addEventListener("popstate", restore)
    return () => window.removeEventListener("popstate", restore)
  }, [])
  function change(nextQuery: string, nextState: string, replace = false) {
    setQuery(nextQuery)
    setState(nextState)
    const params = new URLSearchParams()
    if (role === "operation-party") params.set("ambito", "operacion")
    if (nextQuery) params.set("q", nextQuery)
    if (nextState !== "active") params.set("estado", nextState)
    window.history[replace ? "replaceState" : "pushState"](
      null,
      "",
      `/proveedores${params.size ? `?${params}` : ""}`
    )
  }
  const [feedback, setFeedback] = useState("")
  const [lastSaved, setLastSaved] = useState("")
  const title =
    role === "abt-supplier"
      ? "Proveedores de ABT"
      : "Contrapartes de operaciones"
  const params = new URLSearchParams()
  if (role === "operation-party") params.set("ambito", "operacion")
  if (query) params.set("q", query)
  if (state !== "active") params.set("estado", state)
  const path = `/proveedores${params.size ? `?${params}` : ""}`
  const captureContext = useListContext(ready, path)
  const list = organizationsWithRole(organizations, role).filter(
    (item) =>
      `${item.name} ${item.taxReference} ${item.country}`
        .toLocaleLowerCase("es-AR")
        .includes(query.toLocaleLowerCase("es-AR")) &&
      (state === "all" ||
        item.roles.some(
          (entry) =>
            entry.role === role && entry.active === (state === "active")
        ))
  )
  const href = (item: Organization) =>
    `/proveedores/${item.id}?returnTo=${encodeURIComponent(path)}`
  const columns = helper.columns([
    helper.accessor("name", {
      header: "Organización",
      cell: (info) => (
        <Link
          href={href(info.row.original)}
          className="font-medium text-primary hover:underline"
        >
          {info.getValue()}
        </Link>
      ),
      ...getDataTableColumnMeta("flexible", { priority: "critical" }),
    }),
    helper.accessor("country", {
      header: "País",
      cell: (info) => info.getValue() || "Sin informar",
      ...getDataTableColumnMeta("compact"),
    }),
    helper.accessor("taxReference", {
      header: "Identificación",
      cell: (info) => info.getValue() || "Sin informar",
      ...getDataTableColumnMeta("flexible", { priority: "high" }),
    }),
    helper.display({
      id: "state",
      header: "Estado",
      cell: (info) =>
        info.row.original.roles.find((entry) => entry.role === role)?.active
          ? "Activo"
          : "Inactivo",
      ...getDataTableColumnMeta("status"),
    }),
    helper.display({
      id: "open",
      header: "Acción",
      cell: (info) => (
        <Link
          href={href(info.row.original)}
          className="inline-flex min-h-9 items-center font-medium text-primary hover:underline"
          aria-label={`Abrir ${info.row.original.name}`}
        >
          Abrir ficha
        </Link>
      ),
      ...getDataTableColumnMeta("compact", { priority: "critical" }),
    }),
  ])
  if (!ready) return <p role="status">Cargando organizaciones…</p>
  return (
    <div className="space-y-4" onClickCapture={captureContext}>
      <PageHeader
        title={title}
        primaryAction={
          <OrganizationEditor
            role={role}
            onSaved={(item) => {
              setLastSaved(item.id)
              setFeedback(
                `${item.name} guardado. Disponible en las vistas relacionadas.`
              )
            }}
          />
        }
      />
      <nav
        aria-label="Maestros de organizaciones"
        className="flex flex-wrap gap-1 border-b border-border pb-3 text-sm"
      >
        <Link
          className={
            role === "abt-supplier"
              ? "rounded-md bg-accent px-3 py-2 font-medium text-accent-foreground"
              : "rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          }
          aria-current={role === "abt-supplier" ? "page" : undefined}
          href="/proveedores"
        >
          Proveedores de ABT
        </Link>
        <Link
          className={
            role === "operation-party"
              ? "rounded-md bg-accent px-3 py-2 font-medium text-accent-foreground"
              : "rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          }
          aria-current={role === "operation-party" ? "page" : undefined}
          href="/proveedores?ambito=operacion"
        >
          Contrapartes de operaciones
        </Link>
      </nav>
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-card p-3">
        <label className="grid min-w-0 flex-1 gap-1 text-xs font-medium">
          Buscar organización
          <Input
            type="search"
            value={query}
            onChange={(event) => change(event.target.value, state, true)}
          />
        </label>
        <label className="grid gap-1 text-xs font-medium">
          Estado
          <select
            value={state}
            onChange={(event) => change(query, event.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
            <option value="all">Todos</option>
          </select>
        </label>
      </div>
      {role === "operation-party" && (
        <p className="text-sm text-muted-foreground">
          Participantes de operaciones de clientes. Su inclusión no genera
          obligaciones de pago de ABT.
        </p>
      )}
      <p role="status" className="text-sm">
        {feedback || `${list.length} organizaciones`}
      </p>
      {lastSaved && (
        <Link
          className="inline-flex min-h-9 items-center text-sm font-medium text-primary underline"
          href={`/proveedores/${lastSaved}?returnTo=${encodeURIComponent(path)}`}
        >
          Abrir organización guardada
        </Link>
      )}
      {!list.length ? (
        <p className="py-5 text-sm">
          No hay coincidencias. Revisá búsqueda y estado.
        </p>
      ) : (
        <>
          <DataTableFrame className="hidden md:block">
            <DataTable
              caption={title}
              columns={columns}
              data={list}
              getRowId={(item) => item.id}
            />
          </DataTableFrame>
          <ul aria-label={title} className="divide-y divide-border md:hidden">
            {list.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.country || "País sin informar"} ·{" "}
                    {item.roles.find((entry) => entry.role === role)?.active
                      ? "Activo"
                      : "Inactivo"}
                  </p>
                </div>
                <Link
                  className="inline-flex min-h-10 shrink-0 items-center text-sm font-medium text-primary"
                  href={href(item)}
                >
                  Abrir ficha
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      <details className="text-xs text-muted-foreground">
        <summary className="min-h-9 cursor-pointer py-2">
          Fuente del maestro
        </summary>
        Preparación local de {roleLabels[role].toLocaleLowerCase("es-AR")}.
        Identificadores y autoridad por campo a validar con ABT/Alpha2000.
      </details>
    </div>
  )
}
