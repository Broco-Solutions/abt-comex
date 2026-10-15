"use client"

import { Suspense } from "react"

import { cn } from "@workspace/ui/lib/utils"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { AppShellStateProvider, useAppShellState } from "./app-shell-state"
import { OnboardingProvider } from "../onboarding/onboarding-provider"
import { WelcomePanel } from "../onboarding/welcome-panel"
import { AccessPage } from "@/features/demo/components/access-page"
import { ScenarioBoundary } from "@/features/demo/components/scenario-boundary"
import { useScenario } from "@/features/demo/state/scenario-provider"
import Link from "next/link"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShellStateProvider>
      <OnboardingProvider>
        <AppShellFrame>{children}</AppShellFrame>
      </OnboardingProvider>
    </AppShellStateProvider>
  )
}

function AppShellFrame({ children }: { children: React.ReactNode }) {
  const { mode } = useAppShellState()
  const { scenario, active } = useScenario()
  if (!active) return <AccessPage />
  if (scenario.id === "client")
    return (
      <main className="grid min-h-svh place-items-center">
        <Link href="/portal" className="font-medium text-primary underline">
          Ir al Portal de Clientes
        </Link>
      </main>
    )

  return (
    <>
      <a
        href="#main-content"
        className="fixed top-2 left-2 z-[100] -translate-y-20 rounded-md bg-background px-3 py-2 text-sm font-medium shadow-lg focus:translate-y-0 focus:outline-2 focus:outline-offset-2 focus:outline-primary"
      >
        Saltar al contenido principal
      </a>
      <div
        data-shell-navigation-mode={mode}
        className={cn(
          "min-h-svh bg-muted/30 lg:grid lg:transition-[grid-template-columns] lg:duration-200 lg:motion-reduce:transition-none",
          mode === "compact"
            ? "lg:grid-cols-[4.5rem_minmax(0,1fr)]"
            : "lg:grid-cols-[16.5rem_minmax(0,1fr)]"
        )}
      >
        <aside
          data-slot="desktop-sidebar"
          className="sticky top-0 hidden h-svh border-r border-sidebar-border lg:block"
        >
          <Suspense fallback={<div className="h-full bg-sidebar" />}>
            <AppSidebar />
          </Suspense>
        </aside>
        <div className="min-w-0">
          <AppHeader />
          <main id="main-content" tabIndex={-1} className="outline-none">
            <WelcomePanel />
            <div className="mx-auto my-4 w-full max-w-7xl rounded-lg border border-border bg-card px-4 py-5 sm:px-6 lg:px-8">
              <Suspense fallback={<p role="status">Preparando vista…</p>}>
                <ScenarioBoundary>{children}</ScenarioBoundary>
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
