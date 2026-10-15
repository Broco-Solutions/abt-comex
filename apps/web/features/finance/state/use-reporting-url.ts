"use client"
import { useEffect, useState } from "react"
export type ReportingSearchParams = Record<
  string,
  string | string[] | undefined
>
export function useReportingUrl(
  searchParams: ReportingSearchParams,
  path: string
) {
  const initial = (value: ReportingSearchParams) =>
    new URLSearchParams(
      Object.entries(value).flatMap(([key, entry]) =>
        typeof entry === "string" ? [[key, entry]] : []
      )
    )
  const [params, setParams] = useState(() => initial(searchParams))
  const incoming = JSON.stringify(searchParams),
    [previous, setPrevious] = useState(incoming)
  if (incoming !== previous) {
    setPrevious(incoming)
    setParams(initial(searchParams))
  }
  useEffect(() => {
    const restore = () => setParams(new URLSearchParams(window.location.search))
    window.addEventListener("popstate", restore)
    return () => window.removeEventListener("popstate", restore)
  }, [])
  const href = params.size ? `${path}?${params}` : path
  const change = (
    patch: Record<string, string | undefined>,
    replace = false
  ) => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    const url = next.size ? `${path}?${next}` : path
    window.history[replace ? "replaceState" : "pushState"](null, "", url)
    setParams(next)
  }
  return { params, href, change }
}
