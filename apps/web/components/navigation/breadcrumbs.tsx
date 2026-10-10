"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"

import { buildBreadcrumbs } from "./app-navigation"

export function Breadcrumbs() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const breadcrumbs = buildBreadcrumbs(pathname, searchParams)

  if (breadcrumbs.length === 0) return null

  return (
    <nav aria-label="Ruta de navegación">
      <ol className="flex min-w-0 items-center gap-1.5 text-xs text-foreground/70">
        {breadcrumbs.map((item, index) => (
          <li
            key={`${item.label}-${index}`}
            className="flex min-w-0 items-center gap-1.5"
          >
            {index > 0 ? (
              <ChevronRight aria-hidden="true" className="size-3 shrink-0" />
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className="truncate underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={item.current ? "page" : undefined}
                className="truncate"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
