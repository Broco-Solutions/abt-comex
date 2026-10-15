"use client"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { AccessPage } from "@/features/demo/components/access-page"
import { canVisit } from "@/features/demo/data/scenarios"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"

import { BrandAttribution } from "@/components/brand/brand-attribution"
import { PORTAL_DEMO_CLIENT_ID } from "../data/portal"

export function PortalShell({ children }: { children: React.ReactNode }) {
  const { active, scenario, exit } = useScenario()
  const pathname = usePathname()
  if (
    (!active || !canVisit(scenario, pathname)) &&
    pathname !== "/portal/acceso"
  )
    return <AccessPage />
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#portal-main"
        className="fixed top-2 left-2 z-[100] -translate-y-20 rounded-md bg-background px-3 py-2 text-sm font-medium shadow-lg focus:translate-y-0 focus:outline-2 focus:outline-offset-2 focus:outline-primary"
      >
        Saltar al contenido principal
      </a>
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href={`/portal?cliente=${PORTAL_DEMO_CLIENT_ID}`}
            aria-label="ABT Comex — inicio del Portal de Clientes"
            className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <Image
              src="/brand/ABT_COMEX_logo_green_transparent.png"
              alt="ABT Comex"
              width={150}
              height={58}
              priority
              className="h-10 w-auto object-contain"
            />
          </Link>
          <nav
            aria-label="Navegación del Portal"
            className="flex items-center gap-4 text-sm"
          >
            <Link
              href={`/portal?cliente=${PORTAL_DEMO_CLIENT_ID}`}
              className="min-h-10 rounded-sm py-2 font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Mis operaciones
            </Link>
            <Link
              href="/acceso/escenarios"
              className="min-h-10 rounded-sm py-2 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Cambiar escenario
            </Link>
            <Button variant="ghost" size="sm" onClick={exit}>
              Salir
            </Button>
          </nav>
        </div>
      </header>

      <main
        id="portal-main"
        tabIndex={-1}
        className="mx-auto min-h-[calc(100vh-11rem)] max-w-6xl px-4 py-6 outline-none sm:px-6 sm:py-8"
      >
        {children}
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <p className="text-xs text-muted-foreground">Entorno de evaluación</p>
          <BrandAttribution />
        </div>
      </footer>
    </div>
  )
}
