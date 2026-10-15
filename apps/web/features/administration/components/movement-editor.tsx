"use client"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { SearchableCombobox } from "@workspace/ui/components/searchable-combobox"
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
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"
import { useOrganizations } from "@/features/organizations/state/use-organizations"
import { OrganizationEditor } from "@/features/organizations/components/organization-editor"
import { usePeople } from "@/features/people/state/use-people"
import { useAdministrativeLedger } from "../state/use-administrative-ledger"
import {
  loadAdministrativeLedger,
  saveAdministrativeLedger,
  nextAdministrativeId,
  nextAdministrativeReference,
  categoryOptions,
  validateMovement,
  movementDirection,
  movementNatures,
  type LocalMovement,
  type MovementNature,
} from "../data/administrative-ledger"
import { CategoryEditor } from "./category-editor"
import { OperationLinksField } from "./operation-links-field"
export function MovementEditor({
  movement,
  onSaved,
}: {
  movement?: LocalMovement
  onSaved?: (id: string) => void
}) {
  const { scenario } = useScenario()
  const { organizations } = useOrganizations()
  const { state: people } = usePeople()
  const { state } = useAdministrativeLedger()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const canIncome = hasCapability(scenario, "finance.collections"),
    canOutflow = hasCapability(scenario, "finance.treasury")
  const blank: LocalMovement = {
    id: "",
    reference: "",
    date: DEMONSTRATION_DATE,
    nature: canIncome ? "Cobro" : "Pago",
    partyId: "",
    memberId: "",
    currency: "ARS",
    amount: 0,
    categoryId: "",
    operationIds: [],
    evidence: "",
    notes: "",
    source: "Preparación local",
    externalReference: "",
  }
  const [draft, setDraft] = useState(movement ?? blank)
  const update = <K extends keyof LocalMovement>(
    key: K,
    value: LocalMovement[K]
  ) => setDraft((current) => ({ ...current, [key]: value }))
  const direction = movementDirection(draft.nature)
  const role = ["Cobro", "Anticipo recibido"].includes(draft.nature)
    ? "client"
    : "abt-supplier"
  if (
    !hasCapability(scenario, "finance.prepare") ||
    (!canIncome && !canOutflow) ||
    (movement &&
      !(movementDirection(movement.nature) === "Ingreso"
        ? canIncome
        : canOutflow))
  )
    return null
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) {
          setDraft(movement ?? blank)
          setError("")
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            variant={movement ? "outline" : "default"}
            size="sm"
          />
        }
      >
        {movement ? "Editar movimiento" : "Nuevo movimiento"}
      </DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogPopup className="max-w-2xl">
            <DialogTitle>
              {movement ? "Editar movimiento" : "Preparar movimiento"}
            </DialogTitle>
            <DialogDescription>
              No ejecuta una transferencia, pago o cobro externo. Aplicaciones y
              saldos se consultan por separado.
            </DialogDescription>
            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                event.stopPropagation()
                const current = loadAdministrativeLedger()
                const id =
                  draft.id ||
                  nextAdministrativeId(
                    "movement-demo-",
                    current.movements.map((item) => item.id)
                  )
                const next = {
                  ...draft,
                  id,
                  reference:
                    draft.reference ||
                    nextAdministrativeReference(
                      "MOV-LOCAL-",
                      current.movements.map((item) => item.reference)
                    ),
                }
                const message = validateMovement(next, current)
                if (message) {
                  setError(message)
                  return
                }
                saveAdministrativeLedger({
                  ...current,
                  movements: movement
                    ? current.movements.map((item) =>
                        item.id === id ? next : item
                      )
                    : [...current.movements, next],
                  activity: [
                    ...current.activity,
                    {
                      on: DEMONSTRATION_DATE,
                      entityId: id,
                      description: movement
                        ? "Movimiento local actualizado; sin acción bancaria."
                        : "Referencia de movimiento preparada; no ejecuta ni confirma fondos reales.",
                    },
                  ],
                })
                setOpen(false)
                onSaved?.(id)
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  Naturaleza
                  <select
                    aria-label="Naturaleza del movimiento"
                    className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={draft.nature}
                    onChange={(event) => {
                      const nature = event.target.value as MovementNature
                      setDraft((current) => ({
                        ...current,
                        nature,
                        categoryId: "",
                        partyId: "",
                        memberId: "",
                      }))
                    }}
                  >
                    {movementNatures
                      .filter((nature) =>
                        movementDirection(nature) === "Ingreso"
                          ? canIncome
                          : canOutflow
                      )
                      .map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                  </select>
                </label>
                <label className="text-sm font-medium">
                  Fecha del movimiento
                  <Input
                    type="date"
                    required
                    max={DEMONSTRATION_DATE}
                    value={draft.date}
                    onChange={(event) => update("date", event.target.value)}
                    className="mt-1"
                  />
                </label>
                <label className="text-sm font-medium">
                  Moneda
                  <select
                    aria-label="Moneda del movimiento"
                    className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={draft.currency}
                    onChange={(event) =>
                      update(
                        "currency",
                        event.target.value as LocalMovement["currency"]
                      )
                    }
                  >
                    <option>ARS</option>
                    <option>USD</option>
                  </select>
                </label>
                <label className="text-sm font-medium">
                  Importe
                  <Input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    className="mt-1"
                    value={draft.amount || ""}
                    onChange={(event) =>
                      update("amount", Number(event.target.value))
                    }
                  />
                </label>
              </div>
              <div className="space-y-2">
                <SearchableCombobox
                  label="Categoría del movimiento"
                  value={draft.categoryId}
                  onChange={(value) => update("categoryId", value)}
                  options={categoryOptions(
                    state,
                    direction,
                    movement?.categoryId
                  ).map((item) => ({
                    value: item.id,
                    label: item.name + (item.active ? "" : " · Inactiva"),
                  }))}
                />
                <CategoryEditor
                  defaultScope={direction}
                  onSaved={(id) => update("categoryId", id)}
                />
              </div>
              <div className="space-y-2">
                <SearchableCombobox
                  label={
                    role === "client"
                      ? "Cliente del movimiento"
                      : "Proveedor ABT del movimiento · opcional"
                  }
                  value={draft.partyId}
                  onChange={(value) => update("partyId", value)}
                  options={[
                    { value: "", label: "Sin contraparte identificada" },
                    ...organizations
                      .filter((item) =>
                        item.roles.some(
                          (entry) =>
                            entry.role === role &&
                            (entry.active || movement?.partyId === item.id)
                        )
                      )
                      .map((item) => ({
                        value: item.id,
                        label: item.name,
                        description: item.country,
                      })),
                  ]}
                />
                <OrganizationEditor
                  role={role}
                  onSaved={(item) => update("partyId", item.id)}
                />
              </div>
              {["Anticipo entregado", "Devolución de anticipo"].includes(
                draft.nature
              ) && (
                <SearchableCombobox
                  label="Integrante relacionado · opcional"
                  value={draft.memberId}
                  onChange={(value) => update("memberId", value)}
                  options={[
                    { value: "", label: "Sin integrante relacionado" },
                    ...people.members
                      .filter((item) => item.perspective !== "client")
                      .map((item) => ({
                        value: item.id,
                        label: item.name,
                        description: item.area,
                      })),
                  ]}
                />
              )}
              <OperationLinksField
                value={draft.operationIds}
                onChange={(value) => update("operationIds", value)}
              />
              <label className="block text-sm font-medium">
                Referencia de evidencia
                <Input
                  className="mt-1"
                  value={draft.evidence}
                  onChange={(event) => update("evidence", event.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                Concepto u observaciones
                <Input
                  className="mt-1"
                  value={draft.notes}
                  onChange={(event) => update("notes", event.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                Referencia externa por verificar · opcional
                <Input
                  className="mt-1"
                  value={draft.externalReference}
                  onChange={(event) =>
                    update("externalReference", event.target.value)
                  }
                />
              </label>
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
                <Button type="submit">Guardar movimiento local</Button>
              </div>
            </form>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  )
}
