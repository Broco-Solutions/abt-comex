import {
  financialRecords,
  isFinancialDate,
  type Currency,
  type FinancialRecord,
} from "@/features/finance/data/financial-records"
import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"
import { loadOrganizations } from "@/features/organizations/data/organizations"
import type {
  AdministrativeLedger,
  LocalMovement,
} from "./administrative-ledger"

export type Voucher = {
  id: string
  reference: string
  kind: "Factura" | "Nota de crédito" | "Otro comprobante"
  side: "Cobrar" | "Pagar"
  partyId: string
  issuedOn: string
  dueOn: string
  currency: Currency
  amount: number
  concept: string
  operationIds: string[]
  stage: "Preparado" | "Referencia de evaluación"
  externalReference: string
  historyComplete: boolean
  reportedBalance?: number
  reportedOn?: string
}
export type VoucherApplication = {
  id: string
  voucherId: string
  origin: "movement" | "credit"
  originId: string
  amount: number
  date: string
  local: boolean
}
export type VoucherState = {
  documents: Voucher[]
  applications: VoucherApplication[]
  activity: { entityId: string; description: string; on: string }[]
}
const toCents = (value: number) => Math.round(value * 100)
const validMoney = (value: number) =>
  Number.isFinite(value) &&
  value > 0 &&
  Number.isSafeInteger(toCents(value)) &&
  Math.abs(value * 100 - toCents(value)) < 0.000001
/** Synthetic settlement references explain the initial balances; never provider evidence. */
export const supplementalMovements: LocalMovement[] = []
const documents: Voucher[] = financialRecords
  .filter((record) => record.type === "invoice")
  .map((record) => ({
    id: record.id,
    reference: record.reference,
    kind: "Factura",
    side: "Cobrar",
    partyId: record.clientId,
    issuedOn: record.date,
    dueOn: record.dueDate ?? "",
    currency: record.currency,
    amount: record.amount,
    concept: "Servicios de comercio exterior · referencia de evaluación",
    operationIds: record.operationId ? [record.operationId] : [],
    stage: "Referencia de evaluación",
    externalReference: "",
    historyComplete: record.openBalance !== undefined,
    reportedBalance: record.openBalance,
    reportedOn:
      record.openBalance === undefined ? undefined : DEMONSTRATION_DATE,
  }))
