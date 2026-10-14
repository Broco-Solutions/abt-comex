import type { DemonstrationOperationProgress } from "../types/operation"

// Shared synthetic lifecycle so Exportación and Administración present the
// same fixture without creating separate sources for business states.
export const demonstrationOperationProgress: DemonstrationOperationProgress[] =
  [
    {
      operationId: "op-demo-3107",
      billing: "Facturada",
      collection: "Sin referencia",
      fulfilled: "Pendiente",
      postShipment: "Pendiente",
      documentaryClose: "Pendiente",
      customsFile: "Referencias sintéticas",
      physicalOriginals: "Escenario de custodia",
      digitalCopy: "Referencia sintética disponible",
    },
    {
      operationId: "op-demo-3112",
      billing: "Lista para facturar",
      collection: "Sin referencia",
      fulfilled: "Pendiente",
      postShipment: "Pendiente",
      documentaryClose: "Pendiente",
      customsFile: "Sin detalle disponible",
      physicalOriginals: "Sin estado disponible",
      digitalCopy: "Sin estado disponible",
    },
    {
      operationId: "op-demo-3120",
      billing: "Sin referencia",
      collection: "Sin referencia",
      fulfilled: "Pendiente",
      postShipment: "Pendiente",
      documentaryClose: "Pendiente",
      customsFile: "Sin detalle disponible",
      physicalOriginals: "Sin estado disponible",
      digitalCopy: "Sin estado disponible",
    },
    {
      operationId: "op-demo-3133",
      billing: "Facturada",
      collection: "Registrada en fixture",
      fulfilled: "Registrado en fixture",
      postShipment: "En seguimiento",
      documentaryClose: "En seguimiento",
      customsFile: "Referencias sintéticas",
      physicalOriginals: "Escenario de custodia",
      digitalCopy: "Referencia sintética disponible",
    },
  ]

export function getDemonstrationOperationProgress(operationId: string) {
  return (
    demonstrationOperationProgress.find(
      (item) => item.operationId === operationId
    ) ?? {
      operationId,
      billing: "Sin referencia" as const,
      collection: "Sin referencia" as const,
      fulfilled: "Pendiente" as const,
      postShipment: "Pendiente" as const,
      documentaryClose: "Pendiente" as const,
      customsFile: "Sin detalle disponible" as const,
      physicalOriginals: "Sin estado disponible" as const,
      digitalCopy: "Sin estado disponible" as const,
    }
  )
}
