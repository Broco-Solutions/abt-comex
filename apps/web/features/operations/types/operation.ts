export type OperationKind = "Importación" | "Exportación"

export type OperationSituation =
  | "Pre-embarque"
  | "En seguimiento"
  | "Requiere atención"
  | "Pendiente documental"
  | "Lista para revisión"

export type DemonstrationOperation = {
  id: string
  reference: string
  kind: OperationKind
  clientId: string
  client: string
  responsible: string
  /** Legacy synthetic team context, projected separately from an individual. */
  responsibleReference?: string
  modality: "Marítima" | "Aérea" | "Terrestre"
  situation: OperationSituation
  updatedOn: string
  /** Explicit synthetic opening event; never inferred from last update. */
  openedOn?: string
  responsibleId?: string
  participantIds?: string[]
  handoff?: {
    status:
      | "En revisión administrativa"
      | "Recibida para revisión"
      | "Devuelta con observaciones"
    note: string
    history: { status: string; note: string; on: string; context: string }[]
  }
  alert: "Bloqueo" | "Vencimiento" | "Sin alerta"
  nextAction: string
  initialContext?: string
  origin?:
    | { type: "direct" }
    | {
        type: "accepted-quote"
        quoteId: string
        quoteReference: string
        quoteVersion: number
      }
}

export type DemonstrationOperationProgress = {
  operationId: string
  billing: "Lista para facturar" | "Facturada" | "Sin referencia"
  collection: "Sin referencia" | "Registrada en fixture"
  fulfilled: "Pendiente" | "Registrado en fixture"
  postShipment: "Pendiente" | "En seguimiento"
  documentaryClose: "Pendiente" | "En seguimiento"
  customsFile: "Referencias sintéticas" | "Sin detalle disponible"
  physicalOriginals: "Sin estado disponible" | "Escenario de custodia"
  digitalCopy: "Sin estado disponible" | "Referencia sintética disponible"
}
