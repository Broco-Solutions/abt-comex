"use client"

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogViewport,
} from "@workspace/ui/components/dialog"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { useDemoOperations } from "@/features/operations/state/use-demo-operations"
import { useDemoQuotes } from "@/features/quotes/state/use-demo-quotes"
import { useOrganizations } from "@/features/organizations/state/use-organizations"
import {
  buildSearchIndex,
  searchGroups,
  searchIndex,
  type SearchResult,
} from "../data/global-search"

const subscribePlatform = () => () => {}

export function GlobalSearch() {
  const { active: scenarioActive, scenario } = useScenario()
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const originFocus = useRef<HTMLElement | null>(null)
  const mac = useSyncExternalStore(
    subscribePlatform,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => false
  )
  useEffect(() => {
    if (!scenarioActive || scenario.id === "client") return
    const handle = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.altKey ||
        event.shiftKey ||
        (!event.ctrlKey && !event.metaKey) ||
        event.key.toLowerCase() !== "k"
      )
        return
      event.preventDefault()
      if (!open)
        originFocus.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null
      setOpen(true)
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [open, scenarioActive, scenario.id])
  if (!scenarioActive || scenario.id === "client") return null
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            ref={trigger}
            variant="outline"
            aria-label="Buscar o ir a…"
            className="size-11 shrink-0 gap-2 rounded-lg border-[#dde3e0] bg-background px-3 text-muted-foreground shadow-none focus-visible:border-[#14532d] md:h-9 md:w-full md:max-w-[440px] md:flex-1 md:justify-start"
            onClick={() => {
              originFocus.current = trigger.current
            }}
          />
        }
      >
        <Search aria-hidden="true" className="size-4 shrink-0" />
        <span className="hidden min-w-0 flex-1 truncate text-left font-normal md:block">
          Buscar o ir a…
        </span>
        <kbd
          aria-hidden="true"
          className="hidden shrink-0 text-xs font-normal text-muted-foreground md:inline"
        >
          {mac ? "⌘ K" : "Ctrl K"}
        </kbd>
      </DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogPopup
            closeLabel="Cerrar buscador"
            finalFocus={() =>
              originFocus.current?.isConnected
                ? originFocus.current
                : trigger.current
            }
            className="max-w-2xl rounded-[10px] border-[#e3e8e5] p-0 shadow-[0_8px_24px_rgba(16,24,20,0.10)]"
          >
            <DialogTitle className="sr-only">Buscar o ir a…</DialogTitle>
            <DialogDescription className="sr-only">
              Buscá registros o pantallas disponibles para tu escenario. Flechas
              para recorrer, Enter para abrir y Escape para cerrar.
            </DialogDescription>
            {open ? <SearchContent onNavigate={() => setOpen(false)} /> : null}
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  )
}

