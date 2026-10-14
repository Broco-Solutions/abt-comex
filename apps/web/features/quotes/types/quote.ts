export type QuoteCurrency = "ARS" | "USD"

export type QuoteLine = {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export type QuoteVersion = {
  number: number
  updatedOn: string
  service: string
  context: string
  currency: QuoteCurrency
  lines: QuoteLine[]
  conditions: string
  workflow: DemoQuoteWorkflow
}

export type DemoQuoteWorkflow = {
  internalApproval: "Pendiente" | "Aprobación simulada"
  send: "No enviado" | "Envío simulado"
  clientResponse: "Sin respuesta" | "Aceptación simulada" | "Rechazo simulado"
}

export type DemonstrationQuote = {
  id: string
  reference: string
  clientId: string
  responsible: string
  versions: QuoteVersion[]
}
