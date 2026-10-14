"use client"

import { usePathname } from "next/navigation"

import { Button } from "@workspace/ui/components/button"

import { GettingStartedChecklist } from "./getting-started-checklist"
import { useOnboarding } from "./onboarding-provider"

export function WelcomePanel() {
  const pathname = usePathname()
  const { dismiss, ready, visible } = useOnboarding()

  if (pathname !== "/inicio" || !ready || !visible) return null

  return (
    <section
      data-slot="onboarding-section"
      aria-labelledby="welcome-title"
      className="border-b border-border bg-muted/45"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div
          data-slot="onboarding-grid"
          className="grid max-w-5xl gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] xl:gap-8"
        >
          <div data-slot="onboarding-introduction" className="max-w-xl">
            <p className="text-xs font-medium tracking-wider text-primary uppercase">
              Orientación inicial
            </p>
            <h2 id="welcome-title" className="mt-1.5 text-lg font-semibold">
              Bienvenido a ABT Comex
            </h2>
            <p className="mt-2 max-w-prose text-sm leading-6 text-muted-foreground">
              Esta guía breve presenta la estructura disponible. Podés omitirla
              ahora y retomarla en cualquier momento desde el menú de usuario.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={dismiss}
            >
              Omitir por ahora
            </Button>
          </div>
          <div
            data-slot="onboarding-checklist"
            className="xl:border-l xl:border-border xl:pl-8"
          >
            <GettingStartedChecklist id="welcome-getting-started" />
          </div>
        </div>
      </div>
    </section>
  )
}
