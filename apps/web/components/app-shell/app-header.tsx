import { Suspense } from "react"

import { Breadcrumbs } from "../navigation/breadcrumbs"
import { MobileNavigation } from "./mobile-navigation"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e6eae8] bg-background">
      <div className="flex min-h-14 items-center gap-3 px-3 py-2 sm:px-5 lg:px-8 lg:py-3">
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
        <Suspense>
          <span className="shrink-0 text-xs text-muted-foreground">
            <span className="hidden md:inline">Entorno de evaluación</span>
            <span className="md:hidden">Evaluación</span>
          </span>
        </Suspense>
      </div>
    </header>
  )
}
