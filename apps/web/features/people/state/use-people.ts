"use client"
import { useEffect, useState } from "react"
import { initialPeople, loadPeople } from "../data/people"
export function usePeople() {
  const [state, setState] = useState(initialPeople)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const refresh = () => {
      setState(loadPeople())
      setReady(true)
    }
    refresh()
    window.addEventListener("abt:demo-change", refresh)
    return () => window.removeEventListener("abt:demo-change", refresh)
  }, [])
  return { state, ready }
}
