import { projectClients } from "@/features/organizations/data/organizations"
import type { DemonstrationOperation } from "@/features/operations/types/operation"

export const PORTAL_DEMO_CLIENT_ID = "client-demo-centro"

export type PortalOperation = Pick<
  DemonstrationOperation,
  "id" | "reference" | "kind" | "situation" | "updatedOn"
>

export type PortalContext =
  | {
      authorized: true
      client: { id: string; name: string }
      operations: PortalOperation[]
    }
  | { authorized: false }

export function getPortalContext(
  requestedClientId: string,
  operations: DemonstrationOperation[]
): PortalContext {
  if (requestedClientId !== PORTAL_DEMO_CLIENT_ID) {
    return { authorized: false }
  }

  const client = projectClients().find(
    (item) => item.id === PORTAL_DEMO_CLIENT_ID
  )
  if (!client) return { authorized: false }

  return {
    authorized: true,
    client: { id: client.id, name: client.name },
    operations: operations
      .filter((operation) => operation.clientId === PORTAL_DEMO_CLIENT_ID)
      .map(({ id, reference, kind, situation, updatedOn }) => ({
        id,
        reference,
        kind,
        situation,
        updatedOn,
      }))
      .sort((left, right) => right.updatedOn.localeCompare(left.updatedOn)),
  }
}

export function findPortalOperation(
  requestedClientId: string,
  operationId: string,
  operations: DemonstrationOperation[]
): PortalOperation | undefined {
  const context = getPortalContext(requestedClientId, operations)
  return context.authorized
    ? context.operations.find((operation) => operation.id === operationId)
    : undefined
}
