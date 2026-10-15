"use client"
import { UserRound, ChevronDown } from "lucide-react"
import { useRef, useState } from "react"
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
import { usePeople } from "@/features/people/state/use-people"
import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogViewport,
} from "@workspace/ui/components/dialog"

export function UserMenu({
  compact = false,
  onNavigate,
}: {
  compact?: boolean
  onNavigate?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { scenario, dirty, exit, reset } = useScenario()
  const { state } = usePeople()
  const member = state.members.find((person) => person.id === scenario.memberId)
  const identity = member?.name ?? "Escenario de evaluación"
  const subtitle = member?.email || scenario.label
  const initials = member
    ? member.name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
    : null
  const closeAndNavigate = () => {
    setOpen(false)
    onNavigate?.()
  }
  const onboarding = useOnboarding()
  const itemClass =
    "flex min-h-10 w-full items-center rounded-md px-3 text-left text-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              ref={triggerRef}
              variant="ghost"
              aria-label="Menú de usuario"
              title={compact ? `${identity} · ${subtitle}` : undefined}
              className={`min-h-12 w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring ${compact ? "justify-center px-1" : "justify-start gap-2 px-2"}`}
            />
          }
        >
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-accent/60 text-xs font-semibold"
          >
            {initials ?? <UserRound className="size-4" />}
          </span>
          {compact ? null : (
            <>
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-sm font-medium">
                  {identity}
                </span>
                <span className="block truncate text-xs font-normal text-sidebar-foreground/75">
                  {subtitle}
                </span>
              </span>
              <ChevronDown aria-hidden="true" className="size-3 shrink-0" />
            </>
          )}
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="top"
          className="w-72 p-2"
          aria-label="Opciones de usuario"
        >
          <p className="border-b border-border px-3 py-2 text-xs text-muted-foreground">
            {member ? "Acceso de evaluación · " : "Escenario de evaluación · "}
            {scenario.label}
          </p>
          <button
            type="button"
            className={itemClass}
            onClick={() => {
              setOpen(false)
              setProfileOpen(true)
            }}
          >
            Mi perfil
          </button>
          <Link
            href="/acceso/escenarios"
            onClick={closeAndNavigate}
            className={itemClass}
          >
            Cambiar escenario de evaluación
          </Link>
          <HelpEntryPoint
            label="Ayuda e inducción"
            onNavigate={closeAndNavigate}
          />
          <Link
            href="/inicio"
            className={itemClass}
            onClick={() => {
              onboarding.resume()
              closeAndNavigate()
            }}
          >
            Retomar inducción
          </Link>
          <Link
            href="/inicio"
            className={itemClass}
            onClick={() => {
              onboarding.reset()
              closeAndNavigate()
            }}
          >
            Reiniciar inducción
          </Link>
          <button
            onClick={() => {
              reset()
              setOpen(false)
            }}
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
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogPortal>
          <DialogBackdrop />
          <DialogViewport>
            <DialogPopup finalFocus={triggerRef}>
              <DialogTitle>Mi perfil</DialogTitle>
              <DialogDescription className="mt-2">
                Consulta del contexto de evaluación. Los datos laborales y las
                capacidades se administran por separado.
              </DialogDescription>
              <dl className="mt-5 space-y-3 text-sm">
                {[
                  ["Identidad", identity],
                  ["Escenario", scenario.label],
                  ...(member
                    ? [
                        [
                          "Correo laboral",
                          member.email || "Pendiente de relevamiento",
                        ],
                        ["Área", member.area || "Pendiente de relevamiento"],
                        [
                          "Función",
                          member.function || "Pendiente de relevamiento",
                        ],
                        ["Acceso", member.access],
                      ]
                    : [
                        [
                          "Acceso",
                          "Simulación de capacidades; no representa un inicio de sesión real",
                        ],
                      ]),
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium break-words">{value}</dd>
                  </div>
                ))}
              </dl>
            </DialogPopup>
          </DialogViewport>
        </DialogPortal>
      </Dialog>
    </>
  )
}
