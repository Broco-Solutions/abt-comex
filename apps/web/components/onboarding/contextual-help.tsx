"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { Button, buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { GettingStartedChecklist } from "./getting-started-checklist"
import { useOnboarding } from "./onboarding-provider"
import {
  findNavigationItem,
  resolveActiveNavigation,
} from "../navigation/app-navigation"

export function ContextualHelp({
  onNavigateToOnboarding,
}: {
  onNavigateToOnboarding?: () => void
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { dismissed, reset, resume, visible } = useOnboarding()
  const item = findNavigationItem(
    resolveActiveNavigation(pathname, searchParams)
  )

  return (
    <div className="space-y-6">
      <section aria-labelledby="current-screen-help">
        <h3 id="current-screen-help" className="text-sm font-semibold">
          Sobre esta pantalla
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {item?.description ??
            "Esta ubicación no forma parte de la navegación principal disponible."}
        </p>
      </section>
      <section
        aria-labelledby="onboarding-help"
        className="border-t border-border pt-5"
      >
        <h3 id="onboarding-help" className="text-sm font-semibold">
          Inducción
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          El avance se guarda sólo en este navegador mientras se define la
          identidad real del producto.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {pathname !== "/inicio" || dismissed || !visible ? (
            <Link
              href="/inicio"
              className={cn(buttonVariants({ size: "sm" }))}
              onClick={() => {
                resume()
                onNavigateToOnboarding?.()
              }}
            >
              Retomar orientación
            </Link>
          ) : null}
          <Button size="sm" variant="outline" onClick={reset}>
            Reiniciar progreso
          </Button>
        </div>
      </section>
      <div className="border-t border-border pt-5">
        <GettingStartedChecklist id="help-getting-started" />
      </div>
    </div>
  )
}
