"use client"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogViewport,
  DialogPopup,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"
import { hasCapability } from "@/features/demo/data/capabilities"
import { useScenario } from "@/features/demo/state/scenario-provider"
import {
  loadAdministrativeLedger,
  saveAdministrativeLedger,
  nextAdministrativeId,
  type AdministrativeCategory,
} from "../data/administrative-ledger"
export function CategoryEditor({
  category,
  onSaved,
  defaultScope = "Gasto",
}: {
  category?: AdministrativeCategory
  onSaved?: (id: string) => void
  defaultScope?: AdministrativeCategory["scope"]
}) {
  const { scenario } = useScenario()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(category?.name ?? "")
  const [scope, setScope] = useState<AdministrativeCategory["scope"]>(
    category?.scope ?? defaultScope
  )
  const [error, setError] = useState("")
  if (
    !hasCapability(scenario, "catalogs.manage") ||
    !hasCapability(scenario, "finance.prepare")
  )
    return null
  const used =
    category &&
    (loadAdministrativeLedger().expenses.some(
      (item) => item.categoryId === category.id
    ) ||
      loadAdministrativeLedger().movements.some(
        (item) => item.categoryId === category.id
      ))
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) {
          setName(category?.name ?? "")
          setScope(category?.scope ?? defaultScope)
          setError("")
        }
      }}
    >
      <DialogTrigger
        render={<Button type="button" variant="outline" size="sm" />}
      >
        {category ? "Editar categoría" : "Nueva categoría"}
      </DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogPopup>
            <DialogTitle>
              {category ? "Editar categoría" : "Nueva categoría"}
            </DialogTitle>
            <DialogDescription>
              Clasificación local. Renombrar no reclasifica registros ni cambia
              su denominación histórica.
            </DialogDescription>
            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                event.stopPropagation()
                const state = loadAdministrativeLedger()
                if (!name.trim()) {
                  setError("Completá el nombre de la categoría.")
                  return
                }
                if (
                  state.categories.some(
                    (item) =>
                      item.id !== category?.id &&
                      item.name.trim().toLocaleLowerCase("es-AR") ===
                        name.trim().toLocaleLowerCase("es-AR")
                  )
                ) {
                  setError(
                    "Ya existe una categoría con ese nombre. Reutilizala o revisá su estado."
                  )
                  return
                }
                const id =
                  category?.id ??
                  nextAdministrativeId(
                    "category-demo-",
                    state.categories.map((item) => item.id)
                  )
                const item = {
                  id,
                  name: name.trim(),
                  scope: used ? category!.scope : scope,
                  active: category?.active ?? true,
                }
                saveAdministrativeLedger({
                  ...state,
                  categories: category
                    ? state.categories.map((entry) =>
                        entry.id === id ? item : entry
                      )
                    : [...state.categories, item],
                  activity: [
                    ...state.activity,
                    {
                      on: DEMONSTRATION_DATE,
                      entityId: id,
                      description: category
                        ? "Categoría editada; clasificación histórica conservada."
                        : "Categoría preparada localmente.",
                    },
                  ],
                })
                setOpen(false)
                onSaved?.(id)
              }}
            >
              <label className="block text-sm font-medium">
                Nombre de categoría
                <Input
                  autoComplete="off"
                  className="mt-1"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>
              <label className="block text-sm font-medium">
                Uso
                <select
                  aria-label="Uso de categoría"
                  disabled={Boolean(used)}
                  value={scope}
                  onChange={(event) =>
                    setScope(event.target.value as typeof scope)
                  }
                  className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {["Gasto", "Ingreso", "Egreso", "Compartida"].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              {used && (
                <p className="text-sm text-muted-foreground">
                  El uso se conserva porque existen referencias. Para otro
                  significado, prepará una categoría distinta.
                </p>
              )}
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar categoría</Button>
              </div>
            </form>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  )
}
