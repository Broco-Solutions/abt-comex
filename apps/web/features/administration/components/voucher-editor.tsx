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
import { useOrganizations } from "@/features/organizations/state/use-organizations"
import { OrganizationEditor } from "@/features/organizations/components/organization-editor"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"
import { nextAdministrativeId } from "../data/administrative-ledger"
import {
  loadVouchers,
  saveVouchers,
  validateVoucher,
  type Voucher,
} from "../data/vouchers"
import { OperationLinksField } from "./operation-links-field"
export function canReadVoucher(
  scenario: Parameters<typeof hasCapability>[0],
  document: Voucher
) {
  return document.side === "Cobrar"
    ? hasCapability(scenario, "finance.billing") ||
        hasCapability(scenario, "finance.collections")
    : hasCapability(scenario, "finance.treasury")
}
export function VoucherEditor({
  document,
  side = "Cobrar",
  partyId = "",
  onSaved,
}: {
  document?: Voucher
  side?: Voucher["side"]
  partyId?: string
  onSaved?: (id: string) => void
}) {
  const { scenario } = useScenario()
  const { organizations } = useOrganizations()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const blank: Voucher = {
    id: "",
    reference: "",
    kind: "Factura",
    side,
    partyId,
    issuedOn: DEMONSTRATION_DATE,
    dueOn: "",
    currency: "ARS",
    amount: 0,
    concept: "",
    operationIds: [],
    stage: "Preparado",
    externalReference: "",
    historyComplete: true,
  }
  const [draft, setDraft] = useState(document ?? blank)
  const update = <K extends keyof Voucher>(key: K, value: Voucher[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))
  const role = draft.side === "Cobrar" ? "client" : "abt-supplier"
  if (
    !hasCapability(scenario, "finance.prepare") ||
    !hasCapability(
      scenario,
      (document?.side ?? side) === "Cobrar"
        ? "finance.billing"
        : "finance.treasury"
    )
  )
    return null
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (value) {
          setDraft(document ?? blank)
          setError("")
        }
      }}
    >
      <DialogTrigger
        render={<Button variant={document ? "outline" : "default"} size="sm" />}
      >
        {document ? "Editar comprobante" : "Nuevo comprobante"}
      </DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogPopup className="max-w-xl">
            <DialogTitle>
              {document ? "Editar comprobante" : "Preparar comprobante"}
            </DialogTitle>
            <DialogDescription>
              No emite facturas ni registra información en Alpha2000.
            </DialogDescription>
            <form
              className="mt-4 space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                event.stopPropagation()
                const state = loadVouchers()
                const item = {
                  ...draft,
                  id:
                    draft.id ||
                    nextAdministrativeId(
                      "voucher-local-",
                      state.documents.map((row) => row.id)
                    ),
                }
                const problem = validateVoucher(item, state)
                if (problem) {
                  setError(problem)
                  return
                }
                saveVouchers({
                  ...state,
                  documents: [
                    ...state.documents.filter((row) => row.id !== item.id),
                    item,
                  ],
                  activity: [
                    ...state.activity,
                    {
                      entityId: item.id,
                      on: DEMONSTRATION_DATE,
                      description:
                        "Comprobante preparado o actualizado localmente",
                    },
                  ],
                })
                setOpen(false)
                onSaved?.(item.id)
              }}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  Referencia
                  <Input
                    required
                    value={draft.reference}
                    onChange={(event) =>
                      update("reference", event.target.value)
                    }
                  />
                </label>
                <label className="text-sm">
                  Tipo de comprobante
                  <select
                    className="mt-1 block h-9 w-full rounded-md border border-input bg-background px-2"
                    value={draft.kind}
                    onChange={(event) =>
                      update("kind", event.target.value as Voucher["kind"])
                    }
                  >
                    <option>Factura</option>
                    <option>Nota de crédito</option>
                    <option>Otro comprobante</option>
                  </select>
                </label>
                <label className="text-sm">
                  Fecha de emisión
                  <Input
                    type="date"
                    required
                    max={DEMONSTRATION_DATE}
                    value={draft.issuedOn}
                    onChange={(event) => update("issuedOn", event.target.value)}
                  />
                </label>
                <label className="text-sm">
                  Vencimiento · opcional
                  <Input
                    type="date"
                    value={draft.dueOn}
                    onChange={(event) => update("dueOn", event.target.value)}
                  />
                </label>
                <label className="text-sm">
                  Moneda
                  <select
                    className="mt-1 block h-9 w-full rounded-md border border-input bg-background px-2"
                    value={draft.currency}
                    onChange={(event) =>
                      update(
                        "currency",
                        event.target.value as Voucher["currency"]
                      )
                    }
                  >
                    <option>ARS</option>
                    <option>USD</option>
                  </select>
                </label>
                <label className="text-sm">
                  Importe original
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={draft.amount || ""}
                    onChange={(event) =>
                      update("amount", Number(event.target.value))
                    }
                  />
                </label>
              </div>
              <SearchableCombobox
                label={
                  draft.side === "Cobrar"
                    ? "Cliente del comprobante"
                    : "Proveedor del comprobante"
                }
                value={draft.partyId}
                options={organizations
                  .filter((item) =>
                    item.roles.some(
                      (entry) =>
                        entry.role === role &&
                        (entry.active || item.id === document?.partyId)
                    )
                  )
                  .map((item) => ({
                    value: item.id,
                    label: item.name,
                    description: item.country,
                  }))}
                onChange={(id) => update("partyId", id)}
              />
              <OrganizationEditor
                role={role}
                onSaved={(organization) => update("partyId", organization.id)}
              />
              <label className="block text-sm">
                Concepto
                <Input
                  required
                  value={draft.concept}
                  onChange={(event) => update("concept", event.target.value)}
                />
              </label>
              <OperationLinksField
                value={draft.operationIds}
                onChange={(ids) => update("operationIds", ids)}
              />
              <label className="block text-sm">
                Referencia externa · por verificar
                <Input
                  value={draft.externalReference}
                  onChange={(event) =>
                    update("externalReference", event.target.value)
                  }
                />
              </label>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.stage === "Referencia de evaluación"}
                  onChange={(event) =>
                    update(
                      "stage",
                      event.target.checked
                        ? "Referencia de evaluación"
                        : "Preparado"
                    )
                  }
                />
                Usar como referencia de evaluación en cartera y análisis. No
                confirma emisión ni registración externa.
              </label>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error} Los datos ingresados se conservan.
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar comprobante</Button>
              </div>
            </form>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  )
}
