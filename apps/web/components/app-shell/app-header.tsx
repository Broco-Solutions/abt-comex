import { Suspense } from "react"

import { Breadcrumbs } from "../navigation/breadcrumbs"
import { UserMenu } from "./user-menu"
import { MobileNavigation } from "./mobile-navigation"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/90">
      <div className="flex min-h-14 items-center gap-2 px-3 sm:px-5 lg:px-8">
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
          <span className="hidden text-xs text-muted-foreground md:inline">
            Entorno de evaluación
          </span>
          <UserMenu />
        </Suspense>
      </div>
    </header>
  )
}
