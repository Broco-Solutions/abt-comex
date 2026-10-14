"use client"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useScenario } from "../state/scenario-provider"
import { canVisit, scenarioKind } from "../data/scenarios"

export function ScenarioBoundary({ children }: { children: React.ReactNode }) {
  const { scenario } = useScenario()
  const pathname = usePathname()
  const params = useSearchParams()
  const kind = scenarioKind(scenario)
  const requested = params.get("tipo")
  const otherKind =
    pathname === "/operaciones" &&
    kind &&
    requested &&
    requested !== (kind === "Importación" ? "importacion" : "exportacion")
  if (!canVisit(scenario, pathname) || otherKind)
    return (
      <section className="max-w-2xl space-y-4">
        <h1 className="text-2xl font-semibold">Vista no disponible</h1>
        <p className="text-sm text-muted-foreground">
          Esta perspectiva no incluye la información solicitada.
        </p>
        <Link
          href="/acceso"
          className="inline-flex min-h-11 items-center font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
        >
          Cambiar perspectiva
        </Link>
      </section>
    )
  return children
}
