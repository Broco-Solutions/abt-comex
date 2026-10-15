import { DEMONSTRATION_DATE } from "@/features/demo/data/scenarios"
import {
  financialRecords,
  isFinancialDate,
  type Currency,
  type FinancialRecord,
} from "@/features/finance/data/financial-records"
import { loadOrganizations } from "@/features/organizations/data/organizations"
import { loadDemoOperations } from "@/features/operations/data/operations"
import {
  supplementalMovements,
  loadVouchers,
  voucherFinancialRecords,
  type VoucherState,
} from "./vouchers"

export type AdministrativeCategory = {
  id: string
  name: string
  scope: "Gasto" | "Ingreso" | "Egreso" | "Compartida"
  active: boolean
}
export type LocalExpense = {
  id: string
  reference: string
  date: string
  description: string
  categoryId: string
  categoryAtEntry: string
  currency: Currency
  amount: number
  partyId: string
  clientId?: string
  operationIds: string[]
  evidence: string
  notes: string
  source: "Preparación local" | "Referencia del escenario"
  externalReference: string
}
export const movementNatures = [
  "Cobro",
  "Pago",
  "Anticipo recibido",
  "Anticipo entregado",
  "Devolución de anticipo",
  "Otro ingreso",
  "Otro egreso",
] as const
export type MovementNature = (typeof movementNatures)[number]
export type LocalMovement = {
  id: string
  reference: string
  date: string
  nature: MovementNature
  partyId: string
  memberId: string
  currency: Currency
  amount: number
  categoryId: string
  operationIds: string[]
  evidence: string
  notes: string
  source: "Preparación local" | "Referencia del escenario"
  externalReference: string
}
export type LocalRendition = {
  id: string
  reference: string
  advanceId: string
  advanceAmount: number
  expenseIds: string[]
  refundId: string
  refundAmount: number
  notes: string
}
export type AdministrativeLedger = {
  categories: AdministrativeCategory[]
  expenses: LocalExpense[]
  movements: LocalMovement[]
  renditions: LocalRendition[]
  activity: { on: string; entityId: string; description: string }[]
}
export const initialAdministrativeLedger: AdministrativeLedger = {
  categories: [
    {
      id: "category-demo-coordination",
      name: "Coordinación operativa",
      scope: "Gasto",
      active: true,
    },
    {
      id: "category-demo-documentation",
      name: "Documentación",
      scope: "Gasto",
      active: true,
    },
    {
      id: "category-demo-general",
      name: "Gastos generales",
      scope: "Gasto",
      active: true,
    },
    {
      id: "category-demo-income",
      name: "Ingresos sin clasificación definitiva",
      scope: "Ingreso",
      active: true,
    },
    {
      id: "category-demo-outflow",
      name: "Egresos sin clasificación definitiva",
      scope: "Egreso",
      active: true,
    },
  ],
  expenses: [
    ...financialRecords
      .filter((record) => record.type === "expense")
      .map((record) => ({
        id: record.id,
        reference: record.reference,
        date: record.date,
        description: record.category ?? "Gasto de referencia",
        categoryId:
          record.category === "Documentación"
            ? "category-demo-documentation"
            : "category-demo-coordination",
        categoryAtEntry: record.category ?? "Sin clasificación",
        currency: record.currency,
        amount: record.amount,
        partyId: "org-demo-001",
        clientId: record.clientId,
        operationIds: record.operationId ? [record.operationId] : [],
        evidence: "Referencia de comprobante de evaluación",
        notes: "",
        source: "Referencia del escenario" as const,
        externalReference: "",
      })),
    {
      id: "expense-demo-general-01",
      reference: "GAS-LOCAL-001",
      date: "2026-10-12",
      description: "Insumos de oficina",
      categoryId: "category-demo-general",
      categoryAtEntry: "Gastos generales",
      currency: "ARS",
      amount: 5000,
      partyId: "org-demo-002",
      operationIds: [],
      evidence: "",
      notes: "Comprobante pendiente de completar",
      source: "Preparación local",
      externalReference: "",
    },
  ],
  movements: [
    ...supplementalMovements,
    ...financialRecords
      .filter((record) => record.type === "receipt")
      .map((record) => ({
        id: record.id,
        reference: record.reference,
        date: record.date,
        nature: "Cobro" as const,
        partyId: record.clientId,
        memberId: "",
        currency: record.currency,
        amount: record.amount,
        categoryId: "category-demo-income",
        operationIds: record.operationId ? [record.operationId] : [],
        evidence: "Referencia de recibo de evaluación",
        notes: "",
        source: "Referencia del escenario" as const,
        externalReference: "",
      })),
    {
      id: "movement-demo-advance-01",
      reference: "ANT-LOCAL-001",
      date: "2026-10-11",
      nature: "Anticipo entregado",
      partyId: "",
      memberId: "",
      currency: "ARS",
      amount: 15000,
      categoryId: "category-demo-outflow",
      operationIds: [],
      evidence: "Referencia interna de anticipo",
      notes: "Referencia demostrativa sin asignación individual confirmada.",
      source: "Preparación local",
      externalReference: "",
    },
  ],
  renditions: [
    {
      id: "rendition-demo-014",
      reference: "REN-DEM-014",
      advanceId: "movement-demo-advance-01",
      advanceAmount: 15000,
      expenseIds: ["expense-demo-general-01"],
      refundId: "",
      refundAmount: 0,
      notes: "Completar evidencia del gasto general.",
    },
  ],
  activity: [],
}
const key = "abt-comex:demo:administration:v1"
let memory = initialAdministrativeLedger
export const movementDirection = (nature: MovementNature) =>
  [
    "Cobro",
    "Anticipo recibido",
    "Devolución de anticipo",
    "Otro ingreso",
  ].includes(nature)
    ? "Ingreso"
    : "Egreso"
