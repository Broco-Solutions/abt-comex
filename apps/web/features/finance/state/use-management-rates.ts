"use client"
import { useEffect, useState } from "react"
import { initialRateBook, loadRateBook } from "../data/management-rates"
export function useManagementRates() {
  const [book, setBook] = useState(initialRateBook)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const refresh = () => {
      setBook(loadRateBook())
      setReady(true)
    }
    refresh()
    window.addEventListener("abt:demo-change", refresh)
    return () => window.removeEventListener("abt:demo-change", refresh)
  }, [])
  return { book, ready }
}
