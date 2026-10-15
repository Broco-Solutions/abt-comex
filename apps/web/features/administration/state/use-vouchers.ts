"use client"
import { useEffect, useState } from "react"
import { initialVoucherState, loadVouchers } from "../data/vouchers"
export function useVouchers() {
  const [state, setState] = useState(initialVoucherState)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const refresh = () => {
      setState(loadVouchers())
      setReady(true)
    }
    refresh()
    window.addEventListener("abt:demo-change", refresh)
    return () => window.removeEventListener("abt:demo-change", refresh)
  }, [])
  return { state, ready }
}
