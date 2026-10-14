import { getDemonstrationOperationProgress } from "@/features/operations/data/operation-progress"
import type { DemonstrationOperation } from "@/features/operations/types/operation"
import { visibleWorkItems } from "@/features/work/data/work-items"

export type AdministrationQueueStatus =
  | "Lista para facturar"
  | "Facturada"
  | "Con pendientes"

export type AdministrationQueueEntry =
  | {
      kind: "operation"
      id: string
      reference: string
      client: string
      operationKind: DemonstrationOperation["kind"]
      operationId: string
      billing: string
      collection: string
      fulfilled: string
      postShipment: string
      documentaryClose: string
    }
  | {
      kind: "work"
      id: string
      reference: string
      title: string
      detail: string
      status: AdministrationQueueStatus
    }

export function getAdministrationQueue(
  operations: DemonstrationOperation[]
): AdministrationQueueEntry[] {
  const operationEntries: AdministrationQueueEntry[] = operations.flatMap(
    (operation) => {
      const progress = getDemonstrationOperationProgress(operation.id)
      if (progress.billing === "Sin referencia") return []
      return [
        {
          kind: "operation" as const,
          id: `admin-${operation.id}`,
          reference: operation.reference,
          client: operation.client,
          operationKind: operation.kind,
          operationId: operation.id,
          billing: progress.billing,
          collection: progress.collection,
          fulfilled: progress.fulfilled,
          postShipment: progress.postShipment,
          documentaryClose: progress.documentaryClose,
        },
      ]
    }
  )

  const independentWork = visibleWorkItems()
    .filter((item) => item.id === "wrk-admin-no-operation-05")
    .map((item) => ({
      kind: "work" as const,
      id: item.id,
      reference: item.reference,
      title: item.title,
      detail: item.reason,
      status: "Con pendientes" as const,
    }))

  return [...operationEntries, ...independentWork]
}

export function filterAdministrationQueue(
  entries: AdministrationQueueEntry[],
  query: string,
  status: "" | AdministrationQueueStatus
) {
  const normalized = query.trim().toLocaleLowerCase("es-AR")
  return entries.filter((entry) => {
    const matchesQuery =
      !normalized ||
      `${entry.reference} ${entry.kind === "operation" ? `${entry.client} ${entry.operationKind}` : `${entry.title} ${entry.detail}`}`
        .toLocaleLowerCase("es-AR")
        .includes(normalized)
    const queueStatus =
      entry.kind === "work"
        ? entry.status
        : entry.billing === "Lista para facturar"
          ? "Lista para facturar"
          : "Facturada"
    return matchesQuery && (!status || queueStatus === status)
  })
}
