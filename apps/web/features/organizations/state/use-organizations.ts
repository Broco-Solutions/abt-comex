"use client"

import { useEffect, useState } from "react"
import { initialOrganizations, loadOrganizations } from "../data/organizations"

export function useOrganizations() {
  const [organizations, setOrganizations] = useState(initialOrganizations)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const refresh = () => {
      setOrganizations(loadOrganizations())
      setReady(true)
    }
    refresh()
    window.addEventListener("abt:demo-change", refresh)
    return () => window.removeEventListener("abt:demo-change", refresh)
  }, [])
  return { organizations, ready }
}
