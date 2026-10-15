"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"

import { PageHeader } from "@/components/navigation/page-header"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { demonstrationClients } from "@/features/clients/data/clients"

import {
  calculateQuoteTotal,
  createDemoQuoteVersion,
  formatQuoteAmount,
  getCurrentQuoteVersion,
  nextDemoQuoteReference,
} from "../data/quotes"
import type { QuoteCurrency, QuoteLine } from "../types/quote"
import { useDemoQuotes } from "../state/use-demo-quotes"

type DraftLine = {
  key: string
  description: string
  quantity: string
  unitPrice: string
}

function emptyLine(key: string): DraftLine {
  return { key, description: "", quantity: "1", unitPrice: "" }
}

export function QuoteEditor({
  quoteId,
  initialClientId = "",
}: {
  quoteId?: string
  initialClientId?: string
}) {
  const router = useRouter()
  const { quotes, ready, updateQuotes } = useDemoQuotes()
  const quote = quoteId ? quotes.find((item) => item.id === quoteId) : undefined
  const currentVersion = quote ? getCurrentQuoteVersion(quote) : undefined
  const [loaded, setLoaded] = useState(false)
  const [clientId, setClientId] = useState(
    demonstrationClients.some((client) => client.id === initialClientId)
      ? initialClientId
      : ""
  )
  const [service, setService] = useState("")
  const [context, setContext] = useState("")
  const [currency, setCurrency] = useState<QuoteCurrency>("ARS")
  const [conditions, setConditions] = useState("")
  const [lines, setLines] = useState<DraftLine[]>([emptyLine("draft-line-1")])
  const [saveError, setSaveError] = useState("")
  const nextLineId = useRef(2)

  useEffect(() => {
    if (!ready) return
    if (quoteId && currentVersion && quote) {
      // Initialize the form from the session-loaded quote version, not server markup.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientId(quote.clientId)
      setService(currentVersion.service)
      setContext(currentVersion.context)
      setCurrency(currentVersion.currency)
      setConditions(currentVersion.conditions)
      setLines(
        currentVersion.lines.map((line, index) => ({
          key: `draft-line-${index + 1}`,
          description: line.description,
          quantity: String(line.quantity),
          unitPrice: String(line.unitPrice),
        }))
      )
      nextLineId.current = currentVersion.lines.length + 1
    }
    setLoaded(true)
  }, [ready, quoteId, quote, currentVersion])

  const validLines = lines.flatMap((line, index) => {
    const quantity = Number(line.quantity)
    const unitPrice = Number(line.unitPrice)
    if (
      !line.description.trim() ||
      !line.unitPrice.trim() ||
      !Number.isSafeInteger(quantity) ||
      quantity < 1 ||
      !Number.isSafeInteger(unitPrice) ||
      unitPrice < 0
    ) {
      return []
    }
    return [
      {
        id: `line-${index + 1}`,
        description: line.description.trim(),
        quantity,
        unitPrice,
      } satisfies QuoteLine,
    ]
  })
  const previewTotal =
    validLines.length === lines.length && lines.length > 0
      ? calculateQuoteTotal(validLines)
      : null

  if (!ready || !loaded)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Cargando escenario local…
      </p>
    )
  if (quoteId && !quote) {
    return (
      <section className="max-w-3xl space-y-3">
        <PageHeader title="Cotización no disponible" />
        <p className="text-sm text-muted-foreground">
          No hay información autorizada para editar este contexto.
        </p>
        <Link
          href="/cotizaciones"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Volver a Cotizaciones
        </Link>
      </section>
    )
  }

  function updateLine(
    key: string,
    field: keyof Omit<DraftLine, "key">,
    value: string
  ) {
    setLines((current) =>
      current.map((line) =>
        line.key === key ? { ...line, [field]: value } : line
      )
    )
  }

  function addLine() {
    setLines((current) => [
      ...current,
      emptyLine(`draft-line-${nextLineId.current++}`),
    ])
  }

  function removeLine(key: string) {
    setLines((current) =>
      current.length > 1 ? current.filter((line) => line.key !== key) : current
    )
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaveError("")
    if (!clientId || !service.trim() || validLines.length !== lines.length) {
      setSaveError(
        "Completá cliente, servicio, descripción, cantidades enteras y precios válidos. No se guardó ningún cambio."
      )
      const invalid = !clientId
        ? "quote-editor-client"
        : !service.trim()
          ? "quote-editor-service"
          : lines.flatMap((line) =>
              !line.description.trim()
                ? [line.key + "-description"]
                : !Number.isSafeInteger(Number(line.quantity)) ||
                    Number(line.quantity) < 1
                  ? [line.key + "-quantity"]
                  : !line.unitPrice.trim() ||
                      !Number.isSafeInteger(Number(line.unitPrice)) ||
                      Number(line.unitPrice) < 0
                    ? [line.key + "-unit-price"]
                    : []
            )[0]
      if (invalid) document.getElementById(invalid)?.focus()
      return
    }

    if (quote) {
      const newVersion = createDemoQuoteVersion({
        number: getCurrentQuoteVersion(quote).number + 1,
        service: service.trim(),
        context: context.trim(),
        currency,
        lines: validLines,
        conditions: conditions.trim(),
      })
      updateQuotes((current) =>
        current.map((item) =>
          item.id === quote.id
            ? { ...item, versions: [...item.versions, newVersion] }
            : item
        )
      )
      router.push(`/cotizaciones/${quote.id}`)
      return
    }

    const identity = nextDemoQuoteReference(quotes)
    const newQuote = {
      ...identity,
      clientId,
      responsible: "Responsable de demostración",
      versions: [
        createDemoQuoteVersion({
          number: 1,
          service: service.trim(),
          context: context.trim(),
          currency,
          lines: validLines,
          conditions: conditions.trim(),
        }),
      ],
    }
    updateQuotes((current) => [...current, newQuote])
    router.push(`/cotizaciones/${newQuote.id}`)
  }

  return (
    <div className="space-y-6">
      <Link
        href={quote ? `/cotizaciones/${quote.id}` : "/cotizaciones"}
        className="inline-flex min-h-9 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Cancelar y volver
      </Link>
      <PageHeader
        title={
          quote ? `Nueva versión de ${quote.reference}` : "Nueva cotización"
        }
      />

      <form onSubmit={save} className="max-w-5xl space-y-6" noValidate>
        <section
          aria-labelledby="quote-editor-context"
          className="grid gap-4 border-y border-border py-4 sm:grid-cols-2"
        >
          <h2 id="quote-editor-context" className="font-semibold sm:col-span-2">
            Contexto
          </h2>
          <div>
            <label
              htmlFor="quote-editor-client"
              className="mb-1 block text-xs font-medium"
            >
              Cliente
            </label>
            <select
              id="quote-editor-client"
              aria-invalid={Boolean(saveError && !clientId)}
              aria-describedby={saveError ? "quote-editor-error" : undefined}
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
              required
              disabled={Boolean(quote)}
              className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:bg-muted"
            >
              <option value="">Seleccionar cliente</option>
              {demonstrationClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="quote-editor-service"
              className="mb-1 block text-xs font-medium"
            >
              Servicio
            </label>
            <Input
              id="quote-editor-service"
              aria-invalid={Boolean(saveError && !service.trim())}
              aria-describedby={saveError ? "quote-editor-error" : undefined}
              value={service}
              onChange={(event) => setService(event.target.value)}
              required
              maxLength={120}
              placeholder="Descripción breve del servicio"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="quote-editor-context-text"
              className="mb-1 block text-xs font-medium"
            >
              Contexto de referencia
            </label>
            <textarea
              id="quote-editor-context-text"
              value={context}
              onChange={(event) => setContext(event.target.value)}
              rows={3}
              maxLength={500}
              className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
          </div>
        </section>

        <section aria-labelledby="quote-editor-lines" className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
            <div>
              <h2 id="quote-editor-lines" className="font-semibold">
                Líneas de servicio
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                El total se calcula como la suma de cantidad × unitario.
              </p>
            </div>
            <div>
              <label
                htmlFor="quote-editor-currency"
                className="mb-1 block text-xs font-medium"
              >
                Moneda
              </label>
              <select
                id="quote-editor-currency"
                value={currency}
                onChange={(event) =>
                  setCurrency(event.target.value as QuoteCurrency)
                }
                className="h-8 rounded-md border border-input bg-background px-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          <ol className="space-y-4">
            {lines.map((line, index) => (
              <li
                key={line.key}
                className="grid gap-3 border-b border-border pb-4 sm:grid-cols-2 lg:grid-cols-[minmax(12rem,1.5fr)_8rem_12rem_auto] lg:items-end"
              >
                <div>
                  <label
                    htmlFor={`${line.key}-description`}
                    className="mb-1 block text-xs font-medium"
                  >
                    Descripción de línea {index + 1}
                  </label>
                  <Input
                    id={`${line.key}-description`}
                    aria-invalid={Boolean(
                      saveError && !line.description.trim()
                    )}
                    aria-describedby={
                      saveError ? "quote-editor-error" : undefined
                    }
                    value={line.description}
                    onChange={(event) =>
                      updateLine(line.key, "description", event.target.value)
                    }
                    required
                    maxLength={120}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${line.key}-quantity`}
                    className="mb-1 block text-xs font-medium"
                  >
                    Cantidad entera
                  </label>
                  <Input
                    id={`${line.key}-quantity`}
                    aria-invalid={Boolean(
                      saveError &&
                      (!Number.isSafeInteger(Number(line.quantity)) ||
                        Number(line.quantity) < 1)
                    )}
                    aria-describedby={
                      saveError ? "quote-editor-error" : undefined
                    }
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    value={line.quantity}
                    onChange={(event) =>
                      updateLine(line.key, "quantity", event.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${line.key}-unit-price`}
                    className="mb-1 block text-xs font-medium"
                  >
                    Precio unitario ({currency})
                  </label>
                  <Input
                    id={`${line.key}-unit-price`}
                    aria-invalid={Boolean(
                      saveError &&
                      (!line.unitPrice.trim() ||
                        !Number.isSafeInteger(Number(line.unitPrice)) ||
                        Number(line.unitPrice) < 0)
                    )}
                    aria-describedby={
                      saveError ? "quote-editor-error" : undefined
                    }
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={line.unitPrice}
                    onChange={(event) =>
                      updateLine(line.key, "unitPrice", event.target.value)
                    }
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={lines.length === 1}
                  onClick={() => removeLine(line.key)}
                  aria-label={`Quitar línea ${index + 1}`}
                >
                  <Trash2 aria-hidden="true" /> Quitar
                </Button>
              </li>
            ))}
          </ol>
          <Button type="button" variant="outline" size="sm" onClick={addLine}>
            <Plus aria-hidden="true" /> Agregar línea
          </Button>
          <div className="flex flex-wrap justify-between gap-2 border-t border-border pt-3">
            <p className="text-sm text-muted-foreground">
              Vista previa · {currency} · sin impuestos, descuentos ni
              conversión
            </p>
            <p className="font-semibold">
              {previewTotal === null
                ? "Completá líneas válidas"
                : formatQuoteAmount(previewTotal, currency)}
            </p>
          </div>
        </section>

        <section className="max-w-5xl">
          <label
            htmlFor="quote-editor-conditions"
            className="mb-1 block text-xs font-medium"
          >
            Condiciones (propuestas, no aprobadas)
          </label>
          <textarea
            id="quote-editor-conditions"
            value={conditions}
            onChange={(event) => setConditions(event.target.value)}
            rows={3}
            maxLength={500}
            className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            No se calculan impuestos, gastos, descuentos, vigencia, tipo de
            cambio ni políticas de redondeo. La moneda es única por versión sólo
            para el escenario de demostración.
          </p>
        </section>

        {saveError ? (
          <p
            id="quote-editor-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {saveError}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <Button type="submit">
            {quote ? "Guardar nueva versión local" : "Guardar borrador local"}
          </Button>
          <Link
            href={quote ? `/cotizaciones/${quote.id}` : "/cotizaciones"}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Cancelar
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          Los cambios se guardan sólo en sessionStorage de esta pestaña; no
          crean una cotización real ni se sincronizan externamente.
        </p>
      </form>
    </div>
  )
}
