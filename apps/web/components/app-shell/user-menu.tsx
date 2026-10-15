"use client"
import { UserRound, ChevronDown } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { useOnboarding } from "../onboarding/onboarding-provider"
import { HelpEntryPoint } from "../onboarding/help-entry-point"
export function UserMenu() {
  const [open, setOpen] = useState(false)
  const { scenario, dirty, exit, reset } = useScenario()
  const onboarding = useOnboarding()
  const itemClass =
    "flex min-h-10 w-full items-center rounded-md px-3 text-left text-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" aria-label="Menú de usuario" />
        }
      >
        <UserRound aria-hidden="true" className="size-4" />
        <span className="hidden max-w-44 truncate sm:inline">
          {scenario.label}
        </span>
        <ChevronDown aria-hidden="true" className="size-3" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-64 p-2"
        aria-label="Opciones de usuario"
      >
        <p className="border-b border-border px-3 py-2 text-xs text-muted-foreground">
          {scenario.label}
        </p>
        <Link
          href="/acceso/escenarios"
          onClick={() => setOpen(false)}
          className={itemClass}
        >
          Cambiar perspectiva
        </Link>
        <HelpEntryPoint
          label="Ayuda e inducción"
          onNavigate={() => setOpen(false)}
        />
        <Link
          href="/inicio"
          className={itemClass}
          onClick={() => {
            onboarding.resume()
            setOpen(false)
          }}
        >
          Retomar inducción
        </Link>
        <Link
          href="/inicio"
          className={itemClass}
          onClick={() => {
            onboarding.reset()
            setOpen(false)
          }}
        >
          Reiniciar inducción
        </Link>
        <button
          onClick={reset}
          disabled={!dirty}
          title={!dirty ? "No hay cambios temporales" : undefined}
          className={
            itemClass + " disabled:cursor-not-allowed disabled:opacity-50"
          }
        >
          Reiniciar datos temporales
        </button>
        <button
          onClick={exit}
          className={itemClass + " mt-1 border-t border-border"}
        >
          Salir
        </button>
      </PopoverContent>
    </Popover>
  )
}
