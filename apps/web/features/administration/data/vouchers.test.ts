import { afterEach, expect, it } from "vitest"
import {
  initialVoucherState,
  portfolio,
  voucherBalance,
  originAvailable,
  validateApplication,
  validateVoucher,
  saveVouchers,
  voucherFinancialRecords,
  type VoucherApplication,
} from "./vouchers"
import {
  initialAdministrativeLedger,
  validateMovement,
} from "./administrative-ledger"
afterEach(() => saveVouchers(initialVoucherState))
it("explains every known seeded balance from the same synthetic movements, without interpreting unknown as zero", () => {
  for (const item of initialVoucherState.documents.filter(
    (item) => item.reportedBalance !== undefined
  ))
    expect(voucherBalance(item, initialVoucherState)).toBe(item.reportedBalance)
  expect(
    voucherBalance(
      initialVoucherState.documents.find(
        (item) => item.id === "invoice-missing"
      )!,
      initialVoucherState
    )
  ).toBeUndefined()
  for (const app of initialVoucherState.applications.filter(
    (item) => item.origin === "movement"
  ))
    expect(
      initialAdministrativeLedger.movements.some(
        (item) => item.id === app.originId
      )
    ).toBe(true)
})
it("includes older open payables at cut and reconstructs before a partial payment", () => {
  const rows = portfolio(initialVoucherState, "Pagar", "2026-10-14", "ARS")
  expect(
    rows.find((item) => item.document.id === "purchase-demo-01")?.balance
  ).toBe(30000)
  const before = portfolio(initialVoucherState, "Pagar", "2026-08-31", "ARS")
  expect(
    before.find((item) => item.document.id === "purchase-demo-01")?.balance
  ).toBe(50000)
  expect(portfolio(initialVoucherState, "Pagar", "2026-08-19", "ARS")).toEqual(
    []
  )
  expect(portfolio(initialVoucherState, "Pagar", "invalid", "ARS")).toEqual([])
})
it("supports partial credits/funds many-to-many and rejects mismatched counterparties, currency and excess", () => {
  const state = structuredClone(initialVoucherState)
  const app: VoucherApplication = {
    id: "application-new",
    voucherId: "invoice-operation-3107",
    origin: "credit",
    originId: "credit-demo-01",
    amount: 1000.25,
    date: "2026-10-14",
    local: true,
  }
  expect(validateApplication(app, state, initialAdministrativeLedger)).toBe("")
  state.applications.push(app)
  expect(
    voucherBalance(
      state.documents.find((item) => item.id === app.voucherId)!,
      state
    )
  ).toBe(273999.75)
  expect(
    originAvailable("credit", app.originId, state, initialAdministrativeLedger)
  ).toBe(1999.75)
  expect(
    validateApplication(
      { ...app, amount: 2000 },
      state,
      initialAdministrativeLedger
    )
  ).toContain("supera")
  expect(
    validateApplication(
      { ...app, voucherId: "invoice-operation-3133" },
      state,
      initialAdministrativeLedger
    )
  ).toContain("contraparte")
  expect(
    validateApplication(
      { ...app, date: "2026-10-09" },
      state,
      initialAdministrativeLedger
    )
  ).toContain("posterior")
  expect(
    voucherBalance(
      state.documents.find((item) => item.id === app.voucherId)!,
      state,
      "2026-10-13"
    )
  ).toBe(275000)
})
it("keeps drafts out of billing and portfolios, and rejects a foreign seller as a payable", () => {
  const state = structuredClone(initialVoucherState),
    document = {
      ...state.documents[0]!,
      id: "voucher-new",
      stage: "Preparado" as const,
      reference: "NEW",
      partyId: "org-demo-003",
      side: "Pagar" as const,
    }
  expect(validateVoucher(document, state)).toContain("proveedor contratado")
  state.documents.push({ ...document, partyId: "org-demo-001" })
  expect(
    portfolio(state, "Pagar", "2026-10-14", "ARS").some(
      (item) => item.document.id === document.id
    )
  ).toBe(false)
  expect(
    voucherFinancialRecords(state).some((item) => item.id === document.id)
  ).toBe(false)
})
it("protects applied references when editing movements or documents", () => {
  const document = initialVoucherState.documents.find(
    (item) => item.id === "purchase-demo-01"
  )!
  expect(
    validateVoucher({ ...document, amount: 1 }, initialVoucherState)
  ).toContain("aplicaciones")
  const movement = initialAdministrativeLedger.movements.find(
    (item) => item.id === "payment-demo-01"
  )!
  expect(
    validateMovement({ ...movement, amount: 1 }, initialAdministrativeLedger)
  ).toContain("aplicaciones")
})
