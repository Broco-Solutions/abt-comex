import { describe, expect, it } from "vitest"
import { getScenario } from "@/features/demo/data/scenarios"
import { initialAdministrativeLedger } from "@/features/administration/data/administrative-ledger"
import { initialVoucherState } from "@/features/administration/data/vouchers"
import { initialOrganizations } from "@/features/organizations/data/organizations"
import { demonstrationOperations } from "@/features/operations/data/operations"
import {
  initialRateBook,
  reviseManagementRate,
  valuationTotal,
} from "@/features/finance/data/management-rates"
import {
  selectExecutiveReport,
  type ReportInput,
} from "@/features/finance/data/reporting"
import {
  answerDirectionQuestion as answer,
  directionQueryCatalog,
  recognizeDirectionIntent,
} from "./direction-queries"
const input: ReportInput = {
  ledger: initialAdministrativeLedger,
  vouchers: initialVoucherState,
  organizations: initialOrganizations,
  operations: demonstrationOperations,
  book: initialRateBook,
  scenario: getScenario("direction"),
}
const context = {
  from: "2026-10-01",
  to: "2026-10-14",
  clientId: "client-demo-norte",
}
describe("closed local Direction queries", () => {
  it("recognizes all seven examples and equivalent questions", () => {
    for (const [key, value] of Object.entries(directionQueryCatalog))
      expect(recognizeDirectionIntent(value.example)).toBe(key)
    expect(recognizeDirectionIntent("Total de facturas del período")).toBe(
      "billing"
    )
    expect(
      recognizeDirectionIntent(
        "Cantidad de operaciones del cliente seleccionado"
      )
    ).toBe("operations")
    expect(
      recognizeDirectionIntent("¿Cuánto se cobró de Cliente Demo Norte?")
    ).toBe("receipts")
  })
  it("answers from the exact shared financial population, preserving originals and all ranking rows", () => {
    const result = answer(directionQueryCatalog.ranking.example, input, {
      ...context,
      clientId: "",
    })
    const report = selectExecutiveReport(input, { ...context, clientId: "" })
    expect(result.status).toBe("ok")
    expect(result.events).toEqual(
      report.events.filter((row) => row.metric === "invoice")
    )
    expect(valuationTotal(result.events!).usd).toBe(report.totals.invoice?.usd)
    expect(result.ranking!.flatMap((row) => row.ids).sort()).toEqual(
      result.events!.map((row) => row.id).sort()
    )
    expect(result.events!.some((row) => row.currency === "ARS")).toBe(true)
    expect(result.events!.some((row) => row.currency === "USD")).toBe(true)
  })
  it("resolves this month against fixture cut, explicit dates and a named client", () => {
    const result = answer(
      "¿Cuánto se facturó a Cliente Demo Norte este mes?",
      input,
      { from: "2026-05-01", to: "2026-08-30" }
    )
    expect(result.context).toMatchObject(context)
    expect(
      result.events!.every(
        (row) =>
          row.partyId === context.clientId && row.date.startsWith("2026-10")
      )
    ).toBe(true)
    expect(
      answer("Cuánto facturamos entre 01/09/2026 y 30/09/2026", input, context)
        .context
    ).toMatchObject({ from: "2026-09-01", to: "2026-09-30" })
    expect(
      answer("Cuánto facturamos entre 31/02/2026 y 14/10/2026", input, context)
        .status
    ).toBe("invalid-date")
    expect(
      answer("Cuánto facturamos entre 01/10/2026", input, context).status
    ).toBe("invalid-date")
  })
  it("supports explicit named months and rejects temporal or analytical requests outside the catalog", () => {
    expect(
      answer(
        "Cuánto se facturó a Cliente Demo Norte en septiembre de 2026",
        input,
        context
      ).context
    ).toMatchObject({ from: "2026-09-01", to: "2026-09-30" })
    expect(answer("Cuánto facturamos ayer", input, context).status).toBe(
      "invalid-date"
    )
    expect(
      answer("Cuánto facturamos entre 2026-09-01 y 2026-09-30", input, context)
        .status
    ).toBe("invalid-date")
    expect(
      answer("Cuánto es el promedio facturado", input, context).status
    ).toBe("unsupported")
  })
  it("keeps receipt events distinct and operations unfiltered by event period", () => {
    const receipts = answer(
      directionQueryCatalog.receipts.example,
      input,
      context
    )
    expect(
      receipts.events!.every(
        (row) =>
          row.metric === "receipt" && row.clientIds.includes(context.clientId)
      )
    ).toBe(true)
    const ops = answer(directionQueryCatalog.operations.example, input, {
      ...context,
      from: "2026-10-14",
    })
    expect(ops.operations).toEqual(
      input.operations.filter((row) => row.clientId === context.clientId)
    )
    expect(ops.message).toContain("No se aplicó un filtro temporal")
    const expenses = answer(
      directionQueryCatalog.expenses.example,
      input,
      context
    )
    expect(expenses.events!.every((row) => row.metric === "expense")).toBe(true)
  })
  it("asks actionable clarifications and never silently substitutes an unknown or ambiguous client", () => {
    expect(answer("¿Cuántos ingresos hubo?", input, context)).toMatchObject({
      status: "clarification",
      options: expect.any(Array),
    })
    expect(answer("Principales clientes", input, context).status).toBe(
      "clarification"
    )
    expect(
      answer("Cuánto se facturó a Demo en este período", input, context).status
    ).toBe("ambiguous-client")
    expect(
      answer("Cuánto se facturó a Inexistente en este período", input, context)
        .status
    ).toBe("incomplete")
    expect(
      answer("Cuál es la rentabilidad del negocio", input, context).status
    ).toBe("unsupported")
  })
  it("abstains for missing event rates, incomplete balances, empty periods and unavailable history", () => {
    const rate = input.book.rates.at(-1)!
    const missing = {
      ...input,
      book: reviseManagementRate(input.book, { ...rate, valid: false }),
    }
    expect(
      answer(directionQueryCatalog.billing.example, missing, context).status
    ).toBe("missing-rate")
    const incomplete = {
      ...input,
      vouchers: {
        ...input.vouchers,
        documents: input.vouchers.documents.map((row) =>
          row.partyId === context.clientId && row.kind === "Factura"
            ? { ...row, historyComplete: false, reportedBalance: undefined }
            : row
        ),
      },
    }
    const all = answer(
      directionQueryCatalog.balance.example,
      incomplete,
      context
    )
    expect(all.status).toBe("incomplete")
    expect(all.message).not.toMatch(/USD\s*\d/)
    expect(
      answer(directionQueryCatalog.billing.example, input, {
        ...context,
        from: "2026-05-01",
        to: "2026-05-01",
      }).status
    ).toBe("empty")
    expect(
      answer(directionQueryCatalog.billing.example, input, {
        ...context,
        from: "2025-01-01",
      }).status
    ).toBe("incomplete")
  })
  it("uses balance-cut rates rather than invoice-event rates and never infers balances from flows", () => {
    const clean = {
      ...input,
      vouchers: {
        ...input.vouchers,
        documents: input.vouchers.documents.filter(
          (row) => row.historyComplete
        ),
      },
    }
    const result = answer(directionQueryCatalog.balance.example, clean, context)
    expect(result.status).toBe("ok")
    expect(
      result.obligations!.every((row) => row.valuation?.valuedOn === context.to)
    ).toBe(true)
    expect(
      result
        .obligations!.filter((row) => row.currency === "ARS")
        .every((row) => row.valuation?.rate?.effectiveOn === "2026-10-01")
    ).toBe(true)
    expect(result.events).toBeUndefined()
  })
  it("denies before recognition, names, amounts, counts, suggestions or links; distinguishes read failure", () => {
    for (const id of ["operations", "client", "administration"]) {
      const result = answer(
        directionQueryCatalog.ranking.example,
        { ...input, scenario: getScenario(id) },
        context
      )
      expect(result.status).toBe("forbidden")
      expect(Object.keys(result).sort()).toEqual(["message", "status"])
    }
    const noBilling = {
      ...input,
      scenario: {
        ...input.scenario,
        capabilities: [
          "management.read",
        ] as ReportInput["scenario"]["capabilities"],
      },
    }
    expect(
      answer(directionQueryCatalog.billing.example, noBilling, context).status
    ).toBe("forbidden")
    expect(
      answer(directionQueryCatalog.billing.example, input, context, true).status
    ).toBe("read-error")
  })
})
