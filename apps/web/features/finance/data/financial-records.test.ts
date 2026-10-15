import { expect, it } from "vitest"
import { demonstrationClients } from "@/features/clients/data/clients"
import { getDemonstrationOperationProgress } from "@/features/operations/data/operation-progress"
import {
  buckets,
  filterFinancialRecords,
  financialRecords,
  FINANCIAL_CUTOFF,
} from "./financial-records"

it("keeps synthetic identifiers, clients and operation states consistent", () => {
  expect(new Set(financialRecords.map((r) => r.id)).size).toBe(
    financialRecords.length
  )
  for (const record of financialRecords) {
    expect(demonstrationClients.some((c) => c.id === record.clientId)).toBe(
      true
    )
    expect(record.date <= FINANCIAL_CUTOFF).toBe(true)
    if (record.operationId && record.type === "invoice")
      expect(
        getDemonstrationOperationProgress(record.operationId).billing
      ).toBe("Facturada")
    if (record.operationId && record.type === "receipt")
      expect(
        getDemonstrationOperationProgress(record.operationId).collection
      ).toBe("Registrada en fixture")
  }
})
it("aggregates only the same filtered records, without mixing currencies", () => {
  for (const currency of ["ARS", "USD"] as const) {
    const invoices = filterFinancialRecords({
      currency,
      from: "2026-05-01",
      to: FINANCIAL_CUTOFF,
      clientId: "",
    }).filter((r) => r.type === "invoice")
    for (const dimension of ["month", "client"] as const) {
      const groups = buckets(invoices, dimension)
      expect(groups.reduce((sum, b) => sum + b.value, 0)).toBe(
        invoices.reduce((sum, r) => sum + r.amount, 0)
      )
      for (const group of groups)
        expect(group.value).toBe(
          invoices
            .filter((r) => group.ids.includes(r.id))
            .reduce((sum, r) => sum + r.amount, 0)
        )
    }
    expect(invoices.every((r) => r.currency === currency)).toBe(true)
  }
})
it("does not derive receivables from billing minus receipts or missing balances", () => {
  const invoices = financialRecords.filter(
    (r) => r.type === "invoice" && r.currency === "ARS"
  )
  const groups = buckets(invoices, "due")
  expect(groups.flatMap((b) => b.ids)).not.toContain("invoice-missing")
  expect(groups.reduce((sum, b) => sum + b.value, 0)).toBe(
    invoices.reduce((sum, r) => sum + (r.openBalance ?? 0), 0)
  )
})
