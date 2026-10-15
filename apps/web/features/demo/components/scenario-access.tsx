"use client"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useScenario } from "../state/scenario-provider"
import { scenarios } from "../data/scenarios"
import { usePeople } from "@/features/people/state/use-people"
import { memberForPerspective } from "@/features/people/data/people"
import { AccessFrame } from "./access-frame"
export function ScenarioAccess() {
  const { choose } = useScenario()
  const { state } = usePeople()
  return (
    <AccessFrame>
      <h2 className="text-2xl font-semibold">Elegí una perspectiva</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Escenarios ficticios para evaluar capacidades; no son roles aprobados
        por ABT.
      </p>
      <div className="mt-6 divide-y divide-border border-y border-border">
        {scenarios.map((item) => (
          <button
            key={item.id}
            disabled={!memberForPerspective(item.id, state)}
            onClick={() => choose(item.id)}
            className="flex min-h-16 w-full items-center justify-between gap-4 px-2 py-4 text-left hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
          >
            <span>
              <span className="block font-medium">{item.label}</span>
              <span className="block text-sm text-muted-foreground">
                {memberForPerspective(item.id, state)
                  ? item.description
                  : "Sin identidad activa para esta perspectiva"}
              </span>
            </span>
            <ArrowRight
              aria-hidden="true"
              className="size-4 shrink-0 text-primary"
            />
          </button>
        ))}
      </div>
      <Link
        href="/acceso"
        className="mt-6 inline-block text-sm text-primary underline"
      >
        Volver al acceso
      </Link>
    </AccessFrame>
  )
}
