export const capabilityLabels = {
  "operations.read": "Consultar operaciones",
  "operations.write": "Crear y editar operaciones locales",
  "operations.review": "Registrar controles locales",
  "customs.values": "Consultar valores aduaneros y tributos",
  "commercial.read": "Consultar cotizaciones y condiciones comerciales",
  "commercial.write": "Preparar cotizaciones",
  "commercial.approve": "Representar aprobación interna de cotizaciones",
  "costs.internal": "Consultar costos internos",
  "finance.billing": "Consultar comprobantes y facturación",
  "finance.collections": "Consultar cobranzas y cuentas por cobrar",
  "finance.treasury": "Consultar pagos y tesorería",
  "finance.expenses": "Consultar gastos y rendiciones",
  "finance.prepare": "Preparar registros administrativos locales",
  "management.read": "Consultar Dirección",
  "catalogs.manage": "Preparar y modificar organizaciones/catálogos",
  "people.manage": "Administrar personas y acceso demostrativo",
  "data.export": "Exportar información autorizada",
  "portal.read": "Consultar Portal propio",
} as const
export type Capability = keyof typeof capabilityLabels
export const capabilityIds = Object.keys(capabilityLabels) as Capability[]
const operational: Capability[] = [
  "operations.read",
  "operations.write",
  "operations.review",
  "customs.values",
]
export function presetCapabilities(id: string): Capability[] {
  if (id === "client") return ["portal.read"]
  if (id === "direction")
    return capabilityIds.filter((item) => item !== "portal.read")
  if (id === "administration")
    return [
      "operations.read",
      "catalogs.manage",
      "costs.internal",
      "finance.billing",
      "finance.collections",
      "finance.treasury",
      "finance.expenses",
      "finance.prepare",
    ]
  return [
    ...operational,
    ...(id === "operations" ? ["catalogs.manage" as const] : []),
  ]
}
export function hasCapability(
  scenario: { id: string; capabilities?: readonly Capability[] },
  capability: Capability
) {
  return (scenario.capabilities ?? presetCapabilities(scenario.id)).includes(
    capability
  )
}
