"use client"

import { useEffect, useRef } from "react"

type ListPosition = { y: number; href: string }
const positions = new Map<string, ListPosition>()

/** Temporary navigation context, never business data or authorization. */
export function useListContext(ready: boolean, contextKey: string) {
  const restored = useRef(false)
  useEffect(() => {
    if (!ready || restored.current) return
    restored.current = true
    const position = positions.get(contextKey)
    if (!position) return
    const frame = requestAnimationFrame(() => {
      const link = Array.from(
        document.querySelectorAll<HTMLAnchorElement>("a[href]")
      ).find(
        (item) =>
          item.getAttribute("href") === position.href &&
          item.getClientRects().length > 0
      )
      link?.focus({ preventScroll: true })
      window.scrollTo({ top: position.y, behavior: "instant" })
    })
    return () => cancelAnimationFrame(frame)
  }, [ready, contextKey])

  return (event: React.MouseEvent<HTMLElement>) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
      "a[href]"
    )
    if (
      !link ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return
    const href = link.getAttribute("href") ?? ""
    if (
      !/^\/(?:operaciones|clientes|proveedores|cotizaciones|configuracion\/personas|administracion\/(?:gastos|movimientos|rendiciones))\//.test(
        href
      )
    )
      return
    positions.set(contextKey, {
      y: window.scrollY,
      href,
    })
  }
}
