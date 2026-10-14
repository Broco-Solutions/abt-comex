"use client"

import { useCallback, useEffect, useState } from "react"

import {
  initialDemoQuotes,
  loadDemoQuotes,
  saveDemoQuotes,
} from "../data/quotes"
import type { DemonstrationQuote } from "../types/quote"

export function useDemoQuotes() {
  const [quotes, setQuotes] = useState(initialDemoQuotes)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Browser-only session data hydrates after SSR to avoid server/client markup mismatches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuotes(loadDemoQuotes())
    setReady(true)
  }, [])

  const updateQuotes = useCallback(
    (update: (current: DemonstrationQuote[]) => DemonstrationQuote[]) => {
      setQuotes((current) => {
        const next = update(current)
        saveDemoQuotes(next)
        return next
      })
    },
    []
  )

  const resetQuotes = useCallback(() => {
    saveDemoQuotes(initialDemoQuotes)
    setQuotes(initialDemoQuotes)
  }, [])

  return { quotes, ready, updateQuotes, resetQuotes }
}
