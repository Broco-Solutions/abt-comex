"use client"

import { useSyncExternalStore } from "react"

const eventName = "abt-comex:navigation-groups-change"
const memory = new Map<string, boolean>()

function subscribe(listener: () => void) {
  window.addEventListener(eventName, listener)
  return () => window.removeEventListener(eventName, listener)
}

function read(id: string) {
  try {
    const value = sessionStorage.getItem(`abt-comex:navigation-group:${id}`)
    return value === null ? true : value !== "closed"
  } catch {
    return memory.get(id) ?? true
  }
}

/** Each group survives navigation, rail/drawer changes and reloads in this tab. */
export function useNavigationGroup(id: string) {
  const expanded = useSyncExternalStore(
    subscribe,
    () => read(id),
    () => true
  )
  const toggle = () => {
    memory.set(id, !expanded)
    try {
      sessionStorage.setItem(
        `abt-comex:navigation-group:${id}`,
        expanded ? "closed" : "open"
      )
    } catch {
      // The in-memory session remains usable when browser storage is unavailable.
    }
    window.dispatchEvent(new Event(eventName))
  }
  return { expanded, toggle }
}
