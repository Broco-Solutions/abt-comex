import { hasCapability, type Capability } from "./capabilities"

export type ScenarioId =
  | "import"
  | "export"
  | "operations"
  | "administration"
  | "direction"
  | "client"
export const DEMONSTRATION_DATE = "2026-10-14"
export const scenarios = [
  {
    id: "import",
    label: "Operador de Importación",
    description: "Operaciones y pendientes de Importación",
    kind: "Importación",
    commercial: false,
    financial: false,
    executive: false,
  },
  {
    id: "export",
    label: "Operador de Exportación",
    description: "Exportaciones, permisos y DJVE",
    kind: "Exportación",
    commercial: false,
    financial: false,
    executive: false,
  },
  {
    id: "operations",
    label: "Responsable operativo",
    description: "Seguimiento y controles del equipo",
    commercial: false,
    financial: false,
    executive: false,
  },
  {
    id: "administration",
    label: "Administración",
    description: "Pases, comprobantes y vencimientos",
    commercial: false,
    financial: true,
    executive: false,
  },
  {
    id: "direction",
    label: "Dirección",
    description: "Análisis y revisión integral",
    commercial: true,
    financial: true,
    executive: true,
  },
  {
    id: "client",
    clientId: "client-demo-centro",
    label: "Cliente externo",
    description: "Operaciones y documentos propios",
    commercial: false,
    financial: false,
    executive: false,
  },
] as const
export type Scenario = {
  label: string
  description: string
  commercial: boolean
  financial: boolean
  executive: boolean
  capabilities?: readonly Capability[]
  memberId?: string
} & (
  | { id: "client"; clientId: string; kind?: undefined }
  | {
      id: Exclude<ScenarioId, "client">
      clientId?: undefined
      kind?: "Importación" | "Exportación"
    }
)
export function getScenario(id: string): Scenario {
  return scenarios.find((item) => item.id === id) ?? scenarios[2]
}
export function canVisit(scenario: Scenario, pathname: string) {
  if (pathname.startsWith("/portal"))
    return scenario.id === "client" && hasCapability(scenario, "portal.read")
  if (scenario.id === "client") return false
  if (pathname.startsWith("/configuracion/categorias"))
    return (
      hasCapability(scenario, "catalogs.manage") &&
      hasCapability(scenario, "finance.prepare")
    )
  if (
    pathname.startsWith("/configuracion/personas") ||
    pathname.startsWith("/configuracion/equipos")
  )
    return hasCapability(scenario, "people.manage")
  if (pathname.startsWith("/operaciones") || pathname.startsWith("/tramites")) {
    if (!hasCapability(scenario, "operations.read")) return false
    if (
      pathname === "/operaciones/nueva" &&
      !hasCapability(scenario, "operations.write")
    )
      return false
  }
  if (
    pathname.startsWith("/tramites/djve") &&
    scenarioKind(scenario) === "Importación"
  )
    return false
  if (pathname.startsWith("/cotizaciones"))
    return (
      hasCapability(scenario, "commercial.read") &&
      (!/\/(?:nueva|editar)$/.test(pathname) ||
        hasCapability(scenario, "commercial.write"))
    )
  if (pathname.startsWith("/administracion"))
    return [
      "finance.billing",
      "finance.collections",
      "finance.treasury",
      "finance.expenses",
      "finance.prepare",
    ].some((cap) => hasCapability(scenario, cap as Capability))
  if (pathname.startsWith("/gestion"))
    return hasCapability(scenario, "management.read")
  return true
}
export function scenarioKind(
  scenario: Scenario
): "Importación" | "Exportación" | undefined {
  return "kind" in scenario ? scenario.kind : undefined
}
