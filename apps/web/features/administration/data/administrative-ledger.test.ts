import { afterEach, expect, it } from "vitest"
import {
  initialAdministrativeLedger,
  validateExpense,
  validateMovement,
  validateRendition,
  renditionSummary,
  projectAdministrativeFinancialRecords,
  saveAdministrativeLedger,
  nextAdministrativeReference,
  sumAmounts,
} from "./administrative-ledger"
import {
  buckets,
  filterFinancialRecords,
  money,
} from "@/features/finance/data/financial-records"
import { projectWorkItems } from "@/features/work/data/work-items"
afterEach(() => saveAdministrativeLedger(initialAdministrativeLedger))
it("keeps general expenses independent of operations and rejects a customer's foreign seller as ABT supplier", () => {
  const state = structuredClone(initialAdministrativeLedger)
  const expense = state.expenses.at(-1)!
  expect(expense.operationIds).toEqual([])
  expect(validateExpense(expense, state)).toBe("")
  expect(
    validateExpense({ ...expense, partyId: "org-demo-003" }, state)
  ).toContain("proveedor contratado")
  expect(validateExpense({ ...expense, amount: -1 }, state)).toContain(
    "positivo"
  )
  expect(validateExpense({ ...expense, amount: 0.001 }, state)).toContain(
    "decimales"
  )
  expect(
    validateExpense({ ...expense, operationIds: ["op-does-not-exist"] }, state)
  ).toContain("referencia")
})
it("inactivation preserves historic classification but prevents new uses", () => {
  const state = structuredClone(initialAdministrativeLedger)
  const expense = state.expenses.at(-1)!
  state.categories = state.categories.map((item) =>
    item.id === expense.categoryId
      ? { ...item, active: false, name: "Nombre actualizado" }
      : item
  )
  expect(validateExpense(expense, state)).toBe("")
  expect(
    validateExpense({ ...expense, id: "expense-demo-new" }, state)
  ).toContain("categoría")
  expect(expense.categoryAtEntry).toBe("Gastos generales")
  expect(
    projectAdministrativeFinancialRecords(state).find(
      (item) => item.id === expense.id
    )?.category
  ).toBe("Nombre actualizado")
})
it("uses the exact mutable records for category charts, receipts and explanations without merging currencies", () => {
  const state = structuredClone(initialAdministrativeLedger)
  const expense = state.expenses.at(-1)!
  state.expenses.push(
    { ...expense, id: "expense-demo-extra", amount: 0.1 },
    { ...expense, id: "expense-demo-extra-2", amount: 0.2 }
  )
  const records = filterFinancialRecords(
    { currency: "ARS", from: "2026-10-01", to: "2026-10-14", clientId: "" },
    projectAdministrativeFinancialRecords(state)
  ).filter((item) => item.type === "expense")
  const groups = buckets(records, "category")
  expect(groups.find((item) => item.label === "Gastos generales")?.value).toBe(
    5000.3
  )
  expect(sumAmounts([0.1, 0.2])).toBe(0.3)
  expect(money(123.45, "ARS")).toContain("123,45")
  expect(
    nextAdministrativeReference(
      "GAS-LOCAL-",
      state.expenses.map((item) => item.reference)
    )
  ).toBe("GAS-LOCAL-002")
  expect(records.every((item) => item.currency === "ARS")).toBe(true)
})
it("prevents overapplication of advances, duplicate expenses and cross-currency renditions, without inventing a settlement", () => {
  const state = structuredClone(initialAdministrativeLedger)
  const record = state.renditions[0]!
  expect(validateRendition(record, state)).toBe("")
  expect(renditionSummary(record, state)).toMatchObject({
    missing: 1,
    difference: 10000,
    status: "Con evidencias pendientes",
  })
  expect(
    validateRendition(
      { ...record, id: "rendition-new", expenseIds: [], advanceAmount: 1 },
      state
    )
  ).toContain("disponible")
  const partial = { ...record, advanceAmount: 5000 }
  state.renditions = [partial]
  expect(
    validateRendition(
      { ...record, id: "rendition-new", advanceAmount: 1000 },
      state
    )
  ).toContain("otra rendición")
  expect(
    validateRendition(
      {
        ...record,
        id: "rendition-new",
        advanceAmount: 1000,
        expenseIds: ["expense-0-1"],
      },
      state
    )
  ).toContain("moneda")
  expect(
    validateMovement({ ...state.movements.at(-1)!, amount: 4000 }, state)
  ).toContain("rendiciones")
})
it("completing a local evidence reference updates rendition and work projections, not external accounting", () => {
  const state = structuredClone(initialAdministrativeLedger)
  state.expenses = state.expenses.map((item) =>
    item.id === "expense-demo-general-01"
      ? { ...item, evidence: "Referencia sintética completada" }
      : item
  )
  saveAdministrativeLedger(state)
  expect(renditionSummary(state.renditions[0]!, state).status).toBe(
    "Preparada para revisión"
  )
  expect(
    projectWorkItems([]).some((item) => item.id === "wrk-admin-no-operation-05")
  ).toBe(false)
  expect(state.expenses.at(-1)?.externalReference).toBe("")
})
