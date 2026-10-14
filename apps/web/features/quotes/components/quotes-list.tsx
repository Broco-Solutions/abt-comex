"use client"

import Link from "next/link"

import { PageHeader } from "@/components/navigation/page-header"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { demonstrationClients } from "@/features/clients/data/clients"

import {
  filterDemoQuotes,
  parseQuoteListState,
  quoteListHref,
} from "../data/quotes"
import type { QuoteSearchParams } from "../data/quotes"
import { useDemoQuotes } from "../state/use-demo-quotes"

import { QuoteTable } from "./quote-table"

const statuses = [
  ["", "Todos los estados"],
  ["borrador", "Borrador"],
  ["pendiente-aprobacion", "Pendiente de aprobación interna"],
  ["pendiente-envio", "Aprobada internamente · no enviada"],
  ["aceptada", "Aceptación de cliente simulada"],
  ["rechazada", "Rechazo de cliente simulado"],
] as const

export function QuotesList({
  searchParams,
}: {
  searchParams: QuoteSearchParams
}) {
  const state = parseQuoteListState(searchParams)
  const { quotes, ready, resetQuotes } = useDemoQuotes()
  const restricted = state.error === "sin-permiso"
  const failed = state.error === "lectura"
  const visibleQuotes =
    restricted || failed || !ready ? [] : filterDemoQuotes(quotes, state)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cotizaciones"
        description="Seguí versiones, aprobación interna y respuesta del cliente como hitos distintos. Todos los datos y valores de este escenario son ficticios."
        primaryAction={
          <Link
            href="/cotizaciones/nueva"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Nueva cotización
          </Link>
        }
      />

      <section
        aria-label="Búsqueda y filtros de cotizaciones"
        className="max-w-6xl"
      >
        <form
          action="/cotizaciones"
          method="get"
          className="grid gap-3 border-b border-border pb-4 sm:grid-cols-2 lg:grid-cols-[minmax(10rem,1fr)_minmax(9rem,12rem)_minmax(9rem,12rem)_auto] lg:items-end"
        >
          <div>
            <label
              htmlFor="quote-search"
              className="mb-1 block text-xs font-medium"
            >
              Buscar referencia, cliente o servicio
            </label>
            <Input
              id="quote-search"
              type="search"
              name="q"
              defaultValue={state.query}
              placeholder="Ej.: COT-DEM-001"
            />
          </div>
          <div>
            <label
              htmlFor="quote-status"
              className="mb-1 block text-xs font-medium"
            >
              Hito
            </label>
            <select
              id="quote-status"
              name="estado"
              defaultValue={state.status}
              className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {statuses.map(([value, label]) => (
                <option key={value || "all"} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="quote-client"
              className="mb-1 block text-xs font-medium"
            >
              Cliente
            </label>
            <select
              id="quote-client"
              name="cliente"
              defaultValue={state.clientId}
              className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <option value="">Todos los clientes</option>
              {demonstrationClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm">
              Aplicar
            </Button>
            {state.query || state.status || state.clientId ? (
              <Link
                href="/cotizaciones"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Limpiar
              </Link>
            ) : null}
          </div>
        </form>

        {restricted ? (
          <div role="status" className="border-b border-border py-5">
            <h2 className="font-medium">Cotizaciones no disponibles</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Este escenario no tiene capacidad comercial autorizada para
              mostrar. No se confirma si existen registros.
            </p>
          </div>
        ) : failed ? (
          <div role="alert" className="border-b border-border py-5">
            <h2 className="font-medium">No se pudo leer el escenario</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Se conservaron filtros y contexto; no se confirma un total.
            </p>
            <Link
              href={quoteListHref(state.query, state.status, state.clientId)}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-3"
              )}
            >
              Reintentar
            </Link>
          </div>
        ) : !ready ? (
          <p role="status" className="py-5 text-sm text-muted-foreground">
            Cargando escenario local…
          </p>
        ) : visibleQuotes.length === 0 ? (
          <div role="status" className="border-b border-border py-5">
            <h2 className="font-medium">
              {state.query || state.status || state.clientId
                ? "No hay coincidencias"
                : "No hay cotizaciones en este escenario"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {state.query || state.status || state.clientId
                ? "Cambiá o limpiá los filtros para continuar."
                : "Este fixture no contiene cotizaciones para mostrar."}
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-3 text-sm">
              <p>
                <span className="font-medium">{visibleQuotes.length}</span> de{" "}
                {quotes.length} cotizaciones sintéticas visibles
              </p>
              <p className="text-xs text-muted-foreground">
                Visibilidad comercial simulada; no equivale a permisos
                efectivos.
              </p>
            </div>
            <QuoteTable
              quotes={visibleQuotes}
              returnTo={quoteListHref(
                state.query,
                state.status,
                state.clientId
              )}
            />
          </>
        )}
      </section>

      <section
        aria-labelledby="quote-demo-note"
        className="max-w-6xl border-t border-border pt-4"
      >
        <h2 id="quote-demo-note" className="text-sm font-medium">
          Alcance demostrativo
        </h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          El cálculo visible es cantidad × precio unitario, en una sola moneda y
          sin descuentos, impuestos ni conversión. Los hitos que permiten
          avanzar se simulan sólo en esta pestaña; no se envía correo ni se
          registra una aprobación o respuesta real.
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2"
          onClick={resetQuotes}
        >
          Reiniciar escenario de cotizaciones
        </Button>
      </section>
    </div>
  )
}
