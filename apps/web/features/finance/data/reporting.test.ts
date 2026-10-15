import { describe, expect, it } from "vitest"
import { getScenario } from "@/features/demo/data/scenarios"
import {
  initialAdministrativeLedger,
  projectAdministrativeFinancialRecords,
} from "@/features/administration/data/administrative-ledger"
import { initialVoucherState } from "@/features/administration/data/vouchers"
import { initialOrganizations } from "@/features/organizations/data/organizations"
import { demonstrationOperations } from "@/features/operations/data/operations"
import {
  initialRateBook,
  reviseManagementRate,
  valueInUsd,
  valuationTotal,
} from "@/features/finance/data/management-rates"
import {
  billingSeries,
  eventBuckets,
  reportObligations,
  reportParties,
  selectExecutiveReport,
  type ReportInput,
} from "./reporting"

const input: ReportInput = {
  ledger: initialAdministrativeLedger,
  vouchers: initialVoucherState,
  organizations: initialOrganizations,
  operations: demonstrationOperations,
  book: initialRateBook,
  scenario: getScenario("direction"),
}
const october = { from: "2026-10-01", to: "2026-10-14" }
describe("shared executive reporting", () => {
  it("uses identical source records and micro-USD amounts in indicators, client rows and monthly/category charts", () => {
    const report = selectExecutiveReport(input, october)
    const originals = projectAdministrativeFinancialRecords(
      input.ledger,
      input.vouchers
    ).filter(
      (record) =>
        record.type === "invoice" &&
        record.date >= october.from &&
        record.date <= october.to
    )
    expect(
      report.events
        .filter((event) => event.metric === "invoice")
        .map((event) => event.id)
    ).toEqual(originals.map((record) => record.id))
    const expected = valuationTotal(
      originals.map((record) => ({
        valuation: valueInUsd(
          record.amount,
          record.currency,
          record.date,
          initialRateBook
        ),
      }))
    )
    expect(report.totals.invoice).toEqual(expected)
    expect(
      reportParties(input, october, "client").reduce(
        (sum, row) => sum + row.metrics.invoice!.usd!,
        0
      )
    ).toBeCloseTo(expected.usd!, 6)
    expect(billingSeries(report.events)[0]!.invoice).toBe(expected.usd)
    expect(
      eventBuckets(
        report.events.filter((event) => event.metric === "invoice"),
        "client",
        input.organizations
      ).reduce((sum, group) => sum + group.value, 0)
    ).toBeCloseTo(expected.usd!, 6)
  })
  it("reflects a newly recorded expense without changing its original or registering a payment", () => {
    const ledger = structuredClone(input.ledger)
    ledger.expenses.push({
      ...ledger.expenses[0]!,
      id: "expense-new",
      reference: "GAS-LOCAL-999",
      date: "2026-10-14",
      amount: 1325,
      currency: "ARS",
    })
    const before = selectExecutiveReport(input, october)
    const after = selectExecutiveReport({ ...input, ledger }, october)
    expect(
      after.totals.expense!.usd! - before.totals.expense!.usd!
    ).toBeCloseTo(1, 6)
    expect(after.totals.payment).toEqual(before.totals.payment)
    expect(
      after.events.find((event) => event.id === "expense-new")
    ).toMatchObject({ amount: 1325, currency: "ARS", valuation: { usd: 1 } })
    expect(
      input.ledger.expenses.some((expense) => expense.id === "expense-new")
    ).toBe(false)
  })
  it("values older obligations at the cut, honors applications and keeps unknown balances pending", () => {
    const august = reportObligations(input, {
      from: "2026-08-01",
      to: "2026-08-25",
    }).find((row) => row.id === "purchase-demo-01")!
    expect(august.balance).toBe(50000)
    expect(august.valuation?.rate?.effectiveOn).toBe("2026-08-01")
    const current = selectExecutiveReport(input, october)
    const purchase = current.obligations.find(
      (row) => row.id === "purchase-demo-01"
    )!
    expect(purchase.balance).toBe(30000)
    expect(purchase.valuation?.rate?.effectiveOn).toBe("2026-10-01")
    expect(current.receivables?.complete).toBe(false)
    expect(
      current.obligations.some(
        (row) => row.balance === undefined && row.valuation === undefined
      )
    ).toBe(true)
    expect(current.obligations.some((row) => row.issuedOn < october.from)).toBe(
      true
    )
  })
  it("distinguishes supplier purchases, expenses and payments and never turns an operational role into debt", () => {
    const row = reportParties(input, october, "abt-supplier").find(
      (item) => item.organization.id === "org-demo-002"
    )!
    expect(row.metrics.purchase!.usd!).toBeGreaterThan(0)
    expect(row.metrics.payment!.usd).toBe(0)
    const september = reportParties(
      input,
      { from: "2026-09-01", to: "2026-09-30" },
      "abt-supplier"
    ).find((item) => item.organization.id === "org-demo-001")!
    expect(september.metrics.payment!.usd!).toBeGreaterThan(0)
    expect(
      reportParties(input, october, "abt-supplier").some(
        (item) => item.organization.id === "org-demo-003"
      )
    ).toBe(false)
    const linked = {
      ...input,
      operations: input.operations.map((operation) => ({
        ...operation,
        participantIds: ["org-demo-003"],
      })),
    }
    expect(reportObligations(linked, october)).toEqual(
      reportObligations(input, october)
    )
  })
  it("applies period, client and verified operation type together and counts opening rather than update events", () => {
    const report = selectExecutiveReport(input, {
      ...october,
      clientId: "client-demo-norte",
      kind: "Importación",
    })
    expect(report.operations.map((operation) => operation.id)).toEqual([
      "op-demo-2048",
    ])
    expect(
      report.events.every((event) =>
        event.operationIds.includes("op-demo-2048")
      )
    ).toBe(true)
    const september = selectExecutiveReport(input, {
      from: "2026-09-01",
      to: "2026-09-30",
    })
    expect(
      september.operations.some((operation) => operation.id === "op-demo-2054")
    ).toBe(true)
    expect(
      selectExecutiveReport(input, october).operations.some(
        (operation) => operation.id === "op-demo-2054"
      )
    ).toBe(false)
  })
  it("propagates a rate correction only in its interval and does not render a missing conversion as a zero chart", () => {
    const rate = input.book.rates.at(-1)!
    const revised = {
      ...input,
      book: reviseManagementRate(input.book, {
        ...rate,
        arsPerUsd: rate.arsPerUsd * 2,
      }),
    }
    const old = selectExecutiveReport(input, october),
      next = selectExecutiveReport(revised, october)
    for (const event of old.events.filter((event) => event.currency === "ARS"))
      expect(
        Math.abs(
          next.events.find((row) => row.id === event.id)!.valuation!.usdMicros *
            2 -
            event.valuation!.usdMicros
        )
      ).toBeLessThanOrEqual(1)
    expect(
      selectExecutiveReport(revised, { from: "2026-09-01", to: "2026-09-30" })
        .totals
    ).toEqual(
      selectExecutiveReport(input, { from: "2026-09-01", to: "2026-09-30" })
        .totals
    )
    const missing = selectExecutiveReport(
      {
        ...input,
        book: reviseManagementRate(input.book, { ...rate, valid: false }),
      },
      october
    )
    expect(missing.totals.invoice?.complete).toBe(false)
    expect(billingSeries(missing.events)[0]!.invoice).toBeNull()
    expect(
      eventBuckets(
        missing.events.filter((event) => event.metric === "invoice"),
        "month",
        input.organizations
      )
    ).toEqual([])
  })
  it("removes restricted financial populations, metrics and counts before any presentation", () => {
    const operational = { ...input, scenario: getScenario("operations") }
    expect(selectExecutiveReport(operational, october)).toMatchObject({
      events: [],
      obligations: [],
      totals: {},
    })
    expect(
      selectExecutiveReport(operational, october).receivables
    ).toBeUndefined()
    expect(reportParties(operational, october, "abt-supplier")).toEqual([])
    const partial = {
      ...input,
      scenario: {
        ...getScenario("direction"),
        capabilities: [
          "management.read",
          "finance.billing",
        ] as ReportInput["scenario"]["capabilities"],
      },
    }
    expect(
      selectExecutiveReport(partial, october).events.every(
        (event) => event.metric === "invoice"
      )
    ).toBe(true)
    expect(selectExecutiveReport(partial, october).payables).toBeUndefined()
    expect(selectExecutiveReport(partial, october).operations).toEqual([])
    const external = {
      ...input,
      scenario: {
        ...getScenario("client"),
        capabilities: input.scenario.capabilities,
      },
    }
    expect(selectExecutiveReport(external, october)).toMatchObject({
      events: [],
      obligations: [],
      operations: [],
      totals: {},
    })
    expect(reportParties(external, october, "client")).toEqual([])
  })
  it("keeps invalid periods and incomplete history distinguishable from a confirmed zero", () => {
    const invalid = selectExecutiveReport(input, {
      from: "2026-02-30",
      to: "2026-10-14",
    })
    expect(invalid.error).toMatch(/inválida/)
    expect(invalid.totals).toEqual({})
    expect(invalid.receivables).toBeUndefined()
    expect(
      selectExecutiveReport(input, { from: "2025-01-01", to: "2025-10-14" })
        .completeHistory
    ).toBe(false)
    expect(
      selectExecutiveReport(input, { from: "2026-10-10", to: "2026-10-01" })
        .error
    ).toMatch(/anterior o igual/)
  })
})
