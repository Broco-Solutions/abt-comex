import { demonstrationOperations } from "@/features/operations/data/operations"
import { PORTAL_DEMO_CLIENT_ID } from "@/features/portal/data/portal"
import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"
export type DocumentRequirement = {
  id: string
  operationId: string
  requirement: string
  documentName?: string
  version?: number
  updatedOn?: string
  bundle: "Legajo aduanero" | "Originales al exterior"
  original: "Pendiente" | "Custodia registrada" | "Sin información"
  shared: boolean
}
export const documentRequirements: DocumentRequirement[] = [
  {
    id: "doc-2048-invoice",
    operationId: "op-demo-2048",
    requirement: "Factura comercial",
    documentName: "Factura comercial · copia de ejemplo",
    version: 1,
    bundle: "Legajo aduanero",
    original: "Sin información",
    shared: false,
  },
  {
    id: "doc-2048-packing",
    operationId: "op-demo-2048",
    requirement: "Lista de empaque",
    bundle: "Legajo aduanero",
    original: "Pendiente",
    shared: false,
  },
  {
    id: "doc-2054-transport",
    operationId: "op-demo-2054",
    requirement: "Documento de transporte",
    bundle: "Legajo aduanero",
    original: "Pendiente",
    shared: true,
  },
  {
    id: "doc-2054-invoice",
    operationId: "op-demo-2054",
    requirement: "Factura comercial",
    documentName: "Factura comercial · copia de ejemplo",
    version: 1,
    bundle: "Legajo aduanero",
    original: "Sin información",
    shared: true,
  },
  {
    id: "doc-3107-certificate",
    operationId: "op-demo-3107",
    requirement: "Certificado de origen",
    bundle: "Originales al exterior",
    original: "Pendiente",
    shared: false,
  },
  {
    id: "doc-3107-declaration",
    operationId: "op-demo-3107",
    requirement: "Referencia de permiso de embarque",
    documentName: "Referencia PE-DEM-1401",
    version: 1,
    bundle: "Legajo aduanero",
    original: "Sin información",
    shared: false,
  },
  {
    id: "doc-3112-instruction",
    operationId: "op-demo-3112",
    requirement: "Instrucción del cliente",
    documentName: "Instrucción · copia de ejemplo",
    version: 1,
    bundle: "Legajo aduanero",
    original: "Sin información",
    shared: true,
  },
  {
    id: "doc-3112-original",
    operationId: "op-demo-3112",
    requirement: "Original para envío al exterior",
    bundle: "Originales al exterior",
    original: "Pendiente",
    shared: true,
  },
  {
    id: "doc-3133-certificate",
    operationId: "op-demo-3133",
    requirement: "Certificado de origen",
    documentName: "Certificado · copia de ejemplo",
    version: 1,
    bundle: "Originales al exterior",
    original: "Custodia registrada",
    shared: false,
  },
]
const key = "abt-comex:demo:documents:v1"
let memory: string[] = []
export function loadReceivedDocuments() {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(key) ?? "[]")
    return Array.isArray(parsed)
      ? parsed.filter(
          (id): id is string =>
            typeof id === "string" &&
            documentRequirements.some((d) => d.id === id)
        )
      : []
  } catch {
    return memory
  }
}
export function saveReceivedDocuments(ids: string[]) {
  memory = ids
  try {
    sessionStorage.setItem(key, JSON.stringify(ids))
  } catch {
    /* state remains local */
  }
  window.dispatchEvent(new Event("abt:demo-change"))
}
export function projectDocuments(
  operationId: string,
  received: string[],
  external = false,
  requirements: DocumentRequirement[] = documentRequirements
) {
  const ownsOperation = demonstrationOperations.some(
    (op) => op.id === operationId && op.clientId === PORTAL_DEMO_CLIENT_ID
  )
  return requirements
    .filter(
      (d) =>
        d.operationId === operationId &&
        (!external || (d.shared && ownsOperation))
    )
    .map((d) => ({
      id: d.id,
      requirement: d.requirement,
      bundle: d.bundle,
      documentName:
        d.documentName ??
        (received.includes(d.id)
          ? d.requirement + " · copia local"
          : undefined),
      version: d.version ?? (received.includes(d.id) ? 1 : undefined),
      ...(external ? {} : { original: d.original }),
      updatedOn: d.updatedOn ?? DEMONSTRATION_DATE,
    }))
}
