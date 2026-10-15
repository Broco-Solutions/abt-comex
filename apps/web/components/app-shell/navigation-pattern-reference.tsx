"use client"

import { Suspense } from "react"

import { AppShellStateProvider } from "./app-shell-state"
import { AppSidebar } from "./app-sidebar"
import { MobileNavigation } from "./mobile-navigation"
import { OnboardingProvider } from "../onboarding/onboarding-provider"
import { GlobalSearch } from "@/features/search/components/global-search"

export function NavigationPatternReference() {
  return (
    <AppShellStateProvider>
      <OnboardingProvider>
        <div className="mb-6 max-w-xl rounded-lg border border-border bg-background p-4">
          <h3 className="mb-3 text-sm font-semibold">Buscar o ir a…</h3>
          <Suspense>
            <GlobalSearch />
          </Suspense>
          <p className="mt-2 text-xs text-muted-foreground">
            Navegación por registros y pantallas del escenario activo.
            Ctrl/Cmd+K, flechas, Enter y Escape.
          </p>
        </div>
        <Suspense
          fallback={
            <p className="text-sm text-muted-foreground">
              Preparando referencia de navegación…
            </p>
          }
        >
          <div className="grid items-start gap-6 xl:grid-cols-[16.5rem_4.5rem_minmax(0,1fr)]">
            <ReferencePanel title="Sidebar expandida">
              <div className="h-[38rem] overflow-hidden border border-sidebar-border">
                <AppSidebar
                  activeIdOverride="operaciones-importaciones"
                  modeOverride="expanded"
                  showModeControl={false}
                />
              </div>
            </ReferencePanel>
            <ReferencePanel title="Sidebar compacta">
              <div className="h-[38rem] overflow-hidden border border-sidebar-border">
                <AppSidebar
                  activeIdOverride="operaciones-importaciones"
                  modeOverride="compact"
                  showModeControl={false}
                />
              </div>
            </ReferencePanel>
            <ReferencePanel title="Drawer mobile">
              <div className="border border-border bg-muted/35 p-4">
                <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                  El drawer conserva wordmark, etiquetas, subniveles y
                  atribución completa. El rail no se traslada a tablet o mobile.
                </p>
                <div className="mt-4 inline-flex rounded-md border border-border bg-background p-1">
                  <MobileNavigation forceVisible />
                </div>
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-medium">Estados</dt>
                  <dd className="mt-1 text-muted-foreground">
                    Inactivo, sección activa y destino seleccionado usan señales
                    distintas.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Tooltip y flyout</dt>
                  <dd className="mt-1 text-muted-foreground">
                    Hover o foco revela nombres; Operaciones expone sus vistas
                    filtradas con teclado y Escape.
                  </dd>
                </div>
              </dl>
            </ReferencePanel>
          </div>
        </Suspense>
      </OnboardingProvider>
    </AppShellStateProvider>
  )
}

function ReferencePanel({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      {children}
    </div>
  )
}