const applications: VoucherApplication[] = []
for (const document of documents) {
  if (document.reportedBalance === undefined) continue
  let remaining = toCents(document.amount) - toCents(document.reportedBalance)
  const receipt = financialRecords.find(
    (record) =>
      record.type === "receipt" &&
      record.id === document.id.replace("invoice", "receipt")
  )
  if (receipt && remaining > 0) {
    const applied = Math.min(remaining, toCents(receipt.amount))
    applications.push({
      id: "application-" + receipt.id,
      voucherId: document.id,
      origin: "movement",
      originId: receipt.id,
      amount: applied / 100,
      date: receipt.date,
      local: false,
    })
    remaining -= applied
  }
  if (remaining > 0) {
    const id = "settlement-" + document.id
    const date = document.issuedOn.slice(0, 8) + "20"
    supplementalMovements.push({
      id,
      reference: "COB-COMP-" + document.reference,
      date,
      nature: "Cobro",
      partyId: document.partyId,
      memberId: "",
      currency: document.currency,
      amount: remaining / 100,
      categoryId: "category-demo-income",
      operationIds: document.operationIds,
      evidence: "Referencia sintética complementaria",
      notes:
        "Completa el historial del escenario, no es información recibida de un sistema externo.",
      source: "Referencia del escenario",
      externalReference: "",
    })
    applications.push({
      id: "application-" + id,
      voucherId: document.id,
      origin: "movement",
      originId: id,
      amount: remaining / 100,
      date,
      local: false,
    })
  }
}
documents.push(
  {
    id: "purchase-demo-01",
    reference: "COMP-EVAL-001",
    kind: "Factura",
    side: "Pagar",
    partyId: "org-demo-001",
    issuedOn: "2026-08-20",
    dueOn: "2026-09-05",
    currency: "ARS",
    amount: 50000,
    concept: "Servicio contratado por ABT",
    operationIds: ["op-demo-3107"],
    stage: "Referencia de evaluación",
    externalReference: "",
    historyComplete: true,
    reportedBalance: 30000,
    reportedOn: DEMONSTRATION_DATE,
  },
  {
    id: "purchase-demo-02",
    reference: "COMP-EVAL-002",
    kind: "Factura",
    side: "Pagar",
    partyId: "org-demo-002",
    issuedOn: "2026-10-08",
    dueOn: "2026-10-20",
    currency: "USD",
    amount: 250,
    concept: "Insumos generales",
    operationIds: [],
    stage: "Referencia de evaluación",
    externalReference: "",
    historyComplete: true,
    reportedBalance: 250,
    reportedOn: DEMONSTRATION_DATE,
  },
  {
    id: "credit-demo-01",
    reference: "NC-EVAL-001",
    kind: "Nota de crédito",
    side: "Cobrar",
    partyId: "client-demo-norte",
    issuedOn: "2026-10-10",
    dueOn: "",
    currency: "ARS",
    amount: 3000,
    concept: "Crédito sintético pendiente de aplicación",
    operationIds: [],
    stage: "Referencia de evaluación",
    externalReference: "",
    historyComplete: true,
  },
  {
    id: "credit-demo-02",
    reference: "NC-EVAL-002",
    kind: "Nota de crédito",
    side: "Pagar",
    partyId: "org-demo-001",
    issuedOn: "2026-10-10",
    dueOn: "",
    currency: "ARS",
    amount: 2500,
    concept: "Crédito sintético de proveedor",
    operationIds: [],
    stage: "Referencia de evaluación",
    externalReference: "",
    historyComplete: true,
  }
)
supplementalMovements.push({
  id: "payment-demo-01",
  reference: "PAG-EVAL-001",
  date: "2026-09-05",
  nature: "Pago",
  partyId: "org-demo-001",
  memberId: "",
  currency: "ARS",
  amount: 20000,
  categoryId: "category-demo-outflow",
  operationIds: ["op-demo-3107"],
  evidence: "Referencia sintética de pago informado",
  notes: "No ejecuta una transferencia.",
  source: "Referencia del escenario",
  externalReference: "",
})
applications.push({
  id: "application-payment-01",
  voucherId: "purchase-demo-01",
  origin: "movement",
  originId: "payment-demo-01",
  amount: 20000,
  date: "2026-09-05",
  local: false,
})
export const initialVoucherState: VoucherState = {
  documents,
  applications,
  activity: [],
}
const storageKey = "abt-comex:demo:vouchers:v1"
let memory = initialVoucherState
export function loadVouchers(): VoucherState {
  if (typeof window === "undefined") return initialVoucherState
  try {
    const raw = sessionStorage.getItem(storageKey)
    if (!raw) return memory
    const value = JSON.parse(raw) as VoucherState
    if (
      !Array.isArray(value.documents) ||
      !Array.isArray(value.applications) ||
      !Array.isArray(value.activity) ||
      !value.documents.every(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.reference === "string" &&
          typeof item.partyId === "string" &&
          typeof item.concept === "string" &&
          typeof item.externalReference === "string" &&
          typeof item.historyComplete === "boolean" &&
          ["Factura", "Nota de crédito", "Otro comprobante"].includes(
            item.kind
          ) &&
          ["Cobrar", "Pagar"].includes(item.side) &&
          ["Preparado", "Referencia de evaluación"].includes(item.stage) &&
          ["ARS", "USD"].includes(item.currency) &&
          validMoney(item.amount) &&
          isFinancialDate(item.issuedOn) &&
          (!item.dueOn || isFinancialDate(item.dueOn)) &&
          Array.isArray(item.operationIds) &&
          item.operationIds.every((id) => typeof id === "string")
      ) ||
      !value.applications.every(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.voucherId === "string" &&
          typeof item.originId === "string" &&
          ["movement", "credit"].includes(item.origin) &&
          validMoney(item.amount) &&
          isFinancialDate(item.date) &&
          typeof item.local === "boolean"
      ) ||
      new Set(value.documents.map((item) => item.id)).size !==
        value.documents.length ||
      new Set(value.applications.map((item) => item.id)).size !==
        value.applications.length
    )
      return initialVoucherState
    return value
  } catch {
    return memory
  }
}
export function saveVouchers(state: VoucherState) {
  memory = state
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(state))
  } catch {
    /* Memory fallback. */
  }
  window.dispatchEvent(new Event("abt:demo-change"))
}
export function voucherBalance(
  document: Voucher,
  state: VoucherState,
  cut = DEMONSTRATION_DATE
): number | undefined {
  if (
    !document.historyComplete ||
    document.stage !== "Referencia de evaluación" ||
    document.issuedOn > cut ||
    document.kind === "Nota de crédito"
  )
    return undefined
  return (
    (toCents(document.amount) -
      state.applications
        .filter((item) => item.voucherId === document.id && item.date <= cut)
        .reduce((sum, item) => sum + toCents(item.amount), 0)) /
    100
  )
}
export function originAvailable(
  origin: VoucherApplication["origin"],
  id: string,
  state: VoucherState,
  ledger: AdministrativeLedger
) {
  const item =
    origin === "credit"
      ? state.documents.find(
          (item) =>
            item.id === id &&
            item.kind === "Nota de crédito" &&
            item.stage === "Referencia de evaluación"
        )
      : ledger.movements.find(
          (item) => item.id === id && ["Cobro", "Pago"].includes(item.nature)
        )
  if (!item) return 0
  return (
    (toCents(item.amount) -
      state.applications
        .filter((app) => app.origin === origin && app.originId === id)
        .reduce((sum, app) => sum + toCents(app.amount), 0)) /
    100
  )
}
export function validateApplication(
  app: VoucherApplication,
  state: VoucherState,
  ledger: AdministrativeLedger
) {
  const document = state.documents.find((item) => item.id === app.voucherId)
  if (
    !document ||
    !document.historyComplete ||
    document.kind === "Nota de crédito" ||
    document.stage !== "Referencia de evaluación"
  )
    return "El comprobante no tiene un saldo de escenario disponible para aplicar."
  const origin =
    app.origin === "credit"
      ? state.documents.find(
          (item) =>
            item.id === app.originId &&
            item.kind === "Nota de crédito" &&
            item.stage === "Referencia de evaluación"
        )
      : ledger.movements.find(
          (item) =>
            item.id === app.originId &&
            item.nature === (document.side === "Cobrar" ? "Cobro" : "Pago")
        )
  if (
    !origin ||
    origin.currency !== document.currency ||
    origin.partyId !== document.partyId ||
    ("side" in origin && origin.side !== document.side)
  )
    return "La referencia debe corresponder a la misma contraparte, moneda y cartera."
  const originDate = "issuedOn" in origin ? origin.issuedOn : origin.date
  if (
    !isFinancialDate(app.date) ||
    app.date < document.issuedOn ||
    app.date < originDate ||
    app.date > DEMONSTRATION_DATE
  )
    return "La aplicación debe ser posterior a sus dos registros y no superar el corte del escenario."
  if (
    !validMoney(app.amount) ||
    toCents(app.amount) >
      toCents(originAvailable(app.origin, app.originId, state, ledger)) ||
    toCents(app.amount) > toCents(voucherBalance(document, state) ?? 0)
  )
    return "El importe supera el saldo del comprobante o la referencia disponible."
  return ""
}
export function validateVoucher(document: Voucher, state: VoucherState) {
  if (!document.reference.trim() || !document.concept.trim())
    return "Completá referencia y concepto."
  if (
    !isFinancialDate(document.issuedOn) ||
    document.issuedOn > DEMONSTRATION_DATE ||
    (document.dueOn &&
      (!isFinancialDate(document.dueOn) || document.dueOn < document.issuedOn))
  )
    return "Revisá emisión y vencimiento."
  if (!validMoney(document.amount))
    return "Ingresá un importe positivo con hasta dos decimales."
  if (
    state.documents.some(
      (item) =>
        item.id !== document.id &&
        item.side === document.side &&
        item.partyId === document.partyId &&
        item.reference.trim().toLowerCase() ===
          document.reference.trim().toLowerCase()
    )
  )
    return "Ya existe esa referencia para la contraparte. Abrí el registro existente."
  const previous = state.documents.find((item) => item.id === document.id)
  if (
    !loadOrganizations().some(
      (item) =>
        item.id === document.partyId &&
        item.roles.some(
          (role) =>
            role.role ===
              (document.side === "Cobrar" ? "client" : "abt-supplier") &&
            (role.active || previous?.partyId === item.id)
        )
    )
  )
    return "Elegí un cliente de ABT o proveedor contratado por ABT, según la cartera."
  if (
    state.applications.some(
      (item) =>
        item.voucherId === document.id ||
        (item.origin === "credit" && item.originId === document.id)
    ) &&
    previous &&
    (document.amount !== previous.amount ||
      document.currency !== previous.currency ||
      document.partyId !== previous.partyId ||
      document.side !== previous.side ||
      document.kind !== previous.kind ||
      document.issuedOn !== previous.issuedOn ||
      document.stage !== previous.stage)
  )
    return "El comprobante tiene aplicaciones. Conservá importe, moneda, contraparte, fecha, tipo y situación; revisá las relaciones antes de modificarlos."
  return ""
}
export function portfolio(
  state: VoucherState,
  side: Voucher["side"],
  cut: string,
  currency: Currency,
  partyId = ""
) {
  if (!isFinancialDate(cut) || cut > DEMONSTRATION_DATE) return []
  return state.documents
    .filter(
      (item) =>
        item.side === side &&
        item.currency === currency &&
        (!partyId || item.partyId === partyId) &&
        item.kind !== "Nota de crédito" &&
        item.stage === "Referencia de evaluación" &&
        item.issuedOn <= cut
    )
    .map((document) => ({
      document,
      balance: voucherBalance(document, state, cut),
    }))
    .filter((item) => item.balance === undefined || item.balance > 0)
}
export function voucherFinancialRecords(
  state: VoucherState
): FinancialRecord[] {
  return state.documents
    .filter(
      (item) =>
        item.side === "Cobrar" &&
        item.kind === "Factura" &&
        item.stage === "Referencia de evaluación"
    )
    .map((item) => ({
      id: item.id,
      reference: item.reference,
      type: "invoice",
      clientId: item.partyId,
      partyId: item.partyId,
      date: item.issuedOn,
      currency: item.currency,
      amount: item.amount,
      dueDate: item.dueOn || undefined,
      openBalance: voucherBalance(item, state),
      operationId: item.operationIds[0],
      operationIds: item.operationIds,
      source: "Referencia del escenario",
    }))
}
