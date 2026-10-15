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
import { useAdministrativeLedger } from "../state/use-administrative-ledger"
import {
  loadAdministrativeLedger,
  saveAdministrativeLedger,
  nextAdministrativeId,
  nextAdministrativeReference,
  categoryOptions,
  validateExpense,
  type LocalExpense,
} from "../data/administrative-ledger"
import { CategoryEditor } from "./category-editor"
import { OperationLinksField } from "./operation-links-field"
export function ExpenseEditor({
  expense,
  partyId = "",
  operationId = "",
  initialCurrency = "ARS",
  onSaved,
}: {
  expense?: LocalExpense
  partyId?: string
  operationId?: string
  initialCurrency?: LocalExpense["currency"]
  onSaved?: (id: string) => void
}) {
  const { scenario } = useScenario()
  const { organizations } = useOrganizations()
  const { state } = useAdministrativeLedger()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const blank: LocalExpense = {
    id: "",
    reference: "",
    date: DEMONSTRATION_DATE,
    description: "",
    categoryId: "",
    categoryAtEntry: "",
    currency: initialCurrency,
    amount: 0,
    partyId,
    operationIds: operationId ? [operationId] : [],
    evidence: "",
    notes: "",
    source: "Preparación local",
    externalReference: "",
  }
  const [draft, setDraft] = useState(expense ?? blank)
  const update = <K extends keyof LocalExpense>(
    key: K,
    value: LocalExpense[K]
  ) => setDraft((current) => ({ ...current, [key]: value }))
  if (
    !hasCapability(scenario, "finance.prepare") ||
    !hasCapability(scenario, "finance.expenses") ||
    !hasCapability(scenario, "costs.internal")
  )
    return null
  const suppliers = organizations.filter((item) =>
    item.roles.some(
      (role) =>
        role.role === "abt-supplier" &&
        (role.active || expense?.partyId === item.id)
    )
  )
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) {
          setDraft(expense ?? blank)
          setError("")
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            variant={expense ? "outline" : "default"}
            size="sm"
          />
        }
      >
        {expense ? "Editar gasto" : "Nuevo gasto"}
      </DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogPopup className="max-w-2xl">
            <DialogTitle>
              {expense ? "Editar gasto" : "Preparar gasto"}
            </DialogTitle>
            <DialogDescription>
              Preparación local: no contabiliza ni realiza pagos.
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
                    "expense-demo-",
                    current.expenses.map((item) => item.id)
                  )
                const category = current.categories.find(
                  (item) => item.id === draft.categoryId
                )
                const next = {
                  ...draft,
                  id,
                  reference:
                    draft.reference ||
                    nextAdministrativeReference(
                      "GAS-LOCAL-",
                      current.expenses.map((item) => item.reference)
                    ),
                  description: draft.description.trim(),
                  categoryAtEntry:
                    expense?.categoryId === draft.categoryId
                      ? expense.categoryAtEntry
                      : (category?.name ?? ""),
                }
                const message = validateExpense(next, current)
                if (message) {
                  setError(message)
                  return
                }
                saveAdministrativeLedger({
                  ...current,
                  expenses: expense
                    ? current.expenses.map((item) =>
                        item.id === id ? next : item
                      )
                    : [...current.expenses, next],
                  activity: [
                    ...current.activity,
                    {
                      on: DEMONSTRATION_DATE,
                      entityId: id,
                      description: expense
                        ? "Preparación de gasto actualizada; sin escritura externa."
                        : "Gasto preparado localmente; no implica pago ni obligación externa.",
                    },
                  ],
                })
                setOpen(false)
                onSaved?.(id)
              }}
            >
              <label className="block text-sm font-medium">
                Concepto del gasto
                <Input
                  required
                  className="mt-1"
                  value={draft.description}
                  onChange={(event) =>
                    update("description", event.target.value)
                  }
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  Fecha de registro
                  <Input
                    required
                    type="date"
                    max={DEMONSTRATION_DATE}
                    className="mt-1"
                    value={draft.date}
                    onChange={(event) => update("date", event.target.value)}
                  />
                </label>
                <label className="text-sm font-medium">
                  Moneda
                  <select
                    aria-label="Moneda del gasto"
                    className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={draft.currency}
                    onChange={(event) =>
                      update(
                        "currency",
                        event.target.value as LocalExpense["currency"]
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
                    required
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="mt-1"
                    value={draft.amount || ""}
                    onChange={(event) =>
                      update("amount", Number(event.target.value))
                    }
                  />
                </label>
                <div>
                  <SearchableCombobox
                    label="Categoría de gasto"
                    options={categoryOptions(
                      state,
                      "Gasto",
                      expense?.categoryId
                    ).map((item) => ({
                      value: item.id,
                      label: item.name + (item.active ? "" : " · Inactiva"),
                    }))}
                    value={draft.categoryId}
                    onChange={(value) => update("categoryId", value)}
                  />
                  <div className="mt-2">
                    <CategoryEditor
                      onSaved={(id) => update("categoryId", id)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <SearchableCombobox
                  label="Proveedor contratado por ABT · opcional"
                  value={draft.partyId}
                  options={[
                    { value: "", label: "Sin proveedor identificado" },
                    ...suppliers.map((item) => ({
                      value: item.id,
                      label: item.name,
                      description: item.country,
                    })),
                  ]}
                  onChange={(value) => update("partyId", value)}
                />
                <OrganizationEditor
                  role="abt-supplier"
                  onSaved={(item) => update("partyId", item.id)}
                />
              </div>
              <OperationLinksField
                value={draft.operationIds}
                onChange={(value) => update("operationIds", value)}
              />
              <label className="block text-sm font-medium">
                Referencia de comprobante o evidencia
                <Input
                  className="mt-1"
                  value={draft.evidence}
                  onChange={(event) => update("evidence", event.target.value)}
                  placeholder="Referencia local; sin archivo real"
                />
              </label>
              <label className="block text-sm font-medium">
                Observaciones
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
                <Button type="submit">Guardar gasto local</Button>
              </div>
            </form>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  )
}