function SearchContent({ onNavigate }: { onNavigate: () => void }) {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const id = useId()
  const { scenario } = useScenario()
  const { operations, ready: operationsReady } = useDemoOperations()
  const { quotes, ready: quotesReady } = useDemoQuotes()
  const { organizations, ready: organizationsReady } = useOrganizations()
  const pathname = usePathname()
  const params = useSearchParams()
  const ready = operationsReady && quotesReady && organizationsReady
  const matches = ready
    ? searchIndex(
        buildSearchIndex({ scenario, operations, quotes, organizations }),
        query
      )
    : []
  const results = searchGroups
    .flatMap((group) => matches.filter((item) => item.group === group))
    .slice(0, 40)
  const selected = results[Math.min(active, results.length - 1)]
  const optionId = (result: SearchResult) => `${id}-${result.id}`
  useEffect(() => {
    input.current?.focus()
  }, [])
  useEffect(() => {
    if (!selected) return
    const option = document.getElementById(optionId(selected))
    const viewport = list.current
    if (!option || !viewport) return
    const row = option.getBoundingClientRect(),
      box = viewport.getBoundingClientRect()
    if (row.top < box.top) viewport.scrollTop += row.top - box.top
    else if (row.bottom > box.bottom)
      viewport.scrollTop += row.bottom - box.bottom
    // ID and selection define the DOM target; no subscription to fixture objects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id, id])
  function href(result: SearchResult) {
    if (!result.record) return result.href
    const origin =
      pathname + (params.size ? `?${params}` : "") + window.location.hash
    return result.href === origin
      ? result.href
      : `${result.href}?returnTo=${encodeURIComponent(origin)}`
  }
  return (
    <>
      <div className="flex items-center gap-3 border-b border-border py-4 pr-14 pl-4">
        <Search
          aria-hidden="true"
          className="size-5 shrink-0 text-muted-foreground"
        />
        <input
          ref={input}
          role="combobox"
          aria-label="Buscar en ABT Comex"
          aria-autocomplete="list"
          aria-expanded={ready && results.length > 0}
          aria-controls={`${id}-results`}
          aria-activedescendant={selected ? optionId(selected) : undefined}
          autoComplete="off"
          placeholder="Referencia, cliente o pantalla"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault()
              if (results.length)
                setActive(
                  (current) =>
                    (Math.min(current, results.length - 1) +
                      (event.key === "ArrowDown" ? 1 : results.length - 1)) %
                    results.length
                )
            } else if (event.key === "Enter" && selected) {
              event.preventDefault()
              document.getElementById(optionId(selected))?.click()
            }
          }}
          className="h-11 min-w-0 flex-1 rounded-md bg-transparent px-1 text-base outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring sm:h-9 sm:text-sm"
        />
      </div>
      {!query && ready ? (
        <p className="px-4 pt-3 text-xs text-muted-foreground">
          Accesos directos
        </p>
      ) : null}
      <div
        id={`${id}-results`}
        ref={list}
        tabIndex={-1}
        role="listbox"
        aria-label="Resultados de búsqueda"
        className="max-h-[min(24rem,calc(100dvh-12rem))] overflow-y-auto overscroll-contain p-2"
      >
        {searchGroups.map((group) => {
          const rows = results.filter((item) => item.group === group)
          if (!rows.length) return null
          return (
            <div
              key={group}
              role="group"
              aria-label={group}
              className="mb-2 last:mb-0"
            >
              <p
                aria-hidden="true"
                className="px-3 py-2 text-xs font-medium text-muted-foreground"
              >
                {group}
              </p>
              <ul role="presentation">
                {rows.map((result) => (
                  <li key={result.id} role="presentation">
                    <Link
                      id={optionId(result)}
                      role="option"
                      aria-selected={result.id === selected?.id}
                      tabIndex={-1}
                      href={href(result)}
                      onMouseEnter={() =>
                        setActive(
                          results.findIndex((item) => item.id === result.id)
                        )
                      }
                      onClick={onNavigate}
                      className={`block min-h-12 rounded-md border border-transparent px-3 py-2 outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring ${result.id === selected?.id ? "bg-muted ring-1 ring-border" : "hover:bg-muted/60"}`}
                    >
                      <span className="block truncate text-sm font-semibold">
                        {result.title}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {result.context}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
      {!ready ? (
        <p role="status" className="px-5 pb-4 text-sm text-muted-foreground">
          Preparando búsqueda…
        </p>
      ) : !results.length ? (
        <p role="status" className="px-5 pb-4 text-sm text-muted-foreground">
          No hay coincidencias. Probá con otro nombre o referencia.
        </p>
      ) : null}
      <p role="status" className="sr-only">
        {ready
          ? `${matches.length} resultados disponibles`
          : "Preparando búsqueda"}
      </p>
      <div className="flex flex-wrap justify-between gap-2 border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <span>↑ ↓ recorrer · Enter abrir · Esc cerrar</span>
        {matches.length > 40 ? (
          <span>Primeros 40 resultados; precisá la búsqueda.</span>
        ) : null}
      </div>
    </>
  )
}
