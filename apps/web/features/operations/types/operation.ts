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
  modality: "Marítima" | "Aérea" | "Terrestre"
  situation: OperationSituation
  updatedOn: string
  alert: "Bloqueo" | "Vencimiento" | "Sin alerta"
  nextAction: string
}
