"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { PageHeader } from "@/components/navigation/page-header"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"
import { useAdministrativeLedger } from "../state/use-administrative-ledger"
import {
  loadAdministrativeLedger,
  saveAdministrativeLedger,
} from "../data/administrative-ledger"
import { CategoryEditor } from "./category-editor"
export function CategoriesPage() {
  const { state } = useAdministrativeLedger()
  const { scenario } = useScenario()
  const [query, setQuery] = useState("")
  const [all, setAll] = useState(false)
  const [feedback, setFeedback] = useState("")
  const canEdit =
    hasCapability(scenario, "catalogs.manage") &&
    hasCapability(scenario, "finance.prepare")
  if (!canEdit)
    return (
      <p role="status">
        La administración del catálogo no está disponible para tus capacidades.
      </p>
    )
  const rows = state.categories.filter(
    (item) =>
      (all || item.active) &&
      item.name
        .toLocaleLowerCase("es-AR")
        .includes(query.toLocaleLowerCase("es-AR"))
  )
  return (
    <div className="space-y-5">
      <PageHeader
        title="Categorías y conceptos"
        primaryAction={
          <CategoryEditor
            onSaved={() =>
              setFeedback(
                "Categoría guardada y disponible para los registros compatibles."
              )
            }
          />
        }
      />
      <Link
        href="/configuracion"
        className="inline-flex min-h-10 items-center text-sm text-primary underline"
      >
        Volver a Configuración
      </Link>
      <Link
        href="/administracion/gastos"
        className="text-sm text-primary underline"
      >
        Volver a Gastos
      </Link>
      <div className="flex flex-wrap items-end gap-4">
        <label className="min-w-0 flex-1 text-xs font-medium">
          Buscar categoría
          <Input
            className="mt-1"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="flex min-h-10 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={all}
            onChange={(event) => setAll(event.target.checked)}
          />
          Incluir inactivas
        </label>
      </div>
      {feedback && (
        <p role="status" className="text-sm">
          {feedback}
        </p>
      )}
      <ul
        aria-label="Categorías administrativas"
        className="divide-y divide-border rounded-lg border border-border bg-card px-4"
      >
        {rows.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-muted-foreground">
                {item.scope} · {item.active ? "Activa" : "Inactiva"}
              </p>
            </div>
            <div className="flex gap-2">
              <CategoryEditor category={item} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (
                    !window.confirm(
                      (item.active ? "Inactivar" : "Reactivar") +
                        " " +
                        item.name +
                        ". Se preservan registros e historial. ¿Continuar?"
                    )
                  )
                    return
                  const current = loadAdministrativeLedger()
                  saveAdministrativeLedger({
                    ...current,
                    categories: current.categories.map((category) =>
                      category.id === item.id
                        ? { ...category, active: !category.active }
                        : category
                    ),
                    activity: [
                      ...current.activity,
                      {
                        on: DEMONSTRATION_DATE,
                        entityId: item.id,
                        description: item.active
                          ? "Categoría inactivada, historial preservado."
                          : "Categoría reactivada.",
                      },
                    ],
                  })
                  setFeedback(
                    "Estado de categoría actualizado; los registros existentes se conservan."
                  )
                }}
              >
                {item.active ? "Inactivar" : "Reactivar"}
              </Button>
            </div>
          </li>
        ))}
        {!rows.length && (
          <li className="py-6 text-sm" role="status">
            Sin coincidencias. Limpiá la búsqueda o incluí categorías inactivas.
          </li>
        )}
      </ul>
      <details className="text-sm">
        <summary className="cursor-pointer font-medium">
          Alcance de clasificación
        </summary>
        <p className="mt-2 text-muted-foreground">
          Concepto describe cada registro; categoría permite explorarlo.
          Subcategorías, centros de costo y mapeo con Alpha2000 requieren
          definición; este catálogo no altera registraciones contables.
        </p>
      </details>
    </div>
  )
}