export const cents = (amount: number) => Math.round(amount * 100)
export const sumAmounts = (amounts: number[]) =>
  amounts.reduce((sum, value) => sum + cents(value), 0) / 100
export const validAmount = (amount: number) =>
  Number.isSafeInteger(cents(amount)) &&
  Number.isFinite(amount) &&
  amount > 0 &&
  Math.abs(amount * 100 - cents(amount)) < 0.000001
export function loadAdministrativeLedger(): AdministrativeLedger {
  if (typeof window === "undefined") return initialAdministrativeLedger
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return memory
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== "object") return initialAdministrativeLedger
    const state = value as AdministrativeLedger
    if (
      !Array.isArray(state.categories) ||
      !state.categories.every(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          typeof item.active === "boolean" &&
          ["Gasto", "Ingreso", "Egreso", "Compartida"].includes(item.scope)
      ) ||
      !Array.isArray(state.expenses) ||
      !state.expenses.every(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.reference === "string" &&
          isFinancialDate(item.date) &&
          validAmount(item.amount) &&
          ["ARS", "USD"].includes(item.currency) &&
          Array.isArray(item.operationIds) &&
          item.operationIds.every((id) => typeof id === "string") &&
          [
            item.description,
            item.partyId,
            item.categoryId,
            item.categoryAtEntry,
            item.evidence,
            item.notes,
            item.externalReference,
          ].every((field) => typeof field === "string")
      ) ||
      !Array.isArray(state.movements) ||
      !state.movements.every(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.reference === "string" &&
          isFinancialDate(item.date) &&
          validAmount(item.amount) &&
          movementNatures.includes(item.nature) &&
          ["ARS", "USD"].includes(item.currency) &&
          Array.isArray(item.operationIds) &&
          item.operationIds.every((id) => typeof id === "string") &&
          [
            item.partyId,
            item.memberId,
            item.categoryId,
            item.evidence,
            item.notes,
            item.externalReference,
          ].every((field) => typeof field === "string")
      ) ||
      !Array.isArray(state.renditions) ||
      !state.renditions.every(
        (item) =>
          item &&
          [
            item.id,
            item.reference,
            item.advanceId,
            item.refundId,
            item.notes,
          ].every((field) => typeof field === "string") &&
          Array.isArray(item.expenseIds) &&
          item.expenseIds.every((id) => typeof id === "string") &&
          Number.isFinite(item.advanceAmount) &&
          Number.isFinite(item.refundAmount)
      ) ||
      !Array.isArray(state.activity) ||
      !state.activity.every(
        (item) =>
          item &&
          [item.on, item.entityId, item.description].every(
            (field) => typeof field === "string"
          )
      )
    )
      return initialAdministrativeLedger
    for (const rows of [
      state.categories,
      state.expenses,
      state.movements,
      state.renditions,
    ])
      if (new Set(rows.map((item) => item.id)).size !== rows.length)
        return initialAdministrativeLedger
    return state
  } catch {
    return memory
  }
}
export function saveAdministrativeLedger(state: AdministrativeLedger) {
  memory = state
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(key, JSON.stringify(state))
  } catch {
    /* Keep local memory if storage is unavailable. */
  }
  window.dispatchEvent(new Event("abt:demo-change"))
}
export function nextAdministrativeId(prefix: string, ids: string[]) {
  let index = 1
  while (ids.includes(prefix + index)) index++
  return prefix + index
}
export function nextAdministrativeReference(
  prefix: string,
  references: string[]
) {
  let index = 1
  while (references.includes(prefix + index.toString().padStart(3, "0")))
    index++
  return prefix + index.toString().padStart(3, "0")
}
export function categoryOptions(
  state: AdministrativeLedger,
  scope: AdministrativeCategory["scope"],
  currentId = ""
) {
  return state.categories.filter(
    (item) =>
      (item.active || item.id === currentId) &&
      (item.scope === scope || item.scope === "Compartida")
  )
}
export function validateExpense(
  expense: LocalExpense,
  state: AdministrativeLedger
) {
  if (!expense.description.trim()) return "Completá el concepto del gasto."
  if (!isFinancialDate(expense.date) || expense.date > DEMONSTRATION_DATE)
    return "Elegí una fecha de registro válida hasta el corte del escenario."
  if (!validAmount(expense.amount))
    return "Ingresá un importe positivo, con hasta dos decimales."
  const previous = state.expenses.find((item) => item.id === expense.id)
  if (
    expense.operationIds.some(
      (id) => !loadDemoOperations().some((item) => item.id === id)
    )
  )
    return "Revisá las operaciones relacionadas; una referencia ya no está disponible."
  if (
    previous &&
    previous.currency !== expense.currency &&
    state.renditions.some((item) => item.expenseIds.includes(expense.id))
  )
    return "El gasto tiene una rendición relacionada. Revisá esa relación antes de cambiar de moneda."
  if (
    !categoryOptions(state, "Gasto", previous?.categoryId).some(
      (item) => item.id === expense.categoryId
    )
  )
    return "Elegí una categoría de gasto activa."
  if (
    expense.partyId &&
    !loadOrganizations().some(
      (item) =>
        item.id === expense.partyId &&
        item.roles.some(
          (role) =>
            role.role === "abt-supplier" &&
            (role.active || previous?.partyId === expense.partyId)
        )
    )
  )
    return "Elegí un proveedor contratado por ABT; una contraparte operativa no genera obligaciones de ABT."
  return ""
}
export function validateMovement(
  movement: LocalMovement,
  state: AdministrativeLedger
) {
  if (!isFinancialDate(movement.date) || movement.date > DEMONSTRATION_DATE)
    return "Elegí una fecha válida hasta el corte del escenario."
  if (!validAmount(movement.amount))
    return "Ingresá un importe positivo, con hasta dos decimales."
  if (!movementNatures.includes(movement.nature))
    return "Elegí la naturaleza del movimiento."
  const previous = state.movements.find((item) => item.id === movement.id)
  const applications = loadVouchers().applications.filter(
    (item) => item.origin === "movement" && item.originId === movement.id
  )
  if (
    applications.length &&
    previous &&
    (movement.currency !== previous.currency ||
      movement.partyId !== previous.partyId ||
      movement.nature !== previous.nature ||
      movement.date !== previous.date ||
      cents(movement.amount) <
        cents(sumAmounts(applications.map((item) => item.amount))))
  )
    return "El movimiento tiene aplicaciones. Conservá moneda, contraparte, naturaleza y fecha; el importe no puede ser menor al aplicado."
  if (
    movement.operationIds.some(
      (id) => !loadDemoOperations().some((item) => item.id === id)
    )
  )
    return "Revisá las operaciones relacionadas; una referencia ya no está disponible."
  const advanceUses = state.renditions.filter(
    (item) => item.advanceId === movement.id
  )
  const refundUses = state.renditions.filter(
    (item) => item.refundId === movement.id
  )
  if (
    advanceUses.length &&
    (movement.nature !== "Anticipo entregado" ||
      movement.currency !== previous?.currency ||
      cents(sumAmounts(advanceUses.map((item) => item.advanceAmount))) >
        cents(movement.amount))
  )
    return "El anticipo ya tiene importes aplicados a rendiciones. Revisá sus relaciones antes de modificar naturaleza, moneda o importe."
  if (
    refundUses.length &&
    (movement.nature !== "Devolución de anticipo" ||
      movement.currency !== previous?.currency ||
      cents(sumAmounts(refundUses.map((item) => item.refundAmount))) >
        cents(movement.amount))
  )
    return "La devolución ya tiene importes aplicados. Revisá las rendiciones relacionadas."
  if (
    !categoryOptions(
      state,
      movementDirection(movement.nature),
      previous?.categoryId
    ).some((item) => item.id === movement.categoryId)
  )
    return "Elegí una categoría activa para este movimiento."
  if (movement.nature === "Cobro" && !movement.partyId)
    return "Relacioná el cobro con un cliente de ABT; para un ingreso sin aplicación usá Otro ingreso."
  if (movement.partyId) {
    const role = ["Cobro", "Anticipo recibido"].includes(movement.nature)
      ? "client"
      : "abt-supplier"
    if (
      !loadOrganizations().some(
        (item) =>
          item.id === movement.partyId &&
          item.roles.some(
            (entry) =>
              entry.role === role &&
              (entry.active || previous?.partyId === movement.partyId)
          )
      )
    )
      return "La organización no tiene el rol administrativo requerido. No se usa una contraparte operativa como proveedor de ABT."
  }
  return ""
}
export function renditionSummary(
  record: LocalRendition,
  state: AdministrativeLedger
) {
  const advance = state.movements.find((item) => item.id === record.advanceId)
  const expenses = state.expenses.filter((item) =>
    record.expenseIds.includes(item.id)
  )
  const expenseAmount = sumAmounts(expenses.map((item) => item.amount))
  const missing = expenses.filter((item) => !item.evidence.trim()).length
  return {
    advance,
    expenses,
    expenseAmount,
    missing,
    difference:
      (cents(record.advanceAmount) -
        cents(expenseAmount) -
        cents(record.refundAmount)) /
      100,
    status: !expenses.length
      ? "Sin gastos relacionados"
      : missing
        ? "Con evidencias pendientes"
        : "Preparada para revisión",
  }
}
export function validateRendition(
  record: LocalRendition,
  state: AdministrativeLedger
) {
  const advance = state.movements.find(
    (item) =>
      item.id === record.advanceId && item.nature === "Anticipo entregado"
  )
  if (!advance) return "Elegí un anticipo entregado."
  const used = sumAmounts(
    state.renditions
      .filter((item) => item.id !== record.id && item.advanceId === advance.id)
      .map((item) => item.advanceAmount)
  )
  if (
    !validAmount(record.advanceAmount) ||
    cents(record.advanceAmount) + cents(used) > cents(advance.amount)
  )
    return "El importe aplicado supera el anticipo disponible para rendir."
  if (
    record.expenseIds.some(
      (id) =>
        !state.expenses.some(
          (item) => item.id === id && item.currency === advance.currency
        )
    )
  )
    return "Los gastos deben existir y tener la moneda del anticipo; no se realiza conversión."
  if (
    new Set(record.expenseIds).size !== record.expenseIds.length ||
    state.renditions.some(
      (item) =>
        item.id !== record.id &&
        item.expenseIds.some((id) => record.expenseIds.includes(id))
    )
  )
    return "Un gasto ya está relacionado con otra rendición de este escenario. Revisá su referencia antes de duplicarlo."
  if (record.refundId) {
    const refund = state.movements.find(
      (item) =>
        item.id === record.refundId &&
        item.nature === "Devolución de anticipo" &&
        item.currency === advance.currency
    )
    const applied = sumAmounts(
      state.renditions
        .filter(
          (item) => item.id !== record.id && item.refundId === record.refundId
        )
        .map((item) => item.refundAmount)
    )
    if (
      !refund ||
      !validAmount(record.refundAmount) ||
      cents(record.refundAmount) + cents(applied) > cents(refund.amount)
    )
      return "Revisá la devolución y el importe disponible; debe tener la misma moneda."
  } else if (record.refundAmount !== 0)
    return "Seleccioná la referencia de devolución o quitá su importe."
  return ""
}
/** One population for charts and their explanatory records, no external writes. */
export function projectAdministrativeFinancialRecords(
  state: AdministrativeLedger,
  vouchers: VoucherState = loadVouchers()
): FinancialRecord[] {
  return [
    ...voucherFinancialRecords(vouchers),
    ...state.expenses.map(
      (item): FinancialRecord => ({
        id: item.id,
        reference: item.reference,
        type: "expense",
        clientId: item.clientId ?? "",
        partyId: item.partyId,
        date: item.date,
        currency: item.currency,
        amount: item.amount,
        operationId: item.operationIds[0],
        operationIds: item.operationIds,
        category:
          state.categories.find((category) => category.id === item.categoryId)
            ?.name ?? item.categoryAtEntry,
        categoryId: item.categoryId,
        description: item.description,
        source: item.source,
      })
    ),
    ...state.movements
      .filter((item) => item.nature === "Cobro")
      .map(
        (item): FinancialRecord => ({
          id: item.id,
          reference: item.reference,
          type: "receipt",
          clientId: item.partyId,
          partyId: item.partyId,
          date: item.date,
          currency: item.currency,
          amount: item.amount,
          operationId: item.operationIds[0],
          operationIds: item.operationIds,
          source: item.source,
        })
      ),
  ]
}
