"use client"
import { useEffect, useState } from "react"
import {
  initialAdministrativeLedger,
  loadAdministrativeLedger,
} from "../data/administrative-ledger"
export function useAdministrativeLedger() {
  const [state, setState] = useState(initialAdministrativeLedger)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const refresh = () => {
      setState(loadAdministrativeLedger())
      setReady(true)
    }
    refresh()
    window.addEventListener("abt:demo-change", refresh)
    return () => window.removeEventListener("abt:demo-change", refresh)
  }, [])
  return { state, ready }
}
