"use client"

import * as React from "react"

export const ONBOARDING_STORAGE_KEY = "abt-comex:onboarding:v1"

export const onboardingSteps = [
  { id: "navigation", label: "Conocer la navegación principal" },
  { id: "home", label: "Entender qué concentrará Inicio" },
  { id: "work", label: "Conocer la sección Mi trabajo" },
  { id: "help", label: "Encontrar la ayuda contextual" },
  { id: "modules", label: "Revisar los módulos disponibles" },
] as const

export type OnboardingStepId = (typeof onboardingSteps)[number]["id"]

type PersistedOnboardingState = {
  completed: OnboardingStepId[]
  dismissed: boolean
}

type OnboardingContextValue = PersistedOnboardingState & {
  ready: boolean
  visible: boolean
  progress: number
  toggleStep: (id: OnboardingStepId) => void
  dismiss: () => void
  resume: () => void
  reset: () => void
}

const initialState: PersistedOnboardingState = {
  completed: [],
  dismissed: false,
}

const OnboardingContext = React.createContext<OnboardingContextValue | null>(
  null
)

export function calculateOnboardingProgress(
  completed: readonly OnboardingStepId[]
) {
  return Math.round((completed.length / onboardingSteps.length) * 100)
}

function isPersistedState(value: unknown): value is PersistedOnboardingState {
  if (!value || typeof value !== "object") return false
  const candidate = value as Partial<PersistedOnboardingState>
  const completed = candidate.completed
  return (
    typeof candidate.dismissed === "boolean" &&
    Array.isArray(completed) &&
    completed.length <= onboardingSteps.length &&
    new Set(completed).size === completed.length &&
    completed.every((id) => onboardingSteps.some((step) => step.id === id))
  )
}

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, setState] = React.useState(initialState)
  const [ready, setReady] = React.useState(false)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    let active = true
    queueMicrotask(() => {
      if (!active) return
      try {
        const stored = window.localStorage.getItem(ONBOARDING_STORAGE_KEY)
        const parsed: unknown = stored ? JSON.parse(stored) : null
        const nextState = isPersistedState(parsed) ? parsed : initialState
        setState(nextState)
        setVisible(!nextState.dismissed)
      } catch {
        setState(initialState)
        setVisible(true)
      } finally {
        setReady(true)
      }
    })
    return () => {
      active = false
    }
  }, [])

  const persist = React.useCallback((nextState: PersistedOnboardingState) => {
    setState(nextState)
    try {
      window.localStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify(nextState)
      )
    } catch {
      // La inducción sigue operativa en memoria si el navegador bloquea storage.
    }
  }, [])

  const value = React.useMemo<OnboardingContextValue>(
    () => ({
      ...state,
      ready,
      visible,
      progress: calculateOnboardingProgress(state.completed),
      toggleStep: (id) => {
        const completed = state.completed.includes(id)
          ? state.completed.filter((stepId) => stepId !== id)
          : [...state.completed, id]
        const isComplete = completed.length === onboardingSteps.length
        persist({
          ...state,
          completed,
          dismissed: isComplete || state.dismissed,
        })
        if (isComplete) setVisible(false)
      },
      dismiss: () => {
        persist({ ...state, dismissed: true })
        setVisible(false)
      },
      resume: () => {
        persist({ ...state, dismissed: false })
        setVisible(true)
      },
      reset: () => {
        persist(initialState)
        setVisible(true)
      },
    }),
    [persist, ready, state, visible]
  )

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const value = React.useContext(OnboardingContext)
  if (!value) {
    throw new Error("useOnboarding debe usarse dentro de OnboardingProvider")
  }
  return value
}
