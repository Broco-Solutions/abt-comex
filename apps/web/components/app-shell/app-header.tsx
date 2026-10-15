import { Suspense } from "react"

import { Breadcrumbs } from "../navigation/breadcrumbs"
import { MobileNavigation } from "./mobile-navigation"
import { GlobalSearch } from "@/features/search/components/global-search"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e6eae8] bg-background">
      <div className="flex min-h-14 items-center gap-3 px-3 py-2 sm:px-5 md:grid md:grid-cols-[minmax(0,1fr)_minmax(12rem,min(32vw,27.5rem))_minmax(0,1fr)] lg:px-8 lg:py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Suspense fallback={<div className="size-9 lg:hidden" />}>
            <MobileNavigation />
          </Suspense>
          <div className="min-w-0 flex-1">
            <Suspense
              fallback={
                <span className="text-xs text-muted-foreground">ABT Comex</span>
              }
            >
              <Breadcrumbs />
            </Suspense>
          </div>
        </div>
        <Suspense>
          <GlobalSearch />
        </Suspense>
        <Suspense>
          <span className="shrink-0 justify-self-end text-xs text-muted-foreground">
            <span className="hidden xl:inline">Entorno de evaluación</span>
            <span className="xl:hidden">Evaluación</span>
          </span>
        </Suspense>
      </div>
    </header>
  )
}
