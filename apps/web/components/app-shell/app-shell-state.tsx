"use client"

import * as React from "react"

export const NAVIGATION_STORAGE_KEY = "abt-comex:navigation:v1"

export type NavigationMode = "expanded" | "compact"

type NavigationStorage = Pick<Storage, "getItem" | "removeItem" | "setItem">

type AppShellState = {
  mode: NavigationMode
  setMode: (mode: NavigationMode) => void
  toggleMode: () => void
  resetMode: () => void
}

const AppShellStateContext = React.createContext<AppShellState | null>(null)
const NAVIGATION_CHANGE_EVENT = "abt-comex:navigation-change"
let memoryMode: NavigationMode = "expanded"

export function readNavigationMode(
  storage?: Pick<NavigationStorage, "getItem">
): NavigationMode {
  if (!storage) return "expanded"

  try {
    const stored = storage.getItem(NAVIGATION_STORAGE_KEY)
    if (!stored) return "expanded"
    const parsed: unknown = JSON.parse(stored)

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "mode" in parsed &&
      (parsed.mode === "expanded" || parsed.mode === "compact")
    ) {
      return parsed.mode
    }
  } catch {
    return "expanded"
  }

  return "expanded"
}

export function AppShellStateProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const mode = React.useSyncExternalStore(
    subscribeToNavigationMode,
    getClientNavigationMode,
    getServerNavigationMode
  )

  const setMode = React.useCallback((nextMode: NavigationMode) => {
    persistNavigationMode(nextMode)
  }, [])

  const toggleMode = React.useCallback(() => {
    persistNavigationMode(mode === "expanded" ? "compact" : "expanded")
  }, [mode])

  const resetMode = React.useCallback(() => {
    memoryMode = "expanded"
    try {
      window.localStorage.removeItem(NAVIGATION_STORAGE_KEY)
    } catch {
      // El estado expandido queda aplicado aunque storage no esté disponible.
    }
    notifyNavigationModeChange()
  }, [])

  const value = React.useMemo(
    () => ({ mode, resetMode, setMode, toggleMode }),
    [mode, resetMode, setMode, toggleMode]
  )

  return (
    <AppShellStateContext.Provider value={value}>
      {children}
    </AppShellStateContext.Provider>
  )
}

function getServerNavigationMode(): NavigationMode {
  return "expanded"
}

function getClientNavigationMode(): NavigationMode {
  try {
    const stored = window.localStorage.getItem(NAVIGATION_STORAGE_KEY)
    if (!stored) return "expanded"
    return readNavigationMode(window.localStorage)
  } catch {
    return memoryMode
  }
}

function subscribeToNavigationMode(onStoreChange: () => void) {
  window.addEventListener(NAVIGATION_CHANGE_EVENT, onStoreChange)
  window.addEventListener("storage", onStoreChange)
  return () => {
    window.removeEventListener(NAVIGATION_CHANGE_EVENT, onStoreChange)
    window.removeEventListener("storage", onStoreChange)
  }
}

function persistNavigationMode(nextMode: NavigationMode) {
  memoryMode = nextMode
  try {
    window.localStorage.setItem(
      NAVIGATION_STORAGE_KEY,
      JSON.stringify({ mode: nextMode })
    )
  } catch {
    // La preferencia temporal continúa en memoria si storage no está disponible.
  }
  notifyNavigationModeChange()
}

function notifyNavigationModeChange() {
  window.dispatchEvent(new Event(NAVIGATION_CHANGE_EVENT))
}

export function useAppShellState() {
  const context = React.useContext(AppShellStateContext)
  if (!context) {
    throw new Error(
      "useAppShellState debe usarse dentro de AppShellStateProvider"
    )
  }
  return context
}
