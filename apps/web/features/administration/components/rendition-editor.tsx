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
import { money } from "@/features/finance/data/financial-records"
import { useAdministrativeLedger } from "../state/use-administrative-ledger"
import {
  loadAdministrativeLedger,
  saveAdministrativeLedger,
  nextAdministrativeId,
  nextAdministrativeReference,
  sumAmounts,
  validateRendition,
  type LocalRendition,
} from "../data/administrative-ledger"
import { ExpenseEditor } from "./expense-editor"
export function RenditionEditor({
  rendition,
  onSaved,
}: {
  rendition?: LocalRendition
  onSaved?: (id: string) => void
}) {
  const { state } = useAdministrativeLedger()
  const { scenario } = useScenario()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const blank: LocalRendition = {
    id: "",
    reference: "",
    advanceId: "",
    advanceAmount: 0,
    expenseIds: [],
    refundId: "",
    refundAmount: 0,
    notes: "",
  }
  const [draft, setDraft] = useState(rendition ?? blank)
  const advance = state.movements.find((item) => item.id === draft.advanceId)
  const currency = advance?.currency ?? "ARS"
  const update = <K extends keyof LocalRendition>(
    key: K,
    value: LocalRendition[K]
  ) => setDraft((current) => ({ ...current, [key]: value }))
  if (
    !hasCapability(scenario, "finance.prepare") ||
    !hasCapability(scenario, "finance.treasury") ||
    !hasCapability(scenario, "finance.expenses") ||
    !hasCapability(scenario, "costs.internal")
  )
    return null
  const expenses = state.expenses.filter(
    (item) =>
      item.currency === currency &&
      !state.renditions.some(
        (record) =>
          record.id !== draft.id && record.expenseIds.includes(item.id)
      )
  )
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) {
          setDraft(rendition ?? blank)
          setError("")
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            variant={rendition ? "outline" : "default"}
            size="sm"
          />
        }
      >
        {rendition ? "Editar rendición" : "Nueva rendición"}
      </DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogPopup className="max-w-2xl">
            <DialogTitle>
              {rendition ? "Editar rendición" : "Preparar rendición"}
            </DialogTitle>
            <DialogDescription>
              Relaciona anticipos, gastos y devoluciones del escenario. No
              aprueba gastos ni confirma fondos.
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
                    "rendition-demo-",
                    current.renditions.map((item) => item.id)
                  )
                const next = {
                  ...draft,
                  id,
                  reference:
                    draft.reference ||
                    nextAdministrativeReference(
                      "REN-LOCAL-",
                      current.renditions.map((item) => item.reference)
                    ),
                }
                const message = validateRendition(next, current)
                if (message) {
                  setError(message)
                  return
                }
                saveAdministrativeLedger({
                  ...current,
                  renditions: rendition
                    ? current.renditions.map((item) =>
                        item.id === id ? next : item
                      )
                    : [...current.renditions, next],
                  activity: [
                    ...current.activity,
                    {
                      on: DEMONSTRATION_DATE,
                      entityId: id,
                      description:
                        "Rendición preparada para revisión, sin contabilización ni cierre externo.",
                    },
                  ],
                })
                setOpen(false)
                onSaved?.(id)
              }}
            >
              <SearchableCombobox
                label="Anticipo entregado"
                value={draft.advanceId}
                onChange={(id) => {
                  const item = state.movements.find(
                    (record) => record.id === id
                  )
                  const used = sumAmounts(
                    state.renditions
                      .filter(
                        (record) =>
                          record.id !== draft.id && record.advanceId === id
                      )
                      .map((record) => record.advanceAmount)
                  )
                  setDraft((current) => ({
                    ...current,
                    advanceId: id,
                    advanceAmount: Math.max(0, (item?.amount ?? 0) - used),
                    expenseIds: [],
                    refundId: "",
                    refundAmount: 0,
                  }))
                }}
                options={state.movements
                  .filter((item) => item.nature === "Anticipo entregado")
                  .map((item) => ({
                    value: item.id,
                    label: item.reference,
                    description: money(item.amount, item.currency),
                  }))}
              />
              <label className="block text-sm font-medium">
                Importe del anticipo aplicado a esta rendición · {currency}
                <Input
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="mt-1"
                  value={draft.advanceAmount || ""}
                  onChange={(event) =>
                    update("advanceAmount", Number(event.target.value))
                  }
                />
              </label>
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium">
                  Gastos relacionados · {currency}
                </legend>
                <SearchableCombobox
                  label="Agregar gasto a rendición"
                  disabled={!advance}
                  value=""
                  onChange={(id) => {
                    if (id) update("expenseIds", [...draft.expenseIds, id])
                  }}
                  options={[
                    { value: "", label: "Seleccionar gasto" },
                    ...expenses
                      .filter((item) => !draft.expenseIds.includes(item.id))
                      .map((item) => ({
                        value: item.id,
                        label: item.reference + " · " + item.description,
                        description:
                          money(item.amount, item.currency) +
                          (item.evidence ? "" : " · Evidencia pendiente"),
                      })),
                  ]}
                />
                <ul className="space-y-2 text-sm">
                  {draft.expenseIds.map((id) => {
                    const item = state.expenses.find(
                      (record) => record.id === id
                    )
                    return (
                      <li
                        key={id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted px-3 py-2"
                      >
                        <span>
                          {item?.reference} · {item?.description}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            update(
                              "expenseIds",
                              draft.expenseIds.filter((value) => value !== id)
                            )
                          }
                        >
                          Quitar {item?.reference}
                        </Button>
                      </li>
                    )
                  })}
                </ul>
                <ExpenseEditor
                  initialCurrency={currency}
                  onSaved={(id) =>
                    update("expenseIds", [...draft.expenseIds, id])
                  }
                />
              </fieldset>
              <SearchableCombobox
                label="Devolución informada · opcional"
                value={draft.refundId}
                onChange={(id) => {
                  update("refundId", id)
                  update("refundAmount", 0)
                }}
                options={[
                  { value: "", label: "Sin devolución relacionada" },
                  ...state.movements
                    .filter(
                      (item) =>
                        item.nature === "Devolución de anticipo" &&
                        item.currency === currency
                    )
                    .map((item) => ({
                      value: item.id,
                      label: item.reference,
                      description: money(item.amount, item.currency),
                    })),
                ]}
              />
              {draft.refundId && (
                <label className="block text-sm font-medium">
                  Importe de devolución aplicado
                  <Input
                    required
                    min="0.01"
                    step="0.01"
                    type="number"
                    className="mt-1"
                    value={draft.refundAmount || ""}
                    onChange={(event) =>
                      update("refundAmount", Number(event.target.value))
                    }
                  />
                </label>
              )}
              <label className="block text-sm font-medium">
                Observaciones de la rendición
                <Input
                  className="mt-1"
                  value={draft.notes}
                  onChange={(event) => update("notes", event.target.value)}
                />
              </label>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar rendición local</Button>
              </div>
            </form>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  )
}
