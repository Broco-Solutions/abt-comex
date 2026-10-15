"use client"
import Link from "next/link"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useListContext } from "@/components/navigation/list-context"
import { Input } from "@workspace/ui/components/input"
import { PageHeader } from "@/components/navigation/page-header"
import { usePeople } from "../state/use-people"
import { MemberEditor } from "./member-editor"
export function PeopleList() {
  const { state, ready } = usePeople()
  const params = useSearchParams()
  const query = params.get("q") ?? ""
  const access = params.get("acceso") ?? ""
  const context =
    "/configuracion/personas" + (params.size ? "?" + params.toString() : "")
  const capture = useListContext(ready, context)
  function change(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    window.history[key === "q" ? "replaceState" : "pushState"](
      null,
      "",
      "/configuracion/personas" + (next.size ? "?" + next.toString() : "")
    )
  }
  const [saved, setSaved] = useState("")
  const rows = state.members.filter(
    (item) =>
      (!access || item.access === access) &&
      (item.name + " " + item.email + " " + item.area + " " + item.function)
        .toLocaleLowerCase("es-AR")
        .includes(query.toLocaleLowerCase("es-AR"))
  )
  return (
    <div className="space-y-5" onClickCapture={capture}>
      <PageHeader title="Personas y acceso" />
      <p className="text-sm text-muted-foreground">
        Nómina relevada de ABT. El acceso al sistema y las asignaciones
        individuales requieren confirmación; los escenarios de evaluación son
        independientes.
      </p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav
          aria-label="Configuración de personas"
          className="flex gap-4 text-sm"
        >
          <Link href="/configuracion" className="text-primary underline">
            Configuración
          </Link>
          <Link
            href="/configuracion/equipos"
            className="text-primary underline"
          >
            Equipos
          </Link>
        </nav>
        <MemberEditor onSaved={setSaved} />
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="min-w-0 flex-1 text-xs font-medium">
          Buscar integrante
          <Input
            value={query}
            onChange={(event) => change("q", event.target.value)}
            className="mt-1"
            placeholder="Nombre, correo, área o función"
          />
        </label>
        <label className="text-xs font-medium">
          Acceso
          <select
            className="mt-1 block h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={access}
            onChange={(event) => change("acceso", event.target.value)}
          >
            <option value="">Todos</option>
            {[
              "No relevado",
              "Sin acceso",
              "Invitación preparada",
              "Activo",
              "Suspendido",
              "Baja de acceso",
            ].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
      </div>
      {saved && (
        <p role="status" className="text-sm">
          Integrante guardado.{" "}
          <Link
            className="text-primary underline"
            href={"/configuracion/personas/" + saved}
          >
            Abrir ficha
          </Link>
        </p>
      )}
      {!ready ? (
        <p role="status">Preparando integrantes…</p>
      ) : (
        <ul
          aria-label="Integrantes"
          className="divide-y divide-border rounded-lg border border-border bg-card px-4"
        >
          {rows.map((item) => (
            <li
              key={item.id}
              className="grid gap-2 py-4 text-sm sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
            >
              <div>
                <Link
                  href={
                    "/configuracion/personas/" +
                    item.id +
                    "?returnTo=" +
                    encodeURIComponent(context)
                  }
                  className="font-medium text-primary underline underline-offset-4"
                >
                  {item.name}
                </Link>
                <p className="mt-1 break-all text-muted-foreground">
                  {item.email || "Sin correo de acceso"}
                </p>
              </div>
              <p>
                {item.area || "Área pendiente"}
                <span className="block text-muted-foreground">
                  {item.function || "Función pendiente"}
                </span>
              </p>
              <p>{item.access}</p>
            </li>
          ))}
          {!rows.length && (
            <li role="status" className="py-6 text-sm">
              Sin coincidencias. Probá otro nombre o limpiá el filtro de acceso.
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
