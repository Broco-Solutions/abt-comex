"use client"

import Link from "next/link"
import { useId, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { DateField } from "@workspace/ui/components/date-field"
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
import { formatDate } from "@workspace/ui/lib/date"
import { PageHeader } from "@/components/navigation/page-header"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"
import {
  loadRateBook,
  reviseManagementRate,
  saveRateBook,
  type ManagementRate,
} from "../data/management-rates"
import { useManagementRates } from "../state/use-management-rates"

function RateEditor({
  rate,
  onSaved,
}: {
  rate?: ManagementRate
  onSaved: () => void
}) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(rate?.effectiveOn ?? DEMONSTRATION_DATE)
  const [amount, setAmount] = useState(rate ? String(rate.arsPerUsd) : "")
  const [source, setSource] = useState(
    rate?.source ?? "Referencia sintética de gestión · sin proveedor externo"
  )
  const [valid, setValid] = useState(rate?.valid ?? true)
  const [error, setError] = useState("")
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) {
          setDate(rate?.effectiveOn ?? DEMONSTRATION_DATE)
          setAmount(rate ? String(rate.arsPerUsd) : "")
          setSource(
            rate?.source ??
              "Referencia sintética de gestión · sin proveedor externo"
          )
          setValid(rate?.valid ?? true)
          setError("")
        }
      }}
    >
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        {rate
          ? `Editar referencia del ${formatDate(rate.effectiveOn)}`
          : "Nueva cotización de gestión"}
      </DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogPopup>
            <DialogTitle>
              {rate
                ? "Revisar cotización de gestión"
                : "Nueva cotización de gestión"}
            </DialogTitle>
            <DialogDescription>
              Referencia sintética ARS/USD. Una revisión afecta su intervalo de
              vigencia y conserva la versión anterior.
            </DialogDescription>
            <form
              className="mt-4 space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                try {
                  const book = loadRateBook()
                  saveRateBook(
                    reviseManagementRate(book, {
                      id: rate?.id ?? `fx-local-${Date.now()}`,
                      effectiveOn: date,
                      arsPerUsd: Number(amount),
                      source,
                      valid,
                    })
                  )
                  setOpen(false)
                  onSaved()
                } catch (reason) {
                  setError(
                    reason instanceof Error
                      ? reason.message
                      : "No se pudo guardar la referencia."
                  )
                }
              }}
            >
              <DateField
                label="Vigente desde"
                value={date}
                readOnly={!!rate}
                onChange={setDate}
                required
              />
              <label
                className="grid gap-1 text-sm font-medium"
                htmlFor={`${id}-amount`}
              >
                ARS por USD
                <Input
                  id={`${id}-amount`}
                  type="number"
                  inputMode="decimal"
                  min="0.000001"
                  step="0.000001"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  required
                />
              </label>
              <label
                className="grid gap-1 text-sm font-medium"
                htmlFor={`${id}-source`}
              >
                Fuente o referencia
                <Input
                  id={`${id}-source`}
                  value={source}
                  maxLength={180}
                  onChange={(event) => setSource(event.target.value)}
                  required
                />
              </label>
              <label className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={valid}
                  onChange={(event) => setValid(event.target.checked)}
                />
                Referencia válida
              </label>
              <p className="text-xs text-muted-foreground">
                Una referencia inválida deja pendiente la conversión de su
                intervalo. No se reutiliza silenciosamente una vigencia
                anterior.
              </p>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <Button type="submit">Guardar referencia local</Button>
            </form>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  )
}

export function ManagementRatesPage() {
  const { scenario } = useScenario()
  const { book, ready } = useManagementRates()
  const [feedback, setFeedback] = useState("")
  if (
    !hasCapability(scenario, "catalogs.manage") ||
    !hasCapability(scenario, "finance.prepare")
  )
    return (
      <p role="status">
        Las cotizaciones de gestión no están disponibles para tus capacidades.
      </p>
    )
  if (!ready) return <p role="status">Preparando referencias…</p>
  return (
    <div className="max-w-5xl space-y-5">
      <PageHeader
        title="Cotizaciones de gestión"
        primaryAction={
          <RateEditor
            onSaved={() =>
              setFeedback(
                "Referencia guardada; las valoraciones aplicables se actualizan automáticamente."
              )
            }
          />
        }
      />
      <Link
        href="/configuracion"
        className="inline-flex min-h-11 items-center text-sm text-primary underline"
      >
        Volver a Configuración
      </Link>
      <p className="text-sm text-muted-foreground">
        USD es la moneda de reporte. Para ARS se utiliza la última vigencia
        aplicable al evento; los saldos se valoran a su corte. Son referencias
        sintéticas, sin cotizador externo ni política contable aprobada.
      </p>
      {feedback && (
        <p role="status" className="text-sm">
          {feedback}
        </p>
      )}
      <ul
        aria-label="Cotizaciones de gestión ARS/USD"
        className="workspace-surface divide-y divide-border px-4"
      >
        {[...book.rates]
          .sort((a, b) => b.effectiveOn.localeCompare(a.effectiveOn))
          .map((rate) => (
            <li
              key={rate.id}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div className="min-w-0 space-y-1">
                <p className="font-medium">
                  {formatDate(rate.effectiveOn)} ·{" "}
                  {new Intl.NumberFormat("es-AR", {
                    maximumFractionDigits: 6,
                  }).format(rate.arsPerUsd)}{" "}
                  ARS por USD
                </p>
                <p className="text-sm text-muted-foreground">{rate.source}</p>
                <p className="text-xs text-muted-foreground">
                  {rate.id} · revisión {rate.revision} ·{" "}
                  {rate.valid ? "Válida" : "Inválida · conversión pendiente"}
                </p>
              </div>
              <RateEditor
                rate={rate}
                onSaved={() =>
                  setFeedback(
                    "Revisión guardada. El histórico anterior y los importes originales se conservan."
                  )
                }
              />
            </li>
          ))}
        {!book.rates.length && (
          <li className="py-4 text-sm">
            Sin cotizaciones de gestión; los importes ARS quedan pendientes de
            conversión.
          </li>
        )}
      </ul>
      <details className="space-y-3">
        <summary className="cursor-pointer text-sm font-medium">
          Histórico de revisiones ({book.history.length})
        </summary>
        <ul className="divide-y divide-border text-sm">
          {book.history.map((rate) => (
            <li key={`${rate.id}-${rate.revision}`} className="py-3">
              {formatDate(rate.effectiveOn)} · {rate.arsPerUsd} ARS por USD ·{" "}
              {rate.id} · revisión {rate.revision} ·{" "}
              {rate.valid ? "Válida" : "Inválida"}
              <p className="text-muted-foreground">{rate.source}</p>
            </li>
          ))}
        </ul>
        {!book.history.length && (
          <p className="text-sm text-muted-foreground">
            Sin revisiones locales.
          </p>
        )}
      </details>
    </div>
  )
}
