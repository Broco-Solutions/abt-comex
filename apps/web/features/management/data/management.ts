import type { DemonstrationClient } from "@/features/clients/types/client"
import type { DemonstrationOperation } from "@/features/operations/types/operation"
import type { WorkItem } from "@/features/work/types/work-item"

export type ManagementStatusGroup = {
  situation: DemonstrationOperation["situation"]
  count: number
  kind: DemonstrationOperation["kind"]
}

export type ManagementClientActivity = {
  client: DemonstrationClient
  operations: number
}

export type ManagementSnapshot = {
  operationCount: number
  importCount: number
  exportCount: number
  clientCount: number
  workCount: number
  overdueCount: number
  unassignedCount: number
  statusGroups: ManagementStatusGroup[]
  clientActivity: ManagementClientActivity[]
  workItems: WorkItem[]
}

export const managementSourceFamilies = [
  {
    id: "economia-operativa",
    title: "Facturación, cobranzas y cuentas corrientes",
    source: "Alpha2000 · no conectada",
    state: "Pendiente de disponibilidad y permisos",
    validationOwner: "Por definir con ABT",
  },
  {
    id: "costos-impuestos",
    title: "Costos, impuestos, compras y proveedores",
    source: "Alpha2000 · alcance por dato pendiente",
    state: "Definición, fórmula y sensibilidad pendientes",
    validationOwner: "Por definir con ABT",
  },
  {
    id: "tesoreria",
    title: "Bancos, movimientos, ECheqs y necesidades de fondos",
    source: "Interbanking · evaluación sólo lectura",
    state: "Disponibilidad no confirmada; no hay operaciones de escritura",
    validationOwner: "Por definir con ABT",
  },
  {
    id: "resultados",
    title: "Resultado mensual, márgenes y evolución económica",
    source: "2025ABT.xlsx · evidencia histórica, no fuente conectada",
    state: "Fórmula, período, moneda, fuente y permisos por validar",
    validationOwner: "Por definir con ABT",
  },
] as const

export function getManagementSnapshot(
  operations: DemonstrationOperation[],
  clients: DemonstrationClient[],
  workItems: WorkItem[]
): ManagementSnapshot {
  const groups = new Map<string, ManagementStatusGroup>()
  for (const operation of operations) {
    const key = `${operation.kind}:${operation.situation}`
    const current = groups.get(key)
    groups.set(key, {
      kind: operation.kind,
      situation: operation.situation,
      count: (current?.count ?? 0) + 1,
    })
  }

  return {
    operationCount: operations.length,
    importCount: operations.filter((item) => item.kind === "Importación")
      .length,
    exportCount: operations.filter((item) => item.kind === "Exportación")
      .length,
    clientCount: clients.length,
    workCount: workItems.length,
    overdueCount: workItems.filter((item) => item.timeBand === "Vencido")
      .length,
    unassignedCount: workItems.filter((item) => !item.owner).length,
    statusGroups: [...groups.values()].sort(
      (left, right) =>
        left.kind.localeCompare(right.kind, "es-AR") ||
        left.situation.localeCompare(right.situation, "es-AR")
    ),
    clientActivity: clients
      .map((client) => ({
        client,
        operations: operations.filter((item) => item.clientId === client.id)
          .length,
      }))
      .sort(
        (left, right) =>
          right.operations - left.operations ||
          left.client.name.localeCompare(right.client.name, "es-AR")
      ),
    workItems: [...workItems].sort((left, right) =>
      (left.dueDate ?? "9999-12-31").localeCompare(
        right.dueDate ?? "9999-12-31"
      )
    ),
  }
}
