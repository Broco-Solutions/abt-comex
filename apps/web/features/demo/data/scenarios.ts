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
export type Scenario = (typeof scenarios)[number]
export function getScenario(id: string): Scenario {
  return scenarios.find((item) => item.id === id) ?? scenarios[2]
}
export function canVisit(scenario: Scenario, pathname: string) {
  if (pathname.startsWith("/portal")) return scenario.id === "client"
  if (scenario.id === "client") return false
  if (
    pathname.startsWith("/tramites/djve") &&
    scenarioKind(scenario) === "Importación"
  )
    return false
  if (pathname.startsWith("/cotizaciones")) return scenario.commercial
  if (pathname.startsWith("/administracion")) return scenario.financial
  if (pathname.startsWith("/gestion")) return scenario.executive
  return true
}
export function scenarioKind(
  scenario: Scenario
): "Importación" | "Exportación" | undefined {
  return "kind" in scenario ? scenario.kind : undefined
}
