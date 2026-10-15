"use client"
import { useEffect, useState } from "react"
import { loadReceivedDocuments } from "../data/documents"
export function useReceivedDocuments() {
  const [received, setReceived] = useState<string[]>([])
  useEffect(() => {
    const refresh = () => setReceived(loadReceivedDocuments())
    refresh()
    window.addEventListener("abt:demo-change", refresh)
    return () => window.removeEventListener("abt:demo-change", refresh)
  }, [])
  return received
}
