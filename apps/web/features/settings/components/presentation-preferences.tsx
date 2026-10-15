"use client"
import { PageHeader } from "@/components/navigation/page-header"
import { useAppShellState } from "@/components/app-shell/app-shell-state"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { useScenario } from "@/features/demo/state/scenario-provider"
import { hasCapability } from "@/features/demo/data/capabilities"
export function PresentationPreferences() {
  const { mode, setMode, resetMode } = useAppShellState()
  const { scenario } = useScenario()
  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Configuración" />
      {hasCapability(scenario, "catalogs.manage") &&
        hasCapability(scenario, "finance.prepare") && (
          <nav
            aria-label="Catálogos administrativos"
            className="flex flex-wrap gap-4 border-b border-border pb-4 text-sm"
          >
            <Link
              href="/configuracion/categorias"
              className="inline-flex min-h-10 items-center font-medium text-primary underline"
            >
              Categorías y conceptos
            </Link>
          </nav>
        )}
      {hasCapability(scenario, "people.manage") && (
        <nav
          aria-label="Administración del acceso"
          className="flex flex-wrap gap-4 rounded-lg border border-border bg-card p-4 text-sm"
        >
          <Link
            className="font-medium text-primary underline"
            href="/configuracion/personas"
          >
            Personas y acceso
          </Link>
          <Link
            className="font-medium text-primary underline"
            href="/configuracion/equipos"
          >
            Equipos y responsables
          </Link>
        </nav>
      )}
      <section
        className="space-y-4 border-y border-border py-4"
        aria-labelledby="presentation-preferences"
      >
        <h2 id="presentation-preferences" className="text-base font-semibold">
          Preferencias de presentación
        </h2>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">
            Navegación de escritorio
          </legend>
          {(["expanded", "compact"] as const).map((value) => (
            <label
              key={value}
              className="flex min-h-10 items-center gap-3 text-sm"
            >
              <input
                type="radio"
                name="navigation"
                checked={mode === value}
                onChange={() => setMode(value)}
              />
              {value === "expanded" ? "Ampliada" : "Compacta"}
            </label>
          ))}
        </fieldset>
        <p className="text-xs text-muted-foreground">
          Se conserva en este navegador. En móvil se utiliza el menú lateral.
        </p>
        {mode !== "expanded" ? (
          <Button variant="outline" size="sm" onClick={resetMode}>
            Restablecer navegación
          </Button>
        ) : null}
      </section>
      <section className="space-y-2" aria-labelledby="business-parameters">
        <h2 id="business-parameters" className="text-base font-semibold">
          Parámetros del negocio
        </h2>
        <p className="text-sm text-muted-foreground">
          Requisitos por cliente, regímenes, permisos y reglas requieren
          definición con ABT. Esta vista no modifica esos parámetros.
        </p>
      </section>
    </div>
  )
}
